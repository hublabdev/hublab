/**
 * HubLab App Icon Generator
 *
 * Genera iconos de app profesionales usando IA.
 * Soporta múltiples estilos y exporta para todas las plataformas.
 *
 * Filosofía: "Your app deserves an icon that stands out."
 */

// ============================================================================
// ICON STYLES
// ============================================================================

export interface IconStyle {
  id: string
  name: string
  preview: string // emoji preview
  prompt: string // AI prompt modifier
  description: string
}

export const ICON_STYLES: IconStyle[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    preview: '⬜',
    prompt: 'minimalist, clean, simple shapes, flat design, single color accent, white background',
    description: 'Clean and simple, inspired by Apple design'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    preview: '🌈',
    prompt: 'vibrant gradient background, modern, sleek, smooth color transitions, subtle depth',
    description: 'Beautiful gradients like Instagram'
  },
  {
    id: '3d',
    name: '3D',
    preview: '🧊',
    prompt: '3D rendered, glossy, realistic lighting, soft shadows, depth, modern 3D icon style',
    description: 'Dimensional and eye-catching'
  },
  {
    id: 'glassmorphism',
    name: 'Glass',
    preview: '🪟',
    prompt: 'glassmorphism, frosted glass effect, translucent, blur background, modern UI, light reflections',
    description: 'Trendy glass effect'
  },
  {
    id: 'flat',
    name: 'Flat',
    preview: '📐',
    prompt: 'flat design, solid colors, geometric shapes, material design inspired, no shadows',
    description: 'Google Material style'
  },
  {
    id: 'playful',
    name: 'Playful',
    preview: '🎨',
    prompt: 'fun, colorful, cartoon style, rounded shapes, friendly, playful design',
    description: 'Fun and approachable'
  },
  {
    id: 'dark',
    name: 'Dark',
    preview: '🌙',
    prompt: 'dark mode, dark background, neon accents, modern dark UI, subtle glow effects',
    description: 'Elegant dark theme'
  },
  {
    id: 'outline',
    name: 'Outline',
    preview: '✏️',
    prompt: 'line art, outline style, stroke based, minimalist, monoline, single color on white',
    description: 'Clean line illustrations'
  },
  {
    id: 'isometric',
    name: 'Isometric',
    preview: '📦',
    prompt: 'isometric perspective, 3D isometric style, geometric, architectural feel',
    description: 'Technical 3D perspective'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    preview: '📻',
    prompt: 'retro vintage style, muted colors, textured, nostalgic, classic design',
    description: 'Retro and nostalgic'
  }
]

// ============================================================================
// COLOR PALETTES
// ============================================================================

export interface ColorPalette {
  id: string
  name: string
  colors: string[]
  preview: string
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#0EA5E9', '#0284C7', '#0369A1', '#075985'],
    preview: '🌊'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#F97316', '#EA580C', '#FB923C', '#FDBA74'],
    preview: '🌅'
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#22C55E', '#16A34A', '#15803D', '#166534'],
    preview: '🌲'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: ['#A855F7', '#9333EA', '#7E22CE', '#6B21A8'],
    preview: '💜'
  },
  {
    id: 'coral',
    name: 'Coral',
    colors: ['#F43F5E', '#E11D48', '#BE123C', '#9F1239'],
    preview: '🪸'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: ['#1E293B', '#334155', '#475569', '#64748B'],
    preview: '🌃'
  },
  {
    id: 'gold',
    name: 'Gold',
    colors: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
    preview: '✨'
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: ['#22D3EE', '#A855F7', '#EC4899', '#F472B6'],
    preview: '💫'
  }
]

// ============================================================================
// ICON CATEGORIES
// ============================================================================

export interface IconCategory {
  id: string
  name: string
  emoji: string
  keywords: string[]
}

export const ICON_CATEGORIES: IconCategory[] = [
  { id: 'social', name: 'Social', emoji: '💬', keywords: ['chat', 'message', 'community', 'connect', 'share'] },
  { id: 'productivity', name: 'Productivity', emoji: '✅', keywords: ['task', 'calendar', 'note', 'organize', 'todo'] },
  { id: 'finance', name: 'Finance', emoji: '💰', keywords: ['money', 'wallet', 'bank', 'payment', 'budget'] },
  { id: 'health', name: 'Health', emoji: '❤️', keywords: ['fitness', 'wellness', 'medical', 'workout', 'diet'] },
  { id: 'education', name: 'Education', emoji: '📚', keywords: ['learn', 'study', 'course', 'book', 'school'] },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎮', keywords: ['game', 'music', 'video', 'stream', 'play'] },
  { id: 'travel', name: 'Travel', emoji: '✈️', keywords: ['trip', 'map', 'destination', 'explore', 'journey'] },
  { id: 'food', name: 'Food', emoji: '🍽️', keywords: ['restaurant', 'recipe', 'cooking', 'delivery', 'menu'] },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', keywords: ['store', 'cart', 'buy', 'sale', 'fashion'] },
  { id: 'utility', name: 'Utility', emoji: '🔧', keywords: ['tool', 'settings', 'calculator', 'converter', 'utility'] },
  { id: 'creative', name: 'Creative', emoji: '🎨', keywords: ['art', 'design', 'photo', 'edit', 'create'] },
  { id: 'ai', name: 'AI & Tech', emoji: '🤖', keywords: ['ai', 'smart', 'bot', 'assistant', 'tech'] }
]

// ============================================================================
// GENERATOR CONFIG
// ============================================================================

export interface IconGeneratorConfig {
  prompt: string
  style: string
  palette: string
  size: number
  shape: 'square' | 'rounded' | 'circle'
}

export interface GeneratedIcon {
  id: string
  url: string
  prompt: string
  style: string
  palette: string
  createdAt: string
}

// ============================================================================
// ICON SIZES FOR EXPORT
// ============================================================================

export const IOS_ICON_SIZES = [
  { name: 'App Store', size: 1024 },
  { name: 'iPhone @3x', size: 180 },
  { name: 'iPhone @2x', size: 120 },
  { name: 'iPad Pro', size: 167 },
  { name: 'iPad', size: 152 },
  { name: 'Settings', size: 87 },
  { name: 'Spotlight', size: 120 },
  { name: 'Notification', size: 60 }
]

export const ANDROID_ICON_SIZES = [
  { name: 'Play Store', size: 512 },
  { name: 'xxxhdpi', size: 192 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xhdpi', size: 96 },
  { name: 'hdpi', size: 72 },
  { name: 'mdpi', size: 48 }
]

export const WEB_ICON_SIZES = [
  { name: 'Apple Touch', size: 180 },
  { name: 'Favicon Large', size: 192 },
  { name: 'Favicon', size: 32 },
  { name: 'Favicon Small', size: 16 }
]

// ============================================================================
// PROMPT BUILDER
// ============================================================================

export function buildIconPrompt(config: {
  description: string
  style: IconStyle
  palette: ColorPalette
  category?: IconCategory
}): string {
  const { description, style, palette, category } = config

  const colorList = palette.colors.slice(0, 2).join(' and ')

  let prompt = `App icon design: ${description}. `
  prompt += `${style.prompt}. `
  prompt += `Primary colors: ${colorList}. `

  if (category) {
    prompt += `Category: ${category.name}. `
  }

  prompt += 'Single centered icon, no text, no border, professional app icon, high quality, iOS/Android app store ready.'

  return prompt
}

// ============================================================================
// EMOJI ICON GENERATOR (Fallback)
// ============================================================================

const EMOJI_MAP: Record<string, string[]> = {
  chat: ['💬', '💭', '🗨️', '📱'],
  message: ['✉️', '📩', '📨', '💌'],
  social: ['👥', '🤝', '🌐', '🔗'],
  task: ['✅', '☑️', '📋', '✔️'],
  calendar: ['📅', '🗓️', '📆', '⏰'],
  note: ['📝', '🗒️', '📓', '✏️'],
  money: ['💰', '💵', '🏦', '💳'],
  wallet: ['👛', '💼', '🏧', '💲'],
  health: ['❤️', '🏥', '💊', '🩺'],
  fitness: ['💪', '🏃', '🚴', '🏋️'],
  learn: ['📚', '🎓', '📖', '✍️'],
  game: ['🎮', '🎯', '🎲', '🕹️'],
  music: ['🎵', '🎶', '🎸', '🎹'],
  video: ['📹', '🎬', '📺', '🎥'],
  travel: ['✈️', '🌍', '🗺️', '🧳'],
  food: ['🍽️', '🍔', '🍕', '👨‍🍳'],
  shop: ['🛍️', '🛒', '🏪', '💳'],
  tool: ['🔧', '⚙️', '🛠️', '🔨'],
  art: ['🎨', '🖼️', '✨', '🌈'],
  ai: ['🤖', '🧠', '⚡', '💡'],
  photo: ['📷', '📸', '🖼️', '🎞️'],
  weather: ['🌤️', '☀️', '🌧️', '🌈'],
  map: ['🗺️', '📍', '🧭', '🌐'],
  time: ['⏰', '⌚', '⏱️', '🕐'],
  lock: ['🔒', '🔐', '🛡️', '🔑'],
  star: ['⭐', '🌟', '✨', '💫'],
  heart: ['❤️', '💖', '💕', '💝'],
  rocket: ['🚀', '✨', '🌟', '💫'],
  default: ['📱', '💎', '🔮', '✨']
}

export function getEmojiForKeyword(keyword: string): string {
  const lowerKeyword = keyword.toLowerCase()

  for (const [key, emojis] of Object.entries(EMOJI_MAP)) {
    if (lowerKeyword.includes(key)) {
      return emojis[Math.floor(Math.random() * emojis.length)]
    }
  }

  return EMOJI_MAP.default[Math.floor(Math.random() * EMOJI_MAP.default.length)]
}

// ============================================================================
// PLACEHOLDER ICON GENERATOR (Canvas-based)
// ============================================================================

export function generatePlaceholderIcon(config: {
  text: string
  color: string
  size: number
  style: 'gradient' | 'solid' | 'outline'
}): string {
  // This would generate a canvas-based icon
  // For now, return a placeholder SVG data URL
  const { text, color, size, style } = config
  const letter = text.charAt(0).toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(color, -30)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${style === 'gradient' ? 'url(#grad)' : color}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        fill="white"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${size * 0.5}"
        font-weight="600"
      >
        ${letter}
      </text>
    </svg>
  `

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)
}
