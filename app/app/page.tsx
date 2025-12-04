'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import JSZip from 'jszip'
import { MICRO_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates, getTemplateById, type MicroTemplate } from '@/lib/micro-templates'
import { ICON_STYLES, COLOR_PALETTES, generatePlaceholderIcon, getEmojiForKeyword } from '@/lib/icon-generator'
// DnD Kit imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// New modular components
import { PropsEditor } from '@/lib/props-editor'
import { VisualPreview } from '@/lib/visual-preview'
import { ProjectManager, exportProject, importProject, ScreenManager } from '@/lib/project-manager'
// Note: Using local generateSwiftUI/generateKotlin/generateReact functions defined below
// import { generateSwiftUI, generateKotlin, generateReact, generateTauri } from '@/lib/code-generators'

// Sortable Capsule Component for DnD Kit
interface SortableCapsuleItemProps {
  capsule: CapsuleInstance
  index: number
  isSelected: boolean
  onSelect: () => void
  onDuplicate: () => void
  onRemove: () => void
}

function SortableCapsuleItem({ capsule, index, isSelected, onSelect, onDuplicate, onRemove }: SortableCapsuleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: capsule.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-2 p-2 rounded-lg group cursor-pointer transition-all ${
        isDragging ? 'scale-105 shadow-lg shadow-blue-500/20' : ''
      } ${isSelected ? 'bg-blue-500/20 ring-1 ring-blue-500/50' : 'bg-white/5 hover:bg-white/10'}`}
    >
      <span
        {...attributes}
        {...listeners}
        className="text-gray-500 cursor-grab active:cursor-grabbing hover:text-gray-300 transition-colors"
      >
        ⋮⋮
      </span>
      <span className="text-sm">{capsule.icon}</span>
      <span className="flex-1 text-sm truncate">{capsule.name}</span>
      <span className="text-xs text-gray-500">#{index + 1}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDuplicate() }}
        className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition-opacity"
        title="Duplicate"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
        title="Delete"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// All Capsules data
const ALL_CAPSULES = [
  // UI Components
  { id: 'button', name: 'Button', icon: '🔘', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'text', name: 'Text', icon: '📝', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'input', name: 'Input', icon: '✏️', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'card', name: 'Card', icon: '🃏', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image', name: 'Image', icon: '🖼️', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'avatar', name: 'Avatar', icon: '👤', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'badge', name: 'Badge', icon: '🏷️', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'chip', name: 'Chip', icon: '🏷️', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'divider', name: 'Divider', icon: '➖', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'spacer', name: 'Spacer', icon: '↕️', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'icon', name: 'Icon', icon: '⭐', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tooltip', name: 'Tooltip', icon: '💬', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'skeleton', name: 'Skeleton', icon: '💀', category: 'UI Components', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Layout & Navigation
  { id: 'list', name: 'List', icon: '📋', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'modal', name: 'Modal', icon: '🪟', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'navigation', name: 'Navigation', icon: '🧭', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tabs', name: 'Tabs', icon: '📑', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'accordion', name: 'Accordion', icon: '🪗', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'drawer', name: 'Drawer', icon: '📥', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'header', name: 'Header', icon: '🔝', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'footer', name: 'Footer', icon: '🔚', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sidebar', name: 'Sidebar', icon: '📐', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'grid', name: 'Grid', icon: '🔲', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'stack', name: 'Stack', icon: '📚', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'scrollview', name: 'ScrollView', icon: '📜', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'bottomsheet', name: 'Bottom Sheet', icon: '⬆️', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'stepper', name: 'Stepper', icon: '👣', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'breadcrumb', name: 'Breadcrumb', icon: '🍞', category: 'Layout', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Forms
  { id: 'form', name: 'Form', icon: '📋', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'switch', name: 'Switch', icon: '🔀', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'slider', name: 'Slider', icon: '🎚️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'dropdown', name: 'Dropdown', icon: '📂', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'datepicker', name: 'Date Picker', icon: '📅', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'timepicker', name: 'Time Picker', icon: '⏰', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'checkbox', name: 'Checkbox', icon: '☑️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'radio', name: 'Radio', icon: '🔘', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'textarea', name: 'TextArea', icon: '📄', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'searchbar', name: 'Search Bar', icon: '🔍', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'autocomplete', name: 'Autocomplete', icon: '🔮', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'colorpicker', name: 'Color Picker', icon: '🎨', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'filepicker', name: 'File Picker', icon: '📁', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'rating', name: 'Rating', icon: '⭐', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'signature', name: 'Signature', icon: '✍️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'otp', name: 'OTP Input', icon: '🔢', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Data & Charts
  { id: 'chart', name: 'Chart', icon: '📊', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'table', name: 'Table', icon: '📋', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'progress', name: 'Progress', icon: '⏳', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'stat', name: 'Stat Card', icon: '📈', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'counter', name: 'Counter', icon: '🔢', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'timeline', name: 'Timeline', icon: '📅', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'calendar', name: 'Calendar', icon: '🗓️', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'gauge', name: 'Gauge', icon: '🎯', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'kanban', name: 'Kanban', icon: '📌', category: 'Data', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Media
  { id: 'video', name: 'Video', icon: '🎬', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'audio', name: 'Audio', icon: '🎵', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'carousel', name: 'Carousel', icon: '🎠', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'gallery', name: 'Gallery', icon: '🖼️', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lightbox', name: 'Lightbox', icon: '💡', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'qrcode', name: 'QR Code', icon: '📱', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'barcode', name: 'Barcode', icon: '📊', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lottie', name: 'Lottie', icon: '🎞️', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'threed', name: '3D View', icon: '🧊', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Feedback
  { id: 'toast', name: 'Toast', icon: '🍞', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'alert', name: 'Alert', icon: '⚠️', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'snackbar', name: 'Snackbar', icon: '📢', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'loading', name: 'Loading', icon: '⏳', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'spinner', name: 'Spinner', icon: '🔄', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'confetti', name: 'Confetti', icon: '🎊', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'emptystate', name: 'Empty State', icon: '📭', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'errorstate', name: 'Error State', icon: '❌', category: 'Feedback', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Social
  { id: 'comment', name: 'Comment', icon: '💬', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'like', name: 'Like Button', icon: '❤️', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'share', name: 'Share', icon: '🔗', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'follow', name: 'Follow Button', icon: '➕', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'usercard', name: 'User Card', icon: '👤', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'chatbubble', name: 'Chat Bubble', icon: '💭', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'reaction', name: 'Reactions', icon: '😀', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'mention', name: 'Mention', icon: '@', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  // E-commerce
  { id: 'productcard', name: 'Product Card', icon: '🛍️', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'cart', name: 'Cart', icon: '🛒', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'checkout', name: 'Checkout', icon: '💳', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pricetag', name: 'Price Tag', icon: '💰', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'quantity', name: 'Quantity', icon: '🔢', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'wishlist', name: 'Wishlist', icon: '💝', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'coupon', name: 'Coupon', icon: '🎫', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'review', name: 'Review', icon: '⭐', category: 'E-commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Native
  { id: 'camera', name: 'Camera', icon: '📷', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'location', name: 'Location', icon: '📍', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'biometrics', name: 'Biometrics', icon: '🔐', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'notifications', name: 'Notifications', icon: '🔔', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'haptic', name: 'Haptic', icon: '📳', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'share-native', name: 'Native Share', icon: '📤', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'contacts', name: 'Contacts', icon: '📇', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'calendar-native', name: 'Calendar Access', icon: '📆', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'bluetooth', name: 'Bluetooth', icon: '📶', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'nfc', name: 'NFC', icon: '📡', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'healthkit', name: 'Health Data', icon: '❤️‍🩹', category: 'Native', platforms: ['ios', 'android'] },
  { id: 'applepay', name: 'Apple Pay', icon: '🍎', category: 'Native', platforms: ['ios'] },
  { id: 'googlepay', name: 'Google Pay', icon: '💳', category: 'Native', platforms: ['android'] },
  { id: 'siri', name: 'Siri Shortcut', icon: '🗣️', category: 'Native', platforms: ['ios'] },
  { id: 'widgets', name: 'Widget', icon: '📱', category: 'Native', platforms: ['ios', 'android'] },
  // AI & ML
  { id: 'chatbot', name: 'Chatbot', icon: '🤖', category: 'AI', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'voiceinput', name: 'Voice Input', icon: '🎤', category: 'AI', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'texttospeech', name: 'Text to Speech', icon: '🔊', category: 'AI', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'imagerecognition', name: 'Image Recognition', icon: '👁️', category: 'AI', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'translation', name: 'Translation', icon: '🌐', category: 'AI', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sentiment', name: 'Sentiment', icon: '😊', category: 'AI', platforms: ['web', 'ios', 'android', 'desktop'] },
  // AI Edge - Local AI Models
  { id: 'ai-chat-local', name: 'AI Chat (Local)', icon: '🦙', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-assistant-widget', name: 'AI Assistant', icon: '💬', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-autocomplete', name: 'AI Autocomplete', icon: '✨', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-smart-input', name: 'Smart Input', icon: '🧠', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-content-generator', name: 'Content Generator', icon: '📝', category: 'AI Edge', platforms: ['web', 'desktop'] },
  { id: 'ai-summarizer', name: 'Text Summarizer', icon: '📋', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-sentiment-analyzer', name: 'Sentiment Analyzer', icon: '😊', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-classifier', name: 'Text Classifier', icon: '🏷️', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-entity-extractor', name: 'Entity Extractor', icon: '🔍', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-voice-chat', name: 'Voice Chat', icon: '🎤', category: 'AI Edge', platforms: ['web', 'ios', 'android'] },
  { id: 'ai-transcription', name: 'Transcription', icon: '📝', category: 'AI Edge', platforms: ['web', 'ios', 'android'] },
  { id: 'ai-translator-local', name: 'AI Translator', icon: '🌐', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-code-assistant', name: 'Code Assistant', icon: '💻', category: 'AI Edge', platforms: ['web', 'desktop'] },
  { id: 'ai-json-generator', name: 'JSON Generator', icon: '📊', category: 'AI Edge', platforms: ['web', 'desktop'] },
  { id: 'ai-idea-generator', name: 'Idea Generator', icon: '💡', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-story-writer', name: 'Story Writer', icon: '📖', category: 'AI Edge', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Monetization - Ads
  { id: 'ad-banner', name: 'Ad Banner', icon: '📱', category: 'Monetization', platforms: ['web', 'ios', 'android'] },
  { id: 'ad-interstitial', name: 'Interstitial Ad', icon: '📺', category: 'Monetization', platforms: ['web', 'ios', 'android'] },
  { id: 'ad-rewarded', name: 'Rewarded Video', icon: '🎬', category: 'Monetization', platforms: ['ios', 'android'] },
  // Monetization - Payments
  { id: 'paywall', name: 'Paywall', icon: '🔒', category: 'Monetization', platforms: ['web', 'ios', 'android'] },
  { id: 'pricing-table', name: 'Pricing Table', icon: '💰', category: 'Monetization', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'buy-button', name: 'Buy Button', icon: '🛒', category: 'Monetization', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tip-jar', name: 'Tip Jar', icon: '☕', category: 'Monetization', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Monetization - Subscription
  { id: 'subscription-status', name: 'Subscription Status', icon: '📊', category: 'Monetization', platforms: ['web', 'ios', 'android'] },
  { id: 'premium-badge', name: 'Premium Badge', icon: '👑', category: 'Monetization', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'feature-gate', name: 'Feature Gate', icon: '🚪', category: 'Monetization', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Monetization - In-App Purchases
  { id: 'store-item', name: 'Store Item', icon: '🏪', category: 'Monetization', platforms: ['web', 'ios', 'android'] },
  { id: 'coin-display', name: 'Coin Display', icon: '🪙', category: 'Monetization', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'store-grid', name: 'Store Grid', icon: '🛍️', category: 'Monetization', platforms: ['web', 'ios', 'android'] },
  // Backend - Authentication
  { id: 'auth-login', name: 'Login Form', icon: '🔐', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  { id: 'auth-register', name: 'Register Form', icon: '📝', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  { id: 'auth-social', name: 'Social Login', icon: '🌐', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  { id: 'auth-avatar', name: 'User Avatar', icon: '👤', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auth-profile', name: 'Profile Editor', icon: '✏️', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Backend - Data
  { id: 'data-list', name: 'Data List', icon: '📋', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'data-card', name: 'Data Card', icon: '🃏', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'data-form', name: 'Data Form', icon: '📝', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'data-table', name: 'Data Table', icon: '📊', category: 'Backend', platforms: ['web', 'desktop'] },
  { id: 'data-search', name: 'Data Search', icon: '🔍', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'data-filter', name: 'Data Filter', icon: '🔀', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Backend - Storage
  { id: 'storage-upload', name: 'File Upload', icon: '📤', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  { id: 'storage-gallery', name: 'Media Gallery', icon: '🖼️', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'storage-picker', name: 'File Picker', icon: '📁', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Backend - Realtime
  { id: 'realtime-presence', name: 'Presence', icon: '🟢', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  { id: 'realtime-chat', name: 'Real-time Chat', icon: '💬', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  { id: 'realtime-notifications', name: 'Notifications', icon: '🔔', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  // Backend - API
  { id: 'api-fetch', name: 'API Fetch', icon: '📡', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'api-form', name: 'API Form', icon: '📮', category: 'Backend', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'api-webhook', name: 'Webhook', icon: '🪝', category: 'Backend', platforms: ['web', 'ios', 'android'] },
  // Connections - Local AI Services
  { id: 'conn-supertonic-speak', name: 'Speak (TTS)', icon: '🔊', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-supertonic-voices', name: 'Voice Selector', icon: '🎤', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-lmstudio-chat', name: 'LM Studio Chat', icon: '🧠', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-ollama-chat', name: 'Ollama Chat', icon: '🦙', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-ai-assistant', name: 'AI Assistant', icon: '🤖', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-ai-completion', name: 'AI Completion', icon: '✨', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Connections - Cloud AI
  { id: 'conn-openai', name: 'OpenAI', icon: '🌐', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-groq', name: 'Groq', icon: '⚡', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-anthropic', name: 'Claude API', icon: '🎭', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Connections - Realtime
  { id: 'conn-websocket', name: 'WebSocket', icon: '🔄', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'conn-rest-api', name: 'REST API', icon: '🔌', category: 'Connections', platforms: ['web', 'ios', 'android', 'desktop'] },
  // AI Providers - All major cloud AI
  { id: 'ai-google', name: 'Google Gemini', icon: '🔷', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-mistral', name: 'Mistral AI', icon: '🌊', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-cohere', name: 'Cohere', icon: '🔮', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-perplexity', name: 'Perplexity', icon: '🔍', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-together', name: 'Together AI', icon: '🤝', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-deepseek', name: 'DeepSeek', icon: '🌊', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-replicate', name: 'Replicate', icon: '🔁', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-huggingface', name: 'Hugging Face', icon: '🤗', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ai-xai', name: 'xAI Grok', icon: '✖️', category: 'AI Providers', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Voice & Audio
  { id: 'voice-openai-tts', name: 'OpenAI TTS', icon: '🔊', category: 'Voice', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'voice-openai-stt', name: 'OpenAI Whisper', icon: '🎤', category: 'Voice', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'voice-local-whisper', name: 'Local Whisper', icon: '🎤', category: 'Voice', platforms: ['web', 'desktop'] },
  { id: 'voice-elevenlabs', name: 'ElevenLabs', icon: '🎙️', category: 'Voice', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Image Generation
  { id: 'image-dalle', name: 'DALL-E 3', icon: '🎨', category: 'Images', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image-flux', name: 'FLUX', icon: '🌊', category: 'Images', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image-sdxl', name: 'Stable Diffusion', icon: '🖼️', category: 'Images', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image-midjourney', name: 'Midjourney', icon: '🎭', category: 'Images', platforms: ['web'] },
  // RAG & Knowledge
  { id: 'rag-chat', name: 'RAG Chat', icon: '📚', category: 'RAG', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'rag-upload', name: 'Document Upload', icon: '📤', category: 'RAG', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'rag-search', name: 'Semantic Search', icon: '🔍', category: 'RAG', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'rag-embeddings', name: 'Embeddings', icon: '📊', category: 'RAG', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Vector Databases
  { id: 'vector-pinecone', name: 'Pinecone', icon: '🌲', category: 'Vector DB', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'vector-weaviate', name: 'Weaviate', icon: '🔷', category: 'Vector DB', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'vector-qdrant', name: 'Qdrant', icon: '🔶', category: 'Vector DB', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'vector-chroma', name: 'ChromaDB', icon: '🎨', category: 'Vector DB', platforms: ['web', 'desktop'] },
  { id: 'vector-supabase', name: 'Supabase Vector', icon: '⚡', category: 'Vector DB', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Cloud Storage
  { id: 'storage-gdrive', name: 'Google Drive', icon: '📁', category: 'Storage', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'storage-dropbox', name: 'Dropbox', icon: '📦', category: 'Storage', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'storage-onedrive', name: 'OneDrive', icon: '☁️', category: 'Storage', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'storage-s3', name: 'AWS S3', icon: '🪣', category: 'Storage', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'storage-r2', name: 'Cloudflare R2', icon: '🟠', category: 'Storage', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Auth & Security
  { id: 'auth-login', name: 'Login Form', icon: '🔐', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auth-register', name: 'Register Form', icon: '📝', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auth-social', name: 'Social Login', icon: '🔗', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auth-forgot', name: 'Forgot Password', icon: '🔑', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auth-otp-verify', name: 'OTP Verify', icon: '📲', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auth-profile', name: 'Profile Settings', icon: '👤', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Payments
  { id: 'pay-checkout', name: 'Checkout Form', icon: '💳', category: 'Payments', platforms: ['web', 'ios', 'android'] },
  { id: 'pay-stripe', name: 'Stripe Pay', icon: '💵', category: 'Payments', platforms: ['web', 'ios', 'android'] },
  { id: 'pay-paypal', name: 'PayPal Button', icon: '🅿️', category: 'Payments', platforms: ['web', 'ios', 'android'] },
  { id: 'pay-apple', name: 'Apple Pay', icon: '🍎', category: 'Payments', platforms: ['ios', 'web'] },
  { id: 'pay-google', name: 'Google Pay', icon: '🔷', category: 'Payments', platforms: ['android', 'web'] },
  { id: 'pay-subscription', name: 'Subscription', icon: '🔄', category: 'Payments', platforms: ['web', 'ios', 'android'] },
  // Notifications
  { id: 'notif-push', name: 'Push Notification', icon: '🔔', category: 'Notifications', platforms: ['ios', 'android', 'web'] },
  { id: 'notif-inapp', name: 'In-App Alert', icon: '📣', category: 'Notifications', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'notif-badge', name: 'Badge Counter', icon: '🔴', category: 'Notifications', platforms: ['ios', 'android', 'web'] },
  { id: 'notif-banner', name: 'Banner Notice', icon: '📢', category: 'Notifications', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Analytics & Tracking
  { id: 'analytics-dashboard', name: 'Analytics Card', icon: '📈', category: 'Analytics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'analytics-chart', name: 'Stats Chart', icon: '📊', category: 'Analytics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'analytics-kpi', name: 'KPI Widget', icon: '🎯', category: 'Analytics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'analytics-funnel', name: 'Funnel Chart', icon: '📉', category: 'Analytics', platforms: ['web', 'desktop'] },
  // Location & Maps
  { id: 'geo-map', name: 'Map View', icon: '🗺️', category: 'Location', platforms: ['web', 'ios', 'android'] },
  { id: 'geo-location', name: 'Current Location', icon: '📍', category: 'Location', platforms: ['web', 'ios', 'android'] },
  { id: 'geo-places', name: 'Places Search', icon: '🔎', category: 'Location', platforms: ['web', 'ios', 'android'] },
  { id: 'geo-directions', name: 'Directions', icon: '🧭', category: 'Location', platforms: ['web', 'ios', 'android'] },
  // Internationalization
  { id: 'i18n-selector', name: 'Language Picker', icon: '🌍', category: 'i18n', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'i18n-text', name: 'Translated Text', icon: '🔤', category: 'i18n', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Gaming & Entertainment
  { id: 'game-leaderboard', name: 'Leaderboard', icon: '🏆', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-achievements', name: 'Achievements', icon: '🎖️', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-score', name: 'Score Display', icon: '🎯', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-lives', name: 'Lives Counter', icon: '❤️', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-timer', name: 'Game Timer', icon: '⏱️', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-xp', name: 'XP Progress', icon: '⭐', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-inventory', name: 'Inventory Grid', icon: '🎒', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-minimap', name: 'Mini Map', icon: '🗺️', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-health', name: 'Health Bar', icon: '💚', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'game-joystick', name: 'Virtual Joystick', icon: '🕹️', category: 'Gaming', platforms: ['web', 'ios', 'android'] },
  { id: 'game-actionbutton', name: 'Action Button', icon: '🔴', category: 'Gaming', platforms: ['web', 'ios', 'android'] },
  { id: 'game-quiz', name: 'Quiz Card', icon: '❓', category: 'Gaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Productivity & Tools
  { id: 'prod-todo', name: 'Todo List', icon: '✅', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-notes', name: 'Notes Editor', icon: '📝', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-reminder', name: 'Reminder', icon: '⏰', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-pomodoro', name: 'Pomodoro Timer', icon: '🍅', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-habit', name: 'Habit Tracker', icon: '📆', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-journal', name: 'Journal Entry', icon: '📔', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-kanban', name: 'Kanban Board', icon: '📋', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-calendar-event', name: 'Calendar Event', icon: '📅', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-project', name: 'Project Card', icon: '📁', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-bookmark', name: 'Bookmark', icon: '🔖', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-clipboard', name: 'Clipboard', icon: '📋', category: 'Productivity', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prod-markdown', name: 'Markdown Editor', icon: '📄', category: 'Productivity', platforms: ['web', 'desktop'] },
  // Social & Community
  { id: 'social-feed', name: 'Social Feed', icon: '📰', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-post', name: 'Post Card', icon: '📮', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-story', name: 'Story View', icon: '⏳', category: 'Social', platforms: ['web', 'ios', 'android'] },
  { id: 'social-profile-header', name: 'Profile Header', icon: '👤', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-followers', name: 'Followers List', icon: '👥', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-group', name: 'Group Card', icon: '👨‍👩‍👧‍👦', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-invite', name: 'Invite Card', icon: '✉️', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-activity', name: 'Activity Feed', icon: '📊', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-poll', name: 'Poll', icon: '📊', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-livestream', name: 'Live Stream', icon: '🔴', category: 'Social', platforms: ['web', 'ios', 'android'] },
  // Utilities
  { id: 'util-calculator', name: 'Calculator', icon: '🧮', category: 'Utilities', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'util-converter', name: 'Unit Converter', icon: '🔄', category: 'Utilities', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'util-currency', name: 'Currency Converter', icon: '💱', category: 'Utilities', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'util-weather', name: 'Weather Widget', icon: '🌤️', category: 'Utilities', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'util-clock', name: 'Clock Widget', icon: '🕐', category: 'Utilities', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'util-stopwatch', name: 'Stopwatch', icon: '⏱️', category: 'Utilities', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'util-password', name: 'Password Generator', icon: '🔐', category: 'Utilities', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'util-qr-scanner', name: 'QR Scanner', icon: '📷', category: 'Utilities', platforms: ['ios', 'android'] },
  { id: 'util-flashlight', name: 'Flashlight', icon: '🔦', category: 'Utilities', platforms: ['ios', 'android'] },
  { id: 'util-compass', name: 'Compass', icon: '🧭', category: 'Utilities', platforms: ['ios', 'android'] },
  { id: 'util-ruler', name: 'AR Ruler', icon: '📏', category: 'Utilities', platforms: ['ios', 'android'] },
  { id: 'util-level', name: 'Level', icon: '📐', category: 'Utilities', platforms: ['ios', 'android'] },
  // Health & Fitness
  { id: 'health-steps', name: 'Step Counter', icon: '👟', category: 'Health', platforms: ['ios', 'android'] },
  { id: 'health-heart', name: 'Heart Rate', icon: '❤️', category: 'Health', platforms: ['ios', 'android'] },
  { id: 'health-sleep', name: 'Sleep Tracker', icon: '😴', category: 'Health', platforms: ['ios', 'android'] },
  { id: 'health-water', name: 'Water Intake', icon: '💧', category: 'Health', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'health-calories', name: 'Calorie Counter', icon: '🔥', category: 'Health', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'health-weight', name: 'Weight Tracker', icon: '⚖️', category: 'Health', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'health-workout', name: 'Workout Card', icon: '💪', category: 'Health', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'health-meditation', name: 'Meditation Timer', icon: '🧘', category: 'Health', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'health-mood', name: 'Mood Tracker', icon: '😊', category: 'Health', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'health-bmi', name: 'BMI Calculator', icon: '📊', category: 'Health', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Education & Learning
  { id: 'edu-flashcard', name: 'Flashcard', icon: '🗂️', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'edu-quiz', name: 'Quiz Builder', icon: '❓', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'edu-progress', name: 'Learning Progress', icon: '📈', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'edu-course', name: 'Course Card', icon: '📚', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'edu-lesson', name: 'Lesson View', icon: '📖', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'edu-certificate', name: 'Certificate', icon: '🎓', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'edu-streak', name: 'Learning Streak', icon: '🔥', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'edu-vocabulary', name: 'Vocabulary Card', icon: '📝', category: 'Education', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Finance & Banking
  { id: 'fin-balance', name: 'Balance Card', icon: '💰', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-transaction', name: 'Transaction List', icon: '📋', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-expense', name: 'Expense Tracker', icon: '💸', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-budget', name: 'Budget Planner', icon: '📊', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-savings', name: 'Savings Goal', icon: '🎯', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-crypto', name: 'Crypto Ticker', icon: '₿', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-stock', name: 'Stock Chart', icon: '📈', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-invoice', name: 'Invoice', icon: '🧾', category: 'Finance', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fin-receipt', name: 'Receipt Scanner', icon: '🧾', category: 'Finance', platforms: ['ios', 'android'] },
  // Travel & Booking
  { id: 'travel-booking', name: 'Booking Card', icon: '🎫', category: 'Travel', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'travel-flight', name: 'Flight Tracker', icon: '✈️', category: 'Travel', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'travel-hotel', name: 'Hotel Card', icon: '🏨', category: 'Travel', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'travel-itinerary', name: 'Itinerary', icon: '📋', category: 'Travel', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'travel-passport', name: 'Passport Scan', icon: '🛂', category: 'Travel', platforms: ['ios', 'android'] },
  { id: 'travel-currency', name: 'Currency Exchange', icon: '💱', category: 'Travel', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'travel-reviews', name: 'Place Reviews', icon: '⭐', category: 'Travel', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Food & Delivery
  { id: 'food-menu', name: 'Menu Card', icon: '🍽️', category: 'Food', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'food-order', name: 'Order Card', icon: '📝', category: 'Food', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'food-restaurant', name: 'Restaurant Card', icon: '🍴', category: 'Food', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'food-delivery', name: 'Delivery Tracker', icon: '🚗', category: 'Food', platforms: ['web', 'ios', 'android'] },
  { id: 'food-recipe', name: 'Recipe Card', icon: '👨‍🍳', category: 'Food', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'food-nutrition', name: 'Nutrition Info', icon: '🥗', category: 'Food', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Music & Audio
  { id: 'music-player', name: 'Music Player', icon: '🎵', category: 'Music', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'music-playlist', name: 'Playlist', icon: '📃', category: 'Music', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'music-equalizer', name: 'Equalizer', icon: '🎚️', category: 'Music', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'music-podcast', name: 'Podcast Card', icon: '🎙️', category: 'Music', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'music-waveform', name: 'Waveform', icon: '📊', category: 'Music', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'music-lyrics', name: 'Lyrics View', icon: '🎤', category: 'Music', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Integrations & APIs
  { id: 'int-spotify', name: 'Spotify', icon: '🎧', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-youtube', name: 'YouTube', icon: '▶️', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-twitch', name: 'Twitch', icon: '🟣', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-discord', name: 'Discord', icon: '💬', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-slack', name: 'Slack', icon: '#️⃣', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-github', name: 'GitHub', icon: '🐙', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-notion', name: 'Notion', icon: '📝', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-airtable', name: 'Airtable', icon: '📊', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-zapier', name: 'Zapier', icon: '⚡', category: 'Integrations', platforms: ['web'] },
  { id: 'int-firebase', name: 'Firebase', icon: '🔥', category: 'Integrations', platforms: ['web', 'ios', 'android'] },
  { id: 'int-supabase', name: 'Supabase', icon: '⚡', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-stripe', name: 'Stripe', icon: '💳', category: 'Integrations', platforms: ['web', 'ios', 'android'] },
  { id: 'int-twilio', name: 'Twilio SMS', icon: '📱', category: 'Integrations', platforms: ['web', 'ios', 'android'] },
  { id: 'int-sendgrid', name: 'SendGrid Email', icon: '📧', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'int-algolia', name: 'Algolia Search', icon: '🔍', category: 'Integrations', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Smart Home & IoT
  { id: 'iot-thermostat', name: 'Thermostat', icon: '🌡️', category: 'Smart Home', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'iot-lights', name: 'Smart Lights', icon: '💡', category: 'Smart Home', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'iot-lock', name: 'Smart Lock', icon: '🔒', category: 'Smart Home', platforms: ['web', 'ios', 'android'] },
  { id: 'iot-camera', name: 'Security Camera', icon: '📹', category: 'Smart Home', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'iot-doorbell', name: 'Smart Doorbell', icon: '🔔', category: 'Smart Home', platforms: ['web', 'ios', 'android'] },
  { id: 'iot-speaker', name: 'Smart Speaker', icon: '🔊', category: 'Smart Home', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'iot-sensor', name: 'Sensor Reading', icon: '📡', category: 'Smart Home', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Blockchain & Web3
  { id: 'web3-wallet', name: 'Wallet Connect', icon: '👛', category: 'Web3', platforms: ['web', 'ios', 'android'] },
  { id: 'web3-nft', name: 'NFT Gallery', icon: '🖼️', category: 'Web3', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'web3-token', name: 'Token Balance', icon: '🪙', category: 'Web3', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'web3-transaction', name: 'Tx History', icon: '📜', category: 'Web3', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'web3-contract', name: 'Contract Call', icon: '📝', category: 'Web3', platforms: ['web', 'ios', 'android'] },
  { id: 'web3-mint', name: 'NFT Mint', icon: '🎨', category: 'Web3', platforms: ['web', 'ios', 'android'] },
  // Accessibility
  { id: 'a11y-screen-reader', name: 'Screen Reader', icon: '👁️', category: 'Accessibility', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'a11y-high-contrast', name: 'High Contrast', icon: '🌓', category: 'Accessibility', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'a11y-font-size', name: 'Font Size', icon: '🔤', category: 'Accessibility', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'a11y-color-blind', name: 'Color Blind Mode', icon: '🎨', category: 'Accessibility', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'a11y-voice-control', name: 'Voice Control', icon: '🎤', category: 'Accessibility', platforms: ['ios', 'android', 'desktop'] },
  // AR/VR & Immersive
  { id: 'ar-camera', name: 'AR Camera', icon: '📸', category: 'AR/VR', platforms: ['ios', 'android'] },
  { id: 'ar-object', name: 'AR Object', icon: '🧊', category: 'AR/VR', platforms: ['ios', 'android'] },
  { id: 'ar-face-filter', name: 'Face Filter', icon: '🎭', category: 'AR/VR', platforms: ['ios', 'android'] },
  { id: 'ar-surface', name: 'Surface Detection', icon: '📐', category: 'AR/VR', platforms: ['ios', 'android'] },
  { id: 'ar-measure', name: 'AR Measure', icon: '📏', category: 'AR/VR', platforms: ['ios', 'android'] },
  { id: 'vr-viewer', name: 'VR Viewer', icon: '🥽', category: 'AR/VR', platforms: ['web', 'ios', 'android'] },
  { id: 'ar-portal', name: 'AR Portal', icon: '🚪', category: 'AR/VR', platforms: ['ios', 'android'] },
  // Communication
  { id: 'comm-video-call', name: 'Video Call', icon: '📹', category: 'Communication', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'comm-voice-call', name: 'Voice Call', icon: '📞', category: 'Communication', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'comm-screen-share', name: 'Screen Share', icon: '🖥️', category: 'Communication', platforms: ['web', 'desktop'] },
  { id: 'comm-chat-room', name: 'Chat Room', icon: '💬', category: 'Communication', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'comm-email', name: 'Email Composer', icon: '📧', category: 'Communication', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'comm-sms', name: 'SMS Sender', icon: '💬', category: 'Communication', platforms: ['ios', 'android'] },
  { id: 'comm-contact-picker', name: 'Contact Picker', icon: '📇', category: 'Communication', platforms: ['ios', 'android'] },
  // Security & Privacy
  { id: 'sec-encrypt', name: 'Data Encrypt', icon: '🔐', category: 'Security', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sec-2fa', name: 'Two-Factor Auth', icon: '🔑', category: 'Security', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sec-keychain', name: 'Keychain Access', icon: '🔗', category: 'Security', platforms: ['ios', 'android', 'desktop'] },
  { id: 'sec-privacy-mode', name: 'Privacy Mode', icon: '🕶️', category: 'Security', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sec-app-lock', name: 'App Lock', icon: '🔒', category: 'Security', platforms: ['ios', 'android'] },
  { id: 'sec-vpn-status', name: 'VPN Status', icon: '🛡️', category: 'Security', platforms: ['ios', 'android', 'desktop'] },
  // Events & Booking
  { id: 'event-calendar', name: 'Event Calendar', icon: '📅', category: 'Events', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'event-ticket', name: 'Event Ticket', icon: '🎫', category: 'Events', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'event-rsvp', name: 'RSVP Form', icon: '✉️', category: 'Events', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'event-countdown', name: 'Event Countdown', icon: '⏳', category: 'Events', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'event-seat-picker', name: 'Seat Picker', icon: '💺', category: 'Events', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'event-schedule', name: 'Event Schedule', icon: '📋', category: 'Events', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Documents & Files
  { id: 'doc-pdf-viewer', name: 'PDF Viewer', icon: '📄', category: 'Documents', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'doc-scanner', name: 'Document Scanner', icon: '📷', category: 'Documents', platforms: ['ios', 'android'] },
  { id: 'doc-signature', name: 'Digital Signature', icon: '✍️', category: 'Documents', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'doc-editor', name: 'Rich Text Editor', icon: '📝', category: 'Documents', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'doc-spreadsheet', name: 'Spreadsheet', icon: '📊', category: 'Documents', platforms: ['web', 'desktop'] },
  { id: 'doc-export', name: 'Export Options', icon: '📤', category: 'Documents', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Real Estate & Property
  { id: 'realestate-listing', name: 'Property Listing', icon: '🏠', category: 'Real Estate', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'realestate-tour', name: 'Virtual Tour', icon: '🎥', category: 'Real Estate', platforms: ['web', 'ios', 'android'] },
  { id: 'realestate-mortgage', name: 'Mortgage Calculator', icon: '🏦', category: 'Real Estate', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'realestate-filter', name: 'Property Filter', icon: '🔍', category: 'Real Estate', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'realestate-agent', name: 'Agent Card', icon: '👔', category: 'Real Estate', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Automotive
  { id: 'auto-vehicle', name: 'Vehicle Card', icon: '🚗', category: 'Automotive', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auto-fuel', name: 'Fuel Tracker', icon: '⛽', category: 'Automotive', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auto-maintenance', name: 'Maintenance Log', icon: '🔧', category: 'Automotive', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'auto-parking', name: 'Parking Finder', icon: '🅿️', category: 'Automotive', platforms: ['web', 'ios', 'android'] },
  { id: 'auto-charging', name: 'EV Charging', icon: '🔋', category: 'Automotive', platforms: ['web', 'ios', 'android'] },
  { id: 'auto-obd', name: 'OBD Scanner', icon: '📟', category: 'Automotive', platforms: ['ios', 'android'] },
  // Pets & Animals
  { id: 'pet-profile', name: 'Pet Profile', icon: '🐕', category: 'Pets', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pet-health', name: 'Pet Health', icon: '💊', category: 'Pets', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pet-feeding', name: 'Feeding Schedule', icon: '🍖', category: 'Pets', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pet-vet', name: 'Vet Appointments', icon: '🏥', category: 'Pets', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pet-tracker', name: 'Pet Tracker', icon: '📍', category: 'Pets', platforms: ['ios', 'android'] },
  // Dating & Social
  { id: 'dating-profile', name: 'Dating Profile', icon: '💕', category: 'Dating', platforms: ['web', 'ios', 'android'] },
  { id: 'dating-swipe', name: 'Swipe Card', icon: '💘', category: 'Dating', platforms: ['web', 'ios', 'android'] },
  { id: 'dating-match', name: 'Match View', icon: '💑', category: 'Dating', platforms: ['web', 'ios', 'android'] },
  { id: 'dating-chat', name: 'Dating Chat', icon: '💬', category: 'Dating', platforms: ['web', 'ios', 'android'] },
  { id: 'dating-icebreaker', name: 'Icebreaker', icon: '❄️', category: 'Dating', platforms: ['web', 'ios', 'android'] },
  // Parenting & Family
  { id: 'family-tree', name: 'Family Tree', icon: '🌳', category: 'Family', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'family-chores', name: 'Chore Chart', icon: '✅', category: 'Family', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'family-allowance', name: 'Allowance Tracker', icon: '💵', category: 'Family', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'family-location', name: 'Family Location', icon: '📍', category: 'Family', platforms: ['ios', 'android'] },
  { id: 'baby-tracker', name: 'Baby Tracker', icon: '👶', category: 'Family', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Sports & Fitness
  { id: 'sports-score', name: 'Live Score', icon: '🏆', category: 'Sports', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sports-team', name: 'Team Card', icon: '⚽', category: 'Sports', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sports-stats', name: 'Player Stats', icon: '📊', category: 'Sports', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sports-schedule', name: 'Match Schedule', icon: '📅', category: 'Sports', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sports-betting', name: 'Odds Display', icon: '🎰', category: 'Sports', platforms: ['web', 'ios', 'android', 'desktop'] },
  // News & Content
  { id: 'news-feed', name: 'News Feed', icon: '📰', category: 'News', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'news-article', name: 'Article View', icon: '📖', category: 'News', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'news-breaking', name: 'Breaking News', icon: '🚨', category: 'News', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'news-category', name: 'Category Filter', icon: '🏷️', category: 'News', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'news-bookmark', name: 'Save Article', icon: '🔖', category: 'News', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Printing & Scanning
  { id: 'print-preview', name: 'Print Preview', icon: '🖨️', category: 'Printing', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'print-label', name: 'Label Maker', icon: '🏷️', category: 'Printing', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'print-barcode', name: 'Barcode Generator', icon: '📊', category: 'Printing', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'scan-ocr', name: 'OCR Scanner', icon: '🔍', category: 'Printing', platforms: ['web', 'ios', 'android'] },
  // Streaming & Video
  { id: 'video-player', name: 'Video Player', icon: '▶️', category: 'Streaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'video-thumbnail', name: 'Video Thumbnail', icon: '🎬', category: 'Streaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'video-playlist', name: 'Video Playlist', icon: '📺', category: 'Streaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'live-stream', name: 'Live Stream', icon: '🔴', category: 'Streaming', platforms: ['web', 'ios', 'android'] },
  { id: 'video-upload', name: 'Video Upload', icon: '📤', category: 'Streaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'video-comment', name: 'Video Comments', icon: '💬', category: 'Streaming', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Photography
  { id: 'photo-editor', name: 'Photo Editor', icon: '🖼️', category: 'Photography', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'photo-filter', name: 'Photo Filter', icon: '🎨', category: 'Photography', platforms: ['web', 'ios', 'android'] },
  { id: 'photo-collage', name: 'Photo Collage', icon: '🖼️', category: 'Photography', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'photo-gallery', name: 'Photo Gallery', icon: '📸', category: 'Photography', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'photo-crop', name: 'Photo Crop', icon: '✂️', category: 'Photography', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Booking & Reservations
  { id: 'booking-calendar', name: 'Booking Calendar', icon: '📅', category: 'Booking', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'booking-slot', name: 'Time Slot Picker', icon: '⏰', category: 'Booking', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'booking-confirm', name: 'Booking Confirmation', icon: '✅', category: 'Booking', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'booking-service', name: 'Service Selector', icon: '🛎️', category: 'Booking', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'booking-staff', name: 'Staff Picker', icon: '👤', category: 'Booking', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Reviews & Ratings
  { id: 'review-card', name: 'Review Card', icon: '⭐', category: 'Reviews', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'review-form', name: 'Review Form', icon: '✍️', category: 'Reviews', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'review-summary', name: 'Rating Summary', icon: '📊', category: 'Reviews', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'review-photos', name: 'Review Photos', icon: '📷', category: 'Reviews', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'review-helpful', name: 'Helpful Vote', icon: '👍', category: 'Reviews', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Loyalty & Rewards
  { id: 'loyalty-card', name: 'Loyalty Card', icon: '💳', category: 'Loyalty', platforms: ['web', 'ios', 'android'] },
  { id: 'loyalty-points', name: 'Points Balance', icon: '🎯', category: 'Loyalty', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'loyalty-tier', name: 'Tier Status', icon: '🏅', category: 'Loyalty', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'loyalty-reward', name: 'Reward Card', icon: '🎁', category: 'Loyalty', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'loyalty-stamp', name: 'Stamp Card', icon: '📍', category: 'Loyalty', platforms: ['web', 'ios', 'android'] },
  // Surveys & Polls
  { id: 'survey-form', name: 'Survey Form', icon: '📋', category: 'Surveys', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'survey-rating', name: 'NPS Rating', icon: '📈', category: 'Surveys', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'survey-choice', name: 'Multiple Choice', icon: '☑️', category: 'Surveys', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'survey-scale', name: 'Scale Question', icon: '📏', category: 'Surveys', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'poll-live', name: 'Live Poll', icon: '📊', category: 'Surveys', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Delivery & Shipping
  { id: 'delivery-tracker', name: 'Delivery Tracker', icon: '📦', category: 'Delivery', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'delivery-map', name: 'Delivery Map', icon: '🗺️', category: 'Delivery', platforms: ['web', 'ios', 'android'] },
  { id: 'delivery-eta', name: 'ETA Display', icon: '⏱️', category: 'Delivery', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'delivery-address', name: 'Address Form', icon: '🏠', category: 'Delivery', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'delivery-driver', name: 'Driver Info', icon: '🚚', category: 'Delivery', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Marketplace
  { id: 'market-listing', name: 'Listing Card', icon: '🏷️', category: 'Marketplace', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'market-seller', name: 'Seller Profile', icon: '👤', category: 'Marketplace', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'market-offer', name: 'Make Offer', icon: '💰', category: 'Marketplace', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'market-bid', name: 'Bid Card', icon: '🔨', category: 'Marketplace', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'market-filter', name: 'Market Filter', icon: '🔍', category: 'Marketplace', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Food & Restaurant
  { id: 'menu-item', name: 'Menu Item', icon: '🍽️', category: 'Restaurant', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'menu-category', name: 'Menu Category', icon: '📑', category: 'Restaurant', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'table-booking', name: 'Table Booking', icon: '🪑', category: 'Restaurant', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'order-summary', name: 'Order Summary', icon: '📝', category: 'Restaurant', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tip-selector', name: 'Tip Selector', icon: '💵', category: 'Restaurant', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Fitness & Workout
  { id: 'workout-card', name: 'Workout Card', icon: '🏋️', category: 'Fitness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'exercise-timer', name: 'Exercise Timer', icon: '⏱️', category: 'Fitness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'rep-counter', name: 'Rep Counter', icon: '🔢', category: 'Fitness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'workout-plan', name: 'Workout Plan', icon: '📋', category: 'Fitness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'muscle-map', name: 'Muscle Map', icon: '🦴', category: 'Fitness', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Meditation & Mindfulness
  { id: 'meditation-timer', name: 'Meditation Timer', icon: '🧘', category: 'Mindfulness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'breathing-guide', name: 'Breathing Guide', icon: '🌬️', category: 'Mindfulness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'mood-tracker', name: 'Mood Tracker', icon: '😊', category: 'Mindfulness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'gratitude-journal', name: 'Gratitude Journal', icon: '📓', category: 'Mindfulness', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sleep-sounds', name: 'Sleep Sounds', icon: '🌙', category: 'Mindfulness', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Language Learning
  { id: 'vocab-card', name: 'Vocabulary Card', icon: '📚', category: 'Language', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pronunciation', name: 'Pronunciation', icon: '🗣️', category: 'Language', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'grammar-quiz', name: 'Grammar Quiz', icon: '✏️', category: 'Language', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'translation-card', name: 'Translation Card', icon: '🌐', category: 'Language', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'streak-counter', name: 'Streak Counter', icon: '🔥', category: 'Language', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Job & Career
  { id: 'job-card', name: 'Job Card', icon: '💼', category: 'Jobs', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'resume-upload', name: 'Resume Upload', icon: '📄', category: 'Jobs', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'job-filter', name: 'Job Filter', icon: '🔍', category: 'Jobs', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'company-card', name: 'Company Card', icon: '🏢', category: 'Jobs', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'interview-scheduler', name: 'Interview Scheduler', icon: '📅', category: 'Jobs', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Recipes & Cooking
  { id: 'recipe-card', name: 'Recipe Card', icon: '👨‍🍳', category: 'Recipes', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ingredient-list', name: 'Ingredient List', icon: '🥗', category: 'Recipes', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'cooking-timer', name: 'Cooking Timer', icon: '⏰', category: 'Recipes', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'step-by-step', name: 'Step by Step', icon: '📝', category: 'Recipes', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'nutrition-info', name: 'Nutrition Info', icon: '🍎', category: 'Recipes', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Housing & Rent
  { id: 'property-card', name: 'Property Card', icon: '🏠', category: 'Housing', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'rent-payment', name: 'Rent Payment', icon: '💳', category: 'Housing', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'maintenance-request', name: 'Maintenance Request', icon: '🔧', category: 'Housing', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lease-info', name: 'Lease Info', icon: '📜', category: 'Housing', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'roommate-finder', name: 'Roommate Finder', icon: '👥', category: 'Housing', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Tickets & Support
  { id: 'ticket-card', name: 'Support Ticket', icon: '🎫', category: 'Support', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ticket-form', name: 'New Ticket Form', icon: '📝', category: 'Support', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'ticket-status', name: 'Ticket Status', icon: '📊', category: 'Support', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'faq-accordion', name: 'FAQ Accordion', icon: '❓', category: 'Support', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'live-chat', name: 'Live Chat', icon: '💬', category: 'Support', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Crypto & Trading
  { id: 'crypto-price', name: 'Crypto Price', icon: '💰', category: 'Crypto', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'crypto-chart', name: 'Crypto Chart', icon: '📈', category: 'Crypto', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'crypto-swap', name: 'Token Swap', icon: '🔄', category: 'Crypto', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'crypto-portfolio', name: 'Portfolio View', icon: '💼', category: 'Crypto', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'crypto-alert', name: 'Price Alert', icon: '🔔', category: 'Crypto', platforms: ['web', 'ios', 'android', 'desktop'] },
  // E-Learning & Courses
  { id: 'course-card', name: 'Course Card', icon: '📚', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lesson-player', name: 'Lesson Player', icon: '▶️', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'quiz-engine', name: 'Quiz Engine', icon: '❓', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'certificate-view', name: 'Certificate', icon: '🏆', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'progress-tracker', name: 'Course Progress', icon: '📊', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'discussion-forum', name: 'Discussion Forum', icon: '💬', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'assignment-submit', name: 'Assignment Submit', icon: '📤', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'instructor-card', name: 'Instructor Card', icon: '👨‍🏫', category: 'E-Learning', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Scheduling & Calendar
  { id: 'week-view', name: 'Week View', icon: '📅', category: 'Calendar', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'month-view', name: 'Month View', icon: '📆', category: 'Calendar', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'day-agenda', name: 'Day Agenda', icon: '📋', category: 'Calendar', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'event-create', name: 'Event Creator', icon: '➕', category: 'Calendar', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'recurring-event', name: 'Recurring Event', icon: '🔄', category: 'Calendar', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'availability-picker', name: 'Availability Picker', icon: '✅', category: 'Calendar', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'timezone-selector', name: 'Timezone Selector', icon: '🌍', category: 'Calendar', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Social Media Management
  { id: 'post-composer', name: 'Post Composer', icon: '✍️', category: 'Social Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'post-scheduler', name: 'Post Scheduler', icon: '⏰', category: 'Social Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'analytics-dashboard', name: 'Social Analytics', icon: '📈', category: 'Social Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'hashtag-manager', name: 'Hashtag Manager', icon: '#️⃣', category: 'Social Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'engagement-tracker', name: 'Engagement Tracker', icon: '❤️', category: 'Social Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'content-calendar', name: 'Content Calendar', icon: '📅', category: 'Social Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  // CRM & Sales
  { id: 'contact-card', name: 'Contact Card', icon: '👤', category: 'CRM', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'deal-pipeline', name: 'Deal Pipeline', icon: '📊', category: 'CRM', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lead-form', name: 'Lead Form', icon: '📝', category: 'CRM', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'activity-timeline', name: 'Activity Timeline', icon: '📋', category: 'CRM', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sales-forecast', name: 'Sales Forecast', icon: '📈', category: 'CRM', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'email-tracker', name: 'Email Tracker', icon: '📧', category: 'CRM', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'meeting-scheduler', name: 'Meeting Scheduler', icon: '🗓️', category: 'CRM', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Inventory & Warehouse
  { id: 'inventory-item', name: 'Inventory Item', icon: '📦', category: 'Inventory', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'stock-level', name: 'Stock Level', icon: '📊', category: 'Inventory', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'barcode-scanner', name: 'Barcode Scanner', icon: '📷', category: 'Inventory', platforms: ['ios', 'android'] },
  { id: 'reorder-alert', name: 'Reorder Alert', icon: '⚠️', category: 'Inventory', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'shipment-tracker', name: 'Shipment Tracker', icon: '🚚', category: 'Inventory', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'warehouse-map', name: 'Warehouse Map', icon: '🗺️', category: 'Inventory', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Project Management
  { id: 'task-board', name: 'Task Board', icon: '📋', category: 'Projects', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'gantt-chart', name: 'Gantt Chart', icon: '📊', category: 'Projects', platforms: ['web', 'desktop'] },
  { id: 'sprint-board', name: 'Sprint Board', icon: '🏃', category: 'Projects', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'burndown-chart', name: 'Burndown Chart', icon: '📉', category: 'Projects', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'team-workload', name: 'Team Workload', icon: '👥', category: 'Projects', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'milestone-tracker', name: 'Milestone Tracker', icon: '🎯', category: 'Projects', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'time-tracker', name: 'Time Tracker', icon: '⏱️', category: 'Projects', platforms: ['web', 'ios', 'android', 'desktop'] },
  // HR & Team
  { id: 'employee-card', name: 'Employee Card', icon: '👤', category: 'HR', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'org-chart', name: 'Org Chart', icon: '🏢', category: 'HR', platforms: ['web', 'desktop'] },
  { id: 'leave-request', name: 'Leave Request', icon: '🏖️', category: 'HR', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'timesheet', name: 'Timesheet', icon: '⏰', category: 'HR', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'payslip-view', name: 'Payslip View', icon: '💵', category: 'HR', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'onboarding-checklist', name: 'Onboarding Checklist', icon: '✅', category: 'HR', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'performance-review', name: 'Performance Review', icon: '📊', category: 'HR', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Legal & Contracts
  { id: 'contract-view', name: 'Contract View', icon: '📄', category: 'Legal', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'e-signature', name: 'E-Signature', icon: '✍️', category: 'Legal', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'nda-template', name: 'NDA Template', icon: '🔒', category: 'Legal', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'terms-accept', name: 'Terms Accept', icon: '☑️', category: 'Legal', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'compliance-check', name: 'Compliance Check', icon: '✅', category: 'Legal', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Medical & Healthcare
  { id: 'patient-card', name: 'Patient Card', icon: '🏥', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'appointment-book', name: 'Appointment Book', icon: '📅', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'prescription-view', name: 'Prescription View', icon: '💊', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'vitals-monitor', name: 'Vitals Monitor', icon: '❤️', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'medical-history', name: 'Medical History', icon: '📋', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lab-results', name: 'Lab Results', icon: '🔬', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'telemedicine', name: 'Telemedicine', icon: '📹', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'insurance-card', name: 'Insurance Card', icon: '💳', category: 'Healthcare', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Agriculture & Farming
  { id: 'crop-monitor', name: 'Crop Monitor', icon: '🌾', category: 'Agriculture', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'weather-station', name: 'Weather Station', icon: '🌤️', category: 'Agriculture', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'soil-sensor', name: 'Soil Sensor', icon: '🌱', category: 'Agriculture', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'irrigation-control', name: 'Irrigation Control', icon: '💧', category: 'Agriculture', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'harvest-tracker', name: 'Harvest Tracker', icon: '🚜', category: 'Agriculture', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'livestock-card', name: 'Livestock Card', icon: '🐄', category: 'Agriculture', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Construction & Architecture
  { id: 'blueprint-view', name: 'Blueprint View', icon: '📐', category: 'Construction', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'site-progress', name: 'Site Progress', icon: '🏗️', category: 'Construction', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'material-tracker', name: 'Material Tracker', icon: '🧱', category: 'Construction', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'safety-checklist', name: 'Safety Checklist', icon: '⚠️', category: 'Construction', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'contractor-card', name: 'Contractor Card', icon: '👷', category: 'Construction', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'inspection-report', name: 'Inspection Report', icon: '📋', category: 'Construction', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Logistics & Fleet
  { id: 'fleet-map', name: 'Fleet Map', icon: '🗺️', category: 'Logistics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'vehicle-tracker', name: 'Vehicle Tracker', icon: '🚛', category: 'Logistics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'route-optimizer', name: 'Route Optimizer', icon: '🛣️', category: 'Logistics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'driver-status', name: 'Driver Status', icon: '👤', category: 'Logistics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fuel-log', name: 'Fuel Log', icon: '⛽', category: 'Logistics', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'delivery-proof', name: 'Delivery Proof', icon: '📸', category: 'Logistics', platforms: ['ios', 'android'] },
  // Energy & Utilities
  { id: 'energy-meter', name: 'Energy Meter', icon: '⚡', category: 'Energy', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'solar-monitor', name: 'Solar Monitor', icon: '☀️', category: 'Energy', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'consumption-chart', name: 'Consumption Chart', icon: '📊', category: 'Energy', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'bill-estimator', name: 'Bill Estimator', icon: '💰', category: 'Energy', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'outage-map', name: 'Outage Map', icon: '🗺️', category: 'Energy', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Beauty & Wellness
  { id: 'appointment-salon', name: 'Salon Appointment', icon: '💇', category: 'Beauty', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'service-menu', name: 'Service Menu', icon: '📋', category: 'Beauty', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'stylist-card', name: 'Stylist Card', icon: '✨', category: 'Beauty', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'before-after', name: 'Before/After', icon: '📸', category: 'Beauty', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'product-recommend', name: 'Product Recommend', icon: '💄', category: 'Beauty', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Entertainment & Events
  { id: 'concert-ticket', name: 'Concert Ticket', icon: '🎫', category: 'Entertainment', platforms: ['web', 'ios', 'android'] },
  { id: 'movie-card', name: 'Movie Card', icon: '🎬', category: 'Entertainment', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'showtime-picker', name: 'Showtime Picker', icon: '🕐', category: 'Entertainment', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'seat-selector', name: 'Seat Selector', icon: '💺', category: 'Entertainment', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'event-lineup', name: 'Event Lineup', icon: '🎤', category: 'Entertainment', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'venue-map', name: 'Venue Map', icon: '🗺️', category: 'Entertainment', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Charity & Nonprofit
  { id: 'donation-form', name: 'Donation Form', icon: '💝', category: 'Nonprofit', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'fundraiser-card', name: 'Fundraiser Card', icon: '🎗️', category: 'Nonprofit', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'impact-counter', name: 'Impact Counter', icon: '📊', category: 'Nonprofit', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'volunteer-signup', name: 'Volunteer Signup', icon: '🙋', category: 'Nonprofit', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'donor-wall', name: 'Donor Wall', icon: '🏆', category: 'Nonprofit', platforms: ['web', 'ios', 'android', 'desktop'] },
  // Sustainability & Environment
  { id: 'carbon-tracker', name: 'Carbon Tracker', icon: '🌍', category: 'Sustainability', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'recycling-guide', name: 'Recycling Guide', icon: '♻️', category: 'Sustainability', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'eco-score', name: 'Eco Score', icon: '🌱', category: 'Sustainability', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'air-quality', name: 'Air Quality', icon: '💨', category: 'Sustainability', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'water-usage', name: 'Water Usage', icon: '💧', category: 'Sustainability', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // ECOMMERCE & RETAIL (Advanced)
  // ============================================================================
  { id: 'product-grid', name: 'Product Grid', icon: '🛍️', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'product-detail', name: 'Product Detail', icon: '📦', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'product-variants', name: 'Product Variants', icon: '🎨', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'product-reviews', name: 'Product Reviews', icon: '⭐', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'shopping-cart', name: 'Shopping Cart', icon: '🛒', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'checkout-flow', name: 'Checkout Flow', icon: '💳', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'order-tracking', name: 'Order Tracking', icon: '📍', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'order-history', name: 'Order History', icon: '📋', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'wishlist-grid', name: 'Wishlist', icon: '❤️', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'coupon-input', name: 'Coupon Input', icon: '🎟️', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'size-guide', name: 'Size Guide', icon: '📏', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'inventory-badge', name: 'Stock Badge', icon: '📊', category: 'E-Commerce', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // FORMS & DATA ENTRY (Advanced)
  // ============================================================================
  { id: 'form-wizard', name: 'Form Wizard', icon: '🧙', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'form-validation', name: 'Validation Message', icon: '⚠️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'file-upload', name: 'File Upload', icon: '📤', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image-upload', name: 'Image Upload', icon: '🖼️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'multi-select', name: 'Multi Select', icon: '☑️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tag-input', name: 'Tag Input', icon: '🏷️', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'rich-text-editor', name: 'Rich Text Editor', icon: '📝', category: 'Forms', platforms: ['web', 'desktop'] },
  { id: 'code-editor', name: 'Code Editor', icon: '👨‍💻', category: 'Forms', platforms: ['web', 'desktop'] },
  { id: 'markdown-editor', name: 'Markdown Editor', icon: '📄', category: 'Forms', platforms: ['web', 'desktop'] },
  { id: 'address-autocomplete', name: 'Address Autocomplete', icon: '🏠', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'phone-input', name: 'Phone Input', icon: '📞', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'credit-card-input', name: 'Credit Card Input', icon: '💳', category: 'Forms', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // CHARTS & DATA VISUALIZATION
  // ============================================================================
  { id: 'line-chart', name: 'Line Chart', icon: '📈', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'bar-chart', name: 'Bar Chart', icon: '📊', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pie-chart', name: 'Pie Chart', icon: '🥧', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'donut-chart', name: 'Donut Chart', icon: '🍩', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'area-chart', name: 'Area Chart', icon: '📉', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'scatter-plot', name: 'Scatter Plot', icon: '⚫', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'radar-chart', name: 'Radar Chart', icon: '🕸️', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'heatmap', name: 'Heatmap', icon: '🔥', category: 'Charts', platforms: ['web', 'desktop'] },
  { id: 'treemap', name: 'Treemap', icon: '🌳', category: 'Charts', platforms: ['web', 'desktop'] },
  { id: 'sparkline', name: 'Sparkline', icon: '✨', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'gauge-chart', name: 'Gauge Chart', icon: '🎯', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'funnel-chart', name: 'Funnel Chart', icon: '🔻', category: 'Charts', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // TABLES & DATA GRIDS
  // ============================================================================
  { id: 'data-table', name: 'Data Table', icon: '📋', category: 'Tables', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'sortable-table', name: 'Sortable Table', icon: '↕️', category: 'Tables', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'filterable-table', name: 'Filterable Table', icon: '🔍', category: 'Tables', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'paginated-table', name: 'Paginated Table', icon: '📄', category: 'Tables', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'expandable-row', name: 'Expandable Row', icon: '📂', category: 'Tables', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'editable-cell', name: 'Editable Cell', icon: '✏️', category: 'Tables', platforms: ['web', 'desktop'] },
  { id: 'column-resize', name: 'Resizable Columns', icon: '↔️', category: 'Tables', platforms: ['web', 'desktop'] },
  { id: 'row-selection', name: 'Row Selection', icon: '☑️', category: 'Tables', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // NAVIGATION & MENUS
  // ============================================================================
  { id: 'top-navbar', name: 'Top Navbar', icon: '🔝', category: 'Navigation', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'side-navbar', name: 'Side Navbar', icon: '📑', category: 'Navigation', platforms: ['web', 'desktop'] },
  { id: 'bottom-tabs', name: 'Bottom Tabs', icon: '⬇️', category: 'Navigation', platforms: ['ios', 'android'] },
  { id: 'breadcrumbs', name: 'Breadcrumbs', icon: '🍞', category: 'Navigation', platforms: ['web', 'desktop'] },
  { id: 'pagination', name: 'Pagination', icon: '📖', category: 'Navigation', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'step-indicator', name: 'Step Indicator', icon: '🔢', category: 'Navigation', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tab-bar', name: 'Tab Bar', icon: '📑', category: 'Navigation', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'mega-menu', name: 'Mega Menu', icon: '📚', category: 'Navigation', platforms: ['web', 'desktop'] },
  { id: 'context-menu', name: 'Context Menu', icon: '📋', category: 'Navigation', platforms: ['web', 'desktop'] },
  { id: 'command-palette', name: 'Command Palette', icon: '⌘', category: 'Navigation', platforms: ['web', 'desktop'] },

  // ============================================================================
  // NOTIFICATIONS & ALERTS
  // ============================================================================
  { id: 'toast-notification', name: 'Toast', icon: '🍞', category: 'Notifications', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'alert-banner', name: 'Alert Banner', icon: '⚠️', category: 'Notifications', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'snackbar', name: 'Snackbar', icon: '🥪', category: 'Notifications', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'notification-badge', name: 'Notification Badge', icon: '🔴', category: 'Notifications', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'notification-center', name: 'Notification Center', icon: '🔔', category: 'Notifications', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'push-prompt', name: 'Push Prompt', icon: '📱', category: 'Notifications', platforms: ['web', 'ios', 'android'] },
  { id: 'in-app-message', name: 'In-App Message', icon: '💬', category: 'Notifications', platforms: ['ios', 'android'] },

  // ============================================================================
  // MODALS & OVERLAYS
  // ============================================================================
  { id: 'modal-dialog', name: 'Modal Dialog', icon: '🪟', category: 'Modals', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'confirmation-dialog', name: 'Confirmation Dialog', icon: '❓', category: 'Modals', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'action-sheet', name: 'Action Sheet', icon: '📋', category: 'Modals', platforms: ['ios', 'android'] },
  { id: 'bottom-sheet', name: 'Bottom Sheet', icon: '📄', category: 'Modals', platforms: ['ios', 'android'] },
  { id: 'full-screen-modal', name: 'Fullscreen Modal', icon: '🖥️', category: 'Modals', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lightbox', name: 'Lightbox', icon: '🔦', category: 'Modals', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'popover', name: 'Popover', icon: '💭', category: 'Modals', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tooltip-advanced', name: 'Advanced Tooltip', icon: '💡', category: 'Modals', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // LOADING & PROGRESS
  // ============================================================================
  { id: 'loading-spinner', name: 'Loading Spinner', icon: '🔄', category: 'Loading', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'progress-bar', name: 'Progress Bar', icon: '📊', category: 'Loading', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'progress-circle', name: 'Progress Circle', icon: '⭕', category: 'Loading', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'skeleton-loader', name: 'Skeleton Loader', icon: '💀', category: 'Loading', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'shimmer-effect', name: 'Shimmer Effect', icon: '✨', category: 'Loading', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pull-to-refresh', name: 'Pull to Refresh', icon: '🔃', category: 'Loading', platforms: ['ios', 'android'] },
  { id: 'infinite-scroll', name: 'Infinite Scroll', icon: '♾️', category: 'Loading', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'lazy-load', name: 'Lazy Load', icon: '😴', category: 'Loading', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // MEDIA & FILES
  // ============================================================================
  { id: 'image-gallery', name: 'Image Gallery', icon: '🖼️', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image-carousel', name: 'Image Carousel', icon: '🎠', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'video-player', name: 'Video Player', icon: '▶️', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'audio-player', name: 'Audio Player', icon: '🎵', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'pdf-viewer', name: 'PDF Viewer', icon: '📄', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'document-preview', name: 'Document Preview', icon: '📃', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'file-manager', name: 'File Manager', icon: '📁', category: 'Media', platforms: ['web', 'desktop'] },
  { id: 'image-cropper', name: 'Image Cropper', icon: '✂️', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'image-filter', name: 'Image Filter', icon: '🎨', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'qr-generator', name: 'QR Generator', icon: '📱', category: 'Media', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'barcode-scanner', name: 'Barcode Scanner', icon: '📷', category: 'Media', platforms: ['ios', 'android'] },

  // ============================================================================
  // MAPS & LOCATION
  // ============================================================================
  { id: 'interactive-map', name: 'Interactive Map', icon: '🗺️', category: 'Maps', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'map-marker', name: 'Map Marker', icon: '📍', category: 'Maps', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'map-cluster', name: 'Map Cluster', icon: '🔵', category: 'Maps', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'route-display', name: 'Route Display', icon: '🛣️', category: 'Maps', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'geofence', name: 'Geofence', icon: '⭕', category: 'Maps', platforms: ['ios', 'android'] },
  { id: 'location-picker', name: 'Location Picker', icon: '🎯', category: 'Maps', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'address-search', name: 'Address Search', icon: '🔍', category: 'Maps', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'store-locator', name: 'Store Locator', icon: '🏪', category: 'Maps', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // SOCIAL & SHARING
  // ============================================================================
  { id: 'share-button', name: 'Share Button', icon: '📤', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'social-share', name: 'Social Share', icon: '🔗', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'like-button', name: 'Like Button', icon: '❤️', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'bookmark-button', name: 'Bookmark Button', icon: '🔖', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'comment-section', name: 'Comment Section', icon: '💬', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'reaction-picker', name: 'Reaction Picker', icon: '😀', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'user-mention', name: 'User Mention', icon: '@', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'hashtag-link', name: 'Hashtag Link', icon: '#️⃣', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'follow-button', name: 'Follow Button', icon: '➕', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'user-profile-card', name: 'User Profile Card', icon: '👤', category: 'Social', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // MESSAGING & CHAT
  // ============================================================================
  { id: 'chat-message', name: 'Chat Message', icon: '💬', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'chat-input', name: 'Chat Input', icon: '⌨️', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'chat-bubble', name: 'Chat Bubble', icon: '💭', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'chat-list', name: 'Chat List', icon: '📝', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'typing-indicator', name: 'Typing Indicator', icon: '✍️', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'read-receipt', name: 'Read Receipt', icon: '✅', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'message-reactions', name: 'Message Reactions', icon: '😊', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'voice-message', name: 'Voice Message', icon: '🎤', category: 'Chat', platforms: ['ios', 'android'] },
  { id: 'attachment-picker', name: 'Attachment Picker', icon: '📎', category: 'Chat', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // AUTHENTICATION & SECURITY
  // ============================================================================
  { id: 'login-form', name: 'Login Form', icon: '🔐', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'register-form', name: 'Register Form', icon: '📝', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'forgot-password', name: 'Forgot Password', icon: '🔑', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'otp-input', name: 'OTP Input', icon: '🔢', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'biometric-auth', name: 'Biometric Auth', icon: '👆', category: 'Auth', platforms: ['ios', 'android'] },
  { id: 'social-login-buttons', name: 'Social Login Buttons', icon: '🔗', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'password-strength', name: 'Password Strength', icon: '💪', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'captcha', name: 'Captcha', icon: '🤖', category: 'Auth', platforms: ['web'] },
  { id: 'session-timeout', name: 'Session Timeout', icon: '⏰', category: 'Auth', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // ONBOARDING & TUTORIALS
  // ============================================================================
  { id: 'onboarding-carousel', name: 'Onboarding Carousel', icon: '📱', category: 'Onboarding', platforms: ['ios', 'android'] },
  { id: 'feature-tour', name: 'Feature Tour', icon: '🎯', category: 'Onboarding', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'tooltip-guide', name: 'Tooltip Guide', icon: '💡', category: 'Onboarding', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'checklist-progress', name: 'Checklist Progress', icon: '✅', category: 'Onboarding', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'welcome-screen', name: 'Welcome Screen', icon: '👋', category: 'Onboarding', platforms: ['ios', 'android'] },
  { id: 'permission-request', name: 'Permission Request', icon: '🔓', category: 'Onboarding', platforms: ['ios', 'android'] },
  { id: 'whats-new', name: "What's New", icon: '🆕', category: 'Onboarding', platforms: ['ios', 'android'] },

  // ============================================================================
  // SETTINGS & PREFERENCES
  // ============================================================================
  { id: 'settings-list', name: 'Settings List', icon: '⚙️', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'toggle-setting', name: 'Toggle Setting', icon: '🔘', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'theme-switcher', name: 'Theme Switcher', icon: '🌓', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'language-selector', name: 'Language Selector', icon: '🌍', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'notification-settings', name: 'Notification Settings', icon: '🔔', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'privacy-settings', name: 'Privacy Settings', icon: '🔒', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'account-settings', name: 'Account Settings', icon: '👤', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },
  { id: 'subscription-settings', name: 'Subscription Settings', icon: '💳', category: 'Settings', platforms: ['web', 'ios', 'android', 'desktop'] },

  // ============================================================================
  // DEVELOPER & DEBUGGING
  // ============================================================================
  { id: 'api-tester', name: 'API Tester', icon: '🔌', category: 'Developer', platforms: ['web', 'desktop'] },
  { id: 'json-viewer', name: 'JSON Viewer', icon: '📋', category: 'Developer', platforms: ['web', 'desktop'] },
  { id: 'console-log', name: 'Console Log', icon: '🖥️', category: 'Developer', platforms: ['web', 'desktop'] },
  { id: 'network-inspector', name: 'Network Inspector', icon: '🌐', category: 'Developer', platforms: ['web', 'desktop'] },
  { id: 'debug-panel', name: 'Debug Panel', icon: '🐛', category: 'Developer', platforms: ['web', 'desktop'] },
  { id: 'performance-monitor', name: 'Performance Monitor', icon: '📈', category: 'Developer', platforms: ['web', 'desktop'] },
]

const DOCS_SECTIONS = [
  { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
  { id: 'capsules', title: 'Capsules Reference', icon: '📦' },
  { id: 'platforms', title: 'Platform Guide', icon: '📱' },
  { id: 'export', title: 'Export & Deploy', icon: '📤' },
  { id: 'api', title: 'API Reference', icon: '🔌' },
]

type SidebarSection = 'design' | 'templates' | 'capsules' | 'docs'
type CapsuleProps = Record<string, string | number | boolean>
type CapsuleInstance = { id: string; type: string; icon: string; name: string; props: CapsuleProps }
type Screen = { id: string; name: string; capsules: CapsuleInstance[] }
type ProjectState = {
  projectName: string
  themeColor: string
  appIcon: string
  selectedPlatforms: string[]
  screens: Screen[]
  currentScreenId: string
}

// Default props for each capsule type
const DEFAULT_PROPS: Record<string, CapsuleProps> = {
  // UI Components
  button: { text: 'Click Me', variant: 'primary', disabled: false },
  text: { content: 'Hello World', size: 'md', bold: false },
  input: { placeholder: 'Type something...', label: '', required: false },
  card: { title: 'Card Title', description: 'Card description goes here' },
  image: { src: '', alt: 'Image', rounded: true },
  avatar: { src: '', name: 'User', size: 'md', status: 'none' },
  badge: { text: 'New', variant: 'primary' },
  chip: { text: 'Tag', removable: true, variant: 'default' },
  divider: { orientation: 'horizontal', spacing: 'md' },
  spacer: { size: 16 },
  icon: { name: 'star', size: 24, color: '#6366F1' },
  tooltip: { text: 'Tooltip text', position: 'top' },
  skeleton: { type: 'text', lines: 3 },
  // Layout
  list: { items: 3, showDivider: true },
  switch: { label: 'Toggle Option', checked: true },
  progress: { value: 75, showLabel: true },
  chart: { type: 'bar', title: 'Chart' },
  navigation: { items: 'Home,Search,Profile' },
  drawer: { position: 'left', title: 'Menu' },
  header: { title: 'App Title', showBack: false, showMenu: true },
  footer: { text: '© 2024 MyApp', links: 'Privacy,Terms,Contact' },
  sidebar: { items: 'Dashboard,Settings,Profile', collapsed: false },
  grid: { columns: 2, gap: 16 },
  stack: { direction: 'vertical', spacing: 8 },
  scrollview: { horizontal: false, showIndicator: true },
  bottomsheet: { title: 'Sheet Title', snapPoints: '25%,50%,90%' },
  stepper: { steps: 'Step 1,Step 2,Step 3', current: 1 },
  breadcrumb: { items: 'Home,Products,Details' },
  // Forms
  timepicker: { label: 'Select Time', format: '12h' },
  checkbox: { label: 'Accept terms', checked: false },
  radio: { label: 'Option', options: 'Option A,Option B,Option C', selected: 'Option A' },
  textarea: { placeholder: 'Enter text...', rows: 4, maxLength: 500 },
  searchbar: { placeholder: 'Search...', showFilter: false },
  autocomplete: { placeholder: 'Type to search...', suggestions: 'Apple,Banana,Cherry' },
  colorpicker: { label: 'Pick color', value: '#6366F1' },
  filepicker: { label: 'Choose file', accept: 'image/*', multiple: false },
  rating: { max: 5, value: 3, allowHalf: true },
  signature: { label: 'Sign here', strokeWidth: 2 },
  otp: { length: 6, type: 'number' },
  // Data
  stat: { label: 'Total Sales', value: '12,345', change: '+12%', trend: 'up' },
  counter: { value: 0, min: 0, max: 100, step: 1 },
  timeline: { items: 'Event 1,Event 2,Event 3', orientation: 'vertical' },
  calendar: { showWeekNumbers: false, multiSelect: false },
  gauge: { value: 75, min: 0, max: 100, label: 'Progress' },
  kanban: { columns: 'To Do,In Progress,Done' },
  // Media
  gallery: { columns: 3, gap: 8, images: 6 },
  lightbox: { showThumbnails: true, zoomEnabled: true },
  qrcode: { value: 'https://hublab.dev', size: 200 },
  barcode: { value: '123456789', format: 'CODE128' },
  lottie: { src: '', loop: true, autoplay: true },
  threed: { src: '', autoRotate: true, enableZoom: true },
  // Feedback
  toast: { message: 'Action completed', type: 'success', duration: 3000 },
  alert: { title: 'Alert', message: 'This is an alert message', type: 'info' },
  snackbar: { message: 'Item saved', action: 'Undo' },
  loading: { size: 'md', text: 'Loading...' },
  spinner: { size: 'md', color: '#6366F1' },
  confetti: { pieces: 200, duration: 3000 },
  emptystate: { title: 'No data', description: 'Nothing to show here', icon: 'inbox' },
  errorstate: { title: 'Error', description: 'Something went wrong', showRetry: true },
  // Social
  comment: { author: 'User', content: 'Great post!', timestamp: 'now' },
  like: { count: 42, liked: false, showCount: true },
  share: { platforms: 'facebook,twitter,linkedin', showCount: true },
  follow: { following: false, count: 1234 },
  usercard: { name: 'John Doe', subtitle: 'Designer', showAvatar: true },
  chatbubble: { message: 'Hello!', isOwn: false, timestamp: 'now' },
  reaction: { reactions: '👍,❤️,😂,😮,😢', selected: '' },
  mention: { prefix: '@', suggestions: 'user1,user2,user3' },
  // E-commerce
  productcard: { title: 'Product', price: 29.99, image: '', rating: 4.5 },
  cart: { items: 3, total: 99.99, showBadge: true },
  checkout: { steps: 'Cart,Shipping,Payment,Review', current: 1 },
  pricetag: { price: 49.99, oldPrice: 79.99, currency: '$' },
  quantity: { value: 1, min: 1, max: 99 },
  wishlist: { items: 5, showCount: true },
  coupon: { code: '', placeholder: 'Enter code', applied: false },
  review: { rating: 5, author: 'Customer', content: 'Great product!' },
  // Native
  haptic: { type: 'impact', intensity: 'medium' },
  'share-native': { title: 'Share', message: '', url: '' },
  contacts: { fields: 'name,phone,email' },
  'calendar-native': { title: 'Event', startDate: '', endDate: '' },
  bluetooth: { scanDuration: 10, showList: true },
  nfc: { readOnly: false, message: '' },
  healthkit: { metrics: 'steps,calories,heartRate' },
  applepay: { amount: 0, currency: 'USD', merchantId: '' },
  googlepay: { amount: 0, currency: 'USD', merchantId: '' },
  siri: { phrase: 'Open my app', action: '' },
  widgets: { size: 'small', refreshInterval: 300 },
  // AI
  chatbot: { placeholder: 'Ask me anything...', welcomeMessage: 'Hello! How can I help?', avatar: '' },
  voiceinput: { language: 'en-US', continuous: false },
  texttospeech: { text: '', voice: 'default', rate: 1 },
  imagerecognition: { labels: true, faces: false, text: false },
  translation: { source: 'auto', target: 'en' },
  sentiment: { showScore: true, showEmoji: true },
  // AI Edge - Local AI Models
  'ai-chat-local': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', systemPrompt: 'You are a helpful assistant.', placeholder: 'Type your message...', welcomeMessage: 'Hello! How can I help?', maxTokens: 2048, temperature: 0.7, streamResponse: true },
  'ai-assistant-widget': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', position: 'bottom-right', buttonText: 'Ask AI', accentColor: '#8B5CF6', expanded: false },
  'ai-autocomplete': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', placeholder: 'Start typing...', triggerKey: 'Tab', maxSuggestions: 3, debounceMs: 300 },
  'ai-smart-input': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', placeholder: 'Write something...', showToolbar: true, tools: 'improve,grammar,shorter,longer,translate' },
  'ai-content-generator': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', contentType: 'blog-post', tone: 'professional', length: 'medium' },
  'ai-summarizer': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', summaryLength: 'short', bulletPoints: false, extractKeyPoints: true },
  'ai-sentiment-analyzer': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', showScore: true, showEmoji: true, showBreakdown: true },
  'ai-classifier': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', categories: 'Question,Bug Report,Feature Request,Praise', multiLabel: false, showConfidence: true },
  'ai-entity-extractor': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', entityTypes: 'person,organization,location,date', highlightEntities: true },
  'ai-voice-chat': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', inputLanguage: 'en-US', outputVoice: 'default', showTranscript: true },
  'ai-transcription': { language: 'en-US', continuous: true, interimResults: true, showTimestamps: false },
  'ai-translator-local': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', sourceLanguage: 'auto', targetLanguage: 'en', showOriginal: true },
  'ai-code-assistant': { provider: 'ollama', model: 'deepseek-r1', endpoint: 'http://localhost:11434', language: 'javascript', showLineNumbers: true, actions: 'explain,generate,fix,optimize' },
  'ai-json-generator': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', examples: 3, validate: true },
  'ai-idea-generator': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', ideaType: 'general', quantity: 5, creativity: 'balanced' },
  'ai-story-writer': { provider: 'ollama', model: 'llama3.2', endpoint: 'http://localhost:11434', genre: 'general', style: 'narrative', continuationLength: 'paragraph' },
  // Monetization - Ads
  'ad-banner': { position: 'bottom', adUnitId: 'ca-app-pub-xxx', testMode: true },
  'ad-interstitial': { adUnitId: 'ca-app-pub-xxx', showAfterScreens: 3, testMode: true },
  'ad-rewarded': { adUnitId: 'ca-app-pub-xxx', rewardAmount: 50, rewardType: 'coins', testMode: true },
  // Monetization - Payments
  paywall: { title: 'Upgrade to Pro', subtitle: 'Unlock all premium features', showRestoreButton: true },
  'pricing-table': { highlightedPlan: 'pro', showToggle: true },
  'buy-button': { productId: 'premium_upgrade', price: '$9.99', label: 'Buy Now', variant: 'primary' },
  'tip-jar': { amounts: '1,3,5,10', currency: 'USD', message: 'Buy me a coffee!', thankYouMessage: 'Thank you!' },
  // Monetization - Subscription
  'subscription-status': { showRenewDate: true, showManageButton: true, showUpgradeOption: true },
  'premium-badge': { variant: 'gold', showLabel: true, animate: true },
  'feature-gate': { requiredTier: 'pro', lockedMessage: 'Upgrade to Pro to unlock', showPaywall: true },
  // Monetization - In-App Purchases
  'store-item': { productId: 'coins_100', showPrice: true, showDiscount: false },
  'coin-display': { coinType: 'gold', showAddButton: true, animate: true },
  'store-grid': { columns: 3, showBestValue: true },
  // Backend - Authentication
  'auth-login': { showForgotPassword: true, showRegisterLink: true, rememberMe: true, providers: 'email' },
  'auth-register': { requireEmail: true, requireName: true, showTerms: true, emailVerification: true },
  'auth-social': { providers: 'google,apple,github', showDivider: true, buttonStyle: 'icon' },
  'auth-avatar': { showName: true, showStatus: false, editable: true, size: 'md' },
  'auth-profile': { fields: 'name,avatar,bio', showDeleteAccount: false },
  // Backend - Data
  'data-list': { collection: '', pagination: true, pageSize: 10, sortBy: 'created_at', sortOrder: 'desc' },
  'data-card': { collection: '', recordId: '', showImage: true },
  'data-form': { collection: '', mode: 'create', submitLabel: 'Save', showReset: true },
  'data-table': { collection: '', selectable: false, searchable: true, exportable: false },
  'data-search': { collection: '', placeholder: 'Search...', instant: true },
  'data-filter': { collection: '', showClear: true },
  // Backend - Storage
  'storage-upload': { bucket: 'uploads', accept: 'image/*', maxSize: 5, multiple: false, showPreview: true },
  'storage-gallery': { bucket: 'uploads', columns: 3, lightbox: true, showDelete: false },
  'storage-picker': { bucket: 'uploads', filter: '*', multiple: false },
  // Backend - Realtime
  'realtime-presence': { channel: 'presence', showCount: true, showAvatars: true, maxAvatars: 5 },
  'realtime-chat': { channel: 'chat', showTyping: true, showTimestamps: true, maxMessages: 100 },
  'realtime-notifications': { channel: 'notifications', showBadge: true, playSound: true, groupSimilar: true },
  // Backend - API
  'api-fetch': { url: '', method: 'GET', refreshInterval: 0 },
  'api-form': { url: '', method: 'POST', contentType: 'application/json', showSuccess: true },
  'api-webhook': { url: '', events: 'create,update,delete' },
  // Connections - Supertonic TTS
  'conn-supertonic-speak': { serverUrl: 'http://localhost:5123', text: 'Hello world', voice: 'default', speed: 1.0, pitch: 1.0 },
  'conn-supertonic-voices': { serverUrl: 'http://localhost:5123', showPreview: true, defaultVoice: 'default' },
  // Connections - Local LLMs
  'conn-lmstudio-chat': { serverUrl: 'http://localhost:1234', model: 'default', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'conn-ollama-chat': { serverUrl: 'http://localhost:11434', model: 'llama2', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'conn-ai-assistant': { provider: 'lm-studio', serverUrl: 'http://localhost:1234', model: 'default', systemPrompt: 'You are a helpful assistant.', enableMemory: true, enableVoice: false },
  'conn-ai-completion': { provider: 'lm-studio', serverUrl: 'http://localhost:1234', model: 'default', prompt: '', temperature: 0.7, maxTokens: 256 },
  // Connections - Cloud AI
  'conn-openai': { apiKey: '', model: 'gpt-4o-mini', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'conn-groq': { apiKey: '', model: 'llama-3.3-70b-versatile', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'conn-anthropic': { apiKey: '', model: 'claude-sonnet-4-20250514', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  // Connections - Realtime
  'conn-websocket': { url: 'ws://localhost:8080', autoReconnect: true, heartbeat: 30000 },
  'conn-rest-api': { baseUrl: 'https://api.example.com', apiKey: '', timeout: 30000 },
  // AI Providers
  'ai-google': { apiKey: '', model: 'gemini-2.0-flash', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'ai-mistral': { apiKey: '', model: 'mistral-large-latest', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'ai-cohere': { apiKey: '', model: 'command-r-plus', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'ai-perplexity': { apiKey: '', model: 'llama-3.1-sonar-large-128k-online', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'ai-together': { apiKey: '', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'ai-deepseek': { apiKey: '', model: 'deepseek-chat', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  'ai-replicate': { apiKey: '', model: 'meta/llama-2-70b-chat', systemPrompt: 'You are a helpful assistant.', temperature: 0.7 },
  'ai-huggingface': { apiKey: '', model: 'meta-llama/Meta-Llama-3-8B-Instruct', systemPrompt: 'You are a helpful assistant.', temperature: 0.7 },
  'ai-xai': { apiKey: '', model: 'grok-2', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, streaming: true },
  // Voice & Audio
  'voice-openai-tts': { apiKey: '', model: 'tts-1', voice: 'alloy', speed: 1.0 },
  'voice-openai-stt': { apiKey: '', model: 'whisper-1', language: 'en' },
  'voice-local-whisper': { serverUrl: 'http://localhost:9000', model: 'whisper-base', language: 'en' },
  'voice-elevenlabs': { apiKey: '', voiceId: '', stability: 0.5, similarityBoost: 0.75 },
  // Image Generation
  'image-dalle': { apiKey: '', model: 'dall-e-3', size: '1024x1024', quality: 'standard', style: 'vivid' },
  'image-flux': { apiKey: '', model: 'black-forest-labs/FLUX.1-schnell', width: 1024, height: 1024 },
  'image-sdxl': { apiKey: '', model: 'stability-ai/sdxl', width: 1024, height: 1024, steps: 30 },
  'image-midjourney': { prompt: '', style: 'default', aspectRatio: '1:1' },
  // RAG & Knowledge
  'rag-chat': { preset: 'basic-openai', systemPrompt: 'Answer based on the provided context.', topK: 5 },
  'rag-upload': { formats: 'pdf,txt,md,docx', maxSize: 10, chunkSize: 1000, chunkOverlap: 200 },
  'rag-search': { topK: 5, threshold: 0.7, rerank: true },
  'rag-embeddings': { provider: 'openai', model: 'text-embedding-3-small', dimensions: 1536 },
  // Vector Databases
  'vector-pinecone': { apiKey: '', environment: 'us-east-1', indexName: 'default', namespace: '' },
  'vector-weaviate': { url: 'http://localhost:8080', apiKey: '', className: 'Document' },
  'vector-qdrant': { url: 'http://localhost:6333', apiKey: '', collectionName: 'documents' },
  'vector-chroma': { path: './chroma_db', collectionName: 'documents' },
  'vector-supabase': { url: '', apiKey: '', tableName: 'documents' },
  // Cloud Storage
  'storage-gdrive': { clientId: '', scopes: 'drive.file', folderId: 'root' },
  'storage-dropbox': { accessToken: '', rootPath: '/' },
  'storage-onedrive': { clientId: '', scopes: 'Files.ReadWrite', folderId: 'root' },
  'storage-s3': { accessKeyId: '', secretAccessKey: '', region: 'us-east-1', bucket: '' },
  'storage-r2': { accountId: '', accessKeyId: '', secretAccessKey: '', bucket: '' },
  // Auth - extended
  'auth-forgot': { showBackToLogin: true, resetMethod: 'email' },
  'auth-otp-verify': { length: 6, resendTimer: 60, showResend: true },
  // Payments
  'pay-checkout': { currency: 'USD', showSummary: true, requireShipping: false, requireBilling: true },
  'pay-stripe': { publishableKey: '', amount: 0, currency: 'USD', description: '' },
  'pay-paypal': { clientId: '', currency: 'USD', intent: 'capture' },
  'pay-apple': { merchantId: '', countryCode: 'US', currencyCode: 'USD' },
  'pay-google': { merchantId: '', environment: 'TEST', currencyCode: 'USD' },
  'pay-subscription': { plans: 'monthly,yearly', defaultPlan: 'monthly', trialDays: 7 },
  // Notifications
  'notif-push': { title: 'New Notification', body: '', data: '{}', badge: 1 },
  'notif-inapp': { type: 'info', title: 'Alert', message: '', duration: 5000, dismissible: true },
  'notif-badge': { count: 0, max: 99, showZero: false, color: '#EF4444' },
  'notif-banner': { type: 'info', message: '', dismissible: true, action: '' },
  // Analytics
  'analytics-dashboard': { title: 'Overview', period: '7d', metrics: 'users,sessions,pageviews' },
  'analytics-chart': { type: 'line', title: 'Trend', metric: 'users', period: '30d' },
  'analytics-kpi': { label: 'Total Users', value: '0', change: '+0%', trend: 'neutral' },
  'analytics-funnel': { steps: 'Visit,Signup,Purchase', showConversion: true },
  // Location
  'geo-map': { provider: 'mapbox', center: '0,0', zoom: 12, markers: '[]', showControls: true },
  'geo-location': { accuracy: 'high', watchPosition: false, showButton: true },
  'geo-places': { provider: 'google', placeholder: 'Search places...', types: 'establishment' },
  'geo-directions': { mode: 'driving', showSteps: true, showTime: true },
  // i18n
  'i18n-selector': { languages: 'en,es,fr,de', defaultLanguage: 'en', showFlags: true },
  'i18n-text': { key: '', fallback: '', variables: '{}' },
  // Gaming & Entertainment
  'game-leaderboard': { title: 'Leaderboard', maxPlayers: 10, showRank: true, showAvatar: true, refreshInterval: 30 },
  'game-achievements': { showLocked: true, showProgress: true, columns: 2, animate: true },
  'game-score': { score: 0, label: 'Score', animate: true, format: 'comma' },
  'game-lives': { lives: 3, maxLives: 5, icon: 'heart', animate: true },
  'game-timer': { duration: 60, countdown: true, showMilliseconds: false, autoStart: false },
  'game-xp': { currentXp: 0, maxXp: 100, level: 1, showLabel: true, animate: true },
  'game-inventory': { columns: 4, rows: 3, showTooltip: true, draggable: true },
  'game-minimap': { size: 150, zoom: 1, showPlayer: true, showEnemies: true },
  'game-health': { health: 100, maxHealth: 100, showLabel: true, animate: true, color: '#22C55E' },
  'game-joystick': { size: 100, deadzone: 0.1, lockAxis: false, returnToCenter: true },
  'game-actionbutton': { size: 60, label: 'A', color: '#EF4444', haptic: true },
  'game-quiz': { question: 'What is 2+2?', answers: 'Option A,Option B,Option C,Option D', correctIndex: 1, showFeedback: true },
  // Productivity & Tools
  'prod-todo': { title: 'Tasks', showCompleted: true, showDueDate: true, sortBy: 'priority' },
  'prod-notes': { placeholder: 'Start typing...', autosave: true, showToolbar: true },
  'prod-reminder': { title: 'Reminder', time: '', repeat: 'none', notification: true },
  'prod-pomodoro': { workMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, sessionsBeforeLongBreak: 4 },
  'prod-habit': { title: 'Habit', frequency: 'daily', streak: 0, showCalendar: true },
  'prod-journal': { date: '', mood: 'neutral', tags: '', showPrompt: true },
  'prod-kanban': { columns: 'To Do,In Progress,Done', allowAdd: true, allowDrag: true },
  'prod-calendar-event': { title: '', startTime: '', endTime: '', allDay: false, color: '#6366F1' },
  'prod-project': { title: 'Project', progress: 0, dueDate: '', members: 3 },
  'prod-bookmark': { url: '', title: '', favicon: '', tags: '' },
  'prod-clipboard': { maxItems: 10, showSearch: true, groupByType: true },
  'prod-markdown': { content: '', showPreview: true, enableSyntaxHighlight: true },
  // Social & Community
  'social-feed': { layout: 'list', showLikes: true, showComments: true, infiniteScroll: true },
  'social-post': { content: '', showAuthor: true, showTimestamp: true, showActions: true },
  'social-story': { duration: 5, showProgress: true, autoAdvance: true },
  'social-profile-header': { showCover: true, showStats: true, showEditButton: true },
  'social-followers': { showCount: true, showFollowButton: true, layout: 'grid' },
  'social-group': { name: '', members: 0, showJoinButton: true, isPrivate: false },
  'social-invite': { type: 'link', expires: '7d', maxUses: 0, showQr: true },
  'social-activity': { showTimestamp: true, groupByDate: true, maxItems: 50 },
  'social-poll': { question: '', options: 'Option 1,Option 2', multiSelect: false, showResults: true },
  'social-livestream': { title: '', showViewers: true, showChat: true, quality: 'auto' },
  // Utilities
  'util-calculator': { mode: 'basic', showHistory: true, precision: 8 },
  'util-converter': { category: 'length', fromUnit: 'meters', toUnit: 'feet' },
  'util-currency': { fromCurrency: 'USD', toCurrency: 'EUR', showChart: false },
  'util-weather': { location: 'auto', units: 'metric', showForecast: true, days: 5 },
  'util-clock': { format: '12h', showSeconds: true, showDate: true, timezone: 'local' },
  'util-stopwatch': { showLaps: true, maxLaps: 10, precision: 'centiseconds' },
  'util-password': { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
  'util-qr-scanner': { showOverlay: true, beepOnScan: true, autoStart: true },
  'util-flashlight': { defaultBrightness: 100, showSlider: true },
  'util-compass': { showDegrees: true, showDirection: true, calibration: true },
  'util-ruler': { unit: 'cm', showGuides: true, enableAR: true },
  'util-level': { sensitivity: 'medium', showDegrees: true, beepOnLevel: true },
  // Health & Fitness
  'health-steps': { goal: 10000, showProgress: true, showCalories: true },
  'health-heart': { showGraph: true, alertOnAbnormal: true, measureDuration: 30 },
  'health-sleep': { goalHours: 8, showQuality: true, showPhases: true },
  'health-water': { goal: 8, unit: 'glasses', showProgress: true, reminder: true },
  'health-calories': { goal: 2000, showMacros: true, showMeals: true },
  'health-weight': { unit: 'kg', goalWeight: 70, showGraph: true, showBmi: true },
  'health-workout': { type: 'strength', duration: 0, calories: 0, showTimer: true },
  'health-meditation': { duration: 10, backgroundSound: 'nature', showBreathing: true },
  'health-mood': { showHistory: true, showNotes: true, showPatterns: true },
  'health-bmi': { heightUnit: 'cm', weightUnit: 'kg', showCategory: true },
  // Education & Learning
  'edu-flashcard': { front: '', back: '', showProgress: true, shuffle: true },
  'edu-quiz': { title: 'Quiz', questions: 10, timeLimit: 0, showScore: true },
  'edu-progress': { completed: 0, total: 100, showPercentage: true, showBadges: true },
  'edu-course': { title: '', lessons: 0, duration: '', level: 'beginner' },
  'edu-lesson': { title: '', content: '', showProgress: true, showNotes: true },
  'edu-certificate': { title: '', recipientName: '', date: '', showDownload: true },
  'edu-streak': { currentStreak: 0, longestStreak: 0, showCalendar: true, animate: true },
  'edu-vocabulary': { word: '', definition: '', example: '', pronunciation: '' },
  // Finance & Banking
  'fin-balance': { balance: 0, currency: 'USD', showChange: true, showGraph: false },
  'fin-transaction': { showCategories: true, showSearch: true, groupByDate: true },
  'fin-expense': { categories: 'Food,Transport,Entertainment,Bills', showChart: true },
  'fin-budget': { period: 'monthly', showRemaining: true, showCategories: true },
  'fin-savings': { goalAmount: 1000, currentAmount: 0, deadline: '', showProgress: true },
  'fin-crypto': { coins: 'BTC,ETH', showChange: true, currency: 'USD', refreshInterval: 60 },
  'fin-stock': { symbol: 'AAPL', period: '1M', showVolume: true, showIndicators: false },
  'fin-invoice': { number: '', date: '', dueDate: '', showLogo: true },
  'fin-receipt': { enableOcr: true, showCategories: true, autoSave: true },
  // Travel & Booking
  'travel-booking': { type: 'flight', showQr: true, showCalendarAdd: true },
  'travel-flight': { flightNumber: '', showStatus: true, showGate: true },
  'travel-hotel': { checkIn: '', checkOut: '', showMap: true, showAmenities: true },
  'travel-itinerary': { showMap: true, showWeather: true, editable: false },
  'travel-passport': { enableOcr: true, saveSecurely: true, showExpiry: true },
  'travel-currency': { baseCurrency: 'USD', targetCurrencies: 'EUR,GBP,JPY', showChart: false },
  'travel-reviews': { showRating: true, showPhotos: true, sortBy: 'recent' },
  // Food & Delivery
  'food-menu': { categories: '', showPrices: true, showImages: true, showFilters: true },
  'food-order': { showStatus: true, showMap: true, showDriver: true },
  'food-restaurant': { showRating: true, showDistance: true, showDeliveryTime: true },
  'food-delivery': { showMap: true, showEta: true, showDriver: true, enableChat: true },
  'food-recipe': { showIngredients: true, showSteps: true, showNutrition: true, servings: 4 },
  'food-nutrition': { showMacros: true, showMicros: false, showDailyValue: true },
  // Music & Audio
  'music-player': { showProgress: true, showVolume: true, showShuffle: true, showRepeat: true },
  'music-playlist': { showDuration: true, showArtwork: true, draggable: true },
  'music-equalizer': { bands: 10, presets: 'flat,rock,pop,jazz', showVisualizer: false },
  'music-podcast': { showProgress: true, showSpeed: true, showSkip: true },
  'music-waveform': { color: '#6366F1', height: 80, showProgress: true },
  'music-lyrics': { syncedLyrics: true, showTimestamps: false, fontSize: 'medium' },
  // Integrations & APIs
  'int-spotify': { scope: 'user-read-playback-state', showPlayer: true },
  'int-youtube': { videoId: '', showControls: true, autoplay: false },
  'int-twitch': { channel: '', showChat: true, quality: 'auto' },
  'int-discord': { serverId: '', showOnline: true, showWidget: true },
  'int-slack': { workspace: '', channel: '', showNotifications: true },
  'int-github': { repo: '', showStars: true, showIssues: true, showPrs: true },
  'int-notion': { databaseId: '', viewType: 'table', showFilters: true },
  'int-airtable': { baseId: '', tableId: '', viewId: '' },
  'int-zapier': { webhookUrl: '', triggerOn: 'submit' },
  'int-firebase': { projectId: '', collection: '', realtime: true },
  'int-supabase': { url: '', anonKey: '', table: '' },
  'int-stripe': { publishableKey: '', mode: 'test' },
  'int-twilio': { accountSid: '', fromNumber: '' },
  'int-sendgrid': { apiKey: '', fromEmail: '', templateId: '' },
  'int-algolia': { appId: '', searchKey: '', indexName: '' },
  // Smart Home & IoT
  'iot-thermostat': { currentTemp: 72, targetTemp: 72, mode: 'auto', unit: 'F' },
  'iot-lights': { brightness: 100, color: '#FFFFFF', on: true, showSlider: true },
  'iot-lock': { locked: true, showHistory: true, enableRemote: true },
  'iot-camera': { streamUrl: '', showControls: true, enableRecording: false },
  'iot-doorbell': { showLive: true, enableTwoWay: true, showHistory: true },
  'iot-speaker': { volume: 50, showQueue: true, enableMultiroom: false },
  'iot-sensor': { type: 'temperature', unit: '°F', showGraph: true, alertThreshold: 0 },
  // Blockchain & Web3
  'web3-wallet': { chains: 'ethereum,polygon', showBalance: true, showNfts: false },
  'web3-nft': { columns: 3, showPrice: true, showCollection: true },
  'web3-token': { chain: 'ethereum', tokens: 'ETH,USDC', showUsd: true },
  'web3-transaction': { chain: 'ethereum', limit: 20, showPending: true },
  'web3-contract': { abi: '', address: '', method: '' },
  'web3-mint': { collectionAddress: '', price: '0', maxMint: 1 },
  // Accessibility
  'a11y-screen-reader': { enabled: true, verbosity: 'medium' },
  'a11y-high-contrast': { enabled: false, mode: 'dark' },
  'a11y-font-size': { scale: 1.0, min: 0.8, max: 2.0, showSlider: true },
  'a11y-color-blind': { mode: 'none', options: 'none,protanopia,deuteranopia,tritanopia' },
  'a11y-voice-control': { enabled: false, language: 'en-US', showIndicator: true },
  // AR/VR
  'ar-camera': { showGuides: true, enableFlash: false, resolution: 'high' },
  'ar-object': { scale: 1.0, rotatable: true, showShadow: true },
  'ar-face-filter': { filterType: 'mask', showPreview: true },
  'ar-surface': { detectVertical: true, detectHorizontal: true, showIndicator: true },
  'ar-measure': { unit: 'cm', precision: 2, showHistory: true },
  'vr-viewer': { stereo: true, gyroscope: true, initialView: 'front' },
  'ar-portal': { portalSize: 2, showFrame: true, autoEnter: false },
  // Communication
  'comm-video-call': { provider: 'agora', resolution: '720p', enableChat: true },
  'comm-voice-call': { provider: 'twilio', enableRecording: false },
  'comm-screen-share': { audioEnabled: true, resolution: '1080p' },
  'comm-chat-room': { maxUsers: 50, showTypingIndicator: true, enableReactions: true },
  'comm-email': { to: '', subject: '', showCc: false },
  'comm-sms': { to: '', message: '', showCharCount: true },
  'comm-contact-picker': { allowMultiple: false, fields: 'name,phone,email' },
  // Security
  'sec-encrypt': { algorithm: 'AES-256', keyStorage: 'keychain' },
  'sec-2fa': { method: 'totp', issuer: 'MyApp', digits: 6 },
  'sec-keychain': { service: 'myapp', accessGroup: '' },
  'sec-privacy-mode': { blurAmount: 20, hideOnScreenshot: true },
  'sec-app-lock': { method: 'biometric', timeout: 300, showPattern: false },
  'sec-vpn-status': { showSpeed: true, showLocation: true },
  // Events
  'event-calendar': { view: 'month', showWeekNumbers: false, multiSelect: false },
  'event-ticket': { showQr: true, showBarcode: false, animated: true },
  'event-rsvp': { options: 'Yes,No,Maybe', deadline: '', showCount: true },
  'event-countdown': { targetDate: '', showDays: true, showHours: true, showSeconds: true },
  'event-seat-picker': { rows: 10, seatsPerRow: 8, showLabels: true },
  'event-schedule': { groupByDay: true, showSpeakers: true, enableReminder: true },
  // Documents
  'doc-pdf-viewer': { showToolbar: true, enableSearch: true, nightMode: false },
  'doc-scanner': { autoDetect: true, enhanceColors: true, outputFormat: 'pdf' },
  'doc-signature': { strokeWidth: 2, color: '#000000', showDate: true },
  'doc-editor': { toolbar: 'full', autosave: true, wordCount: true },
  'doc-spreadsheet': { rows: 100, columns: 26, showFormulas: false },
  'doc-export': { formats: 'pdf,docx,txt', includeImages: true },
  // Real Estate
  'realestate-listing': { showPrice: true, showBeds: true, showArea: true, currency: 'USD' },
  'realestate-tour': { autoPlay: false, showHotspots: true, quality: 'high' },
  'realestate-mortgage': { principal: 300000, rate: 6.5, term: 30 },
  'realestate-filter': { priceRange: true, bedrooms: true, propertyType: true },
  'realestate-agent': { showPhone: true, showEmail: true, showReviews: true },
  // Automotive
  'auto-vehicle': { showMileage: true, showYear: true, showPrice: true },
  'auto-fuel': { unit: 'gallons', showCost: true, showEfficiency: true },
  'auto-maintenance': { categories: 'Oil,Tires,Brakes,Battery', showReminders: true },
  'auto-parking': { radius: 1, unit: 'miles', showPrice: true },
  'auto-charging': { connectorTypes: 'CCS,CHAdeMO,Tesla', showAvailability: true },
  'auto-obd': { protocols: 'all', showDTC: true, liveData: true },
  // Pets
  'pet-profile': { showAge: true, showBreed: true, showWeight: true },
  'pet-health': { showVaccinations: true, showMedications: true },
  'pet-feeding': { mealsPerDay: 2, showReminders: true },
  'pet-vet': { showAddress: true, showPhone: true, enableBooking: true },
  'pet-tracker': { updateInterval: 60, showHistory: true, geofence: true },
  // Dating
  'dating-profile': { photos: 6, bio: true, interests: true },
  'dating-swipe': { enableSuperLike: true, showDistance: true },
  'dating-match': { showCommon: true, enableChat: true },
  'dating-chat': { showRead: true, enableGifs: true },
  'dating-icebreaker': { questions: 5, showCompatibility: true },
  // Family
  'family-tree': { generations: 4, showPhotos: true, showDates: true },
  'family-chores': { showPoints: true, enableRewards: true, recurring: true },
  'family-allowance': { currency: 'USD', showHistory: true, enableSavings: true },
  'family-location': { updateInterval: 300, showHistory: false, batteryOptimized: true },
  'baby-tracker': { trackFeeding: true, trackSleep: true, trackDiapers: true },
  // Sports
  'sports-score': { showPeriod: true, showStats: true, liveUpdates: true },
  'sports-team': { showLogo: true, showRecord: true, showRoster: false },
  'sports-stats': { categories: 'points,assists,rebounds', showGraph: true },
  'sports-schedule': { showBroadcast: true, enableReminder: true },
  'sports-betting': { showTrend: true, showSpread: true },
  // News
  'news-feed': { layout: 'cards', showImages: true, infiniteScroll: true },
  'news-article': { showAuthor: true, showDate: true, enableComments: true },
  'news-breaking': { autoRefresh: 60, showBadge: true, sound: false },
  'news-category': { categories: 'World,Business,Tech,Sports', multiSelect: true },
  'news-bookmark': { showFolders: true, enableOffline: true },
  // Printing
  'print-preview': { showMargins: true, orientation: 'portrait', paperSize: 'letter' },
  'print-label': { labelSize: '2x4', showGrid: true, templates: true },
  'print-barcode': { format: 'QR', size: 200, includeText: true },
  'scan-ocr': { languages: 'en', preserveFormatting: true, exportFormat: 'text' },
}

// Code generators for preview
const generateSwiftUI = (capsules: CapsuleInstance[], projectName: string, themeColor: string) => {
  const colorHex = themeColor.replace('#', '')
  let code = `import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
`
  capsules.forEach(c => {
    switch (c.type) {
      case 'text':
        code += `                    Text("${c.props?.content || 'Hello'}")
                        .font(.${c.props?.size === 'lg' ? 'title' : c.props?.size === 'sm' ? 'caption' : 'body'})
                        ${c.props?.bold ? '.fontWeight(.bold)' : ''}\n`
        break
      case 'button':
        code += `                    Button("${c.props?.text || 'Button'}") {
                        // Action
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(Color(hex: "${colorHex}"))\n`
        break
      case 'card':
        code += `                    VStack(alignment: .leading) {
                        Text("${c.props?.title || 'Title'}").font(.headline)
                        Text("${c.props?.description || 'Description'}").foregroundColor(.gray)
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(12)
                    .shadow(radius: 2)\n`
        break
      case 'input':
        code += `                    TextField("${c.props?.placeholder || 'Enter text'}", text: .constant(""))
                        .textFieldStyle(.roundedBorder)\n`
        break
      case 'switch':
        code += `                    Toggle("${c.props?.label || 'Option'}", isOn: .constant(${c.props?.checked || false}))\n`
        break
      case 'progress':
        code += `                    ProgressView(value: ${(Number(c.props?.value) || 75) / 100})
                        .tint(Color(hex: "${colorHex}"))\n`
        break
      default:
        code += `                    // ${c.name} component\n`
    }
  })
  code += `                }
                .padding()
            }
            .navigationTitle("${projectName}")
        }
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6: (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        default: (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(.sRGB, red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255, opacity: Double(a) / 255)
    }
}`
  return code
}

const generateKotlin = (capsules: CapsuleInstance[], projectName: string, themeColor: string) => {
  let code = `package com.hublab.${projectName.toLowerCase().replace(/\s+/g, '')}

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun MainScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("${projectName}") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
`
  capsules.forEach(c => {
    switch (c.type) {
      case 'text':
        code += `            Text(
                text = "${c.props?.content || 'Hello'}",
                style = MaterialTheme.typography.${c.props?.size === 'lg' ? 'headlineMedium' : c.props?.size === 'sm' ? 'bodySmall' : 'bodyLarge'}
            )\n`
        break
      case 'button':
        code += `            Button(onClick = { /* TODO */ }) {
                Text("${c.props?.text || 'Button'}")
            }\n`
        break
      case 'card':
        code += `            Card {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("${c.props?.title || 'Title'}", style = MaterialTheme.typography.titleMedium)
                    Text("${c.props?.description || 'Description'}", color = Color.Gray)
                }
            }\n`
        break
      case 'input':
        code += `            OutlinedTextField(
                value = "",
                onValueChange = {},
                label = { Text("${c.props?.label || c.props?.placeholder || 'Input'}") },
                modifier = Modifier.fillMaxWidth()
            )\n`
        break
      case 'switch':
        code += `            Row {
                Text("${c.props?.label || 'Option'}")
                Spacer(Modifier.weight(1f))
                Switch(checked = ${c.props?.checked || false}, onCheckedChange = {})
            }\n`
        break
      case 'progress':
        code += `            LinearProgressIndicator(
                progress = ${(Number(c.props?.value) || 75) / 100}f,
                modifier = Modifier.fillMaxWidth()
            )\n`
        break
      default:
        code += `            // ${c.name} component\n`
    }
  })
  code += `        }
    }
}`
  return code
}

const generateReact = (capsules: CapsuleInstance[], projectName: string, themeColor: string) => {
  let code = `import React, { useState } from 'react'

export default function ${projectName.replace(/\s+/g, '')}() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-xl font-semibold">${projectName}</h1>
      </header>
      <main className="max-w-2xl mx-auto p-6 space-y-4">
`
  capsules.forEach(c => {
    switch (c.type) {
      case 'text':
        code += `        <p className="${c.props?.size === 'lg' ? 'text-2xl' : c.props?.size === 'sm' ? 'text-sm' : 'text-base'} ${c.props?.bold ? 'font-bold' : ''}">${c.props?.content || 'Hello'}</p>\n`
        break
      case 'button':
        code += `        <button
          className="px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: '${themeColor}' }}
        >
          ${c.props?.text || 'Button'}
        </button>\n`
        break
      case 'card':
        code += `        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold">${c.props?.title || 'Title'}</h3>
          <p className="text-gray-600 text-sm mt-1">${c.props?.description || 'Description'}</p>
        </div>\n`
        break
      case 'input':
        code += `        <input
          type="text"
          placeholder="${c.props?.placeholder || 'Enter text'}"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />\n`
        break
      case 'switch':
        code += `        <label className="flex items-center gap-3">
          <input type="checkbox" ${c.props?.checked ? 'defaultChecked' : ''} className="w-5 h-5" />
          <span>${c.props?.label || 'Option'}</span>
        </label>\n`
        break
      case 'progress':
        code += `        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full" style={{ width: '${c.props?.value || 75}%', backgroundColor: '${themeColor}' }}></div>
        </div>\n`
        break
      default:
        code += `        {/* ${c.name} component */}\n`
    }
  })
  code += `      </main>
    </div>
  )
}`
  return code
}

export default function AppPanel() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<SidebarSection>('design')
  const [projectName, setProjectName] = useState('My App')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['ios', 'android', 'web'])
  const [screens, setScreens] = useState<Screen[]>([{ id: 'home', name: 'Home', capsules: [] }])
  const [currentScreenId, setCurrentScreenId] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showCodePreview, setShowCodePreview] = useState(false)
  const [previewPlatform, setPreviewPlatform] = useState<'swiftui' | 'kotlin' | 'react'>('swiftui')
  const [exporting, setExporting] = useState(false)
  const [exportPlatform, setExportPlatform] = useState<string | null>(null)
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [themeColor, setThemeColor] = useState('#6366F1')
  const [appIcon, setAppIcon] = useState('📱')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [history, setHistory] = useState<CapsuleInstance[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showScreenModal, setShowScreenModal] = useState(false)
  const [newScreenName, setNewScreenName] = useState('')
  const [draggedCapsule, setDraggedCapsule] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [duplicateCapsule, setDuplicateCapsule] = useState<string | null>(null)
  const [showChatPanel, setShowChatPanel] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Micro-Templates state
  const [templateCategory, setTemplateCategory] = useState('all')
  const [templateSearch, setTemplateSearch] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<MicroTemplate | null>(null)
  const [showTemplatePreview, setShowTemplatePreview] = useState(false)

  // Icon Generator state
  const [showIconGenerator, setShowIconGenerator] = useState(false)
  const [iconPrompt, setIconPrompt] = useState('')
  const [selectedIconStyle, setSelectedIconStyle] = useState('gradient')
  const [selectedPalette, setSelectedPalette] = useState('ocean')
  const [generatedIconUrl, setGeneratedIconUrl] = useState('')
  const [iconGenerating, setIconGenerating] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [mobileActivePanel, setMobileActivePanel] = useState<'none' | 'capsules' | 'properties' | 'chat'>('none')

  // New states for enhanced features
  const [showProjectManager, setShowProjectManager] = useState(false)
  const [previewMode, setPreviewMode] = useState<'list' | 'visual'>('list')
  const [previewPlatformVisual, setPreviewPlatformVisual] = useState<'ios' | 'android' | 'web'>('ios')

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // DnD Kit handler
  const handleDndDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = canvasCapsules.findIndex(c => c.id === active.id)
      const newIndex = canvasCapsules.findIndex(c => c.id === over.id)
      setCanvasCapsules(arrayMove(canvasCapsules, oldIndex, newIndex))
    }
  }

  // Get current screen's capsules
  const currentScreen = screens.find(s => s.id === currentScreenId) || screens[0]
  const canvasCapsules = currentScreen?.capsules || []

  const setCanvasCapsules = useCallback((capsules: CapsuleInstance[] | ((prev: CapsuleInstance[]) => CapsuleInstance[])) => {
    setScreens(prev => prev.map(s =>
      s.id === currentScreenId
        ? { ...s, capsules: typeof capsules === 'function' ? capsules(s.capsules) : capsules }
        : s
    ))
  }, [currentScreenId])

  const selectedCapsule = canvasCapsules.find(c => c.id === selectedCapsuleId)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hublab-project')
    if (saved) {
      try {
        const data: ProjectState = JSON.parse(saved)
        setProjectName(data.projectName || 'My App')
        setThemeColor(data.themeColor || '#6366F1')
        setAppIcon(data.appIcon || '📱')
        setSelectedPlatforms(data.selectedPlatforms || ['ios', 'android', 'web'])
        setScreens(data.screens || [{ id: 'home', name: 'Home', capsules: [] }])
        setCurrentScreenId(data.currentScreenId || 'home')
        setLastSaved(new Date())
      } catch (e) {
        console.error('Failed to load project:', e)
      }
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    const saveProject = () => {
      const data: ProjectState = {
        projectName,
        themeColor,
        appIcon,
        selectedPlatforms,
        screens,
        currentScreenId
      }
      localStorage.setItem('hublab-project', JSON.stringify(data))
      setLastSaved(new Date())
    }
    const timer = setTimeout(saveProject, 500)
    return () => clearTimeout(timer)
  }, [projectName, themeColor, appIcon, selectedPlatforms, screens, currentScreenId])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false)
        setMobileActivePanel('none')
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          // Redo
          if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1)
            setCanvasCapsules(history[historyIndex + 1])
          }
        } else {
          // Undo
          if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1)
            setCanvasCapsules(history[historyIndex - 1])
          }
        }
      }
      // Delete selected capsule
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedCapsuleId && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        handleRemoveCapsule(selectedCapsuleId)
      }
      // Duplicate selected capsule (Ctrl+D)
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedCapsuleId) {
        e.preventDefault()
        handleDuplicateCapsule(selectedCapsuleId)
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedCapsuleId(null)
        setShowExportModal(false)
        setShowCodePreview(false)
        setShowSettingsModal(false)
        setShowAIModal(false)
        setShowScreenModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [historyIndex, history, setCanvasCapsules, selectedCapsuleId])

  // Track history for undo/redo
  useEffect(() => {
    if (canvasCapsules.length > 0 || history.length === 0) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1)
        return [...newHistory, [...canvasCapsules]]
      })
      setHistoryIndex(prev => prev + 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasCapsules.length])

  const categories = ['all', ...new Set(ALL_CAPSULES.map(c => c.category))]

  const filteredCapsules = ALL_CAPSULES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddCapsule = (capsule: typeof ALL_CAPSULES[0]) => {
    const newCapsule: CapsuleInstance = {
      id: `${capsule.id}_${Date.now()}`,
      type: capsule.id,
      icon: capsule.icon,
      name: capsule.name,
      props: DEFAULT_PROPS[capsule.id] ? { ...DEFAULT_PROPS[capsule.id] } : {},
    }
    setCanvasCapsules([...canvasCapsules, newCapsule])
    setSelectedCapsuleId(newCapsule.id)
  }

  const handleRemoveCapsule = (id: string) => {
    setCanvasCapsules(canvasCapsules.filter(c => c.id !== id))
    if (selectedCapsuleId === id) setSelectedCapsuleId(null)
  }

  const handleUpdateCapsuleProp = (capsuleId: string, propName: string, value: string | number | boolean) => {
    setCanvasCapsules(canvasCapsules.map(c =>
      c.id === capsuleId
        ? { ...c, props: { ...c.props, [propName]: value } }
        : c
    ))
  }

  const handleAddScreen = () => {
    if (!newScreenName.trim()) return
    const newScreen: Screen = {
      id: `screen_${Date.now()}`,
      name: newScreenName.trim(),
      capsules: []
    }
    setScreens([...screens, newScreen])
    setCurrentScreenId(newScreen.id)
    setNewScreenName('')
    setShowScreenModal(false)
  }

  const handleDeleteScreen = (screenId: string) => {
    if (screens.length <= 1) return
    setScreens(screens.filter(s => s.id !== screenId))
    if (currentScreenId === screenId) {
      setCurrentScreenId(screens[0].id)
    }
  }

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, capsuleId: string) => {
    setDraggedCapsule(capsuleId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedCapsule(null)
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedCapsule) return

    const draggedIndex = canvasCapsules.findIndex(c => c.id === draggedCapsule)
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      handleDragEnd()
      return
    }

    const newCapsules = [...canvasCapsules]
    const [removed] = newCapsules.splice(draggedIndex, 1)
    newCapsules.splice(targetIndex > draggedIndex ? targetIndex - 1 : targetIndex, 0, removed)
    setCanvasCapsules(newCapsules)
    handleDragEnd()
  }

  const handleDuplicateCapsule = (capsuleId: string) => {
    const capsule = canvasCapsules.find(c => c.id === capsuleId)
    if (!capsule) return
    const duplicated: CapsuleInstance = {
      ...capsule,
      id: `${capsule.type}_${Date.now()}`,
      props: { ...capsule.props }
    }
    const index = canvasCapsules.findIndex(c => c.id === capsuleId)
    const newCapsules = [...canvasCapsules]
    newCapsules.splice(index + 1, 0, duplicated)
    setCanvasCapsules(newCapsules)
    setSelectedCapsuleId(duplicated.id)
  }

  const handleMoveCapsule = (capsuleId: string, direction: 'up' | 'down') => {
    const index = canvasCapsules.findIndex(c => c.id === capsuleId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === canvasCapsules.length - 1) return

    const newCapsules = [...canvasCapsules]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newCapsules[index], newCapsules[targetIndex]] = [newCapsules[targetIndex], newCapsules[index]]
    setCanvasCapsules(newCapsules)
  }

  // AI Chat handler
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)

    try {
      const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
      const AVAILABLE_CAPSULES = ['button', 'text', 'input', 'card', 'image', 'list', 'navigation', 'switch', 'progress', 'chart', 'modal', 'tabs', 'accordion', 'form', 'slider', 'dropdown', 'datepicker', 'table', 'video', 'audio', 'carousel']

      const currentContext = `Current app: "${projectName}" with ${canvasCapsules.length} components: ${canvasCapsules.map(c => c.name).join(', ')}`

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: `You are a helpful AI assistant for HubLab app builder. Help users build their app.
${currentContext}
Available capsule types: ${AVAILABLE_CAPSULES.join(', ')}.
When user asks to add components, respond with JSON action: {"action":"add_capsules","capsules":[{"type":"button","props":{"text":"Click"}}]}
When user asks to change app name: {"action":"set_name","name":"NewName"}
When user asks to change theme: {"action":"set_theme","color":"#hexcolor"}
For general questions, just respond normally without JSON.
Keep responses concise.` },
            ...chatMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 512,
        }),
      })

      const data = await res.json()
      let content = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.'

      // Check for actions in response
      try {
        const jsonMatch = content.match(/\{[\s\S]*"action"[\s\S]*\}/)
        if (jsonMatch) {
          const action = JSON.parse(jsonMatch[0])
          if (action.action === 'add_capsules' && action.capsules) {
            const newCapsules = action.capsules.map((c: {type: string; props?: CapsuleProps}, i: number) => {
              const def = ALL_CAPSULES.find(a => a.id === c.type)
              return { id: `${c.type}_${Date.now()}_${i}`, type: c.type, icon: def?.icon || '📦', name: def?.name || c.type, props: c.props || DEFAULT_PROPS[c.type] || {} }
            })
            setCanvasCapsules([...canvasCapsules, ...newCapsules])
            content = content.replace(jsonMatch[0], '').trim() || `Added ${newCapsules.length} component(s) to your app!`
          } else if (action.action === 'set_name' && action.name) {
            setProjectName(action.name)
            content = content.replace(jsonMatch[0], '').trim() || `Changed app name to "${action.name}"`
          } else if (action.action === 'set_theme' && action.color) {
            setThemeColor(action.color)
            content = content.replace(jsonMatch[0], '').trim() || `Changed theme color to ${action.color}`
          }
        }
      } catch (e) { /* not an action */ }

      setChatMessages(prev => [...prev, { role: 'assistant', content }])
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  // Load a micro-template with all its capsules and settings
  const handleLoadMicroTemplate = (template: MicroTemplate) => {
    setProjectName(template.name)
    setThemeColor(template.settings.themeColor)
    setAppIcon(template.settings.appIcon)
    setSelectedPlatforms(template.settings.platforms)

    // Convert template capsules to CapsuleInstance format
    const capsules: CapsuleInstance[] = template.capsules.map(c => ({
      id: c.id,
      type: c.type,
      icon: c.icon,
      name: c.name,
      props: c.props as CapsuleProps
    }))

    setCanvasCapsules(capsules)
    setActiveSection('design')
    setShowTemplatePreview(false)
    setSelectedTemplate(null)
  }

  // Preview a template before loading
  const handlePreviewTemplate = (template: MicroTemplate) => {
    setSelectedTemplate(template)
    setShowTemplatePreview(true)
  }

  // Legacy template loader (for backwards compatibility)
  const handleLoadTemplate = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      handleLoadMicroTemplate(template)
    }
  }

  // Get filtered templates based on category and search
  const filteredTemplates = templateSearch
    ? searchTemplates(templateSearch)
    : getTemplatesByCategory(templateCategory)

  const getPreviewCode = () => {
    switch (previewPlatform) {
      case 'swiftui': return generateSwiftUI(canvasCapsules, projectName, themeColor)
      case 'kotlin': return generateKotlin(canvasCapsules, projectName, themeColor)
      case 'react': return generateReact(canvasCapsules, projectName, themeColor)
    }
  }

  const handleExport = async (platform: string) => {
    setExporting(true)
    setExportPlatform(platform)

    try {
      const zip = new JSZip()

      // Generate code based on platform
      let mainCode = ''
      let fileName = ''

      if (platform === 'ios') {
        mainCode = generateSwiftUI(canvasCapsules, projectName, themeColor)
        fileName = 'ContentView.swift'
        zip.file(fileName, mainCode)
        zip.file('Info.plist', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>${projectName}</string>
    <key>CFBundleIdentifier</key>
    <string>com.hublab.${projectName.toLowerCase().replace(/\s+/g, '')}</string>
</dict>
</plist>`)
      } else if (platform === 'android') {
        mainCode = generateKotlin(canvasCapsules, projectName, themeColor)
        fileName = 'MainActivity.kt'
        zip.file(`app/src/main/java/com/hublab/${projectName.toLowerCase().replace(/\s+/g, '')}/${fileName}`, mainCode)
      } else if (platform === 'web') {
        mainCode = generateReact(canvasCapsules, projectName, themeColor)
        fileName = 'App.tsx'
        zip.file(`src/${fileName}`, mainCode)
        zip.file('package.json', JSON.stringify({
          name: projectName.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' }
        }, null, 2))
      }

      zip.file('README.md', `# ${projectName}\n\nGenerated by HubLab - https://hublab.dev\n\n## Platform: ${platform}\n## Generated: ${new Date().toISOString()}`)

      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${platform}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setExporting(false)
      setShowExportModal(false)
    }
  }

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  return (
    <div className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Left Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex w-16 bg-[#0f0f0f] border-r border-white/5 flex-col items-center py-4">
        <Link href="/" className="mb-8">
          <img src="/logo.jpeg" alt="HubLab" className="w-10 h-10 rounded-xl object-cover" />
        </Link>

        <nav className="flex-1 flex flex-col items-center gap-2">
          <button
            onClick={() => setActiveSection('design')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'design' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Design"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </button>

          <button
            onClick={() => setActiveSection('templates')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'templates' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Templates"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>

          <button
            onClick={() => setActiveSection('capsules')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'capsules' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Capsules"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </button>

          <button
            onClick={() => setActiveSection('docs')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeSection === 'docs' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            title="Documentation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setShowChatPanel(!showChatPanel)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${showChatPanel ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            title="AI Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            title="AI Generator"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Secondary Sidebar - Hidden on mobile, shown as overlay */}
      <aside className={`${isMobile ? (mobileActivePanel === 'capsules' ? 'fixed inset-0 z-40 w-full' : 'hidden') : 'w-72'} bg-[#0f0f0f] border-r border-white/5 flex flex-col`}>
        {isMobile && mobileActivePanel === 'capsules' && (
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-lg capitalize">{activeSection}</h2>
            <button onClick={() => setMobileActivePanel('none')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {!isMobile && (
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold text-lg capitalize">{activeSection}</h2>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {activeSection === 'design' && (
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Screens */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">Screens ({screens.length})</label>
                  <button onClick={() => setShowScreenModal(true)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
                </div>
                <div className="space-y-1">
                  {screens.map(screen => (
                    <div
                      key={screen.id}
                      onClick={() => setCurrentScreenId(screen.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer group ${
                        currentScreenId === screen.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm">📱</span>
                      <span className="flex-1 text-sm truncate">{screen.name}</span>
                      <span className="text-xs text-gray-500">{screen.capsules.length}</span>
                      {screens.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteScreen(screen.id) }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Target Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'ios', name: 'iOS', icon: '🍎' },
                    { id: 'android', name: 'Android', icon: '🤖' },
                    { id: 'web', name: 'Web', icon: '🌐' },
                    { id: 'desktop', name: 'Desktop', icon: '💻' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        selectedPlatforms.includes(p.id)
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">Components ({canvasCapsules.length})</label>
                  <button onClick={() => setActiveSection('capsules')} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
                </div>
                {canvasCapsules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <div className="text-2xl mb-2">📦</div>
                    No components yet
                    <div className="text-xs mt-1">Add capsules from the library</div>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDndDragEnd}
                  >
                    <SortableContext
                      items={canvasCapsules.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1">
                        {canvasCapsules.map((capsule, index) => (
                          <SortableCapsuleItem
                            key={capsule.id}
                            capsule={capsule}
                            index={index}
                            isSelected={selectedCapsuleId === capsule.id}
                            onSelect={() => setSelectedCapsuleId(capsule.id)}
                            onDuplicate={() => handleDuplicateCapsule(capsule.id)}
                            onRemove={() => handleRemoveCapsule(capsule.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          )}

          {activeSection === 'templates' && (
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATE_CATEGORIES.slice(0, 6).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setTemplateCategory(cat.id); setTemplateSearch('') }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      templateCategory === cat.id && !templateSearch
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    {cat.name === 'All Templates' ? 'All' : cat.name}
                  </button>
                ))}
              </div>

              {/* More Categories Dropdown */}
              <details className="group">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 flex items-center gap-1">
                  <span>More categories</span>
                  <svg className="w-3 h-3 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {TEMPLATE_CATEGORIES.slice(6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setTemplateCategory(cat.id); setTemplateSearch('') }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        templateCategory === cat.id && !templateSearch
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </details>

              {/* Templates Grid */}
              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">🔍</div>
                    <div className="text-sm">No templates found</div>
                  </div>
                ) : (
                  filteredTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handlePreviewTemplate(template)}
                      className="w-full group relative overflow-hidden rounded-xl border border-white/5 hover:border-white/20 transition-all text-left"
                    >
                      {/* Preview Color Bar */}
                      <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: template.settings.themeColor }}
                      />
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{template.name}</span>
                              {template.featured && (
                                <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded-full font-medium">
                                  Featured
                                </span>
                              )}
                              {template.new && (
                                <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full font-medium">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 truncate mt-0.5">{template.description}</div>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                              <span className="flex items-center gap-1">
                                <span>{template.capsules.length}</span>
                                <span>components</span>
                              </span>
                              <span>•</span>
                              <span>{template.estimatedTime}</span>
                              <span>•</span>
                              <span className="capitalize">{template.difficulty}</span>
                            </div>
                            {/* Platform badges */}
                            <div className="flex gap-1 mt-2">
                              {template.settings.platforms.includes('ios') && (
                                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] rounded">iOS</span>
                              )}
                              {template.settings.platforms.includes('android') && (
                                <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[9px] rounded">Android</span>
                              )}
                              {template.settings.platforms.includes('web') && (
                                <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 text-[9px] rounded">Web</span>
                              )}
                              {template.settings.platforms.includes('desktop') && (
                                <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 text-[9px] rounded">Desktop</span>
                              )}
                            </div>
                          </div>
                          {/* Arrow */}
                          <svg className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === 'capsules' && (
            <div className="p-4 space-y-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search capsules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {filteredCapsules.map(capsule => (
                  <button
                    key={capsule.id}
                    onClick={() => handleAddCapsule(capsule)}
                    className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <span className="text-xl">{capsule.icon}</span>
                    <span className="text-xs font-medium truncate w-full text-center">{capsule.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'docs' && (
            <div className="p-4 space-y-2">
              {DOCS_SECTIONS.map(section => (
                <Link
                  key={section.id}
                  href={`/docs?section=${section.id}`}
                  target="_blank"
                  className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left"
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium text-sm">{section.title}</span>
                  <svg className="w-3 h-3 ml-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Canvas */}
      <main className={`flex-1 flex flex-col ${isMobile ? 'pb-16' : ''}`}>
        {/* Mobile Header */}
        {isMobile ? (
          <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <Link href="/">
                <img src="/logo.jpeg" alt="HubLab" className="w-8 h-8 rounded-lg object-cover" />
              </Link>
              <h1 className="font-semibold text-sm truncate max-w-[120px]">{projectName}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCodePreview(true)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
              <button onClick={() => setShowExportModal(true)} className="p-2 rounded-lg" style={{ backgroundColor: themeColor }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
          </header>
        ) : (
          <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]">
            <div className="flex items-center gap-4">
              <span className="text-xl">{appIcon}</span>
              <h1 className="font-semibold">{projectName}</h1>
              <span className="text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded">{currentScreen?.name}</span>
              {lastSaved && (
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Saved
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Undo/Redo buttons */}
              <div className="flex items-center gap-1 mr-2 border-r border-white/10 pr-3">
                <button
                  onClick={() => historyIndex > 0 && (setHistoryIndex(prev => prev - 1), setCanvasCapsules(history[historyIndex - 1]))}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  title="Undo (⌘Z)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => historyIndex < history.length - 1 && (setHistoryIndex(prev => prev + 1), setCanvasCapsules(history[historyIndex + 1]))}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  title="Redo (⌘⇧Z)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>
              <button onClick={() => setShowCodePreview(true)} className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 hover:bg-white/5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-1.5 text-sm text-white rounded-lg flex items-center gap-2"
                style={{ backgroundColor: themeColor }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export
              </button>
            </div>
          </header>
        )}

        <div className={`flex-1 overflow-auto ${isMobile ? 'p-4' : 'p-8'} bg-[#050505]`}>
          <div className="h-full flex items-center justify-center">
            <div className="relative">
              <div className={`${isMobile ? 'w-[280px] h-[560px]' : 'w-[320px] h-[640px]'} bg-gray-900 rounded-[40px] border-4 border-gray-800 shadow-2xl overflow-hidden`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                <div className="w-full h-full bg-white overflow-y-auto">
                  <div className="h-12 flex items-center justify-center pt-2" style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}>
                    <span className="text-white text-sm font-semibold">{projectName}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {canvasCapsules.length === 0 ? (
                      <div className="h-[500px] flex flex-col items-center justify-center text-gray-400">
                        <div className="text-4xl mb-3">📱</div>
                        <div className="text-sm font-medium">Your app preview</div>
                        <div className="text-xs mt-1">Add capsules to see them here</div>
                      </div>
                    ) : (
                      canvasCapsules.map((capsule, index) => (
                        <div
                          key={capsule.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, capsule.id)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedCapsuleId(capsule.id)}
                          className={`animate-fadeIn cursor-pointer relative group transition-all ${
                            selectedCapsuleId === capsule.id ? 'ring-2 ring-offset-2 rounded-xl' : ''
                          } ${draggedCapsule === capsule.id ? 'opacity-50 scale-95' : ''} ${
                            dragOverIndex === index ? 'border-t-4 border-blue-500 pt-2' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms`, '--tw-ring-color': selectedCapsuleId === capsule.id ? themeColor : undefined } as React.CSSProperties}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveCapsule(capsule.id) }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center"
                          >
                            ×
                          </button>
                          {capsule.type === 'navigation' && (
                            <div className="flex justify-around py-2 bg-gray-100 rounded-lg">
                              {(String(capsule.props?.items || 'Home,Search,Profile')).split(',').map(t => (
                                <span key={t} className="text-xs text-gray-600">{t.trim()}</span>
                              ))}
                            </div>
                          )}
                          {capsule.type === 'text' && (
                            <div className="py-2">
                              <div className={`text-gray-900 ${capsule.props?.bold ? 'font-bold' : ''} ${capsule.props?.size === 'lg' ? 'text-xl' : capsule.props?.size === 'sm' ? 'text-sm' : 'text-lg'}`}>
                                {String(capsule.props?.content || 'Hello World')}
                              </div>
                            </div>
                          )}
                          {capsule.type === 'button' && (
                            <button
                              className={`w-full py-3 rounded-xl font-medium text-white ${capsule.props?.disabled ? 'opacity-50' : ''}`}
                              style={{ backgroundColor: capsule.props?.variant === 'secondary' ? '#6b7280' : capsule.props?.variant === 'outline' ? 'transparent' : themeColor, border: capsule.props?.variant === 'outline' ? `2px solid ${themeColor}` : 'none', color: capsule.props?.variant === 'outline' ? themeColor : 'white' }}
                            >
                              {String(capsule.props?.text || 'Click Me')}
                            </button>
                          )}
                          {capsule.type === 'card' && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="w-full h-24 bg-gray-200 rounded-lg mb-3" />
                              <div className="font-medium text-gray-900">{String(capsule.props?.title || 'Card Title')}</div>
                              <div className="text-xs text-gray-500">{String(capsule.props?.description || 'Card description')}</div>
                            </div>
                          )}
                          {capsule.type === 'input' && (
                            <div>
                              {capsule.props?.label && <label className="text-xs text-gray-600 mb-1 block">{String(capsule.props.label)}</label>}
                              <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-400 text-sm">{String(capsule.props?.placeholder || 'Type something...')}</div>
                            </div>
                          )}
                          {capsule.type === 'switch' && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <span className="text-sm text-gray-700">{String(capsule.props?.label || 'Toggle')}</span>
                              <div className={`w-12 h-6 rounded-full p-1`} style={{ backgroundColor: capsule.props?.checked ? themeColor : '#d1d5db' }}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-all ${capsule.props?.checked ? 'ml-auto' : ''}`} />
                              </div>
                            </div>
                          )}
                          {capsule.type === 'progress' && (
                            <div className="space-y-2">
                              {capsule.props?.showLabel && (
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Progress</span>
                                  <span>{capsule.props?.value || 75}%</span>
                                </div>
                              )}
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${capsule.props?.value || 75}%`, backgroundColor: themeColor }} />
                              </div>
                            </div>
                          )}
                          {capsule.type === 'chart' && (
                            <div className="h-32 bg-gray-50 rounded-xl p-3 flex items-end justify-around">
                              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                                <div key={i} className="w-6 rounded-t" style={{ height: `${h}%`, backgroundColor: themeColor }} />
                              ))}
                            </div>
                          )}
                          {capsule.type === 'list' && (
                            <div className="space-y-2">
                              {Array.from({ length: Number(capsule.props?.items) || 3 }).map((_, i) => (
                                <div key={i} className={`flex items-center gap-2 p-2 bg-gray-50 rounded-lg ${capsule.props?.showDivider && i > 0 ? 'border-t border-gray-200' : ''}`}>
                                  <div className="w-8 h-8 bg-gray-200 rounded" />
                                  <span className="text-sm text-gray-700">Item {i + 1}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {capsule.type === 'image' && (
                            <div className={`w-full h-40 bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center ${capsule.props?.rounded ? 'rounded-xl' : ''}`}>
                              <span className="text-3xl">🖼️</span>
                            </div>
                          )}
                          {!['navigation', 'text', 'button', 'card', 'input', 'image', 'list', 'chart', 'switch', 'progress'].includes(capsule.type) && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <span className="text-xl">{capsule.icon}</span>
                              <span className="text-sm text-gray-700">{capsule.name}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full" />
              </div>
              <div className="absolute -right-48 top-0 w-40 text-xs text-gray-500 space-y-4">
                <div>
                  <div className="text-gray-400 font-medium">Components</div>
                  <div className="text-2xl font-bold text-white">{canvasCapsules.length}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">Screens</div>
                  <div className="text-2xl font-bold text-white">{screens.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Properties Panel - Overlay on mobile */}
      {selectedCapsule && (isMobile ? mobileActivePanel === 'properties' : true) && (
        <aside className={`${isMobile ? 'fixed inset-0 z-40 w-full' : 'w-72'} bg-[#0f0f0f] border-l border-white/5 flex flex-col overflow-hidden`}>
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCapsule.icon}</span>
                <span className="font-medium">{selectedCapsule.name}</span>
              </div>
              <button onClick={() => { setSelectedCapsuleId(null); if (isMobile) setMobileActivePanel('none'); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Properties</div>
            {selectedCapsule.type === 'button' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Button Text</label>
                  <input type="text" value={String(selectedCapsule.props?.text || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Variant</label>
                  <select value={String(selectedCapsule.props?.variant || 'primary')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'variant', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>
              </>
            )}
            {selectedCapsule.type === 'text' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Content</label>
                  <textarea value={String(selectedCapsule.props?.content || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'content', e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Size</label>
                  <select value={String(selectedCapsule.props?.size || 'md')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.bold)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'bold', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Bold</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'card' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title</label>
                  <input type="text" value={String(selectedCapsule.props?.title || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Description</label>
                  <textarea value={String(selectedCapsule.props?.description || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'description', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" />
                </div>
              </>
            )}
            {selectedCapsule.type === 'input' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input type="text" value={String(selectedCapsule.props?.label || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Placeholder</label>
                  <input type="text" value={String(selectedCapsule.props?.placeholder || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </>
            )}
            {selectedCapsule.type === 'switch' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input type="text" value={String(selectedCapsule.props?.label || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.checked)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'checked', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Default On</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'progress' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Value ({selectedCapsule.props?.value || 75}%)</label>
                  <input type="range" min="0" max="100" value={Number(selectedCapsule.props?.value || 75)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.showLabel)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showLabel', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Label</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'navigation' && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">Items (comma separated)</label>
                <input type="text" value={String(selectedCapsule.props?.items || 'Home,Search,Profile')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            )}
            {selectedCapsule.type === 'image' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Image URL</label>
                  <input type="text" value={String(selectedCapsule.props?.src || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'src', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Alt Text</label>
                  <input type="text" value={String(selectedCapsule.props?.alt || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'alt', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.rounded)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'rounded', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Rounded Corners</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'list' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Number of Items</label>
                  <input type="number" min="1" max="20" value={Number(selectedCapsule.props?.items || 3)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.showDivider)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showDivider', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Dividers</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'modal' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title</label>
                  <input type="text" value={String(selectedCapsule.props?.title || 'Modal Title')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Size</label>
                  <select value={String(selectedCapsule.props?.size || 'md')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="full">Fullscreen</option>
                  </select>
                </div>
              </>
            )}
            {selectedCapsule.type === 'tabs' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tab Names (comma separated)</label>
                  <input type="text" value={String(selectedCapsule.props?.tabs || 'Tab 1,Tab 2,Tab 3')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'tabs', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Style</label>
                  <select value={String(selectedCapsule.props?.style || 'default')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'style', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="default">Default</option>
                    <option value="pills">Pills</option>
                    <option value="underline">Underline</option>
                  </select>
                </div>
              </>
            )}
            {selectedCapsule.type === 'accordion' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Sections (comma separated)</label>
                  <input type="text" value={String(selectedCapsule.props?.sections || 'Section 1,Section 2,Section 3')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'sections', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.allowMultiple)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'allowMultiple', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Allow Multiple Open</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'form' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Form Title</label>
                  <input type="text" value={String(selectedCapsule.props?.title || 'Form')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Submit Button Text</label>
                  <input type="text" value={String(selectedCapsule.props?.submitText || 'Submit')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'submitText', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </>
            )}
            {selectedCapsule.type === 'slider' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input type="text" value={String(selectedCapsule.props?.label || 'Value')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Min Value</label>
                  <input type="number" value={Number(selectedCapsule.props?.min || 0)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'min', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Max Value</label>
                  <input type="number" value={Number(selectedCapsule.props?.max || 100)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'max', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Default Value ({selectedCapsule.props?.value || 50})</label>
                  <input type="range" min={Number(selectedCapsule.props?.min || 0)} max={Number(selectedCapsule.props?.max || 100)} value={Number(selectedCapsule.props?.value || 50)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', parseInt(e.target.value))} className="w-full" />
                </div>
              </>
            )}
            {selectedCapsule.type === 'dropdown' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input type="text" value={String(selectedCapsule.props?.label || 'Select')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Options (comma separated)</label>
                  <input type="text" value={String(selectedCapsule.props?.options || 'Option 1,Option 2,Option 3')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'options', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Placeholder</label>
                  <input type="text" value={String(selectedCapsule.props?.placeholder || 'Select an option')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </>
            )}
            {selectedCapsule.type === 'datepicker' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input type="text" value={String(selectedCapsule.props?.label || 'Select Date')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Format</label>
                  <select value={String(selectedCapsule.props?.format || 'date')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'format', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="date">Date Only</option>
                    <option value="time">Time Only</option>
                    <option value="datetime">Date & Time</option>
                  </select>
                </div>
              </>
            )}
            {selectedCapsule.type === 'chart' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title</label>
                  <input type="text" value={String(selectedCapsule.props?.title || 'Chart')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Chart Type</label>
                  <select value={String(selectedCapsule.props?.type || 'bar')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                    <option value="area">Area</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.showLegend)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showLegend', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Legend</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'table' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Columns (comma separated)</label>
                  <input type="text" value={String(selectedCapsule.props?.columns || 'Name,Email,Status')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'columns', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Sample Rows</label>
                  <input type="number" min="1" max="10" value={Number(selectedCapsule.props?.rows || 3)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'rows', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.striped)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'striped', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Striped Rows</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'video' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Video URL</label>
                  <input type="text" value={String(selectedCapsule.props?.src || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'src', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Poster Image URL</label>
                  <input type="text" value={String(selectedCapsule.props?.poster || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'poster', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.autoplay)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'autoplay', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Autoplay</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.controls !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'controls', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Controls</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'audio' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Audio URL</label>
                  <input type="text" value={String(selectedCapsule.props?.src || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'src', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title</label>
                  <input type="text" value={String(selectedCapsule.props?.title || 'Audio Track')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.showWaveform)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showWaveform', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Waveform</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'carousel' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Number of Slides</label>
                  <input type="number" min="2" max="10" value={Number(selectedCapsule.props?.slides || 3)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'slides', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.autoPlay)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'autoPlay', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Auto Play</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.showDots !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showDots', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Dots</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.showArrows !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showArrows', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Arrows</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'camera' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Mode</label>
                  <select value={String(selectedCapsule.props?.mode || 'photo')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'mode', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Default Camera</label>
                  <select value={String(selectedCapsule.props?.facing || 'back')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'facing', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="back">Back Camera</option>
                    <option value="front">Front Camera</option>
                  </select>
                </div>
              </>
            )}
            {selectedCapsule.type === 'location' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Map Style</label>
                  <select value={String(selectedCapsule.props?.mapStyle || 'standard')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'mapStyle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="standard">Standard</option>
                    <option value="satellite">Satellite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.showUserLocation !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showUserLocation', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show User Location</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.allowSearch)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'allowSearch', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Allow Search</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'biometrics' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Auth Type</label>
                  <select value={String(selectedCapsule.props?.authType || 'any')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'authType', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="any">Any Available</option>
                    <option value="faceId">Face ID</option>
                    <option value="touchId">Touch ID / Fingerprint</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Prompt Text</label>
                  <input type="text" value={String(selectedCapsule.props?.prompt || 'Authenticate to continue')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'prompt', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.fallbackToPasscode)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'fallbackToPasscode', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Fallback to Passcode</label>
                </div>
              </>
            )}
            {selectedCapsule.type === 'notifications' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Default Title</label>
                  <input type="text" value={String(selectedCapsule.props?.title || 'Notification')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Default Body</label>
                  <input type="text" value={String(selectedCapsule.props?.body || 'Notification body')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'body', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.badge)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'badge', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Show Badge</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selectedCapsule.props?.sound !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'sound', e.target.checked)} className="rounded" />
                  <label className="text-sm text-gray-400">Play Sound</label>
                </div>
              </>
            )}
            {/* NEW UI COMPONENTS */}
            {selectedCapsule.type === 'avatar' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Image URL</label><input type="text" value={String(selectedCapsule.props?.src || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'src', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Name</label><input type="text" value={String(selectedCapsule.props?.name || 'User')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Size</label><select value={String(selectedCapsule.props?.size || 'md')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option><option value="xl">Extra Large</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Status</label><select value={String(selectedCapsule.props?.status || 'none')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'status', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="none">None</option><option value="online">Online</option><option value="offline">Offline</option><option value="busy">Busy</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'badge' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Text</label><input type="text" value={String(selectedCapsule.props?.text || 'New')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Variant</label><select value={String(selectedCapsule.props?.variant || 'primary')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'variant', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'chip' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Text</label><input type="text" value={String(selectedCapsule.props?.text || 'Tag')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.removable)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'removable', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Removable</label></div>
              </>
            )}
            {selectedCapsule.type === 'divider' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Orientation</label><select value={String(selectedCapsule.props?.orientation || 'horizontal')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'orientation', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Spacing</label><select value={String(selectedCapsule.props?.spacing || 'md')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'spacing', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'spacer' && (
              <div><label className="text-xs text-gray-400 block mb-1">Size (px)</label><input type="number" min="4" max="200" value={Number(selectedCapsule.props?.size || 16)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
            )}
            {selectedCapsule.type === 'icon' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Icon Name</label><input type="text" value={String(selectedCapsule.props?.name || 'star')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Size (px)</label><input type="number" min="12" max="96" value={Number(selectedCapsule.props?.size || 24)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Color</label><input type="color" value={String(selectedCapsule.props?.color || '#6366F1')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'color', e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg" /></div>
              </>
            )}
            {selectedCapsule.type === 'tooltip' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Text</label><input type="text" value={String(selectedCapsule.props?.text || 'Tooltip text')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Position</label><select value={String(selectedCapsule.props?.position || 'top')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'position', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'skeleton' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Type</label><select value={String(selectedCapsule.props?.type || 'text')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="text">Text</option><option value="avatar">Avatar</option><option value="card">Card</option><option value="image">Image</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Lines</label><input type="number" min="1" max="10" value={Number(selectedCapsule.props?.lines || 3)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'lines', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {/* NEW LAYOUT */}
            {selectedCapsule.type === 'drawer' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input type="text" value={String(selectedCapsule.props?.title || 'Menu')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Position</label><select value={String(selectedCapsule.props?.position || 'left')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'position', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="left">Left</option><option value="right">Right</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'header' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input type="text" value={String(selectedCapsule.props?.title || 'App Title')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showBack)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showBack', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Back</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showMenu !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showMenu', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Menu</label></div>
              </>
            )}
            {selectedCapsule.type === 'footer' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Text</label><input type="text" value={String(selectedCapsule.props?.text || '© 2024 MyApp')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Links (comma separated)</label><input type="text" value={String(selectedCapsule.props?.links || 'Privacy,Terms,Contact')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'links', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'sidebar' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Items (comma separated)</label><input type="text" value={String(selectedCapsule.props?.items || 'Dashboard,Settings,Profile')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.collapsed)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'collapsed', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Collapsed</label></div>
              </>
            )}
            {selectedCapsule.type === 'grid' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Columns</label><input type="number" min="1" max="6" value={Number(selectedCapsule.props?.columns || 2)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'columns', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Gap (px)</label><input type="number" min="0" max="48" value={Number(selectedCapsule.props?.gap || 16)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'gap', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'stack' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Direction</label><select value={String(selectedCapsule.props?.direction || 'vertical')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'direction', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Spacing (px)</label><input type="number" min="0" max="48" value={Number(selectedCapsule.props?.spacing || 8)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'spacing', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'scrollview' && (
              <>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.horizontal)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'horizontal', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Horizontal</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showIndicator !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showIndicator', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Indicator</label></div>
              </>
            )}
            {selectedCapsule.type === 'bottomsheet' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input type="text" value={String(selectedCapsule.props?.title || 'Sheet Title')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Snap Points</label><input type="text" value={String(selectedCapsule.props?.snapPoints || '25%,50%,90%')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'snapPoints', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'stepper' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Steps (comma separated)</label><input type="text" value={String(selectedCapsule.props?.steps || 'Step 1,Step 2,Step 3')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'steps', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Current Step</label><input type="number" min="1" max="10" value={Number(selectedCapsule.props?.current || 1)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'current', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'breadcrumb' && (
              <div><label className="text-xs text-gray-400 block mb-1">Items (comma separated)</label><input type="text" value={String(selectedCapsule.props?.items || 'Home,Products,Details')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
            )}
            {/* NEW FORMS */}
            {selectedCapsule.type === 'timepicker' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Select Time')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Format</label><select value={String(selectedCapsule.props?.format || '12h')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'format', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="12h">12 Hour</option><option value="24h">24 Hour</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'checkbox' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Accept terms')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.checked)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'checked', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Default Checked</label></div>
              </>
            )}
            {selectedCapsule.type === 'radio' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Option')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Options (comma separated)</label><input type="text" value={String(selectedCapsule.props?.options || 'Option A,Option B,Option C')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'options', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'textarea' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Placeholder</label><input type="text" value={String(selectedCapsule.props?.placeholder || 'Enter text...')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Rows</label><input type="number" min="2" max="20" value={Number(selectedCapsule.props?.rows || 4)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'rows', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Max Length</label><input type="number" min="0" max="5000" value={Number(selectedCapsule.props?.maxLength || 500)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'maxLength', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'searchbar' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Placeholder</label><input type="text" value={String(selectedCapsule.props?.placeholder || 'Search...')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showFilter)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showFilter', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Filter</label></div>
              </>
            )}
            {selectedCapsule.type === 'autocomplete' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Placeholder</label><input type="text" value={String(selectedCapsule.props?.placeholder || 'Type to search...')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Suggestions (comma separated)</label><input type="text" value={String(selectedCapsule.props?.suggestions || 'Apple,Banana,Cherry')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'suggestions', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'colorpicker' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Pick color')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Default Color</label><input type="color" value={String(selectedCapsule.props?.value || '#6366F1')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg" /></div>
              </>
            )}
            {selectedCapsule.type === 'filepicker' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Choose file')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Accept</label><input type="text" value={String(selectedCapsule.props?.accept || 'image/*')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'accept', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.multiple)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'multiple', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Multiple Files</label></div>
              </>
            )}
            {selectedCapsule.type === 'rating' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Max Stars</label><input type="number" min="3" max="10" value={Number(selectedCapsule.props?.max || 5)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'max', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Default Value</label><input type="number" min="0" max="10" value={Number(selectedCapsule.props?.value || 3)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.allowHalf)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'allowHalf', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Allow Half</label></div>
              </>
            )}
            {selectedCapsule.type === 'signature' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Sign here')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Stroke Width</label><input type="number" min="1" max="10" value={Number(selectedCapsule.props?.strokeWidth || 2)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'strokeWidth', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'otp' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Length</label><input type="number" min="4" max="8" value={Number(selectedCapsule.props?.length || 6)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'length', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Type</label><select value={String(selectedCapsule.props?.type || 'number')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="number">Numbers Only</option><option value="alphanumeric">Alphanumeric</option></select></div>
              </>
            )}
            {/* NEW DATA */}
            {selectedCapsule.type === 'stat' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Total Sales')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Value</label><input type="text" value={String(selectedCapsule.props?.value || '12,345')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Change</label><input type="text" value={String(selectedCapsule.props?.change || '+12%')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'change', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Trend</label><select value={String(selectedCapsule.props?.trend || 'up')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'trend', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="up">Up</option><option value="down">Down</option><option value="neutral">Neutral</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'counter' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Default Value</label><input type="number" value={Number(selectedCapsule.props?.value || 0)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Min</label><input type="number" value={Number(selectedCapsule.props?.min || 0)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'min', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Max</label><input type="number" value={Number(selectedCapsule.props?.max || 100)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'max', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Step</label><input type="number" min="1" value={Number(selectedCapsule.props?.step || 1)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'step', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'timeline' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Items (comma separated)</label><input type="text" value={String(selectedCapsule.props?.items || 'Event 1,Event 2,Event 3')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Orientation</label><select value={String(selectedCapsule.props?.orientation || 'vertical')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'orientation', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'calendar' && (
              <>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showWeekNumbers)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showWeekNumbers', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Week Numbers</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.multiSelect)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'multiSelect', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Multi Select</label></div>
              </>
            )}
            {selectedCapsule.type === 'gauge' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Label</label><input type="text" value={String(selectedCapsule.props?.label || 'Progress')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'label', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Value</label><input type="number" min="0" max="100" value={Number(selectedCapsule.props?.value || 75)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'kanban' && (
              <div><label className="text-xs text-gray-400 block mb-1">Columns (comma separated)</label><input type="text" value={String(selectedCapsule.props?.columns || 'To Do,In Progress,Done')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'columns', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
            )}
            {/* NEW MEDIA */}
            {selectedCapsule.type === 'gallery' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Columns</label><input type="number" min="2" max="6" value={Number(selectedCapsule.props?.columns || 3)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'columns', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Gap (px)</label><input type="number" min="0" max="24" value={Number(selectedCapsule.props?.gap || 8)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'gap', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Sample Images</label><input type="number" min="1" max="20" value={Number(selectedCapsule.props?.images || 6)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'images', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'lightbox' && (
              <>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showThumbnails !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showThumbnails', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Thumbnails</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.zoomEnabled !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'zoomEnabled', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Enable Zoom</label></div>
              </>
            )}
            {selectedCapsule.type === 'qrcode' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Value</label><input type="text" value={String(selectedCapsule.props?.value || 'https://hublab.dev')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Size (px)</label><input type="number" min="100" max="400" value={Number(selectedCapsule.props?.size || 200)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'barcode' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Value</label><input type="text" value={String(selectedCapsule.props?.value || '123456789')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Format</label><select value={String(selectedCapsule.props?.format || 'CODE128')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'format', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="CODE128">Code 128</option><option value="EAN13">EAN-13</option><option value="UPC">UPC</option><option value="CODE39">Code 39</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'lottie' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Animation URL</label><input type="text" value={String(selectedCapsule.props?.src || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'src', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.loop !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'loop', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Loop</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.autoplay !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'autoplay', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Autoplay</label></div>
              </>
            )}
            {selectedCapsule.type === 'threed' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Model URL</label><input type="text" value={String(selectedCapsule.props?.src || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'src', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.autoRotate !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'autoRotate', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Auto Rotate</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.enableZoom !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'enableZoom', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Enable Zoom</label></div>
              </>
            )}
            {/* NEW FEEDBACK */}
            {selectedCapsule.type === 'toast' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Message</label><input type="text" value={String(selectedCapsule.props?.message || 'Action completed')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'message', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Type</label><select value={String(selectedCapsule.props?.type || 'success')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="success">Success</option><option value="error">Error</option><option value="warning">Warning</option><option value="info">Info</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Duration (ms)</label><input type="number" min="1000" max="10000" step="500" value={Number(selectedCapsule.props?.duration || 3000)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'duration', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'alert' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input type="text" value={String(selectedCapsule.props?.title || 'Alert')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Message</label><input type="text" value={String(selectedCapsule.props?.message || 'This is an alert message')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'message', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Type</label><select value={String(selectedCapsule.props?.type || 'info')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'snackbar' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Message</label><input type="text" value={String(selectedCapsule.props?.message || 'Item saved')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'message', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Action Text</label><input type="text" value={String(selectedCapsule.props?.action || 'Undo')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'action', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'loading' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Size</label><select value={String(selectedCapsule.props?.size || 'md')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Text</label><input type="text" value={String(selectedCapsule.props?.text || 'Loading...')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'spinner' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Size</label><select value={String(selectedCapsule.props?.size || 'md')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'size', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Color</label><input type="color" value={String(selectedCapsule.props?.color || '#6366F1')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'color', e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg" /></div>
              </>
            )}
            {selectedCapsule.type === 'confetti' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Pieces</label><input type="number" min="50" max="500" value={Number(selectedCapsule.props?.pieces || 200)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'pieces', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Duration (ms)</label><input type="number" min="1000" max="10000" step="500" value={Number(selectedCapsule.props?.duration || 3000)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'duration', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'emptystate' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input type="text" value={String(selectedCapsule.props?.title || 'No data')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Description</label><input type="text" value={String(selectedCapsule.props?.description || 'Nothing to show here')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Icon</label><input type="text" value={String(selectedCapsule.props?.icon || 'inbox')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'icon', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'errorstate' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input type="text" value={String(selectedCapsule.props?.title || 'Error')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Description</label><input type="text" value={String(selectedCapsule.props?.description || 'Something went wrong')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showRetry !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showRetry', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Retry</label></div>
              </>
            )}
            {/* NEW SOCIAL */}
            {selectedCapsule.type === 'comment' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Author</label><input type="text" value={String(selectedCapsule.props?.author || 'User')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'author', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Content</label><textarea value={String(selectedCapsule.props?.content || 'Great post!')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'content', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" /></div>
              </>
            )}
            {selectedCapsule.type === 'like' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Count</label><input type="number" min="0" value={Number(selectedCapsule.props?.count || 42)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'count', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.liked)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'liked', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Default Liked</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showCount !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showCount', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Count</label></div>
              </>
            )}
            {selectedCapsule.type === 'share' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Platforms (comma separated)</label><input type="text" value={String(selectedCapsule.props?.platforms || 'facebook,twitter,linkedin')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'platforms', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showCount)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showCount', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Count</label></div>
              </>
            )}
            {selectedCapsule.type === 'follow' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Followers Count</label><input type="number" min="0" value={Number(selectedCapsule.props?.count || 1234)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'count', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.following)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'following', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Default Following</label></div>
              </>
            )}
            {selectedCapsule.type === 'usercard' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Name</label><input type="text" value={String(selectedCapsule.props?.name || 'John Doe')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Subtitle</label><input type="text" value={String(selectedCapsule.props?.subtitle || 'Designer')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'subtitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showAvatar !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showAvatar', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Avatar</label></div>
              </>
            )}
            {selectedCapsule.type === 'chatbubble' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Message</label><input type="text" value={String(selectedCapsule.props?.message || 'Hello!')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'message', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.isOwn)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'isOwn', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Own Message</label></div>
              </>
            )}
            {selectedCapsule.type === 'reaction' && (
              <div><label className="text-xs text-gray-400 block mb-1">Reactions (comma separated)</label><input type="text" value={String(selectedCapsule.props?.reactions || '👍,❤️,😂,😮,😢')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'reactions', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
            )}
            {selectedCapsule.type === 'mention' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Prefix</label><input type="text" value={String(selectedCapsule.props?.prefix || '@')} maxLength={1} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'prefix', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Suggestions (comma separated)</label><input type="text" value={String(selectedCapsule.props?.suggestions || 'user1,user2,user3')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'suggestions', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {/* NEW E-COMMERCE */}
            {selectedCapsule.type === 'productcard' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input type="text" value={String(selectedCapsule.props?.title || 'Product')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Price</label><input type="number" min="0" step="0.01" value={Number(selectedCapsule.props?.price || 29.99)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'price', parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Image URL</label><input type="text" value={String(selectedCapsule.props?.image || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'image', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Rating</label><input type="number" min="0" max="5" step="0.1" value={Number(selectedCapsule.props?.rating || 4.5)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'rating', parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'cart' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Items Count</label><input type="number" min="0" value={Number(selectedCapsule.props?.items || 3)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Total</label><input type="number" min="0" step="0.01" value={Number(selectedCapsule.props?.total || 99.99)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'total', parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showBadge !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showBadge', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Badge</label></div>
              </>
            )}
            {selectedCapsule.type === 'checkout' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Steps (comma separated)</label><input type="text" value={String(selectedCapsule.props?.steps || 'Cart,Shipping,Payment,Review')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'steps', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Current Step</label><input type="number" min="1" max="10" value={Number(selectedCapsule.props?.current || 1)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'current', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'pricetag' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Price</label><input type="number" min="0" step="0.01" value={Number(selectedCapsule.props?.price || 49.99)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'price', parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Old Price</label><input type="number" min="0" step="0.01" value={Number(selectedCapsule.props?.oldPrice || 79.99)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'oldPrice', parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Currency</label><input type="text" value={String(selectedCapsule.props?.currency || '$')} maxLength={3} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'currency', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'quantity' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Default Value</label><input type="number" min="1" value={Number(selectedCapsule.props?.value || 1)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'value', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Min</label><input type="number" min="0" value={Number(selectedCapsule.props?.min || 1)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'min', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Max</label><input type="number" min="1" value={Number(selectedCapsule.props?.max || 99)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'max', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'wishlist' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Items Count</label><input type="number" min="0" value={Number(selectedCapsule.props?.items || 5)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'items', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showCount !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showCount', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Count</label></div>
              </>
            )}
            {selectedCapsule.type === 'coupon' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Placeholder</label><input type="text" value={String(selectedCapsule.props?.placeholder || 'Enter code')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.applied)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'applied', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Default Applied</label></div>
              </>
            )}
            {selectedCapsule.type === 'review' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Rating</label><input type="number" min="1" max="5" value={Number(selectedCapsule.props?.rating || 5)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'rating', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Author</label><input type="text" value={String(selectedCapsule.props?.author || 'Customer')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'author', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Content</label><textarea value={String(selectedCapsule.props?.content || 'Great product!')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'content', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" /></div>
              </>
            )}
            {/* NEW AI */}
            {selectedCapsule.type === 'chatbot' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Placeholder</label><input type="text" value={String(selectedCapsule.props?.placeholder || 'Ask me anything...')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'placeholder', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Welcome Message</label><input type="text" value={String(selectedCapsule.props?.welcomeMessage || 'Hello! How can I help?')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'welcomeMessage', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'voiceinput' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Language</label><select value={String(selectedCapsule.props?.language || 'en-US')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'language', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="en-US">English (US)</option><option value="en-GB">English (UK)</option><option value="es-ES">Spanish</option><option value="fr-FR">French</option><option value="de-DE">German</option><option value="ja-JP">Japanese</option><option value="zh-CN">Chinese</option></select></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.continuous)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'continuous', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Continuous</label></div>
              </>
            )}
            {selectedCapsule.type === 'texttospeech' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Default Text</label><textarea value={String(selectedCapsule.props?.text || '')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.value)} rows={2} placeholder="Text to speak..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Rate</label><input type="number" min="0.5" max="2" step="0.1" value={Number(selectedCapsule.props?.rate || 1)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'rate', parseFloat(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" /></div>
              </>
            )}
            {selectedCapsule.type === 'imagerecognition' && (
              <>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.labels !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'labels', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Detect Labels</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.faces)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'faces', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Detect Faces</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.text)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'text', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Detect Text (OCR)</label></div>
              </>
            )}
            {selectedCapsule.type === 'translation' && (
              <>
                <div><label className="text-xs text-gray-400 block mb-1">Source Language</label><select value={String(selectedCapsule.props?.source || 'auto')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'source', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="auto">Auto Detect</option><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="ja">Japanese</option><option value="zh">Chinese</option></select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Target Language</label><select value={String(selectedCapsule.props?.target || 'en')} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'target', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="ja">Japanese</option><option value="zh">Chinese</option></select></div>
              </>
            )}
            {selectedCapsule.type === 'sentiment' && (
              <>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showScore !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showScore', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Score</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={Boolean(selectedCapsule.props?.showEmoji !== false)} onChange={(e) => handleUpdateCapsuleProp(selectedCapsule.id, 'showEmoji', e.target.checked)} className="rounded" /><label className="text-sm text-gray-400">Show Emoji</label></div>
              </>
            )}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex gap-2">
                <button onClick={() => handleMoveCapsule(selectedCapsule.id, 'up')} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm rounded-lg flex items-center justify-center gap-1" title="Move Up">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Up
                </button>
                <button onClick={() => handleMoveCapsule(selectedCapsule.id, 'down')} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm rounded-lg flex items-center justify-center gap-1" title="Move Down">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Down
                </button>
              </div>
              <button onClick={() => handleDuplicateCapsule(selectedCapsule.id)} className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm rounded-lg flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate
              </button>
              <button onClick={() => handleRemoveCapsule(selectedCapsule.id)} className="w-full py-2 text-red-400 hover:text-red-300 text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Component
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Template Preview Modal */}
      {showTemplatePreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Header with gradient */}
            <div
              className="relative h-32 flex items-end p-6"
              style={{
                background: `linear-gradient(135deg, ${selectedTemplate.settings.themeColor}40 0%, ${selectedTemplate.settings.themeColor}10 100%)`
              }}
            >
              <button
                onClick={() => { setShowTemplatePreview(false); setSelectedTemplate(null) }}
                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/70 hover:text-white hover:bg-black/40 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: selectedTemplate.settings.themeColor + '30' }}
                >
                  {selectedTemplate.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                    {selectedTemplate.featured && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">Featured</span>
                    )}
                    {selectedTemplate.new && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">New</span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{selectedTemplate.description}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* About */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">About this template</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedTemplate.longDescription}</p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: selectedTemplate.settings.themeColor }}>
                    {selectedTemplate.capsules.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Components</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: selectedTemplate.settings.themeColor }}>
                    {selectedTemplate.estimatedTime}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">To Customize</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold capitalize" style={{ color: selectedTemplate.settings.themeColor }}>
                    {selectedTemplate.difficulty}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Difficulty</div>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Supported Platforms</h3>
                <div className="flex gap-2">
                  {selectedTemplate.settings.platforms.includes('ios') && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <span className="text-lg">🍎</span>
                      <span className="text-sm text-blue-400">iOS</span>
                    </div>
                  )}
                  {selectedTemplate.settings.platforms.includes('android') && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-lg">🤖</span>
                      <span className="text-sm text-green-400">Android</span>
                    </div>
                  )}
                  {selectedTemplate.settings.platforms.includes('web') && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <span className="text-lg">🌐</span>
                      <span className="text-sm text-purple-400">Web</span>
                    </div>
                  )}
                  {selectedTemplate.settings.platforms.includes('desktop') && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <span className="text-lg">🖥️</span>
                      <span className="text-sm text-orange-400">Desktop</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Components Preview */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Included Components</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.capsules.map(capsule => (
                    <span
                      key={capsule.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-300"
                    >
                      <span>{capsule.icon}</span>
                      <span>{capsule.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedTemplate.settings.themeColor }}
                />
                <span className="text-sm text-gray-400">Theme: {selectedTemplate.settings.themeColor}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowTemplatePreview(false); setSelectedTemplate(null) }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLoadMicroTemplate(selectedTemplate)}
                  className="px-6 py-2 rounded-xl text-white font-semibold transition-all flex items-center gap-2"
                  style={{ backgroundColor: selectedTemplate.settings.themeColor }}
                >
                  <span>Use Template</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Export {projectName}</h3>
            <p className="text-gray-400 text-sm mb-6">Choose your target platform:</p>
            <div className="space-y-2">
              {[
                { id: 'ios', name: 'iOS (SwiftUI)', icon: '🍎', desc: 'Xcode project' },
                { id: 'android', name: 'Android (Kotlin)', icon: '🤖', desc: 'Android Studio project' },
                { id: 'web', name: 'Web (React)', icon: '🌐', desc: 'Next.js project' },
              ].filter(p => selectedPlatforms.includes(p.id)).map(platform => (
                <button key={platform.id} onClick={() => handleExport(platform.id)} disabled={exporting} className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left disabled:opacity-50">
                  <span className="text-2xl">{platform.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-sm text-gray-400">{platform.desc}</div>
                  </div>
                  {exporting && exportPlatform === platform.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setShowExportModal(false)} className="w-full mt-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Code Preview Modal */}
      {showCodePreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold">Code Preview</h3>
                <div className="flex gap-1">
                  {(['swiftui', 'kotlin', 'react'] as const).map(p => (
                    <button key={p} onClick={() => setPreviewPlatform(p)} className={`px-3 py-1 rounded-lg text-sm font-semibold ${previewPlatform === p ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                      {p === 'swiftui' ? 'SwiftUI' : p === 'kotlin' ? 'Kotlin' : 'React'}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowCodePreview(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{getPreviewCode()}</pre>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end gap-2">
              <button onClick={() => { navigator.clipboard.writeText(getPreviewCode()); }} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Copy Code</button>
              <button onClick={() => { setShowCodePreview(false); setShowExportModal(true) }} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">Export Project</button>
            </div>
          </div>
        </div>
      )}

      {/* New Screen Modal */}
      {showScreenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Add New Screen</h3>
            <input type="text" placeholder="Screen name" value={newScreenName} onChange={(e) => setNewScreenName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mb-4" autoFocus />
            <div className="flex gap-2">
              <button onClick={() => setShowScreenModal(false)} className="flex-1 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
              <button onClick={handleAddScreen} disabled={!newScreenName.trim()} className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50">Add Screen</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal - Enhanced with Icon Generator */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Project Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Name */}
              <div>
                <label className="text-xs text-gray-400 block mb-2 font-medium">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="My Amazing App"
                />
              </div>

              {/* App Icon Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs text-gray-400 font-medium">App Icon</label>
                  <button
                    onClick={() => setShowIconGenerator(!showIconGenerator)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    {showIconGenerator ? 'Simple Icons' : 'AI Generator'}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                </div>

                {!showIconGenerator ? (
                  /* Simple Emoji Picker */
                  <div className="flex gap-2 flex-wrap">
                    {['📱', '🚀', '💼', '🎮', '🛒', '📚', '🎵', '💪', '🍔', '✈️', '💬', '🏦', '🎨', '⚡', '🔮', '🌟'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setAppIcon(emoji)}
                        className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all ${
                          appIcon === emoji
                            ? 'ring-2 ring-offset-2 ring-offset-[#111] scale-110'
                            : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                        }`}
                        style={{ '--tw-ring-color': appIcon === emoji ? themeColor : undefined } as React.CSSProperties}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* AI Icon Generator */
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    {/* Current Icon Preview */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl"
                        style={{
                          background: generatedIconUrl || `linear-gradient(135deg, ${COLOR_PALETTES.find(p => p.id === selectedPalette)?.colors[0] || '#6366F1'}, ${COLOR_PALETTES.find(p => p.id === selectedPalette)?.colors[1] || '#8B5CF6'})`,
                        }}
                      >
                        {generatedIconUrl ? (
                          <img src={generatedIconUrl} alt="Generated Icon" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          <span className="text-white font-bold text-2xl">{projectName.charAt(0).toUpperCase() || 'A'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Preview</p>
                        <p className="text-xs text-gray-400">Your app icon across all platforms</p>
                      </div>
                    </div>

                    {/* Style Selector */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-400 block mb-2">Style</label>
                      <div className="grid grid-cols-5 gap-2">
                        {ICON_STYLES.map(style => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedIconStyle(style.id)}
                            className={`p-2 rounded-lg text-center transition-all ${
                              selectedIconStyle === style.id
                                ? 'bg-blue-500/20 ring-1 ring-blue-500'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            title={style.description}
                          >
                            <div className="text-xl mb-1">{style.preview}</div>
                            <div className="text-[10px] text-gray-400 truncate">{style.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Palette Selector */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-400 block mb-2">Color Palette</label>
                      <div className="grid grid-cols-4 gap-2">
                        {COLOR_PALETTES.map(palette => (
                          <button
                            key={palette.id}
                            onClick={() => setSelectedPalette(palette.id)}
                            className={`p-2 rounded-lg transition-all ${
                              selectedPalette === palette.id
                                ? 'ring-1 ring-white'
                                : 'hover:ring-1 hover:ring-white/30'
                            }`}
                          >
                            <div className="flex gap-0.5 mb-1.5 justify-center">
                              {palette.colors.slice(0, 4).map((color, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                              {palette.preview} {palette.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Prompt Input */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-400 block mb-2">Describe Your Icon (Optional)</label>
                      <input
                        type="text"
                        value={iconPrompt}
                        onChange={(e) => setIconPrompt(e.target.value)}
                        placeholder="e.g., A modern shopping cart with sparkles"
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={() => {
                        setIconGenerating(true)
                        const palette = COLOR_PALETTES.find(p => p.id === selectedPalette)
                        const iconUrl = generatePlaceholderIcon({
                          text: projectName || 'App',
                          color: palette?.colors[0] || '#6366F1',
                          size: 512,
                          style: selectedIconStyle === 'gradient' ? 'gradient' : selectedIconStyle === 'outline' ? 'outline' : 'solid'
                        })
                        setTimeout(() => {
                          setGeneratedIconUrl(iconUrl)
                          setAppIcon(iconUrl)
                          setIconGenerating(false)
                        }, 500)
                      }}
                      disabled={iconGenerating}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      {iconGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate Icon
                        </>
                      )}
                    </button>

                    {/* Export Sizes Info */}
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                      Generates icons for iOS (1024px), Android (512px), and Web (192px)
                    </p>
                  </div>
                )}
              </div>

              {/* Theme Color */}
              <div>
                <label className="text-xs text-gray-400 block mb-3 font-medium">Theme Color</label>
                <div className="flex gap-3 flex-wrap">
                  {['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#1E293B'].map(color => (
                    <button
                      key={color}
                      onClick={() => setThemeColor(color)}
                      className={`w-10 h-10 rounded-xl transition-all hover:scale-110 ${
                        themeColor === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111] scale-110'
                          : 'hover:ring-1 hover:ring-white/30'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* App Description */}
              <div>
                <label className="text-xs text-gray-400 block mb-2 font-medium">App Description (Optional)</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none h-20"
                  placeholder="Describe what your app does..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 text-white rounded-xl text-sm font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-2">AI App Generator</h3>
            <p className="text-sm text-gray-400 mb-4">Describe the app you want to build</p>
            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="E.g., A fitness tracking app with workout logging..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
              {['E-commerce app', 'Task manager', 'Restaurant menu', 'Fitness tracker'].map(idea => (
                <button key={idea} onClick={() => setAiPrompt(idea)} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-300">{idea}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAIModal(false)} className="flex-1 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
              <button
                onClick={async () => {
                  if (!aiPrompt.trim()) return
                  setAiLoading(true)
                  try {
                    const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
                    const AVAILABLE_CAPSULES = ['button', 'text', 'input', 'card', 'image', 'list', 'navigation', 'switch', 'progress', 'chart']
                    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
                        messages: [
                          { role: 'system', content: `Generate mobile app components. Return JSON: {"name":"AppName","capsules":[{"type":"button|text|card|input|switch|progress|navigation|list|chart","props":{}}]}. Types: ${AVAILABLE_CAPSULES.join(',')}. Return ONLY JSON.` },
                          { role: 'user', content: aiPrompt }
                        ],
                        temperature: 0.7,
                        max_tokens: 1024,
                      }),
                    })
                    const data = await res.json()
                    let content = data.choices?.[0]?.message?.content || ''
                    if (content.includes('```json')) content = content.split('```json')[1]
                    if (content.includes('```')) content = content.split('```')[0]
                    const parsed = JSON.parse(content.trim())
                    if (parsed.capsules) {
                      const newCapsules = parsed.capsules.filter((c: {type: string}) => AVAILABLE_CAPSULES.includes(c.type)).map((c: {type: string; props?: CapsuleProps}, i: number) => {
                        const def = ALL_CAPSULES.find(a => a.id === c.type)
                        return { id: `${c.type}_${Date.now()}_${i}`, type: c.type, icon: def?.icon || '📦', name: def?.name || c.type, props: c.props || DEFAULT_PROPS[c.type] || {} }
                      })
                      setCanvasCapsules([...canvasCapsules, ...newCapsules])
                      if (parsed.name) setProjectName(parsed.name)
                    }
                    setShowAIModal(false)
                    setAiPrompt('')
                  } catch (err) {
                    console.error('AI error:', err)
                    alert('Error generating. Try again.')
                  } finally {
                    setAiLoading(false)
                  }
                }}
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {aiLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</> : 'Generate App'}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">Powered by Groq AI</p>
          </div>
        </div>
      )}


      {/* AI Chat Panel */}
      {(showChatPanel || (isMobile && mobileActivePanel === 'chat')) && (
        <div className={`fixed ${isMobile ? 'inset-0 pb-16' : 'right-0 top-0 bottom-0 w-96'} bg-[#0f0f0f] border-l border-white/10 flex flex-col z-40 shadow-2xl`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button type="button" onClick={() => { setShowChatPanel(false); if (isMobile) setMobileActivePanel('none'); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white" title="Close chat">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-400 text-sm mb-4">Ask me to help build your app!</p>
                <div className="space-y-2">
                  {['Add a navigation bar', 'Change theme to blue', 'Add a login form', 'Rename to MyApp'].map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => { setChatInput(suggestion); }}
                      className="block w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-purple-500 text-white rounded-br-md'
                      : 'bg-white/10 text-gray-200 rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                placeholder="Ask AI to help..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-xl disabled:opacity-50 hover:bg-purple-600 transition-colors"
                title="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Powered by Groq AI</p>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f0f] border-t border-white/10 flex items-center justify-around z-50 px-2">
          <button
            onClick={() => setMobileActivePanel(mobileActivePanel === 'capsules' ? 'none' : 'capsules')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${mobileActivePanel === 'capsules' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-[10px]">Capsules</span>
          </button>

          <button
            onClick={() => setShowAIModal(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span className="text-[10px]">AI</span>
          </button>

          <button
            onClick={() => {
              if (selectedCapsule) {
                setMobileActivePanel(mobileActivePanel === 'properties' ? 'none' : 'properties')
              }
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${mobileActivePanel === 'properties' ? 'bg-white/10 text-white' : selectedCapsule ? 'text-gray-500' : 'text-gray-700 opacity-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span className="text-[10px]">Props</span>
          </button>

          <button
            onClick={() => setMobileActivePanel(mobileActivePanel === 'chat' ? 'none' : 'chat')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${mobileActivePanel === 'chat' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="text-[10px]">Chat</span>
          </button>
        </nav>
      )}
    </div>
  )
}
