/**
 * HubLab Multi-Platform Compiler
 *
 * Compiles capsule compositions into native code
 * for iOS (SwiftUI), Android (Jetpack Compose), Web (React), and Desktop (Tauri).
 */

export * from './base'
export { IOSCompiler } from './ios/compiler'
export { AndroidCompiler } from './android/compiler'
export { WebCompiler } from './web/compiler'
export { DesktopCompiler } from './desktop/compiler'

import { MultiPlatformCompiler } from './base'
import { IOSCompiler } from './ios/compiler'
import { AndroidCompiler } from './android/compiler'
import { WebCompiler } from './web/compiler'
import { DesktopCompiler } from './desktop/compiler'
import { getAllCapsules } from '../capsules'

/**
 * Create a pre-configured multi-platform compiler
 * with all built-in capsules registered.
 */
export function createCompiler(): MultiPlatformCompiler {
  const compiler = new MultiPlatformCompiler()

  // Create platform compilers
  const iosCompiler = new IOSCompiler()
  const androidCompiler = new AndroidCompiler()
  const webCompiler = new WebCompiler()
  const desktopCompiler = new DesktopCompiler()

  // Register capsules
  const capsules = getAllCapsules()
  iosCompiler.registerCapsules(capsules)
  androidCompiler.registerCapsules(capsules)
  webCompiler.registerCapsules(capsules)
  desktopCompiler.registerCapsules(capsules)

  // Register compilers
  compiler.registerCompiler(iosCompiler)
  compiler.registerCompiler(androidCompiler)
  compiler.registerCompiler(webCompiler)
  compiler.registerCompiler(desktopCompiler)

  return compiler
}

/**
 * Compile for a specific platform
 */
export async function compileForPlatform(
  composition: import('../capsules/types').AppComposition,
  platform: 'ios' | 'android' | 'web' | 'desktop'
) {
  const compiler = createCompiler()
  const platformCompiler = compiler.getCompiler(platform)

  if (!platformCompiler) {
    throw new Error(`No compiler available for platform: ${platform}`)
  }

  return platformCompiler.compile(composition)
}

/**
 * Compile for all target platforms
 */
export async function compileAll(
  composition: import('../capsules/types').AppComposition
) {
  const compiler = createCompiler()
  return compiler.compileAll(composition)
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
    description: 'Native iOS app for iPhone and iPad'
  },
  android: {
    name: 'Android',
    framework: 'Jetpack Compose',
    output: 'Android Studio Project',
    description: 'Native Android app'
  },
  web: {
    name: 'Web',
    framework: 'React + Vite',
    output: 'Vite Project',
    description: 'Modern web application'
  },
  desktop: {
    name: 'Desktop',
    framework: 'Tauri + React',
    output: 'Tauri Project',
    description: 'Native desktop app for macOS, Windows, Linux'
  }
} as const
