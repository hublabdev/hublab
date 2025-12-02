/**
 * HubLab Multi-Platform Compiler - Base Classes
 */

import type {
  TargetPlatform,
  CapsuleDefinition,
  CapsuleInstance,
  AppComposition,
  GeneratedFile,
  CompilationResult,
  ThemeConfig
} from '../capsules-multiplatform/types'

interface CompilationError {
  code: string
  message: string
  capsuleId?: string
}

interface CompilationWarning {
  code: string
  message: string
  capsuleId?: string
  suggestion?: string
}

// Make CapsuleDefinition compatible with both formats
type FlexibleCapsuleDefinition = CapsuleDefinition & {
  platforms?: Record<string, unknown>
}

export abstract class PlatformCompiler {
  abstract readonly platform: TargetPlatform
  abstract readonly name: string

  protected capsuleRegistry: Map<string, FlexibleCapsuleDefinition> = new Map()
  protected errors: CompilationError[] = []
  protected warnings: CompilationWarning[] = []

  registerCapsules(capsules: FlexibleCapsuleDefinition[]): void {
    for (const capsule of capsules) {
      if (capsule.platforms?.[this.platform]) {
        this.capsuleRegistry.set(capsule.id, capsule)
      }
    }
  }

  abstract compile(composition: AppComposition): Promise<CompilationResult>

  protected getCapsule(id: string): FlexibleCapsuleDefinition | undefined {
    return this.capsuleRegistry.get(id)
  }

  protected supportsCapsule(id: string): boolean {
    const capsule = this.getCapsule(id)
    return capsule?.platforms?.[this.platform] !== undefined
  }

  protected addError(code: string, message: string, capsuleId?: string): void {
    this.errors.push({ code, message, capsuleId })
  }

  protected addWarning(code: string, message: string, capsuleId?: string, suggestion?: string): void {
    this.warnings.push({ code, message, capsuleId, suggestion })
  }

  protected reset(): void {
    this.errors = []
    this.warnings = []
  }

  protected createResult(success: boolean, files: GeneratedFile[]): CompilationResult {
    return {
      success,
      platform: this.platform,
      files,
      errors: this.errors.length > 0 ? this.errors.map(e => ({ message: e.message, code: e.code })) : undefined,
      warnings: this.warnings.length > 0 ? this.warnings.map(w => ({ message: w.message, code: w.code })) : undefined,
      stats: {
        
        fileCount: files.length,
        totalSize: files.reduce((sum, f) => sum + f.content.length, 0),
        compilationTime: 0
      }
    }
  }

  protected toIdentifier(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/^[0-9]/, '_$&')
  }

  protected capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  protected toCamelCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map((word, i) => i === 0 ? word.toLowerCase() : this.capitalize(word.toLowerCase()))
      .join('')
  }

  protected toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(word => this.capitalize(word.toLowerCase()))
      .join('')
  }

  protected toSnakeCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .join('_')
      .toLowerCase()
  }

  protected toKebabCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .join('-')
      .toLowerCase()
  }

  protected generateId(): string {
    return Math.random().toString(36).substring(2, 9)
  }

  protected escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  }

  protected hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  protected walkCapsuleTree(
    instance: CapsuleInstance,
    callback: (instance: CapsuleInstance, depth: number) => void,
    depth = 0
  ): void {
    callback(instance, depth)
  }

  protected collectUsedCapsules(composition: AppComposition): Set<string> {
    const used = new Set<string>()
    if (composition.capsules) {
      for (const capsule of composition.capsules) {
        used.add(capsule.type)
      }
    }
    return used
  }

  protected collectDependencies(_composition: AppComposition): string[] {
    return []
  }
}

export class MultiPlatformCompiler {
  private compilers: Map<TargetPlatform, PlatformCompiler> = new Map()

  registerCompiler(compiler: PlatformCompiler): void {
    this.compilers.set(compiler.platform, compiler)
  }

  getCompiler(platform: TargetPlatform): PlatformCompiler | undefined {
    return this.compilers.get(platform)
  }

  async compileAll(
    composition: AppComposition,
    platforms?: TargetPlatform[]
  ): Promise<Map<TargetPlatform, CompilationResult>> {
    const targetPlatforms = platforms || composition.targets || []
    const results = new Map<TargetPlatform, CompilationResult>()

    const compilations = targetPlatforms.map(async (platform) => {
      const compiler = this.compilers.get(platform)

      if (!compiler) {
        return {
          platform,
          result: {
            success: false,
            platform,
            files: [],
            errors: [{
              message: `No compiler registered for platform: ${platform}`
            }],
            stats: {
              fileCount: 0,
              totalSize: 0,
              compilationTime: 0
            }
          } as CompilationResult
        }
      }

      const result = await compiler.compile(composition)
      return { platform, result }
    })

    const compilationResults = await Promise.all(compilations)

    for (const { platform, result } of compilationResults) {
      results.set(platform, result)
    }

    return results
  }

  getAvailablePlatforms(): TargetPlatform[] {
    return Array.from(this.compilers.keys())
  }
}

export class ThemeProcessor {
  static toCSSVariables(theme: ThemeConfig): string {
    const colors = theme.colors || {}
    const textColors = typeof colors.text === 'object' ? colors.text : {}

    return `:root {
  --color-primary: ${colors.primary || '#3b82f6'};
  --color-secondary: ${colors.secondary || '#8b5cf6'};
  --color-accent: ${colors.accent || '#06b6d4'};
  --color-background: ${colors.background || '#ffffff'};
  --color-surface: ${colors.surface || '#f8fafc'};
  --color-error: ${colors.error || '#ef4444'};
  --color-success: ${colors.success || '#22c55e'};
  --color-warning: ${colors.warning || '#f59e0b'};
  --color-text-primary: ${textColors.primary || '#0f172a'};
  --color-text-secondary: ${textColors.secondary || '#64748b'};
  --color-text-disabled: ${textColors.disabled || '#94a3b8'};
}`
  }

  static toSwiftColors(theme: ThemeConfig): string {
    const hexToSwift = (hex: string) => {
      const rgb = this.hexToRgb(hex)
      if (!rgb) return 'Color.clear'
      return `Color(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)})`
    }

    const colors = theme.colors || {}
    const textColors = typeof colors.text === 'object' ? colors.text : {}

    return `import SwiftUI

extension Color {
    static let hubLabPrimary = ${hexToSwift(String(colors.primary || '#3b82f6'))}
    static let hubLabSecondary = ${hexToSwift(String(colors.secondary || '#8b5cf6'))}
    static let hubLabTextPrimary = ${hexToSwift(String(textColors.primary || '#0f172a'))}
}`
  }

  static toKotlinColors(theme: ThemeConfig): string {
    const hexToKotlin = (hex: string) => {
      return `Color(0xFF${hex.replace('#', '')})`
    }

    const colors = theme.colors || {}

    return `package com.hublab.ui.theme

import androidx.compose.ui.graphics.Color

object HubLabColors {
    val Primary = ${hexToKotlin(String(colors.primary || '#3b82f6'))}
    val Secondary = ${hexToKotlin(String(colors.secondary || '#8b5cf6'))}
}`
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
}
