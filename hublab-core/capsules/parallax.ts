/**
 * Parallax Capsule - Multi-Platform
 * Parallax scrolling effect for images and content
 */

import { CapsuleDefinition } from './types'

export const ParallaxCapsule: CapsuleDefinition = {
  id: 'parallax',
  name: 'Parallax',
  description: 'Parallax scrolling effect for immersive experiences',
  category: 'layout',
  tags: ['parallax', 'scroll', 'animation', 'hero'],
  version: '1.0.0',

  props: [
    {
      name: 'image',
      type: 'string',
      required: true,
      description: 'Background image URL'
    },
    {
      name: 'height',
      type: 'string',
      required: false,
      default: '400px',
      description: 'Container height'
    },
    {
      name: 'speed',
      type: 'number',
      required: false,
      default: 0.5,
      description: 'Parallax speed (0-1)'
    },
    {
      name: 'overlay',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show dark overlay'
    },
    {
      name: 'children',
      type: 'node',
      required: false,
      description: 'Content to display over parallax'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useRef, useEffect, useState } from 'react'

interface ParallaxProps {
  image: string
  height?: string
  speed?: number
  overlay?: boolean
  children?: React.ReactNode
}

export function Parallax({
  image,
  height = '400px',
  speed = 0.5,
  overlay = true,
  children
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setOffset(scrolled * speed)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: \`url(\${image})\`,
          transform: \`translateY(\${offset}px) scale(1.2)\`,
          willChange: 'transform'
        }}
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
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

struct Parallax<Content: View>: View {
    let image: String
    var height: CGFloat = 400
    var speed: CGFloat = 0.5
    var overlay: Bool = true
    let content: Content

    init(image: String, height: CGFloat = 400, speed: CGFloat = 0.5, overlay: Bool = true, @ViewBuilder content: () -> Content) {
        self.image = image
        self.height = height
        self.speed = speed
        self.overlay = overlay
        self.content = content()
    }

    var body: some View {
        GeometryReader { geometry in
            let minY = geometry.frame(in: .global).minY
            let offset = minY > 0 ? -minY * speed : 0

            ZStack {
                AsyncImage(url: URL(string: image)) { phase in
                    if let img = phase.image {
                        img
                            .resizable()
                            .scaledToFill()
                            .offset(y: offset)
                            .scaleEffect(1.2)
                    } else {
                        Color.gray.opacity(0.2)
                    }
                }
                .frame(width: geometry.size.width, height: height + (minY > 0 ? minY : 0))
                .clipped()
                .offset(y: minY > 0 ? -minY : 0)

                if overlay {
                    Color.black.opacity(0.4)
                }

                content
            }
        }
        .frame(height: height)
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
fun Parallax(
    image: String,
    height: Dp = 400.dp,
    speed: Float = 0.5f,
    overlay: Boolean = true,
    content: @Composable () -> Unit = {}
) {
    val scrollState = rememberScrollState()
    val offset = scrollState.value * speed

    Box(
        modifier = Modifier
            .height(height)
            .fillMaxWidth()
            .clipToBounds()
    ) {
        AsyncImage(
            model = image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxSize()
                .scale(1.2f)
                .offset(y = offset.dp)
        )

        if (overlay) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.4f))
            )
        }

        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            content()
        }
    }
}
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react'],
      code: `// Same as web implementation`
    }
  }
}
