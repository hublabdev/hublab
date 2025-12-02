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
  // Navigation
  {
    type: 'tabs',
    name: 'Tabs',
    description: 'Tab navigation',
    category: 'navigation',
    icon: '📑',
    defaultProps: {
      tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
      activeIndex: 0,
    },
    propSchema: {
      tabs: { type: 'array' },
      activeIndex: { type: 'number' },
    },
  },
  {
    type: 'modal',
    name: 'Modal',
    description: 'Modal dialog',
    category: 'navigation',
    icon: '🪟',
    defaultProps: {
      title: 'Modal Title',
      triggerLabel: 'Open Modal',
    },
    propSchema: {
      title: { type: 'string', required: true },
      triggerLabel: { type: 'string' },
      size: { type: 'select', options: ['sm', 'md', 'lg', 'full'] },
    },
  },
  {
    type: 'bottom-sheet',
    name: 'Bottom Sheet',
    description: 'Sliding bottom panel',
    category: 'navigation',
    icon: '⬆️',
    defaultProps: {
      title: 'Sheet Title',
      snapPoints: ['25%', '50%', '90%'],
    },
    propSchema: {
      title: { type: 'string' },
      snapPoints: { type: 'array' },
    },
  },
  {
    type: 'carousel',
    name: 'Carousel',
    description: 'Image/content carousel',
    category: 'navigation',
    icon: '🎠',
    defaultProps: {
      autoPlay: true,
      showDots: true,
    },
    propSchema: {
      autoPlay: { type: 'boolean' },
      showDots: { type: 'boolean' },
      interval: { type: 'number' },
    },
  },
  // Forms
  {
    type: 'dropdown',
    name: 'Dropdown',
    description: 'Select dropdown',
    category: 'forms',
    icon: '📂',
    defaultProps: {
      placeholder: 'Select option',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    propSchema: {
      placeholder: { type: 'string' },
      options: { type: 'array' },
      label: { type: 'string' },
    },
  },
  {
    type: 'datepicker',
    name: 'Date Picker',
    description: 'Date selection',
    category: 'forms',
    icon: '📅',
    defaultProps: {
      placeholder: 'Select date',
      format: 'yyyy-MM-dd',
    },
    propSchema: {
      placeholder: { type: 'string' },
      format: { type: 'string' },
      minDate: { type: 'string' },
      maxDate: { type: 'string' },
    },
  },
  {
    type: 'slider',
    name: 'Slider',
    description: 'Range slider',
    category: 'forms',
    icon: '🎚️',
    defaultProps: {
      min: 0,
      max: 100,
      value: 50,
      step: 1,
    },
    propSchema: {
      min: { type: 'number' },
      max: { type: 'number' },
      value: { type: 'number' },
      step: { type: 'number' },
      label: { type: 'string' },
    },
  },
  {
    type: 'rating',
    name: 'Rating',
    description: 'Star rating',
    category: 'forms',
    icon: '⭐',
    defaultProps: {
      max: 5,
      value: 3,
      allowHalf: true,
    },
    propSchema: {
      max: { type: 'number' },
      value: { type: 'number' },
      allowHalf: { type: 'boolean' },
      readOnly: { type: 'boolean' },
    },
  },
  // Data Display
  {
    type: 'table',
    name: 'Table',
    description: 'Data table',
    category: 'data',
    icon: '📊',
    defaultProps: {
      columns: ['Name', 'Email', 'Status'],
      rows: [
        ['John Doe', 'john@example.com', 'Active'],
        ['Jane Smith', 'jane@example.com', 'Pending'],
      ],
    },
    propSchema: {
      columns: { type: 'array' },
      rows: { type: 'array' },
      sortable: { type: 'boolean' },
      filterable: { type: 'boolean' },
    },
  },
  {
    type: 'chart',
    name: 'Chart',
    description: 'Data visualization',
    category: 'data',
    icon: '📈',
    defaultProps: {
      type: 'bar',
      data: [10, 25, 15, 30, 20],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    propSchema: {
      type: { type: 'select', options: ['bar', 'line', 'pie', 'doughnut'] },
      data: { type: 'array' },
      labels: { type: 'array' },
      title: { type: 'string' },
    },
  },
  {
    type: 'calendar',
    name: 'Calendar',
    description: 'Calendar view',
    category: 'data',
    icon: '🗓️',
    defaultProps: {
      view: 'month',
      showEvents: true,
    },
    propSchema: {
      view: { type: 'select', options: ['day', 'week', 'month'] },
      showEvents: { type: 'boolean' },
    },
  },
  {
    type: 'timeline',
    name: 'Timeline',
    description: 'Event timeline',
    category: 'data',
    icon: '📜',
    defaultProps: {
      events: [
        { title: 'Event 1', date: '2024-01-01' },
        { title: 'Event 2', date: '2024-02-15' },
      ],
    },
    propSchema: {
      events: { type: 'array' },
      orientation: { type: 'select', options: ['vertical', 'horizontal'] },
    },
  },
  // Media
  {
    type: 'video',
    name: 'Video',
    description: 'Video player',
    category: 'media',
    icon: '🎬',
    defaultProps: {
      src: 'https://example.com/video.mp4',
      autoPlay: false,
      controls: true,
    },
    propSchema: {
      src: { type: 'string', required: true },
      autoPlay: { type: 'boolean' },
      controls: { type: 'boolean' },
      loop: { type: 'boolean' },
    },
  },
  {
    type: 'audio',
    name: 'Audio',
    description: 'Audio player',
    category: 'media',
    icon: '🎵',
    defaultProps: {
      src: 'https://example.com/audio.mp3',
      controls: true,
    },
    propSchema: {
      src: { type: 'string', required: true },
      controls: { type: 'boolean' },
      autoPlay: { type: 'boolean' },
    },
  },
  {
    type: 'map',
    name: 'Map',
    description: 'Interactive map',
    category: 'media',
    icon: '🗺️',
    defaultProps: {
      latitude: 40.7128,
      longitude: -74.0060,
      zoom: 12,
    },
    propSchema: {
      latitude: { type: 'number', required: true },
      longitude: { type: 'number', required: true },
      zoom: { type: 'number' },
      showMarker: { type: 'boolean' },
    },
  },
  // Device/Native
  {
    type: 'camera',
    name: 'Camera',
    description: 'Camera capture',
    category: 'device',
    icon: '📷',
    defaultProps: {
      mode: 'photo',
      facing: 'back',
    },
    propSchema: {
      mode: { type: 'select', options: ['photo', 'video'] },
      facing: { type: 'select', options: ['front', 'back'] },
    },
  },
  {
    type: 'qrcode',
    name: 'QR Code',
    description: 'QR code display/scanner',
    category: 'device',
    icon: '📱',
    defaultProps: {
      value: 'https://hublab.dev',
      size: 200,
    },
    propSchema: {
      value: { type: 'string', required: true },
      size: { type: 'number' },
      mode: { type: 'select', options: ['display', 'scanner'] },
    },
  },
  {
    type: 'biometrics',
    name: 'Biometrics',
    description: 'Face ID / Fingerprint',
    category: 'device',
    icon: '👆',
    defaultProps: {
      type: 'any',
      fallbackLabel: 'Use passcode',
    },
    propSchema: {
      type: { type: 'select', options: ['any', 'face', 'fingerprint'] },
      fallbackLabel: { type: 'string' },
    },
  },
  // Advanced
  {
    type: 'chat',
    name: 'Chat',
    description: 'Chat interface',
    category: 'advanced',
    icon: '💬',
    defaultProps: {
      placeholder: 'Type a message...',
      showAvatar: true,
    },
    propSchema: {
      placeholder: { type: 'string' },
      showAvatar: { type: 'boolean' },
      showTimestamp: { type: 'boolean' },
    },
  },
  {
    type: 'kanban',
    name: 'Kanban',
    description: 'Kanban board',
    category: 'advanced',
    icon: '📋',
    defaultProps: {
      columns: ['To Do', 'In Progress', 'Done'],
      cards: [],
    },
    propSchema: {
      columns: { type: 'array' },
      cards: { type: 'array' },
      allowDrag: { type: 'boolean' },
    },
  },
  {
    type: 'signature',
    name: 'Signature',
    description: 'Signature pad',
    category: 'advanced',
    icon: '✍️',
    defaultProps: {
      strokeColor: '#000000',
      strokeWidth: 2,
    },
    propSchema: {
      strokeColor: { type: 'string' },
      strokeWidth: { type: 'number' },
      backgroundColor: { type: 'string' },
    },
  },
  {
    type: 'rich-text-editor',
    name: 'Rich Text Editor',
    description: 'WYSIWYG editor',
    category: 'advanced',
    icon: '📄',
    defaultProps: {
      placeholder: 'Start writing...',
      toolbar: ['bold', 'italic', 'underline', 'link'],
    },
    propSchema: {
      placeholder: { type: 'string' },
      toolbar: { type: 'array' },
      initialContent: { type: 'string' },
    },
  },
  // Auth
  {
    type: 'auth-screen',
    name: 'Auth Screen',
    description: 'Login/Register screen',
    category: 'auth',
    icon: '🔐',
    defaultProps: {
      mode: 'login',
      providers: ['email', 'google', 'apple'],
    },
    propSchema: {
      mode: { type: 'select', options: ['login', 'register', 'forgot'] },
      providers: { type: 'array' },
      showLogo: { type: 'boolean' },
    },
  },
] as const

export type CapsuleType = typeof CAPSULE_DEFINITIONS[number]['type']

export function getCapsuleDefinition(type: string) {
  return CAPSULE_DEFINITIONS.find(c => c.type === type)
}
