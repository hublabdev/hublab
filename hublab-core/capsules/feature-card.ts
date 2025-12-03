/**
 * FeatureCard Capsule - Multi-Platform
 *
 * Tarjeta de características para landing pages
 */

import { CapsuleDefinition } from './types'

export const FeatureCardCapsule: CapsuleDefinition = {
  id: 'feature-card',
  name: 'Feature Card',
  description: 'Tarjeta para mostrar características de producto',
  category: 'marketing',
  tags: ['feature', 'landing', 'marketing', 'card'],
  version: '1.0.0',

  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Título de la característica'
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Descripción de la característica'
    },
    {
      name: 'icon',
      type: 'icon',
      required: false,
      description: 'Icono representativo'
    },
    {
      name: 'image',
      type: 'string',
      required: false,
      description: 'URL de imagen ilustrativa'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'default',
      options: ['default', 'horizontal', 'centered', 'bordered'],
      description: 'Variante de estilo'
    },
    {
      name: 'color',
      type: 'select',
      required: false,
      default: 'blue',
      options: ['blue', 'green', 'purple', 'orange', 'pink'],
      description: 'Color de acento'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { Zap, Shield, Rocket, Star, Heart } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon?: string
  image?: string
  variant?: 'default' | 'horizontal' | 'centered' | 'bordered'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
}

const colorClasses = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', gradient: 'from-pink-500 to-pink-600' },
}

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  shield: Shield,
  rocket: Rocket,
  star: Star,
  heart: Heart,
}

export function FeatureCard({
  title,
  description,
  icon,
  image,
  variant = 'default',
  color = 'blue'
}: FeatureCardProps) {
  const IconComponent = icon ? iconMap[icon] || Zap : null
  const colors = colorClasses[color]

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-6 p-6 rounded-2xl bg-white border border-gray-100">
        {IconComponent && (
          <div className={\`flex-shrink-0 w-14 h-14 rounded-xl \${colors.bg} flex items-center justify-center\`}>
            <IconComponent className={\`h-7 w-7 \${colors.text}\`} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
    )
  }

  if (variant === 'centered') {
    return (
      <div className="text-center p-8 rounded-2xl bg-white border border-gray-100">
        {IconComponent && (
          <div className={\`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br \${colors.gradient} flex items-center justify-center mb-6\`}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-3 text-gray-600">{description}</p>
      </div>
    )
  }

  if (variant === 'bordered') {
    return (
      <div className={\`p-6 rounded-2xl border-2 border-l-4 border-l-\${color}-500 bg-white\`}>
        <div className="flex items-center gap-3 mb-3">
          {IconComponent && <IconComponent className={\`h-5 w-5 \${colors.text}\`} />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
      {image ? (
        <img src={image} alt={title} className="w-full h-40 object-cover rounded-xl mb-4" />
      ) : IconComponent && (
        <div className={\`w-12 h-12 rounded-xl \${colors.bg} flex items-center justify-center mb-4\`}>
          <IconComponent className={\`h-6 w-6 \${colors.text}\`} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
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

struct FeatureCard: View {
    let title: String
    let description: String
    var icon: String?
    var image: String?
    var variant: FeatureVariant = .default
    var color: FeatureColor = .blue

    enum FeatureVariant { case \`default\`, horizontal, centered, bordered }
    enum FeatureColor {
        case blue, green, purple, orange, pink
        var color: Color {
            switch self {
            case .blue: return .blue
            case .green: return .green
            case .purple: return .purple
            case .orange: return .orange
            case .pink: return .pink
            }
        }
    }

    var body: some View {
        switch variant {
        case .horizontal: horizontalView
        case .centered: centeredView
        case .bordered: borderedView
        case .default: defaultView
        }
    }

    private var defaultView: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let imageUrl = image {
                AsyncImage(url: URL(string: imageUrl)) { img in
                    img.resizable().scaledToFill()
                } placeholder: {
                    Rectangle().fill(Color.gray.opacity(0.1))
                }
                .frame(height: 160)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            } else if let iconName = icon {
                iconView(iconName)
            }

            Text(title)
                .font(.headline)

            Text(description)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }

    private var horizontalView: some View {
        HStack(alignment: .top, spacing: 16) {
            if let iconName = icon {
                iconView(iconName)
            }
            VStack(alignment: .leading, spacing: 8) {
                Text(title).font(.headline)
                Text(description).font(.subheadline).foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    private var centeredView: some View {
        VStack(spacing: 16) {
            if let iconName = icon {
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(LinearGradient(
                            colors: [color.color, color.color.opacity(0.8)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                        .frame(width: 64, height: 64)
                    Image(systemName: iconName)
                        .font(.title)
                        .foregroundColor(.white)
                }
            }
            Text(title).font(.title3).fontWeight(.semibold)
            Text(description).font(.subheadline).foregroundColor(.secondary).multilineTextAlignment(.center)
        }
        .padding(24)
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    private var borderedView: some View {
        HStack(alignment: .top) {
            Rectangle()
                .fill(color.color)
                .frame(width: 4)
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 8) {
                    if let iconName = icon {
                        Image(systemName: iconName)
                            .foregroundColor(color.color)
                    }
                    Text(title).font(.headline)
                }
                Text(description).font(.subheadline).foregroundColor(.secondary)
            }
            .padding()
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
    }

    private func iconView(_ name: String) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(color.color.opacity(0.1))
                .frame(width: 48, height: 48)
            Image(systemName: name)
                .font(.title3)
                .foregroundColor(color.color)
        }
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
fun FeatureCard(
    title: String,
    description: String,
    icon: ImageVector? = null,
    image: String? = null,
    variant: FeatureVariant = FeatureVariant.Default,
    color: FeatureColor = FeatureColor.Blue
) {
    when (variant) {
        FeatureVariant.Default -> DefaultFeatureCard(title, description, icon, image, color)
        FeatureVariant.Horizontal -> HorizontalFeatureCard(title, description, icon, color)
        FeatureVariant.Centered -> CenteredFeatureCard(title, description, icon, color)
        FeatureVariant.Bordered -> BorderedFeatureCard(title, description, icon, color)
    }
}

enum class FeatureVariant { Default, Horizontal, Centered, Bordered }
enum class FeatureColor(val color: Color) {
    Blue(Color(0xFF3B82F6)),
    Green(Color(0xFF22C55E)),
    Purple(Color(0xFF8B5CF6)),
    Orange(Color(0xFFF97316)),
    Pink(Color(0xFFEC4899))
}

@Composable
private fun DefaultFeatureCard(
    title: String,
    description: String,
    icon: ImageVector?,
    image: String?,
    color: FeatureColor
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            image?.let {
                AsyncImage(
                    model = it,
                    contentDescription = title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                )
                Spacer(modifier = Modifier.height(12.dp))
            } ?: icon?.let {
                Surface(
                    color = color.color.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.size(48.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(it, null, tint = color.color)
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
            }
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(8.dp))
            Text(description, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun HorizontalFeatureCard(title: String, description: String, icon: ImageVector?, color: FeatureColor) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.Top) {
            icon?.let {
                Surface(
                    color = color.color.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.size(56.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(it, null, tint = color.color, modifier = Modifier.size(28.dp))
                    }
                }
                Spacer(modifier = Modifier.width(16.dp))
            }
            Column {
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(4.dp))
                Text(description, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react', 'lucide-react'],
      code: `// Same as web implementation`
    }
  }
}
