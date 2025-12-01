/**
 * FileUpload Capsule
 *
 * File upload component with drag-and-drop, preview, and progress.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const FileUploadCapsule: CapsuleDefinition = {
  id: 'file-upload',
  name: 'FileUpload',
  description: 'File upload with drag-and-drop, preview, and progress',
  category: 'input',
  tags: ['file', 'upload', 'drag', 'drop', 'attachment', 'media'],

  props: {
    accept: {
      type: 'string',
      description: 'Accepted file types (e.g., "image/*,.pdf")'
    },
    multiple: {
      type: 'boolean',
      default: false,
      description: 'Allow multiple files'
    },
    maxSize: {
      type: 'number',
      description: 'Maximum file size in bytes'
    },
    maxFiles: {
      type: 'number',
      default: 10,
      description: 'Maximum number of files'
    },
    showPreview: {
      type: 'boolean',
      default: true,
      description: 'Show file previews'
    },
    variant: {
      type: 'string',
      default: 'dropzone',
      options: ['dropzone', 'button', 'compact'],
      description: 'Upload variant style'
    },
    disabled: {
      type: 'boolean',
      default: false,
      description: 'Disable upload'
    },
    onUpload: {
      type: 'function',
      description: 'Callback when files are selected'
    },
    onRemove: {
      type: 'function',
      description: 'Callback when file is removed'
    },
    onError: {
      type: 'function',
      description: 'Callback when error occurs'
    }
  },

  platforms: {
    web: {
      dependencies: ['react', 'lucide-react'],
      code: `
import React, { useState, useCallback, useRef, useMemo } from 'react'
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  showPreview?: boolean
  variant?: 'dropzone' | 'button' | 'compact'
  disabled?: boolean
  onUpload?: (files: File[]) => void | Promise<void>
  onRemove?: (file: UploadedFile) => void
  onError?: (error: string) => void
  className?: string
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon
  if (type.startsWith('video/')) return Film
  if (type.startsWith('audio/')) return Music
  if (type.includes('pdf') || type.includes('document')) return FileText
  if (type.includes('zip') || type.includes('archive')) return Archive
  return File
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  showPreview = true,
  variant = 'dropzone',
  disabled = false,
  onUpload,
  onRemove,
  onError,
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return \`File size exceeds \${formatFileSize(maxSize)}\`
    }
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })
      if (!isAccepted) {
        return 'File type not accepted'
      }
    }
    return null
  }, [accept, maxSize])

  const processFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)

    if (!multiple && fileArray.length > 1) {
      fileArray.splice(1)
    }

    if (files.length + fileArray.length > maxFiles) {
      onError?.(\`Maximum \${maxFiles} files allowed\`)
      return
    }

    const processedFiles: UploadedFile[] = []

    for (const file of fileArray) {
      const error = validateFile(file)
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        error: error || undefined
      }

      // Generate preview for images
      if (file.type.startsWith('image/') && showPreview) {
        uploadedFile.preview = URL.createObjectURL(file)
      }

      processedFiles.push(uploadedFile)
    }

    setFiles(prev => multiple ? [...prev, ...processedFiles] : processedFiles)

    // Upload valid files
    const validFiles = processedFiles
      .filter(f => f.status !== 'error')
      .map(f => f.file)

    if (validFiles.length > 0 && onUpload) {
      // Simulate upload progress
      processedFiles.forEach(f => {
        if (f.status !== 'error') {
          f.status = 'uploading'
        }
      })
      setFiles([...files, ...processedFiles])

      try {
        await onUpload(validFiles)
        setFiles(prev =>
          prev.map(f =>
            processedFiles.find(pf => pf.id === f.id)
              ? { ...f, status: 'success' as const, progress: 100 }
              : f
          )
        )
      } catch (err) {
        setFiles(prev =>
          prev.map(f =>
            processedFiles.find(pf => pf.id === f.id)
              ? { ...f, status: 'error' as const, error: 'Upload failed' }
              : f
          )
        )
      }
    }
  }, [files, multiple, maxFiles, validateFile, showPreview, onUpload, onError])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [disabled, processFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = ''
    }
  }, [processFiles])

  const removeFile = useCallback((fileToRemove: UploadedFile) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    setFiles(prev => prev.filter(f => f.id !== fileToRemove.id))
    onRemove?.(fileToRemove)
  }, [onRemove])

  const openFileDialog = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  // Dropzone variant
  if (variant === 'dropzone') {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={\`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            \${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            \${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          \`}
        >
          <Upload
            className={\`w-12 h-12 mx-auto mb-4 \${isDragging ? 'text-blue-500' : 'text-gray-400'}\`}
          />
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {accept ? accept.replace(/,/g, ', ') : 'Any file type'}
            {maxSize && \` • Max \${formatFileSize(maxSize)}\`}
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map(file => (
              <FilePreview
                key={file.id}
                file={file}
                showPreview={showPreview}
                onRemove={() => removeFile(file)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Button variant
  if (variant === 'button') {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <button
          onClick={openFileDialog}
          disabled={disabled}
          className={\`
            inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          \`}
        >
          <Upload size={18} />
          {multiple ? 'Upload Files' : 'Upload File'}
        </button>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map(file => (
              <FilePreview
                key={file.id}
                file={file}
                showPreview={showPreview}
                onRemove={() => removeFile(file)}
                compact
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Compact variant
  return (
    <div className={\`inline-flex items-center gap-2 \${className}\`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      <button
        onClick={openFileDialog}
        disabled={disabled}
        className={\`
          p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors
        \`}
      >
        <Upload size={20} />
      </button>

      {files.length > 0 && (
        <div className="flex items-center gap-1">
          {files.slice(0, 3).map(file => (
            <div
              key={file.id}
              className="relative group"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <File size={14} className="text-gray-400" />
                </div>
              )}
              <button
                onClick={() => removeFile(file)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full
                           opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {files.length > 3 && (
            <span className="text-xs text-gray-500">+{files.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}

// File Preview Component
function FilePreview({
  file,
  showPreview,
  onRemove,
  compact = false
}: {
  file: UploadedFile
  showPreview: boolean
  onRemove: () => void
  compact?: boolean
}) {
  const FileIcon = getFileIcon(file.file.type)

  return (
    <div
      className={\`
        flex items-center gap-3 p-3 bg-gray-50 rounded-lg border
        \${file.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200'}
      \`}
    >
      {/* Preview/Icon */}
      {showPreview && file.preview ? (
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
          <FileIcon size={20} className="text-gray-500" />
        </div>
      )}

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.file.size)}
          {file.error && <span className="text-red-500 ml-2">{file.error}</span>}
        </p>

        {/* Progress bar */}
        {file.status === 'uploading' && (
          <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: \`\${file.progress}%\` }}
            />
          </div>
        )}
      </div>

      {/* Status/Actions */}
      <div className="flex-shrink-0">
        {file.status === 'uploading' && (
          <Loader2 size={18} className="text-blue-600 animate-spin" />
        )}
        {file.status === 'success' && (
          <CheckCircle size={18} className="text-green-600" />
        )}
        {file.status === 'error' && (
          <AlertCircle size={18} className="text-red-500" />
        )}
        {(file.status === 'pending' || file.status === 'success' || file.status === 'error') && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

// Avatar Upload
export function AvatarUpload({
  value,
  onChange,
  size = 96,
  disabled = false
}: {
  value?: string
  onChange: (file: File) => void
  size?: number
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      onChange(file)
    }
  }

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={\`
          relative rounded-full overflow-hidden bg-gray-100
          hover:ring-4 hover:ring-gray-200 transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
        \`}
        style={{ width: size, height: size }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Upload size={size / 3} className="text-gray-400" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100
                        flex items-center justify-center transition-opacity">
          <Upload size={size / 4} className="text-white" />
        </div>
      </button>
    </div>
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI', 'PhotosUI', 'UniformTypeIdentifiers'],
      code: `
import SwiftUI
import PhotosUI
import UniformTypeIdentifiers

// MARK: - File Upload View
struct FileUploadView: View {
    @Binding var files: [UploadedFile]
    var allowedTypes: [UTType] = [.item]
    var multiple: Bool = false
    var maxSize: Int64?
    var maxFiles: Int = 10
    var showPreview: Bool = true
    var variant: FileUploadVariant = .dropzone
    var onUpload: (([URL]) -> Void)?
    var onError: ((String) -> Void)?

    @State private var isTargeted = false
    @State private var showFilePicker = false

    enum FileUploadVariant {
        case dropzone, button, compact
    }

    var body: some View {
        switch variant {
        case .dropzone:
            dropzoneView
        case .button:
            buttonView
        case .compact:
            compactView
        }
    }

    // MARK: - Dropzone View
    private var dropzoneView: some View {
        VStack(spacing: 16) {
            dropzoneArea

            if !files.isEmpty {
                VStack(spacing: 8) {
                    ForEach(files) { file in
                        FilePreviewRow(file: file, showPreview: showPreview) {
                            removeFile(file)
                        }
                    }
                }
            }
        }
    }

    private var dropzoneArea: some View {
        VStack(spacing: 12) {
            Image(systemName: "arrow.up.doc")
                .font(.system(size: 40))
                .foregroundColor(isTargeted ? .blue : .gray)

            VStack(spacing: 4) {
                Text("Drop files here")
                    .font(.headline)

                Text("or tap to browse")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            if let maxSize = maxSize {
                Text("Max size: \\(formatFileSize(maxSize))")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 40)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .strokeBorder(
                    style: StrokeStyle(lineWidth: 2, dash: [8, 4])
                )
                .foregroundColor(isTargeted ? .blue : .gray.opacity(0.5))
        )
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(isTargeted ? Color.blue.opacity(0.05) : Color.clear)
        )
        .onTapGesture {
            showFilePicker = true
        }
        .onDrop(of: allowedTypes, isTargeted: $isTargeted) { providers in
            handleDrop(providers)
            return true
        }
        .fileImporter(
            isPresented: $showFilePicker,
            allowedContentTypes: allowedTypes,
            allowsMultipleSelection: multiple
        ) { result in
            handleFileImport(result)
        }
    }

    // MARK: - Button View
    private var buttonView: some View {
        VStack(alignment: .leading, spacing: 12) {
            Button {
                showFilePicker = true
            } label: {
                Label(multiple ? "Upload Files" : "Upload File", systemImage: "arrow.up.doc")
                    .font(.headline)
            }
            .buttonStyle(.borderedProminent)
            .fileImporter(
                isPresented: $showFilePicker,
                allowedContentTypes: allowedTypes,
                allowsMultipleSelection: multiple
            ) { result in
                handleFileImport(result)
            }

            if !files.isEmpty {
                ForEach(files) { file in
                    FilePreviewRow(file: file, showPreview: showPreview, compact: true) {
                        removeFile(file)
                    }
                }
            }
        }
    }

    // MARK: - Compact View
    private var compactView: some View {
        HStack(spacing: 8) {
            Button {
                showFilePicker = true
            } label: {
                Image(systemName: "paperclip")
                    .font(.title2)
            }
            .fileImporter(
                isPresented: $showFilePicker,
                allowedContentTypes: allowedTypes,
                allowsMultipleSelection: multiple
            ) { result in
                handleFileImport(result)
            }

            if !files.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 4) {
                        ForEach(files.prefix(5)) { file in
                            compactFilePreview(file)
                        }

                        if files.count > 5 {
                            Text("+\\(files.count - 5)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
        }
    }

    private func compactFilePreview(_ file: UploadedFile) -> some View {
        Group {
            if let image = file.thumbnailImage {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 32, height: 32)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
            } else {
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.gray.opacity(0.2))
                    .frame(width: 32, height: 32)
                    .overlay(
                        Image(systemName: file.icon)
                            .font(.caption)
                            .foregroundColor(.gray)
                    )
            }
        }
        .overlay(alignment: .topTrailing) {
            Button {
                removeFile(file)
            } label: {
                Image(systemName: "xmark.circle.fill")
                    .font(.caption2)
                    .foregroundColor(.white)
                    .background(Circle().fill(Color.red))
            }
            .offset(x: 4, y: -4)
        }
    }

    // MARK: - Helpers
    private func handleDrop(_ providers: [NSItemProvider]) {
        for provider in providers {
            _ = provider.loadFileRepresentation(for: .item) { url, error in
                if let url = url {
                    DispatchQueue.main.async {
                        addFile(from: url)
                    }
                }
            }
        }
    }

    private func handleFileImport(_ result: Result<[URL], Error>) {
        switch result {
        case .success(let urls):
            for url in urls {
                addFile(from: url)
            }
        case .failure(let error):
            onError?(error.localizedDescription)
        }
    }

    private func addFile(from url: URL) {
        guard files.count < maxFiles else {
            onError?("Maximum \\(maxFiles) files allowed")
            return
        }

        if let maxSize = maxSize {
            do {
                let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
                if let fileSize = attributes[.size] as? Int64, fileSize > maxSize {
                    onError?("File exceeds maximum size of \\(formatFileSize(maxSize))")
                    return
                }
            } catch {
                onError?(error.localizedDescription)
                return
            }
        }

        let file = UploadedFile(url: url)
        files.append(file)
        onUpload?([url])
    }

    private func removeFile(_ file: UploadedFile) {
        files.removeAll { $0.id == file.id }
    }

    private func formatFileSize(_ bytes: Int64) -> String {
        let formatter = ByteCountFormatter()
        formatter.countStyle = .file
        return formatter.string(fromByteCount: bytes)
    }
}

// MARK: - Uploaded File Model
struct UploadedFile: Identifiable {
    let id = UUID()
    let url: URL
    var progress: Double = 0
    var status: UploadStatus = .pending

    enum UploadStatus {
        case pending, uploading, success, error
    }

    var name: String {
        url.lastPathComponent
    }

    var icon: String {
        let ext = url.pathExtension.lowercased()
        switch ext {
        case "pdf": return "doc.fill"
        case "jpg", "jpeg", "png", "gif", "heic": return "photo.fill"
        case "mp4", "mov", "avi": return "video.fill"
        case "mp3", "wav", "m4a": return "music.note"
        case "zip", "rar", "7z": return "archivebox.fill"
        default: return "doc.fill"
        }
    }

    var thumbnailImage: UIImage? {
        let ext = url.pathExtension.lowercased()
        guard ["jpg", "jpeg", "png", "gif", "heic"].contains(ext) else { return nil }
        return UIImage(contentsOfFile: url.path)
    }

    var formattedSize: String {
        do {
            let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
            if let size = attributes[.size] as? Int64 {
                let formatter = ByteCountFormatter()
                formatter.countStyle = .file
                return formatter.string(fromByteCount: size)
            }
        } catch {}
        return ""
    }
}

// MARK: - File Preview Row
struct FilePreviewRow: View {
    let file: UploadedFile
    var showPreview: Bool = true
    var compact: Bool = false
    var onRemove: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Thumbnail
            Group {
                if showPreview, let image = file.thumbnailImage {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 44, height: 44)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                } else {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.gray.opacity(0.1))
                        .frame(width: 44, height: 44)
                        .overlay(
                            Image(systemName: file.icon)
                                .foregroundColor(.gray)
                        )
                }
            }

            // Info
            VStack(alignment: .leading, spacing: 2) {
                Text(file.name)
                    .font(.subheadline)
                    .lineLimit(1)

                Text(file.formattedSize)
                    .font(.caption)
                    .foregroundColor(.secondary)

                if file.status == .uploading {
                    ProgressView(value: file.progress)
                        .progressViewStyle(.linear)
                }
            }

            Spacer()

            // Status
            Group {
                switch file.status {
                case .uploading:
                    ProgressView()
                case .success:
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                case .error:
                    Image(systemName: "exclamationmark.circle.fill")
                        .foregroundColor(.red)
                case .pending:
                    Button(action: onRemove) {
                        Image(systemName: "xmark")
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding(12)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
}

// MARK: - Avatar Upload
struct AvatarUpload: View {
    @Binding var image: UIImage?
    var size: CGFloat = 96
    var disabled: Bool = false

    @State private var showImagePicker = false
    @State private var selectedItem: PhotosPickerItem?

    var body: some View {
        PhotosPicker(
            selection: $selectedItem,
            matching: .images
        ) {
            ZStack {
                if let image = image {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: size, height: size)
                        .clipShape(Circle())
                } else {
                    Circle()
                        .fill(Color.gray.opacity(0.2))
                        .frame(width: size, height: size)
                        .overlay(
                            Image(systemName: "camera.fill")
                                .font(.system(size: size / 3))
                                .foregroundColor(.gray)
                        )
                }

                Circle()
                    .fill(Color.black.opacity(0.3))
                    .frame(width: size, height: size)
                    .overlay(
                        Image(systemName: "pencil")
                            .font(.system(size: size / 4))
                            .foregroundColor(.white)
                    )
                    .opacity(0)
            }
        }
        .disabled(disabled)
        .onChange(of: selectedItem) { _, newItem in
            Task {
                if let data = try? await newItem?.loadTransferable(type: Data.self),
                   let uiImage = UIImage(data: data) {
                    image = uiImage
                }
            }
        }
    }
}

// MARK: - Preview
struct FileUploadView_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            FileUploadView(
                files: .constant([]),
                variant: .dropzone
            )

            FileUploadView(
                files: .constant([]),
                variant: .button
            )

            AvatarUpload(image: .constant(nil))
        }
        .padding()
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3', 'androidx.activity.compose'],
      code: `
package com.hublab.capsules

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import java.text.DecimalFormat
import kotlin.math.log10
import kotlin.math.pow

// Uploaded File
data class UploadedFile(
    val id: String = java.util.UUID.randomUUID().toString(),
    val uri: Uri,
    val name: String,
    val size: Long,
    val mimeType: String?,
    var progress: Float = 0f,
    var status: UploadStatus = UploadStatus.Pending
)

enum class UploadStatus {
    Pending, Uploading, Success, Error
}

enum class FileUploadVariant {
    Dropzone, Button, Compact
}

// File Upload Component
@Composable
fun FileUpload(
    files: List<UploadedFile>,
    onFilesChange: (List<UploadedFile>) -> Unit,
    modifier: Modifier = Modifier,
    mimeTypes: Array<String> = arrayOf("*/*"),
    multiple: Boolean = false,
    maxFiles: Int = 10,
    maxSize: Long? = null,
    showPreview: Boolean = true,
    variant: FileUploadVariant = FileUploadVariant.Dropzone,
    enabled: Boolean = true,
    onUpload: ((List<Uri>) -> Unit)? = null,
    onError: ((String) -> Unit)? = null
) {
    val context = LocalContext.current

    val launcher = rememberLauncherForActivityResult(
        contract = if (multiple) {
            ActivityResultContracts.OpenMultipleDocuments()
        } else {
            ActivityResultContracts.OpenDocument()
        }
    ) { result ->
        val uris = when (result) {
            is Uri -> listOf(result)
            is List<*> -> result.filterIsInstance<Uri>()
            else -> emptyList()
        }

        if (uris.isNotEmpty()) {
            val newFiles = uris.mapNotNull { uri ->
                val cursor = context.contentResolver.query(uri, null, null, null, null)
                cursor?.use {
                    if (it.moveToFirst()) {
                        val nameIndex = it.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME)
                        val sizeIndex = it.getColumnIndex(android.provider.OpenableColumns.SIZE)
                        val name = if (nameIndex >= 0) it.getString(nameIndex) else "Unknown"
                        val size = if (sizeIndex >= 0) it.getLong(sizeIndex) else 0L
                        val mimeType = context.contentResolver.getType(uri)

                        if (maxSize != null && size > maxSize) {
                            onError?.invoke("File exceeds maximum size of ${formatFileSize(maxSize)}")
                            return@mapNotNull null
                        }

                        UploadedFile(
                            uri = uri,
                            name = name,
                            size = size,
                            mimeType = mimeType
                        )
                    } else null
                }
            }

            if (files.size + newFiles.size > maxFiles) {
                onError?.invoke("Maximum $maxFiles files allowed")
                return@rememberLauncherForActivityResult
            }

            val updatedFiles = if (multiple) files + newFiles else newFiles
            onFilesChange(updatedFiles)
            onUpload?.invoke(newFiles.map { it.uri })
        }
    }

    when (variant) {
        FileUploadVariant.Dropzone -> {
            DropzoneUpload(
                files = files,
                onFilesChange = onFilesChange,
                onPickFiles = { launcher.launch(mimeTypes) },
                showPreview = showPreview,
                maxSize = maxSize,
                enabled = enabled,
                modifier = modifier
            )
        }
        FileUploadVariant.Button -> {
            ButtonUpload(
                files = files,
                onFilesChange = onFilesChange,
                onPickFiles = { launcher.launch(mimeTypes) },
                showPreview = showPreview,
                multiple = multiple,
                enabled = enabled,
                modifier = modifier
            )
        }
        FileUploadVariant.Compact -> {
            CompactUpload(
                files = files,
                onFilesChange = onFilesChange,
                onPickFiles = { launcher.launch(mimeTypes) },
                enabled = enabled,
                modifier = modifier
            )
        }
    }
}

@Composable
private fun DropzoneUpload(
    files: List<UploadedFile>,
    onFilesChange: (List<UploadedFile>) -> Unit,
    onPickFiles: () -> Unit,
    showPreview: Boolean,
    maxSize: Long?,
    enabled: Boolean,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // Dropzone area
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .clip(RoundedCornerShape(16.dp))
                .border(
                    width = 2.dp,
                    color = MaterialTheme.colorScheme.outline,
                    shape = RoundedCornerShape(16.dp)
                )
                .clickable(enabled = enabled, onClick = onPickFiles),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Icon(
                    Icons.Default.CloudUpload,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Tap to upload",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "or drag and drop files here",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                if (maxSize != null) {
                    Text(
                        text = "Max size: ${formatFileSize(maxSize)}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // File list
        if (files.isNotEmpty()) {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(files, key = { it.id }) { file ->
                    FilePreviewRow(
                        file = file,
                        showPreview = showPreview,
                        onRemove = {
                            onFilesChange(files.filter { it.id != file.id })
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun ButtonUpload(
    files: List<UploadedFile>,
    onFilesChange: (List<UploadedFile>) -> Unit,
    onPickFiles: () -> Unit,
    showPreview: Boolean,
    multiple: Boolean,
    enabled: Boolean,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button(
            onClick = onPickFiles,
            enabled = enabled
        ) {
            Icon(Icons.Default.Upload, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(if (multiple) "Upload Files" else "Upload File")
        }

        if (files.isNotEmpty()) {
            files.forEach { file ->
                FilePreviewRow(
                    file = file,
                    showPreview = showPreview,
                    compact = true,
                    onRemove = {
                        onFilesChange(files.filter { it.id != file.id })
                    }
                )
            }
        }
    }
}

@Composable
private fun CompactUpload(
    files: List<UploadedFile>,
    onFilesChange: (List<UploadedFile>) -> Unit,
    onPickFiles: () -> Unit,
    enabled: Boolean,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        IconButton(onClick = onPickFiles, enabled = enabled) {
            Icon(Icons.Default.AttachFile, contentDescription = "Attach file")
        }

        if (files.isNotEmpty()) {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                items(files.take(5), key = { it.id }) { file ->
                    Box(modifier = Modifier.size(32.dp)) {
                        if (file.mimeType?.startsWith("image/") == true) {
                            AsyncImage(
                                model = ImageRequest.Builder(LocalContext.current)
                                    .data(file.uri)
                                    .crossfade(true)
                                    .build(),
                                contentDescription = null,
                                modifier = Modifier
                                    .fillMaxSize()
                                    .clip(RoundedCornerShape(4.dp)),
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        MaterialTheme.colorScheme.surfaceVariant,
                                        RoundedCornerShape(4.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    getFileIcon(file.mimeType),
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }

                        IconButton(
                            onClick = { onFilesChange(files.filter { it.id != file.id }) },
                            modifier = Modifier
                                .size(16.dp)
                                .align(Alignment.TopEnd)
                                .offset(x = 4.dp, y = (-4).dp)
                        ) {
                            Icon(
                                Icons.Default.Cancel,
                                contentDescription = "Remove",
                                modifier = Modifier.size(12.dp),
                                tint = MaterialTheme.colorScheme.error
                            )
                        }
                    }
                }

                if (files.size > 5) {
                    item {
                        Text(
                            text = "+${files.size - 5}",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun FilePreviewRow(
    file: UploadedFile,
    showPreview: Boolean,
    compact: Boolean = false,
    onRemove: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                MaterialTheme.colorScheme.surfaceVariant,
                RoundedCornerShape(12.dp)
            )
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Thumbnail
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(MaterialTheme.colorScheme.surface),
            contentAlignment = Alignment.Center
        ) {
            if (showPreview && file.mimeType?.startsWith("image/") == true) {
                AsyncImage(
                    model = file.uri,
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                Icon(
                    getFileIcon(file.mimeType),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // File info
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = file.name,
                style = MaterialTheme.typography.bodyMedium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = formatFileSize(file.size),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            if (file.status == UploadStatus.Uploading) {
                LinearProgressIndicator(
                    progress = { file.progress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 4.dp)
                )
            }
        }

        // Status/Action
        when (file.status) {
            UploadStatus.Uploading -> CircularProgressIndicator(modifier = Modifier.size(24.dp))
            UploadStatus.Success -> Icon(
                Icons.Default.CheckCircle,
                contentDescription = null,
                tint = Color(0xFF22C55E)
            )
            UploadStatus.Error -> Icon(
                Icons.Default.Error,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.error
            )
            UploadStatus.Pending -> IconButton(onClick = onRemove) {
                Icon(Icons.Default.Close, contentDescription = "Remove")
            }
        }
    }
}

private fun getFileIcon(mimeType: String?): ImageVector {
    return when {
        mimeType?.startsWith("image/") == true -> Icons.Default.Image
        mimeType?.startsWith("video/") == true -> Icons.Default.VideoFile
        mimeType?.startsWith("audio/") == true -> Icons.Default.AudioFile
        mimeType?.contains("pdf") == true -> Icons.Default.PictureAsPdf
        else -> Icons.Default.InsertDriveFile
    }
}

private fun formatFileSize(bytes: Long): String {
    if (bytes <= 0) return "0 B"
    val units = arrayOf("B", "KB", "MB", "GB", "TB")
    val digitGroups = (log10(bytes.toDouble()) / log10(1024.0)).toInt()
    return DecimalFormat("#,##0.#").format(bytes / 1024.0.pow(digitGroups.toDouble())) + " " + units[digitGroups]
}

// Avatar Upload
@Composable
fun AvatarUpload(
    imageUri: Uri?,
    onImageChange: (Uri) -> Unit,
    modifier: Modifier = Modifier,
    size: Int = 96,
    enabled: Boolean = true
) {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        uri?.let { onImageChange(it) }
    }

    Box(
        modifier = modifier
            .size(size.dp)
            .clip(CircleShape)
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .clickable(enabled = enabled) { launcher.launch("image/*") },
        contentAlignment = Alignment.Center
    ) {
        if (imageUri != null) {
            AsyncImage(
                model = imageUri,
                contentDescription = "Avatar",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        } else {
            Icon(
                Icons.Default.CameraAlt,
                contentDescription = "Upload avatar",
                modifier = Modifier.size((size / 3).dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Edit overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.3f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Default.Edit,
                contentDescription = null,
                modifier = Modifier.size((size / 4).dp),
                tint = Color.White
            )
        }
    }
}
`
    },

    desktop: {
      dependencies: ['@tauri-apps/api'],
      code: `
// Desktop uses the same React components with Tauri integration
// See web implementation above
export * from './web'
`
    }
  }
}
