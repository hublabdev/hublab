import type { CapsuleDefinition } from './types'

export const DataTableCapsule: CapsuleDefinition = {
  id: 'data-table',
  name: 'DataTable',
  description: 'Advanced data table with sorting, filtering, pagination, and selection',
  category: 'data',
  tags: ['table', 'data', 'grid', 'sort', 'filter', 'pagination', 'selection'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'DataTable.tsx',
          code: `import React, { useState, useMemo, useCallback } from 'react'

interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  selectable?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
  onRowClick?: (row: T, index: number) => void
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  loading?: boolean
  stickyHeader?: boolean
  striped?: boolean
  bordered?: boolean
  compact?: boolean
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  onRowClick,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  loading = false,
  stickyHeader = false,
  striped = true,
  bordered = false,
  compact = false,
  className = ''
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Global search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(row =>
        columns.some(col => {
          const value = getNestedValue(row, col.key as string)
          return String(value).toLowerCase().includes(query)
        })
      )
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          const cellValue = getNestedValue(row, key)
          return String(cellValue).toLowerCase().includes(value.toLowerCase())
        })
      }
    })

    return result
  }, [data, searchQuery, columnFilters, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey)
      const bVal = getNestedValue(b, sortKey)

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      const comparison = aVal < bVal ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortKey, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDirection(prev =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      )
      if (sortDirection === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }, [sortKey, sortDirection])

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    } else {
      const indices = paginatedData.map((_, i) => (currentPage - 1) * pageSize + i)
      setSelectedRows(new Set(indices))
      onSelectionChange?.(paginatedData)
    }
  }, [paginatedData, selectedRows, currentPage, pageSize, onSelectionChange])

  const handleSelectRow = useCallback((index: number) => {
    const newSelected = new Set(selectedRows)
    const globalIndex = (currentPage - 1) * pageSize + index

    if (newSelected.has(globalIndex)) {
      newSelected.delete(globalIndex)
    } else {
      newSelected.add(globalIndex)
    }

    setSelectedRows(newSelected)
    onSelectionChange?.(
      Array.from(newSelected).map(i => sortedData[i])
    )
  }, [selectedRows, currentPage, pageSize, sortedData, onSelectionChange])

  const padding = compact ? 'px-3 py-2' : 'px-4 py-3'

  return (
    <div className={\`bg-white rounded-lg shadow overflow-hidden \${className}\`}>
      {/* Toolbar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {selectable && selectedRows.size > 0 && (
              <span className="text-sm text-gray-600">
                {selectedRows.size} selected
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={\`bg-gray-50 \${stickyHeader ? 'sticky top-0 z-10' : ''}\`}>
            <tr>
              {selectable && (
                <th className={\`\${padding} w-12\`}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={\`\${padding} text-\${column.align || 'left'} text-xs font-semibold text-gray-600 uppercase tracking-wider \${bordered ? 'border border-gray-200' : ''}\`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(String(column.key))}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        {column.header}
                        <SortIcon
                          active={sortKey === column.key}
                          direction={sortKey === column.key ? sortDirection : null}
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </div>

                  {column.filterable && (
                    <input
                      type="text"
                      value={columnFilters[String(column.key)] || ''}
                      onChange={(e) => {
                        setColumnFilters(prev => ({
                          ...prev,
                          [String(column.key)]: e.target.value
                        }))
                        setCurrentPage(1)
                      }}
                      placeholder="Filter..."
                      className="mt-1 w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="inline-flex items-center gap-2 text-gray-500">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index
                const isSelected = selectedRows.has(globalIndex)

                return (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(row, globalIndex)}
                    className={\`
                      \${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                      \${isSelected ? 'bg-blue-50' : ''}
                      \${onRowClick ? 'cursor-pointer hover:bg-gray-100' : ''}
                      transition-colors
                    \`}
                  >
                    {selectable && (
                      <td className={\`\${padding}\`} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(index)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = getNestedValue(row, String(column.key))
                      return (
                        <td
                          key={String(column.key)}
                          className={\`\${padding} text-sm text-gray-900 text-\${column.align || 'left'} \${bordered ? 'border border-gray-200' : ''}\`}
                        >
                          {column.render ? column.render(value, row, globalIndex) : String(value ?? '')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, i) => (
              page === '...' ? (
                <span key={i} className="px-2">...</span>
              ) : (
                <button
                  key={i}
                  onClick={() => setCurrentPage(page as number)}
                  className={\`w-8 h-8 rounded \${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }\`}
                >
                  {page}
                </button>
              )
            ))}

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <svg className={\`w-4 h-4 \${active ? 'text-blue-600' : 'text-gray-400'}\`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : direction === 'desc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      )}
    </svg>
  )
}

// Utility functions
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 3) return [1, 2, 3, 4, '...', total]
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]

  return [1, '...', current - 1, current, current + 1, '...', total]
}

// Export data utility
export function exportTableToCSV<T extends Record<string, any>>(
  data: T[],
  columns: Column<T>[],
  filename: string = 'export.csv'
) {
  const headers = columns.map(c => c.header).join(',')
  const rows = data.map(row =>
    columns.map(col => {
      const value = getNestedValue(row, String(col.key))
      const escaped = String(value ?? '').replace(/"/g, '""')
      return \`"\${escaped}"\`
    }).join(',')
  ).join('\\n')

  const csv = \`\${headers}\\n\${rows}\`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
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
          filename: 'DataTable.swift',
          code: `import SwiftUI

// MARK: - Column Definition
struct TableColumn<T>: Identifiable {
    let id = UUID()
    let key: KeyPath<T, String>
    let header: String
    var sortable: Bool = true
    var width: CGFloat?
    var alignment: Alignment = .leading
}

// MARK: - Data Table
struct DataTable<T: Identifiable & Hashable>: View {
    let data: [T]
    let columns: [TableColumn<T>]
    var pageSize: Int = 10
    var selectable: Bool = false
    var searchable: Bool = true
    var onRowTap: ((T) -> Void)?
    var onSelectionChange: (([T]) -> Void)?

    @State private var currentPage = 1
    @State private var sortKeyPath: KeyPath<T, String>?
    @State private var sortAscending = true
    @State private var searchQuery = ""
    @State private var selectedItems: Set<T.ID> = []

    private var filteredData: [T] {
        guard !searchQuery.isEmpty else { return data }
        return data.filter { item in
            columns.contains { column in
                item[keyPath: column.key].localizedCaseInsensitiveContains(searchQuery)
            }
        }
    }

    private var sortedData: [T] {
        guard let keyPath = sortKeyPath else { return filteredData }
        return filteredData.sorted { a, b in
            let comparison = a[keyPath: keyPath].localizedCompare(b[keyPath: keyPath])
            return sortAscending ? comparison == .orderedAscending : comparison == .orderedDescending
        }
    }

    private var paginatedData: [T] {
        let start = (currentPage - 1) * pageSize
        let end = min(start + pageSize, sortedData.count)
        return Array(sortedData[start..<end])
    }

    private var totalPages: Int {
        max(1, Int(ceil(Double(sortedData.count) / Double(pageSize))))
    }

    var body: some View {
        VStack(spacing: 0) {
            // Search bar
            if searchable {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)

                    TextField("Search...", text: $searchQuery)
                        .textFieldStyle(.plain)

                    if !searchQuery.isEmpty {
                        Button {
                            searchQuery = ""
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                    }
                }
                .padding(10)
                .background(Color(.systemGray6))
                .cornerRadius(10)
                .padding()
            }

            // Selection info
            if selectable && !selectedItems.isEmpty {
                HStack {
                    Text("\\(selectedItems.count) selected")
                        .font(.subheadline)
                        .foregroundColor(.secondary)

                    Spacer()

                    Button("Clear") {
                        selectedItems.removeAll()
                        onSelectionChange?([])
                    }
                    .font(.subheadline)
                }
                .padding(.horizontal)
                .padding(.bottom, 8)
            }

            // Table
            ScrollView(.horizontal, showsIndicators: false) {
                VStack(spacing: 0) {
                    // Header
                    HStack(spacing: 0) {
                        if selectable {
                            Button {
                                if selectedItems.count == paginatedData.count {
                                    selectedItems.removeAll()
                                } else {
                                    selectedItems = Set(paginatedData.map { $0.id })
                                }
                                let selected = data.filter { selectedItems.contains($0.id) }
                                onSelectionChange?(selected)
                            } label: {
                                Image(systemName: selectedItems.count == paginatedData.count && !paginatedData.isEmpty ? "checkmark.square.fill" : "square")
                                    .foregroundColor(.blue)
                            }
                            .frame(width: 44)
                        }

                        ForEach(columns) { column in
                            Button {
                                if column.sortable {
                                    if sortKeyPath == column.key {
                                        sortAscending.toggle()
                                    } else {
                                        sortKeyPath = column.key
                                        sortAscending = true
                                    }
                                }
                            } label: {
                                HStack {
                                    Text(column.header)
                                        .font(.caption)
                                        .fontWeight(.semibold)
                                        .foregroundColor(.secondary)

                                    if column.sortable && sortKeyPath == column.key {
                                        Image(systemName: sortAscending ? "chevron.up" : "chevron.down")
                                            .font(.caption2)
                                            .foregroundColor(.blue)
                                    }
                                }
                                .frame(width: column.width ?? 120, alignment: column.alignment)
                            }
                            .disabled(!column.sortable)
                        }
                    }
                    .padding(.vertical, 12)
                    .padding(.horizontal)
                    .background(Color(.systemGray6))

                    // Rows
                    if paginatedData.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "doc.text.magnifyingglass")
                                .font(.largeTitle)
                                .foregroundColor(.secondary)
                            Text("No data found")
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 40)
                    } else {
                        ForEach(Array(paginatedData.enumerated()), id: \\.element.id) { index, item in
                            HStack(spacing: 0) {
                                if selectable {
                                    Button {
                                        if selectedItems.contains(item.id) {
                                            selectedItems.remove(item.id)
                                        } else {
                                            selectedItems.insert(item.id)
                                        }
                                        let selected = data.filter { selectedItems.contains($0.id) }
                                        onSelectionChange?(selected)
                                    } label: {
                                        Image(systemName: selectedItems.contains(item.id) ? "checkmark.square.fill" : "square")
                                            .foregroundColor(.blue)
                                    }
                                    .frame(width: 44)
                                }

                                ForEach(columns) { column in
                                    Text(item[keyPath: column.key])
                                        .font(.subheadline)
                                        .lineLimit(1)
                                        .frame(width: column.width ?? 120, alignment: column.alignment)
                                }
                            }
                            .padding(.vertical, 12)
                            .padding(.horizontal)
                            .background(index % 2 == 0 ? Color.clear : Color(.systemGray6).opacity(0.5))
                            .background(selectedItems.contains(item.id) ? Color.blue.opacity(0.1) : Color.clear)
                            .contentShape(Rectangle())
                            .onTapGesture {
                                onRowTap?(item)
                            }
                        }
                    }
                }
            }

            // Pagination
            if totalPages > 1 {
                HStack {
                    Text("Page \\(currentPage) of \\(totalPages)")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Spacer()

                    HStack(spacing: 8) {
                        Button {
                            currentPage = max(1, currentPage - 1)
                        } label: {
                            Image(systemName: "chevron.left")
                        }
                        .disabled(currentPage == 1)

                        Button {
                            currentPage = min(totalPages, currentPage + 1)
                        } label: {
                            Image(systemName: "chevron.right")
                        }
                        .disabled(currentPage == totalPages)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
            }
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }
}

// MARK: - Simple List Table
struct SimpleListTable<T: Identifiable>: View {
    let data: [T]
    let title: (T) -> String
    let subtitle: ((T) -> String)?
    let trailing: ((T) -> String)?
    var onTap: ((T) -> Void)?

    init(
        data: [T],
        title: @escaping (T) -> String,
        subtitle: ((T) -> String)? = nil,
        trailing: ((T) -> String)? = nil,
        onTap: ((T) -> Void)? = nil
    ) {
        self.data = data
        self.title = title
        self.subtitle = subtitle
        self.trailing = trailing
        self.onTap = onTap
    }

    var body: some View {
        List(data) { item in
            Button {
                onTap?(item)
            } label: {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(title(item))
                            .font(.body)
                            .foregroundColor(.primary)

                        if let subtitleFn = subtitle {
                            Text(subtitleFn(item))
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }

                    Spacer()

                    if let trailingFn = trailing {
                        Text(trailingFn(item))
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .listStyle(.plain)
    }
}

// MARK: - Preview
struct DataTable_Previews: PreviewProvider {
    struct SampleItem: Identifiable, Hashable {
        let id = UUID()
        let name: String
        let email: String
        let role: String
    }

    static let sampleData = [
        SampleItem(name: "John Doe", email: "john@example.com", role: "Admin"),
        SampleItem(name: "Jane Smith", email: "jane@example.com", role: "User"),
        SampleItem(name: "Bob Wilson", email: "bob@example.com", role: "Editor")
    ]

    static var previews: some View {
        DataTable(
            data: sampleData,
            columns: [
                TableColumn(key: \\.name, header: "Name", width: 150),
                TableColumn(key: \\.email, header: "Email", width: 200),
                TableColumn(key: \\.role, header: "Role", width: 100)
            ],
            selectable: true
        )
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
      dependencies: ['androidx.compose.ui:ui', 'androidx.compose.material3:material3'],
      files: [
        {
          filename: 'DataTable.kt',
          code: `package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

data class TableColumnDef<T>(
    val key: String,
    val header: String,
    val width: Dp = 120.dp,
    val sortable: Boolean = true,
    val alignment: TextAlign = TextAlign.Start,
    val getValue: (T) -> String
)

enum class SortDirection { ASC, DESC, NONE }

@Composable
fun <T> DataTable(
    data: List<T>,
    columns: List<TableColumnDef<T>>,
    modifier: Modifier = Modifier,
    pageSize: Int = 10,
    selectable: Boolean = false,
    searchable: Boolean = true,
    striped: Boolean = true,
    onRowClick: ((T, Int) -> Unit)? = null,
    onSelectionChange: ((List<T>) -> Unit)? = null,
    getId: (T) -> Any
) {
    var currentPage by remember { mutableIntStateOf(1) }
    var searchQuery by remember { mutableStateOf("") }
    var sortColumn by remember { mutableStateOf<String?>(null) }
    var sortDirection by remember { mutableStateOf(SortDirection.NONE) }
    var selectedIds by remember { mutableStateOf(setOf<Any>()) }

    // Filter data
    val filteredData = remember(data, searchQuery) {
        if (searchQuery.isEmpty()) data
        else data.filter { item ->
            columns.any { col ->
                col.getValue(item).contains(searchQuery, ignoreCase = true)
            }
        }
    }

    // Sort data
    val sortedData = remember(filteredData, sortColumn, sortDirection) {
        if (sortColumn == null || sortDirection == SortDirection.NONE) filteredData
        else {
            val column = columns.find { it.key == sortColumn }
            if (column == null) filteredData
            else {
                val sorted = filteredData.sortedBy { column.getValue(it) }
                if (sortDirection == SortDirection.DESC) sorted.reversed() else sorted
            }
        }
    }

    // Paginate
    val totalPages = maxOf(1, (sortedData.size + pageSize - 1) / pageSize)
    val paginatedData = remember(sortedData, currentPage, pageSize) {
        val start = (currentPage - 1) * pageSize
        val end = minOf(start + pageSize, sortedData.size)
        if (start < sortedData.size) sortedData.subList(start, end) else emptyList()
    }

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        shadowElevation = 2.dp
    ) {
        Column {
            // Search bar
            if (searchable) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = {
                        searchQuery = it
                        currentPage = 1
                    },
                    placeholder = { Text("Search...") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, "Search")
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, "Clear")
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    shape = RoundedCornerShape(10.dp),
                    singleLine = true
                )
            }

            // Selection info
            if (selectable && selectedIds.isNotEmpty()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "\${selectedIds.size} selected",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                    TextButton(onClick = {
                        selectedIds = emptySet()
                        onSelectionChange?.invoke(emptyList())
                    }) {
                        Text("Clear")
                    }
                }
            }

            // Table content
            Box(
                modifier = Modifier
                    .weight(1f)
                    .horizontalScroll(rememberScrollState())
            ) {
                Column {
                    // Header row
                    Row(
                        modifier = Modifier
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .padding(vertical = 12.dp)
                    ) {
                        if (selectable) {
                            Checkbox(
                                checked = selectedIds.size == paginatedData.size && paginatedData.isNotEmpty(),
                                onCheckedChange = { checked ->
                                    selectedIds = if (checked) {
                                        paginatedData.map { getId(it) }.toSet()
                                    } else {
                                        emptySet()
                                    }
                                    onSelectionChange?.invoke(
                                        data.filter { selectedIds.contains(getId(it)) }
                                    )
                                },
                                modifier = Modifier.padding(horizontal = 8.dp)
                            )
                        }

                        columns.forEach { column ->
                            Box(
                                modifier = Modifier
                                    .width(column.width)
                                    .clickable(enabled = column.sortable) {
                                        if (sortColumn == column.key) {
                                            sortDirection = when (sortDirection) {
                                                SortDirection.ASC -> SortDirection.DESC
                                                SortDirection.DESC -> SortDirection.NONE
                                                SortDirection.NONE -> SortDirection.ASC
                                            }
                                        } else {
                                            sortColumn = column.key
                                            sortDirection = SortDirection.ASC
                                        }
                                    }
                                    .padding(horizontal = 8.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Text(
                                        text = column.header,
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = FontWeight.SemiBold,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                                    )
                                    if (column.sortable && sortColumn == column.key) {
                                        Icon(
                                            imageVector = when (sortDirection) {
                                                SortDirection.ASC -> Icons.Default.KeyboardArrowUp
                                                SortDirection.DESC -> Icons.Default.KeyboardArrowDown
                                                else -> Icons.Default.UnfoldMore
                                            },
                                            contentDescription = "Sort",
                                            modifier = Modifier.size(16.dp),
                                            tint = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Data rows
                    if (paginatedData.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(40.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(
                                    Icons.Default.SearchOff,
                                    "No data",
                                    modifier = Modifier.size(48.dp),
                                    tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    "No data found",
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                                )
                            }
                        }
                    } else {
                        LazyColumn {
                            itemsIndexed(paginatedData) { index, item ->
                                val itemId = getId(item)
                                val isSelected = selectedIds.contains(itemId)
                                val globalIndex = (currentPage - 1) * pageSize + index

                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(
                                            when {
                                                isSelected -> MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                                                striped && index % 2 == 1 -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
                                                else -> Color.Transparent
                                            }
                                        )
                                        .clickable { onRowClick?.invoke(item, globalIndex) }
                                        .padding(vertical = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    if (selectable) {
                                        Checkbox(
                                            checked = isSelected,
                                            onCheckedChange = { checked ->
                                                selectedIds = if (checked) {
                                                    selectedIds + itemId
                                                } else {
                                                    selectedIds - itemId
                                                }
                                                onSelectionChange?.invoke(
                                                    data.filter { selectedIds.contains(getId(it)) }
                                                )
                                            },
                                            modifier = Modifier.padding(horizontal = 8.dp)
                                        )
                                    }

                                    columns.forEach { column ->
                                        Text(
                                            text = column.getValue(item),
                                            style = MaterialTheme.typography.bodyMedium,
                                            textAlign = column.alignment,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis,
                                            modifier = Modifier
                                                .width(column.width)
                                                .padding(horizontal = 8.dp)
                                        )
                                    }
                                }

                                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.1f))
                            }
                        }
                    }
                }
            }

            // Pagination
            if (totalPages > 1) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "Page $currentPage of $totalPages",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        IconButton(
                            onClick = { currentPage = maxOf(1, currentPage - 1) },
                            enabled = currentPage > 1
                        ) {
                            Icon(Icons.Default.ChevronLeft, "Previous")
                        }

                        IconButton(
                            onClick = { currentPage = minOf(totalPages, currentPage + 1) },
                            enabled = currentPage < totalPages
                        ) {
                            Icon(Icons.Default.ChevronRight, "Next")
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
          filename: 'DataTable.tsx',
          code: `// Desktop uses the same React components with enhanced keyboard navigation
export { DataTable, exportTableToCSV } from './DataTable'
`
        }
      ]
    }
  },
  props: [
    { name: 'data', type: 'T[]', description: 'Array of data objects', required: true },
    { name: 'columns', type: 'Column<T>[]', description: 'Column definitions', required: true },
    { name: 'pageSize', type: 'number', description: 'Rows per page', default: 10 },
    { name: 'selectable', type: 'boolean', description: 'Enable row selection', default: false },
    { name: 'onSelectionChange', type: '(rows: T[]) => void', description: 'Selection change callback' },
    { name: 'onRowClick', type: '(row: T, index: number) => void', description: 'Row click callback' },
    { name: 'searchable', type: 'boolean', description: 'Show search box', default: true },
    { name: 'loading', type: 'boolean', description: 'Show loading state', default: false },
    { name: 'stickyHeader', type: 'boolean', description: 'Sticky header', default: false },
    { name: 'striped', type: 'boolean', description: 'Striped rows', default: true }
  ],
  examples: [
    {
      title: 'Basic DataTable',
      code: `<DataTable
  data={users}
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', filterable: true }
  ]}
  pageSize={10}
/>`
    },
    {
      title: 'Selectable Table',
      code: `<DataTable
  data={products}
  columns={columns}
  selectable
  onSelectionChange={(selected) => setSelected(selected)}
/>`
    }
  ]
}
