/**
 * HubLab Multi-Platform Compiler
 *
 * Compiles capsule compositions into native code
 * for iOS (SwiftUI), Android (Jetpack Compose), Web (React), and Desktop.
 */

export * from './base'
export { IOSCompiler } from './ios/compiler'
export { AndroidCompiler } from './android/compiler'
export { WebCompiler } from './web/compiler'

import { MultiPlatformCompiler } from './base'
import { IOSCompiler } from './ios/compiler'
import { AndroidCompiler } from './android/compiler'
import { WebCompiler } from './web/compiler'
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

  // Register capsules
  const capsules = getAllCapsules()
  iosCompiler.registerCapsules(capsules)
  androidCompiler.registerCapsules(capsules)
  webCompiler.registerCapsules(capsules)

  // Register compilers
  compiler.registerCompiler(iosCompiler)
  compiler.registerCompiler(androidCompiler)
  compiler.registerCompiler(webCompiler)

  return compiler
}

/**
 * Compile for a specific platform
 */
export async function compileForPlatform(
  composition: import('../capsules/types').AppComposition,
  platform: 'ios' | 'android' | 'web'
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
