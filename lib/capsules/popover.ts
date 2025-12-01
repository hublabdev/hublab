/**
 * Popover Capsule
 *
 * Floating content panel anchored to trigger element.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const PopoverCapsule: CapsuleDefinition = {
  id: 'popover',
  name: 'Popover',
  description: 'Floating content panel anchored to trigger element',
  category: 'overlay',
  tags: ['popover', 'dropdown', 'menu', 'floating', 'tooltip'],

  props: {
    isOpen: {
      type: 'boolean',
      default: false,
      description: 'Whether popover is open'
    },
    placement: {
      type: 'string',
      default: 'bottom',
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
      description: 'Popover placement relative to trigger'
    },
    offset: {
      type: 'number',
      default: 8,
      description: 'Distance from trigger in pixels'
    },
    showArrow: {
      type: 'boolean',
      default: true,
      description: 'Show arrow pointing to trigger'
    },
    closeOnClickOutside: {
      type: 'boolean',
      default: true,
      description: 'Close when clicking outside'
    },
    closeOnEsc: {
      type: 'boolean',
      default: true,
      description: 'Close on Escape key'
    },
    trigger: {
      type: 'string',
      default: 'click',
      options: ['click', 'hover', 'focus'],
      description: 'How to trigger the popover'
    },
    onOpen: {
      type: 'function',
      description: 'Callback when popover opens'
    },
    onClose: {
      type: 'function',
      description: 'Callback when popover closes'
    }
  },

  platforms: {
    web: {
      dependencies: ['react'],
      code: `
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext
} from 'react'

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'

interface PopoverProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: Placement
  offset?: number
  showArrow?: boolean
  closeOnClickOutside?: boolean
  closeOnEsc?: boolean
  trigger?: 'click' | 'hover' | 'focus'
  children: React.ReactNode
  className?: string
}

interface PopoverContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLDivElement>
  placement: Placement
  offset: number
  showArrow: boolean
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

export function Popover({
  isOpen: controlledIsOpen,
  onOpenChange,
  placement = 'bottom',
  offset = 8,
  showArrow = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  trigger = 'click',
  children,
  className = ''
}: PopoverProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const isOpen = controlledIsOpen ?? uncontrolledIsOpen
  const setIsOpen = useCallback((open: boolean) => {
    setUncontrolledIsOpen(open)
    onOpenChange?.(open)
  }, [onOpenChange])

  // Click outside handler
  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickOutside, isOpen, setIsOpen])

  // Escape key handler
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [closeOnEsc, isOpen, setIsOpen])

  const contextValue = useMemo(() => ({
    isOpen,
    setIsOpen,
    triggerRef,
    contentRef,
    placement,
    offset,
    showArrow
  }), [isOpen, setIsOpen, placement, offset, showArrow])

  return (
    <PopoverContext.Provider value={contextValue}>
      <div className={\`relative inline-block \${className}\`}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

// Popover Trigger
interface PopoverTriggerProps {
  children: React.ReactElement
  asChild?: boolean
}

export function PopoverTrigger({ children, asChild = false }: PopoverTriggerProps) {
  const context = useContext(PopoverContext)
  if (!context) throw new Error('PopoverTrigger must be used within Popover')

  const { isOpen, setIsOpen, triggerRef } = context

  const handleClick = () => setIsOpen(!isOpen)

  if (asChild) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      'aria-expanded': isOpen,
      'aria-haspopup': true
    })
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup={true}
    >
      {children}
    </button>
  )
}

// Popover Content
interface PopoverContentProps {
  children: React.ReactNode
  className?: string
}

export function PopoverContent({ children, className = '' }: PopoverContentProps) {
  const context = useContext(PopoverContext)
  if (!context) throw new Error('PopoverContent must be used within Popover')

  const { isOpen, contentRef, triggerRef, placement, offset, showArrow } = context
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const content = contentRef.current.getBoundingClientRect()
    const arrow = 8 // arrow size

    let top = 0
    let left = 0
    let arrowTop = 0
    let arrowLeft = 0

    switch (placement) {
      case 'top':
        top = trigger.top - content.height - offset - (showArrow ? arrow : 0)
        left = trigger.left + trigger.width / 2 - content.width / 2
        arrowTop = content.height
        arrowLeft = content.width / 2 - arrow
        break
      case 'top-start':
        top = trigger.top - content.height - offset - (showArrow ? arrow : 0)
        left = trigger.left
        arrowTop = content.height
        arrowLeft = Math.min(trigger.width / 2, content.width - 20)
        break
      case 'top-end':
        top = trigger.top - content.height - offset - (showArrow ? arrow : 0)
        left = trigger.right - content.width
        arrowTop = content.height
        arrowLeft = content.width - Math.min(trigger.width / 2, content.width - 20)
        break
      case 'bottom':
        top = trigger.bottom + offset + (showArrow ? arrow : 0)
        left = trigger.left + trigger.width / 2 - content.width / 2
        arrowTop = -arrow
        arrowLeft = content.width / 2 - arrow
        break
      case 'bottom-start':
        top = trigger.bottom + offset + (showArrow ? arrow : 0)
        left = trigger.left
        arrowTop = -arrow
        arrowLeft = Math.min(trigger.width / 2, content.width - 20)
        break
      case 'bottom-end':
        top = trigger.bottom + offset + (showArrow ? arrow : 0)
        left = trigger.right - content.width
        arrowTop = -arrow
        arrowLeft = content.width - Math.min(trigger.width / 2, content.width - 20)
        break
      case 'left':
        top = trigger.top + trigger.height / 2 - content.height / 2
        left = trigger.left - content.width - offset - (showArrow ? arrow : 0)
        arrowTop = content.height / 2 - arrow
        arrowLeft = content.width
        break
      case 'right':
        top = trigger.top + trigger.height / 2 - content.height / 2
        left = trigger.right + offset + (showArrow ? arrow : 0)
        arrowTop = content.height / 2 - arrow
        arrowLeft = -arrow
        break
    }

    // Keep within viewport
    const padding = 8
    left = Math.max(padding, Math.min(left, window.innerWidth - content.width - padding))
    top = Math.max(padding, Math.min(top, window.innerHeight - content.height - padding))

    setPosition({ top, left })
    setArrowPosition({ top: arrowTop, left: arrowLeft })
  }, [isOpen, placement, offset, showArrow, triggerRef, contentRef])

  if (!isOpen) return null

  return (
    <div
      ref={contentRef}
      className={\`
        fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200
        animate-in fade-in-0 zoom-in-95
        \${className}
      \`}
      style={{
        top: position.top,
        left: position.left
      }}
      role="dialog"
    >
      {showArrow && (
        <div
          className="absolute w-3 h-3 bg-white border-gray-200 rotate-45"
          style={{
            top: arrowPosition.top,
            left: arrowPosition.left,
            borderWidth: placement.startsWith('top') ? '0 1px 1px 0' :
                        placement.startsWith('bottom') ? '1px 0 0 1px' :
                        placement === 'left' ? '0 1px 1px 0' : '1px 0 0 1px'
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Dropdown Menu
interface DropdownMenuProps {
  trigger: React.ReactNode
  items: {
    label: string
    onClick?: () => void
    icon?: React.ReactNode
    disabled?: boolean
    variant?: 'default' | 'destructive'
    divider?: boolean
  }[]
  placement?: Placement
  className?: string
}

export function DropdownMenu({
  trigger,
  items,
  placement = 'bottom-start',
  className = ''
}: DropdownMenuProps) {
  return (
    <Popover placement={placement}>
      <PopoverTrigger asChild>
        {trigger as React.ReactElement}
      </PopoverTrigger>
      <PopoverContent className={\`min-w-[180px] py-1 \${className}\`}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.divider && <div className="h-px bg-gray-200 my-1" />}
            {!item.divider && (
              <button
                onClick={item.onClick}
                disabled={item.disabled}
                className={\`
                  w-full flex items-center gap-3 px-3 py-2 text-sm text-left
                  transition-colors
                  \${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                  \${item.variant === 'destructive' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
                \`}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </PopoverContent>
    </Popover>
  )
}

// Context Menu
interface ContextMenuProps {
  children: React.ReactNode
  items: DropdownMenuProps['items']
  className?: string
}

export function ContextMenu({ children, items, className = '' }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isOpen])

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px]"
          style={{ top: position.y, left: position.x }}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && <div className="h-px bg-gray-200 my-1" />}
              {!item.divider && (
                <button
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  className={\`
                    w-full flex items-center gap-3 px-3 py-2 text-sm text-left
                    transition-colors
                    \${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                    \${item.variant === 'destructive' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
                  \`}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}

// Hover Card
interface HoverCardProps {
  trigger: React.ReactNode
  content: React.ReactNode
  placement?: Placement
  openDelay?: number
  closeDelay?: number
  className?: string
}

export function HoverCard({
  trigger,
  content,
  placement = 'bottom',
  openDelay = 200,
  closeDelay = 300,
  className = ''
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const openTimeoutRef = useRef<NodeJS.Timeout>()
  const closeTimeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    clearTimeout(closeTimeoutRef.current)
    openTimeoutRef.current = setTimeout(() => setIsOpen(true), openDelay)
  }

  const handleMouseLeave = () => {
    clearTimeout(openTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), closeDelay)
  }

  return (
    <Popover isOpen={isOpen} placement={placement}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PopoverTrigger asChild>
          {trigger as React.ReactElement}
        </PopoverTrigger>
      </div>
      <PopoverContent className={\`p-4 max-w-xs \${className}\`}>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// User Card (for hover)
export function UserHoverCard({
  user,
  children
}: {
  user: {
    name: string
    avatar?: string
    email?: string
    role?: string
    bio?: string
  }
  children: React.ReactNode
}) {
  return (
    <HoverCard
      trigger={children}
      content={
        <div className="flex gap-4">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{user.name}</h4>
            {user.role && (
              <p className="text-sm text-gray-500">{user.role}</p>
            )}
            {user.email && (
              <p className="text-sm text-blue-600 mt-1">{user.email}</p>
            )}
            {user.bio && (
              <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
            )}
          </div>
        </div>
      }
    />
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Popover View
struct PopoverView<Trigger: View, Content: View>: View {
    @Binding var isPresented: Bool
    var placement: PopoverPlacement = .bottom
    var offset: CGFloat = 8
    var showArrow: Bool = true
    @ViewBuilder var trigger: () -> Trigger
    @ViewBuilder var content: () -> Content

    enum PopoverPlacement {
        case top, bottom, leading, trailing
        case topLeading, topTrailing, bottomLeading, bottomTrailing
    }

    var body: some View {
        trigger()
            .onTapGesture {
                withAnimation(.spring(response: 0.3)) {
                    isPresented.toggle()
                }
            }
            .popover(isPresented: $isPresented, arrowEdge: arrowEdge) {
                content()
                    .presentationCompactAdaptation(.popover)
            }
    }

    private var arrowEdge: Edge {
        switch placement {
        case .top, .topLeading, .topTrailing:
            return .bottom
        case .bottom, .bottomLeading, .bottomTrailing:
            return .top
        case .leading:
            return .trailing
        case .trailing:
            return .leading
        }
    }
}

// MARK: - Dropdown Menu
struct DropdownMenu<Label: View>: View {
    var items: [MenuItem]
    var placement: PopoverView<Label, MenuContent>.PopoverPlacement = .bottomLeading
    @ViewBuilder var label: () -> Label

    @State private var isPresented = false

    struct MenuItem: Identifiable {
        let id = UUID()
        let label: String
        var icon: String?
        var action: () -> Void = {}
        var isDisabled: Bool = false
        var isDestructive: Bool = false
        var isDivider: Bool = false

        static func divider() -> MenuItem {
            MenuItem(label: "", isDivider: true)
        }
    }

    var body: some View {
        Menu {
            ForEach(items) { item in
                if item.isDivider {
                    Divider()
                } else {
                    Button(role: item.isDestructive ? .destructive : nil) {
                        item.action()
                    } label: {
                        Label {
                            Text(item.label)
                        } icon: {
                            if let icon = item.icon {
                                Image(systemName: icon)
                            }
                        }
                    }
                    .disabled(item.isDisabled)
                }
            }
        } label: {
            label()
        }
    }
}

struct MenuContent: View {
    var body: some View {
        EmptyView()
    }
}

// MARK: - Context Menu
struct ContextMenuView<Content: View>: View {
    var items: [DropdownMenu<Content>.MenuItem]
    @ViewBuilder var content: () -> Content

    var body: some View {
        content()
            .contextMenu {
                ForEach(items) { item in
                    if item.isDivider {
                        Divider()
                    } else {
                        Button(role: item.isDestructive ? .destructive : nil) {
                            item.action()
                        } label: {
                            Label {
                                Text(item.label)
                            } icon: {
                                if let icon = item.icon {
                                    Image(systemName: icon)
                                }
                            }
                        }
                        .disabled(item.isDisabled)
                    }
                }
            }
    }
}

// MARK: - Hover Card (macOS/iPad with pointer)
struct HoverCard<Trigger: View, Content: View>: View {
    @ViewBuilder var trigger: () -> Trigger
    @ViewBuilder var content: () -> Content

    @State private var isHovered = false

    var body: some View {
        trigger()
            .onHover { hovering in
                withAnimation(.easeInOut(duration: 0.2)) {
                    isHovered = hovering
                }
            }
            .popover(isPresented: $isHovered) {
                content()
                    .padding()
                    .presentationCompactAdaptation(.popover)
            }
    }
}

// MARK: - User Hover Card
struct UserHoverCard<Trigger: View>: View {
    let user: UserInfo
    @ViewBuilder var trigger: () -> Trigger

    struct UserInfo {
        let name: String
        var avatar: String?
        var email: String?
        var role: String?
        var bio: String?
    }

    var body: some View {
        HoverCard {
            trigger()
        } content: {
            HStack(alignment: .top, spacing: 12) {
                if let avatar = user.avatar {
                    AsyncImage(url: URL(string: avatar)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Circle()
                            .fill(Color.gray.opacity(0.3))
                    }
                    .frame(width: 48, height: 48)
                    .clipShape(Circle())
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(user.name)
                        .font(.headline)

                    if let role = user.role {
                        Text(role)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }

                    if let email = user.email {
                        Text(email)
                            .font(.subheadline)
                            .foregroundColor(.blue)
                    }

                    if let bio = user.bio {
                        Text(bio)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .padding(.top, 4)
                    }
                }
            }
            .frame(maxWidth: 280)
        }
    }
}

// MARK: - Tooltip
struct TooltipView<Content: View>: View {
    let text: String
    @ViewBuilder var content: () -> Content

    @State private var isShowing = false

    var body: some View {
        content()
            .onHover { hovering in
                withAnimation {
                    isShowing = hovering
                }
            }
            .overlay(alignment: .top) {
                if isShowing {
                    Text(text)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(.systemGray))
                        .foregroundColor(.white)
                        .cornerRadius(4)
                        .offset(y: -30)
                        .transition(.opacity.combined(with: .scale))
                }
            }
    }
}

// MARK: - Confirmation Popover
struct ConfirmationPopover: View {
    @Binding var isPresented: Bool
    let title: String
    var message: String?
    var confirmLabel: String = "Confirm"
    var cancelLabel: String = "Cancel"
    var isDestructive: Bool = false
    var onConfirm: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            VStack(spacing: 8) {
                Text(title)
                    .font(.headline)

                if let message = message {
                    Text(message)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
            }

            HStack(spacing: 12) {
                Button(cancelLabel) {
                    isPresented = false
                }
                .buttonStyle(.bordered)

                Button(confirmLabel) {
                    onConfirm()
                    isPresented = false
                }
                .buttonStyle(.borderedProminent)
                .tint(isDestructive ? .red : .blue)
            }
        }
        .padding()
        .frame(width: 260)
    }
}

// MARK: - Preview
struct PopoverView_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 40) {
            // Dropdown Menu
            DropdownMenu(
                items: [
                    .init(label: "Edit", icon: "pencil"),
                    .init(label: "Duplicate", icon: "doc.on.doc"),
                    .divider(),
                    .init(label: "Delete", icon: "trash", isDestructive: true)
                ]
            ) {
                Button("Actions") {
                    // Handled by menu
                }
            }

            // Context Menu
            ContextMenuView(
                items: [
                    .init(label: "Copy", icon: "doc.on.doc"),
                    .init(label: "Paste", icon: "doc.on.clipboard")
                ]
            ) {
                Text("Right-click me")
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
            }
        }
        .padding()
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3'],
      code: `
package com.hublab.capsules

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import coil.compose.AsyncImage

// Popover Placement
enum class PopoverPlacement {
    Top, Bottom, Start, End,
    TopStart, TopEnd, BottomStart, BottomEnd
}

// Popover Component
@Composable
fun PopoverView(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    placement: PopoverPlacement = PopoverPlacement.Bottom,
    offset: DpOffset = DpOffset(0.dp, 8.dp),
    showArrow: Boolean = true,
    trigger: @Composable () -> Unit,
    content: @Composable () -> Unit
) {
    var triggerPosition by remember { mutableStateOf(IntOffset.Zero) }
    var triggerSize by remember { mutableStateOf(androidx.compose.ui.unit.IntSize.Zero) }

    Box(modifier = modifier) {
        Box(
            modifier = Modifier.onGloballyPositioned { coordinates ->
                triggerPosition = IntOffset(
                    coordinates.positionInRoot().x.toInt(),
                    coordinates.positionInRoot().y.toInt()
                )
                triggerSize = coordinates.size
            }
        ) {
            trigger()
        }

        if (isOpen) {
            Popup(
                alignment = getPopupAlignment(placement),
                offset = IntOffset(
                    offset.x.value.toInt(),
                    offset.y.value.toInt()
                ),
                onDismissRequest = onDismiss,
                properties = PopupProperties(focusable = true)
            ) {
                AnimatedVisibility(
                    visible = isOpen,
                    enter = fadeIn() + scaleIn(initialScale = 0.95f),
                    exit = fadeOut() + scaleOut(targetScale = 0.95f)
                ) {
                    Card(
                        modifier = Modifier.shadow(8.dp, RoundedCornerShape(12.dp)),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        )
                    ) {
                        content()
                    }
                }
            }
        }
    }
}

private fun getPopupAlignment(placement: PopoverPlacement): Alignment {
    return when (placement) {
        PopoverPlacement.Top -> Alignment.TopCenter
        PopoverPlacement.Bottom -> Alignment.BottomCenter
        PopoverPlacement.Start -> Alignment.CenterStart
        PopoverPlacement.End -> Alignment.CenterEnd
        PopoverPlacement.TopStart -> Alignment.TopStart
        PopoverPlacement.TopEnd -> Alignment.TopEnd
        PopoverPlacement.BottomStart -> Alignment.BottomStart
        PopoverPlacement.BottomEnd -> Alignment.BottomEnd
    }
}

// Dropdown Menu
@Composable
fun DropdownMenuView(
    items: List<MenuItem>,
    modifier: Modifier = Modifier,
    placement: PopoverPlacement = PopoverPlacement.BottomStart,
    trigger: @Composable (onClick: () -> Unit) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Box(modifier = modifier) {
        trigger { expanded = true }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            items.forEach { item ->
                if (item.isDivider) {
                    HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp))
                } else {
                    DropdownMenuItem(
                        text = {
                            Text(
                                item.label,
                                color = if (item.isDestructive) {
                                    MaterialTheme.colorScheme.error
                                } else {
                                    MaterialTheme.colorScheme.onSurface
                                }
                            )
                        },
                        onClick = {
                            item.action()
                            expanded = false
                        },
                        leadingIcon = item.icon?.let { icon ->
                            {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = null,
                                    tint = if (item.isDestructive) {
                                        MaterialTheme.colorScheme.error
                                    } else {
                                        MaterialTheme.colorScheme.onSurfaceVariant
                                    }
                                )
                            }
                        },
                        enabled = !item.isDisabled
                    )
                }
            }
        }
    }
}

data class MenuItem(
    val label: String,
    val icon: ImageVector? = null,
    val action: () -> Unit = {},
    val isDisabled: Boolean = false,
    val isDestructive: Boolean = false,
    val isDivider: Boolean = false
) {
    companion object {
        fun divider() = MenuItem(label = "", isDivider = true)
    }
}

// Context Menu (Long Press)
@Composable
fun ContextMenuView(
    items: List<MenuItem>,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    var pressOffset by remember { mutableStateOf(DpOffset.Zero) }
    val density = LocalDensity.current

    Box(
        modifier = modifier
            .pointerInput(Unit) {
                detectTapGestures(
                    onLongPress = { offset ->
                        pressOffset = with(density) {
                            DpOffset(offset.x.toDp(), offset.y.toDp())
                        }
                        expanded = true
                    }
                )
            }
    ) {
        content()

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            offset = pressOffset
        ) {
            items.forEach { item ->
                if (item.isDivider) {
                    HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp))
                } else {
                    DropdownMenuItem(
                        text = {
                            Text(
                                item.label,
                                color = if (item.isDestructive) {
                                    MaterialTheme.colorScheme.error
                                } else {
                                    MaterialTheme.colorScheme.onSurface
                                }
                            )
                        },
                        onClick = {
                            item.action()
                            expanded = false
                        },
                        leadingIcon = item.icon?.let { icon ->
                            {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = null,
                                    tint = if (item.isDestructive) {
                                        MaterialTheme.colorScheme.error
                                    } else {
                                        MaterialTheme.colorScheme.onSurfaceVariant
                                    }
                                )
                            }
                        },
                        enabled = !item.isDisabled
                    )
                }
            }
        }
    }
}

// Tooltip
@Composable
fun TooltipView(
    text: String,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    var isVisible by remember { mutableStateOf(false) }

    Box(
        modifier = modifier
            .pointerInput(Unit) {
                detectTapGestures(
                    onLongPress = { isVisible = true },
                    onPress = {
                        tryAwaitRelease()
                        isVisible = false
                    }
                )
            }
    ) {
        content()

        if (isVisible) {
            Popup(
                alignment = Alignment.TopCenter,
                offset = IntOffset(0, -48)
            ) {
                Text(
                    text = text,
                    modifier = Modifier
                        .background(
                            MaterialTheme.colorScheme.inverseSurface,
                            RoundedCornerShape(4.dp)
                        )
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    color = MaterialTheme.colorScheme.inverseOnSurface,
                    style = MaterialTheme.typography.labelSmall
                )
            }
        }
    }
}

// User Hover Card
@Composable
fun UserHoverCard(
    user: UserInfo,
    modifier: Modifier = Modifier,
    trigger: @Composable () -> Unit
) {
    var isOpen by remember { mutableStateOf(false) }

    PopoverView(
        isOpen = isOpen,
        onDismiss = { isOpen = false },
        modifier = modifier,
        trigger = {
            Box(modifier = Modifier.clickable { isOpen = !isOpen }) {
                trigger()
            }
        }
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .widthIn(max = 280.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            if (user.avatar != null) {
                AsyncImage(
                    model = user.avatar,
                    contentDescription = user.name,
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(24.dp)),
                    contentScale = ContentScale.Crop
                )
            }

            Column {
                Text(
                    text = user.name,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold
                )

                user.role?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                user.email?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }

                user.bio?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
            }
        }
    }
}

data class UserInfo(
    val name: String,
    val avatar: String? = null,
    val email: String? = null,
    val role: String? = null,
    val bio: String? = null
)

// Confirmation Popover
@Composable
fun ConfirmationPopover(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    title: String,
    message: String? = null,
    confirmLabel: String = "Confirm",
    cancelLabel: String = "Cancel",
    isDestructive: Boolean = false,
    onConfirm: () -> Unit,
    trigger: @Composable () -> Unit
) {
    PopoverView(
        isOpen = isOpen,
        onDismiss = onDismiss,
        trigger = trigger
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .width(260.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )

                message?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(onClick = onDismiss) {
                    Text(cancelLabel)
                }

                Button(
                    onClick = {
                        onConfirm()
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isDestructive) {
                            MaterialTheme.colorScheme.error
                        } else {
                            MaterialTheme.colorScheme.primary
                        }
                    )
                ) {
                    Text(confirmLabel)
                }
            }
        }
    }
}
`
    },

    desktop: {
      dependencies: ['@tauri-apps/api'],
      code: `
// Desktop uses the same React components with native positioning
// See web implementation above
export * from './web'
`
    }
  }
}
