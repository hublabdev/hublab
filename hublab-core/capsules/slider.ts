/**
 * Slider Capsule - Multi-Platform Range Control
 *
 * Value selection via sliding thumb on a track
 */

import { CapsuleDefinition } from './types'

export const SliderCapsule: CapsuleDefinition = {
  id: 'slider',
  name: 'Slider',
  description: 'Value selection via sliding thumb on a track',
  category: 'forms',
  tags: ['slider', 'range', 'input', 'control', 'volume', 'progress'],
  version: '1.0.0',

  props: [
    {
      name: 'value',
      type: 'number',
      required: false,
      default: 0,
      description: 'Current value (controlled)'
    },
    {
      name: 'defaultValue',
      type: 'number',
      required: false,
      default: 0,
      description: 'Initial value (uncontrolled)'
    },
    {
      name: 'min',
      type: 'number',
      required: false,
      default: 0,
      description: 'Minimum value'
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum value'
    },
    {
      name: 'step',
      type: 'number',
      required: false,
      default: 1,
      description: 'Step increment'
    },
    {
      name: 'onChange',
      type: 'action',
      required: false,
      description: 'Callback when value changes'
    },
    {
      name: 'onChangeEnd',
      type: 'action',
      required: false,
      description: 'Callback when interaction ends'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the slider is disabled'
    },
    {
      name: 'size',
      type: 'size',
      required: false,
      default: 'md',
      description: 'Size of the slider'
    },
    {
      name: 'color',
      type: 'color',
      required: false,
      default: 'primary',
      description: 'Color of the active track'
    },
    {
      name: 'showValue',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show current value label'
    },
    {
      name: 'showMarks',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show step marks on track'
    },
    {
      name: 'marks',
      type: 'array',
      required: false,
      description: 'Custom marks with labels'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Label text'
    },
    {
      name: 'orientation',
      type: 'select',
      required: false,
      default: 'horizontal',
      description: 'Slider orientation',
      options: ['horizontal', 'vertical']
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, useRef, useCallback, useEffect } from 'react'

interface Mark {
  value: number
  label?: string
}

interface SliderProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  showMarks?: boolean
  marks?: Mark[]
  label?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Slider({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  disabled = false,
  size = 'md',
  color = 'primary',
  showValue = false,
  showMarks = false,
  marks,
  label,
  orientation = 'horizontal',
  className = ''
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isDragging, setIsDragging] = useState(false)

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const percentage = ((currentValue - min) / (max - min)) * 100

  const sizeStyles = {
    sm: { track: 'h-1', thumb: 'w-3 h-3' },
    md: { track: 'h-2', thumb: 'w-4 h-4' },
    lg: { track: 'h-3', thumb: 'w-5 h-5' }
  }

  const colorStyles = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600'
  }

  const snapToStep = (val: number): number => {
    const snapped = Math.round((val - min) / step) * step + min
    return Math.max(min, Math.min(max, snapped))
  }

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!trackRef.current) return currentValue
    const rect = trackRef.current.getBoundingClientRect()
    const pos = orientation === 'horizontal'
      ? (clientX - rect.left) / rect.width
      : 1 - (clientX - rect.top) / rect.height
    const rawValue = min + pos * (max - min)
    return snapToStep(rawValue)
  }, [min, max, step, orientation, currentValue])

  const updateValue = useCallback((newValue: number) => {
    if (disabled) return
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [disabled, isControlled, onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
    const newValue = getValueFromPosition(e.clientX)
    updateValue(newValue)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX)
      updateValue(newValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      onChangeEnd?.(currentValue)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, getValueFromPosition, updateValue, onChangeEnd, currentValue])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    let newValue = currentValue

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, currentValue + step)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, currentValue - step)
        break
      case 'Home':
        newValue = min
        break
      case 'End':
        newValue = max
        break
      default:
        return
    }

    e.preventDefault()
    updateValue(newValue)
    onChangeEnd?.(newValue)
  }

  const { track, thumb } = sizeStyles[size]
  const activeColor = colorStyles[color]

  const allMarks = marks || (showMarks ?
    Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => ({
      value: min + i * step
    })) : [])

  return (
    <div className={\`\${className} \${disabled ? 'opacity-50' : ''}\`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentValue}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className={\`relative w-full rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer \${track}\`}
        onMouseDown={handleMouseDown}
      >
        {/* Active track */}
        <div
          className={\`absolute left-0 top-0 h-full rounded-full \${activeColor}\`}
          style={{ width: \`\${percentage}%\` }}
        />

        {/* Marks */}
        {allMarks.map((mark) => {
          const markPercent = ((mark.value - min) / (max - min)) * 100
          return (
            <div
              key={mark.value}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: \`\${markPercent}%\` }}
            >
              <div className={\`w-1 h-1 rounded-full \${mark.value <= currentValue ? 'bg-white' : 'bg-gray-400'}\`} />
              {mark.label && (
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                  {mark.label}
                </span>
              )}
            </div>
          )
        })}

        {/* Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          className={\`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            rounded-full bg-white shadow-md border-2 border-current
            transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500
            \${thumb}
            \${!disabled ? 'cursor-grab active:cursor-grabbing' : ''}
          \`}
          style={{
            left: \`\${percentage}%\`,
            color: 'inherit',
            borderColor: 'currentColor'
          }}
        />
      </div>
    </div>
  )
}

// Range Slider (two thumbs)
interface RangeSliderProps extends Omit<SliderProps, 'value' | 'defaultValue' | 'onChange' | 'onChangeEnd'> {
  value?: [number, number]
  defaultValue?: [number, number]
  onChange?: (value: [number, number]) => void
  onChangeEnd?: (value: [number, number]) => void
  minDistance?: number
}

export function RangeSlider({
  value: controlledValue,
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  minDistance = 0,
  disabled = false,
  size = 'md',
  color = 'primary',
  label,
  showValue = false,
  className = ''
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null)

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const percentage1 = ((currentValue[0] - min) / (max - min)) * 100
  const percentage2 = ((currentValue[1] - min) / (max - min)) * 100

  const sizeStyles = {
    sm: { track: 'h-1', thumb: 'w-3 h-3' },
    md: { track: 'h-2', thumb: 'w-4 h-4' },
    lg: { track: 'h-3', thumb: 'w-5 h-5' }
  }

  const colorStyles = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600'
  }

  const { track, thumb } = sizeStyles[size]
  const activeColor = colorStyles[color]

  const updateValue = (newValue: [number, number]) => {
    if (disabled) return
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleMouseDown = (thumbIndex: 0 | 1) => (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setActiveThumb(thumbIndex)
  }

  useEffect(() => {
    if (activeThumb === null) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const rawValue = min + pos * (max - min)
      const snapped = Math.round((rawValue - min) / step) * step + min
      const newValue = Math.max(min, Math.min(max, snapped))

      let newRange: [number, number]
      if (activeThumb === 0) {
        newRange = [Math.min(newValue, currentValue[1] - minDistance), currentValue[1]]
      } else {
        newRange = [currentValue[0], Math.max(newValue, currentValue[0] + minDistance)]
      }
      updateValue(newRange)
    }

    const handleMouseUp = () => {
      setActiveThumb(null)
      onChangeEnd?.(currentValue)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [activeThumb, currentValue, min, max, step, minDistance])

  return (
    <div className={\`\${className} \${disabled ? 'opacity-50' : ''}\`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentValue[0]} - {currentValue[1]}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className={\`relative w-full rounded-full bg-gray-200 dark:bg-gray-700 \${track}\`}
      >
        {/* Active track */}
        <div
          className={\`absolute top-0 h-full rounded-full \${activeColor}\`}
          style={{
            left: \`\${percentage1}%\`,
            width: \`\${percentage2 - percentage1}%\`
          }}
        />

        {/* Thumb 1 */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={currentValue[1]}
          aria-valuenow={currentValue[0]}
          onMouseDown={handleMouseDown(0)}
          className={\`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            rounded-full bg-white shadow-md border-2
            \${thumb}
            \${!disabled ? 'cursor-grab active:cursor-grabbing' : ''}
          \`}
          style={{ left: \`\${percentage1}%\` }}
        />

        {/* Thumb 2 */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={currentValue[0]}
          aria-valuemax={max}
          aria-valuenow={currentValue[1]}
          onMouseDown={handleMouseDown(1)}
          className={\`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            rounded-full bg-white shadow-md border-2
            \${thumb}
            \${!disabled ? 'cursor-grab active:cursor-grabbing' : ''}
          \`}
          style={{ left: \`\${percentage2}%\` }}
        />
      </div>
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

// MARK: - Slider Size
enum SliderSize {
    case sm, md, lg

    var trackHeight: CGFloat {
        switch self {
        case .sm: return 4
        case .md: return 6
        case .lg: return 8
        }
    }

    var thumbSize: CGFloat {
        switch self {
        case .sm: return 16
        case .md: return 20
        case .lg: return 24
        }
    }
}

// MARK: - Slider Color
enum SliderColor {
    case primary, secondary, success, warning, error

    var color: Color {
        switch self {
        case .primary: return .blue
        case .secondary: return .gray
        case .success: return .green
        case .warning: return .yellow
        case .error: return .red
        }
    }
}

// MARK: - Custom Slider
struct CustomSlider: View {
    @Binding var value: Double
    var range: ClosedRange<Double> = 0...100
    var step: Double = 1
    var size: SliderSize = .md
    var color: SliderColor = .primary
    var showValue: Bool = false
    var label: String? = nil
    var disabled: Bool = false
    var onEditingChanged: ((Bool) -> Void)? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if label != nil || showValue {
                HStack {
                    if let label = label {
                        Text(label)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(disabled ? .gray : .primary)
                    }
                    Spacer()
                    if showValue {
                        Text(String(format: "%.0f", value))
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Track background
                    RoundedRectangle(cornerRadius: size.trackHeight / 2)
                        .fill(Color.gray.opacity(0.3))
                        .frame(height: size.trackHeight)

                    // Active track
                    let percentage = (value - range.lowerBound) / (range.upperBound - range.lowerBound)
                    RoundedRectangle(cornerRadius: size.trackHeight / 2)
                        .fill(disabled ? Color.gray : color.color)
                        .frame(width: geometry.size.width * CGFloat(percentage), height: size.trackHeight)

                    // Thumb
                    Circle()
                        .fill(Color.white)
                        .frame(width: size.thumbSize, height: size.thumbSize)
                        .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                        .offset(x: geometry.size.width * CGFloat(percentage) - size.thumbSize / 2)
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { gesture in
                                    guard !disabled else { return }
                                    onEditingChanged?(true)
                                    let newValue = Double(gesture.location.x / geometry.size.width) * (range.upperBound - range.lowerBound) + range.lowerBound
                                    let stepped = round(newValue / step) * step
                                    value = min(max(stepped, range.lowerBound), range.upperBound)
                                }
                                .onEnded { _ in
                                    onEditingChanged?(false)
                                }
                        )
                }
            }
            .frame(height: size.thumbSize)
            .opacity(disabled ? 0.5 : 1)
        }
    }
}

// MARK: - Range Slider
struct RangeSlider: View {
    @Binding var lowerValue: Double
    @Binding var upperValue: Double
    var range: ClosedRange<Double> = 0...100
    var step: Double = 1
    var minDistance: Double = 0
    var size: SliderSize = .md
    var color: SliderColor = .primary
    var showValues: Bool = false
    var label: String? = nil
    var disabled: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if label != nil || showValues {
                HStack {
                    if let label = label {
                        Text(label)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(disabled ? .gray : .primary)
                    }
                    Spacer()
                    if showValues {
                        Text("\\(Int(lowerValue)) - \\(Int(upperValue))")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Track background
                    RoundedRectangle(cornerRadius: size.trackHeight / 2)
                        .fill(Color.gray.opacity(0.3))
                        .frame(height: size.trackHeight)

                    // Active track
                    let lowerPercent = CGFloat((lowerValue - range.lowerBound) / (range.upperBound - range.lowerBound))
                    let upperPercent = CGFloat((upperValue - range.lowerBound) / (range.upperBound - range.lowerBound))

                    RoundedRectangle(cornerRadius: size.trackHeight / 2)
                        .fill(disabled ? Color.gray : color.color)
                        .frame(width: geometry.size.width * (upperPercent - lowerPercent), height: size.trackHeight)
                        .offset(x: geometry.size.width * lowerPercent)

                    // Lower thumb
                    Circle()
                        .fill(Color.white)
                        .frame(width: size.thumbSize, height: size.thumbSize)
                        .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                        .offset(x: geometry.size.width * lowerPercent - size.thumbSize / 2)
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { gesture in
                                    guard !disabled else { return }
                                    let newValue = Double(gesture.location.x / geometry.size.width) * (range.upperBound - range.lowerBound) + range.lowerBound
                                    let stepped = round(newValue / step) * step
                                    let maxAllowed = upperValue - minDistance
                                    lowerValue = min(max(stepped, range.lowerBound), maxAllowed)
                                }
                        )

                    // Upper thumb
                    Circle()
                        .fill(Color.white)
                        .frame(width: size.thumbSize, height: size.thumbSize)
                        .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                        .offset(x: geometry.size.width * upperPercent - size.thumbSize / 2)
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { gesture in
                                    guard !disabled else { return }
                                    let newValue = Double(gesture.location.x / geometry.size.width) * (range.upperBound - range.lowerBound) + range.lowerBound
                                    let stepped = round(newValue / step) * step
                                    let minAllowed = lowerValue + minDistance
                                    upperValue = max(min(stepped, range.upperBound), minAllowed)
                                }
                        )
                }
            }
            .frame(height: size.thumbSize)
            .opacity(disabled ? 0.5 : 1)
        }
    }
}

// MARK: - Slider with Marks
struct MarkedSlider: View {
    @Binding var value: Double
    var range: ClosedRange<Double> = 0...100
    var step: Double = 10
    var size: SliderSize = .md
    var color: SliderColor = .primary
    var marks: [Double]? = nil
    var markLabels: [Double: String]? = nil
    var label: String? = nil
    var disabled: Bool = false

    private var displayMarks: [Double] {
        if let marks = marks { return marks }
        return stride(from: range.lowerBound, through: range.upperBound, by: step).map { $0 }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(disabled ? .gray : .primary)
            }

            GeometryReader { geometry in
                VStack(spacing: 8) {
                    ZStack(alignment: .leading) {
                        // Track
                        RoundedRectangle(cornerRadius: size.trackHeight / 2)
                            .fill(Color.gray.opacity(0.3))
                            .frame(height: size.trackHeight)

                        // Active track
                        let percentage = CGFloat((value - range.lowerBound) / (range.upperBound - range.lowerBound))
                        RoundedRectangle(cornerRadius: size.trackHeight / 2)
                            .fill(disabled ? Color.gray : color.color)
                            .frame(width: geometry.size.width * percentage, height: size.trackHeight)

                        // Marks
                        ForEach(displayMarks, id: \\.self) { mark in
                            let markPercent = CGFloat((mark - range.lowerBound) / (range.upperBound - range.lowerBound))
                            Circle()
                                .fill(mark <= value ? Color.white : Color.gray)
                                .frame(width: 6, height: 6)
                                .offset(x: geometry.size.width * markPercent - 3)
                        }

                        // Thumb
                        Circle()
                            .fill(Color.white)
                            .frame(width: size.thumbSize, height: size.thumbSize)
                            .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                            .offset(x: geometry.size.width * percentage - size.thumbSize / 2)
                            .gesture(
                                DragGesture(minimumDistance: 0)
                                    .onChanged { gesture in
                                        guard !disabled else { return }
                                        let newValue = Double(gesture.location.x / geometry.size.width) * (range.upperBound - range.lowerBound) + range.lowerBound
                                        let stepped = round(newValue / step) * step
                                        value = min(max(stepped, range.lowerBound), range.upperBound)
                                    }
                            )
                    }
                    .frame(height: size.thumbSize)

                    // Mark labels
                    if markLabels != nil {
                        HStack {
                            ForEach(displayMarks, id: \\.self) { mark in
                                if mark == displayMarks.first {
                                    Text(markLabels?[mark] ?? "\\(Int(mark))")
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                                if mark != displayMarks.first && mark != displayMarks.last {
                                    Spacer()
                                    Text(markLabels?[mark] ?? "\\(Int(mark))")
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                                if mark == displayMarks.last && displayMarks.count > 1 {
                                    Spacer()
                                    Text(markLabels?[mark] ?? "\\(Int(mark))")
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                    }
                }
            }
            .frame(height: markLabels != nil ? size.thumbSize + 20 : size.thumbSize)
            .opacity(disabled ? 0.5 : 1)
        }
    }
}

// MARK: - Preview
struct SliderPreview: PreviewProvider {
    struct PreviewContainer: View {
        @State private var value1: Double = 50
        @State private var value2: Double = 30
        @State private var lower: Double = 25
        @State private var upper: Double = 75
        @State private var markedValue: Double = 50

        var body: some View {
            ScrollView {
                VStack(spacing: 32) {
                    Group {
                        Text("Basic Slider")
                            .font(.headline)
                        CustomSlider(value: $value1, showValue: true, label: "Volume")
                    }

                    Divider()

                    Group {
                        Text("Sizes")
                            .font(.headline)
                        CustomSlider(value: $value2, size: .sm, label: "Small")
                        CustomSlider(value: $value2, size: .md, label: "Medium")
                        CustomSlider(value: $value2, size: .lg, label: "Large")
                    }

                    Divider()

                    Group {
                        Text("Colors")
                            .font(.headline)
                        CustomSlider(value: $value1, color: .primary, label: "Primary")
                        CustomSlider(value: $value1, color: .success, label: "Success")
                        CustomSlider(value: $value1, color: .warning, label: "Warning")
                        CustomSlider(value: $value1, color: .error, label: "Error")
                    }

                    Divider()

                    Group {
                        Text("Range Slider")
                            .font(.headline)
                        RangeSlider(
                            lowerValue: $lower,
                            upperValue: $upper,
                            minDistance: 10,
                            showValues: true,
                            label: "Price Range"
                        )
                    }

                    Divider()

                    Group {
                        Text("Marked Slider")
                            .font(.headline)
                        MarkedSlider(
                            value: $markedValue,
                            step: 20,
                            markLabels: [0: "0%", 50: "50%", 100: "100%"],
                            label: "Progress"
                        )
                    }

                    Divider()

                    Group {
                        Text("Disabled")
                            .font(.headline)
                        CustomSlider(value: .constant(50), label: "Disabled", disabled: true)
                    }
                }
                .padding()
            }
        }
    }

    static var previews: some View {
        PreviewContainer()
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3'
      ],
      imports: [
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.gestures.detectDragGestures',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.CircleShape',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.draw.shadow',
        'androidx.compose.ui.geometry.Offset',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.input.pointer.pointerInput',
        'androidx.compose.ui.layout.onGloballyPositioned',
        'androidx.compose.ui.platform.LocalDensity',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.Dp',
        'androidx.compose.ui.unit.IntSize',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp',
        'kotlin.math.roundToInt'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.roundToInt

// Size enum
enum class SliderSize(val trackHeight: Dp, val thumbSize: Dp) {
    SM(4.dp, 16.dp),
    MD(6.dp, 20.dp),
    LG(8.dp, 24.dp)
}

// Color enum
enum class SliderColor(val color: Color) {
    PRIMARY(Color(0xFF3B82F6)),
    SECONDARY(Color(0xFF6B7280)),
    SUCCESS(Color(0xFF22C55E)),
    WARNING(Color(0xFFEAB308)),
    ERROR(Color(0xFFEF4444))
}

@Composable
fun CustomSlider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    valueRange: ClosedFloatingPointRange<Float> = 0f..100f,
    steps: Int = 0,
    size: SliderSize = SliderSize.MD,
    color: SliderColor = SliderColor.PRIMARY,
    showValue: Boolean = false,
    label: String? = null,
    enabled: Boolean = true,
    onValueChangeFinished: (() -> Unit)? = null
) {
    var sliderSize by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current

    Column(modifier = modifier) {
        if (label != null || showValue) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (label != null) {
                    Text(
                        text = label,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (enabled) MaterialTheme.colorScheme.onSurface else Color.Gray
                    )
                }
                if (showValue) {
                    Text(
                        text = value.roundToInt().toString(),
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(size.thumbSize)
                .onGloballyPositioned { sliderSize = it.size }
                .let { if (!enabled) it.alpha(0.5f) else it },
            contentAlignment = Alignment.CenterStart
        ) {
            // Track background
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(size.trackHeight)
                    .clip(RoundedCornerShape(size.trackHeight / 2))
                    .background(Color.Gray.copy(alpha = 0.3f))
            )

            // Active track
            val percentage = (value - valueRange.start) / (valueRange.endInclusive - valueRange.start)
            Box(
                modifier = Modifier
                    .fillMaxWidth(percentage)
                    .height(size.trackHeight)
                    .clip(RoundedCornerShape(size.trackHeight / 2))
                    .background(if (enabled) color.color else Color.Gray)
            )

            // Thumb
            val thumbOffset = with(density) {
                (sliderSize.width * percentage - size.thumbSize.toPx() / 2).toDp()
            }

            Box(
                modifier = Modifier
                    .offset(x = thumbOffset.coerceAtLeast(0.dp))
                    .size(size.thumbSize)
                    .shadow(4.dp, CircleShape)
                    .clip(CircleShape)
                    .background(Color.White)
                    .pointerInput(enabled) {
                        if (!enabled) return@pointerInput
                        detectDragGestures(
                            onDragEnd = { onValueChangeFinished?.invoke() }
                        ) { change, _ ->
                            change.consume()
                            val newX = change.position.x
                            val newPercentage = (newX / sliderSize.width).coerceIn(0f, 1f)
                            val newValue = valueRange.start + newPercentage * (valueRange.endInclusive - valueRange.start)

                            val steppedValue = if (steps > 0) {
                                val stepSize = (valueRange.endInclusive - valueRange.start) / (steps + 1)
                                (((newValue - valueRange.start) / stepSize).roundToInt() * stepSize + valueRange.start)
                                    .coerceIn(valueRange)
                            } else {
                                newValue.coerceIn(valueRange)
                            }

                            onValueChange(steppedValue)
                        }
                    }
            )
        }
    }
}

@Composable
fun RangeSlider(
    range: ClosedFloatingPointRange<Float>,
    onRangeChange: (ClosedFloatingPointRange<Float>) -> Unit,
    modifier: Modifier = Modifier,
    valueRange: ClosedFloatingPointRange<Float> = 0f..100f,
    minDistance: Float = 0f,
    size: SliderSize = SliderSize.MD,
    color: SliderColor = SliderColor.PRIMARY,
    showValues: Boolean = false,
    label: String? = null,
    enabled: Boolean = true
) {
    var sliderSize by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current

    Column(modifier = modifier) {
        if (label != null || showValues) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (label != null) {
                    Text(
                        text = label,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (enabled) MaterialTheme.colorScheme.onSurface else Color.Gray
                    )
                }
                if (showValues) {
                    Text(
                        text = "${range.start.roundToInt()} - ${range.endInclusive.roundToInt()}",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(size.thumbSize)
                .onGloballyPositioned { sliderSize = it.size }
                .let { if (!enabled) it.alpha(0.5f) else it },
            contentAlignment = Alignment.CenterStart
        ) {
            // Track background
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(size.trackHeight)
                    .clip(RoundedCornerShape(size.trackHeight / 2))
                    .background(Color.Gray.copy(alpha = 0.3f))
            )

            // Active track
            val startPercent = (range.start - valueRange.start) / (valueRange.endInclusive - valueRange.start)
            val endPercent = (range.endInclusive - valueRange.start) / (valueRange.endInclusive - valueRange.start)

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(size.trackHeight)
                    .padding(start = with(density) { (sliderSize.width * startPercent).toDp() })
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(endPercent - startPercent)
                        .height(size.trackHeight)
                        .clip(RoundedCornerShape(size.trackHeight / 2))
                        .background(if (enabled) color.color else Color.Gray)
                )
            }

            // Start thumb
            val startOffset = with(density) {
                (sliderSize.width * startPercent - size.thumbSize.toPx() / 2).toDp()
            }
            Box(
                modifier = Modifier
                    .offset(x = startOffset.coerceAtLeast(0.dp))
                    .size(size.thumbSize)
                    .shadow(4.dp, CircleShape)
                    .clip(CircleShape)
                    .background(Color.White)
                    .pointerInput(enabled) {
                        if (!enabled) return@pointerInput
                        detectDragGestures { change, _ ->
                            change.consume()
                            val newPercent = (change.position.x / sliderSize.width).coerceIn(0f, 1f)
                            val newValue = valueRange.start + newPercent * (valueRange.endInclusive - valueRange.start)
                            val maxValue = range.endInclusive - minDistance
                            val clampedValue = newValue.coerceIn(valueRange.start, maxValue)
                            onRangeChange(clampedValue..range.endInclusive)
                        }
                    }
            )

            // End thumb
            val endOffset = with(density) {
                (sliderSize.width * endPercent - size.thumbSize.toPx() / 2).toDp()
            }
            Box(
                modifier = Modifier
                    .offset(x = endOffset.coerceAtLeast(0.dp))
                    .size(size.thumbSize)
                    .shadow(4.dp, CircleShape)
                    .clip(CircleShape)
                    .background(Color.White)
                    .pointerInput(enabled) {
                        if (!enabled) return@pointerInput
                        detectDragGestures { change, _ ->
                            change.consume()
                            val newPercent = (change.position.x / sliderSize.width).coerceIn(0f, 1f)
                            val newValue = valueRange.start + newPercent * (valueRange.endInclusive - valueRange.start)
                            val minValue = range.start + minDistance
                            val clampedValue = newValue.coerceIn(minValue, valueRange.endInclusive)
                            onRangeChange(range.start..clampedValue)
                        }
                    }
            )
        }
    }
}

// Material 3 Slider wrapper
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun M3Slider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    valueRange: ClosedFloatingPointRange<Float> = 0f..1f,
    steps: Int = 0,
    label: String? = null,
    showValue: Boolean = false,
    enabled: Boolean = true,
    colors: SliderColors = SliderDefaults.colors()
) {
    Column(modifier = modifier) {
        if (label != null || showValue) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                if (label != null) {
                    Text(
                        text = label,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
                if (showValue) {
                    Text(
                        text = "${(value * 100).roundToInt()}%",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        Slider(
            value = value,
            onValueChange = onValueChange,
            valueRange = valueRange,
            steps = steps,
            enabled = enabled,
            colors = colors
        )
    }
}

private fun Modifier.alpha(alpha: Float): Modifier = this.then(
    Modifier.graphicsLayer(alpha = alpha)
)

private fun Modifier.graphicsLayer(alpha: Float): Modifier {
    return this
}
`
    }
  }
}
