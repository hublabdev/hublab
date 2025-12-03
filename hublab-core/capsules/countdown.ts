/**
 * Countdown/Timer Capsule - Multi-Platform
 * Countdown timer with customizable format
 */

import { CapsuleDefinition } from './types'

export const CountdownCapsule: CapsuleDefinition = {
  id: 'countdown',
  name: 'Countdown',
  description: 'Countdown timer for events, sales, or time limits',
  category: 'feedback',
  tags: ['countdown', 'timer', 'clock', 'deadline'],
  version: '1.0.0',

  props: [
    {
      name: 'targetDate',
      type: 'string',
      required: true,
      description: 'Target date/time in ISO format'
    },
    {
      name: 'showDays',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show days in countdown'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show text labels'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'default',
      options: ['default', 'compact', 'flip', 'minimal'],
      description: 'Visual style variant'
    },
    {
      name: 'onComplete',
      type: 'action',
      required: false,
      description: 'Callback when countdown reaches zero'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useState, useEffect } from 'react'

interface CountdownProps {
  targetDate: string
  showDays?: boolean
  showLabels?: boolean
  variant?: 'default' | 'compact' | 'flip' | 'minimal'
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({
  targetDate,
  showDays = true,
  showLabels = true,
  variant = 'default',
  onComplete
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        onComplete?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className={\`bg-gray-900 text-white rounded-lg font-mono font-bold \${
        variant === 'compact' ? 'text-xl px-2 py-1' : 'text-3xl px-4 py-3'
      }\`}>
        {String(value).padStart(2, '0')}
      </div>
      {showLabels && (
        <span className="text-xs text-gray-500 mt-1 uppercase">{label}</span>
      )}
    </div>
  )

  const Separator = () => (
    <span className={\`text-gray-400 font-bold \${variant === 'compact' ? 'text-xl' : 'text-2xl'}\`}>:</span>
  )

  if (variant === 'minimal') {
    return (
      <div className="font-mono text-2xl font-bold">
        {showDays && timeLeft.days > 0 && \`\${timeLeft.days}d \`}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {showDays && (
        <>
          <TimeUnit value={timeLeft.days} label="Days" />
          <Separator />
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <Separator />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <Separator />
      <TimeUnit value={timeLeft.seconds} label="Sec" />
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

struct Countdown: View {
    let targetDate: Date
    var showDays: Bool = true
    var showLabels: Bool = true
    var onComplete: (() -> Void)?

    @State private var timeRemaining: TimeInterval = 0

    var body: some View {
        HStack(spacing: 8) {
            if showDays {
                TimeUnit(value: days, label: "Days")
                Text(":").font(.title).foregroundColor(.secondary)
            }
            TimeUnit(value: hours, label: "Hours")
            Text(":").font(.title).foregroundColor(.secondary)
            TimeUnit(value: minutes, label: "Min")
            Text(":").font(.title).foregroundColor(.secondary)
            TimeUnit(value: seconds, label: "Sec")
        }
        .onAppear { startTimer() }
    }

    private var days: Int { Int(timeRemaining) / 86400 }
    private var hours: Int { (Int(timeRemaining) % 86400) / 3600 }
    private var minutes: Int { (Int(timeRemaining) % 3600) / 60 }
    private var seconds: Int { Int(timeRemaining) % 60 }

    private func startTimer() {
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            timeRemaining = targetDate.timeIntervalSinceNow
            if timeRemaining <= 0 {
                timer.invalidate()
                onComplete?()
            }
        }
    }
}

struct TimeUnit: View {
    let value: Int
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(String(format: "%02d", value))
                .font(.system(size: 32, weight: .bold, design: .monospaced))
                .foregroundColor(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color.black)
                .cornerRadius(8)
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
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
fun Countdown(
    targetDate: Long,
    showDays: Boolean = true,
    showLabels: Boolean = true,
    onComplete: () -> Unit = {}
) {
    var timeLeft by remember { mutableStateOf(0L) }

    LaunchedEffect(targetDate) {
        while (true) {
            timeLeft = (targetDate - System.currentTimeMillis()).coerceAtLeast(0)
            if (timeLeft <= 0) {
                onComplete()
                break
            }
            delay(1000)
        }
    }

    val days = (timeLeft / 86400000).toInt()
    val hours = ((timeLeft % 86400000) / 3600000).toInt()
    val minutes = ((timeLeft % 3600000) / 60000).toInt()
    val seconds = ((timeLeft % 60000) / 1000).toInt()

    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (showDays) {
            TimeUnit(days, "Days", showLabels)
            Separator()
        }
        TimeUnit(hours, "Hours", showLabels)
        Separator()
        TimeUnit(minutes, "Min", showLabels)
        Separator()
        TimeUnit(seconds, "Sec", showLabels)
    }
}

@Composable
private fun TimeUnit(value: Int, label: String, showLabel: Boolean) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            String.format("%02d", value),
            style = MaterialTheme.typography.headlineLarge,
            fontFamily = FontFamily.Monospace,
            color = Color.White,
            modifier = Modifier.background(Color.Black, RoundedCornerShape(8.dp)).padding(12.dp)
        )
        if (showLabel) {
            Text(label, style = MaterialTheme.typography.labelSmall, color = Color.Gray)
        }
    }
}

@Composable
private fun Separator() {
    Text(":", style = MaterialTheme.typography.headlineLarge, color = Color.Gray)
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
