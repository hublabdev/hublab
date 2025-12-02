'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProjects, deleteProject, duplicateProject } from '@/lib/store/projects'
import type { Project } from '@/lib/store/types'

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setProjects(getProjects())
    setLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id)
      setProjects(getProjects())
    }
  }

  const handleDuplicate = (id: string) => {
    duplicateProject(id)
    setProjects(getProjects())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Build native apps for iOS, Android, Web, and Desktop
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first project to get started
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-xl border border-border bg-background p-6 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <Link href={`/dashboard/${project.id}`} className="block">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {project.capsules.length} capsules
                  </span>
                  <span className="flex items-center gap-1">
                    {project.targets.map(t => (
                      <span key={t} className="capitalize">{t}</span>
                    )).join(', ')}
                  </span>
                </div>

                {/* Platforms */}
                <div className="flex items-center gap-2 mt-4">
                  {project.targets.includes('ios') && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-500/10 text-blue-500 text-xs">
                      🍎
                    </span>
                  )}
                  {project.targets.includes('android') && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-500/10 text-green-500 text-xs">
                      🤖
                    </span>
                  )}
                  {project.targets.includes('web') && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-purple-500/10 text-purple-500 text-xs">
                      🌐
                    </span>
                  )}
                  {project.targets.includes('desktop') && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-orange-500/10 text-orange-500 text-xs">
                      💻
                    </span>
                  )}
                </div>
              </Link>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleDuplicate(project.id)
                  }}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  title="Duplicate"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete(project.id)
                  }}
                  className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Updated */}
              <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
