/**
 * Camera Capsule - Native Camera Access
 *
 * Cross-platform camera access with photo capture,
 * video recording, and gallery selection.
 */

import type { CapsuleDefinition } from './types'

export const CameraCapsule: CapsuleDefinition = {
  id: 'camera',
  name: 'Camera',
  description: 'Native camera access with photo capture, video recording, and gallery',
  category: 'device',
  tags: ['camera', 'photo', 'video', 'gallery', 'capture'],
  version: '1.0.0',

  props: {
    mode: {
      type: 'string',
      default: 'photo',
      description: 'Camera mode: photo, video',
    },
    facing: {
      type: 'string',
      default: 'back',
      description: 'Camera facing: front, back',
    },
    quality: {
      type: 'number',
      default: 0.9,
      description: 'Image quality (0-1)',
    },
    allowGallery: {
      type: 'boolean',
      default: true,
      description: 'Allow selecting from gallery',
    },
    allowFlip: {
      type: 'boolean',
      default: true,
      description: 'Allow flipping camera',
    },
    showControls: {
      type: 'boolean',
      default: true,
      description: 'Show camera controls',
    },
    aspectRatio: {
      type: 'string',
      default: '4:3',
      description: 'Aspect ratio: 4:3, 16:9, 1:1',
    },
    maxDuration: {
      type: 'number',
      default: 60,
      description: 'Max video duration in seconds',
    },
    onCapture: {
      type: 'function',
      description: 'Callback when media is captured',
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
        Camera: `
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraProps {
  mode?: 'photo' | 'video';
  facing?: 'front' | 'back';
  quality?: number;
  allowGallery?: boolean;
  allowFlip?: boolean;
  showControls?: boolean;
  aspectRatio?: '4:3' | '16:9' | '1:1';
  onCapture?: (data: { type: 'photo' | 'video'; data: string; blob: Blob }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const Camera: React.FC<CameraProps> = ({
  mode = 'photo',
  facing = 'back',
  quality = 0.9,
  allowGallery = true,
  allowFlip = true,
  showControls = true,
  aspectRatio = '4:3',
  onCapture,
  onError,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isActive, setIsActive] = useState(false);
  const [currentFacing, setCurrentFacing] = useState(facing);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const aspectRatioValue = {
    '4:3': 4 / 3,
    '16:9': 16 / 9,
    '1:1': 1,
  }[aspectRatio];

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: currentFacing === 'front' ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: mode === 'video',
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Camera access denied'));
    }
  }, [currentFacing, mode, onError]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
  }, [stream]);

  const flipCamera = useCallback(() => {
    stopCamera();
    setCurrentFacing(prev => prev === 'front' ? 'back' : 'front');
  }, [stopCamera]);

  useEffect(() => {
    if (isActive) {
      startCamera();
    }
  }, [currentFacing]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (currentFacing === 'front') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      blob => {
        if (blob) {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          onCapture?.({ type: 'photo', data: dataUrl, blob });
        }
      },
      'image/jpeg',
      quality
    );
  }, [currentFacing, quality, onCapture]);

  const startRecording = useCallback(() => {
    if (!stream) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        onCapture?.({ type: 'video', data: reader.result as string, blob });
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  }, [stream, onCapture]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [isRecording]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleGallerySelect = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = mode === 'photo' ? 'image/*' : 'video/*';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onCapture?.({
            type: mode,
            data: reader.result as string,
            blob: file,
          });
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  }, [mode, onCapture]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div className={\`relative bg-black rounded-lg overflow-hidden \${className}\`}>
      <div style={{ aspectRatio: aspectRatioValue }}>
        <video
          ref={videoRef}
          className={\`w-full h-full object-cover \${currentFacing === 'front' ? 'scale-x-[-1]' : ''}\`}
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <button
              onClick={startCamera}
              className="flex flex-col items-center gap-3 text-white"
            >
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Start Camera</span>
            </button>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {showControls && isActive && (
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-8">
            {allowGallery && (
              <button
                onClick={handleGallerySelect}
                className="p-3 bg-white/20 rounded-full"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            )}

            {mode === 'photo' ? (
              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
              >
                <div className="w-12 h-12 border-4 border-gray-900 rounded-full" />
              </button>
            ) : (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={\`w-16 h-16 rounded-full flex items-center justify-center \${isRecording ? 'bg-white' : 'bg-red-500'}\`}
              >
                {isRecording ? (
                  <div className="w-6 h-6 bg-red-500 rounded" />
                ) : (
                  <div className="w-12 h-12 bg-red-500 rounded-full" />
                )}
              </button>
            )}

            {allowFlip && (
              <button
                onClick={flipCamera}
                className="p-3 bg-white/20 rounded-full"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

        ImagePicker: `
import React, { useRef, useState } from 'react';

interface ImagePickerProps {
  onSelect?: (data: { file: File; preview: string }) => void;
  accept?: string;
  maxSize?: number;
  aspectRatio?: number;
  className?: string;
  children?: React.ReactNode;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onSelect,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  aspectRatio,
  className = '',
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(\`File too large. Max size is \${maxSize / 1024 / 1024}MB\`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      setError(null);
      onSelect?.({ file, preview: previewUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {children ? (
        <div onClick={() => inputRef.current?.click()}>
          {children}
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Select Image
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI', 'AVFoundation', 'PhotosUI'],
      minimumVersion: '15.0',
      components: {
        CameraView: `
import SwiftUI
import AVFoundation
import PhotosUI

struct CameraView: View {
    @StateObject private var camera = CameraModel()
    var onCapture: ((Data, UIImage) -> Void)?

    var body: some View {
        ZStack {
            CameraPreview(camera: camera)
                .ignoresSafeArea()

            VStack {
                Spacer()

                HStack(spacing: 60) {
                    PhotosPicker(
                        selection: $camera.selectedItem,
                        matching: .images
                    ) {
                        Image(systemName: "photo.on.rectangle")
                            .font(.title)
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.white.opacity(0.2))
                            .clipShape(Circle())
                    }

                    Button(action: {
                        camera.capturePhoto { data, image in
                            onCapture?(data, image)
                        }
                    }) {
                        Circle()
                            .stroke(Color.white, lineWidth: 4)
                            .frame(width: 70, height: 70)
                            .overlay(
                                Circle()
                                    .fill(Color.white)
                                    .frame(width: 58, height: 58)
                            )
                    }

                    Button(action: camera.flipCamera) {
                        Image(systemName: "camera.rotate")
                            .font(.title)
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.white.opacity(0.2))
                            .clipShape(Circle())
                    }
                }
                .padding(.bottom, 40)
            }
        }
        .onAppear { camera.checkPermissions() }
    }
}

class CameraModel: NSObject, ObservableObject {
    @Published var session = AVCaptureSession()
    @Published var output = AVCapturePhotoOutput()
    @Published var preview: AVCaptureVideoPreviewLayer?
    @Published var isTaken = false
    @Published var selectedItem: PhotosPickerItem?
    @Published var position: AVCaptureDevice.Position = .back

    private var photoCompletion: ((Data, UIImage) -> Void)?

    func checkPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            setUp()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                if granted {
                    DispatchQueue.main.async { self.setUp() }
                }
            }
        default:
            break
        }
    }

    func setUp() {
        do {
            session.beginConfiguration()

            guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: position) else { return }
            let input = try AVCaptureDeviceInput(device: device)

            if session.canAddInput(input) { session.addInput(input) }
            if session.canAddOutput(output) { session.addOutput(output) }

            session.commitConfiguration()

            DispatchQueue.global(qos: .background).async {
                self.session.startRunning()
            }
        } catch {
            print("Camera setup error: \\(error)")
        }
    }

    func flipCamera() {
        position = position == .back ? .front : .back
        session.inputs.forEach { session.removeInput($0) }
        setUp()
    }

    func capturePhoto(completion: @escaping (Data, UIImage) -> Void) {
        photoCompletion = completion
        let settings = AVCapturePhotoSettings()
        output.capturePhoto(with: settings, delegate: self)
    }
}

extension CameraModel: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        guard let data = photo.fileDataRepresentation(),
              let image = UIImage(data: data) else { return }
        photoCompletion?(data, image)
    }
}

struct CameraPreview: UIViewRepresentable {
    @ObservedObject var camera: CameraModel

    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: UIScreen.main.bounds)
        camera.preview = AVCaptureVideoPreviewLayer(session: camera.session)
        camera.preview?.frame = view.frame
        camera.preview?.videoGravity = .resizeAspectFill
        view.layer.addSublayer(camera.preview!)
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {}
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\\.dismiss) var dismiss

    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.filter = .images
        config.selectionLimit = 1

        let picker = PHPickerViewController(configuration: config)
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: ImagePicker

        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            parent.dismiss()

            guard let provider = results.first?.itemProvider,
                  provider.canLoadObject(ofClass: UIImage.self) else { return }

            provider.loadObject(ofClass: UIImage.self) { image, _ in
                DispatchQueue.main.async {
                    self.parent.image = image as? UIImage
                }
            }
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
        'androidx.camera:camera-lifecycle:1.3.0',
      ],
      minimumSdk: 24,
      components: {
        CameraView: `
package com.hublab.capsules.camera

import android.Manifest
import android.content.Context
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import java.io.File
import java.util.concurrent.Executor

@Composable
fun CameraView(
    onCapture: (Uri) -> Unit,
    onError: (String) -> Unit = {}
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var hasCameraPermission by remember { mutableStateOf(false) }
    var lensFacing by remember { mutableStateOf(CameraSelector.LENS_FACING_BACK) }
    var imageCapture by remember { mutableStateOf<ImageCapture?>(null) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
    }

    LaunchedEffect(Unit) {
        val permission = Manifest.permission.CAMERA
        if (ContextCompat.checkSelfPermission(context, permission) ==
            android.content.pm.PackageManager.PERMISSION_GRANTED) {
            hasCameraPermission = true
        } else {
            permissionLauncher.launch(permission)
        }
    }

    if (hasCameraPermission) {
        Box(modifier = Modifier.fillMaxSize()) {
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { ctx ->
                    val previewView = PreviewView(ctx)
                    val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)

                    cameraProviderFuture.addListener({
                        val cameraProvider = cameraProviderFuture.get()
                        val preview = Preview.Builder().build().also {
                            it.setSurfaceProvider(previewView.surfaceProvider)
                        }

                        imageCapture = ImageCapture.Builder()
                            .setCaptureMode(ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY)
                            .build()

                        val cameraSelector = CameraSelector.Builder()
                            .requireLensFacing(lensFacing)
                            .build()

                        cameraProvider.unbindAll()
                        cameraProvider.bindToLifecycle(
                            lifecycleOwner,
                            cameraSelector,
                            preview,
                            imageCapture
                        )
                    }, ContextCompat.getMainExecutor(ctx))

                    previewView
                }
            )

            // Controls
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 32.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Gallery button
                IconButton(
                    onClick = { /* Open gallery */ },
                    modifier = Modifier
                        .size(48.dp)
                        .background(Color.White.copy(alpha = 0.2f), CircleShape)
                ) {
                    Icon(Icons.Default.PhotoLibrary, "Gallery", tint = Color.White)
                }

                // Capture button
                IconButton(
                    onClick = {
                        takePhoto(context, imageCapture, onCapture, onError)
                    },
                    modifier = Modifier.size(72.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .background(Color.White, CircleShape)
                            .padding(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.White, CircleShape)
                        )
                    }
                }

                // Flip camera
                IconButton(
                    onClick = {
                        lensFacing = if (lensFacing == CameraSelector.LENS_FACING_BACK) {
                            CameraSelector.LENS_FACING_FRONT
                        } else {
                            CameraSelector.LENS_FACING_BACK
                        }
                    },
                    modifier = Modifier
                        .size(48.dp)
                        .background(Color.White.copy(alpha = 0.2f), CircleShape)
                ) {
                    Icon(Icons.Default.FlipCameraAndroid, "Flip", tint = Color.White)
                }
            }
        }
    }
}

private fun takePhoto(
    context: Context,
    imageCapture: ImageCapture?,
    onCapture: (Uri) -> Unit,
    onError: (String) -> Unit
) {
    val imageCapture = imageCapture ?: return

    val photoFile = File(
        context.cacheDir,
        "photo_\${System.currentTimeMillis()}.jpg"
    )

    val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

    imageCapture.takePicture(
        outputOptions,
        ContextCompat.getMainExecutor(context),
        object : ImageCapture.OnImageSavedCallback {
            override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                onCapture(Uri.fromFile(photoFile))
            }

            override fun onError(exception: ImageCaptureException) {
                onError(exception.message ?: "Capture failed")
            }
        }
    )
}

// Image Picker
@Composable
fun ImagePicker(
    onImageSelected: (Uri) -> Unit
) {
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri ->
        uri?.let { onImageSelected(it) }
    }

    Button(onClick = { launcher.launch("image/*") }) {
        Icon(Icons.Default.PhotoLibrary, contentDescription = null)
        Spacer(modifier = Modifier.width(8.dp))
        Text("Select Image")
    }
}
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss'],
      components: {
        DesktopCamera: `
import React, { useRef, useState, useCallback } from 'react';

interface DesktopCameraProps {
  onCapture?: (data: { dataUrl: string; blob: Blob }) => void;
  className?: string;
}

export const DesktopCamera: React.FC<DesktopCameraProps> = ({
  onCapture,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsActive(false);
  }, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (blob) {
        onCapture?.({
          dataUrl: canvas.toDataURL('image/jpeg', 0.9),
          blob,
        });
      }
    }, 'image/jpeg', 0.9);
  }, [onCapture]);

  return (
    <div className={\`relative bg-black rounded-lg overflow-hidden \${className}\`}>
      <video ref={videoRef} className="w-full aspect-video object-cover" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      {!isActive ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Camera
          </button>
        </div>
      ) : (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4">
          <button
            onClick={capture}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center"
          >
            <div className="w-10 h-10 border-4 border-gray-900 rounded-full" />
          </button>
          <button
            onClick={stopCamera}
            className="p-3 bg-red-500 text-white rounded-full"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
};
`,
      },
    },
  },

  examples: [
    {
      title: 'Photo Camera',
      description: 'Camera for taking photos',
      code: `
<Camera
  mode="photo"
  onCapture={(result) => console.log(result)}
/>
`,
    },
    {
      title: 'Image Picker',
      description: 'Select image from gallery',
      code: `
<ImagePicker
  onSelect={(data) => setImage(data.preview)}
  maxSize={5 * 1024 * 1024}
/>
`,
    },
  ],
}
