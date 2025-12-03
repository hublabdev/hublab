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
  // ===== NEW CAPSULES =====
  // Forms Extended
  {
    type: 'checkbox',
    name: 'Checkbox',
    description: 'Checkbox input',
    category: 'forms',
    icon: '☑️',
    defaultProps: {
      label: 'I agree to terms',
      checked: false,
    },
    propSchema: {
      label: { type: 'string', required: true },
      checked: { type: 'boolean' },
      disabled: { type: 'boolean' },
    },
  },
  {
    type: 'radio-group',
    name: 'Radio Group',
    description: 'Radio button group',
    category: 'forms',
    icon: '🔘',
    defaultProps: {
      label: 'Choose option',
      options: ['Option A', 'Option B', 'Option C'],
      selected: 'Option A',
    },
    propSchema: {
      label: { type: 'string' },
      options: { type: 'array', required: true },
      selected: { type: 'string' },
      orientation: { type: 'select', options: ['vertical', 'horizontal'] },
    },
  },
  {
    type: 'textarea',
    name: 'Text Area',
    description: 'Multi-line text input',
    category: 'forms',
    icon: '📝',
    defaultProps: {
      placeholder: 'Enter your message...',
      rows: 4,
    },
    propSchema: {
      placeholder: { type: 'string' },
      rows: { type: 'number' },
      maxLength: { type: 'number' },
      label: { type: 'string' },
    },
  },
  {
    type: 'file-upload',
    name: 'File Upload',
    description: 'File upload dropzone',
    category: 'forms',
    icon: '📤',
    defaultProps: {
      accept: 'image/*',
      multiple: false,
      maxSize: 5,
    },
    propSchema: {
      accept: { type: 'string' },
      multiple: { type: 'boolean' },
      maxSize: { type: 'number' },
      label: { type: 'string' },
    },
  },
  {
    type: 'color-picker',
    name: 'Color Picker',
    description: 'Color selection input',
    category: 'forms',
    icon: '🎨',
    defaultProps: {
      value: '#3B82F6',
      showAlpha: true,
    },
    propSchema: {
      value: { type: 'string' },
      showAlpha: { type: 'boolean' },
      presets: { type: 'array' },
      label: { type: 'string' },
    },
  },
  {
    type: 'otp-input',
    name: 'OTP Input',
    description: 'One-time password input',
    category: 'forms',
    icon: '🔢',
    defaultProps: {
      length: 6,
      type: 'number',
    },
    propSchema: {
      length: { type: 'number' },
      type: { type: 'select', options: ['number', 'alphanumeric'] },
      masked: { type: 'boolean' },
    },
  },
  {
    type: 'search-input',
    name: 'Search Input',
    description: 'Search field with icon',
    category: 'forms',
    icon: '🔍',
    defaultProps: {
      placeholder: 'Search...',
      showClear: true,
    },
    propSchema: {
      placeholder: { type: 'string' },
      showClear: { type: 'boolean' },
      showFilter: { type: 'boolean' },
    },
  },
  {
    type: 'time-picker',
    name: 'Time Picker',
    description: 'Time selection input',
    category: 'forms',
    icon: '🕐',
    defaultProps: {
      format: '12h',
      placeholder: 'Select time',
    },
    propSchema: {
      format: { type: 'select', options: ['12h', '24h'] },
      placeholder: { type: 'string' },
      minuteStep: { type: 'number' },
    },
  },
  // Layout Extended
  {
    type: 'accordion',
    name: 'Accordion',
    description: 'Collapsible sections',
    category: 'layout',
    icon: '📂',
    defaultProps: {
      items: [
        { title: 'Section 1', content: 'Content for section 1' },
        { title: 'Section 2', content: 'Content for section 2' },
      ],
      allowMultiple: false,
    },
    propSchema: {
      items: { type: 'array', required: true },
      allowMultiple: { type: 'boolean' },
      defaultOpen: { type: 'number' },
    },
  },
  {
    type: 'grid',
    name: 'Grid',
    description: 'Responsive grid layout',
    category: 'layout',
    icon: '⊞',
    defaultProps: {
      columns: 3,
      gap: 'md',
    },
    propSchema: {
      columns: { type: 'number' },
      gap: { type: 'select', options: ['none', 'sm', 'md', 'lg'] },
      responsive: { type: 'boolean' },
    },
  },
  {
    type: 'stack',
    name: 'Stack',
    description: 'Vertical/horizontal stack',
    category: 'layout',
    icon: '📚',
    defaultProps: {
      direction: 'vertical',
      gap: 'md',
      align: 'stretch',
    },
    propSchema: {
      direction: { type: 'select', options: ['vertical', 'horizontal'] },
      gap: { type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
      align: { type: 'select', options: ['start', 'center', 'end', 'stretch'] },
    },
  },
  {
    type: 'container',
    name: 'Container',
    description: 'Centered container',
    category: 'layout',
    icon: '📦',
    defaultProps: {
      maxWidth: 'lg',
      padding: 'md',
    },
    propSchema: {
      maxWidth: { type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
      padding: { type: 'select', options: ['none', 'sm', 'md', 'lg'] },
      centered: { type: 'boolean' },
    },
  },
  {
    type: 'scroll-view',
    name: 'Scroll View',
    description: 'Scrollable container',
    category: 'layout',
    icon: '📜',
    defaultProps: {
      direction: 'vertical',
      showScrollbar: true,
    },
    propSchema: {
      direction: { type: 'select', options: ['vertical', 'horizontal', 'both'] },
      showScrollbar: { type: 'boolean' },
      height: { type: 'number' },
    },
  },
  // Navigation Extended
  {
    type: 'breadcrumb',
    name: 'Breadcrumb',
    description: 'Navigation breadcrumbs',
    category: 'navigation',
    icon: '🔗',
    defaultProps: {
      items: ['Home', 'Products', 'Electronics'],
      separator: '/',
    },
    propSchema: {
      items: { type: 'array', required: true },
      separator: { type: 'string' },
    },
  },
  {
    type: 'pagination',
    name: 'Pagination',
    description: 'Page navigation',
    category: 'navigation',
    icon: '📄',
    defaultProps: {
      total: 100,
      pageSize: 10,
      current: 1,
    },
    propSchema: {
      total: { type: 'number', required: true },
      pageSize: { type: 'number' },
      current: { type: 'number' },
      showSizeChanger: { type: 'boolean' },
    },
  },
  {
    type: 'stepper',
    name: 'Stepper',
    description: 'Step-by-step wizard',
    category: 'navigation',
    icon: '🚶',
    defaultProps: {
      steps: ['Cart', 'Shipping', 'Payment', 'Confirm'],
      current: 0,
    },
    propSchema: {
      steps: { type: 'array', required: true },
      current: { type: 'number' },
      orientation: { type: 'select', options: ['horizontal', 'vertical'] },
    },
  },
  {
    type: 'sidebar',
    name: 'Sidebar',
    description: 'Side navigation menu',
    category: 'navigation',
    icon: '📑',
    defaultProps: {
      items: ['Dashboard', 'Analytics', 'Settings'],
      collapsed: false,
    },
    propSchema: {
      items: { type: 'array', required: true },
      collapsed: { type: 'boolean' },
      position: { type: 'select', options: ['left', 'right'] },
    },
  },
  {
    type: 'navbar',
    name: 'Navbar',
    description: 'Top navigation bar',
    category: 'navigation',
    icon: '🧭',
    defaultProps: {
      title: 'App Name',
      items: ['Home', 'About', 'Contact'],
      showLogo: true,
    },
    propSchema: {
      title: { type: 'string' },
      items: { type: 'array' },
      showLogo: { type: 'boolean' },
      sticky: { type: 'boolean' },
    },
  },
  {
    type: 'bottom-nav',
    name: 'Bottom Navigation',
    description: 'Mobile bottom tab bar',
    category: 'navigation',
    icon: '📱',
    defaultProps: {
      items: [
        { icon: 'home', label: 'Home' },
        { icon: 'search', label: 'Search' },
        { icon: 'profile', label: 'Profile' },
      ],
      activeIndex: 0,
    },
    propSchema: {
      items: { type: 'array', required: true },
      activeIndex: { type: 'number' },
      showLabels: { type: 'boolean' },
    },
  },
  // Feedback
  {
    type: 'alert',
    name: 'Alert',
    description: 'Alert message box',
    category: 'feedback',
    icon: '⚠️',
    defaultProps: {
      title: 'Alert Title',
      message: 'This is an important message.',
      variant: 'info',
    },
    propSchema: {
      title: { type: 'string' },
      message: { type: 'string', required: true },
      variant: { type: 'select', options: ['info', 'success', 'warning', 'error'] },
      closable: { type: 'boolean' },
    },
  },
  {
    type: 'toast',
    name: 'Toast',
    description: 'Toast notification',
    category: 'feedback',
    icon: '🔔',
    defaultProps: {
      message: 'Action completed successfully',
      variant: 'success',
      duration: 3000,
    },
    propSchema: {
      message: { type: 'string', required: true },
      variant: { type: 'select', options: ['info', 'success', 'warning', 'error'] },
      duration: { type: 'number' },
      position: { type: 'select', options: ['top', 'bottom', 'top-right', 'bottom-right'] },
    },
  },
  {
    type: 'skeleton',
    name: 'Skeleton',
    description: 'Loading skeleton placeholder',
    category: 'feedback',
    icon: '💀',
    defaultProps: {
      variant: 'text',
      lines: 3,
    },
    propSchema: {
      variant: { type: 'select', options: ['text', 'circle', 'rect', 'card'] },
      lines: { type: 'number' },
      animated: { type: 'boolean' },
    },
  },
  {
    type: 'spinner',
    name: 'Spinner',
    description: 'Loading spinner',
    category: 'feedback',
    icon: '🔄',
    defaultProps: {
      size: 'md',
      color: 'primary',
    },
    propSchema: {
      size: { type: 'select', options: ['sm', 'md', 'lg'] },
      color: { type: 'string' },
      label: { type: 'string' },
    },
  },
  {
    type: 'empty-state',
    name: 'Empty State',
    description: 'Empty content placeholder',
    category: 'feedback',
    icon: '📭',
    defaultProps: {
      icon: 'inbox',
      title: 'No data',
      description: 'There is no data to display',
    },
    propSchema: {
      icon: { type: 'string' },
      title: { type: 'string', required: true },
      description: { type: 'string' },
      actionLabel: { type: 'string' },
    },
  },
  // E-commerce
  {
    type: 'product-card',
    name: 'Product Card',
    description: 'E-commerce product card',
    category: 'ecommerce',
    icon: '🛍️',
    defaultProps: {
      name: 'Product Name',
      price: 29.99,
      image: 'https://picsum.photos/300/300',
      rating: 4.5,
    },
    propSchema: {
      name: { type: 'string', required: true },
      price: { type: 'number', required: true },
      originalPrice: { type: 'number' },
      image: { type: 'string' },
      rating: { type: 'number' },
      badge: { type: 'string' },
    },
  },
  {
    type: 'cart-item',
    name: 'Cart Item',
    description: 'Shopping cart item row',
    category: 'ecommerce',
    icon: '🛒',
    defaultProps: {
      name: 'Product Name',
      price: 29.99,
      quantity: 1,
      image: 'https://picsum.photos/100/100',
    },
    propSchema: {
      name: { type: 'string', required: true },
      price: { type: 'number', required: true },
      quantity: { type: 'number' },
      image: { type: 'string' },
      editable: { type: 'boolean' },
    },
  },
  {
    type: 'price-tag',
    name: 'Price Tag',
    description: 'Price display with discount',
    category: 'ecommerce',
    icon: '💰',
    defaultProps: {
      price: 49.99,
      currency: 'USD',
    },
    propSchema: {
      price: { type: 'number', required: true },
      originalPrice: { type: 'number' },
      currency: { type: 'string' },
      size: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
  },
  {
    type: 'quantity-selector',
    name: 'Quantity Selector',
    description: 'Increment/decrement counter',
    category: 'ecommerce',
    icon: '🔢',
    defaultProps: {
      value: 1,
      min: 1,
      max: 99,
    },
    propSchema: {
      value: { type: 'number' },
      min: { type: 'number' },
      max: { type: 'number' },
      size: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
  },
  {
    type: 'order-summary',
    name: 'Order Summary',
    description: 'Checkout order summary',
    category: 'ecommerce',
    icon: '📋',
    defaultProps: {
      subtotal: 99.99,
      shipping: 5.99,
      tax: 8.50,
    },
    propSchema: {
      subtotal: { type: 'number', required: true },
      shipping: { type: 'number' },
      tax: { type: 'number' },
      discount: { type: 'number' },
      currency: { type: 'string' },
    },
  },
  // Social
  {
    type: 'comment',
    name: 'Comment',
    description: 'Social comment component',
    category: 'social',
    icon: '💬',
    defaultProps: {
      author: 'John Doe',
      content: 'This is a great post!',
      timestamp: '2 hours ago',
    },
    propSchema: {
      author: { type: 'string', required: true },
      content: { type: 'string', required: true },
      avatar: { type: 'string' },
      timestamp: { type: 'string' },
      likes: { type: 'number' },
    },
  },
  {
    type: 'like-button',
    name: 'Like Button',
    description: 'Like/heart button',
    category: 'social',
    icon: '❤️',
    defaultProps: {
      count: 42,
      liked: false,
    },
    propSchema: {
      count: { type: 'number' },
      liked: { type: 'boolean' },
      icon: { type: 'select', options: ['heart', 'thumbs-up', 'star'] },
    },
  },
  {
    type: 'share-buttons',
    name: 'Share Buttons',
    description: 'Social share buttons',
    category: 'social',
    icon: '📤',
    defaultProps: {
      platforms: ['twitter', 'facebook', 'linkedin', 'copy'],
      url: 'https://example.com',
    },
    propSchema: {
      platforms: { type: 'array' },
      url: { type: 'string' },
      title: { type: 'string' },
    },
  },
  {
    type: 'user-card',
    name: 'User Card',
    description: 'User profile card',
    category: 'social',
    icon: '👤',
    defaultProps: {
      name: 'John Doe',
      subtitle: 'Software Engineer',
      avatar: '',
    },
    propSchema: {
      name: { type: 'string', required: true },
      subtitle: { type: 'string' },
      avatar: { type: 'string' },
      verified: { type: 'boolean' },
      followButton: { type: 'boolean' },
    },
  },
  {
    type: 'post-card',
    name: 'Post Card',
    description: 'Social media post',
    category: 'social',
    icon: '📰',
    defaultProps: {
      author: 'Jane Smith',
      content: 'Just launched my new project!',
      timestamp: '5 min ago',
    },
    propSchema: {
      author: { type: 'string', required: true },
      content: { type: 'string', required: true },
      image: { type: 'string' },
      timestamp: { type: 'string' },
      likes: { type: 'number' },
      comments: { type: 'number' },
    },
  },
  // Stats & Metrics
  {
    type: 'stat-card',
    name: 'Stat Card',
    description: 'Statistics display card',
    category: 'data',
    icon: '📊',
    defaultProps: {
      label: 'Total Users',
      value: '12,345',
      change: '+12%',
      trend: 'up',
    },
    propSchema: {
      label: { type: 'string', required: true },
      value: { type: 'string', required: true },
      change: { type: 'string' },
      trend: { type: 'select', options: ['up', 'down', 'neutral'] },
      icon: { type: 'string' },
    },
  },
  {
    type: 'metric',
    name: 'Metric',
    description: 'Single metric display',
    category: 'data',
    icon: '📈',
    defaultProps: {
      value: '99.9%',
      label: 'Uptime',
    },
    propSchema: {
      value: { type: 'string', required: true },
      label: { type: 'string', required: true },
      prefix: { type: 'string' },
      suffix: { type: 'string' },
    },
  },
  {
    type: 'countdown',
    name: 'Countdown',
    description: 'Countdown timer',
    category: 'data',
    icon: '⏰',
    defaultProps: {
      targetDate: '2025-12-31T23:59:59',
      showDays: true,
    },
    propSchema: {
      targetDate: { type: 'string', required: true },
      showDays: { type: 'boolean' },
      showSeconds: { type: 'boolean' },
      onComplete: { type: 'string' },
    },
  },
  // Device Extended
  {
    type: 'haptic-feedback',
    name: 'Haptic Feedback',
    description: 'Trigger haptic vibration',
    category: 'device',
    icon: '📳',
    defaultProps: {
      type: 'impact',
      intensity: 'medium',
    },
    propSchema: {
      type: { type: 'select', options: ['impact', 'notification', 'selection'] },
      intensity: { type: 'select', options: ['light', 'medium', 'heavy'] },
    },
  },
  {
    type: 'location',
    name: 'Location',
    description: 'Get current location',
    category: 'device',
    icon: '📍',
    defaultProps: {
      accuracy: 'high',
      showAddress: true,
    },
    propSchema: {
      accuracy: { type: 'select', options: ['low', 'medium', 'high'] },
      showAddress: { type: 'boolean' },
      watchPosition: { type: 'boolean' },
    },
  },
  {
    type: 'push-notification',
    name: 'Push Notification',
    description: 'Local push notification',
    category: 'device',
    icon: '🔔',
    defaultProps: {
      title: 'Notification Title',
      body: 'Notification body text',
    },
    propSchema: {
      title: { type: 'string', required: true },
      body: { type: 'string', required: true },
      icon: { type: 'string' },
      sound: { type: 'boolean' },
    },
  },
  {
    type: 'share-sheet',
    name: 'Share Sheet',
    description: 'Native share dialog',
    category: 'device',
    icon: '📤',
    defaultProps: {
      title: 'Share',
      text: 'Check this out!',
    },
    propSchema: {
      title: { type: 'string' },
      text: { type: 'string' },
      url: { type: 'string' },
      files: { type: 'array' },
    },
  },
  // UI Extended
  {
    type: 'tooltip',
    name: 'Tooltip',
    description: 'Hover/tap tooltip',
    category: 'ui',
    icon: '💭',
    defaultProps: {
      content: 'Helpful tip here',
      position: 'top',
    },
    propSchema: {
      content: { type: 'string', required: true },
      position: { type: 'select', options: ['top', 'bottom', 'left', 'right'] },
      trigger: { type: 'select', options: ['hover', 'click'] },
    },
  },
  {
    type: 'popover',
    name: 'Popover',
    description: 'Floating popover panel',
    category: 'ui',
    icon: '💬',
    defaultProps: {
      triggerLabel: 'Open popover',
      content: 'Popover content here',
    },
    propSchema: {
      triggerLabel: { type: 'string' },
      content: { type: 'string' },
      position: { type: 'select', options: ['top', 'bottom', 'left', 'right'] },
    },
  },
  {
    type: 'chip',
    name: 'Chip',
    description: 'Compact tag/chip element',
    category: 'ui',
    icon: '🏷️',
    defaultProps: {
      label: 'Chip',
      variant: 'default',
      removable: false,
    },
    propSchema: {
      label: { type: 'string', required: true },
      variant: { type: 'select', options: ['default', 'primary', 'success', 'warning', 'error'] },
      removable: { type: 'boolean' },
      icon: { type: 'string' },
    },
  },
  {
    type: 'icon',
    name: 'Icon',
    description: 'SVG icon display',
    category: 'ui',
    icon: '🎯',
    defaultProps: {
      name: 'star',
      size: 24,
      color: 'currentColor',
    },
    propSchema: {
      name: { type: 'string', required: true },
      size: { type: 'number' },
      color: { type: 'string' },
    },
  },
  {
    type: 'pill',
    name: 'Pill',
    description: 'Rounded pill indicator',
    category: 'ui',
    icon: '💊',
    defaultProps: {
      label: 'New',
      color: 'primary',
    },
    propSchema: {
      label: { type: 'string', required: true },
      color: { type: 'string' },
      pulse: { type: 'boolean' },
    },
  },
  // Advanced Extended
  {
    type: 'code-block',
    name: 'Code Block',
    description: 'Syntax highlighted code',
    category: 'advanced',
    icon: '💻',
    defaultProps: {
      code: 'console.log("Hello World")',
      language: 'javascript',
      showLineNumbers: true,
    },
    propSchema: {
      code: { type: 'string', required: true },
      language: { type: 'select', options: ['javascript', 'typescript', 'python', 'swift', 'kotlin', 'html', 'css'] },
      showLineNumbers: { type: 'boolean' },
      copyable: { type: 'boolean' },
    },
  },
  {
    type: 'markdown',
    name: 'Markdown',
    description: 'Markdown renderer',
    category: 'advanced',
    icon: '📝',
    defaultProps: {
      content: '# Hello World\n\nThis is **markdown** content.',
    },
    propSchema: {
      content: { type: 'string', required: true },
      allowHtml: { type: 'boolean' },
    },
  },
  {
    type: 'pdf-viewer',
    name: 'PDF Viewer',
    description: 'PDF document viewer',
    category: 'advanced',
    icon: '📄',
    defaultProps: {
      src: '',
      showToolbar: true,
    },
    propSchema: {
      src: { type: 'string', required: true },
      showToolbar: { type: 'boolean' },
      initialPage: { type: 'number' },
    },
  },
  {
    type: 'web-view',
    name: 'Web View',
    description: 'Embedded web content',
    category: 'advanced',
    icon: '🌐',
    defaultProps: {
      url: 'https://example.com',
      allowNavigation: true,
    },
    propSchema: {
      url: { type: 'string', required: true },
      allowNavigation: { type: 'boolean' },
      showLoadingBar: { type: 'boolean' },
    },
  },
  {
    type: 'barcode',
    name: 'Barcode',
    description: 'Barcode display/scanner',
    category: 'advanced',
    icon: '📊',
    defaultProps: {
      value: '123456789012',
      format: 'CODE128',
    },
    propSchema: {
      value: { type: 'string', required: true },
      format: { type: 'select', options: ['CODE128', 'EAN13', 'UPC', 'CODE39'] },
      mode: { type: 'select', options: ['display', 'scanner'] },
    },
  },
  {
    type: 'lottie',
    name: 'Lottie Animation',
    description: 'Lottie JSON animation',
    category: 'advanced',
    icon: '🎬',
    defaultProps: {
      src: '',
      autoPlay: true,
      loop: true,
    },
    propSchema: {
      src: { type: 'string', required: true },
      autoPlay: { type: 'boolean' },
      loop: { type: 'boolean' },
      speed: { type: 'number' },
    },
  },
  {
    type: 'confetti',
    name: 'Confetti',
    description: 'Celebration confetti effect',
    category: 'advanced',
    icon: '🎉',
    defaultProps: {
      trigger: 'auto',
      particleCount: 100,
    },
    propSchema: {
      trigger: { type: 'select', options: ['auto', 'manual'] },
      particleCount: { type: 'number' },
      spread: { type: 'number' },
      colors: { type: 'array' },
    },
  },
  // ===== MORE CAPSULES - BATCH 2 =====
  // Gaming & Entertainment
  {
    type: 'game-leaderboard',
    name: 'Leaderboard',
    description: 'Game leaderboard with rankings',
    category: 'gaming',
    icon: '🏆',
    defaultProps: {
      title: 'Top Players',
      entries: [
        { rank: 1, name: 'Player1', score: 10000 },
        { rank: 2, name: 'Player2', score: 8500 },
        { rank: 3, name: 'Player3', score: 7200 },
      ],
    },
    propSchema: {
      title: { type: 'string' },
      entries: { type: 'array', required: true },
      showAvatar: { type: 'boolean' },
      highlightTop: { type: 'number' },
    },
  },
  {
    type: 'achievement-badge',
    name: 'Achievement',
    description: 'Unlockable achievement badge',
    category: 'gaming',
    icon: '🎖️',
    defaultProps: {
      title: 'First Win',
      description: 'Win your first game',
      icon: 'trophy',
      unlocked: false,
    },
    propSchema: {
      title: { type: 'string', required: true },
      description: { type: 'string' },
      icon: { type: 'string' },
      unlocked: { type: 'boolean' },
      progress: { type: 'number' },
    },
  },
  {
    type: 'xp-bar',
    name: 'XP Bar',
    description: 'Experience points progress bar',
    category: 'gaming',
    icon: '⭐',
    defaultProps: {
      currentXP: 750,
      maxXP: 1000,
      level: 5,
    },
    propSchema: {
      currentXP: { type: 'number', required: true },
      maxXP: { type: 'number', required: true },
      level: { type: 'number' },
      showLabel: { type: 'boolean' },
    },
  },
  {
    type: 'health-bar',
    name: 'Health Bar',
    description: 'Game health/mana bar',
    category: 'gaming',
    icon: '❤️',
    defaultProps: {
      current: 80,
      max: 100,
      variant: 'health',
    },
    propSchema: {
      current: { type: 'number', required: true },
      max: { type: 'number', required: true },
      variant: { type: 'select', options: ['health', 'mana', 'stamina', 'shield'] },
      showNumber: { type: 'boolean' },
    },
  },
  {
    type: 'inventory-slot',
    name: 'Inventory Slot',
    description: 'Game inventory item slot',
    category: 'gaming',
    icon: '🎒',
    defaultProps: {
      item: null,
      size: 'md',
      showQuantity: true,
    },
    propSchema: {
      item: { type: 'string' },
      quantity: { type: 'number' },
      size: { type: 'select', options: ['sm', 'md', 'lg'] },
      showQuantity: { type: 'boolean' },
      rarity: { type: 'select', options: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
    },
  },
  // Music & Audio
  {
    type: 'music-player',
    name: 'Music Player',
    description: 'Full music player with controls',
    category: 'media',
    icon: '🎵',
    defaultProps: {
      title: 'Song Title',
      artist: 'Artist Name',
      coverArt: '',
      showProgress: true,
    },
    propSchema: {
      title: { type: 'string', required: true },
      artist: { type: 'string' },
      coverArt: { type: 'string' },
      showProgress: { type: 'boolean' },
      showQueue: { type: 'boolean' },
    },
  },
  {
    type: 'waveform',
    name: 'Audio Waveform',
    description: 'Audio waveform visualization',
    category: 'media',
    icon: '📊',
    defaultProps: {
      src: '',
      color: 'primary',
      height: 60,
    },
    propSchema: {
      src: { type: 'string', required: true },
      color: { type: 'string' },
      height: { type: 'number' },
      interactive: { type: 'boolean' },
    },
  },
  {
    type: 'equalizer',
    name: 'Equalizer',
    description: 'Audio equalizer bars',
    category: 'media',
    icon: '🎚️',
    defaultProps: {
      bars: 5,
      animated: true,
    },
    propSchema: {
      bars: { type: 'number' },
      animated: { type: 'boolean' },
      color: { type: 'string' },
    },
  },
  {
    type: 'podcast-player',
    name: 'Podcast Player',
    description: 'Podcast episode player',
    category: 'media',
    icon: '🎙️',
    defaultProps: {
      title: 'Episode Title',
      show: 'Podcast Name',
      duration: '45:00',
    },
    propSchema: {
      title: { type: 'string', required: true },
      show: { type: 'string' },
      duration: { type: 'string' },
      coverArt: { type: 'string' },
      playbackSpeed: { type: 'number' },
    },
  },
  // Weather & Environment
  {
    type: 'weather-card',
    name: 'Weather Card',
    description: 'Current weather display',
    category: 'data',
    icon: '🌤️',
    defaultProps: {
      temperature: 72,
      condition: 'sunny',
      location: 'San Francisco',
      unit: 'fahrenheit',
    },
    propSchema: {
      temperature: { type: 'number', required: true },
      condition: { type: 'select', options: ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'foggy'] },
      location: { type: 'string' },
      unit: { type: 'select', options: ['celsius', 'fahrenheit'] },
    },
  },
  {
    type: 'weather-forecast',
    name: 'Weather Forecast',
    description: '5-day weather forecast',
    category: 'data',
    icon: '📅',
    defaultProps: {
      days: 5,
      unit: 'fahrenheit',
    },
    propSchema: {
      days: { type: 'number' },
      unit: { type: 'select', options: ['celsius', 'fahrenheit'] },
      showHourly: { type: 'boolean' },
    },
  },
  {
    type: 'air-quality',
    name: 'Air Quality',
    description: 'Air quality index display',
    category: 'data',
    icon: '💨',
    defaultProps: {
      aqi: 42,
      level: 'good',
    },
    propSchema: {
      aqi: { type: 'number', required: true },
      level: { type: 'select', options: ['good', 'moderate', 'unhealthy-sensitive', 'unhealthy', 'very-unhealthy', 'hazardous'] },
      showRecommendations: { type: 'boolean' },
    },
  },
  // Fitness & Health
  {
    type: 'step-counter',
    name: 'Step Counter',
    description: 'Daily steps tracker',
    category: 'fitness',
    icon: '👟',
    defaultProps: {
      steps: 7500,
      goal: 10000,
      showCalories: true,
    },
    propSchema: {
      steps: { type: 'number', required: true },
      goal: { type: 'number' },
      showCalories: { type: 'boolean' },
      showDistance: { type: 'boolean' },
    },
  },
  {
    type: 'heart-rate',
    name: 'Heart Rate',
    description: 'Heart rate monitor display',
    category: 'fitness',
    icon: '💓',
    defaultProps: {
      bpm: 72,
      zone: 'resting',
      animated: true,
    },
    propSchema: {
      bpm: { type: 'number', required: true },
      zone: { type: 'select', options: ['resting', 'fat-burn', 'cardio', 'peak'] },
      animated: { type: 'boolean' },
      showHistory: { type: 'boolean' },
    },
  },
  {
    type: 'activity-ring',
    name: 'Activity Ring',
    description: 'Apple-style activity rings',
    category: 'fitness',
    icon: '⭕',
    defaultProps: {
      move: 75,
      exercise: 50,
      stand: 100,
    },
    propSchema: {
      move: { type: 'number', required: true },
      exercise: { type: 'number', required: true },
      stand: { type: 'number', required: true },
      showLabels: { type: 'boolean' },
    },
  },
  {
    type: 'workout-card',
    name: 'Workout Card',
    description: 'Workout summary card',
    category: 'fitness',
    icon: '🏋️',
    defaultProps: {
      name: 'Morning Run',
      duration: '32:15',
      calories: 320,
      type: 'running',
    },
    propSchema: {
      name: { type: 'string', required: true },
      duration: { type: 'string' },
      calories: { type: 'number' },
      type: { type: 'select', options: ['running', 'cycling', 'swimming', 'weights', 'yoga', 'hiit'] },
      distance: { type: 'number' },
    },
  },
  {
    type: 'calorie-tracker',
    name: 'Calorie Tracker',
    description: 'Daily calorie intake tracker',
    category: 'fitness',
    icon: '🍎',
    defaultProps: {
      consumed: 1450,
      goal: 2000,
      remaining: 550,
    },
    propSchema: {
      consumed: { type: 'number', required: true },
      goal: { type: 'number', required: true },
      showMacros: { type: 'boolean' },
    },
  },
  {
    type: 'sleep-tracker',
    name: 'Sleep Tracker',
    description: 'Sleep quality display',
    category: 'fitness',
    icon: '😴',
    defaultProps: {
      hours: 7.5,
      quality: 85,
      stages: { deep: 25, rem: 20, light: 45, awake: 10 },
    },
    propSchema: {
      hours: { type: 'number', required: true },
      quality: { type: 'number' },
      showStages: { type: 'boolean' },
    },
  },
  // Finance & Crypto
  {
    type: 'crypto-card',
    name: 'Crypto Card',
    description: 'Cryptocurrency price card',
    category: 'finance',
    icon: '₿',
    defaultProps: {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.00,
      change: 2.5,
    },
    propSchema: {
      symbol: { type: 'string', required: true },
      name: { type: 'string' },
      price: { type: 'number', required: true },
      change: { type: 'number' },
      showChart: { type: 'boolean' },
    },
  },
  {
    type: 'stock-ticker',
    name: 'Stock Ticker',
    description: 'Stock price ticker',
    category: 'finance',
    icon: '📈',
    defaultProps: {
      symbol: 'AAPL',
      price: 178.50,
      change: 1.25,
      changePercent: 0.71,
    },
    propSchema: {
      symbol: { type: 'string', required: true },
      price: { type: 'number', required: true },
      change: { type: 'number' },
      changePercent: { type: 'number' },
      showMiniChart: { type: 'boolean' },
    },
  },
  {
    type: 'portfolio-summary',
    name: 'Portfolio Summary',
    description: 'Investment portfolio overview',
    category: 'finance',
    icon: '💼',
    defaultProps: {
      totalValue: 25000,
      dayChange: 450,
      dayChangePercent: 1.8,
    },
    propSchema: {
      totalValue: { type: 'number', required: true },
      dayChange: { type: 'number' },
      dayChangePercent: { type: 'number' },
      showAllocation: { type: 'boolean' },
    },
  },
  {
    type: 'transaction-row',
    name: 'Transaction',
    description: 'Bank transaction row',
    category: 'finance',
    icon: '💳',
    defaultProps: {
      merchant: 'Amazon',
      amount: -45.99,
      date: '2025-01-15',
      category: 'shopping',
    },
    propSchema: {
      merchant: { type: 'string', required: true },
      amount: { type: 'number', required: true },
      date: { type: 'string' },
      category: { type: 'string' },
      icon: { type: 'string' },
    },
  },
  {
    type: 'credit-card',
    name: 'Credit Card',
    description: 'Visual credit card display',
    category: 'finance',
    icon: '💳',
    defaultProps: {
      last4: '4242',
      brand: 'visa',
      expiry: '12/28',
      holderName: 'John Doe',
    },
    propSchema: {
      last4: { type: 'string', required: true },
      brand: { type: 'select', options: ['visa', 'mastercard', 'amex', 'discover'] },
      expiry: { type: 'string' },
      holderName: { type: 'string' },
      gradient: { type: 'string' },
    },
  },
  // Travel & Transportation
  {
    type: 'flight-card',
    name: 'Flight Card',
    description: 'Flight booking card',
    category: 'travel',
    icon: '✈️',
    defaultProps: {
      departure: 'SFO',
      arrival: 'JFK',
      departureTime: '08:30',
      arrivalTime: '17:15',
      airline: 'United',
    },
    propSchema: {
      departure: { type: 'string', required: true },
      arrival: { type: 'string', required: true },
      departureTime: { type: 'string' },
      arrivalTime: { type: 'string' },
      airline: { type: 'string' },
      flightNumber: { type: 'string' },
    },
  },
  {
    type: 'boarding-pass',
    name: 'Boarding Pass',
    description: 'Mobile boarding pass',
    category: 'travel',
    icon: '🎫',
    defaultProps: {
      passenger: 'John Doe',
      flight: 'UA 123',
      seat: '12A',
      gate: 'B42',
    },
    propSchema: {
      passenger: { type: 'string', required: true },
      flight: { type: 'string', required: true },
      seat: { type: 'string' },
      gate: { type: 'string' },
      boardingTime: { type: 'string' },
      showQR: { type: 'boolean' },
    },
  },
  {
    type: 'ride-tracker',
    name: 'Ride Tracker',
    description: 'Uber/Lyft style ride tracker',
    category: 'travel',
    icon: '🚗',
    defaultProps: {
      driverName: 'John',
      carModel: 'Toyota Camry',
      eta: 5,
      plateNumber: 'ABC 123',
    },
    propSchema: {
      driverName: { type: 'string', required: true },
      carModel: { type: 'string' },
      eta: { type: 'number' },
      plateNumber: { type: 'string' },
      rating: { type: 'number' },
      showMap: { type: 'boolean' },
    },
  },
  {
    type: 'hotel-card',
    name: 'Hotel Card',
    description: 'Hotel booking card',
    category: 'travel',
    icon: '🏨',
    defaultProps: {
      name: 'Grand Hotel',
      rating: 4.5,
      price: 199,
      checkIn: '2025-02-01',
      checkOut: '2025-02-05',
    },
    propSchema: {
      name: { type: 'string', required: true },
      rating: { type: 'number' },
      price: { type: 'number' },
      image: { type: 'string' },
      checkIn: { type: 'string' },
      checkOut: { type: 'string' },
    },
  },
  // Communication
  {
    type: 'message-bubble',
    name: 'Message Bubble',
    description: 'Chat message bubble',
    category: 'communication',
    icon: '💬',
    defaultProps: {
      content: 'Hello there!',
      sender: 'other',
      timestamp: '10:30 AM',
    },
    propSchema: {
      content: { type: 'string', required: true },
      sender: { type: 'select', options: ['self', 'other'] },
      timestamp: { type: 'string' },
      status: { type: 'select', options: ['sent', 'delivered', 'read'] },
      showAvatar: { type: 'boolean' },
    },
  },
  {
    type: 'typing-indicator',
    name: 'Typing Indicator',
    description: 'Chat typing indicator',
    category: 'communication',
    icon: '⌨️',
    defaultProps: {
      userName: 'John',
    },
    propSchema: {
      userName: { type: 'string' },
      showName: { type: 'boolean' },
    },
  },
  {
    type: 'voice-message',
    name: 'Voice Message',
    description: 'Voice message player',
    category: 'communication',
    icon: '🎤',
    defaultProps: {
      duration: '0:15',
      played: false,
    },
    propSchema: {
      duration: { type: 'string', required: true },
      played: { type: 'boolean' },
      sender: { type: 'select', options: ['self', 'other'] },
    },
  },
  {
    type: 'contact-card',
    name: 'Contact Card',
    description: 'Contact information card',
    category: 'communication',
    icon: '👤',
    defaultProps: {
      name: 'Jane Doe',
      phone: '+1 234 567 8900',
      email: 'jane@example.com',
    },
    propSchema: {
      name: { type: 'string', required: true },
      phone: { type: 'string' },
      email: { type: 'string' },
      avatar: { type: 'string' },
      showActions: { type: 'boolean' },
    },
  },
  {
    type: 'call-screen',
    name: 'Call Screen',
    description: 'Phone call interface',
    category: 'communication',
    icon: '📞',
    defaultProps: {
      callerName: 'John Doe',
      callType: 'incoming',
      duration: '00:00',
    },
    propSchema: {
      callerName: { type: 'string', required: true },
      callType: { type: 'select', options: ['incoming', 'outgoing', 'active'] },
      duration: { type: 'string' },
      avatar: { type: 'string' },
      isVideo: { type: 'boolean' },
    },
  },
  // Education
  {
    type: 'quiz-question',
    name: 'Quiz Question',
    description: 'Multiple choice quiz question',
    category: 'education',
    icon: '❓',
    defaultProps: {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctIndex: 1,
    },
    propSchema: {
      question: { type: 'string', required: true },
      options: { type: 'array', required: true },
      correctIndex: { type: 'number' },
      showExplanation: { type: 'boolean' },
    },
  },
  {
    type: 'flashcard',
    name: 'Flashcard',
    description: 'Study flashcard with flip',
    category: 'education',
    icon: '📚',
    defaultProps: {
      front: 'Question',
      back: 'Answer',
      category: 'General',
    },
    propSchema: {
      front: { type: 'string', required: true },
      back: { type: 'string', required: true },
      category: { type: 'string' },
      difficulty: { type: 'select', options: ['easy', 'medium', 'hard'] },
    },
  },
  {
    type: 'course-card',
    name: 'Course Card',
    description: 'Online course card',
    category: 'education',
    icon: '🎓',
    defaultProps: {
      title: 'Learn React',
      instructor: 'Jane Smith',
      progress: 45,
      duration: '4h 30m',
    },
    propSchema: {
      title: { type: 'string', required: true },
      instructor: { type: 'string' },
      progress: { type: 'number' },
      duration: { type: 'string' },
      thumbnail: { type: 'string' },
      rating: { type: 'number' },
    },
  },
  {
    type: 'lesson-list',
    name: 'Lesson List',
    description: 'Course lesson list',
    category: 'education',
    icon: '📋',
    defaultProps: {
      lessons: [
        { title: 'Introduction', duration: '5:00', completed: true },
        { title: 'Getting Started', duration: '10:00', completed: true },
        { title: 'Advanced Topics', duration: '15:00', completed: false },
      ],
    },
    propSchema: {
      lessons: { type: 'array', required: true },
      showDuration: { type: 'boolean' },
      showProgress: { type: 'boolean' },
    },
  },
  {
    type: 'certificate',
    name: 'Certificate',
    description: 'Achievement certificate',
    category: 'education',
    icon: '📜',
    defaultProps: {
      title: 'Course Completion',
      recipientName: 'John Doe',
      courseName: 'Advanced JavaScript',
      date: '2025-01-15',
    },
    propSchema: {
      title: { type: 'string', required: true },
      recipientName: { type: 'string', required: true },
      courseName: { type: 'string' },
      date: { type: 'string' },
      verificationCode: { type: 'string' },
    },
  },
  // Food & Dining
  {
    type: 'menu-item',
    name: 'Menu Item',
    description: 'Restaurant menu item',
    category: 'food',
    icon: '🍽️',
    defaultProps: {
      name: 'Margherita Pizza',
      description: 'Fresh tomatoes, mozzarella, basil',
      price: 14.99,
    },
    propSchema: {
      name: { type: 'string', required: true },
      description: { type: 'string' },
      price: { type: 'number', required: true },
      image: { type: 'string' },
      dietary: { type: 'array' },
      spicyLevel: { type: 'number' },
    },
  },
  {
    type: 'recipe-card',
    name: 'Recipe Card',
    description: 'Cooking recipe card',
    category: 'food',
    icon: '👨‍🍳',
    defaultProps: {
      title: 'Pasta Carbonara',
      prepTime: '15 min',
      cookTime: '20 min',
      servings: 4,
    },
    propSchema: {
      title: { type: 'string', required: true },
      prepTime: { type: 'string' },
      cookTime: { type: 'string' },
      servings: { type: 'number' },
      image: { type: 'string' },
      difficulty: { type: 'select', options: ['easy', 'medium', 'hard'] },
    },
  },
  {
    type: 'nutrition-facts',
    name: 'Nutrition Facts',
    description: 'Nutritional information',
    category: 'food',
    icon: '🥗',
    defaultProps: {
      calories: 250,
      protein: 12,
      carbs: 30,
      fat: 10,
    },
    propSchema: {
      calories: { type: 'number', required: true },
      protein: { type: 'number' },
      carbs: { type: 'number' },
      fat: { type: 'number' },
      showDetails: { type: 'boolean' },
    },
  },
  {
    type: 'restaurant-card',
    name: 'Restaurant Card',
    description: 'Restaurant listing card',
    category: 'food',
    icon: '🍴',
    defaultProps: {
      name: 'The Italian Place',
      cuisine: 'Italian',
      rating: 4.5,
      priceLevel: 2,
    },
    propSchema: {
      name: { type: 'string', required: true },
      cuisine: { type: 'string' },
      rating: { type: 'number' },
      priceLevel: { type: 'number' },
      image: { type: 'string' },
      distance: { type: 'string' },
      deliveryTime: { type: 'string' },
    },
  },
  {
    type: 'food-order-status',
    name: 'Order Status',
    description: 'Food delivery status tracker',
    category: 'food',
    icon: '🚴',
    defaultProps: {
      status: 'preparing',
      estimatedTime: 25,
      orderNumber: '#1234',
    },
    propSchema: {
      status: { type: 'select', options: ['confirmed', 'preparing', 'ready', 'picked-up', 'delivered'] },
      estimatedTime: { type: 'number' },
      orderNumber: { type: 'string' },
      showMap: { type: 'boolean' },
    },
  },
] as const

export type CapsuleType = typeof CAPSULE_DEFINITIONS[number]['type']

export function getCapsuleDefinition(type: string) {
  return CAPSULE_DEFINITIONS.find(c => c.type === type)
}
