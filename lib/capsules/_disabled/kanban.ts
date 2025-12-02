import type { CapsuleDefinition } from './types'

export const KanbanCapsule: CapsuleDefinition = {
  id: 'kanban',
  name: 'Kanban',
  description: 'Kanban board with drag-and-drop columns and cards',
  category: 'data',
  tags: ['kanban', 'board', 'tasks', 'drag-drop', 'project', 'workflow'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'Kanban.tsx',
          code: `import React, { useState, useCallback, useRef } from 'react'

interface KanbanCard {
  id: string
  title: string
  description?: string
  labels?: Array<{ text: string; color: string }>
  assignee?: { name: string; avatar?: string }
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
  comments?: number
  attachments?: number
}

interface KanbanColumn {
  id: string
  title: string
  color?: string
  cards: KanbanCard[]
  limit?: number
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string, toIndex: number) => void
  onCardClick?: (card: KanbanCard) => void
  onAddCard?: (columnId: string) => void
  onAddColumn?: () => void
  editable?: boolean
  className?: string
}

export function KanbanBoard({
  columns,
  onCardMove,
  onCardClick,
  onAddCard,
  onAddColumn,
  editable = true,
  className = ''
}: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; fromColumn: string } | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (cardId: string, columnId: string) => {
    setDraggedCard({ cardId, fromColumn: columnId })
  }

  const handleDragOver = (e: React.DragEvent, columnId: string, index?: number) => {
    e.preventDefault()
    setDragOverColumn(columnId)
    if (index !== undefined) setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
    setDragOverIndex(null)
  }

  const handleDrop = (toColumnId: string, toIndex: number) => {
    if (draggedCard) {
      onCardMove?.(draggedCard.cardId, draggedCard.fromColumn, toColumnId, toIndex)
    }
    setDraggedCard(null)
    setDragOverColumn(null)
    setDragOverIndex(null)
  }

  return (
    <div className={\`flex gap-4 overflow-x-auto pb-4 \${className}\`}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={\`flex-shrink-0 w-72 bg-gray-100 rounded-xl p-3 \${
            dragOverColumn === column.id ? 'ring-2 ring-blue-400' : ''
          }\`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={() => handleDrop(column.id, column.cards.length)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {column.color && (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
              )}
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                {column.cards.length}
                {column.limit && \`/\${column.limit}\`}
              </span>
            </div>
            {editable && onAddCard && (
              <button
                onClick={() => onAddCard(column.id)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>

          {/* Cards */}
          <div className="space-y-2 min-h-[100px]">
            {column.cards.map((card, index) => (
              <div
                key={card.id}
                draggable={editable}
                onDragStart={() => handleDragStart(card.id, column.id)}
                onDragOver={(e) => handleDragOver(e, column.id, index)}
                onDrop={(e) => {
                  e.stopPropagation()
                  handleDrop(column.id, index)
                }}
                onClick={() => onCardClick?.(card)}
                className={\`bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow \${
                  draggedCard?.cardId === card.id ? 'opacity-50' : ''
                } \${
                  dragOverColumn === column.id && dragOverIndex === index ? 'border-t-2 border-t-blue-500' : ''
                }\`}
              >
                {/* Labels */}
                {card.labels && card.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.labels.map((label, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.text}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h4 className="font-medium text-gray-900 mb-1">{card.title}</h4>

                {/* Description */}
                {card.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{card.description}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {/* Priority */}
                    {card.priority && (
                      <span className={\`w-2 h-2 rounded-full \${
                        card.priority === 'high' ? 'bg-red-500' :
                        card.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }\`} />
                    )}

                    {/* Due Date */}
                    {card.dueDate && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {card.dueDate}
                      </span>
                    )}

                    {/* Comments */}
                    {card.comments !== undefined && card.comments > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {card.comments}
                      </span>
                    )}

                    {/* Attachments */}
                    {card.attachments !== undefined && card.attachments > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {card.attachments}
                      </span>
                    )}
                  </div>

                  {/* Assignee */}
                  {card.assignee && (
                    card.assignee.avatar ? (
                      <img
                        src={card.assignee.avatar}
                        alt={card.assignee.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {card.assignee.name.charAt(0).toUpperCase()}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add card button */}
          {editable && onAddCard && (
            <button
              onClick={() => onAddCard(column.id)}
              className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add card
            </button>
          )}
        </div>
      ))}

      {/* Add column button */}
      {editable && onAddColumn && (
        <button
          onClick={onAddColumn}
          className="flex-shrink-0 w-72 h-32 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add column
        </button>
      )}
    </div>
  )
}

// Simple task list (single column)
interface TaskListProps {
  tasks: KanbanCard[]
  onTaskClick?: (task: KanbanCard) => void
  onTaskComplete?: (taskId: string, completed: boolean) => void
  completedIds?: string[]
  className?: string
}

export function TaskList({
  tasks,
  onTaskClick,
  onTaskComplete,
  completedIds = [],
  className = ''
}: TaskListProps) {
  return (
    <div className={\`space-y-2 \${className}\`}>
      {tasks.map((task) => {
        const isCompleted = completedIds.includes(task.id)
        return (
          <div
            key={task.id}
            onClick={() => onTaskClick?.(task)}
            className={\`flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:shadow-sm transition-shadow \${
              isCompleted ? 'opacity-60' : ''
            }\`}
          >
            {onTaskComplete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskComplete(task.id, !isCompleted)
                }}
                className={\`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 \${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                }\`}
              >
                {isCompleted && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )}

            <div className="flex-1 min-w-0">
              <h4 className={\`font-medium \${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}\`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-gray-500 truncate">{task.description}</p>
              )}

              <div className="flex items-center gap-2 mt-2">
                {task.priority && (
                  <span className={\`text-xs px-2 py-0.5 rounded \${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }\`}>
                    {task.priority}
                  </span>
                )}
                {task.dueDate && (
                  <span className="text-xs text-gray-500">{task.dueDate}</span>
                )}
              </div>
            </div>

            {task.assignee && (
              <div className="flex-shrink-0">
                {task.assignee.avatar ? (
                  <img src={task.assignee.avatar} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">
                    {task.assignee.name.charAt(0)}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Swimlane view
interface SwimlaneProps {
  lanes: Array<{
    id: string
    title: string
    columns: KanbanColumn[]
  }>
  onCardMove?: (cardId: string, fromLane: string, fromColumn: string, toLane: string, toColumn: string) => void
  className?: string
}

export function KanbanSwimlane({ lanes, onCardMove, className = '' }: SwimlaneProps) {
  return (
    <div className={\`space-y-6 \${className}\`}>
      {lanes.map((lane) => (
        <div key={lane.id} className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{lane.title}</h3>
          <KanbanBoard
            columns={lane.columns}
            onCardMove={(cardId, from, to, idx) => {
              onCardMove?.(cardId, lane.id, from, lane.id, to)
            }}
          />
        </div>
      ))}
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
          filename: 'Kanban.swift',
          code: `import SwiftUI

// MARK: - Models
struct KanbanCard: Identifiable, Hashable {
    let id: String
    var title: String
    var description: String?
    var labels: [CardLabel]?
    var assignee: Assignee?
    var dueDate: Date?
    var priority: Priority?
    var commentsCount: Int?

    struct CardLabel: Hashable {
        let text: String
        let color: Color
    }

    struct Assignee: Hashable {
        let name: String
        var avatarURL: URL?
    }

    enum Priority: String, CaseIterable {
        case low, medium, high

        var color: Color {
            switch self {
            case .low: return .green
            case .medium: return .yellow
            case .high: return .red
            }
        }
    }
}

struct KanbanColumn: Identifiable {
    let id: String
    var title: String
    var color: Color?
    var cards: [KanbanCard]
    var limit: Int?
}

// MARK: - Kanban Board
struct KanbanBoard: View {
    @Binding var columns: [KanbanColumn]
    var onCardTap: ((KanbanCard) -> Void)?
    var onAddCard: ((String) -> Void)?
    var editable: Bool = true

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(alignment: .top, spacing: 16) {
                ForEach($columns) { $column in
                    KanbanColumnView(
                        column: $column,
                        allColumns: $columns,
                        onCardTap: onCardTap,
                        onAddCard: { onAddCard?(column.id) },
                        editable: editable
                    )
                }

                // Add column button
                if editable {
                    Button {
                        // Add new column
                    } label: {
                        VStack {
                            Image(systemName: "plus")
                            Text("Add Column")
                                .font(.caption)
                        }
                        .foregroundColor(.secondary)
                        .frame(width: 280, height: 100)
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [8]))
                                .foregroundColor(.gray.opacity(0.3))
                        )
                    }
                }
            }
            .padding()
        }
    }
}

// MARK: - Column View
struct KanbanColumnView: View {
    @Binding var column: KanbanColumn
    @Binding var allColumns: [KanbanColumn]
    var onCardTap: ((KanbanCard) -> Void)?
    var onAddCard: (() -> Void)?
    var editable: Bool

    @State private var draggedCard: KanbanCard?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                if let color = column.color {
                    Circle()
                        .fill(color)
                        .frame(width: 12, height: 12)
                }

                Text(column.title)
                    .font(.headline)

                Text("\\(column.cards.count)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color(.systemGray5))
                    .cornerRadius(10)

                Spacer()

                if editable {
                    Button {
                        onAddCard?()
                    } label: {
                        Image(systemName: "plus")
                            .foregroundColor(.secondary)
                    }
                }
            }

            // Cards
            ScrollView {
                LazyVStack(spacing: 8) {
                    ForEach(column.cards) { card in
                        KanbanCardView(card: card)
                            .onTapGesture { onCardTap?(card) }
                            .onDrag {
                                draggedCard = card
                                return NSItemProvider(object: card.id as NSString)
                            }
                    }
                }
            }
            .frame(minHeight: 100)
            .onDrop(of: [.text], delegate: DropDelegate(
                column: $column,
                allColumns: $allColumns,
                draggedCard: $draggedCard
            ))

            // Add card button
            if editable {
                Button {
                    onAddCard?()
                } label: {
                    HStack {
                        Image(systemName: "plus")
                        Text("Add card")
                    }
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                }
            }
        }
        .frame(width: 280)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Card View
struct KanbanCardView: View {
    let card: KanbanCard

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Labels
            if let labels = card.labels, !labels.isEmpty {
                HStack(spacing: 4) {
                    ForEach(labels, id: \\.text) { label in
                        Text(label.text)
                            .font(.caption2)
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(label.color)
                            .cornerRadius(4)
                    }
                }
            }

            // Title
            Text(card.title)
                .font(.subheadline)
                .fontWeight(.medium)

            // Description
            if let description = card.description {
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }

            // Footer
            HStack {
                // Priority
                if let priority = card.priority {
                    Circle()
                        .fill(priority.color)
                        .frame(width: 8, height: 8)
                }

                // Due date
                if let dueDate = card.dueDate {
                    HStack(spacing: 2) {
                        Image(systemName: "calendar")
                        Text(dueDate, style: .date)
                    }
                    .font(.caption2)
                    .foregroundColor(.secondary)
                }

                // Comments
                if let comments = card.commentsCount, comments > 0 {
                    HStack(spacing: 2) {
                        Image(systemName: "bubble.left")
                        Text("\\(comments)")
                    }
                    .font(.caption2)
                    .foregroundColor(.secondary)
                }

                Spacer()

                // Assignee
                if let assignee = card.assignee {
                    if let avatarURL = assignee.avatarURL {
                        AsyncImage(url: avatarURL) { image in
                            image.resizable()
                        } placeholder: {
                            Color.gray
                        }
                        .frame(width: 24, height: 24)
                        .clipShape(Circle())
                    } else {
                        Circle()
                            .fill(Color.blue)
                            .frame(width: 24, height: 24)
                            .overlay(
                                Text(String(assignee.name.prefix(1)))
                                    .font(.caption2)
                                    .foregroundColor(.white)
                            )
                    }
                }
            }
        }
        .padding(12)
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    }
}

// MARK: - Drop Delegate
struct DropDelegate: SwiftUI.DropDelegate {
    @Binding var column: KanbanColumn
    @Binding var allColumns: [KanbanColumn]
    @Binding var draggedCard: KanbanCard?

    func performDrop(info: DropInfo) -> Bool {
        guard let card = draggedCard else { return false }

        // Remove from source column
        for i in allColumns.indices {
            if let index = allColumns[i].cards.firstIndex(where: { $0.id == card.id }) {
                allColumns[i].cards.remove(at: index)
                break
            }
        }

        // Add to target column
        if let colIndex = allColumns.firstIndex(where: { $0.id == column.id }) {
            allColumns[colIndex].cards.append(card)
        }

        draggedCard = nil
        return true
    }

    func dropUpdated(info: DropInfo) -> DropProposal? {
        DropProposal(operation: .move)
    }
}

// MARK: - Task List
struct TaskList: View {
    let tasks: [KanbanCard]
    @Binding var completedIds: Set<String>
    var onTaskTap: ((KanbanCard) -> Void)?

    var body: some View {
        LazyVStack(spacing: 8) {
            ForEach(tasks) { task in
                HStack(alignment: .top, spacing: 12) {
                    // Checkbox
                    Button {
                        if completedIds.contains(task.id) {
                            completedIds.remove(task.id)
                        } else {
                            completedIds.insert(task.id)
                        }
                    } label: {
                        Image(systemName: completedIds.contains(task.id) ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(completedIds.contains(task.id) ? .green : .secondary)
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text(task.title)
                            .font(.subheadline)
                            .strikethrough(completedIds.contains(task.id))
                            .foregroundColor(completedIds.contains(task.id) ? .secondary : .primary)

                        if let description = task.description {
                            Text(description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .lineLimit(1)
                        }
                    }

                    Spacer()

                    if let assignee = task.assignee {
                        Circle()
                            .fill(Color.blue)
                            .frame(width: 24, height: 24)
                            .overlay(
                                Text(String(assignee.name.prefix(1)))
                                    .font(.caption2)
                                    .foregroundColor(.white)
                            )
                    }
                }
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .onTapGesture { onTaskTap?(task) }
            }
        }
    }
}

// MARK: - Preview
struct Kanban_Previews: PreviewProvider {
    static var previews: some View {
        KanbanBoard(
            columns: .constant([
                KanbanColumn(
                    id: "1",
                    title: "To Do",
                    color: .gray,
                    cards: [
                        KanbanCard(id: "1", title: "Task 1", priority: .high),
                        KanbanCard(id: "2", title: "Task 2", description: "Description")
                    ]
                ),
                KanbanColumn(
                    id: "2",
                    title: "In Progress",
                    color: .blue,
                    cards: []
                ),
                KanbanColumn(
                    id: "3",
                    title: "Done",
                    color: .green,
                    cards: []
                )
            ])
        )
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
          filename: 'Kanban.kt',
          code: `package com.hublab.capsules

import androidx.compose.foundation.*
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage

data class KanbanCardData(
    val id: String,
    val title: String,
    val description: String? = null,
    val labels: List<CardLabel>? = null,
    val assignee: Assignee? = null,
    val dueDate: String? = null,
    val priority: Priority? = null,
    val commentsCount: Int? = null,
    val attachmentsCount: Int? = null
) {
    data class CardLabel(val text: String, val color: Color)
    data class Assignee(val name: String, val avatarUrl: String? = null)
    enum class Priority { LOW, MEDIUM, HIGH }
}

data class KanbanColumnData(
    val id: String,
    val title: String,
    val color: Color? = null,
    val cards: List<KanbanCardData>,
    val limit: Int? = null
)

@Composable
fun KanbanBoard(
    columns: List<KanbanColumnData>,
    modifier: Modifier = Modifier,
    onCardClick: ((KanbanCardData) -> Unit)? = null,
    onCardMove: ((cardId: String, fromColumn: String, toColumn: String) -> Unit)? = null,
    onAddCard: ((columnId: String) -> Unit)? = null,
    editable: Boolean = true
) {
    LazyRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(16.dp)
    ) {
        items(columns, key = { it.id }) { column ->
            KanbanColumn(
                column = column,
                onCardClick = onCardClick,
                onAddCard = { onAddCard?.invoke(column.id) },
                editable = editable
            )
        }

        // Add column button
        if (editable) {
            item {
                Box(
                    modifier = Modifier
                        .width(280.dp)
                        .height(100.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .border(
                            width = 2.dp,
                            color = Color.Gray.copy(alpha = 0.3f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable { /* Add column */ },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.Add,
                            "Add column",
                            tint = Color.Gray
                        )
                        Text(
                            "Add Column",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.Gray
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun KanbanColumn(
    column: KanbanColumnData,
    modifier: Modifier = Modifier,
    onCardClick: ((KanbanCardData) -> Unit)? = null,
    onAddCard: (() -> Unit)? = null,
    editable: Boolean = true
) {
    Surface(
        modifier = modifier.width(280.dp),
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    column.color?.let { color ->
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .clip(CircleShape)
                                .background(color)
                        )
                    }

                    Text(
                        column.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )

                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Text(
                            text = column.cards.size.toString() +
                                   (column.limit?.let { "/$it" } ?: ""),
                            style = MaterialTheme.typography.labelSmall,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                }

                if (editable) {
                    IconButton(
                        onClick = { onAddCard?.invoke() },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            Icons.Default.Add,
                            "Add card",
                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Cards
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                items(column.cards, key = { it.id }) { card ->
                    KanbanCard(
                        card = card,
                        onClick = { onCardClick?.invoke(card) }
                    )
                }
            }

            // Add card button
            if (editable) {
                Spacer(modifier = Modifier.height(8.dp))
                TextButton(
                    onClick = { onAddCard?.invoke() },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Add, null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Add card")
                }
            }
        }
    }
}

@Composable
fun KanbanCard(
    card: KanbanCardData,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable(enabled = onClick != null) { onClick?.invoke() },
        shape = RoundedCornerShape(8.dp),
        shadowElevation = 1.dp
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Labels
            card.labels?.takeIf { it.isNotEmpty() }?.let { labels ->
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.padding(bottom = 8.dp)
                ) {
                    labels.forEach { label ->
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = label.color
                        ) {
                            Text(
                                label.text,
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }

            // Title
            Text(
                card.title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )

            // Description
            card.description?.let { desc ->
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    desc,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Footer
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Priority
                    card.priority?.let { priority ->
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(
                                    when (priority) {
                                        KanbanCardData.Priority.HIGH -> Color.Red
                                        KanbanCardData.Priority.MEDIUM -> Color(0xFFFFC107)
                                        KanbanCardData.Priority.LOW -> Color.Green
                                    }
                                )
                        )
                    }

                    // Due date
                    card.dueDate?.let { date ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            Icon(
                                Icons.Default.DateRange,
                                null,
                                modifier = Modifier.size(12.dp),
                                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                            )
                            Text(
                                date,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                            )
                        }
                    }

                    // Comments
                    card.commentsCount?.takeIf { it > 0 }?.let { count ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            Icon(
                                Icons.Default.ChatBubbleOutline,
                                null,
                                modifier = Modifier.size(12.dp),
                                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                            )
                            Text(
                                count.toString(),
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                            )
                        }
                    }
                }

                // Assignee
                card.assignee?.let { assignee ->
                    if (assignee.avatarUrl != null) {
                        AsyncImage(
                            model = assignee.avatarUrl,
                            contentDescription = assignee.name,
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                        )
                    } else {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primary),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                assignee.name.first().uppercase(),
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}

// Task List
@Composable
fun TaskList(
    tasks: List<KanbanCardData>,
    completedIds: Set<String>,
    onToggleComplete: (String) -> Unit,
    modifier: Modifier = Modifier,
    onTaskClick: ((KanbanCardData) -> Unit)? = null
) {
    LazyColumn(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(tasks, key = { it.id }) { task ->
            val isCompleted = completedIds.contains(task.id)

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onTaskClick?.invoke(task) },
                shape = RoundedCornerShape(8.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.Top,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    IconButton(
                        onClick = { onToggleComplete(task.id) },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = if (isCompleted)
                                Icons.Default.CheckCircle
                            else
                                Icons.Default.RadioButtonUnchecked,
                            contentDescription = "Toggle",
                            tint = if (isCompleted) Color.Green else Color.Gray
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            task.title,
                            style = MaterialTheme.typography.bodyMedium,
                            textDecoration = if (isCompleted) TextDecoration.LineThrough else null,
                            color = if (isCompleted)
                                MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                            else
                                MaterialTheme.colorScheme.onSurface
                        )

                        task.description?.let { desc ->
                            Text(
                                desc,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }

                    task.assignee?.let { assignee ->
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(Color.Gray.copy(alpha = 0.3f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                assignee.name.first().uppercase(),
                                style = MaterialTheme.typography.labelSmall
                            )
                        }
                    }
                }
            }
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
          filename: 'Kanban.tsx',
          code: `// Desktop uses the same React components with native drag-drop support
export { KanbanBoard, TaskList, KanbanSwimlane } from './Kanban'
`
        }
      ]
    }
  },
  props: [
    { name: 'columns', type: 'KanbanColumn[]', description: 'Array of columns with cards', required: true },
    { name: 'onCardMove', type: '(cardId, from, to, index) => void', description: 'Callback when card is moved' },
    { name: 'onCardClick', type: '(card) => void', description: 'Callback when card is clicked' },
    { name: 'onAddCard', type: '(columnId) => void', description: 'Callback to add new card' },
    { name: 'onAddColumn', type: '() => void', description: 'Callback to add new column' },
    { name: 'editable', type: 'boolean', description: 'Allow editing', default: true }
  ],
  examples: [
    {
      title: 'Basic Kanban Board',
      code: `<KanbanBoard
  columns={[
    { id: 'todo', title: 'To Do', cards: todoCards },
    { id: 'progress', title: 'In Progress', cards: inProgressCards },
    { id: 'done', title: 'Done', cards: doneCards }
  ]}
  onCardMove={handleMove}
/>`
    },
    {
      title: 'Task List',
      code: `<TaskList
  tasks={tasks}
  completedIds={completed}
  onTaskComplete={(id, done) => toggleComplete(id)}
/>`
    }
  ]
}
