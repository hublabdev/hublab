/**
 * HubLab Native Export API
 *
 * POST /api/v1/projects/[id]/export-native
 *
 * Genera código nativo para múltiples plataformas:
 * - iOS (SwiftUI)
 * - Android (Jetpack Compose)
 * - Desktop (Tauri)
 *
 * Cada export genera un proyecto completo listo para
 * abrir en Xcode/Android Studio y compilar/publicar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import JSZip from 'jszip'

// Importar compiladores
import { MultiPlatformCompiler } from '@/lib/compiler/base'
import { IOSCompiler } from '@/lib/compiler/ios/compiler'
import { AndroidCompiler } from '@/lib/compiler/android/compiler'
// import { DesktopCompiler } from '@/lib/compiler/desktop/compiler' // TODO

import type {
  TargetPlatform,
  IOSAppConfig,
  AndroidAppConfig,
  CompilationResult
} from '@/lib/capsules-multiplatform/types'

// ============================================
// REQUEST VALIDATION
// ============================================

const IOSOptionsSchema = z.object({
  bundleId: z.string().regex(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/i, 'Invalid bundle ID format'),
  teamId: z.string().optional(),
  minVersion: z.string().default('15.0'),
  capabilities: z.array(z.enum([
    'push-notifications',
    'icloud',
    'healthkit',
    'apple-pay',
    'sign-in-with-apple',
    'maps',
    'camera',
    'photo-library',
    'location',
    'background-modes'
  ])).default([])
})

const AndroidOptionsSchema = z.object({
  packageName: z.string().regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i, 'Invalid package name format'),
  minSdk: z.number().min(21).max(34).default(24),
  targetSdk: z.number().min(24).max(34).default(34),
  permissions: z.array(z.enum([
    'INTERNET',
    'CAMERA',
    'READ_EXTERNAL_STORAGE',
    'WRITE_EXTERNAL_STORAGE',
    'ACCESS_FINE_LOCATION',
    'ACCESS_COARSE_LOCATION',
    'RECORD_AUDIO',
    'VIBRATE',
    'RECEIVE_BOOT_COMPLETED',
    'POST_NOTIFICATIONS'
  ])).default(['INTERNET'])
})

const ExportRequestSchema = z.object({
  targets: z.array(z.object({
    platform: z.enum(['ios', 'android', 'desktop']),
    options: z.union([
      IOSOptionsSchema,
      AndroidOptionsSchema,
      z.object({}) // Desktop options (TODO)
    ]).optional()
  })).min(1, 'At least one target platform is required'),

  // Opciones globales
  includeReadme: z.boolean().default(true),
  includeGitignore: z.boolean().default(true)
})

type ExportRequest = z.infer<typeof ExportRequestSchema>

// ============================================
// RESPONSE TYPES
// ============================================

interface ExportResult {
  platform: TargetPlatform
  success: boolean
  downloadUrl?: string
  fileCount: number
  totalSize: number
  errors?: string[]
  warnings?: string[]
}

interface ExportResponse {
  success: boolean
  exports: ExportResult[]
  summary: {
    totalPlatforms: number
    successfulPlatforms: number
    failedPlatforms: string[]
    totalFiles: number
    totalSize: number
  }
}

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id

  try {
    // 1. Parse and validate request
    const body = await request.json()
    const validation = ExportRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: validation.error.flatten()
        }
      }, { status: 400 })
    }

    const { targets, includeReadme, includeGitignore } = validation.data

    // 2. Get project from database
    const project = await getProject(projectId)

    if (!project) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Project ${projectId} not found`
        }
      }, { status: 404 })
    }

    // 3. Initialize compilers
    const multiCompiler = new MultiPlatformCompiler()

    const iosCompiler = new IOSCompiler()
    const androidCompiler = new AndroidCompiler()
    // const desktopCompiler = new DesktopCompiler() // TODO

    // Register capsules with compilers
    const capsules = await getCapsuleDefinitions()
    iosCompiler.registerCapsules(capsules)
    androidCompiler.registerCapsules(capsules)

    multiCompiler.registerCompiler(iosCompiler)
    multiCompiler.registerCompiler(androidCompiler)

    // 4. Compile for each target platform
    const results: ExportResult[] = []
    let totalFiles = 0
    let totalSize = 0

    for (const target of targets) {
      try {
        // Configure platform-specific options
        if (target.platform === 'ios' && target.options) {
          iosCompiler.configure(target.options as IOSAppConfig)
        } else if (target.platform === 'android' && target.options) {
          androidCompiler.configure(target.options as AndroidAppConfig)
        }

        // Compile
        const compiler = multiCompiler.getCompiler(target.platform)

        if (!compiler) {
          results.push({
            platform: target.platform,
            success: false,
            fileCount: 0,
            totalSize: 0,
            errors: [`Compiler not available for platform: ${target.platform}`]
          })
          continue
        }

        const compilation = await compiler.compile(project.composition)

        if (!compilation.success) {
          results.push({
            platform: target.platform,
            success: false,
            fileCount: 0,
            totalSize: 0,
            errors: compilation.errors?.map(e => e.message) || ['Unknown compilation error']
          })
          continue
        }

        // 5. Create ZIP file
        const zip = new JSZip()

        for (const file of compilation.files) {
          zip.file(file.path, file.content)
        }

        // Add optional files
        if (includeGitignore) {
          zip.file('.gitignore', getGitignore(target.platform))
        }

        // Generate ZIP
        const zipBlob = await zip.generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: { level: 9 }
        })

        // 6. Upload to storage and get download URL
        const fileName = `${project.name}-${target.platform}-${Date.now()}.zip`
        const downloadUrl = await uploadToStorage(zipBlob, fileName)

        const fileSize = zipBlob.length
        totalFiles += compilation.files.length
        totalSize += fileSize

        results.push({
          platform: target.platform,
          success: true,
          downloadUrl,
          fileCount: compilation.files.length,
          totalSize: fileSize,
          warnings: compilation.warnings?.map(w => w.message)
        })

      } catch (error) {
        results.push({
          platform: target.platform,
          success: false,
          fileCount: 0,
          totalSize: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        })
      }
    }

    // 7. Build response
    const successfulPlatforms = results.filter(r => r.success).length
    const failedPlatforms = results.filter(r => !r.success).map(r => r.platform)

    const response: ExportResponse = {
      success: failedPlatforms.length === 0,
      exports: results,
      summary: {
        totalPlatforms: targets.length,
        successfulPlatforms,
        failedPlatforms,
        totalFiles,
        totalSize
      }
    }

    // Add cache headers for successful exports
    const headers = new Headers()
    headers.set('Cache-Control', 'private, max-age=300') // 5 minutes

    return NextResponse.json(response, {
      status: failedPlatforms.length === targets.length ? 500 : 200,
      headers
    })

  } catch (error) {
    console.error('Export native error:', error)

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process export request'
      }
    }, { status: 500 })
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get project from database
 * TODO: Replace with actual Supabase query
 */
async function getProject(id: string) {
  // Mock implementation - replace with actual DB query
  // const { data, error } = await supabase
  //   .from('projects')
  //   .select('*')
  //   .eq('id', id)
  //   .single()

  // For now, return mock data for testing
  return {
    id,
    name: 'My App',
    composition: {
      name: 'My App',
      description: 'App generated by HubLab',
      version: '1.0.0',
      targets: ['web', 'ios', 'android'] as TargetPlatform[],
      root: {
        id: 'root',
        capsuleId: 'container',
        props: {},
        children: [
          {
            id: 'btn-1',
            capsuleId: 'button',
            props: {
              text: 'Get Started',
              variant: 'primary'
            }
          }
        ]
      },
      theme: {
        name: 'Default',
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          background: '#ffffff',
          surface: '#f8fafc',
          error: '#ef4444',
          success: '#22c55e',
          warning: '#f59e0b',
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
            disabled: '#94a3b8'
          }
        },
        typography: {
          fontFamily: 'Inter',
          scale: 'normal'
        },
        spacing: 'normal',
        borderRadius: 'md',
        shadows: true
      }
    }
  }
}

/**
 * Get capsule definitions
 * TODO: Load from registry
 */
async function getCapsuleDefinitions() {
  // Import from capsule definitions
  // return getAllCapsules()
  return []
}

/**
 * Upload file to storage and return download URL
 * TODO: Replace with actual storage implementation
 */
async function uploadToStorage(content: Buffer, fileName: string): Promise<string> {
  // Mock implementation - replace with actual storage (S3, Supabase Storage, etc.)

  // const { data, error } = await supabase.storage
  //   .from('exports')
  //   .upload(fileName, content, {
  //     contentType: 'application/zip'
  //   })

  // For now, return a mock URL
  const mockId = Math.random().toString(36).substring(2, 15)
  return `https://storage.hublab.dev/exports/${mockId}/${fileName}`
}

/**
 * Generate .gitignore for platform
 */
function getGitignore(platform: TargetPlatform): string {
  const common = `
# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo

# Logs
*.log
npm-debug.log*
`

  const platformSpecific: Record<TargetPlatform, string> = {
    ios: `
# Xcode
build/
DerivedData/
*.xcuserstate
*.xcworkspace/xcuserdata/
*.pbxuser
*.mode1v3
*.mode2v3
*.perspectivev3
xcuserdata/
*.moved-aside
*.xccheckout
*.xcscmblueprint

# CocoaPods
Pods/

# Swift Package Manager
.build/
Packages/
Package.resolved

# Carthage
Carthage/Build/

# fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output
`,
    android: `
# Android
*.iml
.gradle/
local.properties
.idea/
*.jks
*.keystore

# Build
build/
app/build/
captures/
*.apk
*.aab
*.ap_
*.dex

# Kotlin
*.kotlin_module
`,
    desktop: `
# Tauri
target/
dist/

# Node
node_modules/
`,
    web: `
# Node
node_modules/
.next/
out/
build/
dist/
`
  }

  return (common + platformSpecific[platform]).trim()
}

// ============================================
// OPTIONS ENDPOINT
// ============================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
