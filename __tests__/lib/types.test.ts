import { describe, it, expect } from 'vitest'
import type {
  TargetPlatform,
  CapsuleDefinition,
  CapsuleInstance,
  CapsuleProp,
  CapsuleCategory,
  PropType,
  WebImplementation,
  IOSImplementation,
  AndroidImplementation,
  DesktopImplementation,
  ThemeConfig,
  GeneratedFile,
  CompilationResult,
} from '../../lib/capsules/types'

describe('Type Definitions', () => {
  describe('TargetPlatform', () => {
    it('should accept valid platform values', () => {
      const platforms: TargetPlatform[] = ['web', 'ios', 'android', 'desktop']
      expect(platforms).toHaveLength(4)
    })
  })

  describe('CapsuleCategory', () => {
    it('should accept all valid categories', () => {
      const categories: CapsuleCategory[] = [
        'ui', 'layout', 'navigation', 'forms', 'data',
        'media', 'feedback', 'feature', 'input', 'screen',
        'device', 'utility', 'overlay', 'communication'
      ]
      expect(categories.length).toBe(14)
    })
  })

  describe('PropType', () => {
    it('should accept all valid prop types', () => {
      const types: PropType[] = [
        'string', 'number', 'boolean', 'color', 'size',
        'spacing', 'icon', 'image', 'action', 'array',
        'object', 'select', 'slot'
      ]
      expect(types.length).toBe(13)
    })
  })

  describe('CapsuleProp', () => {
    it('should create valid prop definition', () => {
      const prop: CapsuleProp = {
        name: 'label',
        type: 'string',
        required: true,
        default: 'Button',
        description: 'Button label text',
        options: undefined,
      }
      expect(prop.name).toBe('label')
      expect(prop.type).toBe('string')
      expect(prop.required).toBe(true)
    })

    it('should allow optional properties', () => {
      const prop: CapsuleProp = {
        name: 'variant',
        type: 'select',
        description: 'Style variant',
        options: ['primary', 'secondary'],
      }
      expect(prop.required).toBeUndefined()
      expect(prop.default).toBeUndefined()
    })
  })

  describe('WebImplementation', () => {
    it('should create valid web implementation', () => {
      const impl: WebImplementation = {
        framework: 'react',
        dependencies: ['react', 'react-dom'],
        code: 'export function Component() { return <div /> }',
        typescript: true,
      }
      expect(impl.framework).toBe('react')
      expect(impl.dependencies).toContain('react')
    })
  })

  describe('IOSImplementation', () => {
    it('should create valid iOS implementation', () => {
      const impl: IOSImplementation = {
        framework: 'swiftui',
        dependencies: [],
        code: 'struct MyView: View { var body: some View { Text("Hello") } }',
        minVersion: '15.0',
      }
      expect(impl.framework).toBe('swiftui')
    })
  })

  describe('AndroidImplementation', () => {
    it('should create valid Android implementation', () => {
      const impl: AndroidImplementation = {
        framework: 'compose',
        dependencies: [],
        code: '@Composable fun MyComponent() { Text("Hello") }',
        minSdk: 21,
      }
      expect(impl.framework).toBe('compose')
      expect(impl.minSdk).toBe(21)
    })
  })

  describe('DesktopImplementation', () => {
    it('should create valid desktop implementation', () => {
      const impl: DesktopImplementation = {
        framework: 'tauri',
        dependencies: ['tauri'],
        code: 'fn main() {}',
        targets: ['macos', 'windows', 'linux'],
      }
      expect(impl.framework).toBe('tauri')
      expect(impl.targets).toContain('macos')
    })
  })

  describe('CapsuleDefinition', () => {
    it('should create valid capsule definition', () => {
      const capsule: CapsuleDefinition = {
        id: 'test-button',
        name: 'Test Button',
        description: 'A test button component',
        category: 'ui',
        tags: ['button', 'interactive'],
        props: [
          { name: 'label', type: 'string', required: true, description: 'Label' },
        ],
        platforms: {
          web: { framework: 'react', dependencies: ['react'], code: '' },
        },
        version: '1.0.0',
      }
      expect(capsule.id).toBe('test-button')
      expect(capsule.category).toBe('ui')
    })
  })

  describe('CapsuleInstance', () => {
    it('should create valid capsule instance', () => {
      const instance: CapsuleInstance = {
        id: 'instance-1',
        capsuleId: 'button',
        props: { label: 'Click me', variant: 'primary' },
        children: [],
      }
      expect(instance.id).toBe('instance-1')
      expect(instance.props.label).toBe('Click me')
    })
  })

  describe('ThemeConfig', () => {
    it('should create valid theme config', () => {
      const theme: ThemeConfig = {
        name: 'My Theme',
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          background: '#ffffff',
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
          },
        },
        typography: {
          fontFamily: 'Inter',
          headingFont: 'Poppins',
        },
        spacing: 'normal',
        borderRadius: 'md',
      }
      expect(theme.name).toBe('My Theme')
      expect(theme.colors.primary).toBe('#3b82f6')
    })
  })

  describe('GeneratedFile', () => {
    it('should create valid generated file', () => {
      const file: GeneratedFile = {
        path: 'src/components/Button.tsx',
        content: 'export function Button() {}',
        encoding: 'utf-8',
        language: 'typescript',
      }
      expect(file.path).toBe('src/components/Button.tsx')
    })
  })

  describe('CompilationResult', () => {
    it('should create valid compilation result', () => {
      const result: CompilationResult = {
        success: true,
        platform: 'web',
        files: [
          { path: 'index.ts', content: 'export {}' },
        ],
        warnings: [
          { code: 'W001', message: 'Minor issue' },
        ],
        metadata: {
          capsuleCount: 5,
          totalFiles: 10,
          totalSize: 5000,
          compiledAt: new Date().toISOString(),
        },
      }
      expect(result.success).toBe(true)
      expect(result.platform).toBe('web')
      expect(result.files.length).toBe(1)
    })

    it('should handle failed compilation', () => {
      const result: CompilationResult = {
        success: false,
        platform: 'ios',
        files: [],
        errors: [
          { code: 'E001', message: 'Compilation failed', capsuleId: 'button-1' },
        ],
      }
      expect(result.success).toBe(false)
      expect(result.errors?.length).toBe(1)
    })
  })
})
