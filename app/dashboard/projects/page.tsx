'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  IconPlus,
  IconSearch,
  IconChevronDown,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconTrash,
  IconEdit,
  IconEye,
  IconCopy,
  IconDownload,
} from '../../../components/ui/icons'

interface Project {
  id: string
  name: string
  description: string
  template: string
  platforms: string[]
  capsuleCount: number
  status: 'draft' | 'building' | 'ready' | 'deployed' | 'error'
  createdAt: string
  updatedAt: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Pro',
    description: 'Tienda online completa con carrito, pagos y gestión de pedidos',
    template: 'ecommerce',
    platforms: ['ios', 'android', 'web'],
    capsuleCount: 24,
    status: 'ready',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Admin Dashboard',
    description: 'Panel de administración con gráficos, tablas y reportes',
    template: 'admin',
    platforms: ['web', 'desktop'],
    capsuleCount: 18,
    status: 'deployed',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-19',
  },
  {
    id: '3',
    name: 'Social App',
    description: 'Red social con feed, perfiles, chat y notificaciones',
    template: 'blank',
    platforms: ['ios', 'android'],
    capsuleCount: 32,
    status: 'building',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Landing Page',
    description: 'Página de aterrizaje para producto SaaS',
    template: 'landing',
    platforms: ['web'],
    capsuleCount: 8,
    status: 'ready',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14',
  },
  {
    id: '5',
    name: 'Blog Personal',
    description: 'Blog con editor markdown y sistema de comentarios',
    template: 'blog',
    platforms: ['web'],
    capsuleCount: 12,
    status: 'draft',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19',
  },
]

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ios: IconApple,
  android: IconAndroid,
  web: IconGlobe,
  desktop: IconDesktop,
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', label: 'Borrador' },
  building: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300', label: 'Compilando' },
  ready: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', label: 'Listo' },
  deployed: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300', label: 'Desplegado' },
  error: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300', label: 'Error' },
}

const templateLabels: Record<string, string> = {
  blank: 'En blanco',
  dashboard: 'Dashboard',
  landing: 'Landing Page',
  ecommerce: 'E-Commerce',
  admin: 'Admin Panel',
  blog: 'Blog',
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || project.platforms.includes(platformFilter)
    return matchesSearch && matchesStatus && matchesPlatform
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <p className="text-muted-foreground">
            {mockProjects.length} proyectos en total
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <IconPlus size={16} />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl border border-border bg-background p-4">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border border-input bg-background py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="building">Compilando</option>
            <option value="ready">Listo</option>
            <option value="deployed">Desplegado</option>
            <option value="error">Error</option>
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
            <option value="ios">iOS</option>
            <option value="android">Android</option>
            <option value="web">Web</option>
            <option value="desktop">Desktop</option>
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-input">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 text-sm ${view === 'grid' ? 'bg-muted' : ''}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-muted' : ''}`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-lg">
                  {project.name[0]}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[project.status].bg} ${statusStyles[project.status].text}`}>
                  {statusStyles[project.status].label}
                </span>
              </div>

              {/* Content */}
              <div className="mt-4">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Meta */}
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="rounded bg-muted px-2 py-0.5 text-xs">
                  {templateLabels[project.template]}
                </span>
                <span>{project.capsuleCount} cápsulas</span>
              </div>

              {/* Platforms */}
              <div className="mt-4 flex items-center gap-2">
                {project.platforms.map((platform) => {
                  const Icon = platformIcons[platform]
                  return (
                    <div
                      key={platform}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"
                      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                      <Icon size={16} className="text-muted-foreground" />
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Abrir
                </Link>
                <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Preview">
                  <IconEye size={16} className="text-muted-foreground" />
                </button>
                <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Duplicar">
                  <IconCopy size={16} className="text-muted-foreground" />
                </button>
                <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Exportar">
                  <IconDownload size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}

          {/* New Project Card */}
          <Link
            href="/dashboard/projects/new"
            className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background p-6 transition-all hover:border-primary hover:bg-muted/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <IconPlus size={24} className="text-muted-foreground" />
            </div>
            <div className="mt-4 font-medium">Crear Nuevo Proyecto</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Desde cero o plantilla
            </div>
          </Link>
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Plataformas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Cápsulas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actualizado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white font-bold">
                        {project.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {project.platforms.map((platform) => {
                        const Icon = platformIcons[platform]
                        return (
                          <div key={platform} className="flex h-7 w-7 items-center justify-center rounded bg-muted">
                            <Icon size={14} className="text-muted-foreground" />
                          </div>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[project.status].bg} ${statusStyles[project.status].text}`}>
                      {statusStyles[project.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {project.capsuleCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {project.updatedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="rounded-lg p-2 hover:bg-muted transition-colors"
                        title="Editar"
                      >
                        <IconEdit size={16} className="text-muted-foreground" />
                      </Link>
                      <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Preview">
                        <IconEye size={16} className="text-muted-foreground" />
                      </button>
                      <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Duplicar">
                        <IconCopy size={16} className="text-muted-foreground" />
                      </button>
                      <button className="rounded-lg p-2 hover:bg-destructive/10 transition-colors" title="Eliminar">
                        <IconTrash size={16} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background py-12">
          <IconProjects size={48} className="text-muted-foreground" />
          <div className="mt-4 text-lg font-medium">No se encontraron proyectos</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Intenta con otros filtros o crea un nuevo proyecto
          </div>
          <Link
            href="/dashboard/projects/new"
            className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <IconPlus size={16} />
            Nuevo Proyecto
          </Link>
        </div>
      )}
    </div>
  )
}
