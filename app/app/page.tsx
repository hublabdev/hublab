'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import JSZip from 'jszip'

// All Capsules data
const ALL_CAPSULES = [
  // UI Components
  { id: 'button', name: 'Button', icon: '🔘', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'text', name: 'Text', icon: '📝', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'input', name: 'Input', icon: '✏️', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'card', name: 'Card', icon: '🃏', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image', name: 'Image', icon: '🖼️', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Layout & Navigation
  { id: 'list', name: 'List', icon: '📋', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'modal', name: 'Modal', icon: '🪟', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'navigation', name: 'Navigation', icon: '🧭', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tabs', name: 'Tabs', icon: '📑', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'accordion', name: 'Accordion', icon: '🪗', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Forms
  { id: 'form', name: 'Form', icon: '📋', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'switch', name: 'Switch', icon: '🔀', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'slider', name: 'Slider', icon: '🎚️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'dropdown', name: 'Dropdown', icon: '📂', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'datepicker', name: 'Date Picker', icon: '📅', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Data & Charts
  { id: 'chart', name: 'Chart', icon: '📊', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'table', name: 'Table', icon: '📋', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'progress', name: 'Progress', icon: '⏳', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Media
  { id: 'video', name: 'Video', icon: '🎬', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'audio', name: 'Audio', icon: '🎵', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'carousel', name: 'Carousel', icon: '🎠', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Native
  { id: 'camera', name: 'Camera', icon: '📷', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'location', name: 'Location', icon: '📍', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'biometrics', name: 'Biometrics', icon: '🔐', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'notifications', name: 'Notifications', icon: '🔔', category: 'Native', platforms: ['ios', 'android'] },
]

const TEMPLATES = [
  { id: 'fitness', name: 'FitTrack Pro', icon: '💪', description: 'Fitness app with workouts & stats', capsules: 16 },
  { id: 'restaurant', name: 'FoodieSpot', icon: '🍽️', description: 'Restaurant ordering app', capsules: 19 },
  { id: 'taskmanager', name: 'TaskFlow', icon: '✅', description: 'Task manager with projects', capsules: 21 },
  { id: 'music', name: 'Melodify', icon: '🎵', description: 'Music streaming player', capsules: 15 },
  { id: 'banking', name: 'SecureBank', icon: '🏦', description: 'Banking & finance app', capsules: 19 },
  { id: 'travel', name: 'Wanderlust', icon: '✈️', description: 'Travel booking app', capsules: 21 },
  { id: 'chat', name: 'ChatConnect', icon: '💬', description: 'Messaging app', capsules: 12 },
  { id: 'recipe', name: 'CookBook', icon: '👨‍🍳', description: 'Recipe & meal planning', capsules: 19 },
]

const DOCS_SECTIONS = [
  { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
  { id: 'capsules', title: 'Capsules Reference', icon: '📦' },
  { id: 'platforms', title: 'Platform Guide', icon: '📱' },
  { id: 'export', title: 'Export & Deploy', icon: '📤' },
  { id: 'api', title: 'API Reference', icon: '🔌' },
]

type SidebarSection = 'design' | 'templates' | 'capsules' | 'docs'
type CapsuleProps = Record<string, string | number | boolean>
type CapsuleInstance = { id: string; type: string; icon: string; name: string; props: CapsuleProps }

// Default props for each capsule type
const DEFAULT_PROPS: Record<string, CapsuleProps> = {
  button: { text: 'Click Me', variant: 'primary', disabled: false },
  text: { content: 'Hello World', size: 'md', bold: false },
  input: { placeholder: 'Type something...', label: '', required: false },
  card: { title: 'Card Title', description: 'Card description goes here' },
  image: { src: '', alt: 'Image', rounded: true },
  list: { items: 3, showDivider: true },
  switch: { label: 'Toggle Option', checked: true },
  progress: { value: 75, showLabel: true },
  chart: { type: 'bar', title: 'Chart' },
  navigation: { items: 'Home,Search,Profile' },
}

export default function AppPanel() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<SidebarSection>('design')
  const [projectName, setProjectName] = useState('My App')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['ios', 'android', 'web'])
  const [canvasCapsules, setCanvasCapsules] = useState<CapsuleInstance[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportPlatform, setExportPlatform] = useState<string | null>(null)
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null)

  const selectedCapsule = canvasCapsules.find(c => c.id === selectedCapsuleId)

  const categories = ['all', ...new Set(ALL_CAPSULES.map(c => c.category))]

  const filteredCapsules = ALL_CAPSULES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddCapsule = (capsule: typeof ALL_CAPSULES[0]) => {
    const newCapsule: CapsuleInstance = {
      id: `${capsule.id}_${Date.now()}`,
      type: capsule.id,
      icon: capsule.icon,
      name: capsule.name,
      props: DEFAULT_PROPS[capsule.id] ? { ...DEFAULT_PROPS[capsule.id] } : {},
    }
    setCanvasCapsules([...canvasCapsules, newCapsule])
    setSelectedCapsuleId(newCapsule.id) // Auto-select new capsule
  }

  const handleRemoveCapsule = (id: string) => {
    setCanvasCapsules(canvasCapsules.filter(c => c.id !== id))
    if (selectedCapsuleId === id) setSelectedCapsuleId(null)
  }

  const handleUpdateCapsuleProp = (capsuleId: string, propName: string, value: string | number | boolean) => {
    setCanvasCapsules(canvasCapsules.map(c =>
      c.id === capsuleId
        ? { ...c, props: { ...c.props, [propName]: value } }
        : c
    ))
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setProjectName(template.name)
      // Simulate loading template capsules
      const sampleCapsules: CapsuleInstance[] = [
        { id: 'nav_1', type: 'navigation', icon: '🧭', name: 'Navigation', props: DEFAULT_PROPS.navigation || {} },
        { id: 'text_1', type: 'text', icon: '📝', name: 'Text', props: DEFAULT_PROPS.text || {} },
        { id: 'card_1', type: 'card', icon: '🃏', name: 'Card', props: DEFAULT_PROPS.card || {} },
        { id: 'button_1', type: 'button', icon: '🔘', name: 'Button', props: DEFAULT_PROPS.button || {} },
      ]
      setCanvasCapsules(sampleCapsules)
      setActiveSection('design')
    }
  }

  const handleExport = async (platform: string) => {
    setExporting(true)
    setExportPlatform(platform)

    try {
      // Call API to generate code
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          version: '1.0.0',
          targets: [platform],
          theme: {
            name: 'Default',
            colors: {
              primary: '#6366F1',
              secondary: '#8B5CF6',
              background: '#FFFFFF'
            }
          },
          screens: [{
            id: 'home',
            name: 'Home',
            root: {
              id: 'container',
              capsuleId: 'card',
              props: { title: projectName },
              children: canvasCapsules.map(c => ({
                id: c.id,
                capsuleId: c.type,
                props: {}
              }))
            }
          }]
        })
      })

      const data = await response.json()

      if (data.success && data.results?.[0]?.files) {
        // Create ZIP file
        const zip = new JSZip()
        const files = data.results[0].files

        // Add files to ZIP
        for (const file of files) {
          zip.file(file.path, file.content)
        }

        // Add README
        zip.file('README.md', `# ${projectName}

Generated by HubLab - https://hublab.dev

## Platform: ${platform}
## Generated: ${new Date().toISOString()}

## Files included:
${files.map((f: { path: string }) => `- ${f.path}`).join('\n')}

## Getting Started

${platform === 'ios' ? `1. Open the project in Xcode
2. Select your development team
3. Build and run on simulator or device` : ''}
${platform === 'android' ? `1. Open the project in Android Studio
2. Sync Gradle files
3. Build and run on emulator or device` : ''}
${platform === 'web' ? `1. Run \`npm install\`
2. Run \`npm run dev\`
3. Open http://localhost:3000` : ''}
${platform === 'desktop' ? `1. Run \`npm install\`
2. Run \`npm run tauri dev\`
3. The app will open automatically` : ''}
`)

        // Generate ZIP blob
        const blob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 9 }
        })

        // Download ZIP
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${platform}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setExporting(false)
      setShowExportModal(false)
    }
  }

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  return (
    <div className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden">
      {/* Left Sidebar - n8n style */}
      <aside className="w-16 bg-[#0f0f0f] border-r border-white/5 flex flex-col items-center py-4">
        {/* Logo */}
        <Link href="/" className="mb-8 text-xl font-bold">
          H
        </Link>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center gap-2">
          <button
            onClick={() => setActiveSection('design')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'design' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Design"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </button>

          <button
            onClick={() => setActiveSection('templates')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'templates' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Templates"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>

          <button
            onClick={() => setActiveSection('capsules')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'capsules' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Capsules"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </button>

          <button
            onClick={() => setActiveSection('docs')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'docs' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Documentation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        </nav>

        {/* User/Settings */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all" title="Settings">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
            U
          </div>
        </div>
      </aside>

      {/* Secondary Sidebar - Content Panel */}
      <aside className="w-72 bg-[#0f0f0f] border-r border-white/5 flex flex-col">
        {/* Panel Header */}
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold text-lg capitalize">{activeSection}</h2>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Design Panel */}
          {activeSection === 'design' && (
            <div className="p-4 space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Target Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'ios', name: 'iOS', icon: '🍎' },
                    { id: 'android', name: 'Android', icon: '🤖' },
                    { id: 'web', name: 'Web', icon: '🌐' },
                    { id: 'desktop', name: 'Desktop', icon: '💻' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        selectedPlatforms.includes(p.id)
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Added Capsules */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">Components ({canvasCapsules.length})</label>
                  <button
                    onClick={() => setActiveSection('capsules')}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    + Add
                  </button>
                </div>
                {canvasCapsules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <div className="text-2xl mb-2">📦</div>
                    No components yet
                    <div className="text-xs mt-1">Add capsules from the library</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {canvasCapsules.map((capsule, index) => (
                      <div
                        key={capsule.id}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
                      >
                        <span className="text-sm">{capsule.icon}</span>
                        <span className="flex-1 text-sm truncate">{capsule.name}</span>
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                        <button
                          onClick={() => handleRemoveCapsule(capsule.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Templates Panel */}
          {activeSection === 'templates' && (
            <div className="p-4 space-y-2">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                  className="w-full flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left"
                >
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-400 truncate">{template.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.capsules} components</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Capsules Panel */}
          {activeSection === 'capsules' && (
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search capsules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              {/* Capsules Grid */}
              <div className="grid grid-cols-2 gap-2">
                {filteredCapsules.map(capsule => (
                  <button
                    key={capsule.id}
                    onClick={() => handleAddCapsule(capsule)}
                    className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <span className="text-xl">{capsule.icon}</span>
                    <span className="text-xs font-medium truncate w-full text-center">{capsule.name}</span>
                    <div className="flex gap-0.5">
                      {capsule.platforms.includes('web') && <span className="text-[6px] px-1 rounded bg-purple-500/20 text-purple-400">W</span>}
                      {capsule.platforms.includes('ios') && <span className="text-[6px] px-1 rounded bg-blue-500/20 text-blue-400">i</span>}
                      {capsule.platforms.includes('android') && <span className="text-[6px] px-1 rounded bg-green-500/20 text-green-400">A</span>}
                      {capsule.platforms.includes('desktop') && <span className="text-[6px] px-1 rounded bg-orange-500/20 text-orange-400">D</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Docs Panel */}
          {activeSection === 'docs' && (
            <div className="p-4 space-y-2">
              {DOCS_SECTIONS.map(section => (
                <button
                  key={section.id}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left"
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium text-sm">{section.title}</span>
                </button>
              ))}

              <div className="pt-4 border-t border-white/5 mt-4">
                <div className="text-xs text-gray-500 mb-3">Quick Links</div>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-gray-400 hover:text-white">SwiftUI Guide</a>
                  <a href="#" className="block text-gray-400 hover:text-white">Kotlin/Compose Guide</a>
                  <a href="#" className="block text-gray-400 hover:text-white">React Components</a>
                  <a href="#" className="block text-gray-400 hover:text-white">Tauri Desktop</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold">{projectName}</h1>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {selectedPlatforms.map(p => (
                <span key={p} className="px-2 py-0.5 bg-white/5 rounded">
                  {p === 'ios' ? '🍎' : p === 'android' ? '🤖' : p === 'web' ? '🌐' : '💻'}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              Preview
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 bg-[#050505]">
          <div className="h-full flex items-center justify-center">
            {/* Phone Preview */}
            <div className="relative">
              {/* Device Frame */}
              <div className="w-[320px] h-[640px] bg-gray-900 rounded-[40px] border-4 border-gray-800 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />

                {/* Screen */}
                <div className="w-full h-full bg-white overflow-y-auto">
                  {/* Status Bar */}
                  <div className="h-12 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center pt-2">
                    <span className="text-white text-sm font-semibold">{projectName}</span>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {canvasCapsules.length === 0 ? (
                      <div className="h-[500px] flex flex-col items-center justify-center text-gray-400">
                        <div className="text-4xl mb-3">📱</div>
                        <div className="text-sm font-medium">Your app preview</div>
                        <div className="text-xs mt-1">Add capsules to see them here</div>
                      </div>
                    ) : (
                      canvasCapsules.map((capsule, index) => (
                        <div
                          key={capsule.id}
                          onClick={() => setSelectedCapsuleId(capsule.id)}
                          className={`animate-fadeIn cursor-pointer relative group ${
                            selectedCapsuleId === capsule.id ? 'ring-2 ring-blue-500 ring-offset-2 rounded-xl' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Delete button on hover */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveCapsule(capsule.id); }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center"
                          >
                            ×
                          </button>
                          {/* Render different capsule previews with editable props */}
                          {capsule.type === 'navigation' && (
                            <div className="flex justify-around py-2 bg-gray-100 rounded-lg">
                              {(String(capsule.props?.items || 'Home,Search,Profile')).split(',').map(t => (
                                <span key={t} className="text-xs text-gray-600">{t.trim()}</span>
                              ))}
                            </div>
                          )}
                          {capsule.type === 'text' && (
                            <div className="py-2">
                              <div className={`text-gray-900 ${capsule.props?.bold ? 'font-bold' : ''} ${capsule.props?.size === 'lg' ? 'text-xl' : capsule.props?.size === 'sm' ? 'text-sm' : 'text-lg'}`}>
                                {String(capsule.props?.content || 'Hello World')}
                              </div>
                            </div>
                          )}
                          {capsule.type === 'button' && (
                            <button className={`w-full py-3 rounded-xl font-medium ${
                              capsule.props?.variant === 'secondary' ? 'bg-gray-200 text-gray-800' :
                              capsule.props?.variant === 'outline' ? 'border-2 border-blue-500 text-blue-500 bg-white' :
                              'bg-blue-500 text-white'
                            } ${capsule.props?.disabled ? 'opacity-50' : ''}`}>
                              {String(capsule.props?.text || 'Click Me')}
                            </button>
                          )}
                          {capsule.type === 'card' && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="w-full h-24 bg-gray-200 rounded-lg mb-3" />
                              <div className="font-medium text-gray-900">{String(capsule.props?.title || 'Card Title')}</div>
                              <div className="text-xs text-gray-500">{String(capsule.props?.description || 'Card description')}</div>
                            </div>
                          )}
                          {capsule.type === 'input' && (
                            <div>
                              {capsule.props?.label && <label className="text-xs text-gray-600 mb-1 block">{String(capsule.props.label)}</label>}
                              <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-400 text-sm">
                                {String(capsule.props?.placeholder || 'Type something...')}
                              </div>
                            </div>
                          )}
                          {capsule.type === 'image' && (
                            <div className={`w-full h-40 bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center ${capsule.props?.rounded ? 'rounded-xl' : ''}`}>
                              <span className="text-3xl">🖼️</span>
                            </div>
                          )}
                          {capsule.type === 'list' && (
                            <div className="space-y-2">
                              {Array.from({ length: Number(capsule.props?.items) || 3 }).map((_, i) => (
                                <div key={i} className={`flex items-center gap-2 p-2 bg-gray-50 rounded-lg ${capsule.props?.showDivider && i > 0 ? 'border-t border-gray-200' : ''}`}>
                                  <div className="w-8 h-8 bg-gray-200 rounded" />
                                  <span className="text-sm text-gray-700">Item {i + 1}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {capsule.type === 'chart' && (
                            <div className="h-32 bg-gray-50 rounded-xl p-3 flex items-end justify-around">
                              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                                <div key={i} className="w-6 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          )}
                          {capsule.type === 'switch' && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <span className="text-sm text-gray-700">{String(capsule.props?.label || 'Toggle')}</span>
                              <div className={`w-12 h-6 rounded-full p-1 ${capsule.props?.checked ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-all ${capsule.props?.checked ? 'ml-auto' : ''}`} />
                              </div>
                            </div>
                          )}
                          {capsule.type === 'progress' && (
                            <div className="space-y-2">
                              {capsule.props?.showLabel && (
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Progress</span>
                                  <span>{capsule.props?.value || 75}%</span>
                                </div>
                              )}
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${capsule.props?.value || 75}%` }} />
                              </div>
                            </div>
                          )}
                          {/* Fallback for other types */}
                          {!['navigation', 'text', 'button', 'card', 'input', 'image', 'list', 'chart', 'switch', 'progress'].includes(capsule.type) && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <span className="text-xl">{capsule.icon}</span>
                              <span className="text-sm text-gray-700">{capsule.name}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full" />
              </div>

              {/* Floating Info */}
              <div className="absolute -right-48 top-0 w-40 text-xs text-gray-500 space-y-4">
                <div>
                  <div className="text-gray-400 font-medium">Components</div>
                  <div className="text-2xl font-bold text-white">{canvasCapsules.length}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Platforms</div>
                  <div className="text-lg font-bold text-white">{selectedPlatforms.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Properties Panel - Right Sidebar */}
      {selectedCapsule && (
        <aside className="w-72 bg-[#0f0f0f] border-l border-white/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCapsule.icon}</span>
                <span className="font-medium">{selectedCapsule.name}</span>
              </div>
              <button
                onClick={() => setSelectedCapsuleId(null)}
                className="text-gray-500 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Properties</div>

            {/* Dynamic props based on capsule type */}
            {selectedCapsule.type === 'button' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={String(selectedCapsule.props?.text || '')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Variant</label>
                  <select
                    value={String(selectedCapsule.props?.variant || 'primary')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'variant', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedCapsule.props?.disabled)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'disabled', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-400">Disabled</label>
                </div>
              </>
            )}

            {selectedCapsule.type === 'text' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Content</label>
                  <textarea
                    value={String(selectedCapsule.props?.content || '')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'content', e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Size</label>
                  <select
                    value={String(selectedCapsule.props?.size || 'md')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedCapsule.props?.bold)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'bold', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-400">Bold</label>
                </div>
              </>
            )}

            {selectedCapsule.type === 'input' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input
                    type="text"
                    value={String(selectedCapsule.props?.label || '')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={String(selectedCapsule.props?.placeholder || '')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedCapsule.props?.required)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'required', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-400">Required</label>
                </div>
              </>
            )}

            {selectedCapsule.type === 'card' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={String(selectedCapsule.props?.title || '')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Description</label>
                  <textarea
                    value={String(selectedCapsule.props?.description || '')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </>
            )}

            {selectedCapsule.type === 'switch' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input
                    type="text"
                    value={String(selectedCapsule.props?.label || '')}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedCapsule.props?.checked)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'checked', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-400">Default On</label>
                </div>
              </>
            )}

            {selectedCapsule.type === 'progress' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Value ({selectedCapsule.props?.value || 75}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Number(selectedCapsule.props?.value || 75)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedCapsule.props?.showLabel)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showLabel', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-400">Show Label</label>
                </div>
              </>
            )}

            {selectedCapsule.type === 'navigation' && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">Items (comma separated)</label>
                <input
                  type="text"
                  value={String(selectedCapsule.props?.items || 'Home,Search,Profile')}
                  onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {selectedCapsule.type === 'list' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Number of Items</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={Number(selectedCapsule.props?.items || 3)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedCapsule.props?.showDivider)}
                    onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showDivider', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-400">Show Dividers</label>
                </div>
              </>
            )}

            {selectedCapsule.type === 'image' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(selectedCapsule.props?.rounded)}
                  onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'rounded', e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm text-gray-400">Rounded Corners</label>
              </div>
            )}

            {/* Delete button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => handleRemoveCapsule(selectedCapsule.id)}
                className="w-full py-2 text-red-400 hover:text-red-300 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Component
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Export {projectName}</h3>
            <p className="text-gray-400 text-sm mb-6">Choose your target platform to generate native code:</p>

            <div className="space-y-2">
              {[
                { id: 'ios', name: 'iOS (SwiftUI)', icon: '🍎', desc: 'Xcode project' },
                { id: 'android', name: 'Android (Kotlin)', icon: '🤖', desc: 'Android Studio project' },
                { id: 'web', name: 'Web (React)', icon: '🌐', desc: 'Next.js project' },
                { id: 'desktop', name: 'Desktop (Tauri)', icon: '💻', desc: 'Cross-platform desktop app' },
              ].filter(p => selectedPlatforms.includes(p.id)).map(platform => (
                <button
                  key={platform.id}
                  onClick={() => handleExport(platform.id)}
                  disabled={exporting}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left disabled:opacity-50"
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-sm text-gray-400">{platform.desc}</div>
                  </div>
                  {exporting && exportPlatform === platform.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
