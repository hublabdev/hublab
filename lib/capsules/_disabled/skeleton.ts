/**
 * Skeleton Capsule - Multi-Platform Loading Placeholder
 *
 * Placeholder content while data is loading with shimmer animation
 */

import { CapsuleDefinition } from './types'

export const SkeletonCapsule: CapsuleDefinition = {
  id: 'skeleton',
  name: 'Skeleton',
  description: 'Loading placeholder with shimmer animation',
  category: 'feedback',
  tags: ['skeleton', 'loading', 'placeholder', 'shimmer', 'loader'],
  version: '1.0.0',

  props: [
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'text',
      description: 'Type of skeleton to display',
      options: ['text', 'circular', 'rectangular', 'rounded']
    },
    {
      name: 'width',
      type: 'string',
      required: false,
      default: '100%',
      description: 'Width of the skeleton'
    },
    {
      name: 'height',
      type: 'string',
      required: false,
      default: '1rem',
      description: 'Height of the skeleton'
    },
    {
      name: 'animation',
      type: 'select',
      required: false,
      default: 'pulse',
      description: 'Animation type',
      options: ['pulse', 'wave', 'none']
    },
    {
      name: 'lines',
      type: 'number',
      required: false,
      default: 1,
      description: 'Number of text lines (for text variant)',
      min: 1,
      max: 10
    },
    {
      name: 'spacing',
      type: 'spacing',
      required: false,
      default: 'normal',
      description: 'Spacing between lines'
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React from 'react'

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
  lines?: number
  spacing?: 'compact' | 'normal' | 'relaxed'
  className?: string
}

export function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  animation = 'pulse',
  lines = 1,
  spacing = 'normal',
  className = ''
}: SkeletonProps) {
  const getWidth = () => {
    if (typeof width === 'number') return \`\${width}px\`
    return width
  }

  const getHeight = () => {
    if (height) {
      return typeof height === 'number' ? \`\${height}px\` : height
    }
    switch (variant) {
      case 'text': return '1rem'
      case 'circular': return getWidth()
      case 'rectangular': return '100px'
      case 'rounded': return '100px'
      default: return '1rem'
    }
  }

  const getSpacing = () => {
    switch (spacing) {
      case 'compact': return '0.25rem'
      case 'normal': return '0.5rem'
      case 'relaxed': return '0.75rem'
    }
  }

  const getBorderRadius = () => {
    switch (variant) {
      case 'text': return '0.25rem'
      case 'circular': return '50%'
      case 'rectangular': return '0'
      case 'rounded': return '0.5rem'
      default: return '0.25rem'
    }
  }

  const animationClass = animation === 'none' ? '' : \`animate-\${animation}\`

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={\`flex flex-col \${className}\`} style={{ gap: getSpacing() }}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={\`bg-gray-200 dark:bg-gray-700 \${animationClass}\`}
            style={{
              width: index === lines - 1 ? '75%' : getWidth(),
              height: getHeight(),
              borderRadius: getBorderRadius()
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={\`bg-gray-200 dark:bg-gray-700 \${animationClass} \${className}\`}
      style={{
        width: getWidth(),
        height: getHeight(),
        borderRadius: getBorderRadius()
      }}
    />
  )
}

// Preset components for common use cases
export function SkeletonText({ lines = 3, ...props }: Omit<SkeletonProps, 'variant'>) {
  return <Skeleton variant="text" lines={lines} {...props} />
}

export function SkeletonAvatar({ size = 40, ...props }: Omit<SkeletonProps, 'variant' | 'width' | 'height'> & { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} {...props} />
}

export function SkeletonImage({ width = 200, height = 150, ...props }: Omit<SkeletonProps, 'variant'>) {
  return <Skeleton variant="rounded" width={width} height={height} {...props} />
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={\`p-4 border rounded-lg \${className}\`}>
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar size={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height="1rem" className="mb-2" />
          <Skeleton variant="text" width="40%" height="0.75rem" />
        </div>
      </div>
      <SkeletonImage width="100%" height={200} className="mb-4" />
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonList({ items = 5, className = '' }: { items?: number, className?: string }) {
  return (
    <div className={\`flex flex-col gap-4 \${className}\`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <SkeletonAvatar size={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="70%" height="1rem" className="mb-1" />
            <Skeleton variant="text" width="50%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  )
}
`,
      styles: `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes wave {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-wave {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: wave 1.5s ease-in-out infinite;
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

// MARK: - Skeleton Shape Variant
enum SkeletonVariant {
    case text
    case circular
    case rectangular
    case rounded
}

// MARK: - Animation Type
enum SkeletonAnimation {
    case pulse
    case wave
    case none
}

// MARK: - Main Skeleton View
struct Skeleton: View {
    let variant: SkeletonVariant
    var width: CGFloat? = nil
    var height: CGFloat? = nil
    var animation: SkeletonAnimation = .pulse
    var lines: Int = 1
    var spacing: CGFloat = 8

    @State private var isAnimating = false

    var body: some View {
        if variant == .text && lines > 1 {
            VStack(alignment: .leading, spacing: spacing) {
                ForEach(0..<lines, id: \\.self) { index in
                    skeletonShape
                        .frame(
                            width: index == lines - 1 ? (width ?? 200) * 0.75 : width,
                            height: height ?? 16
                        )
                }
            }
        } else {
            skeletonShape
                .frame(width: getWidth(), height: getHeight())
        }
    }

    @ViewBuilder
    private var skeletonShape: some View {
        switch variant {
        case .text:
            RoundedRectangle(cornerRadius: 4)
                .fill(Color.gray.opacity(0.3))
                .modifier(AnimationModifier(animation: animation, isAnimating: $isAnimating))
        case .circular:
            Circle()
                .fill(Color.gray.opacity(0.3))
                .modifier(AnimationModifier(animation: animation, isAnimating: $isAnimating))
        case .rectangular:
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .modifier(AnimationModifier(animation: animation, isAnimating: $isAnimating))
        case .rounded:
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.3))
                .modifier(AnimationModifier(animation: animation, isAnimating: $isAnimating))
        }
    }

    private func getWidth() -> CGFloat? {
        if let width = width { return width }
        switch variant {
        case .circular: return 40
        default: return nil
        }
    }

    private func getHeight() -> CGFloat {
        if let height = height { return height }
        switch variant {
        case .text: return 16
        case .circular: return getWidth() ?? 40
        case .rectangular, .rounded: return 100
        }
    }
}

// MARK: - Animation Modifier
struct AnimationModifier: ViewModifier {
    let animation: SkeletonAnimation
    @Binding var isAnimating: Bool

    func body(content: Content) -> some View {
        switch animation {
        case .pulse:
            content
                .opacity(isAnimating ? 0.5 : 1.0)
                .animation(
                    Animation.easeInOut(duration: 1.0).repeatForever(autoreverses: true),
                    value: isAnimating
                )
                .onAppear { isAnimating = true }
        case .wave:
            content
                .overlay(
                    GeometryReader { geometry in
                        LinearGradient(
                            gradient: Gradient(colors: [
                                .clear,
                                .white.opacity(0.4),
                                .clear
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .frame(width: geometry.size.width * 0.5)
                        .offset(x: isAnimating ? geometry.size.width : -geometry.size.width * 0.5)
                        .animation(
                            Animation.linear(duration: 1.5).repeatForever(autoreverses: false),
                            value: isAnimating
                        )
                    }
                    .mask(content)
                )
                .onAppear { isAnimating = true }
        case .none:
            content
        }
    }
}

// MARK: - Preset Components
struct SkeletonText: View {
    var lines: Int = 3
    var width: CGFloat? = nil
    var animation: SkeletonAnimation = .pulse

    var body: some View {
        Skeleton(variant: .text, width: width, lines: lines, animation: animation)
    }
}

struct SkeletonAvatar: View {
    var size: CGFloat = 40
    var animation: SkeletonAnimation = .pulse

    var body: some View {
        Skeleton(variant: .circular, width: size, height: size, animation: animation)
    }
}

struct SkeletonImage: View {
    var width: CGFloat = 200
    var height: CGFloat = 150
    var animation: SkeletonAnimation = .pulse

    var body: some View {
        Skeleton(variant: .rounded, width: width, height: height, animation: animation)
    }
}

struct SkeletonCard: View {
    var animation: SkeletonAnimation = .pulse

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 12) {
                SkeletonAvatar(size: 48, animation: animation)
                VStack(alignment: .leading, spacing: 8) {
                    Skeleton(variant: .text, width: 120, height: 16, animation: animation)
                    Skeleton(variant: .text, width: 80, height: 12, animation: animation)
                }
            }

            SkeletonImage(width: .infinity, height: 200, animation: animation)

            SkeletonText(lines: 3, animation: animation)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 2)
    }
}

struct SkeletonList: View {
    var items: Int = 5
    var animation: SkeletonAnimation = .pulse

    var body: some View {
        VStack(spacing: 16) {
            ForEach(0..<items, id: \\.self) { _ in
                HStack(spacing: 12) {
                    SkeletonAvatar(size: 40, animation: animation)
                    VStack(alignment: .leading, spacing: 6) {
                        Skeleton(variant: .text, width: 140, height: 16, animation: animation)
                        Skeleton(variant: .text, width: 100, height: 12, animation: animation)
                    }
                    Spacer()
                }
            }
        }
    }
}

// MARK: - View Extension for Skeleton Loading
extension View {
    @ViewBuilder
    func skeleton(isLoading: Bool, animation: SkeletonAnimation = .pulse) -> some View {
        if isLoading {
            self
                .hidden()
                .overlay(
                    Skeleton(variant: .rounded, animation: animation)
                )
        } else {
            self
        }
    }
}

// MARK: - Preview
struct SkeletonPreview: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Skeleton Variants")
                    .font(.headline)

                Group {
                    Skeleton(variant: .text, width: 200)
                    Skeleton(variant: .circular, width: 50, height: 50)
                    Skeleton(variant: .rectangular, width: 200, height: 100)
                    Skeleton(variant: .rounded, width: 200, height: 100)
                }

                Divider()

                Text("Multi-line Text")
                    .font(.headline)
                SkeletonText(lines: 4, width: 300)

                Divider()

                Text("Card Skeleton")
                    .font(.headline)
                SkeletonCard()
                    .frame(width: 300)

                Divider()

                Text("List Skeleton")
                    .font(.headline)
                SkeletonList(items: 3)
                    .frame(width: 300)
            }
            .padding()
        }
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.animation:animation',
        'androidx.compose.foundation:foundation'
      ],
      imports: [
        'androidx.compose.animation.core.*',
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.CircleShape',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.geometry.Offset',
        'androidx.compose.ui.graphics.Brush',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.graphics.Shape',
        'androidx.compose.ui.unit.Dp',
        'androidx.compose.ui.unit.dp'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// Animation types
enum class SkeletonAnimation {
    PULSE, WAVE, NONE
}

// Skeleton variant
enum class SkeletonVariant {
    TEXT, CIRCULAR, RECTANGULAR, ROUNDED
}

@Composable
fun Skeleton(
    modifier: Modifier = Modifier,
    variant: SkeletonVariant = SkeletonVariant.TEXT,
    width: Dp? = null,
    height: Dp? = null,
    animation: SkeletonAnimation = SkeletonAnimation.PULSE,
    lines: Int = 1,
    spacing: Dp = 8.dp
) {
    val shape: Shape = when (variant) {
        SkeletonVariant.TEXT -> RoundedCornerShape(4.dp)
        SkeletonVariant.CIRCULAR -> CircleShape
        SkeletonVariant.RECTANGULAR -> RoundedCornerShape(0.dp)
        SkeletonVariant.ROUNDED -> RoundedCornerShape(8.dp)
    }

    val defaultHeight: Dp = when (variant) {
        SkeletonVariant.TEXT -> 16.dp
        SkeletonVariant.CIRCULAR -> width ?: 40.dp
        SkeletonVariant.RECTANGULAR, SkeletonVariant.ROUNDED -> 100.dp
    }

    if (variant == SkeletonVariant.TEXT && lines > 1) {
        Column(
            modifier = modifier,
            verticalArrangement = Arrangement.spacedBy(spacing)
        ) {
            repeat(lines) { index ->
                val lineModifier = if (index == lines - 1) {
                    Modifier.fillMaxWidth(0.75f)
                } else {
                    if (width != null) Modifier.width(width) else Modifier.fillMaxWidth()
                }

                SkeletonBox(
                    modifier = lineModifier.height(height ?: defaultHeight),
                    shape = shape,
                    animation = animation
                )
            }
        }
    } else {
        val sizeModifier = when {
            width != null && height != null -> Modifier.size(width, height)
            width != null -> Modifier.width(width).height(height ?: defaultHeight)
            height != null -> Modifier.fillMaxWidth().height(height)
            else -> Modifier.fillMaxWidth().height(defaultHeight)
        }

        SkeletonBox(
            modifier = modifier.then(sizeModifier),
            shape = shape,
            animation = animation
        )
    }
}

@Composable
private fun SkeletonBox(
    modifier: Modifier,
    shape: Shape,
    animation: SkeletonAnimation
) {
    val baseColor = Color.Gray.copy(alpha = 0.3f)
    val highlightColor = Color.Gray.copy(alpha = 0.1f)

    when (animation) {
        SkeletonAnimation.PULSE -> {
            val infiniteTransition = rememberInfiniteTransition(label = "skeleton_pulse")
            val alpha by infiniteTransition.animateFloat(
                initialValue = 1f,
                targetValue = 0.5f,
                animationSpec = infiniteRepeatable(
                    animation = tween(1000, easing = EaseInOut),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "skeleton_alpha"
            )

            Box(
                modifier = modifier
                    .clip(shape)
                    .background(baseColor.copy(alpha = baseColor.alpha * alpha))
            )
        }

        SkeletonAnimation.WAVE -> {
            val infiniteTransition = rememberInfiniteTransition(label = "skeleton_wave")
            val translateAnim by infiniteTransition.animateFloat(
                initialValue = 0f,
                targetValue = 1000f,
                animationSpec = infiniteRepeatable(
                    animation = tween(1500, easing = LinearEasing),
                    repeatMode = RepeatMode.Restart
                ),
                label = "skeleton_translate"
            )

            val shimmerBrush = Brush.linearGradient(
                colors = listOf(
                    baseColor,
                    highlightColor,
                    baseColor
                ),
                start = Offset(translateAnim - 500f, 0f),
                end = Offset(translateAnim, 0f)
            )

            Box(
                modifier = modifier
                    .clip(shape)
                    .background(shimmerBrush)
            )
        }

        SkeletonAnimation.NONE -> {
            Box(
                modifier = modifier
                    .clip(shape)
                    .background(baseColor)
            )
        }
    }
}

// Preset components
@Composable
fun SkeletonText(
    modifier: Modifier = Modifier,
    lines: Int = 3,
    width: Dp? = null,
    animation: SkeletonAnimation = SkeletonAnimation.PULSE
) {
    Skeleton(
        modifier = modifier,
        variant = SkeletonVariant.TEXT,
        width = width,
        lines = lines,
        animation = animation
    )
}

@Composable
fun SkeletonAvatar(
    modifier: Modifier = Modifier,
    size: Dp = 40.dp,
    animation: SkeletonAnimation = SkeletonAnimation.PULSE
) {
    Skeleton(
        modifier = modifier,
        variant = SkeletonVariant.CIRCULAR,
        width = size,
        height = size,
        animation = animation
    )
}

@Composable
fun SkeletonImage(
    modifier: Modifier = Modifier,
    width: Dp = 200.dp,
    height: Dp = 150.dp,
    animation: SkeletonAnimation = SkeletonAnimation.PULSE
) {
    Skeleton(
        modifier = modifier,
        variant = SkeletonVariant.ROUNDED,
        width = width,
        height = height,
        animation = animation
    )
}

@Composable
fun SkeletonCard(
    modifier: Modifier = Modifier,
    animation: SkeletonAnimation = SkeletonAnimation.PULSE
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            SkeletonAvatar(size = 48.dp, animation = animation)
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Skeleton(
                    variant = SkeletonVariant.TEXT,
                    width = 120.dp,
                    height = 16.dp,
                    animation = animation
                )
                Skeleton(
                    variant = SkeletonVariant.TEXT,
                    width = 80.dp,
                    height = 12.dp,
                    animation = animation
                )
            }
        }

        SkeletonImage(
            modifier = Modifier.fillMaxWidth(),
            height = 200.dp,
            animation = animation
        )

        SkeletonText(lines = 3, animation = animation)
    }
}

@Composable
fun SkeletonList(
    modifier: Modifier = Modifier,
    items: Int = 5,
    animation: SkeletonAnimation = SkeletonAnimation.PULSE
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        repeat(items) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                SkeletonAvatar(size = 40.dp, animation = animation)
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Skeleton(
                        variant = SkeletonVariant.TEXT,
                        width = 140.dp,
                        height = 16.dp,
                        animation = animation
                    )
                    Skeleton(
                        variant = SkeletonVariant.TEXT,
                        width = 100.dp,
                        height = 12.dp,
                        animation = animation
                    )
                }
            }
        }
    }
}

// Extension for skeleton loading state
@Composable
fun Modifier.skeleton(
    isLoading: Boolean,
    animation: SkeletonAnimation = SkeletonAnimation.PULSE
): Modifier {
    return if (isLoading) {
        this.then(
            Modifier
                .clip(RoundedCornerShape(4.dp))
                .background(Color.Gray.copy(alpha = 0.3f))
        )
    } else {
        this
    }
}
`
    }
  }
}
