'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  IconChevronRight,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconPlus,
  IconTrash,
  IconEdit,
  IconEye,
  IconCode,
  IconDownload,
  IconPlay,
  IconSettings,
  IconLayers,
  IconCopy,
  IconCheck,
  IconRefresh,
} from '../../../../components/ui/icons'
import { useProject } from '../../../../lib/hooks/use-projects'
import { getCapsule } from '../../../../lib/capsules'
import { CodePreview } from '../../../../components/ui/code-preview'

interface ProjectCapsule {
  id: string
  type: string
  name: string
  category: string
  props: Record<string, any>
}

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ios: IconApple,
  android: IconAndroid,
  web: IconGlobe,
  desktop: IconDesktop,
}

const categoryColors: Record<string, string> = {
  layout: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  navigation: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  forms: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'data-display': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  auth: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  feedback: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { project, loading, error, updateProject, addCapsule, removeCapsule } = useProject(params.id)

  const [activeTab, setActiveTab] = useState<'capsules' | 'code' | 'theme' | 'settings'>('capsules')
  const [selectedCapsule, setSelectedCapsule] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form states for settings
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPlatforms, setEditPlatforms] = useState<('ios' | 'android' | 'web' | 'desktop')[]>([])

  // Theme editing
  const [editTheme, setEditTheme] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    if (project) {
      setEditName(project.name)
      setEditDescription(project.description || '')
      setEditPlatforms(project.platforms || [])
      const defaultColors = {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        foreground: '#0f172a',
      }
      setEditTheme(project.theme?.colors || defaultColors)
    }
  }, [project])

  const handleCopyId = () => {
    navigator.clipboard.writeText(params.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveSettings = async () => {
    if (!project) return
    setIsSaving(true)
    try {
      await updateProject({
        name: editName,
        description: editDescription,
        platforms: editPlatforms,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveTheme = async () => {
    if (!project) return
    setIsSaving(true)
    try {
      await updateProject({
        theme: {
          name: project.theme?.name || 'Custom',
          colors: {
            primary: editTheme.primary || '#3b82f6',
            secondary: editTheme.secondary || '#8b5cf6',
            ...editTheme,
          },
        },
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return
    }
    setIsDeleting(true)
    // Import deleteProject from useProjects would be needed
    // For now, redirect to projects list
    router.push('/dashboard/projects')
  }

  const handleRemoveCapsule = async (capsuleId: string) => {
    if (!confirm('¿Eliminar esta cápsula del proyecto?')) return
    await removeCapsule(capsuleId)
    if (selectedCapsule === capsuleId) {
      setSelectedCapsule(null)
    }
  }

  type Platform = 'ios' | 'android' | 'web' | 'desktop'

  const togglePlatform = (platform: Platform) => {
    setEditPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  // Build capsule list from project data
  const projectCapsules: ProjectCapsule[] = (project?.capsules || []).map((cap, index) => {
    const definition = getCapsule(cap.type)
    return {
      id: cap.id || `capsule-${index}`,
      type: cap.type,
      name: cap.name || definition?.name || cap.type,
      category: definition?.category || 'layout',
      props: cap.props || {},
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconRefresh className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-destructive text-lg font-medium">
          {error || 'Proyecto no encontrado'}
        </div>
        <Link
          href="/dashboard/projects"
          className="mt-4 text-sm text-primary hover:underline"
        >
          Volver a Proyectos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/projects" className="hover:text-foreground transition-colors">
          Proyectos
        </Link>
        <IconChevronRight size={14} />
        <span className="text-foreground">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-2xl">
            {project.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                project.status === 'ready'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : project.status === 'building'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
              }`}>
                {project.status === 'ready' ? 'Listo' : project.status === 'building' ? 'Compilando' : 'Borrador'}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">{project.description || 'Sin descripción'}</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {(project.platforms || []).map((platform) => {
                  const Icon = platformIcons[platform]
                  if (!Icon) return null
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
              <span className="text-sm text-muted-foreground">
                {projectCapsules.length} cápsulas
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                ID: {params.id.slice(0, 8)}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            <IconEye size={16} />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <IconCode size={16} />
            Ver Código
          </button>
          <Link
            href={`/dashboard/export?project=${params.id}`}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <IconDownload size={16} />
            Exportar
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          {[
            { id: 'capsules', label: 'Cápsulas', icon: IconLayers },
            { id: 'code', label: 'Código', icon: IconCode },
            { id: 'theme', label: 'Tema', icon: IconEdit },
            { id: 'settings', label: 'Configuración', icon: IconSettings },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'capsules' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Capsule List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cápsulas del Proyecto</h2>
              <Link
                href="/dashboard/capsules"
                className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <IconPlus size={14} />
                Añadir Cápsula
              </Link>
            </div>

            {projectCapsules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <IconLayers size={40} className="mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">No hay cápsulas</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Añade cápsulas desde el explorador para empezar a construir tu app.
                </p>
                <Link
                  href="/dashboard/capsules"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <IconPlus size={14} />
                  Explorar Cápsulas
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {projectCapsules.map((capsule) => (
                  <div
                    key={capsule.id}
                    onClick={() => setSelectedCapsule(capsule.id)}
                    className={`cursor-pointer rounded-xl border bg-background p-4 transition-all hover:shadow-md ${
                      selectedCapsule === capsule.id
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{capsule.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Tipo: {capsule.type}
                        </div>
                      </div>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${categoryColors[capsule.category] || 'bg-gray-100 text-gray-700'}`}>
                        {capsule.category}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {Object.keys(capsule.props).length} props
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" className="rounded p-1 hover:bg-muted transition-colors" title="Editar">
                          <IconEdit size={14} className="text-muted-foreground" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveCapsule(capsule.id)
                          }}
                          className="rounded p-1 hover:bg-destructive/10 transition-colors"
                          title="Eliminar"
                        >
                          <IconTrash size={14} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Capsule Details */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="font-semibold">Propiedades</h3>
            {selectedCapsule ? (
              <div className="mt-4 space-y-4">
                {(() => {
                  const capsule = projectCapsules.find((c) => c.id === selectedCapsule)
                  if (!capsule) return null
                  return (
                    <>
                      <div>
                        <label className="text-sm font-medium">Nombre</label>
                        <input
                          type="text"
                          defaultValue={capsule.name}
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tipo</label>
                        <input
                          type="text"
                          defaultValue={capsule.type}
                          disabled
                          className="mt-1 w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Props (JSON)</label>
                        <textarea
                          defaultValue={JSON.stringify(capsule.props, null, 2)}
                          rows={4}
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <button type="button" className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                        Guardar Cambios
                      </button>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
                <IconLayers size={32} className="text-muted-foreground" />
                <div className="mt-2 text-sm text-muted-foreground">
                  Selecciona una cápsula para ver sus propiedades
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Código Generado</h2>
              <p className="text-sm text-muted-foreground">
                Vista previa del código nativo generado para cada plataforma
              </p>
            </div>
          </div>

          {projectCapsules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <IconCode size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-medium">Sin código para generar</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Añade cápsulas al proyecto para ver el código generado.
              </p>
              <Link
                href="/dashboard/capsules"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <IconPlus size={14} />
                Explorar Cápsulas
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Project App Code */}
              <CodePreview
                code={{
                  ios: `// ${project.name} - iOS App
import SwiftUI

@main
struct ${project.name.replace(/\s+/g, '')}App: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}

// Theme Configuration
extension Color {
    static let primary = Color(hex: "${editTheme.primary || '#3b82f6'}")
    static let secondary = Color(hex: "${editTheme.secondary || '#8b5cf6'}")
    static let accent = Color(hex: "${editTheme.accent || '#06b6d4'}")
}

// ContentView with Capsules
struct ContentView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
${projectCapsules.map(c => `                    // ${c.name}
                    ${c.type}View(
                        ${Object.entries(c.props).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(',\n                        ')}
                    )`).join('\n\n')}
                }
                .padding()
            }
            .navigationTitle("${project.name}")
        }
    }
}`,
                  android: `// ${project.name} - Android App
package com.hublab.${project.name.toLowerCase().replace(/\s+/g, '')}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ${project.name.replace(/\s+/g, '')}Theme {
                MainScreen()
            }
        }
    }
}

// Theme Configuration
object AppColors {
    val Primary = Color(0xFF${(editTheme.primary || '#3b82f6').replace('#', '')})
    val Secondary = Color(0xFF${(editTheme.secondary || '#8b5cf6').replace('#', '')})
    val Accent = Color(0xFF${(editTheme.accent || '#06b6d4').replace('#', '')})
}

@Composable
fun MainScreen() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("${project.name}") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = AppColors.Primary
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
${projectCapsules.map(c => `            // ${c.name}
            ${c.type}Component(
                ${Object.entries(c.props).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(',\n                ')}
            )`).join('\n\n')}
        }
    }
}`,
                  web: `// ${project.name} - React Web App
'use client'

import React, { useState } from 'react'
${projectCapsules.map(c => `import { ${c.type}Capsule } from '@hublab/capsules'`).join('\n')}

// Theme Configuration
const theme = {
  colors: {
    primary: '${editTheme.primary || '#3b82f6'}',
    secondary: '${editTheme.secondary || '#8b5cf6'}',
    accent: '${editTheme.accent || '#06b6d4'}',
    background: '${editTheme.background || '#ffffff'}',
    foreground: '${editTheme.foreground || '#0f172a'}',
  }
}

export default function ${project.name.replace(/\s+/g, '')}App() {
  const [loading, setLoading] = useState(false)

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground
      }}
    >
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: theme.colors.primary }}
      >
        <h1 className="text-2xl font-bold">${project.name}</h1>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
${projectCapsules.map(c => `        {/* ${c.name} */}
        <${c.type}Capsule
          ${Object.entries(c.props).map(([k, v]) => {
            if (typeof v === 'string') return `${k}="${v}"`
            return `${k}={${JSON.stringify(v)}}`
          }).join('\n          ')}
        />`).join('\n\n')}
      </main>
    </div>
  )
}`,
                  desktop: `// ${project.name} - Tauri Desktop App
use tauri::Window;
use serde::{Deserialize, Serialize};

// Theme Configuration
pub struct Theme {
    pub primary: &'static str,
    pub secondary: &'static str,
    pub accent: &'static str,
}

pub const APP_THEME: Theme = Theme {
    primary: "${editTheme.primary || '#3b82f6'}",
    secondary: "${editTheme.secondary || '#8b5cf6'}",
    accent: "${editTheme.accent || '#06b6d4'}",
};

// App State
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppState {
    pub loading: bool,
    pub theme: String,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            loading: false,
            theme: "default".to_string(),
        }
    }
}

${projectCapsules.map(c => `// ${c.name} Component Props
#[derive(Debug, Serialize, Deserialize)]
pub struct ${c.type}Props {
    ${Object.entries(c.props).map(([k]) => `pub ${k}: String,`).join('\n    ')}
}

#[tauri::command]
pub fn render_${c.type.toLowerCase()}(
    window: Window,
    props: ${c.type}Props
) -> Result<String, String> {
    Ok(format!("Rendered ${c.type} component"))
}`).join('\n\n')}

// Main App Handler
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
${projectCapsules.map(c => `            render_${c.type.toLowerCase()},`).join('\n')}
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}`,
                }}
                fileName={{
                  ios: `${project.name.replace(/\s+/g, '')}App.swift`,
                  android: 'MainActivity.kt',
                  web: 'App.tsx',
                  desktop: 'main.rs',
                }}
              />

              {/* Individual Capsule Code */}
              {projectCapsules.length > 0 && (
                <div className="rounded-xl border border-border bg-background p-6">
                  <h3 className="font-semibold mb-4">Código por Cápsula</h3>
                  <div className="space-y-4">
                    {projectCapsules.map((capsule) => (
                      <details key={capsule.id} className="group">
                        <summary className="cursor-pointer flex items-center justify-between rounded-lg bg-muted px-4 py-3 hover:bg-muted/80 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{capsule.name}</span>
                            <span className={`rounded px-2 py-0.5 text-xs ${categoryColors[capsule.category] || 'bg-gray-100 text-gray-700'}`}>
                              {capsule.category}
                            </span>
                          </div>
                          <IconChevronRight size={16} className="text-muted-foreground group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="mt-3 pl-2">
                          <CodePreview
                            code={{
                              ios: `import SwiftUI

struct ${capsule.type}View: View {
    ${Object.entries(capsule.props).map(([k, v]) => `@State private var ${k}: ${typeof v === 'string' ? 'String' : typeof v === 'number' ? 'Int' : typeof v === 'boolean' ? 'Bool' : 'Any'} = ${JSON.stringify(v)}`).join('\n    ')}

    var body: some View {
        VStack(spacing: 12) {
            // ${capsule.name} implementation
            Text("${capsule.name}")
                .font(.headline)

            // Props: ${Object.keys(capsule.props).join(', ')}
        }
        .padding()
        .background(Color.primary.opacity(0.1))
        .cornerRadius(12)
    }
}

#Preview {
    ${capsule.type}View()
}`,
                              android: `package com.hublab.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ${capsule.type}Component(
    ${Object.entries(capsule.props).map(([k, v]) => `${k}: ${typeof v === 'string' ? 'String' : typeof v === 'number' ? 'Int' : typeof v === 'boolean' ? 'Boolean' : 'Any'} = ${JSON.stringify(v)}`).join(',\n    ')}
) {
    var loading by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // ${capsule.name} implementation
        Text(
            text = "${capsule.name}",
            style = MaterialTheme.typography.headlineSmall
        )

        // Props: ${Object.keys(capsule.props).join(', ')}
    }
}

@Preview
@Composable
fun ${capsule.type}ComponentPreview() {
    ${capsule.type}Component()
}`,
                              web: `'use client'

import React, { useState } from 'react'

interface ${capsule.type}Props {
  ${Object.entries(capsule.props).map(([k, v]) => `${k}?: ${typeof v === 'string' ? 'string' : typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'boolean' : 'any'}`).join('\n  ')}
  className?: string
}

export function ${capsule.type}Capsule({
  ${Object.entries(capsule.props).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(',\n  ')},
  className = ''
}: ${capsule.type}Props) {
  const [loading, setLoading] = useState(false)

  return (
    <div className={\`rounded-xl border p-6 \${className}\`}>
      {/* ${capsule.name} implementation */}
      <h3 className="font-semibold">${capsule.name}</h3>

      {/* Props: ${Object.keys(capsule.props).join(', ')} */}
    </div>
  )
}

export default ${capsule.type}Capsule`,
                              desktop: `use serde::{Deserialize, Serialize};
use tauri::Window;

#[derive(Debug, Serialize, Deserialize)]
pub struct ${capsule.type}Props {
    ${Object.entries(capsule.props).map(([k]) => `pub ${k}: String,`).join('\n    ')}
}

impl Default for ${capsule.type}Props {
    fn default() -> Self {
        Self {
            ${Object.entries(capsule.props).map(([k, v]) => `${k}: ${JSON.stringify(String(v))}.to_string(),`).join('\n            ')}
        }
    }
}

#[tauri::command]
pub fn render_${capsule.type.toLowerCase()}(
    window: Window,
    props: ${capsule.type}Props
) -> Result<String, String> {
    // ${capsule.name} implementation
    Ok(format!(
        "Rendered ${capsule.type} with props: {:?}",
        props
    ))
}

// Register in main.rs:
// .invoke_handler(tauri::generate_handler![render_${capsule.type.toLowerCase()}])`,
                            }}
                            fileName={{
                              ios: `${capsule.type}View.swift`,
                              android: `${capsule.type}Component.kt`,
                              web: `${capsule.type}Capsule.tsx`,
                              desktop: `${capsule.type.toLowerCase()}.rs`,
                            }}
                          />
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="font-semibold">Colores del Tema</h3>
            <div className="mt-4 space-y-4">
              {Object.entries(editTheme).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-lg border border-border"
                    style={{ backgroundColor: value }}
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium capitalize">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setEditTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveTheme}
              disabled={isSaving}
              className="mt-6 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Tema'}
            </button>
          </div>

          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="font-semibold">Vista Previa</h3>
            <div className="mt-4 rounded-lg border border-border p-4" style={{ backgroundColor: editTheme.background || '#ffffff' }}>
              <div className="rounded-lg p-4" style={{ backgroundColor: editTheme.primary || '#3b82f6', color: '#fff' }}>
                <div className="font-semibold">Botón Primario</div>
              </div>
              <div className="mt-3 rounded-lg border p-4" style={{ borderColor: editTheme.secondary || '#8b5cf6' }}>
                <div style={{ color: editTheme.foreground || '#0f172a' }}>Texto de ejemplo</div>
                <div className="mt-1 text-sm" style={{ color: editTheme.accent || '#06b6d4' }}>
                  Texto de acento
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="font-semibold">Información del Proyecto</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Plataformas</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['ios', 'android', 'web', 'desktop'] as Platform[]).map((platform) => {
                    const Icon = platformIcons[platform]
                    const isActive = editPlatforms.includes(platform)
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon size={16} />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
            <h3 className="font-semibold text-destructive">Zona de Peligro</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Eliminar este proyecto eliminará permanentemente todos sus datos y cápsulas.
            </p>
            <button
              type="button"
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="mt-4 rounded-lg border border-destructive bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Proyecto'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
