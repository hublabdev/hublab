/**
 * HubLab Multi-Platform Compiler
 *
 * Compiles capsule compositions into native code
 * for iOS (SwiftUI), Android (Jetpack Compose), Web (React), and Desktop (Tauri).
 */

export * from './base'

import type {
  CompilationResult,
  AppComposition,
  TargetPlatform
} from '../capsules/types'

import { WebCompiler } from './web/compiler'
import { IOSCompiler } from './ios/compiler'
import { AndroidCompiler } from './android/compiler'
import { DesktopCompiler } from './desktop/compiler'

// Compiler instances
const webCompiler = new WebCompiler()
const iosCompiler = new IOSCompiler()
const androidCompiler = new AndroidCompiler()
const desktopCompiler = new DesktopCompiler()

/**
 * Get compiler for a specific platform
 */
export function getCompiler(platform: TargetPlatform) {
  switch (platform) {
    case 'web':
      return webCompiler
    case 'ios':
      return iosCompiler
    case 'android':
      return androidCompiler
    case 'desktop':
      return desktopCompiler
    default:
      throw new Error(`Unknown platform: ${platform}`)
  }
}

/**
 * Compile for a specific platform
 */
export async function compileForPlatform(
  composition: AppComposition,
  platform: TargetPlatform
): Promise<CompilationResult> {
  const compiler = getCompiler(platform)
  return compiler.compile(composition)
}

/**
 * Compile for all target platforms
 */
export async function compileAll(
  composition: AppComposition
): Promise<CompilationResult[]> {
  const targets = composition.targets || ['web', 'ios', 'android', 'desktop']
  const results: CompilationResult[] = []

  for (const platform of targets) {
    const result = await compileForPlatform(composition, platform)
    results.push(result)
  }

  return results
}

/**
 * Get available platforms
 */
export function getAvailablePlatforms() {
  return ['ios', 'android', 'web', 'desktop'] as const
}

/**
 * Platform information
 */
export const platformInfo = {
  ios: {
    name: 'iOS',
    framework: 'SwiftUI',
    output: 'Xcode Project',
    description: 'Native iOS app for iPhone and iPad',
    icon: 'apple',
    color: '#007AFF'
  },
  android: {
    name: 'Android',
    framework: 'Jetpack Compose',
    output: 'Android Studio Project',
    description: 'Native Android app',
    icon: 'android',
    color: '#3DDC84'
  },
  web: {
    name: 'Web',
    framework: 'React + Vite',
    output: 'Vite Project',
    description: 'Modern web application',
    icon: 'globe',
    color: '#646CFF'
  },
  desktop: {
    name: 'Desktop',
    framework: 'Tauri + React',
    output: 'Tauri Project',
    description: 'Native desktop app for macOS, Windows, Linux',
    icon: 'desktop',
    color: '#FFC131'
  }
} as const

// Re-export compilers
export { WebCompiler } from './web/compiler'
export { IOSCompiler } from './ios/compiler'
export { AndroidCompiler } from './android/compiler'
export { DesktopCompiler } from './desktop/compiler'
