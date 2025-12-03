/**
 * EmptyState Capsule - Multi-Platform
 *
 * Estado vacío para cuando no hay datos que mostrar
 */

import { CapsuleDefinition } from './types'

export const EmptyStateCapsule: CapsuleDefinition = {
  id: 'empty-state',
  name: 'Empty State',
  description: 'Componente para mostrar cuando no hay datos disponibles',
  category: 'feedback',
  tags: ['empty', 'placeholder', 'no-data', 'feedback'],
  version: '1.0.0',

  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Título principal'
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Descripción secundaria'
    },
    {
      name: 'icon',
      type: 'icon',
      required: false,
      description: 'Icono ilustrativo'
    },
    {
      name: 'image',
      type: 'string',
      required: false,
      description: 'URL de imagen ilustrativa'
    },
    {
      name: 'actionText',
      type: 'string',
      required: false,
      description: 'Texto del botón de acción'
    },
    {
      name: 'onAction',
      type: 'action',
      required: false,
      description: 'Acción del botón'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'default',
      options: ['default', 'compact', 'fullscreen'],
      description: 'Variante de tamaño'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { Inbox, Search, FileX, AlertCircle, Plus } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
  image?: string
  actionText?: string
  onAction?: () => void
  variant?: 'default' | 'compact' | 'fullscreen'
}

const iconMap: Record<string, React.ElementType> = {
  inbox: Inbox,
  search: Search,
  file: FileX,
  alert: AlertCircle,
  plus: Plus,
}

export function EmptyState({
  title,
  description,
  icon,
  image,
  actionText,
  onAction,
  variant = 'default'
}: EmptyStateProps) {
  const IconComponent = icon ? iconMap[icon] || Inbox : Inbox

  const content = (
    <>
      {image ? (
        <img src={image} alt="" className="w-48 h-48 object-contain mx-auto mb-6" />
      ) : (
        <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <IconComponent className="h-10 w-10 text-gray-400" />
        </div>
      )}

      <h3 className={\`font-semibold text-gray-900 \${variant === 'compact' ? 'text-base' : 'text-xl'}\`}>
        {title}
      </h3>

      {description && (
        <p className={\`mt-2 text-gray-500 max-w-sm mx-auto \${variant === 'compact' ? 'text-sm' : 'text-base'}\`}>
          {description}
        </p>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {actionText}
        </button>
      )}
    </>
  )

  if (variant === 'fullscreen') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        {content}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="py-8 text-center">
        {content}
      </div>
    )
  }

  return (
    <div className="py-16 text-center">
      {content}
    </div>
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

struct EmptyState: View {
    let title: String
    var description: String?
    var icon: String?
    var image: String?
    var actionText: String?
    var onAction: (() -> Void)?
    var variant: EmptyStateVariant = .default

    enum EmptyStateVariant { case \`default\`, compact, fullscreen }

    var body: some View {
        VStack(spacing: variant == .compact ? 12 : 16) {
            if let imageUrl = image {
                AsyncImage(url: URL(string: imageUrl)) { img in
                    img.resizable().scaledToFit()
                } placeholder: {
                    Color.gray.opacity(0.1)
                }
                .frame(width: 192, height: 192)
            } else {
                ZStack {
                    Circle()
                        .fill(Color.gray.opacity(0.1))
                        .frame(width: variant == .compact ? 60 : 80, height: variant == .compact ? 60 : 80)
                    Image(systemName: icon ?? "tray")
                        .font(variant == .compact ? .title2 : .largeTitle)
                        .foregroundColor(.secondary)
                }
            }

            Text(title)
                .font(variant == .compact ? .headline : .title3)
                .fontWeight(.semibold)

            if let desc = description {
                Text(desc)
                    .font(variant == .compact ? .caption : .subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 300)
            }

            if let buttonText = actionText, let action = onAction {
                Button(action: action) {
                    HStack(spacing: 8) {
                        Image(systemName: "plus")
                        Text(buttonText)
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(Color.blue)
                    .cornerRadius(12)
                }
                .padding(.top, 8)
            }
        }
        .padding(variant == .compact ? 24 : 48)
        .frame(maxWidth: .infinity)
        .frame(minHeight: variant == .fullscreen ? UIScreen.main.bounds.height * 0.6 : nil)
    }
}
`
    },
    android: {
      framework: 'compose',
      minimumVersion: '1.0.0',
      dependencies: ['androidx.compose.material3:material3', 'coil-compose'],
      code: `
@Composable
fun EmptyState(
    title: String,
    description: String? = null,
    icon: ImageVector = Icons.Default.Inbox,
    image: String? = null,
    actionText: String? = null,
    onAction: (() -> Unit)? = null,
    variant: EmptyStateVariant = EmptyStateVariant.Default
) {
    val verticalPadding = when (variant) {
        EmptyStateVariant.Compact -> 24.dp
        EmptyStateVariant.Fullscreen -> 48.dp
        EmptyStateVariant.Default -> 48.dp
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .then(
                if (variant == EmptyStateVariant.Fullscreen)
                    Modifier.fillMaxHeight(0.6f)
                else Modifier
            )
            .padding(vertical = verticalPadding),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            image?.let {
                AsyncImage(
                    model = it,
                    contentDescription = null,
                    modifier = Modifier.size(192.dp),
                    contentScale = ContentScale.Fit
                )
            } ?: run {
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    shape = CircleShape,
                    modifier = Modifier.size(if (variant == EmptyStateVariant.Compact) 60.dp else 80.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            modifier = Modifier.size(if (variant == EmptyStateVariant.Compact) 28.dp else 40.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = title,
                style = if (variant == EmptyStateVariant.Compact)
                    MaterialTheme.typography.titleMedium
                else MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold
            )

            description?.let {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = it,
                    style = if (variant == EmptyStateVariant.Compact)
                        MaterialTheme.typography.bodySmall
                    else MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.widthIn(max = 300.dp)
                )
            }

            actionText?.let { text ->
                onAction?.let { action ->
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(
                        onClick = action,
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp)
                    ) {
                        Icon(Icons.Default.Add, null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text)
                    }
                }
            }
        }
    }
}

enum class EmptyStateVariant { Default, Compact, Fullscreen }
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react', 'lucide-react'],
      code: `// Same as web implementation`
    }
  }
}
