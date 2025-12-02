import React from 'react'
import Link from 'next/link'
import { IconGitHub } from '../../components/ui/icons'

function MarketingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                H
              </div>
              <span className="text-lg font-semibold">HubLab</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/hublabdev/hublab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <IconGitHub size={16} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              H
            </div>
            <span className="text-lg font-semibold">HubLab</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 HubLab. Open source under MIT license.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <MarketingFooter />
    </div>
  )
}
