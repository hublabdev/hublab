'use client'

import React from 'react'
import Link from 'next/link'
import {
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconCode,
  IconZap,
  IconLayers,
  IconChevronRight,
  IconCheck,
  IconGitHub,
} from '../../components/ui/icons'

const platforms = [
  { name: 'iOS', framework: 'SwiftUI', icon: IconApple, color: 'bg-blue-500' },
  { name: 'Android', framework: 'Jetpack Compose', icon: IconAndroid, color: 'bg-green-500' },
  { name: 'Web', framework: 'React + Tailwind', icon: IconGlobe, color: 'bg-purple-500' },
  { name: 'Desktop', framework: 'Tauri', icon: IconDesktop, color: 'bg-orange-500' },
]

const features = [
  {
    icon: IconCode,
    title: 'Código Nativo Real',
    description: 'No wrappers, no bridges. Genera SwiftUI para iOS, Jetpack Compose para Android, React para Web.',
  },
  {
    icon: IconLayers,
    title: '53 Cápsulas Incluidas',
    description: 'Desde botones hasta Kanban boards. Cada componente genera código nativo optimizado para cada plataforma.',
  },
  {
    icon: IconZap,
    title: 'Exportación Instantánea',
    description: 'Exporta proyectos completos listos para compilar. Incluye estructura, dependencias y configuración.',
  },
]

const capsuleCategories = [
  { name: 'UI Components', count: 12, examples: 'Button, Card, Avatar, Badge' },
  { name: 'Navigation', count: 8, examples: 'Tabs, Modal, BottomSheet, Carousel' },
  { name: 'Forms', count: 10, examples: 'Input, Dropdown, DatePicker, Signature' },
  { name: 'Data Display', count: 6, examples: 'Table, Chart, Timeline, Calendar' },
  { name: 'Media', count: 6, examples: 'Video, Audio, Map, PDFViewer' },
  { name: 'Device & Native', count: 7, examples: 'Camera, Biometrics, Location, Push' },
]

const codeExamples = {
  capsule: `// Define una vez
const LoginScreen = {
  type: 'auth-screen',
  props: {
    providers: ['email', 'google', 'apple'],
    theme: 'modern-blue'
  }
}`,
  swift: `// Genera SwiftUI
struct LoginView: View {
  @State private var email = ""

  var body: some View {
    VStack(spacing: 16) {
      TextField("Email", text: $email)
        .textFieldStyle(.roundedBorder)

      SignInWithAppleButton(.signIn) { ... }
    }
  }
}`,
  kotlin: `// Genera Jetpack Compose
@Composable
fun LoginScreen() {
  var email by remember { mutableStateOf("") }

  Column(modifier = Modifier.padding(16.dp)) {
    OutlinedTextField(
      value = email,
      onValueChange = { email = it },
      label = { Text("Email") }
    )

    GoogleSignInButton(onClick = { ... })
  }
}`,
}

export default function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <span>v1.0 disponible</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">53 cápsulas</span>
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Escribe una vez,
              <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                despliega en todas partes
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Genera apps nativas para iOS, Android, Web y Desktop desde una única definición.
              <strong className="text-foreground"> Código nativo real</strong>, no wrappers ni bridges.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Empezar Gratis
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

            {/* Platform Icons */}
            <div className="mt-16 flex items-center justify-center gap-6">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex flex-col items-center gap-2">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${platform.color} text-white shadow-lg`}>
                    <platform.icon size={28} />
                  </div>
                  <div className="text-sm font-medium">{platform.name}</div>
                  <div className="text-xs text-muted-foreground">{platform.framework}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Demo */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Una definición, múltiples plataformas</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Define tus componentes una vez y genera código nativo para cada plataforma
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
                <IconLayers size={16} />
                Cápsula HubLab
              </div>
              <pre className="text-xs overflow-x-auto">
                <code className="text-muted-foreground">{codeExamples.capsule}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-500 mb-3">
                <IconApple size={16} />
                iOS (SwiftUI)
              </div>
              <pre className="text-xs overflow-x-auto">
                <code className="text-muted-foreground">{codeExamples.swift}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-green-500 mb-3">
                <IconAndroid size={16} />
                Android (Compose)
              </div>
              <pre className="text-xs overflow-x-auto">
                <code className="text-muted-foreground">{codeExamples.kotlin}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">¿Por qué HubLab?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              La única solución que genera código nativo real para todas las plataformas
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-background p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capsule Categories */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">53 Cápsulas Nativas</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Componentes listos para usar, cada uno con implementación nativa para todas las plataformas
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capsuleCategories.map((category) => (
              <div key={category.name} className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                    {category.count}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{category.examples}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/dashboard/capsules"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Ver todas las cápsulas
              <IconChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">HubLab vs Otras Soluciones</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              La diferencia está en el código generado
            </p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-6 text-left font-semibold">Característica</th>
                  <th className="py-4 px-6 text-center font-semibold text-primary">HubLab</th>
                  <th className="py-4 px-6 text-center font-semibold text-muted-foreground">React Native</th>
                  <th className="py-4 px-6 text-center font-semibold text-muted-foreground">Flutter</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Código 100% nativo', true, false, false],
                  ['Sin runtime extra', true, false, false],
                  ['SwiftUI para iOS', true, false, false],
                  ['Jetpack Compose para Android', true, false, false],
                  ['Tamaño de app optimizado', true, false, false],
                  ['Rendimiento nativo', true, 'Parcial', 'Parcial'],
                  ['Acceso a APIs nativas', true, true, true],
                  ['Hot reload', false, true, true],
                ].map(([feature, hublab, rn, flutter]) => (
                  <tr key={feature as string} className="border-b border-border">
                    <td className="py-4 px-6 text-sm">{feature}</td>
                    <td className="py-4 px-6 text-center">
                      {hublab === true ? (
                        <IconCheck className="inline text-green-500" size={20} />
                      ) : hublab === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{hublab}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {rn === true ? (
                        <IconCheck className="inline text-green-500" size={20} />
                      ) : rn === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{rn}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {flutter === true ? (
                        <IconCheck className="inline text-green-500" size={20} />
                      ) : flutter === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{flutter}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-b from-primary/5 to-transparent py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Empieza a generar apps nativas hoy
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Open source, gratis para siempre. Sin tarjeta de crédito.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Crear Proyecto Gratis
              <IconChevronRight size={20} />
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 rounded-lg border border-border px-8 py-4 text-lg font-medium hover:bg-muted transition-colors"
            >
              Ver Documentación
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Usado por desarrolladores en todo el mundo
          </p>
        </div>
      </section>
    </div>
  )
}
