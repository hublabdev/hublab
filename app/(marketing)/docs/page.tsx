'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  IconChevronRight,
  IconCode,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconCopy,
  IconCheck,
  IconLayers,
  IconZap,
  IconSearch,
} from '../../../components/ui/icons'

const sections = [
  {
    title: 'Empezando',
    items: [
      { title: 'Introducción', href: '#introduccion' },
      { title: 'Instalación', href: '#instalacion' },
      { title: 'Tu primer proyecto', href: '#primer-proyecto' },
      { title: 'Conceptos clave', href: '#conceptos' },
    ],
  },
  {
    title: 'Cápsulas',
    items: [
      { title: 'Qué son las cápsulas', href: '#capsulas' },
      { title: 'UI Components', href: '#ui-components' },
      { title: 'Navigation', href: '#navigation' },
      { title: 'Forms', href: '#forms' },
      { title: 'Device & Native', href: '#device-native' },
    ],
  },
  {
    title: 'Plataformas',
    items: [
      { title: 'iOS (SwiftUI)', href: '#ios' },
      { title: 'Android (Compose)', href: '#android' },
      { title: 'Web (React)', href: '#web' },
      { title: 'Desktop (Tauri)', href: '#desktop' },
    ],
  },
  {
    title: 'API',
    items: [
      { title: 'REST API', href: '/docs/api' },
      { title: 'Autenticación', href: '/docs/api#auth' },
      { title: 'Endpoints', href: '/docs/api#endpoints' },
      { title: 'Rate Limits', href: '/docs/api#rate-limits' },
    ],
  },
]

const codeExamples = {
  install: `# Clonar el repositorio
git clone https://github.com/hublabdev/hublab.git

# Instalar dependencias
cd hublab
npm install

# Iniciar servidor de desarrollo
npm run dev`,

  createProject: `// Crear un nuevo proyecto via API
const response = await fetch('/api/v1/projects', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer hublab_sk_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Mi App',
    template: 'ecommerce',
    theme: 'modern-blue'
  })
})

const { project } = await response.json()
console.log(project.id) // "proj_abc123"`,

  addCapsule: `// Añadir una cápsula al proyecto
import { ButtonCapsule } from '@hublab/capsules'

// Definir la cápsula con props
const buyButton = {
  type: 'button',
  variant: 'primary',
  props: {
    label: 'Comprar Ahora',
    size: 'large',
    icon: 'cart'
  }
}

// Añadir al proyecto
await addCapsule(projectId, buyButton)`,

  exportNative: `// Exportar a código nativo
const result = await fetch(\`/api/v1/projects/\${projectId}/export-native\`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer hublab_sk_...' },
  body: JSON.stringify({
    targets: [
      { platform: 'ios', options: { framework: 'swiftui', bundleId: 'com.myapp' } },
      { platform: 'android', options: { framework: 'compose', packageName: 'com.myapp' } },
      { platform: 'web', options: { framework: 'nextjs' } }
    ]
  })
})

// Descargar los archivos generados
const { exports } = await result.json()
exports.forEach(e => console.log(e.downloadUrl))`,
}

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border border-border bg-muted/50 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
        <span className="text-xs text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Documentación</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Todo lo que necesitas para crear apps nativas con HubLab
          </p>

          <div className="mt-8 relative max-w-xl">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Buscar en la documentación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-3 pl-12 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="max-w-3xl space-y-16">
            {/* Introducción */}
            <section id="introduccion">
              <h2 className="text-3xl font-bold">Introducción</h2>
              <p className="mt-4 text-muted-foreground">
                HubLab es un generador de código nativo multi-plataforma. A diferencia de frameworks como
                React Native o Flutter, HubLab genera <strong className="text-foreground">código nativo puro</strong> para
                cada plataforma: SwiftUI para iOS, Jetpack Compose para Android, React para Web, y Tauri para Desktop.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: IconApple, platform: 'iOS', tech: 'SwiftUI 5.0', color: 'text-blue-500' },
                  { icon: IconAndroid, platform: 'Android', tech: 'Jetpack Compose', color: 'text-green-500' },
                  { icon: IconGlobe, platform: 'Web', tech: 'React + TypeScript', color: 'text-purple-500' },
                  { icon: IconDesktop, platform: 'Desktop', tech: 'Tauri + Rust', color: 'text-orange-500' },
                ].map((item) => (
                  <div key={item.platform} className="flex items-center gap-3 rounded-lg border border-border p-4">
                    <item.icon className={item.color} size={24} />
                    <div>
                      <div className="font-medium">{item.platform}</div>
                      <div className="text-sm text-muted-foreground">{item.tech}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instalación */}
            <section id="instalacion">
              <h2 className="text-3xl font-bold">Instalación</h2>
              <p className="mt-4 text-muted-foreground">
                HubLab se puede usar de dos formas: mediante el dashboard web o instalando el CLI localmente.
              </p>

              <h3 className="mt-8 text-xl font-semibold">Instalación local</h3>
              <div className="mt-4">
                <CodeBlock code={codeExamples.install} language="bash" />
              </div>

              <h3 className="mt-8 text-xl font-semibold">Requisitos</h3>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <IconCheck className="text-green-500" size={16} />
                  Node.js 18.0 o superior
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="text-green-500" size={16} />
                  npm, yarn o pnpm
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="text-green-500" size={16} />
                  Para iOS: Xcode 15+ y macOS 13+
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="text-green-500" size={16} />
                  Para Android: Android Studio Hedgehog+
                </li>
              </ul>
            </section>

            {/* Primer Proyecto */}
            <section id="primer-proyecto">
              <h2 className="text-3xl font-bold">Tu Primer Proyecto</h2>
              <p className="mt-4 text-muted-foreground">
                Crear un proyecto con HubLab es simple. Puedes hacerlo desde el dashboard o via API.
              </p>

              <h3 className="mt-8 text-xl font-semibold">1. Crear el proyecto</h3>
              <div className="mt-4">
                <CodeBlock code={codeExamples.createProject} language="typescript" />
              </div>

              <h3 className="mt-8 text-xl font-semibold">2. Añadir cápsulas</h3>
              <p className="mt-2 text-muted-foreground">
                Las cápsulas son componentes reutilizables que generan código nativo para cada plataforma.
              </p>
              <div className="mt-4">
                <CodeBlock code={codeExamples.addCapsule} language="typescript" />
              </div>

              <h3 className="mt-8 text-xl font-semibold">3. Exportar a nativo</h3>
              <div className="mt-4">
                <CodeBlock code={codeExamples.exportNative} language="typescript" />
              </div>
            </section>

            {/* Conceptos */}
            <section id="conceptos">
              <h2 className="text-3xl font-bold">Conceptos Clave</h2>

              <div className="mt-8 space-y-6">
                <div className="rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconLayers size={20} />
                    </div>
                    <h3 className="text-xl font-semibold">Cápsulas</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Las cápsulas son la unidad fundamental de HubLab. Cada cápsula define un componente
                    con implementaciones nativas para iOS, Android, Web y Desktop. Actualmente hay 53 cápsulas
                    disponibles, desde botones simples hasta componentes complejos como Kanban boards.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconCode size={20} />
                    </div>
                    <h3 className="text-xl font-semibold">Compiladores</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    HubLab incluye compiladores especializados para cada plataforma. El compilador iOS genera
                    SwiftUI, el de Android genera Jetpack Compose, etc. Cada compilador conoce las mejores
                    prácticas y patrones de su plataforma.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconZap size={20} />
                    </div>
                    <h3 className="text-xl font-semibold">Temas</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Los temas definen colores, tipografía y espaciado. Al exportar, HubLab adapta el tema
                    a cada plataforma: usa el sistema de colores de SwiftUI para iOS, MaterialTheme para
                    Android, y CSS variables para Web.
                  </p>
                </div>
              </div>
            </section>

            {/* Cápsulas */}
            <section id="capsulas">
              <h2 className="text-3xl font-bold">Cápsulas</h2>
              <p className="mt-4 text-muted-foreground">
                Las cápsulas son componentes pre-construidos con implementaciones nativas para cada plataforma.
                Cada cápsula incluye múltiples variantes y es completamente personalizable.
              </p>

              <div className="mt-8 rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Categoría</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Cápsulas</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Ejemplos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">UI Components</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">12</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">Button, Card, Avatar, Badge</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Navigation</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">8</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">Tabs, Modal, BottomSheet</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Forms</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">10</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">Input, Dropdown, DatePicker</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Data Display</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">6</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">Table, Chart, Calendar</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Media</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">6</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">Video, Audio, Map</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Device & Native</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">7</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">Camera, Biometrics, Location</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <Link
                  href="/dashboard/capsules"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  Ver catálogo completo de cápsulas
                  <IconChevronRight size={16} />
                </Link>
              </div>
            </section>

            {/* Plataformas */}
            <section id="ios">
              <h2 className="text-3xl font-bold">iOS (SwiftUI)</h2>
              <p className="mt-4 text-muted-foreground">
                HubLab genera código SwiftUI 5.0 compatible con iOS 15+. El código generado sigue las
                guías de estilo de Apple y usa las APIs nativas más recientes.
              </p>

              <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Características iOS</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• SwiftUI con @Observable (iOS 17+) o @StateObject (iOS 15+)</li>
                  <li>• Soporte para iOS, iPadOS, watchOS y visionOS</li>
                  <li>• Integración con LocalAuthentication, CoreLocation, AVFoundation</li>
                  <li>• Sign in with Apple, HealthKit, Apple Pay</li>
                </ul>
              </div>
            </section>

            <section id="android">
              <h2 className="text-3xl font-bold">Android (Jetpack Compose)</h2>
              <p className="mt-4 text-muted-foreground">
                Genera código Kotlin con Jetpack Compose y Material 3. Compatible con API 24+ (Android 7.0).
              </p>

              <div className="mt-6 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <h4 className="font-medium text-green-700 dark:text-green-300">Características Android</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Jetpack Compose con Material 3</li>
                  <li>• Arquitectura MVVM con ViewModel y StateFlow</li>
                  <li>• CameraX, BiometricPrompt, FusedLocationProvider</li>
                  <li>• Soporte para Wear OS</li>
                </ul>
              </div>
            </section>

            {/* Next Steps */}
            <section className="rounded-xl border border-border bg-muted/30 p-8">
              <h2 className="text-2xl font-bold">Siguientes Pasos</h2>
              <p className="mt-2 text-muted-foreground">
                Ahora que conoces los conceptos básicos, explora más recursos:
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/docs/api"
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:border-primary transition-colors"
                >
                  <div>
                    <div className="font-medium">API Reference</div>
                    <div className="text-sm text-muted-foreground">Documentación completa de la API</div>
                  </div>
                  <IconChevronRight size={20} className="text-muted-foreground" />
                </Link>

                <Link
                  href="/dashboard/capsules"
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:border-primary transition-colors"
                >
                  <div>
                    <div className="font-medium">Catálogo de Cápsulas</div>
                    <div className="text-sm text-muted-foreground">Explora los 53 componentes</div>
                  </div>
                  <IconChevronRight size={20} className="text-muted-foreground" />
                </Link>

                <Link
                  href="/showcase"
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:border-primary transition-colors"
                >
                  <div>
                    <div className="font-medium">Showcase</div>
                    <div className="text-sm text-muted-foreground">Apps creadas con HubLab</div>
                  </div>
                  <IconChevronRight size={20} className="text-muted-foreground" />
                </Link>

                <a
                  href="https://github.com/hublabdev/hublab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:border-primary transition-colors"
                >
                  <div>
                    <div className="font-medium">GitHub</div>
                    <div className="text-sm text-muted-foreground">Código fuente y contribuciones</div>
                  </div>
                  <IconChevronRight size={20} className="text-muted-foreground" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
