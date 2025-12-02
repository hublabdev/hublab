'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProject } from '@/lib/store/projects'
import type { TargetPlatform, CapsuleInstance } from '@/lib/store/types'

const PLATFORMS = [
  { id: 'web', name: 'Web', icon: '🌐', description: 'React + Vite' },
  { id: 'ios', name: 'iOS', icon: '🍎', description: 'SwiftUI' },
  { id: 'android', name: 'Android', icon: '🤖', description: 'Jetpack Compose' },
  { id: 'desktop', name: 'Desktop', icon: '💻', description: 'Tauri' },
] as const

interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  capsules: CapsuleInstance[]
  targets: TargetPlatform[]
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch with an empty canvas',
    icon: '📄',
    category: 'basic',
    capsules: [],
    targets: ['web'],
  },
  {
    id: 'login-app',
    name: 'Login App',
    description: 'Authentication screen with login form',
    icon: '🔐',
    category: 'auth',
    capsules: [
      { id: 'cap_auth_1', type: 'auth-screen', props: { mode: 'login', showForgotPassword: true, showSocialLogin: true } },
    ],
    targets: ['web', 'ios', 'android'],
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Marketing page with hero section and CTA',
    icon: '🚀',
    category: 'marketing',
    capsules: [
      { id: 'cap_land_1', type: 'text', props: { content: 'Welcome to Our App', variant: 'h1' } },
      { id: 'cap_land_2', type: 'text', props: { content: 'Build beautiful apps without writing code', variant: 'body' } },
      { id: 'cap_land_3', type: 'button', props: { label: 'Get Started', variant: 'primary', size: 'lg' } },
      { id: 'cap_land_4', type: 'spacer', props: { height: 48 } },
      { id: 'cap_land_5', type: 'card', props: { title: 'Feature 1', subtitle: 'Description of feature 1' } },
      { id: 'cap_land_6', type: 'card', props: { title: 'Feature 2', subtitle: 'Description of feature 2' } },
      { id: 'cap_land_7', type: 'card', props: { title: 'Feature 3', subtitle: 'Description of feature 3' } },
    ],
    targets: ['web'],
  },
  {
    id: 'profile-screen',
    name: 'Profile Screen',
    description: 'User profile with avatar and settings',
    icon: '👤',
    category: 'social',
    capsules: [
      { id: 'cap_prof_1', type: 'avatar', props: { src: '', size: 'xl', fallback: 'JD' } },
      { id: 'cap_prof_2', type: 'text', props: { content: 'John Doe', variant: 'h2' } },
      { id: 'cap_prof_3', type: 'badge', props: { label: 'Pro Member', variant: 'success' } },
      { id: 'cap_prof_4', type: 'divider', props: {} },
      { id: 'cap_prof_5', type: 'list', props: { items: ['Edit Profile', 'Settings', 'Notifications', 'Help & Support', 'Log Out'] } },
    ],
    targets: ['web', 'ios', 'android'],
  },
  {
    id: 'settings-screen',
    name: 'Settings Screen',
    description: 'App settings with toggles and options',
    icon: '⚙️',
    category: 'utility',
    capsules: [
      { id: 'cap_set_1', type: 'text', props: { content: 'Settings', variant: 'h1' } },
      { id: 'cap_set_2', type: 'switch', props: { label: 'Dark Mode', checked: false } },
      { id: 'cap_set_3', type: 'switch', props: { label: 'Push Notifications', checked: true } },
      { id: 'cap_set_4', type: 'switch', props: { label: 'Email Updates', checked: true } },
      { id: 'cap_set_5', type: 'divider', props: {} },
      { id: 'cap_set_6', type: 'dropdown', props: { label: 'Language', placeholder: 'Select language' } },
      { id: 'cap_set_7', type: 'slider', props: { label: 'Font Size', value: 16, min: 12, max: 24 } },
    ],
    targets: ['web', 'ios', 'android'],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Analytics dashboard with charts and stats',
    icon: '📊',
    category: 'business',
    capsules: [
      { id: 'cap_dash_1', type: 'text', props: { content: 'Dashboard', variant: 'h1' } },
      { id: 'cap_dash_2', type: 'card', props: { title: 'Total Users', subtitle: '12,345' } },
      { id: 'cap_dash_3', type: 'card', props: { title: 'Revenue', subtitle: '$45,678' } },
      { id: 'cap_dash_4', type: 'card', props: { title: 'Active Sessions', subtitle: '1,234' } },
      { id: 'cap_dash_5', type: 'chart', props: { type: 'line', title: 'Weekly Overview' } },
      { id: 'cap_dash_6', type: 'progress', props: { value: 75, max: 100, showLabel: true } },
    ],
    targets: ['web', 'desktop'],
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Contact page with form fields',
    icon: '📬',
    category: 'forms',
    capsules: [
      { id: 'cap_cont_1', type: 'text', props: { content: 'Contact Us', variant: 'h1' } },
      { id: 'cap_cont_2', type: 'text', props: { content: 'We would love to hear from you!', variant: 'body' } },
      { id: 'cap_cont_3', type: 'input', props: { label: 'Name', type: 'text', placeholder: 'Your name' } },
      { id: 'cap_cont_4', type: 'input', props: { label: 'Email', type: 'email', placeholder: 'your@email.com' } },
      { id: 'cap_cont_5', type: 'textarea', props: { label: 'Message', placeholder: 'Your message...', rows: 4 } },
      { id: 'cap_cont_6', type: 'button', props: { label: 'Send Message', variant: 'primary' } },
    ],
    targets: ['web'],
  },
  {
    id: 'media-gallery',
    name: 'Media Gallery',
    description: 'Image gallery with video support',
    icon: '🖼️',
    category: 'media',
    capsules: [
      { id: 'cap_gal_1', type: 'text', props: { content: 'Gallery', variant: 'h1' } },
      { id: 'cap_gal_2', type: 'image', props: { src: 'https://picsum.photos/400/300?1', alt: 'Image 1' } },
      { id: 'cap_gal_3', type: 'image', props: { src: 'https://picsum.photos/400/300?2', alt: 'Image 2' } },
      { id: 'cap_gal_4', type: 'image', props: { src: 'https://picsum.photos/400/300?3', alt: 'Image 3' } },
      { id: 'cap_gal_5', type: 'video', props: { src: '', autoplay: false, controls: true } },
    ],
    targets: ['web', 'ios', 'android'],
  },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [targets, setTargets] = useState<TargetPlatform[]>(['web'])
  const [creating, setCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank')

  const selectTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template.id)
    if (template.id !== 'blank' && !name) {
      setName(template.name)
    }
    setTargets(template.targets)
  }

  const toggleTarget = (platform: TargetPlatform) => {
    if (targets.includes(platform)) {
      if (targets.length > 1) {
        setTargets(targets.filter(t => t !== platform))
      }
    } else {
      setTargets([...targets, platform])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setCreating(true)

    const template = PROJECT_TEMPLATES.find(t => t.id === selectedTemplate)
    const templateCapsules = template?.capsules.map(c => ({
      ...c,
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })) || []

    const project = createProject({
      name: name.trim(),
      description: description.trim(),
      targets,
      capsules: templateCapsules,
    })

    router.push(`/dashboard/${project.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to projects
        </Link>
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-1">
          Set up your multi-platform app
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Templates */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Start with a Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROJECT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => selectTemplate(template)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{template.description}</div>
                </div>
                {selectedTemplate === template.id && (
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {selectedTemplate !== 'blank' && (
            <p className="text-xs text-muted-foreground mt-2">
              This template includes {PROJECT_TEMPLATES.find(t => t.id === selectedTemplate)?.capsules.length || 0} pre-built components
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome App"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your app..."
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Target Platforms
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => toggleTarget(platform.id as TargetPlatform)}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                  targets.includes(platform.id as TargetPlatform)
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-xs text-muted-foreground">{platform.description}</div>
                </div>
                {targets.includes(platform.id as TargetPlatform) && (
                  <svg className="w-5 h-5 text-primary ml-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!name.trim() || creating}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                Create Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
