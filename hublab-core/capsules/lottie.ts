/**
 * Lottie Animation Capsule - Multi-Platform
 * Lottie/JSON animation player
 */

import { CapsuleDefinition } from './types'

export const LottieCapsule: CapsuleDefinition = {
  id: 'lottie',
  name: 'Lottie Animation',
  description: 'Lottie JSON animation player',
  category: 'media',
  tags: ['lottie', 'animation', 'json', 'motion'],
  version: '1.0.0',

  props: [
    {
      name: 'source',
      type: 'string',
      required: true,
      description: 'URL or path to Lottie JSON file'
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Auto play animation'
    },
    {
      name: 'loop',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Loop animation'
    },
    {
      name: 'speed',
      type: 'number',
      required: false,
      default: 1,
      description: 'Playback speed'
    },
    {
      name: 'width',
      type: 'string',
      required: false,
      default: '200px',
      description: 'Animation width'
    },
    {
      name: 'height',
      type: 'string',
      required: false,
      default: '200px',
      description: 'Animation height'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react', 'lottie-react'],
      code: `
import React from 'react'
import Lottie from 'lottie-react'

interface LottieAnimationProps {
  source: string | object
  autoPlay?: boolean
  loop?: boolean
  speed?: number
  width?: string
  height?: string
}

export function LottieAnimation({
  source,
  autoPlay = true,
  loop = true,
  speed = 1,
  width = '200px',
  height = '200px'
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = React.useState<object | null>(
    typeof source === 'object' ? source : null
  )

  React.useEffect(() => {
    if (typeof source === 'string') {
      fetch(source)
        .then(res => res.json())
        .then(setAnimationData)
        .catch(console.error)
    }
  }, [source])

  if (!animationData) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg animate-pulse"
      >
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    )
  }

  return (
    <div style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoPlay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
`
    },
    ios: {
      framework: 'swiftui',
      minimumVersion: '15.0',
      dependencies: ['lottie-ios'],
      code: `
import SwiftUI
import Lottie

struct LottieAnimation: View {
    let source: String
    var autoPlay: Bool = true
    var loop: Bool = true
    var speed: CGFloat = 1
    var width: CGFloat = 200
    var height: CGFloat = 200

    var body: some View {
        LottieView(name: source, loopMode: loop ? .loop : .playOnce)
            .frame(width: width, height: height)
    }
}

struct LottieView: UIViewRepresentable {
    let name: String
    let loopMode: LottieLoopMode

    func makeUIView(context: Context) -> LottieAnimationView {
        let view = LottieAnimationView(name: name)
        view.loopMode = loopMode
        view.play()
        view.contentMode = .scaleAspectFit
        return view
    }

    func updateUIView(_ uiView: LottieAnimationView, context: Context) {}
}
`
    },
    android: {
      framework: 'compose',
      minimumVersion: '1.0.0',
      dependencies: ['com.airbnb.android:lottie-compose'],
      code: `
@Composable
fun LottieAnimation(
    source: String,
    autoPlay: Boolean = true,
    loop: Boolean = true,
    speed: Float = 1f,
    width: Dp = 200.dp,
    height: Dp = 200.dp
) {
    val composition by rememberLottieComposition(
        LottieCompositionSpec.Url(source)
    )

    val progress by animateLottieCompositionAsState(
        composition = composition,
        iterations = if (loop) LottieConstants.IterateForever else 1,
        speed = speed,
        isPlaying = autoPlay
    )

    LottieAnimation(
        composition = composition,
        progress = { progress },
        modifier = Modifier.size(width, height)
    )
}
`
    },
    desktop: {
      framework: 'electron-react',
      dependencies: ['react', 'lottie-react'],
      code: `// Same as web implementation`
    }
  }
}
