'use client'

import { useState, useEffect, useCallback } from 'react'

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

  // Load projects from localStorage on mount
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        setProjects(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e)
    }
    setLoading(false)
  }, [])

  const saveProject = useCallback(async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    const now = new Date().toISOString()

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
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    return true
  }, [])

  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const projects = JSON.parse(stored) as Project[]
      return projects.find(p => p.id === id) || null
    }
    return null
  }, [])

  return {
    projects,
    loading,
    user: null,
    saveProject,
    deleteProject,
    getProject,
    loadProjects,
    migrateToCloud: async () => {},
  }
}
