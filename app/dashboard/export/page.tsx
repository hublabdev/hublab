'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconDownload,
  IconCode,
  IconCheck,
  IconChevronDown,
  IconFolder,
  IconFile,
  IconRefresh,
  IconZap,
} from '../../../components/ui/icons'
import { useProjects } from '../../../lib/hooks/use-projects'
import { useExport } from '../../../lib/hooks/use-export'

interface ExportTargetConfig {
  id: string
  platform: 'ios' | 'android' | 'web' | 'desktop'
  framework: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  description: string
  fileExtension: string
  color: string
}

const exportTargets: ExportTargetConfig[] = [
  {
    id: 'ios',
    platform: 'ios',
    framework: 'SwiftUI',
    icon: IconApple,
    description: 'App nativa iOS con SwiftUI, compatible con iOS 15+',
    fileExtension: '.swift',
    color: 'bg-blue-500',
  },
  {
    id: 'android',
    platform: 'android',
    framework: 'Jetpack Compose',
    icon: IconAndroid,
    description: 'App nativa Android con Jetpack Compose y Material 3',
    fileExtension: '.kt',
    color: 'bg-green-500',
  },
  {
    id: 'web',
    platform: 'web',
    framework: 'React + TypeScript',
    icon: IconGlobe,
    description: 'App web con React, TypeScript y Tailwind CSS',
    fileExtension: '.tsx',
    color: 'bg-purple-500',
  },
  {
    id: 'desktop',
    platform: 'desktop',
    framework: 'Tauri',
    icon: IconDesktop,
    description: 'App de escritorio con Tauri para macOS, Windows y Linux',
    fileExtension: '.rs',
    color: 'bg-orange-500',
  },
]

interface ExportFile {
  name: string
  path: string
  type: 'folder' | 'file'
  children?: ExportFile[]
}

const mockExportPreview: Record<string, ExportFile[]> = {
  'ios-swiftui': [
    {
      name: 'ECommerceApp',
      path: '/',
      type: 'folder',
      children: [
        { name: 'ECommerceApp.swift', path: '/ECommerceApp.swift', type: 'file' },
        { name: 'ContentView.swift', path: '/ContentView.swift', type: 'file' },
        {
          name: 'Views',
          path: '/Views',
          type: 'folder',
          children: [
            { name: 'HomeView.swift', path: '/Views/HomeView.swift', type: 'file' },
            { name: 'ProductListView.swift', path: '/Views/ProductListView.swift', type: 'file' },
            { name: 'ProductDetailView.swift', path: '/Views/ProductDetailView.swift', type: 'file' },
            { name: 'CartView.swift', path: '/Views/CartView.swift', type: 'file' },
          ],
        },
        {
          name: 'Components',
          path: '/Components',
          type: 'folder',
          children: [
            { name: 'ProductCard.swift', path: '/Components/ProductCard.swift', type: 'file' },
            { name: 'PrimaryButton.swift', path: '/Components/PrimaryButton.swift', type: 'file' },
          ],
        },
        {
          name: 'Models',
          path: '/Models',
          type: 'folder',
          children: [
            { name: 'Product.swift', path: '/Models/Product.swift', type: 'file' },
            { name: 'CartItem.swift', path: '/Models/CartItem.swift', type: 'file' },
          ],
        },
        { name: 'Info.plist', path: '/Info.plist', type: 'file' },
      ],
    },
  ],
  'android-compose': [
    {
      name: 'app',
      path: '/',
      type: 'folder',
      children: [
        {
          name: 'src/main/kotlin/com/ecommerce',
          path: '/src/main/kotlin/com/ecommerce',
          type: 'folder',
          children: [
            { name: 'MainActivity.kt', path: '/MainActivity.kt', type: 'file' },
            { name: 'NavGraph.kt', path: '/NavGraph.kt', type: 'file' },
            {
              name: 'ui/screens',
              path: '/ui/screens',
              type: 'folder',
              children: [
                { name: 'HomeScreen.kt', path: '/ui/screens/HomeScreen.kt', type: 'file' },
                { name: 'ProductListScreen.kt', path: '/ui/screens/ProductListScreen.kt', type: 'file' },
              ],
            },
            {
              name: 'ui/components',
              path: '/ui/components',
              type: 'folder',
              children: [
                { name: 'ProductCard.kt', path: '/ui/components/ProductCard.kt', type: 'file' },
              ],
            },
          ],
        },
        { name: 'build.gradle.kts', path: '/build.gradle.kts', type: 'file' },
        { name: 'AndroidManifest.xml', path: '/AndroidManifest.xml', type: 'file' },
      ],
    },
  ],
  'web-react': [
    {
      name: 'ecommerce-web',
      path: '/',
      type: 'folder',
      children: [
        {
          name: 'src',
          path: '/src',
          type: 'folder',
          children: [
            { name: 'App.tsx', path: '/src/App.tsx', type: 'file' },
            { name: 'index.tsx', path: '/src/index.tsx', type: 'file' },
            {
              name: 'components',
              path: '/src/components',
              type: 'folder',
              children: [
                { name: 'ProductCard.tsx', path: '/src/components/ProductCard.tsx', type: 'file' },
                { name: 'Button.tsx', path: '/src/components/Button.tsx', type: 'file' },
              ],
            },
            {
              name: 'pages',
              path: '/src/pages',
              type: 'folder',
              children: [
                { name: 'Home.tsx', path: '/src/pages/Home.tsx', type: 'file' },
                { name: 'Products.tsx', path: '/src/pages/Products.tsx', type: 'file' },
              ],
            },
          ],
        },
        { name: 'package.json', path: '/package.json', type: 'file' },
        { name: 'tailwind.config.js', path: '/tailwind.config.js', type: 'file' },
        { name: 'tsconfig.json', path: '/tsconfig.json', type: 'file' },
      ],
    },
  ],
  'desktop-tauri': [
    {
      name: 'ecommerce-desktop',
      path: '/',
      type: 'folder',
      children: [
        {
          name: 'src-tauri',
          path: '/src-tauri',
          type: 'folder',
          children: [
            { name: 'main.rs', path: '/src-tauri/main.rs', type: 'file' },
            { name: 'Cargo.toml', path: '/src-tauri/Cargo.toml', type: 'file' },
            { name: 'tauri.conf.json', path: '/src-tauri/tauri.conf.json', type: 'file' },
          ],
        },
        {
          name: 'src',
          path: '/src',
          type: 'folder',
          children: [
            { name: 'App.tsx', path: '/src/App.tsx', type: 'file' },
            { name: 'main.tsx', path: '/src/main.tsx', type: 'file' },
          ],
        },
        { name: 'package.json', path: '/package.json', type: 'file' },
      ],
    },
  ],
}

function FileTree({ files, level = 0 }: { files: ExportFile[]; level?: number }) {
  return (
    <div className={level > 0 ? 'ml-4 border-l border-border pl-2' : ''}>
      {files.map((file) => (
        <div key={file.path}>
          <div className="flex items-center gap-2 py-1 text-sm">
            {file.type === 'folder' ? (
              <IconFolder size={14} className="text-yellow-500" />
            ) : (
              <IconFile size={14} className="text-muted-foreground" />
            )}
            <span className={file.type === 'folder' ? 'font-medium' : 'text-muted-foreground'}>
              {file.name}
            </span>
          </div>
          {file.children && <FileTree files={file.children} level={level + 1} />}
        </div>
      ))}
    </div>
  )
}

function ExportPageContent() {
  const searchParams = useSearchParams()
  const projectIdParam = searchParams.get('project')

  const { projects, loading: projectsLoading } = useProjects()
  const { isExporting, progress, currentPlatform, results, error, exportProject, reset } = useExport()

  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedTargets, setSelectedTargets] = useState<string[]>(['ios', 'android'])
  const [exportOptions, setExportOptions] = useState({
    includeTests: false,
    includeReadme: true,
    includeEnvExample: true,
  })
  const [exportComplete, setExportComplete] = useState(false)

  // Set initial project from URL param or first project
  useEffect(() => {
    if (projectIdParam && projects.some((p) => p.id === projectIdParam)) {
      setSelectedProject(projectIdParam)
    } else if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id)
    }
  }, [projects, projectIdParam, selectedProject])

  const currentProject = useMemo(
    () => projects.find((p) => p.id === selectedProject),
    [projects, selectedProject]
  )

  const toggleTarget = (targetId: string) => {
    setSelectedTargets((prev) =>
      prev.includes(targetId)
        ? prev.filter((id) => id !== targetId)
        : [...prev, targetId]
    )
    setExportComplete(false)
    reset()
  }

  const handleExport = async () => {
    if (!currentProject) return
    setExportComplete(false)

    const targets = selectedTargets.map((id) => {
      const target = exportTargets.find((t) => t.id === id)!
      return {
        platform: target.platform,
        options: {
          includeTests: exportOptions.includeTests,
        },
      }
    })

    await exportProject(currentProject, targets)
    setExportComplete(true)
  }

  const totalLinesGenerated = useMemo(() => {
    return results.reduce((acc, r) => acc + (r.linesOfCode || 0), 0)
  }, [results])

  const totalFilesGenerated = useMemo(() => {
    return results.reduce((acc, r) => acc + r.fileCount, 0)
  }, [results])

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconRefresh className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Exportar a Nativo</h1>
        <p className="text-muted-foreground">
          Genera código nativo real para múltiples plataformas
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Selection */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold">1. Seleccionar Proyecto</h2>
            <div className="mt-4 relative">
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value)
                  setExportComplete(false)
                  reset()
                }}
                className="w-full appearance-none rounded-lg border border-input bg-background py-3 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
            </div>
            {currentProject && (
              <div className="mt-2 text-sm text-muted-foreground">
                {currentProject.capsules?.length || 0} cápsulas en el proyecto
              </div>
            )}
          </div>

          {/* Target Platforms */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold">2. Plataformas de Destino</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona una o más plataformas para exportar
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {exportTargets.map((target) => {
                const isSelected = selectedTargets.includes(target.id)
                return (
                  <div
                    key={target.id}
                    onClick={() => toggleTarget(target.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${target.color} text-white`}>
                          <target.icon size={20} />
                        </div>
                        <div>
                          <div className="font-medium">{target.platform}</div>
                          <div className="text-sm text-muted-foreground">{target.framework}</div>
                        </div>
                      </div>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                      }`}>
                        {isSelected && <IconCheck size={12} />}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {target.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold">3. Opciones de Exportación</h2>

            <div className="mt-4 space-y-3">
              {[
                { key: 'includeTests', label: 'Incluir tests unitarios', description: 'Genera tests para cada componente' },
                { key: 'includeReadme', label: 'Incluir README.md', description: 'Documentación de inicio rápido' },
                { key: 'includeEnvExample', label: 'Incluir .env.example', description: 'Plantilla de variables de entorno' },
              ].map((option) => (
                <label
                  key={option.key}
                  className="flex items-start gap-3 cursor-pointer rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={exportOptions[option.key as keyof typeof exportOptions]}
                    onChange={(e) =>
                      setExportOptions((prev) => ({
                        ...prev,
                        [option.key]: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleExport}
              disabled={selectedTargets.length === 0 || isExporting || !currentProject}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                selectedTargets.length === 0 || !currentProject
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isExporting ? (
                <>
                  <IconRefresh size={16} className="animate-spin" />
                  Generando {currentPlatform}... ({progress}%)
                </>
              ) : exportComplete && results.length > 0 ? (
                <>
                  <IconCheck size={16} />
                  Exportación Completa
                </>
              ) : (
                <>
                  <IconDownload size={16} />
                  Exportar {selectedTargets.length} Plataforma{selectedTargets.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {isExporting && (
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Compilando {currentPlatform}...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
              <div className="font-medium text-destructive">Error en la exportación</div>
              <div className="mt-1 text-sm text-destructive/80">{error}</div>
            </div>
          )}

          {exportComplete && results.length > 0 && (
            <div className="rounded-xl border border-green-500/50 bg-green-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                  <IconCheck size={20} />
                </div>
                <div>
                  <div className="font-medium text-green-700 dark:text-green-300">
                    Exportación completada con éxito
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Se han generado {totalFilesGenerated} archivos ({totalLinesGenerated.toLocaleString()} líneas de código) en {results.length} plataforma{results.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Results by platform */}
              <div className="mt-4 space-y-2">
                {results.map((result) => {
                  const target = exportTargets.find((t) => t.platform === result.platform)
                  if (!target) return null
                  return (
                    <div key={result.platform} className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-black/20 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <target.icon size={16} className="text-green-600" />
                        <span className="text-sm font-medium">{target.framework}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.fileCount} archivos · {(result.linesOfCode || 0).toLocaleString()} líneas
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <button type="button" className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors">
                  <IconDownload size={16} />
                  Descargar ZIP
                </button>
                <button type="button" className="flex items-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-500/10 transition-colors dark:text-green-300">
                  <IconCode size={16} />
                  Ver Código
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-border bg-background p-6 h-fit sticky top-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Vista Previa de Archivos</h3>
            <div className="flex items-center gap-1">
              <IconZap size={14} className="text-yellow-500" />
              <span className="text-xs text-muted-foreground">Código nativo real</span>
            </div>
          </div>

          {/* Show real results if available */}
          {results.length > 0 ? (
            <div className="mt-4 space-y-4">
              {results.map((result) => {
                const target = exportTargets.find((t) => t.platform === result.platform)
                if (!target) return null

                return (
                  <div key={result.platform} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <target.icon size={14} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{target.platform.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">({target.framework})</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.fileCount} archivos generados
                    </div>
                  </div>
                )
              })}
            </div>
          ) : selectedTargets.length > 0 ? (
            <div className="mt-4 space-y-4">
              {selectedTargets.map((targetId) => {
                const target = exportTargets.find((t) => t.id === targetId)
                const files = mockExportPreview[targetId] || mockExportPreview['web-react']
                if (!target) return null

                return (
                  <div key={targetId} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <target.icon size={14} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{target.platform.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">({target.framework})</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {files && <FileTree files={files} />}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
              <IconCode size={32} className="text-muted-foreground" />
              <div className="mt-2 text-sm text-muted-foreground">
                Selecciona plataformas para ver la estructura de archivos
              </div>
            </div>
          )}

          <div className="mt-4 rounded-lg bg-muted p-3">
            <div className="text-xs font-medium text-muted-foreground">Resumen</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Plataformas:</span>
                <span className="ml-1 font-medium">{results.length > 0 ? results.length : selectedTargets.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Archivos:</span>
                <span className="ml-1 font-medium">{results.length > 0 ? totalFilesGenerated : `~${selectedTargets.length * 12}`}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Líneas:</span>
                <span className="ml-1 font-medium">{results.length > 0 ? totalLinesGenerated.toLocaleString() : `~${selectedTargets.length * 800}`}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tests:</span>
                <span className="ml-1 font-medium">{exportOptions.includeTests ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <ExportPageContent />
    </Suspense>
  )
}
