'use client'

import React, { useState, useMemo } from 'react'
import {
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconCopy,
  IconCheck,
  IconCode,
} from './icons'

type Platform = 'ios' | 'android' | 'web' | 'desktop'

interface CodePreviewProps {
  code: Record<Platform, string>
  fileName?: Record<Platform, string>
  className?: string
}

const platformConfig: Record<Platform, {
  icon: React.ComponentType<{ className?: string; size?: number }>
  label: string
  language: string
  color: string
}> = {
  ios: {
    icon: IconApple,
    label: 'SwiftUI',
    language: 'swift',
    color: 'text-blue-500',
  },
  android: {
    icon: IconAndroid,
    label: 'Compose',
    language: 'kotlin',
    color: 'text-green-500',
  },
  web: {
    icon: IconGlobe,
    label: 'React',
    language: 'tsx',
    color: 'text-purple-500',
  },
  desktop: {
    icon: IconDesktop,
    label: 'Tauri',
    language: 'rust',
    color: 'text-orange-500',
  },
}

// Simple syntax highlighting (no external dependencies)
function highlightCode(code: string, language: string): React.ReactNode[] {
  const lines = code.split('\n')

  const keywords: Record<string, string[]> = {
    swift: ['import', 'struct', 'var', 'let', 'func', 'return', 'if', 'else', 'for', 'in', 'true', 'false', 'nil', 'self', 'some', 'private', 'public', 'static', '@State', '@Binding', '@ObservedObject', '@Published', '@Environment', 'View', 'body', 'Button', 'Text', 'VStack', 'HStack', 'ZStack', 'Image', 'List', 'NavigationView', 'NavigationLink'],
    kotlin: ['import', 'package', 'fun', 'val', 'var', 'class', 'object', 'return', 'if', 'else', 'for', 'in', 'true', 'false', 'null', 'this', 'private', 'public', 'internal', '@Composable', '@Preview', 'remember', 'mutableStateOf', 'Column', 'Row', 'Box', 'Text', 'Button', 'Image', 'LazyColumn', 'Scaffold', 'TopAppBar', 'Modifier'],
    tsx: ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'of', 'true', 'false', 'null', 'undefined', 'this', 'async', 'await', 'default', 'interface', 'type', 'extends', 'implements', 'React', 'useState', 'useEffect', 'useMemo', 'useCallback', 'useRef'],
    rust: ['use', 'mod', 'pub', 'fn', 'let', 'mut', 'const', 'struct', 'impl', 'return', 'if', 'else', 'for', 'in', 'true', 'false', 'None', 'Some', 'self', 'Self', 'async', 'await', 'move', 'dyn', 'Box', 'Vec', 'String', 'Option', 'Result', 'Ok', 'Err'],
  }

  const langKeywords = keywords[language] || keywords.tsx

  return lines.map((line, lineIndex) => {
    // Highlight strings
    let highlighted = line.replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
    highlighted = highlighted.replace(/'([^']*)'/g, '<span class="text-green-400">\'$1\'</span>')

    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*)$/g, '<span class="text-gray-500">$1</span>')
    highlighted = highlighted.replace(/(#.*)$/g, '<span class="text-gray-500">$1</span>')

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-yellow-400">$1</span>')

    // Highlight keywords
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
      highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-medium">$1</span>')
    })

    // Highlight decorators/annotations
    highlighted = highlighted.replace(/(@\w+)/g, '<span class="text-yellow-300">$1</span>')

    // Highlight types (capitalized words)
    highlighted = highlighted.replace(/\b([A-Z][a-zA-Z0-9]*)\b(?![^<]*>)/g, '<span class="text-cyan-400">$1</span>')

    return (
      <div key={lineIndex} className="table-row">
        <span className="table-cell pr-4 text-right text-gray-500 select-none w-8">
          {lineIndex + 1}
        </span>
        <span
          className="table-cell"
          dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
        />
      </div>
    )
  })
}

export function CodePreview({ code, fileName, className = '' }: CodePreviewProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>('ios')
  const [copied, setCopied] = useState(false)

  const availablePlatforms = useMemo(() => {
    return (Object.keys(code) as Platform[]).filter(p => code[p])
  }, [code])

  const handleCopy = () => {
    navigator.clipboard.writeText(code[activePlatform])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentConfig = platformConfig[activePlatform]
  const currentCode = code[activePlatform] || ''
  const currentFileName = fileName?.[activePlatform] || `Component.${currentConfig.language}`

  if (availablePlatforms.length === 0) {
    return (
      <div className={`rounded-xl border border-border bg-background p-8 text-center ${className}`}>
        <IconCode size={32} className="mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No hay código para mostrar</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-border bg-[#1e1e2e] overflow-hidden ${className}`}>
      {/* Header with platform tabs */}
      <div className="flex items-center justify-between border-b border-[#313244] bg-[#181825] px-4">
        <div className="flex items-center gap-1">
          {availablePlatforms.map((platform) => {
            const config = platformConfig[platform]
            const Icon = config.icon
            const isActive = platform === activePlatform
            return (
              <button
                key={platform}
                type="button"
                onClick={() => setActivePlatform(platform)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-b-2 border-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={14} className={isActive ? config.color : ''} />
                {config.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{currentFileName}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-[#313244] hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <IconCheck size={12} className="text-green-400" />
                Copiado
              </>
            ) : (
              <>
                <IconCopy size={12} />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed text-gray-300">
          <code className="table">
            {highlightCode(currentCode, currentConfig.language)}
          </code>
        </pre>
      </div>

      {/* Footer with stats */}
      <div className="flex items-center justify-between border-t border-[#313244] bg-[#181825] px-4 py-2 text-xs text-gray-500">
        <span>{currentCode.split('\n').length} líneas</span>
        <span>{currentConfig.language.toUpperCase()}</span>
      </div>
    </div>
  )
}

// Hook to generate code preview from capsules
export function useCodePreview(capsuleType: string, props: Record<string, any> = {}) {
  return useMemo(() => {
    const propsString = Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') return `${key}="${value}"`
        if (typeof value === 'boolean') return value ? key : ''
        return `${key}={${JSON.stringify(value)}}`
      })
      .filter(Boolean)
      .join('\n    ')

    const code: Record<Platform, string> = {
      ios: `import SwiftUI

struct ${capsuleType}View: View {
    @State private var isLoading = false

    var body: some View {
        VStack(spacing: 16) {
            ${capsuleType}(
                ${propsString.replace(/=/g, ': ').replace(/"/g, '"')}
            )
            .padding()
        }
        .navigationTitle("${capsuleType}")
    }
}

#Preview {
    ${capsuleType}View()
}`,

      android: `package com.hublab.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ${capsuleType}Screen(
    modifier: Modifier = Modifier
) {
    var isLoading by remember { mutableStateOf(false) }

    Column(
        modifier = modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        ${capsuleType}(
            ${propsString.replace(/=/g, ' = ').replace(/"/g, '"')}
        )
    }
}

@Preview
@Composable
fun ${capsuleType}ScreenPreview() {
    ${capsuleType}Screen()
}`,

      web: `import React, { useState } from 'react'
import { ${capsuleType} } from '@hublab/capsules'

interface ${capsuleType}PageProps {
  className?: string
}

export function ${capsuleType}Page({ className }: ${capsuleType}PageProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className={\`space-y-4 \${className}\`}>
      <${capsuleType}
        ${propsString}
      />
    </div>
  )
}

export default ${capsuleType}Page`,

      desktop: `use tauri::Window;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ${capsuleType}Props {
    ${Object.keys(props).map(k => `pub ${k}: String,`).join('\n    ')}
}

#[tauri::command]
pub fn render_${capsuleType.toLowerCase()}(
    window: Window,
    props: ${capsuleType}Props
) -> Result<String, String> {
    // Render ${capsuleType} component
    Ok(format!("Rendered {} with props: {:?}", "${capsuleType}", props))
}

// Register in main.rs:
// .invoke_handler(tauri::generate_handler![render_${capsuleType.toLowerCase()}])`,
    }

    const fileName: Record<Platform, string> = {
      ios: `${capsuleType}View.swift`,
      android: `${capsuleType}Screen.kt`,
      web: `${capsuleType}Page.tsx`,
      desktop: `${capsuleType.toLowerCase()}.rs`,
    }

    return { code, fileName }
  }, [capsuleType, props])
}
