/**
 * Timeline Capsule
 *
 * Vertical/horizontal timeline for events and history.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const TimelineCapsule: CapsuleDefinition = {
  id: 'timeline',
  name: 'Timeline',
  description: 'Vertical/horizontal timeline for events and history',
  category: 'layout',
  tags: ['timeline', 'history', 'events', 'steps', 'process'],

  props: {
    items: {
      type: 'array',
      required: true,
      description: 'Timeline items'
    },
    orientation: {
      type: 'string',
      default: 'vertical',
      options: ['vertical', 'horizontal'],
      description: 'Timeline orientation'
    },
    variant: {
      type: 'string',
      default: 'default',
      options: ['default', 'alternate', 'compact'],
      description: 'Layout variant'
    },
    showConnector: {
      type: 'boolean',
      default: true,
      description: 'Show connecting line'
    },
    activeIndex: {
      type: 'number',
      description: 'Currently active item index'
    },
    onItemClick: {
      type: 'function',
      description: 'Callback when item is clicked'
    }
  },

  platforms: {
    web: {
      dependencies: ['react', 'lucide-react'],
      code: `
import React from 'react'
import { Check, Circle, AlertCircle, Clock } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  description?: string
  date?: string
  time?: string
  icon?: React.ReactNode
  status?: 'completed' | 'current' | 'pending' | 'error'
  color?: string
  content?: React.ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
  orientation?: 'vertical' | 'horizontal'
  variant?: 'default' | 'alternate' | 'compact'
  showConnector?: boolean
  activeIndex?: number
  onItemClick?: (item: TimelineItem, index: number) => void
  className?: string
}

const statusColors = {
  completed: 'bg-green-500',
  current: 'bg-blue-500',
  pending: 'bg-gray-300',
  error: 'bg-red-500'
}

const statusIcons = {
  completed: <Check size={14} className="text-white" />,
  current: <Circle size={8} className="text-white" />,
  pending: <Circle size={8} className="text-gray-400" />,
  error: <AlertCircle size={14} className="text-white" />
}

export function Timeline({
  items,
  orientation = 'vertical',
  variant = 'default',
  showConnector = true,
  activeIndex,
  onItemClick,
  className = ''
}: TimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <HorizontalTimeline
        items={items}
        showConnector={showConnector}
        activeIndex={activeIndex}
        onItemClick={onItemClick}
        className={className}
      />
    )
  }

  return (
    <div className={\`relative \${className}\`}>
      {items.map((item, index) => {
        const isActive = activeIndex !== undefined ? index === activeIndex : false
        const status = item.status || (activeIndex !== undefined
          ? index < activeIndex ? 'completed' : index === activeIndex ? 'current' : 'pending'
          : 'pending')

        const isAlternate = variant === 'alternate' && index % 2 === 1

        return (
          <div
            key={item.id}
            className={\`
              relative flex gap-4
              \${variant === 'alternate' ? 'justify-center' : ''}
              \${index !== items.length - 1 ? 'pb-8' : ''}
            \`}
            onClick={() => onItemClick?.(item, index)}
          >
            {/* Connector line */}
            {showConnector && index !== items.length - 1 && (
              <div
                className={\`
                  absolute w-0.5 bg-gray-200
                  \${variant === 'alternate' ? 'left-1/2 -translate-x-1/2' : 'left-4'}
                  top-8 bottom-0
                \`}
                style={{
                  backgroundColor: status === 'completed' ? '#22c55e' : undefined
                }}
              />
            )}

            {/* Alternate left content */}
            {variant === 'alternate' && (
              <div className={\`flex-1 \${isAlternate ? '' : 'text-right pr-8'}\`}>
                {!isAlternate && (
                  <TimelineContent item={item} status={status} isActive={isActive} />
                )}
              </div>
            )}

            {/* Dot/Icon */}
            <div
              className={\`
                relative z-10 flex items-center justify-center
                w-8 h-8 rounded-full shrink-0
                \${item.color || statusColors[status]}
                \${onItemClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
              \`}
            >
              {item.icon || statusIcons[status]}
            </div>

            {/* Content */}
            {variant !== 'alternate' && (
              <div className="flex-1 pt-0.5">
                <TimelineContent item={item} status={status} isActive={isActive} />
              </div>
            )}

            {/* Alternate right content */}
            {variant === 'alternate' && (
              <div className={\`flex-1 \${isAlternate ? 'text-left pl-8' : ''}\`}>
                {isAlternate && (
                  <TimelineContent item={item} status={status} isActive={isActive} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function TimelineContent({
  item,
  status,
  isActive
}: {
  item: TimelineItem
  status: string
  isActive: boolean
}) {
  return (
    <div className={\`\${isActive ? 'opacity-100' : 'opacity-80'}\`}>
      {(item.date || item.time) && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Clock size={14} />
          <span>{item.date}</span>
          {item.time && <span>• {item.time}</span>}
        </div>
      )}

      <h3 className={\`font-semibold text-gray-900 \${isActive ? 'text-lg' : ''}\`}>
        {item.title}
      </h3>

      {item.description && (
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      )}

      {item.content && (
        <div className="mt-3">{item.content}</div>
      )}
    </div>
  )
}

// Horizontal Timeline
function HorizontalTimeline({
  items,
  showConnector,
  activeIndex,
  onItemClick,
  className
}: Omit<TimelineProps, 'orientation' | 'variant'>) {
  return (
    <div className={\`overflow-x-auto \${className}\`}>
      <div className="flex items-start min-w-max px-4">
        {items.map((item, index) => {
          const status = item.status || (activeIndex !== undefined
            ? index < activeIndex ? 'completed' : index === activeIndex ? 'current' : 'pending'
            : 'pending')

          return (
            <div
              key={item.id}
              className="flex flex-col items-center"
              onClick={() => onItemClick?.(item, index)}
            >
              {/* Top content */}
              <div className="text-center mb-4 min-h-[60px]">
                {item.date && (
                  <div className="text-sm text-gray-500">{item.date}</div>
                )}
                <div className="font-medium text-gray-900">{item.title}</div>
              </div>

              {/* Dot and connector */}
              <div className="flex items-center">
                {index > 0 && showConnector && (
                  <div
                    className={\`w-20 h-0.5 \${
                      status === 'completed' || (activeIndex !== undefined && index <= activeIndex)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }\`}
                  />
                )}

                <div
                  className={\`
                    flex items-center justify-center w-8 h-8 rounded-full shrink-0
                    \${item.color || statusColors[status]}
                    \${onItemClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
                  \`}
                >
                  {item.icon || statusIcons[status]}
                </div>

                {index < items.length - 1 && showConnector && (
                  <div
                    className={\`w-20 h-0.5 \${
                      activeIndex !== undefined && index < activeIndex
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }\`}
                  />
                )}
              </div>

              {/* Bottom content */}
              {item.description && (
                <div className="text-center mt-4 max-w-[150px]">
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Activity Timeline
export function ActivityTimeline({
  activities,
  className = ''
}: {
  activities: {
    id: string
    user: { name: string; avatar?: string }
    action: string
    target?: string
    timestamp: string
    icon?: React.ReactNode
  }[]
  className?: string
}) {
  return (
    <div className={\`space-y-4 \${className}\`}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          {/* Avatar or icon */}
          <div className="flex-shrink-0">
            {activity.user.avatar ? (
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {activity.icon || <Circle size={12} className="text-gray-400" />}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium text-gray-900">{activity.user.name}</span>
              {' '}
              <span className="text-gray-600">{activity.action}</span>
              {activity.target && (
                <>
                  {' '}
                  <span className="font-medium text-gray-900">{activity.target}</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Process Timeline
export function ProcessTimeline({
  steps,
  currentStep,
  onStepClick,
  className = ''
}: {
  steps: { id: string; title: string; description?: string }[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}) {
  return (
    <Timeline
      items={steps.map((step, index) => ({
        ...step,
        status: index < currentStep ? 'completed' : index === currentStep ? 'current' : 'pending'
      }))}
      activeIndex={currentStep}
      onItemClick={(_, index) => onStepClick?.(index)}
      className={className}
    />
  )
}

// Order Timeline
export function OrderTimeline({
  events,
  className = ''
}: {
  events: {
    id: string
    status: string
    description: string
    timestamp: string
    location?: string
  }[]
  className?: string
}) {
  return (
    <div className={\`border rounded-lg p-4 \${className}\`}>
      <Timeline
        items={events.map((event, index) => ({
          id: event.id,
          title: event.status,
          description: event.description,
          date: event.timestamp,
          status: index === 0 ? 'current' : 'completed' as const,
          content: event.location ? (
            <div className="text-xs text-gray-500 mt-1">
              📍 {event.location}
            </div>
          ) : undefined
        }))}
        variant="compact"
      />
    </div>
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Timeline Item
struct TimelineItem: Identifiable {
    let id: String
    let title: String
    var description: String?
    var date: String?
    var time: String?
    var status: TimelineStatus = .pending
    var color: Color?
    var icon: Image?

    enum TimelineStatus {
        case completed, current, pending, error

        var color: Color {
            switch self {
            case .completed: return .green
            case .current: return .blue
            case .pending: return Color(.systemGray4)
            case .error: return .red
            }
        }

        var icon: some View {
            Group {
                switch self {
                case .completed:
                    Image(systemName: "checkmark")
                        .font(.caption.bold())
                        .foregroundColor(.white)
                case .current:
                    Circle()
                        .fill(.white)
                        .frame(width: 8, height: 8)
                case .pending:
                    Circle()
                        .fill(Color(.systemGray3))
                        .frame(width: 8, height: 8)
                case .error:
                    Image(systemName: "exclamationmark")
                        .font(.caption.bold())
                        .foregroundColor(.white)
                }
            }
        }
    }
}

// MARK: - Timeline View
struct TimelineView: View {
    let items: [TimelineItem]
    var orientation: TimelineOrientation = .vertical
    var variant: TimelineVariant = .default
    var showConnector: Bool = true
    var activeIndex: Int?
    var onItemTap: ((TimelineItem, Int) -> Void)?

    enum TimelineOrientation {
        case vertical, horizontal
    }

    enum TimelineVariant {
        case \`default\`, alternate, compact
    }

    var body: some View {
        if orientation == .horizontal {
            horizontalTimeline
        } else {
            verticalTimeline
        }
    }

    // MARK: - Vertical Timeline
    private var verticalTimeline: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(Array(items.enumerated()), id: \\.element.id) { index, item in
                let isAlternate = variant == .alternate && index % 2 == 1

                HStack(alignment: .top, spacing: 16) {
                    if variant == .alternate {
                        // Left content
                        if isAlternate {
                            Spacer()
                        } else {
                            TimelineContent(item: item, alignment: .trailing)
                                .frame(maxWidth: .infinity, alignment: .trailing)
                        }
                    }

                    // Dot and connector
                    VStack(spacing: 0) {
                        timelineDot(for: item, at: index)

                        if showConnector && index < items.count - 1 {
                            Rectangle()
                                .fill(item.status == .completed ? Color.green : Color(.systemGray4))
                                .frame(width: 2)
                                .frame(maxHeight: .infinity)
                        }
                    }
                    .frame(width: 32)

                    // Right content
                    if variant == .alternate {
                        if isAlternate {
                            TimelineContent(item: item, alignment: .leading)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        } else {
                            Spacer()
                        }
                    } else {
                        TimelineContent(item: item, alignment: .leading)
                    }
                }
                .padding(.bottom, index < items.count - 1 ? 24 : 0)
                .onTapGesture {
                    onItemTap?(item, index)
                }
            }
        }
    }

    private func timelineDot(for item: TimelineItem, at index: Int) -> some View {
        let status = activeIndex.map { idx -> TimelineItem.TimelineStatus in
            if index < idx { return .completed }
            if index == idx { return .current }
            return .pending
        } ?? item.status

        return Circle()
            .fill(item.color ?? status.color)
            .frame(width: 32, height: 32)
            .overlay(
                Group {
                    if let icon = item.icon {
                        icon
                            .font(.caption)
                            .foregroundColor(.white)
                    } else {
                        status.icon
                    }
                }
            )
    }

    // MARK: - Horizontal Timeline
    private var horizontalTimeline: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(alignment: .top, spacing: 0) {
                ForEach(Array(items.enumerated()), id: \\.element.id) { index, item in
                    VStack(spacing: 16) {
                        // Top content
                        VStack(spacing: 4) {
                            if let date = item.date {
                                Text(date)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            Text(item.title)
                                .font(.subheadline)
                                .fontWeight(.medium)
                        }
                        .frame(width: 120)

                        // Dot and connectors
                        HStack(spacing: 0) {
                            if index > 0 && showConnector {
                                Rectangle()
                                    .fill(item.status == .completed ? Color.green : Color(.systemGray4))
                                    .frame(width: 40, height: 2)
                            }

                            timelineDot(for: item, at: index)

                            if index < items.count - 1 && showConnector {
                                Rectangle()
                                    .fill(activeIndex.map { index < $0 } ?? false ? Color.green : Color(.systemGray4))
                                    .frame(width: 40, height: 2)
                            }
                        }

                        // Bottom content
                        if let description = item.description {
                            Text(description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .frame(width: 120)
                        }
                    }
                    .onTapGesture {
                        onItemTap?(item, index)
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

// MARK: - Timeline Content
struct TimelineContent: View {
    let item: TimelineItem
    var alignment: HorizontalAlignment = .leading

    var body: some View {
        VStack(alignment: alignment, spacing: 4) {
            if let date = item.date {
                HStack(spacing: 4) {
                    Image(systemName: "clock")
                        .font(.caption2)
                    Text(date)
                    if let time = item.time {
                        Text("•")
                        Text(time)
                    }
                }
                .font(.caption)
                .foregroundColor(.secondary)
            }

            Text(item.title)
                .font(.subheadline)
                .fontWeight(.semibold)

            if let description = item.description {
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

// MARK: - Activity Timeline
struct ActivityTimeline: View {
    let activities: [Activity]

    struct Activity: Identifiable {
        let id: String
        let userName: String
        var userAvatar: String?
        let action: String
        var target: String?
        let timestamp: String
    }

    var body: some View {
        VStack(spacing: 16) {
            ForEach(activities) { activity in
                HStack(alignment: .top, spacing: 12) {
                    // Avatar
                    if let avatar = activity.userAvatar {
                        AsyncImage(url: URL(string: avatar)) { image in
                            image.resizable()
                        } placeholder: {
                            Circle().fill(Color.gray.opacity(0.3))
                        }
                        .frame(width: 32, height: 32)
                        .clipShape(Circle())
                    } else {
                        Circle()
                            .fill(Color.gray.opacity(0.2))
                            .frame(width: 32, height: 32)
                            .overlay(
                                Text(String(activity.userName.prefix(1)))
                                    .font(.caption)
                                    .fontWeight(.medium)
                            )
                    }

                    // Content
                    VStack(alignment: .leading, spacing: 2) {
                        Text(activity.userName)
                            .fontWeight(.medium)
                        +
                        Text(" \\(activity.action)")
                            .foregroundColor(.secondary)
                        +
                        Text(activity.target.map { " \\($0)" } ?? "")
                            .fontWeight(.medium)

                        Text(activity.timestamp)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                    .font(.subheadline)

                    Spacer()
                }
            }
        }
    }
}

// MARK: - Process Timeline
struct ProcessTimeline: View {
    let steps: [ProcessStep]
    let currentStep: Int
    var onStepTap: ((Int) -> Void)?

    struct ProcessStep: Identifiable {
        let id: String
        let title: String
        var description: String?
    }

    var body: some View {
        TimelineView(
            items: steps.enumerated().map { index, step in
                TimelineItem(
                    id: step.id,
                    title: step.title,
                    description: step.description,
                    status: index < currentStep ? .completed : index == currentStep ? .current : .pending
                )
            },
            activeIndex: currentStep,
            onItemTap: { _, index in
                onStepTap?(index)
            }
        )
    }
}

// MARK: - Order Timeline
struct OrderTimeline: View {
    let events: [OrderEvent]

    struct OrderEvent: Identifiable {
        let id: String
        let status: String
        let description: String
        let timestamp: String
        var location: String?
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(Array(events.enumerated()), id: \\.element.id) { index, event in
                HStack(alignment: .top, spacing: 12) {
                    // Dot and line
                    VStack(spacing: 0) {
                        Circle()
                            .fill(index == 0 ? Color.blue : Color.green)
                            .frame(width: 12, height: 12)

                        if index < events.count - 1 {
                            Rectangle()
                                .fill(Color.green)
                                .frame(width: 2)
                                .frame(maxHeight: .infinity)
                        }
                    }

                    // Content
                    VStack(alignment: .leading, spacing: 4) {
                        Text(event.status)
                            .font(.subheadline)
                            .fontWeight(.semibold)

                        Text(event.description)
                            .font(.caption)
                            .foregroundColor(.secondary)

                        HStack(spacing: 8) {
                            Text(event.timestamp)
                                .font(.caption2)
                                .foregroundColor(.secondary)

                            if let location = event.location {
                                Text("📍 \\(location)")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding(.bottom, index < events.count - 1 ? 20 : 0)
                }
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
}

// MARK: - Preview
struct TimelineView_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                TimelineView(
                    items: [
                        TimelineItem(id: "1", title: "Order Placed", date: "Jan 1", status: .completed),
                        TimelineItem(id: "2", title: "Processing", date: "Jan 2", status: .completed),
                        TimelineItem(id: "3", title: "Shipped", date: "Jan 3", status: .current),
                        TimelineItem(id: "4", title: "Delivered", status: .pending)
                    ]
                )

                TimelineView(
                    items: [
                        TimelineItem(id: "1", title: "Step 1"),
                        TimelineItem(id: "2", title: "Step 2"),
                        TimelineItem(id: "3", title: "Step 3")
                    ],
                    orientation: .horizontal,
                    activeIndex: 1
                )
            }
            .padding()
        }
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3'],
      code: `
package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage

// Timeline Item
data class TimelineItem(
    val id: String,
    val title: String,
    val description: String? = null,
    val date: String? = null,
    val time: String? = null,
    val status: TimelineStatus = TimelineStatus.Pending,
    val color: Color? = null,
    val icon: ImageVector? = null
)

enum class TimelineStatus {
    Completed, Current, Pending, Error;

    val defaultColor: Color
        get() = when (this) {
            Completed -> Color(0xFF22C55E)
            Current -> Color(0xFF3B82F6)
            Pending -> Color(0xFFD1D5DB)
            Error -> Color(0xFFEF4444)
        }
}

enum class TimelineOrientation {
    Vertical, Horizontal
}

enum class TimelineVariant {
    Default, Alternate, Compact
}

// Timeline View
@Composable
fun TimelineView(
    items: List<TimelineItem>,
    modifier: Modifier = Modifier,
    orientation: TimelineOrientation = TimelineOrientation.Vertical,
    variant: TimelineVariant = TimelineVariant.Default,
    showConnector: Boolean = true,
    activeIndex: Int? = null,
    onItemClick: ((TimelineItem, Int) -> Unit)? = null
) {
    when (orientation) {
        TimelineOrientation.Horizontal -> {
            HorizontalTimeline(
                items = items,
                modifier = modifier,
                showConnector = showConnector,
                activeIndex = activeIndex,
                onItemClick = onItemClick
            )
        }
        TimelineOrientation.Vertical -> {
            VerticalTimeline(
                items = items,
                modifier = modifier,
                variant = variant,
                showConnector = showConnector,
                activeIndex = activeIndex,
                onItemClick = onItemClick
            )
        }
    }
}

@Composable
private fun VerticalTimeline(
    items: List<TimelineItem>,
    modifier: Modifier = Modifier,
    variant: TimelineVariant = TimelineVariant.Default,
    showConnector: Boolean = true,
    activeIndex: Int? = null,
    onItemClick: ((TimelineItem, Int) -> Unit)? = null
) {
    Column(modifier = modifier) {
        items.forEachIndexed { index, item ->
            val isAlternate = variant == TimelineVariant.Alternate && index % 2 == 1
            val status = getStatus(item, index, activeIndex)

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .then(
                        if (onItemClick != null) {
                            Modifier.clickable { onItemClick(item, index) }
                        } else Modifier
                    )
                    .padding(bottom = if (index < items.size - 1) 24.dp else 0.dp),
                horizontalArrangement = if (variant == TimelineVariant.Alternate) {
                    Arrangement.Center
                } else Arrangement.Start
            ) {
                // Left content (alternate)
                if (variant == TimelineVariant.Alternate) {
                    Box(modifier = Modifier.weight(1f)) {
                        if (!isAlternate) {
                            TimelineContent(
                                item = item,
                                modifier = Modifier.align(Alignment.CenterEnd)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                }

                // Dot and connector
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    TimelineDot(
                        item = item,
                        status = status
                    )

                    if (showConnector && index < items.size - 1) {
                        Box(
                            modifier = Modifier
                                .width(2.dp)
                                .height(24.dp)
                                .background(
                                    if (status == TimelineStatus.Completed) {
                                        Color(0xFF22C55E)
                                    } else {
                                        MaterialTheme.colorScheme.outlineVariant
                                    }
                                )
                        )
                    }
                }

                Spacer(modifier = Modifier.width(16.dp))

                // Content
                if (variant != TimelineVariant.Alternate) {
                    TimelineContent(
                        item = item,
                        modifier = Modifier.weight(1f)
                    )
                } else {
                    Box(modifier = Modifier.weight(1f)) {
                        if (isAlternate) {
                            TimelineContent(
                                item = item,
                                modifier = Modifier.align(Alignment.CenterStart)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HorizontalTimeline(
    items: List<TimelineItem>,
    modifier: Modifier = Modifier,
    showConnector: Boolean = true,
    activeIndex: Int? = null,
    onItemClick: ((TimelineItem, Int) -> Unit)? = null
) {
    Row(
        modifier = modifier.horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.Start,
        verticalAlignment = Alignment.Top
    ) {
        items.forEachIndexed { index, item ->
            val status = getStatus(item, index, activeIndex)

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .then(
                        if (onItemClick != null) {
                            Modifier.clickable { onItemClick(item, index) }
                        } else Modifier
                    )
            ) {
                // Top content
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.width(120.dp)
                ) {
                    if (item.date != null) {
                        Text(
                            text = item.date,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Text(
                        text = item.title,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        textAlign = TextAlign.Center
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Dot and connectors
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (index > 0 && showConnector) {
                        Box(
                            modifier = Modifier
                                .width(40.dp)
                                .height(2.dp)
                                .background(
                                    if (status == TimelineStatus.Completed) {
                                        Color(0xFF22C55E)
                                    } else {
                                        MaterialTheme.colorScheme.outlineVariant
                                    }
                                )
                        )
                    }

                    TimelineDot(item = item, status = status)

                    if (index < items.size - 1 && showConnector) {
                        Box(
                            modifier = Modifier
                                .width(40.dp)
                                .height(2.dp)
                                .background(
                                    if (activeIndex != null && index < activeIndex) {
                                        Color(0xFF22C55E)
                                    } else {
                                        MaterialTheme.colorScheme.outlineVariant
                                    }
                                )
                        )
                    }
                }

                // Bottom content
                if (item.description != null) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = item.description,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.width(120.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun TimelineDot(
    item: TimelineItem,
    status: TimelineStatus
) {
    Box(
        modifier = Modifier
            .size(32.dp)
            .clip(CircleShape)
            .background(item.color ?: status.defaultColor),
        contentAlignment = Alignment.Center
    ) {
        when {
            item.icon != null -> Icon(
                imageVector = item.icon,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = Color.White
            )
            status == TimelineStatus.Completed -> Icon(
                imageVector = Icons.Default.Check,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = Color.White
            )
            status == TimelineStatus.Error -> Icon(
                imageVector = Icons.Default.Warning,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = Color.White
            )
            else -> Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(
                        if (status == TimelineStatus.Current) Color.White
                        else MaterialTheme.colorScheme.onSurfaceVariant
                    )
            )
        }
    }
}

@Composable
private fun TimelineContent(
    item: TimelineItem,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        if (item.date != null || item.time != null) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Schedule,
                    contentDescription = null,
                    modifier = Modifier.size(14.dp),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (item.date != null) {
                    Text(
                        text = item.date,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                if (item.time != null) {
                    Text(
                        text = "• ${item.time}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
        }

        Text(
            text = item.title,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold
        )

        if (item.description != null) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = item.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

private fun getStatus(
    item: TimelineItem,
    index: Int,
    activeIndex: Int?
): TimelineStatus {
    return if (activeIndex != null) {
        when {
            index < activeIndex -> TimelineStatus.Completed
            index == activeIndex -> TimelineStatus.Current
            else -> TimelineStatus.Pending
        }
    } else {
        item.status
    }
}

// Activity Timeline
@Composable
fun ActivityTimeline(
    activities: List<ActivityItem>,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        activities.forEach { activity ->
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Avatar
                if (activity.userAvatar != null) {
                    AsyncImage(
                        model = activity.userAvatar,
                        contentDescription = activity.userName,
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = activity.userName.take(1),
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }

                // Content
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = buildString {
                            append(activity.userName)
                            append(" ")
                            append(activity.action)
                            activity.target?.let {
                                append(" ")
                                append(it)
                            }
                        },
                        style = MaterialTheme.typography.bodySmall
                    )

                    Text(
                        text = activity.timestamp,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

data class ActivityItem(
    val id: String,
    val userName: String,
    val userAvatar: String? = null,
    val action: String,
    val target: String? = null,
    val timestamp: String
)

// Process Timeline
@Composable
fun ProcessTimeline(
    steps: List<ProcessStep>,
    currentStep: Int,
    modifier: Modifier = Modifier,
    onStepClick: ((Int) -> Unit)? = null
) {
    TimelineView(
        items = steps.mapIndexed { index, step ->
            TimelineItem(
                id = step.id,
                title = step.title,
                description = step.description,
                status = when {
                    index < currentStep -> TimelineStatus.Completed
                    index == currentStep -> TimelineStatus.Current
                    else -> TimelineStatus.Pending
                }
            )
        },
        modifier = modifier,
        activeIndex = currentStep,
        onItemClick = { _, index -> onStepClick?.invoke(index) }
    )
}

data class ProcessStep(
    val id: String,
    val title: String,
    val description: String? = null
)

// Order Timeline
@Composable
fun OrderTimeline(
    events: List<OrderEvent>,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            events.forEachIndexed { index, event ->
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.padding(bottom = if (index < events.size - 1) 20.dp else 0.dp)
                ) {
                    // Dot and line
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .clip(CircleShape)
                                .background(
                                    if (index == 0) MaterialTheme.colorScheme.primary
                                    else Color(0xFF22C55E)
                                )
                        )

                        if (index < events.size - 1) {
                            Box(
                                modifier = Modifier
                                    .width(2.dp)
                                    .height(40.dp)
                                    .background(Color(0xFF22C55E))
                            )
                        }
                    }

                    // Content
                    Column {
                        Text(
                            text = event.status,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold
                        )

                        Text(
                            text = event.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(top = 4.dp)
                        ) {
                            Text(
                                text = event.timestamp,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            event.location?.let {
                                Text(
                                    text = "📍 $it",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

data class OrderEvent(
    val id: String,
    val status: String,
    val description: String,
    val timestamp: String,
    val location: String? = null
)
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
