'use client'

import { useState, useCallback } from 'react'
import type { Project, NativeExportTarget, NativeExportResult } from '../../types/api'

// Simple code generators for export preview
function generateIOSCode(project: Project): { path: string; content: string }[] {
  const appName = project.name.replace(/\s+/g, '')
  return [
    {
      path: `${appName}App.swift`,
      content: `import SwiftUI

@main
struct ${appName}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`,
    },
    {
      path: 'ContentView.swift',
      content: `import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    // Generated capsules
                }
                .padding()
            }
            .navigationTitle("${project.name}")
        }
    }
}`,
    },
  ]
}

function generateAndroidCode(project: Project): { path: string; content: string }[] {
  const packageName = project.name.toLowerCase().replace(/\s+/g, '')
  return [
    {
      path: 'MainActivity.kt',
      content: `package com.hublab.${packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MainScreen()
        }
    }
}`,
    },
  ]
}

function generateWebCode(project: Project): { path: string; content: string }[] {
  const appName = project.name.replace(/\s+/g, '')
  return [
    {
      path: 'App.tsx',
      content: `'use client'

import React from 'react'

export default function ${appName}App() {
  return (
    <div className="min-h-screen">
      <h1>${project.name}</h1>
    </div>
  )
}`,
    },
  ]
}

function generateDesktopCode(project: Project): { path: string; content: string }[] {
  return [
    {
      path: 'main.rs',
      content: `fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running application");
}`,
    },
  ]
}

interface ExportState {
  isExporting: boolean
  progress: number
  currentPlatform: string | null
  results: NativeExportResult[]
  error: string | null
}

export function useExport() {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    currentPlatform: null,
    results: [],
    error: null,
  })

  const exportProject = useCallback(async (
    project: Project,
    targets: NativeExportTarget[]
  ): Promise<NativeExportResult[]> => {
    setState(prev => ({
      ...prev,
      isExporting: true,
      progress: 0,
      results: [],
      error: null,
    }))

    const results: NativeExportResult[] = []
    const totalTargets = targets.length

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]

      setState(prev => ({
        ...prev,
        currentPlatform: target.platform,
        progress: (i / totalTargets) * 100,
      }))

      try {
        let files: { path: string; content: string }[] = []

        // Simulate compilation delay
        await new Promise(resolve => setTimeout(resolve, 500))

        switch (target.platform) {
          case 'ios':
            files = generateIOSCode(project)
            break
          case 'android':
            files = generateAndroidCode(project)
            break
          case 'web':
            files = generateWebCode(project)
            break
          case 'desktop':
            files = generateDesktopCode(project)
            break
        }

        const totalSize = files.reduce((acc, f) => acc + f.content.length, 0)

        results.push({
          platform: target.platform,
          success: true,
          fileCount: files.length,
          totalSize,
          downloadUrl: `data:application/zip;base64,${btoa(JSON.stringify(files))}`,
        })
      } catch (e) {
        results.push({
          platform: target.platform,
          success: false,
          fileCount: 0,
          totalSize: 0,
          errors: [e instanceof Error ? e.message : 'Export failed'],
        })
      }
    }

    setState(prev => ({
      ...prev,
      isExporting: false,
      progress: 100,
      currentPlatform: null,
      results,
    }))

    return results
  }, [])

  const reset = useCallback(() => {
    setState({
      isExporting: false,
      progress: 0,
      currentPlatform: null,
      results: [],
      error: null,
    })
  }, [])

  return {
    ...state,
    exportProject,
    reset,
  }
}

// Helper to generate downloadable zip
export async function generateZip(files: { path: string; content: string }[]): Promise<Blob> {
  // Using JSZip would be ideal here, but for demo we'll create a simple blob
  const content = files.map(f => `// ${f.path}\n${f.content}`).join('\n\n// ---\n\n')
  return new Blob([content], { type: 'text/plain' })
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
