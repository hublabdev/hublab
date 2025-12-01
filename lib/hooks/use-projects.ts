'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Project, CreateProjectRequest } from '../../types/api'

// In-memory store for demo (would use real API in production)
let projectsStore: Project[] = [
  {
    id: 'proj_1',
    userId: 'user_1',
    name: 'E-Commerce Pro',
    description: 'Tienda online completa con carrito, pagos y gestión de pedidos',
    template: 'ecommerce',
    theme: {
      name: 'Modern Blue',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        foreground: '#0f172a',
      },
      typography: { fontFamily: 'Inter' },
      spacing: 'normal',
      borderRadius: 'md',
    },
    capsules: [
      { id: 'cap_1', type: 'navigation', category: 'navigation', props: { tabs: 4 } },
      { id: 'cap_2', type: 'auth-screen', category: 'auth', props: { providers: ['email', 'google'] } },
      { id: 'cap_3', type: 'list', category: 'data-display', props: { layout: 'grid' } },
      { id: 'cap_4', type: 'card', category: 'layout', props: { variant: 'elevated' } },
    ],
    integrations: [],
    status: 'ready',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: 'proj_2',
    userId: 'user_1',
    name: 'Admin Dashboard',
    description: 'Panel de administración con gráficos, tablas y reportes',
    template: 'admin',
    theme: {
      name: 'Dark Purple',
      colors: {
        primary: '#a855f7',
        secondary: '#ec4899',
        accent: '#f59e0b',
        background: '#0f172a',
        foreground: '#f8fafc',
      },
      typography: { fontFamily: 'Inter' },
      spacing: 'normal',
      borderRadius: 'lg',
    },
    capsules: [
      { id: 'cap_5', type: 'chart', category: 'charts', props: { chartType: 'line' } },
      { id: 'cap_6', type: 'data-table', category: 'data-display', props: { sortable: true } },
      { id: 'cap_7', type: 'tabs', category: 'navigation', props: { variant: 'pills' } },
    ],
    integrations: [],
    status: 'deployed',
    deployUrl: 'https://admin.example.com',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-19T12:00:00Z',
  },
  {
    id: 'proj_3',
    userId: 'user_1',
    name: 'Social App',
    description: 'Red social con feed, perfiles, chat y notificaciones',
    template: 'blank',
    theme: {
      name: 'Modern Blue',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        foreground: '#0f172a',
      },
      typography: { fontFamily: 'Inter' },
      spacing: 'normal',
      borderRadius: 'md',
    },
    capsules: [
      { id: 'cap_8', type: 'chat', category: 'data-management', props: {} },
      { id: 'cap_9', type: 'avatar', category: 'layout', props: { size: 'lg' } },
      { id: 'cap_10', type: 'notifications', category: 'device', props: {} },
    ],
    integrations: [],
    status: 'building',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
  },
]

let projectIdCounter = 4

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      setProjects([...projectsStore])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(async (data: CreateProjectRequest): Promise<Project> => {
    const newProject: Project = {
      id: `proj_${projectIdCounter++}`,
      userId: 'user_1',
      name: data.name,
      description: data.description,
      template: data.template,
      theme: typeof data.theme === 'string' ? {
        name: data.theme,
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          background: '#ffffff',
          foreground: '#0f172a',
        },
        typography: { fontFamily: 'Inter' },
        spacing: 'normal',
        borderRadius: 'md',
      } : data.theme || {
        name: 'Modern Blue',
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          background: '#ffffff',
          foreground: '#0f172a',
        },
        typography: { fontFamily: 'Inter' },
        spacing: 'normal',
        borderRadius: 'md',
      },
      capsules: [],
      integrations: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    projectsStore = [...projectsStore, newProject]
    setProjects([...projectsStore])
    return newProject
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<Project> => {
    const index = projectsStore.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')

    const updated = {
      ...projectsStore[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    projectsStore[index] = updated
    setProjects([...projectsStore])
    return updated
  }, [])

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    projectsStore = projectsStore.filter(p => p.id !== id)
    setProjects([...projectsStore])
  }, [])

  const getProject = useCallback((id: string): Project | undefined => {
    return projectsStore.find(p => p.id === id)
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
  }
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      setError(null)
      try {
        await new Promise(resolve => setTimeout(resolve, 200))
        const found = projectsStore.find(p => p.id === id)
        if (!found) throw new Error('Project not found')
        setProject(found)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch project')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProject()
  }, [id])

  const updateProject = useCallback(async (data: Partial<Project>): Promise<Project> => {
    const index = projectsStore.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')

    const updated = {
      ...projectsStore[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    projectsStore[index] = updated
    setProject(updated)
    return updated
  }, [id])

  const addCapsule = useCallback(async (capsule: { type: string; props: Record<string, any> }) => {
    const index = projectsStore.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')

    const newCapsule = {
      id: `cap_${Date.now()}`,
      type: capsule.type,
      category: 'layout' as const,
      props: capsule.props,
    }

    projectsStore[index].capsules.push(newCapsule)
    projectsStore[index].updatedAt = new Date().toISOString()
    setProject({ ...projectsStore[index] })
    return newCapsule
  }, [id])

  const removeCapsule = useCallback(async (capsuleId: string) => {
    const index = projectsStore.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')

    projectsStore[index].capsules = projectsStore[index].capsules.filter(c => c.id !== capsuleId)
    projectsStore[index].updatedAt = new Date().toISOString()
    setProject({ ...projectsStore[index] })
  }, [id])

  return {
    project,
    loading,
    error,
    updateProject,
    addCapsule,
    removeCapsule,
  }
}
