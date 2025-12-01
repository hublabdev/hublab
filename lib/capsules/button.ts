/**
 * Button Capsule - Multi-Platform
 *
 * Genera código nativo REAL para cada plataforma:
 * - Web: React con Tailwind
 * - iOS: SwiftUI nativo
 * - Android: Jetpack Compose nativo
 */

import { CapsuleDefinition } from '../types'

export const ButtonCapsule: CapsuleDefinition = {
  id: 'button',
  name: 'Button',
  description: 'Botón interactivo con múltiples variantes y estados',
  category: 'ui',
  tags: ['interactive', 'form', 'action', 'cta'],
  version: '1.0.0',

  props: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Texto del botón'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'primary',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Estilo visual del botón'
    },
    {
      name: 'size',
      type: 'select',
      required: false,
      default: 'md',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del botón'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Estado deshabilitado'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Mostrar indicador de carga'
    },
    {
      name: 'icon',
      type: 'icon',
      required: false,
      description: 'Icono a mostrar (SF Symbol / Material Icon)',
      platformMapping: {
        ios: 'systemImage',
        android: 'icon'
      }
    },
    {
      name: 'iconPosition',
      type: 'select',
      required: false,
      default: 'leading',
      options: ['leading', 'trailing'],
      description: 'Posición del icono'
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Ocupar todo el ancho disponible'
    },
    {
      name: 'onPress',
      type: 'action',
      required: true,
      description: 'Acción al presionar'
    }
  ],

  platforms: {
    // ==========================================
    // WEB - React + Tailwind
    // ==========================================
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  text: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'leading' | 'trailing'
  fullWidth?: boolean
  onPress: () => void
}

export function Button({
  text,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'leading',
  fullWidth = false,
  onPress
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const isDisabled = disabled || loading

  return (
    <button
      onClick={onPress}
      disabled={isDisabled}
      className={\`
        \${baseStyles}
        \${variants[variant]}
        \${sizes[size]}
        \${fullWidth ? 'w-full' : ''}
      \`}
    >
      {loading ? (
        <Loader2 className={\`\${iconSizes[size]} animate-spin\`} />
      ) : (
        <>
          {icon && iconPosition === 'leading' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
          <span>{text}</span>
          {icon && iconPosition === 'trailing' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
`
    },

    // ==========================================
    // iOS - SwiftUI Nativo
    // ==========================================
    ios: {
      framework: 'swiftui',
      minVersion: '15.0',
      dependencies: [],
      imports: ['SwiftUI'],
      code: `
import SwiftUI

struct HubLabButton: View {
    // MARK: - Properties
    let text: String
    var variant: ButtonVariant = .primary
    var size: ButtonSize = .md
    var disabled: Bool = false
    var loading: Bool = false
    var systemImage: String? = nil
    var iconPosition: IconPosition = .leading
    var fullWidth: Bool = false
    let onPress: () -> Void

    // MARK: - Enums
    enum ButtonVariant {
        case primary, secondary, outline, ghost, destructive

        var backgroundColor: Color {
            switch self {
            case .primary: return .accentColor
            case .secondary: return .secondary
            case .outline, .ghost: return .clear
            case .destructive: return .red
            }
        }

        var foregroundColor: Color {
            switch self {
            case .primary, .secondary, .destructive: return .white
            case .outline, .ghost: return .accentColor
            }
        }

        var borderColor: Color? {
            switch self {
            case .outline: return .accentColor
            default: return nil
            }
        }
    }

    enum ButtonSize {
        case sm, md, lg

        var horizontalPadding: CGFloat {
            switch self {
            case .sm: return 12
            case .md: return 16
            case .lg: return 24
            }
        }

        var verticalPadding: CGFloat {
            switch self {
            case .sm: return 6
            case .md: return 10
            case .lg: return 14
            }
        }

        var font: Font {
            switch self {
            case .sm: return .subheadline.weight(.medium)
            case .md: return .body.weight(.medium)
            case .lg: return .title3.weight(.medium)
            }
        }

        var iconSize: CGFloat {
            switch self {
            case .sm: return 14
            case .md: return 18
            case .lg: return 22
            }
        }
    }

    enum IconPosition {
        case leading, trailing
    }

    // MARK: - Body
    var body: some View {
        Button(action: onPress) {
            HStack(spacing: size == .sm ? 4 : 8) {
                if loading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: variant.foregroundColor))
                        .scaleEffect(size == .sm ? 0.7 : 0.85)
                } else {
                    if let systemImage = systemImage, iconPosition == .leading {
                        Image(systemName: systemImage)
                            .font(.system(size: size.iconSize))
                    }

                    Text(text)
                        .font(size.font)

                    if let systemImage = systemImage, iconPosition == .trailing {
                        Image(systemName: systemImage)
                            .font(.system(size: size.iconSize))
                    }
                }
            }
            .padding(.horizontal, size.horizontalPadding)
            .padding(.vertical, size.verticalPadding)
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .background(variant.backgroundColor)
            .foregroundColor(variant.foregroundColor)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(variant.borderColor ?? .clear, lineWidth: 2)
            )
        }
        .disabled(disabled || loading)
        .opacity(disabled ? 0.5 : 1)
        .animation(.easeInOut(duration: 0.15), value: loading)
    }
}

// MARK: - Previews
#Preview("Primary Button") {
    VStack(spacing: 16) {
        HubLabButton(text: "Primary", onPress: {})
        HubLabButton(text: "Primary Disabled", disabled: true, onPress: {})
        HubLabButton(text: "Loading", loading: true, onPress: {})
    }
    .padding()
}

#Preview("All Variants") {
    VStack(spacing: 12) {
        HubLabButton(text: "Primary", variant: .primary, onPress: {})
        HubLabButton(text: "Secondary", variant: .secondary, onPress: {})
        HubLabButton(text: "Outline", variant: .outline, onPress: {})
        HubLabButton(text: "Ghost", variant: .ghost, onPress: {})
        HubLabButton(text: "Destructive", variant: .destructive, onPress: {})
    }
    .padding()
}

#Preview("All Sizes") {
    VStack(spacing: 12) {
        HubLabButton(text: "Small", size: .sm, onPress: {})
        HubLabButton(text: "Medium", size: .md, onPress: {})
        HubLabButton(text: "Large", size: .lg, onPress: {})
    }
    .padding()
}

#Preview("With Icons") {
    VStack(spacing: 12) {
        HubLabButton(text: "Add Item", systemImage: "plus", onPress: {})
        HubLabButton(text: "Next", systemImage: "arrow.right", iconPosition: .trailing, onPress: {})
        HubLabButton(text: "Delete", variant: .destructive, systemImage: "trash", onPress: {})
    }
    .padding()
}
`
    },

    // ==========================================
    // Android - Jetpack Compose Nativo
    // ==========================================
    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3',
        'androidx.compose.ui:ui',
        'androidx.compose.ui:ui-tooling-preview'
      ],
      imports: [
        'androidx.compose.foundation.layout.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.graphics.vector.ImageVector',
        'androidx.compose.ui.tooling.preview.Preview',
        'androidx.compose.ui.unit.dp'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add

enum class ButtonVariant { Primary, Secondary, Outline, Ghost, Destructive }
enum class ButtonSize { Sm, Md, Lg }
enum class IconPosition { Leading, Trailing }

@Composable
fun HubLabButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Primary,
    size: ButtonSize = ButtonSize.Md,
    disabled: Boolean = false,
    loading: Boolean = false,
    icon: ImageVector? = null,
    iconPosition: IconPosition = IconPosition.Leading,
    fullWidth: Boolean = false
) {
    val isEnabled = !disabled && !loading

    val horizontalPadding = when (size) {
        ButtonSize.Sm -> 12.dp
        ButtonSize.Md -> 16.dp
        ButtonSize.Lg -> 24.dp
    }

    val verticalPadding = when (size) {
        ButtonSize.Sm -> 6.dp
        ButtonSize.Md -> 10.dp
        ButtonSize.Lg -> 14.dp
    }

    val textStyle = when (size) {
        ButtonSize.Sm -> MaterialTheme.typography.labelMedium
        ButtonSize.Md -> MaterialTheme.typography.labelLarge
        ButtonSize.Lg -> MaterialTheme.typography.titleMedium
    }

    val iconSize = when (size) {
        ButtonSize.Sm -> 16.dp
        ButtonSize.Md -> 20.dp
        ButtonSize.Lg -> 24.dp
    }

    val buttonColors = when (variant) {
        ButtonVariant.Primary -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.primary,
            contentColor = MaterialTheme.colorScheme.onPrimary
        )
        ButtonVariant.Secondary -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.secondary,
            contentColor = MaterialTheme.colorScheme.onSecondary
        )
        ButtonVariant.Outline -> ButtonDefaults.outlinedButtonColors(
            contentColor = MaterialTheme.colorScheme.primary
        )
        ButtonVariant.Ghost -> ButtonDefaults.textButtonColors(
            contentColor = MaterialTheme.colorScheme.primary
        )
        ButtonVariant.Destructive -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.error,
            contentColor = MaterialTheme.colorScheme.onError
        )
    }

    val buttonModifier = modifier
        .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
        .alpha(if (disabled) 0.5f else 1f)

    @Composable
    fun ButtonContent() {
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
        ) {
            if (loading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(iconSize),
                    strokeWidth = 2.dp,
                    color = LocalContentColor.current
                )
            } else {
                if (icon != null && iconPosition == IconPosition.Leading) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        modifier = Modifier.size(iconSize)
                    )
                }

                Text(
                    text = text,
                    style = textStyle
                )

                if (icon != null && iconPosition == IconPosition.Trailing) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        modifier = Modifier.size(iconSize)
                    )
                }
            }
        }
    }

    when (variant) {
        ButtonVariant.Outline -> {
            OutlinedButton(
                onClick = onClick,
                modifier = buttonModifier,
                enabled = isEnabled,
                colors = buttonColors,
                contentPadding = PaddingValues(
                    horizontal = horizontalPadding,
                    vertical = verticalPadding
                )
            ) {
                ButtonContent()
            }
        }
        ButtonVariant.Ghost -> {
            TextButton(
                onClick = onClick,
                modifier = buttonModifier,
                enabled = isEnabled,
                colors = buttonColors,
                contentPadding = PaddingValues(
                    horizontal = horizontalPadding,
                    vertical = verticalPadding
                )
            ) {
                ButtonContent()
            }
        }
        else -> {
            Button(
                onClick = onClick,
                modifier = buttonModifier,
                enabled = isEnabled,
                colors = buttonColors,
                contentPadding = PaddingValues(
                    horizontal = horizontalPadding,
                    vertical = verticalPadding
                )
            ) {
                ButtonContent()
            }
        }
    }
}

// ==========================================
// Previews
// ==========================================

@Preview(showBackground = true, name = "Primary Button")
@Composable
fun HubLabButtonPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            HubLabButton(text = "Primary", onClick = {})
            HubLabButton(text = "Disabled", disabled = true, onClick = {})
            HubLabButton(text = "Loading", loading = true, onClick = {})
        }
    }
}

@Preview(showBackground = true, name = "All Variants")
@Composable
fun HubLabButtonVariantsPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            HubLabButton(text = "Primary", variant = ButtonVariant.Primary, onClick = {})
            HubLabButton(text = "Secondary", variant = ButtonVariant.Secondary, onClick = {})
            HubLabButton(text = "Outline", variant = ButtonVariant.Outline, onClick = {})
            HubLabButton(text = "Ghost", variant = ButtonVariant.Ghost, onClick = {})
            HubLabButton(text = "Destructive", variant = ButtonVariant.Destructive, onClick = {})
        }
    }
}

@Preview(showBackground = true, name = "All Sizes")
@Composable
fun HubLabButtonSizesPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            HubLabButton(text = "Small", size = ButtonSize.Sm, onClick = {})
            HubLabButton(text = "Medium", size = ButtonSize.Md, onClick = {})
            HubLabButton(text = "Large", size = ButtonSize.Lg, onClick = {})
        }
    }
}

@Preview(showBackground = true, name = "With Icons")
@Composable
fun HubLabButtonIconsPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            HubLabButton(
                text = "Add Item",
                icon = Icons.Default.Add,
                onClick = {}
            )
            HubLabButton(
                text = "Full Width",
                fullWidth = true,
                onClick = {}
            )
        }
    }
}
`
    },

    // ==========================================
    // Desktop - Tauri (reutiliza Web)
    // ==========================================
    desktop: {
      framework: 'tauri',
      dependencies: ['react', '@tauri-apps/api', 'lucide-react'],
      targets: ['macos', 'windows', 'linux'],
      code: `
// Desktop usa la misma implementación web (React)
// Tauri renderiza React nativamente con WebView optimizado
// Las APIs nativas se acceden via @tauri-apps/api

import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  text: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'leading' | 'trailing'
  fullWidth?: boolean
  onPress: () => void
}

export function Button({
  text,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'leading',
  fullWidth = false,
  onPress
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const isDisabled = disabled || loading

  return (
    <button
      onClick={onPress}
      disabled={isDisabled}
      className={\`
        \${baseStyles}
        \${variants[variant]}
        \${sizes[size]}
        \${fullWidth ? 'w-full' : ''}
      \`}
    >
      {loading ? (
        <Loader2 className={\`\${iconSizes[size]} animate-spin\`} />
      ) : (
        <>
          {icon && iconPosition === 'leading' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
          <span>{text}</span>
          {icon && iconPosition === 'trailing' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
`
    }
  },

  children: false,
  preview: '/previews/button.png',
  documentation: '/docs/components/button'
}
