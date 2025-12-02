// ============================================
// HUBLAB API TYPES
// Complete type definitions for HubLab API v1
// ============================================

// ============================================
// API KEY & AUTHENTICATION
// ============================================

export type APIKeyTier = 'free' | 'pro' | 'enterprise'

export interface APIKey {
  id: string
  key: string // hublab_sk_...
  name: string
  tier: APIKeyTier
  userId: string
  createdAt: string
  lastUsedAt: string | null
  rateLimit: RateLimit
  isActive: boolean
}

export interface RateLimit {
  projectsPerHour: number
  exportsPerDay: number
  deploysPerDay: number
  requestsPerMinute: number
}

export const RATE_LIMITS: Record<APIKeyTier, RateLimit> = {
  free: {
    projectsPerHour: 10,
    exportsPerDay: 50,
    deploysPerDay: 5,
    requestsPerMinute: 30,
  },
  pro: {
    projectsPerHour: 100,
    exportsPerDay: 500,
    deploysPerDay: 50,
    requestsPerMinute: 120,
  },
  enterprise: {
    projectsPerHour: 1000,
    exportsPerDay: 5000,
    deploysPerDay: 500,
    requestsPerMinute: 600,
  },
}

// ============================================
// PROJECT
// ============================================

export type ProjectStatus = 'draft' | 'building' | 'ready' | 'deployed' | 'error'

export interface Project {
  id: string
  userId: string
  name: string
  description?: string
  template?: string
  theme?: ThemeConfig
  capsules: Capsule[]
  integrations: IntegrationConfig[]
  platforms?: TargetPlatform[]
  status: ProjectStatus
  previewUrl?: string
  deployUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  template?: 'blank' | 'dashboard' | 'landing' | 'ecommerce' | 'admin' | 'blog'
  theme?: string | ThemeConfig
}

export interface CreateProjectResponse {
  success: boolean
  project: Project
  message?: string
}

// ============================================
// THEME
// ============================================

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    background?: string
    foreground?: string
    [key: string]: string | undefined
  }
  typography?: {
    fontFamily: string
    headingFont?: string
  }
  spacing?: 'compact' | 'normal' | 'relaxed'
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export const PRESET_THEMES: Record<string, ThemeConfig> = {
  'modern-blue': {
    name: 'Modern Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#ffffff',
      foreground: '#0f172a',
    },
    typography: {
      fontFamily: 'Inter',
    },
    spacing: 'normal',
    borderRadius: 'md',
  },
  'dark-purple': {
    name: 'Dark Purple',
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#0f172a',
      foreground: '#f8fafc',
    },
    typography: {
      fontFamily: 'Inter',
    },
    spacing: 'normal',
    borderRadius: 'lg',
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#737373',
      background: '#ffffff',
      foreground: '#000000',
    },
    typography: {
      fontFamily: 'Inter',
    },
    spacing: 'relaxed',
    borderRadius: 'none',
  },
}

// ============================================
// CAPSULE
// ============================================

export type CapsuleCategory =
  | 'layout'
  | 'navigation'
  | 'forms'
  | 'data-display'
  | 'charts'
  | 'media'
  | 'ecommerce'
  | 'auth'
  | 'ui'
  | 'data'
  | 'feedback'
  | 'feature'
  | 'input'
  | 'screen'
  | 'device'
  | 'utility'
  | 'overlay'
  | 'communication'

export interface Capsule {
  id: string
  type: string
  name?: string
  category: CapsuleCategory
  props: Record<string, any>
  children?: Capsule[]
  dataSource?: DataSource
  position?: {
    x: number
    y: number
  }
}

export interface AddCapsuleRequest {
  projectId: string
  type: string
  props?: Record<string, any>
  dataSource?: DataSource
  parentId?: string // For nesting
}

export interface AddCapsuleResponse {
  success: boolean
  capsule: Capsule
  message?: string
}

// ============================================
// DATA SOURCE
// ============================================

export type DataSourceType = 'supabase' | 'firebase' | 'rest' | 'graphql' | 'static'

export interface DataSource {
  type: DataSourceType
  config: SupabaseDataSource | FirebaseDataSource | RESTDataSource | GraphQLDataSource | StaticDataSource
}

export interface SupabaseDataSource {
  table: string
  fields: string[]
  filters?: Record<string, any>
  orderBy?: { column: string; ascending: boolean }
  limit?: number
}

export interface FirebaseDataSource {
  collection: string
  fields: string[]
  where?: Array<{ field: string; operator: string; value: any }>
  orderBy?: { field: string; direction: 'asc' | 'desc' }
  limit?: number
}

export interface RESTDataSource {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  transform?: string // JavaScript function as string
}

export interface GraphQLDataSource {
  endpoint: string
  query: string
  variables?: Record<string, any>
  headers?: Record<string, string>
}

export interface StaticDataSource {
  data: any[]
}

// ============================================
// INTEGRATION
// ============================================

export interface IntegrationConfig {
  type: string
  config: Record<string, any>
}

// ============================================
// EXPORT
// ============================================

// Web export formats
export type WebExportFormat = 'nextjs' | 'react' | 'html' | 'vue' | 'svelte'

// Native export formats (NEW)
export type NativeExportFormat =
  | 'ios-swiftui'      // Native iOS with SwiftUI
  | 'ios-uikit'        // Native iOS with UIKit
  | 'android-compose'  // Native Android with Jetpack Compose
  | 'android-xml'      // Native Android with XML layouts
  | 'desktop-tauri'    // Desktop with Tauri (Rust + Web)
  | 'desktop-electron' // Desktop with Electron

// All export formats
export type ExportFormat = WebExportFormat | NativeExportFormat

// Target platform for multi-platform export
export type TargetPlatform = 'web' | 'ios' | 'android' | 'desktop'

export interface ExportRequest {
  projectId: string
  format: ExportFormat
  options?: {
    includeTests?: boolean
    includeReadme?: boolean
    includeEnvExample?: boolean
    typescript?: boolean
  }
}

// NEW: Multi-platform native export request
export interface NativeExportRequest {
  projectId: string
  targets: NativeExportTarget[]
  includeReadme?: boolean
  includeGitignore?: boolean
}

export interface BaseExportOptions {
  includeTests?: boolean
  includeGitignore?: boolean
}

export interface NativeExportTarget {
  platform: TargetPlatform
  options?: IOSExportOptions | AndroidExportOptions | DesktopExportOptions | BaseExportOptions
}

export interface IOSExportOptions {
  framework: 'swiftui' | 'uikit'
  bundleId: string
  teamId?: string
  minVersion?: string  // e.g., "15.0"
  capabilities?: IOSCapability[]
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

export interface AndroidExportOptions {
  framework: 'compose' | 'xml'
  packageName: string
  minSdk?: number      // e.g., 24
  targetSdk?: number   // e.g., 34
  permissions?: AndroidPermission[]
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

export interface DesktopExportOptions {
  framework: 'tauri' | 'electron'
  targets?: ('macos' | 'windows' | 'linux')[]
  appId?: string
}

export interface ExportResponse {
  success: boolean
  files: ExportFile[]
  downloadUrl?: string
  message?: string
}

// NEW: Multi-platform export response
export interface NativeExportResponse {
  success: boolean
  exports: NativeExportResult[]
  summary: {
    totalPlatforms: number
    successfulPlatforms: number
    failedPlatforms: string[]
    totalFiles: number
    totalSize: number
  }
}

export interface NativeExportResult {
  platform: TargetPlatform
  success: boolean
  downloadUrl?: string
  fileCount: number
  totalSize: number
  linesOfCode?: number
  errors?: string[]
  warnings?: string[]
}

export interface ExportFile {
  path: string
  content: string
  language: string
}

// ============================================
// DEPLOY
// ============================================

// Web deploy platforms
export type WebDeployPlatform = 'vercel' | 'netlify' | 'cloudflare'

// Native deploy platforms (NEW)
export type NativeDeployPlatform =
  | 'app-store-connect'          // iOS App Store
  | 'testflight'                 // iOS TestFlight (beta)
  | 'google-play'                // Android Play Store
  | 'google-play-internal'       // Android Internal Testing
  | 'firebase-app-distribution'  // Android/iOS Beta Distribution

// All deploy platforms
export type DeployPlatform = WebDeployPlatform | NativeDeployPlatform

export interface DeployRequest {
  projectId: string
  platform: DeployPlatform
  config?: {
    domain?: string
    envVars?: Record<string, string>
    buildCommand?: string
    outputDirectory?: string
  }
}

export interface DeployResponse {
  success: boolean
  deploymentId: string
  url: string
  status: 'pending' | 'building' | 'ready' | 'error'
  message?: string
}

// ============================================
// PREVIEW
// ============================================

export interface GetPreviewResponse {
  success: boolean
  previewUrl: string
  expiresAt: string
  message?: string
}

// ============================================
// ERRORS
// ============================================

export interface APIError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

export type APIErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'

// ============================================
// CAPSULE CATALOG
// ============================================

export interface CapsuleDefinition {
  id: string
  type: string
  name: string
  category: CapsuleCategory
  description: string
  icon: string
  props: PropDefinition[]
  requiredIntegrations?: string[]
  examples: CapsuleExample[]
}

export interface PropDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'select'
  required: boolean
  default?: any
  options?: string[] // For select type
  description: string
}

export interface CapsuleExample {
  name: string
  description: string
  code: string
  props: Record<string, any>
}

// ============================================
// VALIDATION
// ============================================

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  code: string
  message: string
  path?: string
  capsuleId?: string
}

export interface ValidationWarning {
  code: string
  message: string
  path?: string
  capsuleId?: string
}
