/**
 * Example: Generate a basic app for iOS and Android
 */

import { createCompiler, type AppComposition } from '../lib'

// Define your app composition
const myApp: AppComposition = {
  name: 'My Shopping List',
  description: 'A simple shopping list app',
  version: '1.0.0',
  targets: ['ios', 'android', 'web'],

  // Root component tree
  root: {
    id: 'root',
    capsuleId: 'container',
    props: {
      padding: 16
    },
    children: [
      {
        id: 'header-btn',
        capsuleId: 'button',
        props: {
          text: 'Add Item',
          variant: 'primary',
          size: 'lg'
        }
      },
      {
        id: 'delete-btn',
        capsuleId: 'button',
        props: {
          text: 'Clear All',
          variant: 'destructive',
          size: 'md'
        }
      }
    ]
  },

  // Theme configuration
  theme: {
    name: 'Modern Blue',
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
        disabled: '#94a3b8'
      }
    },
    typography: {
      fontFamily: 'Inter',
      scale: 'normal'
    },
    spacing: 'normal',
    borderRadius: 'md',
    shadows: true
  },

  // Platform-specific configuration
  platformConfig: {
    ios: {
      framework: 'swiftui',
      bundleId: 'com.example.shoppinglist',
      minVersion: '15.0',
      capabilities: ['push-notifications']
    },
    android: {
      framework: 'compose',
      packageName: 'com.example.shoppinglist',
      minSdk: 24,
      targetSdk: 34,
      permissions: ['INTERNET']
    }
  }
}

// Compile for all platforms
async function main() {
  const compiler = createCompiler()

  console.log('Compiling for iOS and Android...\n')

  const results = await compiler.compileAll(myApp, ['ios', 'android'])

  for (const [platform, result] of results) {
    console.log(`\n=== ${platform.toUpperCase()} ===`)
    console.log(`Success: ${result.success}`)
    console.log(`Files: ${result.files.length}`)

    if (result.errors?.length) {
      console.log('Errors:', result.errors)
    }

    if (result.success) {
      console.log('\nGenerated files:')
      for (const file of result.files) {
        console.log(`  - ${file.path}`)
      }
    }
  }
}

main().catch(console.error)
