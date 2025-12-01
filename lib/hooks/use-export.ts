'use client'

import { useState, useCallback } from 'react'
import { compileToiOS } from '../compiler/ios'
import { compileToAndroid } from '../compiler/android'
import { compileToWeb } from '../compiler/web'
import { compileToDesktop } from '../compiler/desktop'
import type { Project, NativeExportTarget, NativeExportResult } from '../../types/api'

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
            files = compileToiOS(project)
            break
          case 'android':
            files = compileToAndroid(project)
            break
          case 'web':
            files = compileToWeb(project)
            break
          case 'desktop':
            files = compileToDesktop(project)
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
