'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/store/projects'

const API_URL = 'https://hublab-api.onrender.com'

const EXAMPLE_PROMPTS = [
  "App de lista de compras con categorias",
  "Fitness tracker con pasos y calorias",
  "App de notas con carpetas",
  "Dashboard de ventas con graficos",
  "Chat app con mensajes",
]

export function AIChat() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const generateWithAI = async (userPrompt: string) => {
    if (!userPrompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate app')
      }

      // Transform AI response to HubLab format
      const aiProject = data.project
      const capsules = transformScreensToCapsules(aiProject.screens)

      // Create project with AI-generated content
      const project = createProject({
        name: aiProject.name || 'AI Generated App',
        description: `Generated from: "${userPrompt}"`,
        targets: aiProject.targets || ['ios', 'android'],
        capsules,
      })

      router.push(`/dashboard/${project.id}`)

    } catch (err) {
      console.error('AI generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate app')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateWithAI(prompt)
  }

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Generate with AI</div>
            <div className="text-xs text-muted-foreground">Describe your app and let AI build it</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-4 p-4 rounded-xl border border-border bg-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your app
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A fitness app with step counter, workout tracker, and progress charts..."
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                disabled={loading}
              />
            </div>

            {/* Example prompts */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1 text-xs rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating app...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

// Helper to transform AI screens to HubLab capsules
function transformScreensToCapsules(screens: any[]): any[] {
  const capsules: any[] = []

  for (const screen of screens || []) {
    if (screen.root) {
      flattenCapsule(screen.root, capsules)
    }
    if (screen.components) {
      for (const component of screen.components) {
        flattenCapsule(component, capsules)
      }
    }
  }

  return capsules
}

function flattenCapsule(instance: any, result: any[]) {
  if (!instance) return

  result.push({
    id: instance.id || `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: instance.capsuleId || instance.type || 'text',
    props: instance.props || {},
  })

  if (instance.children) {
    for (const child of instance.children) {
      flattenCapsule(child, result)
    }
  }
}
