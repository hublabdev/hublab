/**
 * HubLab Community & Marketplace
 *
 * Enables creators to share templates, capsules, and collaborate.
 * Build a thriving ecosystem of micro-app creators.
 *
 * Philosophy: "Create once, share everywhere. Together we build better."
 */

// ============================================================================
// MARKETPLACE ITEMS
// ============================================================================

export interface MarketplaceItem {
  id: string
  type: 'template' | 'capsule' | 'theme' | 'icon-pack' | 'plugin'
  name: string
  description: string
  author: MarketplaceAuthor
  price: number
  currency: string
  downloads: number
  rating: number
  reviews: number
  preview: string
  tags: string[]
  platforms: string[]
  createdAt: string
  updatedAt: string
  featured?: boolean
  verified?: boolean
}

export interface MarketplaceAuthor {
  id: string
  name: string
  avatar: string
  verified: boolean
  totalItems: number
  totalDownloads: number
}

// ============================================================================
// SAMPLE MARKETPLACE DATA
// ============================================================================

export const FEATURED_TEMPLATES: MarketplaceItem[] = [
  {
    id: 'template-1',
    type: 'template',
    name: 'Fitness Pro Bundle',
    description: 'Complete fitness app with workout tracking, meal planning, and progress analytics',
    author: {
      id: 'author-1',
      name: 'FitApps Studio',
      avatar: '💪',
      verified: true,
      totalItems: 12,
      totalDownloads: 45000
    },
    price: 0,
    currency: 'USD',
    downloads: 15234,
    rating: 4.8,
    reviews: 328,
    preview: '🏋️',
    tags: ['fitness', 'health', 'tracking'],
    platforms: ['ios', 'android', 'web'],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-20',
    featured: true,
    verified: true
  },
  {
    id: 'template-2',
    type: 'template',
    name: 'Restaurant Complete',
    description: 'Full-featured restaurant app with menu, reservations, delivery, and loyalty program',
    author: {
      id: 'author-2',
      name: 'FoodTech Labs',
      avatar: '🍽️',
      verified: true,
      totalItems: 8,
      totalDownloads: 32000
    },
    price: 29,
    currency: 'USD',
    downloads: 8921,
    rating: 4.9,
    reviews: 156,
    preview: '🍕',
    tags: ['food', 'restaurant', 'delivery'],
    platforms: ['ios', 'android', 'web'],
    createdAt: '2024-02-01',
    updatedAt: '2024-11-18',
    featured: true,
    verified: true
  },
  {
    id: 'template-3',
    type: 'template',
    name: 'Social Network Starter',
    description: 'Modern social app with profiles, feed, messaging, and real-time notifications',
    author: {
      id: 'author-3',
      name: 'SocialKit',
      avatar: '💬',
      verified: true,
      totalItems: 5,
      totalDownloads: 28000
    },
    price: 49,
    currency: 'USD',
    downloads: 6543,
    rating: 4.7,
    reviews: 98,
    preview: '📱',
    tags: ['social', 'chat', 'network'],
    platforms: ['ios', 'android', 'web'],
    createdAt: '2024-03-10',
    updatedAt: '2024-11-15',
    featured: true,
    verified: true
  }
]

export const FEATURED_CAPSULES: MarketplaceItem[] = [
  {
    id: 'capsule-1',
    type: 'capsule',
    name: 'AI Chat Widget',
    description: 'Drag-and-drop AI chatbot with multiple providers support',
    author: {
      id: 'author-4',
      name: 'AI Components',
      avatar: '🤖',
      verified: true,
      totalItems: 15,
      totalDownloads: 67000
    },
    price: 0,
    currency: 'USD',
    downloads: 23456,
    rating: 4.9,
    reviews: 512,
    preview: '🦙',
    tags: ['ai', 'chat', 'llm'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    createdAt: '2024-01-01',
    updatedAt: '2024-11-22',
    featured: true,
    verified: true
  },
  {
    id: 'capsule-2',
    type: 'capsule',
    name: 'Premium Charts Pack',
    description: '12 beautiful chart components with animations and themes',
    author: {
      id: 'author-5',
      name: 'DataViz Pro',
      avatar: '📊',
      verified: true,
      totalItems: 7,
      totalDownloads: 41000
    },
    price: 19,
    currency: 'USD',
    downloads: 12789,
    rating: 4.8,
    reviews: 234,
    preview: '📈',
    tags: ['charts', 'analytics', 'data'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    createdAt: '2024-02-15',
    updatedAt: '2024-11-10',
    featured: true,
    verified: true
  }
]

export const FEATURED_THEMES: MarketplaceItem[] = [
  {
    id: 'theme-1',
    type: 'theme',
    name: 'Neon Dreams',
    description: 'Cyberpunk-inspired dark theme with neon accents',
    author: {
      id: 'author-6',
      name: 'Theme Master',
      avatar: '🎨',
      verified: true,
      totalItems: 20,
      totalDownloads: 89000
    },
    price: 0,
    currency: 'USD',
    downloads: 34567,
    rating: 4.9,
    reviews: 678,
    preview: '💜',
    tags: ['dark', 'neon', 'cyberpunk'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    createdAt: '2024-01-20',
    updatedAt: '2024-11-05',
    featured: true,
    verified: true
  }
]

// ============================================================================
// COMMUNITY FEATURES
// ============================================================================

export interface CommunityProfile {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  website?: string
  twitter?: string
  github?: string
  followers: number
  following: number
  projects: number
  likes: number
  verified: boolean
  createdAt: string
}

export interface CommunityProject {
  id: string
  name: string
  description: string
  author: CommunityProfile
  thumbnail: string
  likes: number
  comments: number
  views: number
  isPublic: boolean
  isFeatured: boolean
  tags: string[]
  platforms: string[]
  createdAt: string
  updatedAt: string
}

export interface CommunityComment {
  id: string
  author: CommunityProfile
  content: string
  likes: number
  replies: number
  createdAt: string
}

// ============================================================================
// SHOWCASE CATEGORIES
// ============================================================================

export interface ShowcaseCategory {
  id: string
  name: string
  icon: string
  description: string
  count: number
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  { id: 'featured', name: 'Featured', icon: '⭐', description: 'Hand-picked by our team', count: 24 },
  { id: 'trending', name: 'Trending', icon: '🔥', description: 'Most popular this week', count: 50 },
  { id: 'new', name: 'New', icon: '✨', description: 'Recently published', count: 100 },
  { id: 'made-with-ai', name: 'Made with AI', icon: '🤖', description: 'Apps using AI capsules', count: 45 },
  { id: 'business', name: 'Business', icon: '💼', description: 'Professional apps', count: 78 },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', description: 'Personal & lifestyle', count: 92 },
  { id: 'games', name: 'Games', icon: '🎮', description: 'Fun & entertainment', count: 34 },
  { id: 'education', name: 'Education', icon: '📚', description: 'Learning apps', count: 56 }
]

// ============================================================================
// COLLABORATION FEATURES
// ============================================================================

export interface CollaborationInvite {
  id: string
  project: string
  inviter: CommunityProfile
  invitee: string
  role: 'viewer' | 'editor' | 'admin'
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface ProjectVersion {
  id: string
  version: string
  description: string
  author: CommunityProfile
  changes: string[]
  createdAt: string
}

// ============================================================================
// LEADERBOARD
// ============================================================================

export interface LeaderboardEntry {
  rank: number
  profile: CommunityProfile
  score: number
  badge: string
}

export const LEADERBOARD_CATEGORIES = [
  { id: 'downloads', name: 'Most Downloads', icon: '📥' },
  { id: 'likes', name: 'Most Liked', icon: '❤️' },
  { id: 'templates', name: 'Top Template Creators', icon: '📦' },
  { id: 'helpers', name: 'Most Helpful', icon: '🤝' },
  { id: 'newcomers', name: 'Rising Stars', icon: '🌟' }
]

// ============================================================================
// ACHIEVEMENTS & BADGES
// ============================================================================

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedBy: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-app',
    name: 'Hello World',
    description: 'Publish your first app',
    icon: '🚀',
    rarity: 'common',
    unlockedBy: 10000
  },
  {
    id: 'popular-creator',
    name: 'Popular Creator',
    description: 'Get 1,000 downloads',
    icon: '⭐',
    rarity: 'rare',
    unlockedBy: 2500
  },
  {
    id: 'template-master',
    name: 'Template Master',
    description: 'Create 10 public templates',
    icon: '📦',
    rarity: 'epic',
    unlockedBy: 500
  },
  {
    id: 'ai-pioneer',
    name: 'AI Pioneer',
    description: 'Build an app with AI capsules',
    icon: '🤖',
    rarity: 'rare',
    unlockedBy: 3000
  },
  {
    id: 'community-legend',
    name: 'Community Legend',
    description: 'Reach 10,000 followers',
    icon: '👑',
    rarity: 'legendary',
    unlockedBy: 50
  },
  {
    id: 'multi-platform',
    name: 'Platform Champion',
    description: 'Publish on iOS, Android, and Web',
    icon: '🏆',
    rarity: 'epic',
    unlockedBy: 1000
  },
  {
    id: 'helpful-hero',
    name: 'Helpful Hero',
    description: 'Answer 100 community questions',
    icon: '🦸',
    rarity: 'epic',
    unlockedBy: 200
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Report 10 bugs that get fixed',
    icon: '🐛',
    rarity: 'rare',
    unlockedBy: 800
  }
]

// ============================================================================
// CHALLENGES & EVENTS
// ============================================================================

export interface Challenge {
  id: string
  name: string
  description: string
  icon: string
  startDate: string
  endDate: string
  prizes: string[]
  participants: number
  submissions: number
  status: 'upcoming' | 'active' | 'ended'
}

export const ACTIVE_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    name: 'AI App Challenge',
    description: 'Build the most innovative AI-powered app',
    icon: '🤖',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    prizes: ['$1,000 cash', 'Featured spot', 'Pro subscription'],
    participants: 234,
    submissions: 45,
    status: 'active'
  },
  {
    id: 'challenge-2',
    name: 'Micro-App Month',
    description: 'Create a complete micro-app in under 1 hour',
    icon: '⚡',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    prizes: ['Badge collection', 'Community recognition', 'Early access'],
    participants: 567,
    submissions: 189,
    status: 'active'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatDownloads(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export function getItemTypeIcon(type: MarketplaceItem['type']): string {
  const icons: Record<string, string> = {
    template: '📦',
    capsule: '🧩',
    theme: '🎨',
    'icon-pack': '🖼️',
    plugin: '🔌'
  }
  return icons[type] || '📦'
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  const colors: Record<string, string> = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  }
  return colors[rarity] || '#9CA3AF'
}

export function calculateCreatorScore(profile: CommunityProfile): number {
  return (
    profile.followers * 2 +
    profile.projects * 10 +
    profile.likes * 1
  )
}

// ============================================================================
// MARKETPLACE SEARCH
// ============================================================================

export interface MarketplaceSearchParams {
  query?: string
  type?: MarketplaceItem['type']
  minRating?: number
  maxPrice?: number
  platforms?: string[]
  tags?: string[]
  sortBy?: 'downloads' | 'rating' | 'newest' | 'price'
  sortOrder?: 'asc' | 'desc'
}

export function searchMarketplace(
  items: MarketplaceItem[],
  params: MarketplaceSearchParams
): MarketplaceItem[] {
  let results = [...items]

  if (params.query) {
    const query = params.query.toLowerCase()
    results = results.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (params.type) {
    results = results.filter(item => item.type === params.type)
  }

  if (params.minRating) {
    results = results.filter(item => item.rating >= params.minRating!)
  }

  if (params.maxPrice !== undefined) {
    results = results.filter(item => item.price <= params.maxPrice!)
  }

  if (params.platforms && params.platforms.length > 0) {
    results = results.filter(item =>
      params.platforms!.some(platform => item.platforms.includes(platform))
    )
  }

  if (params.tags && params.tags.length > 0) {
    results = results.filter(item =>
      params.tags!.some(tag => item.tags.includes(tag))
    )
  }

  if (params.sortBy) {
    results.sort((a, b) => {
      let comparison = 0
      switch (params.sortBy) {
        case 'downloads':
          comparison = b.downloads - a.downloads
          break
        case 'rating':
          comparison = b.rating - a.rating
          break
        case 'newest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case 'price':
          comparison = a.price - b.price
          break
      }
      return params.sortOrder === 'asc' ? -comparison : comparison
    })
  }

  return results
}
