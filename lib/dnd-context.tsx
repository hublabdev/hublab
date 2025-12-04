'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Types
export type CapsuleProps = Record<string, string | number | boolean>

export interface CapsuleInstance {
  id: string
  type: string
  icon: string
  name: string
  props: CapsuleProps
}

export interface Screen {
  id: string
  name: string
  capsules: CapsuleInstance[]
}

export interface ProjectState {
  projectName: string
  themeColor: string
  appIcon: string
  selectedPlatforms: string[]
  screens: Screen[]
  currentScreenId: string
}

// Sortable Capsule Item Component
interface SortableCapsuleProps {
  capsule: CapsuleInstance
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onDuplicate: () => void
  children: React.ReactNode
}

export function SortableCapsule({
  capsule,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  children
}: SortableCapsuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: capsule.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
      } ${isDragging ? 'z-50 shadow-2xl' : ''}`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        </svg>
      </div>

      {/* Content */}
      <div className="p-4 pl-8">
        {children}
      </div>

      {/* Actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate() }}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Duplicate"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
          title="Remove"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Droppable Canvas Area
interface DroppableCanvasProps {
  capsules: CapsuleInstance[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
  onReorder: (capsules: CapsuleInstance[]) => void
  onAddFromSidebar: (capsule: { id: string; name: string; icon: string; type: string }) => void
  renderCapsule: (capsule: CapsuleInstance) => React.ReactNode
}

export function DroppableCanvas({
  capsules,
  selectedId,
  onSelect,
  onRemove,
  onDuplicate,
  onReorder,
  onAddFromSidebar,
  renderCapsule,
}: DroppableCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    // Check if dropping from sidebar (new capsule)
    if (active.id.toString().startsWith('sidebar-')) {
      const capsuleType = active.id.toString().replace('sidebar-', '')
      const capsuleData = active.data.current as { id: string; name: string; icon: string }
      if (capsuleData) {
        onAddFromSidebar({ ...capsuleData, type: capsuleType })
      }
      return
    }

    // Reordering existing capsules
    if (active.id !== over.id) {
      const oldIndex = capsules.findIndex(c => c.id === active.id)
      const newIndex = capsules.findIndex(c => c.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(capsules, oldIndex, newIndex))
      }
    }
  }

  const activeCapsule = capsules.find(c => c.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={capsules.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {capsules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">Drop capsules here</p>
              <p className="text-gray-600 text-sm mt-1">or click a capsule from the sidebar</p>
            </div>
          ) : (
            capsules.map((capsule) => (
              <SortableCapsule
                key={capsule.id}
                capsule={capsule}
                isSelected={selectedId === capsule.id}
                onSelect={() => onSelect(capsule.id)}
                onRemove={() => onRemove(capsule.id)}
                onDuplicate={() => onDuplicate(capsule.id)}
              >
                {renderCapsule(capsule)}
              </SortableCapsule>
            ))
          )}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeCapsule ? (
          <div className="rounded-xl border border-indigo-500 bg-indigo-500/20 p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeCapsule.icon}</span>
              <span className="font-medium">{activeCapsule.name}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

// Draggable Sidebar Item
interface DraggableSidebarItemProps {
  capsule: { id: string; name: string; icon: string; category: string }
  onAdd: () => void
}

export function DraggableSidebarItem({ capsule, onAdd }: DraggableSidebarItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: `sidebar-${capsule.id}`,
    data: capsule,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onAdd}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
    >
      <span className="text-xl">{capsule.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{capsule.name}</div>
        <div className="text-xs text-gray-500 truncate">{capsule.category}</div>
      </div>
      <svg className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  )
}
