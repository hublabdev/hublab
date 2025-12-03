/**
 * Marquee/Ticker Capsule - Multi-Platform
 * Scrolling text ticker animation
 */

import { CapsuleDefinition } from './types'

export const MarqueeCapsule: CapsuleDefinition = {
  id: 'marquee',
  name: 'Marquee',
  description: 'Scrolling text ticker for announcements',
  category: 'feedback',
  tags: ['marquee', 'ticker', 'scroll', 'announcement'],
  version: '1.0.0',

  props: [
    {
      name: 'children',
      type: 'node',
      required: true,
      description: 'Content to scroll'
    },
    {
      name: 'speed',
      type: 'number',
      required: false,
      default: 50,
      description: 'Scroll speed in pixels per second'
    },
    {
      name: 'direction',
      type: 'select',
      required: false,
      default: 'left',
      options: ['left', 'right'],
      description: 'Scroll direction'
    },
    {
      name: 'pauseOnHover',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Pause animation on hover'
    },
    {
      name: 'gap',
      type: 'number',
      required: false,
      default: 40,
      description: 'Gap between repeated content'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useRef, useEffect, useState } from 'react'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  gap?: number
}

export function Marquee({
  children,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  gap = 40
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth)
    }
  }, [children])

  const duration = contentWidth / speed

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="inline-flex"
        style={{
          animation: \`marquee \${duration}s linear infinite\`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        <div ref={contentRef} className="flex items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex items-center" style={{ gap, marginLeft: gap }}>
          {children}
        </div>
      </div>

      <style>{\`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      \`}</style>
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

struct Marquee<Content: View>: View {
    let content: Content
    var speed: Double = 50
    var direction: MarqueeDirection = .left
    var gap: CGFloat = 40

    @State private var offset: CGFloat = 0
    @State private var contentWidth: CGFloat = 0

    enum MarqueeDirection { case left, right }

    init(speed: Double = 50, direction: MarqueeDirection = .left, gap: CGFloat = 40, @ViewBuilder content: () -> Content) {
        self.content = content()
        self.speed = speed
        self.direction = direction
        self.gap = gap
    }

    var body: some View {
        GeometryReader { geometry in
            HStack(spacing: gap) {
                content
                    .background(GeometryReader { proxy in
                        Color.clear.onAppear {
                            contentWidth = proxy.size.width
                        }
                    })
                content
            }
            .offset(x: offset)
            .onAppear { startAnimation() }
        }
        .clipped()
    }

    private func startAnimation() {
        let totalWidth = contentWidth + gap
        let duration = totalWidth / speed

        withAnimation(.linear(duration: duration).repeatForever(autoreverses: false)) {
            offset = direction == .left ? -totalWidth : totalWidth
        }
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
fun Marquee(
    modifier: Modifier = Modifier,
    speed: Float = 50f,
    direction: MarqueeDirection = MarqueeDirection.Left,
    gap: Dp = 40.dp,
    content: @Composable () -> Unit
) {
    var contentWidth by remember { mutableStateOf(0f) }
    val offset = remember { Animatable(0f) }

    LaunchedEffect(contentWidth) {
        if (contentWidth > 0) {
            val totalWidth = contentWidth + gap.value
            val duration = (totalWidth / speed * 1000).toInt()

            offset.animateTo(
                targetValue = if (direction == MarqueeDirection.Left) -totalWidth else totalWidth,
                animationSpec = infiniteRepeatable(
                    animation = tween(duration, easing = LinearEasing),
                    repeatMode = RepeatMode.Restart
                )
            )
        }
    }

    Box(modifier = modifier.clipToBounds()) {
        Row(
            modifier = Modifier.offset(x = offset.value.dp),
            horizontalArrangement = Arrangement.spacedBy(gap)
        ) {
            Box(modifier = Modifier.onGloballyPositioned { contentWidth = it.size.width.toFloat() }) {
                content()
            }
            content()
        }
    }
}

enum class MarqueeDirection { Left, Right }
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react'],
      code: `// Same as web implementation`
    }
  }
}
