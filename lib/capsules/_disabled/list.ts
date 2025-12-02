/**
 * List Capsule - Multi-Platform
 *
 * Scrollable list with items, sections, and swipe actions.
 */

import { CapsuleDefinition } from './types'

export const ListCapsule: CapsuleDefinition = {
  id: 'list',
  name: 'List',
  description: 'Scrollable list with customizable items and sections',
  category: 'data',
  tags: ['data', 'scroll', 'items', 'collection'],
  version: '1.0.0',

  props: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of items to display'
    },
    {
      name: 'renderItem',
      type: 'slot',
      required: true,
      description: 'Function to render each item'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'default',
      options: ['default', 'inset', 'grouped'],
      description: 'List style variant'
    },
    {
      name: 'separator',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show dividers between items'
    },
    {
      name: 'onItemPress',
      type: 'action',
      required: false,
      description: 'Callback when item is pressed'
    },
    {
      name: 'emptyMessage',
      type: 'string',
      required: false,
      default: 'No items',
      description: 'Message when list is empty'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show loading state'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React from 'react'

interface ListItem {
  id: string
  title: string
  subtitle?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

interface ListProps<T extends ListItem> {
  items: T[]
  renderItem?: (item: T, index: number) => React.ReactNode
  variant?: 'default' | 'inset' | 'grouped'
  separator?: boolean
  onItemPress?: (item: T) => void
  emptyMessage?: string
  loading?: boolean
}

export function List<T extends ListItem>({
  items,
  renderItem,
  variant = 'default',
  separator = true,
  onItemPress,
  emptyMessage = 'No items',
  loading = false
}: ListProps<T>) {
  const variants = {
    default: '',
    inset: 'mx-4 rounded-xl overflow-hidden',
    grouped: 'bg-white rounded-xl shadow-sm mx-4 overflow-hidden'
  }

  if (loading) {
    return (
      <div className={\`\${variants[variant]}\`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={\`\${variants[variant]} p-8 text-center\`}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  const defaultRenderItem = (item: T) => (
    <div className="flex items-center gap-3">
      {item.leading && (
        <div className="flex-shrink-0">{item.leading}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-gray-900 truncate">
          {item.title}
        </p>
        {item.subtitle && (
          <p className="text-sm text-gray-500 truncate">
            {item.subtitle}
          </p>
        )}
      </div>
      {item.trailing && (
        <div className="flex-shrink-0">{item.trailing}</div>
      )}
    </div>
  )

  return (
    <ul className={\`\${variants[variant]} bg-white\`}>
      {items.map((item, index) => (
        <li key={item.id}>
          <div
            onClick={() => onItemPress?.(item)}
            className={\`
              p-4 transition-colors
              \${onItemPress ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100' : ''}
            \`}
          >
            {renderItem ? renderItem(item, index) : defaultRenderItem(item)}
          </div>
          {separator && index < items.length - 1 && (
            <div className="border-b border-gray-100 ml-4" />
          )}
        </li>
      ))}
    </ul>
  )
}

// List Item Component for custom usage
interface ListItemProps {
  title: string
  subtitle?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
  onPress?: () => void
}

export function ListItem({ title, subtitle, leading, trailing, onPress }: ListItemProps) {
  return (
    <div
      onClick={onPress}
      className={\`
        flex items-center gap-3 p-4 bg-white
        \${onPress ? 'cursor-pointer hover:bg-gray-50' : ''}
      \`}
    >
      {leading && <div className="flex-shrink-0">{leading}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-gray-900">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {trailing && <div className="flex-shrink-0">{trailing}</div>}
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

protocol ListItemProtocol: Identifiable {
    var id: String { get }
    var title: String { get }
    var subtitle: String? { get }
}

struct SimpleListItem: ListItemProtocol {
    let id: String
    let title: String
    var subtitle: String? = nil
}

enum ListVariant {
    case \`default\`, inset, grouped
}

struct HubLabList<Item: ListItemProtocol, Leading: View, Trailing: View, ItemContent: View>: View {
    let items: [Item]
    var variant: ListVariant = .default
    var separator: Bool = true
    var onItemPress: ((Item) -> Void)? = nil
    var emptyMessage: String = "No items"
    var loading: Bool = false

    @ViewBuilder let leading: (Item) -> Leading
    @ViewBuilder let trailing: (Item) -> Trailing
    @ViewBuilder let itemContent: ((Item) -> ItemContent)?

    init(
        items: [Item],
        variant: ListVariant = .default,
        separator: Bool = true,
        onItemPress: ((Item) -> Void)? = nil,
        emptyMessage: String = "No items",
        loading: Bool = false,
        @ViewBuilder leading: @escaping (Item) -> Leading = { _ in EmptyView() },
        @ViewBuilder trailing: @escaping (Item) -> Trailing = { _ in EmptyView() },
        @ViewBuilder itemContent: ((Item) -> ItemContent)? = nil
    ) {
        self.items = items
        self.variant = variant
        self.separator = separator
        self.onItemPress = onItemPress
        self.emptyMessage = emptyMessage
        self.loading = loading
        self.leading = leading
        self.trailing = trailing
        self.itemContent = itemContent
    }

    var body: some View {
        Group {
            if loading {
                loadingView
            } else if items.isEmpty {
                emptyView
            } else {
                listView
            }
        }
    }

    private var loadingView: some View {
        VStack(spacing: 0) {
            ForEach(0..<3, id: \\.self) { _ in
                HStack(spacing: 12) {
                    Circle()
                        .fill(Color.gray.opacity(0.2))
                        .frame(width: 40, height: 40)
                    VStack(alignment: .leading, spacing: 4) {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.gray.opacity(0.2))
                            .frame(height: 16)
                            .frame(maxWidth: 200)
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.gray.opacity(0.2))
                            .frame(height: 12)
                            .frame(maxWidth: 120)
                    }
                    Spacer()
                }
                .padding()
            }
        }
        .listStyle(variant)
    }

    private var emptyView: some View {
        VStack(spacing: 12) {
            Image(systemName: "tray")
                .font(.largeTitle)
                .foregroundColor(.secondary)
            Text(emptyMessage)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(32)
    }

    private var listView: some View {
        List {
            ForEach(items) { item in
                itemRow(for: item)
                    .listRowSeparator(separator ? .visible : .hidden)
            }
        }
        .listStyle(variant)
    }

    @ViewBuilder
    private func itemRow(for item: Item) -> some View {
        Group {
            if let content = itemContent {
                content(item)
            } else {
                defaultItemRow(for: item)
            }
        }
        .contentShape(Rectangle())
        .onTapGesture {
            onItemPress?(item)
        }
    }

    private func defaultItemRow(for item: Item) -> some View {
        HStack(spacing: 12) {
            leading(item)

            VStack(alignment: .leading, spacing: 2) {
                Text(item.title)
                    .font(.body)
                    .foregroundColor(.primary)
                if let subtitle = item.subtitle {
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()

            trailing(item)
        }
        .padding(.vertical, 4)
    }
}

extension View {
    @ViewBuilder
    func listStyle(_ variant: ListVariant) -> some View {
        switch variant {
        case .default:
            self.listStyle(.plain)
        case .inset:
            self.listStyle(.insetGrouped)
        case .grouped:
            self.listStyle(.grouped)
        }
    }
}

// MARK: - Previews
#Preview("List Variants") {
    let sampleItems = [
        SimpleListItem(id: "1", title: "First Item", subtitle: "Description"),
        SimpleListItem(id: "2", title: "Second Item", subtitle: "Another description"),
        SimpleListItem(id: "3", title: "Third Item")
    ]

    return NavigationStack {
        HubLabList(
            items: sampleItems,
            variant: .inset,
            onItemPress: { item in print("Tapped: \\(item.title)") },
            leading: { _ in
                Image(systemName: "star.fill")
                    .foregroundColor(.yellow)
            },
            trailing: { _ in
                Image(systemName: "chevron.right")
                    .foregroundColor(.secondary)
            }
        )
        .navigationTitle("List Demo")
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3',
        'androidx.compose.foundation:foundation'
      ],
      imports: [
        'androidx.compose.foundation.lazy.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'androidx.compose.foundation.clickable'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

interface ListItemData {
    val id: String
    val title: String
    val subtitle: String?
}

data class SimpleListItem(
    override val id: String,
    override val title: String,
    override val subtitle: String? = null
) : ListItemData

enum class ListVariant { Default, Inset, Grouped }

@Composable
fun <T : ListItemData> HubLabList(
    items: List<T>,
    modifier: Modifier = Modifier,
    variant: ListVariant = ListVariant.Default,
    showSeparator: Boolean = true,
    onItemPress: ((T) -> Unit)? = null,
    emptyMessage: String = "No items",
    loading: Boolean = false,
    leadingContent: @Composable ((T) -> Unit)? = null,
    trailingContent: @Composable ((T) -> Unit)? = null,
    itemContent: @Composable ((T) -> Unit)? = null
) {
    val listModifier = when (variant) {
        ListVariant.Default -> modifier
        ListVariant.Inset -> modifier.padding(horizontal = 16.dp)
        ListVariant.Grouped -> modifier.padding(16.dp)
    }

    when {
        loading -> {
            LoadingList(modifier = listModifier)
        }
        items.isEmpty() -> {
            EmptyList(message = emptyMessage, modifier = listModifier)
        }
        else -> {
            LazyColumn(modifier = listModifier) {
                itemsIndexed(items, key = { _, item -> item.id }) { index, item ->
                    if (itemContent != null) {
                        itemContent(item)
                    } else {
                        DefaultListItem(
                            item = item,
                            onClick = onItemPress?.let { { it(item) } },
                            leadingContent = leadingContent?.let { { it(item) } },
                            trailingContent = trailingContent?.let { { it(item) } }
                        )
                    }

                    if (showSeparator && index < items.size - 1) {
                        HorizontalDivider(
                            modifier = Modifier.padding(start = if (leadingContent != null) 56.dp else 16.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun <T : ListItemData> DefaultListItem(
    item: T,
    onClick: (() -> Unit)?,
    leadingContent: @Composable (() -> Unit)?,
    trailingContent: @Composable (() -> Unit)?
) {
    ListItem(
        headlineContent = { Text(item.title) },
        supportingContent = item.subtitle?.let { { Text(it) } },
        leadingContent = leadingContent,
        trailingContent = trailingContent,
        modifier = Modifier
            .fillMaxWidth()
            .then(
                if (onClick != null) Modifier.clickable(onClick = onClick)
                else Modifier
            )
    )
}

@Composable
private fun LoadingList(modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        repeat(3) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Avatar placeholder
                Surface(
                    modifier = Modifier.size(40.dp),
                    shape = MaterialTheme.shapes.small,
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {}
                // Text placeholders
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Surface(
                        modifier = Modifier
                            .height(16.dp)
                            .width(150.dp),
                        shape = MaterialTheme.shapes.extraSmall,
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {}
                    Surface(
                        modifier = Modifier
                            .height(12.dp)
                            .width(100.dp),
                        shape = MaterialTheme.shapes.extraSmall,
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {}
                }
            }
        }
    }
}

@Composable
private fun EmptyList(message: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = message,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabListPreview() {
    val items = listOf(
        SimpleListItem("1", "First Item", "Description here"),
        SimpleListItem("2", "Second Item", "Another description"),
        SimpleListItem("3", "Third Item")
    )

    MaterialTheme {
        HubLabList(
            items = items,
            onItemPress = { println("Tapped: \${it.title}") }
        )
    }
}
`
    }
  },

  children: false,
  preview: '/previews/list.png'
}
