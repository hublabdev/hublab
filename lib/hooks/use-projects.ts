'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface Project {
  id: string
  name: string
  description?: string
  capsules: any[]
  settings?: Record<string, any>
  is_public?: boolean
  created_at: string
  updated_at: string
}

const LOCAL_STORAGE_KEY = 'hublab_projects'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  // Get user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Load projects when user changes
  useEffect(() => {
    loadProjects()
  }, [user])

  const loadProjects = useCallback(async () => {
    setLoading(true)

    if (user) {
      // Load from Supabase for authenticated users
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })

      if (!error && data) {
        setProjects(data)
      }
    } else {
      // Load from localStorage for anonymous users
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (stored) {
          setProjects(JSON.parse(stored))
        }
      } catch (e) {
        console.error('Failed to load projects from localStorage:', e)
      }
    }

    setLoading(false)
  }, [user])

  const saveProject = useCallback(async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    const now = new Date().toISOString()

    if (user) {
      // Save to Supabase
      if (project.id) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update({
            name: project.name,
            description: project.description,
            capsules: project.capsules,
            settings: project.settings,
            is_public: project.is_public,
          })
          .eq('id', project.id)
          .select()
          .single()

        if (!error && data) {
          setProjects(prev => prev.map(p => p.id === data.id ? data : p))
          return data
        }
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            name: project.name,
            description: project.description,
            capsules: project.capsules,
            settings: project.settings || {},
            is_public: project.is_public || false,
          })
          .select()
          .single()

        if (!error && data) {
          setProjects(prev => [data, ...prev])
          return data
        }
      }
    } else {
      // Save to localStorage
      const newProject: Project = {
        id: project.id || crypto.randomUUID(),
        name: project.name,
        description: project.description,
        capsules: project.capsules,
        settings: project.settings,
        is_public: false,
        created_at: now,
        updated_at: now,
      }

      setProjects(prev => {
        const existing = prev.findIndex(p => p.id === newProject.id)
        let updated: Project[]

        if (existing >= 0) {
          updated = prev.map(p => p.id === newProject.id ? { ...newProject, created_at: p.created_at } : p)
        } else {
          updated = [newProject, ...prev]
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
        return updated
      })

      return newProject
    }

    return null
  }, [user])

  const deleteProject = useCallback(async (id: string) => {
    if (user) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (!error) {
        setProjects(prev => prev.filter(p => p.id !== id))
        return true
      }
    } else {
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== id)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
      return true
    }

    return false
  }, [user])

  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    if (user) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      return error ? null : data
    } else {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const projects = JSON.parse(stored) as Project[]
        return projects.find(p => p.id === id) || null
      }
    }

    return null
  }, [user])

  // Migrate local projects to cloud when user signs in
  const migrateToCloud = useCallback(async () => {
    if (!user) return

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!stored) return

      const localProjects = JSON.parse(stored) as Project[]
      if (localProjects.length === 0) return

      // Insert all local projects to Supabase
      const { error } = await supabase
        .from('projects')
        .insert(
          localProjects.map(p => ({
            user_id: user.id,
            name: p.name,
            description: p.description,
            capsules: p.capsules,
            settings: p.settings || {},
            is_public: false,
          }))
        )

      if (!error) {
        // Clear localStorage after successful migration
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        // Reload projects from Supabase
        await loadProjects()
      }
    } catch (e) {
      console.error('Failed to migrate projects:', e)
    }
  }, [user, loadProjects])

  return {
    projects,
    loading,
    user,
    saveProject,
    deleteProject,
    getProject,
    loadProjects,
    migrateToCloud,
  }
}
