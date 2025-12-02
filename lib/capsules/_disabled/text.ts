/**
 * Text Capsule - Multi-Platform
 *
 * Typography component with variants for headings, body, captions, etc.
 */

import { CapsuleDefinition } from './types'

export const TextCapsule: CapsuleDefinition = {
  id: 'text',
  name: 'Text',
  description: 'Typography component with multiple styles and variants',
  category: 'ui',
  tags: ['typography', 'content', 'heading', 'paragraph'],
  version: '1.0.0',

  props: [
    {
      name: 'content',
      type: 'string',
      required: true,
      description: 'The text content to display'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'body',
      options: ['h1', 'h2', 'h3', 'h4', 'body', 'bodyLarge', 'caption', 'label', 'overline'],
      description: 'Typography variant'
    },
    {
      name: 'weight',
      type: 'select',
      required: false,
      default: 'normal',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight'
    },
    {
      name: 'color',
      type: 'color',
      required: false,
      description: 'Text color (uses theme colors by default)'
    },
    {
      name: 'align',
      type: 'select',
      required: false,
      default: 'left',
      options: ['left', 'center', 'right'],
      description: 'Text alignment'
    },
    {
      name: 'numberOfLines',
      type: 'number',
      required: false,
      description: 'Maximum number of lines (truncates with ellipsis)'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React from 'react'

interface TextProps {
  content: string
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLarge' | 'caption' | 'label' | 'overline'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
  align?: 'left' | 'center' | 'right'
  numberOfLines?: number
}

export function Text({
  content,
  variant = 'body',
  weight = 'normal',
  color,
  align = 'left',
  numberOfLines
}: TextProps) {
  const variants = {
    h1: 'text-4xl md:text-5xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
    body: 'text-base',
    bodyLarge: 'text-lg',
    caption: 'text-sm text-gray-500',
    label: 'text-sm font-medium',
    overline: 'text-xs uppercase tracking-wider text-gray-500'
  }

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  const Tag = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p'

  const truncateStyle = numberOfLines ? {
    display: '-webkit-box',
    WebkitLineClamp: numberOfLines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden'
  } : {}

  return (
    <Tag
      className={\`\${variants[variant]} \${weights[weight]} \${alignments[align]}\`}
      style={{ color, ...truncateStyle }}
    >
      {content}
    </Tag>
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

enum TextVariant {
    case h1, h2, h3, h4, body, bodyLarge, caption, label, overline

    var font: Font {
        switch self {
        case .h1: return .system(size: 40, weight: .bold)
        case .h2: return .system(size: 32, weight: .bold)
        case .h3: return .system(size: 26, weight: .semibold)
        case .h4: return .system(size: 22, weight: .semibold)
        case .body: return .body
        case .bodyLarge: return .system(size: 18)
        case .caption: return .caption
        case .label: return .system(size: 14, weight: .medium)
        case .overline: return .system(size: 12, weight: .medium)
        }
    }

    var defaultColor: Color {
        switch self {
        case .caption, .overline: return .secondary
        default: return .primary
        }
    }
}

enum TextWeight {
    case light, normal, medium, semibold, bold

    var fontWeight: Font.Weight {
        switch self {
        case .light: return .light
        case .normal: return .regular
        case .medium: return .medium
        case .semibold: return .semibold
        case .bold: return .bold
        }
    }
}

struct HubLabText: View {
    let content: String
    var variant: TextVariant = .body
    var weight: TextWeight = .normal
    var color: Color? = nil
    var align: TextAlignment = .leading
    var numberOfLines: Int? = nil

    var body: some View {
        Text(content)
            .font(variant.font)
            .fontWeight(weight.fontWeight)
            .foregroundColor(color ?? variant.defaultColor)
            .multilineTextAlignment(align)
            .lineLimit(numberOfLines)
            .textCase(variant == .overline ? .uppercase : nil)
            .tracking(variant == .overline ? 1.5 : 0)
    }
}

// MARK: - Previews
#Preview("Typography Scale") {
    VStack(alignment: .leading, spacing: 16) {
        HubLabText(content: "Heading 1", variant: .h1)
        HubLabText(content: "Heading 2", variant: .h2)
        HubLabText(content: "Heading 3", variant: .h3)
        HubLabText(content: "Heading 4", variant: .h4)
        HubLabText(content: "Body text for paragraphs and content", variant: .body)
        HubLabText(content: "Body Large for emphasis", variant: .bodyLarge)
        HubLabText(content: "Caption for secondary info", variant: .caption)
        HubLabText(content: "Label for form fields", variant: .label)
        HubLabText(content: "Overline category", variant: .overline)
    }
    .padding()
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3',
        'androidx.compose.ui:ui'
      ],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.ui.text.style.*',
        'androidx.compose.ui.text.font.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.foundation.layout.*

enum class TextVariant { H1, H2, H3, H4, Body, BodyLarge, Caption, Label, Overline }
enum class TextWeight { Light, Normal, Medium, SemiBold, Bold }

@Composable
fun HubLabText(
    content: String,
    modifier: Modifier = Modifier,
    variant: TextVariant = TextVariant.Body,
    weight: TextWeight = TextWeight.Normal,
    color: Color = Color.Unspecified,
    align: TextAlign = TextAlign.Start,
    maxLines: Int = Int.MAX_VALUE
) {
    val style = when (variant) {
        TextVariant.H1 -> MaterialTheme.typography.displayLarge
        TextVariant.H2 -> MaterialTheme.typography.displayMedium
        TextVariant.H3 -> MaterialTheme.typography.displaySmall
        TextVariant.H4 -> MaterialTheme.typography.headlineMedium
        TextVariant.Body -> MaterialTheme.typography.bodyLarge
        TextVariant.BodyLarge -> MaterialTheme.typography.bodyLarge
        TextVariant.Caption -> MaterialTheme.typography.bodySmall
        TextVariant.Label -> MaterialTheme.typography.labelLarge
        TextVariant.Overline -> MaterialTheme.typography.labelSmall
    }

    val fontWeight = when (weight) {
        TextWeight.Light -> FontWeight.Light
        TextWeight.Normal -> FontWeight.Normal
        TextWeight.Medium -> FontWeight.Medium
        TextWeight.SemiBold -> FontWeight.SemiBold
        TextWeight.Bold -> FontWeight.Bold
    }

    val textColor = if (color != Color.Unspecified) {
        color
    } else when (variant) {
        TextVariant.Caption, TextVariant.Overline -> MaterialTheme.colorScheme.onSurfaceVariant
        else -> MaterialTheme.colorScheme.onSurface
    }

    Text(
        text = if (variant == TextVariant.Overline) content.uppercase() else content,
        modifier = modifier,
        style = style.copy(fontWeight = fontWeight),
        color = textColor,
        textAlign = align,
        maxLines = maxLines,
        overflow = TextOverflow.Ellipsis
    )
}

@Preview(showBackground = true)
@Composable
fun HubLabTextPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            HubLabText("Heading 1", variant = TextVariant.H1)
            HubLabText("Heading 2", variant = TextVariant.H2)
            HubLabText("Body text", variant = TextVariant.Body)
            HubLabText("Caption text", variant = TextVariant.Caption)
            HubLabText("Overline", variant = TextVariant.Overline)
        }
    }
}
`
    }
  },

  children: false,
  preview: '/previews/text.png'
}
