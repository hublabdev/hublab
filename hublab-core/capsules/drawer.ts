/**
 * Drawer/Sidebar Capsule - Multi-Platform
 * Slide-in drawer navigation panel
 */

import { CapsuleDefinition } from './types'

export const DrawerCapsule: CapsuleDefinition = {
  id: 'drawer',
  name: 'Drawer',
  description: 'Slide-in drawer for navigation or settings',
  category: 'navigation',
  tags: ['drawer', 'sidebar', 'navigation', 'menu'],
  version: '1.0.0',

  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      required: true,
      description: 'Whether drawer is open'
    },
    {
      name: 'onClose',
      type: 'action',
      required: true,
      description: 'Callback to close drawer'
    },
    {
      name: 'side',
      type: 'select',
      required: false,
      default: 'left',
      options: ['left', 'right'],
      description: 'Side from which drawer opens'
    },
    {
      name: 'width',
      type: 'string',
      required: false,
      default: '280px',
      description: 'Drawer width'
    },
    {
      name: 'overlay',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show backdrop overlay'
    },
    {
      name: 'children',
      type: 'node',
      required: true,
      description: 'Drawer content'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
  width?: string
  overlay?: boolean
  children: React.ReactNode
}

export function Drawer({
  isOpen,
  onClose,
  side = 'left',
  width = '280px',
  overlay = true,
  children
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className={\`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 \${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }\`}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={\`fixed top-0 bottom-0 z-50 bg-white shadow-xl transition-transform duration-300 ease-out \${
          side === 'left' ? 'left-0' : 'right-0'
        } \${
          isOpen
            ? 'translate-x-0'
            : side === 'left'
              ? '-translate-x-full'
              : 'translate-x-full'
        }\`}
        style={{ width }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="h-full overflow-y-auto pt-14 px-4 pb-4">
          {children}
        </div>
      </aside>
    </>
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

struct Drawer<Content: View>: View {
    @Binding var isOpen: Bool
    var side: DrawerSide = .left
    var width: CGFloat = 280
    var overlay: Bool = true
    let content: Content

    enum DrawerSide { case left, right }

    init(isOpen: Binding<Bool>, side: DrawerSide = .left, width: CGFloat = 280, overlay: Bool = true, @ViewBuilder content: () -> Content) {
        self._isOpen = isOpen
        self.side = side
        self.width = width
        self.overlay = overlay
        self.content = content()
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: side == .left ? .leading : .trailing) {
                // Overlay
                if overlay && isOpen {
                    Color.black.opacity(0.5)
                        .ignoresSafeArea()
                        .onTapGesture { isOpen = false }
                        .transition(.opacity)
                }

                // Drawer
                HStack(spacing: 0) {
                    if side == .right { Spacer() }

                    VStack(alignment: .leading, spacing: 0) {
                        // Close Button
                        HStack {
                            Spacer()
                            Button(action: { isOpen = false }) {
                                Image(systemName: "xmark")
                                    .font(.headline)
                                    .padding()
                            }
                        }

                        // Content
                        content
                            .padding(.horizontal)

                        Spacer()
                    }
                    .frame(width: width)
                    .background(Color(.systemBackground))
                    .shadow(radius: 10)

                    if side == .left { Spacer() }
                }
                .offset(x: isOpen ? 0 : (side == .left ? -width : width))
            }
            .animation(.easeOut(duration: 0.3), value: isOpen)
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
fun Drawer(
    isOpen: Boolean,
    onClose: () -> Unit,
    side: DrawerSide = DrawerSide.Left,
    width: Dp = 280.dp,
    overlay: Boolean = true,
    content: @Composable () -> Unit
) {
    val offsetX by animateDpAsState(
        targetValue = if (isOpen) 0.dp else if (side == DrawerSide.Left) -width else width,
        animationSpec = tween(300)
    )

    Box(modifier = Modifier.fillMaxSize()) {
        // Overlay
        if (overlay) {
            AnimatedVisibility(
                visible = isOpen,
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.5f))
                        .clickable { onClose() }
                )
            }
        }

        // Drawer
        Box(
            modifier = Modifier
                .width(width)
                .fillMaxHeight()
                .offset(x = offsetX)
                .align(if (side == DrawerSide.Left) Alignment.CenterStart else Alignment.CenterEnd)
                .background(MaterialTheme.colorScheme.surface)
                .shadow(8.dp)
        ) {
            Column {
                // Close Button
                Row(
                    modifier = Modifier.fillMaxWidth().padding(8.dp),
                    horizontalArrangement = Arrangement.End
                ) {
                    IconButton(onClick = onClose) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                // Content
                Box(modifier = Modifier.padding(16.dp)) {
                    content()
                }
            }
        }
    }
}

enum class DrawerSide { Left, Right }
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react', 'lucide-react'],
      code: `// Same as web implementation`
    }
  }
}
