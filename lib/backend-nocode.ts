/**
 * HubLab No-Code Backend System
 *
 * Provides visual backend configuration for micro-app creators.
 * Connect to Supabase, Firebase, or custom APIs without writing code.
 *
 * Philosophy: "Every app needs data - connect it visually."
 */

// ============================================================================
// BACKEND PROVIDERS
// ============================================================================

export interface BackendProvider {
  id: string
  name: string
  icon: string
  description: string
  features: string[]
  setupSteps: string[]
  freeTier: string
  pricing: string
  docsUrl: string
}

export const BACKEND_PROVIDERS: BackendProvider[] = [
  {
    id: 'supabase',
    name: 'Supabase',
    icon: '⚡',
    description: 'Open source Firebase alternative with PostgreSQL',
    features: [
      'PostgreSQL database',
      'User authentication',
      'Real-time subscriptions',
      'File storage',
      'Edge functions',
      'Row-level security'
    ],
    setupSteps: [
      'Create project at supabase.com',
      'Copy project URL and anon key',
      'Paste credentials in HubLab',
      'Start building!'
    ],
    freeTier: '500MB database, 1GB storage, 50K auth users',
    pricing: 'Free → $25/mo Pro',
    docsUrl: 'https://supabase.com/docs'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: '🔥',
    description: 'Google\'s app development platform',
    features: [
      'Firestore NoSQL database',
      'Firebase Auth',
      'Cloud Storage',
      'Cloud Functions',
      'Analytics',
      'Crashlytics'
    ],
    setupSteps: [
      'Create project at console.firebase.google.com',
      'Enable services you need',
      'Download config file',
      'Add to HubLab project'
    ],
    freeTier: '1GB database, 5GB storage, 10K auth verifications',
    pricing: 'Free → Pay as you go',
    docsUrl: 'https://firebase.google.com/docs'
  },
  {
    id: 'pocketbase',
    name: 'PocketBase',
    icon: '📦',
    description: 'Open source backend in a single file',
    features: [
      'SQLite database',
      'User authentication',
      'Real-time subscriptions',
      'File storage',
      'Admin dashboard',
      'Self-hosted'
    ],
    setupSteps: [
      'Download PocketBase binary',
      'Run ./pocketbase serve',
      'Create collections in admin UI',
      'Connect HubLab to localhost'
    ],
    freeTier: 'Self-hosted - unlimited',
    pricing: 'Free (self-hosted)',
    docsUrl: 'https://pocketbase.io/docs'
  },
  {
    id: 'custom-api',
    name: 'Custom API',
    icon: '🔌',
    description: 'Connect to any REST or GraphQL API',
    features: [
      'Any REST API',
      'GraphQL support',
      'Custom headers',
      'OAuth authentication',
      'API key auth',
      'Request/response mapping'
    ],
    setupSteps: [
      'Enter your API base URL',
      'Configure authentication',
      'Map endpoints to data',
      'Test connection'
    ],
    freeTier: 'Depends on your API',
    pricing: 'Depends on your API',
    docsUrl: ''
  }
]

// ============================================================================
// DATA MODELS (VISUAL SCHEMA BUILDER)
// ============================================================================

export interface DataField {
  name: string
  type: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'json' | 'relation' | 'file'
  required: boolean
  unique: boolean
  defaultValue?: string | number | boolean
  relationTo?: string
  description?: string
}

export interface DataModel {
  id: string
  name: string
  icon: string
  fields: DataField[]
  timestamps: boolean
  softDelete: boolean
}

export const PRESET_DATA_MODELS: DataModel[] = [
  {
    id: 'users',
    name: 'Users',
    icon: '👤',
    fields: [
      { name: 'email', type: 'email', required: true, unique: true },
      { name: 'name', type: 'text', required: true, unique: false },
      { name: 'avatar', type: 'file', required: false, unique: false },
      { name: 'bio', type: 'text', required: false, unique: false },
      { name: 'is_premium', type: 'boolean', required: false, unique: false, defaultValue: false }
    ],
    timestamps: true,
    softDelete: false
  },
  {
    id: 'posts',
    name: 'Posts',
    icon: '📝',
    fields: [
      { name: 'title', type: 'text', required: true, unique: false },
      { name: 'content', type: 'text', required: true, unique: false },
      { name: 'author', type: 'relation', required: true, unique: false, relationTo: 'users' },
      { name: 'published', type: 'boolean', required: false, unique: false, defaultValue: false },
      { name: 'image', type: 'file', required: false, unique: false }
    ],
    timestamps: true,
    softDelete: true
  },
  {
    id: 'products',
    name: 'Products',
    icon: '🛍️',
    fields: [
      { name: 'name', type: 'text', required: true, unique: false },
      { name: 'description', type: 'text', required: false, unique: false },
      { name: 'price', type: 'number', required: true, unique: false },
      { name: 'image', type: 'file', required: false, unique: false },
      { name: 'in_stock', type: 'boolean', required: false, unique: false, defaultValue: true },
      { name: 'category', type: 'text', required: false, unique: false }
    ],
    timestamps: true,
    softDelete: false
  },
  {
    id: 'orders',
    name: 'Orders',
    icon: '📦',
    fields: [
      { name: 'user', type: 'relation', required: true, unique: false, relationTo: 'users' },
      { name: 'items', type: 'json', required: true, unique: false },
      { name: 'total', type: 'number', required: true, unique: false },
      { name: 'status', type: 'text', required: true, unique: false, defaultValue: 'pending' },
      { name: 'shipping_address', type: 'text', required: false, unique: false }
    ],
    timestamps: true,
    softDelete: false
  },
  {
    id: 'comments',
    name: 'Comments',
    icon: '💬',
    fields: [
      { name: 'content', type: 'text', required: true, unique: false },
      { name: 'author', type: 'relation', required: true, unique: false, relationTo: 'users' },
      { name: 'post', type: 'relation', required: true, unique: false, relationTo: 'posts' },
      { name: 'likes', type: 'number', required: false, unique: false, defaultValue: 0 }
    ],
    timestamps: true,
    softDelete: true
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: '✅',
    fields: [
      { name: 'title', type: 'text', required: true, unique: false },
      { name: 'description', type: 'text', required: false, unique: false },
      { name: 'completed', type: 'boolean', required: false, unique: false, defaultValue: false },
      { name: 'due_date', type: 'date', required: false, unique: false },
      { name: 'assignee', type: 'relation', required: false, unique: false, relationTo: 'users' },
      { name: 'priority', type: 'text', required: false, unique: false, defaultValue: 'medium' }
    ],
    timestamps: true,
    softDelete: false
  },
  {
    id: 'messages',
    name: 'Messages',
    icon: '✉️',
    fields: [
      { name: 'from', type: 'relation', required: true, unique: false, relationTo: 'users' },
      { name: 'to', type: 'relation', required: true, unique: false, relationTo: 'users' },
      { name: 'content', type: 'text', required: true, unique: false },
      { name: 'read', type: 'boolean', required: false, unique: false, defaultValue: false }
    ],
    timestamps: true,
    softDelete: true
  },
  {
    id: 'bookings',
    name: 'Bookings',
    icon: '📅',
    fields: [
      { name: 'user', type: 'relation', required: true, unique: false, relationTo: 'users' },
      { name: 'service', type: 'text', required: true, unique: false },
      { name: 'date', type: 'date', required: true, unique: false },
      { name: 'time', type: 'text', required: true, unique: false },
      { name: 'status', type: 'text', required: true, unique: false, defaultValue: 'pending' },
      { name: 'notes', type: 'text', required: false, unique: false }
    ],
    timestamps: true,
    softDelete: false
  }
]

// ============================================================================
// BACKEND CAPSULES
// ============================================================================

export interface BackendCapsule {
  id: string
  name: string
  icon: string
  category: 'auth' | 'data' | 'storage' | 'realtime' | 'api'
  description: string
  platforms: string[]
  defaultProps: Record<string, unknown>
  supportsProviders: string[]
}

export const BACKEND_CAPSULES: BackendCapsule[] = [
  // Authentication
  {
    id: 'auth-login',
    name: 'Login Form',
    icon: '🔐',
    category: 'auth',
    description: 'Email/password login with validation',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      showForgotPassword: true,
      showRegisterLink: true,
      rememberMe: true,
      providers: ['email']
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },
  {
    id: 'auth-register',
    name: 'Register Form',
    icon: '📝',
    category: 'auth',
    description: 'User registration with email verification',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      requireEmail: true,
      requireName: true,
      showTerms: true,
      emailVerification: true
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },
  {
    id: 'auth-social',
    name: 'Social Login',
    icon: '🌐',
    category: 'auth',
    description: 'Login with Google, Apple, or other providers',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      providers: ['google', 'apple', 'github'],
      showDivider: true,
      buttonStyle: 'icon'
    },
    supportsProviders: ['supabase', 'firebase']
  },
  {
    id: 'auth-avatar',
    name: 'User Avatar',
    icon: '👤',
    category: 'auth',
    description: 'Display and edit user avatar',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      showName: true,
      showStatus: false,
      editable: true,
      size: 'md'
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase', 'custom-api']
  },
  {
    id: 'auth-profile',
    name: 'Profile Editor',
    icon: '✏️',
    category: 'auth',
    description: 'Edit user profile information',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      fields: ['name', 'avatar', 'bio'],
      showDeleteAccount: false
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },

  // Data
  {
    id: 'data-list',
    name: 'Data List',
    icon: '📋',
    category: 'data',
    description: 'Display list of records from database',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      collection: '',
      fields: [],
      pagination: true,
      pageSize: 10,
      sortBy: 'created_at',
      sortOrder: 'desc'
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase', 'custom-api']
  },
  {
    id: 'data-card',
    name: 'Data Card',
    icon: '🃏',
    category: 'data',
    description: 'Display single record as card',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      collection: '',
      recordId: '',
      fields: [],
      showImage: true
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase', 'custom-api']
  },
  {
    id: 'data-form',
    name: 'Data Form',
    icon: '📝',
    category: 'data',
    description: 'Create or edit database records',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      collection: '',
      mode: 'create',
      fields: [],
      submitLabel: 'Save',
      showReset: true
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase', 'custom-api']
  },
  {
    id: 'data-table',
    name: 'Data Table',
    icon: '📊',
    category: 'data',
    description: 'Display data in sortable table',
    platforms: ['web', 'desktop'],
    defaultProps: {
      collection: '',
      columns: [],
      selectable: false,
      searchable: true,
      exportable: false
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase', 'custom-api']
  },
  {
    id: 'data-search',
    name: 'Data Search',
    icon: '🔍',
    category: 'data',
    description: 'Search across database records',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      collection: '',
      searchFields: [],
      placeholder: 'Search...',
      instant: true
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase', 'custom-api']
  },
  {
    id: 'data-filter',
    name: 'Data Filter',
    icon: '🔀',
    category: 'data',
    description: 'Filter data with visual controls',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      collection: '',
      filters: [],
      showClear: true
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase', 'custom-api']
  },

  // Storage
  {
    id: 'storage-upload',
    name: 'File Upload',
    icon: '📤',
    category: 'storage',
    description: 'Upload files to cloud storage',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      bucket: 'uploads',
      accept: 'image/*',
      maxSize: 5,
      multiple: false,
      showPreview: true
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },
  {
    id: 'storage-gallery',
    name: 'Media Gallery',
    icon: '🖼️',
    category: 'storage',
    description: 'Display uploaded media files',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      bucket: 'uploads',
      columns: 3,
      lightbox: true,
      showDelete: false
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },
  {
    id: 'storage-picker',
    name: 'File Picker',
    icon: '📁',
    category: 'storage',
    description: 'Pick existing files from storage',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      bucket: 'uploads',
      filter: '*',
      multiple: false
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },

  // Realtime
  {
    id: 'realtime-presence',
    name: 'Presence Indicator',
    icon: '🟢',
    category: 'realtime',
    description: 'Show online users in real-time',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      channel: 'presence',
      showCount: true,
      showAvatars: true,
      maxAvatars: 5
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },
  {
    id: 'realtime-chat',
    name: 'Real-time Chat',
    icon: '💬',
    category: 'realtime',
    description: 'Live chat with instant messages',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      channel: 'chat',
      showTyping: true,
      showTimestamps: true,
      maxMessages: 100
    },
    supportsProviders: ['supabase', 'firebase', 'pocketbase']
  },
  {
    id: 'realtime-notifications',
    name: 'Live Notifications',
    icon: '🔔',
    category: 'realtime',
    description: 'Real-time push notifications',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      channel: 'notifications',
      showBadge: true,
      playSound: true,
      groupSimilar: true
    },
    supportsProviders: ['supabase', 'firebase']
  },

  // API
  {
    id: 'api-fetch',
    name: 'API Fetch',
    icon: '📡',
    category: 'api',
    description: 'Fetch data from any API endpoint',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      url: '',
      method: 'GET',
      headers: {},
      refreshInterval: 0
    },
    supportsProviders: ['custom-api']
  },
  {
    id: 'api-form',
    name: 'API Form',
    icon: '📮',
    category: 'api',
    description: 'Submit form data to API endpoint',
    platforms: ['web', 'ios', 'android', 'desktop'],
    defaultProps: {
      url: '',
      method: 'POST',
      contentType: 'application/json',
      showSuccess: true
    },
    supportsProviders: ['custom-api']
  },
  {
    id: 'api-webhook',
    name: 'Webhook Trigger',
    icon: '🪝',
    category: 'api',
    description: 'Trigger webhooks on events',
    platforms: ['web', 'ios', 'android'],
    defaultProps: {
      url: '',
      events: ['create', 'update', 'delete'],
      payload: {}
    },
    supportsProviders: ['custom-api']
  }
]

// ============================================================================
// SUPABASE SQL GENERATORS
// ============================================================================

export function generateSupabaseSQL(model: DataModel): string {
  let sql = `-- Create ${model.name} table\n`
  sql += `CREATE TABLE IF NOT EXISTS ${model.id} (\n`
  sql += `  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n`

  model.fields.forEach(field => {
    const sqlType = getSQLType(field.type)
    let line = `  ${field.name} ${sqlType}`

    if (field.required) line += ' NOT NULL'
    if (field.unique) line += ' UNIQUE'
    if (field.defaultValue !== undefined) {
      if (typeof field.defaultValue === 'string') {
        line += ` DEFAULT '${field.defaultValue}'`
      } else {
        line += ` DEFAULT ${field.defaultValue}`
      }
    }

    sql += line + ',\n'
  })

  if (model.timestamps) {
    sql += `  created_at TIMESTAMPTZ DEFAULT NOW(),\n`
    sql += `  updated_at TIMESTAMPTZ DEFAULT NOW(),\n`
  }

  if (model.softDelete) {
    sql += `  deleted_at TIMESTAMPTZ,\n`
  }

  // Remove trailing comma
  sql = sql.slice(0, -2) + '\n'
  sql += `);\n\n`

  // Add RLS policies
  sql += `-- Enable Row Level Security\n`
  sql += `ALTER TABLE ${model.id} ENABLE ROW LEVEL SECURITY;\n\n`

  // Add updated_at trigger
  if (model.timestamps) {
    sql += `-- Update timestamp trigger\n`
    sql += `CREATE OR REPLACE FUNCTION update_modified_column()\n`
    sql += `RETURNS TRIGGER AS $$\n`
    sql += `BEGIN\n`
    sql += `  NEW.updated_at = NOW();\n`
    sql += `  RETURN NEW;\n`
    sql += `END;\n`
    sql += `$$ language 'plpgsql';\n\n`
    sql += `CREATE TRIGGER update_${model.id}_modtime\n`
    sql += `  BEFORE UPDATE ON ${model.id}\n`
    sql += `  FOR EACH ROW\n`
    sql += `  EXECUTE FUNCTION update_modified_column();\n`
  }

  return sql
}

function getSQLType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    text: 'TEXT',
    number: 'NUMERIC',
    boolean: 'BOOLEAN',
    date: 'DATE',
    email: 'TEXT',
    url: 'TEXT',
    json: 'JSONB',
    relation: 'UUID REFERENCES',
    file: 'TEXT'
  }
  return typeMap[fieldType] || 'TEXT'
}

// ============================================================================
// BACKEND CONFIG
// ============================================================================

export interface BackendConfig {
  provider: string
  projectUrl?: string
  apiKey?: string
  databaseUrl?: string
  models: DataModel[]
  authentication: {
    enabled: boolean
    providers: string[]
    requireEmailVerification: boolean
  }
  storage: {
    enabled: boolean
    buckets: string[]
    maxFileSize: number
  }
}

export const DEFAULT_BACKEND_CONFIG: BackendConfig = {
  provider: 'supabase',
  projectUrl: '',
  apiKey: '',
  models: [],
  authentication: {
    enabled: true,
    providers: ['email'],
    requireEmailVerification: false
  },
  storage: {
    enabled: true,
    buckets: ['uploads', 'avatars'],
    maxFileSize: 5
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function validateBackendConfig(config: BackendConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.provider) {
    errors.push('Backend provider is required')
  }

  if (config.provider === 'supabase' || config.provider === 'firebase') {
    if (!config.projectUrl) {
      errors.push('Project URL is required')
    }
    if (!config.apiKey) {
      errors.push('API key is required')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function generateBackendCode(config: BackendConfig, platform: 'web' | 'ios' | 'android'): string {
  if (config.provider === 'supabase') {
    if (platform === 'web') {
      return `
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  '${config.projectUrl}',
  '${config.apiKey}'
)

export { supabase }
`
    } else if (platform === 'ios') {
      return `
import Supabase

let supabase = SupabaseClient(
    supabaseURL: URL(string: "${config.projectUrl}")!,
    supabaseKey: "${config.apiKey}"
)
`
    } else if (platform === 'android') {
      return `
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth

val supabase = createSupabaseClient(
    supabaseUrl = "${config.projectUrl}",
    supabaseKey = "${config.apiKey}"
) {
    install(Auth)
}
`
    }
  }

  return '// Backend code generation not supported for this configuration'
}
