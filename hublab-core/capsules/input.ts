/**
 * Input Capsule - Multi-Platform
 *
 * Text input field with validation, icons, and multiple variants.
 */

import { CapsuleDefinition } from './types'

export const InputCapsule: CapsuleDefinition = {
  id: 'input',
  name: 'Input',
  description: 'Text input field with validation and styling options',
  category: 'forms',
  tags: ['form', 'input', 'text-field', 'interactive'],
  version: '1.0.0',

  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'Current input value'
    },
    {
      name: 'onChange',
      type: 'action',
      required: true,
      description: 'Callback when value changes'
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: '',
      description: 'Placeholder text'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Label above the input'
    },
    {
      name: 'type',
      type: 'select',
      required: false,
      default: 'text',
      options: ['text', 'email', 'password', 'number', 'phone', 'search'],
      description: 'Input type'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Disable input'
    },
    {
      name: 'error',
      type: 'string',
      required: false,
      description: 'Error message to display'
    },
    {
      name: 'helperText',
      type: 'string',
      required: false,
      description: 'Helper text below input'
    },
    {
      name: 'icon',
      type: 'icon',
      required: false,
      description: 'Leading icon'
    },
    {
      name: 'maxLength',
      type: 'number',
      required: false,
      description: 'Maximum character length'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lucide-react'],
      code: `
import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle, Search, Mail, Phone } from 'lucide-react'

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'phone' | 'search'
  disabled?: boolean
  error?: string
  helperText?: string
  icon?: React.ReactNode
  maxLength?: number
}

export function Input({
  value,
  onChange,
  placeholder = '',
  label,
  type = 'text',
  disabled = false,
  error,
  helperText,
  icon,
  maxLength
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  const getDefaultIcon = () => {
    switch (type) {
      case 'search': return <Search className="w-5 h-5 text-gray-400" />
      case 'email': return <Mail className="w-5 h-5 text-gray-400" />
      case 'phone': return <Phone className="w-5 h-5 text-gray-400" />
      default: return null
    }
  }

  const displayIcon = icon || getDefaultIcon()

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {displayIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {displayIcon}
          </div>
        )}

        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={\`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            \${displayIcon ? 'pl-10' : ''}
            \${type === 'password' ? 'pr-10' : ''}
            \${error
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : focused
                ? 'border-blue-500 ring-2 ring-blue-100'
                : 'border-gray-300 hover:border-gray-400'
            }
            \${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
            focus:outline-none
          \`}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={\`mt-1.5 text-sm \${error ? 'text-red-500' : 'text-gray-500'}\`}>
          {error || helperText}
        </p>
      )}

      {maxLength && (
        <p className="mt-1 text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
        </p>
      )}
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

enum InputType {
    case text, email, password, number, phone, search

    var keyboardType: UIKeyboardType {
        switch self {
        case .email: return .emailAddress
        case .number: return .numberPad
        case .phone: return .phonePad
        default: return .default
        }
    }

    var textContentType: UITextContentType? {
        switch self {
        case .email: return .emailAddress
        case .password: return .password
        case .phone: return .telephoneNumber
        default: return nil
        }
    }

    var icon: String? {
        switch self {
        case .search: return "magnifyingglass"
        case .email: return "envelope"
        case .phone: return "phone"
        default: return nil
        }
    }
}

struct HubLabInput: View {
    @Binding var value: String
    var placeholder: String = ""
    var label: String? = nil
    var type: InputType = .text
    var disabled: Bool = false
    var error: String? = nil
    var helperText: String? = nil
    var icon: String? = nil
    var maxLength: Int? = nil

    @State private var showPassword = false
    @State private var isFocused = false
    @FocusState private var focusState: Bool

    private var displayIcon: String? {
        icon ?? type.icon
    }

    private var isSecure: Bool {
        type == .password && !showPassword
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Label
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
            }

            // Input Field
            HStack(spacing: 10) {
                // Leading Icon
                if let iconName = displayIcon {
                    Image(systemName: iconName)
                        .foregroundColor(.gray)
                        .frame(width: 20)
                }

                // Text Field
                Group {
                    if isSecure {
                        SecureField(placeholder, text: $value)
                    } else {
                        TextField(placeholder, text: $value)
                    }
                }
                .keyboardType(type.keyboardType)
                .textContentType(type.textContentType)
                .autocapitalization(type == .email ? .none : .sentences)
                .disableAutocorrection(type == .email || type == .password)
                .focused($focusState)
                .disabled(disabled)
                .onChange(of: value) { newValue in
                    if let max = maxLength, newValue.count > max {
                        value = String(newValue.prefix(max))
                    }
                }

                // Password Toggle
                if type == .password {
                    Button(action: { showPassword.toggle() }) {
                        Image(systemName: showPassword ? "eye.slash" : "eye")
                            .foregroundColor(.gray)
                    }
                }

                // Error Icon
                if error != nil {
                    Image(systemName: "exclamationmark.circle.fill")
                        .foregroundColor(.red)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(disabled ? Color(.systemGray6) : Color(.systemBackground))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(
                        error != nil ? Color.red :
                            focusState ? Color.blue : Color(.systemGray4),
                        lineWidth: focusState ? 2 : 1
                    )
            )
            .opacity(disabled ? 0.6 : 1)

            // Helper/Error Text
            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            } else if let helper = helperText {
                Text(helper)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            // Character Count
            if let max = maxLength {
                Text("\\(value.count)/\\(max)")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .trailing)
            }
        }
        .onChange(of: focusState) { isFocused = $0 }
    }
}

// MARK: - Previews
#Preview("Input Variants") {
    VStack(spacing: 20) {
        HubLabInput(
            value: .constant(""),
            placeholder: "Enter your email",
            label: "Email",
            type: .email
        )

        HubLabInput(
            value: .constant(""),
            placeholder: "Enter password",
            label: "Password",
            type: .password
        )

        HubLabInput(
            value: .constant("Invalid email"),
            label: "With Error",
            type: .email,
            error: "Please enter a valid email"
        )

        HubLabInput(
            value: .constant("Disabled"),
            label: "Disabled Input",
            disabled: true
        )
    }
    .padding()
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3',
        'androidx.compose.material:material-icons-extended'
      ],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.material.icons.*',
        'androidx.compose.material.icons.filled.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'androidx.compose.ui.text.input.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.*
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

enum class InputType {
    Text, Email, Password, Number, Phone, Search;

    val keyboardType: KeyboardType
        get() = when (this) {
            Email -> KeyboardType.Email
            Number -> KeyboardType.Number
            Phone -> KeyboardType.Phone
            else -> KeyboardType.Text
        }

    val icon: ImageVector?
        get() = when (this) {
            Search -> Icons.Default.Search
            Email -> Icons.Default.Email
            Phone -> Icons.Default.Phone
            else -> null
        }
}

@Composable
fun HubLabInput(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    label: String? = null,
    type: InputType = InputType.Text,
    enabled: Boolean = true,
    error: String? = null,
    helperText: String? = null,
    leadingIcon: ImageVector? = null,
    maxLength: Int? = null
) {
    var passwordVisible by remember { mutableStateOf(false) }

    val displayIcon = leadingIcon ?: type.icon

    val visualTransformation = when {
        type == InputType.Password && !passwordVisible -> PasswordVisualTransformation()
        else -> VisualTransformation.None
    }

    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = { newValue ->
                if (maxLength == null || newValue.length <= maxLength) {
                    onValueChange(newValue)
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = enabled,
            label = label?.let { { Text(it) } },
            placeholder = { Text(placeholder) },
            leadingIcon = displayIcon?.let {
                { Icon(it, contentDescription = null) }
            },
            trailingIcon = {
                when {
                    type == InputType.Password -> {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                if (passwordVisible) Icons.Default.VisibilityOff
                                else Icons.Default.Visibility,
                                contentDescription = "Toggle password visibility"
                            )
                        }
                    }
                    error != null -> {
                        Icon(
                            Icons.Default.Error,
                            contentDescription = "Error",
                            tint = MaterialTheme.colorScheme.error
                        )
                    }
                }
            },
            isError = error != null,
            visualTransformation = visualTransformation,
            keyboardOptions = KeyboardOptions(
                keyboardType = type.keyboardType,
                imeAction = ImeAction.Done
            ),
            singleLine = true,
            shape = MaterialTheme.shapes.medium
        )

        // Supporting text
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, top = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            if (error != null) {
                Text(
                    text = error,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            } else if (helperText != null) {
                Text(
                    text = helperText,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                Spacer(Modifier)
            }

            if (maxLength != null) {
                Text(
                    text = "\${value.length}/\$maxLength",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabInputPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            var email by remember { mutableStateOf("") }
            HubLabInput(
                value = email,
                onValueChange = { email = it },
                label = "Email",
                placeholder = "Enter your email",
                type = InputType.Email
            )

            var password by remember { mutableStateOf("") }
            HubLabInput(
                value = password,
                onValueChange = { password = it },
                label = "Password",
                type = InputType.Password
            )

            HubLabInput(
                value = "Invalid input",
                onValueChange = {},
                label = "With Error",
                error = "This field is required"
            )
        }
    }
}
`
    }
  },

  children: false,
  preview: '/previews/input.png'
}
