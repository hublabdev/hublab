'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProject, updateProject } from '@/lib/store/projects'
import { CAPSULE_DEFINITIONS, getCapsuleDefinition } from '@/lib/store/types'
import type { Project, CapsuleInstance, ThemeConfig } from '@/lib/store/types'

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
  const [showTheme, setShowTheme] = useState(false)

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTheme(true)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Theme
          </button>
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </button>
        </div>
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
            <h2 className="font-medium text-sm">Preview</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {project.capsules.length} elements
              </span>
            </div>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-45px)] bg-white">
            {project.capsules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <div className="text-4xl mb-3">🎨</div>
                <p className="text-sm">Click capsules on the left to add them</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-md mx-auto">
                {project.capsules.map((capsule, index) => (
                  <div
                    key={capsule.id}
                    onClick={() => setSelectedCapsule(capsule)}
                    className={`group relative rounded-lg cursor-pointer transition-all ${
                      selectedCapsule?.id === capsule.id
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'hover:ring-2 hover:ring-primary/30 hover:ring-offset-1'
                    }`}
                  >
                    <CapsulePreview capsule={capsule} theme={project.theme} />

                    {/* Hover Actions */}
                    <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          moveCapsule(capsule.id, 'up')
                        }}
                        disabled={index === 0}
                        className="p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-30"
                        title="Move up"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          moveCapsule(capsule.id, 'down')
                        }}
                        disabled={index === project.capsules.length - 1}
                        className="p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-30"
                        title="Move down"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeCapsule(capsule.id)
                        }}
                        className="p-1.5 rounded-full bg-white shadow-md hover:bg-red-50 hover:text-red-500"
                        title="Delete"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
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

      {/* Theme Modal */}
      {showTheme && (
        <ThemePanel
          theme={project.theme}
          onUpdate={(theme) => saveProject({ theme })}
          onClose={() => setShowTheme(false)}
        />
      )}
    </div>
  )
}

// Live Preview Component
function CapsulePreview({ capsule, theme }: { capsule: CapsuleInstance; theme: ThemeConfig }) {
  const props = capsule.props
  const primary = theme.colors.primary

  switch (capsule.type) {
    case 'button':
      return (
        <button
          type="button"
          className="px-4 py-2 text-white rounded-lg font-medium transition-colors"
          style={{ backgroundColor: primary }}
        >
          {(props.label as string) || 'Button'}
        </button>
      )

    case 'text':
      const textStyles: Record<string, string> = {
        h1: 'text-3xl font-bold',
        h2: 'text-2xl font-bold',
        h3: 'text-xl font-semibold',
        body: 'text-base',
        caption: 'text-sm text-gray-500',
      }
      return (
        <p className={textStyles[(props.variant as string) || 'body']}>
          {(props.content as string) || 'Text content'}
        </p>
      )

    case 'input':
      const inputLabel = props.label as string | undefined
      return (
        <div>
          {inputLabel && <label className="block text-sm font-medium mb-1">{inputLabel}</label>}
          <input
            type={(props.type as string) || 'text'}
            placeholder={(props.placeholder as string) || 'Enter text...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
            style={{ '--tw-ring-color': primary } as React.CSSProperties}
            readOnly
          />
        </div>
      )

    case 'card':
      const cardTitle = props.title as string | undefined
      const cardSubtitle = props.subtitle as string | undefined
      return (
        <div className="bg-white rounded-xl shadow-md p-4 border">
          {cardTitle && <h3 className="text-lg font-semibold mb-1">{cardTitle}</h3>}
          {cardSubtitle && <p className="text-gray-500 text-sm">{cardSubtitle}</p>}
          {!cardTitle && !cardSubtitle && <p className="text-gray-400 text-sm">Card content</p>}
        </div>
      )

    case 'image':
      return (
        <img
          src={(props.src as string) || 'https://picsum.photos/400/200'}
          alt={(props.alt as string) || 'Image'}
          className="w-full rounded-lg object-cover"
          style={{ aspectRatio: (props.aspectRatio as string)?.replace(':', '/') || '16/9' }}
        />
      )

    case 'avatar':
      const sizes: Record<string, string> = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-24 h-24' }
      const initials = ((props.name as string) || 'User').split(' ').map(n => n[0]).join('').toUpperCase()
      return (
        <div
          className={`${sizes[(props.size as string) || 'md']} rounded-full flex items-center justify-center text-white font-medium`}
          style={{ backgroundColor: primary }}
        >
          {initials}
        </div>
      )

    case 'badge':
      const badgeColors: Record<string, string> = {
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-purple-100 text-purple-800',
      }
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColors[(props.variant as string) || 'primary']}`}>
          {(props.label as string) || 'Badge'}
        </span>
      )

    case 'switch':
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-11 h-6 rounded-full bg-gray-300">
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${props.defaultChecked ? 'translate-x-5' : ''}`} />
          </div>
          <span className="text-sm">{(props.label as string) || 'Toggle'}</span>
        </label>
      )

    case 'progress':
      const percent = ((props.value as number) || 60) / ((props.max as number) || 100) * 100
      const showProgressLabel = props.showLabel as boolean
      return (
        <div className="w-full">
          {showProgressLabel && (
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(percent)}%</span>
            </div>
          )}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: primary }} />
          </div>
        </div>
      )

    case 'tabs':
      const tabs = (props.tabs as string[]) || ['Tab 1', 'Tab 2', 'Tab 3']
      return (
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            {tabs.map((tab, i) => (
              <span
                key={i}
                className={`py-2 px-1 text-sm border-b-2 ${i === 0 ? 'border-current font-medium' : 'border-transparent text-gray-500'}`}
                style={i === 0 ? { color: primary } : {}}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      )

    case 'dropdown':
      const dropdownLabel = props.label as string | undefined
      return (
        <div>
          {dropdownLabel && <label className="block text-sm font-medium mb-1">{dropdownLabel}</label>}
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white" disabled>
            <option>{(props.placeholder as string) || 'Select option...'}</option>
          </select>
        </div>
      )

    case 'slider':
      const sliderLabel = props.label as string | undefined
      return (
        <div>
          {sliderLabel && (
            <div className="flex justify-between text-sm mb-1">
              <span>{sliderLabel}</span>
              <span>{(props.value as number) || 50}</span>
            </div>
          )}
          <input
            type="range"
            min={(props.min as number) || 0}
            max={(props.max as number) || 100}
            defaultValue={(props.value as number) || 50}
            className="w-full"
            style={{ accentColor: primary }}
          />
        </div>
      )

    case 'rating':
      const rating = (props.value as number) || 3
      const maxStars = (props.max as number) || 5
      return (
        <div className="flex gap-1">
          {Array.from({ length: maxStars }).map((_, i) => (
            <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
          ))}
        </div>
      )

    case 'divider':
      return <hr className="border-gray-200" />

    case 'spacer':
      const spacerSizes: Record<string, string> = { xs: 'h-2', sm: 'h-4', md: 'h-8', lg: 'h-12', xl: 'h-16' }
      return <div className={spacerSizes[(props.size as string) || 'md']} />

    case 'chart':
      const data = (props.data as number[]) || [10, 25, 15, 30, 20]
      const labels = (props.labels as string[]) || ['A', 'B', 'C', 'D', 'E']
      const maxVal = Math.max(...data)
      return (
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-500 mb-2">{(props.title as string) || 'Chart'}</p>
          <div className="h-32 flex items-end gap-2">
            {data.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t" style={{ height: `${(v / maxVal) * 100}%`, backgroundColor: primary }} />
                <span className="text-xs mt-1">{labels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'video':
      return (
        <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )

    case 'map':
      const lat = (props.latitude as number) || 40.71
      const lng = (props.longitude as number) || -74.00
      return (
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <span className="text-2xl">📍</span>
            <p className="text-xs mt-1">Map: {lat}, {lng}</p>
          </div>
        </div>
      )

    case 'auth-screen':
      return (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">{props.mode === 'register' ? 'Create Account' : 'Sign In'}</h2>
          <div className="space-y-3">
            <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg text-sm" readOnly />
            <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded-lg text-sm" readOnly />
            <button
              type="button"
              className="w-full py-2 text-white rounded-lg text-sm font-medium"
              style={{ backgroundColor: primary }}
            >
              {props.mode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>
      )

    default:
      const def = getCapsuleDefinition(capsule.type)
      return (
        <div className="p-3 border border-dashed rounded-lg text-center text-gray-500">
          <span className="text-xl mr-2">{def?.icon || '📦'}</span>
          <span className="text-sm">{def?.name || capsule.type}</span>
        </div>
      )
  }
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
  const name = def?.name?.replace(/\s+/g, '') || capsule.type
  const props = capsule.props

  const generators: Record<string, () => string> = {
    button: () => `function ${name}({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      ${props.label || 'Button'}
    </button>
  )
}`,
    text: () => {
      const variant = props.variant || 'body'
      const content = props.content || 'Text'
      return `function ${name}() {
  const variants = { h1: 'text-4xl font-bold', h2: 'text-3xl font-bold', h3: 'text-2xl font-semibold', body: 'text-base', caption: 'text-sm text-gray-500' }
  return <p className={variants['${variant}']}>${content}</p>
}`
    },
    input: () => `function ${name}({ value, onChange }) {
  return (
    <div>
      ${props.label ? `<label className="block text-sm font-medium mb-1">${props.label}</label>` : ''}
      <input
        type="${props.type || 'text'}"
        value={value}
        onChange={onChange}
        placeholder="${props.placeholder || ''}"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  )
}`,
    card: () => `function ${name}({ children }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-${props.padding === 'lg' ? '8' : props.padding === 'sm' ? '3' : '6'}">
      ${props.title ? `<h3 className="text-lg font-semibold mb-2">${props.title}</h3>` : ''}
      ${props.subtitle ? `<p className="text-gray-500 mb-4">${props.subtitle}</p>` : ''}
      {children}
    </div>
  )
}`,
    image: () => `function ${name}() {
  return (
    <img
      src="${props.src || 'https://picsum.photos/400/300'}"
      alt="${props.alt || 'Image'}"
      className="w-full rounded-lg object-cover aspect-[${(props.aspectRatio as string)?.replace(':', '/') || '16/9'}]"
    />
  )
}`,
    avatar: () => {
      const size = props.size || 'md'
      const userName = props.name || 'User'
      return `function ${name}() {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-24 h-24' }
  const initials = '${userName}'.split(' ').map(n => n[0]).join('').toUpperCase()
  const sizeClass = sizes['${size}']
  return (
    <div className={sizeClass + ' rounded-full bg-primary text-white flex items-center justify-center font-medium'}>
      {initials}
    </div>
  )
}`
    },
    badge: () => {
      const variant = props.variant || 'primary'
      const label = props.label || 'Badge'
      return `function ${name}() {
  const variants = { primary: 'bg-blue-100 text-blue-800', success: 'bg-green-100 text-green-800', warning: 'bg-yellow-100 text-yellow-800', error: 'bg-red-100 text-red-800' }
  return <span className={'px-2 py-1 rounded-full text-xs font-medium ' + variants['${variant}']}>${label}</span>
}`
    },
    switch: () => `function ${name}({ checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={'relative w-11 h-6 rounded-full transition-colors ' + (checked ? 'bg-primary' : 'bg-gray-300')}>
        <div className={'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ' + (checked ? 'translate-x-5' : '')} />
      </div>
      <span className="text-sm">${props.label || ''}</span>
    </label>
  )
}`,
    progress: () => `function ${name}() {
  const percent = (${props.value || 0} / ${props.max || 100}) * 100
  return (
    <div className="w-full">
      ${props.showLabel ? '<div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{percent.toFixed(0)}%</span></div>' : ''}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: percent + '%' }} />
      </div>
    </div>
  )
}`,
    tabs: () => `function ${name}() {
  const [active, setActive] = React.useState(${props.activeIndex || 0})
  const tabs = ${JSON.stringify(props.tabs || ['Tab 1', 'Tab 2'])}
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={'py-2 px-4 border-b-2 transition-colors ' + (active === i ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700')}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}`,
    modal: () => `function ${name}({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">${props.title || 'Modal'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}`,
    dropdown: () => `function ${name}({ value, onChange }) {
  const options = ${JSON.stringify(props.options || ['Option 1', 'Option 2'])}
  return (
    <div>
      ${props.label ? `<label className="block text-sm font-medium mb-1">${props.label}</label>` : ''}
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
      >
        <option value="">${props.placeholder || 'Select...'}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}`,
    slider: () => `function ${name}({ value, onChange }) {
  return (
    <div>
      ${props.label ? `<div className="flex justify-between text-sm mb-1"><span>${props.label}</span><span>{value}</span></div>` : ''}
      <input
        type="range"
        min="${props.min || 0}"
        max="${props.max || 100}"
        step="${props.step || 1}"
        value={value}
        onChange={onChange}
        className="w-full accent-primary"
      />
    </div>
  )
}`,
    rating: () => `function ${name}({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: ${props.max || 5} }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={'text-2xl ' + (i < value ? 'text-yellow-400' : 'text-gray-300')}
        >
          ★
        </button>
      ))}
    </div>
  )
}`,
    chart: () => `function ${name}() {
  const data = ${JSON.stringify(props.data || [10, 25, 15, 30])}
  const labels = ${JSON.stringify(props.labels || ['A', 'B', 'C', 'D'])}
  const maxVal = Math.max(...data)
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-gray-500 mb-2">${props.title || 'Chart'} (${props.type || 'bar'})</p>
      <div className="h-48 flex items-end gap-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-primary rounded-t" style={{ height: ((v / maxVal) * 100) + '%' }} />
            <span className="text-xs mt-1">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}`,
    video: () => `function ${name}() {
  return (
    <video
      src="${props.src || ''}"
      controls={${props.controls !== false}}
      autoPlay={${props.autoPlay === true}}
      loop={${props.loop === true}}
      className="w-full rounded-lg"
    />
  )
}`,
    map: () => `function ${name}() {
  // Map component - requires map library (leaflet, mapbox, etc.)
  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Map: ${props.latitude || 0}, ${props.longitude || 0}</p>
    </div>
  )
}`,
    'auth-screen': () => `function ${name}() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">${props.mode === 'register' ? 'Create Account' : 'Sign In'}</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
        <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg font-medium">${props.mode === 'register' ? 'Create Account' : 'Sign In'}</button>
      </form>
      ${(props.providers as string[])?.includes('google') ? `<button className="w-full mt-4 py-3 border rounded-lg flex items-center justify-center gap-2">Continue with Google</button>` : ''}
    </div>
  )
}`,
  }

  return generators[capsule.type]?.() || `function ${name}() {
  return <div className="p-4 border rounded-lg">${def?.name || name}</div>
}`
}

function generateSwiftUIComponent(capsule: CapsuleInstance): string {
  const def = getCapsuleDefinition(capsule.type)
  const name = (def?.name || capsule.type).replace(/\s+/g, '')
  const props = capsule.props

  const generators: Record<string, () => string> = {
    button: () => `struct ${name}View: View {
    var action: () -> Void = {}
    var body: some View {
        Button(action: action) {
            Text("${props.label || 'Button'}")
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
        }
    }
}`,
    text: () => `struct ${name}View: View {
    var body: some View {
        Text("${props.content || 'Text'}")
            .font(.${props.variant === 'h1' ? 'largeTitle' : props.variant === 'h2' ? 'title' : props.variant === 'h3' ? 'title2' : 'body'})
    }
}`,
    input: () => `struct ${name}View: View {
    @Binding var text: String
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ${props.label ? `Text("${props.label}").font(.caption).foregroundColor(.secondary)` : ''}
            TextField("${props.placeholder || ''}", text: $text)
                .textFieldStyle(RoundedBorderTextFieldStyle())
        }
    }
}`,
    card: () => `struct ${name}View<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ${props.title ? `Text("${props.title}").font(.headline)` : ''}
            ${props.subtitle ? `Text("${props.subtitle}").font(.subheadline).foregroundColor(.secondary)` : ''}
            content
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 4)
    }
}`,
    image: () => `struct ${name}View: View {
    var body: some View {
        AsyncImage(url: URL(string: "${props.src || 'https://picsum.photos/400/300'}")) { image in
            image.resizable().aspectRatio(contentMode: .fill)
        } placeholder: { ProgressView() }
        .aspectRatio(${(props.aspectRatio as string)?.replace(':', '/') || '16/9'}, contentMode: .fit)
        .cornerRadius(8)
    }
}`,
    avatar: () => `struct ${name}View: View {
    var body: some View {
        ${props.src ? `AsyncImage(url: URL(string: "${props.src}")) { image in
            image.resizable().aspectRatio(contentMode: .fill)
        } placeholder: { ProgressView() }
        .frame(width: ${props.size === 'lg' ? 64 : props.size === 'sm' ? 32 : 48}, height: ${props.size === 'lg' ? 64 : props.size === 'sm' ? 32 : 48})
        .clipShape(Circle())` : `Circle()
            .fill(Color.blue)
            .frame(width: ${props.size === 'lg' ? 64 : props.size === 'sm' ? 32 : 48}, height: ${props.size === 'lg' ? 64 : props.size === 'sm' ? 32 : 48})
            .overlay(Text("${(props.name as string)?.split(' ').map(n => n[0]).join('') || 'U'}").foregroundColor(.white))`}
    }
}`,
    switch: () => `struct ${name}View: View {
    @Binding var isOn: Bool
    var body: some View {
        Toggle("${props.label || ''}", isOn: $isOn)
    }
}`,
    progress: () => `struct ${name}View: View {
    var value: Double = ${props.value || 0}
    var total: Double = ${props.max || 100}
    var body: some View {
        VStack(spacing: 4) {
            ${props.showLabel ? `HStack { Text("Progress"); Spacer(); Text("\\(Int(value/total*100))%") }.font(.caption)` : ''}
            ProgressView(value: value, total: total)
                .progressViewStyle(LinearProgressViewStyle())
        }
    }
}`,
    slider: () => `struct ${name}View: View {
    @Binding var value: Double
    var body: some View {
        VStack {
            ${props.label ? `HStack { Text("${props.label}"); Spacer(); Text("\\(Int(value))") }.font(.caption)` : ''}
            Slider(value: $value, in: ${props.min || 0}...${props.max || 100}, step: ${props.step || 1})
        }
    }
}`,
    rating: () => `struct ${name}View: View {
    @Binding var rating: Int
    var body: some View {
        HStack {
            ForEach(1...${props.max || 5}, id: \\.self) { i in
                Image(systemName: i <= rating ? "star.fill" : "star")
                    .foregroundColor(.yellow)
                    .onTapGesture { rating = i }
            }
        }
    }
}`,
  }

  return generators[capsule.type]?.() || `struct ${name}View: View {
    var body: some View {
        Text("${def?.name || name}")
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(8)
    }
}`
}

function generateComposeComponent(capsule: CapsuleInstance): string {
  const def = getCapsuleDefinition(capsule.type)
  const name = (def?.name || capsule.type).replace(/\s+/g, '')
  const props = capsule.props

  const generators: Record<string, () => string> = {
    button: () => `@Composable
fun ${name}(onClick: () -> Unit = {}) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
    ) {
        Text("${props.label || 'Button'}")
    }
}`,
    text: () => `@Composable
fun ${name}() {
    Text(
        text = "${props.content || 'Text'}",
        style = MaterialTheme.typography.${props.variant === 'h1' ? 'displayLarge' : props.variant === 'h2' ? 'displayMedium' : props.variant === 'h3' ? 'headlineLarge' : 'bodyLarge'}
    )
}`,
    input: () => `@Composable
fun ${name}(value: String, onValueChange: (String) -> Unit) {
    ${props.label ? `Column {
        Text("${props.label}", style = MaterialTheme.typography.labelMedium)
        Spacer(modifier = Modifier.height(4.dp))` : ''}
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text("${props.placeholder || ''}") },
            modifier = Modifier.fillMaxWidth()
        )
    ${props.label ? '}' : ''}
}`,
    card: () => `@Composable
fun ${name}(content: @Composable () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            ${props.title ? `Text("${props.title}", style = MaterialTheme.typography.titleMedium)` : ''}
            ${props.subtitle ? `Text("${props.subtitle}", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)` : ''}
            content()
        }
    }
}`,
    image: () => `@Composable
fun ${name}() {
    AsyncImage(
        model = "${props.src || 'https://picsum.photos/400/300'}",
        contentDescription = "${props.alt || 'Image'}",
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(${(props.aspectRatio as string)?.replace(':', 'f/') || '16f/9'}f)
            .clip(RoundedCornerShape(8.dp)),
        contentScale = ContentScale.Crop
    )
}`,
    avatar: () => `@Composable
fun ${name}() {
    val size = ${props.size === 'lg' ? 64 : props.size === 'sm' ? 32 : 48}.dp
    ${props.src ? `AsyncImage(
        model = "${props.src}",
        contentDescription = "Avatar",
        modifier = Modifier.size(size).clip(CircleShape),
        contentScale = ContentScale.Crop
    )` : `Box(
        modifier = Modifier.size(size).clip(CircleShape).background(MaterialTheme.colorScheme.primary),
        contentAlignment = Alignment.Center
    ) {
        Text("${(props.name as string)?.split(' ').map(n => n[0]).join('') || 'U'}", color = Color.White)
    }`}
}`,
    switch: () => `@Composable
fun ${name}(checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text("${props.label || ''}")
        Spacer(modifier = Modifier.weight(1f))
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}`,
    progress: () => `@Composable
fun ${name}() {
    val progress = ${props.value || 0}f / ${props.max || 100}f
    Column {
        ${props.showLabel ? `Row {
            Text("Progress")
            Spacer(modifier = Modifier.weight(1f))
            Text("\${(progress * 100).toInt()}%")
        }` : ''}
        LinearProgressIndicator(
            progress = progress,
            modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp))
        )
    }
}`,
    slider: () => `@Composable
fun ${name}(value: Float, onValueChange: (Float) -> Unit) {
    Column {
        ${props.label ? `Row {
            Text("${props.label}")
            Spacer(modifier = Modifier.weight(1f))
            Text("\${value.toInt()}")
        }` : ''}
        Slider(
            value = value,
            onValueChange = onValueChange,
            valueRange = ${props.min || 0}f..${props.max || 100}f,
            steps = ${Math.floor(((props.max as number) || 100) / ((props.step as number) || 1)) - 1}
        )
    }
}`,
    rating: () => `@Composable
fun ${name}(rating: Int, onRatingChange: (Int) -> Unit) {
    Row {
        repeat(${props.max || 5}) { i ->
            Icon(
                imageVector = if (i < rating) Icons.Filled.Star else Icons.Outlined.Star,
                contentDescription = null,
                tint = Color(0xFFFFC107),
                modifier = Modifier.clickable { onRatingChange(i + 1) }
            )
        }
    }
}`,
  }

  return generators[capsule.type]?.() || `@Composable
fun ${name}() {
    Surface(
        modifier = Modifier.fillMaxWidth().padding(8.dp),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Text("${def?.name || name}", modifier = Modifier.padding(16.dp))
    }
}`
}

// Theme Panel Component
function ThemePanel({
  theme,
  onUpdate,
  onClose,
}: {
  theme: ThemeConfig
  onUpdate: (theme: ThemeConfig) => void
  onClose: () => void
}) {
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme)

  const presetThemes = [
    { name: 'Default Blue', colors: { primary: '#3B82F6', secondary: '#6366F1', accent: '#8B5CF6', background: '#FFFFFF', surface: '#F3F4F6', text: '#111827' } },
    { name: 'Emerald', colors: { primary: '#10B981', secondary: '#14B8A6', accent: '#06B6D4', background: '#FFFFFF', surface: '#F0FDF4', text: '#064E3B' } },
    { name: 'Rose', colors: { primary: '#F43F5E', secondary: '#EC4899', accent: '#D946EF', background: '#FFFFFF', surface: '#FFF1F2', text: '#881337' } },
    { name: 'Amber', colors: { primary: '#F59E0B', secondary: '#EAB308', accent: '#84CC16', background: '#FFFFFF', surface: '#FFFBEB', text: '#78350F' } },
    { name: 'Slate Dark', colors: { primary: '#3B82F6', secondary: '#6366F1', accent: '#8B5CF6', background: '#0F172A', surface: '#1E293B', text: '#F8FAFC' } },
    { name: 'Midnight', colors: { primary: '#8B5CF6', secondary: '#A855F7', accent: '#D946EF', background: '#030712', surface: '#111827', text: '#F9FAFB' } },
  ]

  const borderRadiusOptions = [
    { value: 'none', label: 'None', preview: '0px' },
    { value: 'sm', label: 'Small', preview: '4px' },
    { value: 'md', label: 'Medium', preview: '8px' },
    { value: 'lg', label: 'Large', preview: '12px' },
    { value: 'full', label: 'Full', preview: '9999px' },
  ]

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'SF Pro',
    'System UI',
  ]

  const updateColor = (key: keyof ThemeConfig['colors'], value: string) => {
    setLocalTheme({
      ...localTheme,
      colors: { ...localTheme.colors, [key]: value },
    })
  }

  const applyTheme = () => {
    onUpdate(localTheme)
    onClose()
  }

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setLocalTheme({
      ...localTheme,
      name: preset.name,
      colors: preset.colors,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold">Theme Customization</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-md" title="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Preset Themes */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Preset Themes</h3>
            <div className="grid grid-cols-3 gap-2">
              {presetThemes.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    localTheme.name === preset.name
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {Object.values(preset.colors).slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Custom Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(localTheme.colors) as Array<keyof ThemeConfig['colors']>).map((colorKey) => (
                <div key={colorKey} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={localTheme.colors[colorKey]}
                    onChange={(e) => updateColor(colorKey, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                    title={`Select ${colorKey} color`}
                    aria-label={`${colorKey} color picker`}
                  />
                  <div>
                    <label htmlFor={`color-${colorKey}`} className="text-sm font-medium capitalize">{colorKey}</label>
                    <input
                      id={`color-${colorKey}`}
                      type="text"
                      value={localTheme.colors[colorKey]}
                      onChange={(e) => updateColor(colorKey, e.target.value)}
                      className="block w-full text-xs text-muted-foreground bg-transparent border-none p-0 focus:outline-none uppercase"
                      aria-label={`${colorKey} color hex value`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Border Radius</h3>
            <div className="flex gap-2">
              {borderRadiusOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setLocalTheme({ ...localTheme, borderRadius: option.value as ThemeConfig['borderRadius'] })}
                  className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                    localTheme.borderRadius === option.value
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className="w-8 h-8 mx-auto mb-1 border-2 border-current"
                    style={{ borderRadius: option.preview }}
                  />
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="mb-6">
            <label htmlFor="font-family-select" className="text-sm font-medium mb-3 block">Font Family</label>
            <select
              id="font-family-select"
              value={localTheme.fontFamily}
              onChange={(e) => setLocalTheme({ ...localTheme, fontFamily: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Live Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Live Preview</h3>
            <div
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: localTheme.colors.background,
                borderColor: localTheme.colors.surface,
                fontFamily: localTheme.fontFamily,
              }}
            >
              <div
                className="p-4 rounded-lg mb-4"
                style={{
                  backgroundColor: localTheme.colors.surface,
                  borderRadius: borderRadiusOptions.find(o => o.value === localTheme.borderRadius)?.preview,
                }}
              >
                <h4 className="font-semibold mb-2" style={{ color: localTheme.colors.text }}>
                  Card Title
                </h4>
                <p className="text-sm mb-4" style={{ color: localTheme.colors.text, opacity: 0.7 }}>
                  This is a preview of your theme settings.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-white text-sm font-medium"
                    style={{
                      backgroundColor: localTheme.colors.primary,
                      borderRadius: borderRadiusOptions.find(o => o.value === localTheme.borderRadius)?.preview,
                    }}
                  >
                    Primary
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white text-sm font-medium"
                    style={{
                      backgroundColor: localTheme.colors.secondary,
                      borderRadius: borderRadiusOptions.find(o => o.value === localTheme.borderRadius)?.preview,
                    }}
                  >
                    Secondary
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white text-sm font-medium"
                    style={{
                      backgroundColor: localTheme.colors.accent,
                      borderRadius: borderRadiusOptions.find(o => o.value === localTheme.borderRadius)?.preview,
                    }}
                  >
                    Accent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={applyTheme}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  )
}
