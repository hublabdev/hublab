'use client'

import React, { useState, useMemo } from 'react'
import {
  IconSearch,
  IconChevronDown,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconCode,
  IconEye,
  IconCopy,
  IconCheck,
  IconRefresh,
} from '../../../components/ui/icons'
import { useCapsules } from '../../../lib/hooks/use-capsules'
import type { CapsuleDefinition } from '../../../lib/capsules'

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ios: IconApple,
  android: IconAndroid,
  web: IconGlobe,
  desktop: IconDesktop,
}

const categoryColors: Record<string, string> = {
  'layout': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'navigation': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  'forms': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'data-display': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  'feedback': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'media': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'data-management': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'device': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'auth': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
}

const categoryLabels: Record<string, string> = {
  'layout': 'Layout',
  'navigation': 'Navegación',
  'forms': 'Formularios',
  'data-display': 'Datos',
  'feedback': 'Feedback',
  'media': 'Media',
  'data-management': 'Gestión',
  'device': 'Device',
  'auth': 'Auth',
}

export default function CapsulesPage() {
  const { capsules, loading, stats, search, filterByCategory, filterByPlatform } = useCapsules()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleDefinition | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  // Get unique categories from capsules
  const categories = useMemo(() => {
    const cats = new Set(capsules.map((c) => c.category))
    return ['all', ...Array.from(cats)]
  }, [capsules])

  // Filter capsules
  const filteredCapsules = useMemo(() => {
    let result = capsules

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.category === categoryFilter)
    }

    // Platform filter
    if (platformFilter !== 'all') {
      result = result.filter((c) => c.platforms.includes(platformFilter as any))
    }

    return result
  }, [capsules, searchQuery, categoryFilter, platformFilter])

  const handleCopyCode = () => {
    if (selectedCapsule) {
      const code = `import { ${selectedCapsule.id}Capsule } from '@hublab/capsules'

// Uso básico
<${selectedCapsule.id}Capsule
  variant="default"
  // ... props
/>`
      navigator.clipboard.writeText(code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  if (loading) {
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
        <h1 className="text-2xl font-bold">Explorador de Cápsulas</h1>
        <p className="text-muted-foreground">
          {stats.total} componentes multi-plataforma disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl border border-border bg-background p-4">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar cápsulas por nombre o etiqueta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none rounded-lg border border-input bg-background py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todas las categorías</option>
            {categories.filter(c => c !== 'all').map((cat) => (
              <option key={cat} value={cat}>{categoryLabels[cat] || cat}</option>
            ))}
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
        </div>

        {/* Platform filter */}
        <div className="relative">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="appearance-none rounded-lg border border-input bg-background py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todas las plataformas</option>
            <option value="ios">iOS (SwiftUI)</option>
            <option value="android">Android (Compose)</option>
            <option value="web">Web (React)</option>
            <option value="desktop">Desktop (Tauri)</option>
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Cápsulas', value: stats.total, color: 'text-blue-500' },
          { label: 'iOS Compatible', value: stats.byPlatform.ios || 0, color: 'text-gray-500' },
          { label: 'Android Compatible', value: stats.byPlatform.android || 0, color: 'text-green-500' },
          { label: 'Categorías', value: Object.keys(stats.byCategory).length, color: 'text-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Capsule Grid */}
        <div className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredCapsules.map((capsule) => (
              <div
                key={capsule.id}
                onClick={() => setSelectedCapsule(capsule)}
                className={`cursor-pointer rounded-xl border bg-background p-4 transition-all hover:shadow-md ${
                  selectedCapsule?.id === capsule.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{capsule.name}</span>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${categoryColors[capsule.category] || 'bg-gray-100 text-gray-700'}`}>
                        {categoryLabels[capsule.category] || capsule.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {capsule.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {capsule.platforms.map((platform) => {
                      const Icon = platformIcons[platform]
                      if (!Icon) return null
                      return (
                        <div
                          key={platform}
                          className="flex h-6 w-6 items-center justify-center rounded bg-muted"
                          title={platform}
                        >
                          <Icon size={12} className="text-muted-foreground" />
                        </div>
                      )
                    })}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {capsule.tags.length} tags
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredCapsules.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background py-12">
              <IconSearch size={48} className="text-muted-foreground" />
              <div className="mt-4 text-lg font-medium">No se encontraron cápsulas</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Intenta con otros filtros de búsqueda
              </div>
            </div>
          )}
        </div>

        {/* Selected Capsule Detail */}
        <div className="rounded-xl border border-border bg-background p-6 h-fit sticky top-6">
          {selectedCapsule ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedCapsule.name}</h3>
                  <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${categoryColors[selectedCapsule.category] || 'bg-gray-100 text-gray-700'}`}>
                    {categoryLabels[selectedCapsule.category] || selectedCapsule.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" className="rounded-lg p-2 hover:bg-muted transition-colors" title="Preview">
                    <IconEye size={16} className="text-muted-foreground" />
                  </button>
                  <button type="button" className="rounded-lg p-2 hover:bg-muted transition-colors" title="Ver código">
                    <IconCode size={16} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {selectedCapsule.description}
              </p>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Plataformas Soportadas</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCapsule.platforms.map((platform) => {
                    const Icon = platformIcons[platform]
                    const labels: Record<string, string> = {
                      ios: 'iOS (SwiftUI)',
                      android: 'Android (Compose)',
                      web: 'Web (React)',
                      desktop: 'Desktop (Tauri)',
                    }
                    if (!Icon) return null
                    return (
                      <div key={platform} className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-sm">
                        <Icon size={14} />
                        {labels[platform]}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Props del Componente</h4>
                <div className="mt-2 space-y-1 text-sm">
                  {Object.entries(selectedCapsule.props).slice(0, 5).map(([key, prop]) => (
                    <div key={key} className="flex items-center justify-between rounded bg-muted px-2 py-1">
                      <span className="font-mono text-xs">{key}</span>
                      <span className="text-xs text-muted-foreground">{(prop as any).type || 'any'}</span>
                    </div>
                  ))}
                  {Object.keys(selectedCapsule.props).length > 5 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{Object.keys(selectedCapsule.props).length - 5} más
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Etiquetas</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCapsule.tags.map((tag) => (
                    <span key={tag} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Código de Ejemplo</h4>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedCode ? <IconCheck size={12} /> : <IconCopy size={12} />}
                    {copiedCode ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <pre className="mt-2 rounded-lg bg-muted p-3 text-xs overflow-x-auto">
                  <code>{`import { ${selectedCapsule.id}Capsule } from '@hublab/capsules'

// Uso básico
<${selectedCapsule.id}Capsule
  variant="default"
  // ... props
/>`}</code>
                </pre>
              </div>

              <button type="button" className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Añadir a Proyecto
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconCode size={32} className="text-muted-foreground" />
              <div className="mt-4 text-sm font-medium">Selecciona una cápsula</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Ver detalles, props y código de ejemplo
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
