'use client'

import React from 'react'
import Link from 'next/link'
import {
  IconProjects,
  IconCapsules,
  IconExport,
  IconZap,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconChevronRight,
  IconPlus,
} from '../../components/ui/icons'

const stats = [
  { name: 'Proyectos', value: '12', icon: IconProjects, href: '/dashboard/projects', color: 'text-blue-500' },
  { name: 'Cápsulas', value: '53', icon: IconCapsules, href: '/dashboard/capsules', color: 'text-purple-500' },
  { name: 'Exportaciones', value: '47', icon: IconExport, href: '/dashboard/export', color: 'text-green-500' },
  { name: 'Despliegues', value: '8', icon: IconZap, href: '/dashboard/settings', color: 'text-orange-500' },
]

const recentProjects = [
  {
    id: '1',
    name: 'E-Commerce App',
    description: 'Tienda online con carrito y pagos',
    platforms: ['ios', 'android', 'web'],
    status: 'ready',
    updatedAt: 'Hace 2 horas',
  },
  {
    id: '2',
    name: 'Dashboard Admin',
    description: 'Panel de administración con gráficos',
    platforms: ['web', 'desktop'],
    status: 'building',
    updatedAt: 'Hace 5 horas',
  },
  {
    id: '3',
    name: 'Social Feed',
    description: 'Red social con posts y comentarios',
    platforms: ['ios', 'android'],
    status: 'draft',
    updatedAt: 'Ayer',
  },
]

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ios: IconApple,
  android: IconAndroid,
  web: IconGlobe,
  desktop: IconDesktop,
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  building: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  deployed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  building: 'Compilando',
  ready: 'Listo',
  deployed: 'Desplegado',
  error: 'Error',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Panel de Control</h1>
          <p className="text-muted-foreground">
            Gestiona tus proyectos y genera apps nativas para todas las plataformas.
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={stat.color} size={24} />
              <IconChevronRight
                className="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
                size={16}
              />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.name}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 transition-colors hover:border-primary hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <IconPlus className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <div className="font-medium">Crear Proyecto</div>
              <div className="text-xs text-muted-foreground">Desde cero o plantilla</div>
            </div>
          </Link>

          <Link
            href="/dashboard/capsules"
            className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 transition-colors hover:border-primary hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <IconCapsules className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <div className="font-medium">Explorar Cápsulas</div>
              <div className="text-xs text-muted-foreground">53 componentes</div>
            </div>
          </Link>

          <Link
            href="/dashboard/export"
            className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 transition-colors hover:border-primary hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <IconExport className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <div className="font-medium">Exportar Nativo</div>
              <div className="text-xs text-muted-foreground">iOS, Android, Web</div>
            </div>
          </Link>

          <a
            href="https://github.com/hublabdev/hublab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 transition-colors hover:border-primary hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <IconZap className="text-gray-600 dark:text-gray-400" size={20} />
            </div>
            <div>
              <div className="font-medium">Ver en GitHub</div>
              <div className="text-xs text-muted-foreground">Código fuente</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold">Proyectos Recientes</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="flex items-center justify-between p-6 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white font-bold">
                  {project.name[0]}
                </div>
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-muted-foreground">{project.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {project.platforms.map((platform) => {
                    const Icon = platformIcons[platform]
                    return (
                      <div
                        key={platform}
                        className="flex h-7 w-7 items-center justify-center rounded bg-muted"
                        title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                      >
                        <Icon size={14} className="text-muted-foreground" />
                      </div>
                    )
                  })}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </span>
                <span className="text-sm text-muted-foreground">{project.updatedAt}</span>
                <IconChevronRight className="text-muted-foreground" size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Support */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <IconApple className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <div className="font-medium">iOS</div>
              <div className="text-xs text-muted-foreground">SwiftUI nativo</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Genera apps iOS con SwiftUI puro. Compatible con iOS 15+, iPadOS, watchOS y visionOS.
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <IconAndroid className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <div className="font-medium">Android</div>
              <div className="text-xs text-muted-foreground">Jetpack Compose</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Apps Android con Jetpack Compose y Material 3. Compatible con API 24+ y Wear OS.
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <IconGlobe className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <div className="font-medium">Web</div>
              <div className="text-xs text-muted-foreground">React + Tailwind</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Apps web con React, TypeScript y Tailwind CSS. SSR con Next.js o SPA con Vite.
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <IconDesktop className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <div>
              <div className="font-medium">Desktop</div>
              <div className="text-xs text-muted-foreground">Tauri nativo</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Apps de escritorio con Tauri (Rust + Web). macOS, Windows y Linux con binarios ligeros.
          </div>
        </div>
      </div>
    </div>
  )
}
