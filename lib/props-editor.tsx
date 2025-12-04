'use client'

import React, { useState } from 'react'
import type { CapsuleInstance, CapsuleProps } from './dnd-context'

// Prop field types
interface PropField {
  name: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'range'
  label: string
  placeholder?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
}

// Define editable props for each capsule type
const CAPSULE_PROP_SCHEMA: Record<string, PropField[]> = {
  button: [
    { name: 'text', type: 'text', label: 'Button Text', placeholder: 'Click Me' },
    { name: 'variant', type: 'select', label: 'Variant', options: [
      { value: 'primary', label: 'Primary' },
      { value: 'secondary', label: 'Secondary' },
      { value: 'outline', label: 'Outline' },
      { value: 'ghost', label: 'Ghost' },
    ]},
    { name: 'disabled', type: 'boolean', label: 'Disabled' },
  ],
  text: [
    { name: 'content', type: 'textarea', label: 'Content', placeholder: 'Enter text...' },
    { name: 'size', type: 'select', label: 'Size', options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
    ]},
    { name: 'bold', type: 'boolean', label: 'Bold' },
  ],
  input: [
    { name: 'placeholder', type: 'text', label: 'Placeholder', placeholder: 'Type something...' },
    { name: 'label', type: 'text', label: 'Label' },
    { name: 'required', type: 'boolean', label: 'Required' },
  ],
  card: [
    { name: 'title', type: 'text', label: 'Title', placeholder: 'Card Title' },
    { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Card description...' },
  ],
  image: [
    { name: 'src', type: 'text', label: 'Image URL', placeholder: 'https://...' },
    { name: 'alt', type: 'text', label: 'Alt Text', placeholder: 'Image description' },
    { name: 'rounded', type: 'boolean', label: 'Rounded Corners' },
  ],
  avatar: [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'User' },
    { name: 'src', type: 'text', label: 'Image URL', placeholder: 'https://...' },
    { name: 'size', type: 'select', label: 'Size', options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
    ]},
    { name: 'status', type: 'select', label: 'Status', options: [
      { value: 'none', label: 'None' },
      { value: 'online', label: 'Online' },
      { value: 'offline', label: 'Offline' },
      { value: 'busy', label: 'Busy' },
    ]},
  ],
  badge: [
    { name: 'text', type: 'text', label: 'Badge Text', placeholder: 'New' },
    { name: 'variant', type: 'select', label: 'Variant', options: [
      { value: 'primary', label: 'Primary' },
      { value: 'success', label: 'Success' },
      { value: 'warning', label: 'Warning' },
      { value: 'danger', label: 'Danger' },
    ]},
  ],
  switch: [
    { name: 'label', type: 'text', label: 'Label', placeholder: 'Toggle Option' },
    { name: 'checked', type: 'boolean', label: 'Default Checked' },
  ],
  progress: [
    { name: 'value', type: 'range', label: 'Value', min: 0, max: 100, step: 1 },
    { name: 'showLabel', type: 'boolean', label: 'Show Label' },
  ],
  slider: [
    { name: 'min', type: 'number', label: 'Min Value' },
    { name: 'max', type: 'number', label: 'Max Value' },
    { name: 'step', type: 'number', label: 'Step' },
    { name: 'value', type: 'number', label: 'Default Value' },
  ],
  header: [
    { name: 'title', type: 'text', label: 'Title', placeholder: 'App Title' },
    { name: 'showBack', type: 'boolean', label: 'Show Back Button' },
    { name: 'showMenu', type: 'boolean', label: 'Show Menu Button' },
  ],
  navigation: [
    { name: 'items', type: 'text', label: 'Items (comma separated)', placeholder: 'Home,Search,Profile' },
  ],
  tabs: [
    { name: 'items', type: 'text', label: 'Tab Items (comma separated)', placeholder: 'Tab 1,Tab 2,Tab 3' },
  ],
  list: [
    { name: 'items', type: 'number', label: 'Number of Items', min: 1, max: 20 },
    { name: 'showDivider', type: 'boolean', label: 'Show Dividers' },
  ],
  chart: [
    { name: 'title', type: 'text', label: 'Chart Title', placeholder: 'Chart' },
    { name: 'type', type: 'select', label: 'Chart Type', options: [
      { value: 'bar', label: 'Bar' },
      { value: 'line', label: 'Line' },
      { value: 'pie', label: 'Pie' },
      { value: 'area', label: 'Area' },
    ]},
  ],
  stat: [
    { name: 'label', type: 'text', label: 'Label', placeholder: 'Total Sales' },
    { name: 'value', type: 'text', label: 'Value', placeholder: '12,345' },
    { name: 'change', type: 'text', label: 'Change', placeholder: '+12%' },
    { name: 'trend', type: 'select', label: 'Trend', options: [
      { value: 'up', label: 'Up' },
      { value: 'down', label: 'Down' },
      { value: 'neutral', label: 'Neutral' },
    ]},
  ],
  chatbubble: [
    { name: 'message', type: 'textarea', label: 'Message', placeholder: 'Hello!' },
    { name: 'isOwn', type: 'boolean', label: 'Own Message (right side)' },
  ],
  productcard: [
    { name: 'title', type: 'text', label: 'Product Name', placeholder: 'Product' },
    { name: 'price', type: 'number', label: 'Price', min: 0, step: 0.01 },
    { name: 'rating', type: 'range', label: 'Rating', min: 0, max: 5, step: 0.5 },
  ],
  toast: [
    { name: 'message', type: 'text', label: 'Message', placeholder: 'Action completed' },
    { name: 'type', type: 'select', label: 'Type', options: [
      { value: 'success', label: 'Success' },
      { value: 'error', label: 'Error' },
      { value: 'warning', label: 'Warning' },
      { value: 'info', label: 'Info' },
    ]},
    { name: 'duration', type: 'number', label: 'Duration (ms)', min: 1000, max: 10000, step: 500 },
  ],
  divider: [
    { name: 'orientation', type: 'select', label: 'Orientation', options: [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
    ]},
  ],
  spacer: [
    { name: 'size', type: 'number', label: 'Size (px)', min: 4, max: 100, step: 4 },
  ],
  modal: [
    { name: 'title', type: 'text', label: 'Modal Title', placeholder: 'Modal' },
    { name: 'size', type: 'select', label: 'Size', options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'full', label: 'Full Screen' },
    ]},
  ],
  dropdown: [
    { name: 'placeholder', type: 'text', label: 'Placeholder', placeholder: 'Select...' },
    { name: 'options', type: 'text', label: 'Options (comma separated)', placeholder: 'Option 1,Option 2' },
  ],
  'auth-login': [
    { name: 'showForgotPassword', type: 'boolean', label: 'Show Forgot Password' },
    { name: 'showRegisterLink', type: 'boolean', label: 'Show Register Link' },
    { name: 'rememberMe', type: 'boolean', label: 'Show Remember Me' },
  ],
  'ai-chat-local': [
    { name: 'provider', type: 'select', label: 'Provider', options: [
      { value: 'ollama', label: 'Ollama' },
      { value: 'lmstudio', label: 'LM Studio' },
    ]},
    { name: 'model', type: 'text', label: 'Model', placeholder: 'llama3.2' },
    { name: 'endpoint', type: 'text', label: 'Endpoint', placeholder: 'http://localhost:11434' },
    { name: 'systemPrompt', type: 'textarea', label: 'System Prompt' },
    { name: 'temperature', type: 'range', label: 'Temperature', min: 0, max: 2, step: 0.1 },
  ],
}

// Generic fields for capsules without specific schema
const DEFAULT_PROP_FIELDS: PropField[] = [
  { name: 'title', type: 'text', label: 'Title' },
  { name: 'content', type: 'textarea', label: 'Content' },
]

interface PropsEditorProps {
  capsule: CapsuleInstance
  onUpdate: (propName: string, value: string | number | boolean) => void
  onClose: () => void
}

export function PropsEditor({ capsule, onUpdate, onClose }: PropsEditorProps) {
  const schema = CAPSULE_PROP_SCHEMA[capsule.type] || DEFAULT_PROP_FIELDS
  const [localProps, setLocalProps] = useState<CapsuleProps>({ ...capsule.props })

  const handleChange = (name: string, value: string | number | boolean) => {
    setLocalProps(prev => ({ ...prev, [name]: value }))
    onUpdate(name, value)
  }

  const renderField = (field: PropField) => {
    const value = localProps[field.name]

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) ?? ''}
            onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step={field.step}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        )

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={(value as boolean) || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:bg-indigo-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
            </div>
            <span className="text-sm text-gray-400">{(value as boolean) ? 'On' : 'Off'}</span>
          </label>
        )

      case 'select':
        return (
          <select
            value={(value as string) || field.options?.[0]?.value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(value as string) || '#6366F1'}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer"
            />
            <input
              type="text"
              value={(value as string) || '#6366F1'}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={(value as number) ?? field.min ?? 0}
              onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{field.min ?? 0}</span>
              <span className="text-white font-medium">{(value as number) ?? field.min ?? 0}</span>
              <span>{field.max ?? 100}</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{capsule.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{capsule.name}</h3>
            <p className="text-xs text-gray-500">Edit properties</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {schema.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}

        {/* Custom JSON Editor for advanced users */}
        <div className="pt-4 border-t border-white/10">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer text-sm text-gray-500 hover:text-gray-300">
              <span>Advanced (JSON)</span>
              <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-2">
              <pre className="text-xs bg-white/5 p-3 rounded-lg overflow-auto text-gray-400 font-mono">
                {JSON.stringify(localProps, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

// Inline Prop Preview (shows current props in capsule card)
export function PropPreview({ capsule }: { capsule: CapsuleInstance }) {
  const props = capsule.props || {}
  const displayProps = Object.entries(props)
    .filter(([_, v]) => v !== '' && v !== false && v !== undefined)
    .slice(0, 3)

  if (displayProps.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {displayProps.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-white/10 text-gray-400"
        >
          <span className="text-gray-500">{key}:</span>
          <span className="ml-1 text-gray-300 truncate max-w-[80px]">
            {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
          </span>
        </span>
      ))}
    </div>
  )
}
