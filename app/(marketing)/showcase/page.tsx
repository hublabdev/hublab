'use client'

import React from 'react'
import Link from 'next/link'
import {
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconChevronRight,
  IconGitHub,
  IconCode,
} from '../../../components/ui/icons'

interface ShowcaseApp {
  id: string
  name: string
  description: string
  category: string
  platforms: string[]
  image: string
  gradient: string
  capsuleCount: number
  linesOfCode: {
    ios: number
    android: number
    web: number
  }
  features: string[]
  author: string
  github?: string
}

const showcaseApps: ShowcaseApp[] = [
  {
    id: 'ecommerce-pro',
    name: 'ShopFlow',
    description: 'Tienda online completa con carrito, pagos, gestión de pedidos y panel de administración.',
    category: 'E-Commerce',
    platforms: ['ios', 'android', 'web'],
    image: '/showcase/ecommerce.png',
    gradient: 'from-blue-500 to-purple-600',
    capsuleCount: 28,
    linesOfCode: { ios: 4200, android: 3800, web: 2100 },
    features: ['Autenticación', 'Carrito de compras', 'Pagos con Stripe', 'Push notifications', 'Dark mode'],
    author: 'HubLab Team',
  },
  {
    id: 'social-connect',
    name: 'SocialHub',
    description: 'Red social con feed en tiempo real, chat, perfiles de usuario y sistema de notificaciones.',
    category: 'Social',
    platforms: ['ios', 'android'],
    image: '/showcase/social.png',
    gradient: 'from-pink-500 to-rose-600',
    capsuleCount: 32,
    linesOfCode: { ios: 5100, android: 4700, web: 0 },
    features: ['Feed en tiempo real', 'Chat con WebSocket', 'Perfiles', 'Stories', 'Push notifications'],
    author: 'Community',
    github: 'https://github.com/example/socialhub',
  },
  {
    id: 'admin-dashboard',
    name: 'AdminPro',
    description: 'Panel de administración con gráficos, tablas de datos, reportes y gestión de usuarios.',
    category: 'Admin',
    platforms: ['web', 'desktop'],
    image: '/showcase/admin.png',
    gradient: 'from-green-500 to-emerald-600',
    capsuleCount: 24,
    linesOfCode: { ios: 0, android: 0, web: 3200 },
    features: ['Gráficos interactivos', 'DataTable avanzado', 'Exportar a PDF/Excel', 'Dark mode', 'RBAC'],
    author: 'HubLab Team',
  },
  {
    id: 'fitness-tracker',
    name: 'FitTrack',
    description: 'App de fitness con seguimiento de entrenamientos, estadísticas y integración con HealthKit.',
    category: 'Health',
    platforms: ['ios', 'android'],
    image: '/showcase/fitness.png',
    gradient: 'from-orange-500 to-red-600',
    capsuleCount: 22,
    linesOfCode: { ios: 3800, android: 3500, web: 0 },
    features: ['HealthKit/Google Fit', 'Gráficos de progreso', 'Rutinas personalizadas', 'Notificaciones', 'Watch app'],
    author: 'Community',
    github: 'https://github.com/example/fittrack',
  },
  {
    id: 'notes-app',
    name: 'QuickNotes',
    description: 'App de notas con editor markdown, sincronización en la nube y búsqueda full-text.',
    category: 'Productivity',
    platforms: ['ios', 'android', 'web', 'desktop'],
    image: '/showcase/notes.png',
    gradient: 'from-yellow-500 to-amber-600',
    capsuleCount: 18,
    linesOfCode: { ios: 2800, android: 2600, web: 1800 },
    features: ['Editor Markdown', 'Sync en tiempo real', 'Búsqueda', 'Tags y carpetas', 'Offline mode'],
    author: 'HubLab Team',
  },
  {
    id: 'food-delivery',
    name: 'FoodRush',
    description: 'App de delivery con mapa en tiempo real, tracking de pedidos y pagos integrados.',
    category: 'Food',
    platforms: ['ios', 'android'],
    image: '/showcase/food.png',
    gradient: 'from-red-500 to-orange-600',
    capsuleCount: 26,
    linesOfCode: { ios: 4500, android: 4200, web: 0 },
    features: ['Mapa en tiempo real', 'Tracking de pedidos', 'Pagos', 'Push notifications', 'Favoritos'],
    author: 'Community',
  },
]

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ios: IconApple,
  android: IconAndroid,
  web: IconGlobe,
  desktop: IconDesktop,
}

const categoryColors: Record<string, string> = {
  'E-Commerce': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'Social': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'Admin': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'Health': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  'Productivity': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'Food': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function ShowcasePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Showcase</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Apps reales creadas con HubLab. Desde e-commerce hasta redes sociales,
            todas generan código nativo para iOS, Android, Web y Desktop.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Crear tu App
              <IconChevronRight size={16} />
            </Link>
            <a
              href="https://github.com/hublabdev/hublab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              <IconGitHub size={16} />
              Ver en GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">6+</div>
              <div className="text-sm text-muted-foreground">Apps de ejemplo</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Cápsulas usadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">40K+</div>
              <div className="text-sm text-muted-foreground">Líneas generadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Plataformas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {showcaseApps.map((app) => (
              <div
                key={app.id}
                className="group rounded-2xl border border-border bg-background overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Image placeholder */}
                <div className={`h-48 bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                  <div className="text-6xl font-bold text-white/30">{app.name[0]}</div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{app.name}</h3>
                      <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${categoryColors[app.category]}`}>
                        {app.category}
                      </span>
                    </div>
                    {app.github && (
                      <a
                        href={app.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 hover:bg-muted transition-colors"
                      >
                        <IconGitHub size={20} className="text-muted-foreground" />
                      </a>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {app.description}
                  </p>

                  {/* Platforms */}
                  <div className="mt-4 flex items-center gap-2">
                    {app.platforms.map((platform) => {
                      const Icon = platformIcons[platform]
                      return (
                        <div
                          key={platform}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"
                          title={platform}
                        >
                          <Icon size={16} className="text-muted-foreground" />
                        </div>
                      )
                    })}
                    <span className="ml-auto text-sm text-muted-foreground">
                      {app.capsuleCount} cápsulas
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {app.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {feature}
                      </span>
                    ))}
                    {app.features.length > 3 && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        +{app.features.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Code stats */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconCode size={14} />
                      <span>Código generado:</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      {app.linesOfCode.ios > 0 && (
                        <div className="rounded bg-blue-50 dark:bg-blue-950 px-2 py-1">
                          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">iOS</div>
                          <div className="text-sm font-semibold">{(app.linesOfCode.ios / 1000).toFixed(1)}k</div>
                        </div>
                      )}
                      {app.linesOfCode.android > 0 && (
                        <div className="rounded bg-green-50 dark:bg-green-950 px-2 py-1">
                          <div className="text-xs font-medium text-green-600 dark:text-green-400">Android</div>
                          <div className="text-sm font-semibold">{(app.linesOfCode.android / 1000).toFixed(1)}k</div>
                        </div>
                      )}
                      {app.linesOfCode.web > 0 && (
                        <div className="rounded bg-purple-50 dark:bg-purple-950 px-2 py-1">
                          <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Web</div>
                          <div className="text-sm font-semibold">{(app.linesOfCode.web / 1000).toFixed(1)}k</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="mt-4 text-xs text-muted-foreground">
                    Por {app.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit your app */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">¿Has creado algo con HubLab?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comparte tu proyecto con la comunidad y aparece en el showcase.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://github.com/hublabdev/hublab/issues/new?template=showcase.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <IconGitHub size={16} />
              Enviar tu App
            </a>
            <Link
              href="/docs"
              className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Ver Documentación
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
