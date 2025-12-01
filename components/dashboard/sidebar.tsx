'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconHome,
  IconProjects,
  IconCapsules,
  IconExport,
  IconSettings,
  IconGitHub,
  IconDocs,
} from '../ui/icons'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string; size?: number }>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: IconHome },
  { name: 'Proyectos', href: '/dashboard/projects', icon: IconProjects },
  { name: 'Cápsulas', href: '/dashboard/capsules', icon: IconCapsules },
  { name: 'Exportar', href: '/dashboard/export', icon: IconExport },
  { name: 'Configuración', href: '/dashboard/settings', icon: IconSettings },
]

const externalLinks: NavItem[] = [
  { name: 'GitHub', href: 'https://github.com/hublabdev/hublab', icon: IconGitHub },
  { name: 'Documentación', href: '/docs', icon: IconDocs },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          H
        </div>
        <span className="text-lg font-semibold">HubLab</span>
        <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          v1.0
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Principal
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          )
        })}

        <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recursos
        </div>
        {externalLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <item.icon size={18} />
            {item.name}
          </a>
        ))}
      </nav>

      {/* Stats */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="text-xs font-medium text-muted-foreground">Cápsulas disponibles</div>
          <div className="mt-1 text-2xl font-bold">53</div>
          <div className="mt-2 flex gap-1">
            <span className="platform-badge platform-ios">iOS</span>
            <span className="platform-badge platform-android">And</span>
            <span className="platform-badge platform-web">Web</span>
            <span className="platform-badge platform-desktop">Desk</span>
          </div>
        </div>
      </div>
    </div>
  )
}
