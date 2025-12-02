// @ts-nocheck
/**
 * Avatar Capsule - Multi-Platform
 *
 * User avatar with image, initials fallback, and status indicator.
 */

import { CapsuleDefinition } from './types'

export const AvatarCapsule: CapsuleDefinition = {
  id: 'avatar',
  name: 'Avatar',
  description: 'User avatar with image, initials fallback, and online status',
  category: 'ui',
  tags: ['avatar', 'profile', 'user', 'image'],
  version: '1.0.0',

  props: [
    {
      name: 'src',
      type: 'string',
      required: false,
      description: 'Image URL'
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'User name for initials fallback'
    },
    {
      name: 'size',
      type: 'select',
      required: false,
      default: 'md',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Avatar size'
    },
    {
      name: 'status',
      type: 'select',
      required: false,
      options: ['online', 'offline', 'away', 'busy'],
      description: 'Online status indicator'
    },
    {
      name: 'shape',
      type: 'select',
      required: false,
      default: 'circle',
      options: ['circle', 'square', 'rounded'],
      description: 'Avatar shape'
    },
    {
      name: 'onPress',
      type: 'action',
      required: false,
      description: 'Tap handler'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useState } from 'react'

interface AvatarProps {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  shape?: 'circle' | 'square' | 'rounded'
  onPress?: () => void
}

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  shape = 'circle',
  onPress
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl'
  }

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const Wrapper = onPress ? 'button' : 'div'

  const wrapperClasses = [
    'relative inline-flex items-center justify-center',
    sizes[size],
    shapes[shape],
    onPress ? 'cursor-pointer hover:opacity-90 transition-opacity' : '',
    'overflow-hidden'
  ].filter(Boolean).join(' ')

  const statusClasses = [
    'absolute bottom-0 right-0',
    statusSizes[size],
    status ? statusColors[status] : '',
    'rounded-full border-2 border-white'
  ].filter(Boolean).join(' ')

  const initialsClasses = [
    'w-full h-full flex items-center justify-center',
    name ? getBackgroundColor(name) : '',
    'text-white font-medium'
  ].filter(Boolean).join(' ')

  return (
    <Wrapper
      onClick={onPress}
      className={wrapperClasses}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover ${shapes[shape]}`}
        />
      ) : name ? (
        <div className={initialsClasses}>
          {getInitials(name)}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}

      {status && (
        <span className={statusClasses} />
      )}
    </Wrapper>
  )
}

// Avatar Group
interface AvatarGroupProps {
  avatars: { src?: string; name?: string }[]
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max

  const overlapSizes = {
    xs: '-ml-2',
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5'
  }

  return (
    <div className="flex items-center">
      {visible.map((avatar, i) => (
        <div
          key={i}
          className={`${i > 0 ? overlapSizes[size] : ''} ring-2 ring-white rounded-full`}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={`
          ${overlapSizes[size]} flex items-center justify-center
          ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
          ${size === 'sm' ? 'w-8 h-8 text-xs' : ''}
          ${size === 'md' ? 'w-10 h-10 text-sm' : ''}
          ${size === 'lg' ? 'w-14 h-14 text-base' : ''}
          ${size === 'xl' ? 'w-20 h-20 text-lg' : ''}
          rounded-full bg-gray-100 text-gray-600 font-medium
          ring-2 ring-white
        `}>
          +{remaining}
        </div>
      )}
    </div>
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

enum AvatarSize {
    case xs, sm, md, lg, xl

    var dimension: CGFloat {
        switch self {
        case .xs: return 24
        case .sm: return 32
        case .md: return 40
        case .lg: return 56
        case .xl: return 80
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .xs: return 10
        case .sm: return 12
        case .md: return 14
        case .lg: return 18
        case .xl: return 24
        }
    }

    var statusSize: CGFloat {
        switch self {
        case .xs: return 6
        case .sm: return 8
        case .md: return 10
        case .lg: return 12
        case .xl: return 16
        }
    }
}

enum AvatarStatus {
    case online, offline, away, busy

    var color: Color {
        switch self {
        case .online: return .green
        case .offline: return .gray
        case .away: return .yellow
        case .busy: return .red
        }
    }
}

enum AvatarShape {
    case circle, square, rounded
}

struct HubLabAvatar: View {
    let src: String?
    var name: String? = nil
    var size: AvatarSize = .md
    var status: AvatarStatus? = nil
    var shape: AvatarShape = .circle
    var onPress: (() -> Void)? = nil

    private let colors: [Color] = [.blue, .green, .orange, .red, .purple, .pink, .indigo, .cyan]

    var body: some View {
        Button(action: { onPress?() }) {
            ZStack(alignment: .bottomTrailing) {
                avatarContent
                    .frame(width: size.dimension, height: size.dimension)
                    .clipShape(shapeView)

                if let status = status {
                    Circle()
                        .fill(status.color)
                        .frame(width: size.statusSize, height: size.statusSize)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                        .offset(x: 2, y: 2)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
        .disabled(onPress == nil)
    }

    @ViewBuilder
    private var avatarContent: some View {
        if let src = src, let url = URL(string: src) {
            AsyncImage(url: url) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                case .failure:
                    fallbackView
                case .empty:
                    ProgressView()
                @unknown default:
                    fallbackView
                }
            }
        } else {
            fallbackView
        }
    }

    @ViewBuilder
    private var fallbackView: some View {
        if let name = name {
            ZStack {
                backgroundColor(for: name)
                Text(initials(from: name))
                    .font(.system(size: size.fontSize, weight: .medium))
                    .foregroundColor(.white)
            }
        } else {
            ZStack {
                Color.gray.opacity(0.2)
                Image(systemName: "person.fill")
                    .foregroundColor(.gray)
            }
        }
    }

    private var shapeView: some Shape {
        switch shape {
        case .circle:
            return AnyShape(Circle())
        case .square:
            return AnyShape(Rectangle())
        case .rounded:
            return AnyShape(RoundedRectangle(cornerRadius: 8))
        }
    }

    private func initials(from name: String) -> String {
        let parts = name.split(separator: " ")
        let initials = parts.prefix(2).compactMap { $0.first }.map { String($0) }
        return initials.joined().uppercased()
    }

    private func backgroundColor(for name: String) -> Color {
        let index = Int(name.unicodeScalars.first?.value ?? 0) % colors.count
        return colors[index]
    }
}

// MARK: - Shape Helper
struct AnyShape: Shape {
    private let pathBuilder: (CGRect) -> Path

    init<S: Shape>(_ shape: S) {
        pathBuilder = { rect in
            shape.path(in: rect)
        }
    }

    func path(in rect: CGRect) -> Path {
        pathBuilder(rect)
    }
}

// MARK: - Avatar Group
struct HubLabAvatarGroup: View {
    let avatars: [(src: String?, name: String?)]
    var max: Int = 4
    var size: AvatarSize = .md

    var body: some View {
        HStack(spacing: -size.dimension * 0.25) {
            ForEach(Array(avatars.prefix(max).enumerated()), id: \\.offset) { _, avatar in
                HubLabAvatar(src: avatar.src, name: avatar.name, size: size)
                    .overlay(Circle().stroke(Color.white, lineWidth: 2))
            }

            if avatars.count > max {
                ZStack {
                    Circle()
                        .fill(Color.gray.opacity(0.2))
                    Text("+\\(avatars.count - max)")
                        .font(.system(size: size.fontSize, weight: .medium))
                        .foregroundColor(.gray)
                }
                .frame(width: size.dimension, height: size.dimension)
                .overlay(Circle().stroke(Color.white, lineWidth: 2))
            }
        }
    }
}

// MARK: - Preview
#Preview("Avatars") {
    VStack(spacing: 24) {
        HStack(spacing: 16) {
            HubLabAvatar(src: nil, name: "John Doe", size: .xs)
            HubLabAvatar(src: nil, name: "Jane Smith", size: .sm)
            HubLabAvatar(src: nil, name: "Bob Wilson", size: .md, status: .online)
            HubLabAvatar(src: nil, name: "Alice Brown", size: .lg, status: .busy)
        }

        HubLabAvatarGroup(
            avatars: [
                (nil, "John"), (nil, "Jane"), (nil, "Bob"),
                (nil, "Alice"), (nil, "Charlie")
            ],
            max: 3
        )
    }
    .padding()
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: ['io.coil-kt:coil-compose:2.5.0'],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'coil.compose.AsyncImage'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

enum class AvatarSize(val dimension: Dp, val fontSize: Int, val statusSize: Dp) {
    Xs(24.dp, 10, 6.dp),
    Sm(32.dp, 12, 8.dp),
    Md(40.dp, 14, 10.dp),
    Lg(56.dp, 18, 12.dp),
    Xl(80.dp, 24, 16.dp)
}

enum class AvatarStatus(val color: Color) {
    Online(Color(0xFF22C55E)),
    Offline(Color(0xFF9CA3AF)),
    Away(Color(0xFFEAB308)),
    Busy(Color(0xFFEF4444))
}

enum class AvatarShape { Circle, Square, Rounded }

private val avatarColors = listOf(
    Color(0xFF3B82F6),
    Color(0xFF10B981),
    Color(0xFFF59E0B),
    Color(0xFFEF4444),
    Color(0xFF8B5CF6),
    Color(0xFFEC4899),
    Color(0xFF6366F1),
    Color(0xFF06B6D4)
)

@Composable
fun HubLabAvatar(
    src: String? = null,
    name: String? = null,
    size: AvatarSize = AvatarSize.Md,
    status: AvatarStatus? = null,
    shape: AvatarShape = AvatarShape.Circle,
    onClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val shapeValue: Shape = when (shape) {
        AvatarShape.Circle -> CircleShape
        AvatarShape.Square -> RoundedCornerShape(0.dp)
        AvatarShape.Rounded -> RoundedCornerShape(8.dp)
    }

    Box(
        modifier = modifier
            .size(size.dimension)
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
    ) {
        // Avatar content
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clip(shapeValue),
            contentAlignment = Alignment.Center
        ) {
            if (src != null) {
                AsyncImage(
                    model = src,
                    contentDescription = name ?: "Avatar",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else if (name != null) {
                val colorIndex = (name.firstOrNull()?.code ?: 0) % avatarColors.size
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(avatarColors[colorIndex]),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = getInitials(name),
                        color = Color.White,
                        fontSize = size.fontSize.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFFE5E7EB)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = Color(0xFF9CA3AF),
                        modifier = Modifier.size(size.dimension / 2)
                    )
                }
            }
        }

        // Status indicator
        if (status != null) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .offset(x = 2.dp, y = 2.dp)
                    .size(size.statusSize)
                    .clip(CircleShape)
                    .background(status.color)
                    .border(2.dp, Color.White, CircleShape)
            )
        }
    }
}

private fun getInitials(name: String): String {
    return name.split(" ")
        .take(2)
        .mapNotNull { it.firstOrNull()?.uppercaseChar() }
        .joinToString("")
}

@Composable
fun HubLabAvatarGroup(
    avatars: List<Pair<String?, String?>>,
    max: Int = 4,
    size: AvatarSize = AvatarSize.Md,
    modifier: Modifier = Modifier
) {
    val overlap = size.dimension * 0.25f
    val visible = avatars.take(max)
    val remaining = avatars.size - max

    Row(modifier = modifier) {
        visible.forEachIndexed { index, (src, name) ->
            Box(
                modifier = Modifier
                    .offset(x = -(overlap * index))
                    .border(2.dp, Color.White, CircleShape)
            ) {
                HubLabAvatar(src = src, name = name, size = size)
            }
        }

        if (remaining > 0) {
            Box(
                modifier = Modifier
                    .offset(x = -(overlap * visible.size))
                    .size(size.dimension)
                    .clip(CircleShape)
                    .background(Color(0xFFF3F4F6))
                    .border(2.dp, Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "+$remaining",
                    fontSize = size.fontSize.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF6B7280)
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabAvatarPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                HubLabAvatar(name = "John Doe", size = AvatarSize.Sm)
                HubLabAvatar(name = "Jane Smith", size = AvatarSize.Md, status = AvatarStatus.Online)
                HubLabAvatar(name = "Bob Wilson", size = AvatarSize.Lg, status = AvatarStatus.Busy)
            }

            HubLabAvatarGroup(
                avatars = listOf(
                    null to "John",
                    null to "Jane",
                    null to "Bob",
                    null to "Alice",
                    null to "Charlie"
                ),
                max = 3
            )
        }
    }
}
`
    }
  },

  children: false,
  preview: '/previews/avatar.png'
}
