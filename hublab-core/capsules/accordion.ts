/**
 * Accordion Capsule - Multi-Platform Collapsible Content
 *
 * Expandable/collapsible content sections
 */

import { CapsuleDefinition } from './types'

export const AccordionCapsule: CapsuleDefinition = {
  id: 'accordion',
  name: 'Accordion',
  description: 'Expandable/collapsible content sections',
  category: 'layout',
  tags: ['accordion', 'collapse', 'expand', 'disclosure', 'faq'],
  version: '1.0.0',
  children: true,

  props: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of accordion items'
    },
    {
      name: 'type',
      type: 'select',
      required: false,
      default: 'single',
      description: 'Single or multiple items open',
      options: ['single', 'multiple']
    },
    {
      name: 'defaultExpanded',
      type: 'array',
      required: false,
      description: 'Initially expanded item IDs'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'default',
      description: 'Visual style',
      options: ['default', 'bordered', 'separated', 'flush']
    },
    {
      name: 'iconPosition',
      type: 'select',
      required: false,
      default: 'right',
      description: 'Position of expand icon',
      options: ['left', 'right', 'none']
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Disable all items'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, createContext, useContext, useId } from 'react'

interface AccordionItem {
  id: string
  title: string | React.ReactNode
  content: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
}

interface AccordionContextValue {
  expandedItems: Set<string>
  toggleItem: (id: string) => void
  type: 'single' | 'multiple'
  iconPosition: 'left' | 'right' | 'none'
  disabled: boolean
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext() {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('Accordion components must be used within Accordion')
  return context
}

interface AccordionProps {
  items?: AccordionItem[]
  type?: 'single' | 'multiple'
  defaultExpanded?: string[]
  variant?: 'default' | 'bordered' | 'separated' | 'flush'
  iconPosition?: 'left' | 'right' | 'none'
  disabled?: boolean
  children?: React.ReactNode
  className?: string
  onChange?: (expandedItems: string[]) => void
}

export function Accordion({
  items,
  type = 'single',
  defaultExpanded = [],
  variant = 'default',
  iconPosition = 'right',
  disabled = false,
  children,
  className = '',
  onChange
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  )

  const toggleItem = (id: string) => {
    if (disabled) return

    setExpandedItems(prev => {
      const newSet = new Set(prev)

      if (type === 'single') {
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.clear()
          newSet.add(id)
        }
      } else {
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
      }

      onChange?.(Array.from(newSet))
      return newSet
    })
  }

  const variantStyles = {
    default: 'divide-y divide-gray-200 dark:divide-gray-700',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700',
    separated: 'space-y-2',
    flush: ''
  }

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, type, iconPosition, disabled }}>
      <div className={\`\${variantStyles[variant]} \${className}\`}>
        {items ? (
          items.map((item) => (
            <AccordionItemComponent
              key={item.id}
              id={item.id}
              title={item.title}
              disabled={item.disabled}
              icon={item.icon}
              variant={variant}
            >
              {item.content}
            </AccordionItemComponent>
          ))
        ) : (
          children
        )}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemComponentProps {
  id: string
  title: string | React.ReactNode
  children: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  variant?: 'default' | 'bordered' | 'separated' | 'flush'
  className?: string
}

export function AccordionItem({
  id,
  title,
  children,
  disabled = false,
  icon,
  className = ''
}: AccordionItemComponentProps) {
  return (
    <AccordionItemComponent
      id={id}
      title={title}
      disabled={disabled}
      icon={icon}
      className={className}
    >
      {children}
    </AccordionItemComponent>
  )
}

function AccordionItemComponent({
  id,
  title,
  children,
  disabled = false,
  icon,
  variant = 'default',
  className = ''
}: AccordionItemComponentProps) {
  const { expandedItems, toggleItem, iconPosition, disabled: groupDisabled } = useAccordionContext()
  const isExpanded = expandedItems.has(id)
  const isDisabled = disabled || groupDisabled
  const panelId = useId()
  const headerId = useId()

  const itemVariantStyles = {
    default: '',
    bordered: 'first:rounded-t-lg last:rounded-b-lg',
    separated: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
    flush: ''
  }

  const ChevronIcon = () => (
    <svg
      className={\`w-5 h-5 transition-transform duration-200 \${isExpanded ? 'rotate-180' : ''}\`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

  return (
    <div className={\`\${itemVariantStyles[variant]} \${className}\`}>
      <button
        id={headerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        disabled={isDisabled}
        onClick={() => toggleItem(id)}
        className={\`
          w-full flex items-center justify-between gap-4 py-4 px-4
          text-left font-medium text-gray-900 dark:text-white
          hover:bg-gray-50 dark:hover:bg-gray-800/50
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          transition-colors
          \${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        \`}
      >
        {iconPosition === 'left' && <ChevronIcon />}

        <span className="flex items-center gap-3 flex-1">
          {icon && <span className="text-gray-500">{icon}</span>}
          {title}
        </span>

        {iconPosition === 'right' && <ChevronIcon />}
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={\`
          overflow-hidden transition-all duration-200 ease-in-out
          \${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        \`}
      >
        <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  )
}

// FAQ-style accordion
interface FAQItem {
  question: string
  answer: React.ReactNode
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  return (
    <Accordion
      items={items.map((item, index) => ({
        id: \`faq-\${index}\`,
        title: item.question,
        content: item.answer
      }))}
      variant="separated"
      className={className}
    />
  )
}
`
    },

    ios: {
      framework: 'swiftui',
      minVersion: '15.0',
      dependencies: [],
      imports: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Accordion Item
struct AccordionItem: Identifiable {
    let id: String
    let title: String
    let content: AnyView
    var icon: String? = nil
    var disabled: Bool = false

    init<Content: View>(
        id: String,
        title: String,
        icon: String? = nil,
        disabled: Bool = false,
        @ViewBuilder content: () -> Content
    ) {
        self.id = id
        self.title = title
        self.icon = icon
        self.disabled = disabled
        self.content = AnyView(content())
    }
}

// MARK: - Accordion Type
enum AccordionType {
    case single
    case multiple
}

// MARK: - Accordion Variant
enum AccordionVariant {
    case \`default\`
    case bordered
    case separated
    case flush
}

// MARK: - Icon Position
enum AccordionIconPosition {
    case left
    case right
    case none
}

// MARK: - Accordion View
struct Accordion: View {
    let items: [AccordionItem]
    var type: AccordionType = .single
    var variant: AccordionVariant = .default
    var iconPosition: AccordionIconPosition = .right
    var disabled: Bool = false
    var defaultExpanded: [String] = []

    @State private var expandedItems: Set<String>

    init(
        items: [AccordionItem],
        type: AccordionType = .single,
        variant: AccordionVariant = .default,
        iconPosition: AccordionIconPosition = .right,
        disabled: Bool = false,
        defaultExpanded: [String] = []
    ) {
        self.items = items
        self.type = type
        self.variant = variant
        self.iconPosition = iconPosition
        self.disabled = disabled
        self.defaultExpanded = defaultExpanded
        self._expandedItems = State(initialValue: Set(defaultExpanded))
    }

    var body: some View {
        VStack(spacing: variant == .separated ? 8 : 0) {
            ForEach(items) { item in
                AccordionItemView(
                    item: item,
                    isExpanded: expandedItems.contains(item.id),
                    variant: variant,
                    iconPosition: iconPosition,
                    isFirst: item.id == items.first?.id,
                    isLast: item.id == items.last?.id,
                    disabled: disabled || item.disabled,
                    onToggle: { toggleItem(item.id) }
                )
            }
        }
        .background(variantBackground)
        .clipShape(RoundedRectangle(cornerRadius: variant == .bordered ? 12 : 0))
        .overlay(variantOverlay)
    }

    private func toggleItem(_ id: String) {
        withAnimation(.easeInOut(duration: 0.2)) {
            if type == .single {
                if expandedItems.contains(id) {
                    expandedItems.remove(id)
                } else {
                    expandedItems.removeAll()
                    expandedItems.insert(id)
                }
            } else {
                if expandedItems.contains(id) {
                    expandedItems.remove(id)
                } else {
                    expandedItems.insert(id)
                }
            }
        }
    }

    @ViewBuilder
    private var variantBackground: some View {
        switch variant {
        case .bordered, .separated:
            Color(.systemBackground)
        default:
            Color.clear
        }
    }

    @ViewBuilder
    private var variantOverlay: some View {
        if variant == .bordered {
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        } else {
            EmptyView()
        }
    }
}

// MARK: - Accordion Item View
struct AccordionItemView: View {
    let item: AccordionItem
    let isExpanded: Bool
    let variant: AccordionVariant
    let iconPosition: AccordionIconPosition
    let isFirst: Bool
    let isLast: Bool
    let disabled: Bool
    let onToggle: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            // Header
            Button(action: onToggle) {
                HStack(spacing: 12) {
                    if iconPosition == .left {
                        chevronIcon
                    }

                    if let icon = item.icon {
                        Image(systemName: icon)
                            .foregroundColor(.secondary)
                    }

                    Text(item.title)
                        .font(.body)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)

                    Spacer()

                    if iconPosition == .right {
                        chevronIcon
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 14)
                .contentShape(Rectangle())
            }
            .buttonStyle(PlainButtonStyle())
            .disabled(disabled)
            .opacity(disabled ? 0.5 : 1)

            // Content
            if isExpanded {
                item.content
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }

            // Divider
            if !isLast && variant != .separated {
                Divider()
                    .padding(.leading, 16)
            }
        }
        .background(itemBackground)
        .clipShape(itemShape)
        .overlay(itemOverlay)
    }

    private var chevronIcon: some View {
        Image(systemName: "chevron.down")
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(.secondary)
            .rotationEffect(.degrees(isExpanded ? 180 : 0))
    }

    @ViewBuilder
    private var itemBackground: some View {
        if variant == .separated {
            Color(.systemBackground)
        } else {
            Color.clear
        }
    }

    private var itemShape: some Shape {
        if variant == .separated {
            return AnyShape(RoundedRectangle(cornerRadius: 12))
        } else if variant == .bordered {
            if isFirst && isLast {
                return AnyShape(RoundedRectangle(cornerRadius: 12))
            } else if isFirst {
                return AnyShape(UnevenRoundedRectangle(topLeadingRadius: 12, topTrailingRadius: 12))
            } else if isLast {
                return AnyShape(UnevenRoundedRectangle(bottomLeadingRadius: 12, bottomTrailingRadius: 12))
            }
        }
        return AnyShape(Rectangle())
    }

    @ViewBuilder
    private var itemOverlay: some View {
        if variant == .separated {
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        } else {
            EmptyView()
        }
    }
}

// Helper for shape type erasure
struct AnyShape: Shape {
    private let pathBuilder: (CGRect) -> Path

    init<S: Shape>(_ shape: S) {
        pathBuilder = { rect in
            shape.path(in: rect)
        }
    }

    func path(in rect: CGRect) -> Path {
        pathBuilder(rect)
    }
}

// MARK: - Disclosure Group Style Accordion
struct SimpleAccordion<Content: View>: View {
    let title: String
    @Binding var isExpanded: Bool
    let content: Content
    var icon: String? = nil

    init(
        _ title: String,
        isExpanded: Binding<Bool>,
        icon: String? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self._isExpanded = isExpanded
        self.icon = icon
        self.content = content()
    }

    var body: some View {
        DisclosureGroup(isExpanded: $isExpanded) {
            content
                .padding(.top, 8)
        } label: {
            HStack(spacing: 8) {
                if let icon = icon {
                    Image(systemName: icon)
                        .foregroundColor(.secondary)
                }
                Text(title)
                    .fontWeight(.medium)
            }
        }
    }
}

// MARK: - FAQ Accordion
struct FAQAccordion: View {
    let items: [(question: String, answer: String)]
    @State private var expandedItems: Set<Int> = []

    var body: some View {
        VStack(spacing: 8) {
            ForEach(Array(items.enumerated()), id: \\.offset) { index, item in
                VStack(spacing: 0) {
                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            if expandedItems.contains(index) {
                                expandedItems.remove(index)
                            } else {
                                expandedItems.removeAll()
                                expandedItems.insert(index)
                            }
                        }
                    } label: {
                        HStack {
                            Text(item.question)
                                .font(.body)
                                .fontWeight(.medium)
                                .foregroundColor(.primary)
                                .multilineTextAlignment(.leading)

                            Spacer()

                            Image(systemName: "chevron.down")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.secondary)
                                .rotationEffect(.degrees(expandedItems.contains(index) ? 180 : 0))
                        }
                        .padding(16)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(PlainButtonStyle())

                    if expandedItems.contains(index) {
                        Text(item.answer)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 16)
                            .padding(.bottom, 16)
                            .transition(.opacity.combined(with: .move(edge: .top)))
                    }
                }
                .background(Color(.systemBackground))
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )
            }
        }
    }
}

// MARK: - Preview
struct AccordionPreview: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                Text("Separated Variant")
                    .font(.headline)

                Accordion(
                    items: [
                        AccordionItem(id: "1", title: "What is HubLab?") {
                            Text("HubLab is a multi-platform app generator that creates native code for iOS, Android, and Web.")
                        },
                        AccordionItem(id: "2", title: "How does it work?") {
                            Text("You design your app using capsules, and HubLab generates real native code for each platform.")
                        },
                        AccordionItem(id: "3", title: "Is it free?", disabled: true) {
                            Text("Yes, the core features are free to use.")
                        }
                    ],
                    variant: .separated
                )

                Divider()

                Text("Bordered Variant")
                    .font(.headline)

                Accordion(
                    items: [
                        AccordionItem(id: "a", title: "First Section", icon: "1.circle") {
                            Text("Content for the first section goes here.")
                        },
                        AccordionItem(id: "b", title: "Second Section", icon: "2.circle") {
                            Text("Content for the second section goes here.")
                        },
                        AccordionItem(id: "c", title: "Third Section", icon: "3.circle") {
                            Text("Content for the third section goes here.")
                        }
                    ],
                    type: .multiple,
                    variant: .bordered,
                    defaultExpanded: ["a"]
                )
            }
            .padding()
        }
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.animation:animation',
        'androidx.compose.material3:material3'
      ],
      imports: [
        'androidx.compose.animation.*',
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.border',
        'androidx.compose.foundation.clickable',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.KeyboardArrowDown',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.draw.rotate',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Data class for accordion items
data class AccordionItemData(
    val id: String,
    val title: String,
    val content: @Composable () -> Unit,
    val icon: (@Composable () -> Unit)? = null,
    val disabled: Boolean = false
)

// Accordion type
enum class AccordionType { SINGLE, MULTIPLE }

// Accordion variant
enum class AccordionVariant { DEFAULT, BORDERED, SEPARATED, FLUSH }

// Icon position
enum class AccordionIconPosition { LEFT, RIGHT, NONE }

@Composable
fun Accordion(
    items: List<AccordionItemData>,
    modifier: Modifier = Modifier,
    type: AccordionType = AccordionType.SINGLE,
    variant: AccordionVariant = AccordionVariant.DEFAULT,
    iconPosition: AccordionIconPosition = AccordionIconPosition.RIGHT,
    disabled: Boolean = false,
    defaultExpanded: List<String> = emptyList()
) {
    var expandedItems by remember { mutableStateOf(defaultExpanded.toSet()) }

    fun toggleItem(id: String) {
        if (disabled) return

        expandedItems = if (type == AccordionType.SINGLE) {
            if (expandedItems.contains(id)) emptySet() else setOf(id)
        } else {
            if (expandedItems.contains(id)) {
                expandedItems - id
            } else {
                expandedItems + id
            }
        }
    }

    val containerModifier = when (variant) {
        AccordionVariant.BORDERED -> modifier
            .clip(RoundedCornerShape(12.dp))
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surface)
        AccordionVariant.SEPARATED -> modifier
        else -> modifier
    }

    Column(
        modifier = containerModifier,
        verticalArrangement = if (variant == AccordionVariant.SEPARATED) Arrangement.spacedBy(8.dp) else Arrangement.Top
    ) {
        items.forEachIndexed { index, item ->
            val isFirst = index == 0
            val isLast = index == items.lastIndex
            val isExpanded = expandedItems.contains(item.id)

            AccordionItemView(
                item = item,
                isExpanded = isExpanded,
                variant = variant,
                iconPosition = iconPosition,
                isFirst = isFirst,
                isLast = isLast,
                disabled = disabled || item.disabled,
                onToggle = { toggleItem(item.id) }
            )

            // Divider for default and bordered variants
            if (!isLast && variant != AccordionVariant.SEPARATED && variant != AccordionVariant.FLUSH) {
                Divider(
                    modifier = Modifier.padding(start = 16.dp),
                    color = MaterialTheme.colorScheme.outlineVariant
                )
            }
        }
    }
}

@Composable
private fun AccordionItemView(
    item: AccordionItemData,
    isExpanded: Boolean,
    variant: AccordionVariant,
    iconPosition: AccordionIconPosition,
    isFirst: Boolean,
    isLast: Boolean,
    disabled: Boolean,
    onToggle: () -> Unit
) {
    val rotation by animateFloatAsState(
        targetValue = if (isExpanded) 180f else 0f,
        label = "chevron_rotation"
    )

    val itemShape = when (variant) {
        AccordionVariant.SEPARATED -> RoundedCornerShape(12.dp)
        AccordionVariant.BORDERED -> when {
            isFirst && isLast -> RoundedCornerShape(12.dp)
            isFirst -> RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)
            isLast -> RoundedCornerShape(bottomStart = 12.dp, bottomEnd = 12.dp)
            else -> RoundedCornerShape(0.dp)
        }
        else -> RoundedCornerShape(0.dp)
    }

    val itemModifier = when (variant) {
        AccordionVariant.SEPARATED -> Modifier
            .fillMaxWidth()
            .clip(itemShape)
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant, itemShape)
            .background(MaterialTheme.colorScheme.surface)
        else -> Modifier.fillMaxWidth()
    }

    Column(modifier = itemModifier) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable(enabled = !disabled, onClick = onToggle)
                .padding(16.dp)
                .alpha(if (disabled) 0.5f else 1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (iconPosition == AccordionIconPosition.LEFT) {
                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = if (isExpanded) "Collapse" else "Expand",
                    modifier = Modifier
                        .size(24.dp)
                        .rotate(rotation),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.width(12.dp))
            }

            item.icon?.invoke()
            if (item.icon != null) {
                Spacer(modifier = Modifier.width(12.dp))
            }

            Text(
                text = item.title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.weight(1f)
            )

            if (iconPosition == AccordionIconPosition.RIGHT) {
                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = if (isExpanded) "Collapse" else "Expand",
                    modifier = Modifier
                        .size(24.dp)
                        .rotate(rotation),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Content
        AnimatedVisibility(
            visible = isExpanded,
            enter = expandVertically() + fadeIn(),
            exit = shrinkVertically() + fadeOut()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
            ) {
                item.content()
            }
        }
    }
}

private fun Modifier.alpha(alpha: Float): Modifier = this.then(
    Modifier.graphicsLayer(alpha = alpha)
)

private fun Modifier.graphicsLayer(alpha: Float): Modifier {
    return this
}

// Simple single-item expandable
@Composable
fun ExpandableCard(
    title: String,
    modifier: Modifier = Modifier,
    initiallyExpanded: Boolean = false,
    icon: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit
) {
    var isExpanded by remember { mutableStateOf(initiallyExpanded) }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { isExpanded = !isExpanded }
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                icon?.invoke()
                if (icon != null) Spacer(modifier = Modifier.width(12.dp))

                Text(
                    text = title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.weight(1f)
                )

                val rotation by animateFloatAsState(
                    targetValue = if (isExpanded) 180f else 0f,
                    label = "chevron"
                )

                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    modifier = Modifier.rotate(rotation)
                )
            }

            AnimatedVisibility(
                visible = isExpanded,
                enter = expandVertically() + fadeIn(),
                exit = shrinkVertically() + fadeOut()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
                ) {
                    content()
                }
            }
        }
    }
}

// FAQ Accordion
@Composable
fun FAQAccordion(
    items: List<Pair<String, String>>,
    modifier: Modifier = Modifier
) {
    Accordion(
        items = items.mapIndexed { index, (question, answer) ->
            AccordionItemData(
                id = "faq-$index",
                title = question,
                content = {
                    Text(
                        text = answer,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            )
        },
        modifier = modifier,
        variant = AccordionVariant.SEPARATED
    )
}
`
    }
  }
}
