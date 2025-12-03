/**
 * PricingCard Capsule - Multi-Platform
 *
 * Tarjeta de precios para planes de suscripción
 */

import { CapsuleDefinition } from './types'

export const PricingCardCapsule: CapsuleDefinition = {
  id: 'pricing-card',
  name: 'Pricing Card',
  description: 'Tarjeta de precios para planes de suscripción',
  category: 'business',
  tags: ['pricing', 'subscription', 'saas', 'card'],
  version: '1.0.0',

  props: [
    {
      name: 'planName',
      type: 'string',
      required: true,
      description: 'Nombre del plan'
    },
    {
      name: 'price',
      type: 'string',
      required: true,
      description: 'Precio del plan (ej: $29)'
    },
    {
      name: 'period',
      type: 'string',
      required: false,
      default: '/month',
      description: 'Período de facturación'
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Descripción breve del plan'
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      description: 'Lista de características incluidas'
    },
    {
      name: 'highlighted',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Resaltar como plan recomendado'
    },
    {
      name: 'badge',
      type: 'string',
      required: false,
      description: 'Badge opcional (ej: "Popular", "Best Value")'
    },
    {
      name: 'buttonText',
      type: 'string',
      required: false,
      default: 'Get Started',
      description: 'Texto del botón CTA'
    },
    {
      name: 'onSelect',
      type: 'action',
      required: true,
      description: 'Acción al seleccionar el plan'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { Check } from 'lucide-react'

interface PricingCardProps {
  planName: string
  price: string
  period?: string
  description?: string
  features: string[]
  highlighted?: boolean
  badge?: string
  buttonText?: string
  onSelect: () => void
}

export function PricingCard({
  planName,
  price,
  period = '/month',
  description,
  features,
  highlighted = false,
  badge,
  buttonText = 'Get Started',
  onSelect
}: PricingCardProps) {
  return (
    <div className={\`relative rounded-2xl border p-8 \${
      highlighted
        ? 'border-blue-500 bg-blue-50 shadow-xl scale-105'
        : 'border-gray-200 bg-white'
    }\`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white">
          {badge}
        </div>
      )}

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{planName}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}

        <div className="mt-6">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-500">{period}</span>
        </div>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={\`mt-8 w-full rounded-xl py-3 font-medium transition-colors \${
          highlighted
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }\`}
      >
        {buttonText}
      </button>
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

struct PricingCard: View {
    let planName: String
    let price: String
    var period: String = "/month"
    var description: String?
    let features: [String]
    var highlighted: Bool = false
    var badge: String?
    var buttonText: String = "Get Started"
    let onSelect: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            if let badge = badge {
                Text(badge)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 6)
                    .background(Color.blue)
                    .clipShape(Capsule())
            }

            VStack(spacing: 4) {
                Text(planName)
                    .font(.headline)

                if let desc = description {
                    Text(desc)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                HStack(alignment: .firstTextBaseline, spacing: 2) {
                    Text(price)
                        .font(.system(size: 36, weight: .bold))
                    Text(period)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 16)
            }

            VStack(alignment: .leading, spacing: 12) {
                ForEach(features, id: \\.self) { feature in
                    HStack(spacing: 12) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                            .font(.caption)
                        Text(feature)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }

            Button(action: onSelect) {
                Text(buttonText)
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(highlighted ? Color.blue : Color.primary)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
        }
        .padding(24)
        .background(highlighted ? Color.blue.opacity(0.05) : Color(.systemBackground))
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(highlighted ? Color.blue : Color.gray.opacity(0.2), lineWidth: highlighted ? 2 : 1)
        )
        .scaleEffect(highlighted ? 1.02 : 1)
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
fun PricingCard(
    planName: String,
    price: String,
    period: String = "/month",
    description: String? = null,
    features: List<String>,
    highlighted: Boolean = false,
    badge: String? = null,
    buttonText: String = "Get Started",
    onSelect: () -> Unit
) {
    val scale = if (highlighted) 1.02f else 1f

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale),
        colors = CardDefaults.cardColors(
            containerColor = if (highlighted)
                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.1f)
            else MaterialTheme.colorScheme.surface
        ),
        border = BorderStroke(
            width = if (highlighted) 2.dp else 1.dp,
            color = if (highlighted)
                MaterialTheme.colorScheme.primary
            else MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
        )
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            badge?.let {
                Surface(
                    color = MaterialTheme.colorScheme.primary,
                    shape = RoundedCornerShape(50)
                ) {
                    Text(
                        text = it,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            Text(
                text = planName,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )

            description?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Row(
                verticalAlignment = Alignment.Bottom,
                modifier = Modifier.padding(top = 16.dp)
            ) {
                Text(
                    text = price,
                    style = MaterialTheme.typography.displaySmall,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = period,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                features.forEach { feature ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = Color(0xFF22C55E),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = feature,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = onSelect,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (highlighted)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurface
                )
            ) {
                Text(buttonText, modifier = Modifier.padding(vertical = 8.dp))
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
