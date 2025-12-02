'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProject, updateProject } from '@/lib/store/projects'
import { CAPSULE_DEFINITIONS, getCapsuleDefinition } from '@/lib/store/types'
import type { Project, CapsuleInstance } from '@/lib/store/types'

function generateId(): string {
  return `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export default function ProjectEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleInstance | null>(null)
  const [showExport, setShowExport] = useState(false)

  useEffect(() => {
    const proj = getProject(params.id as string)
    if (!proj) {
      router.push('/dashboard')
      return
    }
    setProject(proj)
    setLoading(false)
  }, [params.id, router])

  const saveProject = useCallback((updates: Partial<Project>) => {
    if (!project) return
    const updated = updateProject(project.id, updates)
    if (updated) setProject(updated)
  }, [project])

  const addCapsule = (type: string) => {
    if (!project) return
    const def = getCapsuleDefinition(type)
    if (!def) return

    const newCapsule: CapsuleInstance = {
      id: generateId(),
      type,
      props: { ...def.defaultProps },
    }

    saveProject({
      capsules: [...project.capsules, newCapsule],
    })
  }

  const updateCapsule = (id: string, props: Record<string, unknown>) => {
    if (!project) return
    const capsules = project.capsules.map(c =>
      c.id === id ? { ...c, props: { ...c.props, ...props } } : c
    )
    saveProject({ capsules })

    if (selectedCapsule?.id === id) {
      setSelectedCapsule({ ...selectedCapsule, props: { ...selectedCapsule.props, ...props } })
    }
  }

  const removeCapsule = (id: string) => {
    if (!project) return
    saveProject({
      capsules: project.capsules.filter(c => c.id !== id),
    })
    if (selectedCapsule?.id === id) {
      setSelectedCapsule(null)
    }
  }

  const moveCapsule = (id: string, direction: 'up' | 'down') => {
    if (!project) return
    const index = project.capsules.findIndex(c => c.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= project.capsules.length) return

    const capsules = [...project.capsules]
    const [removed] = capsules.splice(index, 1)
    capsules.splice(newIndex, 0, removed)
    saveProject({ capsules })
  }

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">
              {project.capsules.length} capsules • {project.targets.join(', ')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Export
        </button>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Capsule Library */}
        <div className="col-span-3 border border-border rounded-lg overflow-hidden bg-background">
          <div className="p-3 border-b border-border bg-muted/30">
            <h2 className="font-medium text-sm">Capsules ({CAPSULE_DEFINITIONS.length})</h2>
          </div>
          <div className="p-2 overflow-y-auto h-[calc(100%-45px)]">
            <CapsuleLibrary onAdd={addCapsule} />
          </div>
        </div>

        {/* Canvas */}
        <div className="col-span-6 border border-border rounded-lg overflow-hidden bg-background">
          <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <h2 className="font-medium text-sm">Canvas</h2>
            <span className="text-xs text-muted-foreground">
              {project.capsules.length} elements
            </span>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-45px)]">
            {project.capsules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <div className="text-4xl mb-3">🎨</div>
                <p className="text-sm">Click capsules on the left to add them</p>
              </div>
            ) : (
              <div className="space-y-2">
                {project.capsules.map((capsule, index) => {
                  const def = getCapsuleDefinition(capsule.type)
                  return (
                    <div
                      key={capsule.id}
                      onClick={() => setSelectedCapsule(capsule)}
                      className={`group relative p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCapsule?.id === capsule.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{def?.icon || '📦'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{def?.name || capsule.type}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {JSON.stringify(capsule.props).slice(0, 50)}...
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveCapsule(capsule.id, 'up')
                          }}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveCapsule(capsule.id, 'down')
                          }}
                          disabled={index === project.capsules.length - 1}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCapsule(capsule.id)
                          }}
                          className="p-1 rounded hover:bg-red-50 hover:text-red-500"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="col-span-3 border border-border rounded-lg overflow-hidden bg-background">
          <div className="p-3 border-b border-border bg-muted/30">
            <h2 className="font-medium text-sm">Properties</h2>
          </div>
          <div className="p-3 overflow-y-auto h-[calc(100%-45px)]">
            {selectedCapsule ? (
              <PropertyEditor
                capsule={selectedCapsule}
                onUpdate={(props) => updateCapsule(selectedCapsule.id, props)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p className="text-sm">Select a capsule to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <ExportModal project={project} onClose={() => setShowExport(false)} />
      )}
    </div>
  )
}

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  ui: 'UI Components',
  layout: 'Layout',
  forms: 'Forms',
  navigation: 'Navigation',
  data: 'Data Display',
  media: 'Media',
  device: 'Device & Native',
  feedback: 'Feedback',
  advanced: 'Advanced',
  auth: 'Authentication',
}

// Capsule Library with categories
function CapsuleLibrary({ onAdd }: { onAdd: (type: string) => void }) {
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['ui', 'forms']))

  // Group capsules by category
  type CapsuleDef = typeof CAPSULE_DEFINITIONS[number]
  const categories = CAPSULE_DEFINITIONS.reduce((acc, def) => {
    const cat = def.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(def)
    return acc
  }, {} as Record<string, CapsuleDef[]>)

  // Filter by search
  const filteredCategories = Object.entries(categories).reduce((acc, [cat, defs]) => {
    const filtered = defs.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
    )
    if (filtered.length > 0) acc[cat] = filtered
    return acc
  }, {} as Record<string, CapsuleDef[]>)

  const toggleCategory = (cat: string) => {
    const newSet = new Set(expandedCategories)
    if (newSet.has(cat)) newSet.delete(cat)
    else newSet.add(cat)
    setExpandedCategories(newSet)
  }

  return (
    <div className="space-y-2">
      {/* Search */}
      <div className="sticky top-0 bg-background pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search capsules..."
          className="w-full rounded-md border border-border bg-muted/30 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Categories */}
      {Object.entries(filteredCategories).map(([category, defs]) => (
        <div key={category} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center justify-between p-2 bg-muted/30 hover:bg-muted/50 text-left"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[category] || category}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{defs.length}</span>
              <svg
                className={`w-4 h-4 transition-transform ${expandedCategories.has(category) ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {expandedCategories.has(category) && (
            <div className="p-1">
              {defs.map((def) => (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => onAdd(def.type)}
                  className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted text-left transition-colors group"
                >
                  <span className="text-lg">{def.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{def.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{def.description}</div>
                  </div>
                  <svg
                    className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {Object.keys(filteredCategories).length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8">
          No capsules found for "{search}"
        </div>
      )}
    </div>
  )
}

// Property Editor Component
function PropertyEditor({
  capsule,
  onUpdate,
}: {
  capsule: CapsuleInstance
  onUpdate: (props: Record<string, unknown>) => void
}) {
  const def = getCapsuleDefinition(capsule.type)
  if (!def) return null

  const schema = def.propSchema as Record<string, { type: string; options?: string[]; required?: boolean }>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <span className="text-xl">{def.icon}</span>
        <div>
          <div className="font-medium">{def.name}</div>
          <div className="text-xs text-muted-foreground">{def.description}</div>
        </div>
      </div>

      {Object.entries(schema).map(([key, config]) => (
        <div key={key}>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {config.type === 'string' && (
            <input
              type="text"
              value={(capsule.props[key] as string) || ''}
              onChange={(e) => onUpdate({ [key]: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          )}

          {config.type === 'number' && (
            <input
              type="number"
              value={(capsule.props[key] as number) || 0}
              onChange={(e) => onUpdate({ [key]: Number(e.target.value) })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          )}

          {config.type === 'boolean' && (
            <button
              onClick={() => onUpdate({ [key]: !capsule.props[key] })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                capsule.props[key] ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  capsule.props[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )}

          {config.type === 'select' && config.options && (
            <select
              value={(capsule.props[key] as string) || ''}
              onChange={(e) => onUpdate({ [key]: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {config.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  )
}

// Export Modal Component
function ExportModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [platform, setPlatform] = useState<string>(project.targets[0] || 'web')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)

  const platforms = [
    { id: 'web', name: 'Web', icon: '🌐', desc: 'React + Vite + Tailwind' },
    { id: 'ios', name: 'iOS', icon: '🍎', desc: 'SwiftUI Project' },
    { id: 'android', name: 'Android', icon: '🤖', desc: 'Jetpack Compose' },
    { id: 'desktop', name: 'Desktop', icon: '💻', desc: 'Tauri + React' },
  ]

  const generateCode = () => {
    setGenerating(true)

    // Simulate code generation
    setTimeout(() => {
      const code = generateProjectCode(project, platform)
      setGenerated(code)
      setGenerating(false)
    }, 1000)
  }

  const downloadCode = () => {
    if (!generated) return

    const blob = new Blob([generated], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-${platform}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Export Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!generated ? (
            <>
              <p className="text-muted-foreground mb-4">
                Choose a platform to export your project
              </p>

              {/* Platform Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    disabled={!project.targets.includes(p.id as any)}
                    className={`flex items-center gap-3 p-4 rounded-lg border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      platform === p.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCode}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Code
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-green-50 text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span className="font-medium">Code generated successfully!</span>
              </div>

              {/* Code Preview */}
              <div className="rounded-lg border border-border bg-[#1e1e2e] p-4 mb-4 max-h-64 overflow-y-auto">
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                  {generated.slice(0, 2000)}
                  {generated.length > 2000 && '\n\n... (truncated)'}
                </pre>
              </div>

              {/* Download Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setGenerated(null)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={downloadCode}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download ZIP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple code generator
function generateProjectCode(project: Project, platform: string): string {
  const components = project.capsules.map(capsule => {
    const def = getCapsuleDefinition(capsule.type)
    return `// ${def?.name || capsule.type} Component
${generateComponentCode(capsule, platform)}`
  }).join('\n\n')

  if (platform === 'web') {
    return `// ${project.name}
// Generated by HubLab - https://hublab.dev
// Platform: Web (React + Vite)

// package.json
{
  "name": "${project.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.3.0",
    "vite": "^5.0.0"
  }
}

// src/App.tsx
import React from 'react'

${components}

export default function App() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">${project.name}</h1>
      <div className="space-y-4">
        ${project.capsules.map(c => `<${getCapsuleDefinition(c.type)?.name || 'Component'} />`).join('\n        ')}
      </div>
    </div>
  )
}

// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "${project.theme.colors.primary}",
        secondary: "${project.theme.colors.secondary}",
      }
    }
  }
}
`
  }

  if (platform === 'ios') {
    return `// ${project.name}
// Generated by HubLab - https://hublab.dev
// Platform: iOS (SwiftUI)

import SwiftUI

${project.capsules.map(c => generateSwiftUIComponent(c)).join('\n\n')}

struct ContentView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Text("${project.name}")
                    .font(.largeTitle)
                    .fontWeight(.bold)

                ${project.capsules.map(c => `${getCapsuleDefinition(c.type)?.name || 'Component'}View()`).join('\n                ')}
            }
            .padding()
        }
    }
}

@main
struct ${project.name.replace(/\s+/g, '')}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
`
  }

  if (platform === 'android') {
    return `// ${project.name}
// Generated by HubLab - https://hublab.dev
// Platform: Android (Jetpack Compose)

package com.hublab.${project.name.toLowerCase().replace(/\s+/g, '')}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

${project.capsules.map(c => generateComposeComponent(c)).join('\n\n')}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    MainScreen()
                }
            }
        }
    }
}

@Composable
fun MainScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "${project.name}",
            style = MaterialTheme.typography.headlineLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        ${project.capsules.map(c => `${getCapsuleDefinition(c.type)?.name || 'Component'}()`).join('\n        ')}
    }
}
`
  }

  return `// ${project.name}
// Generated by HubLab - https://hublab.dev
// Platform: ${platform}

${components}
`
}

function generateComponentCode(capsule: CapsuleInstance, platform: string): string {
  const def = getCapsuleDefinition(capsule.type)
  const name = def?.name || capsule.type

  if (capsule.type === 'button') {
    return `function ${name}() {
  return (
    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
      ${capsule.props.label || 'Button'}
    </button>
  )
}`
  }

  if (capsule.type === 'text') {
    return `function ${name}() {
  return (
    <p className="text-gray-900">
      ${capsule.props.content || 'Text'}
    </p>
  )
}`
  }

  if (capsule.type === 'input') {
    return `function ${name}() {
  const [value, setValue] = React.useState('')
  return (
    <input
      type="${capsule.props.type || 'text'}"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="${capsule.props.placeholder || ''}"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
    />
  )
}`
  }

  return `function ${name}() {
  return <div>${name}</div>
}`
}

function generateSwiftUIComponent(capsule: CapsuleInstance): string {
  const def = getCapsuleDefinition(capsule.type)
  const name = def?.name || capsule.type

  if (capsule.type === 'button') {
    return `struct ${name}View: View {
    var body: some View {
        Button(action: {}) {
            Text("${capsule.props.label || 'Button'}")
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
        }
    }
}`
  }

  if (capsule.type === 'text') {
    return `struct ${name}View: View {
    var body: some View {
        Text("${capsule.props.content || 'Text'}")
    }
}`
  }

  return `struct ${name}View: View {
    var body: some View {
        Text("${name}")
    }
}`
}

function generateComposeComponent(capsule: CapsuleInstance): string {
  const def = getCapsuleDefinition(capsule.type)
  const name = def?.name || capsule.type

  if (capsule.type === 'button') {
    return `@Composable
fun ${name}() {
    Button(onClick = {}) {
        Text("${capsule.props.label || 'Button'}")
    }
}`
  }

  if (capsule.type === 'text') {
    return `@Composable
fun ${name}() {
    Text(text = "${capsule.props.content || 'Text'}")
}`
  }

  return `@Composable
fun ${name}() {
    Text(text = "${name}")
}`
}
