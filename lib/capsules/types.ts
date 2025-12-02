/**
 * HubLab Multi-Platform Capsule System Types
 */

export type TargetPlatform = 'web' | 'ios' | 'android' | 'desktop'

export type WebFramework = 'react' | 'vue' | 'svelte' | 'html'
export type IOSFramework = 'swiftui' | 'uikit'
export type AndroidFramework = 'compose' | 'xml'
export type DesktopFramework = 'tauri' | 'electron'

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'size'
  | 'spacing'
  | 'icon'
  | 'image'
  | 'action'
  | 'array'
  | 'object'
  | 'select'
  | 'slot'

export interface CapsuleProp {
  name: string
  type: PropType | string
  required?: boolean
  default?: unknown
  description: string
  options?: string[]
  min?: number
  max?: number
  pattern?: string
  platformMapping?: {
    web?: string
    ios?: string
    android?: string
  }
}

export type CapsuleCategory =
  | 'ui'
  | 'layout'
  | 'navigation'
  | 'forms'
  | 'data'
  | 'media'
  | 'feedback'
  | 'feature'
  | 'input'
  | 'screen'
  | 'device'
  | 'utility'
  | 'overlay'
  | 'communication'

export interface WebImplementation {
  framework?: WebFramework
  code?: string
  files?: Array<{ filename: string; code: string; path?: string }>
  components?: Record<string, string>
  dependencies: string[]
  styles?: string
  typescript?: boolean
}

export interface IOSImplementation {
  framework?: IOSFramework
  code?: string
  files?: Array<{ filename: string; code: string; path?: string }>
  components?: Record<string, string>
  dependencies: string[]
  minVersion?: string
  imports?: string[]
}

export interface AndroidImplementation {
  framework?: AndroidFramework
  code?: string
  files?: Array<{ filename: string; code: string; path?: string }>
  components?: Record<string, string>
  dependencies: string[]
  minSdk?: number
  imports?: string[]
}

export interface DesktopImplementation {
  framework?: DesktopFramework
  code?: string
  files?: Array<{ filename: string; code: string; path?: string }>
  components?: Record<string, string>
  dependencies: string[]
  targets?: ('macos' | 'windows' | 'linux')[]
}

export interface CapsuleDefinition {
  id: string
  name: string
  description: string
  category: CapsuleCategory
  tags: string[]
  props: CapsuleProp[] | Record<string, Omit<CapsuleProp, 'name'>>
  platforms: {
    web?: WebImplementation
    ios?: IOSImplementation
    android?: AndroidImplementation
    desktop?: DesktopImplementation
  }
  preview?: string
  documentation?: string
  author?: string
  version?: string
  deprecated?: boolean
  children?: boolean
  slots?: string[]
  examples?: Array<{ title: string; code: string; description?: string }>
}

export interface CapsuleInstance {
  id: string
  capsuleId: string
  props: Record<string, unknown>
  children?: CapsuleInstance[]
  slots?: Record<string, CapsuleInstance[]>
}

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    background?: string
    surface?: string
    error?: string
    success?: string
    warning?: string
    text?: {
      primary: string
      secondary: string
      disabled?: string
    }
    [key: string]: unknown
  }
  typography?: {
    fontFamily: string
    headingFont?: string
    monoFont?: string
    scale?: 'compact' | 'normal' | 'large'
  }
  spacing?: 'compact' | 'normal' | 'relaxed'
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadows?: boolean
  darkMode?: ThemeConfig
}

export interface GeneratedFile {
  path: string
  content: string
  encoding?: 'utf-8' | 'base64'
  language?: string
}

export interface CompilationResult {
  success: boolean
  platform: TargetPlatform
  files: GeneratedFile[]
  errors?: Array<{ code: string; message: string; capsuleId?: string }>
  warnings?: Array<{ code: string; message: string; capsuleId?: string }>
  metadata?: {
    capsuleCount: number
    totalFiles: number
    totalSize: number
    compiledAt: string
  }
}
