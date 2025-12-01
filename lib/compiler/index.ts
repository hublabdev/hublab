/**
 * HubLab Multi-Platform Compiler
 *
 * Compiles capsule compositions into native code
 * for iOS (SwiftUI), Android (Jetpack Compose), and Web (React).
 */

export * from './base'
export { IOSCompiler } from './ios/compiler'
export { AndroidCompiler } from './android/compiler'

import { MultiPlatformCompiler } from './base'
import { IOSCompiler } from './ios/compiler'
import { AndroidCompiler } from './android/compiler'
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

  // Register capsules
  const capsules = getAllCapsules()
  iosCompiler.registerCapsules(capsules)
  androidCompiler.registerCapsules(capsules)

  // Register compilers
  compiler.registerCompiler(iosCompiler)
  compiler.registerCompiler(androidCompiler)

  return compiler
}
