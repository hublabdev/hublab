/**
 * Chip Capsule
 *
 * Compact elements for tags, filters, and selections.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const ChipCapsule: CapsuleDefinition = {
  id: 'chip',
  name: 'Chip',
  description: 'Compact elements for tags, filters, and selections',
  category: 'input',
  tags: ['chip', 'tag', 'badge', 'filter', 'label', 'pill'],

  props: {
    label: {
      type: 'string',
      required: true,
      description: 'Chip text content'
    },
    variant: {
      type: 'string',
      default: 'filled',
      options: ['filled', 'outlined', 'soft'],
      description: 'Visual style'
    },
    size: {
      type: 'string',
      default: 'md',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Chip size'
    },
    color: {
      type: 'string',
      default: 'default',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Color scheme'
    },
    selected: {
      type: 'boolean',
      default: false,
      description: 'Selection state'
    },
    disabled: {
      type: 'boolean',
      default: false,
      description: 'Disabled state'
    },
    deletable: {
      type: 'boolean',
      default: false,
      description: 'Show delete button'
    },
    icon: {
      type: 'string',
      description: 'Leading icon'
    },
    avatar: {
      type: 'string',
      description: 'Avatar image URL'
    },
    onClick: {
      type: 'function',
      description: 'Click handler'
    },
    onDelete: {
      type: 'function',
      description: 'Delete handler'
    }
  },

  platforms: {
    web: {
      dependencies: ['react', 'lucide-react'],
      code: `
import React, { useState, useCallback } from 'react'
import { X, Check } from 'lucide-react'

interface ChipProps {
  label: string
  variant?: 'filled' | 'outlined' | 'soft'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  selected?: boolean
  disabled?: boolean
  deletable?: boolean
  icon?: React.ReactNode
  avatar?: string
  onClick?: () => void
  onDelete?: () => void
  className?: string
}

const sizeStyles = {
  xs: {
    padding: 'px-1.5 py-0.5',
    text: 'text-xs',
    iconSize: 10,
    gap: 'gap-0.5',
    avatar: 'w-3 h-3'
  },
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    iconSize: 12,
    gap: 'gap-1',
    avatar: 'w-4 h-4'
  },
  md: {
    padding: 'px-2.5 py-1',
    text: 'text-sm',
    iconSize: 14,
    gap: 'gap-1.5',
    avatar: 'w-5 h-5'
  },
  lg: {
    padding: 'px-3 py-1.5',
    text: 'text-base',
    iconSize: 16,
    gap: 'gap-2',
    avatar: 'w-6 h-6'
  }
}

const colorSchemes = {
  default: {
    filled: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outlined: 'border-gray-300 text-gray-700 hover:bg-gray-50',
    soft: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    selected: 'bg-gray-800 text-white'
  },
  primary: {
    filled: 'bg-blue-600 text-white hover:bg-blue-700',
    outlined: 'border-blue-500 text-blue-600 hover:bg-blue-50',
    soft: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    selected: 'bg-blue-600 text-white'
  },
  secondary: {
    filled: 'bg-purple-600 text-white hover:bg-purple-700',
    outlined: 'border-purple-500 text-purple-600 hover:bg-purple-50',
    soft: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    selected: 'bg-purple-600 text-white'
  },
  success: {
    filled: 'bg-green-600 text-white hover:bg-green-700',
    outlined: 'border-green-500 text-green-600 hover:bg-green-50',
    soft: 'bg-green-100 text-green-700 hover:bg-green-200',
    selected: 'bg-green-600 text-white'
  },
  warning: {
    filled: 'bg-amber-500 text-white hover:bg-amber-600',
    outlined: 'border-amber-500 text-amber-600 hover:bg-amber-50',
    soft: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    selected: 'bg-amber-500 text-white'
  },
  error: {
    filled: 'bg-red-600 text-white hover:bg-red-700',
    outlined: 'border-red-500 text-red-600 hover:bg-red-50',
    soft: 'bg-red-100 text-red-700 hover:bg-red-200',
    selected: 'bg-red-600 text-white'
  }
}

export function Chip({
  label,
  variant = 'filled',
  size = 'md',
  color = 'default',
  selected = false,
  disabled = false,
  deletable = false,
  icon,
  avatar,
  onClick,
  onDelete,
  className = ''
}: ChipProps) {
  const styles = sizeStyles[size]
  const colorStyle = colorSchemes[color]

  const getVariantClass = () => {
    if (selected) return colorStyle.selected
    if (variant === 'outlined') return \`border \${colorStyle.outlined}\`
    if (variant === 'soft') return colorStyle.soft
    return colorStyle.filled
  }

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }, [onDelete])

  return (
    <button
      type="button"
      className={\`
        inline-flex items-center \${styles.gap} \${styles.padding}
        rounded-full font-medium transition-all duration-150
        \${styles.text}
        \${getVariantClass()}
        \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        \${onClick ? 'active:scale-95' : ''}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
        \${className}
      \`}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Avatar */}
      {avatar && (
        <img
          src={avatar}
          alt=""
          className={\`\${styles.avatar} rounded-full object-cover -ml-1\`}
        />
      )}

      {/* Leading Icon or Check */}
      {selected && !icon ? (
        <Check size={styles.iconSize} className="-ml-0.5" />
      ) : icon ? (
        <span className="-ml-0.5">{icon}</span>
      ) : null}

      {/* Label */}
      <span>{label}</span>

      {/* Delete Button */}
      {deletable && (
        <button
          type="button"
          onClick={handleDelete}
          className={\`
            -mr-1 p-0.5 rounded-full transition-colors
            hover:bg-black/10 focus:outline-none
          \`}
          aria-label="Remove"
        >
          <X size={styles.iconSize} />
        </button>
      )}
    </button>
  )
}

// Chip Group (for multiple selection)
interface ChipGroupProps {
  options: { value: string; label: string; icon?: React.ReactNode }[]
  value: string[]
  onChange: (value: string[]) => void
  multiple?: boolean
  variant?: ChipProps['variant']
  size?: ChipProps['size']
  color?: ChipProps['color']
  disabled?: boolean
  className?: string
}

export function ChipGroup({
  options,
  value,
  onChange,
  multiple = false,
  variant = 'outlined',
  size = 'md',
  color = 'primary',
  disabled = false,
  className = ''
}: ChipGroupProps) {
  const handleClick = useCallback((optionValue: string) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue]
      onChange(newValue)
    } else {
      onChange(value.includes(optionValue) ? [] : [optionValue])
    }
  }, [value, onChange, multiple])

  return (
    <div className={\`flex flex-wrap gap-2 \${className}\`} role="group">
      {options.map(option => (
        <Chip
          key={option.value}
          label={option.label}
          icon={option.icon}
          variant={variant}
          size={size}
          color={color}
          selected={value.includes(option.value)}
          disabled={disabled}
          onClick={() => handleClick(option.value)}
        />
      ))}
    </div>
  )
}

// Input Chips (for tags input)
interface InputChipsProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxChips?: number
  allowDuplicates?: boolean
  variant?: ChipProps['variant']
  size?: ChipProps['size']
  color?: ChipProps['color']
  disabled?: boolean
  className?: string
}

export function InputChips({
  value,
  onChange,
  placeholder = 'Add tag...',
  maxChips,
  allowDuplicates = false,
  variant = 'filled',
  size = 'md',
  color = 'default',
  disabled = false,
  className = ''
}: InputChipsProps) {
  const [inputValue, setInputValue] = useState('')

  const addChip = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (!allowDuplicates && value.includes(trimmed)) return
    if (maxChips && value.length >= maxChips) return

    onChange([...value, trimmed])
    setInputValue('')
  }, [inputValue, value, onChange, allowDuplicates, maxChips])

  const removeChip = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }, [value, onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addChip()
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeChip(value.length - 1)
    }
  }, [addChip, inputValue, value.length, removeChip])

  return (
    <div
      className={\`
        flex flex-wrap gap-2 p-2 border rounded-lg
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
        \${disabled ? 'bg-gray-50 opacity-50' : 'bg-white'}
        \${className}
      \`}
    >
      {value.map((chip, index) => (
        <Chip
          key={\`\${chip}-\${index}\`}
          label={chip}
          variant={variant}
          size={size}
          color={color}
          deletable
          disabled={disabled}
          onDelete={() => removeChip(index)}
        />
      ))}

      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addChip}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled || (maxChips !== undefined && value.length >= maxChips)}
        className={\`
          flex-1 min-w-[100px] outline-none bg-transparent
          text-sm placeholder-gray-400
        \`}
      />
    </div>
  )
}

// Filter Chips
interface FilterChipsProps {
  filters: {
    id: string
    label: string
    count?: number
    icon?: React.ReactNode
  }[]
  activeFilters: string[]
  onChange: (filters: string[]) => void
  showCounts?: boolean
  className?: string
}

export function FilterChips({
  filters,
  activeFilters,
  onChange,
  showCounts = true,
  className = ''
}: FilterChipsProps) {
  const handleToggle = useCallback((filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId]
    onChange(newFilters)
  }, [activeFilters, onChange])

  const clearAll = useCallback(() => {
    onChange([])
  }, [onChange])

  return (
    <div className={\`flex flex-wrap items-center gap-2 \${className}\`}>
      {filters.map(filter => (
        <Chip
          key={filter.id}
          label={showCounts && filter.count !== undefined
            ? \`\${filter.label} (\${filter.count})\`
            : filter.label
          }
          icon={filter.icon}
          variant="outlined"
          color="primary"
          selected={activeFilters.includes(filter.id)}
          onClick={() => handleToggle(filter.id)}
        />
      ))}

      {activeFilters.length > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

// Status Chip
interface StatusChipProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success'
  label?: string
  size?: ChipProps['size']
  showDot?: boolean
}

const statusConfig = {
  active: { color: 'success' as const, label: 'Active' },
  inactive: { color: 'default' as const, label: 'Inactive' },
  pending: { color: 'warning' as const, label: 'Pending' },
  error: { color: 'error' as const, label: 'Error' },
  success: { color: 'success' as const, label: 'Success' }
}

export function StatusChip({
  status,
  label,
  size = 'sm',
  showDot = true
}: StatusChipProps) {
  const config = statusConfig[status]

  return (
    <Chip
      label={label || config.label}
      variant="soft"
      size={size}
      color={config.color}
      icon={showDot ? (
        <span className={\`w-1.5 h-1.5 rounded-full bg-current\`} />
      ) : undefined}
    />
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Chip View
struct ChipView: View {
    let label: String
    var variant: ChipVariant = .filled
    var size: ChipSize = .medium
    var color: ChipColor = .default
    var isSelected: Bool = false
    var isDisabled: Bool = false
    var isDeletable: Bool = false
    var icon: Image?
    var avatarURL: URL?
    var onTap: (() -> Void)?
    var onDelete: (() -> Void)?

    enum ChipVariant {
        case filled, outlined, soft
    }

    enum ChipSize {
        case extraSmall, small, medium, large

        var padding: EdgeInsets {
            switch self {
            case .extraSmall: return EdgeInsets(top: 2, leading: 6, bottom: 2, trailing: 6)
            case .small: return EdgeInsets(top: 4, leading: 8, bottom: 4, trailing: 8)
            case .medium: return EdgeInsets(top: 6, leading: 10, bottom: 6, trailing: 10)
            case .large: return EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12)
            }
        }

        var font: Font {
            switch self {
            case .extraSmall, .small: return .caption
            case .medium: return .subheadline
            case .large: return .body
            }
        }

        var iconSize: CGFloat {
            switch self {
            case .extraSmall: return 10
            case .small: return 12
            case .medium: return 14
            case .large: return 16
            }
        }

        var avatarSize: CGFloat {
            switch self {
            case .extraSmall: return 12
            case .small: return 16
            case .medium: return 20
            case .large: return 24
            }
        }
    }

    enum ChipColor {
        case \`default\`, primary, secondary, success, warning, error

        var filledBackground: Color {
            switch self {
            case .default: return Color(.systemGray5)
            case .primary: return .blue
            case .secondary: return .purple
            case .success: return .green
            case .warning: return .orange
            case .error: return .red
            }
        }

        var filledForeground: Color {
            switch self {
            case .default: return .primary
            default: return .white
            }
        }

        var softBackground: Color {
            switch self {
            case .default: return Color(.systemGray6)
            case .primary: return .blue.opacity(0.15)
            case .secondary: return .purple.opacity(0.15)
            case .success: return .green.opacity(0.15)
            case .warning: return .orange.opacity(0.15)
            case .error: return .red.opacity(0.15)
            }
        }

        var softForeground: Color {
            switch self {
            case .default: return .secondary
            case .primary: return .blue
            case .secondary: return .purple
            case .success: return .green
            case .warning: return .orange
            case .error: return .red
            }
        }

        var outlineBorder: Color {
            switch self {
            case .default: return Color(.systemGray4)
            default: return softForeground
            }
        }
    }

    private var backgroundColor: Color {
        if isSelected {
            return color == .default ? Color.primary : color.filledBackground
        }
        switch variant {
        case .filled: return color.filledBackground
        case .soft: return color.softBackground
        case .outlined: return .clear
        }
    }

    private var foregroundColor: Color {
        if isSelected {
            return .white
        }
        switch variant {
        case .filled: return color.filledForeground
        case .soft, .outlined: return color.softForeground
        }
    }

    var body: some View {
        Button {
            onTap?()
        } label: {
            HStack(spacing: 4) {
                // Avatar
                if let avatarURL = avatarURL {
                    AsyncImage(url: avatarURL) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Circle()
                            .fill(Color.gray.opacity(0.3))
                    }
                    .frame(width: size.avatarSize, height: size.avatarSize)
                    .clipShape(Circle())
                }

                // Icon or checkmark
                if isSelected && icon == nil {
                    Image(systemName: "checkmark")
                        .font(.system(size: size.iconSize, weight: .semibold))
                } else if let icon = icon {
                    icon
                        .font(.system(size: size.iconSize))
                }

                // Label
                Text(label)
                    .font(size.font)
                    .fontWeight(.medium)

                // Delete button
                if isDeletable {
                    Button {
                        onDelete?()
                    } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: size.iconSize - 2, weight: .semibold))
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(size.padding)
            .foregroundColor(foregroundColor)
            .background(backgroundColor)
            .overlay(
                RoundedRectangle(cornerRadius: 100)
                    .strokeBorder(
                        variant == .outlined ? color.outlineBorder : Color.clear,
                        lineWidth: 1.5
                    )
            )
            .clipShape(Capsule())
        }
        .buttonStyle(.plain)
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.5 : 1)
        .scaleEffect(isDisabled ? 1 : 1)
        .animation(.spring(response: 0.2), value: isSelected)
    }
}

// MARK: - Chip Group
struct ChipGroup: View {
    let options: [ChipOption]
    @Binding var selection: Set<String>
    var isMultiple: Bool = false
    var variant: ChipView.ChipVariant = .outlined
    var size: ChipView.ChipSize = .medium
    var color: ChipView.ChipColor = .primary
    var isDisabled: Bool = false

    struct ChipOption: Identifiable {
        let id: String
        let label: String
        var icon: Image?
    }

    var body: some View {
        FlexibleView(data: options, spacing: 8, alignment: .leading) { option in
            ChipView(
                label: option.label,
                variant: variant,
                size: size,
                color: color,
                isSelected: selection.contains(option.id),
                isDisabled: isDisabled,
                icon: option.icon
            ) {
                withAnimation {
                    if isMultiple {
                        if selection.contains(option.id) {
                            selection.remove(option.id)
                        } else {
                            selection.insert(option.id)
                        }
                    } else {
                        selection = selection.contains(option.id) ? [] : [option.id]
                    }
                }
            }
        }
    }
}

// MARK: - Input Chips
struct InputChips: View {
    @Binding var chips: [String]
    var placeholder: String = "Add tag..."
    var maxChips: Int?
    var allowDuplicates: Bool = false
    var variant: ChipView.ChipVariant = .filled
    var size: ChipView.ChipSize = .medium
    var color: ChipView.ChipColor = .default
    var isDisabled: Bool = false

    @State private var inputText = ""
    @FocusState private var isFocused: Bool

    var body: some View {
        FlexibleView(
            data: Array(chips.enumerated().map { ChipItem(id: $0.offset, value: $0.element) }),
            spacing: 8,
            alignment: .leading
        ) { item in
            ChipView(
                label: item.value,
                variant: variant,
                size: size,
                color: color,
                isDisabled: isDisabled,
                isDeletable: true
            ) {
                // Tap action
            } onDelete: {
                withAnimation {
                    chips.remove(at: item.id)
                }
            }
        }
        .overlay(alignment: .bottomLeading) {
            if !isDisabled && (maxChips == nil || chips.count < maxChips!) {
                TextField(chips.isEmpty ? placeholder : "", text: $inputText)
                    .focused($isFocused)
                    .font(size.font)
                    .onSubmit {
                        addChip()
                    }
                    .padding(.top, chips.isEmpty ? 0 : 8)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 8)
                .strokeBorder(
                    isFocused ? Color.blue : Color(.systemGray4),
                    lineWidth: isFocused ? 2 : 1
                )
        )
    }

    private func addChip() {
        let trimmed = inputText.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        guard allowDuplicates || !chips.contains(trimmed) else { return }
        guard maxChips == nil || chips.count < maxChips! else { return }

        withAnimation {
            chips.append(trimmed)
        }
        inputText = ""
    }

    struct ChipItem: Identifiable {
        let id: Int
        let value: String
    }
}

// MARK: - Filter Chips
struct FilterChips: View {
    let filters: [FilterOption]
    @Binding var activeFilters: Set<String>
    var showCounts: Bool = true

    struct FilterOption: Identifiable {
        let id: String
        let label: String
        var count: Int?
        var icon: Image?
    }

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(filters) { filter in
                    ChipView(
                        label: showCounts && filter.count != nil
                            ? "\\(filter.label) (\\(filter.count!))"
                            : filter.label,
                        variant: .outlined,
                        color: .primary,
                        isSelected: activeFilters.contains(filter.id),
                        icon: filter.icon
                    ) {
                        withAnimation {
                            if activeFilters.contains(filter.id) {
                                activeFilters.remove(filter.id)
                            } else {
                                activeFilters.insert(filter.id)
                            }
                        }
                    }
                }

                if !activeFilters.isEmpty {
                    Button("Clear all") {
                        withAnimation {
                            activeFilters.removeAll()
                        }
                    }
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                }
            }
        }
    }
}

// MARK: - Status Chip
struct StatusChip: View {
    let status: Status
    var label: String?
    var size: ChipView.ChipSize = .small
    var showDot: Bool = true

    enum Status {
        case active, inactive, pending, error, success

        var color: ChipView.ChipColor {
            switch self {
            case .active, .success: return .success
            case .inactive: return .default
            case .pending: return .warning
            case .error: return .error
            }
        }

        var defaultLabel: String {
            switch self {
            case .active: return "Active"
            case .inactive: return "Inactive"
            case .pending: return "Pending"
            case .error: return "Error"
            case .success: return "Success"
            }
        }
    }

    var body: some View {
        ChipView(
            label: label ?? status.defaultLabel,
            variant: .soft,
            size: size,
            color: status.color,
            icon: showDot ? nil : nil
        )
        .overlay(alignment: .leading) {
            if showDot {
                Circle()
                    .fill(status.color.softForeground)
                    .frame(width: 6, height: 6)
                    .padding(.leading, size.padding.leading)
            }
        }
    }
}

// MARK: - Flexible View Helper
struct FlexibleView<Data: Collection, Content: View>: View where Data.Element: Identifiable {
    let data: Data
    let spacing: CGFloat
    let alignment: HorizontalAlignment
    let content: (Data.Element) -> Content

    @State private var availableWidth: CGFloat = 0

    var body: some View {
        ZStack(alignment: Alignment(horizontal: alignment, vertical: .center)) {
            Color.clear
                .frame(height: 1)
                .readSize { size in
                    availableWidth = size.width
                }

            FlexibleInnerView(
                availableWidth: availableWidth,
                data: data,
                spacing: spacing,
                alignment: alignment,
                content: content
            )
        }
    }
}

struct FlexibleInnerView<Data: Collection, Content: View>: View where Data.Element: Identifiable {
    let availableWidth: CGFloat
    let data: Data
    let spacing: CGFloat
    let alignment: HorizontalAlignment
    let content: (Data.Element) -> Content

    var body: some View {
        var width: CGFloat = 0
        var height: CGFloat = 0

        return GeometryReader { geometry in
            ZStack(alignment: Alignment(horizontal: alignment, vertical: .top)) {
                ForEach(Array(data.enumerated()), id: \\.element.id) { index, element in
                    content(element)
                        .alignmentGuide(alignment) { dimension in
                            if abs(width - dimension.width) > availableWidth {
                                width = 0
                                height -= dimension.height + spacing
                            }
                            let result = width
                            if index == data.count - 1 {
                                width = 0
                            } else {
                                width -= dimension.width + spacing
                            }
                            return result
                        }
                        .alignmentGuide(.top) { _ in
                            let result = height
                            if index == data.count - 1 {
                                height = 0
                            }
                            return result
                        }
                }
            }
        }
    }
}

extension View {
    func readSize(onChange: @escaping (CGSize) -> Void) -> some View {
        background(
            GeometryReader { geometry in
                Color.clear
                    .preference(key: SizePreferenceKey.self, value: geometry.size)
            }
        )
        .onPreferenceChange(SizePreferenceKey.self, perform: onChange)
    }
}

struct SizePreferenceKey: PreferenceKey {
    static var defaultValue: CGSize = .zero
    static func reduce(value: inout CGSize, nextValue: () -> CGSize) {}
}

// MARK: - Preview
struct ChipView_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Basic Chips
                HStack {
                    ChipView(label: "Default")
                    ChipView(label: "Primary", color: .primary)
                    ChipView(label: "Selected", isSelected: true)
                }

                // Status Chips
                HStack {
                    StatusChip(status: .active)
                    StatusChip(status: .pending)
                    StatusChip(status: .error)
                }

                // Deletable Chips
                ChipView(label: "Removable", isDeletable: true) {
                    print("Deleted")
                }
            }
            .padding()
        }
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3', 'coil-compose'],
      code: `
package com.hublab.capsules

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.google.accompanist.flowlayout.FlowRow

// Chip Size
enum class ChipSize(
    val paddingHorizontal: Dp,
    val paddingVertical: Dp,
    val fontSize: Int,
    val iconSize: Dp,
    val avatarSize: Dp
) {
    ExtraSmall(6.dp, 2.dp, 10, 10.dp, 12.dp),
    Small(8.dp, 4.dp, 12, 12.dp, 16.dp),
    Medium(10.dp, 6.dp, 14, 14.dp, 20.dp),
    Large(12.dp, 8.dp, 16, 16.dp, 24.dp)
}

// Chip Variant
enum class ChipVariant {
    Filled, Outlined, Soft
}

// Chip Color
enum class ChipColor(
    val filledBackground: Color,
    val filledForeground: Color,
    val softBackground: Color,
    val softForeground: Color,
    val outlineBorder: Color
) {
    Default(
        Color(0xFFE5E7EB), Color(0xFF1F2937),
        Color(0xFFF3F4F6), Color(0xFF6B7280),
        Color(0xFFD1D5DB)
    ),
    Primary(
        Color(0xFF3B82F6), Color.White,
        Color(0xFFDBEAFE), Color(0xFF2563EB),
        Color(0xFF3B82F6)
    ),
    Secondary(
        Color(0xFF8B5CF6), Color.White,
        Color(0xFFEDE9FE), Color(0xFF7C3AED),
        Color(0xFF8B5CF6)
    ),
    Success(
        Color(0xFF22C55E), Color.White,
        Color(0xFFDCFCE7), Color(0xFF16A34A),
        Color(0xFF22C55E)
    ),
    Warning(
        Color(0xFFF59E0B), Color.White,
        Color(0xFFFEF3C7), Color(0xFFD97706),
        Color(0xFFF59E0B)
    ),
    Error(
        Color(0xFFEF4444), Color.White,
        Color(0xFFFEE2E2), Color(0xFFDC2626),
        Color(0xFFEF4444)
    )
}

// Chip Component
@Composable
fun Chip(
    label: String,
    modifier: Modifier = Modifier,
    variant: ChipVariant = ChipVariant.Filled,
    size: ChipSize = ChipSize.Medium,
    color: ChipColor = ChipColor.Default,
    selected: Boolean = false,
    enabled: Boolean = true,
    deletable: Boolean = false,
    leadingIcon: ImageVector? = null,
    avatarUrl: String? = null,
    onClick: (() -> Unit)? = null,
    onDelete: (() -> Unit)? = null
) {
    val backgroundColor by animateColorAsState(
        targetValue = when {
            selected -> if (color == ChipColor.Default) MaterialTheme.colorScheme.primary else color.filledBackground
            variant == ChipVariant.Filled -> color.filledBackground
            variant == ChipVariant.Soft -> color.softBackground
            else -> Color.Transparent
        },
        animationSpec = spring()
    )

    val contentColor by animateColorAsState(
        targetValue = when {
            selected -> Color.White
            variant == ChipVariant.Filled -> color.filledForeground
            else -> color.softForeground
        },
        animationSpec = spring()
    )

    val borderColor = if (variant == ChipVariant.Outlined && !selected) {
        color.outlineBorder
    } else {
        Color.Transparent
    }

    Surface(
        modifier = modifier
            .then(
                if (onClick != null && enabled) {
                    Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) { onClick() }
                } else Modifier
            ),
        shape = RoundedCornerShape(100),
        color = backgroundColor,
        border = if (borderColor != Color.Transparent) BorderStroke(1.5.dp, borderColor) else null,
        tonalElevation = 0.dp
    ) {
        Row(
            modifier = Modifier
                .padding(
                    horizontal = size.paddingHorizontal,
                    vertical = size.paddingVertical
                ),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            // Avatar
            if (avatarUrl != null) {
                AsyncImage(
                    model = avatarUrl,
                    contentDescription = null,
                    modifier = Modifier
                        .size(size.avatarSize)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )
            }

            // Leading icon or checkmark
            if (selected && leadingIcon == null) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    modifier = Modifier.size(size.iconSize),
                    tint = contentColor
                )
            } else if (leadingIcon != null) {
                Icon(
                    imageVector = leadingIcon,
                    contentDescription = null,
                    modifier = Modifier.size(size.iconSize),
                    tint = contentColor
                )
            }

            // Label
            Text(
                text = label,
                fontSize = size.fontSize.sp,
                fontWeight = FontWeight.Medium,
                color = contentColor
            )

            // Delete button
            if (deletable) {
                IconButton(
                    onClick = { onDelete?.invoke() },
                    modifier = Modifier.size(size.iconSize + 4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Remove",
                        modifier = Modifier.size(size.iconSize - 2.dp),
                        tint = contentColor
                    )
                }
            }
        }
    }
}

// Chip Group
@Composable
fun ChipGroup(
    options: List<ChipOption>,
    selectedIds: Set<String>,
    onSelectionChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    multiple: Boolean = false,
    variant: ChipVariant = ChipVariant.Outlined,
    size: ChipSize = ChipSize.Medium,
    color: ChipColor = ChipColor.Primary,
    enabled: Boolean = true
) {
    FlowRow(
        modifier = modifier,
        mainAxisSpacing = 8.dp,
        crossAxisSpacing = 8.dp
    ) {
        options.forEach { option ->
            Chip(
                label = option.label,
                variant = variant,
                size = size,
                color = color,
                selected = selectedIds.contains(option.id),
                enabled = enabled,
                leadingIcon = option.icon,
                onClick = {
                    val newSelection = if (multiple) {
                        if (selectedIds.contains(option.id)) {
                            selectedIds - option.id
                        } else {
                            selectedIds + option.id
                        }
                    } else {
                        if (selectedIds.contains(option.id)) emptySet() else setOf(option.id)
                    }
                    onSelectionChange(newSelection)
                }
            )
        }
    }
}

data class ChipOption(
    val id: String,
    val label: String,
    val icon: ImageVector? = null
)

// Input Chips
@Composable
fun InputChips(
    chips: List<String>,
    onChipsChange: (List<String>) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Add tag...",
    maxChips: Int? = null,
    allowDuplicates: Boolean = false,
    variant: ChipVariant = ChipVariant.Filled,
    size: ChipSize = ChipSize.Medium,
    color: ChipColor = ChipColor.Default,
    enabled: Boolean = true
) {
    var inputText by remember { mutableStateOf("") }
    val focusManager = LocalFocusManager.current
    val focusRequester = remember { FocusRequester() }

    fun addChip() {
        val trimmed = inputText.trim()
        if (trimmed.isEmpty()) return
        if (!allowDuplicates && chips.contains(trimmed)) return
        if (maxChips != null && chips.size >= maxChips) return

        onChipsChange(chips + trimmed)
        inputText = ""
    }

    Column(
        modifier = modifier
            .background(
                MaterialTheme.colorScheme.surface,
                RoundedCornerShape(8.dp)
            )
            .border(
                1.dp,
                MaterialTheme.colorScheme.outline,
                RoundedCornerShape(8.dp)
            )
            .padding(8.dp)
    ) {
        FlowRow(
            mainAxisSpacing = 8.dp,
            crossAxisSpacing = 8.dp
        ) {
            chips.forEachIndexed { index, chip ->
                Chip(
                    label = chip,
                    variant = variant,
                    size = size,
                    color = color,
                    enabled = enabled,
                    deletable = true,
                    onDelete = {
                        onChipsChange(chips.filterIndexed { i, _ -> i != index })
                    }
                )
            }

            if (enabled && (maxChips == null || chips.size < maxChips)) {
                BasicTextField(
                    value = inputText,
                    onValueChange = { inputText = it },
                    modifier = Modifier
                        .widthIn(min = 100.dp)
                        .focusRequester(focusRequester),
                    textStyle = TextStyle(
                        fontSize = size.fontSize.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    ),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(onDone = {
                        addChip()
                        focusManager.clearFocus()
                    }),
                    decorationBox = { innerTextField ->
                        Box {
                            if (inputText.isEmpty() && chips.isEmpty()) {
                                Text(
                                    text = placeholder,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = size.fontSize.sp
                                )
                            }
                            innerTextField()
                        }
                    }
                )
            }
        }
    }
}

// Filter Chips
@Composable
fun FilterChips(
    filters: List<FilterOption>,
    activeFilters: Set<String>,
    onFiltersChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    showCounts: Boolean = true
) {
    LazyRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(filters) { filter ->
            Chip(
                label = if (showCounts && filter.count != null)
                    "${filter.label} (${filter.count})"
                else filter.label,
                variant = ChipVariant.Outlined,
                color = ChipColor.Primary,
                selected = activeFilters.contains(filter.id),
                leadingIcon = filter.icon,
                onClick = {
                    val newFilters = if (activeFilters.contains(filter.id)) {
                        activeFilters - filter.id
                    } else {
                        activeFilters + filter.id
                    }
                    onFiltersChange(newFilters)
                }
            )
        }

        if (activeFilters.isNotEmpty()) {
            item {
                TextButton(onClick = { onFiltersChange(emptySet()) }) {
                    Text("Clear all")
                }
            }
        }
    }
}

data class FilterOption(
    val id: String,
    val label: String,
    val count: Int? = null,
    val icon: ImageVector? = null
)

// Status Chip
@Composable
fun StatusChip(
    status: Status,
    modifier: Modifier = Modifier,
    label: String? = null,
    size: ChipSize = ChipSize.Small,
    showDot: Boolean = true
) {
    val chipColor = when (status) {
        Status.Active, Status.Success -> ChipColor.Success
        Status.Inactive -> ChipColor.Default
        Status.Pending -> ChipColor.Warning
        Status.Error -> ChipColor.Error
    }

    val displayLabel = label ?: when (status) {
        Status.Active -> "Active"
        Status.Inactive -> "Inactive"
        Status.Pending -> "Pending"
        Status.Error -> "Error"
        Status.Success -> "Success"
    }

    Row(
        modifier = modifier
            .background(chipColor.softBackground, RoundedCornerShape(100))
            .padding(horizontal = size.paddingHorizontal, vertical = size.paddingVertical),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        if (showDot) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .background(chipColor.softForeground, CircleShape)
            )
        }

        Text(
            text = displayLabel,
            fontSize = size.fontSize.sp,
            fontWeight = FontWeight.Medium,
            color = chipColor.softForeground
        )
    }
}

enum class Status {
    Active, Inactive, Pending, Error, Success
}
`
    },

    desktop: {
      dependencies: ['@tauri-apps/api'],
      code: `
// Desktop uses the same React components with Tauri integration
// See web implementation above
export * from './web'
`
    }
  }
}
