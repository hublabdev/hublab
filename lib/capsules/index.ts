/**
 * HubLab Capsule System
 *
 * Multi-platform component definitions that generate
 * native code for iOS, Android, and Web.
 */

export * from './types'

import type { CapsuleDefinition, CapsuleCategory } from './types'

// Built-in capsule definitions (simplified inline versions)
const buttonCapsule: CapsuleDefinition = {
  id: 'button',
  name: 'Button',
  description: 'Interactive button with multiple variants',
  category: 'ui',
  tags: ['button', 'interactive', 'click', 'action'],
  version: '1.0.0',
  props: [
    { name: 'label', type: 'string', required: true, description: 'Button text' },
    { name: 'variant', type: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'], default: 'primary', description: 'Button style variant' },
    { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md', description: 'Button size' },
    { name: 'disabled', type: 'boolean', default: false, description: 'Disable button' },
    { name: 'loading', type: 'boolean', default: false, description: 'Show loading state' },
    { name: 'icon', type: 'icon', description: 'Optional icon' },
    { name: 'onPress', type: 'action', required: true, description: 'Press handler' },
  ],
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      code: 'export function Button({ label, variant = "primary", size = "md", disabled, loading, icon, onPress }) { return <button onClick={onPress} disabled={disabled || loading} className={`btn btn-${variant} btn-${size}`}>{loading ? "..." : icon}{label}</button> }',
    },
    ios: {
      framework: 'swiftui',
      dependencies: [],
      code: 'struct HubLabButton: View { let label: String; let action: () -> Void; var body: some View { Button(action: action) { Text(label) } } }',
    },
    android: {
      framework: 'compose',
      dependencies: [],
      code: '@Composable fun HubLabButton(label: String, onClick: () -> Unit) { Button(onClick = onClick) { Text(label) } }',
    },
  },
}

const textCapsule: CapsuleDefinition = {
  id: 'text',
  name: 'Text',
  description: 'Typography component for displaying text',
  category: 'ui',
  tags: ['text', 'typography', 'label'],
  version: '1.0.0',
  props: [
    { name: 'content', type: 'string', required: true, description: 'Text content' },
    { name: 'variant', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'body', 'caption', 'label'], default: 'body', description: 'Typography variant' },
    { name: 'color', type: 'color', description: 'Text color' },
    { name: 'align', type: 'select', options: ['left', 'center', 'right'], default: 'left', description: 'Text alignment' },
  ],
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      code: 'export function Text({ content, variant = "body", color, align = "left" }) { const Tag = variant.startsWith("h") ? variant : "p"; return <Tag style={{ color, textAlign: align }}>{content}</Tag> }',
    },
    ios: {
      framework: 'swiftui',
      dependencies: [],
      code: 'struct HubLabText: View { let content: String; var body: some View { Text(content) } }',
    },
    android: {
      framework: 'compose',
      dependencies: [],
      code: '@Composable fun HubLabText(content: String) { Text(text = content) }',
    },
  },
}

const inputCapsule: CapsuleDefinition = {
  id: 'input',
  name: 'Input',
  description: 'Text input field',
  category: 'forms',
  tags: ['input', 'text', 'form', 'field'],
  version: '1.0.0',
  props: [
    { name: 'value', type: 'string', required: true, description: 'Input value' },
    { name: 'placeholder', type: 'string', description: 'Placeholder text' },
    { name: 'label', type: 'string', description: 'Field label' },
    { name: 'type', type: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'], default: 'text', description: 'Input type' },
    { name: 'disabled', type: 'boolean', default: false, description: 'Disable input' },
    { name: 'onChange', type: 'action', required: true, description: 'Change handler' },
  ],
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      code: 'export function Input({ value, placeholder, label, type = "text", disabled, onChange }) { return <div><label>{label}</label><input type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={e => onChange(e.target.value)} /></div> }',
    },
    ios: {
      framework: 'swiftui',
      dependencies: [],
      code: 'struct HubLabInput: View { @Binding var text: String; let placeholder: String; var body: some View { TextField(placeholder, text: $text) } }',
    },
    android: {
      framework: 'compose',
      dependencies: [],
      code: '@Composable fun HubLabInput(value: String, onValueChange: (String) -> Unit, placeholder: String = "") { TextField(value = value, onValueChange = onValueChange, placeholder = { Text(placeholder) }) }',
    },
  },
}

const cardCapsule: CapsuleDefinition = {
  id: 'card',
  name: 'Card',
  description: 'Container card with optional header and footer',
  category: 'layout',
  tags: ['card', 'container', 'box'],
  version: '1.0.0',
  props: [
    { name: 'title', type: 'string', description: 'Card title' },
    { name: 'subtitle', type: 'string', description: 'Card subtitle' },
    { name: 'variant', type: 'select', options: ['default', 'outlined', 'elevated'], default: 'default', description: 'Card variant' },
    { name: 'padding', type: 'spacing', default: 'normal', description: 'Inner padding' },
  ],
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      code: 'export function Card({ title, subtitle, variant = "default", padding = "normal", children }) { return <div className={`card card-${variant}`}>{title && <h3>{title}</h3>}{subtitle && <p>{subtitle}</p>}{children}</div> }',
    },
    ios: {
      framework: 'swiftui',
      dependencies: [],
      code: 'struct HubLabCard<Content: View>: View { let title: String?; @ViewBuilder let content: () -> Content; var body: some View { VStack { if let t = title { Text(t) } content() }.padding().background(Color(.systemBackground)).cornerRadius(12) } }',
    },
    android: {
      framework: 'compose',
      dependencies: [],
      code: '@Composable fun HubLabCard(title: String? = null, content: @Composable () -> Unit) { Card { Column(modifier = Modifier.padding(16.dp)) { title?.let { Text(it) }; content() } } }',
    },
  },
  children: true,
}

const listCapsule: CapsuleDefinition = {
  id: 'list',
  name: 'List',
  description: 'Scrollable list of items',
  category: 'data',
  tags: ['list', 'scroll', 'items'],
  version: '1.0.0',
  props: [
    { name: 'items', type: 'array', required: true, description: 'List items' },
    { name: 'renderItem', type: 'slot', required: true, description: 'Item renderer' },
    { name: 'emptyMessage', type: 'string', default: 'No items', description: 'Empty state message' },
  ],
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      code: 'export function List({ items, renderItem, emptyMessage = "No items" }) { if (!items.length) return <p>{emptyMessage}</p>; return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul> }',
    },
    ios: {
      framework: 'swiftui',
      dependencies: [],
      code: 'struct HubLabList<Item: Identifiable, Content: View>: View { let items: [Item]; @ViewBuilder let content: (Item) -> Content; var body: some View { List(items) { item in content(item) } } }',
    },
    android: {
      framework: 'compose',
      dependencies: [],
      code: '@Composable fun <T> HubLabList(items: List<T>, itemContent: @Composable (T) -> Unit) { LazyColumn { items(items) { item -> itemContent(item) } } }',
    },
  },
}

const modalCapsule: CapsuleDefinition = {
  id: 'modal',
  name: 'Modal',
  description: 'Modal dialog overlay',
  category: 'feedback',
  tags: ['modal', 'dialog', 'popup', 'overlay'],
  version: '1.0.0',
  props: [
    { name: 'isOpen', type: 'boolean', required: true, description: 'Modal visibility' },
    { name: 'title', type: 'string', description: 'Modal title' },
    { name: 'onClose', type: 'action', required: true, description: 'Close handler' },
    { name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'full'], default: 'md', description: 'Modal size' },
  ],
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      code: 'export function Modal({ isOpen, title, onClose, children }) { if (!isOpen) return null; return <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}>{title && <h2>{title}</h2>}{children}<button onClick={onClose}>Close</button></div></div> }',
    },
    ios: {
      framework: 'swiftui',
      dependencies: [],
      code: 'struct HubLabModal<Content: View>: View { @Binding var isPresented: Bool; let title: String?; @ViewBuilder let content: () -> Content; var body: some View { if isPresented { ZStack { Color.black.opacity(0.5).ignoresSafeArea(); VStack { if let t = title { Text(t) } content(); Button("Close") { isPresented = false } }.padding().background(Color.white).cornerRadius(12) } } } }',
    },
    android: {
      framework: 'compose',
      dependencies: [],
      code: '@Composable fun HubLabModal(isOpen: Boolean, title: String? = null, onDismiss: () -> Unit, content: @Composable () -> Unit) { if (isOpen) { Dialog(onDismissRequest = onDismiss) { Card { Column(Modifier.padding(16.dp)) { title?.let { Text(it) }; content() } } } } }',
    },
  },
  children: true,
}

const imageCapsule: CapsuleDefinition = {
  id: 'image',
  name: 'Image',
  description: 'Image display with loading and fallback',
  category: 'media',
  tags: ['image', 'media', 'photo'],
  version: '1.0.0',
  props: [
    { name: 'src', type: 'image', required: true, description: 'Image source URL' },
    { name: 'alt', type: 'string', required: true, description: 'Alt text' },
    { name: 'aspectRatio', type: 'select', options: ['square', '4:3', '16:9', 'auto'], default: 'auto', description: 'Aspect ratio' },
    { name: 'fit', type: 'select', options: ['cover', 'contain', 'fill'], default: 'cover', description: 'Object fit' },
  ],
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      code: 'export function Image({ src, alt, aspectRatio = "auto", fit = "cover" }) { return <img src={src} alt={alt} style={{ objectFit: fit, aspectRatio }} /> }',
    },
    ios: {
      framework: 'swiftui',
      dependencies: [],
      code: 'struct HubLabImage: View { let url: URL; var body: some View { AsyncImage(url: url) { image in image.resizable().scaledToFit() } placeholder: { ProgressView() } } }',
    },
    android: {
      framework: 'compose',
      dependencies: ['coil-compose'],
      code: '@Composable fun HubLabImage(url: String, contentDescription: String) { AsyncImage(model = url, contentDescription = contentDescription, contentScale = ContentScale.Fit) }',
    },
  },
}

// Capsule Registry
const capsuleRegistry = new Map<string, CapsuleDefinition>()

const builtInCapsules: CapsuleDefinition[] = [
  buttonCapsule,
  textCapsule,
  inputCapsule,
  cardCapsule,
  listCapsule,
  modalCapsule,
  imageCapsule,
]

builtInCapsules.forEach(capsule => {
  capsuleRegistry.set(capsule.id, capsule)
})

export function getCapsule(id: string): CapsuleDefinition | undefined {
  return capsuleRegistry.get(id)
}

export function getAllCapsules(): CapsuleDefinition[] {
  return Array.from(capsuleRegistry.values())
}

export function getCapsulesByCategory(category: CapsuleCategory): CapsuleDefinition[] {
  return getAllCapsules().filter(c => c.category === category)
}

export function getCapsulesByTag(tag: string): CapsuleDefinition[] {
  return getAllCapsules().filter(c => c.tags.includes(tag))
}

export function registerCapsule(capsule: CapsuleDefinition): void {
  capsuleRegistry.set(capsule.id, capsule)
}

export function unregisterCapsule(id: string): boolean {
  return capsuleRegistry.delete(id)
}

export function supportsPlatform(
  id: string,
  platform: 'web' | 'ios' | 'android' | 'desktop'
): boolean {
  const capsule = capsuleRegistry.get(id)
  return capsule?.platforms[platform] !== undefined
}

export function getSupportedPlatforms(id: string): string[] {
  const capsule = capsuleRegistry.get(id)
  if (!capsule) return []
  return Object.keys(capsule.platforms)
}

export function getCapsuleStats() {
  const capsules = getAllCapsules()
  const categories = new Set(capsules.map(c => c.category))
  const tags = new Set(capsules.flatMap(c => c.tags))

  return {
    total: capsules.length,
    categories: Array.from(categories),
    tags: Array.from(tags),
    byPlatform: {
      web: capsules.filter(c => c.platforms.web).length,
      ios: capsules.filter(c => c.platforms.ios).length,
      android: capsules.filter(c => c.platforms.android).length,
      desktop: capsules.filter(c => c.platforms.desktop).length,
    }
  }
}

// Re-export individual capsules for named imports
export const ButtonCapsule = buttonCapsule
export const TextCapsule = textCapsule
export const InputCapsule = inputCapsule
export const CardCapsule = cardCapsule
export const ListCapsule = listCapsule
export const ModalCapsule = modalCapsule
export const ImageCapsule = imageCapsule
