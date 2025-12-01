'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  IconChevronRight,
  IconCopy,
  IconCheck,
} from '../../../../components/ui/icons'

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/projects',
    description: 'Crear un nuevo proyecto',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/projects',
    description: 'Listar todos los proyectos',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/projects/:id',
    description: 'Obtener un proyecto por ID',
    auth: true,
  },
  {
    method: 'PUT',
    path: '/api/v1/projects/:id',
    description: 'Actualizar un proyecto',
    auth: true,
  },
  {
    method: 'DELETE',
    path: '/api/v1/projects/:id',
    description: 'Eliminar un proyecto',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/v1/projects/:id/capsules',
    description: 'Añadir cápsula a un proyecto',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/v1/projects/:id/export',
    description: 'Exportar proyecto (web)',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/v1/projects/:id/export-native',
    description: 'Exportar proyecto (nativo)',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/capsules',
    description: 'Listar todas las cápsulas disponibles',
    auth: false,
  },
  {
    method: 'GET',
    path: '/api/v1/capsules/:id',
    description: 'Obtener detalles de una cápsula',
    auth: false,
  },
]

const methodColors: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border border-border bg-muted/50 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
        <span className="text-xs text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function APIReferencePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground">Docs</Link>
            <IconChevronRight size={14} />
            <span>API Reference</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold">API Reference</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Documentación completa de la API REST de HubLab
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <h3 className="font-semibold">En esta página</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="#auth" className="text-muted-foreground hover:text-foreground">Autenticación</a></li>
                <li><a href="#base-url" className="text-muted-foreground hover:text-foreground">Base URL</a></li>
                <li><a href="#rate-limits" className="text-muted-foreground hover:text-foreground">Rate Limits</a></li>
                <li><a href="#endpoints" className="text-muted-foreground hover:text-foreground">Endpoints</a></li>
                <li><a href="#errors" className="text-muted-foreground hover:text-foreground">Errores</a></li>
              </ul>
            </div>
          </nav>

          {/* Content */}
          <div className="max-w-3xl space-y-16">
            {/* Auth */}
            <section id="auth">
              <h2 className="text-3xl font-bold">Autenticación</h2>
              <p className="mt-4 text-muted-foreground">
                La API de HubLab usa API keys para autenticación. Incluye tu API key en el header
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">Authorization</code>
                de cada request.
              </p>

              <div className="mt-6">
                <CodeBlock
                  code={`curl -X GET "https://api.hublab.dev/v1/projects" \\
  -H "Authorization: Bearer hublab_sk_your_api_key"`}
                  language="bash"
                />
              </div>

              <div className="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Importante</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mantén tu API key en secreto. No la incluyas en código del lado del cliente ni la
                  compartas públicamente. Puedes regenerar tus keys en cualquier momento desde el dashboard.
                </p>
              </div>

              <h3 className="mt-8 text-xl font-semibold">Obtener API Key</h3>
              <ol className="mt-4 space-y-2 text-muted-foreground">
                <li>1. Accede a <Link href="/dashboard/settings" className="text-primary hover:underline">Configuración</Link></li>
                <li>2. En la sección "API Keys", haz clic en "Nueva Key"</li>
                <li>3. Copia la key generada (solo se muestra una vez)</li>
              </ol>
            </section>

            {/* Base URL */}
            <section id="base-url">
              <h2 className="text-3xl font-bold">Base URL</h2>
              <p className="mt-4 text-muted-foreground">
                Todas las peticiones a la API deben usar la siguiente URL base:
              </p>

              <div className="mt-6">
                <CodeBlock code="https://api.hublab.dev/v1" language="text" />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Para desarrollo local, usa <code className="rounded bg-muted px-1.5 py-0.5">http://localhost:3000/api/v1</code>
              </p>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="text-3xl font-bold">Rate Limits</h2>
              <p className="mt-4 text-muted-foreground">
                Los límites de uso varían según tu plan:
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-left text-sm font-medium">Límite</th>
                      <th className="py-3 px-4 text-center text-sm font-medium">Free</th>
                      <th className="py-3 px-4 text-center text-sm font-medium">Pro</th>
                      <th className="py-3 px-4 text-center text-sm font-medium">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-3 px-4 text-sm">Requests/minuto</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">30</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">120</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">600</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm">Proyectos/hora</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">10</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">100</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">1000</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm">Exportaciones/día</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">50</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">500</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">5000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Los headers de respuesta incluyen información sobre tu uso actual:
              </p>

              <div className="mt-4">
                <CodeBlock
                  code={`X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1704067200`}
                  language="http"
                />
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="text-3xl font-bold">Endpoints</h2>
              <p className="mt-4 text-muted-foreground">
                Lista completa de endpoints disponibles:
              </p>

              <div className="mt-6 space-y-3">
                {endpoints.map((endpoint) => (
                  <div
                    key={`${endpoint.method}-${endpoint.path}`}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <span className={`rounded px-2 py-1 text-xs font-mono font-medium ${methodColors[endpoint.method]}`}>
                      {endpoint.method}
                    </span>
                    <code className="flex-1 font-mono text-sm">{endpoint.path}</code>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                    {endpoint.auth && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">Auth</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Example: Create Project */}
              <h3 className="mt-12 text-2xl font-bold">POST /api/v1/projects</h3>
              <p className="mt-2 text-muted-foreground">Crear un nuevo proyecto.</p>

              <h4 className="mt-6 font-semibold">Request Body</h4>
              <div className="mt-2">
                <CodeBlock
                  code={`{
  "name": "Mi App E-Commerce",
  "description": "Tienda online con carrito y pagos",
  "template": "ecommerce",
  "theme": "modern-blue"
}`}
                  language="json"
                />
              </div>

              <h4 className="mt-6 font-semibold">Response</h4>
              <div className="mt-2">
                <CodeBlock
                  code={`{
  "success": true,
  "project": {
    "id": "proj_abc123xyz",
    "name": "Mi App E-Commerce",
    "description": "Tienda online con carrito y pagos",
    "template": "ecommerce",
    "status": "draft",
    "capsules": [],
    "theme": {
      "name": "Modern Blue",
      "colors": {
        "primary": "#3b82f6",
        "secondary": "#8b5cf6",
        "accent": "#06b6d4",
        "background": "#ffffff",
        "foreground": "#0f172a"
      }
    },
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}`}
                  language="json"
                />
              </div>

              {/* Example: Export Native */}
              <h3 className="mt-12 text-2xl font-bold">POST /api/v1/projects/:id/export-native</h3>
              <p className="mt-2 text-muted-foreground">
                Exportar proyecto a código nativo para múltiples plataformas.
              </p>

              <h4 className="mt-6 font-semibold">Request Body</h4>
              <div className="mt-2">
                <CodeBlock
                  code={`{
  "targets": [
    {
      "platform": "ios",
      "options": {
        "framework": "swiftui",
        "bundleId": "com.mycompany.myapp",
        "minVersion": "15.0"
      }
    },
    {
      "platform": "android",
      "options": {
        "framework": "compose",
        "packageName": "com.mycompany.myapp",
        "minSdk": 24
      }
    },
    {
      "platform": "web",
      "options": {
        "framework": "nextjs"
      }
    }
  ],
  "includeReadme": true,
  "includeGitignore": true
}`}
                  language="json"
                />
              </div>

              <h4 className="mt-6 font-semibold">Response</h4>
              <div className="mt-2">
                <CodeBlock
                  code={`{
  "success": true,
  "exports": [
    {
      "platform": "ios",
      "success": true,
      "downloadUrl": "https://cdn.hublab.dev/exports/ios_abc123.zip",
      "fileCount": 24,
      "totalSize": 156780
    },
    {
      "platform": "android",
      "success": true,
      "downloadUrl": "https://cdn.hublab.dev/exports/android_abc123.zip",
      "fileCount": 31,
      "totalSize": 189234
    },
    {
      "platform": "web",
      "success": true,
      "downloadUrl": "https://cdn.hublab.dev/exports/web_abc123.zip",
      "fileCount": 18,
      "totalSize": 98456
    }
  ],
  "summary": {
    "totalPlatforms": 3,
    "successfulPlatforms": 3,
    "failedPlatforms": [],
    "totalFiles": 73,
    "totalSize": 444470
  }
}`}
                  language="json"
                />
              </div>
            </section>

            {/* Errors */}
            <section id="errors">
              <h2 className="text-3xl font-bold">Errores</h2>
              <p className="mt-4 text-muted-foreground">
                La API usa códigos de estado HTTP estándar y devuelve errores en formato JSON:
              </p>

              <div className="mt-6">
                <CodeBlock
                  code={`{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key",
    "details": null
  }
}`}
                  language="json"
                />
              </div>

              <h3 className="mt-8 text-xl font-semibold">Códigos de Error</h3>
              <div className="mt-4 space-y-2">
                {[
                  { code: 'UNAUTHORIZED', status: 401, desc: 'API key inválida o no proporcionada' },
                  { code: 'FORBIDDEN', status: 403, desc: 'No tienes permiso para este recurso' },
                  { code: 'NOT_FOUND', status: 404, desc: 'El recurso no existe' },
                  { code: 'RATE_LIMIT_EXCEEDED', status: 429, desc: 'Has excedido el límite de requests' },
                  { code: 'VALIDATION_ERROR', status: 400, desc: 'Los datos enviados no son válidos' },
                  { code: 'INTERNAL_ERROR', status: 500, desc: 'Error interno del servidor' },
                ].map((error) => (
                  <div key={error.code} className="flex items-center gap-4 rounded-lg border border-border p-3">
                    <code className="rounded bg-red-100 px-2 py-0.5 text-xs font-mono text-red-700 dark:bg-red-900 dark:text-red-300">
                      {error.status}
                    </code>
                    <code className="font-mono text-sm">{error.code}</code>
                    <span className="text-sm text-muted-foreground">{error.desc}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
