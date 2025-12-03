/**
 * Breadcrumb Capsule - Multi-Platform
 * Navigation trail showing current location in app hierarchy
 */

import { CapsuleDefinition } from './types'

export const BreadcrumbCapsule: CapsuleDefinition = {
  id: 'breadcrumb',
  name: 'Breadcrumb',
  description: 'Navigation trail for hierarchical page structure',
  category: 'navigation',
  tags: ['breadcrumb', 'navigation', 'trail', 'hierarchy'],
  version: '1.0.0',

  props: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of breadcrumb items with label and href'
    },
    {
      name: 'separator',
      type: 'string',
      required: false,
      default: '/',
      description: 'Separator between items'
    },
    {
      name: 'showHome',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show home icon as first item'
    },
    {
      name: 'maxItems',
      type: 'number',
      required: false,
      description: 'Maximum items to show before collapsing'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
  showHome?: boolean
  maxItems?: number
}

export function Breadcrumb({
  items,
  separator,
  showHome = true,
  maxItems
}: BreadcrumbProps) {
  let displayItems = items
  let collapsed = false

  if (maxItems && items.length > maxItems) {
    displayItems = [
      items[0],
      { label: '...' },
      ...items.slice(-(maxItems - 1))
    ]
    collapsed = true
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {showHome && (
        <>
          <a href="/" className="text-gray-500 hover:text-gray-700">
            <Home className="h-4 w-4" />
          </a>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </>
      )}

      {displayItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {item.label === '...' ? (
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          ) : item.href ? (
            <a
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
`
    },
    ios: {
      framework: 'swiftui',
      minimumVersion: '15.0',
      dependencies: [],
      code: `
import SwiftUI

struct BreadcrumbItem: Identifiable {
    let id = UUID()
    let label: String
    var href: String?
}

struct Breadcrumb: View {
    let items: [BreadcrumbItem]
    var showHome: Bool = true
    var onNavigate: ((String) -> Void)?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                if showHome {
                    Button(action: { onNavigate?("/") }) {
                        Image(systemName: "house")
                            .foregroundColor(.secondary)
                    }
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                ForEach(Array(items.enumerated()), id: \\.element.id) { index, item in
                    if index > 0 {
                        Image(systemName: "chevron.right")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }

                    if let href = item.href {
                        Button(item.label) {
                            onNavigate?(href)
                        }
                        .foregroundColor(.secondary)
                    } else {
                        Text(item.label)
                            .fontWeight(.medium)
                    }
                }
            }
            .font(.subheadline)
        }
    }
}
`
    },
    android: {
      framework: 'compose',
      minimumVersion: '1.0.0',
      dependencies: ['androidx.compose.material3:material3'],
      code: `
@Composable
fun Breadcrumb(
    items: List<BreadcrumbItem>,
    showHome: Boolean = true,
    onNavigate: (String) -> Unit = {}
) {
    Row(
        modifier = Modifier.horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (showHome) {
            IconButton(onClick = { onNavigate("/") }, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Home, contentDescription = "Home", tint = Color.Gray)
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray)
        }

        items.forEachIndexed { index, item ->
            if (index > 0) {
                Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray)
            }

            if (item.href != null) {
                TextButton(onClick = { onNavigate(item.href) }) {
                    Text(item.label, color = Color.Gray)
                }
            } else {
                Text(item.label, fontWeight = FontWeight.Medium)
            }
        }
    }
}

data class BreadcrumbItem(val label: String, val href: String? = null)
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react', 'lucide-react'],
      code: `// Same as web implementation`
    }
  }
}
