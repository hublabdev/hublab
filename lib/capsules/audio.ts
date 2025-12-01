import type { CapsuleDefinition } from './types'

export const AudioCapsule: CapsuleDefinition = {
  id: 'audio',
  name: 'Audio',
  description: 'Audio player component with waveform visualization and controls',
  category: 'media',
  tags: ['audio', 'player', 'music', 'podcast', 'sound', 'waveform'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'Audio.tsx',
          code: `import React, { useRef, useState, useEffect, useCallback } from 'react'

interface AudioPlayerProps {
  src: string
  title?: string
  artist?: string
  coverImage?: string
  autoPlay?: boolean
  loop?: boolean
  showWaveform?: boolean
  variant?: 'default' | 'minimal' | 'card'
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  className?: string
}

export function AudioPlayer({
  src,
  title,
  artist,
  coverImage,
  autoPlay = false,
  loop = false,
  showWaveform = false,
  variant = 'default',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  className = ''
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [waveformData, setWaveformData] = useState<number[]>([])

  // Generate waveform visualization data
  useEffect(() => {
    if (showWaveform && src) {
      generateWaveform()
    }
  }, [src, showWaveform])

  const generateWaveform = async () => {
    try {
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const rawData = audioBuffer.getChannelData(0)
      const samples = 100
      const blockSize = Math.floor(rawData.length / samples)
      const filteredData: number[] = []

      for (let i = 0; i < samples; i++) {
        let sum = 0
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[i * blockSize + j])
        }
        filteredData.push(sum / blockSize)
      }

      const maxVal = Math.max(...filteredData)
      setWaveformData(filteredData.map(d => d / maxVal))

      audioContext.close()
    } catch (error) {
      console.error('Failed to generate waveform:', error)
    }
  }

  // Draw waveform
  useEffect(() => {
    if (!showWaveform || !canvasRef.current || waveformData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const barWidth = width / waveformData.length
    const progress = duration > 0 ? currentTime / duration : 0

    ctx.clearRect(0, 0, width, height)

    waveformData.forEach((value, index) => {
      const x = index * barWidth
      const barHeight = value * height * 0.8
      const y = (height - barHeight) / 2

      const isPlayed = index / waveformData.length < progress
      ctx.fillStyle = isPlayed ? '#3b82f6' : '#d1d5db'
      ctx.fillRect(x, y, barWidth - 1, barHeight)
    })
  }, [waveformData, currentTime, duration, showWaveform])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime, audio.duration)
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

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', () => setIsLoading(false))
    audio.addEventListener('waiting', () => setIsLoading(true))

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onPlay, onPause, onEnded, onTimeUpdate])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const vol = Number(e.target.value)
    audio.volume = vol
    setVolume(vol)
    setIsMuted(vol === 0)
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isMuted) {
      audio.muted = false
      audio.volume = volume || 0.5
      setIsMuted(false)
    } else {
      audio.muted = true
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.min(audio.currentTime + 15, duration)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.max(audio.currentTime - 15, 0)
  }

  // Render based on variant
  if (variant === 'minimal') {
    return (
      <div className={\`flex items-center gap-3 \${className}\`}>
        <audio ref={audioRef} src={src} autoPlay={autoPlay} loop={loop} />

        <button onClick={togglePlay} className="text-gray-700 hover:text-blue-600">
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {title && <p className="text-sm font-medium truncate">{title}</p>}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={\`bg-white rounded-xl shadow-lg overflow-hidden max-w-sm \${className}\`}>
        <audio ref={audioRef} src={src} autoPlay={autoPlay} loop={loop} />

        {/* Cover Image */}
        <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 relative">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-24 h-24 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info & Controls */}
        <div className="p-4">
          {title && <h3 className="font-semibold text-gray-900 truncate">{title}</h3>}
          {artist && <p className="text-sm text-gray-500">{artist}</p>}

          {/* Waveform or Progress */}
          <div className="mt-4">
            {showWaveform && waveformData.length > 0 ? (
              <canvas ref={canvasRef} className="w-full h-12 cursor-pointer" />
            ) : (
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
            )}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <button onClick={skipBackward} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button onClick={skipForward} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={\`bg-gray-100 rounded-xl p-4 \${className}\`}>
      <audio ref={audioRef} src={src} autoPlay={autoPlay} loop={loop} />

      <div className="flex items-center gap-4">
        {/* Cover/Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </div>

        {/* Info & Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="truncate">
              {title && <p className="font-medium text-gray-900 truncate">{title}</p>}
              {artist && <p className="text-sm text-gray-500 truncate">{artist}</p>}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <button onClick={toggleMute} className="text-gray-600 hover:text-gray-900">
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
                className="w-16 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Progress */}
          {showWaveform && waveformData.length > 0 ? (
            <canvas ref={canvasRef} className="w-full h-10 cursor-pointer mb-1" />
          ) : (
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer mb-1"
            />
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{formatTime(currentTime)} / {formatTime(duration)}</span>

            <div className="flex items-center gap-2">
              <button onClick={skipBackward} className="p-1 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button onClick={skipForward} className="p-1 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Audio playlist
interface PlaylistItem {
  id: string
  src: string
  title: string
  artist?: string
  coverImage?: string
  duration?: number
}

interface AudioPlaylistProps {
  tracks: PlaylistItem[]
  currentTrackIndex?: number
  onTrackChange?: (index: number, track: PlaylistItem) => void
  className?: string
}

export function AudioPlaylist({
  tracks,
  currentTrackIndex = 0,
  onTrackChange,
  className = ''
}: AudioPlaylistProps) {
  const [currentIndex, setCurrentIndex] = useState(currentTrackIndex)
  const currentTrack = tracks[currentIndex]

  const handleTrackEnded = () => {
    const nextIndex = (currentIndex + 1) % tracks.length
    setCurrentIndex(nextIndex)
    onTrackChange?.(nextIndex, tracks[nextIndex])
  }

  const selectTrack = (index: number) => {
    setCurrentIndex(index)
    onTrackChange?.(index, tracks[index])
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div className={\`bg-white rounded-xl shadow-lg overflow-hidden \${className}\`}>
      {/* Current track player */}
      {currentTrack && (
        <AudioPlayer
          key={currentTrack.id}
          src={currentTrack.src}
          title={currentTrack.title}
          artist={currentTrack.artist}
          coverImage={currentTrack.coverImage}
          variant="card"
          onEnded={handleTrackEnded}
        />
      )}

      {/* Track list */}
      <div className="max-h-64 overflow-y-auto">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => selectTrack(index)}
            className={\`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors \${
              index === currentIndex ? 'bg-blue-50' : ''
            }\`}
          >
            <span className={\`w-6 text-center text-sm \${
              index === currentIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
            }\`}>
              {index === currentIndex ? (
                <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                index + 1
              )}
            </span>

            <div className="flex-1 text-left min-w-0">
              <p className={\`text-sm truncate \${
                index === currentIndex ? 'text-blue-600 font-medium' : 'text-gray-900'
              }\`}>
                {track.title}
              </p>
              {track.artist && (
                <p className="text-xs text-gray-500 truncate">{track.artist}</p>
              )}
            </div>

            <span className="text-xs text-gray-400">{formatDuration(track.duration)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Voice recorder
interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void
  maxDuration?: number
  className?: string
}

export function VoiceRecorder({
  onRecordingComplete,
  maxDuration = 120,
  className = ''
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number>()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete?.(blob, url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = window.setInterval(() => {
        setRecordingTime(t => {
          if (t >= maxDuration) {
            stopRecording()
            return t
          }
          return t + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setRecordingTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div className={\`bg-gray-100 rounded-xl p-4 \${className}\`}>
      {audioUrl ? (
        <div className="space-y-3">
          <audio src={audioUrl} controls className="w-full" />
          <div className="flex justify-center gap-2">
            <button
              onClick={deleteRecording}
              className="px-4 py-2 text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <span className={\`text-2xl font-mono \${isRecording ? 'text-red-500' : 'text-gray-400'}\`}>
              {formatTime(recordingTime)}
            </span>
            {isRecording && (
              <span className="ml-2 text-sm text-gray-500">/ {formatTime(maxDuration)}</span>
            )}
          </div>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={\`w-16 h-16 rounded-full flex items-center justify-center transition-all \${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600'
            }\`}
          >
            {isRecording ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
            )}
          </button>

          <p className="mt-3 text-sm text-gray-500">
            {isRecording ? 'Tap to stop' : 'Tap to record'}
          </p>
        </div>
      )}
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
      dependencies: ['AVFoundation'],
      files: [
        {
          filename: 'Audio.swift',
          code: `import SwiftUI
import AVFoundation
import Combine

// MARK: - Audio Player
struct HubLabAudioPlayer: View {
    let url: URL
    var title: String?
    var artist: String?
    var coverImage: URL?
    var variant: AudioPlayerVariant = .default

    @StateObject private var audioManager = AudioPlayerManager()
    @State private var isPlaying = false

    enum AudioPlayerVariant {
        case \`default\`, minimal, card
    }

    var body: some View {
        Group {
            switch variant {
            case .minimal:
                minimalPlayer
            case .card:
                cardPlayer
            case .default:
                defaultPlayer
            }
        }
        .onAppear {
            audioManager.setupPlayer(url: url)
        }
        .onDisappear {
            audioManager.stop()
        }
    }

    // MARK: - Minimal Player
    private var minimalPlayer: some View {
        HStack(spacing: 12) {
            Button {
                audioManager.togglePlayPause()
            } label: {
                Image(systemName: audioManager.isPlaying ? "pause.fill" : "play.fill")
                    .font(.title2)
                    .foregroundColor(.primary)
            }

            VStack(alignment: .leading, spacing: 2) {
                if let title = title {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .lineLimit(1)
                }

                HStack(spacing: 8) {
                    Text(formatTime(audioManager.currentTime))
                        .font(.caption)
                        .foregroundColor(.secondary)

                    ProgressView(value: audioManager.progress)
                        .tint(.blue)

                    Text(formatTime(audioManager.duration))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
    }

    // MARK: - Card Player
    private var cardPlayer: some View {
        VStack(spacing: 0) {
            // Cover
            ZStack {
                LinearGradient(
                    colors: [.blue, .purple],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )

                if let coverUrl = coverImage {
                    AsyncImage(url: coverUrl) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        ProgressView()
                    }
                } else {
                    Image(systemName: "music.note")
                        .font(.system(size: 60))
                        .foregroundColor(.white.opacity(0.5))
                }
            }
            .aspectRatio(1, contentMode: .fit)
            .clipped()

            // Info & Controls
            VStack(spacing: 16) {
                VStack(spacing: 4) {
                    if let title = title {
                        Text(title)
                            .font(.headline)
                            .lineLimit(1)
                    }
                    if let artist = artist {
                        Text(artist)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }

                // Progress
                VStack(spacing: 4) {
                    Slider(value: Binding(
                        get: { audioManager.progress },
                        set: { audioManager.seek(to: $0) }
                    ))
                    .tint(.blue)

                    HStack {
                        Text(formatTime(audioManager.currentTime))
                        Spacer()
                        Text(formatTime(audioManager.duration))
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }

                // Controls
                HStack(spacing: 32) {
                    Button {
                        audioManager.skip(by: -15)
                    } label: {
                        Image(systemName: "gobackward.15")
                            .font(.title2)
                    }

                    Button {
                        audioManager.togglePlayPause()
                    } label: {
                        Image(systemName: audioManager.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                            .font(.system(size: 56))
                    }

                    Button {
                        audioManager.skip(by: 15)
                    } label: {
                        Image(systemName: "goforward.15")
                            .font(.title2)
                    }
                }
                .foregroundColor(.primary)
            }
            .padding()
        }
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 4)
    }

    // MARK: - Default Player
    private var defaultPlayer: some View {
        HStack(spacing: 16) {
            // Cover
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))

                if let coverUrl = coverImage {
                    AsyncImage(url: coverUrl) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        EmptyView()
                    }
                    .cornerRadius(8)
                } else {
                    Image(systemName: "music.note")
                        .font(.title)
                        .foregroundColor(.white)
                }
            }
            .frame(width: 64, height: 64)

            VStack(alignment: .leading, spacing: 8) {
                // Info
                VStack(alignment: .leading, spacing: 2) {
                    if let title = title {
                        Text(title)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .lineLimit(1)
                    }
                    if let artist = artist {
                        Text(artist)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                // Progress
                ProgressView(value: audioManager.progress)
                    .tint(.blue)

                // Time & Controls
                HStack {
                    Text("\\(formatTime(audioManager.currentTime)) / \\(formatTime(audioManager.duration))")
                        .font(.caption2)
                        .foregroundColor(.secondary)

                    Spacer()

                    HStack(spacing: 16) {
                        Button {
                            audioManager.skip(by: -15)
                        } label: {
                            Image(systemName: "gobackward.15")
                        }

                        Button {
                            audioManager.togglePlayPause()
                        } label: {
                            Image(systemName: audioManager.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                                .font(.title)
                        }

                        Button {
                            audioManager.skip(by: 15)
                        } label: {
                            Image(systemName: "goforward.15")
                        }
                    }
                    .foregroundColor(.blue)
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }

    private func formatTime(_ time: TimeInterval) -> String {
        let mins = Int(time) / 60
        let secs = Int(time) % 60
        return String(format: "%d:%02d", mins, secs)
    }
}

// MARK: - Audio Player Manager
class AudioPlayerManager: ObservableObject {
    @Published var isPlaying = false
    @Published var currentTime: TimeInterval = 0
    @Published var duration: TimeInterval = 0
    @Published var progress: Double = 0

    private var player: AVAudioPlayer?
    private var timer: Timer?

    func setupPlayer(url: URL) {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)

            player = try AVAudioPlayer(contentsOf: url)
            player?.prepareToPlay()
            duration = player?.duration ?? 0
        } catch {
            print("Failed to setup audio: \\(error)")
        }
    }

    func togglePlayPause() {
        guard let player = player else { return }

        if player.isPlaying {
            player.pause()
            timer?.invalidate()
            isPlaying = false
        } else {
            player.play()
            startTimer()
            isPlaying = true
        }
    }

    func stop() {
        player?.stop()
        timer?.invalidate()
        isPlaying = false
    }

    func seek(to progress: Double) {
        guard let player = player else { return }
        let time = duration * progress
        player.currentTime = time
        currentTime = time
        self.progress = progress
    }

    func skip(by seconds: TimeInterval) {
        guard let player = player else { return }
        let newTime = max(0, min(player.currentTime + seconds, duration))
        player.currentTime = newTime
        currentTime = newTime
        progress = duration > 0 ? newTime / duration : 0
    }

    private func startTimer() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            guard let self = self, let player = self.player else { return }
            self.currentTime = player.currentTime
            self.progress = self.duration > 0 ? player.currentTime / self.duration : 0

            if !player.isPlaying {
                self.isPlaying = false
                self.timer?.invalidate()
            }
        }
    }
}

// MARK: - Voice Recorder
struct VoiceRecorder: View {
    @State private var isRecording = false
    @State private var recordingTime: Int = 0
    @State private var audioURL: URL?
    @StateObject private var recorder = AudioRecorderManager()
    var maxDuration: Int = 120
    var onRecordingComplete: ((URL) -> Void)?

    var body: some View {
        VStack(spacing: 20) {
            if let url = audioURL {
                // Playback
                HubLabAudioPlayer(url: url, variant: .minimal)

                Button(role: .destructive) {
                    audioURL = nil
                    recordingTime = 0
                } label: {
                    Text("Delete")
                }
            } else {
                // Timer
                Text(formatTime(recordingTime))
                    .font(.system(size: 32, weight: .light, design: .monospaced))
                    .foregroundColor(isRecording ? .red : .secondary)

                if isRecording {
                    Text("/ \\(formatTime(maxDuration))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                // Record button
                Button {
                    if isRecording {
                        stopRecording()
                    } else {
                        startRecording()
                    }
                } label: {
                    ZStack {
                        Circle()
                            .fill(isRecording ? Color.red : Color.blue)
                            .frame(width: 64, height: 64)

                        if isRecording {
                            RoundedRectangle(cornerRadius: 4)
                                .fill(Color.white)
                                .frame(width: 20, height: 20)
                        } else {
                            Image(systemName: "mic.fill")
                                .font(.title)
                                .foregroundColor(.white)
                        }
                    }
                }

                Text(isRecording ? "Tap to stop" : "Tap to record")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }

    private func startRecording() {
        recorder.startRecording()
        isRecording = true
        recordingTime = 0

        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if !isRecording {
                timer.invalidate()
                return
            }
            recordingTime += 1
            if recordingTime >= maxDuration {
                stopRecording()
                timer.invalidate()
            }
        }
    }

    private func stopRecording() {
        isRecording = false
        if let url = recorder.stopRecording() {
            audioURL = url
            onRecordingComplete?(url)
        }
    }

    private func formatTime(_ seconds: Int) -> String {
        String(format: "%d:%02d", seconds / 60, seconds % 60)
    }
}

// MARK: - Audio Recorder Manager
class AudioRecorderManager: NSObject, ObservableObject, AVAudioRecorderDelegate {
    private var audioRecorder: AVAudioRecorder?
    private var recordingURL: URL?

    func startRecording() {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let fileName = "recording_\\(Date().timeIntervalSince1970).m4a"
        recordingURL = paths[0].appendingPathComponent(fileName)

        let settings: [String: Any] = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 44100,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]

        do {
            try AVAudioSession.sharedInstance().setCategory(.playAndRecord, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)

            audioRecorder = try AVAudioRecorder(url: recordingURL!, settings: settings)
            audioRecorder?.delegate = self
            audioRecorder?.record()
        } catch {
            print("Recording failed: \\(error)")
        }
    }

    func stopRecording() -> URL? {
        audioRecorder?.stop()
        return recordingURL
    }
}

// MARK: - Preview
struct Audio_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            if let url = Bundle.main.url(forResource: "sample", withExtension: "mp3") {
                HubLabAudioPlayer(
                    url: url,
                    title: "Sample Track",
                    artist: "Artist Name",
                    variant: .card
                )
            }

            VoiceRecorder()
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
      dependencies: ['androidx.media3:media3-exoplayer'],
      files: [
        {
          filename: 'Audio.kt',
          code: `package com.hublab.capsules

import android.Manifest
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.net.Uri
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay
import java.io.File

data class AudioTrack(
    val id: String,
    val url: String,
    val title: String,
    val artist: String? = null,
    val coverImage: String? = null,
    val duration: Long? = null
)

enum class AudioPlayerVariant {
    Default, Minimal, Card
}

@Composable
fun AudioPlayer(
    url: String,
    modifier: Modifier = Modifier,
    title: String? = null,
    artist: String? = null,
    coverImage: String? = null,
    variant: AudioPlayerVariant = AudioPlayerVariant.Default,
    onPlay: (() -> Unit)? = null,
    onPause: (() -> Unit)? = null,
    onEnded: (() -> Unit)? = null
) {
    val context = LocalContext.current
    var isPlaying by remember { mutableStateOf(false) }
    var currentPosition by remember { mutableLongStateOf(0L) }
    var duration by remember { mutableLongStateOf(0L) }
    var isLoading by remember { mutableStateOf(true) }

    val mediaPlayer = remember {
        MediaPlayer().apply {
            setDataSource(context, Uri.parse(url))
            prepareAsync()
            setOnPreparedListener {
                duration = it.duration.toLong()
                isLoading = false
            }
            setOnCompletionListener {
                isPlaying = false
                onEnded?.invoke()
            }
        }
    }

    // Update position
    LaunchedEffect(isPlaying) {
        while (isPlaying) {
            currentPosition = mediaPlayer.currentPosition.toLong()
            delay(500)
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            mediaPlayer.release()
        }
    }

    fun togglePlayPause() {
        if (mediaPlayer.isPlaying) {
            mediaPlayer.pause()
            isPlaying = false
            onPause?.invoke()
        } else {
            mediaPlayer.start()
            isPlaying = true
            onPlay?.invoke()
        }
    }

    fun seekTo(position: Long) {
        mediaPlayer.seekTo(position.toInt())
        currentPosition = position
    }

    fun skip(seconds: Int) {
        val newPosition = (currentPosition + seconds * 1000).coerceIn(0, duration)
        seekTo(newPosition)
    }

    when (variant) {
        AudioPlayerVariant.Minimal -> MinimalAudioPlayer(
            isPlaying = isPlaying,
            isLoading = isLoading,
            currentPosition = currentPosition,
            duration = duration,
            title = title,
            onPlayPause = { togglePlayPause() },
            onSeek = { seekTo((it * duration).toLong()) },
            modifier = modifier
        )

        AudioPlayerVariant.Card -> CardAudioPlayer(
            isPlaying = isPlaying,
            isLoading = isLoading,
            currentPosition = currentPosition,
            duration = duration,
            title = title,
            artist = artist,
            coverImage = coverImage,
            onPlayPause = { togglePlayPause() },
            onSeek = { seekTo((it * duration).toLong()) },
            onSkipBack = { skip(-15) },
            onSkipForward = { skip(15) },
            modifier = modifier
        )

        AudioPlayerVariant.Default -> DefaultAudioPlayer(
            isPlaying = isPlaying,
            isLoading = isLoading,
            currentPosition = currentPosition,
            duration = duration,
            title = title,
            artist = artist,
            coverImage = coverImage,
            onPlayPause = { togglePlayPause() },
            onSeek = { seekTo((it * duration).toLong()) },
            onSkipBack = { skip(-15) },
            onSkipForward = { skip(15) },
            modifier = modifier
        )
    }
}

@Composable
private fun MinimalAudioPlayer(
    isPlaying: Boolean,
    isLoading: Boolean,
    currentPosition: Long,
    duration: Long,
    title: String?,
    onPlayPause: () -> Unit,
    onSeek: (Float) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        IconButton(onClick = onPlayPause) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
            } else {
                Icon(
                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (isPlaying) "Pause" else "Play"
                )
            }
        }

        Column(modifier = Modifier.weight(1f)) {
            title?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodyMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = formatDuration(currentPosition),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )

                Slider(
                    value = if (duration > 0) currentPosition.toFloat() / duration else 0f,
                    onValueChange = onSeek,
                    modifier = Modifier.weight(1f)
                )

                Text(
                    text = formatDuration(duration),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
    }
}

@Composable
private fun CardAudioPlayer(
    isPlaying: Boolean,
    isLoading: Boolean,
    currentPosition: Long,
    duration: Long,
    title: String?,
    artist: String?,
    coverImage: String?,
    onPlayPause: () -> Unit,
    onSeek: (Float) -> Unit,
    onSkipBack: () -> Unit,
    onSkipForward: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        shadowElevation = 8.dp
    ) {
        Column {
            // Cover Image
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFF3B82F6), Color(0xFF8B5CF6))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (coverImage != null) {
                    AsyncImage(
                        model = coverImage,
                        contentDescription = title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.MusicNote,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.5f),
                        modifier = Modifier.size(80.dp)
                    )
                }
            }

            // Controls
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Title & Artist
                title?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                artist?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Progress
                Column(modifier = Modifier.fillMaxWidth()) {
                    Slider(
                        value = if (duration > 0) currentPosition.toFloat() / duration else 0f,
                        onValueChange = onSeek
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = formatDuration(currentPosition),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Text(
                            text = formatDuration(duration),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Playback Controls
                Row(
                    horizontalArrangement = Arrangement.spacedBy(24.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onSkipBack) {
                        Icon(Icons.Default.Replay10, "Rewind 15s")
                    }

                    FloatingActionButton(
                        onClick = onPlayPause,
                        containerColor = MaterialTheme.colorScheme.primary
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Icon(
                                imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = if (isPlaying) "Pause" else "Play",
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }

                    IconButton(onClick = onSkipForward) {
                        Icon(Icons.Default.Forward10, "Forward 15s")
                    }
                }
            }
        }
    }
}

@Composable
private fun DefaultAudioPlayer(
    isPlaying: Boolean,
    isLoading: Boolean,
    currentPosition: Long,
    duration: Long,
    title: String?,
    artist: String?,
    coverImage: String?,
    onPlayPause: () -> Unit,
    onSeek: (Float) -> Unit,
    onSkipBack: () -> Unit,
    onSkipForward: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Cover
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFF3B82F6), Color(0xFF8B5CF6))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (coverImage != null) {
                    AsyncImage(
                        model = coverImage,
                        contentDescription = title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.MusicNote,
                        contentDescription = null,
                        tint = Color.White
                    )
                }
            }

            // Info & Controls
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        title?.let {
                            Text(
                                text = it,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Medium,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                        artist?.let {
                            Text(
                                text = it,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Progress
                LinearProgressIndicator(
                    progress = { if (duration > 0) currentPosition.toFloat() / duration else 0f },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "\${formatDuration(currentPosition)} / \${formatDuration(duration)}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )

                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        IconButton(onClick = onSkipBack, modifier = Modifier.size(32.dp)) {
                            Icon(Icons.Default.Replay10, "Rewind", Modifier.size(20.dp))
                        }

                        IconButton(
                            onClick = onPlayPause,
                            modifier = Modifier
                                .size(40.dp)
                                .background(MaterialTheme.colorScheme.primary, CircleShape)
                        ) {
                            if (isLoading) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    color = Color.White,
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Icon(
                                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                    contentDescription = if (isPlaying) "Pause" else "Play",
                                    tint = Color.White,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        IconButton(onClick = onSkipForward, modifier = Modifier.size(32.dp)) {
                            Icon(Icons.Default.Forward10, "Forward", Modifier.size(20.dp))
                        }
                    }
                }
            }
        }
    }
}

// Voice Recorder
@Composable
fun VoiceRecorder(
    modifier: Modifier = Modifier,
    maxDuration: Int = 120,
    onRecordingComplete: ((File) -> Unit)? = null
) {
    val context = LocalContext.current
    var isRecording by remember { mutableStateOf(false) }
    var recordingTime by remember { mutableIntStateOf(0) }
    var audioFile by remember { mutableStateOf<File?>(null) }
    var hasPermission by remember { mutableStateOf(false) }

    val mediaRecorder = remember { mutableStateOf<MediaRecorder?>(null) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission = granted
    }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
    }

    LaunchedEffect(isRecording) {
        if (isRecording) {
            while (isRecording && recordingTime < maxDuration) {
                delay(1000)
                recordingTime++
            }
            if (recordingTime >= maxDuration) {
                isRecording = false
            }
        }
    }

    fun startRecording() {
        val file = File(context.cacheDir, "recording_\${System.currentTimeMillis()}.m4a")
        audioFile = file

        mediaRecorder.value = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(context)
        } else {
            @Suppress("DEPRECATION")
            MediaRecorder()
        }.apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setOutputFile(file.absolutePath)
            prepare()
            start()
        }

        isRecording = true
        recordingTime = 0
    }

    fun stopRecording() {
        mediaRecorder.value?.apply {
            stop()
            release()
        }
        mediaRecorder.value = null
        isRecording = false

        audioFile?.let { onRecordingComplete?.invoke(it) }
    }

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (audioFile != null && !isRecording) {
                // Playback mode
                AudioPlayer(
                    url = audioFile!!.toURI().toString(),
                    variant = AudioPlayerVariant.Minimal
                )

                Spacer(modifier = Modifier.height(16.dp))

                TextButton(
                    onClick = {
                        audioFile?.delete()
                        audioFile = null
                        recordingTime = 0
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = Color.Red)
                ) {
                    Text("Delete")
                }
            } else {
                // Recording mode
                Text(
                    text = formatDuration(recordingTime.toLong() * 1000),
                    style = MaterialTheme.typography.headlineMedium,
                    color = if (isRecording) Color.Red else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )

                if (isRecording) {
                    Text(
                        text = "/ \${formatDuration(maxDuration.toLong() * 1000)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                FloatingActionButton(
                    onClick = {
                        if (hasPermission) {
                            if (isRecording) stopRecording() else startRecording()
                        }
                    },
                    containerColor = if (isRecording) Color.Red else MaterialTheme.colorScheme.primary
                ) {
                    Icon(
                        imageVector = if (isRecording) Icons.Default.Stop else Icons.Default.Mic,
                        contentDescription = if (isRecording) "Stop" else "Record"
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = if (isRecording) "Tap to stop" else "Tap to record",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
    }
}

private fun formatDuration(millis: Long): String {
    val seconds = (millis / 1000) % 60
    val minutes = (millis / 1000) / 60
    return String.format("%d:%02d", minutes, seconds)
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
          filename: 'Audio.tsx',
          code: `// Desktop uses native HTML5 audio with enhanced controls
export { AudioPlayer, AudioPlaylist, VoiceRecorder } from './Audio'
`
        }
      ]
    }
  },
  props: [
    { name: 'src', type: 'string', description: 'Audio source URL', required: true },
    { name: 'title', type: 'string', description: 'Track title' },
    { name: 'artist', type: 'string', description: 'Artist name' },
    { name: 'coverImage', type: 'string', description: 'Album cover image URL' },
    { name: 'autoPlay', type: 'boolean', description: 'Auto-play audio', default: false },
    { name: 'loop', type: 'boolean', description: 'Loop audio', default: false },
    { name: 'showWaveform', type: 'boolean', description: 'Show waveform visualization', default: false },
    { name: 'variant', type: "'default' | 'minimal' | 'card'", description: 'Player style variant', default: 'default' },
    { name: 'onPlay', type: '() => void', description: 'Callback when audio plays' },
    { name: 'onPause', type: '() => void', description: 'Callback when audio pauses' },
    { name: 'onEnded', type: '() => void', description: 'Callback when audio ends' }
  ],
  examples: [
    {
      title: 'Basic Audio Player',
      code: `<AudioPlayer
  src="https://example.com/track.mp3"
  title="Song Title"
  artist="Artist Name"
  coverImage="/cover.jpg"
/>`
    },
    {
      title: 'Card Style Player',
      code: `<AudioPlayer
  src="/podcast.mp3"
  title="Episode 1"
  artist="My Podcast"
  variant="card"
  showWaveform
/>`
    },
    {
      title: 'Voice Recorder',
      code: `<VoiceRecorder
  maxDuration={60}
  onRecordingComplete={(blob, url) => uploadAudio(blob)}
/>`
    }
  ]
}
