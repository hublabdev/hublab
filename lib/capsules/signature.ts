import type { CapsuleDefinition } from './types'

export const SignatureCapsule: CapsuleDefinition = {
  id: 'signature',
  name: 'Signature',
  description: 'Digital signature pad for capturing handwritten signatures',
  category: 'input',
  tags: ['signature', 'draw', 'canvas', 'handwriting', 'document', 'form'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'Signature.tsx',
          code: `import React, { useRef, useState, useEffect, useCallback } from 'react'

interface SignaturePadProps {
  onSignature?: (dataUrl: string | null) => void
  onClear?: () => void
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  backgroundColor?: string
  disabled?: boolean
  placeholder?: string
  className?: string
}

interface Point {
  x: number
  y: number
  pressure: number
}

export function SignaturePad({
  onSignature,
  onClear,
  width = 400,
  height = 200,
  strokeColor = '#000000',
  strokeWidth = 2,
  backgroundColor = '#ffffff',
  disabled = false,
  placeholder = 'Sign here',
  className = ''
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set up canvas for high DPI displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    // Clear canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
  }, [width, height, backgroundColor])

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number, pressure = 0.5

    if ('touches' in e) {
      const touch = e.touches[0]
      clientX = touch.clientX
      clientY = touch.clientY
      // @ts-ignore - Force is available on some devices
      pressure = touch.force || 0.5
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure
    }
  }, [])

  const drawLine = useCallback((from: Point, to: Point) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth * (from.pressure + to.pressure) / 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [strokeColor, strokeWidth])

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()

    const point = getCoordinates(e)
    if (!point) return

    setIsDrawing(true)
    setPoints([point])
    setHasSignature(true)
  }, [disabled, getCoordinates])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return
    e.preventDefault()

    const point = getCoordinates(e)
    if (!point) return

    const lastPoint = points[points.length - 1]
    if (lastPoint) {
      drawLine(lastPoint, point)
    }
    setPoints([...points, point])
  }, [isDrawing, disabled, getCoordinates, points, drawLine])

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return

    setIsDrawing(false)
    setPoints([])

    // Export signature
    const canvas = canvasRef.current
    if (canvas && hasSignature) {
      onSignature?.(canvas.toDataURL('image/png'))
    }
  }, [isDrawing, hasSignature, onSignature])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    setHasSignature(false)
    onSignature?.(null)
    onClear?.()
  }, [backgroundColor, width, height, onSignature, onClear])

  const getSignatureAsDataUrl = useCallback((): string | null => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return null
    return canvas.toDataURL('image/png')
  }, [hasSignature])

  return (
    <div className={\`inline-block \${className}\`}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={\`border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair touch-none \${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }\`}
          style={{ backgroundColor }}
        />

        {/* Placeholder */}
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-lg">{placeholder}</span>
          </div>
        )}

        {/* Signature line */}
        <div
          className="absolute bottom-8 left-8 right-8 border-b border-gray-400"
          style={{ pointerEvents: 'none' }}
        />
        <span className="absolute bottom-2 left-8 text-xs text-gray-500">
          ✕
        </span>
      </div>

      {/* Controls */}
      <div className="flex justify-between mt-2">
        <button
          type="button"
          onClick={clearSignature}
          disabled={disabled || !hasSignature}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        {hasSignature && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Signed
          </span>
        )}
      </div>
    </div>
  )
}

// Compact signature for inline forms
interface SignatureFieldProps {
  value?: string | null
  onChange?: (dataUrl: string | null) => void
  label?: string
  required?: boolean
  error?: string
  className?: string
}

export function SignatureField({
  value,
  onChange,
  label,
  required = false,
  error,
  className = ''
}: SignatureFieldProps) {
  const [showPad, setShowPad] = useState(false)

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Signature"
            className="h-20 border border-gray-300 rounded-lg bg-white"
          />
          <button
            type="button"
            onClick={() => onChange?.(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPad(true)}
          className={\`w-full h-20 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-colors \${
            error
              ? 'border-red-300 text-red-500 hover:border-red-400'
              : 'border-gray-300 text-gray-500 hover:border-gray-400'
          }\`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Click to sign
        </button>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Modal */}
      {showPad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Your Signature</h3>

            <SignaturePad
              onSignature={(dataUrl) => {
                if (dataUrl) {
                  onChange?.(dataUrl)
                  setShowPad(false)
                }
              }}
              width={350}
              height={150}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowPad(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Initials pad for quick signatures
interface InitialsPadProps {
  onInitials?: (dataUrl: string) => void
  size?: number
  className?: string
}

export function InitialsPad({
  onInitials,
  size = 100,
  className = ''
}: InitialsPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = size + 'px'
    canvas.style.height = size + 'px'

    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, 0, size, size)
  }, [size])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const pos = getPos(e)
    if (pos) {
      setIsDrawing(true)
      setHasContent(true)
      lastPointRef.current = pos
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const pos = getPos(e)

    if (ctx && pos && lastPointRef.current) {
      ctx.beginPath()
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = '#1f2937'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
      lastPointRef.current = pos
    }
  }

  const endDraw = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    lastPointRef.current = null

    const canvas = canvasRef.current
    if (canvas && hasContent) {
      onInitials?.(canvas.toDataURL('image/png'))
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.fillStyle = '#f9fafb'
      ctx.fillRect(0, 0, size, size)
      setHasContent(false)
    }
  }

  return (
    <div className={\`inline-flex flex-col items-center gap-2 \${className}\`}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
        className="border-2 border-gray-300 rounded-full cursor-crosshair touch-none"
      />
      <button
        type="button"
        onClick={clear}
        disabled={!hasContent}
        className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        Clear
      </button>
    </div>
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
          filename: 'Signature.swift',
          code: `import SwiftUI
import PencilKit

// MARK: - Signature Pad
struct SignaturePad: View {
    @Binding var signature: UIImage?
    var strokeColor: Color = .black
    var strokeWidth: CGFloat = 3
    var backgroundColor: Color = Color(.systemBackground)
    var placeholder: String = "Sign here"
    var onSigned: ((UIImage?) -> Void)?

    @State private var lines: [[CGPoint]] = []
    @State private var currentLine: [CGPoint] = []

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                // Background
                RoundedRectangle(cornerRadius: 12)
                    .fill(backgroundColor)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [8]))
                            .foregroundColor(.gray.opacity(0.4))
                    )

                // Signature line
                VStack {
                    Spacer()
                    HStack {
                        Text("✕")
                            .font(.caption)
                            .foregroundColor(.gray)
                        Rectangle()
                            .fill(Color.gray.opacity(0.5))
                            .frame(height: 1)
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, 24)
                }

                // Placeholder
                if lines.isEmpty && currentLine.isEmpty {
                    Text(placeholder)
                        .foregroundColor(.gray)
                        .font(.title3)
                }

                // Canvas
                Canvas { context, size in
                    for line in lines {
                        var path = Path()
                        if let first = line.first {
                            path.move(to: first)
                            for point in line.dropFirst() {
                                path.addLine(to: point)
                            }
                        }
                        context.stroke(path, with: .color(strokeColor), style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round, lineJoin: .round))
                    }

                    if !currentLine.isEmpty {
                        var path = Path()
                        path.move(to: currentLine[0])
                        for point in currentLine.dropFirst() {
                            path.addLine(to: point)
                        }
                        context.stroke(path, with: .color(strokeColor), style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round, lineJoin: .round))
                    }
                }
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            currentLine.append(value.location)
                        }
                        .onEnded { _ in
                            lines.append(currentLine)
                            currentLine = []
                            exportSignature()
                        }
                )
            }
            .frame(height: 200)

            // Controls
            HStack {
                Button("Clear") {
                    lines = []
                    currentLine = []
                    signature = nil
                    onSigned?(nil)
                }
                .foregroundColor(.gray)
                .disabled(lines.isEmpty)

                Spacer()

                if !lines.isEmpty {
                    HStack(spacing: 4) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text("Signed")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                }
            }
        }
    }

    private func exportSignature() {
        let renderer = ImageRenderer(content:
            Canvas { context, size in
                context.fill(Path(CGRect(origin: .zero, size: size)), with: .color(.white))
                for line in lines {
                    var path = Path()
                    if let first = line.first {
                        path.move(to: first)
                        for point in line.dropFirst() {
                            path.addLine(to: point)
                        }
                    }
                    context.stroke(path, with: .color(strokeColor), style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round, lineJoin: .round))
                }
            }
            .frame(width: 400, height: 200)
        )

        if let uiImage = renderer.uiImage {
            signature = uiImage
            onSigned?(uiImage)
        }
    }
}

// MARK: - Signature Field
struct SignatureField: View {
    @Binding var signature: UIImage?
    var label: String?
    var required: Bool = false
    var errorMessage: String?

    @State private var showSignaturePad = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                HStack(spacing: 4) {
                    Text(label)
                        .font(.subheadline)
                        .foregroundColor(.primary)
                    if required {
                        Text("*")
                            .foregroundColor(.red)
                    }
                }
            }

            if let sig = signature {
                ZStack(alignment: .topTrailing) {
                    Image(uiImage: sig)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 80)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                        )

                    Button {
                        signature = nil
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.red)
                            .background(Circle().fill(Color.white))
                    }
                    .offset(x: 8, y: -8)
                }
            } else {
                Button {
                    showSignaturePad = true
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "pencil.line")
                        Text("Tap to sign")
                    }
                    .foregroundColor(errorMessage != nil ? .red : .gray)
                    .frame(maxWidth: .infinity)
                    .frame(height: 80)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [8]))
                            .foregroundColor(errorMessage != nil ? .red.opacity(0.5) : .gray.opacity(0.3))
                    )
                }
            }

            if let error = errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
        .sheet(isPresented: $showSignaturePad) {
            NavigationStack {
                VStack {
                    SignaturePad(signature: $signature)
                        .padding()

                    Spacer()
                }
                .navigationTitle("Add Signature")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") {
                            showSignaturePad = false
                        }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Done") {
                            showSignaturePad = false
                        }
                        .disabled(signature == nil)
                    }
                }
            }
            .presentationDetents([.medium])
        }
    }
}

// MARK: - PencilKit Signature (for Apple Pencil)
struct PencilKitSignature: UIViewRepresentable {
    @Binding var signature: UIImage?
    var strokeColor: UIColor = .black
    var strokeWidth: CGFloat = 3

    func makeUIView(context: Context) -> PKCanvasView {
        let canvas = PKCanvasView()
        canvas.delegate = context.coordinator
        canvas.drawingPolicy = .anyInput
        canvas.backgroundColor = .white
        canvas.tool = PKInkingTool(.pen, color: strokeColor, width: strokeWidth)
        return canvas
    }

    func updateUIView(_ uiView: PKCanvasView, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, PKCanvasViewDelegate {
        var parent: PencilKitSignature

        init(_ parent: PencilKitSignature) {
            self.parent = parent
        }

        func canvasViewDrawingDidChange(_ canvasView: PKCanvasView) {
            let image = canvasView.drawing.image(from: canvasView.bounds, scale: UIScreen.main.scale)
            parent.signature = image
        }
    }
}

// MARK: - Initials Pad
struct InitialsPad: View {
    @Binding var initials: UIImage?
    var size: CGFloat = 100

    @State private var lines: [[CGPoint]] = []
    @State private var currentLine: [CGPoint] = []

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(Color(.systemGray6))
                    .frame(width: size, height: size)
                    .overlay(
                        Circle()
                            .stroke(Color.gray.opacity(0.5), lineWidth: 2)
                    )

                Canvas { context, canvasSize in
                    for line in lines {
                        var path = Path()
                        if let first = line.first {
                            path.move(to: first)
                            for point in line.dropFirst() {
                                path.addLine(to: point)
                            }
                        }
                        context.stroke(path, with: .color(.primary), style: StrokeStyle(lineWidth: 2, lineCap: .round))
                    }

                    if !currentLine.isEmpty {
                        var path = Path()
                        path.move(to: currentLine[0])
                        for point in currentLine.dropFirst() {
                            path.addLine(to: point)
                        }
                        context.stroke(path, with: .color(.primary), style: StrokeStyle(lineWidth: 2, lineCap: .round))
                    }
                }
                .frame(width: size, height: size)
                .clipShape(Circle())
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            currentLine.append(value.location)
                        }
                        .onEnded { _ in
                            lines.append(currentLine)
                            currentLine = []
                        }
                )
            }

            Button("Clear") {
                lines = []
                currentLine = []
                initials = nil
            }
            .font(.caption)
            .foregroundColor(.gray)
            .disabled(lines.isEmpty)
        }
    }
}

// MARK: - Preview
struct Signature_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 30) {
            SignaturePad(signature: .constant(nil))
                .padding()

            SignatureField(
                signature: .constant(nil),
                label: "Signature",
                required: true
            )
            .padding()

            InitialsPad(initials: .constant(nil))
        }
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
          filename: 'Signature.kt',
          code: `package com.hublab.capsules

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Path
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

data class SignatureLine(
    val points: List<Offset>
)

@Composable
fun SignaturePad(
    modifier: Modifier = Modifier,
    onSignature: (Bitmap?) -> Unit = {},
    strokeColor: Color = Color.Black,
    strokeWidth: Dp = 3.dp,
    backgroundColor: Color = Color.White,
    placeholder: String = "Sign here"
) {
    var lines by remember { mutableStateOf(listOf<SignatureLine>()) }
    var currentLine by remember { mutableStateOf(listOf<Offset>()) }
    val hasSignature = lines.isNotEmpty()

    val strokeWidthPx = with(LocalDensity.current) { strokeWidth.toPx() }

    Column(modifier = modifier) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(backgroundColor)
                .border(
                    width = 2.dp,
                    color = Color.Gray.copy(alpha = 0.4f),
                    shape = RoundedCornerShape(12.dp)
                )
        ) {
            // Canvas for drawing
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .clipToBounds()
                    .pointerInput(Unit) {
                        detectDragGestures(
                            onDragStart = { offset ->
                                currentLine = listOf(offset)
                            },
                            onDrag = { change, _ ->
                                currentLine = currentLine + change.position
                            },
                            onDragEnd = {
                                if (currentLine.isNotEmpty()) {
                                    lines = lines + SignatureLine(currentLine)
                                    currentLine = emptyList()
                                }
                            }
                        )
                    }
            ) {
                // Draw completed lines
                lines.forEach { line ->
                    if (line.points.size > 1) {
                        val path = androidx.compose.ui.graphics.Path().apply {
                            moveTo(line.points.first().x, line.points.first().y)
                            line.points.drop(1).forEach { point ->
                                lineTo(point.x, point.y)
                            }
                        }
                        drawPath(
                            path = path,
                            color = strokeColor,
                            style = Stroke(
                                width = strokeWidthPx,
                                cap = StrokeCap.Round,
                                join = StrokeJoin.Round
                            )
                        )
                    }
                }

                // Draw current line
                if (currentLine.size > 1) {
                    val path = androidx.compose.ui.graphics.Path().apply {
                        moveTo(currentLine.first().x, currentLine.first().y)
                        currentLine.drop(1).forEach { point ->
                            lineTo(point.x, point.y)
                        }
                    }
                    drawPath(
                        path = path,
                        color = strokeColor,
                        style = Stroke(
                            width = strokeWidthPx,
                            cap = StrokeCap.Round,
                            join = StrokeJoin.Round
                        )
                    )
                }

                // Signature line
                val lineY = size.height - 48f
                drawLine(
                    color = Color.Gray.copy(alpha = 0.5f),
                    start = Offset(48f, lineY),
                    end = Offset(size.width - 48f, lineY),
                    strokeWidth = 1f
                )
            }

            // Placeholder
            if (!hasSignature && currentLine.isEmpty()) {
                Text(
                    text = placeholder,
                    color = Color.Gray,
                    modifier = Modifier.align(Alignment.Center)
                )
            }

            // X marker
            Text(
                text = "✕",
                color = Color.Gray,
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 24.dp, bottom = 8.dp)
            )
        }

        // Controls
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            TextButton(
                onClick = {
                    lines = emptyList()
                    currentLine = emptyList()
                    onSignature(null)
                },
                enabled = hasSignature
            ) {
                Text("Clear")
            }

            if (hasSignature) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = null,
                        tint = Color(0xFF22C55E),
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "Signed",
                        color = Color(0xFF22C55E),
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }
    }
}

@Composable
fun SignatureField(
    signature: Bitmap?,
    onSignatureChange: (Bitmap?) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    required: Boolean = false,
    errorMessage: String? = null
) {
    var showDialog by remember { mutableStateOf(false) }

    Column(modifier = modifier) {
        label?.let {
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodyMedium
                )
                if (required) {
                    Text(
                        text = "*",
                        color = Color.Red
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
        }

        if (signature != null) {
            Box {
                androidx.compose.foundation.Image(
                    bitmap = signature.asImageBitmap(),
                    contentDescription = "Signature",
                    modifier = Modifier
                        .height(80.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color.White)
                        .border(1.dp, Color.Gray.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                )

                IconButton(
                    onClick = { onSignatureChange(null) },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 8.dp, y = (-8).dp)
                        .size(24.dp)
                        .background(Color.Red, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Remove",
                        tint = Color.White,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        } else {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(80.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .border(
                        width = 2.dp,
                        color = if (errorMessage != null) Color.Red.copy(alpha = 0.5f)
                                else Color.Gray.copy(alpha = 0.3f),
                        shape = RoundedCornerShape(8.dp)
                    )
                    .clickable { showDialog = true },
                contentAlignment = Alignment.Center
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = null,
                        tint = if (errorMessage != null) Color.Red else Color.Gray
                    )
                    Text(
                        text = "Tap to sign",
                        color = if (errorMessage != null) Color.Red else Color.Gray
                    )
                }
            }
        }

        errorMessage?.let {
            Text(
                text = it,
                color = Color.Red,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }

    if (showDialog) {
        Dialog(onDismissRequest = { showDialog = false }) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Add Signature",
                        style = MaterialTheme.typography.titleLarge
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    SignaturePad(
                        onSignature = { bitmap ->
                            if (bitmap != null) {
                                onSignatureChange(bitmap)
                            }
                        }
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        TextButton(onClick = { showDialog = false }) {
                            Text("Cancel")
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(onClick = { showDialog = false }) {
                            Text("Done")
                        }
                    }
                }
            }
        }
    }
}

// Initials Pad
@Composable
fun InitialsPad(
    onInitials: (Bitmap?) -> Unit,
    modifier: Modifier = Modifier,
    size: Dp = 100.dp
) {
    var lines by remember { mutableStateOf(listOf<SignatureLine>()) }
    var currentLine by remember { mutableStateOf(listOf<Offset>()) }

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(size)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.surfaceVariant)
                .border(2.dp, Color.Gray.copy(alpha = 0.5f), CircleShape)
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .clipToBounds()
                    .pointerInput(Unit) {
                        detectDragGestures(
                            onDragStart = { offset ->
                                currentLine = listOf(offset)
                            },
                            onDrag = { change, _ ->
                                currentLine = currentLine + change.position
                            },
                            onDragEnd = {
                                if (currentLine.isNotEmpty()) {
                                    lines = lines + SignatureLine(currentLine)
                                    currentLine = emptyList()
                                }
                            }
                        )
                    }
            ) {
                lines.forEach { line ->
                    if (line.points.size > 1) {
                        val path = androidx.compose.ui.graphics.Path().apply {
                            moveTo(line.points.first().x, line.points.first().y)
                            line.points.drop(1).forEach { point ->
                                lineTo(point.x, point.y)
                            }
                        }
                        drawPath(
                            path = path,
                            color = Color.Black,
                            style = Stroke(width = 4f, cap = StrokeCap.Round)
                        )
                    }
                }

                if (currentLine.size > 1) {
                    val path = androidx.compose.ui.graphics.Path().apply {
                        moveTo(currentLine.first().x, currentLine.first().y)
                        currentLine.drop(1).forEach { point ->
                            lineTo(point.x, point.y)
                        }
                    }
                    drawPath(
                        path = path,
                        color = Color.Black,
                        style = Stroke(width = 4f, cap = StrokeCap.Round)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        TextButton(
            onClick = {
                lines = emptyList()
                currentLine = emptyList()
                onInitials(null)
            },
            enabled = lines.isNotEmpty()
        ) {
            Text("Clear", style = MaterialTheme.typography.bodySmall)
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
          filename: 'Signature.tsx',
          code: `// Desktop uses same React components with enhanced pressure sensitivity support
export { SignaturePad, SignatureField, InitialsPad } from './Signature'
`
        }
      ]
    }
  },
  props: [
    { name: 'onSignature', type: '(dataUrl: string | null) => void', description: 'Callback with signature data URL' },
    { name: 'onClear', type: '() => void', description: 'Callback when signature is cleared' },
    { name: 'width', type: 'number', description: 'Canvas width in pixels', default: 400 },
    { name: 'height', type: 'number', description: 'Canvas height in pixels', default: 200 },
    { name: 'strokeColor', type: 'string', description: 'Pen stroke color', default: '#000000' },
    { name: 'strokeWidth', type: 'number', description: 'Pen stroke width', default: 2 },
    { name: 'backgroundColor', type: 'string', description: 'Canvas background color', default: '#ffffff' },
    { name: 'disabled', type: 'boolean', description: 'Disable the signature pad', default: false },
    { name: 'placeholder', type: 'string', description: 'Placeholder text', default: 'Sign here' }
  ],
  examples: [
    {
      title: 'Basic Signature Pad',
      code: `<SignaturePad
  onSignature={(dataUrl) => setSignature(dataUrl)}
/>`
    },
    {
      title: 'Signature Field in Form',
      code: `<SignatureField
  value={signature}
  onChange={setSignature}
  label="Customer Signature"
  required
/>`
    },
    {
      title: 'Initials Pad',
      code: `<InitialsPad
  onInitials={setInitials}
  size={100}
/>`
    }
  ]
}
