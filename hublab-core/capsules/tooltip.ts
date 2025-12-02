/**
 * Tooltip Capsule - Multi-Platform Contextual Information
 *
 * Hover/tap tooltips for contextual information
 */

import { CapsuleDefinition } from './types'

export const TooltipCapsule: CapsuleDefinition = {
  id: 'tooltip',
  name: 'Tooltip',
  description: 'Hover/tap tooltips for contextual information',
  category: 'feedback',
  tags: ['tooltip', 'popover', 'hint', 'help', 'info'],
  version: '1.0.0',
  children: true,

  props: [
    {
      name: 'content',
      type: 'string',
      required: true,
      description: 'Tooltip content text'
    },
    {
      name: 'position',
      type: 'select',
      required: false,
      default: 'top',
      description: 'Tooltip position',
      options: ['top', 'bottom', 'left', 'right']
    },
    {
      name: 'trigger',
      type: 'select',
      required: false,
      default: 'hover',
      description: 'How to trigger the tooltip',
      options: ['hover', 'click', 'focus']
    },
    {
      name: 'delay',
      type: 'number',
      required: false,
      default: 200,
      description: 'Delay before showing (ms)'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'dark',
      description: 'Visual style',
      options: ['dark', 'light', 'primary']
    },
    {
      name: 'arrow',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show arrow pointer'
    },
    {
      name: 'maxWidth',
      type: 'number',
      required: false,
      default: 200,
      description: 'Maximum width in pixels'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  delay?: number
  variant?: 'dark' | 'light' | 'primary'
  arrow?: boolean
  maxWidth?: number
  className?: string
  disabled?: boolean
}

export function Tooltip({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  variant = 'dark',
  arrow = true,
  maxWidth = 200,
  className = '',
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const gap = 8

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - gap
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'bottom':
        top = triggerRect.bottom + scrollY + gap
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.left + scrollX - tooltipRect.width - gap
        break
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.right + scrollX + gap
        break
    }

    // Keep tooltip within viewport
    const padding = 10
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding + scrollY))

    setCoords({ top, left })
  }, [position])

  const show = useCallback(() => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }, [delay, disabled])

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (isVisible) {
      calculatePosition()
      window.addEventListener('scroll', calculatePosition, true)
      window.addEventListener('resize', calculatePosition)
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition, true)
      window.removeEventListener('resize', calculatePosition)
    }
  }, [isVisible, calculatePosition])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const variantStyles = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
    primary: 'bg-blue-600 text-white'
  }

  const arrowStyles = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-current border-x-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-current border-x-transparent border-t-transparent',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-current border-y-transparent border-r-transparent',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-current border-y-transparent border-l-transparent'
  }

  const triggerProps = {
    ...(trigger === 'hover' && {
      onMouseEnter: show,
      onMouseLeave: hide
    }),
    ...(trigger === 'click' && {
      onClick: () => (isVisible ? hide() : show())
    }),
    ...(trigger === 'focus' && {
      onFocus: show,
      onBlur: hide
    })
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        {...triggerProps}
      >
        {children}
      </div>

      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className={\`
            fixed z-50 px-3 py-2 text-sm rounded-lg
            transition-opacity duration-200
            \${variantStyles[variant]}
            \${className}
          \`}
          style={{
            top: coords.top,
            left: coords.left,
            maxWidth
          }}
        >
          {content}
          {arrow && (
            <div
              className={\`
                absolute w-0 h-0 border-4
                \${arrowStyles[position]}
              \`}
              style={{
                borderColor: variant === 'dark' ? '#1f2937' : variant === 'primary' ? '#2563eb' : '#fff'
              }}
            />
          )}
        </div>,
        document.body
      )}
    </>
  )
}

// Info Tooltip (with icon)
interface InfoTooltipProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function InfoTooltip({
  content,
  position = 'top',
  className = ''
}: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <button
        type="button"
        className={\`
          inline-flex items-center justify-center
          w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700
          text-gray-500 dark:text-gray-400 text-xs
          hover:bg-gray-300 dark:hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500
          \${className}
        \`}
      >
        ?
      </button>
    </Tooltip>
  )
}

// Popover (more complex tooltip with title and actions)
interface PopoverProps {
  title?: string
  content: React.ReactNode
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  className?: string
}

export function Popover({
  title,
  content,
  children,
  position = 'bottom',
  trigger = 'click',
  className = ''
}: PopoverProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const popoverRect = popoverRef.current.getBoundingClientRect()
      const gap = 8

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top - popoverRect.height - gap
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom + gap
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
          left = triggerRect.left - popoverRect.width - gap
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
          left = triggerRect.right + gap
          break
      }

      setCoords({ top, left })
    }
  }, [isVisible, position])

  useEffect(() => {
    if (isVisible && trigger === 'click') {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsVisible(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, trigger])

  const triggerProps = {
    ...(trigger === 'hover' && {
      onMouseEnter: () => setIsVisible(true),
      onMouseLeave: () => setIsVisible(false)
    }),
    ...(trigger === 'click' && {
      onClick: () => setIsVisible(!isVisible)
    })
  }

  return (
    <>
      <div ref={triggerRef} className="inline-block" {...triggerProps}>
        {children}
      </div>

      {isVisible && createPortal(
        <div
          ref={popoverRef}
          className={\`
            fixed z-50 w-64 bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            \${className}
          \`}
          style={{
            top: coords.top,
            left: coords.left
          }}
        >
          {title && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
          )}
          <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
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

// MARK: - Tooltip Position
enum TooltipPosition {
    case top, bottom, leading, trailing

    var alignment: Alignment {
        switch self {
        case .top: return .top
        case .bottom: return .bottom
        case .leading: return .leading
        case .trailing: return .trailing
        }
    }

    var offset: (x: CGFloat, y: CGFloat) {
        switch self {
        case .top: return (0, -8)
        case .bottom: return (0, 8)
        case .leading: return (-8, 0)
        case .trailing: return (8, 0)
        }
    }
}

// MARK: - Tooltip Variant
enum TooltipVariant {
    case dark, light, primary

    var backgroundColor: Color {
        switch self {
        case .dark: return Color(.systemGray6).opacity(0.95)
        case .light: return Color.white
        case .primary: return Color.blue
        }
    }

    var textColor: Color {
        switch self {
        case .dark: return .primary
        case .light: return .primary
        case .primary: return .white
        }
    }
}

// MARK: - Tooltip View Modifier
struct TooltipModifier: ViewModifier {
    let content: String
    var position: TooltipPosition = .top
    var variant: TooltipVariant = .dark
    var showArrow: Bool = true

    @State private var isShowing = false
    @State private var contentSize: CGSize = .zero

    func body(content: Content) -> some View {
        content
            .overlay(
                GeometryReader { geo in
                    Color.clear
                        .preference(key: SizePreferenceKey.self, value: geo.size)
                }
            )
            .onPreferenceChange(SizePreferenceKey.self) { size in
                contentSize = size
            }
            .overlay(
                tooltipView
                    .opacity(isShowing ? 1 : 0)
                    .animation(.easeInOut(duration: 0.2), value: isShowing)
                ,
                alignment: position.alignment
            )
            .onLongPressGesture(minimumDuration: 0.5, maximumDistance: 10) {
                withAnimation {
                    isShowing = true
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    withAnimation {
                        isShowing = false
                    }
                }
            }
    }

    @ViewBuilder
    private var tooltipView: some View {
        VStack(spacing: 0) {
            if position == .bottom && showArrow {
                Triangle()
                    .fill(variant.backgroundColor)
                    .frame(width: 12, height: 6)
                    .rotationEffect(.degrees(180))
            }

            Text(self.content)
                .font(.caption)
                .foregroundColor(variant.textColor)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(variant.backgroundColor)
                .cornerRadius(8)
                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)

            if position == .top && showArrow {
                Triangle()
                    .fill(variant.backgroundColor)
                    .frame(width: 12, height: 6)
            }
        }
        .offset(x: position.offset.x, y: position.offset.y)
    }
}

// MARK: - Triangle Shape
struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.closeSubpath()
        return path
    }
}

// MARK: - Size Preference Key
struct SizePreferenceKey: PreferenceKey {
    static var defaultValue: CGSize = .zero
    static func reduce(value: inout CGSize, nextValue: () -> CGSize) {
        value = nextValue()
    }
}

// MARK: - View Extension
extension View {
    func tooltip(
        _ content: String,
        position: TooltipPosition = .top,
        variant: TooltipVariant = .dark,
        showArrow: Bool = true
    ) -> some View {
        self.modifier(TooltipModifier(
            content: content,
            position: position,
            variant: variant,
            showArrow: showArrow
        ))
    }
}

// MARK: - Standalone Tooltip View
struct TooltipView: View {
    let content: String
    var position: TooltipPosition = .top
    var variant: TooltipVariant = .dark
    var showArrow: Bool = true

    @Binding var isShowing: Bool

    var body: some View {
        VStack(spacing: 0) {
            if position == .bottom && showArrow {
                Triangle()
                    .fill(variant.backgroundColor)
                    .frame(width: 12, height: 6)
                    .rotationEffect(.degrees(180))
            }

            Text(content)
                .font(.caption)
                .foregroundColor(variant.textColor)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(variant.backgroundColor)
                .cornerRadius(8)
                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)

            if position == .top && showArrow {
                Triangle()
                    .fill(variant.backgroundColor)
                    .frame(width: 12, height: 6)
            }
        }
        .opacity(isShowing ? 1 : 0)
        .animation(.easeInOut(duration: 0.2), value: isShowing)
    }
}

// MARK: - Info Tooltip Button
struct InfoTooltipButton: View {
    let content: String
    var position: TooltipPosition = .top

    @State private var isShowing = false

    var body: some View {
        Button {
            withAnimation {
                isShowing.toggle()
            }
            if isShowing {
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    withAnimation {
                        isShowing = false
                    }
                }
            }
        } label: {
            Image(systemName: "questionmark.circle")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .overlay(
            TooltipView(
                content: content,
                position: position,
                isShowing: $isShowing
            )
            .offset(y: position == .top ? -40 : 40),
            alignment: position == .top ? .top : .bottom
        )
    }
}

// MARK: - Popover Style Tooltip
struct PopoverTooltip<Label: View, Content: View>: View {
    @ViewBuilder let label: () -> Label
    @ViewBuilder let content: () -> Content
    var title: String? = nil

    @State private var isPresented = false

    var body: some View {
        Button {
            isPresented = true
        } label: {
            label()
        }
        .popover(isPresented: $isPresented) {
            VStack(alignment: .leading, spacing: 0) {
                if let title = title {
                    Text(title)
                        .font(.headline)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(.systemGray6))
                }

                content()
                    .padding()
            }
            .frame(width: 280)
        }
    }
}

// MARK: - Preview
struct TooltipPreview: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 40) {
            Text("Tap and hold for tooltip")
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
                .tooltip("This is a helpful tooltip!", position: .top)

            Text("Different positions")
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(8)
                .tooltip("Bottom tooltip", position: .bottom, variant: .primary)

            HStack {
                Text("Need help?")
                InfoTooltipButton(content: "Click here for more information about this feature.")
            }

            PopoverTooltip(title: "Help") {
                Image(systemName: "questionmark.circle")
            } content: {
                Text("This is a detailed explanation of the feature. It can contain multiple lines and more complex content.")
            }
        }
        .padding()
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
        'androidx.compose.foundation.interaction.MutableInteractionSource',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.Info',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.draw.shadow',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.layout.onGloballyPositioned',
        'androidx.compose.ui.platform.LocalDensity',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.IntOffset',
        'androidx.compose.ui.unit.IntSize',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp',
        'androidx.compose.ui.window.Popup',
        'androidx.compose.ui.window.PopupProperties',
        'kotlinx.coroutines.delay'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import kotlinx.coroutines.delay

// Position enum
enum class TooltipPosition {
    TOP, BOTTOM, START, END
}

// Variant enum
enum class TooltipVariant(val backgroundColor: Color, val textColor: Color) {
    DARK(Color(0xFF1F2937), Color.White),
    LIGHT(Color.White, Color(0xFF1F2937)),
    PRIMARY(Color(0xFF3B82F6), Color.White)
}

@Composable
fun Tooltip(
    tooltip: String,
    modifier: Modifier = Modifier,
    position: TooltipPosition = TooltipPosition.TOP,
    variant: TooltipVariant = TooltipVariant.DARK,
    showArrow: Boolean = true,
    content: @Composable () -> Unit
) {
    var isVisible by remember { mutableStateOf(false) }
    var contentSize by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current

    Box(modifier = modifier) {
        Box(
            modifier = Modifier
                .onGloballyPositioned { contentSize = it.size }
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {
                    isVisible = !isVisible
                }
        ) {
            content()
        }

        if (isVisible) {
            Popup(
                alignment = when (position) {
                    TooltipPosition.TOP -> Alignment.TopCenter
                    TooltipPosition.BOTTOM -> Alignment.BottomCenter
                    TooltipPosition.START -> Alignment.CenterStart
                    TooltipPosition.END -> Alignment.CenterEnd
                },
                offset = with(density) {
                    when (position) {
                        TooltipPosition.TOP -> IntOffset(0, -contentSize.height - 8.dp.roundToPx())
                        TooltipPosition.BOTTOM -> IntOffset(0, contentSize.height + 8.dp.roundToPx())
                        TooltipPosition.START -> IntOffset(-8.dp.roundToPx(), 0)
                        TooltipPosition.END -> IntOffset(contentSize.width + 8.dp.roundToPx(), 0)
                    }
                },
                onDismissRequest = { isVisible = false },
                properties = PopupProperties(focusable = true)
            ) {
                TooltipContent(
                    text = tooltip,
                    variant = variant,
                    showArrow = showArrow,
                    arrowPosition = position
                )
            }

            // Auto-dismiss after 3 seconds
            LaunchedEffect(isVisible) {
                if (isVisible) {
                    delay(3000)
                    isVisible = false
                }
            }
        }
    }
}

@Composable
private fun TooltipContent(
    text: String,
    variant: TooltipVariant,
    showArrow: Boolean,
    arrowPosition: TooltipPosition
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (showArrow && arrowPosition == TooltipPosition.BOTTOM) {
            TooltipArrow(variant = variant, pointUp = true)
        }

        Box(
            modifier = Modifier
                .shadow(4.dp, RoundedCornerShape(8.dp))
                .clip(RoundedCornerShape(8.dp))
                .background(variant.backgroundColor)
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            Text(
                text = text,
                color = variant.textColor,
                fontSize = 12.sp,
                maxLines = 3
            )
        }

        if (showArrow && arrowPosition == TooltipPosition.TOP) {
            TooltipArrow(variant = variant, pointUp = false)
        }
    }
}

@Composable
private fun TooltipArrow(
    variant: TooltipVariant,
    pointUp: Boolean
) {
    Box(
        modifier = Modifier
            .size(12.dp, 6.dp)
            .background(
                color = variant.backgroundColor,
                shape = TriangleShape(pointUp)
            )
    )
}

// Triangle shape for arrow
private class TriangleShape(private val pointUp: Boolean) : androidx.compose.ui.graphics.Shape {
    override fun createOutline(
        size: androidx.compose.ui.geometry.Size,
        layoutDirection: androidx.compose.ui.unit.LayoutDirection,
        density: androidx.compose.ui.unit.Density
    ): androidx.compose.ui.graphics.Outline {
        val path = androidx.compose.ui.graphics.Path().apply {
            if (pointUp) {
                moveTo(size.width / 2f, 0f)
                lineTo(0f, size.height)
                lineTo(size.width, size.height)
            } else {
                moveTo(0f, 0f)
                lineTo(size.width, 0f)
                lineTo(size.width / 2f, size.height)
            }
            close()
        }
        return androidx.compose.ui.graphics.Outline.Generic(path)
    }
}

// Material 3 Rich Tooltip wrapper
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RichTooltipBox(
    title: String? = null,
    text: String,
    action: (@Composable () -> Unit)? = null,
    content: @Composable () -> Unit
) {
    var showTooltip by remember { mutableStateOf(false) }
    val tooltipState = rememberTooltipState()

    TooltipBox(
        positionProvider = TooltipDefaults.rememberRichTooltipPositionProvider(),
        tooltip = {
            RichTooltip(
                title = title?.let { { Text(it) } },
                action = action
            ) {
                Text(text)
            }
        },
        state = tooltipState
    ) {
        content()
    }
}

// Plain Tooltip wrapper
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlainTooltipBox(
    text: String,
    content: @Composable () -> Unit
) {
    val tooltipState = rememberTooltipState()

    TooltipBox(
        positionProvider = TooltipDefaults.rememberPlainTooltipPositionProvider(),
        tooltip = {
            PlainTooltip {
                Text(text)
            }
        },
        state = tooltipState
    ) {
        content()
    }
}

// Info tooltip button
@Composable
fun InfoTooltip(
    content: String,
    modifier: Modifier = Modifier
) {
    Tooltip(
        tooltip = content,
        modifier = modifier,
        position = TooltipPosition.TOP
    ) {
        Icon(
            imageVector = Icons.Default.Info,
            contentDescription = "Info",
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(20.dp)
        )
    }
}

// Popover component
@Composable
fun Popover(
    title: String? = null,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Popup(
        alignment = Alignment.TopCenter,
        onDismissRequest = onDismiss,
        properties = PopupProperties(focusable = true)
    ) {
        Card(
            modifier = modifier
                .width(280.dp)
                .shadow(8.dp, RoundedCornerShape(12.dp)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column {
                if (title != null) {
                    Text(
                        text = title,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 16.sp,
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .padding(16.dp)
                    )
                }
                Box(modifier = Modifier.padding(16.dp)) {
                    content()
                }
            }
        }
    }
}
`
    }
  }
}
