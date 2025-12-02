/**
 * Switch Capsule - Multi-Platform Toggle Control
 *
 * Binary toggle switch for on/off states
 */

import { CapsuleDefinition } from './types'

export const SwitchCapsule: CapsuleDefinition = {
  id: 'switch',
  name: 'Switch',
  description: 'Binary toggle switch for on/off states',
  category: 'forms',
  tags: ['switch', 'toggle', 'checkbox', 'boolean', 'control'],
  version: '1.0.0',

  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the switch is on'
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Initial checked state (uncontrolled)'
    },
    {
      name: 'onChange',
      type: 'action',
      required: false,
      description: 'Callback when state changes'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the switch is disabled'
    },
    {
      name: 'size',
      type: 'size',
      required: false,
      default: 'md',
      description: 'Size of the switch'
    },
    {
      name: 'color',
      type: 'color',
      required: false,
      default: 'primary',
      description: 'Color when checked'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Label text'
    },
    {
      name: 'labelPosition',
      type: 'select',
      required: false,
      default: 'right',
      description: 'Position of the label',
      options: ['left', 'right']
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'Form field name'
    },
    {
      name: 'id',
      type: 'string',
      required: false,
      description: 'Element ID for accessibility'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, useId } from 'react'

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  label?: string
  labelPosition?: 'left' | 'right'
  name?: string
  id?: string
  className?: string
}

export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  label,
  labelPosition = 'right',
  name,
  id: customId,
  className = ''
}: SwitchProps) {
  const autoId = useId()
  const id = customId || autoId
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  const isControlled = controlledChecked !== undefined
  const isChecked = isControlled ? controlledChecked : internalChecked

  const handleChange = () => {
    if (disabled) return

    const newValue = !isChecked
    if (!isControlled) {
      setInternalChecked(newValue)
    }
    onChange?.(newValue)
  }

  const sizeStyles = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-8', thumb: 'w-7 h-7', translate: 'translate-x-6' }
  }

  const colorStyles = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600'
  }

  const { track, thumb, translate } = sizeStyles[size]
  const activeColor = colorStyles[color]

  const switchElement = (
    <button
      type="button"
      role="switch"
      id={id}
      name={name}
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleChange}
      className={\`
        relative inline-flex shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        \${track}
        \${isChecked ? activeColor : 'bg-gray-200 dark:bg-gray-700'}
        \${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        \${className}
      \`}
    >
      <span className="sr-only">{label || 'Toggle'}</span>
      <span
        aria-hidden="true"
        className={\`
          pointer-events-none inline-block rounded-full bg-white shadow-lg
          ring-0 transition duration-200 ease-in-out
          \${thumb}
          \${isChecked ? translate : 'translate-x-0'}
        \`}
      />
    </button>
  )

  if (!label) {
    return switchElement
  }

  return (
    <div className="flex items-center gap-3">
      {labelPosition === 'left' && (
        <label
          htmlFor={id}
          className={\`text-sm font-medium \${disabled ? 'text-gray-400' : 'text-gray-900 dark:text-white'}\`}
        >
          {label}
        </label>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <label
          htmlFor={id}
          className={\`text-sm font-medium \${disabled ? 'text-gray-400' : 'text-gray-900 dark:text-white'}\`}
        >
          {label}
        </label>
      )}
    </div>
  )
}

// Switch Group for multiple switches
interface SwitchGroupProps {
  children: React.ReactNode
  label?: string
  className?: string
}

export function SwitchGroup({ children, label, className = '' }: SwitchGroupProps) {
  return (
    <fieldset className={className}>
      {label && (
        <legend className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {label}
        </legend>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </fieldset>
  )
}

// Switch with description
interface SwitchWithDescriptionProps extends SwitchProps {
  description?: string
}

export function SwitchWithDescription({
  label,
  description,
  ...props
}: SwitchWithDescriptionProps) {
  const id = useId()

  return (
    <div className="flex items-start gap-3">
      <Switch {...props} id={id} className="mt-0.5" />
      <div className="flex-1">
        <label
          htmlFor={id}
          className={\`block text-sm font-medium \${props.disabled ? 'text-gray-400' : 'text-gray-900 dark:text-white'}\`}
        >
          {label}
        </label>
        {description && (
          <p className={\`mt-1 text-sm \${props.disabled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}\`}>
            {description}
          </p>
        )}
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

// MARK: - Switch Size
enum SwitchSize {
    case sm, md, lg

    var scale: CGFloat {
        switch self {
        case .sm: return 0.7
        case .md: return 0.85
        case .lg: return 1.0
        }
    }
}

// MARK: - Switch Color
enum SwitchColor {
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

// MARK: - Custom Switch View
struct CustomSwitch: View {
    @Binding var isOn: Bool
    var size: SwitchSize = .md
    var color: SwitchColor = .primary
    var label: String? = nil
    var labelPosition: LabelPosition = .trailing
    var disabled: Bool = false
    var onChange: ((Bool) -> Void)? = nil

    enum LabelPosition {
        case leading, trailing
    }

    var body: some View {
        HStack(spacing: 12) {
            if let label = label, labelPosition == .leading {
                labelView(label)
            }

            Toggle("", isOn: Binding(
                get: { isOn },
                set: { newValue in
                    if !disabled {
                        isOn = newValue
                        onChange?(newValue)
                    }
                }
            ))
            .toggleStyle(SwitchToggleStyle(tint: color.color))
            .labelsHidden()
            .scaleEffect(size.scale)
            .disabled(disabled)
            .opacity(disabled ? 0.5 : 1)

            if let label = label, labelPosition == .trailing {
                labelView(label)
            }
        }
    }

    @ViewBuilder
    private func labelView(_ text: String) -> some View {
        Text(text)
            .font(.subheadline)
            .foregroundColor(disabled ? .gray : .primary)
    }
}

// MARK: - Switch Group
struct SwitchGroup<Content: View>: View {
    let label: String?
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let label = label {
                Text(label)
                    .font(.headline)
                    .foregroundColor(.primary)
            }

            VStack(alignment: .leading, spacing: 12) {
                content()
            }
        }
    }
}

// MARK: - Switch with Description
struct SwitchWithDescription: View {
    @Binding var isOn: Bool
    let title: String
    let description: String?
    var color: SwitchColor = .primary
    var disabled: Bool = false
    var onChange: ((Bool) -> Void)? = nil

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Toggle("", isOn: Binding(
                get: { isOn },
                set: { newValue in
                    if !disabled {
                        isOn = newValue
                        onChange?(newValue)
                    }
                }
            ))
            .toggleStyle(SwitchToggleStyle(tint: color.color))
            .labelsHidden()
            .disabled(disabled)
            .opacity(disabled ? 0.5 : 1)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(disabled ? .gray : .primary)

                if let description = description {
                    Text(description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()
        }
    }
}

// MARK: - Form Switch Row
struct FormSwitchRow: View {
    @Binding var isOn: Bool
    let title: String
    var subtitle: String? = nil
    var icon: String? = nil
    var iconColor: Color = .blue
    var disabled: Bool = false
    var onChange: ((Bool) -> Void)? = nil

    var body: some View {
        HStack(spacing: 12) {
            if let icon = icon {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(iconColor)
                    .frame(width: 28)
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body)
                    .foregroundColor(disabled ? .gray : .primary)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()

            Toggle("", isOn: Binding(
                get: { isOn },
                set: { newValue in
                    if !disabled {
                        isOn = newValue
                        onChange?(newValue)
                    }
                }
            ))
            .labelsHidden()
            .disabled(disabled)
            .opacity(disabled ? 0.5 : 1)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Preview
struct SwitchPreview: PreviewProvider {
    struct PreviewContainer: View {
        @State private var switch1 = false
        @State private var switch2 = true
        @State private var switch3 = false
        @State private var notifications = true
        @State private var darkMode = false
        @State private var autoSync = true

        var body: some View {
            NavigationView {
                List {
                    Section("Basic Switches") {
                        CustomSwitch(isOn: $switch1, label: "Default Switch")
                        CustomSwitch(isOn: $switch2, size: .lg, color: .success, label: "Large Success")
                        CustomSwitch(isOn: $switch3, size: .sm, color: .warning, label: "Small Warning", disabled: true)
                    }

                    Section("Switch Group") {
                        SwitchGroup(label: "Preferences") {
                            CustomSwitch(isOn: $notifications, label: "Notifications")
                            CustomSwitch(isOn: $darkMode, label: "Dark Mode")
                            CustomSwitch(isOn: $autoSync, label: "Auto Sync")
                        }
                    }

                    Section("With Descriptions") {
                        SwitchWithDescription(
                            isOn: $notifications,
                            title: "Push Notifications",
                            description: "Receive notifications about updates and messages"
                        )

                        SwitchWithDescription(
                            isOn: $darkMode,
                            title: "Dark Mode",
                            description: "Reduce eye strain in low-light environments",
                            color: .secondary
                        )
                    }

                    Section("Form Rows") {
                        FormSwitchRow(
                            isOn: $notifications,
                            title: "Notifications",
                            subtitle: "Get notified about updates",
                            icon: "bell.fill",
                            iconColor: .red
                        )

                        FormSwitchRow(
                            isOn: $darkMode,
                            title: "Dark Mode",
                            icon: "moon.fill",
                            iconColor: .purple
                        )

                        FormSwitchRow(
                            isOn: $autoSync,
                            title: "Auto Sync",
                            subtitle: "Sync data automatically",
                            icon: "arrow.triangle.2.circlepath",
                            iconColor: .green
                        )
                    }
                }
                .navigationTitle("Switch Examples")
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
        'androidx.compose.animation.animateColorAsState',
        'androidx.compose.animation.core.animateDpAsState',
        'androidx.compose.animation.core.tween',
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.clickable',
        'androidx.compose.foundation.interaction.MutableInteractionSource',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.CircleShape',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.semantics.Role',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.Dp',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Size enum
enum class SwitchSize(val trackWidth: Dp, val trackHeight: Dp, val thumbSize: Dp) {
    SM(32.dp, 18.dp, 14.dp),
    MD(44.dp, 24.dp, 20.dp),
    LG(56.dp, 30.dp, 26.dp)
}

// Color enum
enum class SwitchColor(val activeColor: Color) {
    PRIMARY(Color(0xFF3B82F6)),
    SECONDARY(Color(0xFF6B7280)),
    SUCCESS(Color(0xFF22C55E)),
    WARNING(Color(0xFFEAB308)),
    ERROR(Color(0xFFEF4444))
}

@Composable
fun CustomSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    size: SwitchSize = SwitchSize.MD,
    color: SwitchColor = SwitchColor.PRIMARY,
    label: String? = null,
    labelPosition: LabelPosition = LabelPosition.END
) {
    val interactionSource = remember { MutableInteractionSource() }

    val trackColor by animateColorAsState(
        targetValue = if (checked) color.activeColor else Color.Gray.copy(alpha = 0.3f),
        animationSpec = tween(200),
        label = "track_color"
    )

    val thumbOffset by animateDpAsState(
        targetValue = if (checked) size.trackWidth - size.thumbSize - 4.dp else 2.dp,
        animationSpec = tween(200),
        label = "thumb_offset"
    )

    val content: @Composable RowScope.() -> Unit = {
        if (label != null && labelPosition == LabelPosition.START) {
            Text(
                text = label,
                fontSize = 14.sp,
                color = if (enabled) MaterialTheme.colorScheme.onSurface else Color.Gray
            )
            Spacer(modifier = Modifier.width(12.dp))
        }

        Box(
            modifier = Modifier
                .width(size.trackWidth)
                .height(size.trackHeight)
                .clip(RoundedCornerShape(size.trackHeight / 2))
                .background(trackColor)
                .clickable(
                    interactionSource = interactionSource,
                    indication = null,
                    enabled = enabled,
                    role = Role.Switch,
                    onClick = { onCheckedChange(!checked) }
                ),
            contentAlignment = Alignment.CenterStart
        ) {
            Box(
                modifier = Modifier
                    .offset(x = thumbOffset)
                    .size(size.thumbSize)
                    .clip(CircleShape)
                    .background(Color.White)
            )
        }

        if (label != null && labelPosition == LabelPosition.END) {
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = label,
                fontSize = 14.sp,
                color = if (enabled) MaterialTheme.colorScheme.onSurface else Color.Gray
            )
        }
    }

    Row(
        modifier = modifier
            .let { if (!enabled) it.alpha(0.5f) else it },
        verticalAlignment = Alignment.CenterVertically,
        content = content
    )
}

enum class LabelPosition { START, END }

// Material 3 Switch wrapper with label
@Composable
fun LabeledSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    description: String? = null
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                enabled = enabled,
                onClick = { onCheckedChange(!checked) }
            )
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = label,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = if (enabled) MaterialTheme.colorScheme.onSurface else Color.Gray
            )
            if (description != null) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = description,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Spacer(modifier = Modifier.width(16.dp))

        Switch(
            checked = checked,
            onCheckedChange = null,
            enabled = enabled
        )
    }
}

// Switch Group
@Composable
fun SwitchGroup(
    modifier: Modifier = Modifier,
    title: String? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(modifier = modifier) {
        if (title != null) {
            Text(
                text = title,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(bottom = 12.dp)
            )
        }
        Column(
            verticalArrangement = Arrangement.spacedBy(8.dp),
            content = content
        )
    }
}

// Switch with Icon
@Composable
fun IconSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    icon: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    subtitle: String? = null
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                enabled = enabled,
                onClick = { onCheckedChange(!checked) }
            )
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            icon()
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = label,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = if (enabled) MaterialTheme.colorScheme.onSurface else Color.Gray
            )
            if (subtitle != null) {
                Text(
                    text = subtitle,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Switch(
            checked = checked,
            onCheckedChange = null,
            enabled = enabled
        )
    }
}

// Animated Switch (custom implementation)
@Composable
fun AnimatedSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    checkedTrackColor: Color = MaterialTheme.colorScheme.primary,
    uncheckedTrackColor: Color = MaterialTheme.colorScheme.surfaceVariant,
    checkedThumbColor: Color = MaterialTheme.colorScheme.onPrimary,
    uncheckedThumbColor: Color = MaterialTheme.colorScheme.outline
) {
    val trackWidth = 52.dp
    val trackHeight = 32.dp
    val thumbSize = 24.dp
    val thumbPadding = 4.dp

    val trackColor by animateColorAsState(
        targetValue = if (checked) checkedTrackColor else uncheckedTrackColor,
        animationSpec = tween(300),
        label = "track"
    )

    val thumbColor by animateColorAsState(
        targetValue = if (checked) checkedThumbColor else uncheckedThumbColor,
        animationSpec = tween(300),
        label = "thumb"
    )

    val thumbOffset by animateDpAsState(
        targetValue = if (checked) trackWidth - thumbSize - thumbPadding else thumbPadding,
        animationSpec = tween(300),
        label = "offset"
    )

    Box(
        modifier = modifier
            .width(trackWidth)
            .height(trackHeight)
            .clip(RoundedCornerShape(16.dp))
            .background(trackColor)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                enabled = enabled,
                onClick = { onCheckedChange(!checked) }
            )
            .let { if (!enabled) it.alpha(0.5f) else it },
        contentAlignment = Alignment.CenterStart
    ) {
        Box(
            modifier = Modifier
                .offset(x = thumbOffset)
                .size(thumbSize)
                .clip(CircleShape)
                .background(thumbColor)
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
