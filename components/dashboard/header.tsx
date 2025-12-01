'use client'

import React, { useState } from 'react'
import { IconSearch, IconMenu, IconMoon, IconSun, IconPlus } from '../ui/icons'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 hover:bg-muted transition-colors"
      >
        <IconMenu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar proyectos, cápsulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <IconPlus size={16} />
          <span className="hidden sm:inline">Nuevo Proyecto</span>
        </button>
      </div>
    </header>
  )
}
