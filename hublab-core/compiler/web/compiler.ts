/**
 * HubLab Web Compiler
 *
 * Genera proyectos React/Next.js completos con código nativo.
 * Output: Proyecto listo para desplegar.
 */

import { PlatformCompiler, ThemeProcessor } from '../base'
import type {
  TargetPlatform,
  AppComposition,
  CapsuleInstance,
  CapsuleDefinition,
  WebImplementation,
  WebAppConfig,
  GeneratedFile,
  CompilationResult,
  ThemeConfig
} from '../../capsules/types'

export class WebCompiler extends PlatformCompiler {
  readonly platform: TargetPlatform = 'web'
  readonly name = 'Web React/Next.js Compiler'

  private config: WebAppConfig = {
    framework: 'react',
    typescript: true,
    styling: 'tailwind',
    bundler: 'vite'
  }

  /**
   * Configura opciones específicas de Web
   */
  configure(config: Partial<WebAppConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Compila composición a proyecto web
   */
  async compile(composition: AppComposition): Promise<CompilationResult> {
    this.reset()

    // Merge config from composition if provided
    if (composition.platformConfig?.web) {
      this.config = { ...this.config, ...composition.platformConfig.web }
    }

    const files: GeneratedFile[] = []
    const appName = this.toKebabCase(composition.name)

    try {
      // 1. Package.json
      files.push(this.generatePackageJson(composition, appName))

      // 2. TypeScript config
      if (this.config.typescript) {
        files.push(this.generateTsConfig())
      }

      // 3. Tailwind config
      if (this.config.styling === 'tailwind') {
        files.push(this.generateTailwindConfig())
        files.push(this.generatePostCSSConfig())
      }

      // 4. Vite config
      if (this.config.bundler === 'vite') {
        files.push(this.generateViteConfig(appName))
      }

      // 5. Main entry point
      files.push(this.generateMainEntry(composition, appName))

      // 6. App component
      files.push(this.generateAppComponent(composition, appName))

      // 7. Theme/Styles
      files.push(this.generateGlobalStyles(composition))
      files.push(this.generateThemeProvider(composition))

      // 8. Components
      const componentFiles = this.generateComponents(composition)
      files.push(...componentFiles)

      // 9. Pages/Screens
      files.push(this.generateHomePage(composition))

      // 10. Index.html
      files.push(this.generateIndexHtml(composition, appName))

      // 11. README
      files.push(this.generateReadme(composition, appName))

      // 12. .gitignore
      files.push(this.generateGitignore())

      // 13. ESLint config
      files.push(this.generateEslintConfig())

      return this.createResult(true, files)

    } catch (error) {
      this.addError('COMPILATION_FAILED', error instanceof Error ? error.message : 'Unknown error')
      return this.createResult(false, files)
    }
  }

  // ============================================
  // GENERATORS
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
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
      },
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.20.0',
        ...additionalDeps
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@typescript-eslint/eslint-plugin': '^6.0.0',
        '@typescript-eslint/parser': '^6.0.0',
        '@vitejs/plugin-react': '^4.2.0',
        'autoprefixer': '^10.4.16',
        'eslint': '^8.55.0',
        'eslint-plugin-react-hooks': '^4.6.0',
        'eslint-plugin-react-refresh': '^0.4.5',
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

  private generateTsConfig(): GeneratedFile {
    const tsConfig = {
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
          '@/*': ['src/*'],
          '@/components/*': ['src/components/*'],
          '@/pages/*': ['src/pages/*'],
          '@/theme/*': ['src/theme/*']
        }
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }]
    }

    return {
      path: 'tsconfig.json',
      content: JSON.stringify(tsConfig, null, 2),
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
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        sans: ['var(--font-family)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius-base)',
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

  private generateViteConfig(appName: string): GeneratedFile {
    return {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateMainEntry(composition: AppComposition, appName: string): GeneratedFile {
    return {
      path: 'src/main.tsx',
      content: `/**
 * ${composition.name}
 * Generated by HubLab - https://hublab.dev
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './theme/ThemeProvider'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateAppComponent(composition: AppComposition, appName: string): GeneratedFile {
    return {
      path: 'src/App.tsx',
      content: `/**
 * App Component
 * Generated by HubLab - https://hublab.dev
 */

import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
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
 * Global Styles
 * Generated by HubLab - https://hublab.dev
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

${cssVars}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-[var(--color-background)] text-[var(--color-text-primary)];
    font-family: var(--font-family), system-ui, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading), system-ui, sans-serif;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  /* Safe area padding for mobile */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }
}

/* Smooth animations */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
`,
      encoding: 'utf-8',
      language: 'css'
    }
  }

  private generateThemeProvider(composition: AppComposition): GeneratedFile {
    return {
      path: 'src/theme/ThemeProvider.tsx',
      content: `/**
 * Theme Provider
 * Generated by HubLab - https://hublab.dev
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || defaultTheme
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      let resolved: 'light' | 'dark'

      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        resolved = theme
      }

      setResolvedTheme(resolved)
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
      localStorage.setItem('theme', theme)
    }

    updateTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateTheme)

    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateComponents(composition: AppComposition): GeneratedFile[] {
    const files: GeneratedFile[] = []
    const usedCapsules = this.collectUsedCapsules(composition)

    // Generate index file for components
    const componentExports: string[] = []

    for (const capsuleId of usedCapsules) {
      const capsule = this.getCapsule(capsuleId)

      if (!capsule) {
        this.addWarning('CAPSULE_NOT_FOUND', `Capsule "${capsuleId}" not found in registry`, capsuleId)
        continue
      }

      const impl = capsule.platforms.web as WebImplementation | undefined

      if (!impl) {
        this.addWarning('NO_WEB_IMPL', `Capsule "${capsuleId}" has no web implementation`, capsuleId)
        continue
      }

      const componentName = this.toPascalCase(capsule.name)
      componentExports.push(`export { ${componentName} } from './${componentName}'`)

      files.push({
        path: `src/components/${componentName}.tsx`,
        content: `/**
 * ${componentName}
 * Generated by HubLab - https://hublab.dev
 * Capsule: ${capsule.id} v${capsule.version}
 */

${impl.code}
`,
        encoding: 'utf-8',
        language: 'typescript'
      })
    }

    // Component index
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
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-[var(--color-primary)] text-white py-4 px-6">
        <h1 className="text-xl font-semibold">${composition.name}</h1>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
${capsuleViews}
      </div>
    </main>
  )
}
`,
      encoding: 'utf-8',
      language: 'typescript'
    }
  }

  private generateIndexHtml(composition: AppComposition, appName: string): GeneratedFile {
    return {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="${composition.theme.colors.primary}" />
    <meta name="description" content="${composition.name} - Generated by HubLab" />
    <title>${composition.name}</title>
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

  private generateReadme(composition: AppComposition, appName: string): GeneratedFile {
    return {
      path: 'README.md',
      content: `# ${composition.name}

Generated by [HubLab](https://hublab.dev) - Universal App Compiler

## Requirements

- Node.js 18+
- npm or yarn or pnpm

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## Project Structure

\`\`\`
${appName}/
├── src/
│   ├── components/       # HubLab capsule components
│   ├── pages/
│   │   └── HomePage.tsx  # Main page
│   ├── theme/
│   │   └── ThemeProvider.tsx
│   ├── styles/
│   │   └── globals.css   # Tailwind + CSS variables
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
\`\`\`

## Customization

### Theme
Edit \`src/styles/globals.css\` to customize colors, fonts, and spacing.

### Components
All components in \`src/components/\` are standard React components that you can customize.

## Deployment

### Vercel
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Deploy the dist/ folder
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
\`\`\`

## Support

- Documentation: https://hublab.dev/docs
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
.pnp
.pnp.js

# Build
dist
dist-ssr
build
*.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Testing
coverage
`,
      encoding: 'utf-8',
      language: 'gitignore'
    }
  }

  private generateEslintConfig(): GeneratedFile {
    return {
      path: '.eslintrc.cjs',
      content: `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
`,
      encoding: 'utf-8',
      language: 'javascript'
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
        if (value) {
          parts.push(key)
        } else {
          parts.push(`${key}={false}`)
        }
      } else if (typeof value === 'number') {
        parts.push(`${key}={${value}}`)
      } else if (typeof value === 'object') {
        parts.push(`${key}={${JSON.stringify(value)}}`)
      }
    }

    if (parts.length === 0) return ''
    if (parts.length <= 2) return ' ' + parts.join(' ')

    return '\n' + parts.map(p => `          ${p}`).join('\n') + '\n        '
  }
}
