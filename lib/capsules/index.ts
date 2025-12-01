/**
 * HubLab Capsule System
 *
 * Multi-platform component definitions that generate
 * native code for iOS, Android, and Web.
 */

export * from './types'
export { ButtonCapsule } from './button'

// Capsule Registry
import type { CapsuleDefinition } from './types'
import { ButtonCapsule } from './button'

const capsuleRegistry = new Map<string, CapsuleDefinition>()

// Register built-in capsules
capsuleRegistry.set(ButtonCapsule.id, ButtonCapsule)

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
 * Register a custom capsule
 */
export function registerCapsule(capsule: CapsuleDefinition): void {
  capsuleRegistry.set(capsule.id, capsule)
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
