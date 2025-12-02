import { describe, it, expect } from 'vitest'
import {
  compileForPlatform,
  compileAll,
  getAvailablePlatforms,
  platformInfo,
} from '../../lib/compiler'
import {
  PlatformCompiler,
  MultiPlatformCompiler,
  ThemeProcessor,
} from '../../lib/compiler/base'
import type { AppComposition, ThemeConfig } from '../../lib/capsules-multiplatform/types'

describe('Compiler System', () => {
  const sampleComposition: AppComposition = {
    id: 'test-app',
    name: 'Test App',
    description: 'A test application',
    version: '1.0.0',
    targets: ['web', 'ios', 'android'],
    capsules: [
      { id: 'cap-1', type: 'button', name: 'Main Button', props: { label: 'Click me' } },
      { id: 'cap-2', type: 'text', name: 'Title', props: { content: 'Hello World' } },
    ],
    theme: {
      name: 'Test Theme',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f8fafc',
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
        },
      },
    },
  }

  describe('compileForPlatform', () => {
    it('should compile for web platform', async () => {
      const result = await compileForPlatform(sampleComposition, 'web')
      expect(result).toBeDefined()
      expect(result.platform).toBe('web')
      expect(result.success).toBe(true)
      expect(result.files).toBeDefined()
      expect(result.files.length).toBeGreaterThan(0)
    })

    it('should compile for ios platform', async () => {
      const result = await compileForPlatform(sampleComposition, 'ios')
      expect(result).toBeDefined()
      expect(result.platform).toBe('ios')
      expect(result.success).toBe(true)
    })

    it('should compile for android platform', async () => {
      const result = await compileForPlatform(sampleComposition, 'android')
      expect(result).toBeDefined()
      expect(result.platform).toBe('android')
      expect(result.success).toBe(true)
    })

    it('should compile for desktop platform', async () => {
      const result = await compileForPlatform(sampleComposition, 'desktop')
      expect(result).toBeDefined()
      expect(result.platform).toBe('desktop')
      expect(result.success).toBe(true)
    })

    it('should include stats in result', async () => {
      const result = await compileForPlatform(sampleComposition, 'web')
      expect(result.stats).toBeDefined()
      expect(result.stats?.fileCount).toBeGreaterThanOrEqual(0)
      expect(result.stats?.totalSize).toBeGreaterThanOrEqual(0)
    })
  })

  describe('compileAll', () => {
    it('should compile for all target platforms', async () => {
      const results = await compileAll(sampleComposition)
      expect(results).toBeDefined()
      expect(results.length).toBe(3) // web, ios, android from targets
    })

    it('should compile for default platforms when no targets specified', async () => {
      const compositionWithoutTargets = { ...sampleComposition, targets: undefined }
      const results = await compileAll(compositionWithoutTargets)
      expect(results).toBeDefined()
      expect(results.length).toBe(4) // web, ios, android, desktop
    })

    it('should return results for each platform', async () => {
      const results = await compileAll(sampleComposition)
      const platforms = results.map(r => r.platform)
      expect(platforms).toContain('web')
      expect(platforms).toContain('ios')
      expect(platforms).toContain('android')
    })
  })

  describe('getAvailablePlatforms', () => {
    it('should return all available platforms', () => {
      const platforms = getAvailablePlatforms()
      expect(platforms).toContain('ios')
      expect(platforms).toContain('android')
      expect(platforms).toContain('web')
      expect(platforms).toContain('desktop')
    })

    it('should return readonly array', () => {
      const platforms = getAvailablePlatforms()
      expect(platforms.length).toBe(4)
    })
  })

  describe('platformInfo', () => {
    it('should have info for iOS', () => {
      expect(platformInfo.ios).toBeDefined()
      expect(platformInfo.ios.name).toBe('iOS')
      expect(platformInfo.ios.framework).toBe('SwiftUI')
    })

    it('should have info for Android', () => {
      expect(platformInfo.android).toBeDefined()
      expect(platformInfo.android.name).toBe('Android')
      expect(platformInfo.android.framework).toBe('Jetpack Compose')
    })

    it('should have info for Web', () => {
      expect(platformInfo.web).toBeDefined()
      expect(platformInfo.web.name).toBe('Web')
      expect(platformInfo.web.framework).toBe('React + Vite')
    })

    it('should have info for Desktop', () => {
      expect(platformInfo.desktop).toBeDefined()
      expect(platformInfo.desktop.name).toBe('Desktop')
      expect(platformInfo.desktop.framework).toBe('Tauri + React')
    })
  })
})

describe('ThemeProcessor', () => {
  const sampleTheme: ThemeConfig = {
    name: 'Test Theme',
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
        disabled: '#94a3b8',
      },
    },
  }

  describe('toCSSVariables', () => {
    it('should generate valid CSS variables', () => {
      const css = ThemeProcessor.toCSSVariables(sampleTheme)
      expect(css).toContain(':root')
      expect(css).toContain('--color-primary')
      expect(css).toContain('#3b82f6')
    })

    it('should include all color variables', () => {
      const css = ThemeProcessor.toCSSVariables(sampleTheme)
      expect(css).toContain('--color-secondary')
      expect(css).toContain('--color-accent')
      expect(css).toContain('--color-background')
      expect(css).toContain('--color-text-primary')
    })

    it('should use default values for missing colors', () => {
      const minimalTheme: ThemeConfig = {
        name: 'Minimal',
        colors: {
          primary: '#000000',
          secondary: '#ffffff',
        },
      }
      const css = ThemeProcessor.toCSSVariables(minimalTheme)
      expect(css).toContain('--color-primary: #000000')
    })
  })

  describe('toSwiftColors', () => {
    it('should generate valid Swift color extensions', () => {
      const swift = ThemeProcessor.toSwiftColors(sampleTheme)
      expect(swift).toContain('import SwiftUI')
      expect(swift).toContain('extension Color')
      expect(swift).toContain('hubLabPrimary')
    })

    it('should convert hex to Swift Color format', () => {
      const swift = ThemeProcessor.toSwiftColors(sampleTheme)
      expect(swift).toContain('Color(red:')
      expect(swift).toContain('green:')
      expect(swift).toContain('blue:')
    })
  })

  describe('toKotlinColors', () => {
    it('should generate valid Kotlin color object', () => {
      const kotlin = ThemeProcessor.toKotlinColors(sampleTheme)
      expect(kotlin).toContain('package com.hublab.ui.theme')
      expect(kotlin).toContain('import androidx.compose.ui.graphics.Color')
      expect(kotlin).toContain('object HubLabColors')
    })

    it('should convert hex to Kotlin Color format', () => {
      const kotlin = ThemeProcessor.toKotlinColors(sampleTheme)
      expect(kotlin).toContain('Color(0xFF')
      expect(kotlin).toContain('Primary')
      expect(kotlin).toContain('Secondary')
    })
  })
})

describe('PlatformCompiler Base Class', () => {
  // Create a concrete implementation for testing
  class TestCompiler extends PlatformCompiler {
    readonly platform = 'web' as const
    readonly name = 'Test Compiler'

    async compile(composition: AppComposition) {
      this.reset()

      if (!composition.name) {
        this.addError('MISSING_NAME', 'Composition name is required')
      }

      if (composition.capsules?.length === 0) {
        this.addWarning('NO_CAPSULES', 'No capsules in composition', undefined, 'Add some capsules')
      }

      const files = [
        { path: 'index.ts', content: `// ${composition.name}` },
      ]

      return this.createResult(this.errors.length === 0, files)
    }

    // Expose protected methods for testing
    public testToIdentifier(name: string) {
      return this.toIdentifier(name)
    }

    public testToCamelCase(str: string) {
      return this.toCamelCase(str)
    }

    public testToPascalCase(str: string) {
      return this.toPascalCase(str)
    }

    public testToSnakeCase(str: string) {
      return this.toSnakeCase(str)
    }

    public testToKebabCase(str: string) {
      return this.toKebabCase(str)
    }

    public testEscapeString(str: string) {
      return this.escapeString(str)
    }

    public testHexToRgb(hex: string) {
      return this.hexToRgb(hex)
    }

    public testGenerateId() {
      return this.generateId()
    }
  }

  const compiler = new TestCompiler()

  describe('String transformations', () => {
    it('should convert to identifier', () => {
      expect(compiler.testToIdentifier('My App Name')).toBe('MyAppName')
      expect(compiler.testToIdentifier('app-name')).toBe('appname')
      expect(compiler.testToIdentifier('123start')).toBe('_123start')
    })

    it('should convert to camelCase', () => {
      expect(compiler.testToCamelCase('My App Name')).toBe('myAppName')
      expect(compiler.testToCamelCase('HELLO WORLD')).toBe('helloWorld')
    })

    it('should convert to PascalCase', () => {
      expect(compiler.testToPascalCase('my app name')).toBe('MyAppName')
      expect(compiler.testToPascalCase('hello world')).toBe('HelloWorld')
    })

    it('should convert to snake_case', () => {
      expect(compiler.testToSnakeCase('My App Name')).toBe('my_app_name')
      expect(compiler.testToSnakeCase('Hello World')).toBe('hello_world')
    })

    it('should convert to kebab-case', () => {
      expect(compiler.testToKebabCase('My App Name')).toBe('my-app-name')
      expect(compiler.testToKebabCase('Hello World')).toBe('hello-world')
    })
  })

  describe('escapeString', () => {
    it('should escape special characters', () => {
      expect(compiler.testEscapeString('Hello "World"')).toBe('Hello \\"World\\"')
      expect(compiler.testEscapeString('Line1\nLine2')).toBe('Line1\\nLine2')
      expect(compiler.testEscapeString('Tab\there')).toBe('Tab\\there')
    })
  })

  describe('hexToRgb', () => {
    it('should convert valid hex to RGB', () => {
      const rgb = compiler.testHexToRgb('#ff0000')
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should handle hex without hash', () => {
      const rgb = compiler.testHexToRgb('00ff00')
      expect(rgb).toEqual({ r: 0, g: 255, b: 0 })
    })

    it('should return null for invalid hex', () => {
      const rgb = compiler.testHexToRgb('invalid')
      expect(rgb).toBeNull()
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = compiler.testGenerateId()
      const id2 = compiler.testGenerateId()
      expect(id1).not.toBe(id2)
      expect(id1.length).toBe(7)
    })
  })

  describe('compile', () => {
    it('should compile valid composition', async () => {
      const composition: AppComposition = {
        name: 'Test App',
        capsules: [{ id: '1', type: 'button', name: 'Btn', props: {} }],
      }
      const result = await compiler.compile(composition)
      expect(result.success).toBe(true)
      expect(result.platform).toBe('web')
    })

    it('should add warning for empty capsules', async () => {
      const composition: AppComposition = {
        name: 'Test App',
        capsules: [],
      }
      const result = await compiler.compile(composition)
      expect(result.warnings).toBeDefined()
      expect(result.warnings?.length).toBeGreaterThan(0)
    })
  })
})

describe('MultiPlatformCompiler', () => {
  it('should register and retrieve compilers', () => {
    const multi = new MultiPlatformCompiler()

    class WebCompiler extends PlatformCompiler {
      readonly platform = 'web' as const
      readonly name = 'Web Compiler'
      async compile() {
        return this.createResult(true, [])
      }
    }

    const webCompiler = new WebCompiler()
    multi.registerCompiler(webCompiler)

    expect(multi.getCompiler('web')).toBe(webCompiler)
    expect(multi.getCompiler('ios')).toBeUndefined()
  })

  it('should return available platforms', () => {
    const multi = new MultiPlatformCompiler()

    class WebCompiler extends PlatformCompiler {
      readonly platform = 'web' as const
      readonly name = 'Web Compiler'
      async compile() {
        return this.createResult(true, [])
      }
    }

    multi.registerCompiler(new WebCompiler())

    const platforms = multi.getAvailablePlatforms()
    expect(platforms).toContain('web')
  })
})
