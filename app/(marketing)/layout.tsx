import React from 'react'
import Link from 'next/link'
import {
  IconGitHub,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
} from '../../components/ui/icons'

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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Características
              </Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentación
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Precios
              </Link>
              <Link href="/showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Showcase
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/hublabdev/hublab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconGitHub size={20} />
            </a>
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Iniciar
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                H
              </div>
              <span className="text-lg font-semibold">HubLab</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Escribe una vez, despliega en todas las plataformas. Con código nativo real, no wrappers.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <IconApple size={16} className="text-muted-foreground" />
              <IconAndroid size={16} className="text-muted-foreground" />
              <IconGlobe size={16} className="text-muted-foreground" />
              <IconDesktop size={16} className="text-muted-foreground" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Producto</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">Características</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Precios</Link></li>
              <li><Link href="/showcase" className="text-sm text-muted-foreground hover:text-foreground">Showcase</Link></li>
              <li><Link href="/changelog" className="text-sm text-muted-foreground hover:text-foreground">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Recursos</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Documentación</Link></li>
              <li><Link href="/docs/api" className="text-sm text-muted-foreground hover:text-foreground">API Reference</Link></li>
              <li><Link href="/docs/capsules" className="text-sm text-muted-foreground hover:text-foreground">Catálogo de Cápsulas</Link></li>
              <li><a href="https://github.com/hublabdev/hublab" className="text-sm text-muted-foreground hover:text-foreground">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacidad</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Términos</Link></li>
              <li><Link href="/license" className="text-sm text-muted-foreground hover:text-foreground">Licencia MIT</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 HubLab. Open source bajo licencia MIT.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/hublabdev/hublab" className="text-muted-foreground hover:text-foreground">
              <IconGitHub size={20} />
            </a>
          </div>
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
