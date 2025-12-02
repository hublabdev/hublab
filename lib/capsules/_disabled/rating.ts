/**
 * Rating Capsule
 *
 * Star rating component for reviews and feedback.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const RatingCapsule: CapsuleDefinition = {
  id: 'rating',
  name: 'Rating',
  description: 'Star rating component for reviews and feedback',
  category: 'input',
  tags: ['rating', 'stars', 'review', 'feedback', 'score'],

  props: {
    value: {
      type: 'number',
      default: 0,
      description: 'Current rating value'
    },
    maxValue: {
      type: 'number',
      default: 5,
      description: 'Maximum rating value'
    },
    size: {
      type: 'string',
      default: 'md',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the stars'
    },
    variant: {
      type: 'string',
      default: 'star',
      options: ['star', 'heart', 'circle', 'custom'],
      description: 'Icon variant for rating'
    },
    color: {
      type: 'string',
      default: 'yellow',
      description: 'Color of filled icons'
    },
    emptyColor: {
      type: 'string',
      default: 'gray',
      description: 'Color of empty icons'
    },
    allowHalf: {
      type: 'boolean',
      default: false,
      description: 'Allow half-star ratings'
    },
    readOnly: {
      type: 'boolean',
      default: false,
      description: 'Make rating read-only'
    },
    showValue: {
      type: 'boolean',
      default: false,
      description: 'Show numeric value'
    },
    showCount: {
      type: 'boolean',
      default: false,
      description: 'Show review count'
    },
    count: {
      type: 'number',
      default: 0,
      description: 'Number of reviews'
    },
    precision: {
      type: 'number',
      default: 1,
      description: 'Rating precision (1 or 0.5)'
    },
    onChange: {
      type: 'function',
      description: 'Callback when rating changes'
    }
  },

  platforms: {
    web: {
      dependencies: ['react', 'lucide-react'],
      code: `
import React, { useState, useCallback, useMemo } from 'react'
import { Star, Heart, Circle } from 'lucide-react'

interface RatingProps {
  value?: number
  maxValue?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'star' | 'heart' | 'circle' | 'custom'
  color?: string
  emptyColor?: string
  allowHalf?: boolean
  readOnly?: boolean
  showValue?: boolean
  showCount?: boolean
  count?: number
  precision?: number
  onChange?: (value: number) => void
  customIcon?: React.ReactNode
  className?: string
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32
}

const colorMap: Record<string, string> = {
  yellow: '#fbbf24',
  orange: '#f97316',
  red: '#ef4444',
  pink: '#ec4899',
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#22c55e'
}

export function Rating({
  value = 0,
  maxValue = 5,
  size = 'md',
  variant = 'star',
  color = 'yellow',
  emptyColor = 'gray',
  allowHalf = false,
  readOnly = false,
  showValue = false,
  showCount = false,
  count = 0,
  precision = 1,
  onChange,
  customIcon,
  className = ''
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const iconSize = sizeMap[size]
  const fillColor = colorMap[color] || color
  const emptyColorValue = colorMap[emptyColor] || '#d1d5db'

  const displayValue = hoverValue !== null ? hoverValue : value

  const getIcon = useCallback((filled: boolean, half: boolean = false) => {
    const iconProps = {
      size: iconSize,
      fill: filled ? fillColor : 'none',
      stroke: filled ? fillColor : emptyColorValue,
      strokeWidth: 1.5
    }

    if (half) {
      return (
        <div className="relative" style={{ width: iconSize, height: iconSize }}>
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            {variant === 'star' && <Star {...iconProps} fill={fillColor} stroke={fillColor} />}
            {variant === 'heart' && <Heart {...iconProps} fill={fillColor} stroke={fillColor} />}
            {variant === 'circle' && <Circle {...iconProps} fill={fillColor} stroke={fillColor} />}
          </div>
          <div className="absolute inset-0">
            {variant === 'star' && <Star size={iconSize} fill="none" stroke={emptyColorValue} strokeWidth={1.5} />}
            {variant === 'heart' && <Heart size={iconSize} fill="none" stroke={emptyColorValue} strokeWidth={1.5} />}
            {variant === 'circle' && <Circle size={iconSize} fill="none" stroke={emptyColorValue} strokeWidth={1.5} />}
          </div>
        </div>
      )
    }

    if (customIcon && variant === 'custom') {
      return customIcon
    }

    switch (variant) {
      case 'heart':
        return <Heart {...iconProps} />
      case 'circle':
        return <Circle {...iconProps} />
      default:
        return <Star {...iconProps} />
    }
  }, [variant, iconSize, fillColor, emptyColorValue, customIcon])

  const handleClick = useCallback((index: number, isHalf: boolean = false) => {
    if (readOnly) return
    const newValue = isHalf && allowHalf ? index + 0.5 : index + 1
    onChange?.(newValue)
  }, [readOnly, allowHalf, onChange])

  const handleMouseMove = useCallback((index: number, event: React.MouseEvent) => {
    if (readOnly) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const isHalf = allowHalf && x < rect.width / 2
    setHoverValue(isHalf ? index + 0.5 : index + 1)
  }, [readOnly, allowHalf])

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null)
  }, [])

  const stars = useMemo(() => {
    return Array.from({ length: maxValue }, (_, index) => {
      const isFilled = displayValue >= index + 1
      const isHalf = !isFilled && displayValue > index && displayValue < index + 1

      return (
        <button
          key={index}
          type="button"
          disabled={readOnly}
          className={\`
            transition-transform duration-150
            \${!readOnly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
            rounded
          \`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const isHalfClick = allowHalf && x < rect.width / 2
            handleClick(index, isHalfClick)
          }}
          onMouseMove={(e) => handleMouseMove(index, e)}
          onMouseLeave={handleMouseLeave}
          aria-label={\`Rate \${index + 1} out of \${maxValue}\`}
        >
          {getIcon(isFilled, isHalf)}
        </button>
      )
    })
  }, [maxValue, displayValue, readOnly, allowHalf, getIcon, handleClick, handleMouseMove, handleMouseLeave])

  return (
    <div className={\`inline-flex items-center gap-1 \${className}\`}>
      <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Rating">
        {stars}
      </div>

      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {value.toFixed(precision === 0.5 ? 1 : 0)}
        </span>
      )}

      {showCount && count > 0 && (
        <span className="ml-1 text-sm text-gray-500">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}

// Controlled Rating with State
export function RatingInput({
  defaultValue = 0,
  label,
  helperText,
  required = false,
  error,
  ...props
}: RatingProps & {
  defaultValue?: number
  label?: string
  helperText?: string
  required?: boolean
  error?: string
}) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Rating
        value={value}
        onChange={setValue}
        {...props}
      />

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// Rating Display with Reviews Summary
export function RatingDisplay({
  value,
  totalReviews,
  distribution,
  showDistribution = true
}: {
  value: number
  totalReviews: number
  distribution?: { stars: number; count: number }[]
  showDistribution?: boolean
}) {
  const maxCount = distribution
    ? Math.max(...distribution.map(d => d.count))
    : 0

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Overall Rating */}
      <div className="text-center sm:text-left">
        <div className="text-5xl font-bold text-gray-900">
          {value.toFixed(1)}
        </div>
        <Rating value={value} readOnly size="lg" className="mt-2" />
        <div className="mt-1 text-sm text-gray-500">
          {totalReviews.toLocaleString()} reviews
        </div>
      </div>

      {/* Distribution */}
      {showDistribution && distribution && (
        <div className="flex-1 space-y-2">
          {distribution.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-6">{stars}</span>
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: maxCount > 0 ? \`\${(count / maxCount) * 100}%\` : '0%' }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">
                {count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Emoji Rating
export function EmojiRating({
  value = 0,
  onChange,
  readOnly = false,
  labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']
}: {
  value?: number
  onChange?: (value: number) => void
  readOnly?: boolean
  labels?: string[]
}) {
  const emojis = ['😞', '😕', '😐', '🙂', '😄']
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const displayIndex = hoverIndex !== null ? hoverIndex : value - 1

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            className={\`
              text-3xl transition-all duration-150
              \${!readOnly ? 'cursor-pointer hover:scale-125' : 'cursor-default'}
              \${value === index + 1 ? 'scale-125' : 'grayscale opacity-50'}
              \${!readOnly && 'hover:grayscale-0 hover:opacity-100'}
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
              rounded-full
            \`}
            onClick={() => !readOnly && onChange?.(index + 1)}
            onMouseEnter={() => !readOnly && setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            aria-label={labels[index]}
          >
            {emoji}
          </button>
        ))}
      </div>

      {displayIndex >= 0 && displayIndex < labels.length && (
        <span className="text-sm font-medium text-gray-600">
          {labels[displayIndex]}
        </span>
      )}
    </div>
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Rating View
struct RatingView: View {
    @Binding var rating: Double
    var maxRating: Int = 5
    var size: RatingSize = .medium
    var variant: RatingVariant = .star
    var filledColor: Color = .yellow
    var emptyColor: Color = .gray.opacity(0.3)
    var allowHalf: Bool = false
    var readOnly: Bool = false
    var showValue: Bool = false
    var showCount: Bool = false
    var count: Int = 0
    var spacing: CGFloat = 4

    enum RatingSize {
        case extraSmall, small, medium, large, extraLarge

        var iconSize: CGFloat {
            switch self {
            case .extraSmall: return 12
            case .small: return 16
            case .medium: return 20
            case .large: return 24
            case .extraLarge: return 32
            }
        }
    }

    enum RatingVariant {
        case star
        case heart
        case circle
    }

    var body: some View {
        HStack(spacing: spacing) {
            HStack(spacing: 2) {
                ForEach(1...maxRating, id: \\.self) { index in
                    ratingIcon(for: index)
                        .onTapGesture {
                            if !readOnly {
                                withAnimation(.easeInOut(duration: 0.15)) {
                                    rating = Double(index)
                                }
                            }
                        }
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { value in
                                    if !readOnly && allowHalf {
                                        let location = value.location.x
                                        let isHalf = location < size.iconSize / 2
                                        withAnimation(.easeInOut(duration: 0.1)) {
                                            rating = isHalf ? Double(index) - 0.5 : Double(index)
                                        }
                                    }
                                }
                        )
                }
            }

            if showValue {
                Text(String(format: allowHalf ? "%.1f" : "%.0f", rating))
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
            }

            if showCount && count > 0 {
                Text("(\\(count))")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
    }

    @ViewBuilder
    private func ratingIcon(for index: Int) -> some View {
        let isFilled = rating >= Double(index)
        let isHalf = !isFilled && rating >= Double(index) - 0.5

        ZStack {
            iconImage(filled: false)
                .foregroundColor(emptyColor)

            if isFilled {
                iconImage(filled: true)
                    .foregroundColor(filledColor)
            } else if isHalf {
                iconImage(filled: true)
                    .foregroundColor(filledColor)
                    .mask(
                        HStack(spacing: 0) {
                            Rectangle()
                            Color.clear
                        }
                    )
            }
        }
        .frame(width: size.iconSize, height: size.iconSize)
        .scaleEffect(readOnly ? 1.0 : 1.0)
        .animation(.spring(response: 0.2), value: rating)
    }

    @ViewBuilder
    private func iconImage(filled: Bool) -> some View {
        switch variant {
        case .star:
            Image(systemName: filled ? "star.fill" : "star")
                .resizable()
                .aspectRatio(contentMode: .fit)
        case .heart:
            Image(systemName: filled ? "heart.fill" : "heart")
                .resizable()
                .aspectRatio(contentMode: .fit)
        case .circle:
            Image(systemName: filled ? "circle.fill" : "circle")
                .resizable()
                .aspectRatio(contentMode: .fit)
        }
    }
}

// MARK: - Interactive Rating Input
struct RatingInput: View {
    @Binding var rating: Double
    var label: String?
    var helperText: String?
    var required: Bool = false
    var errorMessage: String?
    var maxRating: Int = 5
    var size: RatingView.RatingSize = .large
    var variant: RatingView.RatingVariant = .star
    var filledColor: Color = .yellow

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let label = label {
                HStack(spacing: 4) {
                    Text(label)
                        .font(.subheadline)
                        .fontWeight(.medium)

                    if required {
                        Text("*")
                            .foregroundColor(.red)
                    }
                }
            }

            RatingView(
                rating: $rating,
                maxRating: maxRating,
                size: size,
                variant: variant,
                filledColor: filledColor,
                readOnly: false
            )

            if let error = errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            } else if let helper = helperText {
                Text(helper)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

// MARK: - Rating Display with Distribution
struct RatingDisplay: View {
    var averageRating: Double
    var totalReviews: Int
    var distribution: [(stars: Int, count: Int)]
    var showDistribution: Bool = true

    var body: some View {
        HStack(alignment: .top, spacing: 24) {
            // Overall Rating
            VStack(spacing: 8) {
                Text(String(format: "%.1f", averageRating))
                    .font(.system(size: 48, weight: .bold))

                RatingView(
                    rating: .constant(averageRating),
                    size: .large,
                    filledColor: .yellow,
                    readOnly: true
                )

                Text("\\(totalReviews) reviews")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            // Distribution
            if showDistribution {
                VStack(spacing: 6) {
                    ForEach(distribution.sorted(by: { $0.stars > $1.stars }), id: \\.stars) { item in
                        HStack(spacing: 8) {
                            Text("\\(item.stars)")
                                .font(.caption)
                                .frame(width: 12)

                            Image(systemName: "star.fill")
                                .font(.caption)
                                .foregroundColor(.yellow)

                            GeometryReader { geometry in
                                let maxCount = distribution.map { $0.count }.max() ?? 1
                                let width = geometry.size.width * CGFloat(item.count) / CGFloat(maxCount)

                                ZStack(alignment: .leading) {
                                    RoundedRectangle(cornerRadius: 2)
                                        .fill(Color.gray.opacity(0.2))

                                    RoundedRectangle(cornerRadius: 2)
                                        .fill(Color.yellow)
                                        .frame(width: max(0, width))
                                }
                            }
                            .frame(height: 8)

                            Text("\\(item.count)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .frame(width: 40, alignment: .trailing)
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Emoji Rating
struct EmojiRating: View {
    @Binding var rating: Int
    var readOnly: Bool = false
    var labels: [String] = ["Terrible", "Bad", "Okay", "Good", "Amazing"]

    private let emojis = ["😞", "😕", "😐", "🙂", "😄"]
    @State private var hoverIndex: Int? = nil

    var displayIndex: Int {
        (hoverIndex ?? rating) - 1
    }

    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 16) {
                ForEach(0..<emojis.count, id: \\.self) { index in
                    Text(emojis[index])
                        .font(.system(size: 36))
                        .scaleEffect(rating == index + 1 ? 1.3 : 1.0)
                        .opacity(rating == index + 1 ? 1.0 : 0.4)
                        .grayscale(rating == index + 1 ? 0 : 0.8)
                        .animation(.spring(response: 0.3), value: rating)
                        .onTapGesture {
                            if !readOnly {
                                withAnimation {
                                    rating = index + 1
                                }
                            }
                        }
                }
            }

            if displayIndex >= 0 && displayIndex < labels.count {
                Text(labels[displayIndex])
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.secondary)
                    .animation(.easeInOut, value: displayIndex)
            }
        }
    }
}

// MARK: - Thumb Rating (Like/Dislike)
struct ThumbRating: View {
    @Binding var value: Int? // nil = no selection, 1 = like, -1 = dislike
    var likeCount: Int = 0
    var dislikeCount: Int = 0
    var showCounts: Bool = true
    var readOnly: Bool = false

    var body: some View {
        HStack(spacing: 16) {
            // Like Button
            Button {
                if !readOnly {
                    withAnimation(.spring(response: 0.3)) {
                        value = value == 1 ? nil : 1
                    }
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: value == 1 ? "hand.thumbsup.fill" : "hand.thumbsup")
                        .foregroundColor(value == 1 ? .green : .gray)

                    if showCounts {
                        Text("\\(likeCount)")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }
            .buttonStyle(.plain)
            .disabled(readOnly)

            // Dislike Button
            Button {
                if !readOnly {
                    withAnimation(.spring(response: 0.3)) {
                        value = value == -1 ? nil : -1
                    }
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: value == -1 ? "hand.thumbsdown.fill" : "hand.thumbsdown")
                        .foregroundColor(value == -1 ? .red : .gray)

                    if showCounts {
                        Text("\\(dislikeCount)")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }
            .buttonStyle(.plain)
            .disabled(readOnly)
        }
    }
}

// MARK: - Preview
struct RatingView_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Basic Rating
                RatingView(
                    rating: .constant(3.5),
                    allowHalf: true,
                    readOnly: true,
                    showValue: true
                )

                // Rating Input
                RatingInput(
                    rating: .constant(4),
                    label: "Rate your experience",
                    helperText: "Tap a star to rate"
                )

                // Emoji Rating
                EmojiRating(rating: .constant(4))

                // Thumb Rating
                ThumbRating(
                    value: .constant(1),
                    likeCount: 124,
                    dislikeCount: 8
                )
            }
            .padding()
        }
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3', 'androidx.compose.animation'],
      code: `
package com.hublab.capsules

import androidx.compose.animation.core.*
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Rating Size
enum class RatingSize(val iconSize: Dp) {
    ExtraSmall(12.dp),
    Small(16.dp),
    Medium(20.dp),
    Large(24.dp),
    ExtraLarge(32.dp)
}

// Rating Variant
enum class RatingVariant {
    Star, Heart, Circle
}

// Rating View
@Composable
fun Rating(
    value: Float,
    onValueChange: ((Float) -> Unit)? = null,
    modifier: Modifier = Modifier,
    maxValue: Int = 5,
    size: RatingSize = RatingSize.Medium,
    variant: RatingVariant = RatingVariant.Star,
    filledColor: Color = Color(0xFFFBBF24),
    emptyColor: Color = Color.Gray.copy(alpha = 0.3f),
    allowHalf: Boolean = false,
    readOnly: Boolean = false,
    showValue: Boolean = false,
    showCount: Boolean = false,
    count: Int = 0,
    spacing: Dp = 2.dp
) {
    var hoverValue by remember { mutableStateOf<Float?>(null) }
    val displayValue = hoverValue ?: value

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(spacing)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
            repeat(maxValue) { index ->
                val starIndex = index + 1
                val isFilled = displayValue >= starIndex
                val isHalf = !isFilled && displayValue >= starIndex - 0.5f

                val scale by animateFloatAsState(
                    targetValue = if (isFilled || isHalf) 1.1f else 1f,
                    animationSpec = spring(dampingRatio = 0.6f)
                )

                Box(
                    modifier = Modifier
                        .size(size.iconSize)
                        .scale(scale)
                        .then(
                            if (!readOnly) {
                                Modifier.clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null
                                ) {
                                    onValueChange?.invoke(starIndex.toFloat())
                                }
                            } else Modifier
                        )
                        .semantics {
                            contentDescription = "Rate $starIndex out of $maxValue"
                        }
                ) {
                    RatingIcon(
                        variant = variant,
                        isFilled = isFilled,
                        isHalf = isHalf,
                        filledColor = filledColor,
                        emptyColor = emptyColor,
                        size = size.iconSize
                    )
                }
            }
        }

        if (showValue) {
            Text(
                text = if (allowHalf) String.format("%.1f", value) else value.toInt().toString(),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
        }

        if (showCount && count > 0) {
            Text(
                text = "($count)",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun RatingIcon(
    variant: RatingVariant,
    isFilled: Boolean,
    isHalf: Boolean,
    filledColor: Color,
    emptyColor: Color,
    size: Dp
) {
    val (filledIcon, outlinedIcon) = when (variant) {
        RatingVariant.Star -> Icons.Filled.Star to Icons.Outlined.Star
        RatingVariant.Heart -> Icons.Filled.Favorite to Icons.Outlined.FavoriteBorder
        RatingVariant.Circle -> Icons.Filled.Circle to Icons.Outlined.Circle
    }

    Box(contentAlignment = Alignment.Center) {
        // Empty background
        Icon(
            imageVector = outlinedIcon,
            contentDescription = null,
            modifier = Modifier.size(size),
            tint = emptyColor
        )

        // Filled overlay
        if (isFilled) {
            Icon(
                imageVector = filledIcon,
                contentDescription = null,
                modifier = Modifier.size(size),
                tint = filledColor
            )
        } else if (isHalf) {
            Box(
                modifier = Modifier
                    .size(size)
                    .graphicsLayer {
                        clip = true
                    }
            ) {
                Icon(
                    imageVector = filledIcon,
                    contentDescription = null,
                    modifier = Modifier
                        .size(size)
                        .offset(x = (-size / 4)),
                    tint = filledColor
                )
            }
        }
    }
}

// Rating Input with Label
@Composable
fun RatingInput(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    helperText: String? = null,
    required: Boolean = false,
    errorMessage: String? = null,
    maxValue: Int = 5,
    size: RatingSize = RatingSize.Large,
    variant: RatingVariant = RatingVariant.Star,
    filledColor: Color = Color(0xFFFBBF24)
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        if (label != null) {
            Row {
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                if (required) {
                    Text(
                        text = " *",
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }
        }

        Rating(
            value = value,
            onValueChange = onValueChange,
            maxValue = maxValue,
            size = size,
            variant = variant,
            filledColor = filledColor,
            readOnly = false
        )

        when {
            errorMessage != null -> {
                Text(
                    text = errorMessage,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
            helperText != null -> {
                Text(
                    text = helperText,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

// Rating Display with Distribution
@Composable
fun RatingDisplay(
    averageRating: Float,
    totalReviews: Int,
    distribution: List<Pair<Int, Int>>, // stars to count
    modifier: Modifier = Modifier,
    showDistribution: Boolean = true
) {
    val maxCount = distribution.maxOfOrNull { it.second } ?: 1

    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(24.dp),
        verticalAlignment = Alignment.Top
    ) {
        // Overall Rating
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = String.format("%.1f", averageRating),
                fontSize = 48.sp,
                fontWeight = FontWeight.Bold
            )

            Rating(
                value = averageRating,
                size = RatingSize.Large,
                filledColor = Color(0xFFFBBF24),
                readOnly = true
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "$totalReviews reviews",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Distribution
        if (showDistribution) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                distribution.sortedByDescending { it.first }.forEach { (stars, count) ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = stars.toString(),
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.width(12.dp)
                        )

                        Icon(
                            imageVector = Icons.Filled.Star,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = Color(0xFFFBBF24)
                        )

                        LinearProgressIndicator(
                            progress = { count.toFloat() / maxCount },
                            modifier = Modifier
                                .weight(1f)
                                .height(8.dp)
                                .clip(MaterialTheme.shapes.small),
                            color = Color(0xFFFBBF24),
                            trackColor = MaterialTheme.colorScheme.surfaceVariant
                        )

                        Text(
                            text = count.toString(),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.width(40.dp),
                            textAlign = TextAlign.End
                        )
                    }
                }
            }
        }
    }
}

// Emoji Rating
@Composable
fun EmojiRating(
    value: Int,
    onValueChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    readOnly: Boolean = false,
    labels: List<String> = listOf("Terrible", "Bad", "Okay", "Good", "Amazing")
) {
    val emojis = listOf("😞", "😕", "😐", "🙂", "😄")
    var hoverIndex by remember { mutableStateOf<Int?>(null) }
    val displayIndex = (hoverIndex ?: value) - 1

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            emojis.forEachIndexed { index, emoji ->
                val isSelected = value == index + 1
                val scale by animateFloatAsState(
                    targetValue = if (isSelected) 1.3f else 1f,
                    animationSpec = spring(dampingRatio = 0.6f)
                )
                val alpha by animateFloatAsState(
                    targetValue = if (isSelected) 1f else 0.4f
                )

                Text(
                    text = emoji,
                    fontSize = 36.sp,
                    modifier = Modifier
                        .scale(scale)
                        .graphicsLayer { this.alpha = alpha }
                        .then(
                            if (!readOnly) {
                                Modifier.clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null
                                ) {
                                    onValueChange(index + 1)
                                }
                            } else Modifier
                        )
                )
            }
        }

        if (displayIndex in labels.indices) {
            Text(
                text = labels[displayIndex],
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// Thumb Rating (Like/Dislike)
@Composable
fun ThumbRating(
    value: Int?, // null = no selection, 1 = like, -1 = dislike
    onValueChange: (Int?) -> Unit,
    modifier: Modifier = Modifier,
    likeCount: Int = 0,
    dislikeCount: Int = 0,
    showCounts: Boolean = true,
    readOnly: Boolean = false
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Like Button
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            modifier = if (!readOnly) {
                Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {
                    onValueChange(if (value == 1) null else 1)
                }
            } else Modifier
        ) {
            Icon(
                imageVector = if (value == 1) Icons.Filled.ThumbUp else Icons.Outlined.ThumbUp,
                contentDescription = "Like",
                tint = if (value == 1) Color(0xFF22C55E) else MaterialTheme.colorScheme.onSurfaceVariant
            )

            if (showCounts) {
                Text(
                    text = likeCount.toString(),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Dislike Button
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            modifier = if (!readOnly) {
                Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {
                    onValueChange(if (value == -1) null else -1)
                }
            } else Modifier
        ) {
            Icon(
                imageVector = if (value == -1) Icons.Filled.ThumbDown else Icons.Outlined.ThumbDown,
                contentDescription = "Dislike",
                tint = if (value == -1) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant
            )

            if (showCounts) {
                Text(
                    text = dislikeCount.toString(),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
`
    },

    desktop: {
      dependencies: ['@tauri-apps/api'],
      code: `
// Desktop uses the same React components with Tauri integration
// See web implementation above
export * from './web'
`
    }
  }
}
