'use client'

import React, { useState } from 'react'
import {
  IconSearch,
  IconChevronDown,
  IconApple,
  IconAndroid,
  IconGlobe,
  IconDesktop,
  IconCode,
  IconEye,
  IconCopy,
  IconCheck,
} from '../../../components/ui/icons'

interface CapsuleInfo {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  platforms: string[]
  variants: string[]
}

const capsuleCategories = [
  'Todos',
  'UI Components',
  'Navigation & Layout',
  'Forms',
  'Data Display',
  'Feedback',
  'Media',
  'Data Management',
  'Device & Native',
]

const allCapsules: CapsuleInfo[] = [
  // UI Components
  { id: 'button', name: 'Button', category: 'UI Components', description: 'Botón interactivo con múltiples variantes', tags: ['ui', 'interactive'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['PrimaryButton', 'SecondaryButton', 'OutlineButton', 'IconButton'] },
  { id: 'text', name: 'Text', category: 'UI Components', description: 'Componente de texto tipográfico', tags: ['ui', 'typography'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Heading', 'Paragraph', 'Label', 'Caption'] },
  { id: 'input', name: 'Input', category: 'UI Components', description: 'Campo de entrada de texto', tags: ['ui', 'forms'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['TextInput', 'PasswordInput', 'SearchInput', 'TextArea'] },
  { id: 'card', name: 'Card', category: 'UI Components', description: 'Contenedor con sombra y bordes', tags: ['ui', 'layout'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Card', 'ElevatedCard', 'OutlinedCard', 'InteractiveCard'] },
  { id: 'image', name: 'Image', category: 'UI Components', description: 'Imagen con lazy loading y fallback', tags: ['ui', 'media'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Image', 'Avatar', 'Thumbnail', 'BackgroundImage'] },
  { id: 'avatar', name: 'Avatar', category: 'UI Components', description: 'Avatar de usuario con iniciales', tags: ['ui', 'profile'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Avatar', 'AvatarGroup', 'AvatarWithBadge'] },
  { id: 'badge', name: 'Badge', category: 'UI Components', description: 'Insignia para notificaciones', tags: ['ui', 'notification'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Badge', 'NotificationBadge', 'StatusBadge'] },
  { id: 'chip', name: 'Chip', category: 'UI Components', description: 'Etiqueta compacta y seleccionable', tags: ['ui', 'selection'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Chip', 'FilterChip', 'InputChip', 'ChoiceChip'] },
  { id: 'divider', name: 'Divider', category: 'UI Components', description: 'Línea separadora horizontal o vertical', tags: ['ui', 'layout'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Divider', 'VerticalDivider', 'LabeledDivider'] },

  // Navigation & Layout
  { id: 'navigation', name: 'Navigation', category: 'Navigation & Layout', description: 'Barra de navegación con tabs', tags: ['navigation'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['TabBar', 'BottomNavigation', 'NavBar', 'Sidebar'] },
  { id: 'list', name: 'List', category: 'Navigation & Layout', description: 'Lista scrollable con items', tags: ['layout', 'data'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['List', 'LazyList', 'SectionList', 'GridList'] },
  { id: 'modal', name: 'Modal', category: 'Navigation & Layout', description: 'Ventana modal superpuesta', tags: ['navigation', 'dialog'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Modal', 'FullScreenModal', 'BottomSheet', 'AlertDialog'] },
  { id: 'tabs', name: 'Tabs', category: 'Navigation & Layout', description: 'Navegación por pestañas', tags: ['navigation'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Tabs', 'ScrollableTabs', 'SegmentedControl'] },
  { id: 'accordion', name: 'Accordion', category: 'Navigation & Layout', description: 'Panel colapsable expandible', tags: ['layout', 'interactive'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Accordion', 'AccordionGroup', 'FAQAccordion'] },
  { id: 'bottom-sheet', name: 'BottomSheet', category: 'Navigation & Layout', description: 'Panel deslizable desde abajo', tags: ['navigation', 'mobile'], platforms: ['ios', 'android', 'web'], variants: ['BottomSheet', 'DraggableSheet', 'ActionSheet'] },
  { id: 'popover', name: 'Popover', category: 'Navigation & Layout', description: 'Tooltip avanzado posicionable', tags: ['navigation', 'overlay'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Popover', 'DropdownPopover', 'MenuPopover'] },
  { id: 'carousel', name: 'Carousel', category: 'Navigation & Layout', description: 'Carrusel de contenido deslizable', tags: ['navigation', 'media'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Carousel', 'ImageCarousel', 'CardCarousel'] },

  // Forms
  { id: 'form', name: 'Form', category: 'Forms', description: 'Formulario con validación', tags: ['forms'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Form', 'FormField', 'FormSection'] },
  { id: 'switch', name: 'Switch', category: 'Forms', description: 'Interruptor on/off', tags: ['forms', 'toggle'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Switch', 'LabeledSwitch', 'IconSwitch'] },
  { id: 'slider', name: 'Slider', category: 'Forms', description: 'Control deslizante de rango', tags: ['forms', 'input'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Slider', 'RangeSlider', 'SteppedSlider'] },
  { id: 'dropdown', name: 'Dropdown', category: 'Forms', description: 'Selector desplegable de opciones', tags: ['forms', 'selection'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Dropdown', 'MultiSelect', 'SearchableDropdown'] },
  { id: 'datepicker', name: 'DatePicker', category: 'Forms', description: 'Selector de fecha y hora', tags: ['forms', 'date'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['DatePicker', 'TimePicker', 'DateRangePicker'] },
  { id: 'rating', name: 'Rating', category: 'Forms', description: 'Sistema de puntuación con estrellas', tags: ['forms', 'input'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Rating', 'HalfRating', 'EmojiRating'] },
  { id: 'stepper', name: 'Stepper', category: 'Forms', description: 'Control numérico incremental', tags: ['forms', 'input'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Stepper', 'QuantityStepper'] },
  { id: 'color-picker', name: 'ColorPicker', category: 'Forms', description: 'Selector de color visual', tags: ['forms', 'color'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['ColorPicker', 'ColorWheel', 'SwatchPicker'] },
  { id: 'file-upload', name: 'FileUpload', category: 'Forms', description: 'Zona de subida de archivos', tags: ['forms', 'upload'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['FileUpload', 'DragDropUpload', 'ImageUpload'] },
  { id: 'rich-text-editor', name: 'RichTextEditor', category: 'Forms', description: 'Editor de texto enriquecido', tags: ['forms', 'editor'], platforms: ['ios', 'android', 'web'], variants: ['RichTextEditor', 'MarkdownEditor'] },
  { id: 'signature', name: 'Signature', category: 'Forms', description: 'Captura de firma digital', tags: ['forms', 'input'], platforms: ['ios', 'android', 'web'], variants: ['SignaturePad', 'SignatureCapture'] },

  // Data Display
  { id: 'table', name: 'Table', category: 'Data Display', description: 'Tabla de datos responsiva', tags: ['data', 'display'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Table', 'DataGrid', 'SimpleTable'] },
  { id: 'data-table', name: 'DataTable', category: 'Data Display', description: 'Tabla avanzada con sorting y filtros', tags: ['data', 'display'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['DataTable', 'VirtualizedTable', 'EditableTable'] },
  { id: 'chart', name: 'Chart', category: 'Data Display', description: 'Gráficos y visualizaciones', tags: ['data', 'charts'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['LineChart', 'BarChart', 'PieChart', 'AreaChart'] },
  { id: 'searchbar', name: 'SearchBar', category: 'Data Display', description: 'Barra de búsqueda con sugerencias', tags: ['search', 'input'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['SearchBar', 'SearchWithFilters', 'GlobalSearch'] },
  { id: 'timeline', name: 'Timeline', category: 'Data Display', description: 'Línea de tiempo vertical', tags: ['data', 'display'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Timeline', 'ActivityTimeline', 'StepTimeline'] },
  { id: 'calendar', name: 'Calendar', category: 'Data Display', description: 'Calendario interactivo', tags: ['data', 'date'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Calendar', 'EventCalendar', 'DateRangeCalendar'] },

  // Feedback
  { id: 'toast', name: 'Toast', category: 'Feedback', description: 'Notificación temporal', tags: ['feedback', 'notification'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Toast', 'Snackbar', 'ActionToast'] },
  { id: 'skeleton', name: 'Skeleton', category: 'Feedback', description: 'Placeholder de carga', tags: ['feedback', 'loading'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Skeleton', 'SkeletonText', 'SkeletonCard'] },
  { id: 'progress', name: 'Progress', category: 'Feedback', description: 'Indicador de progreso', tags: ['feedback', 'loading'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['ProgressBar', 'CircularProgress', 'StepProgress'] },
  { id: 'tooltip', name: 'Tooltip', category: 'Feedback', description: 'Información contextual flotante', tags: ['feedback', 'help'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['Tooltip', 'RichTooltip', 'ActionTooltip'] },

  // Media
  { id: 'video', name: 'Video', category: 'Media', description: 'Reproductor de video nativo', tags: ['media', 'video'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['VideoPlayer', 'VideoEmbed', 'VideoBackground'] },
  { id: 'audio', name: 'Audio', category: 'Media', description: 'Reproductor de audio', tags: ['media', 'audio'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['AudioPlayer', 'MiniPlayer', 'Waveform'] },
  { id: 'map', name: 'Map', category: 'Media', description: 'Mapa interactivo', tags: ['media', 'location'], platforms: ['ios', 'android', 'web'], variants: ['Map', 'MapWithMarkers', 'FullscreenMap'] },
  { id: 'pdf-viewer', name: 'PDFViewer', category: 'Media', description: 'Visor de documentos PDF', tags: ['media', 'document'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['PDFViewer', 'PDFEmbed', 'PDFPageNavigator'] },
  { id: 'qrcode', name: 'QRCode', category: 'Media', description: 'Generador de códigos QR', tags: ['media', 'utility'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['QRCode', 'QRCodeWithLogo', 'DynamicQRCode'] },

  // Data Management
  { id: 'kanban', name: 'Kanban', category: 'Data Management', description: 'Tablero Kanban drag & drop', tags: ['data', 'productivity'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['KanbanBoard', 'KanbanColumn', 'KanbanCard'] },
  { id: 'chat', name: 'Chat', category: 'Data Management', description: 'Interface de chat en tiempo real', tags: ['communication', 'realtime'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['ChatWindow', 'MessageBubble', 'ChatInput'] },

  // Device & Native
  { id: 'camera', name: 'Camera', category: 'Device & Native', description: 'Acceso a cámara nativa', tags: ['device', 'camera'], platforms: ['ios', 'android', 'web'], variants: ['Camera', 'ImagePicker', 'CameraCapture'] },
  { id: 'location', name: 'Location', category: 'Device & Native', description: 'Servicios de geolocalización', tags: ['device', 'location'], platforms: ['ios', 'android', 'web'], variants: ['useLocation', 'LocationButton', 'LocationDisplay'] },
  { id: 'biometrics', name: 'Biometrics', category: 'Device & Native', description: 'Autenticación biométrica', tags: ['device', 'security'], platforms: ['ios', 'android', 'web'], variants: ['useBiometrics', 'BiometricButton', 'ProtectedContent'] },
  { id: 'notifications', name: 'Notifications', category: 'Device & Native', description: 'Notificaciones push y locales', tags: ['device', 'notification'], platforms: ['ios', 'android', 'web'], variants: ['useNotifications', 'NotificationCenter', 'NotificationToast'] },
  { id: 'webview', name: 'WebView', category: 'Device & Native', description: 'Navegador web embebido', tags: ['device', 'web'], platforms: ['ios', 'android', 'desktop'], variants: ['WebView', 'BrowserFrame'] },
  { id: 'scanner', name: 'Scanner', category: 'Device & Native', description: 'Escáner de documentos', tags: ['device', 'camera'], platforms: ['ios', 'android', 'web'], variants: ['DocumentScanner', 'BarcodeScanner'] },
  { id: 'social-share', name: 'SocialShare', category: 'Device & Native', description: 'Compartir en redes sociales', tags: ['device', 'social'], platforms: ['ios', 'android', 'web'], variants: ['ShareButton', 'SocialShareButtons'] },

  // Auth
  { id: 'auth-screen', name: 'AuthScreen', category: 'UI Components', description: 'Pantalla de autenticación completa', tags: ['auth', 'screen'], platforms: ['ios', 'android', 'web', 'desktop'], variants: ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen'] },
]

const platformIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ios: IconApple,
  android: IconAndroid,
  web: IconGlobe,
  desktop: IconDesktop,
}

const categoryColors: Record<string, string> = {
  'UI Components': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'Navigation & Layout': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  'Forms': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'Data Display': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  'Feedback': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'Media': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'Data Management': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'Device & Native': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function CapsulesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleInfo | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const filteredCapsules = allCapsules.filter((capsule) => {
    const matchesSearch =
      capsule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'Todos' || capsule.category === categoryFilter
    const matchesPlatform = platformFilter === 'all' || capsule.platforms.includes(platformFilter)
    return matchesSearch && matchesCategory && matchesPlatform
  })

  const handleCopyCode = () => {
    if (selectedCapsule) {
      const code = `import { ${selectedCapsule.name}Capsule } from '@hublab/capsules'

// Uso básico
<${selectedCapsule.name}Capsule
  variant="${selectedCapsule.variants[0]}"
  // ... props
/>`
      navigator.clipboard.writeText(code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Explorador de Cápsulas</h1>
        <p className="text-muted-foreground">
          {allCapsules.length} componentes multi-plataforma disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl border border-border bg-background p-4">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar cápsulas por nombre o etiqueta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none rounded-lg border border-input bg-background py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {capsuleCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
        </div>

        {/* Platform filter */}
        <div className="relative">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="appearance-none rounded-lg border border-input bg-background py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todas las plataformas</option>
            <option value="ios">iOS (SwiftUI)</option>
            <option value="android">Android (Compose)</option>
            <option value="web">Web (React)</option>
            <option value="desktop">Desktop (Tauri)</option>
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Cápsulas', value: allCapsules.length, color: 'text-blue-500' },
          { label: 'iOS Compatible', value: allCapsules.filter(c => c.platforms.includes('ios')).length, color: 'text-gray-500' },
          { label: 'Android Compatible', value: allCapsules.filter(c => c.platforms.includes('android')).length, color: 'text-green-500' },
          { label: 'Categorías', value: capsuleCategories.length - 1, color: 'text-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Capsule Grid */}
        <div className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredCapsules.map((capsule) => (
              <div
                key={capsule.id}
                onClick={() => setSelectedCapsule(capsule)}
                className={`cursor-pointer rounded-xl border bg-background p-4 transition-all hover:shadow-md ${
                  selectedCapsule?.id === capsule.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{capsule.name}</span>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${categoryColors[capsule.category] || 'bg-gray-100'}`}>
                        {capsule.category.split(' ')[0]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {capsule.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {capsule.platforms.map((platform) => {
                      const Icon = platformIcons[platform]
                      return (
                        <div
                          key={platform}
                          className="flex h-6 w-6 items-center justify-center rounded bg-muted"
                          title={platform}
                        >
                          <Icon size={12} className="text-muted-foreground" />
                        </div>
                      )
                    })}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {capsule.variants.length} variantes
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredCapsules.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background py-12">
              <IconSearch size={48} className="text-muted-foreground" />
              <div className="mt-4 text-lg font-medium">No se encontraron cápsulas</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Intenta con otros filtros de búsqueda
              </div>
            </div>
          )}
        </div>

        {/* Selected Capsule Detail */}
        <div className="rounded-xl border border-border bg-background p-6 h-fit sticky top-6">
          {selectedCapsule ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedCapsule.name}</h3>
                  <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${categoryColors[selectedCapsule.category]}`}>
                    {selectedCapsule.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Preview">
                    <IconEye size={16} className="text-muted-foreground" />
                  </button>
                  <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Ver código">
                    <IconCode size={16} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {selectedCapsule.description}
              </p>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Plataformas Soportadas</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCapsule.platforms.map((platform) => {
                    const Icon = platformIcons[platform]
                    const labels: Record<string, string> = {
                      ios: 'iOS (SwiftUI)',
                      android: 'Android (Compose)',
                      web: 'Web (React)',
                      desktop: 'Desktop (Tauri)',
                    }
                    return (
                      <div key={platform} className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-sm">
                        <Icon size={14} />
                        {labels[platform]}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Variantes Disponibles</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCapsule.variants.map((variant) => (
                    <span key={variant} className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {variant}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Etiquetas</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCapsule.tags.map((tag) => (
                    <span key={tag} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Código de Ejemplo</h4>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedCode ? <IconCheck size={12} /> : <IconCopy size={12} />}
                    {copiedCode ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <pre className="mt-2 rounded-lg bg-muted p-3 text-xs overflow-x-auto">
                  <code>{`import { ${selectedCapsule.name}Capsule } from '@hublab/capsules'

// Uso básico
<${selectedCapsule.name}Capsule
  variant="${selectedCapsule.variants[0]}"
  // ... props
/>`}</code>
                </pre>
              </div>

              <button className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Añadir a Proyecto
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconCode size={32} className="text-muted-foreground" />
              <div className="mt-4 text-sm font-medium">Selecciona una cápsula</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Ver detalles, variantes y código de ejemplo
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
