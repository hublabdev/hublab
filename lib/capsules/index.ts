/**
 * HubLab Capsule System
 *
 * Multi-platform component definitions that generate
 * native code for iOS, Android, and Web.
 */

export * from './types'

// Export all capsules
export { ButtonCapsule } from './button'
export { TextCapsule } from './text'
export { InputCapsule } from './input'
export { CardCapsule } from './card'
export { ImageCapsule } from './image'
export { ListCapsule } from './list'
export { ModalCapsule } from './modal'
export { FormCapsule } from './form'
export { NavigationCapsule } from './navigation'
export { AuthScreenCapsule } from './auth-screen'

// Capsule Registry
import type { CapsuleDefinition } from './types'
import { ButtonCapsule } from './button'
import { TextCapsule } from './text'
import { InputCapsule } from './input'
import { CardCapsule } from './card'
import { ImageCapsule } from './image'
import { ListCapsule } from './list'
import { ModalCapsule } from './modal'
import { FormCapsule } from './form'
import { NavigationCapsule } from './navigation'
import { AuthScreenCapsule } from './auth-screen'

const capsuleRegistry = new Map<string, CapsuleDefinition>()

// Register all built-in capsules
const builtInCapsules: CapsuleDefinition[] = [
  // UI Components
  ButtonCapsule,
  TextCapsule,
  InputCapsule,
  CardCapsule,
  ImageCapsule,

  // Layout & Navigation
  ListCapsule,
  ModalCapsule,
  NavigationCapsule,

  // Forms
  FormCapsule,

  // Screens
  AuthScreenCapsule,
]

builtInCapsules.forEach(capsule => {
  capsuleRegistry.set(capsule.id, capsule)
})

/**
 * Get a capsule by ID
 */
export function getCapsule(id: string): CapsuleDefinition | undefined {
  return capsuleRegistry.get(id)
}

/**
 * Get all registered capsules
 */
export function getAllCapsules(): CapsuleDefinition[] {
  return Array.from(capsuleRegistry.values())
}

/**
 * Get capsules by category
 */
export function getCapsulesByCategory(category: string): CapsuleDefinition[] {
  return getAllCapsules().filter(c => c.category === category)
}

/**
 * Get capsules by tag
 */
export function getCapsulesByTag(tag: string): CapsuleDefinition[] {
  return getAllCapsules().filter(c => c.tags.includes(tag))
}

/**
 * Register a custom capsule
 */
export function registerCapsule(capsule: CapsuleDefinition): void {
  capsuleRegistry.set(capsule.id, capsule)
}

/**
 * Unregister a capsule
 */
export function unregisterCapsule(id: string): boolean {
  return capsuleRegistry.delete(id)
}

/**
 * Check if a capsule supports a specific platform
 */
export function supportsPlatform(
  id: string,
  platform: 'web' | 'ios' | 'android' | 'desktop'
): boolean {
  const capsule = capsuleRegistry.get(id)
  return capsule?.platforms[platform] !== undefined
}

/**
 * Get all supported platforms for a capsule
 */
export function getSupportedPlatforms(id: string): string[] {
  const capsule = capsuleRegistry.get(id)
  if (!capsule) return []
  return Object.keys(capsule.platforms)
}

/**
 * Get capsule statistics
 */
export function getCapsuleStats() {
  const capsules = getAllCapsules()
  const categories = new Set(capsules.map(c => c.category))
  const tags = new Set(capsules.flatMap(c => c.tags))

  return {
    total: capsules.length,
    categories: Array.from(categories),
    tags: Array.from(tags),
    byPlatform: {
      web: capsules.filter(c => c.platforms.web).length,
      ios: capsules.filter(c => c.platforms.ios).length,
      android: capsules.filter(c => c.platforms.android).length,
      desktop: capsules.filter(c => c.platforms.desktop).length,
    }
  }
}
