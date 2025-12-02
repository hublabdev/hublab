/**
 * Scanner Capsule - Document Scanner
 *
 * Camera-based document scanning with edge detection,
 * perspective correction, and image enhancement.
 */

import type { CapsuleDefinition } from './types'

export const ScannerCapsule: CapsuleDefinition = {
  id: 'scanner',
  name: 'Scanner',
  description: 'Document scanner with edge detection, perspective correction, and image enhancement',
  category: 'media',
  tags: ['scanner', 'document', 'camera', 'ocr', 'pdf'],
  version: '1.0.0',

  props: {
    mode: {
      type: 'string',
      default: 'document',
      description: 'Scanning mode: document, receipt, id-card, whiteboard',
    },
    autoCapture: {
      type: 'boolean',
      default: true,
      description: 'Automatically capture when document is detected',
    },
    showGuide: {
      type: 'boolean',
      default: true,
      description: 'Show scanning guide overlay',
    },
    multiPage: {
      type: 'boolean',
      default: false,
      description: 'Enable multi-page scanning',
    },
    maxPages: {
      type: 'number',
      default: 10,
      description: 'Maximum pages for multi-page scanning',
    },
    outputFormat: {
      type: 'string',
      default: 'jpeg',
      description: 'Output format: jpeg, png, pdf',
    },
    quality: {
      type: 'number',
      default: 0.9,
      description: 'Output image quality (0-1)',
    },
    colorMode: {
      type: 'string',
      default: 'color',
      description: 'Color mode: color, grayscale, blackwhite',
    },
    enhanceContrast: {
      type: 'boolean',
      default: true,
      description: 'Auto-enhance contrast for documents',
    },
    detectEdges: {
      type: 'boolean',
      default: true,
      description: 'Enable edge detection',
    },
    allowCrop: {
      type: 'boolean',
      default: true,
      description: 'Allow manual crop adjustment',
    },
    flashMode: {
      type: 'string',
      default: 'auto',
      description: 'Flash mode: auto, on, off, torch',
    },
    aspectRatio: {
      type: 'string',
      default: 'auto',
      description: 'Aspect ratio: auto, a4, letter, square, custom',
    },
    onCapture: {
      type: 'function',
      description: 'Callback when document is captured',
    },
    onComplete: {
      type: 'function',
      description: 'Callback when scanning is complete',
    },
    onError: {
      type: 'function',
      description: 'Callback when error occurs',
    },
  },

  platforms: {
    web: {
      dependencies: ['react', 'tailwindcss'],
      components: {
        // Full Document Scanner with camera
        DocumentScanner: `
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ScanResult {
  image: string;
  originalImage: string;
  corners: Point[];
  timestamp: number;
}

interface DocumentScannerProps {
  mode?: 'document' | 'receipt' | 'id-card' | 'whiteboard';
  autoCapture?: boolean;
  showGuide?: boolean;
  multiPage?: boolean;
  maxPages?: number;
  outputFormat?: 'jpeg' | 'png' | 'pdf';
  quality?: number;
  colorMode?: 'color' | 'grayscale' | 'blackwhite';
  enhanceContrast?: boolean;
  detectEdges?: boolean;
  flashMode?: 'auto' | 'on' | 'off' | 'torch';
  onCapture?: (result: ScanResult) => void;
  onComplete?: (results: ScanResult[]) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  mode = 'document',
  autoCapture = true,
  showGuide = true,
  multiPage = false,
  maxPages = 10,
  outputFormat = 'jpeg',
  quality = 0.9,
  colorMode = 'color',
  enhanceContrast = true,
  detectEdges = true,
  flashMode = 'auto',
  onCapture,
  onComplete,
  onError,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCorners, setDetectedCorners] = useState<Point[] | null>(null);
  const [scannedPages, setScannedPages] = useState<ScanResult[]>([]);
  const [flashOn, setFlashOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        setError(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Camera access denied');
      setError(error.message);
      onError?.(error);
    }
  }, [onError]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };

      if (capabilities.torch) {
        const newFlashState = !flashOn;
        await track.applyConstraints({
          advanced: [{ torch: newFlashState } as MediaTrackConstraintSet],
        });
        setFlashOn(newFlashState);
      }
    }
  }, [flashOn]);

  // Simple edge detection simulation
  const detectDocumentEdges = useCallback((imageData: ImageData): Point[] | null => {
    if (!detectEdges) return null;

    const { width, height } = imageData;

    // Simplified: return a rectangle with some padding
    // In production, use OpenCV.js or similar for real edge detection
    const padding = 0.1;
    return [
      { x: width * padding, y: height * padding },
      { x: width * (1 - padding), y: height * padding },
      { x: width * (1 - padding), y: height * (1 - padding) },
      { x: width * padding, y: height * (1 - padding) },
    ];
  }, [detectEdges]);

  // Apply perspective transform
  const applyPerspectiveTransform = useCallback((
    ctx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    corners: Point[],
    outputWidth: number,
    outputHeight: number
  ) => {
    // Simplified: In production, use proper perspective transform
    ctx.drawImage(sourceCanvas, 0, 0, outputWidth, outputHeight);
  }, []);

  // Apply image enhancements
  const enhanceImage = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Convert to grayscale if needed
      if (colorMode === 'grayscale' || colorMode === 'blackwhite') {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = g = b = gray;
      }

      // Apply contrast enhancement
      if (enhanceContrast) {
        const factor = 1.2;
        r = Math.min(255, Math.max(0, (r - 128) * factor + 128));
        g = Math.min(255, Math.max(0, (g - 128) * factor + 128));
        b = Math.min(255, Math.max(0, (b - 128) * factor + 128));
      }

      // Apply black/white threshold
      if (colorMode === 'blackwhite') {
        const threshold = 128;
        const value = r > threshold ? 255 : 0;
        r = g = b = value;
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [colorMode, enhanceContrast]);

  // Capture document
  const captureDocument = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame
      ctx.drawImage(video, 0, 0);

      // Get original image
      const originalImage = canvas.toDataURL(\`image/\${outputFormat}\`, quality);

      // Detect edges
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const corners = detectDocumentEdges(imageData);

      // Apply perspective transform if corners detected
      if (corners && corners.length === 4) {
        applyPerspectiveTransform(ctx, canvas, corners, canvas.width, canvas.height);
      }

      // Enhance image
      enhanceImage(ctx, canvas.width, canvas.height);

      // Get processed image
      const processedImage = canvas.toDataURL(\`image/\${outputFormat}\`, quality);

      const result: ScanResult = {
        image: processedImage,
        originalImage,
        corners: corners || [],
        timestamp: Date.now(),
      };

      // Handle multi-page or single capture
      if (multiPage) {
        const newPages = [...scannedPages, result];
        setScannedPages(newPages);
        onCapture?.(result);

        if (newPages.length >= maxPages) {
          onComplete?.(newPages);
        }
      } else {
        onCapture?.(result);
        onComplete?.([result]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Capture failed');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    outputFormat,
    quality,
    detectDocumentEdges,
    applyPerspectiveTransform,
    enhanceImage,
    multiPage,
    maxPages,
    scannedPages,
    onCapture,
    onComplete,
    onError,
  ]);

  // Draw overlay guide
  useEffect(() => {
    if (!overlayCanvasRef.current || !videoRef.current || !showGuide) return;

    const drawOverlay = () => {
      const canvas = overlayCanvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate guide rectangle based on mode
      let guideWidth, guideHeight;
      switch (mode) {
        case 'receipt':
          guideWidth = canvas.width * 0.6;
          guideHeight = canvas.height * 0.7;
          break;
        case 'id-card':
          guideWidth = canvas.width * 0.85;
          guideHeight = guideWidth * 0.63; // Standard ID card ratio
          break;
        case 'whiteboard':
          guideWidth = canvas.width * 0.9;
          guideHeight = canvas.height * 0.6;
          break;
        default: // document
          guideWidth = canvas.width * 0.85;
          guideHeight = guideWidth * 1.414; // A4 ratio
          if (guideHeight > canvas.height * 0.85) {
            guideHeight = canvas.height * 0.85;
            guideWidth = guideHeight / 1.414;
          }
      }

      const x = (canvas.width - guideWidth) / 2;
      const y = (canvas.height - guideHeight) / 2;

      // Clear guide area
      ctx.clearRect(x, y, guideWidth, guideHeight);

      // Draw guide border
      ctx.strokeStyle = detectedCorners ? '#22c55e' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(x, y, guideWidth, guideHeight);

      // Draw corner markers
      const cornerSize = 30;
      ctx.setLineDash([]);
      ctx.lineWidth = 4;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(x, y + cornerSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerSize, y);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(x + guideWidth - cornerSize, y);
      ctx.lineTo(x + guideWidth, y);
      ctx.lineTo(x + guideWidth, y + cornerSize);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x + guideWidth, y + guideHeight - cornerSize);
      ctx.lineTo(x + guideWidth, y + guideHeight);
      ctx.lineTo(x + guideWidth - cornerSize, y + guideHeight);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x + cornerSize, y + guideHeight);
      ctx.lineTo(x, y + guideHeight);
      ctx.lineTo(x, y + guideHeight - cornerSize);
      ctx.stroke();

      if (isActive) {
        requestAnimationFrame(drawOverlay);
      }
    };

    drawOverlay();
  }, [isActive, showGuide, mode, detectedCorners]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const getModeLabel = () => {
    switch (mode) {
      case 'receipt': return 'Receipt';
      case 'id-card': return 'ID Card';
      case 'whiteboard': return 'Whiteboard';
      default: return 'Document';
    }
  };

  return (
    <div className={\`relative bg-black rounded-lg overflow-hidden \${className}\`}>
      {/* Camera View */}
      <div className="relative aspect-[3/4] md:aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Overlay Canvas */}
        {showGuide && (
          <canvas
            ref={overlayCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        )}

        {/* Hidden processing canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Status Indicator */}
        {isActive && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
            <div className={\`w-2 h-2 rounded-full \${detectedCorners ? 'bg-green-500' : 'bg-blue-500'} animate-pulse\`} />
            <span className="text-white text-sm">
              {detectedCorners ? 'Document detected' : \`Scanning \${getModeLabel()}\`}
            </span>
          </div>
        )}

        {/* Multi-page counter */}
        {multiPage && scannedPages.length > 0 && (
          <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1.5 rounded-full">
            <span className="text-white text-sm font-medium">
              {scannedPages.length}/{maxPages} pages
            </span>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center p-6">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Start overlay */}
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <button
              onClick={startCamera}
              className="flex flex-col items-center gap-3 p-6 text-white hover:text-blue-400 transition-colors"
            >
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg font-medium">Start Scanner</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {isActive && (
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-6">
            {/* Flash toggle */}
            <button
              onClick={toggleFlash}
              className={\`p-3 rounded-full \${flashOn ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white'} transition-colors\`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            {/* Capture button */}
            <button
              onClick={captureDocument}
              disabled={isProcessing}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full border-4 border-gray-900" />
            </button>

            {/* Done button (multi-page) */}
            {multiPage && scannedPages.length > 0 && (
              <button
                onClick={() => onComplete?.(scannedPages)}
                className="p-3 rounded-full bg-green-500 text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
`,

        // Crop Editor for manual adjustment
        CropEditor: `
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface CropEditorProps {
  image: string;
  initialCorners?: Point[];
  aspectRatio?: 'auto' | 'a4' | 'letter' | 'square' | 'custom';
  onSave?: (croppedImage: string, corners: Point[]) => void;
  onCancel?: () => void;
  className?: string;
}

export const CropEditor: React.FC<CropEditorProps> = ({
  image,
  initialCorners,
  aspectRatio = 'auto',
  onSave,
  onCancel,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [corners, setCorners] = useState<Point[]>([]);
  const [activeCorner, setActiveCorner] = useState<number | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });

      // Calculate scale
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const scaleX = containerWidth / img.width;
        const scaleY = containerHeight / img.height;
        setScale(Math.min(scaleX, scaleY, 1));
      }

      // Set initial corners
      if (initialCorners && initialCorners.length === 4) {
        setCorners(initialCorners);
      } else {
        const padding = 0.1;
        setCorners([
          { x: img.width * padding, y: img.height * padding },
          { x: img.width * (1 - padding), y: img.height * padding },
          { x: img.width * (1 - padding), y: img.height * (1 - padding) },
          { x: img.width * padding, y: img.height * (1 - padding) },
        ]);
      }
    };
    img.src = image;
  }, [image, initialCorners]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || corners.length !== 4) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = imageSize.width * scale;
      canvas.height = imageSize.height * scale;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw crop area
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(corners[0].x * scale, corners[0].y * scale);
      ctx.lineTo(corners[1].x * scale, corners[1].y * scale);
      ctx.lineTo(corners[2].x * scale, corners[2].y * scale);
      ctx.lineTo(corners[3].x * scale, corners[3].y * scale);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw crop outline
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(corners[0].x * scale, corners[0].y * scale);
      corners.forEach((corner, i) => {
        const next = corners[(i + 1) % 4];
        ctx.lineTo(next.x * scale, next.y * scale);
      });
      ctx.stroke();

      // Draw corner handles
      corners.forEach((corner, i) => {
        ctx.fillStyle = activeCorner === i ? '#22c55e' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(corner.x * scale, corner.y * scale, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(corner.x * scale, corner.y * scale, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    img.src = image;
  }, [image, corners, imageSize, scale, activeCorner]);

  // Handle mouse/touch events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Find closest corner
    let closestIndex = -1;
    let closestDist = 30 / scale; // 30px threshold

    corners.forEach((corner, i) => {
      const dist = Math.hypot(corner.x - x, corner.y - y);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    if (closestIndex >= 0) {
      setActiveCorner(closestIndex);
      canvas.setPointerCapture(e.pointerId);
    }
  }, [corners, scale]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (activeCorner === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(imageSize.width, (e.clientX - rect.left) / scale));
    const y = Math.max(0, Math.min(imageSize.height, (e.clientY - rect.top) / scale));

    setCorners(prev => {
      const newCorners = [...prev];
      newCorners[activeCorner] = { x, y };
      return newCorners;
    });
  }, [activeCorner, imageSize, scale]);

  const handlePointerUp = useCallback(() => {
    setActiveCorner(null);
  }, []);

  // Apply crop
  const handleSave = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate bounding box
    const minX = Math.min(...corners.map(c => c.x));
    const maxX = Math.max(...corners.map(c => c.x));
    const minY = Math.min(...corners.map(c => c.y));
    const maxY = Math.max(...corners.map(c => c.y));

    canvas.width = maxX - minX;
    canvas.height = maxY - minY;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        minX, minY, canvas.width, canvas.height,
        0, 0, canvas.width, canvas.height
      );

      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      onSave?.(croppedImage, corners);
    };
    img.src = image;
  }, [corners, image, onSave]);

  return (
    <div className={\`flex flex-col bg-gray-900 rounded-lg overflow-hidden \${className}\`}>
      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 min-h-[300px]"
      >
        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 bg-gray-800 text-center">
        <p className="text-gray-400 text-sm">Drag corners to adjust crop area</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 p-4 bg-gray-800 border-t border-gray-700">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
};
`,

        // Scanned Pages Gallery
        ScannedPagesGallery: `
import React, { useState } from 'react';

interface ScanResult {
  image: string;
  timestamp: number;
}

interface ScannedPagesGalleryProps {
  pages: ScanResult[];
  onReorder?: (pages: ScanResult[]) => void;
  onDelete?: (index: number) => void;
  onSelect?: (index: number) => void;
  onExport?: (pages: ScanResult[], format: 'pdf' | 'images') => void;
  className?: string;
}

export const ScannedPagesGallery: React.FC<ScannedPagesGalleryProps> = ({
  pages,
  onReorder,
  onDelete,
  onSelect,
  onExport,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropIndex(index);
  };

  const handleDragEnd = () => {
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      const newPages = [...pages];
      const [removed] = newPages.splice(dragIndex, 1);
      newPages.splice(dropIndex, 0, removed);
      onReorder?.(newPages);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index === selectedIndex ? null : index);
    onSelect?.(index);
  };

  if (pages.length === 0) {
    return (
      <div className={\`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg \${className}\`}>
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500">No scanned pages yet</p>
      </div>
    );
  }

  return (
    <div className={\`bg-white rounded-lg border border-gray-200 overflow-hidden \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          Scanned Pages ({pages.length})
        </h3>

        {onExport && pages.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => onExport(pages, 'images')}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Export Images
            </button>
            <button
              onClick={() => onExport(pages, 'pdf')}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Export PDF
            </button>
          </div>
        )}
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4">
        {pages.map((page, index) => (
          <div
            key={page.timestamp}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => handleSelect(index)}
            className={\`
              relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer
              border-2 transition-all
              \${selectedIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'}
              \${dragIndex === index ? 'opacity-50' : ''}
              \${dropIndex === index && dragIndex !== null ? 'ring-2 ring-blue-400' : ''}
            \`}
          >
            <img
              src={page.image}
              alt={\`Page \${index + 1}\`}
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Page number */}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 rounded text-white text-xs font-medium">
              {index + 1}
            </div>

            {/* Delete button */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Selected Preview */}
      {selectedIndex !== null && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <img
              src={pages[selectedIndex].image}
              alt={\`Page \${selectedIndex + 1}\`}
              className="w-32 h-40 object-cover rounded-lg shadow"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Page {selectedIndex + 1}</h4>
              <p className="text-sm text-gray-500 mt-1">
                Scanned: {new Date(pages[selectedIndex].timestamp).toLocaleString()}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onDelete?.(selectedIndex)}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`,

        // Simple File Scanner (upload-based)
        FileScanner: `
import React, { useRef, useState, useCallback } from 'react';

interface FileScannerProps {
  accept?: string;
  maxSize?: number;
  colorMode?: 'color' | 'grayscale' | 'blackwhite';
  enhanceContrast?: boolean;
  outputFormat?: 'jpeg' | 'png';
  quality?: number;
  onScan?: (result: { image: string; file: File }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const FileScanner: React.FC<FileScannerProps> = ({
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  colorMode = 'color',
  enhanceContrast = true,
  outputFormat = 'jpeg',
  quality = 0.9,
  onScan,
  onError,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processImage = useCallback(async (file: File) => {
    if (file.size > maxSize) {
      onError?.(new Error(\`File too large. Maximum size is \${maxSize / 1024 / 1024}MB\`));
      return;
    }

    setIsProcessing(true);

    try {
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });

      // Create canvas for processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Apply enhancements
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Grayscale conversion
        if (colorMode === 'grayscale' || colorMode === 'blackwhite') {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = g = b = gray;
        }

        // Contrast enhancement
        if (enhanceContrast) {
          const factor = 1.2;
          r = Math.min(255, Math.max(0, (r - 128) * factor + 128));
          g = Math.min(255, Math.max(0, (g - 128) * factor + 128));
          b = Math.min(255, Math.max(0, (b - 128) * factor + 128));
        }

        // Black/white threshold
        if (colorMode === 'blackwhite') {
          const value = r > 128 ? 255 : 0;
          r = g = b = value;
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      ctx.putImageData(imageData, 0, 0);

      const processedImage = canvas.toDataURL(\`image/\${outputFormat}\`, quality);
      setPreview(processedImage);
      onScan?.({ image: processedImage, file });

      URL.revokeObjectURL(url);
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Processing failed'));
    } finally {
      setIsProcessing(false);
    }
  }, [maxSize, colorMode, enhanceContrast, outputFormat, quality, onScan, onError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={\`\${className}\`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Scanned document"
            className="w-full rounded-lg shadow-lg"
          />
          <button
            onClick={() => {
              setPreview(null);
              inputRef.current?.click();
            }}
            className="absolute top-4 right-4 px-4 py-2 bg-white/90 text-gray-900 rounded-lg shadow hover:bg-white"
          >
            Scan Another
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={\`
            relative flex flex-col items-center justify-center p-12
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            \${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }
          \`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-gray-600">Processing...</span>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">
                Drop image here or click to upload
              </p>
              <p className="text-gray-400 text-sm mt-1">
                JPG, PNG, or HEIC up to {maxSize / 1024 / 1024}MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI', 'VisionKit', 'Vision', 'PDFKit'],
      minimumVersion: '15.0',
      components: {
        // Native Document Scanner
        DocumentScannerView: `
import SwiftUI
import VisionKit
import PDFKit

// MARK: - Document Scanner View
struct DocumentScannerView: UIViewControllerRepresentable {
    var mode: ScanMode = .document
    var colorMode: ColorMode = .color
    var multiPage: Bool = true
    var onScan: ([ScannedPage]) -> Void
    var onCancel: () -> Void
    var onError: (Error) -> Void

    enum ScanMode {
        case document
        case receipt
        case idCard
        case whiteboard
    }

    enum ColorMode {
        case color
        case grayscale
        case blackWhite
    }

    struct ScannedPage {
        let image: UIImage
        let enhancedImage: UIImage?
        let timestamp: Date
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> VNDocumentCameraViewController {
        let scanner = VNDocumentCameraViewController()
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: VNDocumentCameraViewController, context: Context) {}

    class Coordinator: NSObject, VNDocumentCameraViewControllerDelegate {
        let parent: DocumentScannerView

        init(_ parent: DocumentScannerView) {
            self.parent = parent
        }

        func documentCameraViewController(
            _ controller: VNDocumentCameraViewController,
            didFinishWith scan: VNDocumentCameraScan
        ) {
            var pages: [ScannedPage] = []

            for index in 0..<scan.pageCount {
                let image = scan.imageOfPage(at: index)
                let enhancedImage = processImage(image)

                pages.append(ScannedPage(
                    image: image,
                    enhancedImage: enhancedImage,
                    timestamp: Date()
                ))
            }

            parent.onScan(pages)
            controller.dismiss(animated: true)
        }

        func documentCameraViewControllerDidCancel(
            _ controller: VNDocumentCameraViewController
        ) {
            parent.onCancel()
            controller.dismiss(animated: true)
        }

        func documentCameraViewController(
            _ controller: VNDocumentCameraViewController,
            didFailWithError error: Error
        ) {
            parent.onError(error)
            controller.dismiss(animated: true)
        }

        private func processImage(_ image: UIImage) -> UIImage? {
            guard let ciImage = CIImage(image: image) else { return nil }
            let context = CIContext()
            var outputImage = ciImage

            switch parent.colorMode {
            case .grayscale:
                if let filter = CIFilter(name: "CIPhotoEffectNoir") {
                    filter.setValue(outputImage, forKey: kCIInputImageKey)
                    if let result = filter.outputImage {
                        outputImage = result
                    }
                }
            case .blackWhite:
                if let filter = CIFilter(name: "CIColorMonochrome") {
                    filter.setValue(outputImage, forKey: kCIInputImageKey)
                    filter.setValue(CIColor.white, forKey: kCIInputColorKey)
                    filter.setValue(1.0, forKey: kCIInputIntensityKey)
                    if let result = filter.outputImage {
                        outputImage = result
                    }
                }
            case .color:
                // Enhance document
                if let filter = CIFilter(name: "CIDocumentEnhancer") {
                    filter.setValue(outputImage, forKey: kCIInputImageKey)
                    if let result = filter.outputImage {
                        outputImage = result
                    }
                }
            }

            if let cgImage = context.createCGImage(outputImage, from: outputImage.extent) {
                return UIImage(cgImage: cgImage)
            }
            return nil
        }
    }
}

// MARK: - Scanner Button View
struct ScannerButtonView: View {
    @State private var showScanner = false
    @State private var scannedPages: [DocumentScannerView.ScannedPage] = []
    var onComplete: ([UIImage]) -> Void

    var body: some View {
        VStack(spacing: 16) {
            if scannedPages.isEmpty {
                Button(action: { showScanner = true }) {
                    VStack(spacing: 12) {
                        Image(systemName: "doc.viewfinder")
                            .font(.system(size: 48))
                            .foregroundColor(.blue)

                        Text("Scan Document")
                            .font(.headline)

                        Text("Use your camera to scan documents")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 40)
                    .background(Color(.systemGray6))
                    .cornerRadius(16)
                }
            } else {
                // Show scanned pages
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(Array(scannedPages.enumerated()), id: \\.offset) { index, page in
                            ScannedPageThumbnail(
                                image: page.enhancedImage ?? page.image,
                                pageNumber: index + 1,
                                onDelete: {
                                    scannedPages.remove(at: index)
                                }
                            )
                        }

                        // Add more button
                        Button(action: { showScanner = true }) {
                            VStack {
                                Image(systemName: "plus")
                                    .font(.title)
                                Text("Add Page")
                                    .font(.caption)
                            }
                            .frame(width: 100, height: 130)
                            .background(Color(.systemGray6))
                            .cornerRadius(12)
                        }
                    }
                    .padding(.horizontal)
                }

                // Complete button
                Button(action: {
                    let images = scannedPages.map { $0.enhancedImage ?? $0.image }
                    onComplete(images)
                }) {
                    Text("Done (\\(scannedPages.count) pages)")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(12)
                }
                .padding(.horizontal)
            }
        }
        .sheet(isPresented: $showScanner) {
            DocumentScannerView(
                onScan: { pages in
                    scannedPages.append(contentsOf: pages)
                },
                onCancel: {},
                onError: { error in
                    print("Scan error: \\(error)")
                }
            )
        }
    }
}

// MARK: - Scanned Page Thumbnail
struct ScannedPageThumbnail: View {
    let image: UIImage
    let pageNumber: Int
    let onDelete: () -> Void

    var body: some View {
        ZStack(alignment: .topTrailing) {
            VStack(spacing: 4) {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 100, height: 130)
                    .clipped()
                    .cornerRadius(8)

                Text("Page \\(pageNumber)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Button(action: onDelete) {
                Image(systemName: "xmark.circle.fill")
                    .foregroundColor(.red)
                    .background(Color.white)
                    .clipShape(Circle())
            }
            .offset(x: 8, y: -8)
        }
    }
}

// MARK: - PDF Export
extension Array where Element == UIImage {
    func toPDF() -> Data? {
        let pdfDocument = PDFDocument()

        for (index, image) in self.enumerated() {
            guard let pdfPage = PDFPage(image: image) else { continue }
            pdfDocument.insert(pdfPage, at: index)
        }

        return pdfDocument.dataRepresentation()
    }
}

// MARK: - Usage Example
struct ScannerExampleView: View {
    @State private var scannedImages: [UIImage] = []
    @State private var pdfData: Data?

    var body: some View {
        NavigationView {
            VStack {
                ScannerButtonView { images in
                    scannedImages = images
                    pdfData = images.toPDF()
                }

                if let data = pdfData {
                    ShareLink(item: data, preview: SharePreview("Scanned Document.pdf"))
                        .padding()
                }
            }
            .navigationTitle("Document Scanner")
        }
    }
}
`,
      },
    },

    android: {
      dependencies: [
        'androidx.compose.ui:ui',
        'androidx.compose.material3:material3',
        'androidx.camera:camera-core:1.3.0',
        'androidx.camera:camera-camera2:1.3.0',
        'androidx.camera:camera-view:1.3.0',
        'com.google.mlkit:document-scanner:16.0.0-beta1',
      ],
      minimumSdk: 24,
      components: {
        // Compose Document Scanner
        DocumentScanner: `
package com.hublab.capsules.scanner

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.google.mlkit.vision.documentscanner.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream

// Data classes
data class ScannedPage(
    val uri: Uri,
    val bitmap: Bitmap?,
    val timestamp: Long = System.currentTimeMillis()
)

sealed class ScannerState {
    object Idle : ScannerState()
    object Scanning : ScannerState()
    object Processing : ScannerState()
    data class Success(val pages: List<ScannedPage>) : ScannerState()
    data class Error(val message: String) : ScannerState()
}

// Main Scanner Composable
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DocumentScanner(
    modifier: Modifier = Modifier,
    scanMode: ScanMode = ScanMode.FULL,
    multiPage: Boolean = true,
    maxPages: Int = 10,
    colorMode: ColorMode = ColorMode.COLOR,
    onScanComplete: (List<ScannedPage>) -> Unit,
    onError: (String) -> Unit = {}
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var state by remember { mutableStateOf<ScannerState>(ScannerState.Idle) }
    var scannedPages by remember { mutableStateOf<List<ScannedPage>>(emptyList()) }

    // Configure ML Kit document scanner
    val options = remember {
        GmsDocumentScannerOptions.Builder()
            .setGalleryImportAllowed(true)
            .setPageLimit(maxPages)
            .setResultFormats(
                GmsDocumentScannerOptions.RESULT_FORMAT_JPEG,
                GmsDocumentScannerOptions.RESULT_FORMAT_PDF
            )
            .setScannerMode(
                when (scanMode) {
                    ScanMode.FULL -> GmsDocumentScannerOptions.SCANNER_MODE_FULL
                    ScanMode.BASE -> GmsDocumentScannerOptions.SCANNER_MODE_BASE
                    ScanMode.BASE_WITH_FILTER -> GmsDocumentScannerOptions.SCANNER_MODE_BASE_WITH_FILTER
                }
            )
            .build()
    }

    val scanner = remember { GmsDocumentScanning.getClient(options) }

    // Activity result launcher
    val scannerLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartIntentSenderForResult()
    ) { result ->
        if (result.resultCode == android.app.Activity.RESULT_OK) {
            scope.launch {
                state = ScannerState.Processing

                val scanResult = GmsDocumentScanningResult.fromActivityResultIntent(result.data)
                val pages = mutableListOf<ScannedPage>()

                scanResult?.pages?.forEach { page ->
                    val bitmap = withContext(Dispatchers.IO) {
                        loadBitmapFromUri(context, page.imageUri)?.let { bmp ->
                            processImage(bmp, colorMode)
                        }
                    }
                    pages.add(ScannedPage(page.imageUri, bitmap))
                }

                scannedPages = pages
                state = ScannerState.Success(pages)
                onScanComplete(pages)
            }
        } else {
            state = ScannerState.Idle
        }
    }

    // Start scanning
    fun startScanning() {
        state = ScannerState.Scanning
        scanner.getStartScanIntent(context as android.app.Activity)
            .addOnSuccessListener { intentSender ->
                scannerLauncher.launch(
                    IntentSenderRequest.Builder(intentSender).build()
                )
            }
            .addOnFailureListener { e ->
                state = ScannerState.Error(e.message ?: "Scan failed")
                onError(e.message ?: "Scan failed")
            }
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        when (val currentState = state) {
            is ScannerState.Idle -> {
                ScannerIdleView(
                    onStartScan = { startScanning() }
                )
            }

            is ScannerState.Scanning, is ScannerState.Processing -> {
                CircularProgressIndicator(
                    modifier = Modifier.size(48.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = if (currentState is ScannerState.Processing)
                        "Processing..." else "Scanning...",
                    style = MaterialTheme.typography.bodyLarge
                )
            }

            is ScannerState.Success -> {
                ScannedPagesView(
                    pages = scannedPages,
                    onAddMore = { startScanning() },
                    onDelete = { index ->
                        scannedPages = scannedPages.toMutableList().apply {
                            removeAt(index)
                        }
                    },
                    onExport = { format ->
                        // Handle export
                    }
                )
            }

            is ScannerState.Error -> {
                Icon(
                    imageVector = Icons.Default.Error,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = MaterialTheme.colorScheme.error
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = currentState.message,
                    color = MaterialTheme.colorScheme.error
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(onClick = { state = ScannerState.Idle }) {
                    Text("Try Again")
                }
            }
        }
    }
}

@Composable
private fun ScannerIdleView(
    onStartScan: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .clickable { onStartScan() }
            .padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.DocumentScanner,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Scan Document",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Use your camera to scan documents",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun ScannedPagesView(
    pages: List<ScannedPage>,
    onAddMore: () -> Unit,
    onDelete: (Int) -> Unit,
    onExport: (ExportFormat) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // Pages row
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(horizontal = 4.dp)
        ) {
            itemsIndexed(pages) { index, page ->
                ScannedPageThumbnail(
                    page = page,
                    pageNumber = index + 1,
                    onDelete = { onDelete(index) }
                )
            }

            item {
                // Add more button
                Box(
                    modifier = Modifier
                        .size(100.dp, 130.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .clickable { onAddMore() },
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add page"
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Add",
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Export buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = { onExport(ExportFormat.IMAGES) },
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    imageVector = Icons.Default.Image,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Images")
            }

            Button(
                onClick = { onExport(ExportFormat.PDF) },
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    imageVector = Icons.Default.PictureAsPdf,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("PDF")
            }
        }
    }
}

@Composable
private fun ScannedPageThumbnail(
    page: ScannedPage,
    pageNumber: Int,
    onDelete: () -> Unit
) {
    Box {
        Column {
            page.bitmap?.let { bitmap ->
                Image(
                    bitmap = bitmap.asImageBitmap(),
                    contentDescription = "Page $pageNumber",
                    modifier = Modifier
                        .size(100.dp, 130.dp)
                        .clip(RoundedCornerShape(8.dp)),
                    contentScale = ContentScale.Crop
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Page $pageNumber",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Delete button
        IconButton(
            onClick = onDelete,
            modifier = Modifier
                .align(Alignment.TopEnd)
                .offset(x = 8.dp, y = (-8).dp)
                .size(24.dp)
                .background(MaterialTheme.colorScheme.error, CircleShape)
        ) {
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Delete",
                tint = Color.White,
                modifier = Modifier.size(14.dp)
            )
        }
    }
}

// Enums
enum class ScanMode {
    FULL, BASE, BASE_WITH_FILTER
}

enum class ColorMode {
    COLOR, GRAYSCALE, BLACK_WHITE
}

enum class ExportFormat {
    PDF, IMAGES
}

// Helper functions
private fun loadBitmapFromUri(context: Context, uri: Uri): Bitmap? {
    return try {
        context.contentResolver.openInputStream(uri)?.use { stream ->
            BitmapFactory.decodeStream(stream)
        }
    } catch (e: Exception) {
        null
    }
}

private fun processImage(bitmap: Bitmap, colorMode: ColorMode): Bitmap {
    return when (colorMode) {
        ColorMode.GRAYSCALE -> {
            val width = bitmap.width
            val height = bitmap.height
            val result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

            for (x in 0 until width) {
                for (y in 0 until height) {
                    val pixel = bitmap.getPixel(x, y)
                    val r = android.graphics.Color.red(pixel)
                    val g = android.graphics.Color.green(pixel)
                    val b = android.graphics.Color.blue(pixel)
                    val gray = (0.299 * r + 0.587 * g + 0.114 * b).toInt()
                    result.setPixel(x, y, android.graphics.Color.rgb(gray, gray, gray))
                }
            }
            result
        }
        ColorMode.BLACK_WHITE -> {
            val width = bitmap.width
            val height = bitmap.height
            val result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

            for (x in 0 until width) {
                for (y in 0 until height) {
                    val pixel = bitmap.getPixel(x, y)
                    val r = android.graphics.Color.red(pixel)
                    val g = android.graphics.Color.green(pixel)
                    val b = android.graphics.Color.blue(pixel)
                    val gray = (0.299 * r + 0.587 * g + 0.114 * b).toInt()
                    val bw = if (gray > 128) 255 else 0
                    result.setPixel(x, y, android.graphics.Color.rgb(bw, bw, bw))
                }
            }
            result
        }
        ColorMode.COLOR -> bitmap
    }
}

// PDF Export helper
fun exportToPdf(context: Context, pages: List<ScannedPage>, filename: String): File? {
    return try {
        val document = android.graphics.pdf.PdfDocument()

        pages.forEachIndexed { index, page ->
            page.bitmap?.let { bitmap ->
                val pageInfo = android.graphics.pdf.PdfDocument.PageInfo.Builder(
                    bitmap.width, bitmap.height, index + 1
                ).create()

                val pdfPage = document.startPage(pageInfo)
                pdfPage.canvas.drawBitmap(bitmap, 0f, 0f, null)
                document.finishPage(pdfPage)
            }
        }

        val file = File(context.cacheDir, "$filename.pdf")
        FileOutputStream(file).use { out ->
            document.writeTo(out)
        }
        document.close()

        file
    } catch (e: Exception) {
        null
    }
}
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss'],
      components: {
        // Desktop Scanner using file import
        DesktopScanner: `
import React, { useState, useCallback } from 'react';

interface ScannedDocument {
  id: string;
  name: string;
  path: string;
  thumbnail: string;
  processedImage: string;
  timestamp: number;
}

interface DesktopScannerProps {
  colorMode?: 'color' | 'grayscale' | 'blackwhite';
  enhanceContrast?: boolean;
  outputFormat?: 'jpeg' | 'png' | 'pdf';
  quality?: number;
  onScan?: (documents: ScannedDocument[]) => void;
  onExport?: (documents: ScannedDocument[], format: string) => void;
  className?: string;
}

declare global {
  interface Window {
    __TAURI__?: {
      dialog: {
        open: (options: { multiple?: boolean; filters?: Array<{ name: string; extensions: string[] }> }) => Promise<string | string[] | null>;
        save: (options: { filters?: Array<{ name: string; extensions: string[] }> }) => Promise<string | null>;
      };
      fs: {
        readBinaryFile: (path: string) => Promise<Uint8Array>;
        writeBinaryFile: (path: string, contents: Uint8Array) => Promise<void>;
      };
      path: {
        basename: (path: string) => Promise<string>;
      };
    };
  }
}

export const DesktopScanner: React.FC<DesktopScannerProps> = ({
  colorMode = 'color',
  enhanceContrast = true,
  outputFormat = 'jpeg',
  quality = 0.9,
  onScan,
  onExport,
  className = '',
}) => {
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Process image with canvas
  const processImage = useCallback(async (imageData: Uint8Array, filename: string): Promise<ScannedDocument | null> => {
    return new Promise((resolve) => {
      const blob = new Blob([imageData]);
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Process pixels
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageDataObj.data;

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          if (colorMode === 'grayscale' || colorMode === 'blackwhite') {
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = g = b = gray;
          }

          if (enhanceContrast) {
            const factor = 1.2;
            r = Math.min(255, Math.max(0, (r - 128) * factor + 128));
            g = Math.min(255, Math.max(0, (g - 128) * factor + 128));
            b = Math.min(255, Math.max(0, (b - 128) * factor + 128));
          }

          if (colorMode === 'blackwhite') {
            const value = r > 128 ? 255 : 0;
            r = g = b = value;
          }

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }

        ctx.putImageData(imageDataObj, 0, 0);

        // Create thumbnail
        const thumbCanvas = document.createElement('canvas');
        const thumbCtx = thumbCanvas.getContext('2d');
        const thumbSize = 200;
        const scale = Math.min(thumbSize / img.width, thumbSize / img.height);
        thumbCanvas.width = img.width * scale;
        thumbCanvas.height = img.height * scale;
        thumbCtx?.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

        resolve({
          id: crypto.randomUUID(),
          name: filename,
          path: '',
          thumbnail: thumbCanvas.toDataURL('image/jpeg', 0.7),
          processedImage: canvas.toDataURL(\`image/\${outputFormat}\`, quality),
          timestamp: Date.now(),
        });

        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }, [colorMode, enhanceContrast, outputFormat, quality]);

  // Import files
  const handleImport = useCallback(async () => {
    if (!window.__TAURI__) {
      // Web fallback
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files) return;

        setIsProcessing(true);
        const newDocs: ScannedDocument[] = [];

        for (const file of Array.from(files)) {
          const arrayBuffer = await file.arrayBuffer();
          const doc = await processImage(new Uint8Array(arrayBuffer), file.name);
          if (doc) newDocs.push(doc);
        }

        setDocuments(prev => [...prev, ...newDocs]);
        onScan?.(newDocs);
        setIsProcessing(false);
      };

      input.click();
      return;
    }

    const selected = await window.__TAURI__.dialog.open({
      multiple: true,
      filters: [{
        name: 'Images',
        extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff'],
      }],
    });

    if (!selected) return;

    const paths = Array.isArray(selected) ? selected : [selected];
    setIsProcessing(true);

    const newDocs: ScannedDocument[] = [];

    for (const path of paths) {
      try {
        const contents = await window.__TAURI__.fs.readBinaryFile(path);
        const filename = await window.__TAURI__.path.basename(path);
        const doc = await processImage(contents, filename);
        if (doc) {
          doc.path = path;
          newDocs.push(doc);
        }
      } catch (error) {
        console.error('Failed to process:', path, error);
      }
    }

    setDocuments(prev => [...prev, ...newDocs]);
    onScan?.(newDocs);
    setIsProcessing(false);
  }, [processImage, onScan]);

  // Export documents
  const handleExport = useCallback(async (format: 'pdf' | 'images') => {
    const docsToExport = selectedIds.size > 0
      ? documents.filter(d => selectedIds.has(d.id))
      : documents;

    onExport?.(docsToExport, format);
  }, [documents, selectedIds, onExport]);

  // Delete selected
  const handleDelete = useCallback(() => {
    setDocuments(prev => prev.filter(d => !selectedIds.has(d.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={\`flex flex-col h-full bg-gray-100 dark:bg-gray-900 \${className}\`}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleImport}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Import Images
        </button>

        {documents.length > 0 && (
          <>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Export PDF
            </button>

            <button
              onClick={() => handleExport('images')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Export Images
            </button>

            {selectedIds.size > 0 && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete ({selectedIds.size})
              </button>
            )}
          </>
        )}

        <div className="flex-1" />

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isProcessing && (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 dark:text-gray-300">Processing...</span>
            </div>
          </div>
        )}

        {!isProcessing && documents.length === 0 && (
          <div
            onClick={handleImport}
            className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          >
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Import images to scan</p>
            <p className="text-gray-400 text-sm mt-1">PNG, JPG, WEBP, TIFF</p>
          </div>
        )}

        {documents.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                onClick={() => toggleSelect(doc.id)}
                className={\`
                  relative group cursor-pointer rounded-lg overflow-hidden
                  border-2 transition-all
                  \${selectedIds.has(doc.id)
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }
                \`}
              >
                <div className="aspect-[3/4] bg-white dark:bg-gray-800">
                  <img
                    src={doc.thumbnail}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Page number */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-white text-xs font-medium">
                  {index + 1}
                </div>

                {/* Selection indicator */}
                <div className={\`
                  absolute top-2 right-2 w-5 h-5 rounded-full border-2
                  flex items-center justify-center transition-colors
                  \${selectedIds.has(doc.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-white bg-black/20 group-hover:bg-black/40'
                  }
                \`}>
                  {selectedIds.has(doc.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Filename */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xs truncate">{doc.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
`,
      },
    },
  },

  examples: [
    {
      title: 'Document Scanner',
      description: 'Full camera-based document scanner',
      code: `
<DocumentScanner
  mode="document"
  autoCapture={true}
  showGuide={true}
  multiPage={true}
  maxPages={10}
  colorMode="color"
  enhanceContrast={true}
  onCapture={(result) => console.log('Captured:', result)}
  onComplete={(results) => console.log('All pages:', results)}
/>
`,
    },
    {
      title: 'Receipt Scanner',
      description: 'Scanner optimized for receipts',
      code: `
<DocumentScanner
  mode="receipt"
  autoCapture={true}
  colorMode="blackwhite"
  multiPage={false}
  onCapture={(result) => processReceipt(result)}
/>
`,
    },
    {
      title: 'File Scanner',
      description: 'Upload-based scanning for web/desktop',
      code: `
<FileScanner
  colorMode="grayscale"
  enhanceContrast={true}
  outputFormat="png"
  quality={0.95}
  onScan={(result) => console.log('Scanned:', result)}
/>
`,
    },
    {
      title: 'Scanned Pages Gallery',
      description: 'Display and manage scanned pages',
      code: `
<ScannedPagesGallery
  pages={scannedPages}
  onReorder={(newOrder) => setScannedPages(newOrder)}
  onDelete={(index) => handleDelete(index)}
  onExport={(pages, format) => exportDocument(pages, format)}
/>
`,
    },
  ],
}
