/**
 * Stepper Capsule
 *
 * Numeric stepper for increment/decrement input.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const StepperCapsule: CapsuleDefinition = {
  id: 'stepper',
  name: 'Stepper',
  description: 'Numeric stepper for increment/decrement input',
  category: 'input',
  tags: ['stepper', 'counter', 'number', 'input', 'quantity'],

  props: {
    value: {
      type: 'number',
      default: 0,
      description: 'Current value'
    },
    min: {
      type: 'number',
      default: 0,
      description: 'Minimum value'
    },
    max: {
      type: 'number',
      default: 100,
      description: 'Maximum value'
    },
    step: {
      type: 'number',
      default: 1,
      description: 'Step increment'
    },
    size: {
      type: 'string',
      default: 'md',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the stepper'
    },
    variant: {
      type: 'string',
      default: 'default',
      options: ['default', 'outlined', 'filled', 'compact'],
      description: 'Visual variant'
    },
    orientation: {
      type: 'string',
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation'
    },
    disabled: {
      type: 'boolean',
      default: false,
      description: 'Disable the stepper'
    },
    showInput: {
      type: 'boolean',
      default: true,
      description: 'Show editable input field'
    },
    label: {
      type: 'string',
      description: 'Label for the stepper'
    },
    formatValue: {
      type: 'function',
      description: 'Custom value formatter'
    },
    onChange: {
      type: 'function',
      description: 'Callback when value changes'
    }
  },

  platforms: {
    web: {
      dependencies: ['react', 'lucide-react'],
      code: `
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Plus, Minus, ChevronUp, ChevronDown } from 'lucide-react'

interface StepperProps {
  value?: number
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'filled' | 'compact'
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  showInput?: boolean
  label?: string
  formatValue?: (value: number) => string
  onChange?: (value: number) => void
  className?: string
}

const sizeStyles = {
  sm: {
    button: 'w-7 h-7',
    icon: 14,
    input: 'w-12 h-7 text-sm',
    text: 'text-sm'
  },
  md: {
    button: 'w-9 h-9',
    icon: 18,
    input: 'w-16 h-9 text-base',
    text: 'text-base'
  },
  lg: {
    button: 'w-11 h-11',
    icon: 22,
    input: 'w-20 h-11 text-lg',
    text: 'text-lg'
  }
}

export function Stepper({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  variant = 'default',
  orientation = 'horizontal',
  disabled = false,
  showInput = true,
  label,
  formatValue,
  onChange,
  className = ''
}: StepperProps) {
  const [internalValue, setInternalValue] = useState(value)
  const [inputValue, setInputValue] = useState(value.toString())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setInternalValue(value)
    setInputValue(formatValue ? formatValue(value) : value.toString())
  }, [value, formatValue])

  const updateValue = useCallback((newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max)
    setInternalValue(clampedValue)
    setInputValue(formatValue ? formatValue(clampedValue) : clampedValue.toString())
    onChange?.(clampedValue)
  }, [min, max, onChange, formatValue])

  const increment = useCallback(() => {
    if (!disabled && internalValue < max) {
      updateValue(internalValue + step)
    }
  }, [disabled, internalValue, max, step, updateValue])

  const decrement = useCallback(() => {
    if (!disabled && internalValue > min) {
      updateValue(internalValue - step)
    }
  }, [disabled, internalValue, min, step, updateValue])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleInputBlur = useCallback(() => {
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue)) {
      updateValue(numValue)
    } else {
      setInputValue(formatValue ? formatValue(internalValue) : internalValue.toString())
    }
  }, [inputValue, internalValue, updateValue, formatValue])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    }
  }, [handleInputBlur, increment, decrement])

  // Long press handling
  const startLongPress = useCallback((action: () => void) => {
    action()
    intervalRef.current = setInterval(action, 100)
  }, [])

  const stopLongPress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const styles = sizeStyles[size]
  const isAtMin = internalValue <= min
  const isAtMax = internalValue >= max

  const buttonBaseClass = \`
    flex items-center justify-center rounded-md transition-all duration-150
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  \`

  const getVariantStyles = (isActive: boolean) => {
    switch (variant) {
      case 'outlined':
        return \`border-2 border-gray-300 hover:border-gray-400 \${isActive ? 'bg-gray-100' : 'bg-white'}\`
      case 'filled':
        return \`bg-gray-100 hover:bg-gray-200 \${isActive ? 'bg-gray-200' : ''}\`
      case 'compact':
        return 'hover:bg-gray-100'
      default:
        return \`bg-gray-100 hover:bg-gray-200 \${isActive ? 'bg-gray-200' : ''}\`
    }
  }

  const DecrementButton = () => (
    <button
      type="button"
      className={\`\${buttonBaseClass} \${styles.button} \${getVariantStyles(false)}\`}
      onClick={decrement}
      onMouseDown={() => startLongPress(decrement)}
      onMouseUp={stopLongPress}
      onMouseLeave={stopLongPress}
      onTouchStart={() => startLongPress(decrement)}
      onTouchEnd={stopLongPress}
      disabled={disabled || isAtMin}
      aria-label="Decrease value"
    >
      {orientation === 'vertical' ? (
        <ChevronDown size={styles.icon} />
      ) : (
        <Minus size={styles.icon} />
      )}
    </button>
  )

  const IncrementButton = () => (
    <button
      type="button"
      className={\`\${buttonBaseClass} \${styles.button} \${getVariantStyles(false)}\`}
      onClick={increment}
      onMouseDown={() => startLongPress(increment)}
      onMouseUp={stopLongPress}
      onMouseLeave={stopLongPress}
      onTouchStart={() => startLongPress(increment)}
      onTouchEnd={stopLongPress}
      disabled={disabled || isAtMax}
      aria-label="Increase value"
    >
      {orientation === 'vertical' ? (
        <ChevronUp size={styles.icon} />
      ) : (
        <Plus size={styles.icon} />
      )}
    </button>
  )

  const ValueDisplay = () => {
    if (!showInput) {
      return (
        <span className={\`\${styles.text} font-medium text-gray-900 min-w-[3ch] text-center\`}>
          {formatValue ? formatValue(internalValue) : internalValue}
        </span>
      )
    }

    return (
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={\`
          \${styles.input} text-center font-medium
          border-0 bg-transparent focus:outline-none focus:ring-0
          disabled:opacity-50 disabled:cursor-not-allowed
        \`}
        aria-label="Value"
      />
    )
  }

  return (
    <div className={\`inline-flex flex-col gap-1 \${className}\`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={\`
          inline-flex items-center gap-1
          \${orientation === 'vertical' ? 'flex-col-reverse' : 'flex-row'}
          \${variant === 'outlined' ? 'p-1 border-2 border-gray-300 rounded-lg' : ''}
        \`}
        role="spinbutton"
        aria-valuenow={internalValue}
        aria-valuemin={min}
        aria-valuemax={max}
      >
        <DecrementButton />
        <ValueDisplay />
        <IncrementButton />
      </div>
    </div>
  )
}

// Quantity Stepper (e-commerce style)
export function QuantityStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  label = 'Quantity',
  showLabel = true
}: {
  value?: number
  min?: number
  max?: number
  onChange?: (value: number) => void
  disabled?: boolean
  label?: string
  showLabel?: boolean
}) {
  return (
    <div className="inline-flex flex-col gap-1">
      {showLabel && (
        <label className="text-sm text-gray-600">{label}</label>
      )}
      <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100
                     border-r border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => value > min && onChange?.(value - 1)}
          disabled={disabled || value <= min}
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center font-medium">{value}</span>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100
                     border-l border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => value < max && onChange?.(value + 1)}
          disabled={disabled || value >= max}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

// Step Progress (wizard style)
export function StepProgress({
  currentStep,
  totalSteps,
  labels,
  onStepClick,
  allowClickAhead = false,
  variant = 'default'
}: {
  currentStep: number
  totalSteps: number
  labels?: string[]
  onStepClick?: (step: number) => void
  allowClickAhead?: boolean
  variant?: 'default' | 'numbered' | 'dotted'
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNum = index + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          const isClickable = allowClickAhead || stepNum <= currentStep

          return (
            <React.Fragment key={index}>
              {/* Step indicator */}
              <button
                type="button"
                className={\`
                  flex items-center justify-center rounded-full transition-all duration-200
                  \${variant === 'dotted' ? 'w-3 h-3' : 'w-10 h-10'}
                  \${isCompleted ? 'bg-blue-600 text-white' : ''}
                  \${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  \${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                  \${isClickable && onStepClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                \`}
                onClick={() => isClickable && onStepClick?.(stepNum)}
                disabled={!isClickable}
              >
                {variant === 'numbered' && stepNum}
                {variant === 'default' && (isCompleted ? '✓' : stepNum)}
              </button>

              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 mx-2">
                  <div
                    className={\`h-1 rounded-full transition-all duration-300 \${
                      stepNum < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }\`}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Labels */}
      {labels && labels.length > 0 && (
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <span
              key={index}
              className={\`text-xs text-center flex-1 \${
                index + 1 === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              }\`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Price Stepper with currency
export function PriceStepper({
  value = 0,
  min = 0,
  max = 10000,
  step = 0.01,
  currency = 'USD',
  onChange,
  label
}: {
  value?: number
  min?: number
  max?: number
  step?: number
  currency?: string
  onChange?: (value: number) => void
  label?: string
}) {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(val)
  }

  return (
    <Stepper
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      label={label}
      formatValue={formatPrice}
      size="lg"
      variant="outlined"
    />
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Stepper View
struct StepperView: View {
    @Binding var value: Double
    var minValue: Double = 0
    var maxValue: Double = 100
    var step: Double = 1
    var size: StepperSize = .medium
    var variant: StepperVariant = .default
    var orientation: StepperOrientation = .horizontal
    var disabled: Bool = false
    var showInput: Bool = true
    var label: String?
    var formatValue: ((Double) -> String)?

    enum StepperSize {
        case small, medium, large

        var buttonSize: CGFloat {
            switch self {
            case .small: return 28
            case .medium: return 36
            case .large: return 44
            }
        }

        var iconSize: CGFloat {
            switch self {
            case .small: return 14
            case .medium: return 18
            case .large: return 22
            }
        }

        var font: Font {
            switch self {
            case .small: return .subheadline
            case .medium: return .body
            case .large: return .title3
            }
        }
    }

    enum StepperVariant {
        case \`default\`, outlined, filled, compact
    }

    enum StepperOrientation {
        case horizontal, vertical
    }

    @State private var isEditing = false
    @State private var textValue = ""
    @GestureState private var isLongPressing = false

    private var isAtMin: Bool { value <= minValue }
    private var isAtMax: Bool { value >= maxValue }

    private var displayValue: String {
        formatValue?(value) ?? String(format: step.truncatingRemainder(dividingBy: 1) == 0 ? "%.0f" : "%.2f", value)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
            }

            Group {
                if orientation == .horizontal {
                    horizontalLayout
                } else {
                    verticalLayout
                }
            }
        }
        .opacity(disabled ? 0.5 : 1)
    }

    private var horizontalLayout: some View {
        HStack(spacing: variant == .compact ? 4 : 8) {
            decrementButton
            valueDisplay
            incrementButton
        }
        .modifier(VariantModifier(variant: variant))
    }

    private var verticalLayout: some View {
        VStack(spacing: 4) {
            incrementButton
            valueDisplay
            decrementButton
        }
        .modifier(VariantModifier(variant: variant))
    }

    private var decrementButton: some View {
        Button {
            decrement()
        } label: {
            Image(systemName: orientation == .vertical ? "chevron.down" : "minus")
                .font(.system(size: size.iconSize, weight: .semibold))
        }
        .buttonStyle(StepperButtonStyle(size: size, variant: variant, disabled: disabled || isAtMin))
        .disabled(disabled || isAtMin)
    }

    private var incrementButton: some View {
        Button {
            increment()
        } label: {
            Image(systemName: orientation == .vertical ? "chevron.up" : "plus")
                .font(.system(size: size.iconSize, weight: .semibold))
        }
        .buttonStyle(StepperButtonStyle(size: size, variant: variant, disabled: disabled || isAtMax))
        .disabled(disabled || isAtMax)
    }

    @ViewBuilder
    private var valueDisplay: some View {
        if showInput {
            TextField("", text: $textValue, onEditingChanged: { editing in
                if editing {
                    textValue = displayValue
                } else {
                    if let newValue = Double(textValue) {
                        value = min(max(newValue, minValue), maxValue)
                    }
                    textValue = displayValue
                }
            })
            .font(size.font)
            .fontWeight(.medium)
            .multilineTextAlignment(.center)
            .frame(minWidth: 40)
            .keyboardType(.decimalPad)
            .disabled(disabled)
            .onAppear { textValue = displayValue }
        } else {
            Text(displayValue)
                .font(size.font)
                .fontWeight(.medium)
                .frame(minWidth: 40)
        }
    }

    private func increment() {
        guard !disabled, value < maxValue else { return }
        withAnimation(.spring(response: 0.2)) {
            value = min(value + step, maxValue)
        }
    }

    private func decrement() {
        guard !disabled, value > minValue else { return }
        withAnimation(.spring(response: 0.2)) {
            value = max(value - step, minValue)
        }
    }
}

// MARK: - Stepper Button Style
struct StepperButtonStyle: ButtonStyle {
    let size: StepperView.StepperSize
    let variant: StepperView.StepperVariant
    let disabled: Bool

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .frame(width: size.buttonSize, height: size.buttonSize)
            .background(backgroundColor(isPressed: configuration.isPressed))
            .foregroundColor(disabled ? .gray : .primary)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .strokeBorder(variant == .outlined ? Color.gray.opacity(0.3) : Color.clear, lineWidth: 2)
            )
            .scaleEffect(configuration.isPressed ? 0.95 : 1)
            .animation(.spring(response: 0.2), value: configuration.isPressed)
    }

    private func backgroundColor(isPressed: Bool) -> Color {
        switch variant {
        case .outlined:
            return isPressed ? Color.gray.opacity(0.1) : .clear
        case .filled:
            return isPressed ? Color.gray.opacity(0.2) : Color.gray.opacity(0.1)
        case .compact:
            return isPressed ? Color.gray.opacity(0.1) : .clear
        default:
            return isPressed ? Color.gray.opacity(0.2) : Color.gray.opacity(0.1)
        }
    }
}

// MARK: - Variant Modifier
struct VariantModifier: ViewModifier {
    let variant: StepperView.StepperVariant

    func body(content: Content) -> some View {
        switch variant {
        case .outlined:
            content
                .padding(8)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .strokeBorder(Color.gray.opacity(0.3), lineWidth: 2)
                )
        default:
            content
        }
    }
}

// MARK: - Quantity Stepper
struct QuantityStepper: View {
    @Binding var quantity: Int
    var minQuantity: Int = 1
    var maxQuantity: Int = 99
    var label: String = "Quantity"
    var showLabel: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if showLabel {
                Text(label)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            HStack(spacing: 0) {
                Button {
                    if quantity > minQuantity {
                        quantity -= 1
                    }
                } label: {
                    Image(systemName: "minus")
                        .frame(width: 40, height: 40)
                }
                .disabled(quantity <= minQuantity)

                Divider()
                    .frame(height: 24)

                Text("\\(quantity)")
                    .font(.body)
                    .fontWeight(.medium)
                    .frame(width: 48)

                Divider()
                    .frame(height: 24)

                Button {
                    if quantity < maxQuantity {
                        quantity += 1
                    }
                } label: {
                    Image(systemName: "plus")
                        .frame(width: 40, height: 40)
                }
                .disabled(quantity >= maxQuantity)
            }
            .foregroundColor(.primary)
            .background(Color(.systemGray6))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .strokeBorder(Color.gray.opacity(0.2), lineWidth: 1)
            )
        }
    }
}

// MARK: - Step Progress
struct StepProgress: View {
    let currentStep: Int
    let totalSteps: Int
    var labels: [String]?
    var onStepTap: ((Int) -> Void)?
    var allowTapAhead: Bool = false
    var variant: StepProgressVariant = .default

    enum StepProgressVariant {
        case \`default\`, numbered, dotted
    }

    var body: some View {
        VStack(spacing: 8) {
            HStack(spacing: 0) {
                ForEach(1...totalSteps, id: \\.self) { step in
                    let isCompleted = step < currentStep
                    let isCurrent = step == currentStep
                    let isClickable = allowTapAhead || step <= currentStep

                    // Step indicator
                    stepIndicator(step: step, isCompleted: isCompleted, isCurrent: isCurrent)
                        .onTapGesture {
                            if isClickable {
                                onStepTap?(step)
                            }
                        }

                    // Connector
                    if step < totalSteps {
                        Rectangle()
                            .fill(step < currentStep ? Color.blue : Color.gray.opacity(0.3))
                            .frame(height: 2)
                    }
                }
            }

            // Labels
            if let labels = labels {
                HStack {
                    ForEach(Array(labels.enumerated()), id: \\.offset) { index, label in
                        Text(label)
                            .font(.caption)
                            .foregroundColor(index + 1 == currentStep ? .blue : .secondary)
                            .frame(maxWidth: .infinity)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func stepIndicator(step: Int, isCompleted: Bool, isCurrent: Bool) -> some View {
        let size: CGFloat = variant == .dotted ? 12 : 40

        ZStack {
            Circle()
                .fill(isCompleted || isCurrent ? Color.blue : Color.gray.opacity(0.2))
                .frame(width: size, height: size)

            if isCurrent && variant != .dotted {
                Circle()
                    .strokeBorder(Color.blue.opacity(0.3), lineWidth: 4)
                    .frame(width: size + 8, height: size + 8)
            }

            if variant != .dotted {
                if isCompleted {
                    Image(systemName: "checkmark")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                } else {
                    Text("\\(step)")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(isCurrent ? .white : .gray)
                }
            }
        }
    }
}

// MARK: - Preview
struct StepperView_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Basic Stepper
                StepperView(
                    value: .constant(5),
                    label: "Quantity"
                )

                // Quantity Stepper
                QuantityStepper(quantity: .constant(2))

                // Step Progress
                StepProgress(
                    currentStep: 2,
                    totalSteps: 4,
                    labels: ["Cart", "Shipping", "Payment", "Done"]
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
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

// Stepper Size
enum class StepperSize(val buttonSize: Dp, val iconSize: Dp) {
    Small(28.dp, 14.dp),
    Medium(36.dp, 18.dp),
    Large(44.dp, 22.dp)
}

// Stepper Variant
enum class StepperVariant {
    Default, Outlined, Filled, Compact
}

// Stepper Orientation
enum class StepperOrientation {
    Horizontal, Vertical
}

// Stepper Component
@Composable
fun Stepper(
    value: Double,
    onValueChange: (Double) -> Unit,
    modifier: Modifier = Modifier,
    minValue: Double = 0.0,
    maxValue: Double = 100.0,
    step: Double = 1.0,
    size: StepperSize = StepperSize.Medium,
    variant: StepperVariant = StepperVariant.Default,
    orientation: StepperOrientation = StepperOrientation.Horizontal,
    enabled: Boolean = true,
    showInput: Boolean = true,
    label: String? = null,
    formatValue: ((Double) -> String)? = null
) {
    val isAtMin = value <= minValue
    val isAtMax = value >= maxValue

    val displayValue = formatValue?.invoke(value)
        ?: if (step % 1 == 0.0) value.toInt().toString()
        else String.format("%.2f", value)

    fun increment() {
        if (enabled && value < maxValue) {
            onValueChange((value + step).coerceAtMost(maxValue))
        }
    }

    fun decrement() {
        if (enabled && value > minValue) {
            onValueChange((value - step).coerceAtLeast(minValue))
        }
    }

    Column(
        modifier = modifier.alpha(if (enabled) 1f else 0.5f)
    ) {
        if (label != null) {
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        val content: @Composable () -> Unit = {
            StepperButton(
                onClick = { decrement() },
                onLongPress = { decrement() },
                enabled = enabled && !isAtMin,
                size = size,
                variant = variant
            ) {
                Icon(
                    imageVector = if (orientation == StepperOrientation.Vertical)
                        Icons.Default.KeyboardArrowDown else Icons.Default.Remove,
                    contentDescription = "Decrease",
                    modifier = Modifier.size(size.iconSize)
                )
            }

            if (showInput) {
                var textValue by remember(value) { mutableStateOf(displayValue) }

                BasicTextField(
                    value = textValue,
                    onValueChange = { textValue = it },
                    modifier = Modifier
                        .widthIn(min = 40.dp)
                        .padding(horizontal = 8.dp),
                    textStyle = LocalTextStyle.current.copy(
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Medium
                    ),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    enabled = enabled
                )
            } else {
                Text(
                    text = displayValue,
                    fontWeight = FontWeight.Medium,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.widthIn(min = 40.dp)
                )
            }

            StepperButton(
                onClick = { increment() },
                onLongPress = { increment() },
                enabled = enabled && !isAtMax,
                size = size,
                variant = variant
            ) {
                Icon(
                    imageVector = if (orientation == StepperOrientation.Vertical)
                        Icons.Default.KeyboardArrowUp else Icons.Default.Add,
                    contentDescription = "Increase",
                    modifier = Modifier.size(size.iconSize)
                )
            }
        }

        val containerModifier = when (variant) {
            StepperVariant.Outlined -> Modifier
                .border(2.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
                .padding(8.dp)
            else -> Modifier
        }

        if (orientation == StepperOrientation.Horizontal) {
            Row(
                modifier = containerModifier,
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(
                    if (variant == StepperVariant.Compact) 4.dp else 8.dp
                )
            ) {
                content()
            }
        } else {
            Column(
                modifier = containerModifier,
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Reversed order for vertical
                StepperButton(
                    onClick = { increment() },
                    onLongPress = { increment() },
                    enabled = enabled && !isAtMax,
                    size = size,
                    variant = variant
                ) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowUp,
                        contentDescription = "Increase",
                        modifier = Modifier.size(size.iconSize)
                    )
                }

                if (showInput) {
                    Text(
                        text = displayValue,
                        fontWeight = FontWeight.Medium,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.widthIn(min = 40.dp)
                    )
                }

                StepperButton(
                    onClick = { decrement() },
                    onLongPress = { decrement() },
                    enabled = enabled && !isAtMin,
                    size = size,
                    variant = variant
                ) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowDown,
                        contentDescription = "Decrease",
                        modifier = Modifier.size(size.iconSize)
                    )
                }
            }
        }
    }
}

@Composable
private fun Modifier.alpha(alpha: Float): Modifier = this.then(
    Modifier.graphicsLayer { this.alpha = alpha }
)

@Composable
private fun StepperButton(
    onClick: () -> Unit,
    onLongPress: () -> Unit,
    enabled: Boolean,
    size: StepperSize,
    variant: StepperVariant,
    content: @Composable () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    // Long press repeat
    LaunchedEffect(isPressed) {
        if (isPressed && enabled) {
            delay(500)
            while (isPressed) {
                onLongPress()
                delay(100)
            }
        }
    }

    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.95f else 1f,
        animationSpec = spring(dampingRatio = 0.6f)
    )

    val backgroundColor = when (variant) {
        StepperVariant.Outlined -> if (isPressed) MaterialTheme.colorScheme.surfaceVariant else Color.Transparent
        StepperVariant.Filled -> if (isPressed) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.surface
        StepperVariant.Compact -> if (isPressed) MaterialTheme.colorScheme.surfaceVariant else Color.Transparent
        else -> if (isPressed) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.surface
    }

    Box(
        modifier = Modifier
            .size(size.buttonSize)
            .scale(scale)
            .clip(RoundedCornerShape(8.dp))
            .background(backgroundColor)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        CompositionLocalProvider(
            LocalContentColor provides if (enabled)
                MaterialTheme.colorScheme.onSurface
            else
                MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f)
        ) {
            content()
        }
    }
}

// Quantity Stepper (E-commerce style)
@Composable
fun QuantityStepper(
    quantity: Int,
    onQuantityChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    minQuantity: Int = 1,
    maxQuantity: Int = 99,
    label: String = "Quantity",
    showLabel: Boolean = true
) {
    Column(modifier = modifier) {
        if (showLabel) {
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(8.dp)),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { if (quantity > minQuantity) onQuantityChange(quantity - 1) },
                enabled = quantity > minQuantity
            ) {
                Icon(Icons.Default.Remove, contentDescription = "Decrease")
            }

            Divider(
                modifier = Modifier
                    .height(24.dp)
                    .width(1.dp)
            )

            Text(
                text = quantity.toString(),
                fontWeight = FontWeight.Medium,
                modifier = Modifier.width(48.dp),
                textAlign = TextAlign.Center
            )

            Divider(
                modifier = Modifier
                    .height(24.dp)
                    .width(1.dp)
            )

            IconButton(
                onClick = { if (quantity < maxQuantity) onQuantityChange(quantity + 1) },
                enabled = quantity < maxQuantity
            ) {
                Icon(Icons.Default.Add, contentDescription = "Increase")
            }
        }
    }
}

// Step Progress (Wizard style)
@Composable
fun StepProgress(
    currentStep: Int,
    totalSteps: Int,
    modifier: Modifier = Modifier,
    labels: List<String>? = null,
    onStepClick: ((Int) -> Unit)? = null,
    allowClickAhead: Boolean = false,
    variant: StepProgressVariant = StepProgressVariant.Default
) {
    Column(modifier = modifier) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            repeat(totalSteps) { index ->
                val step = index + 1
                val isCompleted = step < currentStep
                val isCurrent = step == currentStep
                val isClickable = allowClickAhead || step <= currentStep

                // Step indicator
                Box(
                    modifier = Modifier
                        .then(
                            if (isClickable && onStepClick != null) {
                                Modifier.clickable { onStepClick(step) }
                            } else Modifier
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    val size = if (variant == StepProgressVariant.Dotted) 12.dp else 40.dp

                    Box(
                        modifier = Modifier
                            .size(size)
                            .clip(CircleShape)
                            .background(
                                when {
                                    isCompleted || isCurrent -> MaterialTheme.colorScheme.primary
                                    else -> MaterialTheme.colorScheme.surfaceVariant
                                }
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        if (variant != StepProgressVariant.Dotted) {
                            if (isCompleted) {
                                Icon(
                                    Icons.Default.Check,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.onPrimary,
                                    modifier = Modifier.size(16.dp)
                                )
                            } else {
                                Text(
                                    text = step.toString(),
                                    color = if (isCurrent)
                                        MaterialTheme.colorScheme.onPrimary
                                    else
                                        MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp
                                )
                            }
                        }
                    }

                    if (isCurrent && variant != StepProgressVariant.Dotted) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .border(
                                    4.dp,
                                    MaterialTheme.colorScheme.primary.copy(alpha = 0.3f),
                                    CircleShape
                                )
                        )
                    }
                }

                // Connector line
                if (index < totalSteps - 1) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(2.dp)
                            .padding(horizontal = 8.dp)
                            .background(
                                if (step < currentStep)
                                    MaterialTheme.colorScheme.primary
                                else
                                    MaterialTheme.colorScheme.surfaceVariant
                            )
                    )
                }
            }
        }

        // Labels
        if (labels != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth()) {
                labels.forEachIndexed { index, label ->
                    Text(
                        text = label,
                        style = MaterialTheme.typography.bodySmall,
                        color = if (index + 1 == currentStep)
                            MaterialTheme.colorScheme.primary
                        else
                            MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

enum class StepProgressVariant {
    Default, Numbered, Dotted
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
