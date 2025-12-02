'use client'

import React, { useState } from 'react'
import {
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconCode,
  IconZap,
  IconLayers,
  IconChevronRight,
  IconCheck,
  IconGitHub,
} from '../../components/ui/icons'

const platforms = [
  { name: 'iOS', framework: 'SwiftUI', icon: IconApple, color: 'bg-blue-500' },
  { name: 'Android', framework: 'Jetpack Compose', icon: IconAndroid, color: 'bg-green-500' },
  { name: 'Web', framework: 'React + Tailwind', icon: IconGlobe, color: 'bg-purple-500' },
  { name: 'Desktop', framework: 'Tauri', icon: IconDesktop, color: 'bg-orange-500' },
]

const features = [
  {
    icon: IconCode,
    title: 'Real Native Code',
    description: 'No wrappers, no bridges. Generates SwiftUI for iOS, Jetpack Compose for Android, React for Web.',
  },
  {
    icon: IconLayers,
    title: '53+ Capsules Included',
    description: 'From buttons to Kanban boards. Each component generates optimized native code for each platform.',
  },
  {
    icon: IconZap,
    title: 'Instant Export',
    description: 'Export complete projects ready to compile. Includes structure, dependencies and configuration.',
  },
]

const capsuleCategories = [
  { name: 'UI Components', count: 12, examples: 'Button, Card, Avatar, Badge' },
  { name: 'Navigation', count: 8, examples: 'Tabs, Modal, BottomSheet, Carousel' },
  { name: 'Forms', count: 10, examples: 'Input, Dropdown, DatePicker, Signature' },
  { name: 'Data Display', count: 6, examples: 'Table, Chart, Timeline, Calendar' },
  { name: 'Media', count: 6, examples: 'Video, Audio, Map, PDFViewer' },
  { name: 'Device & Native', count: 7, examples: 'Camera, Biometrics, Location, Push' },
]

const codeExamples = {
  capsule: `// Define once
const LoginScreen = {
  type: 'auth-screen',
  props: {
    providers: ['email', 'google', 'apple'],
    theme: 'modern-blue'
  }
}`,
  swift: `// Generates SwiftUI
struct LoginView: View {
  @State private var email = ""

  var body: some View {
    VStack(spacing: 16) {
      TextField("Email", text: $email)
        .textFieldStyle(.roundedBorder)

      SignInWithAppleButton(.signIn) { ... }
    }
  }
}`,
  kotlin: `// Generates Jetpack Compose
@Composable
fun LoginScreen() {
  var email by remember { mutableStateOf("") }

  Column(modifier = Modifier.padding(16.dp)) {
    OutlinedTextField(
      value = email,
      onValueChange = { email = it },
      label = { Text("Email") }
    )

    GoogleSignInButton(onClick = { ... })
  }
}`,
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    try {
      const formData = new FormData()
      formData.append('form-name', 'waitlist')
      formData.append('email', email)

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      })

      setStatus('success')
      setMessage('You are on the list! We will notify you when we launch.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form
      name="waitlist"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <input type="hidden" name="bot-field" />

      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        disabled={status === 'loading' || status === 'success'}
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Joining...
          </span>
        ) : status === 'success' ? (
          <span className="flex items-center gap-2">
            <IconCheck size={16} />
            Joined!
          </span>
        ) : (
          'Join Waitlist'
        )}
      </button>

      {message && (
        <p className={`text-sm mt-2 ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </form>
  )
}

export default function LandingPage() {
  const scrollToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-medium">Early Access Now Open</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">53+ capsules</span>
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Write once,
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                deploy everywhere
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Generate native apps for iOS, Android, Web and Desktop from a single definition.
              <strong className="text-foreground"> Real native code</strong>, no wrappers or bridges.
            </p>

            {/* Waitlist Form */}
            <div id="waitlist" className="mt-10">
              <WaitlistForm />
              <p className="mt-4 text-sm text-muted-foreground">
                Join the waitlist. No spam, ever.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Try Demo Now
                <IconChevronRight size={16} />
              </a>
              <a
                href="https://github.com/hublabdev/hublab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
              >
                <IconGitHub size={16} />
                Star on GitHub
              </a>
            </div>

            {/* Platform Icons */}
            <div className="mt-16 flex items-center justify-center gap-6 sm:gap-10">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex flex-col items-center gap-2 group">
                  <div className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl ${platform.color} text-white shadow-lg shadow-${platform.color}/25 group-hover:scale-110 transition-transform`}>
                    <platform.icon size={28} />
                  </div>
                  <div className="text-sm font-medium">{platform.name}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{platform.framework}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Demo */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">One definition, multiple platforms</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Define your components once and generate native code for each platform
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-[#1e1e2e] p-4 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
                <IconLayers size={16} />
                HubLab Capsule
              </div>
              <pre className="text-xs overflow-x-auto font-mono">
                <code className="text-gray-300">{codeExamples.capsule}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-border bg-[#1e1e2e] p-4 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-3">
                <IconApple size={16} />
                iOS (SwiftUI)
              </div>
              <pre className="text-xs overflow-x-auto font-mono">
                <code className="text-gray-300">{codeExamples.swift}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-border bg-[#1e1e2e] p-4 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-green-400 mb-3">
                <IconAndroid size={16} />
                Android (Compose)
              </div>
              <pre className="text-xs overflow-x-auto font-mono">
                <code className="text-gray-300">{codeExamples.kotlin}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Why HubLab?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The only solution that generates real native code for all platforms
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-background p-8 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
                  <feature.icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capsule Categories */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">53+ Native Capsules</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready-to-use components, each with native implementation for all platforms
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capsuleCategories.map((category) => (
              <div key={category.name} className="rounded-xl border border-border bg-background p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                    {category.count}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{category.examples}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://github.com/hublabdev/hublab/tree/main/lib/capsules"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Explore all capsules on GitHub
              <IconChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">HubLab vs Other Solutions</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The difference is in the generated code
            </p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-6 text-left font-semibold">Feature</th>
                  <th className="py-4 px-6 text-center font-semibold text-primary">HubLab</th>
                  <th className="py-4 px-6 text-center font-semibold text-muted-foreground">React Native</th>
                  <th className="py-4 px-6 text-center font-semibold text-muted-foreground">Flutter</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['100% Native Code', true, false, false],
                  ['No Extra Runtime', true, false, false],
                  ['SwiftUI for iOS', true, false, false],
                  ['Jetpack Compose for Android', true, false, false],
                  ['Optimized App Size', true, false, false],
                  ['Native Performance', true, 'Partial', 'Partial'],
                  ['Native API Access', true, true, true],
                  ['Hot Reload', 'Coming', true, true],
                ].map(([feature, hublab, rn, flutter]) => (
                  <tr key={feature as string} className="border-b border-border">
                    <td className="py-4 px-6 text-sm">{feature}</td>
                    <td className="py-4 px-6 text-center">
                      {hublab === true ? (
                        <IconCheck className="inline text-green-500" size={20} />
                      ) : hublab === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm text-yellow-500 font-medium">{hublab}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {rn === true ? (
                        <IconCheck className="inline text-green-500" size={20} />
                      ) : rn === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{rn}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {flutter === true ? (
                        <IconCheck className="inline text-green-500" size={20} />
                      ) : flutter === false ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{flutter}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-purple-500/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold sm:text-5xl">
            Ready to build native apps faster?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join developers who are using HubLab to ship native apps across all platforms.
          </p>

          <div className="mt-10">
            <WaitlistForm />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/hublabdev/hublab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              <IconGitHub size={20} />
              Star on GitHub
              <IconChevronRight size={20} />
            </a>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Open source • Free forever • No credit card required
          </p>
        </div>
      </section>
    </div>
  )
}
