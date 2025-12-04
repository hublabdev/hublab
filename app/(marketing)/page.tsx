'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CAPSULES = [
  { icon: '🔘', name: 'Button' },
  { icon: '📝', name: 'Text' },
  { icon: '✏️', name: 'Input' },
  { icon: '🃏', name: 'Card' },
  { icon: '🖼️', name: 'Image' },
  { icon: '📋', name: 'List' },
  { icon: '🪟', name: 'Modal' },
  { icon: '🧭', name: 'Navigation' },
  { icon: '📑', name: 'Tabs' },
  { icon: '🔀', name: 'Switch' },
  { icon: '📊', name: 'Chart' },
  { icon: '📷', name: 'Camera' },
]

const PLATFORMS = [
  { name: 'iOS', icon: '🍎', color: 'from-blue-500 to-blue-600' },
  { name: 'Android', icon: '🤖', color: 'from-green-500 to-green-600' },
  { name: 'Web', icon: '🌐', color: 'from-purple-500 to-purple-600' },
  { name: 'Desktop', icon: '🖥️', color: 'from-orange-500 to-orange-600' },
]

const TEMPLATES = [
  { icon: '💪', name: 'FitTrack', desc: 'Fitness app' },
  { icon: '🍽️', name: 'FoodieSpot', desc: 'Restaurant ordering' },
  { icon: '✅', name: 'TaskFlow', desc: 'Task manager' },
  { icon: '🎵', name: 'Melodify', desc: 'Music player' },
  { icon: '🏦', name: 'SecureBank', desc: 'Banking app' },
  { icon: '✈️', name: 'Wanderlust', desc: 'Travel booking' },
]

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeTemplate, setActiveTemplate] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTemplate((prev) => (prev + 1) % TEMPLATES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="HubLab" className="w-10 h-10 rounded-xl object-cover" />
          <span className="text-xl font-bold">HubLab</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#capsules" className="text-sm text-gray-400 hover:text-white transition-colors">Capsules</a>
          <a href="#platforms" className="text-sm text-gray-400 hover:text-white transition-colors">Platforms</a>
          <Link
            href="/app"
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Open Editor
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-400">Now with AI-powered generation</span>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              Build apps
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              visually
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Drag and drop components. Export real native code for iOS, Android, Web & Desktop.
            No coding required.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              href="/app"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-lg font-semibold overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Building
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="https://github.com/hublabdev"
              className="px-8 py-4 border border-white/20 rounded-xl text-lg font-semibold hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Preview Window */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0f0f0f] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Window header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-black/50 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-500">HubLab Editor</div>
              </div>
              {/* Editor preview */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-48 bg-[#0a0a0a] border-r border-white/5 p-3">
                  <div className="text-xs text-gray-500 mb-2">Capsules</div>
                  <div className="grid grid-cols-2 gap-2">
                    {CAPSULES.slice(0, 8).map((c, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-white/5 text-center hover:bg-white/10 transition-colors cursor-pointer"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <div className="text-lg">{c.icon}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{c.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Canvas */}
                <div className="flex-1 p-6 flex items-center justify-center">
                  <div className="w-[220px] h-[380px] bg-black rounded-[2rem] p-2 shadow-xl">
                    <div className="w-full h-full bg-[#1a1a1a] rounded-[1.5rem] p-4 flex flex-col gap-3 overflow-hidden">
                      <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-2" />
                      <div className="h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-xs font-medium">
                        Welcome
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="w-full h-3 bg-white/10 rounded mb-2" />
                        <div className="w-3/4 h-3 bg-white/10 rounded mb-4" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-16 bg-white/10 rounded-lg" />
                          <div className="h-16 bg-white/10 rounded-lg" />
                        </div>
                      </div>
                      <div className="h-8 bg-white/10 rounded-lg" />
                    </div>
                  </div>
                </div>
                {/* Properties */}
                <div className="w-48 bg-[#0a0a0a] border-l border-white/5 p-3">
                  <div className="text-xs text-gray-500 mb-2">Properties</div>
                  <div className="space-y-2">
                    <div className="p-2 bg-white/5 rounded text-xs">
                      <span className="text-gray-500">text:</span> Welcome
                    </div>
                    <div className="p-2 bg-white/5 rounded text-xs">
                      <span className="text-gray-500">variant:</span> primary
                    </div>
                    <div className="p-2 bg-white/5 rounded text-xs">
                      <span className="text-gray-500">size:</span> medium
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Build production-ready apps with a visual editor, AI assistance, and native exports.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🎨',
              title: 'Visual Editor',
              desc: 'Drag and drop components onto your canvas. See changes instantly.',
            },
            {
              icon: '🤖',
              title: 'AI Assistant',
              desc: 'Describe what you want in plain English. AI builds it for you.',
            },
            {
              icon: '📱',
              title: 'Native Export',
              desc: 'Export real SwiftUI, Kotlin, React code. No wrappers.',
            },
            {
              icon: '🖼️',
              title: '24 Capsules',
              desc: 'Pre-built components for buttons, forms, charts, and more.',
            },
            {
              icon: '📐',
              title: 'Multi-Screen',
              desc: 'Build complete apps with multiple screens and navigation.',
            },
            {
              icon: '⚡',
              title: 'Instant Preview',
              desc: 'See your code output in real-time as you design.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capsules Section */}
      <section id="capsules" className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">24 Native Capsules</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Pre-built components that generate real native code for every platform.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {CAPSULES.map((c, i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="text-xl">{c.icon}</span>
              <span className="text-sm">{c.name}</span>
            </div>
          ))}
          <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center gap-2">
            <span className="text-sm text-indigo-400">+12 more</span>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Export to any platform</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            One design, four platforms. Real native code, not wrappers.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {PLATFORMS.map((platform, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <div className="text-4xl mb-4">{platform.icon}</div>
                <h3 className="text-xl font-semibold mb-1">{platform.name}</h3>
                <p className="text-sm text-gray-500">
                  {platform.name === 'iOS' && 'SwiftUI'}
                  {platform.name === 'Android' && 'Jetpack Compose'}
                  {platform.name === 'Web' && 'React/Next.js'}
                  {platform.name === 'Desktop' && 'Tauri'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Section */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Start with a template</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose from 8 pre-built templates and customize to your needs.
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          {TEMPLATES.map((t, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTemplate === i
                  ? 'bg-indigo-500/20 border-indigo-500/50 scale-105'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setActiveTemplate(i)}
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-xs text-gray-500">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl" />
          <div className="relative bg-[#0f0f0f] rounded-2xl border border-white/10 p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to build?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Start creating your app today. No account required.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Open HubLab Editor
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="HubLab" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-semibold">HubLab</span>
          </div>
          <div className="text-sm text-gray-500">
            Built with Next.js, Tailwind CSS, and Groq AI
          </div>
        </div>
      </footer>
    </div>
  )
}
