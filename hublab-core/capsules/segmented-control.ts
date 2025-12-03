/**
 * Segmented Control Capsule - Multi-Platform
 * iOS-style segmented picker control
 */

import { CapsuleDefinition } from './types'

export const SegmentedControlCapsule: CapsuleDefinition = {
  id: 'segmented-control',
  name: 'Segmented Control',
  description: 'iOS-style segmented picker for switching views',
  category: 'forms',
  tags: ['segmented', 'control', 'picker', 'tabs', 'toggle'],
  version: '1.0.0',

  props: [
    {
      name: 'options',
      type: 'array',
      required: true,
      description: 'Array of option labels'
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      description: 'Selected index'
    },
    {
      name: 'onChange',
      type: 'action',
      required: true,
      description: 'Callback when selection changes'
    },
    {
      name: 'size',
      type: 'select',
      required: false,
      default: 'default',
      options: ['small', 'default', 'large'],
      description: 'Control size'
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Stretch to full width'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Disable the control'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React from 'react'

interface SegmentedControlProps {
  options: string[]
  value: number
  onChange: (index: number) => void
  size?: 'small' | 'default' | 'large'
  fullWidth?: boolean
  disabled?: boolean
}

export function SegmentedControl({
  options,
  value,
  onChange,
  size = 'default',
  fullWidth = false,
  disabled = false
}: SegmentedControlProps) {
  const sizeClasses = {
    small: 'text-xs py-1 px-3',
    default: 'text-sm py-2 px-4',
    large: 'text-base py-2.5 px-5'
  }

  return (
    <div
      className={\`inline-flex bg-gray-100 rounded-lg p-1 \${fullWidth ? 'w-full' : ''} \${disabled ? 'opacity-50 pointer-events-none' : ''}\`}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          disabled={disabled}
          className={\`\${sizeClasses[size]} rounded-md font-medium transition-all \${
            fullWidth ? 'flex-1' : ''
          } \${
            index === value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }\`}
        >
          {option}
        </button>
      ))}
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

struct SegmentedControl: View {
    let options: [String]
    @Binding var selection: Int
    var disabled: Bool = false

    var body: some View {
        Picker("", selection: $selection) {
            ForEach(0..<options.count, id: \\.self) { index in
                Text(options[index]).tag(index)
            }
        }
        .pickerStyle(.segmented)
        .disabled(disabled)
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
fun SegmentedControl(
    options: List<String>,
    selectedIndex: Int,
    onSelectionChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Row(
        modifier = modifier
            .background(Color.LightGray.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
            .padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        options.forEachIndexed { index, option ->
            val isSelected = index == selectedIndex

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(6.dp))
                    .background(if (isSelected) Color.White else Color.Transparent)
                    .clickable(enabled = enabled) { onSelectionChange(index) }
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = option,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = if (isSelected) FontWeight.Medium else FontWeight.Normal,
                    color = if (isSelected) Color.Black else Color.Gray
                )
            }
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
