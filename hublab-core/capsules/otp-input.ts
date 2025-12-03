/**
 * OTP Input Capsule - Multi-Platform
 * One-time password input with individual digit boxes
 */

import { CapsuleDefinition } from './types'

export const OTPInputCapsule: CapsuleDefinition = {
  id: 'otp-input',
  name: 'OTP Input',
  description: 'One-time password input for verification codes',
  category: 'forms',
  tags: ['otp', 'verification', 'code', 'input', '2fa'],
  version: '1.0.0',

  props: [
    {
      name: 'length',
      type: 'number',
      required: false,
      default: 6,
      description: 'Number of digits'
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Current OTP value'
    },
    {
      name: 'onChange',
      type: 'action',
      required: true,
      description: 'Callback when OTP changes'
    },
    {
      name: 'onComplete',
      type: 'action',
      required: false,
      description: 'Callback when all digits are filled'
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Auto focus first input'
    },
    {
      name: 'masked',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Mask input like password'
    },
    {
      name: 'error',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show error state'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useRef, useEffect } from 'react'

interface OTPInputProps {
  length?: number
  value?: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  autoFocus?: boolean
  masked?: boolean
  error?: boolean
}

export function OTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  autoFocus = true,
  masked = false,
  error = false
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleChange = (index: number, digit: string) => {
    if (!/^\\d*$/.test(digit)) return

    const newValue = value.split('')
    newValue[index] = digit.slice(-1)
    const result = newValue.join('')
    onChange(result)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (result.length === length && onComplete) {
      onComplete(result)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, length)
    onChange(pastedData)
    if (pastedData.length === length && onComplete) {
      onComplete(pastedData)
    }
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type={masked ? 'password' : 'text'}
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={\`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all \${
              error
                ? 'border-red-500 bg-red-50'
                : value[index]
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
            }\`}
        />
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

struct OTPInput: View {
    let length: Int
    @Binding var value: String
    var onComplete: ((String) -> Void)?
    var masked: Bool = false
    var error: Bool = false

    @FocusState private var focusedIndex: Int?

    init(length: Int = 6, value: Binding<String>, onComplete: ((String) -> Void)? = nil, masked: Bool = false, error: Bool = false) {
        self.length = length
        self._value = value
        self.onComplete = onComplete
        self.masked = masked
        self.error = error
    }

    var body: some View {
        HStack(spacing: 12) {
            ForEach(0..<length, id: \\.self) { index in
                TextField("", text: digitBinding(for: index))
                    .frame(width: 48, height: 56)
                    .multilineTextAlignment(.center)
                    .font(.system(size: 24, weight: .bold, design: .monospaced))
                    .keyboardType(.numberPad)
                    .focused($focusedIndex, equals: index)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(error ? Color.red : (digit(at: index) != nil ? Color.blue : Color.gray.opacity(0.3)), lineWidth: 2)
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(error ? Color.red.opacity(0.1) : (digit(at: index) != nil ? Color.blue.opacity(0.1) : Color.clear))
                            )
                    )
                    .onChange(of: value) { newValue in
                        if newValue.count == length {
                            onComplete?(newValue)
                        }
                    }
            }
        }
        .onAppear { focusedIndex = 0 }
    }

    private func digit(at index: Int) -> Character? {
        guard index < value.count else { return nil }
        return value[value.index(value.startIndex, offsetBy: index)]
    }

    private func digitBinding(for index: Int) -> Binding<String> {
        Binding(
            get: {
                if let char = digit(at: index) {
                    return masked ? "●" : String(char)
                }
                return ""
            },
            set: { newValue in
                let filtered = newValue.filter { $0.isNumber }
                if let digit = filtered.last {
                    var chars = Array(value)
                    while chars.count <= index { chars.append(" ") }
                    chars[index] = digit
                    value = String(chars).trimmingCharacters(in: .whitespaces)
                    if index < length - 1 { focusedIndex = index + 1 }
                }
            }
        )
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
fun OTPInput(
    length: Int = 6,
    value: String,
    onValueChange: (String) -> Unit,
    onComplete: ((String) -> Unit)? = null,
    masked: Boolean = false,
    error: Boolean = false
) {
    val focusRequesters = remember { List(length) { FocusRequester() } }
    val focusManager = LocalFocusManager.current

    LaunchedEffect(Unit) {
        focusRequesters.firstOrNull()?.requestFocus()
    }

    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        repeat(length) { index ->
            val char = value.getOrNull(index)?.toString() ?: ""

            OutlinedTextField(
                value = if (masked && char.isNotEmpty()) "●" else char,
                onValueChange = { newValue ->
                    val digit = newValue.filter { it.isDigit() }.lastOrNull()
                    if (digit != null) {
                        val newOtp = value.take(index) + digit + value.drop(index + 1)
                        onValueChange(newOtp.take(length))
                        if (index < length - 1) focusRequesters[index + 1].requestFocus()
                        if (newOtp.length == length) onComplete?.invoke(newOtp)
                    }
                },
                modifier = Modifier
                    .width(48.dp)
                    .focusRequester(focusRequesters[index]),
                textStyle = LocalTextStyle.current.copy(
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                ),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                isError = error,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = if (error) Color.Red else Color.Blue,
                    unfocusedBorderColor = if (char.isNotEmpty()) Color.Blue else Color.Gray
                ),
                shape = RoundedCornerShape(12.dp)
            )
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
