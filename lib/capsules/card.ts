/**
 * Card Capsule - Multi-Platform
 *
 * Container component with shadow, padding, and optional header/footer.
 */

import { CapsuleDefinition } from './types'

export const CardCapsule: CapsuleDefinition = {
  id: 'card',
  name: 'Card',
  description: 'Container with elevation, padding, and optional sections',
  category: 'layout',
  tags: ['container', 'surface', 'elevation', 'group'],
  version: '1.0.0',

  props: [
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Card header title'
    },
    {
      name: 'subtitle',
      type: 'string',
      required: false,
      description: 'Card header subtitle'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'elevated',
      options: ['elevated', 'outlined', 'filled'],
      description: 'Card style variant'
    },
    {
      name: 'padding',
      type: 'select',
      required: false,
      default: 'md',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Internal padding'
    },
    {
      name: 'onPress',
      type: 'action',
      required: false,
      description: 'Makes card clickable'
    },
    {
      name: 'imageUrl',
      type: 'string',
      required: false,
      description: 'Header image URL'
    },
    {
      name: 'footer',
      type: 'slot',
      required: false,
      description: 'Footer content slot'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  variant?: 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onPress?: () => void
  imageUrl?: string
  footer?: React.ReactNode
}

export function Card({
  children,
  title,
  subtitle,
  variant = 'elevated',
  padding = 'md',
  onPress,
  imageUrl,
  footer
}: CardProps) {
  const variants = {
    elevated: 'bg-white shadow-md hover:shadow-lg',
    outlined: 'bg-white border border-gray-200',
    filled: 'bg-gray-50'
  }

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  const Component = onPress ? 'button' : 'div'

  return (
    <Component
      onClick={onPress}
      className={\`
        rounded-xl overflow-hidden transition-all duration-200
        \${variants[variant]}
        \${onPress ? 'cursor-pointer active:scale-[0.98]' : ''}
        w-full text-left
      \`}
    >
      {/* Header Image */}
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      {(title || subtitle) && (
        <div className={\`\${paddings[padding]} \${imageUrl ? 'pt-4' : ''} pb-0\`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div className={paddings[padding]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={\`\${paddings[padding]} pt-0 border-t border-gray-100 mt-2\`}>
          {footer}
        </div>
      )}
    </Component>
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

enum CardVariant {
    case elevated, outlined, filled
}

enum CardPadding {
    case none, sm, md, lg

    var value: CGFloat {
        switch self {
        case .none: return 0
        case .sm: return 12
        case .md: return 16
        case .lg: return 24
        }
    }
}

struct HubLabCard<Content: View, Footer: View>: View {
    var title: String? = nil
    var subtitle: String? = nil
    var variant: CardVariant = .elevated
    var padding: CardPadding = .md
    var onPress: (() -> Void)? = nil
    var imageUrl: String? = nil
    @ViewBuilder let content: () -> Content
    @ViewBuilder let footer: () -> Footer

    init(
        title: String? = nil,
        subtitle: String? = nil,
        variant: CardVariant = .elevated,
        padding: CardPadding = .md,
        onPress: (() -> Void)? = nil,
        imageUrl: String? = nil,
        @ViewBuilder content: @escaping () -> Content,
        @ViewBuilder footer: @escaping () -> Footer = { EmptyView() }
    ) {
        self.title = title
        self.subtitle = subtitle
        self.variant = variant
        self.padding = padding
        self.onPress = onPress
        self.imageUrl = imageUrl
        self.content = content
        self.footer = footer
    }

    var body: some View {
        Group {
            if let action = onPress {
                Button(action: action) {
                    cardContent
                }
                .buttonStyle(CardButtonStyle())
            } else {
                cardContent
            }
        }
    }

    private var cardContent: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header Image
            if let url = imageUrl, let imageURL = URL(string: url) {
                AsyncImage(url: imageURL) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Color.gray.opacity(0.2))
                }
                .frame(height: 180)
                .clipped()
            }

            // Header
            if title != nil || subtitle != nil {
                VStack(alignment: .leading, spacing: 2) {
                    if let title = title {
                        Text(title)
                            .font(.headline)
                            .foregroundColor(.primary)
                    }
                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.horizontal, padding.value)
                .padding(.top, padding.value)
            }

            // Content
            content()
                .padding(padding.value)

            // Footer
            if Footer.self != EmptyView.self {
                Divider()
                    .padding(.horizontal, padding.value)
                footer()
                    .padding(.horizontal, padding.value)
                    .padding(.bottom, padding.value)
            }
        }
        .background(backgroundColor)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(borderColor, lineWidth: variant == .outlined ? 1 : 0)
        )
        .shadow(
            color: variant == .elevated ? Color.black.opacity(0.1) : .clear,
            radius: 8,
            x: 0,
            y: 4
        )
    }

    private var backgroundColor: Color {
        switch variant {
        case .elevated, .outlined: return Color(.systemBackground)
        case .filled: return Color(.secondarySystemBackground)
        }
    }

    private var borderColor: Color {
        variant == .outlined ? Color(.separator) : .clear
    }
}

struct CardButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
    }
}

// MARK: - Previews
#Preview("Card Variants") {
    ScrollView {
        VStack(spacing: 20) {
            HubLabCard(
                title: "Elevated Card",
                subtitle: "With shadow",
                variant: .elevated
            ) {
                Text("This is the card content with some text to show how it looks.")
            } footer: {
                HStack {
                    Button("Cancel") {}
                    Spacer()
                    Button("Confirm") {}
                }
            }

            HubLabCard(
                title: "Outlined Card",
                variant: .outlined
            ) {
                Text("Outlined variant with border")
            }

            HubLabCard(
                title: "Filled Card",
                variant: .filled
            ) {
                Text("Filled background variant")
            }

            HubLabCard(
                title: "Clickable Card",
                onPress: { print("Card tapped") }
            ) {
                Text("Tap me!")
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
        'androidx.compose.material3:material3',
        'io.coil-kt:coil-compose:2.5.0'
      ],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'coil.compose.AsyncImage'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage

enum class CardVariant { Elevated, Outlined, Filled }
enum class CardPadding(val value: Dp) {
    None(0.dp), Sm(12.dp), Md(16.dp), Lg(24.dp)
}

@Composable
fun HubLabCard(
    modifier: Modifier = Modifier,
    title: String? = null,
    subtitle: String? = null,
    variant: CardVariant = CardVariant.Elevated,
    padding: CardPadding = CardPadding.Md,
    onClick: (() -> Unit)? = null,
    imageUrl: String? = null,
    footer: @Composable (() -> Unit)? = null,
    content: @Composable () -> Unit
) {
    val cardModifier = modifier
        .fillMaxWidth()
        .then(
            if (onClick != null) Modifier.clickable(onClick = onClick)
            else Modifier
        )

    when (variant) {
        CardVariant.Elevated -> {
            ElevatedCard(
                modifier = cardModifier,
                shape = MaterialTheme.shapes.large
            ) {
                CardContent(title, subtitle, padding, imageUrl, footer, content)
            }
        }
        CardVariant.Outlined -> {
            OutlinedCard(
                modifier = cardModifier,
                shape = MaterialTheme.shapes.large,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                CardContent(title, subtitle, padding, imageUrl, footer, content)
            }
        }
        CardVariant.Filled -> {
            Card(
                modifier = cardModifier,
                shape = MaterialTheme.shapes.large,
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                CardContent(title, subtitle, padding, imageUrl, footer, content)
            }
        }
    }
}

@Composable
private fun CardContent(
    title: String?,
    subtitle: String?,
    padding: CardPadding,
    imageUrl: String?,
    footer: @Composable (() -> Unit)?,
    content: @Composable () -> Unit
) {
    Column {
        // Header Image
        if (imageUrl != null) {
            AsyncImage(
                model = imageUrl,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .clip(MaterialTheme.shapes.large)
            )
        }

        // Header
        if (title != null || subtitle != null) {
            Column(
                modifier = Modifier
                    .padding(horizontal = padding.value)
                    .padding(top = padding.value)
            ) {
                if (title != null) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleMedium
                    )
                }
                if (subtitle != null) {
                    Text(
                        text = subtitle,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // Content
        Box(modifier = Modifier.padding(padding.value)) {
            content()
        }

        // Footer
        if (footer != null) {
            HorizontalDivider(
                modifier = Modifier.padding(horizontal = padding.value)
            )
            Box(
                modifier = Modifier
                    .padding(horizontal = padding.value)
                    .padding(bottom = padding.value)
                    .padding(top = 8.dp)
            ) {
                footer()
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabCardPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            HubLabCard(
                title = "Elevated Card",
                subtitle = "With shadow",
                variant = CardVariant.Elevated
            ) {
                Text("This is the card content")
            }

            HubLabCard(
                title = "Outlined Card",
                variant = CardVariant.Outlined
            ) {
                Text("With border")
            }

            HubLabCard(
                title = "Clickable Card",
                onClick = {}
            ) {
                Text("Tap me!")
            }
        }
    }
}
`
    }
  },

  children: true,
  slots: ['footer'],
  preview: '/previews/card.png'
}
