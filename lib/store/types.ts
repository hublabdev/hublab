/**
 * HubLab Project Types
 */

export type TargetPlatform = 'web' | 'ios' | 'android' | 'desktop'

export interface CapsuleInstance {
  id: string
  type: string
  props: Record<string, unknown>
  children?: CapsuleInstance[]
}

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  fontFamily: string
}

export interface Project {
  id: string
  name: string
  description: string
  capsules: CapsuleInstance[]
  theme: ThemeConfig
  targets: TargetPlatform[]
  createdAt: string
  updatedAt: string
}

export const DEFAULT_THEME: ThemeConfig = {
  name: 'Default',
  colors: {
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F3F4F6',
    text: '#111827',
  },
  borderRadius: 'md',
  fontFamily: 'Inter',
}

export const CAPSULE_DEFINITIONS = [
  {
    type: 'button',
    name: 'Button',
    description: 'Interactive button with variants',
    category: 'ui',
    icon: '🔘',
    defaultProps: {
      label: 'Click me',
      variant: 'primary',
      size: 'md',
    },
    propSchema: {
      label: { type: 'string', required: true },
      variant: { type: 'select', options: ['primary', 'secondary', 'outline', 'ghost'] },
      size: { type: 'select', options: ['sm', 'md', 'lg'] },
      disabled: { type: 'boolean' },
    },
  },
  {
    type: 'text',
    name: 'Text',
    description: 'Typography component',
    category: 'ui',
    icon: '📝',
    defaultProps: {
      content: 'Hello World',
      variant: 'body',
    },
    propSchema: {
      content: { type: 'string', required: true },
      variant: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'body', 'caption'] },
    },
  },
  {
    type: 'input',
    name: 'Input',
    description: 'Text input field',
    category: 'forms',
    icon: '✏️',
    defaultProps: {
      placeholder: 'Enter text...',
      type: 'text',
    },
    propSchema: {
      placeholder: { type: 'string' },
      type: { type: 'select', options: ['text', 'email', 'password', 'number'] },
      label: { type: 'string' },
      required: { type: 'boolean' },
    },
  },
  {
    type: 'card',
    name: 'Card',
    description: 'Container card with shadow',
    category: 'layout',
    icon: '🃏',
    defaultProps: {
      title: 'Card Title',
      padding: 'md',
    },
    propSchema: {
      title: { type: 'string' },
      subtitle: { type: 'string' },
      padding: { type: 'select', options: ['none', 'sm', 'md', 'lg'] },
    },
  },
  {
    type: 'image',
    name: 'Image',
    description: 'Image display',
    category: 'media',
    icon: '🖼️',
    defaultProps: {
      src: 'https://picsum.photos/400/300',
      alt: 'Image',
      aspectRatio: '16:9',
    },
    propSchema: {
      src: { type: 'string', required: true },
      alt: { type: 'string', required: true },
      aspectRatio: { type: 'select', options: ['1:1', '4:3', '16:9', '21:9'] },
    },
  },
  {
    type: 'list',
    name: 'List',
    description: 'Scrollable list',
    category: 'data',
    icon: '📋',
    defaultProps: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      style: 'default',
    },
    propSchema: {
      items: { type: 'array' },
      style: { type: 'select', options: ['default', 'numbered', 'bullet'] },
    },
  },
  {
    type: 'spacer',
    name: 'Spacer',
    description: 'Vertical spacing',
    category: 'layout',
    icon: '↕️',
    defaultProps: {
      size: 'md',
    },
    propSchema: {
      size: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    },
  },
  {
    type: 'divider',
    name: 'Divider',
    description: 'Horizontal line separator',
    category: 'layout',
    icon: '➖',
    defaultProps: {
      style: 'solid',
    },
    propSchema: {
      style: { type: 'select', options: ['solid', 'dashed', 'dotted'] },
    },
  },
  {
    type: 'avatar',
    name: 'Avatar',
    description: 'User avatar image',
    category: 'ui',
    icon: '👤',
    defaultProps: {
      src: '',
      name: 'John Doe',
      size: 'md',
    },
    propSchema: {
      src: { type: 'string' },
      name: { type: 'string' },
      size: { type: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    },
  },
  {
    type: 'badge',
    name: 'Badge',
    description: 'Status badge',
    category: 'ui',
    icon: '🏷️',
    defaultProps: {
      label: 'New',
      variant: 'primary',
    },
    propSchema: {
      label: { type: 'string', required: true },
      variant: { type: 'select', options: ['primary', 'success', 'warning', 'error', 'info'] },
    },
  },
  {
    type: 'switch',
    name: 'Switch',
    description: 'Toggle switch',
    category: 'forms',
    icon: '🔀',
    defaultProps: {
      label: 'Enable feature',
      defaultChecked: false,
    },
    propSchema: {
      label: { type: 'string' },
      defaultChecked: { type: 'boolean' },
    },
  },
  {
    type: 'progress',
    name: 'Progress',
    description: 'Progress bar',
    category: 'feedback',
    icon: '📊',
    defaultProps: {
      value: 60,
      max: 100,
      showLabel: true,
    },
    propSchema: {
      value: { type: 'number', required: true },
      max: { type: 'number' },
      showLabel: { type: 'boolean' },
    },
  },
] as const

export type CapsuleType = typeof CAPSULE_DEFINITIONS[number]['type']

export function getCapsuleDefinition(type: string) {
  return CAPSULE_DEFINITIONS.find(c => c.type === type)
}
