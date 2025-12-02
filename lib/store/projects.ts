'use client'

import { Project, DEFAULT_THEME, TargetPlatform, CapsuleInstance } from './types'

const STORAGE_KEY = 'hublab_projects'

function generateId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getProject(id: string): Project | null {
  const projects = getProjects()
  return projects.find(p => p.id === id) || null
}

export function createProject(data: {
  name: string
  description?: string
  targets?: TargetPlatform[]
  capsules?: CapsuleInstance[]
}): Project {
  const project: Project = {
    id: generateId(),
    name: data.name,
    description: data.description || '',
    capsules: data.capsules || [],
    theme: DEFAULT_THEME,
    targets: data.targets || ['web'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const projects = getProjects()
  projects.push(project)
  saveProjects(projects)

  return project
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const projects = getProjects()
  const index = projects.findIndex(p => p.id === id)

  if (index === -1) return null

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  saveProjects(projects)
  return projects[index]
}

export function deleteProject(id: string): boolean {
  const projects = getProjects()
  const filtered = projects.filter(p => p.id !== id)

  if (filtered.length === projects.length) return false

  saveProjects(filtered)
  return true
}

export function duplicateProject(id: string): Project | null {
  const project = getProject(id)
  if (!project) return null

  const newProject: Project = {
    ...project,
    id: generateId(),
    name: `${project.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const projects = getProjects()
  projects.push(newProject)
  saveProjects(projects)

  return newProject
}

function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

// Export project as JSON
export function exportProjectAsJSON(project: Project): string {
  return JSON.stringify(project, null, 2)
}

// Import project from JSON
export function importProjectFromJSON(json: string): Project | null {
  try {
    const data = JSON.parse(json)
    const project: Project = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const projects = getProjects()
    projects.push(project)
    saveProjects(projects)

    return project
  } catch {
    return null
  }
}
