'use client'

import { useState, useEffect, useMemo } from 'react'
import { getAllCapsules, getCapsulesByCategory, getCapsulesByTag, getCapsuleStats } from '../capsules'
import type { CapsuleDefinition } from '../capsules/types'

export function useCapsules() {
  const [capsules, setCapsules] = useState<CapsuleDefinition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate async loading
    const load = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 100))
      setCapsules(getAllCapsules())
      setLoading(false)
    }
    load()
  }, [])

  const stats = useMemo(() => getCapsuleStats(), [])

  const filterByCategory = (category: string) => {
    if (category === 'all' || category === 'Todos') return capsules
    return getCapsulesByCategory(category)
  }

  const filterByTag = (tag: string) => {
    return getCapsulesByTag(tag)
  }

  const filterByPlatform = (platform: 'web' | 'ios' | 'android' | 'desktop') => {
    return capsules.filter(c => c.platforms[platform])
  }

  const search = (query: string) => {
    const q = query.toLowerCase()
    return capsules.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  return {
    capsules,
    loading,
    stats,
    filterByCategory,
    filterByTag,
    filterByPlatform,
    search,
  }
}

export function useCapsule(id: string) {
  const { capsules, loading } = useCapsules()
  const capsule = useMemo(() => capsules.find(c => c.id === id), [capsules, id])

  return {
    capsule,
    loading,
  }
}
