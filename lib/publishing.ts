/**
 * HubLab One-Click Publishing System
 *
 * Simplifies the app publishing process for non-technical creators.
 * Guides users through submission to App Store, Play Store, and web.
 *
 * Philosophy: "From idea to app store in minutes, not weeks."
 */

// ============================================================================
// PUBLISHING PLATFORMS
// ============================================================================

export interface PublishingPlatform {
  id: string
  name: string
  icon: string
  description: string
  requirements: string[]
  estimatedTime: string
  cost: string
  docsUrl: string
  status: 'ready' | 'coming-soon' | 'beta'
}

export const PUBLISHING_PLATFORMS: PublishingPlatform[] = [
  {
    id: 'ios-app-store',
    name: 'iOS App Store',
    icon: '🍎',
    description: 'Publish to Apple App Store for iPhone & iPad',
    requirements: [
      'Apple Developer Account ($99/year)',
      'App icons (1024x1024)',
      'Screenshots (6.5" and 5.5")',
      'Privacy policy URL',
      'App description'
    ],
    estimatedTime: '1-3 days review',
    cost: '$99/year',
    docsUrl: 'https://developer.apple.com/app-store/submitting/',
    status: 'ready'
  },
  {
    id: 'google-play',
    name: 'Google Play Store',
    icon: '🤖',
    description: 'Publish to Google Play for Android devices',
    requirements: [
      'Google Play Console ($25 one-time)',
      'App icon (512x512)',
      'Feature graphic (1024x500)',
      'Screenshots (phone & tablet)',
      'Privacy policy URL'
    ],
    estimatedTime: 'Hours to 3 days',
    cost: '$25 one-time',
    docsUrl: 'https://developer.android.com/distribute/console',
    status: 'ready'
  },
  {
    id: 'web-netlify',
    name: 'Web (Netlify)',
    icon: '🌐',
    description: 'Deploy as a web app with custom domain',
    requirements: [
      'Netlify account (free)',
      'Custom domain (optional)',
      'SSL certificate (auto)'
    ],
    estimatedTime: 'Instant',
    cost: 'Free',
    docsUrl: 'https://netlify.com/docs',
    status: 'ready'
  },
  {
    id: 'web-vercel',
    name: 'Web (Vercel)',
    icon: '▲',
    description: 'Deploy as a web app on Vercel',
    requirements: [
      'Vercel account (free)',
      'Custom domain (optional)',
      'SSL certificate (auto)'
    ],
    estimatedTime: 'Instant',
    cost: 'Free',
    docsUrl: 'https://vercel.com/docs',
    status: 'ready'
  },
  {
    id: 'pwa',
    name: 'Progressive Web App',
    icon: '📱',
    description: 'Installable web app with offline support',
    requirements: [
      'Web hosting',
      'Service worker (auto-generated)',
      'Web manifest (auto-generated)'
    ],
    estimatedTime: 'Instant',
    cost: 'Free',
    docsUrl: 'https://web.dev/progressive-web-apps/',
    status: 'ready'
  },
  {
    id: 'macos-app-store',
    name: 'Mac App Store',
    icon: '💻',
    description: 'Publish to Mac App Store',
    requirements: [
      'Apple Developer Account ($99/year)',
      'Mac app build (via Tauri)',
      'App icons and screenshots',
      'Notarization'
    ],
    estimatedTime: '1-3 days review',
    cost: '$99/year (same as iOS)',
    docsUrl: 'https://developer.apple.com/macos/submit/',
    status: 'beta'
  },
  {
    id: 'microsoft-store',
    name: 'Microsoft Store',
    icon: '🪟',
    description: 'Publish to Microsoft Store for Windows',
    requirements: [
      'Microsoft Partner Center account',
      'Windows app build (via Tauri)',
      'App icons and screenshots'
    ],
    estimatedTime: '1-3 days review',
    cost: '$19 one-time',
    docsUrl: 'https://docs.microsoft.com/windows/apps/publish/',
    status: 'coming-soon'
  }
]

// ============================================================================
// PUBLISHING CHECKLIST
// ============================================================================

export interface ChecklistItem {
  id: string
  title: string
  description: string
  required: boolean
  category: 'info' | 'assets' | 'legal' | 'config'
  platforms: string[]
}

export const PUBLISHING_CHECKLIST: ChecklistItem[] = [
  // App Information
  {
    id: 'app-name',
    title: 'App Name',
    description: 'Unique name for your app (max 30 characters)',
    required: true,
    category: 'info',
    platforms: ['ios-app-store', 'google-play', 'web-netlify', 'web-vercel']
  },
  {
    id: 'app-subtitle',
    title: 'App Subtitle',
    description: 'Short tagline (max 30 characters)',
    required: true,
    category: 'info',
    platforms: ['ios-app-store']
  },
  {
    id: 'app-description',
    title: 'App Description',
    description: 'Full description of your app',
    required: true,
    category: 'info',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'keywords',
    title: 'Keywords',
    description: 'Search keywords (comma-separated)',
    required: true,
    category: 'info',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'category',
    title: 'App Category',
    description: 'Primary category for app store',
    required: true,
    category: 'info',
    platforms: ['ios-app-store', 'google-play']
  },
  // Assets
  {
    id: 'app-icon',
    title: 'App Icon',
    description: '1024x1024 PNG without transparency',
    required: true,
    category: 'assets',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'screenshots-phone',
    title: 'Phone Screenshots',
    description: 'At least 3 screenshots (6.5" display)',
    required: true,
    category: 'assets',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'screenshots-tablet',
    title: 'Tablet Screenshots',
    description: 'At least 3 screenshots (12.9" display)',
    required: false,
    category: 'assets',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'feature-graphic',
    title: 'Feature Graphic',
    description: '1024x500 promotional image',
    required: true,
    category: 'assets',
    platforms: ['google-play']
  },
  {
    id: 'app-preview',
    title: 'App Preview Video',
    description: '15-30 second preview video',
    required: false,
    category: 'assets',
    platforms: ['ios-app-store', 'google-play']
  },
  // Legal
  {
    id: 'privacy-policy',
    title: 'Privacy Policy URL',
    description: 'Link to your privacy policy',
    required: true,
    category: 'legal',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'terms-of-service',
    title: 'Terms of Service URL',
    description: 'Link to your terms of service',
    required: false,
    category: 'legal',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'support-url',
    title: 'Support URL',
    description: 'Link to support page or email',
    required: true,
    category: 'legal',
    platforms: ['ios-app-store', 'google-play']
  },
  // Configuration
  {
    id: 'bundle-id',
    title: 'Bundle ID',
    description: 'Unique identifier (e.g., com.yourname.appname)',
    required: true,
    category: 'config',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'version-number',
    title: 'Version Number',
    description: 'App version (e.g., 1.0.0)',
    required: true,
    category: 'config',
    platforms: ['ios-app-store', 'google-play']
  },
  {
    id: 'age-rating',
    title: 'Age Rating',
    description: 'Content rating for your app',
    required: true,
    category: 'config',
    platforms: ['ios-app-store', 'google-play']
  }
]

// ============================================================================
// APP CATEGORIES
// ============================================================================

export interface AppCategory {
  id: string
  name: string
  icon: string
  iosId: string
  androidId: string
}

export const APP_CATEGORIES: AppCategory[] = [
  { id: 'business', name: 'Business', icon: '💼', iosId: '6000', androidId: 'BUSINESS' },
  { id: 'education', name: 'Education', icon: '📚', iosId: '6017', androidId: 'EDUCATION' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', iosId: '6016', androidId: 'ENTERTAINMENT' },
  { id: 'finance', name: 'Finance', icon: '💰', iosId: '6015', androidId: 'FINANCE' },
  { id: 'food-drink', name: 'Food & Drink', icon: '🍽️', iosId: '6023', androidId: 'FOOD_AND_DRINK' },
  { id: 'games', name: 'Games', icon: '🎮', iosId: '6014', androidId: 'GAME' },
  { id: 'health-fitness', name: 'Health & Fitness', icon: '💪', iosId: '6013', androidId: 'HEALTH_AND_FITNESS' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', iosId: '6012', androidId: 'LIFESTYLE' },
  { id: 'music', name: 'Music', icon: '🎵', iosId: '6011', androidId: 'MUSIC_AND_AUDIO' },
  { id: 'navigation', name: 'Navigation', icon: '🗺️', iosId: '6010', androidId: 'MAPS_AND_NAVIGATION' },
  { id: 'news', name: 'News', icon: '📰', iosId: '6009', androidId: 'NEWS_AND_MAGAZINES' },
  { id: 'photo-video', name: 'Photo & Video', icon: '📷', iosId: '6008', androidId: 'PHOTOGRAPHY' },
  { id: 'productivity', name: 'Productivity', icon: '✅', iosId: '6007', androidId: 'PRODUCTIVITY' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', iosId: '6024', androidId: 'SHOPPING' },
  { id: 'social', name: 'Social Networking', icon: '💬', iosId: '6005', androidId: 'SOCIAL' },
  { id: 'sports', name: 'Sports', icon: '⚽', iosId: '6004', androidId: 'SPORTS' },
  { id: 'travel', name: 'Travel', icon: '✈️', iosId: '6003', androidId: 'TRAVEL_AND_LOCAL' },
  { id: 'utilities', name: 'Utilities', icon: '🔧', iosId: '6002', androidId: 'TOOLS' },
  { id: 'weather', name: 'Weather', icon: '🌤️', iosId: '6001', androidId: 'WEATHER' }
]

// ============================================================================
// PUBLISHING STATUS
// ============================================================================

export type PublishingStatus =
  | 'draft'
  | 'preparing'
  | 'validating'
  | 'uploading'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'published'

export interface PublishingProgress {
  platform: string
  status: PublishingStatus
  progress: number
  message: string
  startedAt: string
  completedAt?: string
  errors?: string[]
}

// ============================================================================
// PUBLISHING WIZARD
// ============================================================================

export interface PublishingWizardStep {
  id: string
  title: string
  description: string
  fields: string[]
}

export const PUBLISHING_WIZARD_STEPS: PublishingWizardStep[] = [
  {
    id: 'platform-selection',
    title: 'Select Platforms',
    description: 'Choose where you want to publish your app',
    fields: ['platforms']
  },
  {
    id: 'app-info',
    title: 'App Information',
    description: 'Basic details about your app',
    fields: ['app-name', 'app-subtitle', 'app-description', 'keywords', 'category']
  },
  {
    id: 'assets',
    title: 'App Assets',
    description: 'Upload your app icon and screenshots',
    fields: ['app-icon', 'screenshots-phone', 'screenshots-tablet', 'feature-graphic']
  },
  {
    id: 'legal',
    title: 'Legal & Support',
    description: 'Add required legal documents',
    fields: ['privacy-policy', 'terms-of-service', 'support-url']
  },
  {
    id: 'configuration',
    title: 'App Configuration',
    description: 'Technical settings',
    fields: ['bundle-id', 'version-number', 'age-rating']
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your submission and publish',
    fields: []
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getChecklistForPlatform(platformId: string): ChecklistItem[] {
  return PUBLISHING_CHECKLIST.filter(item =>
    item.platforms.includes(platformId)
  )
}

export function calculateChecklistProgress(
  platformId: string,
  completedItems: string[]
): { completed: number; total: number; percentage: number } {
  const checklist = getChecklistForPlatform(platformId)
  const requiredItems = checklist.filter(item => item.required)
  const completedRequired = requiredItems.filter(item =>
    completedItems.includes(item.id)
  )

  return {
    completed: completedRequired.length,
    total: requiredItems.length,
    percentage: Math.round((completedRequired.length / requiredItems.length) * 100)
  }
}

export function generateBundleId(appName: string, developerName: string): string {
  const cleanAppName = appName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const cleanDevName = developerName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return `com.${cleanDevName}.${cleanAppName}`
}

export function validateBundleId(bundleId: string): { valid: boolean; error?: string } {
  if (!bundleId) {
    return { valid: false, error: 'Bundle ID is required' }
  }

  if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(bundleId)) {
    return {
      valid: false,
      error: 'Bundle ID must be in format: com.developer.appname'
    }
  }

  if (bundleId.length > 155) {
    return { valid: false, error: 'Bundle ID must be less than 155 characters' }
  }

  return { valid: true }
}

// ============================================================================
// PRIVACY POLICY GENERATOR
// ============================================================================

export function generatePrivacyPolicy(config: {
  appName: string
  developerName: string
  email: string
  collectsPersonalData: boolean
  usesAnalytics: boolean
  usesAds: boolean
}): string {
  const { appName, developerName, email, collectsPersonalData, usesAnalytics, usesAds } = config

  return `
# Privacy Policy for ${appName}

**Last updated: ${new Date().toLocaleDateString()}**

${developerName} ("we", "our", or "us") operates the ${appName} mobile application (the "App").

## Information Collection

${collectsPersonalData
  ? `We collect the following information:
- Account information (email, name)
- Usage data
- Device information`
  : `We do not collect any personal information. All data stays on your device.`}

## Analytics

${usesAnalytics
  ? `We use analytics services to improve our App. These services may collect anonymized usage data.`
  : `We do not use any analytics or tracking services.`}

## Advertising

${usesAds
  ? `Our App displays advertisements from third-party ad networks. These networks may collect data for personalized ads.`
  : `Our App does not display any advertisements.`}

## Data Security

We take reasonable measures to protect your information from unauthorized access.

## Contact Us

If you have questions about this Privacy Policy, please contact us at:
${email}

## Changes

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in the App.
`.trim()
}
