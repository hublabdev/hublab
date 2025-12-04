'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { ProjectState, Screen, CapsuleInstance } from './dnd-context'

// Project storage key prefix
const STORAGE_PREFIX = 'hublab_project_'
const PROJECTS_LIST_KEY = 'hublab_projects_list'

export interface SavedProject {
  id: string
  name: string
  updatedAt: string
  createdAt: string
  capsuleCount: number
  screenCount: number
  thumbnail?: string
}

// Get list of all saved projects
export function getProjectsList(): SavedProject[] {
  if (typeof window === 'undefined') return []
  try {
    const list = localStorage.getItem(PROJECTS_LIST_KEY)
    return list ? JSON.parse(list) : []
  } catch {
    return []
  }
}

// Save project list
function saveProjectsList(projects: SavedProject[]) {
  localStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(projects))
}

// Save a project
export function saveProject(project: ProjectState, projectId?: string): string {
  const id = projectId || `project_${Date.now()}`
  const now = new Date().toISOString()

  // Save project data
  localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(project))

  // Update projects list
  const projects = getProjectsList()
  const existingIndex = projects.findIndex(p => p.id === id)
  const capsuleCount = project.screens.reduce((sum, s) => sum + s.capsules.length, 0)

  const projectMeta: SavedProject = {
    id,
    name: project.projectName,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? projects[existingIndex].createdAt : now,
    capsuleCount,
    screenCount: project.screens.length,
  }

  if (existingIndex >= 0) {
    projects[existingIndex] = projectMeta
  } else {
    projects.unshift(projectMeta)
  }

  saveProjectsList(projects)
  return id
}

// Load a project
export function loadProject(projectId: string): ProjectState | null {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${projectId}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Delete a project
export function deleteProject(projectId: string) {
  localStorage.removeItem(`${STORAGE_PREFIX}${projectId}`)
  const projects = getProjectsList().filter(p => p.id !== projectId)
  saveProjectsList(projects)
}

// Export project to JSON file
export function exportProject(project: ProjectState, filename?: string) {
  const json = JSON.stringify(project, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `${project.projectName.toLowerCase().replace(/\s+/g, '-')}.hublab.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Import project from JSON file
export function importProject(file: File): Promise<ProjectState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string) as ProjectState
        if (!project.projectName || !project.screens) {
          throw new Error('Invalid project file')
        }
        resolve(project)
      } catch (err) {
        reject(new Error('Invalid project file format'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Project Manager Modal Component
interface ProjectManagerProps {
  currentProject: ProjectState
  onLoadProject: (project: ProjectState, projectId: string) => void
  onNewProject: () => void
  onClose: () => void
  currentProjectId: string | null
}

export function ProjectManager({
  currentProject,
  onLoadProject,
  onNewProject,
  onClose,
  currentProjectId
}: ProjectManagerProps) {
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    setProjects(getProjectsList())
  }, [])

  const handleSave = () => {
    setSaving(true)
    const id = saveProject(currentProject, currentProjectId || undefined)
    setProjects(getProjectsList())
    setSaving(false)
  }

  const handleExport = () => {
    exportProject(currentProject)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const project = await importProject(file)
      const id = saveProject(project)
      onLoadProject(project, id)
      setProjects(getProjectsList())
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const handleLoad = (projectId: string) => {
    const project = loadProject(projectId)
    if (project) {
      onLoadProject(project, projectId)
    }
  }

  const handleDelete = (projectId: string) => {
    deleteProject(projectId)
    setProjects(getProjectsList())
    setConfirmDelete(null)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f0f0f] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Project Manager</h2>
            <p className="text-sm text-gray-500 mt-1">Save, load, and manage your projects</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {saving ? 'Saving...' : 'Save Current'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export JSON
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {importing ? 'Importing...' : 'Import JSON'}
            <input
              type="file"
              accept=".json,.hublab.json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-auto p-4">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">No saved projects</p>
              <p className="text-gray-600 text-sm mt-1">Save your current project or import one to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    currentProjectId === project.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                    📱
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{project.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{project.screenCount} screen{project.screenCount !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{project.capsuleCount} capsule{project.capsuleCount !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {currentProjectId === project.id && (
                      <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                        Current
                      </span>
                    )}
                    <button
                      onClick={() => handleLoad(project.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Load Project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    {confirmDelete === project.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-2 py-1 rounded bg-red-500 text-white text-xs font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 rounded bg-white/10 text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(project.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Auto-save hook
export function useAutoSave(
  project: ProjectState,
  projectId: string | null,
  interval: number = 30000
): { lastSaved: Date | null; isSaving: boolean } {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const save = useCallback(() => {
    if (!project.screens.some(s => s.capsules.length > 0)) return

    setIsSaving(true)
    saveProject(project, projectId || undefined)
    setLastSaved(new Date())
    setIsSaving(false)
  }, [project, projectId])

  // Auto-save on interval
  useEffect(() => {
    const timer = setInterval(save, interval)
    return () => clearInterval(timer)
  }, [save, interval])

  // Save on unmount
  useEffect(() => {
    return () => {
      save()
    }
  }, [save])

  return { lastSaved, isSaving }
}

// Screen Manager Component
interface ScreenManagerProps {
  screens: Screen[]
  currentScreenId: string
  onSelectScreen: (id: string) => void
  onAddScreen: (name: string) => void
  onDeleteScreen: (id: string) => void
  onRenameScreen: (id: string, name: string) => void
}

export function ScreenManager({
  screens,
  currentScreenId,
  onSelectScreen,
  onAddScreen,
  onDeleteScreen,
  onRenameScreen
}: ScreenManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newScreenName, setNewScreenName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleAddScreen = () => {
    if (newScreenName.trim()) {
      onAddScreen(newScreenName.trim())
      setNewScreenName('')
      setShowAddModal(false)
    }
  }

  const handleStartRename = (screen: Screen) => {
    setEditingId(screen.id)
    setEditingName(screen.name)
  }

  const handleSaveRename = () => {
    if (editingId && editingName.trim()) {
      onRenameScreen(editingId, editingName.trim())
    }
    setEditingId(null)
    setEditingName('')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">Screens</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Add Screen"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-1">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              currentScreenId === screen.id
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'hover:bg-white/5 text-gray-400'
            }`}
            onClick={() => onSelectScreen(screen.id)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>

            {editingId === screen.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleSaveRename}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 text-sm truncate">{screen.name}</span>
            )}

            <span className="text-xs text-gray-600">{screen.capsules.length}</span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); handleStartRename(screen) }}
                className="p-1 rounded hover:bg-white/10"
                title="Rename"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              {screens.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteScreen(screen.id) }}
                  className="p-1 rounded hover:bg-red-500/20 text-red-400"
                  title="Delete"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Screen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-sm border border-white/10" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Add New Screen</h3>
            <input
              type="text"
              value={newScreenName}
              onChange={(e) => setNewScreenName(e.target.value)}
              placeholder="Screen name..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddScreen()}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScreen}
                disabled={!newScreenName.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors disabled:opacity-50"
              >
                Add Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
