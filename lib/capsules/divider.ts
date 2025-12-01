/**
 * Divider Capsule
 *
 * Visual separator for content sections.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const DividerCapsule: CapsuleDefinition = {
  id: 'divider',
  name: 'Divider',
  description: 'Visual separator for content sections',
  category: 'layout',
  tags: ['divider', 'separator', 'line', 'hr', 'section'],

  props: {
    orientation: {
      type: 'string',
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation'
    },
    variant: {
      type: 'string',
      default: 'solid',
      options: ['solid', 'dashed', 'dotted', 'gradient'],
      description: 'Visual style of the divider'
    },
    thickness: {
      type: 'number',
      default: 1,
      description: 'Thickness in pixels'
    },
    color: {
      type: 'string',
      default: 'gray',
      description: 'Divider color'
    },
    spacing: {
      type: 'string',
      default: 'md',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Margin around the divider'
    },
    label: {
      type: 'string',
      description: 'Optional text label in the middle'
    },
    labelPosition: {
      type: 'string',
      default: 'center',
      options: ['start', 'center', 'end'],
      description: 'Position of the label'
    },
    inset: {
      type: 'string',
      default: 'none',
      options: ['none', 'start', 'end', 'both'],
      description: 'Inset from edges'
    }
  },

  platforms: {
    web: {
      dependencies: ['react'],
      code: `
import React from 'react'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient'
  thickness?: number
  color?: string
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  labelPosition?: 'start' | 'center' | 'end'
  inset?: 'none' | 'start' | 'end' | 'both'
  className?: string
}

const spacingMap = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem'
}

const insetMap = {
  none: '0',
  start: '2rem',
  end: '2rem',
  both: '2rem'
}

const colorMap: Record<string, string> = {
  gray: '#e5e7eb',
  light: '#f3f4f6',
  dark: '#374151',
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444'
}

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 1,
  color = 'gray',
  spacing = 'md',
  label,
  labelPosition = 'center',
  inset = 'none',
  className = ''
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal'
  const resolvedColor = colorMap[color] || color
  const spacingValue = spacingMap[spacing]

  const getInsetStyles = () => {
    if (inset === 'none') return {}
    if (isHorizontal) {
      return {
        marginLeft: inset === 'start' || inset === 'both' ? insetMap[inset] : 0,
        marginRight: inset === 'end' || inset === 'both' ? insetMap[inset] : 0
      }
    }
    return {
      marginTop: inset === 'start' || inset === 'both' ? insetMap[inset] : 0,
      marginBottom: inset === 'end' || inset === 'both' ? insetMap[inset] : 0
    }
  }

  const getBorderStyle = () => {
    switch (variant) {
      case 'dashed':
        return 'dashed'
      case 'dotted':
        return 'dotted'
      default:
        return 'solid'
    }
  }

  const getGradientBackground = () => {
    if (variant !== 'gradient') return undefined
    if (isHorizontal) {
      return \`linear-gradient(to right, transparent, \${resolvedColor}, transparent)\`
    }
    return \`linear-gradient(to bottom, transparent, \${resolvedColor}, transparent)\`
  }

  // With label
  if (label) {
    const flexJustify = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end'
    }

    return (
      <div
        className={\`flex items-center gap-4 \${className}\`}
        style={{
          flexDirection: isHorizontal ? 'row' : 'column',
          margin: isHorizontal ? \`\${spacingValue} 0\` : \`0 \${spacingValue}\`,
          justifyContent: flexJustify[labelPosition],
          ...getInsetStyles()
        }}
        role="separator"
        aria-orientation={orientation}
      >
        {labelPosition !== 'start' && (
          <div
            style={{
              flex: labelPosition === 'center' ? 1 : undefined,
              [isHorizontal ? 'height' : 'width']: thickness,
              [isHorizontal ? 'width' : 'height']: labelPosition === 'end' ? 'auto' : undefined,
              minWidth: isHorizontal ? 20 : undefined,
              minHeight: !isHorizontal ? 20 : undefined,
              background: getGradientBackground() || resolvedColor,
              borderStyle: variant !== 'gradient' ? getBorderStyle() : undefined,
              borderWidth: variant !== 'gradient' ? 0 : undefined,
              borderTopWidth: variant !== 'gradient' && isHorizontal ? thickness : undefined,
              borderLeftWidth: variant !== 'gradient' && !isHorizontal ? thickness : undefined,
              borderColor: resolvedColor
            }}
          />
        )}

        <span className="px-3 text-sm text-gray-500 whitespace-nowrap bg-white">
          {label}
        </span>

        {labelPosition !== 'end' && (
          <div
            style={{
              flex: labelPosition === 'center' ? 1 : undefined,
              [isHorizontal ? 'height' : 'width']: thickness,
              [isHorizontal ? 'width' : 'height']: labelPosition === 'start' ? 'auto' : undefined,
              minWidth: isHorizontal ? 20 : undefined,
              minHeight: !isHorizontal ? 20 : undefined,
              background: getGradientBackground() || resolvedColor,
              borderStyle: variant !== 'gradient' ? getBorderStyle() : undefined,
              borderWidth: variant !== 'gradient' ? 0 : undefined,
              borderTopWidth: variant !== 'gradient' && isHorizontal ? thickness : undefined,
              borderLeftWidth: variant !== 'gradient' && !isHorizontal ? thickness : undefined,
              borderColor: resolvedColor
            }}
          />
        )}
      </div>
    )
  }

  // Without label
  return (
    <div
      className={className}
      style={{
        [isHorizontal ? 'height' : 'width']: variant === 'gradient' ? thickness : 0,
        [isHorizontal ? 'width' : 'height']: '100%',
        margin: isHorizontal ? \`\${spacingValue} 0\` : \`0 \${spacingValue}\`,
        background: getGradientBackground(),
        borderStyle: variant !== 'gradient' ? getBorderStyle() : undefined,
        borderWidth: 0,
        borderTopWidth: variant !== 'gradient' && isHorizontal ? thickness : undefined,
        borderLeftWidth: variant !== 'gradient' && !isHorizontal ? thickness : undefined,
        borderColor: resolvedColor,
        ...getInsetStyles()
      }}
      role="separator"
      aria-orientation={orientation}
    />
  )
}

// Text Divider (with label shorthand)
export function TextDivider({
  children,
  position = 'center',
  ...props
}: Omit<DividerProps, 'label' | 'labelPosition'> & {
  children: React.ReactNode
  position?: 'start' | 'center' | 'end'
}) {
  return (
    <Divider
      {...props}
      label={children as string}
      labelPosition={position}
    />
  )
}

// Section Divider
export function SectionDivider({
  title,
  subtitle,
  action,
  ...props
}: DividerProps & {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <Divider {...props} spacing="none" />
    </div>
  )
}

// Decorative Divider
export function DecorativeDivider({
  icon,
  variant = 'dots'
}: {
  icon?: React.ReactNode
  variant?: 'dots' | 'stars' | 'wave' | 'custom'
}) {
  const getDecoration = () => {
    switch (variant) {
      case 'dots':
        return '• • •'
      case 'stars':
        return '✦ ✦ ✦'
      case 'wave':
        return '〰〰〰'
      default:
        return icon
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
      <span className="text-gray-400 text-sm tracking-widest">
        {getDecoration()}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
    </div>
  )
}

// List Divider (for use in lists)
export function ListDivider({
  inset = 'none'
}: {
  inset?: 'none' | 'start' | 'end' | 'both'
}) {
  return (
    <Divider
      spacing="none"
      color="light"
      inset={inset}
    />
  )
}

// Vertical Divider
export function VerticalDivider({
  height = 24,
  ...props
}: Omit<DividerProps, 'orientation'> & {
  height?: number | string
}) {
  return (
    <div style={{ height }}>
      <Divider
        {...props}
        orientation="vertical"
        spacing="none"
      />
    </div>
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Divider View
struct DividerView: View {
    var orientation: DividerOrientation = .horizontal
    var variant: DividerVariant = .solid
    var thickness: CGFloat = 1
    var color: Color = Color(.systemGray5)
    var spacing: DividerSpacing = .medium
    var label: String?
    var labelPosition: DividerLabelPosition = .center
    var inset: DividerInset = .none

    enum DividerOrientation {
        case horizontal
        case vertical
    }

    enum DividerVariant {
        case solid
        case dashed
        case dotted
        case gradient
    }

    enum DividerSpacing {
        case none, extraSmall, small, medium, large, extraLarge

        var value: CGFloat {
            switch self {
            case .none: return 0
            case .extraSmall: return 4
            case .small: return 8
            case .medium: return 16
            case .large: return 24
            case .extraLarge: return 32
            }
        }
    }

    enum DividerLabelPosition {
        case start, center, end
    }

    enum DividerInset {
        case none, start, end, both

        var leading: CGFloat {
            switch self {
            case .start, .both: return 32
            default: return 0
            }
        }

        var trailing: CGFloat {
            switch self {
            case .end, .both: return 32
            default: return 0
            }
        }
    }

    var body: some View {
        Group {
            if let label = label {
                labeledDivider(label: label)
            } else {
                simpleDivider
            }
        }
        .padding(orientation == .horizontal ?
            .vertical : .horizontal,
            spacing.value
        )
    }

    private var simpleDivider: some View {
        Group {
            if orientation == .horizontal {
                horizontalLine
                    .padding(.leading, inset.leading)
                    .padding(.trailing, inset.trailing)
            } else {
                verticalLine
                    .padding(.top, inset.leading)
                    .padding(.bottom, inset.trailing)
            }
        }
    }

    @ViewBuilder
    private var horizontalLine: some View {
        switch variant {
        case .gradient:
            LinearGradient(
                gradient: Gradient(colors: [.clear, color, .clear]),
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(height: thickness)

        case .dashed:
            DashedLine(orientation: .horizontal)
                .stroke(color, style: StrokeStyle(lineWidth: thickness, dash: [6, 4]))
                .frame(height: thickness)

        case .dotted:
            DashedLine(orientation: .horizontal)
                .stroke(color, style: StrokeStyle(lineWidth: thickness, lineCap: .round, dash: [2, 4]))
                .frame(height: thickness)

        default:
            Rectangle()
                .fill(color)
                .frame(height: thickness)
        }
    }

    @ViewBuilder
    private var verticalLine: some View {
        switch variant {
        case .gradient:
            LinearGradient(
                gradient: Gradient(colors: [.clear, color, .clear]),
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(width: thickness)

        case .dashed:
            DashedLine(orientation: .vertical)
                .stroke(color, style: StrokeStyle(lineWidth: thickness, dash: [6, 4]))
                .frame(width: thickness)

        case .dotted:
            DashedLine(orientation: .vertical)
                .stroke(color, style: StrokeStyle(lineWidth: thickness, lineCap: .round, dash: [2, 4]))
                .frame(width: thickness)

        default:
            Rectangle()
                .fill(color)
                .frame(width: thickness)
        }
    }

    private func labeledDivider(label: String) -> some View {
        HStack(spacing: 16) {
            if labelPosition != .start {
                horizontalLine
            }

            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(1)

            if labelPosition != .end {
                horizontalLine
            }
        }
        .padding(.leading, inset.leading)
        .padding(.trailing, inset.trailing)
    }
}

// MARK: - Dashed Line Shape
struct DashedLine: Shape {
    var orientation: DividerView.DividerOrientation

    func path(in rect: CGRect) -> Path {
        var path = Path()
        if orientation == .horizontal {
            path.move(to: CGPoint(x: 0, y: rect.midY))
            path.addLine(to: CGPoint(x: rect.width, y: rect.midY))
        } else {
            path.move(to: CGPoint(x: rect.midX, y: 0))
            path.addLine(to: CGPoint(x: rect.midX, y: rect.height))
        }
        return path
    }
}

// MARK: - Text Divider
struct TextDivider: View {
    let text: String
    var position: DividerView.DividerLabelPosition = .center
    var color: Color = Color(.systemGray5)

    var body: some View {
        DividerView(
            color: color,
            label: text,
            labelPosition: position
        )
    }
}

// MARK: - Section Divider
struct SectionDivider<Action: View>: View {
    let title: String
    var subtitle: String?
    var action: (() -> Action)?

    init(
        title: String,
        subtitle: String? = nil,
        @ViewBuilder action: @escaping () -> Action
    ) {
        self.title = title
        self.subtitle = subtitle
        self.action = action
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.semibold)

                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                if let action = action {
                    action()
                }
            }

            DividerView(spacing: .none)
        }
        .padding(.vertical, 8)
    }
}

extension SectionDivider where Action == EmptyView {
    init(title: String, subtitle: String? = nil) {
        self.title = title
        self.subtitle = subtitle
        self.action = nil
    }
}

// MARK: - Decorative Divider
struct DecorativeDivider: View {
    var variant: DecorativeVariant = .dots

    enum DecorativeVariant {
        case dots
        case stars
        case wave

        var text: String {
            switch self {
            case .dots: return "• • •"
            case .stars: return "✦ ✦ ✦"
            case .wave: return "〰〰〰"
            }
        }
    }

    var body: some View {
        HStack(spacing: 16) {
            LinearGradient(
                gradient: Gradient(colors: [.clear, Color(.systemGray4)]),
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(height: 1)

            Text(variant.text)
                .font(.caption)
                .foregroundColor(.secondary)
                .tracking(4)

            LinearGradient(
                gradient: Gradient(colors: [Color(.systemGray4), .clear]),
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(height: 1)
        }
        .padding(.vertical, 16)
    }
}

// MARK: - List Divider
struct ListDivider: View {
    var inset: DividerView.DividerInset = .none

    var body: some View {
        DividerView(
            color: Color(.systemGray6),
            spacing: .none,
            inset: inset
        )
    }
}

// MARK: - Vertical Divider
struct VerticalDivider: View {
    var height: CGFloat = 24
    var color: Color = Color(.systemGray5)
    var thickness: CGFloat = 1

    var body: some View {
        DividerView(
            orientation: .vertical,
            thickness: thickness,
            color: color,
            spacing: .none
        )
        .frame(height: height)
    }
}

// MARK: - Preview
struct DividerView_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Basic Dividers
                Group {
                    DividerView()
                    DividerView(variant: .dashed)
                    DividerView(variant: .dotted)
                    DividerView(variant: .gradient)
                }

                // Text Divider
                TextDivider(text: "OR")

                // Section Divider
                SectionDivider(title: "Recent Items", subtitle: "Last 7 days")

                // Decorative Dividers
                DecorativeDivider(variant: .dots)
                DecorativeDivider(variant: .stars)

                // Vertical Divider
                HStack {
                    Text("Left")
                    VerticalDivider()
                    Text("Right")
                }
            }
            .padding()
        }
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3', 'androidx.compose.ui'],
      code: `
package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Divider Orientation
enum class DividerOrientation {
    Horizontal, Vertical
}

// Divider Variant
enum class DividerVariant {
    Solid, Dashed, Dotted, Gradient
}

// Divider Spacing
enum class DividerSpacing(val value: Dp) {
    None(0.dp),
    ExtraSmall(4.dp),
    Small(8.dp),
    Medium(16.dp),
    Large(24.dp),
    ExtraLarge(32.dp)
}

// Label Position
enum class DividerLabelPosition {
    Start, Center, End
}

// Inset
enum class DividerInset(val leading: Dp, val trailing: Dp) {
    None(0.dp, 0.dp),
    Start(32.dp, 0.dp),
    End(0.dp, 32.dp),
    Both(32.dp, 32.dp)
}

// Main Divider Component
@Composable
fun DividerView(
    modifier: Modifier = Modifier,
    orientation: DividerOrientation = DividerOrientation.Horizontal,
    variant: DividerVariant = DividerVariant.Solid,
    thickness: Dp = 1.dp,
    color: Color = MaterialTheme.colorScheme.outlineVariant,
    spacing: DividerSpacing = DividerSpacing.Medium,
    label: String? = null,
    labelPosition: DividerLabelPosition = DividerLabelPosition.Center,
    inset: DividerInset = DividerInset.None
) {
    val paddingModifier = if (orientation == DividerOrientation.Horizontal) {
        Modifier.padding(vertical = spacing.value)
    } else {
        Modifier.padding(horizontal = spacing.value)
    }

    Box(modifier = modifier.then(paddingModifier)) {
        if (label != null) {
            LabeledDivider(
                label = label,
                labelPosition = labelPosition,
                variant = variant,
                thickness = thickness,
                color = color,
                inset = inset
            )
        } else {
            SimpleDivider(
                orientation = orientation,
                variant = variant,
                thickness = thickness,
                color = color,
                inset = inset
            )
        }
    }
}

@Composable
private fun SimpleDivider(
    orientation: DividerOrientation,
    variant: DividerVariant,
    thickness: Dp,
    color: Color,
    inset: DividerInset
) {
    val insetModifier = if (orientation == DividerOrientation.Horizontal) {
        Modifier.padding(start = inset.leading, end = inset.trailing)
    } else {
        Modifier.padding(top = inset.leading, bottom = inset.trailing)
    }

    when (variant) {
        DividerVariant.Gradient -> {
            Box(
                modifier = Modifier
                    .then(insetModifier)
                    .then(
                        if (orientation == DividerOrientation.Horizontal) {
                            Modifier
                                .fillMaxWidth()
                                .height(thickness)
                                .background(
                                    Brush.horizontalGradient(
                                        colors = listOf(Color.Transparent, color, Color.Transparent)
                                    )
                                )
                        } else {
                            Modifier
                                .fillMaxHeight()
                                .width(thickness)
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(Color.Transparent, color, Color.Transparent)
                                    )
                                )
                        }
                    )
            )
        }

        DividerVariant.Dashed, DividerVariant.Dotted -> {
            val pathEffect = if (variant == DividerVariant.Dashed) {
                PathEffect.dashPathEffect(floatArrayOf(12f, 8f))
            } else {
                PathEffect.dashPathEffect(floatArrayOf(4f, 8f))
            }

            Box(
                modifier = Modifier
                    .then(insetModifier)
                    .then(
                        if (orientation == DividerOrientation.Horizontal) {
                            Modifier
                                .fillMaxWidth()
                                .height(thickness)
                        } else {
                            Modifier
                                .fillMaxHeight()
                                .width(thickness)
                        }
                    )
                    .drawBehind {
                        if (orientation == DividerOrientation.Horizontal) {
                            drawLine(
                                color = color,
                                start = Offset(0f, size.height / 2),
                                end = Offset(size.width, size.height / 2),
                                strokeWidth = thickness.toPx(),
                                pathEffect = pathEffect
                            )
                        } else {
                            drawLine(
                                color = color,
                                start = Offset(size.width / 2, 0f),
                                end = Offset(size.width / 2, size.height),
                                strokeWidth = thickness.toPx(),
                                pathEffect = pathEffect
                            )
                        }
                    }
            )
        }

        else -> {
            if (orientation == DividerOrientation.Horizontal) {
                HorizontalDivider(
                    modifier = Modifier
                        .then(insetModifier)
                        .fillMaxWidth(),
                    thickness = thickness,
                    color = color
                )
            } else {
                VerticalDivider(
                    modifier = Modifier
                        .then(insetModifier)
                        .fillMaxHeight(),
                    thickness = thickness,
                    color = color
                )
            }
        }
    }
}

@Composable
private fun LabeledDivider(
    label: String,
    labelPosition: DividerLabelPosition,
    variant: DividerVariant,
    thickness: Dp,
    color: Color,
    inset: DividerInset
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = inset.leading, end = inset.trailing),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        if (labelPosition != DividerLabelPosition.Start) {
            Box(modifier = Modifier.weight(1f)) {
                SimpleDivider(
                    orientation = DividerOrientation.Horizontal,
                    variant = variant,
                    thickness = thickness,
                    color = color,
                    inset = DividerInset.None
                )
            }
        }

        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        if (labelPosition != DividerLabelPosition.End) {
            Box(modifier = Modifier.weight(1f)) {
                SimpleDivider(
                    orientation = DividerOrientation.Horizontal,
                    variant = variant,
                    thickness = thickness,
                    color = color,
                    inset = DividerInset.None
                )
            }
        }
    }
}

// Text Divider
@Composable
fun TextDivider(
    text: String,
    modifier: Modifier = Modifier,
    position: DividerLabelPosition = DividerLabelPosition.Center,
    color: Color = MaterialTheme.colorScheme.outlineVariant
) {
    DividerView(
        modifier = modifier,
        color = color,
        label = text,
        labelPosition = position
    )
}

// Section Divider
@Composable
fun SectionDivider(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    action: @Composable (() -> Unit)? = null
) {
    Column(
        modifier = modifier.padding(vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold
                )

                if (subtitle != null) {
                    Text(
                        text = subtitle,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            action?.invoke()
        }

        DividerView(spacing = DividerSpacing.None)
    }
}

// Decorative Divider
@Composable
fun DecorativeDivider(
    modifier: Modifier = Modifier,
    variant: DecorativeVariant = DecorativeVariant.Dots
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Box(
            modifier = Modifier
                .weight(1f)
                .height(1.dp)
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            Color.Transparent,
                            MaterialTheme.colorScheme.outlineVariant
                        )
                    )
                )
        )

        Text(
            text = variant.text,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            letterSpacing = 4.sp
        )

        Box(
            modifier = Modifier
                .weight(1f)
                .height(1.dp)
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.outlineVariant,
                            Color.Transparent
                        )
                    )
                )
        )
    }
}

enum class DecorativeVariant(val text: String) {
    Dots("• • •"),
    Stars("✦ ✦ ✦"),
    Wave("〰〰〰")
}

// List Divider
@Composable
fun ListDivider(
    modifier: Modifier = Modifier,
    inset: DividerInset = DividerInset.None
) {
    DividerView(
        modifier = modifier,
        color = MaterialTheme.colorScheme.surfaceVariant,
        spacing = DividerSpacing.None,
        inset = inset
    )
}

// Vertical Divider View
@Composable
fun VerticalDividerView(
    modifier: Modifier = Modifier,
    height: Dp = 24.dp,
    color: Color = MaterialTheme.colorScheme.outlineVariant,
    thickness: Dp = 1.dp
) {
    DividerView(
        modifier = modifier.height(height),
        orientation = DividerOrientation.Vertical,
        thickness = thickness,
        color = color,
        spacing = DividerSpacing.None
    )
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
