'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Icons
function IconArrowRight({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function IconCheck({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconGitHub({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function IconPlus({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconPhone({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function IconDownload({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

// Platform logos as simple text badges
const platforms = [
  { name: 'iOS', color: 'from-blue-500 to-blue-600' },
  { name: 'Android', color: 'from-green-500 to-green-600' },
  { name: 'Web', color: 'from-purple-500 to-purple-600' },
  { name: 'Desktop', color: 'from-orange-500 to-orange-600' },
]

const features = [
  {
    title: 'Visual Editor',
    description: 'Drag & drop interface to design your app visually',
  },
  {
    title: 'Native Code',
    description: 'Generates real SwiftUI, Kotlin, and React code',
  },
  {
    title: 'AI Assisted',
    description: 'Describe your app and AI builds the UI for you',
  },
  {
    title: '50+ Capsules',
    description: 'Pre-built components ready to use',
  },
  {
    title: 'Export Anywhere',
    description: 'Download native projects for Xcode, Android Studio, or npm',
  },
  {
    title: 'Open Source',
    description: 'MIT licensed, free forever',
  },
]

const codeExample = {
  swift: `struct ProductCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            AsyncImage(url: product.imageURL)
                .aspectRatio(contentMode: .fill)
                .frame(height: 200)
                .clipped()

            Text(product.name)
                .font(.headline)

            Text("$\\(product.price)")
                .foregroundColor(.blue)
        }
        .background(Color.white)
        .cornerRadius(12)
    }
}`,
  kotlin: `@Composable
fun ProductCard(product: Product) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column {
            AsyncImage(
                model = product.imageUrl,
                contentScale = ContentScale.Crop,
                modifier = Modifier.height(200.dp)
            )

            Text(
                text = product.name,
                style = MaterialTheme.typography.h6
            )

            Text(
                text = "$\${product.price}",
                color = Color.Blue
            )
        }
    }
}`,
  react: `export function ProductCard({ product }: Props) {
  return (
    <div className="rounded-xl bg-white shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold">
          {product.name}
        </h3>

        <p className="text-blue-600">
          \${product.price}
        </p>
      </div>
    </div>
  )
}`,
}

function CodePreview() {
  const [tab, setTab] = useState<'swift' | 'kotlin' | 'react'>('swift')

  const tabs = [
    { id: 'swift' as const, label: 'SwiftUI' },
    { id: 'kotlin' as const, label: 'Kotlin' },
    { id: 'react' as const, label: 'React' },
  ]

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden">
      <div className="flex items-center gap-1 px-4 py-3 border-b border-white/10 bg-white/5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
              tab === t.id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-300">{codeExample[tab]}</code>
      </pre>
    </div>
  )
}

// Demo App Builder - Interactive simulation
const demoAppTemplates = [
  {
    id: 'fitness',
    name: 'FitTrack',
    description: 'Fitness tracking app',
    icon: '💪',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'ecommerce',
    name: 'ShopNow',
    description: 'E-commerce store',
    icon: '🛒',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'social',
    name: 'ChatHub',
    description: 'Social messaging',
    icon: '💬',
    color: 'from-blue-500 to-cyan-500',
  },
]

const demoCapsules = {
  fitness: [
    { id: 'nav', name: 'Navigation', icon: '🧭', type: 'navigation' },
    { id: 'stats', name: 'Stat Cards', icon: '📊', type: 'stat-card' },
    { id: 'chart', name: 'Progress Chart', icon: '📈', type: 'chart' },
    { id: 'list', name: 'Workout List', icon: '📋', type: 'list' },
    { id: 'button', name: 'Start Button', icon: '▶️', type: 'button' },
  ],
  ecommerce: [
    { id: 'nav', name: 'Navigation', icon: '🧭', type: 'navigation' },
    { id: 'search', name: 'Search Bar', icon: '🔍', type: 'searchbar' },
    { id: 'cards', name: 'Product Cards', icon: '🏷️', type: 'card' },
    { id: 'cart', name: 'Cart Badge', icon: '🛒', type: 'badge' },
    { id: 'pricing', name: 'Pricing', icon: '💰', type: 'pricing-card' },
  ],
  social: [
    { id: 'nav', name: 'Tab Bar', icon: '📱', type: 'tabs' },
    { id: 'chat', name: 'Chat List', icon: '💬', type: 'chat' },
    { id: 'input', name: 'Message Input', icon: '✏️', type: 'input' },
    { id: 'avatar', name: 'User Avatar', icon: '👤', type: 'avatar' },
    { id: 'notif', name: 'Notifications', icon: '🔔', type: 'notifications' },
  ],
}

function AppBuilderDemo() {
  const [step, setStep] = useState(0)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [addedCapsules, setAddedCapsules] = useState<string[]>([])
  const [building, setBuilding] = useState(false)
  const [exportPlatform, setExportPlatform] = useState<string | null>(null)

  const currentApp = demoAppTemplates.find(a => a.id === selectedApp)
  const capsules = selectedApp ? demoCapsules[selectedApp as keyof typeof demoCapsules] : []

  const handleSelectApp = (appId: string) => {
    setSelectedApp(appId)
    setAddedCapsules([])
    setStep(1)
  }

  const handleAddCapsule = (capsuleId: string) => {
    if (!addedCapsules.includes(capsuleId)) {
      setAddedCapsules([...addedCapsules, capsuleId])
    }
  }

  const handleRemoveCapsule = (capsuleId: string) => {
    setAddedCapsules(addedCapsules.filter(id => id !== capsuleId))
  }

  const handleBuild = () => {
    setStep(2)
  }

  const handleExport = (platform: string) => {
    setBuilding(true)
    setExportPlatform(platform)
    setTimeout(() => {
      setBuilding(false)
      setStep(3)
    }, 2000)
  }

  const handleReset = () => {
    setStep(0)
    setSelectedApp(null)
    setAddedCapsules([])
    setExportPlatform(null)
  }

  // Phone Preview Component
  const PhonePreview = () => (
    <div className="relative mx-auto w-[200px] h-[400px] bg-gray-900 rounded-[32px] border-4 border-gray-800 shadow-2xl overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-b-xl z-10" />

      {/* Screen */}
      <div className="w-full h-full bg-white overflow-hidden">
        {currentApp && (
          <div className="h-full flex flex-col">
            {/* Status bar */}
            <div className={`h-8 bg-gradient-to-r ${currentApp.color} flex items-center justify-center`}>
              <span className="text-white text-[10px] font-semibold">{currentApp.name}</span>
            </div>

            {/* App content */}
            <div className="flex-1 p-2 space-y-2 overflow-hidden">
              {addedCapsules.map((capsuleId, index) => {
                const capsule = capsules.find(c => c.id === capsuleId)
                if (!capsule) return null

                return (
                  <div
                    key={capsuleId}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {capsule.type === 'navigation' && (
                      <div className="flex justify-around py-1 bg-gray-100 rounded">
                        {['Home', 'Search', 'Profile'].map(t => (
                          <div key={t} className="text-[8px] text-gray-600">{t}</div>
                        ))}
                      </div>
                    )}
                    {capsule.type === 'stat-card' && (
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-orange-100 rounded p-1">
                          <div className="text-[8px] text-orange-600">Steps</div>
                          <div className="text-[10px] font-bold">8,432</div>
                        </div>
                        <div className="bg-red-100 rounded p-1">
                          <div className="text-[8px] text-red-600">Cal</div>
                          <div className="text-[10px] font-bold">420</div>
                        </div>
                      </div>
                    )}
                    {capsule.type === 'chart' && (
                      <div className="h-12 bg-gray-50 rounded flex items-end justify-around px-1 pb-1">
                        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                          <div key={i} className="w-2 bg-gradient-to-t from-orange-500 to-red-500 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    )}
                    {capsule.type === 'list' && (
                      <div className="space-y-1">
                        {['Morning Run', 'HIIT', 'Yoga'].map(item => (
                          <div key={item} className="flex items-center gap-1 bg-gray-50 rounded p-1">
                            <div className="w-4 h-4 bg-orange-200 rounded" />
                            <span className="text-[8px]">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {capsule.type === 'button' && (
                      <button className={`w-full py-2 rounded-full bg-gradient-to-r ${currentApp.color} text-white text-[10px] font-semibold`}>
                        Start Workout
                      </button>
                    )}
                    {capsule.type === 'searchbar' && (
                      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                        <span className="text-[10px]">🔍</span>
                        <span className="text-[8px] text-gray-400">Search products...</span>
                      </div>
                    )}
                    {capsule.type === 'card' && (
                      <div className="grid grid-cols-2 gap-1">
                        {['Shoes', 'Watch'].map(item => (
                          <div key={item} className="bg-gray-50 rounded p-1">
                            <div className="w-full h-8 bg-purple-100 rounded mb-1" />
                            <div className="text-[8px]">{item}</div>
                            <div className="text-[8px] text-purple-600 font-bold">$99</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {capsule.type === 'badge' && (
                      <div className="flex justify-end">
                        <div className="relative">
                          <span className="text-lg">🛒</span>
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[6px] rounded-full flex items-center justify-center">3</span>
                        </div>
                      </div>
                    )}
                    {capsule.type === 'pricing-card' && (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded p-2 text-white text-center">
                        <div className="text-[8px]">Premium</div>
                        <div className="text-[14px] font-bold">$9.99</div>
                      </div>
                    )}
                    {capsule.type === 'tabs' && (
                      <div className="flex justify-around py-1 border-b">
                        {['💬', '👥', '🔔', '⚙️'].map(t => (
                          <div key={t} className="text-sm">{t}</div>
                        ))}
                      </div>
                    )}
                    {capsule.type === 'chat' && (
                      <div className="space-y-1">
                        {['Alice', 'Bob', 'Team'].map(name => (
                          <div key={name} className="flex items-center gap-1 p-1 bg-gray-50 rounded">
                            <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            <div>
                              <div className="text-[8px] font-semibold">{name}</div>
                              <div className="text-[6px] text-gray-400">Last message...</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {capsule.type === 'input' && (
                      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                        <span className="text-[8px] text-gray-400 flex-1">Type message...</span>
                        <span className="text-[10px]">📤</span>
                      </div>
                    )}
                    {capsule.type === 'avatar' && (
                      <div className="flex justify-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-lg">👤</div>
                      </div>
                    )}
                    {capsule.type === 'notifications' && (
                      <div className="bg-blue-50 rounded p-1 flex items-center gap-1">
                        <span className="text-sm">🔔</span>
                        <span className="text-[8px] text-blue-600">3 new messages</span>
                      </div>
                    )}
                  </div>
                )
              })}

              {addedCapsules.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-300">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📱</div>
                    <div className="text-[10px]">Add capsules</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!currentApp && (
          <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="text-center text-gray-400">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-xs">Select an app</div>
            </div>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full" />
    </div>
  )

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['Choose App', 'Add Capsules', 'Export'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step > i ? 'bg-green-500 text-white' : step === i ? 'bg-white text-black' : 'bg-white/10 text-gray-500'
            }`}>
              {step > i ? <IconCheck size={16} /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${step >= i ? 'text-white' : 'text-gray-500'}`}>{label}</span>
            {i < 2 && <div className={`w-8 h-px ${step > i ? 'bg-green-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Controls */}
        <div>
          {/* Step 0: Choose App */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Choose your app type</h3>
              <div className="grid gap-3">
                {demoAppTemplates.map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app.id)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${app.color} flex items-center justify-center text-2xl`}>
                      {app.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{app.name}</div>
                      <div className="text-sm text-gray-400">{app.description}</div>
                    </div>
                    <IconArrowRight size={20} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Add Capsules */}
          {step === 1 && currentApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Add Capsules to {currentApp.name}</h3>
                <button onClick={() => setStep(0)} className="text-sm text-gray-400 hover:text-white">← Back</button>
              </div>

              <div className="grid gap-2">
                {capsules.map(capsule => {
                  const isAdded = addedCapsules.includes(capsule.id)
                  return (
                    <button
                      key={capsule.id}
                      onClick={() => isAdded ? handleRemoveCapsule(capsule.id) : handleAddCapsule(capsule.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isAdded
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl">{capsule.icon}</span>
                      <span className="flex-1 font-medium">{capsule.name}</span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isAdded ? 'bg-green-500' : 'bg-white/10'
                      }`}>
                        {isAdded ? <IconCheck size={14} /> : <IconPlus size={14} />}
                      </span>
                    </button>
                  )
                })}
              </div>

              {addedCapsules.length > 0 && (
                <button
                  onClick={handleBuild}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${currentApp.color} text-white font-semibold flex items-center justify-center gap-2`}
                >
                  Build App
                  <IconArrowRight size={18} />
                </button>
              )}
            </div>
          )}

          {/* Step 2: Export */}
          {step === 2 && currentApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Export {currentApp.name}</h3>
                <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white">← Back</button>
              </div>

              <p className="text-gray-400">Choose your target platform to generate native code:</p>

              <div className="grid gap-3">
                {[
                  { id: 'ios', name: 'iOS (SwiftUI)', icon: '🍎', desc: 'Xcode project' },
                  { id: 'android', name: 'Android (Kotlin)', icon: '🤖', desc: 'Android Studio project' },
                  { id: 'web', name: 'Web (React)', icon: '🌐', desc: 'Next.js project' },
                ].map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => handleExport(platform.id)}
                    disabled={building}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left disabled:opacity-50"
                  >
                    <span className="text-2xl">{platform.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{platform.name}</div>
                      <div className="text-sm text-gray-400">{platform.desc}</div>
                    </div>
                    {building && exportPlatform === platform.id ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <IconDownload size={20} className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && currentApp && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <IconCheck size={40} className="text-green-500" />
              </div>

              <div>
                <h3 className="text-2xl font-bold">App Generated!</h3>
                <p className="text-gray-400 mt-2">
                  Your {currentApp.name} app is ready for {exportPlatform === 'ios' ? 'Xcode' : exportPlatform === 'android' ? 'Android Studio' : 'deployment'}.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
                <div className="text-sm text-gray-400 mb-2">Generated files:</div>
                <div className="space-y-1 font-mono text-sm">
                  {exportPlatform === 'ios' && (
                    <>
                      <div className="text-blue-400">📁 {currentApp.name}.xcodeproj</div>
                      <div className="text-gray-400">  └─ Sources/</div>
                      {addedCapsules.map(id => {
                        const cap = capsules.find(c => c.id === id)
                        return <div key={id} className="text-gray-400">     └─ {cap?.name.replace(' ', '')}View.swift</div>
                      })}
                    </>
                  )}
                  {exportPlatform === 'android' && (
                    <>
                      <div className="text-green-400">📁 {currentApp.name.toLowerCase()}/</div>
                      <div className="text-gray-400">  └─ app/src/main/kotlin/</div>
                      {addedCapsules.map(id => {
                        const cap = capsules.find(c => c.id === id)
                        return <div key={id} className="text-gray-400">     └─ {cap?.name.replace(' ', '')}Screen.kt</div>
                      })}
                    </>
                  )}
                  {exportPlatform === 'web' && (
                    <>
                      <div className="text-purple-400">📁 {currentApp.name.toLowerCase()}/</div>
                      <div className="text-gray-400">  └─ components/</div>
                      {addedCapsules.map(id => {
                        const cap = capsules.find(c => c.id === id)
                        return <div key={id} className="text-gray-400">     └─ {cap?.name.replace(' ', '')}.tsx</div>
                      })}
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                >
                  Start Over
                </button>
                <Link
                  href="/app"
                  className={`px-6 py-2 rounded-xl bg-gradient-to-r ${currentApp.color} text-white font-medium`}
                >
                  Build Your Own
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Phone Preview */}
        <div className="flex justify-center lg:sticky lg:top-24">
          <PhonePreview />
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              HubLab
            </Link>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/anthropics/hublab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IconGitHub size={22} />
              </a>
              <Link
                href="/app"
                className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                Open App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Open Source
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Build native apps
              <br />
              <span className="text-gray-500">without writing code</span>
            </h1>

            <p className="mt-6 text-xl text-gray-400 max-w-xl">
              Visual editor that generates real native code for iOS, Android, and Web.
              No runtime, no dependencies, just clean code.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium bg-white text-black rounded-xl hover:bg-gray-100 transition-colors"
              >
                Start Building
                <IconArrowRight size={18} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-300 hover:text-white transition-colors"
              >
                Documentation
              </Link>
            </div>

            {/* Platform badges */}
            <div className="mt-12 flex flex-wrap gap-3">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${p.color} text-sm font-medium`}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Try it now
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Build a complete app in 3 steps. Select a template, add capsules, and export to any platform.
            </p>
          </div>
          <AppBuilderDemo />
        </div>
      </section>

      {/* Code Preview */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Real native code
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Not a wrapper. Not a runtime. HubLab generates actual SwiftUI,
                Jetpack Compose, and React code that you own and can customize.
              </p>
              <ul className="mt-8 space-y-4">
                {['Zero runtime overhead', 'Full code ownership', 'IDE integration ready'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <IconCheck size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <CodePreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-gray-400 text-center max-w-2xl mx-auto">
            From visual design to production-ready code in minutes
          </p>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to build?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Start creating native apps in minutes. No credit card required.
          </p>
          <div className="mt-10">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium bg-white text-black rounded-xl hover:bg-gray-100 transition-colors"
            >
              Get Started Free
              <IconArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              MIT License
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/docs" className="hover:text-white transition-colors">
                Docs
              </Link>
              <a
                href="https://github.com/anthropics/hublab"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
