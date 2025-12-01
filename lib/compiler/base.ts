/**
 * HubLab Multi-Platform Compiler - Base Classes
 *
 * Arquitectura de compilación que genera código nativo real
 * para cada plataforma target.
 */

import type {
  TargetPlatform,
  CapsuleDefinition,
  CapsuleInstance,
  AppComposition,
  GeneratedFile,
  CompilationResult,
  CompilationError,
  CompilationWarning,
  ThemeConfig
} from '../capsules-multiplatform/types'

// ============================================
// ABSTRACT BASE COMPILER
// ============================================

export abstract class PlatformCompiler {
  abstract readonly platform: TargetPlatform
  abstract readonly name: string

  protected capsuleRegistry: Map<string, CapsuleDefinition> = new Map()
  protected errors: CompilationError[] = []
  protected warnings: CompilationWarning[] = []

  /**
   * Registra cápsulas disponibles para compilación
   */
  registerCapsules(capsules: CapsuleDefinition[]): void {
    for (const capsule of capsules) {
      if (capsule.platforms[this.platform]) {
        this.capsuleRegistry.set(capsule.id, capsule)
      }
    }
  }

  /**
   * Compila una composición completa a archivos de la plataforma
   */
  abstract compile(composition: AppComposition): Promise<CompilationResult>

  /**
   * Obtiene una cápsula del registro
   */
  protected getCapsule(id: string): CapsuleDefinition | undefined {
    return this.capsuleRegistry.get(id)
  }

  /**
   * Verifica si una cápsula soporta esta plataforma
   */
  protected supportsCapsule(id: string): boolean {
    const capsule = this.getCapsule(id)
    return capsule?.platforms[this.platform] !== undefined
  }

  /**
   * Agrega un error de compilación
   */
  protected addError(code: string, message: string, capsuleId?: string): void {
    this.errors.push({ code, message, capsuleId })
  }

  /**
   * Agrega una advertencia de compilación
   */
  protected addWarning(code: string, message: string, capsuleId?: string, suggestion?: string): void {
    this.warnings.push({ code, message, capsuleId, suggestion })
  }

  /**
   * Limpia errores y warnings para nueva compilación
   */
  protected reset(): void {
    this.errors = []
    this.warnings = []
  }

  /**
   * Crea resultado de compilación
   */
  protected createResult(success: boolean, files: GeneratedFile[]): CompilationResult {
    return {
      success,
      platform: this.platform,
      files,
      errors: this.errors.length > 0 ? [...this.errors] : undefined,
      warnings: this.warnings.length > 0 ? [...this.warnings] : undefined,
      metadata: {
        capsuleCount: this.capsuleRegistry.size,
        totalFiles: files.length,
        totalSize: files.reduce((sum, f) => sum + f.content.length, 0),
        compiledAt: new Date().toISOString()
      }
    }
  }

  // ============================================
  // HELPERS COMUNES
  // ============================================

  /**
   * Convierte nombre a identificador válido
   */
  protected toIdentifier(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/^[0-9]/, '_$&')
  }

  /**
   * Capitaliza primera letra
   */
  protected capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * Convierte a camelCase
   */
  protected toCamelCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map((word, i) => i === 0 ? word.toLowerCase() : this.capitalize(word.toLowerCase()))
      .join('')
  }

  /**
   * Convierte a PascalCase
   */
  protected toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(word => this.capitalize(word.toLowerCase()))
      .join('')
  }

  /**
   * Convierte a snake_case
   */
  protected toSnakeCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .join('_')
      .toLowerCase()
  }

  /**
   * Convierte a kebab-case
   */
  protected toKebabCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .join('-')
      .toLowerCase()
  }

  /**
   * Genera ID único
   */
  protected generateId(): string {
    return Math.random().toString(36).substring(2, 9)
  }

  /**
   * Escapa string para código
   */
  protected escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  }

  /**
   * Convierte color hex a componentes RGB
   */
  protected hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  /**
   * Procesa el árbol de cápsulas recursivamente
   */
  protected walkCapsuleTree(
    instance: CapsuleInstance,
    callback: (instance: CapsuleInstance, depth: number) => void,
    depth = 0
  ): void {
    callback(instance, depth)

    if (instance.children) {
      for (const child of instance.children) {
        this.walkCapsuleTree(child, callback, depth + 1)
      }
    }

    if (instance.slots) {
      for (const slotChildren of Object.values(instance.slots)) {
        for (const child of slotChildren) {
          this.walkCapsuleTree(child, callback, depth + 1)
        }
      }
    }
  }

  /**
   * Recopila todas las cápsulas únicas usadas
   */
  protected collectUsedCapsules(composition: AppComposition): Set<string> {
    const used = new Set<string>()

    this.walkCapsuleTree(composition.root, (instance) => {
      used.add(instance.capsuleId)
    })

    return used
  }

  /**
   * Recopila todas las dependencias necesarias
   */
  protected collectDependencies(composition: AppComposition): string[] {
    const deps = new Set<string>()
    const usedCapsules = this.collectUsedCapsules(composition)

    for (const capsuleId of usedCapsules) {
      const capsule = this.getCapsule(capsuleId)
      const impl = capsule?.platforms[this.platform]

      if (impl?.dependencies) {
        for (const dep of impl.dependencies) {
          deps.add(dep)
        }
      }
    }

    return Array.from(deps)
  }
}

// ============================================
// MULTI-PLATFORM COMPILER
// ============================================

export class MultiPlatformCompiler {
  private compilers: Map<TargetPlatform, PlatformCompiler> = new Map()

  /**
   * Registra un compilador para una plataforma
   */
  registerCompiler(compiler: PlatformCompiler): void {
    this.compilers.set(compiler.platform, compiler)
  }

  /**
   * Obtiene un compilador por plataforma
   */
  getCompiler(platform: TargetPlatform): PlatformCompiler | undefined {
    return this.compilers.get(platform)
  }

  /**
   * Compila para múltiples plataformas en paralelo
   */
  async compileAll(
    composition: AppComposition,
    platforms?: TargetPlatform[]
  ): Promise<Map<TargetPlatform, CompilationResult>> {
    const targetPlatforms = platforms || composition.targets
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
              code: 'COMPILER_NOT_FOUND',
              message: `No compiler registered for platform: ${platform}`
            }],
            metadata: {
              capsuleCount: 0,
              totalFiles: 0,
              totalSize: 0,
              compiledAt: new Date().toISOString()
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

  /**
   * Lista plataformas disponibles
   */
  getAvailablePlatforms(): TargetPlatform[] {
    return Array.from(this.compilers.keys())
  }
}

// ============================================
// THEME UTILITIES
// ============================================

export class ThemeProcessor {
  /**
   * Convierte tema a CSS variables
   */
  static toCSSVariables(theme: ThemeConfig): string {
    return `
:root {
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-background: ${theme.colors.background};
  --color-surface: ${theme.colors.surface};
  --color-error: ${theme.colors.error};
  --color-success: ${theme.colors.success};
  --color-warning: ${theme.colors.warning};
  --color-text-primary: ${theme.colors.text.primary};
  --color-text-secondary: ${theme.colors.text.secondary};
  --color-text-disabled: ${theme.colors.text.disabled};
  --font-family: ${theme.typography.fontFamily}, system-ui, sans-serif;
  --font-heading: ${theme.typography.headingFont || theme.typography.fontFamily}, system-ui, sans-serif;
  --spacing-scale: ${theme.spacing === 'compact' ? '0.875' : theme.spacing === 'relaxed' ? '1.25' : '1'};
  --radius-base: ${this.getBorderRadius(theme.borderRadius)};
}
`.trim()
  }

  /**
   * Convierte tema a Swift Color definitions
   */
  static toSwiftColors(theme: ThemeConfig): string {
    const hexToSwift = (hex: string) => {
      const rgb = this.hexToRgb(hex)
      if (!rgb) return 'Color.clear'
      return `Color(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)})`
    }

    return `
import SwiftUI

extension Color {
    static let hubLabPrimary = ${hexToSwift(theme.colors.primary)}
    static let hubLabSecondary = ${hexToSwift(theme.colors.secondary)}
    static let hubLabAccent = ${hexToSwift(theme.colors.accent)}
    static let hubLabBackground = ${hexToSwift(theme.colors.background)}
    static let hubLabSurface = ${hexToSwift(theme.colors.surface)}
    static let hubLabError = ${hexToSwift(theme.colors.error)}
    static let hubLabSuccess = ${hexToSwift(theme.colors.success)}
    static let hubLabWarning = ${hexToSwift(theme.colors.warning)}
    static let hubLabTextPrimary = ${hexToSwift(theme.colors.text.primary)}
    static let hubLabTextSecondary = ${hexToSwift(theme.colors.text.secondary)}
    static let hubLabTextDisabled = ${hexToSwift(theme.colors.text.disabled)}
}
`.trim()
  }

  /**
   * Convierte tema a Kotlin Color definitions
   */
  static toKotlinColors(theme: ThemeConfig): string {
    const hexToKotlin = (hex: string) => {
      return `Color(0xFF${hex.replace('#', '')})`
    }

    return `
package com.hublab.ui.theme

import androidx.compose.ui.graphics.Color

object HubLabColors {
    val Primary = ${hexToKotlin(theme.colors.primary)}
    val Secondary = ${hexToKotlin(theme.colors.secondary)}
    val Accent = ${hexToKotlin(theme.colors.accent)}
    val Background = ${hexToKotlin(theme.colors.background)}
    val Surface = ${hexToKotlin(theme.colors.surface)}
    val Error = ${hexToKotlin(theme.colors.error)}
    val Success = ${hexToKotlin(theme.colors.success)}
    val Warning = ${hexToKotlin(theme.colors.warning)}
    val TextPrimary = ${hexToKotlin(theme.colors.text.primary)}
    val TextSecondary = ${hexToKotlin(theme.colors.text.secondary)}
    val TextDisabled = ${hexToKotlin(theme.colors.text.disabled)}
}
`.trim()
  }

  private static getBorderRadius(radius: ThemeConfig['borderRadius']): string {
    const radii: Record<string, string> = {
      none: '0px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px'
    }
    return radii[radius] || '8px'
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
