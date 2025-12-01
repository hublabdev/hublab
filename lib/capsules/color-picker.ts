import type { CapsuleDefinition } from './types'

export const ColorPickerCapsule: CapsuleDefinition = {
  id: 'color-picker',
  name: 'ColorPicker',
  description: 'Color selection component with various picker styles',
  category: 'input',
  tags: ['color', 'picker', 'input', 'palette', 'hue', 'saturation'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'ColorPicker.tsx',
          code: `import React, { useState, useRef, useEffect, useCallback } from 'react'

interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (color: string) => void
  format?: 'hex' | 'rgb' | 'hsl'
  showAlpha?: boolean
  presetColors?: string[]
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface HSV {
  h: number
  s: number
  v: number
}

interface RGB {
  r: number
  g: number
  b: number
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const v = max
  const d = max - min
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, v: v * 100 }
}

function hsvToRgb(h: number, s: number, v: number): RGB {
  h /= 360; s /= 100; v /= 100
  let r = 0, g = 0, b = 0
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }
  return { r: r * 255, g: g * 255, b: b * 255 }
}

export function ColorPicker({
  value,
  defaultValue = '#3b82f6',
  onChange,
  format = 'hex',
  showAlpha = false,
  presetColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff'],
  disabled = false,
  size = 'md',
  className = ''
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState(value || defaultValue)
  const [hsv, setHsv] = useState<HSV>(() => {
    const rgb = hexToRgb(value || defaultValue)
    return rgbToHsv(rgb.r, rgb.g, rgb.b)
  })
  const [alpha, setAlpha] = useState(1)
  const pickerRef = useRef<HTMLDivElement>(null)
  const saturationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setCurrentColor(value)
      const rgb = hexToRgb(value)
      setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b))
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateColor = useCallback((newHsv: HSV) => {
    setHsv(newHsv)
    const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setCurrentColor(hex)

    let colorOutput = hex
    if (format === 'rgb') {
      colorOutput = showAlpha
        ? \`rgba(\${Math.round(rgb.r)}, \${Math.round(rgb.g)}, \${Math.round(rgb.b)}, \${alpha})\`
        : \`rgb(\${Math.round(rgb.r)}, \${Math.round(rgb.g)}, \${Math.round(rgb.b)})\`
    }
    onChange?.(colorOutput)
  }, [format, showAlpha, alpha, onChange])

  const handleSaturationChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    const s = (x / rect.width) * 100
    const v = 100 - (y / rect.height) * 100
    updateColor({ ...hsv, s, v })
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    updateColor({ ...hsv, h: Number(e.target.value) })
  }

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    setAlpha(Number(e.target.value))
  }

  const handlePresetClick = (color: string) => {
    if (disabled) return
    setCurrentColor(color)
    const rgb = hexToRgb(color)
    setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b))
    onChange?.(color)
  }

  const sizes = {
    sm: { trigger: 'w-8 h-8', picker: 'w-56' },
    md: { trigger: 'w-10 h-10', picker: 'w-64' },
    lg: { trigger: 'w-12 h-12', picker: 'w-72' }
  }

  const hueColor = hsvToRgb(hsv.h, 100, 100)
  const hueHex = rgbToHex(hueColor.r, hueColor.g, hueColor.b)

  return (
    <div ref={pickerRef} className={\`relative inline-block \${className}\`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={\`\${sizes[size].trigger} rounded-lg border-2 border-gray-300 shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed\`}
        style={{ backgroundColor: currentColor }}
        aria-label="Select color"
      />

      {isOpen && (
        <div className={\`absolute top-full left-0 mt-2 \${sizes[size].picker} bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50\`}>
          {/* Saturation/Value picker */}
          <div
            ref={saturationRef}
            className="w-full h-40 rounded-lg cursor-crosshair relative mb-4"
            style={{
              background: \`linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, \${hueHex})\`
            }}
            onMouseDown={handleSaturationChange}
            onMouseMove={(e) => e.buttons === 1 && handleSaturationChange(e)}
          >
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: \`\${hsv.s}%\`,
                top: \`\${100 - hsv.v}%\`,
                backgroundColor: currentColor
              }}
            />
          </div>

          {/* Hue slider */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="360"
              value={hsv.h}
              onChange={handleHueChange}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
            />
          </div>

          {/* Alpha slider */}
          {showAlpha && (
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={handleAlphaChange}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: \`linear-gradient(to right, transparent, \${currentColor})\`
                }}
              />
            </div>
          )}

          {/* Color input */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: currentColor, opacity: alpha }}
            />
            <input
              type="text"
              value={currentColor}
              onChange={(e) => {
                const val = e.target.value
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  setCurrentColor(val)
                  const rgb = hexToRgb(val)
                  setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b))
                  onChange?.(val)
                }
              }}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preset colors */}
          {presetColors.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {presetColors.map((color, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  aria-label={\`Select \${color}\`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact inline color picker
interface ColorSwatchProps {
  colors: string[]
  value?: string
  onChange?: (color: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColorSwatch({
  colors,
  value,
  onChange,
  size = 'md',
  className = ''
}: ColorSwatchProps) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  }

  return (
    <div className={\`flex flex-wrap gap-1.5 \${className}\`}>
      {colors.map((color, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(color)}
          className={\`\${sizes[size]} rounded-full border-2 transition-all hover:scale-110 \${
            value === color ? 'border-gray-800 ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'
          }\`}
          style={{ backgroundColor: color }}
          aria-label={\`Select \${color}\`}
          aria-pressed={value === color}
        />
      ))}
    </div>
  )
}

// Gradient picker
interface GradientPickerProps {
  value?: string
  onChange?: (gradient: string) => void
  presets?: string[]
  className?: string
}

export function GradientPicker({
  value,
  onChange,
  presets = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ],
  className = ''
}: GradientPickerProps) {
  return (
    <div className={\`grid grid-cols-3 gap-2 \${className}\`}>
      {presets.map((gradient, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(gradient)}
          className={\`h-16 rounded-lg border-2 transition-all hover:scale-105 \${
            value === gradient ? 'border-gray-800 ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'
          }\`}
          style={{ background: gradient }}
          aria-label={\`Select gradient \${i + 1}\`}
          aria-pressed={value === gradient}
        />
      ))}
    </div>
  )
}

// Eyedropper (where supported)
interface EyedropperButtonProps {
  onColor?: (color: string) => void
  className?: string
}

export function EyedropperButton({ onColor, className = '' }: EyedropperButtonProps) {
  const [supported] = useState(() => 'EyeDropper' in window)

  const handleClick = async () => {
    if (!supported) return
    try {
      // @ts-ignore - EyeDropper API
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()
      onColor?.(result.sRGBHex)
    } catch {
      // User cancelled
    }
  }

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={handleClick}
      className={\`p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors \${className}\`}
      aria-label="Pick color from screen"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  )
}
`
        }
      ]
    },
    ios: {
      framework: 'swiftui',
      minimumVersion: '15.0',
      dependencies: [],
      files: [
        {
          filename: 'ColorPicker.swift',
          code: `import SwiftUI

// MARK: - Color Picker
struct HubLabColorPicker: View {
    @Binding var selectedColor: Color
    var showAlpha: Bool = false
    var presetColors: [Color] = [.red, .orange, .yellow, .green, .blue, .purple, .pink, .black, .white]
    var onColorChange: ((Color) -> Void)?

    @State private var hue: Double = 0.5
    @State private var saturation: Double = 1.0
    @State private var brightness: Double = 1.0
    @State private var alpha: Double = 1.0
    @State private var showPicker = false

    var body: some View {
        VStack(spacing: 0) {
            // Color trigger button
            Button {
                showPicker.toggle()
            } label: {
                RoundedRectangle(cornerRadius: 8)
                    .fill(selectedColor)
                    .frame(width: 44, height: 44)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.gray.opacity(0.3), lineWidth: 2)
                    )
                    .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
            }
        }
        .sheet(isPresented: $showPicker) {
            NavigationStack {
                VStack(spacing: 20) {
                    // Native color picker
                    ColorPicker("Select Color", selection: $selectedColor, supportsOpacity: showAlpha)
                        .labelsHidden()
                        .scaleEffect(2)
                        .frame(height: 100)

                    // Preset colors
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Presets")
                            .font(.subheadline)
                            .foregroundColor(.secondary)

                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 5), spacing: 8) {
                            ForEach(presetColors.indices, id: \\.self) { index in
                                Button {
                                    selectedColor = presetColors[index]
                                    onColorChange?(presetColors[index])
                                } label: {
                                    Circle()
                                        .fill(presetColors[index])
                                        .frame(width: 44, height: 44)
                                        .overlay(
                                            Circle()
                                                .stroke(Color.primary.opacity(0.2), lineWidth: 1)
                                        )
                                }
                            }
                        }
                    }
                    .padding()

                    // Current color preview
                    HStack {
                        Text("Selected:")
                            .foregroundColor(.secondary)
                        Spacer()
                        RoundedRectangle(cornerRadius: 8)
                            .fill(selectedColor)
                            .frame(width: 60, height: 36)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                            )
                    }
                    .padding()

                    Spacer()
                }
                .padding()
                .navigationTitle("Color Picker")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Done") {
                            onColorChange?(selectedColor)
                            showPicker = false
                        }
                    }
                }
            }
            .presentationDetents([.medium, .large])
        }
        .onChange(of: selectedColor) { newColor in
            onColorChange?(newColor)
        }
    }
}

// MARK: - Color Swatch
struct ColorSwatch: View {
    var colors: [Color]
    @Binding var selectedColor: Color?
    var size: SwatchSize = .medium
    var columns: Int = 5

    enum SwatchSize {
        case small, medium, large

        var dimension: CGFloat {
            switch self {
            case .small: return 28
            case .medium: return 36
            case .large: return 44
            }
        }
    }

    var body: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: columns), spacing: 8) {
            ForEach(colors.indices, id: \\.self) { index in
                Button {
                    selectedColor = colors[index]
                } label: {
                    Circle()
                        .fill(colors[index])
                        .frame(width: size.dimension, height: size.dimension)
                        .overlay(
                            Circle()
                                .stroke(selectedColor == colors[index] ? Color.primary : Color.clear, lineWidth: 2)
                        )
                        .overlay(
                            Circle()
                                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                        )
                        .scaleEffect(selectedColor == colors[index] ? 1.1 : 1.0)
                        .animation(.easeInOut(duration: 0.15), value: selectedColor)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

// MARK: - Gradient Picker
struct GradientPicker: View {
    @Binding var selectedGradient: LinearGradient?
    var presets: [LinearGradient] = [
        LinearGradient(colors: [.purple, .blue], startPoint: .topLeading, endPoint: .bottomTrailing),
        LinearGradient(colors: [.pink, .orange], startPoint: .topLeading, endPoint: .bottomTrailing),
        LinearGradient(colors: [.cyan, .blue], startPoint: .topLeading, endPoint: .bottomTrailing),
        LinearGradient(colors: [.green, .mint], startPoint: .topLeading, endPoint: .bottomTrailing),
        LinearGradient(colors: [.red, .yellow], startPoint: .topLeading, endPoint: .bottomTrailing),
        LinearGradient(colors: [.teal, .pink.opacity(0.5)], startPoint: .topLeading, endPoint: .bottomTrailing)
    ]
    var columns: Int = 3

    var body: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: columns), spacing: 8) {
            ForEach(presets.indices, id: \\.self) { index in
                Button {
                    selectedGradient = presets[index]
                } label: {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(presets[index])
                        .frame(height: 60)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.primary.opacity(selectedGradient != nil ? 0.5 : 0), lineWidth: 2)
                        )
                }
                .buttonStyle(.plain)
            }
        }
    }
}

// MARK: - HSB Slider Picker
struct HSBColorPicker: View {
    @Binding var color: Color

    @State private var hue: Double = 0.5
    @State private var saturation: Double = 1.0
    @State private var brightness: Double = 1.0

    var body: some View {
        VStack(spacing: 16) {
            // Color preview
            RoundedRectangle(cornerRadius: 12)
                .fill(color)
                .frame(height: 80)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )

            // Hue slider
            VStack(alignment: .leading, spacing: 4) {
                Text("Hue")
                    .font(.caption)
                    .foregroundColor(.secondary)

                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(hue: 0, saturation: 1, brightness: 1),
                                Color(hue: 0.17, saturation: 1, brightness: 1),
                                Color(hue: 0.33, saturation: 1, brightness: 1),
                                Color(hue: 0.5, saturation: 1, brightness: 1),
                                Color(hue: 0.67, saturation: 1, brightness: 1),
                                Color(hue: 0.83, saturation: 1, brightness: 1),
                                Color(hue: 1, saturation: 1, brightness: 1)
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .cornerRadius(8)

                        Circle()
                            .fill(Color.white)
                            .frame(width: 24, height: 24)
                            .shadow(radius: 2)
                            .offset(x: CGFloat(hue) * (geometry.size.width - 24))
                            .gesture(
                                DragGesture()
                                    .onChanged { value in
                                        hue = min(max(0, value.location.x / geometry.size.width), 1)
                                        updateColor()
                                    }
                            )
                    }
                }
                .frame(height: 32)
            }

            // Saturation slider
            VStack(alignment: .leading, spacing: 4) {
                Text("Saturation")
                    .font(.caption)
                    .foregroundColor(.secondary)

                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(hue: hue, saturation: 0, brightness: brightness),
                                Color(hue: hue, saturation: 1, brightness: brightness)
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .cornerRadius(8)

                        Circle()
                            .fill(Color.white)
                            .frame(width: 24, height: 24)
                            .shadow(radius: 2)
                            .offset(x: CGFloat(saturation) * (geometry.size.width - 24))
                            .gesture(
                                DragGesture()
                                    .onChanged { value in
                                        saturation = min(max(0, value.location.x / geometry.size.width), 1)
                                        updateColor()
                                    }
                            )
                    }
                }
                .frame(height: 32)
            }

            // Brightness slider
            VStack(alignment: .leading, spacing: 4) {
                Text("Brightness")
                    .font(.caption)
                    .foregroundColor(.secondary)

                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(hue: hue, saturation: saturation, brightness: 0),
                                Color(hue: hue, saturation: saturation, brightness: 1)
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .cornerRadius(8)

                        Circle()
                            .fill(Color.white)
                            .frame(width: 24, height: 24)
                            .shadow(radius: 2)
                            .offset(x: CGFloat(brightness) * (geometry.size.width - 24))
                            .gesture(
                                DragGesture()
                                    .onChanged { value in
                                        brightness = min(max(0, value.location.x / geometry.size.width), 1)
                                        updateColor()
                                    }
                            )
                    }
                }
                .frame(height: 32)
            }
        }
        .padding()
        .onAppear {
            extractHSB()
        }
    }

    private func updateColor() {
        color = Color(hue: hue, saturation: saturation, brightness: brightness)
    }

    private func extractHSB() {
        let uiColor = UIColor(color)
        var h: CGFloat = 0, s: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        uiColor.getHue(&h, saturation: &s, brightness: &b, alpha: &a)
        hue = Double(h)
        saturation = Double(s)
        brightness = Double(b)
    }
}

// MARK: - Preview
struct ColorPicker_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 30) {
            HubLabColorPicker(selectedColor: .constant(.blue))

            ColorSwatch(
                colors: [.red, .orange, .yellow, .green, .blue, .purple],
                selectedColor: .constant(.blue)
            )

            HSBColorPicker(color: .constant(.blue))
        }
        .padding()
    }
}
`
        }
      ]
    },
    android: {
      framework: 'compose',
      minimumVersion: '24',
      dependencies: ['androidx.compose.ui:ui', 'androidx.compose.material3:material3'],
      files: [
        {
          filename: 'ColorPicker.kt',
          code: `package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import kotlin.math.max
import kotlin.math.min

// Color conversion utilities
private fun hsvToColor(hue: Float, saturation: Float, value: Float, alpha: Float = 1f): Color {
    val h = (hue % 360) / 60f
    val c = value * saturation
    val x = c * (1 - kotlin.math.abs(h % 2 - 1))
    val m = value - c

    val (r, g, b) = when {
        h < 1 -> Triple(c, x, 0f)
        h < 2 -> Triple(x, c, 0f)
        h < 3 -> Triple(0f, c, x)
        h < 4 -> Triple(0f, x, c)
        h < 5 -> Triple(x, 0f, c)
        else -> Triple(c, 0f, x)
    }

    return Color(r + m, g + m, b + m, alpha)
}

private fun colorToHsv(color: Color): Triple<Float, Float, Float> {
    val r = color.red
    val g = color.green
    val b = color.blue

    val max = maxOf(r, g, b)
    val min = minOf(r, g, b)
    val delta = max - min

    val h = when {
        delta == 0f -> 0f
        max == r -> 60f * (((g - b) / delta) % 6)
        max == g -> 60f * (((b - r) / delta) + 2)
        else -> 60f * (((r - g) / delta) + 4)
    }

    val s = if (max == 0f) 0f else delta / max
    val v = max

    return Triple(if (h < 0) h + 360 else h, s, v)
}

@Composable
fun ColorPicker(
    color: Color,
    onColorChange: (Color) -> Unit,
    modifier: Modifier = Modifier,
    showAlpha: Boolean = false,
    presetColors: List<Color> = listOf(
        Color.Red, Color(0xFFFF9800), Color.Yellow,
        Color.Green, Color.Blue, Color(0xFF9C27B0),
        Color(0xFFE91E63), Color.Black, Color.White
    )
) {
    var showDialog by remember { mutableStateOf(false) }
    var currentColor by remember { mutableStateOf(color) }
    val (hue, sat, value) = remember(color) { colorToHsv(color) }
    var hueState by remember { mutableFloatStateOf(hue) }
    var saturationState by remember { mutableFloatStateOf(sat) }
    var brightnessState by remember { mutableFloatStateOf(value) }
    var alphaState by remember { mutableFloatStateOf(color.alpha) }

    // Trigger button
    Box(
        modifier = modifier
            .size(44.dp)
            .shadow(2.dp, RoundedCornerShape(8.dp))
            .clip(RoundedCornerShape(8.dp))
            .background(currentColor)
            .border(2.dp, Color.Gray.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
            .clickable { showDialog = true }
    )

    if (showDialog) {
        Dialog(onDismissRequest = { showDialog = false }) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        "Select Color",
                        style = MaterialTheme.typography.titleLarge
                    )

                    // Saturation/Brightness picker
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.horizontalGradient(
                                    colors = listOf(Color.White, hsvToColor(hueState, 1f, 1f))
                                )
                            )
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(Color.Transparent, Color.Black)
                                )
                            )
                            .pointerInput(Unit) {
                                detectTapGestures { offset ->
                                    saturationState = (offset.x / size.width).coerceIn(0f, 1f)
                                    brightnessState = 1f - (offset.y / size.height).coerceIn(0f, 1f)
                                    currentColor = hsvToColor(hueState, saturationState, brightnessState, alphaState)
                                }
                            }
                            .pointerInput(Unit) {
                                detectDragGestures { change, _ ->
                                    saturationState = (change.position.x / size.width).coerceIn(0f, 1f)
                                    brightnessState = 1f - (change.position.y / size.height).coerceIn(0f, 1f)
                                    currentColor = hsvToColor(hueState, saturationState, brightnessState, alphaState)
                                }
                            }
                    ) {
                        // Position indicator
                        Box(
                            modifier = Modifier
                                .offset(
                                    x = (saturationState * 280).dp - 8.dp,
                                    y = ((1 - brightnessState) * 144).dp - 8.dp
                                )
                                .size(16.dp)
                                .border(2.dp, Color.White, CircleShape)
                                .background(currentColor, CircleShape)
                        )
                    }

                    // Hue slider
                    Column {
                        Text("Hue", style = MaterialTheme.typography.labelMedium)
                        Spacer(modifier = Modifier.height(4.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(24.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(
                                    Brush.horizontalGradient(
                                        colors = listOf(
                                            Color.Red, Color.Yellow, Color.Green,
                                            Color.Cyan, Color.Blue, Color.Magenta, Color.Red
                                        )
                                    )
                                )
                                .pointerInput(Unit) {
                                    detectTapGestures { offset ->
                                        hueState = (offset.x / size.width) * 360f
                                        currentColor = hsvToColor(hueState, saturationState, brightnessState, alphaState)
                                    }
                                }
                                .pointerInput(Unit) {
                                    detectDragGestures { change, _ ->
                                        hueState = (change.position.x / size.width).coerceIn(0f, 1f) * 360f
                                        currentColor = hsvToColor(hueState, saturationState, brightnessState, alphaState)
                                    }
                                }
                        )
                    }

                    // Alpha slider
                    if (showAlpha) {
                        Column {
                            Text("Opacity", style = MaterialTheme.typography.labelMedium)
                            Spacer(modifier = Modifier.height(4.dp))
                            Slider(
                                value = alphaState,
                                onValueChange = {
                                    alphaState = it
                                    currentColor = hsvToColor(hueState, saturationState, brightnessState, alphaState)
                                },
                                valueRange = 0f..1f
                            )
                        }
                    }

                    // Preset colors
                    Text("Presets", style = MaterialTheme.typography.labelMedium)
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(5),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.height(80.dp)
                    ) {
                        itemsIndexed(presetColors) { _, presetColor ->
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(presetColor)
                                    .border(
                                        width = if (currentColor == presetColor) 2.dp else 1.dp,
                                        color = if (currentColor == presetColor)
                                            MaterialTheme.colorScheme.primary
                                        else
                                            Color.Gray.copy(alpha = 0.3f),
                                        shape = CircleShape
                                    )
                                    .clickable {
                                        currentColor = presetColor
                                        val (h, s, v) = colorToHsv(presetColor)
                                        hueState = h
                                        saturationState = s
                                        brightnessState = v
                                    }
                            )
                        }
                    }

                    // Preview and actions
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(currentColor)
                                .border(1.dp, Color.Gray.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                        )

                        Spacer(modifier = Modifier.weight(1f))

                        TextButton(onClick = { showDialog = false }) {
                            Text("Cancel")
                        }

                        Button(onClick = {
                            onColorChange(currentColor)
                            showDialog = false
                        }) {
                            Text("Select")
                        }
                    }
                }
            }
        }
    }
}

// Color Swatch Grid
@Composable
fun ColorSwatch(
    colors: List<Color>,
    selectedColor: Color?,
    onColorSelected: (Color) -> Unit,
    modifier: Modifier = Modifier,
    columns: Int = 5,
    swatchSize: SwatchSize = SwatchSize.Medium
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(columns),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
    ) {
        itemsIndexed(colors) { _, color ->
            val isSelected = color == selectedColor
            Box(
                modifier = Modifier
                    .size(swatchSize.size)
                    .clip(CircleShape)
                    .background(color)
                    .border(
                        width = if (isSelected) 2.dp else 1.dp,
                        color = if (isSelected) Color.Black else Color.Gray.copy(alpha = 0.2f),
                        shape = CircleShape
                    )
                    .clickable { onColorSelected(color) }
            )
        }
    }
}

enum class SwatchSize(val size: androidx.compose.ui.unit.Dp) {
    Small(28.dp),
    Medium(36.dp),
    Large(44.dp)
}

// Gradient Picker
@Composable
fun GradientPicker(
    selectedIndex: Int?,
    onGradientSelected: (Int, Brush) -> Unit,
    modifier: Modifier = Modifier,
    presets: List<Brush> = listOf(
        Brush.linearGradient(listOf(Color(0xFF667eea), Color(0xFF764ba2))),
        Brush.linearGradient(listOf(Color(0xFFf093fb), Color(0xFFf5576c))),
        Brush.linearGradient(listOf(Color(0xFF4facfe), Color(0xFF00f2fe))),
        Brush.linearGradient(listOf(Color(0xFF43e97b), Color(0xFF38f9d7))),
        Brush.linearGradient(listOf(Color(0xFFfa709a), Color(0xFFfee140))),
        Brush.linearGradient(listOf(Color(0xFFa8edea), Color(0xFFfed6e3)))
    )
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(3),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
    ) {
        itemsIndexed(presets) { index, gradient ->
            val isSelected = index == selectedIndex
            Box(
                modifier = Modifier
                    .height(60.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(gradient)
                    .border(
                        width = if (isSelected) 2.dp else 0.dp,
                        color = if (isSelected) Color.Black else Color.Transparent,
                        shape = RoundedCornerShape(12.dp)
                    )
                    .clickable { onGradientSelected(index, gradient) }
            )
        }
    }
}
`
        }
      ]
    },
    desktop: {
      framework: 'tauri',
      dependencies: ['@tauri-apps/api'],
      files: [
        {
          filename: 'ColorPicker.tsx',
          code: `// Desktop implementation uses the same React components as web
// with Tauri-specific optimizations for native color dialogs
export { ColorPicker, ColorSwatch, GradientPicker, EyedropperButton } from './ColorPicker'
`
        }
      ]
    }
  },
  props: [
    { name: 'value', type: 'string', description: 'Current color value', default: '' },
    { name: 'defaultValue', type: 'string', description: 'Default color', default: '#3b82f6' },
    { name: 'onChange', type: '(color: string) => void', description: 'Callback when color changes' },
    { name: 'format', type: "'hex' | 'rgb' | 'hsl'", description: 'Color format', default: 'hex' },
    { name: 'showAlpha', type: 'boolean', description: 'Show alpha/opacity slider', default: false },
    { name: 'presetColors', type: 'string[]', description: 'Array of preset color values' },
    { name: 'disabled', type: 'boolean', description: 'Disable the picker', default: false },
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Trigger button size', default: 'md' }
  ],
  examples: [
    {
      title: 'Basic Color Picker',
      code: `<ColorPicker
  value={color}
  onChange={setColor}
/>`
    },
    {
      title: 'Color Swatch',
      code: `<ColorSwatch
  colors={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6']}
  value={selected}
  onChange={setSelected}
/>`
    },
    {
      title: 'Gradient Picker',
      code: `<GradientPicker
  value={gradient}
  onChange={setGradient}
/>`
    }
  ]
}
