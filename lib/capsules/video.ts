import type { CapsuleDefinition } from './types'

export const VideoCapsule: CapsuleDefinition = {
  id: 'video',
  name: 'Video',
  description: 'Video player component with controls, thumbnails, and streaming support',
  category: 'media',
  tags: ['video', 'player', 'media', 'streaming', 'playback', 'controls'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'Video.tsx',
          code: `import React, { useRef, useState, useEffect, useCallback } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16'
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onError?: (error: Error) => void
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  preload = 'metadata',
  aspectRatio = '16:9',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onError,
  className = ''
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(muted ? 0 : 1)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hideControlsTimer = useRef<number>()

  const aspectRatios = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]'
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime, video.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleError = () => {
      const err = new Error('Video failed to load')
      setError('Failed to load video')
      setIsLoading(false)
      onError?.(err)
    }

    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [onPlay, onPause, onEnded, onTimeUpdate, onError])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }, [])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const time = Number(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }, [])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const vol = Number(e.target.value)
    video.volume = vol
    setVolume(vol)
    setIsMuted(vol === 0)
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.muted = false
      video.volume = volume || 0.5
      setIsMuted(false)
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current)
    }
    if (isPlaying) {
      hideControlsTimer.current = window.setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  return (
    <div
      ref={containerRef}
      className={\`relative bg-black rounded-xl overflow-hidden group \${aspectRatios[aspectRatio]} \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload={preload}
        playsInline
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Play button overlay */}
      {!isPlaying && !isLoading && !error && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Custom controls */}
      {controls && !error && (
        <div className={\`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 \${
          showControls ? 'opacity-100' : 'opacity-0'
        }\`}>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-xs w-10">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
            <span className="text-white text-xs w-10 text-right">{formatTime(duration)}</span>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white hover:text-white/80">
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1">
                <button onClick={toggleMute} className="text-white hover:text-white/80">
                  {isMuted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {title && <span className="text-white text-sm">{title}</span>}

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white hover:text-white/80">
                {isFullscreen ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Video thumbnail/preview
interface VideoThumbnailProps {
  src: string
  poster?: string
  duration?: number
  title?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VideoThumbnail({
  src,
  poster,
  duration,
  title,
  onClick,
  size = 'md',
  className = ''
}: VideoThumbnailProps) {
  const sizes = {
    sm: 'w-32 h-20',
    md: 'w-48 h-28',
    lg: 'w-64 h-36'
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div
      onClick={onClick}
      className={\`relative rounded-lg overflow-hidden cursor-pointer group \${sizes[size]} \${className}\`}
    >
      {poster ? (
        <img src={poster} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-800" />
      )}

      {/* Play overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Duration badge */}
      {duration && (
        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
          {formatDuration(duration)}
        </span>
      )}

      {/* Title */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-xs truncate">{title}</p>
        </div>
      )}
    </div>
  )
}

// Video gallery/grid
interface VideoGalleryProps {
  videos: Array<{
    id: string
    src: string
    poster?: string
    title?: string
    duration?: number
  }>
  onVideoSelect?: (video: { id: string; src: string }) => void
  columns?: 2 | 3 | 4
  className?: string
}

export function VideoGallery({
  videos,
  onVideoSelect,
  columns = 3,
  className = ''
}: VideoGalleryProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <div className={\`grid \${gridCols[columns]} gap-4 \${className}\`}>
      {videos.map(video => (
        <VideoThumbnail
          key={video.id}
          src={video.src}
          poster={video.poster}
          title={video.title}
          duration={video.duration}
          onClick={() => onVideoSelect?.(video)}
          size="lg"
          className="w-full h-auto aspect-video"
        />
      ))}
    </div>
  )
}

// Background video (for hero sections)
interface BackgroundVideoProps {
  src: string
  poster?: string
  overlay?: boolean
  overlayOpacity?: number
  children?: React.ReactNode
  className?: string
}

export function BackgroundVideo({
  src,
  poster,
  overlay = true,
  overlayOpacity = 0.5,
  children,
  className = ''
}: BackgroundVideoProps) {
  return (
    <div className={\`relative overflow-hidden \${className}\`}>
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      <div className="relative z-10">{children}</div>
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
      dependencies: ['AVKit'],
      files: [
        {
          filename: 'Video.swift',
          code: `import SwiftUI
import AVKit
import AVFoundation

// MARK: - Video Player
struct HubLabVideoPlayer: View {
    let url: URL
    var autoPlay: Bool = false
    var showControls: Bool = true
    var looping: Bool = false
    var onPlay: (() -> Void)?
    var onPause: (() -> Void)?
    var onEnded: (() -> Void)?

    @StateObject private var playerViewModel: VideoPlayerViewModel

    init(
        url: URL,
        autoPlay: Bool = false,
        showControls: Bool = true,
        looping: Bool = false,
        onPlay: (() -> Void)? = nil,
        onPause: (() -> Void)? = nil,
        onEnded: (() -> Void)? = nil
    ) {
        self.url = url
        self.autoPlay = autoPlay
        self.showControls = showControls
        self.looping = looping
        self.onPlay = onPlay
        self.onPause = onPause
        self.onEnded = onEnded
        _playerViewModel = StateObject(wrappedValue: VideoPlayerViewModel(url: url, autoPlay: autoPlay, looping: looping))
    }

    var body: some View {
        ZStack {
            VideoPlayer(player: playerViewModel.player)
                .aspectRatio(16/9, contentMode: .fit)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )

            if !showControls {
                // Custom play button overlay
                if !playerViewModel.isPlaying {
                    Button {
                        playerViewModel.play()
                        onPlay?()
                    } label: {
                        Circle()
                            .fill(Color.white.opacity(0.9))
                            .frame(width: 64, height: 64)
                            .overlay(
                                Image(systemName: "play.fill")
                                    .font(.title)
                                    .foregroundColor(.black)
                                    .offset(x: 2)
                            )
                    }
                }
            }

            // Loading indicator
            if playerViewModel.isLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.5)
            }
        }
        .onDisappear {
            playerViewModel.pause()
        }
        .onChange(of: playerViewModel.isPlaying) { playing in
            if playing {
                onPlay?()
            } else {
                onPause?()
            }
        }
    }
}

// MARK: - Video Player ViewModel
class VideoPlayerViewModel: ObservableObject {
    @Published var player: AVPlayer
    @Published var isPlaying = false
    @Published var isLoading = true
    @Published var currentTime: Double = 0
    @Published var duration: Double = 0

    private var timeObserver: Any?
    private var looping: Bool

    init(url: URL, autoPlay: Bool, looping: Bool) {
        self.looping = looping
        let playerItem = AVPlayerItem(url: url)
        self.player = AVPlayer(playerItem: playerItem)

        setupObservers()

        if autoPlay {
            play()
        }
    }

    deinit {
        if let observer = timeObserver {
            player.removeTimeObserver(observer)
        }
        NotificationCenter.default.removeObserver(self)
    }

    private func setupObservers() {
        // Time observer
        let interval = CMTime(seconds: 0.5, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
        timeObserver = player.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            self?.currentTime = time.seconds
            self?.isLoading = false
        }

        // Duration
        player.currentItem?.publisher(for: \\.duration)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] duration in
                self?.duration = duration.seconds
            }
            .store(in: &cancellables)

        // End notification
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(playerDidFinishPlaying),
            name: .AVPlayerItemDidPlayToEndTime,
            object: player.currentItem
        )
    }

    private var cancellables = Set<AnyCancellable>()

    @objc private func playerDidFinishPlaying() {
        if looping {
            player.seek(to: .zero)
            player.play()
        } else {
            isPlaying = false
        }
    }

    func play() {
        player.play()
        isPlaying = true
    }

    func pause() {
        player.pause()
        isPlaying = false
    }

    func seek(to time: Double) {
        let cmTime = CMTime(seconds: time, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
        player.seek(to: cmTime)
    }
}

import Combine

// MARK: - Video Thumbnail
struct VideoThumbnail: View {
    let url: URL
    var duration: TimeInterval?
    var title: String?
    var onTap: (() -> Void)?

    @State private var thumbnail: UIImage?

    var body: some View {
        Button {
            onTap?()
        } label: {
            ZStack {
                // Thumbnail image
                if let image = thumbnail {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(16/9, contentMode: .fill)
                } else {
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                        .aspectRatio(16/9, contentMode: .fill)
                }

                // Play button overlay
                Circle()
                    .fill(Color.white.opacity(0.9))
                    .frame(width: 44, height: 44)
                    .overlay(
                        Image(systemName: "play.fill")
                            .foregroundColor(.black)
                            .offset(x: 2)
                    )

                // Duration badge
                if let duration = duration {
                    VStack {
                        Spacer()
                        HStack {
                            Spacer()
                            Text(formatDuration(duration))
                                .font(.caption2)
                                .fontWeight(.medium)
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.black.opacity(0.7))
                                .cornerRadius(4)
                                .padding(6)
                        }
                    }
                }

                // Title
                if let title = title {
                    VStack {
                        Spacer()
                        HStack {
                            Text(title)
                                .font(.caption)
                                .foregroundColor(.white)
                                .lineLimit(1)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                            Spacer()
                        }
                        .background(
                            LinearGradient(
                                colors: [.clear, .black.opacity(0.7)],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                    }
                }
            }
            .cornerRadius(12)
            .clipped()
        }
        .buttonStyle(.plain)
        .onAppear {
            generateThumbnail()
        }
    }

    private func generateThumbnail() {
        Task {
            let asset = AVAsset(url: url)
            let imageGenerator = AVAssetImageGenerator(asset: asset)
            imageGenerator.appliesPreferredTrackTransform = true

            do {
                let cgImage = try imageGenerator.copyCGImage(at: .zero, actualTime: nil)
                await MainActor.run {
                    thumbnail = UIImage(cgImage: cgImage)
                }
            } catch {
                print("Failed to generate thumbnail: \\(error)")
            }
        }
    }

    private func formatDuration(_ seconds: TimeInterval) -> String {
        let mins = Int(seconds) / 60
        let secs = Int(seconds) % 60
        return String(format: "%d:%02d", mins, secs)
    }
}

// MARK: - Video Gallery
struct VideoGallery: View {
    let videos: [VideoItem]
    var columns: Int = 2
    var onVideoTap: ((VideoItem) -> Void)?

    struct VideoItem: Identifiable {
        let id: String
        let url: URL
        var title: String?
        var duration: TimeInterval?
        var thumbnail: URL?
    }

    private var gridColumns: [GridItem] {
        Array(repeating: GridItem(.flexible(), spacing: 12), count: columns)
    }

    var body: some View {
        LazyVGrid(columns: gridColumns, spacing: 12) {
            ForEach(videos) { video in
                VideoThumbnail(
                    url: video.url,
                    duration: video.duration,
                    title: video.title
                ) {
                    onVideoTap?(video)
                }
            }
        }
    }
}

// MARK: - Background Video
struct BackgroundVideo: View {
    let url: URL
    var overlayOpacity: Double = 0.5

    @StateObject private var playerViewModel: VideoPlayerViewModel

    init(url: URL, overlayOpacity: Double = 0.5) {
        self.url = url
        self.overlayOpacity = overlayOpacity
        _playerViewModel = StateObject(wrappedValue: VideoPlayerViewModel(url: url, autoPlay: true, looping: true))
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                VideoPlayer(player: playerViewModel.player)
                    .disabled(true)
                    .aspectRatio(contentMode: .fill)
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()

                Color.black.opacity(overlayOpacity)
            }
        }
        .ignoresSafeArea()
        .onAppear {
            playerViewModel.player.isMuted = true
        }
    }
}

// MARK: - Preview
struct Video_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            if let url = URL(string: "https://example.com/video.mp4") {
                HubLabVideoPlayer(url: url)
                    .frame(height: 200)

                VideoThumbnail(
                    url: url,
                    duration: 125,
                    title: "Sample Video"
                )
                .frame(height: 120)
            }
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
      dependencies: ['androidx.media3:media3-exoplayer', 'androidx.media3:media3-ui'],
      files: [
        {
          filename: 'Video.kt',
          code: `package com.hublab.capsules

import android.net.Uri
import androidx.annotation.OptIn
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.Fullscreen
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import coil.compose.AsyncImage
import kotlinx.coroutines.delay

data class VideoItem(
    val id: String,
    val url: String,
    val title: String? = null,
    val thumbnail: String? = null,
    val duration: Long? = null
)

@OptIn(UnstableApi::class)
@Composable
fun VideoPlayer(
    url: String,
    modifier: Modifier = Modifier,
    autoPlay: Boolean = false,
    showControls: Boolean = true,
    looping: Boolean = false,
    onPlay: (() -> Unit)? = null,
    onPause: (() -> Unit)? = null,
    onEnded: (() -> Unit)? = null
) {
    val context = LocalContext.current
    var isPlaying by remember { mutableStateOf(autoPlay) }
    var currentPosition by remember { mutableLongStateOf(0L) }
    var duration by remember { mutableLongStateOf(0L) }
    var isMuted by remember { mutableStateOf(false) }
    var showControlsState by remember { mutableStateOf(true) }

    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            setMediaItem(MediaItem.fromUri(Uri.parse(url)))
            repeatMode = if (looping) Player.REPEAT_MODE_ONE else Player.REPEAT_MODE_OFF
            playWhenReady = autoPlay
            prepare()

            addListener(object : Player.Listener {
                override fun onIsPlayingChanged(playing: Boolean) {
                    isPlaying = playing
                    if (playing) onPlay?.invoke() else onPause?.invoke()
                }

                override fun onPlaybackStateChanged(state: Int) {
                    if (state == Player.STATE_ENDED) {
                        onEnded?.invoke()
                    }
                }
            })
        }
    }

    // Update position periodically
    LaunchedEffect(isPlaying) {
        while (isPlaying) {
            currentPosition = exoPlayer.currentPosition
            duration = exoPlayer.duration.coerceAtLeast(0)
            delay(500)
        }
    }

    // Auto-hide controls
    LaunchedEffect(showControlsState, isPlaying) {
        if (showControlsState && isPlaying) {
            delay(3000)
            showControlsState = false
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            exoPlayer.release()
        }
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(Color.Black)
            .clickable { showControlsState = !showControlsState }
    ) {
        AndroidView(
            factory = { ctx ->
                PlayerView(ctx).apply {
                    player = exoPlayer
                    useController = false // Use custom controls
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Custom Controls Overlay
        if (showControls) {
            androidx.compose.animation.AnimatedVisibility(
                visible = showControlsState || !isPlaying,
                modifier = Modifier.fillMaxSize()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.7f))
                            )
                        )
                ) {
                    // Center play/pause button
                    IconButton(
                        onClick = {
                            if (isPlaying) exoPlayer.pause() else exoPlayer.play()
                        },
                        modifier = Modifier
                            .align(Alignment.Center)
                            .size(64.dp)
                            .background(Color.White.copy(alpha = 0.9f), CircleShape)
                    ) {
                        Icon(
                            imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = if (isPlaying) "Pause" else "Play",
                            tint = Color.Black,
                            modifier = Modifier.size(32.dp)
                        )
                    }

                    // Bottom controls
                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        // Progress bar
                        Slider(
                            value = if (duration > 0) currentPosition.toFloat() / duration else 0f,
                            onValueChange = { fraction ->
                                exoPlayer.seekTo((fraction * duration).toLong())
                            },
                            colors = SliderDefaults.colors(
                                thumbColor = Color.White,
                                activeTrackColor = Color.White,
                                inactiveTrackColor = Color.White.copy(alpha = 0.3f)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Time display
                            Text(
                                text = "${formatDuration(currentPosition)} / ${formatDuration(duration)}",
                                color = Color.White,
                                style = MaterialTheme.typography.bodySmall
                            )

                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                // Mute button
                                IconButton(
                                    onClick = {
                                        isMuted = !isMuted
                                        exoPlayer.volume = if (isMuted) 0f else 1f
                                    },
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Icon(
                                        imageVector = if (isMuted) Icons.Default.VolumeOff else Icons.Default.VolumeUp,
                                        contentDescription = if (isMuted) "Unmute" else "Mute",
                                        tint = Color.White
                                    )
                                }

                                // Fullscreen button
                                IconButton(
                                    onClick = { /* Handle fullscreen */ },
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Fullscreen,
                                        contentDescription = "Fullscreen",
                                        tint = Color.White
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun formatDuration(millis: Long): String {
    val seconds = (millis / 1000) % 60
    val minutes = (millis / 1000) / 60
    return String.format("%d:%02d", minutes, seconds)
}

// Video Thumbnail
@Composable
fun VideoThumbnail(
    video: VideoItem,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(Color.Gray.copy(alpha = 0.3f))
            .clickable(enabled = onClick != null) { onClick?.invoke() }
    ) {
        // Thumbnail image
        video.thumbnail?.let { url ->
            AsyncImage(
                model = url,
                contentDescription = video.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        }

        // Play button overlay
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .size(44.dp)
                .background(Color.White.copy(alpha = 0.9f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.PlayArrow,
                contentDescription = "Play",
                tint = Color.Black
            )
        }

        // Duration badge
        video.duration?.let { duration ->
            Surface(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(8.dp),
                shape = RoundedCornerShape(4.dp),
                color = Color.Black.copy(alpha = 0.7f)
            ) {
                Text(
                    text = formatDuration(duration),
                    color = Color.White,
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }

        // Title overlay
        video.title?.let { title ->
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.7f))
                        )
                    )
                    .padding(8.dp)
            ) {
                Text(
                    text = title,
                    color = Color.White,
                    style = MaterialTheme.typography.bodySmall,
                    maxLines = 1
                )
            }
        }
    }
}

// Video Gallery Grid
@Composable
fun VideoGallery(
    videos: List<VideoItem>,
    modifier: Modifier = Modifier,
    columns: Int = 2,
    onVideoClick: ((VideoItem) -> Unit)? = null
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(columns),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = modifier
    ) {
        items(videos, key = { it.id }) { video ->
            VideoThumbnail(
                video = video,
                modifier = Modifier.aspectRatio(16f / 9f),
                onClick = { onVideoClick?.invoke(video) }
            )
        }
    }
}

// Background Video for Hero Sections
@OptIn(UnstableApi::class)
@Composable
fun BackgroundVideo(
    url: String,
    modifier: Modifier = Modifier,
    overlayColor: Color = Color.Black,
    overlayAlpha: Float = 0.5f,
    content: @Composable BoxScope.() -> Unit = {}
) {
    val context = LocalContext.current

    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            setMediaItem(MediaItem.fromUri(Uri.parse(url)))
            repeatMode = Player.REPEAT_MODE_ONE
            volume = 0f
            playWhenReady = true
            prepare()
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            exoPlayer.release()
        }
    }

    Box(modifier = modifier) {
        AndroidView(
            factory = { ctx ->
                PlayerView(ctx).apply {
                    player = exoPlayer
                    useController = false
                    resizeMode = androidx.media3.ui.AspectRatioFrameLayout.RESIZE_MODE_ZOOM
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(overlayColor.copy(alpha = overlayAlpha))
        )

        // Content
        content()
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
          filename: 'Video.tsx',
          code: `// Desktop uses native HTML5 video with enhanced controls
export { VideoPlayer, VideoThumbnail, VideoGallery, BackgroundVideo } from './Video'
`
        }
      ]
    }
  },
  props: [
    { name: 'src', type: 'string', description: 'Video source URL', required: true },
    { name: 'poster', type: 'string', description: 'Poster image URL' },
    { name: 'title', type: 'string', description: 'Video title' },
    { name: 'autoPlay', type: 'boolean', description: 'Auto-play video', default: false },
    { name: 'muted', type: 'boolean', description: 'Mute video', default: false },
    { name: 'loop', type: 'boolean', description: 'Loop video', default: false },
    { name: 'controls', type: 'boolean', description: 'Show controls', default: true },
    { name: 'aspectRatio', type: "'16:9' | '4:3' | '1:1' | '9:16'", description: 'Aspect ratio', default: '16:9' },
    { name: 'onPlay', type: '() => void', description: 'Callback when video plays' },
    { name: 'onPause', type: '() => void', description: 'Callback when video pauses' },
    { name: 'onEnded', type: '() => void', description: 'Callback when video ends' }
  ],
  examples: [
    {
      title: 'Basic Video Player',
      code: `<VideoPlayer
  src="https://example.com/video.mp4"
  poster="/thumbnail.jpg"
  title="Product Demo"
/>`
    },
    {
      title: 'Video Thumbnail',
      code: `<VideoThumbnail
  src="https://example.com/video.mp4"
  poster="/thumb.jpg"
  duration={125}
  title="Tutorial"
  onClick={() => setPlaying(true)}
/>`
    },
    {
      title: 'Background Video',
      code: `<BackgroundVideo
  src="/hero-video.mp4"
  overlay
  overlayOpacity={0.5}
>
  <h1>Welcome</h1>
</BackgroundVideo>`
    }
  ]
}
