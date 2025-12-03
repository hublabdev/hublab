/**
 * Confetti Capsule - Multi-Platform Celebration Animation
 *
 * Animated confetti effect for celebrations and success states
 */

import { CapsuleDefinition } from './types'

export const ConfettiCapsule: CapsuleDefinition = {
  id: 'confetti',
  name: 'Confetti',
  description: 'Animated confetti celebration effect',
  category: 'feedback',
  tags: ['confetti', 'celebration', 'animation', 'success', 'party'],
  version: '1.0.0',

  props: [
    {
      name: 'active',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether confetti is currently active'
    },
    {
      name: 'particleCount',
      type: 'number',
      required: false,
      default: 50,
      description: 'Number of confetti particles',
      min: 10,
      max: 200
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      default: 3000,
      description: 'Duration in milliseconds'
    },
    {
      name: 'colors',
      type: 'array',
      required: false,
      default: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
      description: 'Array of confetti colors'
    },
    {
      name: 'spread',
      type: 'number',
      required: false,
      default: 70,
      description: 'Spread angle in degrees'
    },
    {
      name: 'origin',
      type: 'object',
      required: false,
      default: { x: 0.5, y: 0.5 },
      description: 'Origin point (0-1 for x and y)'
    },
    {
      name: 'gravity',
      type: 'number',
      required: false,
      default: 1,
      description: 'Gravity multiplier'
    },
    {
      name: 'shapes',
      type: 'array',
      required: false,
      default: ['square', 'circle'],
      description: 'Particle shapes'
    },
    {
      name: 'onComplete',
      type: 'action',
      required: false,
      description: 'Callback when animation completes'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useEffect, useRef, useState, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'square' | 'circle' | 'star'
  opacity: number
}

interface ConfettiProps {
  active?: boolean
  particleCount?: number
  duration?: number
  colors?: string[]
  spread?: number
  origin?: { x: number; y: number }
  gravity?: number
  shapes?: ('square' | 'circle' | 'star')[]
  onComplete?: () => void
  className?: string
}

export function Confetti({
  active = false,
  particleCount = 50,
  duration = 3000,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  spread = 70,
  origin = { x: 0.5, y: 0.5 },
  gravity = 1,
  shapes = ['square', 'circle'],
  onComplete,
  className = ''
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const createParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return []

    const particles: Particle[] = []
    const centerX = canvas.width * origin.x
    const centerY = canvas.height * origin.y

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180) - Math.PI / 2
      const velocity = Math.random() * 8 + 4

      particles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity * (Math.random() * 0.5 + 0.5),
        vy: Math.sin(angle) * velocity * (Math.random() * 0.5 + 0.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1
      })
    }

    return particles
  }, [particleCount, colors, spread, origin, shapes])

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.translate(particle.x, particle.y)
    ctx.rotate((particle.rotation * Math.PI) / 180)
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color

    const halfSize = particle.size / 2

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'star':
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
          const x = Math.cos(angle) * halfSize
          const y = Math.sin(angle) * halfSize
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        break
      default: // square
        ctx.fillRect(-halfSize, -halfSize, particle.size, particle.size)
    }

    ctx.restore()
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let allDone = true

    particlesRef.current.forEach(particle => {
      // Update physics
      particle.vy += 0.2 * gravity
      particle.x += particle.vx
      particle.y += particle.vy
      particle.rotation += particle.rotationSpeed
      particle.opacity -= 0.005

      // Draw
      if (particle.opacity > 0 && particle.y < canvas.height + 50) {
        drawParticle(ctx, particle)
        allDone = false
      }
    })

    if (!allDone) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      setIsAnimating(false)
      onComplete?.()
    }
  }, [gravity, drawParticle, onComplete])

  useEffect(() => {
    if (active && !isAnimating) {
      setIsAnimating(true)
      particlesRef.current = createParticles()
      animationRef.current = requestAnimationFrame(animate)

      // Force stop after duration
      const timeout = setTimeout(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        setIsAnimating(false)
        onComplete?.()
      }, duration)

      return () => {
        clearTimeout(timeout)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [active, isAnimating, createParticles, animate, duration, onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  if (!active && !isAnimating) return null

  return (
    <canvas
      ref={canvasRef}
      className={\`fixed inset-0 pointer-events-none z-50 \${className}\`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

// Confetti button - triggers confetti on click
interface ConfettiButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  confettiProps?: Omit<ConfettiProps, 'active'>
}

export function ConfettiButton({
  children,
  onClick,
  className = '',
  confettiProps = {}
}: ConfettiButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const handleClick = () => {
    setShowConfetti(true)
    onClick?.()
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
      >
        {children}
      </button>
      <Confetti
        {...confettiProps}
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </>
  )
}

// Confetti cannon - shoots from a specific direction
interface ConfettiCannonProps extends Omit<ConfettiProps, 'origin'> {
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center'
}

export function ConfettiCannon({
  position = 'bottom',
  ...props
}: ConfettiCannonProps) {
  const origins: Record<string, { x: number; y: number }> = {
    left: { x: 0, y: 0.5 },
    right: { x: 1, y: 0.5 },
    top: { x: 0.5, y: 0 },
    bottom: { x: 0.5, y: 1 },
    center: { x: 0.5, y: 0.5 }
  }

  return <Confetti {...props} origin={origins[position]} />
}

// Fireworks effect - multiple bursts
interface FireworksProps {
  active?: boolean
  bursts?: number
  interval?: number
  onComplete?: () => void
}

export function Fireworks({
  active = false,
  bursts = 5,
  interval = 300,
  onComplete
}: FireworksProps) {
  const [activeBursts, setActiveBursts] = useState<number[]>([])

  useEffect(() => {
    if (!active) {
      setActiveBursts([])
      return
    }

    const burstIds: number[] = []

    for (let i = 0; i < bursts; i++) {
      setTimeout(() => {
        setActiveBursts(prev => [...prev, i])
      }, i * interval)
      burstIds.push(i)
    }

    const timeout = setTimeout(() => {
      onComplete?.()
    }, bursts * interval + 3000)

    return () => clearTimeout(timeout)
  }, [active, bursts, interval, onComplete])

  return (
    <>
      {activeBursts.map(id => (
        <Confetti
          key={id}
          active={true}
          particleCount={30}
          origin={{
            x: 0.2 + Math.random() * 0.6,
            y: 0.3 + Math.random() * 0.4
          }}
          spread={360}
          colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#FFFFFF']}
          onComplete={() => {
            setActiveBursts(prev => prev.filter(b => b !== id))
          }}
        />
      ))}
    </>
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

// MARK: - Particle Model
struct ConfettiParticle: Identifiable {
    let id = UUID()
    var x: CGFloat
    var y: CGFloat
    var vx: CGFloat
    var vy: CGFloat
    var color: Color
    var size: CGFloat
    var rotation: Double
    var rotationSpeed: Double
    var shape: ConfettiShape
    var opacity: Double
}

enum ConfettiShape: CaseIterable {
    case square, circle, star
}

// MARK: - Main Confetti View
struct Confetti: View {
    @Binding var isActive: Bool
    var particleCount: Int = 50
    var duration: Double = 3.0
    var colors: [Color] = [.red, .blue, .green, .yellow, .purple, .orange, .pink]
    var spread: Double = 70
    var origin: CGPoint = CGPoint(x: 0.5, y: 0.5)
    var gravity: Double = 1.0
    var shapes: [ConfettiShape] = [.square, .circle]
    var onComplete: (() -> Void)?

    @State private var particles: [ConfettiParticle] = []
    @State private var timer: Timer?

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                ForEach(particles) { particle in
                    ParticleView(particle: particle)
                }
            }
            .onChange(of: isActive) { newValue in
                if newValue {
                    startAnimation(in: geometry.size)
                }
            }
        }
        .allowsHitTesting(false)
    }

    private func startAnimation(in size: CGSize) {
        // Create particles
        let centerX = size.width * origin.x
        let centerY = size.height * origin.y

        particles = (0..<particleCount).map { _ in
            let angle = (Double.random(in: -spread/2...spread/2) - 90) * .pi / 180
            let velocity = Double.random(in: 4...12)

            return ConfettiParticle(
                x: centerX,
                y: centerY,
                vx: cos(angle) * velocity * Double.random(in: 0.5...1.0),
                vy: sin(angle) * velocity * Double.random(in: 0.5...1.0),
                color: colors.randomElement() ?? .red,
                size: CGFloat.random(in: 4...12),
                rotation: Double.random(in: 0...360),
                rotationSpeed: Double.random(in: -10...10),
                shape: shapes.randomElement() ?? .square,
                opacity: 1.0
            )
        }

        // Start animation timer
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1/60, repeats: true) { _ in
            updateParticles()
        }

        // Stop after duration
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            timer?.invalidate()
            timer = nil
            withAnimation {
                particles.removeAll()
            }
            isActive = false
            onComplete?()
        }
    }

    private func updateParticles() {
        for i in particles.indices {
            particles[i].vy += 0.3 * gravity
            particles[i].x += particles[i].vx
            particles[i].y += particles[i].vy
            particles[i].rotation += particles[i].rotationSpeed
            particles[i].opacity -= 0.008
        }

        particles.removeAll { $0.opacity <= 0 }
    }
}

// MARK: - Particle View
struct ParticleView: View {
    let particle: ConfettiParticle

    var body: some View {
        Group {
            switch particle.shape {
            case .circle:
                Circle()
                    .fill(particle.color)
            case .star:
                StarShape()
                    .fill(particle.color)
            case .square:
                Rectangle()
                    .fill(particle.color)
            }
        }
        .frame(width: particle.size, height: particle.size)
        .rotationEffect(.degrees(particle.rotation))
        .opacity(particle.opacity)
        .position(x: particle.x, y: particle.y)
    }
}

// MARK: - Star Shape
struct StarShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2

        for i in 0..<5 {
            let angle = Double(i) * 4 * .pi / 5 - .pi / 2
            let point = CGPoint(
                x: center.x + cos(angle) * radius,
                y: center.y + sin(angle) * radius
            )

            if i == 0 {
                path.move(to: point)
            } else {
                path.addLine(to: point)
            }
        }

        path.closeSubpath()
        return path
    }
}

// MARK: - Confetti Button
struct ConfettiButton<Content: View>: View {
    let content: Content
    let action: () -> Void
    var particleCount: Int = 50
    var colors: [Color] = [.red, .blue, .green, .yellow, .purple, .orange, .pink]

    @State private var showConfetti = false

    init(
        action: @escaping () -> Void,
        particleCount: Int = 50,
        colors: [Color] = [.red, .blue, .green, .yellow, .purple, .orange, .pink],
        @ViewBuilder content: () -> Content
    ) {
        self.action = action
        self.particleCount = particleCount
        self.colors = colors
        self.content = content()
    }

    var body: some View {
        ZStack {
            Button(action: {
                showConfetti = true
                action()
            }) {
                content
            }

            Confetti(
                isActive: $showConfetti,
                particleCount: particleCount,
                colors: colors
            )
        }
    }
}

// MARK: - Confetti Cannon
enum CannonPosition {
    case left, right, top, bottom, center

    var origin: CGPoint {
        switch self {
        case .left: return CGPoint(x: 0, y: 0.5)
        case .right: return CGPoint(x: 1, y: 0.5)
        case .top: return CGPoint(x: 0.5, y: 0)
        case .bottom: return CGPoint(x: 0.5, y: 1)
        case .center: return CGPoint(x: 0.5, y: 0.5)
        }
    }
}

struct ConfettiCannon: View {
    @Binding var isActive: Bool
    var position: CannonPosition = .bottom
    var particleCount: Int = 50
    var colors: [Color] = [.red, .blue, .green, .yellow, .purple, .orange, .pink]
    var onComplete: (() -> Void)?

    var body: some View {
        Confetti(
            isActive: $isActive,
            particleCount: particleCount,
            colors: colors,
            origin: position.origin,
            onComplete: onComplete
        )
    }
}

// MARK: - Fireworks Effect
struct Fireworks: View {
    @Binding var isActive: Bool
    var bursts: Int = 5
    var interval: Double = 0.3
    var onComplete: (() -> Void)?

    @State private var activeBursts: [Int] = []

    var body: some View {
        ZStack {
            ForEach(activeBursts, id: \\.self) { id in
                Confetti(
                    isActive: .constant(true),
                    particleCount: 30,
                    colors: [.yellow, .red, .cyan, .white],
                    spread: 360,
                    origin: CGPoint(
                        x: 0.2 + Double.random(in: 0...0.6),
                        y: 0.3 + Double.random(in: 0...0.4)
                    )
                )
            }
        }
        .onChange(of: isActive) { newValue in
            if newValue {
                startFireworks()
            }
        }
    }

    private func startFireworks() {
        activeBursts.removeAll()

        for i in 0..<bursts {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(i) * interval) {
                activeBursts.append(i)
            }
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + Double(bursts) * interval + 3) {
            isActive = false
            activeBursts.removeAll()
            onComplete?()
        }
    }
}

// MARK: - View Modifier for Confetti
extension View {
    func confetti(isActive: Binding<Bool>, particleCount: Int = 50) -> some View {
        ZStack {
            self
            Confetti(isActive: isActive, particleCount: particleCount)
        }
    }
}

// MARK: - Preview
struct Confetti_Previews: PreviewProvider {
    static var previews: some View {
        ConfettiPreviewContainer()
    }
}

struct ConfettiPreviewContainer: View {
    @State private var showConfetti = false
    @State private var showFireworks = false

    var body: some View {
        VStack(spacing: 20) {
            Button("Confetti!") {
                showConfetti = true
            }
            .buttonStyle(.borderedProminent)

            Button("Fireworks!") {
                showFireworks = true
            }
            .buttonStyle(.bordered)

            ConfettiButton(action: {
                print("Celebration!")
            }) {
                Text("Confetti Button")
                    .padding()
                    .background(Color.purple)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
        }
        .confetti(isActive: $showConfetti)
        .overlay(
            Fireworks(isActive: $showFireworks)
        )
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.animation:animation'
      ],
      imports: [
        'androidx.compose.animation.core.*',
        'androidx.compose.foundation.Canvas',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.geometry.Offset',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.graphics.drawscope.rotate',
        'kotlinx.coroutines.delay'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import kotlin.math.cos
import kotlin.math.sin
import kotlin.random.Random

data class ConfettiParticle(
    val id: Int,
    var x: Float,
    var y: Float,
    var vx: Float,
    var vy: Float,
    val color: Color,
    val size: Float,
    var rotation: Float,
    val rotationSpeed: Float,
    val shape: ConfettiShape,
    var opacity: Float
)

enum class ConfettiShape { SQUARE, CIRCLE, STAR }

@Composable
fun Confetti(
    isActive: Boolean,
    modifier: Modifier = Modifier,
    particleCount: Int = 50,
    duration: Long = 3000L,
    colors: List<Color> = listOf(
        Color(0xFFFF6B6B), Color(0xFF4ECDC4), Color(0xFF45B7D1),
        Color(0xFF96CEB4), Color(0xFFFFEAA7), Color(0xFFDDA0DD)
    ),
    spread: Float = 70f,
    originX: Float = 0.5f,
    originY: Float = 0.5f,
    gravity: Float = 1f,
    shapes: List<ConfettiShape> = listOf(ConfettiShape.SQUARE, ConfettiShape.CIRCLE),
    onComplete: (() -> Unit)? = null
) {
    var particles by remember { mutableStateOf<List<ConfettiParticle>>(emptyList()) }
    var isAnimating by remember { mutableStateOf(false) }

    LaunchedEffect(isActive) {
        if (isActive && !isAnimating) {
            isAnimating = true

            // Create particles
            particles = (0 until particleCount).map { i ->
                val angle = (Random.nextFloat() * spread - spread / 2 - 90) * (Math.PI / 180).toFloat()
                val velocity = Random.nextFloat() * 8 + 4

                ConfettiParticle(
                    id = i,
                    x = originX,
                    y = originY,
                    vx = cos(angle) * velocity * (Random.nextFloat() * 0.5f + 0.5f),
                    vy = sin(angle) * velocity * (Random.nextFloat() * 0.5f + 0.5f),
                    color = colors.random(),
                    size = Random.nextFloat() * 8 + 4,
                    rotation = Random.nextFloat() * 360,
                    rotationSpeed = (Random.nextFloat() - 0.5f) * 10,
                    shape = shapes.random(),
                    opacity = 1f
                )
            }

            // Animate
            val startTime = System.currentTimeMillis()
            while (System.currentTimeMillis() - startTime < duration && particles.isNotEmpty()) {
                delay(16) // ~60fps
                particles = particles.mapNotNull { particle ->
                    particle.copy(
                        vy = particle.vy + 0.01f * gravity,
                        x = particle.x + particle.vx * 0.01f,
                        y = particle.y + particle.vy * 0.01f,
                        rotation = particle.rotation + particle.rotationSpeed,
                        opacity = particle.opacity - 0.005f
                    ).takeIf { it.opacity > 0 }
                }
            }

            particles = emptyList()
            isAnimating = false
            onComplete?.invoke()
        }
    }

    if (particles.isNotEmpty()) {
        BoxWithConstraints(modifier = modifier.fillMaxSize()) {
            val width = constraints.maxWidth.toFloat()
            val height = constraints.maxHeight.toFloat()

            Canvas(modifier = Modifier.fillMaxSize()) {
                particles.forEach { particle ->
                    val px = particle.x * width
                    val py = particle.y * height

                    rotate(particle.rotation, pivot = Offset(px, py)) {
                        when (particle.shape) {
                            ConfettiShape.CIRCLE -> {
                                drawCircle(
                                    color = particle.color.copy(alpha = particle.opacity),
                                    radius = particle.size / 2,
                                    center = Offset(px, py)
                                )
                            }
                            ConfettiShape.STAR -> {
                                val path = Path().apply {
                                    for (i in 0 until 5) {
                                        val angle = (i * 4 * Math.PI / 5 - Math.PI / 2).toFloat()
                                        val x = px + cos(angle) * particle.size / 2
                                        val y = py + sin(angle) * particle.size / 2
                                        if (i == 0) moveTo(x, y) else lineTo(x, y)
                                    }
                                    close()
                                }
                                drawPath(
                                    path = path,
                                    color = particle.color.copy(alpha = particle.opacity)
                                )
                            }
                            ConfettiShape.SQUARE -> {
                                drawRect(
                                    color = particle.color.copy(alpha = particle.opacity),
                                    topLeft = Offset(px - particle.size / 2, py - particle.size / 2),
                                    size = Size(particle.size, particle.size)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ConfettiButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    particleCount: Int = 50,
    colors: List<Color> = listOf(
        Color(0xFFFF6B6B), Color(0xFF4ECDC4), Color(0xFF45B7D1),
        Color(0xFF96CEB4), Color(0xFFFFEAA7), Color(0xFFDDA0DD)
    ),
    content: @Composable () -> Unit
) {
    var showConfetti by remember { mutableStateOf(false) }

    Box(modifier = modifier) {
        Button(
            onClick = {
                showConfetti = true
                onClick()
            }
        ) {
            content()
        }

        Confetti(
            isActive = showConfetti,
            particleCount = particleCount,
            colors = colors,
            onComplete = { showConfetti = false }
        )
    }
}

enum class CannonPosition(val originX: Float, val originY: Float) {
    LEFT(0f, 0.5f),
    RIGHT(1f, 0.5f),
    TOP(0.5f, 0f),
    BOTTOM(0.5f, 1f),
    CENTER(0.5f, 0.5f)
}

@Composable
fun ConfettiCannon(
    isActive: Boolean,
    position: CannonPosition = CannonPosition.BOTTOM,
    modifier: Modifier = Modifier,
    particleCount: Int = 50,
    colors: List<Color> = listOf(
        Color(0xFFFF6B6B), Color(0xFF4ECDC4), Color(0xFF45B7D1),
        Color(0xFF96CEB4), Color(0xFFFFEAA7), Color(0xFFDDA0DD)
    ),
    onComplete: (() -> Unit)? = null
) {
    Confetti(
        isActive = isActive,
        modifier = modifier,
        particleCount = particleCount,
        colors = colors,
        originX = position.originX,
        originY = position.originY,
        onComplete = onComplete
    )
}

@Composable
fun Fireworks(
    isActive: Boolean,
    modifier: Modifier = Modifier,
    bursts: Int = 5,
    interval: Long = 300L,
    onComplete: (() -> Unit)? = null
) {
    var activeBursts by remember { mutableStateOf<List<Int>>(emptyList()) }

    LaunchedEffect(isActive) {
        if (isActive) {
            activeBursts = emptyList()

            for (i in 0 until bursts) {
                delay(interval)
                activeBursts = activeBursts + i
            }

            delay(3000)
            activeBursts = emptyList()
            onComplete?.invoke()
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        activeBursts.forEach { id ->
            key(id) {
                Confetti(
                    isActive = true,
                    particleCount = 30,
                    colors = listOf(Color.Yellow, Color.Red, Color.Cyan, Color.White),
                    spread = 360f,
                    originX = 0.2f + Random.nextFloat() * 0.6f,
                    originY = 0.3f + Random.nextFloat() * 0.4f
                )
            }
        }
    }
}
`
    }
  }
}
