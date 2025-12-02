import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCapsule,
  getAllCapsules,
  getCapsulesByCategory,
  getCapsulesByTag,
  registerCapsule,
  unregisterCapsule,
  supportsPlatform,
  getSupportedPlatforms,
  getCapsuleStats,
  ButtonCapsule,
  TextCapsule,
  InputCapsule,
  CardCapsule,
  ListCapsule,
  ModalCapsule,
  ImageCapsule,
} from '../../lib/capsules'
import type { CapsuleDefinition } from '../../lib/capsules/types'

describe('Capsule System', () => {
  describe('getCapsule', () => {
    it('should return button capsule by id', () => {
      const capsule = getCapsule('button')
      expect(capsule).toBeDefined()
      expect(capsule?.id).toBe('button')
      expect(capsule?.name).toBe('Button')
    })

    it('should return text capsule by id', () => {
      const capsule = getCapsule('text')
      expect(capsule).toBeDefined()
      expect(capsule?.id).toBe('text')
    })

    it('should return undefined for non-existent capsule', () => {
      const capsule = getCapsule('non-existent-capsule')
      expect(capsule).toBeUndefined()
    })
  })

  describe('getAllCapsules', () => {
    it('should return all built-in capsules', () => {
      const capsules = getAllCapsules()
      expect(capsules.length).toBeGreaterThanOrEqual(7)
    })

    it('should include all core capsules', () => {
      const capsules = getAllCapsules()
      const ids = capsules.map(c => c.id)
      expect(ids).toContain('button')
      expect(ids).toContain('text')
      expect(ids).toContain('input')
      expect(ids).toContain('card')
      expect(ids).toContain('list')
      expect(ids).toContain('modal')
      expect(ids).toContain('image')
    })
  })

  describe('getCapsulesByCategory', () => {
    it('should return capsules filtered by ui category', () => {
      const capsules = getCapsulesByCategory('ui')
      expect(capsules.length).toBeGreaterThan(0)
      capsules.forEach(c => {
        expect(c.category).toBe('ui')
      })
    })

    it('should return capsules filtered by forms category', () => {
      const capsules = getCapsulesByCategory('forms')
      expect(capsules.length).toBeGreaterThan(0)
      capsules.forEach(c => {
        expect(c.category).toBe('forms')
      })
    })

    it('should return empty array for non-existent category', () => {
      const capsules = getCapsulesByCategory('nonexistent' as any)
      expect(capsules).toEqual([])
    })
  })

  describe('getCapsulesByTag', () => {
    it('should return capsules with button tag', () => {
      const capsules = getCapsulesByTag('button')
      expect(capsules.length).toBeGreaterThan(0)
      capsules.forEach(c => {
        expect(c.tags).toContain('button')
      })
    })

    it('should return empty array for non-existent tag', () => {
      const capsules = getCapsulesByTag('nonexistenttag')
      expect(capsules).toEqual([])
    })
  })

  describe('registerCapsule and unregisterCapsule', () => {
    const customCapsule: CapsuleDefinition = {
      id: 'custom-test-capsule',
      name: 'Custom Test',
      description: 'A test capsule',
      category: 'ui',
      tags: ['test', 'custom'],
      version: '1.0.0',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Label text' },
      ],
      platforms: {
        web: {
          framework: 'react',
          dependencies: ['react'],
          code: 'export function CustomTest() { return <div>Test</div> }',
        },
      },
    }

    it('should register a new capsule', () => {
      registerCapsule(customCapsule)
      const retrieved = getCapsule('custom-test-capsule')
      expect(retrieved).toBeDefined()
      expect(retrieved?.name).toBe('Custom Test')
    })

    it('should unregister a capsule', () => {
      registerCapsule(customCapsule)
      const result = unregisterCapsule('custom-test-capsule')
      expect(result).toBe(true)
      expect(getCapsule('custom-test-capsule')).toBeUndefined()
    })

    it('should return false when unregistering non-existent capsule', () => {
      const result = unregisterCapsule('definitely-not-a-capsule')
      expect(result).toBe(false)
    })
  })

  describe('supportsPlatform', () => {
    it('should return true for supported platforms', () => {
      expect(supportsPlatform('button', 'web')).toBe(true)
      expect(supportsPlatform('button', 'ios')).toBe(true)
      expect(supportsPlatform('button', 'android')).toBe(true)
    })

    it('should return false for non-existent capsule', () => {
      expect(supportsPlatform('nonexistent', 'web')).toBe(false)
    })
  })

  describe('getSupportedPlatforms', () => {
    it('should return all supported platforms for button', () => {
      const platforms = getSupportedPlatforms('button')
      expect(platforms).toContain('web')
      expect(platforms).toContain('ios')
      expect(platforms).toContain('android')
    })

    it('should return empty array for non-existent capsule', () => {
      const platforms = getSupportedPlatforms('nonexistent')
      expect(platforms).toEqual([])
    })
  })

  describe('getCapsuleStats', () => {
    it('should return valid stats object', () => {
      const stats = getCapsuleStats()
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('categories')
      expect(stats).toHaveProperty('tags')
      expect(stats).toHaveProperty('byPlatform')
      expect(stats.total).toBeGreaterThanOrEqual(7)
    })

    it('should have platform counts', () => {
      const stats = getCapsuleStats()
      expect(stats.byPlatform.web).toBeGreaterThan(0)
      expect(stats.byPlatform.ios).toBeGreaterThan(0)
      expect(stats.byPlatform.android).toBeGreaterThan(0)
    })
  })

  describe('Exported Capsules', () => {
    it('should export ButtonCapsule', () => {
      expect(ButtonCapsule).toBeDefined()
      expect(ButtonCapsule.id).toBe('button')
    })

    it('should export TextCapsule', () => {
      expect(TextCapsule).toBeDefined()
      expect(TextCapsule.id).toBe('text')
    })

    it('should export InputCapsule', () => {
      expect(InputCapsule).toBeDefined()
      expect(InputCapsule.id).toBe('input')
    })

    it('should export CardCapsule', () => {
      expect(CardCapsule).toBeDefined()
      expect(CardCapsule.id).toBe('card')
    })

    it('should export ListCapsule', () => {
      expect(ListCapsule).toBeDefined()
      expect(ListCapsule.id).toBe('list')
    })

    it('should export ModalCapsule', () => {
      expect(ModalCapsule).toBeDefined()
      expect(ModalCapsule.id).toBe('modal')
    })

    it('should export ImageCapsule', () => {
      expect(ImageCapsule).toBeDefined()
      expect(ImageCapsule.id).toBe('image')
    })
  })

  describe('Capsule Structure Validation', () => {
    it('should have valid props for each capsule', () => {
      const capsules = getAllCapsules()
      capsules.forEach(capsule => {
        // Props can be array or record
        if (Array.isArray(capsule.props)) {
          capsule.props.forEach((prop: any) => {
            expect(prop).toHaveProperty('name')
            expect(prop).toHaveProperty('type')
            expect(prop).toHaveProperty('description')
          })
        } else {
          // Record format
          Object.entries(capsule.props).forEach(([name, prop]) => {
            expect(name).toBeTruthy()
            expect(prop).toHaveProperty('type')
            expect(prop).toHaveProperty('description')
          })
        }
      })
    })

    it('should have valid platform implementations', () => {
      const capsules = getAllCapsules()
      capsules.forEach(capsule => {
        expect(capsule.platforms).toBeDefined()
        const platforms = Object.keys(capsule.platforms)
        expect(platforms.length).toBeGreaterThan(0)
      })
    })
  })
})
