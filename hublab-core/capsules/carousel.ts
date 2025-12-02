/**
 * Carousel Capsule
 *
 * Image/content carousel with swipe gestures and indicators.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const CarouselCapsule: CapsuleDefinition = {
  id: 'carousel',
  name: 'Carousel',
  description: 'Image/content carousel with swipe and indicators',
  category: 'layout',
  tags: ['carousel', 'slider', 'gallery', 'swipe', 'images'],

  props: {
    items: {
      type: 'array',
      required: true,
      description: 'Array of carousel items'
    },
    autoPlay: {
      type: 'boolean',
      default: false,
      description: 'Auto-play slides'
    },
    autoPlayInterval: {
      type: 'number',
      default: 5000,
      description: 'Auto-play interval in ms'
    },
    showIndicators: {
      type: 'boolean',
      default: true,
      description: 'Show page indicators'
    },
    showArrows: {
      type: 'boolean',
      default: true,
      description: 'Show navigation arrows'
    },
    loop: {
      type: 'boolean',
      default: true,
      description: 'Enable infinite loop'
    },
    slidesPerView: {
      type: 'number',
      default: 1,
      description: 'Number of visible slides'
    },
    gap: {
      type: 'number',
      default: 16,
      description: 'Gap between slides'
    },
    aspectRatio: {
      type: 'string',
      default: '16/9',
      description: 'Aspect ratio of carousel'
    },
    onSlideChange: {
      type: 'function',
      description: 'Callback when slide changes'
    }
  },

  platforms: {
    web: {
      dependencies: ['react', 'lucide-react'],
      code: `
import React, { useState, useEffect, useCallback, useRef, useMemo, Children } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  id: string
  image?: string
  title?: string
  description?: string
  content?: React.ReactNode
}

interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showIndicators?: boolean
  showArrows?: boolean
  loop?: boolean
  slidesPerView?: number
  gap?: number
  aspectRatio?: string
  onSlideChange?: (index: number) => void
  className?: string
}

export function Carousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true,
  loop = true,
  slidesPerView = 1,
  gap = 16,
  aspectRatio = '16/9',
  onSlideChange,
  className = ''
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const maxIndex = Math.max(0, items.length - slidesPerView)

  const goToSlide = useCallback((index: number) => {
    let newIndex = index
    if (loop) {
      if (index < 0) newIndex = maxIndex
      else if (index > maxIndex) newIndex = 0
    } else {
      newIndex = Math.max(0, Math.min(index, maxIndex))
    }
    setCurrentIndex(newIndex)
    onSlideChange?.(newIndex)
  }, [loop, maxIndex, onSlideChange])

  const goToPrev = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide])
  const goToNext = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered || isDragging) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, isDragging, goToNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrev, goToNext])

  // Touch/Mouse drag
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setDragStart(clientX)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    setDragOffset(clientX - dragStart)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50
    if (dragOffset > threshold) {
      goToPrev()
    } else if (dragOffset < -threshold) {
      goToNext()
    }
    setDragOffset(0)
  }

  const slideWidth = useMemo(() => {
    return \`calc((100% - \${gap * (slidesPerView - 1)}px) / \${slidesPerView})\`
  }, [gap, slidesPerView])

  const translateX = useMemo(() => {
    const baseTranslate = currentIndex * (100 / slidesPerView)
    const gapOffset = currentIndex * gap
    const dragPercent = containerRef.current
      ? (dragOffset / containerRef.current.offsetWidth) * 100
      : 0
    return \`calc(-\${baseTranslate}% - \${gapOffset}px + \${dragPercent}%)\`
  }, [currentIndex, slidesPerView, gap, dragOffset])

  return (
    <div
      ref={containerRef}
      className={\`relative overflow-hidden \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ aspectRatio }}
    >
      {/* Slides container */}
      <div
        className={\`flex h-full transition-transform duration-300 ease-out \${isDragging ? 'cursor-grabbing' : 'cursor-grab'}\`}
        style={{
          transform: \`translateX(\${translateX})\`,
          gap: \`\${gap}px\`,
          transitionDuration: isDragging ? '0ms' : '300ms'
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex-shrink-0 h-full"
            style={{ width: slideWidth }}
          >
            {item.content ? (
              item.content
            ) : item.image ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title || \`Slide \${index + 1}\`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {(item.title || item.description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    {item.title && (
                      <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-white/80">{item.description}</p>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && items.length > slidesPerView && (
        <>
          <button
            onClick={goToPrev}
            className={\`
              absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
              bg-white/90 shadow-lg flex items-center justify-center
              hover:bg-white transition-all duration-200
              \${(!loop && currentIndex === 0) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            \`}
            disabled={!loop && currentIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className={\`
              absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
              bg-white/90 shadow-lg flex items-center justify-center
              hover:bg-white transition-all duration-200
              \${(!loop && currentIndex === maxIndex) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            \`}
            disabled={!loop && currentIndex === maxIndex}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > slidesPerView && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={\`
                w-2 h-2 rounded-full transition-all duration-200
                \${index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'}
              \`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Image Gallery Carousel
export function ImageGallery({
  images,
  showThumbnails = true,
  aspectRatio = '16/9',
  className = ''
}: {
  images: { src: string; alt?: string }[]
  showThumbnails?: boolean
  aspectRatio?: string
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className={\`flex flex-col gap-4 \${className}\`}>
      <Carousel
        items={images.map((img, i) => ({
          id: String(i),
          image: img.src,
          title: img.alt
        }))}
        showIndicators={!showThumbnails}
        onSlideChange={setCurrentIndex}
        aspectRatio={aspectRatio}
      />

      {showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={\`
                flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden
                ring-2 transition-all
                \${index === currentIndex
                  ? 'ring-blue-500 ring-offset-2'
                  : 'ring-transparent hover:ring-gray-300'}
              \`}
            >
              <img
                src={img.src}
                alt={img.alt || \`Thumbnail \${index + 1}\`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Card Carousel
export function CardCarousel({
  children,
  slidesPerView = 3,
  gap = 16,
  showArrows = true,
  className = ''
}: {
  children: React.ReactNode
  slidesPerView?: number
  gap?: number
  showArrows?: boolean
  className?: string
}) {
  const items = Children.toArray(children).map((child, index) => ({
    id: String(index),
    content: child
  }))

  return (
    <div className={className}>
      <Carousel
        items={items}
        slidesPerView={slidesPerView}
        gap={gap}
        showArrows={showArrows}
        showIndicators={false}
        aspectRatio="auto"
        loop={false}
      />
    </div>
  )
}

// Hero Carousel
export function HeroCarousel({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  height = '500px',
  className = ''
}: {
  slides: {
    image: string
    title: string
    subtitle?: string
    cta?: { text: string; href: string }
  }[]
  autoPlay?: boolean
  autoPlayInterval?: number
  height?: string
  className?: string
}) {
  const items = slides.map((slide, i) => ({
    id: String(i),
    content: (
      <div
        className="relative w-full h-full bg-cover bg-center"
        style={{ backgroundImage: \`url(\${slide.image})\` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
            {slide.subtitle && (
              <p className="text-lg md:text-xl mb-8 text-white/90">{slide.subtitle}</p>
            )}
            {slide.cta && (
              <a
                href={slide.cta.href}
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full
                           font-semibold hover:bg-gray-100 transition-colors"
              >
                {slide.cta.text}
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }))

  return (
    <div className={className} style={{ height }}>
      <Carousel
        items={items}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        aspectRatio="auto"
      />
    </div>
  )
}

// Testimonial Carousel
export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  className = ''
}: {
  testimonials: {
    quote: string
    author: string
    role?: string
    avatar?: string
  }[]
  autoPlay?: boolean
  className?: string
}) {
  const items = testimonials.map((t, i) => ({
    id: String(i),
    content: (
      <div className="flex flex-col items-center text-center px-8 py-12">
        <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl">
          "{t.quote}"
        </blockquote>
        <div className="flex items-center gap-4">
          {t.avatar && (
            <img
              src={t.avatar}
              alt={t.author}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="text-left">
            <div className="font-semibold text-gray-900">{t.author}</div>
            {t.role && <div className="text-sm text-gray-500">{t.role}</div>}
          </div>
        </div>
      </div>
    )
  }))

  return (
    <div className={\`bg-gray-50 rounded-2xl \${className}\`}>
      <Carousel
        items={items}
        autoPlay={autoPlay}
        autoPlayInterval={8000}
        showArrows={false}
        aspectRatio="auto"
      />
    </div>
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Carousel Item
struct CarouselItem: Identifiable {
    let id: String
    var image: String?
    var title: String?
    var description: String?
    var content: AnyView?

    init(id: String = UUID().uuidString, image: String? = nil, title: String? = nil, description: String? = nil) {
        self.id = id
        self.image = image
        self.title = title
        self.description = description
        self.content = nil
    }

    init<Content: View>(id: String = UUID().uuidString, @ViewBuilder content: () -> Content) {
        self.id = id
        self.image = nil
        self.title = nil
        self.description = nil
        self.content = AnyView(content())
    }
}

// MARK: - Carousel View
struct CarouselView: View {
    let items: [CarouselItem]
    var autoPlay: Bool = false
    var autoPlayInterval: Double = 5.0
    var showIndicators: Bool = true
    var showArrows: Bool = true
    var loop: Bool = true
    var onSlideChange: ((Int) -> Void)?

    @State private var currentIndex: Int = 0
    @State private var dragOffset: CGFloat = 0
    @GestureState private var isDragging = false

    private let timer = Timer.publish(every: 5, on: .main, in: .common).autoconnect()

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Slides
                HStack(spacing: 0) {
                    ForEach(items.indices, id: \\.self) { index in
                        slideView(items[index], geometry: geometry)
                            .frame(width: geometry.size.width)
                    }
                }
                .offset(x: -CGFloat(currentIndex) * geometry.size.width + dragOffset)
                .animation(.spring(response: 0.4), value: currentIndex)
                .gesture(dragGesture(geometry: geometry))

                // Navigation
                if showArrows && items.count > 1 {
                    HStack {
                        arrowButton(direction: .left, geometry: geometry)
                        Spacer()
                        arrowButton(direction: .right, geometry: geometry)
                    }
                    .padding(.horizontal, 16)
                }

                // Indicators
                if showIndicators && items.count > 1 {
                    VStack {
                        Spacer()
                        HStack(spacing: 8) {
                            ForEach(items.indices, id: \\.self) { index in
                                Circle()
                                    .fill(index == currentIndex ? Color.white : Color.white.opacity(0.5))
                                    .frame(width: index == currentIndex ? 24 : 8, height: 8)
                                    .animation(.spring(response: 0.3), value: currentIndex)
                                    .onTapGesture {
                                        goToSlide(index)
                                    }
                            }
                        }
                        .padding(.bottom, 16)
                    }
                }
            }
        }
        .onReceive(timer) { _ in
            if autoPlay && !isDragging {
                goToNext()
            }
        }
    }

    @ViewBuilder
    private func slideView(_ item: CarouselItem, geometry: GeometryProxy) -> some View {
        if let content = item.content {
            content
        } else if let image = item.image {
            ZStack(alignment: .bottom) {
                AsyncImage(url: URL(string: image)) { phase in
                    switch phase {
                    case .success(let img):
                        img
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure:
                        Color.gray
                    case .empty:
                        ProgressView()
                    @unknown default:
                        Color.gray
                    }
                }
                .frame(width: geometry.size.width, height: geometry.size.height)
                .clipped()

                if item.title != nil || item.description != nil {
                    VStack(alignment: .leading, spacing: 4) {
                        if let title = item.title {
                            Text(title)
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                        }
                        if let description = item.description {
                            Text(description)
                                .font(.subheadline)
                                .foregroundColor(.white.opacity(0.8))
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(
                        LinearGradient(
                            colors: [.clear, .black.opacity(0.7)],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                }
            }
            .cornerRadius(16)
        }
    }

    private func arrowButton(direction: ArrowDirection, geometry: GeometryProxy) -> some View {
        Button {
            direction == .left ? goToPrev() : goToNext()
        } label: {
            Image(systemName: direction == .left ? "chevron.left" : "chevron.right")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(.primary)
                .frame(width: 40, height: 40)
                .background(.regularMaterial)
                .clipShape(Circle())
        }
        .disabled(!loop && (direction == .left ? currentIndex == 0 : currentIndex == items.count - 1))
        .opacity(!loop && (direction == .left ? currentIndex == 0 : currentIndex == items.count - 1) ? 0.5 : 1)
    }

    private enum ArrowDirection {
        case left, right
    }

    private func dragGesture(geometry: GeometryProxy) -> some Gesture {
        DragGesture()
            .updating($isDragging) { _, state, _ in
                state = true
            }
            .onChanged { value in
                dragOffset = value.translation.width
            }
            .onEnded { value in
                let threshold = geometry.size.width * 0.25
                if value.translation.width > threshold {
                    goToPrev()
                } else if value.translation.width < -threshold {
                    goToNext()
                }
                dragOffset = 0
            }
    }

    private func goToSlide(_ index: Int) {
        var newIndex = index
        if loop {
            if index < 0 { newIndex = items.count - 1 }
            else if index >= items.count { newIndex = 0 }
        } else {
            newIndex = max(0, min(index, items.count - 1))
        }
        currentIndex = newIndex
        onSlideChange?(newIndex)
    }

    private func goToPrev() {
        goToSlide(currentIndex - 1)
    }

    private func goToNext() {
        goToSlide(currentIndex + 1)
    }
}

// MARK: - Image Gallery
struct ImageGallery: View {
    let images: [String]
    var showThumbnails: Bool = true

    @State private var currentIndex: Int = 0

    var body: some View {
        VStack(spacing: 16) {
            CarouselView(
                items: images.map { CarouselItem(image: $0) },
                showIndicators: !showThumbnails,
                onSlideChange: { currentIndex = $0 }
            )
            .aspectRatio(16/9, contentMode: .fit)

            if showThumbnails {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(images.indices, id: \\.self) { index in
                            AsyncImage(url: URL(string: images[index])) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            } placeholder: {
                                Color.gray
                            }
                            .frame(width: 60, height: 60)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .strokeBorder(
                                        index == currentIndex ? Color.blue : Color.clear,
                                        lineWidth: 2
                                    )
                            )
                            .onTapGesture {
                                currentIndex = index
                            }
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Hero Carousel
struct HeroCarousel: View {
    let slides: [HeroSlide]
    var autoPlay: Bool = true
    var height: CGFloat = 400

    struct HeroSlide {
        let image: String
        let title: String
        var subtitle: String?
        var ctaText: String?
        var ctaAction: (() -> Void)?
    }

    var body: some View {
        CarouselView(
            items: slides.map { slide in
                CarouselItem {
                    ZStack {
                        AsyncImage(url: URL(string: slide.image)) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color.gray
                        }

                        Color.black.opacity(0.4)

                        VStack(spacing: 16) {
                            Text(slide.title)
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .multilineTextAlignment(.center)

                            if let subtitle = slide.subtitle {
                                Text(subtitle)
                                    .font(.title3)
                                    .foregroundColor(.white.opacity(0.9))
                                    .multilineTextAlignment(.center)
                            }

                            if let ctaText = slide.ctaText {
                                Button(ctaText) {
                                    slide.ctaAction?()
                                }
                                .buttonStyle(.borderedProminent)
                                .controlSize(.large)
                                .tint(.white)
                                .foregroundColor(.black)
                            }
                        }
                        .padding()
                    }
                }
            },
            autoPlay: autoPlay
        )
        .frame(height: height)
    }
}

// MARK: - Preview
struct CarouselView_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            CarouselView(
                items: [
                    CarouselItem(image: "https://picsum.photos/800/400?1", title: "First Slide"),
                    CarouselItem(image: "https://picsum.photos/800/400?2", title: "Second Slide"),
                    CarouselItem(image: "https://picsum.photos/800/400?3", title: "Third Slide")
                ],
                autoPlay: true
            )
            .aspectRatio(16/9, contentMode: .fit)
        }
        .padding()
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.foundation', 'coil-compose'],
      code: `
package com.hublab.capsules

import androidx.compose.animation.core.*
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.snapping.rememberSnapFlingBehavior
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// Carousel Item
data class CarouselItem(
    val id: String,
    val image: String? = null,
    val title: String? = null,
    val description: String? = null,
    val content: @Composable (() -> Unit)? = null
)

// Carousel View
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun CarouselView(
    items: List<CarouselItem>,
    modifier: Modifier = Modifier,
    autoPlay: Boolean = false,
    autoPlayInterval: Long = 5000,
    showIndicators: Boolean = true,
    showArrows: Boolean = true,
    loop: Boolean = true,
    aspectRatio: Float = 16f / 9f,
    onSlideChange: ((Int) -> Unit)? = null
) {
    val pagerState = rememberPagerState(pageCount = { items.size })
    val coroutineScope = rememberCoroutineScope()

    // Auto-play
    LaunchedEffect(autoPlay) {
        if (autoPlay) {
            while (true) {
                delay(autoPlayInterval)
                val nextPage = if (loop) {
                    (pagerState.currentPage + 1) % items.size
                } else {
                    (pagerState.currentPage + 1).coerceAtMost(items.size - 1)
                }
                pagerState.animateScrollToPage(nextPage)
            }
        }
    }

    // Notify slide change
    LaunchedEffect(pagerState.currentPage) {
        onSlideChange?.invoke(pagerState.currentPage)
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(aspectRatio)
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize()
        ) { page ->
            val item = items[page]

            if (item.content != null) {
                item.content.invoke()
            } else if (item.image != null) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(RoundedCornerShape(16.dp))
                ) {
                    AsyncImage(
                        model = item.image,
                        contentDescription = item.title,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )

                    if (item.title != null || item.description != null) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .align(Alignment.BottomCenter)
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.7f))
                                    )
                                )
                                .padding(16.dp)
                        ) {
                            Column {
                                if (item.title != null) {
                                    Text(
                                        text = item.title,
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                                if (item.description != null) {
                                    Text(
                                        text = item.description,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = Color.White.copy(alpha = 0.8f)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Navigation arrows
        if (showArrows && items.size > 1) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.Center)
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                FloatingActionButton(
                    onClick = {
                        coroutineScope.launch {
                            val prevPage = if (loop) {
                                if (pagerState.currentPage == 0) items.size - 1
                                else pagerState.currentPage - 1
                            } else {
                                (pagerState.currentPage - 1).coerceAtLeast(0)
                            }
                            pagerState.animateScrollToPage(prevPage)
                        }
                    },
                    modifier = Modifier.size(40.dp),
                    containerColor = Color.White.copy(alpha = 0.9f)
                ) {
                    Icon(Icons.Default.ChevronLeft, contentDescription = "Previous")
                }

                FloatingActionButton(
                    onClick = {
                        coroutineScope.launch {
                            val nextPage = if (loop) {
                                (pagerState.currentPage + 1) % items.size
                            } else {
                                (pagerState.currentPage + 1).coerceAtMost(items.size - 1)
                            }
                            pagerState.animateScrollToPage(nextPage)
                        }
                    },
                    modifier = Modifier.size(40.dp),
                    containerColor = Color.White.copy(alpha = 0.9f)
                ) {
                    Icon(Icons.Default.ChevronRight, contentDescription = "Next")
                }
            }
        }

        // Indicators
        if (showIndicators && items.size > 1) {
            Row(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                repeat(items.size) { index ->
                    val isSelected = pagerState.currentPage == index
                    val width by animateDpAsState(
                        targetValue = if (isSelected) 24.dp else 8.dp,
                        animationSpec = spring()
                    )

                    Box(
                        modifier = Modifier
                            .height(8.dp)
                            .width(width)
                            .clip(CircleShape)
                            .background(
                                if (isSelected) Color.White
                                else Color.White.copy(alpha = 0.5f)
                            )
                            .clickable {
                                coroutineScope.launch {
                                    pagerState.animateScrollToPage(index)
                                }
                            }
                    )
                }
            }
        }
    }
}

// Image Gallery
@Composable
fun ImageGallery(
    images: List<String>,
    modifier: Modifier = Modifier,
    showThumbnails: Boolean = true,
    aspectRatio: Float = 16f / 9f
) {
    var currentIndex by remember { mutableStateOf(0) }

    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        CarouselView(
            items = images.map { CarouselItem(id = it, image = it) },
            showIndicators = !showThumbnails,
            onSlideChange = { currentIndex = it },
            aspectRatio = aspectRatio
        )

        if (showThumbnails) {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(images) { image ->
                    val index = images.indexOf(image)
                    AsyncImage(
                        model = image,
                        contentDescription = null,
                        modifier = Modifier
                            .size(60.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .then(
                                if (index == currentIndex) {
                                    Modifier.border(
                                        2.dp,
                                        MaterialTheme.colorScheme.primary,
                                        RoundedCornerShape(8.dp)
                                    )
                                } else Modifier
                            )
                            .clickable { currentIndex = index },
                        contentScale = ContentScale.Crop
                    )
                }
            }
        }
    }
}

// Hero Carousel
@Composable
fun HeroCarousel(
    slides: List<HeroSlide>,
    modifier: Modifier = Modifier,
    autoPlay: Boolean = true,
    autoPlayInterval: Long = 6000,
    height: Dp = 400.dp
) {
    CarouselView(
        items = slides.map { slide ->
            CarouselItem(
                id = slide.title,
                content = {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        AsyncImage(
                            model = slide.image,
                            contentDescription = null,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )

                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.Black.copy(alpha = 0.4f))
                        )

                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp),
                            modifier = Modifier.padding(24.dp)
                        ) {
                            Text(
                                text = slide.title,
                                style = MaterialTheme.typography.displaySmall,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                textAlign = TextAlign.Center
                            )

                            slide.subtitle?.let {
                                Text(
                                    text = it,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = Color.White.copy(alpha = 0.9f),
                                    textAlign = TextAlign.Center
                                )
                            }

                            slide.ctaText?.let { cta ->
                                Button(
                                    onClick = { slide.onCtaClick?.invoke() },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = Color.White,
                                        contentColor = Color.Black
                                    )
                                ) {
                                    Text(cta, fontWeight = FontWeight.SemiBold)
                                }
                            }
                        }
                    }
                }
            )
        },
        modifier = modifier.height(height),
        autoPlay = autoPlay,
        autoPlayInterval = autoPlayInterval,
        aspectRatio = 0f // Use explicit height
    )
}

data class HeroSlide(
    val image: String,
    val title: String,
    val subtitle: String? = null,
    val ctaText: String? = null,
    val onCtaClick: (() -> Unit)? = null
)

// Testimonial Carousel
@Composable
fun TestimonialCarousel(
    testimonials: List<Testimonial>,
    modifier: Modifier = Modifier,
    autoPlay: Boolean = true
) {
    CarouselView(
        items = testimonials.map { t ->
            CarouselItem(
                id = t.author,
                content = {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "\\"${t.quote}\\"",
                            style = MaterialTheme.typography.titleLarge,
                            textAlign = TextAlign.Center,
                            color = MaterialTheme.colorScheme.onSurface
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            t.avatar?.let { avatar ->
                                AsyncImage(
                                    model = avatar,
                                    contentDescription = t.author,
                                    modifier = Modifier
                                        .size(48.dp)
                                        .clip(CircleShape),
                                    contentScale = ContentScale.Crop
                                )
                            }

                            Column {
                                Text(
                                    text = t.author,
                                    fontWeight = FontWeight.SemiBold
                                )
                                t.role?.let {
                                    Text(
                                        text = it,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }
            )
        },
        modifier = modifier
            .background(
                MaterialTheme.colorScheme.surfaceVariant,
                RoundedCornerShape(16.dp)
            ),
        autoPlay = autoPlay,
        autoPlayInterval = 8000,
        showArrows = false,
        aspectRatio = 2f
    )
}

data class Testimonial(
    val quote: String,
    val author: String,
    val role: String? = null,
    val avatar: String? = null
)
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
