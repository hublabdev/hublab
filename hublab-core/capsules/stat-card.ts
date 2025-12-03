/**
 * StatCard Capsule - Multi-Platform
 *
 * Tarjeta de estadísticas para dashboards
 */

import { CapsuleDefinition } from './types'

export const StatCardCapsule: CapsuleDefinition = {
  id: 'stat-card',
  name: 'Stat Card',
  description: 'Tarjeta de estadísticas para métricas y KPIs',
  category: 'data',
  tags: ['stats', 'metrics', 'dashboard', 'analytics', 'kpi'],
  version: '1.0.0',

  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Título de la métrica'
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'Valor principal'
    },
    {
      name: 'change',
      type: 'number',
      required: false,
      description: 'Cambio porcentual (+/-)'
    },
    {
      name: 'changeLabel',
      type: 'string',
      required: false,
      default: 'vs last period',
      description: 'Etiqueta del cambio'
    },
    {
      name: 'icon',
      type: 'icon',
      required: false,
      description: 'Icono de la métrica'
    },
    {
      name: 'trend',
      type: 'select',
      required: false,
      options: ['up', 'down', 'neutral'],
      description: 'Dirección de la tendencia'
    },
    {
      name: 'color',
      type: 'select',
      required: false,
      default: 'blue',
      options: ['blue', 'green', 'purple', 'orange', 'red'],
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
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, ShoppingCart, Eye } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
}

const iconMap: Record<string, React.ElementType> = {
  dollar: DollarSign,
  users: Users,
  cart: ShoppingCart,
  eye: Eye,
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  trend,
  color = 'blue'
}: StatCardProps) {
  const IconComponent = icon ? iconMap[icon] || DollarSign : null
  const isPositive = trend === 'up' || (change !== undefined && change > 0)
  const isNegative = trend === 'down' || (change !== undefined && change < 0)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

          {change !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <div className={\`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium \${
                isPositive ? 'bg-green-50 text-green-600' :
                isNegative ? 'bg-red-50 text-red-600' :
                'bg-gray-50 text-gray-600'
              }\`}>
                {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                {!isPositive && !isNegative && <Minus className="h-3.5 w-3.5" />}
                {change > 0 ? '+' : ''}{change}%
              </div>
              <span className="text-sm text-gray-400">{changeLabel}</span>
            </div>
          )}
        </div>

        {IconComponent && (
          <div className={\`rounded-xl p-3 \${colorClasses[color]}\`}>
            <IconComponent className="h-6 w-6" />
          </div>
        )}
      </div>
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

struct StatCard: View {
    let title: String
    let value: String
    var change: Double?
    var changeLabel: String = "vs last period"
    var icon: String?
    var trend: TrendDirection?
    var color: StatColor = .blue

    enum TrendDirection { case up, down, neutral }
    enum StatColor {
        case blue, green, purple, orange, red

        var color: Color {
            switch self {
            case .blue: return .blue
            case .green: return .green
            case .purple: return .purple
            case .orange: return .orange
            case .red: return .red
            }
        }
    }

    private var isPositive: Bool {
        trend == .up || (change ?? 0) > 0
    }

    private var isNegative: Bool {
        trend == .down || (change ?? 0) < 0
    }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 8) {
                Text(title)
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                Text(value)
                    .font(.system(size: 28, weight: .bold))

                if let change = change {
                    HStack(spacing: 8) {
                        HStack(spacing: 4) {
                            Image(systemName: isPositive ? "arrow.up.right" : isNegative ? "arrow.down.right" : "minus")
                                .font(.caption2)
                            Text(String(format: "%+.1f%%", change))
                                .font(.caption)
                                .fontWeight(.medium)
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(isPositive ? Color.green.opacity(0.1) : isNegative ? Color.red.opacity(0.1) : Color.gray.opacity(0.1))
                        )
                        .foregroundColor(isPositive ? .green : isNegative ? .red : .secondary)

                        Text(changeLabel)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }

            Spacer()

            if let iconName = icon {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(color.color.opacity(0.1))
                        .frame(width: 48, height: 48)
                    Image(systemName: iconName)
                        .font(.title2)
                        .foregroundColor(color.color)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
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
fun StatCard(
    title: String,
    value: String,
    change: Float? = null,
    changeLabel: String = "vs last period",
    icon: ImageVector? = null,
    trend: TrendDirection? = null,
    color: StatColor = StatColor.Blue
) {
    val isPositive = trend == TrendDirection.Up || (change ?: 0f) > 0
    val isNegative = trend == TrendDirection.Down || (change ?: 0f) < 0

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = value,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )

                change?.let {
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            color = when {
                                isPositive -> Color(0xFF22C55E).copy(alpha = 0.1f)
                                isNegative -> Color(0xFFEF4444).copy(alpha = 0.1f)
                                else -> MaterialTheme.colorScheme.surfaceVariant
                            },
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = when {
                                        isPositive -> Icons.Default.TrendingUp
                                        isNegative -> Icons.Default.TrendingDown
                                        else -> Icons.Default.Remove
                                    },
                                    contentDescription = null,
                                    modifier = Modifier.size(14.dp),
                                    tint = when {
                                        isPositive -> Color(0xFF22C55E)
                                        isNegative -> Color(0xFFEF4444)
                                        else -> MaterialTheme.colorScheme.onSurfaceVariant
                                    }
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "%+.1f%%".format(it),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = when {
                                        isPositive -> Color(0xFF22C55E)
                                        isNegative -> Color(0xFFEF4444)
                                        else -> MaterialTheme.colorScheme.onSurfaceVariant
                                    }
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = changeLabel,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            icon?.let {
                Surface(
                    color = color.color.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.size(48.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = it,
                            contentDescription = null,
                            tint = color.color,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
            }
        }
    }
}

enum class TrendDirection { Up, Down, Neutral }
enum class StatColor(val color: Color) {
    Blue(Color(0xFF3B82F6)),
    Green(Color(0xFF22C55E)),
    Purple(Color(0xFF8B5CF6)),
    Orange(Color(0xFFF97316)),
    Red(Color(0xFFEF4444))
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
