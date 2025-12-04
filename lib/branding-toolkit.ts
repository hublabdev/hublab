/**
 * HubLab Assets & Branding Toolkit
 *
 * Provides professional branding tools for micro-app creators.
 * Generate screenshots, store listings, and marketing materials.
 *
 * Philosophy: "Make your app look like a million dollar product."
 */

// ============================================================================
// APP STORE SCREENSHOTS
// ============================================================================

export interface ScreenshotTemplate {
  id: string
  name: string
  preview: string
  device: 'iphone' | 'ipad' | 'android' | 'web'
  dimensions: { width: number; height: number }
  features: string[]
}

export const SCREENSHOT_TEMPLATES: ScreenshotTemplate[] = [
  // iPhone
  {
    id: 'iphone-feature',
    name: 'Feature Highlight',
    preview: '📱',
    device: 'iphone',
    dimensions: { width: 1290, height: 2796 },
    features: ['Device frame', 'Feature text', 'Gradient background']
  },
  {
    id: 'iphone-minimal',
    name: 'Minimal Clean',
    preview: '⬜',
    device: 'iphone',
    dimensions: { width: 1290, height: 2796 },
    features: ['No device frame', 'Solid color background', 'Simple caption']
  },
  {
    id: 'iphone-gradient',
    name: 'Gradient Hero',
    preview: '🌈',
    device: 'iphone',
    dimensions: { width: 1290, height: 2796 },
    features: ['Device frame', 'Bold headline', 'Vibrant gradient']
  },
  {
    id: 'iphone-split',
    name: 'Split View',
    preview: '↔️',
    device: 'iphone',
    dimensions: { width: 1290, height: 2796 },
    features: ['Two screens side by side', 'Before/after comparison']
  },
  // iPad
  {
    id: 'ipad-landscape',
    name: 'iPad Landscape',
    preview: '🖥️',
    device: 'ipad',
    dimensions: { width: 2732, height: 2048 },
    features: ['Landscape mode', 'Desktop-like layout', 'Feature callouts']
  },
  {
    id: 'ipad-portrait',
    name: 'iPad Portrait',
    preview: '📱',
    device: 'ipad',
    dimensions: { width: 2048, height: 2732 },
    features: ['Portrait mode', 'App showcase', 'Clean design']
  },
  // Android
  {
    id: 'android-feature',
    name: 'Android Feature',
    preview: '🤖',
    device: 'android',
    dimensions: { width: 1440, height: 3200 },
    features: ['Android device frame', 'Feature highlight', 'Material design']
  },
  // Web
  {
    id: 'web-hero',
    name: 'Web Hero',
    preview: '💻',
    device: 'web',
    dimensions: { width: 2880, height: 1800 },
    features: ['Browser mockup', 'Desktop layout', 'Landing page style']
  }
]

// ============================================================================
// DEVICE FRAMES
// ============================================================================

export interface DeviceFrame {
  id: string
  name: string
  type: 'iphone' | 'ipad' | 'android' | 'macbook' | 'imac'
  year: number
  screenSize: { width: number; height: number }
  bezelColor: 'black' | 'white' | 'gold' | 'silver'
}

export const DEVICE_FRAMES: DeviceFrame[] = [
  // iPhones
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', type: 'iphone', year: 2023, screenSize: { width: 393, height: 852 }, bezelColor: 'black' },
  { id: 'iphone-15', name: 'iPhone 15', type: 'iphone', year: 2023, screenSize: { width: 393, height: 852 }, bezelColor: 'white' },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', type: 'iphone', year: 2022, screenSize: { width: 393, height: 852 }, bezelColor: 'black' },
  { id: 'iphone-se', name: 'iPhone SE', type: 'iphone', year: 2022, screenSize: { width: 375, height: 667 }, bezelColor: 'black' },
  // iPads
  { id: 'ipad-pro-12', name: 'iPad Pro 12.9"', type: 'ipad', year: 2023, screenSize: { width: 1024, height: 1366 }, bezelColor: 'silver' },
  { id: 'ipad-air', name: 'iPad Air', type: 'ipad', year: 2023, screenSize: { width: 820, height: 1180 }, bezelColor: 'silver' },
  { id: 'ipad-mini', name: 'iPad mini', type: 'ipad', year: 2023, screenSize: { width: 744, height: 1133 }, bezelColor: 'silver' },
  // Android
  { id: 'pixel-8', name: 'Google Pixel 8', type: 'android', year: 2023, screenSize: { width: 412, height: 915 }, bezelColor: 'black' },
  { id: 'galaxy-s24', name: 'Samsung Galaxy S24', type: 'android', year: 2024, screenSize: { width: 412, height: 915 }, bezelColor: 'black' },
  // Mac
  { id: 'macbook-pro', name: 'MacBook Pro', type: 'macbook', year: 2023, screenSize: { width: 1728, height: 1117 }, bezelColor: 'silver' },
  { id: 'imac', name: 'iMac 24"', type: 'imac', year: 2023, screenSize: { width: 2240, height: 1260 }, bezelColor: 'silver' }
]

// ============================================================================
// COLOR THEMES
// ============================================================================

export interface BrandingTheme {
  id: string
  name: string
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  gradient: string
}

export const BRANDING_THEMES: BrandingTheme[] = [
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    preview: '🌊',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#22D3EE',
      background: '#F0F9FF',
      text: '#0C4A6E'
    },
    gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4)'
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    preview: '🌅',
    colors: {
      primary: '#F97316',
      secondary: '#FB923C',
      accent: '#FDBA74',
      background: '#FFF7ED',
      text: '#7C2D12'
    },
    gradient: 'linear-gradient(135deg, #F97316, #FB923C)'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    preview: '🌲',
    colors: {
      primary: '#22C55E',
      secondary: '#16A34A',
      accent: '#4ADE80',
      background: '#F0FDF4',
      text: '#14532D'
    },
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    preview: '💜',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#FAF5FF',
      text: '#4C1D95'
    },
    gradient: 'linear-gradient(135deg, #8B5CF6, #A855F7)'
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    preview: '🌸',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#F9A8D4',
      background: '#FDF2F8',
      text: '#831843'
    },
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)'
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    preview: '🌙',
    colors: {
      primary: '#1E293B',
      secondary: '#334155',
      accent: '#3B82F6',
      background: '#0F172A',
      text: '#F1F5F9'
    },
    gradient: 'linear-gradient(135deg, #1E293B, #0F172A)'
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    preview: '💫',
    colors: {
      primary: '#06B6D4',
      secondary: '#8B5CF6',
      accent: '#F472B6',
      background: '#0F0F0F',
      text: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #06B6D4, #8B5CF6, #F472B6)'
  },
  {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    preview: '✨',
    colors: {
      primary: '#D97706',
      secondary: '#F59E0B',
      accent: '#FBBF24',
      background: '#FFFBEB',
      text: '#78350F'
    },
    gradient: 'linear-gradient(135deg, #D97706, #F59E0B)'
  }
]

// ============================================================================
// TYPOGRAPHY PRESETS
// ============================================================================

export interface TypographyPreset {
  id: string
  name: string
  fontFamily: string
  weights: number[]
  category: 'sans' | 'serif' | 'mono' | 'display'
  description: string
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'inter',
    name: 'Inter',
    fontFamily: 'Inter, system-ui, sans-serif',
    weights: [400, 500, 600, 700],
    category: 'sans',
    description: 'Modern, clean, highly readable'
  },
  {
    id: 'sf-pro',
    name: 'SF Pro',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    weights: [400, 500, 600, 700],
    category: 'sans',
    description: 'Apple\'s system font'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    fontFamily: 'Poppins, sans-serif',
    weights: [400, 500, 600, 700],
    category: 'sans',
    description: 'Geometric, friendly, approachable'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    fontFamily: 'Playfair Display, serif',
    weights: [400, 600, 700],
    category: 'serif',
    description: 'Elegant, editorial, luxury feel'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    fontFamily: 'Space Grotesk, sans-serif',
    weights: [400, 500, 700],
    category: 'display',
    description: 'Tech-forward, modern startup'
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    fontFamily: 'JetBrains Mono, monospace',
    weights: [400, 500, 700],
    category: 'mono',
    description: 'Developer-focused, code-friendly'
  }
]

// ============================================================================
// STORE LISTING GENERATORS
// ============================================================================

export interface AppStoreMetadata {
  name: string
  subtitle: string
  description: string
  keywords: string[]
  category: string
  primaryColor: string
}

export interface StoreListingContent {
  shortDescription: string
  fullDescription: string
  promotionalText: string
  updateNotes: string
}

export function generateStoreDescription(metadata: AppStoreMetadata): StoreListingContent {
  const { name, subtitle, keywords } = metadata

  const shortDescription = `${subtitle} - ${name}`

  const fullDescription = `
${name} - ${subtitle}

${name} is your perfect companion for ${keywords.slice(0, 3).join(', ')}.

KEY FEATURES:
• Simple and intuitive interface
• Works offline - no internet required
• Sync across all your devices
• Dark mode support
• Regular updates and new features

WHY CHOOSE ${name.toUpperCase()}?
We believe that the best apps are the ones you actually use. That's why we've designed ${name} to be as simple and effective as possible.

PRIVACY FIRST
Your data stays on your device. We don't collect or share your personal information.

GET STARTED TODAY
Download ${name} now and experience the difference!

CONTACT US
Have questions or suggestions? We'd love to hear from you!
`.trim()

  const promotionalText = `NEW! ${name} makes ${keywords[0]} easier than ever. Try it free today!`

  const updateNotes = `
What's New:
• Performance improvements
• Bug fixes
• UI polish
`.trim()

  return {
    shortDescription,
    fullDescription,
    promotionalText,
    updateNotes
  }
}

// ============================================================================
// MARKETING ASSETS
// ============================================================================

export interface MarketingAsset {
  id: string
  name: string
  icon: string
  type: 'image' | 'video' | 'document'
  dimensions?: { width: number; height: number }
  format: string
  description: string
}

export const MARKETING_ASSETS: MarketingAsset[] = [
  // Social Media
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    icon: '📷',
    type: 'image',
    dimensions: { width: 1080, height: 1080 },
    format: 'PNG/JPG',
    description: 'Square post for Instagram feed'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    icon: '📱',
    type: 'image',
    dimensions: { width: 1080, height: 1920 },
    format: 'PNG/JPG',
    description: 'Vertical story format'
  },
  {
    id: 'twitter-post',
    name: 'Twitter/X Post',
    icon: '🐦',
    type: 'image',
    dimensions: { width: 1200, height: 675 },
    format: 'PNG/JPG',
    description: 'Optimal size for Twitter timeline'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    icon: '💼',
    type: 'image',
    dimensions: { width: 1200, height: 627 },
    format: 'PNG/JPG',
    description: 'Professional LinkedIn post'
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    icon: '📘',
    type: 'image',
    dimensions: { width: 1640, height: 624 },
    format: 'PNG/JPG',
    description: 'Facebook page cover image'
  },
  // App Store
  {
    id: 'feature-graphic',
    name: 'Feature Graphic',
    icon: '🎨',
    type: 'image',
    dimensions: { width: 1024, height: 500 },
    format: 'PNG/JPG',
    description: 'Google Play feature graphic'
  },
  {
    id: 'promo-video',
    name: 'Promo Video',
    icon: '🎬',
    type: 'video',
    dimensions: { width: 1920, height: 1080 },
    format: 'MP4',
    description: 'App preview video (15-30 seconds)'
  },
  // Press Kit
  {
    id: 'press-kit',
    name: 'Press Kit',
    icon: '📰',
    type: 'document',
    format: 'ZIP',
    description: 'Complete media kit with logos, screenshots, description'
  }
]

// ============================================================================
// BRANDING EXPORT
// ============================================================================

export interface BrandingExport {
  appName: string
  theme: BrandingTheme
  typography: TypographyPreset
  icons: {
    ios: string[]
    android: string[]
    web: string[]
  }
  screenshots: string[]
  marketingAssets: string[]
  storeListings: {
    ios: StoreListingContent
    android: StoreListingContent
  }
}

export function generateBrandingKit(config: {
  appName: string
  themeId: string
  typographyId: string
  keywords: string[]
  category: string
}): BrandingExport {
  const theme = BRANDING_THEMES.find(t => t.id === config.themeId) || BRANDING_THEMES[0]
  const typography = TYPOGRAPHY_PRESETS.find(t => t.id === config.typographyId) || TYPOGRAPHY_PRESETS[0]

  const metadata: AppStoreMetadata = {
    name: config.appName,
    subtitle: `The best ${config.category.toLowerCase()} app`,
    description: '',
    keywords: config.keywords,
    category: config.category,
    primaryColor: theme.colors.primary
  }

  const storeContent = generateStoreDescription(metadata)

  return {
    appName: config.appName,
    theme,
    typography,
    icons: {
      ios: ['icon-1024.png', 'icon-180.png', 'icon-120.png'],
      android: ['ic_launcher-xxxhdpi.png', 'ic_launcher-xxhdpi.png', 'ic_launcher-xhdpi.png'],
      web: ['favicon.ico', 'apple-touch-icon.png', 'icon-192.png']
    },
    screenshots: [],
    marketingAssets: [],
    storeListings: {
      ios: storeContent,
      android: storeContent
    }
  }
}

// ============================================================================
// SPLASH SCREEN GENERATOR
// ============================================================================

export interface SplashScreenConfig {
  backgroundColor: string
  logoUrl: string
  logoSize: number
  showAppName: boolean
  appNameColor: string
  animation: 'none' | 'fade' | 'scale' | 'bounce'
}

export function generateSplashScreenCode(config: SplashScreenConfig, platform: 'ios' | 'android' | 'web'): string {
  if (platform === 'ios') {
    return `
// SplashScreen.swift
import SwiftUI

struct SplashScreen: View {
    @State private var isActive = false

    var body: some View {
        ZStack {
            Color(hex: "${config.backgroundColor}")
                .ignoresSafeArea()

            VStack(spacing: 20) {
                Image("logo")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: ${config.logoSize}, height: ${config.logoSize})
                ${config.showAppName ? `
                Text("AppName")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(Color(hex: "${config.appNameColor}"))
                ` : ''}
            }
        }
    }
}
`
  } else if (platform === 'android') {
    return `
// SplashScreen.kt
@Composable
fun SplashScreen(onComplete: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF${config.backgroundColor.replace('#', '')})),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Image(
                painter = painterResource(R.drawable.logo),
                contentDescription = "Logo",
                modifier = Modifier.size(${config.logoSize}.dp)
            )
            ${config.showAppName ? `
            Text(
                text = "AppName",
                style = MaterialTheme.typography.headlineMedium,
                color = Color(0xFF${config.appNameColor.replace('#', '')})
            )
            ` : ''}
        }
    }
}
`
  } else {
    return `
// SplashScreen.tsx
export function SplashScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '${config.backgroundColor}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <img src="/logo.png" alt="Logo" style={{ width: ${config.logoSize}, height: ${config.logoSize} }} />
      ${config.showAppName ? `<h1 style={{ color: '${config.appNameColor}' }}>AppName</h1>` : ''}
    </div>
  )
}
`
  }
}
