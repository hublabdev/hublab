/**
 * BottomSheet Capsule
 *
 * Sliding panel from bottom with drag gestures.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const BottomSheetCapsule: CapsuleDefinition = {
  id: 'bottom-sheet',
  name: 'BottomSheet',
  description: 'Sliding panel from bottom with drag gestures',
  category: 'layout',
  tags: ['bottom-sheet', 'sheet', 'modal', 'drawer', 'panel'],

  props: {
    isOpen: {
      type: 'boolean',
      default: false,
      description: 'Whether sheet is open'
    },
    snapPoints: {
      type: 'array',
      default: ['50%', '90%'],
      description: 'Height snap points'
    },
    initialSnapPoint: {
      type: 'number',
      default: 0,
      description: 'Initial snap point index'
    },
    showHandle: {
      type: 'boolean',
      default: true,
      description: 'Show drag handle'
    },
    showBackdrop: {
      type: 'boolean',
      default: true,
      description: 'Show backdrop overlay'
    },
    backdropDismiss: {
      type: 'boolean',
      default: true,
      description: 'Dismiss on backdrop click'
    },
    onClose: {
      type: 'function',
      description: 'Callback when sheet closes'
    },
    onSnapChange: {
      type: 'function',
      description: 'Callback when snap point changes'
    }
  },

  platforms: {
    web: {
      dependencies: ['react'],
      code: `
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  snapPoints?: (string | number)[]
  initialSnapPoint?: number
  showHandle?: boolean
  showBackdrop?: boolean
  backdropDismiss?: boolean
  onSnapChange?: (index: number) => void
  children: React.ReactNode
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  snapPoints = ['50%', '90%'],
  initialSnapPoint = 0,
  showHandle = true,
  showBackdrop = true,
  backdropDismiss = true,
  onSnapChange,
  children,
  className = ''
}: BottomSheetProps) {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnapPoint)
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const snapPointsInPx = useMemo(() => {
    return snapPoints.map(point => {
      if (typeof point === 'number') return point
      if (point.endsWith('%')) {
        return (parseFloat(point) / 100) * window.innerHeight
      }
      return parseFloat(point)
    })
  }, [snapPoints])

  const currentHeight = useMemo(() => {
    const baseHeight = snapPointsInPx[currentSnapIndex] || snapPointsInPx[0]
    return isDragging ? baseHeight - dragY : baseHeight
  }, [currentSnapIndex, snapPointsInPx, isDragging, dragY])

  const findClosestSnapPoint = useCallback((height: number) => {
    let closestIndex = 0
    let closestDistance = Math.abs(snapPointsInPx[0] - height)

    snapPointsInPx.forEach((point, index) => {
      const distance = Math.abs(point - height)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    return closestIndex
  }, [snapPointsInPx])

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true)
    setStartY(clientY)
    setDragY(0)
  }, [])

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return
    const delta = clientY - startY
    setDragY(delta)
  }, [isDragging, startY])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    const newHeight = currentHeight
    const threshold = 50

    // Close if dragged down past threshold at minimum snap
    if (dragY > threshold && currentSnapIndex === 0) {
      onClose()
      return
    }

    // Find closest snap point
    const newSnapIndex = findClosestSnapPoint(newHeight)

    if (newSnapIndex !== currentSnapIndex) {
      setCurrentSnapIndex(newSnapIndex)
      onSnapChange?.(newSnapIndex)
    }

    setDragY(0)
  }, [isDragging, currentHeight, dragY, currentSnapIndex, findClosestSnapPoint, onSnapChange, onClose])

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentSnapIndex(initialSnapPoint)
      setDragY(0)
    }
  }, [isOpen, initialSnapPoint])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      {showBackdrop && (
        <div
          className={\`absolute inset-0 bg-black/50 transition-opacity duration-300 \${
            isOpen ? 'opacity-100' : 'opacity-0'
          }\`}
          onClick={backdropDismiss ? onClose : undefined}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={\`
          absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
          transform transition-transform
          \${isDragging ? 'transition-none' : 'duration-300 ease-out'}
          \${className}
        \`}
        style={{
          height: Math.max(currentHeight, 100),
          maxHeight: '95vh'
        }}
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleDragStart(e.clientY)}
            onMouseMove={(e) => handleDragMove(e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className="overflow-y-auto"
          style={{ height: showHandle ? 'calc(100% - 24px)' : '100%' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// Action Sheet
interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  actions: {
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive' | 'cancel'
    icon?: React.ReactNode
  }[]
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  message,
  actions
}: ActionSheetProps) {
  const cancelAction = actions.find(a => a.variant === 'cancel')
  const otherActions = actions.filter(a => a.variant !== 'cancel')

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={['auto']}
      showHandle={false}
    >
      <div className="px-4 pb-8 pt-4">
        {/* Header */}
        {(title || message) && (
          <div className="text-center mb-4 pb-4 border-b">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {message && (
              <p className="text-sm text-gray-500 mt-1">{message}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {otherActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick()
                onClose()
              }}
              className={\`
                w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                font-medium text-lg transition-colors
                \${action.variant === 'destructive'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
              \`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* Cancel */}
        {cancelAction && (
          <button
            onClick={() => {
              cancelAction.onClick()
              onClose()
            }}
            className="w-full mt-4 py-4 px-6 rounded-xl bg-gray-100
                       font-semibold text-lg text-gray-600 hover:bg-gray-200"
          >
            {cancelAction.label}
          </button>
        )}
      </div>
    </BottomSheet>
  )
}

// Share Sheet
interface ShareSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  url?: string
  text?: string
  platforms?: ('copy' | 'twitter' | 'facebook' | 'linkedin' | 'email' | 'whatsapp')[]
}

export function ShareSheet({
  isOpen,
  onClose,
  title = 'Share',
  url = '',
  text = '',
  platforms = ['copy', 'twitter', 'facebook', 'linkedin', 'email', 'whatsapp']
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false)

  const shareOptions = {
    copy: {
      label: 'Copy Link',
      icon: '📋',
      action: async () => {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    },
    twitter: {
      label: 'Twitter',
      icon: '🐦',
      action: () => window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(text)}\`)
    },
    facebook: {
      label: 'Facebook',
      icon: '📘',
      action: () => window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`)
    },
    linkedin: {
      label: 'LinkedIn',
      icon: '💼',
      action: () => window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`)
    },
    email: {
      label: 'Email',
      icon: '✉️',
      action: () => window.open(\`mailto:?subject=\${encodeURIComponent(text)}&body=\${encodeURIComponent(url)}\`)
    },
    whatsapp: {
      label: 'WhatsApp',
      icon: '💬',
      action: () => window.open(\`https://wa.me/?text=\${encodeURIComponent(text + ' ' + url)}\`)
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={['auto']}>
      <div className="px-4 pb-8 pt-2">
        <h3 className="text-lg font-semibold text-center mb-6">{title}</h3>

        <div className="grid grid-cols-4 gap-4">
          {platforms.map(platform => {
            const option = shareOptions[platform]
            return (
              <button
                key={platform}
                onClick={option.action}
                className="flex flex-col items-center gap-2 py-3 rounded-xl hover:bg-gray-100"
              >
                <span className="text-3xl">{option.icon}</span>
                <span className="text-xs text-gray-600">
                  {platform === 'copy' && copied ? 'Copied!' : option.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
}

// Filter Sheet
interface FilterSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: Record<string, any>) => void
  filters: {
    key: string
    label: string
    type: 'select' | 'range' | 'checkbox'
    options?: { value: string; label: string }[]
    min?: number
    max?: number
  }[]
  initialValues?: Record<string, any>
}

export function FilterSheet({
  isOpen,
  onClose,
  onApply,
  filters,
  initialValues = {}
}: FilterSheetProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues)

  const handleApply = () => {
    onApply(values)
    onClose()
  }

  const handleReset = () => {
    setValues({})
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={['80%']}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button onClick={handleReset} className="text-blue-600 font-medium">
            Reset
          </button>
          <h3 className="font-semibold">Filters</h3>
          <button onClick={onClose} className="text-gray-400">
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {filters.map(filter => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>

              {filter.type === 'select' && filter.options && (
                <div className="flex flex-wrap gap-2">
                  {filter.options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setValues(v => ({ ...v, [filter.key]: option.value }))}
                      className={\`
                        px-4 py-2 rounded-full text-sm font-medium transition-colors
                        \${values[filter.key] === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      \`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {filter.type === 'range' && (
                <input
                  type="range"
                  min={filter.min || 0}
                  max={filter.max || 100}
                  value={values[filter.key] || filter.min || 0}
                  onChange={e => setValues(v => ({ ...v, [filter.key]: Number(e.target.value) }))}
                  className="w-full"
                />
              )}

              {filter.type === 'checkbox' && filter.options && (
                <div className="space-y-2">
                  {filter.options.map(option => (
                    <label key={option.value} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={(values[filter.key] || []).includes(option.value)}
                        onChange={e => {
                          const current = values[filter.key] || []
                          setValues(v => ({
                            ...v,
                            [filter.key]: e.target.checked
                              ? [...current, option.value]
                              : current.filter((v: string) => v !== option.value)
                          }))
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleApply}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold
                       hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Bottom Sheet
struct BottomSheetView<Content: View>: View {
    @Binding var isPresented: Bool
    var snapPoints: [CGFloat] = [0.5, 0.9]
    var initialSnapIndex: Int = 0
    var showHandle: Bool = true
    var showBackdrop: Bool = true
    var backdropDismiss: Bool = true
    var onSnapChange: ((Int) -> Void)?
    @ViewBuilder var content: () -> Content

    @State private var currentSnapIndex: Int = 0
    @State private var offset: CGFloat = 0
    @State private var lastOffset: CGFloat = 0
    @GestureState private var isDragging = false

    private var currentHeight: CGFloat {
        let screenHeight = UIScreen.main.bounds.height
        return screenHeight * snapPoints[currentSnapIndex] - offset
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .bottom) {
                // Backdrop
                if showBackdrop && isPresented {
                    Color.black
                        .opacity(0.4)
                        .ignoresSafeArea()
                        .onTapGesture {
                            if backdropDismiss {
                                withAnimation(.spring(response: 0.3)) {
                                    isPresented = false
                                }
                            }
                        }
                        .transition(.opacity)
                }

                // Sheet
                if isPresented {
                    VStack(spacing: 0) {
                        // Handle
                        if showHandle {
                            handleView
                                .gesture(dragGesture(geometry: geometry))
                        }

                        // Content
                        content()
                    }
                    .frame(height: max(currentHeight, 100))
                    .frame(maxWidth: .infinity)
                    .background(Color(.systemBackground))
                    .cornerRadius(24, corners: [.topLeft, .topRight])
                    .shadow(color: .black.opacity(0.1), radius: 20)
                    .transition(.move(edge: .bottom))
                }
            }
        }
        .animation(.spring(response: 0.3), value: isPresented)
        .onAppear {
            currentSnapIndex = initialSnapIndex
        }
    }

    private var handleView: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color(.systemGray4))
                .frame(width: 36, height: 5)
                .padding(.vertical, 10)
        }
        .frame(maxWidth: .infinity)
        .contentShape(Rectangle())
    }

    private func dragGesture(geometry: GeometryProxy) -> some Gesture {
        DragGesture()
            .updating($isDragging) { _, state, _ in
                state = true
            }
            .onChanged { value in
                offset = value.translation.height
            }
            .onEnded { value in
                let screenHeight = geometry.size.height
                let velocity = value.predictedEndTranslation.height - value.translation.height
                let threshold: CGFloat = 100

                // Close if dragged down significantly at minimum snap
                if offset > threshold && currentSnapIndex == 0 {
                    withAnimation(.spring(response: 0.3)) {
                        isPresented = false
                    }
                } else {
                    // Find closest snap point
                    let currentHeightRatio = (screenHeight * snapPoints[currentSnapIndex] - offset) / screenHeight
                    var closestIndex = 0
                    var closestDistance = abs(snapPoints[0] - currentHeightRatio)

                    for (index, point) in snapPoints.enumerated() {
                        let distance = abs(point - currentHeightRatio)
                        if distance < closestDistance {
                            closestDistance = distance
                            closestIndex = index
                        }
                    }

                    if closestIndex != currentSnapIndex {
                        onSnapChange?(closestIndex)
                    }

                    withAnimation(.spring(response: 0.3)) {
                        currentSnapIndex = closestIndex
                        offset = 0
                    }
                }
            }
    }
}

// MARK: - Corner Radius Extension
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

// MARK: - Action Sheet
struct ActionSheetView: View {
    @Binding var isPresented: Bool
    var title: String?
    var message: String?
    var actions: [ActionSheetAction]

    struct ActionSheetAction: Identifiable {
        let id = UUID()
        let label: String
        let action: () -> Void
        var variant: ActionVariant = .default
        var icon: Image?

        enum ActionVariant {
            case \`default\`, destructive, cancel
        }
    }

    var body: some View {
        BottomSheetView(
            isPresented: $isPresented,
            snapPoints: [0.4],
            showHandle: false
        ) {
            VStack(spacing: 16) {
                // Header
                if title != nil || message != nil {
                    VStack(spacing: 4) {
                        if let title = title {
                            Text(title)
                                .font(.headline)
                        }
                        if let message = message {
                            Text(message)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.bottom, 8)

                    Divider()
                }

                // Actions
                VStack(spacing: 8) {
                    ForEach(actions.filter { $0.variant != .cancel }) { action in
                        Button {
                            action.action()
                            isPresented = false
                        } label: {
                            HStack(spacing: 12) {
                                if let icon = action.icon {
                                    icon
                                }
                                Text(action.label)
                                    .fontWeight(.medium)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                action.variant == .destructive
                                    ? Color.red.opacity(0.1)
                                    : Color(.secondarySystemBackground)
                            )
                            .foregroundColor(
                                action.variant == .destructive ? .red : .primary
                            )
                            .cornerRadius(12)
                        }
                    }
                }

                // Cancel
                if let cancelAction = actions.first(where: { $0.variant == .cancel }) {
                    Button {
                        cancelAction.action()
                        isPresented = false
                    } label: {
                        Text(cancelAction.label)
                            .fontWeight(.semibold)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(Color(.secondarySystemBackground))
                            .foregroundColor(.secondary)
                            .cornerRadius(12)
                    }
                }
            }
            .padding()
        }
    }
}

// MARK: - Share Sheet
struct ShareSheetView: View {
    @Binding var isPresented: Bool
    var title: String = "Share"
    var url: String = ""
    var text: String = ""

    @State private var copied = false

    private let shareOptions: [(String, String, () -> Void)] = []

    var body: some View {
        BottomSheetView(
            isPresented: $isPresented,
            snapPoints: [0.35]
        ) {
            VStack(spacing: 20) {
                Text(title)
                    .font(.headline)

                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    ShareButton(icon: "doc.on.doc", label: copied ? "Copied!" : "Copy") {
                        UIPasteboard.general.string = url
                        copied = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            copied = false
                        }
                    }

                    ShareButton(icon: "message", label: "Message") {
                        // Native share
                    }

                    ShareButton(icon: "envelope", label: "Email") {
                        // Native share
                    }

                    ShareButton(icon: "square.and.arrow.up", label: "More") {
                        // Native share
                    }
                }
            }
            .padding()
        }
    }
}

struct ShareButton: View {
    let icon: String
    let label: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                    .frame(width: 50, height: 50)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(Circle())

                Text(label)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .foregroundColor(.primary)
    }
}

// MARK: - Filter Sheet
struct FilterSheetView: View {
    @Binding var isPresented: Bool
    var onApply: ([String: Any]) -> Void
    var filters: [FilterItem]

    @State private var values: [String: Any] = [:]

    struct FilterItem: Identifiable {
        let id = UUID()
        let key: String
        let label: String
        let type: FilterType
        var options: [(String, String)]?
        var range: ClosedRange<Double>?

        enum FilterType {
            case select, range, checkbox
        }
    }

    var body: some View {
        BottomSheetView(
            isPresented: $isPresented,
            snapPoints: [0.8]
        ) {
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button("Reset") {
                        values = [:]
                    }
                    .foregroundColor(.blue)

                    Spacer()

                    Text("Filters")
                        .fontWeight(.semibold)

                    Spacer()

                    Button {
                        isPresented = false
                    } label: {
                        Image(systemName: "xmark")
                            .foregroundColor(.secondary)
                    }
                }
                .padding()

                Divider()

                // Filters
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        ForEach(filters) { filter in
                            VStack(alignment: .leading, spacing: 12) {
                                Text(filter.label)
                                    .font(.subheadline)
                                    .fontWeight(.medium)

                                switch filter.type {
                                case .select:
                                    if let options = filter.options {
                                        FlowLayout(spacing: 8) {
                                            ForEach(options, id: \\.0) { option in
                                                Button {
                                                    values[filter.key] = option.0
                                                } label: {
                                                    Text(option.1)
                                                        .font(.subheadline)
                                                        .padding(.horizontal, 16)
                                                        .padding(.vertical, 10)
                                                        .background(
                                                            values[filter.key] as? String == option.0
                                                                ? Color.blue
                                                                : Color(.secondarySystemBackground)
                                                        )
                                                        .foregroundColor(
                                                            values[filter.key] as? String == option.0
                                                                ? .white
                                                                : .primary
                                                        )
                                                        .cornerRadius(20)
                                                }
                                            }
                                        }
                                    }

                                case .range:
                                    if let range = filter.range {
                                        Slider(
                                            value: Binding(
                                                get: { values[filter.key] as? Double ?? range.lowerBound },
                                                set: { values[filter.key] = $0 }
                                            ),
                                            in: range
                                        )
                                    }

                                case .checkbox:
                                    if let options = filter.options {
                                        ForEach(options, id: \\.0) { option in
                                            Toggle(option.1, isOn: Binding(
                                                get: {
                                                    (values[filter.key] as? [String] ?? []).contains(option.0)
                                                },
                                                set: { isOn in
                                                    var current = values[filter.key] as? [String] ?? []
                                                    if isOn {
                                                        current.append(option.0)
                                                    } else {
                                                        current.removeAll { $0 == option.0 }
                                                    }
                                                    values[filter.key] = current
                                                }
                                            ))
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .padding()
                }

                Divider()

                // Apply Button
                Button {
                    onApply(values)
                    isPresented = false
                } label: {
                    Text("Apply Filters")
                        .fontWeight(.semibold)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
                .padding()
            }
        }
    }
}

// MARK: - Flow Layout
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = FlowResult(in: proposal.width ?? 0, subviews: subviews, spacing: spacing)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = FlowResult(in: bounds.width, subviews: subviews, spacing: spacing)
        for (index, subview) in subviews.enumerated() {
            subview.place(at: CGPoint(x: bounds.minX + result.positions[index].x,
                                      y: bounds.minY + result.positions[index].y),
                         proposal: .unspecified)
        }
    }

    struct FlowResult {
        var size: CGSize = .zero
        var positions: [CGPoint] = []

        init(in width: CGFloat, subviews: Subviews, spacing: CGFloat) {
            var x: CGFloat = 0
            var y: CGFloat = 0
            var rowHeight: CGFloat = 0

            for subview in subviews {
                let size = subview.sizeThatFits(.unspecified)

                if x + size.width > width && x > 0 {
                    x = 0
                    y += rowHeight + spacing
                    rowHeight = 0
                }

                positions.append(CGPoint(x: x, y: y))
                rowHeight = max(rowHeight, size.height)
                x += size.width + spacing
            }

            self.size = CGSize(width: width, height: y + rowHeight)
        }
    }
}

// MARK: - Preview
struct BottomSheetView_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Text("Content")
        }
        .sheet(isPresented: .constant(true)) {
            Text("Sheet Content")
        }
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3'],
      code: `
package com.hublab.capsules

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import kotlin.math.abs
import kotlin.math.roundToInt

// Bottom Sheet
@Composable
fun BottomSheetView(
    isOpen: Boolean,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
    snapPoints: List<Float> = listOf(0.5f, 0.9f),
    initialSnapIndex: Int = 0,
    showHandle: Boolean = true,
    showBackdrop: Boolean = true,
    backdropDismiss: Boolean = true,
    onSnapChange: ((Int) -> Unit)? = null,
    content: @Composable () -> Unit
) {
    val configuration = LocalConfiguration.current
    val screenHeight = with(LocalDensity.current) { configuration.screenHeightDp.dp.toPx() }

    var currentSnapIndex by remember { mutableStateOf(initialSnapIndex) }
    var offsetY by remember { mutableStateOf(0f) }

    val currentHeight = screenHeight * snapPoints[currentSnapIndex] - offsetY

    val animatedOffset by animateFloatAsState(
        targetValue = if (isOpen) 0f else screenHeight,
        animationSpec = spring(dampingRatio = 0.8f)
    )

    if (!isOpen && animatedOffset >= screenHeight) return

    Box(modifier = modifier.fillMaxSize()) {
        // Backdrop
        if (showBackdrop) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.4f * (1 - animatedOffset / screenHeight)))
                    .clickable(enabled = backdropDismiss) { onClose() }
            )
        }

        // Sheet
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(with(LocalDensity.current) { currentHeight.toDp() })
                .align(Alignment.BottomCenter)
                .offset { IntOffset(0, animatedOffset.roundToInt()) }
                .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                .background(MaterialTheme.colorScheme.surface)
                .pointerInput(Unit) {
                    detectVerticalDragGestures(
                        onDragEnd = {
                            val threshold = 50f

                            // Close if dragged down at minimum snap
                            if (offsetY > threshold && currentSnapIndex == 0) {
                                onClose()
                                offsetY = 0f
                                return@detectVerticalDragGestures
                            }

                            // Find closest snap point
                            val currentRatio = (screenHeight * snapPoints[currentSnapIndex] - offsetY) / screenHeight
                            var closestIndex = 0
                            var closestDistance = abs(snapPoints[0] - currentRatio)

                            snapPoints.forEachIndexed { index, point ->
                                val distance = abs(point - currentRatio)
                                if (distance < closestDistance) {
                                    closestDistance = distance
                                    closestIndex = index
                                }
                            }

                            if (closestIndex != currentSnapIndex) {
                                onSnapChange?.invoke(closestIndex)
                            }
                            currentSnapIndex = closestIndex
                            offsetY = 0f
                        },
                        onVerticalDrag = { _, dragAmount ->
                            offsetY += dragAmount
                        }
                    )
                }
        ) {
            Column {
                // Handle
                if (showHandle) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .width(36.dp)
                                .height(4.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f))
                        )
                    }
                }

                // Content
                content()
            }
        }
    }
}

// Action Sheet
@Composable
fun ActionSheetView(
    isOpen: Boolean,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
    title: String? = null,
    message: String? = null,
    actions: List<ActionSheetAction>
) {
    BottomSheetView(
        isOpen = isOpen,
        onClose = onClose,
        modifier = modifier,
        snapPoints = listOf(0.4f),
        showHandle = false
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            if (title != null || message != null) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (title != null) {
                        Text(
                            text = title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    if (message != null) {
                        Text(
                            text = message,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                HorizontalDivider()
            }

            // Actions
            actions.filter { it.variant != ActionVariant.Cancel }.forEach { action ->
                Button(
                    onClick = {
                        action.onClick()
                        onClose()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = when (action.variant) {
                            ActionVariant.Destructive -> MaterialTheme.colorScheme.errorContainer
                            else -> MaterialTheme.colorScheme.secondaryContainer
                        },
                        contentColor = when (action.variant) {
                            ActionVariant.Destructive -> MaterialTheme.colorScheme.error
                            else -> MaterialTheme.colorScheme.onSecondaryContainer
                        }
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(vertical = 8.dp)
                    ) {
                        action.icon?.let {
                            Icon(it, contentDescription = null)
                        }
                        Text(action.label, fontWeight = FontWeight.Medium)
                    }
                }
            }

            // Cancel
            actions.find { it.variant == ActionVariant.Cancel }?.let { cancelAction ->
                OutlinedButton(
                    onClick = {
                        cancelAction.onClick()
                        onClose()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        cancelAction.label,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }
            }
        }
    }
}

data class ActionSheetAction(
    val label: String,
    val onClick: () -> Unit,
    val variant: ActionVariant = ActionVariant.Default,
    val icon: ImageVector? = null
)

enum class ActionVariant {
    Default, Destructive, Cancel
}

// Share Sheet
@Composable
fun ShareSheetView(
    isOpen: Boolean,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
    title: String = "Share",
    url: String = "",
    text: String = ""
) {
    var copied by remember { mutableStateOf(false) }

    BottomSheetView(
        isOpen = isOpen,
        onClose = onClose,
        modifier = modifier,
        snapPoints = listOf(0.35f)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(4),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    ShareButton(
                        icon = Icons.Default.ContentCopy,
                        label = if (copied) "Copied!" else "Copy",
                        onClick = {
                            // Copy to clipboard
                            copied = true
                        }
                    )
                }
                item {
                    ShareButton(
                        icon = Icons.Default.Message,
                        label = "Message",
                        onClick = { /* Share via message */ }
                    )
                }
                item {
                    ShareButton(
                        icon = Icons.Default.Email,
                        label = "Email",
                        onClick = { /* Share via email */ }
                    )
                }
                item {
                    ShareButton(
                        icon = Icons.Default.Share,
                        label = "More",
                        onClick = { /* Native share */ }
                    )
                }
            }
        }
    }
}

@Composable
private fun ShareButton(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .size(50.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.secondaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                icon,
                contentDescription = label,
                tint = MaterialTheme.colorScheme.onSecondaryContainer
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

// Filter Sheet
@Composable
fun FilterSheetView(
    isOpen: Boolean,
    onClose: () -> Unit,
    onApply: (Map<String, Any>) -> Unit,
    filters: List<FilterItem>,
    modifier: Modifier = Modifier,
    initialValues: Map<String, Any> = emptyMap()
) {
    var values by remember(initialValues) { mutableStateOf(initialValues) }

    BottomSheetView(
        isOpen = isOpen,
        onClose = onClose,
        modifier = modifier,
        snapPoints = listOf(0.8f)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextButton(onClick = { values = emptyMap() }) {
                    Text("Reset")
                }

                Text(
                    "Filters",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )

                IconButton(onClick = onClose) {
                    Icon(Icons.Default.Close, contentDescription = "Close")
                }
            }

            HorizontalDivider()

            // Filters
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                items(filters) { filter ->
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(
                            text = filter.label,
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Medium
                        )

                        when (filter.type) {
                            FilterType.Select -> {
                                FlowRow(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    filter.options?.forEach { (value, label) ->
                                        FilterChip(
                                            selected = values[filter.key] == value,
                                            onClick = { values = values + (filter.key to value) },
                                            label = { Text(label) }
                                        )
                                    }
                                }
                            }

                            FilterType.Range -> {
                                filter.range?.let { range ->
                                    Slider(
                                        value = (values[filter.key] as? Float) ?: range.start,
                                        onValueChange = { values = values + (filter.key to it) },
                                        valueRange = range
                                    )
                                }
                            }

                            FilterType.Checkbox -> {
                                filter.options?.forEach { (value, label) ->
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Checkbox(
                                            checked = (values[filter.key] as? List<*>)?.contains(value) == true,
                                            onCheckedChange = { checked ->
                                                val current = (values[filter.key] as? List<String>) ?: emptyList()
                                                values = values + (filter.key to
                                                    if (checked) current + value
                                                    else current - value
                                                )
                                            }
                                        )
                                        Text(label)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            HorizontalDivider()

            // Apply Button
            Button(
                onClick = {
                    onApply(values)
                    onClose()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    "Apply Filters",
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
            }
        }
    }
}

data class FilterItem(
    val key: String,
    val label: String,
    val type: FilterType,
    val options: List<Pair<String, String>>? = null,
    val range: ClosedFloatingPointRange<Float>? = null
)

enum class FilterType {
    Select, Range, Checkbox
}

// FlowRow helper
@Composable
private fun FlowRow(
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start,
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    content: @Composable () -> Unit
) {
    // Simplified - in production use Accompanist FlowRow
    Row(
        horizontalArrangement = horizontalArrangement,
        modifier = Modifier.horizontalScroll(rememberScrollState())
    ) {
        content()
    }
}
`
    },

    desktop: {
      dependencies: ['@tauri-apps/api'],
      code: `
// Desktop uses modal dialogs instead of bottom sheets
// See web implementation with modal adaptation
export * from './web'
`
    }
  }
}
