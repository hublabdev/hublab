/**
 * HubLab Desktop Compiler
 *
 * Genera proyectos Tauri completos para apps nativas de escritorio.
 * Output: Proyecto listo para compilar a macOS, Windows y Linux.
 */

import { PlatformCompiler, ThemeProcessor } from '../base'
import type {
  TargetPlatform,
  AppComposition,
  CapsuleInstance,
  CapsuleDefinition,
  WebImplementation,
  DesktopAppConfig,
  GeneratedFile,
  CompilationResult,
  ThemeConfig
} from '../../capsules/types'

export class DesktopCompiler extends PlatformCompiler {
  readonly platform: TargetPlatform = 'desktop'
  readonly name = 'Desktop Tauri Compiler'

  private config: DesktopAppConfig = {
    framework: 'tauri',
    targets: ['macos', 'windows', 'linux'],
    appId: 'com.hublab.app',
    windowConfig: {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      resizable: true,
      fullscreen: false
    }
  }

  /**
   * Configura opciones específicas de Desktop
   */
  configure(config: Partial<DesktopAppConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Compila composición a proyecto Tauri
   */
  async compile(composition: AppComposition): Promise<CompilationResult> {
    this.reset()

    if (composition.platformConfig?.desktop) {
      this.config = { ...this.config, ...composition.platformConfig.desktop }
    }

    const files: GeneratedFile[] = []
    const appName = this.toKebabCase(composition.name)
    const appNamePascal = this.toPascalCase(composition.name)

    try {
      // ========== FRONTEND (React/Vite) ==========

      // 1. Package.json
      files.push(this.generatePackageJson(composition, appName))

      // 2. Vite config
      files.push(this.generateViteConfig(appName))

      // 3. TypeScript config
      files.push(this.generateTsConfig())

      // 4. Tailwind config
      files.push(this.generateTailwindConfig())

      // 5. PostCSS config
      files.push(this.generatePostCSSConfig())

      // 6. Main entry
      files.push(this.generateMainEntry(composition))

      // 7. App component
      files.push(this.generateAppComponent(composition))

      // 8. Global styles
      files.push(this.generateGlobalStyles(composition))

      // 9. Components (usando implementación web)
      files.push(...this.generateComponents(composition))

      // 10. Pages
      files.push(this.generateHomePage(composition))

      // 11. Tauri API hooks
      files.push(this.generateTauriHooks())

      // 12. Index.html
      files.push(this.generateIndexHtml(composition))

      // ========== TAURI (Rust backend) ==========

      // 13. Cargo.toml
      files.push(this.generateCargoToml(composition, appName))

      // 14. tauri.conf.json
      files.push(this.generateTauriConfig(composition, appName, appNamePascal))

      // 15. main.rs
      files.push(this.generateMainRs(appNamePascal))

      // 16. lib.rs (commands)
      files.push(this.generateLibRs())

      // 17. build.rs
      files.push(this.generateBuildRs())

      // 18. Capabilities
      files.push(this.generateCapabilities(appName))

      // ========== META ==========

      // 19. README
      files.push(this.generateReadme(composition, appName))

      // 20. .gitignore
      files.push(this.generateGitignore())

      return this.createResult(true, files)

    } catch (error) {
      this.addError('COMPILATION_FAILED', error instanceof Error ? error.message : 'Unknown error')
      return this.createResult(false, files)
    }
  }

  // ============================================
  // FRONTEND GENERATORS
  // ============================================

  private generatePackageJson(composition: AppComposition, appName: string): GeneratedFile {
    const deps = this.collectDependencies(composition)
    const additionalDeps: Record<string, string> = {}

    for (const dep of deps) {
      if (dep.includes(':')) {
        const [name, version] = dep.split(':')
        additionalDeps[name] = version || 'latest'
      } else {
        additionalDeps[dep] = 'latest'
      }
    }

    const packageJson = {
      name: appName,
      version: composition.version || '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        tauri: 'tauri',
        'tauri:dev': 'tauri dev',
        'tauri:build': 'tauri build',
        'tauri:build:mac': 'tauri build --target universal-apple-darwin',
        'tauri:build:win': 'tauri build --target x86_64-pc-windows-msvc',
        'tauri:build:linux': 'tauri build --target x86_64-unknown-linux-gnu'
      },
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.20.0',
        '@tauri-apps/api': '^2.0.0',
        '@tauri-apps/plugin-shell': '^2.0.0',
        '@tauri-apps/plugin-os': '^2.0.0',
        '@tauri-apps/plugin-dialog': '^2.0.0',
        '@tauri-apps/plugin-fs': '^2.0.0',
        ...additionalDeps
      },
      devDependencies: {
        '@tauri-apps/cli': '^2.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.2.0',
        'autoprefixer': '^10.4.16',
        'postcss': '^8.4.32',
        'tailwindcss': '^3.3.6',
        'typescript': '^5.3.0',
        'vite': '^5.0.0'
      }
    }

    return {
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
      encoding: 'utf-8',
      language: 'json'
    }
  }

  private generateViteConfig(appName: string): GeneratedFile {
    return {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
// https://tauri.app/start/frontend/vite/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // Tell vite to ignore watching \`src-tauri\`
      ignored: ['**/src-tauri/**'],
    },
  },
  // Env variables starting with TAURI_ are exposed to the client
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    // Produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    outDir: 'dist',
  },
})
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateTsConfig(): GeneratedFile {
    return {
      path: 'tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          baseUrl: '.',
          paths: {
            '@/*': ['src/*']
          }
        },
        include: ['src'],
        references: [{ path: './tsconfig.node.json' }]
      }, null, 2),
      encoding: 'utf-8',
      language: 'json'
    }
  }

  private generateTailwindConfig(): GeneratedFile {
    return {
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
      },
    },
  },
  plugins: [],
}
`,
      encoding: 'utf-8',
      language: 'javascript'
    }
  }

  private generatePostCSSConfig(): GeneratedFile {
    return {
      path: 'postcss.config.js',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
      encoding: 'utf-8',
      language: 'javascript'
    }
  }

  private generateMainEntry(composition: AppComposition): GeneratedFile {
    return {
      path: 'src/main.tsx',
      content: `/**
 * ${composition.name} - Desktop App
 * Generated by HubLab - https://hublab.dev
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateAppComponent(composition: AppComposition): GeneratedFile {
    return {
      path: 'src/App.tsx',
      content: `/**
 * App Component
 * Generated by HubLab - https://hublab.dev
 */

import { Routes, Route } from 'react-router-dom'
import { useTauriWindow } from './hooks/useTauri'
import HomePage from './pages/HomePage'

function App() {
  const { platform, isMaximized } = useTauriWindow()

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* Custom titlebar for frameless window */}
      <header
        data-tauri-drag-region
        className="h-10 flex items-center justify-between px-4 bg-[var(--color-surface)] border-b border-gray-200 select-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">${composition.name}</span>
        </div>

        {platform !== 'darwin' && (
          <div className="flex items-center gap-1">
            <WindowControls />
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="h-[calc(100vh-40px)] overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}

function WindowControls() {
  const { minimize, toggleMaximize, close } = useTauriWindow()

  return (
    <>
      <button
        onClick={minimize}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <button
        onClick={toggleMaximize}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
        </svg>
      </button>
      <button
        onClick={close}
        className="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white rounded"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </>
  )
}

export default App
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateGlobalStyles(composition: AppComposition): GeneratedFile {
    const cssVars = ThemeProcessor.toCSSVariables(composition.theme)

    return {
      path: 'src/styles/globals.css',
      content: `/**
 * Global Styles - Desktop App
 * Generated by HubLab - https://hublab.dev
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

${cssVars}

@layer base {
  * {
    @apply border-gray-200;
  }

  body {
    @apply bg-[var(--color-background)] text-[var(--color-text-primary)] overflow-hidden;
    font-family: var(--font-family), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    /* Prevent text selection on drag regions */
    -webkit-user-select: none;
    user-select: none;
  }

  /* Allow text selection in content areas */
  main, .selectable {
    -webkit-user-select: text;
    user-select: text;
  }

  /* Hide scrollbars on Windows/Linux (macOS has overlay scrollbars) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}

/* Titlebar drag region */
[data-tauri-drag-region] {
  -webkit-app-region: drag;
}

[data-tauri-drag-region] button,
[data-tauri-drag-region] a,
[data-tauri-drag-region] input {
  -webkit-app-region: no-drag;
}
`,
      encoding: 'utf-8',
      language: 'css'
    }
  }

  private generateTauriHooks(): GeneratedFile {
    return {
      path: 'src/hooks/useTauri.ts',
      content: `/**
 * Tauri API Hooks
 * Generated by HubLab - https://hublab.dev
 */

import { useState, useEffect, useCallback } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { platform as getPlatform } from '@tauri-apps/plugin-os'

export function useTauriWindow() {
  const [isMaximized, setIsMaximized] = useState(false)
  const [platform, setPlatform] = useState<string>('')

  useEffect(() => {
    // Get platform
    getPlatform().then(setPlatform).catch(console.error)

    // Listen for window state changes
    const appWindow = getCurrentWindow()

    const checkMaximized = async () => {
      const maximized = await appWindow.isMaximized()
      setIsMaximized(maximized)
    }

    checkMaximized()

    const unlisten = appWindow.onResized(() => {
      checkMaximized()
    })

    return () => {
      unlisten.then(fn => fn())
    }
  }, [])

  const minimize = useCallback(async () => {
    const appWindow = getCurrentWindow()
    await appWindow.minimize()
  }, [])

  const toggleMaximize = useCallback(async () => {
    const appWindow = getCurrentWindow()
    await appWindow.toggleMaximize()
  }, [])

  const close = useCallback(async () => {
    const appWindow = getCurrentWindow()
    await appWindow.close()
  }, [])

  const setTitle = useCallback(async (title: string) => {
    const appWindow = getCurrentWindow()
    await appWindow.setTitle(title)
  }, [])

  return {
    isMaximized,
    platform,
    minimize,
    toggleMaximize,
    close,
    setTitle
  }
}

export function useTauriFs() {
  const readFile = useCallback(async (path: string): Promise<string> => {
    const { readTextFile } = await import('@tauri-apps/plugin-fs')
    return readTextFile(path)
  }, [])

  const writeFile = useCallback(async (path: string, contents: string) => {
    const { writeTextFile } = await import('@tauri-apps/plugin-fs')
    await writeTextFile(path, contents)
  }, [])

  return { readFile, writeFile }
}

export function useTauriDialog() {
  const openFile = useCallback(async (options?: {
    title?: string
    filters?: { name: string; extensions: string[] }[]
  }) => {
    const { open } = await import('@tauri-apps/plugin-dialog')
    return open({
      title: options?.title,
      filters: options?.filters,
      multiple: false
    })
  }, [])

  const saveFile = useCallback(async (options?: {
    title?: string
    defaultPath?: string
    filters?: { name: string; extensions: string[] }[]
  }) => {
    const { save } = await import('@tauri-apps/plugin-dialog')
    return save({
      title: options?.title,
      defaultPath: options?.defaultPath,
      filters: options?.filters
    })
  }, [])

  const confirm = useCallback(async (message: string, title?: string) => {
    const { confirm: tauriConfirm } = await import('@tauri-apps/plugin-dialog')
    return tauriConfirm(message, { title })
  }, [])

  return { openFile, saveFile, confirm }
}
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateComponents(composition: AppComposition): GeneratedFile[] {
    const files: GeneratedFile[] = []
    const usedCapsules = this.collectUsedCapsules(composition)
    const componentExports: string[] = []

    for (const capsuleId of usedCapsules) {
      const capsule = this.getCapsule(capsuleId)
      if (!capsule) continue

      // Desktop usa implementación web
      const impl = capsule.platforms.web as WebImplementation | undefined
      if (!impl) continue

      const componentName = this.toPascalCase(capsule.name)
      componentExports.push(`export { ${componentName} } from './${componentName}'`)

      files.push({
        path: `src/components/${componentName}.tsx`,
        content: `/**
 * ${componentName}
 * Generated by HubLab - https://hublab.dev
 */

${impl.code}
`,
        encoding: 'utf-8',
        language: 'typescript'
      })
    }

    files.push({
      path: 'src/components/index.ts',
      content: `/**
 * Component exports
 * Generated by HubLab - https://hublab.dev
 */

${componentExports.join('\n')}
`,
      encoding: 'utf-8',
      language: 'typescript'
    })

    return files
  }

  private generateHomePage(composition: AppComposition): GeneratedFile {
    const componentImports = this.generateComponentImports(composition)
    const capsuleViews = this.generateCapsuleViews(composition.root, 2)

    return {
      path: 'src/pages/HomePage.tsx',
      content: `/**
 * HomePage
 * Generated by HubLab - https://hublab.dev
 */

import React from 'react'
${componentImports}

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">${composition.name}</h1>

      <div className="space-y-4">
${capsuleViews}
      </div>
    </div>
  )
}
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateIndexHtml(composition: AppComposition): GeneratedFile {
    return {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${composition.name}</title>
    <style>
      /* Prevent flash of unstyled content */
      html { background-color: ${composition.theme.colors.background}; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
      encoding: 'utf-8',
      language: 'html'
    }
  }

  // ============================================
  // TAURI/RUST GENERATORS
  // ============================================

  private generateCargoToml(composition: AppComposition, appName: string): GeneratedFile {
    return {
      path: 'src-tauri/Cargo.toml',
      content: `[package]
name = "${appName}"
version = "${composition.version || '0.1.0'}"
description = "${composition.description || composition.name}"
authors = ["HubLab"]
edition = "2021"

[lib]
name = "${appName.replace(/-/g, '_')}_lib"
crate-type = ["lib", "cdylib", "staticlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-shell = "2"
tauri-plugin-os = "2"
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "s"
strip = true
`,
      encoding: 'utf-8',
      language: 'toml'
    }
  }

  private generateTauriConfig(
    composition: AppComposition,
    appName: string,
    appNamePascal: string
  ): GeneratedFile {
    const config = {
      $schema: 'https://schema.tauri.app/config/2',
      productName: composition.name,
      version: composition.version || '0.1.0',
      identifier: this.config.appId,
      build: {
        beforeDevCommand: 'npm run dev',
        devUrl: 'http://localhost:1420',
        beforeBuildCommand: 'npm run build',
        frontendDist: '../dist'
      },
      app: {
        windows: [
          {
            title: composition.name,
            width: this.config.windowConfig.width,
            height: this.config.windowConfig.height,
            minWidth: this.config.windowConfig.minWidth,
            minHeight: this.config.windowConfig.minHeight,
            resizable: this.config.windowConfig.resizable,
            fullscreen: this.config.windowConfig.fullscreen,
            decorations: true,
            transparent: false,
            center: true
          }
        ],
        security: {
          csp: null
        }
      },
      plugins: {
        shell: {
          open: true
        }
      },
      bundle: {
        active: true,
        targets: 'all',
        icon: [
          'icons/32x32.png',
          'icons/128x128.png',
          'icons/128x128@2x.png',
          'icons/icon.icns',
          'icons/icon.ico'
        ],
        macOS: {
          minimumSystemVersion: '10.15'
        },
        windows: {
          wix: null,
          nsis: null
        }
      }
    }

    return {
      path: 'src-tauri/tauri.conf.json',
      content: JSON.stringify(config, null, 2),
      encoding: 'utf-8',
      language: 'json'
    }
  }

  private generateMainRs(appNamePascal: string): GeneratedFile {
    const libName = appNamePascal.toLowerCase().replace(/\s/g, '_') + '_lib'

    return {
      path: 'src-tauri/src/main.rs',
      content: `// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    ${libName}::run()
}
`,
      encoding: 'utf-8',
      language: 'rust'
    }
  }

  private generateLibRs(): GeneratedFile {
    return {
      path: 'src-tauri/src/lib.rs',
      content: `//! HubLab Desktop App
//! Generated by HubLab - https://hublab.dev

use tauri::Manager;

/// Example command that can be called from the frontend
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to your HubLab app.", name)
}

/// Get system information
#[tauri::command]
fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "os": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![greet, get_system_info])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
`,
      encoding: 'utf-8',
      language: 'rust'
    }
  }

  private generateBuildRs(): GeneratedFile {
    return {
      path: 'src-tauri/build.rs',
      content: `fn main() {
    tauri_build::build()
}
`,
      encoding: 'utf-8',
      language: 'rust'
    }
  }

  private generateCapabilities(appName: string): GeneratedFile {
    return {
      path: 'src-tauri/capabilities/default.json',
      content: JSON.stringify({
        $schema: 'https://schema.tauri.app/capabilities/2',
        identifier: 'default',
        description: 'Default capabilities for the app',
        windows: ['main'],
        permissions: [
          'core:default',
          'shell:allow-open',
          'os:default',
          'dialog:default',
          'fs:default'
        ]
      }, null, 2),
      encoding: 'utf-8',
      language: 'json'
    }
  }

  // ============================================
  // META GENERATORS
  // ============================================

  private generateReadme(composition: AppComposition, appName: string): GeneratedFile {
    return {
      path: 'README.md',
      content: `# ${composition.name}

Desktop application generated by [HubLab](https://hublab.dev) - Universal App Compiler

Built with **Tauri 2.0** + **React** + **TypeScript** + **Tailwind CSS**

## Requirements

- Node.js 18+
- Rust 1.70+
- Platform-specific dependencies:
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Visual Studio Build Tools, WebView2
  - **Linux**: webkit2gtk, libappindicator

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run in development mode
npm run tauri:dev

# Build for production
npm run tauri:build
\`\`\`

## Platform-Specific Builds

\`\`\`bash
# Build for macOS (Universal)
npm run tauri:build:mac

# Build for Windows
npm run tauri:build:win

# Build for Linux
npm run tauri:build:linux
\`\`\`

## Project Structure

\`\`\`
${appName}/
├── src/                    # Frontend (React)
│   ├── components/         # UI components
│   ├── pages/              # App pages
│   ├── hooks/              # React hooks (Tauri API)
│   └── styles/             # CSS styles
├── src-tauri/              # Backend (Rust)
│   ├── src/
│   │   ├── main.rs         # Entry point
│   │   └── lib.rs          # Commands & logic
│   ├── capabilities/       # Security permissions
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── package.json
└── vite.config.ts
\`\`\`

## Adding Custom Commands

Edit \`src-tauri/src/lib.rs\` to add Rust commands:

\`\`\`rust
#[tauri::command]
fn my_command(arg: String) -> Result<String, String> {
    Ok(format!("Result: {}", arg))
}
\`\`\`

Call from React:

\`\`\`typescript
import { invoke } from '@tauri-apps/api/core'

const result = await invoke('my_command', { arg: 'hello' })
\`\`\`

## Distribution

Built apps are located in \`src-tauri/target/release/bundle/\`:
- **macOS**: \`.app\` and \`.dmg\`
- **Windows**: \`.exe\` and \`.msi\`
- **Linux**: \`.deb\`, \`.rpm\`, and \`.AppImage\`

## Support

- Documentation: https://hublab.dev/docs
- Tauri Docs: https://tauri.app/v2/guides/
- Issues: https://github.com/hublab/hublab/issues
`,
      encoding: 'utf-8',
      language: 'markdown'
    }
  }

  private generateGitignore(): GeneratedFile {
    return {
      path: '.gitignore',
      content: `# Dependencies
node_modules

# Build
dist
src-tauri/target

# Editor
.vscode/*
!.vscode/extensions.json
.idea
*.sw?

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local

# Logs
*.log
npm-debug.log*

# Tauri
src-tauri/WixTools
`,
      encoding: 'utf-8',
      language: 'gitignore'
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private generateComponentImports(composition: AppComposition): string {
    const usedCapsules = this.collectUsedCapsules(composition)
    const componentNames: string[] = []

    for (const capsuleId of usedCapsules) {
      const capsule = this.getCapsule(capsuleId)
      if (capsule) {
        componentNames.push(this.toPascalCase(capsule.name))
      }
    }

    if (componentNames.length === 0) return ''
    return `import { ${componentNames.join(', ')} } from '@/components'`
  }

  private generateCapsuleViews(instance: CapsuleInstance, indent: number): string {
    const capsule = this.getCapsule(instance.capsuleId)
    if (!capsule) return `{/* Capsule not found: ${instance.capsuleId} */}`

    const componentName = this.toPascalCase(capsule.name)
    const props = this.generateJsxProps(instance.props, capsule)
    const spaces = ' '.repeat(indent * 2)

    let jsx = `${spaces}<${componentName}${props}`

    if (instance.children && instance.children.length > 0) {
      const childViews = instance.children
        .map(child => this.generateCapsuleViews(child, indent + 1))
        .join('\n')
      jsx += `>\n${childViews}\n${spaces}</${componentName}>`
    } else {
      jsx += ' />'
    }

    return jsx
  }

  private generateJsxProps(props: Record<string, unknown>, capsule: CapsuleDefinition): string {
    const propDefs = capsule.props
    const parts: string[] = []

    for (const [key, value] of Object.entries(props)) {
      const def = propDefs.find(p => p.name === key)

      if (def?.type === 'action') {
        parts.push(`${key}={() => {}}`)
      } else if (typeof value === 'string') {
        parts.push(`${key}="${this.escapeString(value)}"`)
      } else if (typeof value === 'boolean') {
        parts.push(value ? key : `${key}={false}`)
      } else if (typeof value === 'number') {
        parts.push(`${key}={${value}}`)
      }
    }

    if (parts.length === 0) return ''
    return ' ' + parts.join(' ')
  }
}
