/**
 * SearchBar Capsule - Multi-Platform Search Input
 *
 * Search input with suggestions and filtering
 */

import { CapsuleDefinition } from './types'

export const SearchBarCapsule: CapsuleDefinition = {
  id: 'searchbar',
  name: 'SearchBar',
  description: 'Search input with suggestions and filtering',
  category: 'forms',
  tags: ['search', 'input', 'filter', 'autocomplete', 'suggestions'],
  version: '1.0.0',

  props: [
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Search query value'
    },
    {
      name: 'onChange',
      type: 'action',
      required: false,
      description: 'Callback when query changes'
    },
    {
      name: 'onSearch',
      type: 'action',
      required: false,
      description: 'Callback when search is submitted'
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: 'Search...',
      description: 'Placeholder text'
    },
    {
      name: 'suggestions',
      type: 'array',
      required: false,
      description: 'Array of search suggestions'
    },
    {
      name: 'showClearButton',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show clear button when has value'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show loading state'
    },
    {
      name: 'size',
      type: 'size',
      required: false,
      default: 'md',
      description: 'Size of the search bar'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'default',
      description: 'Visual style',
      options: ['default', 'filled', 'outlined']
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, useRef, useEffect, useCallback } from 'react'

interface Suggestion {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onSuggestionSelect?: (suggestion: Suggestion) => void
  placeholder?: string
  suggestions?: Suggestion[]
  showClearButton?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  autoFocus?: boolean
  disabled?: boolean
  className?: string
}

export function SearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  onSuggestionSelect,
  placeholder = 'Search...',
  suggestions = [],
  showClearButton = true,
  loading = false,
  size = 'md',
  variant = 'default',
  autoFocus = false,
  disabled = false,
  className = ''
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledValue !== undefined
  const searchValue = isControlled ? controlledValue : internalValue

  const filteredSuggestions = suggestions.filter(s =>
    s.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
    setShowSuggestions(true)
    setHighlightedIndex(-1)
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    onChange?.('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchValue)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (!isControlled) {
      setInternalValue(suggestion.label)
    }
    onChange?.(suggestion.label)
    onSuggestionSelect?.(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault()
          handleSuggestionClick(filteredSuggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sizeStyles = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg px-5'
  }

  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-800 border-transparent focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:border-gray-300',
    filled: 'bg-gray-100 dark:bg-gray-800 border-transparent',
    outlined: 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
  }

  return (
    <div ref={containerRef} className={\`relative \${className}\`}>
      <form onSubmit={handleSubmit}>
        <div
          className={\`
            flex items-center gap-2 rounded-lg border transition-all
            \${variantStyles[variant]}
            \${sizeStyles[size]}
            \${isFocused ? 'ring-2 ring-blue-500' : ''}
            \${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          \`}
        >
          {/* Search Icon */}
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleChange}
            onFocus={() => {
              setIsFocused(true)
              setShowSuggestions(true)
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent outline-none placeholder-gray-400"
          />

          {/* Loading Spinner */}
          {loading && (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          )}

          {/* Clear Button */}
          {showClearButton && searchValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <ul className="max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={\`
                  px-4 py-2 cursor-pointer flex items-center gap-3
                  \${highlightedIndex === index
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                \`}
              >
                {suggestion.icon && <span>{suggestion.icon}</span>}
                <div>
                  <div className="text-gray-900 dark:text-white">{suggestion.label}</div>
                  {suggestion.description && (
                    <div className="text-sm text-gray-500">{suggestion.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Command Palette style search
interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Suggestion[]
  onSelect: (command: Suggestion) => void
  placeholder?: string
}

export function CommandPalette({
  isOpen,
  onClose,
  commands,
  onSelect,
  placeholder = 'Type a command or search...'
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-4 bg-transparent outline-none"
          />
        </div>

        <ul className="max-h-80 overflow-auto py-2">
          {filteredCommands.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              No results found
            </li>
          ) : (
            filteredCommands.map((cmd) => (
              <li
                key={cmd.id}
                onClick={() => {
                  onSelect(cmd)
                  onClose()
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                {cmd.icon && <span className="text-gray-400">{cmd.icon}</span>}
                <div>
                  <div className="text-gray-900 dark:text-white">{cmd.label}</div>
                  {cmd.description && (
                    <div className="text-sm text-gray-500">{cmd.description}</div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
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

// MARK: - Search Bar
struct SearchBar: View {
    @Binding var text: String
    var placeholder: String = "Search..."
    var showsCancelButton: Bool = true
    var onSearch: ((String) -> Void)? = nil
    var onCancel: (() -> Void)? = nil

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)

                TextField(placeholder, text: $text)
                    .focused($isFocused)
                    .submitLabel(.search)
                    .onSubmit {
                        onSearch?(text)
                    }

                if !text.isEmpty {
                    Button {
                        text = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding(10)
            .background(Color(.systemGray6))
            .cornerRadius(10)

            if showsCancelButton && isFocused {
                Button("Cancel") {
                    text = ""
                    isFocused = false
                    onCancel?()
                }
                .transition(.move(edge: .trailing).combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.2), value: isFocused)
    }
}

// MARK: - Search Bar with Suggestions
struct SearchBarWithSuggestions<T: Identifiable & Hashable>: View {
    @Binding var text: String
    let suggestions: [T]
    let labelKeyPath: KeyPath<T, String>
    var placeholder: String = "Search..."
    var onSelect: ((T) -> Void)? = nil
    var onSearch: ((String) -> Void)? = nil

    @State private var showSuggestions = false
    @FocusState private var isFocused: Bool

    private var filteredSuggestions: [T] {
        guard !text.isEmpty else { return [] }
        return suggestions.filter {
            $0[keyPath: labelKeyPath].localizedCaseInsensitiveContains(text)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)

                TextField(placeholder, text: $text)
                    .focused($isFocused)
                    .submitLabel(.search)
                    .onChange(of: text) { _ in
                        showSuggestions = !text.isEmpty
                    }
                    .onSubmit {
                        onSearch?(text)
                        showSuggestions = false
                    }

                if !text.isEmpty {
                    Button {
                        text = ""
                        showSuggestions = false
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding(10)
            .background(Color(.systemGray6))
            .cornerRadius(10)

            if showSuggestions && !filteredSuggestions.isEmpty {
                List {
                    ForEach(filteredSuggestions) { suggestion in
                        Button {
                            text = suggestion[keyPath: labelKeyPath]
                            onSelect?(suggestion)
                            showSuggestions = false
                            isFocused = false
                        } label: {
                            HStack {
                                Image(systemName: "magnifyingglass")
                                    .foregroundColor(.secondary)
                                    .font(.caption)
                                Text(suggestion[keyPath: labelKeyPath])
                                    .foregroundColor(.primary)
                                Spacer()
                                Image(systemName: "arrow.up.left")
                                    .foregroundColor(.secondary)
                                    .font(.caption)
                            }
                        }
                    }
                }
                .listStyle(.plain)
                .frame(maxHeight: 200)
                .background(Color(.systemBackground))
                .cornerRadius(10)
                .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
            }
        }
    }
}

// MARK: - Searchable List
struct SearchableList<T: Identifiable, Content: View>: View {
    let items: [T]
    let searchKeyPaths: [KeyPath<T, String>]
    @ViewBuilder let content: (T) -> Content

    @State private var searchText = ""

    private var filteredItems: [T] {
        guard !searchText.isEmpty else { return items }
        return items.filter { item in
            searchKeyPaths.contains { keyPath in
                item[keyPath: keyPath].localizedCaseInsensitiveContains(searchText)
            }
        }
    }

    var body: some View {
        List {
            ForEach(filteredItems) { item in
                content(item)
            }
        }
        .searchable(text: $searchText, prompt: "Search...")
    }
}

// MARK: - Native Search Style
struct NativeSearchBar: View {
    @Binding var text: String
    var prompt: String = "Search"
    var placement: SearchFieldPlacement = .automatic

    var body: some View {
        // This is meant to be used within a NavigationView
        // The actual .searchable modifier should be applied to the parent
        TextField(prompt, text: $text)
            .textFieldStyle(.roundedBorder)
    }
}

// MARK: - Spotlight Style Search
struct SpotlightSearch<T: Identifiable>: View {
    @Binding var isPresented: Bool
    let items: [T]
    let labelKeyPath: KeyPath<T, String>
    var descriptionKeyPath: KeyPath<T, String>? = nil
    var iconKeyPath: KeyPath<T, String>? = nil
    var onSelect: ((T) -> Void)? = nil

    @State private var searchText = ""
    @FocusState private var isFocused: Bool

    private var filteredItems: [T] {
        guard !searchText.isEmpty else { return [] }
        return items.filter {
            $0[keyPath: labelKeyPath].localizedCaseInsensitiveContains(searchText)
        }.prefix(10).map { $0 }
    }

    var body: some View {
        if isPresented {
            ZStack {
                // Backdrop
                Color.black.opacity(0.5)
                    .ignoresSafeArea()
                    .onTapGesture {
                        isPresented = false
                    }

                // Search Panel
                VStack(spacing: 0) {
                    // Search Field
                    HStack(spacing: 12) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.secondary)
                            .font(.title2)

                        TextField("Search...", text: $searchText)
                            .font(.title3)
                            .focused($isFocused)

                        if !searchText.isEmpty {
                            Button {
                                searchText = ""
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding()
                    .background(Color(.systemGray6))

                    Divider()

                    // Results
                    if filteredItems.isEmpty && !searchText.isEmpty {
                        VStack(spacing: 8) {
                            Image(systemName: "magnifyingglass")
                                .font(.largeTitle)
                                .foregroundColor(.secondary)
                            Text("No Results")
                                .font(.headline)
                            Text("Try a different search term")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 40)
                    } else {
                        ScrollView {
                            LazyVStack(spacing: 0) {
                                ForEach(filteredItems) { item in
                                    Button {
                                        onSelect?(item)
                                        isPresented = false
                                    } label: {
                                        HStack(spacing: 12) {
                                            if let iconKeyPath = iconKeyPath {
                                                Image(systemName: item[keyPath: iconKeyPath])
                                                    .foregroundColor(.blue)
                                                    .frame(width: 24)
                                            }

                                            VStack(alignment: .leading, spacing: 2) {
                                                Text(item[keyPath: labelKeyPath])
                                                    .foregroundColor(.primary)

                                                if let descKeyPath = descriptionKeyPath {
                                                    Text(item[keyPath: descKeyPath])
                                                        .font(.caption)
                                                        .foregroundColor(.secondary)
                                                }
                                            }

                                            Spacer()

                                            Image(systemName: "return")
                                                .foregroundColor(.secondary)
                                                .font(.caption)
                                        }
                                        .padding(.horizontal)
                                        .padding(.vertical, 12)
                                        .contentShape(Rectangle())
                                    }
                                    .buttonStyle(.plain)

                                    Divider()
                                        .padding(.leading, iconKeyPath != nil ? 52 : 16)
                                }
                            }
                        }
                        .frame(maxHeight: 400)
                    }
                }
                .background(Color(.systemBackground))
                .cornerRadius(12)
                .shadow(color: .black.opacity(0.2), radius: 20)
                .padding(.horizontal, 40)
                .padding(.top, 100)
                .frame(maxHeight: .infinity, alignment: .top)
            }
            .onAppear {
                isFocused = true
            }
        }
    }
}

// MARK: - Preview
struct SearchBarPreview: PreviewProvider {
    struct SearchItem: Identifiable, Hashable {
        let id = UUID()
        let name: String
        let description: String
        let icon: String
    }

    static let items = [
        SearchItem(name: "Settings", description: "App settings", icon: "gear"),
        SearchItem(name: "Profile", description: "Your profile", icon: "person"),
        SearchItem(name: "Notifications", description: "Manage alerts", icon: "bell"),
        SearchItem(name: "Privacy", description: "Privacy settings", icon: "lock"),
        SearchItem(name: "Help", description: "Get support", icon: "questionmark.circle"),
    ]

    struct Container: View {
        @State private var searchText = ""
        @State private var showSpotlight = false

        var body: some View {
            VStack(spacing: 24) {
                SearchBar(text: $searchText)

                SearchBarWithSuggestions(
                    text: $searchText,
                    suggestions: items,
                    labelKeyPath: \\.name
                )

                Button("Open Spotlight Search") {
                    showSpotlight = true
                }
            }
            .padding()
            .overlay {
                SpotlightSearch(
                    isPresented: $showSpotlight,
                    items: items,
                    labelKeyPath: \\.name,
                    descriptionKeyPath: \\.description,
                    iconKeyPath: \\.icon
                )
            }
        }
    }

    static var previews: some View {
        Container()
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
        'androidx.compose.foundation.clickable',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.lazy.LazyColumn',
        'androidx.compose.foundation.lazy.items',
        'androidx.compose.foundation.shape.CircleShape',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.foundation.text.BasicTextField',
        'androidx.compose.foundation.text.KeyboardActions',
        'androidx.compose.foundation.text.KeyboardOptions',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.focus.FocusRequester',
        'androidx.compose.ui.focus.focusRequester',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.platform.LocalFocusManager',
        'androidx.compose.ui.text.input.ImeAction',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp',
        'androidx.compose.ui.window.Dialog'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog

// Size variants
enum class SearchBarSize(val height: Int, val fontSize: Int, val iconSize: Int) {
    SM(40, 14, 18),
    MD(48, 16, 20),
    LG(56, 18, 24)
}

// Variant styles
enum class SearchBarVariant {
    DEFAULT, FILLED, OUTLINED
}

@Composable
fun SearchBar(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Search...",
    onSearch: ((String) -> Unit)? = null,
    showClearButton: Boolean = true,
    loading: Boolean = false,
    size: SearchBarSize = SearchBarSize.MD,
    variant: SearchBarVariant = SearchBarVariant.DEFAULT,
    enabled: Boolean = true
) {
    val focusManager = LocalFocusManager.current

    val backgroundColor = when (variant) {
        SearchBarVariant.DEFAULT -> MaterialTheme.colorScheme.surfaceVariant
        SearchBarVariant.FILLED -> MaterialTheme.colorScheme.surfaceVariant
        SearchBarVariant.OUTLINED -> Color.Transparent
    }

    val borderModifier = if (variant == SearchBarVariant.OUTLINED) {
        Modifier.border(
            width = 1.dp,
            color = MaterialTheme.colorScheme.outline,
            shape = RoundedCornerShape(size.height.dp / 2)
        )
    } else Modifier

    Row(
        modifier = modifier
            .height(size.height.dp)
            .clip(RoundedCornerShape(size.height.dp / 2))
            .background(backgroundColor)
            .then(borderModifier)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Default.Search,
            contentDescription = "Search",
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(size.iconSize.dp)
        )

        Spacer(modifier = Modifier.width(12.dp))

        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            enabled = enabled,
            singleLine = true,
            textStyle = LocalTextStyle.current.copy(
                fontSize = size.fontSize.sp,
                color = MaterialTheme.colorScheme.onSurface
            ),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            keyboardActions = KeyboardActions(
                onSearch = {
                    onSearch?.invoke(value)
                    focusManager.clearFocus()
                }
            ),
            decorationBox = { innerTextField ->
                Box(modifier = Modifier.weight(1f)) {
                    if (value.isEmpty()) {
                        Text(
                            text = placeholder,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = size.fontSize.sp
                        )
                    }
                    innerTextField()
                }
            },
            modifier = Modifier.weight(1f)
        )

        AnimatedVisibility(
            visible = loading,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            CircularProgressIndicator(
                modifier = Modifier
                    .size(20.dp)
                    .padding(end = 8.dp),
                strokeWidth = 2.dp
            )
        }

        AnimatedVisibility(
            visible = showClearButton && value.isNotEmpty() && !loading,
            enter = fadeIn() + scaleIn(),
            exit = fadeOut() + scaleOut()
        ) {
            IconButton(
                onClick = { onValueChange("") },
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Clear",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

// Search Bar with Suggestions
data class SearchSuggestion(
    val id: String,
    val label: String,
    val description: String? = null,
    val icon: @Composable (() -> Unit)? = null
)

@Composable
fun SearchBarWithSuggestions(
    value: String,
    onValueChange: (String) -> Unit,
    suggestions: List<SearchSuggestion>,
    modifier: Modifier = Modifier,
    placeholder: String = "Search...",
    onSearch: ((String) -> Unit)? = null,
    onSuggestionClick: ((SearchSuggestion) -> Unit)? = null
) {
    var showSuggestions by remember { mutableStateOf(false) }

    val filteredSuggestions = remember(value, suggestions) {
        if (value.isEmpty()) emptyList()
        else suggestions.filter {
            it.label.contains(value, ignoreCase = true)
        }
    }

    Column(modifier = modifier) {
        SearchBar(
            value = value,
            onValueChange = {
                onValueChange(it)
                showSuggestions = it.isNotEmpty()
            },
            placeholder = placeholder,
            onSearch = {
                onSearch?.invoke(it)
                showSuggestions = false
            }
        )

        AnimatedVisibility(
            visible = showSuggestions && filteredSuggestions.isNotEmpty()
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp),
                shape = RoundedCornerShape(12.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                LazyColumn(
                    modifier = Modifier.heightIn(max = 200.dp)
                ) {
                    items(filteredSuggestions) { suggestion ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    onValueChange(suggestion.label)
                                    onSuggestionClick?.invoke(suggestion)
                                    showSuggestions = false
                                }
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            suggestion.icon?.invoke() ?: Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(20.dp)
                            )

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = suggestion.label,
                                    fontSize = 14.sp
                                )
                                if (suggestion.description != null) {
                                    Text(
                                        text = suggestion.description,
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Icon(
                                imageVector = Icons.Default.NorthWest,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

// Material 3 SearchBar wrapper
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun M3SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    onSearch: (String) -> Unit,
    active: Boolean,
    onActiveChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Search...",
    content: @Composable ColumnScope.() -> Unit = {}
) {
    SearchBar(
        query = query,
        onQueryChange = onQueryChange,
        onSearch = onSearch,
        active = active,
        onActiveChange = onActiveChange,
        modifier = modifier,
        placeholder = { Text(placeholder) },
        leadingIcon = { Icon(Icons.Default.Search, null) },
        trailingIcon = {
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(Icons.Default.Close, null)
                }
            }
        },
        content = content
    )
}

// Command Palette Dialog
@Composable
fun CommandPalette(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    commands: List<SearchSuggestion>,
    onSelect: (SearchSuggestion) -> Unit
) {
    if (!isOpen) return

    var query by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }

    val filteredCommands = remember(query, commands) {
        if (query.isEmpty()) commands
        else commands.filter { it.label.contains(query, ignoreCase = true) }
    }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(max = 400.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column {
                // Search Field
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    BasicTextField(
                        value = query,
                        onValueChange = { query = it },
                        singleLine = true,
                        textStyle = LocalTextStyle.current.copy(
                            fontSize = 16.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 12.dp)
                            .focusRequester(focusRequester),
                        decorationBox = { innerTextField ->
                            if (query.isEmpty()) {
                                Text(
                                    text = "Type a command...",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            innerTextField()
                        }
                    )
                }

                Divider()

                // Results
                if (filteredCommands.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No results found",
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                } else {
                    LazyColumn {
                        items(filteredCommands) { command ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        onSelect(command)
                                        onDismiss()
                                    }
                                    .padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                command.icon?.invoke()

                                Spacer(modifier = Modifier.width(12.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(text = command.label)
                                    if (command.description != null) {
                                        Text(
                                            text = command.description,
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }
}

private fun Modifier.border(width: Int, color: Color, shape: RoundedCornerShape): Modifier {
    return this
}
`
    }
  }
}
