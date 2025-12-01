'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProjects } from '../../../../lib/hooks/use-projects'
import {
  IconChevronRight,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconCheck,
  IconRefresh,
} from '../../../../components/ui/icons'

const templates = [
  {
    id: 'blank',
    name: 'En Blanco',
    description: 'Empieza desde cero con un proyecto vacío',
    icon: '📄',
    platforms: ['ios', 'android', 'web', 'desktop'],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Tienda online con carrito, pagos y pedidos',
    icon: '🛒',
    platforms: ['ios', 'android', 'web'],
  },
  {
    id: 'admin',
    name: 'Admin Panel',
    description: 'Dashboard con gráficos, tablas y reportes',
    icon: '📊',
    platforms: ['web', 'desktop'],
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Página de aterrizaje para productos',
    icon: '🚀',
    platforms: ['web'],
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Blog con editor y comentarios',
    icon: '✍️',
    platforms: ['web'],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Panel de métricas y KPIs',
    icon: '📈',
    platforms: ['web', 'desktop'],
  },
]

const themes = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    colors: { primary: '#3b82f6', secondary: '#8b5cf6' },
  },
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    colors: { primary: '#a855f7', secondary: '#ec4899' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: { primary: '#000000', secondary: '#404040' },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: { primary: '#22c55e', secondary: '#14b8a6' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: { primary: '#f97316', secondary: '#ef4444' },
  },
]

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ios: IconApple,
  android: IconAndroid,
  web: IconGlobe,
  desktop: IconDesktop,
}

export default function NewProjectPage() {
  const router = useRouter()
  const { createProject } = useProjects()

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('blank')
  const [selectedTheme, setSelectedTheme] = useState('modern-blue')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        template: selectedTemplate as any,
        theme: selectedTheme,
      })
      router.push(`/dashboard/projects/${project.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el proyecto')
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/dashboard/projects" className="hover:text-foreground transition-colors">
          Proyectos
        </Link>
        <IconChevronRight size={14} />
        <span className="text-foreground">Nuevo Proyecto</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s ? <IconCheck size={16} /> : s}
            </div>
            <span className={`text-sm ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s === 1 ? 'Información' : s === 2 ? 'Plantilla' : 'Tema'}
            </span>
            {s < 3 && <div className={`h-px w-12 ${step > s ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold">Información del Proyecto</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dale un nombre y descripción a tu proyecto
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">
                Nombre del Proyecto <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mi App Increíble"
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente tu proyecto..."
                rows={3}
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Template */}
      {step === 2 && (
        <div className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold">Elige una Plantilla</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecciona una plantilla para empezar más rápido
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{template.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {template.description}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {template.platforms.map((platform) => {
                        const Icon = platformIcons[platform]
                        return (
                          <div key={platform} className="flex h-6 w-6 items-center justify-center rounded bg-muted">
                            <Icon size={12} className="text-muted-foreground" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <IconCheck size={12} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-border px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Continuar
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Theme */}
      {step === 3 && (
        <div className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold">Elige un Tema</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecciona los colores para tu proyecto
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  selectedTheme === theme.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                </div>
                <div className="mt-2 font-medium">{theme.name}</div>
                {selectedTheme === theme.id && (
                  <div className="mt-1 text-xs text-primary">Seleccionado</div>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-border px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <IconRefresh className="animate-spin" size={16} />
                  Creando...
                </>
              ) : (
                <>
                  Crear Proyecto
                  <IconCheck size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      {step > 1 && (
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <h3 className="text-sm font-medium">Resumen</h3>
          <div className="mt-2 grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre:</span>
              <span>{name || '—'}</span>
            </div>
            {step >= 2 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plantilla:</span>
                <span>{templates.find(t => t.id === selectedTemplate)?.name}</span>
              </div>
            )}
            {step >= 3 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tema:</span>
                <span>{themes.find(t => t.id === selectedTheme)?.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
