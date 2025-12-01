import type { CapsuleDefinition } from './types'

export const QRCodeCapsule: CapsuleDefinition = {
  id: 'qrcode',
  name: 'QRCode',
  description: 'QR code generator and scanner with camera support',
  category: 'utility',
  tags: ['qrcode', 'barcode', 'scanner', 'camera', 'generator'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react', 'qrcode'],
      files: [
        {
          filename: 'QRCode.tsx',
          code: `import React, { useRef, useState, useEffect, useCallback } from 'react'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
  level?: 'L' | 'M' | 'Q' | 'H'
  includeMargin?: boolean
  logo?: string
  logoSize?: number
  className?: string
}

// Generate QR code using Canvas
export function QRCodeGenerator({
  value,
  size = 200,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'M',
  includeMargin = true,
  logo,
  logoSize = 50,
  className = ''
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrLoaded, setQrLoaded] = useState(false)

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return

      try {
        // @ts-ignore - QRCode from CDN
        const QRCodeLib = window.QRCode || await import('qrcode')

        await QRCodeLib.toCanvas(canvasRef.current, value, {
          width: size,
          margin: includeMargin ? 2 : 0,
          color: {
            dark: fgColor,
            light: bgColor
          },
          errorCorrectionLevel: level
        })

        // Add logo if provided
        if (logo) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (ctx) {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              const x = (size - logoSize) / 2
              const y = (size - logoSize) / 2

              // White background for logo
              ctx.fillStyle = bgColor
              ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

              ctx.drawImage(img, x, y, logoSize, logoSize)
            }
            img.src = logo
          }
        }

        setQrLoaded(true)
      } catch (error) {
        console.error('Failed to generate QR code:', error)
      }
    }

    generateQR()
  }, [value, size, bgColor, fgColor, level, includeMargin, logo, logoSize])

  const downloadQR = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  if (!value) {
    return (
      <div
        className={\`flex items-center justify-center bg-gray-100 rounded-lg \${className}\`}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-400 text-sm">No data</span>
      </div>
    )
  }

  return (
    <div className={\`inline-block \${className}\`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg"
        style={{ width: size, height: size }}
      />
      {qrLoaded && (
        <button
          onClick={downloadQR}
          className="mt-2 w-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
        >
          Download QR
        </button>
      )}
    </div>
  )
}

// Simple SVG-based QR display
interface QRCodeDisplayProps {
  value: string
  size?: number
  className?: string
}

export function QRCodeDisplay({ value, size = 200, className = '' }: QRCodeDisplayProps) {
  // Using Google Charts API for simplicity
  const qrUrl = \`https://chart.googleapis.com/chart?cht=qr&chs=\${size}x\${size}&chl=\${encodeURIComponent(value)}&choe=UTF-8\`

  return (
    <img
      src={qrUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={\`rounded-lg \${className}\`}
    />
  )
}

// QR Scanner using camera
interface QRScannerProps {
  onScan: (result: string) => void
  onError?: (error: Error) => void
  facingMode?: 'user' | 'environment'
  width?: number
  height?: number
  className?: string
}

export function QRScanner({
  onScan,
  onError,
  facingMode = 'environment',
  width = 300,
  height = 300,
  className = ''
}: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [lastResult, setLastResult] = useState<string | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setHasPermission(true)
          setIsScanning(true)
          scanFrame()
        }
      } catch (error) {
        console.error('Camera access denied:', error)
        setHasPermission(false)
        onError?.(error as Error)
      }
    }

    const scanFrame = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Check for QR code using jsQR (would need to be loaded)
        // @ts-ignore
        if (window.jsQR) {
          // @ts-ignore
          const code = window.jsQR(imageData.data, imageData.width, imageData.height)
          if (code && code.data !== lastResult) {
            setLastResult(code.data)
            onScan(code.data)
          }
        }
      }

      animationRef.current = requestAnimationFrame(scanFrame)
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [facingMode, onScan, onError])

  if (hasPermission === false) {
    return (
      <div
        className={\`flex flex-col items-center justify-center bg-gray-900 rounded-xl text-white \${className}\`}
        style={{ width, height }}
      >
        <svg className="w-12 h-12 mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <p className="text-sm">Camera access denied</p>
      </div>
    )
  }

  return (
    <div className={\`relative overflow-hidden rounded-xl \${className}\`} style={{ width, height }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanning overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white" />

        {/* Scan line animation */}
        <div className="absolute left-4 right-4 h-0.5 bg-green-500 animate-scan" />
      </div>

      {/* Status */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full">
          {isScanning ? 'Scanning...' : 'Starting camera...'}
        </span>
      </div>

      <style>{\`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      \`}</style>
    </div>
  )
}

// QR Code Card with info
interface QRCodeCardProps {
  value: string
  title?: string
  description?: string
  size?: number
  showValue?: boolean
  onCopy?: () => void
  className?: string
}

export function QRCodeCard({
  value,
  title,
  description,
  size = 180,
  showValue = true,
  onCopy,
  className = ''
}: QRCodeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }, [value, onCopy])

  return (
    <div className={\`bg-white rounded-xl shadow-lg p-6 text-center \${className}\`}>
      {title && <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

      <div className="flex justify-center mb-4">
        <QRCodeDisplay value={value} size={size} />
      </div>

      {showValue && (
        <div className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-lg">
          <span className="text-sm text-gray-600 truncate max-w-[200px]">{value}</span>
          <button
            onClick={handleCopy}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// Barcode generator
interface BarcodeProps {
  value: string
  format?: 'CODE128' | 'EAN13' | 'UPC' | 'CODE39'
  width?: number
  height?: number
  displayValue?: boolean
  className?: string
}

export function Barcode({
  value,
  format = 'CODE128',
  width = 2,
  height = 100,
  displayValue = true,
  className = ''
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const generateBarcode = async () => {
      if (!svgRef.current || !value) return

      try {
        // @ts-ignore - JsBarcode from CDN
        const JsBarcode = window.JsBarcode || (await import('jsbarcode')).default
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          margin: 10
        })
      } catch (error) {
        console.error('Failed to generate barcode:', error)
      }
    }

    generateBarcode()
  }, [value, format, width, height, displayValue])

  return <svg ref={svgRef} className={className} />
}
`
        }
      ]
    },
    ios: {
      framework: 'swiftui',
      minimumVersion: '15.0',
      dependencies: ['CoreImage', 'AVFoundation'],
      files: [
        {
          filename: 'QRCode.swift',
          code: `import SwiftUI
import CoreImage.CIFilterBuiltins
import AVFoundation

// MARK: - QR Code Generator
struct QRCodeGenerator: View {
    let value: String
    var size: CGFloat = 200
    var foregroundColor: Color = .black
    var backgroundColor: Color = .white
    var logo: Image?
    var logoSize: CGFloat = 50

    @State private var qrImage: UIImage?

    var body: some View {
        ZStack {
            if let image = qrImage {
                Image(uiImage: image)
                    .interpolation(.none)
                    .resizable()
                    .scaledToFit()
                    .frame(width: size, height: size)

                if let logo = logo {
                    logo
                        .resizable()
                        .scaledToFit()
                        .frame(width: logoSize, height: logoSize)
                        .background(backgroundColor)
                        .cornerRadius(8)
                }
            } else {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.2))
                    .frame(width: size, height: size)
                    .overlay(
                        ProgressView()
                    )
            }
        }
        .onAppear {
            generateQRCode()
        }
        .onChange(of: value) { _ in
            generateQRCode()
        }
    }

    private func generateQRCode() {
        let context = CIContext()
        let filter = CIFilter.qrCodeGenerator()

        guard let data = value.data(using: .utf8) else { return }
        filter.setValue(data, forKey: "inputMessage")
        filter.setValue("M", forKey: "inputCorrectionLevel")

        guard let outputImage = filter.outputImage else { return }

        // Scale up the QR code
        let scale = size / outputImage.extent.size.width
        let scaledImage = outputImage.transformed(by: CGAffineTransform(scaleX: scale, y: scale))

        // Apply colors
        let colorFilter = CIFilter.falseColor()
        colorFilter.inputImage = scaledImage
        colorFilter.color0 = CIColor(color: UIColor(foregroundColor))
        colorFilter.color1 = CIColor(color: UIColor(backgroundColor))

        guard let coloredImage = colorFilter.outputImage,
              let cgImage = context.createCGImage(coloredImage, from: coloredImage.extent) else { return }

        qrImage = UIImage(cgImage: cgImage)
    }
}

// MARK: - QR Code Scanner
struct QRCodeScanner: UIViewControllerRepresentable {
    var onScan: (String) -> Void
    var onError: ((Error) -> Void)?

    func makeUIViewController(context: Context) -> QRScannerViewController {
        let controller = QRScannerViewController()
        controller.delegate = context.coordinator
        return controller
    }

    func updateUIViewController(_ uiViewController: QRScannerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(onScan: onScan, onError: onError)
    }

    class Coordinator: NSObject, QRScannerDelegate {
        var onScan: (String) -> Void
        var onError: ((Error) -> Void)?

        init(onScan: @escaping (String) -> Void, onError: ((Error) -> Void)?) {
            self.onScan = onScan
            self.onError = onError
        }

        func didScan(code: String) {
            onScan(code)
        }

        func didFail(error: Error) {
            onError?(error)
        }
    }
}

protocol QRScannerDelegate: AnyObject {
    func didScan(code: String)
    func didFail(error: Error)
}

class QRScannerViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    weak var delegate: QRScannerDelegate?

    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private var lastScannedCode: String?

    override func viewDidLoad() {
        super.viewDidLoad()
        setupCamera()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        previewLayer?.frame = view.bounds
    }

    private func setupCamera() {
        captureSession = AVCaptureSession()

        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video),
              let videoInput = try? AVCaptureDeviceInput(device: videoCaptureDevice),
              let session = captureSession,
              session.canAddInput(videoInput) else {
            delegate?.didFail(error: NSError(domain: "QRScanner", code: 1, userInfo: [NSLocalizedDescriptionKey: "Camera not available"]))
            return
        }

        session.addInput(videoInput)

        let metadataOutput = AVCaptureMetadataOutput()

        if session.canAddOutput(metadataOutput) {
            session.addOutput(metadataOutput)
            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.qr, .ean8, .ean13, .pdf417, .code128]
        }

        previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer?.frame = view.bounds
        previewLayer?.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer!)

        // Add scanning overlay
        addScanningOverlay()

        DispatchQueue.global(qos: .background).async {
            session.startRunning()
        }
    }

    private func addScanningOverlay() {
        let overlay = UIView(frame: view.bounds)
        overlay.backgroundColor = .clear

        // Center scanning area
        let scanArea = CGRect(x: 50, y: (view.bounds.height - 250) / 2, width: view.bounds.width - 100, height: 250)

        let path = UIBezierPath(rect: overlay.bounds)
        let scanPath = UIBezierPath(rect: scanArea)
        path.append(scanPath.reversing())

        let maskLayer = CAShapeLayer()
        maskLayer.path = path.cgPath
        maskLayer.fillColor = UIColor.black.withAlphaComponent(0.5).cgColor

        overlay.layer.addSublayer(maskLayer)

        // Corner brackets
        let bracketColor = UIColor.white.cgColor
        let bracketWidth: CGFloat = 3
        let bracketLength: CGFloat = 30

        let corners: [(CGPoint, CGPoint, CGPoint)] = [
            (CGPoint(x: scanArea.minX, y: scanArea.minY + bracketLength), CGPoint(x: scanArea.minX, y: scanArea.minY), CGPoint(x: scanArea.minX + bracketLength, y: scanArea.minY)),
            (CGPoint(x: scanArea.maxX - bracketLength, y: scanArea.minY), CGPoint(x: scanArea.maxX, y: scanArea.minY), CGPoint(x: scanArea.maxX, y: scanArea.minY + bracketLength)),
            (CGPoint(x: scanArea.minX, y: scanArea.maxY - bracketLength), CGPoint(x: scanArea.minX, y: scanArea.maxY), CGPoint(x: scanArea.minX + bracketLength, y: scanArea.maxY)),
            (CGPoint(x: scanArea.maxX - bracketLength, y: scanArea.maxY), CGPoint(x: scanArea.maxX, y: scanArea.maxY), CGPoint(x: scanArea.maxX, y: scanArea.maxY - bracketLength))
        ]

        for (start, corner, end) in corners {
            let bracketPath = UIBezierPath()
            bracketPath.move(to: start)
            bracketPath.addLine(to: corner)
            bracketPath.addLine(to: end)

            let bracketLayer = CAShapeLayer()
            bracketLayer.path = bracketPath.cgPath
            bracketLayer.strokeColor = bracketColor
            bracketLayer.lineWidth = bracketWidth
            bracketLayer.fillColor = UIColor.clear.cgColor
            overlay.layer.addSublayer(bracketLayer)
        }

        view.addSubview(overlay)
    }

    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        guard let metadataObject = metadataObjects.first,
              let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject,
              let stringValue = readableObject.stringValue,
              stringValue != lastScannedCode else { return }

        lastScannedCode = stringValue
        AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
        delegate?.didScan(code: stringValue)
    }
}

// MARK: - QR Code Card
struct QRCodeCard: View {
    let value: String
    var title: String?
    var description: String?
    var size: CGFloat = 180

    @State private var showShareSheet = false
    @State private var copied = false

    var body: some View {
        VStack(spacing: 16) {
            if let title = title {
                Text(title)
                    .font(.headline)
            }

            if let description = description {
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            QRCodeGenerator(value: value, size: size)

            // Value with copy button
            HStack {
                Text(value)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
                    .truncationMode(.middle)

                Button {
                    UIPasteboard.general.string = value
                    copied = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                        copied = false
                    }
                } label: {
                    Image(systemName: copied ? "checkmark" : "doc.on.doc")
                        .foregroundColor(copied ? .green : .secondary)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            .cornerRadius(8)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 4)
    }
}

// MARK: - Scanner View (SwiftUI wrapper)
struct QRScannerView: View {
    @Binding var scannedCode: String?
    var onScan: ((String) -> Void)?
    @Environment(\\.dismiss) var dismiss

    var body: some View {
        ZStack {
            QRCodeScanner { code in
                scannedCode = code
                onScan?(code)
            }

            VStack {
                Spacer()

                Text("Point camera at QR code")
                    .foregroundColor(.white)
                    .padding()
                    .background(Color.black.opacity(0.6))
                    .cornerRadius(8)
                    .padding(.bottom, 50)
            }
        }
        .ignoresSafeArea()
    }
}

// MARK: - Preview
struct QRCode_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 30) {
            QRCodeGenerator(value: "https://hublab.dev")

            QRCodeCard(
                value: "https://hublab.dev",
                title: "Scan to visit",
                description: "HubLab Developer Portal"
            )
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
      dependencies: ['com.google.zxing:core', 'androidx.camera:camera-camera2'],
      files: [
        {
          filename: 'QRCode.kt',
          code: `package com.hublab.capsules

import android.Manifest
import android.graphics.Bitmap
import android.graphics.Color
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Done
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import kotlinx.coroutines.delay
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@Composable
fun QRCodeGenerator(
    value: String,
    modifier: Modifier = Modifier,
    size: Dp = 200.dp,
    foregroundColor: Int = Color.BLACK,
    backgroundColor: Int = Color.WHITE
) {
    val bitmap = remember(value, size, foregroundColor, backgroundColor) {
        generateQRCode(value, size.value.toInt(), foregroundColor, backgroundColor)
    }

    bitmap?.let { bmp ->
        Image(
            bitmap = bmp.asImageBitmap(),
            contentDescription = "QR Code",
            modifier = modifier
                .size(size)
                .clip(RoundedCornerShape(12.dp))
        )
    } ?: Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator()
    }
}

private fun generateQRCode(
    content: String,
    size: Int,
    foregroundColor: Int,
    backgroundColor: Int
): Bitmap? {
    return try {
        val hints = hashMapOf<EncodeHintType, Any>(
            EncodeHintType.MARGIN to 2,
            EncodeHintType.ERROR_CORRECTION to com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.M
        )

        val writer = QRCodeWriter()
        val bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, size, size, hints)

        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        for (x in 0 until size) {
            for (y in 0 until size) {
                bitmap.setPixel(x, y, if (bitMatrix[x, y]) foregroundColor else backgroundColor)
            }
        }
        bitmap
    } catch (e: Exception) {
        e.printStackTrace()
        null
    }
}

@Composable
fun QRCodeScanner(
    modifier: Modifier = Modifier,
    onScan: (String) -> Unit,
    onError: ((Exception) -> Unit)? = null
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    var hasCameraPermission by remember { mutableStateOf(false) }
    var lastScannedCode by remember { mutableStateOf<String?>(null) }

    val cameraExecutor: ExecutorService = remember { Executors.newSingleThreadExecutor() }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
    }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(Manifest.permission.CAMERA)
    }

    DisposableEffect(Unit) {
        onDispose {
            cameraExecutor.shutdown()
        }
    }

    if (!hasCameraPermission) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(androidx.compose.ui.graphics.Color.Black),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "Camera permission required",
                color = androidx.compose.ui.graphics.Color.White
            )
        }
        return
    }

    Box(modifier = modifier) {
        AndroidView(
            factory = { ctx ->
                PreviewView(ctx).apply {
                    implementationMode = PreviewView.ImplementationMode.COMPATIBLE

                    val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                    cameraProviderFuture.addListener({
                        val cameraProvider = cameraProviderFuture.get()

                        val preview = Preview.Builder().build().also {
                            it.setSurfaceProvider(surfaceProvider)
                        }

                        val imageAnalyzer = ImageAnalysis.Builder()
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build()
                            .also { analysis ->
                                analysis.setAnalyzer(cameraExecutor) { imageProxy ->
                                    // QR code analysis would go here using ML Kit or ZXing
                                    // For simplicity, this is a placeholder
                                    imageProxy.close()
                                }
                            }

                        try {
                            cameraProvider.unbindAll()
                            cameraProvider.bindToLifecycle(
                                lifecycleOwner,
                                CameraSelector.DEFAULT_BACK_CAMERA,
                                preview,
                                imageAnalyzer
                            )
                        } catch (e: Exception) {
                            onError?.invoke(e)
                        }
                    }, ContextCompat.getMainExecutor(ctx))
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Scanning overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(48.dp)
        ) {
            // Corner brackets
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .border(
                        width = 3.dp,
                        color = androidx.compose.ui.graphics.Color.White,
                        shape = RoundedCornerShape(16.dp)
                    )
            )
        }

        // Status text
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 32.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = androidx.compose.ui.graphics.Color.Black.copy(alpha = 0.6f)
            ) {
                Text(
                    "Point camera at QR code",
                    color = androidx.compose.ui.graphics.Color.White,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }
        }
    }
}

@Composable
fun QRCodeCard(
    value: String,
    modifier: Modifier = Modifier,
    title: String? = null,
    description: String? = null,
    size: Dp = 180.dp
) {
    var copied by remember { mutableStateOf(false) }
    val context = LocalContext.current

    LaunchedEffect(copied) {
        if (copied) {
            delay(2000)
            copied = false
        }
    }

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        shadowElevation = 4.dp
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            title?.let {
                Text(
                    it,
                    style = MaterialTheme.typography.titleMedium
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            description?.let {
                Text(
                    it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            QRCodeGenerator(
                value = value,
                size = size
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Value with copy button
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.surfaceVariant
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        value,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                        maxLines = 1,
                        modifier = Modifier.weight(1f)
                    )

                    IconButton(
                        onClick = {
                            val clipboard = context.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                            clipboard.setPrimaryClip(android.content.ClipData.newPlainText("QR Code", value))
                            copied = true
                        },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = if (copied) Icons.Default.Done else Icons.Default.ContentCopy,
                            contentDescription = "Copy",
                            tint = if (copied) androidx.compose.ui.graphics.Color.Green
                                   else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
}

// Barcode Generator
@Composable
fun BarcodeGenerator(
    value: String,
    modifier: Modifier = Modifier,
    format: BarcodeFormat = BarcodeFormat.CODE_128,
    width: Dp = 200.dp,
    height: Dp = 80.dp
) {
    val bitmap = remember(value, format) {
        try {
            val writer = com.google.zxing.MultiFormatWriter()
            val bitMatrix = writer.encode(value, format, width.value.toInt(), height.value.toInt())

            val bmp = Bitmap.createBitmap(bitMatrix.width, bitMatrix.height, Bitmap.Config.ARGB_8888)
            for (x in 0 until bitMatrix.width) {
                for (y in 0 until bitMatrix.height) {
                    bmp.setPixel(x, y, if (bitMatrix[x, y]) Color.BLACK else Color.WHITE)
                }
            }
            bmp
        } catch (e: Exception) {
            null
        }
    }

    bitmap?.let { bmp ->
        Image(
            bitmap = bmp.asImageBitmap(),
            contentDescription = "Barcode",
            modifier = modifier
                .width(width)
                .height(height)
        )
    }
}
`
        }
      ]
    },
    desktop: {
      framework: 'tauri',
      dependencies: ['@tauri-apps/api', 'qrcode'],
      files: [
        {
          filename: 'QRCode.tsx',
          code: `// Desktop uses the same React components
export { QRCodeGenerator, QRCodeDisplay, QRScanner, QRCodeCard, Barcode } from './QRCode'
`
        }
      ]
    }
  },
  props: [
    { name: 'value', type: 'string', description: 'Data to encode in QR code', required: true },
    { name: 'size', type: 'number', description: 'Size of QR code in pixels', default: 200 },
    { name: 'bgColor', type: 'string', description: 'Background color', default: '#ffffff' },
    { name: 'fgColor', type: 'string', description: 'Foreground color', default: '#000000' },
    { name: 'level', type: "'L' | 'M' | 'Q' | 'H'", description: 'Error correction level', default: 'M' },
    { name: 'logo', type: 'string', description: 'Logo URL to embed in center' },
    { name: 'onScan', type: '(result: string) => void', description: 'Callback when QR is scanned' }
  ],
  examples: [
    {
      title: 'QR Code Generator',
      code: `<QRCodeGenerator
  value="https://example.com"
  size={200}
  logo="/logo.png"
/>`
    },
    {
      title: 'QR Scanner',
      code: `<QRScanner
  onScan={(result) => console.log('Scanned:', result)}
  facingMode="environment"
/>`
    },
    {
      title: 'QR Code Card',
      code: `<QRCodeCard
  value="https://myapp.com/invite/abc123"
  title="Invite Link"
  description="Scan to join"
/>`
    }
  ]
}
