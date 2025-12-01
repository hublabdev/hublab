/**
 * Badge Capsule - Multi-Platform
 *
 * Small status indicator for notifications, counts, and labels.
 */

import { CapsuleDefinition } from './types'

export const BadgeCapsule: CapsuleDefinition = {
  id: 'badge',
  name: 'Badge',
  description: 'Status indicator for notifications and counts',
  category: 'ui',
  tags: ['badge', 'notification', 'count', 'label', 'tag'],
  version: '1.0.0',

  props: [
    {
      name: 'content',
      type: 'string',
      required: false,
      description: 'Badge text or number'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'default',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'outline'],
      description: 'Badge color variant'
    },
    {
      name: 'size',
      type: 'select',
      required: false,
      default: 'md',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size'
    },
    {
      name: 'dot',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show as dot only (no content)'
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      default: 99,
      description: 'Max number before showing "99+"'
    },
    {
      name: 'pulse',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Add pulse animation'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React from 'react'

interface BadgeProps {
  content?: string | number
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  max?: number
  pulse?: boolean
  children?: React.ReactNode
}

export function Badge({
  content,
  variant = 'default',
  size = 'md',
  dot = false,
  max = 99,
  pulse = false,
  children
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-700'
  }

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5 min-w-[16px] h-4',
    md: 'text-xs px-2 py-0.5 min-w-[20px] h-5',
    lg: 'text-sm px-2.5 py-1 min-w-[24px] h-6'
  }

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  }

  const formatContent = () => {
    if (dot) return null
    if (typeof content === 'number' && content > max) {
      return \`\${max}+\`
    }
    return content
  }

  // Standalone badge
  if (!children) {
    if (dot) {
      return (
        <span className={\\`
          inline-block rounded-full
          \\${dotSizes[size]}
          \\${variants[variant]}
          \\${pulse ? 'animate-pulse' : ''}
        \\`} />
      )
    }

    return (
      <span className={\\`
        inline-flex items-center justify-center
        font-medium rounded-full
        \\${sizes[size]}
        \\${variants[variant]}
        \\${pulse ? 'animate-pulse' : ''}
      \\`}>
        {formatContent()}
      </span>
    )
  }

  // Badge with children (positioned in corner)
  return (
    <div className="relative inline-flex">
      {children}

      {dot ? (
        <span className={\\`
          absolute -top-0.5 -right-0.5
          rounded-full
          \\${dotSizes[size]}
          \\${variants[variant]}
          \\${pulse ? 'animate-pulse' : ''}
        \\`} />
      ) : content !== undefined && (
        <span className={\\`
          absolute -top-1 -right-1
          inline-flex items-center justify-center
          font-medium rounded-full
          \\${sizes[size]}
          \\${variants[variant]}
          \\${pulse ? 'animate-pulse' : ''}
        \\`}>
          {formatContent()}
        </span>
      )}
    </div>
  )
}

// Tag variant (horizontal label)
interface TagProps {
  label: string
  variant?: BadgeProps['variant']
  size?: BadgeProps['size']
  onRemove?: () => void
}

export function Tag({ label, variant = 'default', size = 'md', onRemove }: TagProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    outline: 'bg-transparent border border-gray-300 text-gray-700'
  }

  return (
    <span className={\\`
      inline-flex items-center gap-1
      rounded-full font-medium
      \\${sizes[size]}
      \\${variants[variant]}
    \\`}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
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

enum BadgeVariant {
    case \`default\`, primary, secondary, success, warning, error, outline

    var backgroundColor: Color {
        switch self {
        case .default: return Color(.systemGray5)
        case .primary: return .blue
        case .secondary: return .gray
        case .success: return .green
        case .warning: return .yellow
        case .error: return .red
        case .outline: return .clear
        }
    }

    var foregroundColor: Color {
        switch self {
        case .default: return .primary
        case .outline: return .primary
        default: return .white
        }
    }
}

enum BadgeSize {
    case sm, md, lg

    var fontSize: CGFloat {
        switch self {
        case .sm: return 10
        case .md: return 12
        case .lg: return 14
        }
    }

    var padding: EdgeInsets {
        switch self {
        case .sm: return EdgeInsets(top: 2, leading: 6, bottom: 2, trailing: 6)
        case .md: return EdgeInsets(top: 3, leading: 8, bottom: 3, trailing: 8)
        case .lg: return EdgeInsets(top: 4, leading: 10, bottom: 4, trailing: 10)
        }
    }

    var dotSize: CGFloat {
        switch self {
        case .sm: return 8
        case .md: return 10
        case .lg: return 12
        }
    }
}

struct HubLabBadge<Content: View>: View {
    var content: String? = nil
    var variant: BadgeVariant = .default
    var size: BadgeSize = .md
    var dot: Bool = false
    var max: Int = 99
    var pulse: Bool = false
    @ViewBuilder var wrappedContent: () -> Content

    init(
        content: String? = nil,
        variant: BadgeVariant = .default,
        size: BadgeSize = .md,
        dot: Bool = false,
        max: Int = 99,
        pulse: Bool = false,
        @ViewBuilder wrappedContent: @escaping () -> Content = { EmptyView() }
    ) {
        self.content = content
        self.variant = variant
        self.size = size
        self.dot = dot
        self.max = max
        self.pulse = pulse
        self.wrappedContent = wrappedContent
    }

    private var displayContent: String {
        guard let content = content else { return "" }
        if let number = Int(content), number > max {
            return "\\(max)+"
        }
        return content
    }

    var body: some View {
        if Content.self == EmptyView.self {
            standaloneBadge
        } else {
            ZStack(alignment: .topTrailing) {
                wrappedContent()

                if dot {
                    dotBadge
                        .offset(x: 4, y: -4)
                } else if content != nil {
                    standaloneBadge
                        .offset(x: 8, y: -8)
                }
            }
        }
    }

    private var standaloneBadge: some View {
        Text(displayContent)
            .font(.system(size: size.fontSize, weight: .medium))
            .foregroundColor(variant.foregroundColor)
            .padding(size.padding)
            .background(variant.backgroundColor)
            .clipShape(Capsule())
            .overlay(
                variant == .outline
                    ? Capsule().stroke(Color.gray.opacity(0.3), lineWidth: 1)
                    : nil
            )
            .modifier(PulseModifier(isActive: pulse))
    }

    private var dotBadge: some View {
        Circle()
            .fill(variant.backgroundColor)
            .frame(width: size.dotSize, height: size.dotSize)
            .modifier(PulseModifier(isActive: pulse))
    }
}

struct PulseModifier: ViewModifier {
    let isActive: Bool
    @State private var isPulsing = false

    func body(content: Content) -> some View {
        content
            .scaleEffect(isActive && isPulsing ? 1.1 : 1.0)
            .opacity(isActive && isPulsing ? 0.8 : 1.0)
            .animation(
                isActive
                    ? Animation.easeInOut(duration: 0.8).repeatForever(autoreverses: true)
                    : .default,
                value: isPulsing
            )
            .onAppear {
                if isActive {
                    isPulsing = true
                }
            }
    }
}

// MARK: - Tag
struct HubLabTag: View {
    let label: String
    var variant: BadgeVariant = .default
    var size: BadgeSize = .md
    var onRemove: (() -> Void)? = nil

    private var backgroundColor: Color {
        switch variant {
        case .default: return Color(.systemGray5)
        case .primary: return .blue.opacity(0.15)
        case .secondary: return Color(.systemGray5)
        case .success: return .green.opacity(0.15)
        case .warning: return .yellow.opacity(0.15)
        case .error: return .red.opacity(0.15)
        case .outline: return .clear
        }
    }

    private var textColor: Color {
        switch variant {
        case .primary: return .blue
        case .success: return .green
        case .warning: return .orange
        case .error: return .red
        default: return .primary
        }
    }

    var body: some View {
        HStack(spacing: 4) {
            Text(label)
                .font(.system(size: size.fontSize, weight: .medium))
                .foregroundColor(textColor)

            if let onRemove = onRemove {
                Button(action: onRemove) {
                    Image(systemName: "xmark")
                        .font(.system(size: size.fontSize - 2, weight: .semibold))
                        .foregroundColor(textColor.opacity(0.7))
                }
            }
        }
        .padding(size.padding)
        .background(backgroundColor)
        .clipShape(Capsule())
        .overlay(
            variant == .outline
                ? Capsule().stroke(Color.gray.opacity(0.3), lineWidth: 1)
                : nil
        )
    }
}

// MARK: - Preview
#Preview("Badges") {
    VStack(spacing: 20) {
        HStack(spacing: 8) {
            HubLabBadge(content: "New", variant: .primary)
            HubLabBadge(content: "5", variant: .error)
            HubLabBadge(content: "99+", variant: .success)
            HubLabBadge(dot: true, variant: .error, pulse: true)
        }

        HStack(spacing: 8) {
            HubLabTag(label: "Swift", variant: .primary)
            HubLabTag(label: "iOS", variant: .success)
            HubLabTag(label: "Remove", variant: .error, onRemove: {})
        }

        // Badge on icon
        HubLabBadge(content: "3", variant: .error) {
            Image(systemName: "bell.fill")
                .font(.title)
        }
    }
    .padding()
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: ['androidx.compose.material3:material3'],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class BadgeVariant(val bg: Color, val fg: Color) {
    Default(Color(0xFFF3F4F6), Color(0xFF374151)),
    Primary(Color(0xFF3B82F6), Color.White),
    Secondary(Color(0xFF6B7280), Color.White),
    Success(Color(0xFF22C55E), Color.White),
    Warning(Color(0xFFF59E0B), Color.White),
    Error(Color(0xFFEF4444), Color.White),
    Outline(Color.Transparent, Color(0xFF374151))
}

enum class BadgeSize(val fontSize: Int, val paddingH: Int, val paddingV: Int, val dotSize: Int) {
    Sm(10, 6, 2, 8),
    Md(12, 8, 3, 10),
    Lg(14, 10, 4, 12)
}

@Composable
fun HubLabBadge(
    content: String? = null,
    variant: BadgeVariant = BadgeVariant.Default,
    size: BadgeSize = BadgeSize.Md,
    dot: Boolean = false,
    max: Int = 99,
    pulse: Boolean = false,
    modifier: Modifier = Modifier,
    wrapped: @Composable (() -> Unit)? = null
) {
    val displayContent = content?.let {
        val number = it.toIntOrNull()
        if (number != null && number > max) "$max+" else it
    }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (pulse) 1.1f else 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(800),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    if (wrapped != null) {
        Box(modifier = modifier) {
            wrapped()

            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = 8.dp, y = (-8).dp)
                    .scale(if (pulse) scale else 1f)
            ) {
                if (dot) {
                    DotBadge(variant, size)
                } else if (displayContent != null) {
                    ContentBadge(displayContent, variant, size)
                }
            }
        }
    } else {
        Box(modifier = modifier.scale(if (pulse) scale else 1f)) {
            if (dot) {
                DotBadge(variant, size)
            } else if (displayContent != null) {
                ContentBadge(displayContent, variant, size)
            }
        }
    }
}

@Composable
private fun DotBadge(variant: BadgeVariant, size: BadgeSize) {
    Box(
        modifier = Modifier
            .size(size.dotSize.dp)
            .clip(CircleShape)
            .background(variant.bg)
    )
}

@Composable
private fun ContentBadge(content: String, variant: BadgeVariant, size: BadgeSize) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .background(variant.bg)
            .then(
                if (variant == BadgeVariant.Outline)
                    Modifier.border(1.dp, Color(0xFFD1D5DB), RoundedCornerShape(50))
                else Modifier
            )
            .padding(horizontal = size.paddingH.dp, vertical = size.paddingV.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = content,
            color = variant.fg,
            fontSize = size.fontSize.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
fun HubLabTag(
    label: String,
    variant: BadgeVariant = BadgeVariant.Default,
    size: BadgeSize = BadgeSize.Md,
    onRemove: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val bgColor = when (variant) {
        BadgeVariant.Primary -> Color(0xFF3B82F6).copy(alpha = 0.15f)
        BadgeVariant.Success -> Color(0xFF22C55E).copy(alpha = 0.15f)
        BadgeVariant.Warning -> Color(0xFFF59E0B).copy(alpha = 0.15f)
        BadgeVariant.Error -> Color(0xFFEF4444).copy(alpha = 0.15f)
        else -> Color(0xFFF3F4F6)
    }

    val textColor = when (variant) {
        BadgeVariant.Primary -> Color(0xFF3B82F6)
        BadgeVariant.Success -> Color(0xFF22C55E)
        BadgeVariant.Warning -> Color(0xFFF59E0B)
        BadgeVariant.Error -> Color(0xFFEF4444)
        else -> Color(0xFF374151)
    }

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(50))
            .background(bgColor)
            .padding(horizontal = size.paddingH.dp, vertical = size.paddingV.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(
            text = label,
            color = textColor,
            fontSize = size.fontSize.sp,
            fontWeight = FontWeight.Medium
        )

        if (onRemove != null) {
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Remove",
                modifier = Modifier
                    .size((size.fontSize + 2).dp)
                    .clickable { onRemove() },
                tint = textColor.copy(alpha = 0.7f)
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabBadgePreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                HubLabBadge(content = "New", variant = BadgeVariant.Primary)
                HubLabBadge(content = "5", variant = BadgeVariant.Error)
                HubLabBadge(content = "100", variant = BadgeVariant.Success, max = 99)
                HubLabBadge(dot = true, variant = BadgeVariant.Error, pulse = true)
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                HubLabTag(label = "Kotlin", variant = BadgeVariant.Primary)
                HubLabTag(label = "Android", variant = BadgeVariant.Success)
                HubLabTag(label = "Remove", variant = BadgeVariant.Error, onRemove = {})
            }

            // Badge on icon
            HubLabBadge(content = "3", variant = BadgeVariant.Error) {
                Icon(
                    imageVector = Icons.Default.Notifications,
                    contentDescription = null,
                    modifier = Modifier.size(32.dp)
                )
            }
        }
    }
}
`
    }
  },

  children: true,
  preview: '/previews/badge.png'
}
