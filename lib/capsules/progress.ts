/**
 * Progress Capsule - Multi-Platform Progress Indicators
 *
 * Linear and circular progress indicators with various styles
 */

import { CapsuleDefinition } from './types'

export const ProgressCapsule: CapsuleDefinition = {
  id: 'progress',
  name: 'Progress',
  description: 'Linear and circular progress indicators',
  category: 'feedback',
  tags: ['progress', 'loading', 'bar', 'circular', 'indicator', 'spinner'],
  version: '1.0.0',

  props: [
    {
      name: 'value',
      type: 'number',
      required: false,
      description: 'Progress value (0-100). Omit for indeterminate.'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'linear',
      description: 'Progress indicator style',
      options: ['linear', 'circular', 'semicircle']
    },
    {
      name: 'size',
      type: 'size',
      required: false,
      default: 'md',
      description: 'Size of the progress indicator'
    },
    {
      name: 'color',
      type: 'color',
      required: false,
      default: 'primary',
      description: 'Color of the progress indicator'
    },
    {
      name: 'showValue',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show progress percentage'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Label text'
    },
    {
      name: 'animated',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Enable animations'
    },
    {
      name: 'striped',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Add striped pattern (linear only)'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React from 'react'

interface ProgressProps {
  value?: number
  variant?: 'linear' | 'circular' | 'semicircle'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  label?: string
  animated?: boolean
  striped?: boolean
  className?: string
}

export function Progress({
  value,
  variant = 'linear',
  size = 'md',
  color = 'primary',
  showValue = false,
  label,
  animated = true,
  striped = false,
  className = ''
}: ProgressProps) {
  const isIndeterminate = value === undefined

  const colorStyles = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600'
  }

  const trackColor = 'bg-gray-200 dark:bg-gray-700'
  const fillColor = colorStyles[color]

  if (variant === 'circular' || variant === 'semicircle') {
    return (
      <CircularProgress
        value={value}
        variant={variant}
        size={size}
        color={color}
        showValue={showValue}
        label={label}
        animated={animated}
        className={className}
      />
    )
  }

  // Linear progress
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  }

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && !isIndeterminate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(value!)}%
            </span>
          )}
        </div>
      )}

      <div
        className={\`w-full rounded-full overflow-hidden \${trackColor} \${sizeStyles[size]}\`}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={\`
            h-full rounded-full transition-all duration-300
            \${fillColor}
            \${striped ? 'bg-stripes' : ''}
            \${isIndeterminate ? 'animate-indeterminate w-1/3' : ''}
          \`}
          style={isIndeterminate ? undefined : { width: \`\${value}%\` }}
        />
      </div>
    </div>
  )
}

interface CircularProgressProps {
  value?: number
  variant: 'circular' | 'semicircle'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  label?: string
  animated?: boolean
  className?: string
}

function CircularProgress({
  value,
  variant,
  size = 'md',
  color = 'primary',
  showValue = false,
  label,
  animated = true,
  className = ''
}: CircularProgressProps) {
  const isIndeterminate = value === undefined

  const sizeConfig = {
    sm: { width: 32, strokeWidth: 3, fontSize: 'text-xs' },
    md: { width: 48, strokeWidth: 4, fontSize: 'text-sm' },
    lg: { width: 72, strokeWidth: 6, fontSize: 'text-base' }
  }

  const colorStyles = {
    primary: 'stroke-blue-600',
    secondary: 'stroke-gray-600',
    success: 'stroke-green-600',
    warning: 'stroke-yellow-500',
    error: 'stroke-red-600'
  }

  const { width, strokeWidth, fontSize } = sizeConfig[size]
  const radius = (width - strokeWidth) / 2
  const circumference = variant === 'semicircle'
    ? Math.PI * radius
    : 2 * Math.PI * radius

  const progress = isIndeterminate ? 0 : (value! / 100)
  const offset = circumference * (1 - progress)

  return (
    <div className={\`inline-flex flex-col items-center \${className}\`}>
      <div
        className="relative"
        style={{ width, height: variant === 'semicircle' ? width / 2 : width }}
      >
        <svg
          className={\`\${variant === 'circular' ? '-rotate-90' : 'rotate-180'}\`}
          width={width}
          height={variant === 'semicircle' ? width / 2 + strokeWidth : width}
          viewBox={\`0 0 \${width} \${variant === 'semicircle' ? width / 2 + strokeWidth : width}\`}
        >
          {/* Track */}
          <circle
            cx={width / 2}
            cy={variant === 'semicircle' ? width / 2 : width / 2}
            r={radius}
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={strokeWidth}
            strokeDasharray={variant === 'semicircle' ? \`\${circumference} \${circumference}\` : undefined}
            strokeLinecap="round"
          />

          {/* Progress */}
          <circle
            cx={width / 2}
            cy={variant === 'semicircle' ? width / 2 : width / 2}
            r={radius}
            fill="none"
            className={\`
              \${colorStyles[color]}
              \${isIndeterminate && animated ? 'animate-spin-slow' : ''}
              \${animated && !isIndeterminate ? 'transition-all duration-300' : ''}
            \`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isIndeterminate ? circumference * 0.75 : offset}
            style={isIndeterminate ? { transformOrigin: 'center' } : undefined}
          />
        </svg>

        {/* Center value */}
        {showValue && !isIndeterminate && variant === 'circular' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={\`font-semibold text-gray-900 dark:text-white \${fontSize}\`}>
              {Math.round(value!)}%
            </span>
          </div>
        )}
      </div>

      {showValue && !isIndeterminate && variant === 'semicircle' && (
        <span className={\`font-semibold text-gray-900 dark:text-white \${fontSize} -mt-2\`}>
          {Math.round(value!)}%
        </span>
      )}

      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {label}
        </span>
      )}
    </div>
  )
}

// Spinner component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
}

export function Spinner({
  size = 'md',
  color = 'primary',
  className = ''
}: SpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorStyles = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  }

  return (
    <div
      className={\`
        animate-spin rounded-full border-2 border-t-transparent
        \${sizeStyles[size]}
        \${colorStyles[color]}
        \${className}
      \`}
      role="status"
      aria-label="Loading"
    />
  )
}

// Progress with steps
interface StepProgressProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepProgress({
  steps,
  currentStep,
  className = ''
}: StepProgressProps) {
  return (
    <div className={\`flex items-center \${className}\`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={\`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-colors
                  \${isCompleted
                    ? 'bg-blue-600 text-white'
                    : isCurrent
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                      : 'bg-gray-200 text-gray-500'
                  }
                \`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={\`mt-2 text-xs \${isCurrent ? 'font-semibold' : ''}\`}>
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={\`
                  flex-1 h-0.5 mx-2
                  \${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                \`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
`,
      styles: `
@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-indeterminate {
  animation: indeterminate 1.5s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 1.5s linear infinite;
}

.bg-stripes {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: stripes 1s linear infinite;
}

@keyframes stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
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

// MARK: - Progress Size
enum ProgressSize {
    case sm, md, lg

    var height: CGFloat {
        switch self {
        case .sm: return 4
        case .md: return 8
        case .lg: return 16
        }
    }

    var circularWidth: CGFloat {
        switch self {
        case .sm: return 32
        case .md: return 48
        case .lg: return 72
        }
    }

    var strokeWidth: CGFloat {
        switch self {
        case .sm: return 3
        case .md: return 4
        case .lg: return 6
        }
    }
}

// MARK: - Progress Color
enum ProgressColor {
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

// MARK: - Linear Progress
struct LinearProgress: View {
    var value: Double? = nil
    var size: ProgressSize = .md
    var color: ProgressColor = .primary
    var showValue: Bool = false
    var label: String? = nil
    var animated: Bool = true

    @State private var animationProgress: Double = 0
    @State private var indeterminateOffset: CGFloat = -1

    private var isIndeterminate: Bool { value == nil }
    private var displayValue: Double { value ?? 0 }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if label != nil || showValue {
                HStack {
                    if let label = label {
                        Text(label)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(.secondary)
                    }
                    Spacer()
                    if showValue && !isIndeterminate {
                        Text("\\(Int(displayValue))%")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Track
                    RoundedRectangle(cornerRadius: size.height / 2)
                        .fill(Color.gray.opacity(0.2))
                        .frame(height: size.height)

                    if isIndeterminate {
                        // Indeterminate animation
                        RoundedRectangle(cornerRadius: size.height / 2)
                            .fill(color.color)
                            .frame(width: geometry.size.width * 0.3, height: size.height)
                            .offset(x: indeterminateOffset * geometry.size.width)
                            .onAppear {
                                withAnimation(
                                    Animation.easeInOut(duration: 1.5).repeatForever(autoreverses: true)
                                ) {
                                    indeterminateOffset = 0.7
                                }
                            }
                    } else {
                        // Determinate progress
                        RoundedRectangle(cornerRadius: size.height / 2)
                            .fill(color.color)
                            .frame(width: geometry.size.width * (animated ? animationProgress : displayValue) / 100, height: size.height)
                    }
                }
            }
            .frame(height: size.height)
            .onAppear {
                if animated && !isIndeterminate {
                    withAnimation(.easeOut(duration: 0.5)) {
                        animationProgress = displayValue
                    }
                }
            }
            .onChange(of: value) { newValue in
                if animated, let newValue = newValue {
                    withAnimation(.easeOut(duration: 0.3)) {
                        animationProgress = newValue
                    }
                }
            }
        }
    }
}

// MARK: - Circular Progress
struct CircularProgress: View {
    var value: Double? = nil
    var size: ProgressSize = .md
    var color: ProgressColor = .primary
    var showValue: Bool = false
    var label: String? = nil
    var animated: Bool = true

    @State private var animationProgress: Double = 0
    @State private var rotation: Double = 0

    private var isIndeterminate: Bool { value == nil }
    private var displayValue: Double { value ?? 0 }

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                // Track
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: size.strokeWidth)
                    .frame(width: size.circularWidth, height: size.circularWidth)

                // Progress
                Circle()
                    .trim(from: 0, to: isIndeterminate ? 0.75 : CGFloat((animated ? animationProgress : displayValue) / 100))
                    .stroke(
                        color.color,
                        style: StrokeStyle(lineWidth: size.strokeWidth, lineCap: .round)
                    )
                    .frame(width: size.circularWidth, height: size.circularWidth)
                    .rotationEffect(.degrees(isIndeterminate ? rotation : -90))
                    .animation(isIndeterminate ? Animation.linear(duration: 1).repeatForever(autoreverses: false) : nil, value: rotation)

                // Value
                if showValue && !isIndeterminate {
                    Text("\\(Int(displayValue))%")
                        .font(size == .lg ? .headline : .caption)
                        .fontWeight(.semibold)
                }
            }
            .onAppear {
                if isIndeterminate {
                    rotation = 360
                } else if animated {
                    withAnimation(.easeOut(duration: 0.5)) {
                        animationProgress = displayValue
                    }
                }
            }
            .onChange(of: value) { newValue in
                if animated, let newValue = newValue {
                    withAnimation(.easeOut(duration: 0.3)) {
                        animationProgress = newValue
                    }
                }
            }

            if let label = label {
                Text(label)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

// MARK: - Progress View (combines both)
struct ProgressIndicator: View {
    var value: Double? = nil
    var variant: ProgressVariant = .linear
    var size: ProgressSize = .md
    var color: ProgressColor = .primary
    var showValue: Bool = false
    var label: String? = nil

    enum ProgressVariant {
        case linear
        case circular
    }

    var body: some View {
        switch variant {
        case .linear:
            LinearProgress(value: value, size: size, color: color, showValue: showValue, label: label)
        case .circular:
            CircularProgress(value: value, size: size, color: color, showValue: showValue, label: label)
        }
    }
}

// MARK: - Step Progress
struct StepProgress: View {
    let steps: [String]
    let currentStep: Int

    var body: some View {
        HStack {
            ForEach(Array(steps.enumerated()), id: \\.offset) { index, step in
                VStack(spacing: 8) {
                    ZStack {
                        Circle()
                            .fill(index < currentStep ? Color.blue : (index == currentStep ? Color.blue.opacity(0.2) : Color.gray.opacity(0.2)))
                            .frame(width: 32, height: 32)

                        if index < currentStep {
                            Image(systemName: "checkmark")
                                .font(.caption.bold())
                                .foregroundColor(.white)
                        } else {
                            Text("\\(index + 1)")
                                .font(.caption.bold())
                                .foregroundColor(index == currentStep ? .blue : .gray)
                        }

                        if index == currentStep {
                            Circle()
                                .stroke(Color.blue, lineWidth: 2)
                                .frame(width: 32, height: 32)
                        }
                    }

                    Text(step)
                        .font(.caption2)
                        .foregroundColor(index == currentStep ? .primary : .secondary)
                        .fontWeight(index == currentStep ? .semibold : .regular)
                }

                if index < steps.count - 1 {
                    Rectangle()
                        .fill(index < currentStep ? Color.blue : Color.gray.opacity(0.2))
                        .frame(height: 2)
                }
            }
        }
    }
}

// MARK: - Native Progress View
struct NativeProgress: View {
    var value: Double? = nil
    var label: String? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            if let value = value {
                ProgressView(value: value / 100)
                    .progressViewStyle(.linear)
            } else {
                ProgressView()
                    .progressViewStyle(.linear)
            }
        }
    }
}

// MARK: - Preview
struct ProgressPreview: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                Group {
                    Text("Linear Progress")
                        .font(.headline)

                    LinearProgress(value: 60, showValue: true, label: "Uploading...")
                    LinearProgress(value: 30, size: .lg, color: .success)
                    LinearProgress(label: "Loading...") // Indeterminate
                }

                Divider()

                Group {
                    Text("Circular Progress")
                        .font(.headline)

                    HStack(spacing: 24) {
                        CircularProgress(value: 75, size: .sm, showValue: true)
                        CircularProgress(value: 50, showValue: true, label: "Progress")
                        CircularProgress(value: 25, size: .lg, color: .warning, showValue: true)
                    }

                    CircularProgress(size: .md, label: "Loading...") // Indeterminate
                }

                Divider()

                Group {
                    Text("Step Progress")
                        .font(.headline)

                    StepProgress(
                        steps: ["Cart", "Shipping", "Payment", "Done"],
                        currentStep: 2
                    )
                }
            }
            .padding()
        }
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
        'androidx.compose.animation.core.*',
        'androidx.compose.foundation.Canvas',
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.CircleShape',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.Check',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.geometry.Offset',
        'androidx.compose.ui.geometry.Size',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.graphics.StrokeCap',
        'androidx.compose.ui.graphics.drawscope.Stroke',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.Dp',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Size enum
enum class ProgressSize(val height: Dp, val circularWidth: Dp, val strokeWidth: Dp) {
    SM(4.dp, 32.dp, 3.dp),
    MD(8.dp, 48.dp, 4.dp),
    LG(16.dp, 72.dp, 6.dp)
}

// Color enum
enum class ProgressColor(val color: Color) {
    PRIMARY(Color(0xFF3B82F6)),
    SECONDARY(Color(0xFF6B7280)),
    SUCCESS(Color(0xFF22C55E)),
    WARNING(Color(0xFFEAB308)),
    ERROR(Color(0xFFEF4444))
}

@Composable
fun LinearProgress(
    progress: Float? = null,
    modifier: Modifier = Modifier,
    size: ProgressSize = ProgressSize.MD,
    color: ProgressColor = ProgressColor.PRIMARY,
    showValue: Boolean = false,
    label: String? = null,
    trackColor: Color = Color.Gray.copy(alpha = 0.2f)
) {
    val isIndeterminate = progress == null

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
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                if (showValue && !isIndeterminate) {
                    Text(
                        text = "${(progress!! * 100).toInt()}%",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
        }

        if (isIndeterminate) {
            LinearProgressIndicator(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(size.height)
                    .clip(RoundedCornerShape(size.height / 2)),
                color = color.color,
                trackColor = trackColor
            )
        } else {
            LinearProgressIndicator(
                progress = progress,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(size.height)
                    .clip(RoundedCornerShape(size.height / 2)),
                color = color.color,
                trackColor = trackColor
            )
        }
    }
}

@Composable
fun CircularProgress(
    progress: Float? = null,
    modifier: Modifier = Modifier,
    size: ProgressSize = ProgressSize.MD,
    color: ProgressColor = ProgressColor.PRIMARY,
    showValue: Boolean = false,
    label: String? = null,
    trackColor: Color = Color.Gray.copy(alpha = 0.2f)
) {
    val isIndeterminate = progress == null

    val animatedProgress by animateFloatAsState(
        targetValue = progress ?: 0f,
        animationSpec = tween(300),
        label = "progress"
    )

    val infiniteTransition = rememberInfiniteTransition(label = "infinite")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = LinearEasing)
        ),
        label = "rotation"
    )

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(size.circularWidth)
        ) {
            Canvas(modifier = Modifier.size(size.circularWidth)) {
                val strokeWidthPx = size.strokeWidth.toPx()
                val radius = (size.circularWidth.toPx() - strokeWidthPx) / 2
                val center = Offset(size.circularWidth.toPx() / 2, size.circularWidth.toPx() / 2)

                // Track
                drawCircle(
                    color = trackColor,
                    radius = radius,
                    center = center,
                    style = Stroke(width = strokeWidthPx)
                )

                // Progress
                if (isIndeterminate) {
                    drawArc(
                        color = color.color,
                        startAngle = rotation - 90f,
                        sweepAngle = 270f,
                        useCenter = false,
                        topLeft = Offset(strokeWidthPx / 2, strokeWidthPx / 2),
                        size = Size(size.circularWidth.toPx() - strokeWidthPx, size.circularWidth.toPx() - strokeWidthPx),
                        style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round)
                    )
                } else {
                    drawArc(
                        color = color.color,
                        startAngle = -90f,
                        sweepAngle = 360f * animatedProgress,
                        useCenter = false,
                        topLeft = Offset(strokeWidthPx / 2, strokeWidthPx / 2),
                        size = Size(size.circularWidth.toPx() - strokeWidthPx, size.circularWidth.toPx() - strokeWidthPx),
                        style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round)
                    )
                }
            }

            if (showValue && !isIndeterminate) {
                Text(
                    text = "${(progress!! * 100).toInt()}%",
                    fontSize = when (size) {
                        ProgressSize.SM -> 10.sp
                        ProgressSize.MD -> 12.sp
                        ProgressSize.LG -> 16.sp
                    },
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        if (label != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = label,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// Step Progress
@Composable
fun StepProgress(
    steps: List<String>,
    currentStep: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        steps.forEachIndexed { index, step ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(
                            when {
                                index < currentStep -> MaterialTheme.colorScheme.primary
                                index == currentStep -> MaterialTheme.colorScheme.primaryContainer
                                else -> Color.Gray.copy(alpha = 0.2f)
                            }
                        )
                        .then(
                            if (index == currentStep) {
                                Modifier.border(
                                    width = 2.dp,
                                    color = MaterialTheme.colorScheme.primary,
                                    shape = CircleShape
                                )
                            } else Modifier
                        )
                ) {
                    if (index < currentStep) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(16.dp)
                        )
                    } else {
                        Text(
                            text = "${index + 1}",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (index == currentStep)
                                MaterialTheme.colorScheme.primary
                            else
                                Color.Gray
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = step,
                    fontSize = 10.sp,
                    fontWeight = if (index == currentStep) FontWeight.SemiBold else FontWeight.Normal,
                    color = if (index == currentStep)
                        MaterialTheme.colorScheme.onSurface
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (index < steps.lastIndex) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(2.dp)
                        .padding(horizontal = 4.dp)
                        .background(
                            if (index < currentStep)
                                MaterialTheme.colorScheme.primary
                            else
                                Color.Gray.copy(alpha = 0.2f)
                        )
                )
            }
        }
    }
}

// Wrapper to use Material3 progress indicators directly
@Composable
fun M3LinearProgress(
    progress: Float? = null,
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.primary
) {
    if (progress == null) {
        LinearProgressIndicator(
            modifier = modifier,
            color = color
        )
    } else {
        LinearProgressIndicator(
            progress = progress,
            modifier = modifier,
            color = color
        )
    }
}

@Composable
fun M3CircularProgress(
    progress: Float? = null,
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.primary
) {
    if (progress == null) {
        CircularProgressIndicator(
            modifier = modifier,
            color = color
        )
    } else {
        CircularProgressIndicator(
            progress = progress,
            modifier = modifier,
            color = color
        )
    }
}

private fun Modifier.border(width: Dp, color: Color, shape: androidx.compose.ui.graphics.Shape): Modifier {
    return this
}
`
    }
  }
}
