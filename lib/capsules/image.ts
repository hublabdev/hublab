/**
 * Image Capsule - Multi-Platform
 *
 * Image component with loading states, fallbacks, and aspect ratios.
 */

import { CapsuleDefinition } from './types'

export const ImageCapsule: CapsuleDefinition = {
  id: 'image',
  name: 'Image',
  description: 'Image with loading, error states, and aspect ratio control',
  category: 'media',
  tags: ['media', 'photo', 'picture', 'visual'],
  version: '1.0.0',

  props: [
    {
      name: 'src',
      type: 'string',
      required: true,
      description: 'Image URL or local asset path'
    },
    {
      name: 'alt',
      type: 'string',
      required: false,
      default: '',
      description: 'Accessibility description'
    },
    {
      name: 'aspectRatio',
      type: 'select',
      required: false,
      default: 'auto',
      options: ['auto', '1:1', '4:3', '16:9', '3:2', '2:3'],
      description: 'Image aspect ratio'
    },
    {
      name: 'fit',
      type: 'select',
      required: false,
      default: 'cover',
      options: ['cover', 'contain', 'fill', 'none'],
      description: 'How image fits container'
    },
    {
      name: 'rounded',
      type: 'select',
      required: false,
      default: 'none',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Border radius'
    },
    {
      name: 'fallback',
      type: 'string',
      required: false,
      description: 'Fallback image URL on error'
    },
    {
      name: 'onPress',
      type: 'action',
      required: false,
      description: 'Make image tappable'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useState } from 'react'

interface ImageProps {
  src: string
  alt?: string
  aspectRatio?: 'auto' | '1:1' | '4:3' | '16:9' | '3:2' | '2:3'
  fit?: 'cover' | 'contain' | 'fill' | 'none'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  fallback?: string
  onPress?: () => void
}

export function Image({
  src,
  alt = '',
  aspectRatio = 'auto',
  fit = 'cover',
  rounded = 'none',
  fallback,
  onPress
}: ImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const aspectRatios = {
    'auto': 'aspect-auto',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]',
    '2:3': 'aspect-[2/3]'
  }

  const fitStyles = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none'
  }

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  }

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  const imageSrc = error && fallback ? fallback : src

  const Wrapper = onPress ? 'button' : 'div'

  return (
    <Wrapper
      onClick={onPress}
      className={\`
        relative overflow-hidden w-full
        \${aspectRatios[aspectRatio]}
        \${roundedStyles[rounded]}
        \${onPress ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500' : ''}
      \`}
    >
      {/* Loading skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={\`
          w-full h-full
          \${fitStyles[fit]}
          \${loading ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-300
        \`}
      />

      {/* Error state (if no fallback) */}
      {error && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </Wrapper>
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

enum ImageAspectRatio {
    case auto, square, fourThree, sixteenNine, threeTwo, twoThree

    var value: CGFloat? {
        switch self {
        case .auto: return nil
        case .square: return 1
        case .fourThree: return 4/3
        case .sixteenNine: return 16/9
        case .threeTwo: return 3/2
        case .twoThree: return 2/3
        }
    }
}

enum ImageFit {
    case cover, contain, fill
}

enum ImageRounded {
    case none, sm, md, lg, full

    var radius: CGFloat {
        switch self {
        case .none: return 0
        case .sm: return 4
        case .md: return 8
        case .lg: return 16
        case .full: return 1000
        }
    }
}

struct HubLabImage: View {
    let src: String
    var alt: String = ""
    var aspectRatio: ImageAspectRatio = .auto
    var fit: ImageFit = .cover
    var rounded: ImageRounded = .none
    var fallback: String? = nil
    var onPress: (() -> Void)? = nil

    @State private var isLoading = true
    @State private var hasError = false

    var body: some View {
        Group {
            if let action = onPress {
                Button(action: action) {
                    imageContent
                }
                .buttonStyle(PlainButtonStyle())
            } else {
                imageContent
            }
        }
    }

    private var imageContent: some View {
        GeometryReader { geometry in
            ZStack {
                // Loading state
                if isLoading {
                    Rectangle()
                        .fill(Color.gray.opacity(0.2))
                        .overlay(
                            ProgressView()
                        )
                }

                // Error state
                if hasError && fallback == nil {
                    Rectangle()
                        .fill(Color.gray.opacity(0.1))
                        .overlay(
                            Image(systemName: "photo")
                                .font(.largeTitle)
                                .foregroundColor(.gray)
                        )
                }

                // Image
                AsyncImage(url: URL(string: hasError && fallback != nil ? fallback! : src)) { phase in
                    switch phase {
                    case .empty:
                        Color.clear
                            .onAppear { isLoading = true }
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: contentMode)
                            .onAppear {
                                isLoading = false
                                hasError = false
                            }
                    case .failure:
                        Color.clear
                            .onAppear {
                                isLoading = false
                                hasError = true
                            }
                    @unknown default:
                        EmptyView()
                    }
                }
            }
            .frame(width: geometry.size.width, height: calculateHeight(width: geometry.size.width))
            .clipped()
            .cornerRadius(cornerRadius(for: geometry.size))
        }
        .aspectRatio(aspectRatio.value, contentMode: .fit)
        .accessibilityLabel(alt)
    }

    private var contentMode: ContentMode {
        switch fit {
        case .cover: return .fill
        case .contain: return .fit
        case .fill: return .fill
        }
    }

    private func calculateHeight(width: CGFloat) -> CGFloat {
        guard let ratio = aspectRatio.value else {
            return width // Default square-ish
        }
        return width / ratio
    }

    private func cornerRadius(for size: CGSize) -> CGFloat {
        if rounded == .full {
            return min(size.width, size.height) / 2
        }
        return rounded.radius
    }
}

// MARK: - Previews
#Preview("Image Variants") {
    ScrollView {
        VStack(spacing: 20) {
            HubLabImage(
                src: "https://picsum.photos/400/300",
                alt: "Random image",
                aspectRatio: .sixteenNine,
                rounded: .md
            )

            HubLabImage(
                src: "https://picsum.photos/400/400",
                alt: "Square image",
                aspectRatio: .square,
                rounded: .full
            )

            HubLabImage(
                src: "invalid-url",
                alt: "Error state",
                aspectRatio: .fourThree
            )
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
        'io.coil-kt:coil-compose:2.5.0'
      ],
      imports: [
        'androidx.compose.foundation.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'androidx.compose.ui.draw.*',
        'androidx.compose.ui.layout.*',
        'coil.compose.AsyncImage',
        'coil.compose.AsyncImagePainter'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BrokenImage
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.compose.AsyncImagePainter

enum class ImageAspectRatio(val value: Float?) {
    Auto(null),
    Square(1f),
    FourThree(4f / 3f),
    SixteenNine(16f / 9f),
    ThreeTwo(3f / 2f),
    TwoThree(2f / 3f)
}

enum class ImageFit(val scale: ContentScale) {
    Cover(ContentScale.Crop),
    Contain(ContentScale.Fit),
    Fill(ContentScale.FillBounds)
}

enum class ImageRounded(val shape: @Composable () -> Shape) {
    None({ RoundedCornerShape(0.dp) }),
    Sm({ RoundedCornerShape(4.dp) }),
    Md({ RoundedCornerShape(8.dp) }),
    Lg({ RoundedCornerShape(16.dp) }),
    Full({ CircleShape })
}

@Composable
fun HubLabImage(
    src: String,
    modifier: Modifier = Modifier,
    alt: String = "",
    aspectRatio: ImageAspectRatio = ImageAspectRatio.Auto,
    fit: ImageFit = ImageFit.Cover,
    rounded: ImageRounded = ImageRounded.None,
    fallback: String? = null,
    onPress: (() -> Unit)? = null
) {
    var hasError by remember { mutableStateOf(false) }
    val imageUrl = if (hasError && fallback != null) fallback else src

    val shape = rounded.shape()

    val imageModifier = modifier
        .then(
            if (aspectRatio.value != null) {
                Modifier.aspectRatio(aspectRatio.value!!)
            } else {
                Modifier
            }
        )
        .clip(shape)
        .then(
            if (onPress != null) {
                Modifier.clickable(onClick = onPress)
            } else {
                Modifier
            }
        )

    Box(
        modifier = imageModifier,
        contentAlignment = Alignment.Center
    ) {
        AsyncImage(
            model = imageUrl,
            contentDescription = alt,
            contentScale = fit.scale,
            modifier = Modifier.fillMaxSize(),
            onState = { state ->
                hasError = state is AsyncImagePainter.State.Error
            }
        )

        // Loading state is handled by AsyncImage placeholder

        // Error state
        if (hasError && fallback == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.surfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.BrokenImage,
                    contentDescription = "Image failed to load",
                    modifier = Modifier.size(48.dp),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabImagePreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            HubLabImage(
                src = "https://picsum.photos/400/300",
                aspectRatio = ImageAspectRatio.SixteenNine,
                rounded = ImageRounded.Md
            )

            HubLabImage(
                src = "https://picsum.photos/200/200",
                aspectRatio = ImageAspectRatio.Square,
                rounded = ImageRounded.Full,
                modifier = Modifier.size(100.dp)
            )
        }
    }
}
`
    }
  },

  children: false,
  preview: '/previews/image.png'
}
