/**
 * Multi-Platform Capsule Types
 */

export type TargetPlatform = 'ios' | 'android' | 'web' | 'desktop'

export interface IOSAppConfig {
  framework: 'swiftui' | 'uikit'
  bundleId: string
  minVersion: string
  teamId?: string
  capabilities: string[]
}

export interface AndroidAppConfig {
  framework: 'compose' | 'xml'
  packageName: string
  minSdk: number
  targetSdk: number
  compileSdk?: number
  permissions?: string[]
}

export interface WebAppConfig {
  framework: 'react' | 'vue' | 'svelte'
  typescript: boolean
  cssFramework: 'tailwind' | 'styled-components' | 'css-modules'
}

export interface DesktopAppConfig {
  framework: 'tauri' | 'electron'
  platforms: ('macos' | 'windows' | 'linux')[]
}

export interface GeneratedFile {
  path: string
  content: string
  type?: 'source' | 'resource' | 'config'
  encoding?: 'utf-8' | 'base64'
  language?: string
}

export interface CompilationMessage {
  message: string
  code?: string
  file?: string
  line?: number
}

export interface CompilationResult {
  platform: TargetPlatform
  success: boolean
  files: GeneratedFile[]
  warnings?: CompilationMessage[]
  errors?: CompilationMessage[]
  stats?: {
    fileCount: number
    totalSize: number
    compilationTime: number
  }
}

export interface CapsuleInstance {
  id: string
  type: string
  name: string
  props: Record<string, any>
}

export interface AppComposition {
  id?: string
  name: string
  description?: string
  version?: string
  targets?: TargetPlatform[]
  capsules?: CapsuleInstance[]
  root?: any
  theme?: ThemeConfig
  platformConfig?: {
    ios?: Partial<IOSAppConfig>
    android?: Partial<AndroidAppConfig>
    web?: Partial<WebAppConfig>
    desktop?: Partial<DesktopAppConfig>
  }
}

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    background?: string
    foreground?: string
    surface?: string
    error?: string
    success?: string
    warning?: string
    text?: {
      primary?: string
      secondary?: string
      disabled?: string
    }
    [key: string]: string | { primary?: string; secondary?: string; disabled?: string } | undefined
  }
  fonts?: {
    heading?: string
    body?: string
    mono?: string
  }
  borderRadius?: string
  spacing?: string
}

export interface IOSImplementation {
  view: string
  imports?: string[]
  modifiers?: string[]
}

export interface AndroidImplementation {
  composable: string
  imports?: string[]
  modifiers?: string[]
}

export interface WebImplementation {
  component: string
  imports?: string[]
  styles?: string
}

export interface DesktopImplementation {
  component: string
  commands?: string[]
}

export interface CapsuleDefinition {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  version: string
  platforms: TargetPlatform[]
  props: CapsuleProp[]
  implementations?: {
    ios?: IOSImplementation
    android?: AndroidImplementation
    web?: WebImplementation
    desktop?: DesktopImplementation
  }
}

export interface CapsuleProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'object' | 'array'
  required: boolean
  default?: any
  options?: string[]
  description?: string
}
