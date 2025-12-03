/**
 * Gradient Text Capsule - Multi-Platform
 * Text with gradient color effect
 */

import { CapsuleDefinition } from './types'

export const GradientTextCapsule: CapsuleDefinition = {
  id: 'gradient-text',
  name: 'Gradient Text',
  description: 'Text with beautiful gradient color effects',
  category: 'ui',
  tags: ['gradient', 'text', 'typography', 'color'],
  version: '1.0.0',

  props: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Text content'
    },
    {
      name: 'from',
      type: 'color',
      required: false,
      default: '#3b82f6',
      description: 'Gradient start color'
    },
    {
      name: 'to',
      type: 'color',
      required: false,
      default: '#8b5cf6',
      description: 'Gradient end color'
    },
    {
      name: 'via',
      type: 'color',
      required: false,
      description: 'Optional middle color'
    },
    {
      name: 'direction',
      type: 'select',
      required: false,
      default: 'to-right',
      options: ['to-right', 'to-left', 'to-bottom', 'to-top', 'to-br', 'to-bl'],
      description: 'Gradient direction'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'h1',
      options: ['h1', 'h2', 'h3', 'h4', 'body', 'caption'],
      description: 'Text size variant'
    },
    {
      name: 'animated',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Animate gradient'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React from 'react'

interface GradientTextProps {
  text: string
  from?: string
  to?: string
  via?: string
  direction?: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-br' | 'to-bl'
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'
  animated?: boolean
}

export function GradientText({
  text,
  from = '#3b82f6',
  to = '#8b5cf6',
  via,
  direction = 'to-right',
  variant = 'h1',
  animated = false
}: GradientTextProps) {
  const directionMap = {
    'to-right': '90deg',
    'to-left': '270deg',
    'to-bottom': '180deg',
    'to-top': '0deg',
    'to-br': '135deg',
    'to-bl': '225deg'
  }

  const variantClasses = {
    h1: 'text-5xl md:text-6xl font-bold',
    h2: 'text-4xl md:text-5xl font-bold',
    h3: 'text-3xl md:text-4xl font-semibold',
    h4: 'text-2xl md:text-3xl font-semibold',
    body: 'text-lg font-medium',
    caption: 'text-sm font-medium'
  }

  const gradient = via
    ? \`linear-gradient(\${directionMap[direction]}, \${from}, \${via}, \${to})\`
    : \`linear-gradient(\${directionMap[direction]}, \${from}, \${to})\`

  return (
    <>
      <span
        className={\`\${variantClasses[variant]} bg-clip-text text-transparent \${
          animated ? 'animate-gradient bg-[length:200%_auto]' : ''
        }\`}
        style={{ backgroundImage: gradient }}
      >
        {text}
      </span>

      {animated && (
        <style>{\`
          @keyframes gradient {
            0% { background-position: 0% center; }
            50% { background-position: 100% center; }
            100% { background-position: 0% center; }
          }
          .animate-gradient {
            animation: gradient 3s ease infinite;
          }
        \`}</style>
      )}
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

struct GradientText: View {
    let text: String
    var from: Color = .blue
    var to: Color = .purple
    var via: Color?
    var direction: GradientDirection = .horizontal
    var variant: TextVariant = .h1
    var animated: Bool = false

    enum GradientDirection { case horizontal, vertical, diagonal }
    enum TextVariant { case h1, h2, h3, h4, body, caption }

    private var font: Font {
        switch variant {
        case .h1: return .system(size: 48, weight: .bold)
        case .h2: return .system(size: 40, weight: .bold)
        case .h3: return .system(size: 32, weight: .semibold)
        case .h4: return .system(size: 28, weight: .semibold)
        case .body: return .system(size: 18, weight: .medium)
        case .caption: return .system(size: 14, weight: .medium)
        }
    }

    private var startPoint: UnitPoint {
        switch direction {
        case .horizontal: return .leading
        case .vertical: return .top
        case .diagonal: return .topLeading
        }
    }

    private var endPoint: UnitPoint {
        switch direction {
        case .horizontal: return .trailing
        case .vertical: return .bottom
        case .diagonal: return .bottomTrailing
        }
    }

    private var gradient: LinearGradient {
        let colors = via != nil ? [from, via!, to] : [from, to]
        return LinearGradient(colors: colors, startPoint: startPoint, endPoint: endPoint)
    }

    var body: some View {
        Text(text)
            .font(font)
            .foregroundStyle(gradient)
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
fun GradientText(
    text: String,
    from: Color = Color.Blue,
    to: Color = Color.Magenta,
    via: Color? = null,
    direction: GradientDirection = GradientDirection.Horizontal,
    variant: TextVariant = TextVariant.H1,
    animated: Boolean = false
) {
    val style = when (variant) {
        TextVariant.H1 -> MaterialTheme.typography.displayLarge
        TextVariant.H2 -> MaterialTheme.typography.displayMedium
        TextVariant.H3 -> MaterialTheme.typography.displaySmall
        TextVariant.H4 -> MaterialTheme.typography.headlineMedium
        TextVariant.Body -> MaterialTheme.typography.bodyLarge
        TextVariant.Caption -> MaterialTheme.typography.bodySmall
    }

    val colors = if (via != null) listOf(from, via, to) else listOf(from, to)

    val brush = when (direction) {
        GradientDirection.Horizontal -> Brush.horizontalGradient(colors)
        GradientDirection.Vertical -> Brush.verticalGradient(colors)
        GradientDirection.Diagonal -> Brush.linearGradient(colors)
    }

    Text(
        text = text,
        style = style.copy(
            brush = brush
        )
    )
}

enum class GradientDirection { Horizontal, Vertical, Diagonal }
enum class TextVariant { H1, H2, H3, H4, Body, Caption }
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react'],
      code: `// Same as web implementation`
    }
  }
}
