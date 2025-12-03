/**
 * Testimonial Capsule - Multi-Platform
 *
 * Tarjeta de testimonio/review de clientes
 */

import { CapsuleDefinition } from './types'

export const TestimonialCapsule: CapsuleDefinition = {
  id: 'testimonial',
  name: 'Testimonial',
  description: 'Tarjeta de testimonio o review de clientes',
  category: 'marketing',
  tags: ['testimonial', 'review', 'social-proof', 'card'],
  version: '1.0.0',

  props: [
    {
      name: 'quote',
      type: 'string',
      required: true,
      description: 'Texto del testimonio'
    },
    {
      name: 'authorName',
      type: 'string',
      required: true,
      description: 'Nombre del autor'
    },
    {
      name: 'authorRole',
      type: 'string',
      required: false,
      description: 'Rol o título del autor'
    },
    {
      name: 'authorImage',
      type: 'string',
      required: false,
      description: 'URL de la imagen del autor'
    },
    {
      name: 'companyLogo',
      type: 'string',
      required: false,
      description: 'URL del logo de la empresa'
    },
    {
      name: 'rating',
      type: 'number',
      required: false,
      description: 'Rating de 1 a 5 estrellas'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'card',
      options: ['card', 'minimal', 'featured'],
      description: 'Estilo de la tarjeta'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { Star, Quote } from 'lucide-react'

interface TestimonialProps {
  quote: string
  authorName: string
  authorRole?: string
  authorImage?: string
  companyLogo?: string
  rating?: number
  variant?: 'card' | 'minimal' | 'featured'
}

export function Testimonial({
  quote,
  authorName,
  authorRole,
  authorImage,
  companyLogo,
  rating,
  variant = 'card'
}: TestimonialProps) {
  const renderStars = () => {
    if (!rating) return null
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={\`h-4 w-4 \${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}\`}
          />
        ))}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600 italic">"{quote}"</p>
        <div className="mt-4">
          <p className="font-semibold text-gray-900">{authorName}</p>
          {authorRole && <p className="text-sm text-gray-500">{authorRole}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
        <Quote className="absolute top-6 left-6 h-12 w-12 opacity-20" />
        {renderStars()}
        <p className="relative z-10 text-xl leading-relaxed">{quote}</p>
        <div className="mt-8 flex items-center gap-4">
          {authorImage && (
            <img src={authorImage} alt={authorName} className="h-14 w-14 rounded-full border-2 border-white" />
          )}
          <div>
            <p className="font-semibold">{authorName}</p>
            {authorRole && <p className="text-sm opacity-80">{authorRole}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {renderStars()}
      <p className="text-gray-600 leading-relaxed">"{quote}"</p>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {authorImage ? (
            <img src={authorImage} alt={authorName} className="h-12 w-12 rounded-full" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-600">
              {authorName.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{authorName}</p>
            {authorRole && <p className="text-sm text-gray-500">{authorRole}</p>}
          </div>
        </div>
        {companyLogo && (
          <img src={companyLogo} alt="Company" className="h-8 opacity-50" />
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

struct Testimonial: View {
    let quote: String
    let authorName: String
    var authorRole: String?
    var authorImage: String?
    var companyLogo: String?
    var rating: Int?
    var variant: TestimonialVariant = .card

    enum TestimonialVariant {
        case card, minimal, featured
    }

    var body: some View {
        switch variant {
        case .minimal:
            minimalView
        case .featured:
            featuredView
        case .card:
            cardView
        }
    }

    private var minimalView: some View {
        VStack(spacing: 16) {
            Text("\\(quote)")
                .italic()
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            VStack(spacing: 4) {
                Text(authorName).fontWeight(.semibold)
                if let role = authorRole {
                    Text(role).font(.caption).foregroundColor(.secondary)
                }
            }
        }
    }

    private var featuredView: some View {
        VStack(alignment: .leading, spacing: 16) {
            starsView
            Text(quote)
                .font(.title3)
                .foregroundColor(.white)
            HStack(spacing: 12) {
                if let imageUrl = authorImage {
                    AsyncImage(url: URL(string: imageUrl)) { image in
                        image.resizable().scaledToFill()
                    } placeholder: {
                        Circle().fill(Color.white.opacity(0.3))
                    }
                    .frame(width: 56, height: 56)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.white, lineWidth: 2))
                }
                VStack(alignment: .leading) {
                    Text(authorName).fontWeight(.semibold).foregroundColor(.white)
                    if let role = authorRole {
                        Text(role).font(.caption).foregroundColor(.white.opacity(0.8))
                    }
                }
            }
        }
        .padding(24)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [.blue, .purple]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(24)
    }

    private var cardView: some View {
        VStack(alignment: .leading, spacing: 16) {
            starsView
            Text("\\(quote)")
                .foregroundColor(.secondary)
            HStack {
                if let imageUrl = authorImage {
                    AsyncImage(url: URL(string: imageUrl)) { image in
                        image.resizable().scaledToFill()
                    } placeholder: {
                        Circle().fill(Color.gray.opacity(0.2))
                    }
                    .frame(width: 48, height: 48)
                    .clipShape(Circle())
                } else {
                    Circle()
                        .fill(Color.gray.opacity(0.2))
                        .frame(width: 48, height: 48)
                        .overlay(
                            Text(String(authorName.prefix(1)))
                                .fontWeight(.semibold)
                                .foregroundColor(.secondary)
                        )
                }
                VStack(alignment: .leading) {
                    Text(authorName).fontWeight(.semibold)
                    if let role = authorRole {
                        Text(role).font(.caption).foregroundColor(.secondary)
                    }
                }
                Spacer()
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)
    }

    @ViewBuilder
    private var starsView: some View {
        if let rating = rating {
            HStack(spacing: 4) {
                ForEach(1...5, id: \\.self) { star in
                    Image(systemName: star <= rating ? "star.fill" : "star")
                        .foregroundColor(.yellow)
                        .font(.caption)
                }
            }
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
fun Testimonial(
    quote: String,
    authorName: String,
    authorRole: String? = null,
    authorImage: String? = null,
    companyLogo: String? = null,
    rating: Int? = null,
    variant: TestimonialVariant = TestimonialVariant.Card
) {
    when (variant) {
        TestimonialVariant.Minimal -> MinimalTestimonial(quote, authorName, authorRole)
        TestimonialVariant.Featured -> FeaturedTestimonial(quote, authorName, authorRole, authorImage, rating)
        TestimonialVariant.Card -> CardTestimonial(quote, authorName, authorRole, authorImage, companyLogo, rating)
    }
}

enum class TestimonialVariant { Card, Minimal, Featured }

@Composable
private fun StarRating(rating: Int?) {
    rating?.let {
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            repeat(5) { index ->
                Icon(
                    imageVector = if (index < it) Icons.Filled.Star else Icons.Outlined.Star,
                    contentDescription = null,
                    tint = Color(0xFFFACC15),
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

@Composable
private fun CardTestimonial(
    quote: String,
    authorName: String,
    authorRole: String?,
    authorImage: String?,
    companyLogo: String?,
    rating: Int?
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            StarRating(rating)
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "\\"$quote\\"",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                authorImage?.let {
                    AsyncImage(
                        model = it,
                        contentDescription = authorName,
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                }
                Column {
                    Text(authorName, fontWeight = FontWeight.SemiBold)
                    authorRole?.let {
                        Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
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
