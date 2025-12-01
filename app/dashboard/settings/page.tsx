'use client'

import React, { useState } from 'react'
import {
  IconCopy,
  IconCheck,
  IconRefresh,
  IconTrash,
  IconPlus,
} from '../../../components/ui/icons'

interface APIKey {
  id: string
  name: string
  key: string
  tier: 'free' | 'pro' | 'enterprise'
  createdAt: string
  lastUsedAt: string | null
}

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Development Key',
    key: 'hublab_sk_dev_xxxxxxxxxxxx',
    tier: 'pro',
    createdAt: '2024-01-10',
    lastUsedAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Production Key',
    key: 'hublab_sk_prod_xxxxxxxxxxxx',
    tier: 'pro',
    createdAt: '2024-01-15',
    lastUsedAt: null,
  },
]

const tierColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  pro: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  enterprise: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
}

export default function SettingsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    name: 'Developer',
    email: 'dev@hublab.dev',
    company: 'HubLab',
  })

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta, API keys y preferencias
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold">Perfil</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Empresa</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Guardar Cambios
        </button>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">API Keys</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona tus claves de API para acceso programático
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
            <IconPlus size={16} />
            Nueva Key
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {mockAPIKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{apiKey.name}</span>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${tierColors[apiKey.tier]}`}>
                    {apiKey.tier.toUpperCase()}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                    {apiKey.key.slice(0, 20)}...
                  </code>
                  <button
                    onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedKey === apiKey.id ? (
                      <>
                        <IconCheck size={12} />
                        Copiada
                      </>
                    ) : (
                      <>
                        <IconCopy size={12} />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Creada: {apiKey.createdAt}
                  {apiKey.lastUsedAt && ` • Último uso: ${apiKey.lastUsedAt}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Regenerar">
                  <IconRefresh size={16} className="text-muted-foreground" />
                </button>
                <button className="rounded-lg p-2 hover:bg-destructive/10 transition-colors" title="Eliminar">
                  <IconTrash size={16} className="text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limits */}
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold">Límites de Uso (Plan Pro)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Proyectos por hora', used: 12, limit: 100 },
            { label: 'Exportaciones por día', used: 47, limit: 500 },
            { label: 'Despliegues por día', used: 8, limit: 50 },
            { label: 'Requests por minuto', used: 24, limit: 120 },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium">
                  {item.used} / {item.limit}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(item.used / item.limit) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold">Preferencias</h2>
        <div className="mt-4 space-y-4">
          {[
            { key: 'darkMode', label: 'Modo oscuro', description: 'Usar tema oscuro en la interfaz' },
            { key: 'emailNotifications', label: 'Notificaciones por email', description: 'Recibir actualizaciones y alertas' },
            { key: 'analytics', label: 'Analytics', description: 'Permitir recolección de datos de uso anónimos' },
          ].map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div>
                <div className="font-medium">{pref.label}</div>
                <div className="text-sm text-muted-foreground">{pref.description}</div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked={pref.key === 'emailNotifications'} />
                <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
        <h2 className="text-lg font-semibold text-destructive">Zona de Peligro</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Estas acciones son irreversibles. Procede con precaución.
        </p>
        <div className="mt-4 flex gap-3">
          <button className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            Eliminar todos los proyectos
          </button>
          <button className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors">
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  )
}
