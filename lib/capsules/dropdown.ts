/**
 * Dropdown/Select Capsule - Multi-Platform Selection Control
 *
 * Dropdown menu for selecting from a list of options
 */

import { CapsuleDefinition } from './types'

export const DropdownCapsule: CapsuleDefinition = {
  id: 'dropdown',
  name: 'Dropdown',
  description: 'Dropdown menu for selecting from a list of options',
  category: 'forms',
  tags: ['dropdown', 'select', 'picker', 'menu', 'options'],
  version: '1.0.0',

  props: [
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Selected value (controlled)'
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      description: 'Default selected value'
    },
    {
      name: 'onChange',
      type: 'action',
      required: false,
      description: 'Callback when selection changes'
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      description: 'Array of options to display'
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: 'Select an option',
      description: 'Placeholder text when no selection'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Label text above the dropdown'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the dropdown is disabled'
    },
    {
      name: 'error',
      type: 'string',
      required: false,
      description: 'Error message to display'
    },
    {
      name: 'searchable',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Enable search/filter functionality'
    },
    {
      name: 'multiple',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Allow multiple selections'
    },
    {
      name: 'size',
      type: 'size',
      required: false,
      default: 'md',
      description: 'Size of the dropdown'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, useRef, useEffect, useId } from 'react'

interface Option {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
}

interface DropdownProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  options: Option[]
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  searchable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Dropdown({
  value: controlledValue,
  defaultValue = '',
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error,
  searchable = false,
  size = 'md',
  className = ''
}: DropdownProps) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = controlledValue !== undefined
  const selectedValue = isControlled ? controlledValue : internalValue

  const selectedOption = options.find(opt => opt.value === selectedValue)

  const filteredOptions = searchable && searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, searchable])

  const handleSelect = (option: Option) => {
    if (option.disabled) return

    if (!isControlled) {
      setInternalValue(option.value)
    }
    onChange?.(option.value)
    setIsOpen(false)
    setSearchQuery('')
  }

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-lg'
  }

  return (
    <div ref={dropdownRef} className={\`relative \${className}\`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={\`
          w-full flex items-center justify-between gap-2
          bg-white dark:bg-gray-800 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors
          \${sizeStyles[size]}
          \${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
          \${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}
        \`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={\`truncate \${!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white'}\`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <svg
          className={\`w-5 h-5 text-gray-400 transition-transform \${isOpen ? 'rotate-180' : ''}\`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
          role="listbox"
        >
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}

          <ul className="max-h-60 overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-500">No options found</li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === selectedValue}
                  onClick={() => handleSelect(option)}
                  className={\`
                    px-4 py-2 cursor-pointer flex items-center gap-3
                    \${option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    \${option.value === selectedValue
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                    }
                  \`}
                >
                  {option.icon && <span>{option.icon}</span>}
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500">{option.description}</div>
                    )}
                  </div>
                  {option.value === selectedValue && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// Multi-select dropdown
interface MultiSelectProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (values: string[]) => void
  options: Option[]
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  searchable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MultiSelect({
  value: controlledValue,
  defaultValue = [],
  onChange,
  options,
  placeholder = 'Select options',
  label,
  disabled = false,
  error,
  searchable = false,
  size = 'md',
  className = ''
}: MultiSelectProps) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledValue !== undefined
  const selectedValues = isControlled ? controlledValue : internalValue

  const selectedOptions = options.filter(opt => selectedValues.includes(opt.value))

  const filteredOptions = searchable && searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (option: Option) => {
    if (option.disabled) return

    const newValues = selectedValues.includes(option.value)
      ? selectedValues.filter(v => v !== option.value)
      : [...selectedValues, option.value]

    if (!isControlled) {
      setInternalValue(newValues)
    }
    onChange?.(newValues)
  }

  const removeValue = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newValues = selectedValues.filter(v => v !== value)
    if (!isControlled) {
      setInternalValue(newValues)
    }
    onChange?.(newValues)
  }

  const sizeStyles = {
    sm: 'min-h-[34px] text-sm',
    md: 'min-h-[42px] text-base',
    lg: 'min-h-[50px] text-lg'
  }

  return (
    <div ref={dropdownRef} className={\`relative \${className}\`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={\`
          w-full flex flex-wrap items-center gap-1 p-1.5
          bg-white dark:bg-gray-800 border rounded-lg cursor-pointer
          \${sizeStyles[size]}
          \${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          \${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        \`}
      >
        {selectedOptions.length === 0 ? (
          <span className="px-2 text-gray-400">{placeholder}</span>
        ) : (
          selectedOptions.map(opt => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => removeValue(opt.value, e)}
                className="hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
              />
            </div>
          )}

          <ul className="max-h-60 overflow-auto py-1">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleToggle(option)}
                className={\`
                  px-4 py-2 cursor-pointer flex items-center gap-3
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  \${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                \`}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  readOnly
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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

// MARK: - Option Model
struct DropdownOption: Identifiable, Hashable {
    let id: String
    let label: String
    var icon: String? = nil
    var description: String? = nil
    var disabled: Bool = false

    init(value: String, label: String, icon: String? = nil, description: String? = nil, disabled: Bool = false) {
        self.id = value
        self.label = label
        self.icon = icon
        self.description = description
        self.disabled = disabled
    }
}

// MARK: - Dropdown Size
enum DropdownSize {
    case sm, md, lg

    var padding: EdgeInsets {
        switch self {
        case .sm: return EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12)
        case .md: return EdgeInsets(top: 12, leading: 16, bottom: 12, trailing: 16)
        case .lg: return EdgeInsets(top: 16, leading: 20, bottom: 16, trailing: 20)
        }
    }

    var font: Font {
        switch self {
        case .sm: return .subheadline
        case .md: return .body
        case .lg: return .title3
        }
    }
}

// MARK: - Dropdown View
struct Dropdown: View {
    @Binding var selection: String?
    let options: [DropdownOption]
    var placeholder: String = "Select an option"
    var label: String? = nil
    var disabled: Bool = false
    var error: String? = nil
    var size: DropdownSize = .md

    @State private var isExpanded = false
    @State private var searchQuery = ""

    var selectedOption: DropdownOption? {
        options.first { $0.id == selection }
    }

    var filteredOptions: [DropdownOption] {
        if searchQuery.isEmpty {
            return options
        }
        return options.filter { $0.label.localizedCaseInsensitiveContains(searchQuery) }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.secondary)
            }

            Menu {
                ForEach(filteredOptions) { option in
                    Button {
                        if !option.disabled {
                            selection = option.id
                        }
                    } label: {
                        HStack {
                            if let icon = option.icon {
                                Image(systemName: icon)
                            }
                            VStack(alignment: .leading) {
                                Text(option.label)
                                if let description = option.description {
                                    Text(description)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                            Spacer()
                            if option.id == selection {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.blue)
                            }
                        }
                    }
                    .disabled(option.disabled)
                }
            } label: {
                HStack {
                    if let selected = selectedOption {
                        HStack(spacing: 8) {
                            if let icon = selected.icon {
                                Image(systemName: icon)
                                    .foregroundColor(.secondary)
                            }
                            Text(selected.label)
                                .foregroundColor(.primary)
                        }
                    } else {
                        Text(placeholder)
                            .foregroundColor(.secondary)
                    }

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .font(size.font)
                .padding(size.padding)
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(error != nil ? Color.red : Color.gray.opacity(0.3), lineWidth: 1)
                )
            }
            .disabled(disabled)
            .opacity(disabled ? 0.5 : 1)

            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
    }
}

// MARK: - Native Picker Style Dropdown
struct PickerDropdown: View {
    @Binding var selection: String
    let options: [DropdownOption]
    var label: String? = nil
    var disabled: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.secondary)
            }

            Picker("", selection: $selection) {
                ForEach(options) { option in
                    HStack {
                        if let icon = option.icon {
                            Image(systemName: icon)
                        }
                        Text(option.label)
                    }
                    .tag(option.id)
                }
            }
            .pickerStyle(.menu)
            .disabled(disabled)
        }
    }
}

// MARK: - Searchable Dropdown
struct SearchableDropdown: View {
    @Binding var selection: String?
    let options: [DropdownOption]
    var placeholder: String = "Select an option"
    var label: String? = nil
    var searchPlaceholder: String = "Search..."

    @State private var isPresented = false
    @State private var searchQuery = ""

    var selectedOption: DropdownOption? {
        options.first { $0.id == selection }
    }

    var filteredOptions: [DropdownOption] {
        if searchQuery.isEmpty {
            return options
        }
        return options.filter { $0.label.localizedCaseInsensitiveContains(searchQuery) }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.secondary)
            }

            Button {
                isPresented = true
            } label: {
                HStack {
                    if let selected = selectedOption {
                        HStack(spacing: 8) {
                            if let icon = selected.icon {
                                Image(systemName: icon)
                                    .foregroundColor(.secondary)
                            }
                            Text(selected.label)
                                .foregroundColor(.primary)
                        }
                    } else {
                        Text(placeholder)
                            .foregroundColor(.secondary)
                    }

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(12)
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            }
            .sheet(isPresented: $isPresented) {
                NavigationView {
                    List {
                        ForEach(filteredOptions) { option in
                            Button {
                                if !option.disabled {
                                    selection = option.id
                                    isPresented = false
                                }
                            } label: {
                                HStack {
                                    if let icon = option.icon {
                                        Image(systemName: icon)
                                            .foregroundColor(.blue)
                                    }
                                    VStack(alignment: .leading) {
                                        Text(option.label)
                                            .foregroundColor(option.disabled ? .secondary : .primary)
                                        if let description = option.description {
                                            Text(description)
                                                .font(.caption)
                                                .foregroundColor(.secondary)
                                        }
                                    }
                                    Spacer()
                                    if option.id == selection {
                                        Image(systemName: "checkmark")
                                            .foregroundColor(.blue)
                                    }
                                }
                            }
                            .disabled(option.disabled)
                        }
                    }
                    .searchable(text: $searchQuery, prompt: searchPlaceholder)
                    .navigationTitle("Select")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Done") {
                                isPresented = false
                            }
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Multi-Select Dropdown
struct MultiSelectDropdown: View {
    @Binding var selections: Set<String>
    let options: [DropdownOption]
    var placeholder: String = "Select options"
    var label: String? = nil

    @State private var isPresented = false

    var selectedOptions: [DropdownOption] {
        options.filter { selections.contains($0.id) }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.secondary)
            }

            Button {
                isPresented = true
            } label: {
                HStack {
                    if selectedOptions.isEmpty {
                        Text(placeholder)
                            .foregroundColor(.secondary)
                    } else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 4) {
                                ForEach(selectedOptions) { option in
                                    Text(option.label)
                                        .font(.caption)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.blue.opacity(0.1))
                                        .foregroundColor(.blue)
                                        .cornerRadius(4)
                                }
                            }
                        }
                    }

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(12)
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            }
            .sheet(isPresented: $isPresented) {
                NavigationView {
                    List {
                        ForEach(options) { option in
                            Button {
                                if selections.contains(option.id) {
                                    selections.remove(option.id)
                                } else {
                                    selections.insert(option.id)
                                }
                            } label: {
                                HStack {
                                    Image(systemName: selections.contains(option.id) ? "checkmark.square.fill" : "square")
                                        .foregroundColor(selections.contains(option.id) ? .blue : .gray)

                                    if let icon = option.icon {
                                        Image(systemName: icon)
                                    }

                                    Text(option.label)
                                        .foregroundColor(.primary)

                                    Spacer()
                                }
                            }
                            .disabled(option.disabled)
                        }
                    }
                    .navigationTitle("Select Options")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Done") {
                                isPresented = false
                            }
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Preview
struct DropdownPreview: PreviewProvider {
    struct PreviewContainer: View {
        @State private var selection1: String? = nil
        @State private var selection2: String = "opt2"
        @State private var selection3: String? = nil
        @State private var multiSelection: Set<String> = []

        let options: [DropdownOption] = [
            DropdownOption(value: "opt1", label: "Option 1", icon: "star"),
            DropdownOption(value: "opt2", label: "Option 2", icon: "heart"),
            DropdownOption(value: "opt3", label: "Option 3", icon: "bookmark", description: "With description"),
            DropdownOption(value: "opt4", label: "Disabled Option", disabled: true)
        ]

        var body: some View {
            ScrollView {
                VStack(spacing: 24) {
                    Dropdown(
                        selection: $selection1,
                        options: options,
                        label: "Basic Dropdown"
                    )

                    PickerDropdown(
                        selection: $selection2,
                        options: options,
                        label: "Native Picker Style"
                    )

                    SearchableDropdown(
                        selection: $selection3,
                        options: options,
                        label: "Searchable Dropdown"
                    )

                    MultiSelectDropdown(
                        selections: $multiSelection,
                        options: options,
                        label: "Multi-Select"
                    )

                    Dropdown(
                        selection: .constant(nil),
                        options: options,
                        label: "With Error",
                        error: "This field is required"
                    )

                    Dropdown(
                        selection: .constant(nil),
                        options: options,
                        label: "Disabled",
                        disabled: true
                    )
                }
                .padding()
            }
        }
    }

    static var previews: some View {
        PreviewContainer()
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3'
      ],
      imports: [
        'androidx.compose.animation.*',
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.border',
        'androidx.compose.foundation.clickable',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.lazy.LazyColumn',
        'androidx.compose.foundation.lazy.items',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp',
        'androidx.compose.ui.window.PopupProperties'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.PopupProperties

// Option data class
data class DropdownOption(
    val value: String,
    val label: String,
    val icon: ImageVector? = null,
    val description: String? = null,
    val disabled: Boolean = false
)

// Size enum
enum class DropdownSize(val paddingVertical: Int, val paddingHorizontal: Int, val fontSize: Int) {
    SM(8, 12, 14),
    MD(12, 16, 16),
    LG(16, 20, 18)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Dropdown(
    selectedValue: String?,
    onValueChange: (String) -> Unit,
    options: List<DropdownOption>,
    modifier: Modifier = Modifier,
    placeholder: String = "Select an option",
    label: String? = null,
    disabled: Boolean = false,
    error: String? = null,
    size: DropdownSize = DropdownSize.MD
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedOption = options.find { it.value == selectedValue }

    Column(modifier = modifier) {
        if (label != null) {
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        ExposedDropdownMenuBox(
            expanded = expanded,
            onExpandedChange = { if (!disabled) expanded = it }
        ) {
            OutlinedTextField(
                value = selectedOption?.label ?: "",
                onValueChange = {},
                readOnly = true,
                enabled = !disabled,
                placeholder = { Text(placeholder) },
                leadingIcon = selectedOption?.icon?.let { icon ->
                    { Icon(icon, null, tint = MaterialTheme.colorScheme.onSurfaceVariant) }
                },
                trailingIcon = {
                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
                },
                isError = error != null,
                modifier = Modifier
                    .menuAnchor()
                    .fillMaxWidth(),
                colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
            )

            ExposedDropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false }
            ) {
                options.forEach { option ->
                    DropdownMenuItem(
                        text = {
                            Column {
                                Text(option.label)
                                if (option.description != null) {
                                    Text(
                                        text = option.description,
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        },
                        onClick = {
                            if (!option.disabled) {
                                onValueChange(option.value)
                                expanded = false
                            }
                        },
                        leadingIcon = option.icon?.let { icon ->
                            { Icon(icon, null) }
                        },
                        trailingIcon = if (option.value == selectedValue) {
                            { Icon(Icons.Default.Check, null, tint = MaterialTheme.colorScheme.primary) }
                        } else null,
                        enabled = !option.disabled
                    )
                }
            }
        }

        if (error != null) {
            Text(
                text = error,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(top = 4.dp, start = 4.dp)
            )
        }
    }
}

// Custom dropdown with more control
@Composable
fun CustomDropdown(
    selectedValue: String?,
    onValueChange: (String) -> Unit,
    options: List<DropdownOption>,
    modifier: Modifier = Modifier,
    placeholder: String = "Select an option",
    label: String? = null,
    disabled: Boolean = false,
    error: String? = null,
    searchable: Boolean = false
) {
    var expanded by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    val selectedOption = options.find { it.value == selectedValue }

    val filteredOptions = if (searchable && searchQuery.isNotEmpty()) {
        options.filter { it.label.contains(searchQuery, ignoreCase = true) }
    } else {
        options
    }

    Column(modifier = modifier) {
        if (label != null) {
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        Box {
            // Trigger button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .border(
                        width = 1.dp,
                        color = if (error != null)
                            MaterialTheme.colorScheme.error
                        else
                            MaterialTheme.colorScheme.outline,
                        shape = RoundedCornerShape(8.dp)
                    )
                    .background(MaterialTheme.colorScheme.surface)
                    .clickable(enabled = !disabled) { expanded = true }
                    .padding(horizontal = 16.dp, vertical = 12.dp)
                    .alpha(if (disabled) 0.5f else 1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (selectedOption?.icon != null) {
                    Icon(
                        imageVector = selectedOption.icon,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }

                Text(
                    text = selectedOption?.label ?: placeholder,
                    color = if (selectedOption != null)
                        MaterialTheme.colorScheme.onSurface
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.weight(1f)
                )

                Icon(
                    imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Dropdown menu
            DropdownMenu(
                expanded = expanded,
                onDismissRequest = {
                    expanded = false
                    searchQuery = ""
                },
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .heightIn(max = 300.dp)
            ) {
                if (searchable) {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Search...") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        singleLine = true,
                        leadingIcon = { Icon(Icons.Default.Search, null) }
                    )
                }

                filteredOptions.forEach { option ->
                    DropdownMenuItem(
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                if (option.icon != null) {
                                    Icon(
                                        imageVector = option.icon,
                                        contentDescription = null,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                }
                                Column {
                                    Text(option.label)
                                    if (option.description != null) {
                                        Text(
                                            text = option.description,
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                        },
                        onClick = {
                            if (!option.disabled) {
                                onValueChange(option.value)
                                expanded = false
                                searchQuery = ""
                            }
                        },
                        trailingIcon = if (option.value == selectedValue) {
                            { Icon(Icons.Default.Check, null, tint = MaterialTheme.colorScheme.primary) }
                        } else null,
                        enabled = !option.disabled
                    )
                }

                if (filteredOptions.isEmpty()) {
                    Text(
                        text = "No options found",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        }

        if (error != null) {
            Text(
                text = error,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(top = 4.dp, start = 4.dp)
            )
        }
    }
}

// Multi-select dropdown
@Composable
fun MultiSelectDropdown(
    selectedValues: Set<String>,
    onValuesChange: (Set<String>) -> Unit,
    options: List<DropdownOption>,
    modifier: Modifier = Modifier,
    placeholder: String = "Select options",
    label: String? = null,
    disabled: Boolean = false
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedOptions = options.filter { selectedValues.contains(it.value) }

    Column(modifier = modifier) {
        if (label != null) {
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        Box {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .clickable(enabled = !disabled) { expanded = true }
                    .padding(8.dp)
                    .alpha(if (disabled) 0.5f else 1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (selectedOptions.isEmpty()) {
                    Text(
                        text = placeholder,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                } else {
                    Row(
                        modifier = Modifier.weight(1f),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        selectedOptions.take(3).forEach { option ->
                            Surface(
                                color = MaterialTheme.colorScheme.primaryContainer,
                                shape = RoundedCornerShape(4.dp)
                            ) {
                                Text(
                                    text = option.label,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                        if (selectedOptions.size > 3) {
                            Text(
                                text = "+${selectedOptions.size - 3}",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }

                Icon(
                    imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .heightIn(max = 300.dp)
            ) {
                options.forEach { option ->
                    val isSelected = selectedValues.contains(option.value)

                    DropdownMenuItem(
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Checkbox(
                                    checked = isSelected,
                                    onCheckedChange = null
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(option.label)
                            }
                        },
                        onClick = {
                            if (!option.disabled) {
                                val newValues = if (isSelected) {
                                    selectedValues - option.value
                                } else {
                                    selectedValues + option.value
                                }
                                onValuesChange(newValues)
                            }
                        },
                        enabled = !option.disabled
                    )
                }
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
`
    }
  }
}
