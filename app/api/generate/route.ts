import { NextRequest, NextResponse } from 'next/server'

/**
 * HubLab Project Generation API
 *
 * POST /api/generate
 *
 * Accepts a HubLab project JSON and returns generated code for specified platforms.
 * This endpoint enables AI assistants to programmatically generate native apps.
 *
 * Request body should match the schema at /api/schema
 */

interface ProjectSpec {
  name: string
  description?: string
  version: string
  targets: ('web' | 'ios' | 'android' | 'desktop')[]
  screens: ScreenSpec[]
  navigation?: {
    type: 'stack' | 'tabs' | 'drawer'
    initialScreen?: string
  }
  theme: ThemeSpec
  platformConfig?: {
    web?: { framework?: string; typescript?: boolean; styling?: string }
    ios?: { bundleId: string; teamId?: string; minVersion?: string }
    android?: { packageName: string; minSdk?: number; targetSdk?: number }
    desktop?: { targets?: string[] }
  }
}

interface ScreenSpec {
  id: string
  name: string
  path?: string
  root: CapsuleInstance
}

interface CapsuleInstance {
  id: string
  capsuleId: string
  props: Record<string, unknown>
  children?: CapsuleInstance[]
}

interface ThemeSpec {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface?: string
    text?: { primary?: string; secondary?: string }
  }
}

interface GeneratedFile {
  path: string
  content: string
  language: string
}

interface GenerationResult {
  success: boolean
  platform: string
  files: GeneratedFile[]
  metadata: {
    capsuleCount: number
    screenCount: number
    generatedAt: string
  }
}

// Simple code generators for demonstration
function generateSwiftUI(project: ProjectSpec): GeneratedFile[] {
  const files: GeneratedFile[] = []

  // Generate main App file
  files.push({
    path: `${project.name}App.swift`,
    language: 'swift',
    content: `
import SwiftUI

@main
struct ${project.name.replace(/\s+/g, '')}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
`.trim()
  })

  // Generate ContentView with navigation
  const navType = project.navigation?.type || 'stack'
  const initialScreen = project.navigation?.initialScreen || project.screens[0]?.id

  let contentViewBody = ''
  if (navType === 'tabs' && project.screens.length > 1) {
    contentViewBody = `
    TabView {
        ${project.screens.map(s => `
        ${s.id.charAt(0).toUpperCase() + s.id.slice(1)}View()
            .tabItem {
                Label("${s.name}", systemImage: "star")
            }
        `).join('\n')}
    }
    `.trim()
  } else {
    contentViewBody = `
    NavigationStack {
        ${initialScreen ? `${initialScreen.charAt(0).toUpperCase() + initialScreen.slice(1)}View()` : 'Text("Welcome")'}
    }
    `.trim()
  }

  files.push({
    path: 'ContentView.swift',
    language: 'swift',
    content: `
import SwiftUI

struct ContentView: View {
    var body: some View {
        ${contentViewBody}
    }
}

#Preview {
    ContentView()
}
`.trim()
  })

  // Generate screen views
  for (const screen of project.screens) {
    const screenContent = generateSwiftUIComponent(screen.root, project.theme)
    files.push({
      path: `${screen.id.charAt(0).toUpperCase() + screen.id.slice(1)}View.swift`,
      language: 'swift',
      content: `
import SwiftUI

struct ${screen.id.charAt(0).toUpperCase() + screen.id.slice(1)}View: View {
    var body: some View {
        ${screenContent}
            .navigationTitle("${screen.name}")
    }
}

#Preview {
    NavigationStack {
        ${screen.id.charAt(0).toUpperCase() + screen.id.slice(1)}View()
    }
}
`.trim()
    })
  }

  return files
}

function generateSwiftUIComponent(instance: CapsuleInstance, theme: ThemeSpec): string {
  const { capsuleId, props, children } = instance

  switch (capsuleId) {
    case 'button':
      return `
        Button(action: { /* ${props.onPress || 'action'} */ }) {
            Text("${props.text || 'Button'}")
        }
        .buttonStyle(.borderedProminent)
      `.trim()

    case 'text':
      return `Text("${props.content || props.text || ''}")`

    case 'input':
      return `
        TextField("${props.placeholder || ''}", text: .constant(""))
            .textFieldStyle(.roundedBorder)
      `.trim()

    case 'card':
      const cardChildren = children?.map(c => generateSwiftUIComponent(c, theme)).join('\n                ') || ''
      return `
        VStack(alignment: .leading, spacing: 16) {
            ${props.title ? `Text("${props.title}").font(.headline)` : ''}
            ${cardChildren}
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 4)
      `.trim()

    case 'list':
      return `
        List {
            ForEach(0..<5, id: \\.self) { index in
                Text("Item \\(index + 1)")
            }
        }
        .listStyle(.plain)
      `.trim()

    case 'chart':
      return `
        // Chart requires iOS 16+ and Charts framework
        Chart {
            // Add chart data here
        }
        .frame(height: 200)
      `.trim()

    case 'progress':
      return `
        ProgressView(value: ${props.value || 0.5})
            .progressViewStyle(.linear)
      `.trim()

    case 'switch':
      return `
        Toggle("${props.label || ''}", isOn: .constant(${props.checked || false}))
      `.trim()

    case 'image':
      return `
        AsyncImage(url: URL(string: "${props.src || ''}")) { image in
            image.resizable().aspectRatio(contentMode: .fit)
        } placeholder: {
            ProgressView()
        }
      `.trim()

    default:
      // Generate VStack for unknown components with children
      if (children && children.length > 0) {
        const childContent = children.map(c => generateSwiftUIComponent(c, theme)).join('\n            ')
        return `
        VStack(spacing: 16) {
            ${childContent}
        }
        `.trim()
      }
      return `Text("${capsuleId}") // TODO: Implement ${capsuleId}`
  }
}

function generateJetpackCompose(project: ProjectSpec): GeneratedFile[] {
  const files: GeneratedFile[] = []
  const packageName = project.platformConfig?.android?.packageName || 'com.hublab.app'

  // Generate MainActivity
  files.push({
    path: 'MainActivity.kt',
    language: 'kotlin',
    content: `
package ${packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import ${packageName}.ui.theme.${project.name.replace(/\s+/g, '')}Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ${project.name.replace(/\s+/g, '')}Theme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    MainContent()
                }
            }
        }
    }
}

@Composable
fun MainContent() {
    ${project.screens[0]?.id ? `${project.screens[0].id.charAt(0).toUpperCase() + project.screens[0].id.slice(1)}Screen()` : 'Text("Welcome")'}
}
`.trim()
  })

  // Generate screen composables
  for (const screen of project.screens) {
    const screenContent = generateComposeComponent(screen.root, project.theme)
    files.push({
      path: `${screen.id.charAt(0).toUpperCase() + screen.id.slice(1)}Screen.kt`,
      language: 'kotlin',
      content: `
package ${packageName}.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ${screen.id.charAt(0).toUpperCase() + screen.id.slice(1)}Screen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ${screenContent}
    }
}
`.trim()
    })
  }

  return files
}

function generateComposeComponent(instance: CapsuleInstance, theme: ThemeSpec): string {
  const { capsuleId, props, children } = instance

  switch (capsuleId) {
    case 'button':
      return `
        Button(onClick = { /* ${props.onPress || 'action'} */ }) {
            Text("${props.text || 'Button'}")
        }
      `.trim()

    case 'text':
      return `Text("${props.content || props.text || ''}")`

    case 'input':
      return `
        var text by remember { mutableStateOf("") }
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("${props.label || ''}") },
            placeholder = { Text("${props.placeholder || ''}") },
            modifier = Modifier.fillMaxWidth()
        )
      `.trim()

    case 'card':
      const cardChildren = children?.map(c => generateComposeComponent(c, theme)).join('\n            ') || ''
      return `
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                ${props.title ? `Text("${props.title}", style = MaterialTheme.typography.titleMedium)` : ''}
                ${cardChildren}
            }
        }
      `.trim()

    case 'list':
      return `
        LazyColumn {
            items(5) { index ->
                ListItem(
                    headlineContent = { Text("Item \${index + 1}") }
                )
            }
        }
      `.trim()

    case 'progress':
      return `
        LinearProgressIndicator(
            progress = { ${(props.value as number || 50) / 100}f },
            modifier = Modifier.fillMaxWidth()
        )
      `.trim()

    case 'switch':
      return `
        var checked by remember { mutableStateOf(${props.checked || false}) }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("${props.label || ''}")
            Spacer(Modifier.weight(1f))
            Switch(checked = checked, onCheckedChange = { checked = it })
        }
      `.trim()

    default:
      if (children && children.length > 0) {
        const childContent = children.map(c => generateComposeComponent(c, theme)).join('\n        Spacer(Modifier.height(8.dp))\n        ')
        return `
        Column {
            ${childContent}
        }
        `.trim()
      }
      return `Text("${capsuleId}") // TODO: Implement ${capsuleId}`
  }
}

function generateReact(project: ProjectSpec): GeneratedFile[] {
  const files: GeneratedFile[] = []

  // Generate main App component
  files.push({
    path: 'App.tsx',
    language: 'typescript',
    content: `
import React from 'react'
${project.screens.map(s => `import ${s.id.charAt(0).toUpperCase() + s.id.slice(1)}Page from './pages/${s.id}'`).join('\n')}

export default function App() {
  return (
    <div className="min-h-screen bg-[${project.theme.colors.background}]">
      <${project.screens[0]?.id.charAt(0).toUpperCase()}${project.screens[0]?.id.slice(1) || ''}Page />
    </div>
  )
}
`.trim()
  })

  // Generate page components
  for (const screen of project.screens) {
    const pageContent = generateReactComponent(screen.root, project.theme)
    files.push({
      path: `pages/${screen.id}.tsx`,
      language: 'typescript',
      content: `
import React from 'react'

export default function ${screen.id.charAt(0).toUpperCase() + screen.id.slice(1)}Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">${screen.name}</h1>
      ${pageContent}
    </div>
  )
}
`.trim()
    })
  }

  // Generate tailwind config
  files.push({
    path: 'tailwind.config.js',
    language: 'javascript',
    content: `
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '${project.theme.colors.primary}',
        secondary: '${project.theme.colors.secondary}',
      }
    }
  },
  plugins: []
}
`.trim()
  })

  return files
}

function generateReactComponent(instance: CapsuleInstance, theme: ThemeSpec): string {
  const { capsuleId, props, children } = instance

  switch (capsuleId) {
    case 'button':
      return `
      <button
        onClick={() => { /* ${props.onPress || 'action'} */ }}
        className="px-4 py-2 bg-[${theme.colors.primary}] text-white rounded-lg hover:opacity-90"
      >
        ${props.text || 'Button'}
      </button>
      `.trim()

    case 'text':
      return `<p>${props.content || props.text || ''}</p>`

    case 'input':
      return `
      <input
        type="${props.type || 'text'}"
        placeholder="${props.placeholder || ''}"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[${theme.colors.primary}]"
      />
      `.trim()

    case 'card':
      const cardChildren = children?.map(c => generateReactComponent(c, theme)).join('\n        ') || ''
      return `
      <div className="bg-white rounded-xl shadow-md p-4">
        ${props.title ? `<h3 className="text-lg font-semibold mb-2">${props.title}</h3>` : ''}
        ${cardChildren}
      </div>
      `.trim()

    case 'list':
      return `
      <ul className="divide-y">
        {[1, 2, 3, 4, 5].map(i => (
          <li key={i} className="py-3">Item {i}</li>
        ))}
      </ul>
      `.trim()

    default:
      if (children && children.length > 0) {
        const childContent = children.map(c => generateReactComponent(c, theme)).join('\n      ')
        return `
      <div className="space-y-4">
        ${childContent}
      </div>
        `.trim()
      }
      return `<div>{/* TODO: ${capsuleId} */}</div>`
  }
}

function countCapsules(instance: CapsuleInstance): number {
  let count = 1
  if (instance.children) {
    for (const child of instance.children) {
      count += countCapsules(child)
    }
  }
  return count
}

export async function POST(request: NextRequest) {
  try {
    const project: ProjectSpec = await request.json()

    // Validate required fields
    if (!project.name || !project.targets || !project.screens || !project.theme) {
      return NextResponse.json(
        { error: 'Missing required fields: name, targets, screens, theme' },
        { status: 400 }
      )
    }

    const results: GenerationResult[] = []

    // Count total capsules across all screens
    let totalCapsules = 0
    for (const screen of project.screens) {
      totalCapsules += countCapsules(screen.root)
    }

    // Generate code for each target platform
    for (const target of project.targets) {
      let files: GeneratedFile[] = []

      switch (target) {
        case 'ios':
          files = generateSwiftUI(project)
          break
        case 'android':
          files = generateJetpackCompose(project)
          break
        case 'web':
        case 'desktop':
          files = generateReact(project)
          break
      }

      results.push({
        success: true,
        platform: target,
        files,
        metadata: {
          capsuleCount: totalCapsules,
          screenCount: project.screens.length,
          generatedAt: new Date().toISOString()
        }
      })
    }

    return NextResponse.json({
      success: true,
      project: {
        name: project.name,
        version: project.version,
        description: project.description
      },
      results,
      summary: {
        totalPlatforms: results.length,
        totalFiles: results.reduce((sum, r) => sum + r.files.length, 0),
        totalCapsules,
        totalScreens: project.screens.length
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Invalid project specification', details: String(error) },
      { status: 400 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/generate',
    method: 'POST',
    description: 'Generate native code from HubLab project specification',
    schema: '/api/schema',
    example: {
      name: 'My App',
      version: '1.0.0',
      targets: ['web', 'ios', 'android'],
      theme: {
        name: 'Default',
        colors: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          background: '#FFFFFF'
        }
      },
      screens: [
        {
          id: 'home',
          name: 'Home',
          root: {
            id: 'container',
            capsuleId: 'card',
            props: { title: 'Welcome' },
            children: [
              {
                id: 'cta',
                capsuleId: 'button',
                props: { text: 'Get Started', onPress: 'navigate' }
              }
            ]
          }
        }
      ]
    }
  })
}
