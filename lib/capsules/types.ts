/**
 * HubLab Multi-Platform Capsule System
 *
 * Sistema de cápsulas que genera código nativo REAL para cada plataforma:
 * - Web: React/Vue/Svelte
 * - iOS: SwiftUI/UIKit
 * - Android: Jetpack Compose/XML
 * - Desktop: Tauri/Electron
 */

// ============================================
// PLATAFORMAS Y FRAMEWORKS
// ============================================

export type TargetPlatform = 'web' | 'ios' | 'android' | 'desktop'

export type WebFramework = 'react' | 'vue' | 'svelte' | 'html'
export type IOSFramework = 'swiftui' | 'uikit'
export type AndroidFramework = 'compose' | 'xml'
export type DesktopFramework = 'tauri' | 'electron'

// ============================================
// SISTEMA DE PROPS AGNÓSTICO DE PLATAFORMA
// ============================================

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'      // #hex o nombre de color del tema
  | 'size'       // xs, sm, md, lg, xl o número
  | 'spacing'    // compact, normal, relaxed o número
  | 'icon'       // nombre de icono (SF Symbols / Material Icons)
  | 'image'      // URL o asset local
  | 'action'     // callback/closure
  | 'array'
  | 'object'
  | 'select'     // enum de opciones
  | 'slot'       // children/contenido anidado

export interface CapsuleProp {
  name: string
  type: PropType
  required: boolean
  default?: unknown
  description: string

  // Para type: 'select'
  options?: string[]

  // Validación
  min?: number
  max?: number
  pattern?: string

  // Mapping por plataforma (si difiere)
  platformMapping?: {
    web?: string      // nombre de prop en React
    ios?: string      // nombre de prop en SwiftUI
    android?: string  // nombre de prop en Compose
  }
}

// ============================================
// IMPLEMENTACIONES POR PLATAFORMA
// ============================================

export interface WebImplementation {
  framework: WebFramework
  code: string
  dependencies: string[]  // npm packages
  styles?: string         // CSS adicional
  typescript?: boolean    // Usar TypeScript
}

export interface IOSImplementation {
  framework: IOSFramework
  code: string
  dependencies: string[]  // Swift Package Manager URLs
  minVersion: string      // "15.0", "16.0", etc.
  imports?: string[]      // import SwiftUI, import Charts, etc.
}

export interface AndroidImplementation {
  framework: AndroidFramework
  code: string
  dependencies: string[]  // Gradle dependencies
  minSdk: number          // 24, 26, etc.
  imports?: string[]      // import statements
}

export interface DesktopImplementation {
  framework: DesktopFramework
  code: string
  dependencies: string[]
  targets?: ('macos' | 'windows' | 'linux')[]
}

// ============================================
// DEFINICIÓN DE CÁPSULA MULTI-PLATAFORMA
// ============================================

export type CapsuleCategory =
  | 'ui'          // Botones, inputs, badges
  | 'layout'      // Containers, grids, stacks
  | 'navigation'  // Tabs, drawers, nav bars
  | 'forms'       // Form groups, validation
  | 'data'        // Tables, lists, charts
  | 'media'       // Images, video, audio
  | 'feedback'    // Alerts, toasts, modals
  | 'feature'     // Auth, payments, etc.

export interface CapsuleDefinition {
  // Identificación
  id: string
  name: string
  description: string
  category: CapsuleCategory
  tags: string[]

  // Props agnósticas de plataforma
  props: CapsuleProp[]

  // Implementaciones nativas por plataforma
  platforms: {
    web?: WebImplementation
    ios?: IOSImplementation
    android?: AndroidImplementation
    desktop?: DesktopImplementation
  }

  // Metadatos
  preview?: string          // URL de imagen preview
  documentation?: string    // URL de docs
  author?: string
  version: string
  deprecated?: boolean

  // Relaciones
  children?: boolean        // Acepta cápsulas hijas
  slots?: string[]          // Slots nombrados (header, footer, etc.)
}

// ============================================
// COMPOSICIÓN DE APP
// ============================================

export interface CapsuleInstance {
  id: string                      // ID único de esta instancia
  capsuleId: string               // ID de la definición de cápsula
  props: Record<string, unknown>  // Valores de props
  children?: CapsuleInstance[]    // Cápsulas hijas
  slots?: Record<string, CapsuleInstance[]>  // Contenido de slots
}

export interface AppComposition {
  // Metadatos
  name: string
  description: string
  version: string

  // Configuración de plataformas target
  targets: TargetPlatform[]

  // Árbol de cápsulas
  root: CapsuleInstance

  // Tema global
  theme: ThemeConfig

  // Configuración por plataforma
  platformConfig?: {
    web?: WebAppConfig
    ios?: IOSAppConfig
    android?: AndroidAppConfig
    desktop?: DesktopAppConfig
  }
}

// ============================================
// CONFIGURACIÓN DE TEMA
// ============================================

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    error: string
    success: string
    warning: string
    text: {
      primary: string
      secondary: string
      disabled: string
    }
  }
  typography: {
    fontFamily: string
    headingFont?: string
    monoFont?: string
    scale: 'compact' | 'normal' | 'large'
  }
  spacing: 'compact' | 'normal' | 'relaxed'
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadows: boolean
  darkMode?: ThemeConfig  // Tema para dark mode
}

// ============================================
// CONFIGURACIÓN POR PLATAFORMA
// ============================================

export interface WebAppConfig {
  framework: WebFramework
  typescript: boolean
  styling: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion'
  ssr: boolean
  pwa: boolean
}

export interface IOSAppConfig {
  framework: IOSFramework
  bundleId: string
  teamId?: string
  minVersion: string
  capabilities: IOSCapability[]
  appIcon?: string
  launchScreen?: {
    backgroundColor: string
    image?: string
  }
}

export type IOSCapability =
  | 'push-notifications'
  | 'icloud'
  | 'healthkit'
  | 'apple-pay'
  | 'sign-in-with-apple'
  | 'maps'
  | 'camera'
  | 'photo-library'
  | 'location'
  | 'background-modes'

export interface AndroidAppConfig {
  framework: AndroidFramework
  packageName: string
  minSdk: number
  targetSdk: number
  permissions: AndroidPermission[]
  appIcon?: string
  splashScreen?: {
    backgroundColor: string
    icon?: string
  }
}

export type AndroidPermission =
  | 'INTERNET'
  | 'CAMERA'
  | 'READ_EXTERNAL_STORAGE'
  | 'WRITE_EXTERNAL_STORAGE'
  | 'ACCESS_FINE_LOCATION'
  | 'ACCESS_COARSE_LOCATION'
  | 'RECORD_AUDIO'
  | 'VIBRATE'
  | 'RECEIVE_BOOT_COMPLETED'
  | 'POST_NOTIFICATIONS'

export interface DesktopAppConfig {
  framework: DesktopFramework
  targets: ('macos' | 'windows' | 'linux')[]
  appId: string
  windowConfig: {
    width: number
    height: number
    minWidth?: number
    minHeight?: number
    resizable: boolean
    fullscreen: boolean
  }
}

// ============================================
// RESULTADO DE COMPILACIÓN
// ============================================

export interface GeneratedFile {
  path: string
  content: string
  encoding: 'utf-8' | 'base64'
  language?: string  // swift, kotlin, typescript, etc.
}

export interface CompilationResult {
  success: boolean
  platform: TargetPlatform
  files: GeneratedFile[]
  errors?: CompilationError[]
  warnings?: CompilationWarning[]
  metadata: {
    capsuleCount: number
    totalFiles: number
    totalSize: number
    compiledAt: string
  }
}

export interface CompilationError {
  code: string
  message: string
  capsuleId?: string
  file?: string
  line?: number
}

export interface CompilationWarning {
  code: string
  message: string
  capsuleId?: string
  suggestion?: string
}

export interface MultiPlatformCompilationResult {
  success: boolean
  results: CompilationResult[]
  summary: {
    totalPlatforms: number
    successfulPlatforms: number
    failedPlatforms: string[]
  }
}

// ============================================
// REGISTRY DE CÁPSULAS
// ============================================

export interface CapsuleRegistry {
  // Obtener cápsula por ID
  get(id: string): CapsuleDefinition | undefined

  // Listar todas las cápsulas
  list(filter?: CapsuleFilter): CapsuleDefinition[]

  // Buscar cápsulas
  search(query: string): CapsuleDefinition[]

  // Registrar nueva cápsula
  register(capsule: CapsuleDefinition): void

  // Verificar soporte de plataforma
  supportsPlatform(id: string, platform: TargetPlatform): boolean
}

export interface CapsuleFilter {
  category?: CapsuleCategory
  platform?: TargetPlatform
  tags?: string[]
  deprecated?: boolean
}

// ============================================
// HELPERS DE TIPO
// ============================================

// Extraer solo cápsulas que soportan una plataforma específica
export type CapsuleForPlatform<P extends TargetPlatform> = CapsuleDefinition & {
  platforms: Required<Pick<CapsuleDefinition['platforms'], P>>
}

// Props requeridas de una cápsula
export type RequiredProps<C extends CapsuleDefinition> =
  Extract<C['props'][number], { required: true }>['name']

// Tipo de instancia válida para una cápsula
export type ValidInstance<C extends CapsuleDefinition> = {
  id: string
  capsuleId: C['id']
  props: {
    [K in RequiredProps<C>]: unknown
  } & Partial<Record<string, unknown>>
}
