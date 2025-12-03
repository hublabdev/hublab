/**
 * Floating Action Button (FAB) Capsule - Multi-Platform
 * Floating button for primary actions
 */

import { CapsuleDefinition } from './types'

export const FABCapsule: CapsuleDefinition = {
  id: 'fab',
  name: 'Floating Action Button',
  description: 'Floating button for primary app actions',
  category: 'ui',
  tags: ['fab', 'button', 'floating', 'action'],
  version: '1.0.0',

  props: [
    {
      name: 'icon',
      type: 'icon',
      required: true,
      description: 'Button icon'
    },
    {
      name: 'onClick',
      type: 'action',
      required: true,
      description: 'Click handler'
    },
    {
      name: 'position',
      type: 'select',
      required: false,
      default: 'bottom-right',
      options: ['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left'],
      description: 'Button position'
    },
    {
      name: 'size',
      type: 'select',
      required: false,
      default: 'default',
      options: ['small', 'default', 'large'],
      description: 'Button size'
    },
    {
      name: 'color',
      type: 'color',
      required: false,
      default: '#3b82f6',
      description: 'Background color'
    },
    {
      name: 'extended',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show extended FAB with label'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Label for extended FAB'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { Plus, Edit, Share, Message, Heart } from 'lucide-react'

interface FABProps {
  icon?: string
  onClick: () => void
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left'
  size?: 'small' | 'default' | 'large'
  color?: string
  extended?: boolean
  label?: string
}

const iconMap: Record<string, React.ElementType> = {
  plus: Plus,
  edit: Edit,
  share: Share,
  message: Message,
  heart: Heart,
}

export function FAB({
  icon = 'plus',
  onClick,
  position = 'bottom-right',
  size = 'default',
  color = '#3b82f6',
  extended = false,
  label
}: FABProps) {
  const Icon = iconMap[icon] || Plus

  const sizeClasses = {
    small: 'w-10 h-10',
    default: 'w-14 h-14',
    large: 'w-16 h-16'
  }

  const iconSizes = {
    small: 18,
    default: 24,
    large: 28
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  if (extended && label) {
    return (
      <button
        onClick={onClick}
        className={\`fixed \${positionClasses[position]} flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all z-50\`}
        style={{ backgroundColor: color }}
      >
        <Icon size={iconSizes[size]} />
        <span>{label}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={\`fixed \${positionClasses[position]} \${sizeClasses[size]} rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center z-50\`}
      style={{ backgroundColor: color }}
    >
      <Icon size={iconSizes[size]} />
    </button>
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

struct FAB: View {
    var icon: String = "plus"
    var action: () -> Void
    var position: FABPosition = .bottomRight
    var size: FABSize = .default
    var color: Color = .blue
    var extended: Bool = false
    var label: String?

    enum FABPosition { case bottomRight, bottomLeft, bottomCenter, topRight, topLeft }
    enum FABSize { case small, regular, large }

    private var buttonSize: CGFloat {
        switch size {
        case .small: return 44
        case .regular: return 56
        case .large: return 64
        }
    }

    var body: some View {
        VStack {
            if position == .bottomRight || position == .bottomLeft || position == .bottomCenter {
                Spacer()
            }

            HStack {
                if position == .bottomRight || position == .topRight {
                    Spacer()
                }

                Button(action: action) {
                    if extended, let text = label {
                        HStack(spacing: 8) {
                            Image(systemName: icon)
                            Text(text)
                                .fontWeight(.medium)
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 16)
                        .background(color)
                        .cornerRadius(28)
                        .shadow(radius: 8)
                    } else {
                        Image(systemName: icon)
                            .font(.system(size: buttonSize / 2.5, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: buttonSize, height: buttonSize)
                            .background(color)
                            .clipShape(Circle())
                            .shadow(radius: 8)
                    }
                }

                if position == .bottomLeft || position == .topLeft {
                    Spacer()
                }
            }
            .padding(24)

            if position == .topRight || position == .topLeft {
                Spacer()
            }
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
fun FAB(
    icon: ImageVector = Icons.Default.Add,
    onClick: () -> Unit,
    position: FABPosition = FABPosition.BottomEnd,
    size: FABSize = FABSize.Default,
    color: Color = MaterialTheme.colorScheme.primary,
    extended: Boolean = false,
    label: String? = null
) {
    val buttonSize = when (size) {
        FABSize.Small -> 40.dp
        FABSize.Default -> 56.dp
        FABSize.Large -> 64.dp
    }

    val alignment = when (position) {
        FABPosition.BottomEnd -> Alignment.BottomEnd
        FABPosition.BottomStart -> Alignment.BottomStart
        FABPosition.BottomCenter -> Alignment.BottomCenter
        FABPosition.TopEnd -> Alignment.TopEnd
        FABPosition.TopStart -> Alignment.TopStart
    }

    Box(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        contentAlignment = alignment
    ) {
        if (extended && label != null) {
            ExtendedFloatingActionButton(
                onClick = onClick,
                containerColor = color,
                contentColor = Color.White
            ) {
                Icon(icon, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(label, fontWeight = FontWeight.Medium)
            }
        } else {
            FloatingActionButton(
                onClick = onClick,
                containerColor = color,
                contentColor = Color.White,
                modifier = Modifier.size(buttonSize)
            ) {
                Icon(icon, contentDescription = null)
            }
        }
    }
}

enum class FABPosition { BottomEnd, BottomStart, BottomCenter, TopEnd, TopStart }
enum class FABSize { Small, Default, Large }
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react', 'lucide-react'],
      code: `// Same as web implementation`
    }
  }
}
