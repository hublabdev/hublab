/**
 * Table Capsule - Multi-Platform Data Tables
 *
 * Data tables with sorting, pagination, and selection
 */

import { CapsuleDefinition } from './types'

export const TableCapsule: CapsuleDefinition = {
  id: 'table',
  name: 'Table',
  description: 'Data tables with sorting, pagination, and selection',
  category: 'data',
  tags: ['table', 'data', 'grid', 'list', 'sorting', 'pagination'],
  version: '1.0.0',

  props: [
    {
      name: 'data',
      type: 'array',
      required: true,
      description: 'Array of data objects'
    },
    {
      name: 'columns',
      type: 'array',
      required: true,
      description: 'Column definitions'
    },
    {
      name: 'sortable',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Enable column sorting'
    },
    {
      name: 'selectable',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Enable row selection'
    },
    {
      name: 'pagination',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Enable pagination'
    },
    {
      name: 'pageSize',
      type: 'number',
      required: false,
      default: 10,
      description: 'Rows per page'
    },
    {
      name: 'striped',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Alternate row colors'
    },
    {
      name: 'bordered',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show borders'
    },
    {
      name: 'hoverable',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Highlight row on hover'
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show loading state'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, useMemo } from 'react'

interface Column<T> {
  key: keyof T | string
  title: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

interface TableProps<T extends Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  sortable?: boolean
  selectable?: boolean
  pagination?: boolean
  pageSize?: number
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  loading?: boolean
  onRowClick?: (row: T, index: number) => void
  onSelectionChange?: (selected: T[]) => void
  emptyMessage?: string
  className?: string
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  sortable = false,
  selectable = false,
  pagination = false,
  pageSize = 10,
  striped = false,
  bordered = true,
  hoverable = true,
  loading = false,
  onRowClick,
  onSelectionChange,
  emptyMessage = 'No data available',
  className = ''
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = aValue < bValue ? -1 : 1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [data, sortConfig])

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, pagination, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: string) => {
    if (!sortable) return

    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null
      }
      return { key, direction: 'asc' }
    })
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    } else {
      const allIndices = new Set(paginatedData.map((_, i) => i))
      setSelectedRows(allIndices)
      onSelectionChange?.(paginatedData)
    }
  }

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
    onSelectionChange?.(paginatedData.filter((_, i) => newSelected.has(i)))
  }

  const getValue = (row: T, key: string): unknown => {
    const keys = key.split('.')
    let value: unknown = row
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value
  }

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (!sortable) return null
    const isActive = sortConfig?.key === columnKey

    return (
      <span className="ml-1 inline-flex flex-col">
        <svg
          className={\`w-3 h-3 \${isActive && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}\`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 5l-8 8h16z" />
        </svg>
        <svg
          className={\`w-3 h-3 -mt-1 \${isActive && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}\`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 19l8-8H4z" />
        </svg>
      </span>
    )
  }

  return (
    <div className={\`overflow-hidden \${className}\`}>
      <div className="overflow-x-auto">
        <table className={\`w-full \${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}\`}>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={\`
                    px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white
                    \${column.sortable !== false && sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                    \${bordered ? 'border-b border-gray-200 dark:border-gray-700' : ''}
                  \`}
                  style={{ width: column.width, textAlign: column.align }}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable !== false && <SortIcon columnKey={String(column.key)} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center"
                >
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={\`
                    \${striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                    \${hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                    \${onRowClick ? 'cursor-pointer' : ''}
                    \${selectedRows.has(rowIndex) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  \`}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleSelectRow(rowIndex)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = getValue(row, String(column.key))
                    return (
                      <td
                        key={String(column.key)}
                        className={\`
                          px-4 py-3 text-sm text-gray-900 dark:text-gray-100
                          \${bordered ? 'border-b border-gray-200 dark:border-gray-700' : ''}
                        \`}
                        style={{ textAlign: column.align }}
                      >
                        {column.render
                          ? column.render(value, row, rowIndex)
                          : String(value ?? '')}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 2 + i
                }
                if (pageNum > totalPages) {
                  pageNum = totalPages - 4 + i
                }
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={\`
                    px-3 py-1 border rounded-md
                    \${currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  \`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Simple Table for basic use cases
interface SimpleTableProps {
  headers: string[]
  rows: (string | React.ReactNode)[][]
  striped?: boolean
  className?: string
}

export function SimpleTable({
  headers,
  rows,
  striped = false,
  className = ''
}: SimpleTableProps) {
  return (
    <div className={\`overflow-x-auto \${className}\`}>
      <table className="w-full border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
`
    },

    ios: {
      framework: 'swiftui',
      minVersion: '15.0',
      dependencies: [],
      imports: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Column Definition
struct TableColumn<T>: Identifiable {
    let id = UUID()
    let key: KeyPath<T, String>
    let title: String
    var sortable: Bool = true
    var width: CGFloat? = nil
    var alignment: HorizontalAlignment = .leading
}

// MARK: - Sort Direction
enum SortDirection {
    case ascending, descending

    mutating func toggle() {
        self = self == .ascending ? .descending : .ascending
    }
}

// MARK: - Data Table View
struct DataTable<T: Identifiable>: View {
    let data: [T]
    let columns: [TableColumn<T>]
    var sortable: Bool = false
    var selectable: Bool = false
    var striped: Bool = false
    var onRowTap: ((T) -> Void)? = nil

    @State private var sortKey: KeyPath<T, String>? = nil
    @State private var sortDirection: SortDirection = .ascending
    @State private var selectedIds: Set<T.ID> = []

    private var sortedData: [T] {
        guard let sortKey = sortKey else { return data }
        return data.sorted { a, b in
            let aValue = a[keyPath: sortKey]
            let bValue = b[keyPath: sortKey]
            return sortDirection == .ascending ? aValue < bValue : aValue > bValue
        }
    }

    var body: some View {
        ScrollView(.horizontal) {
            VStack(spacing: 0) {
                // Header
                HStack(spacing: 0) {
                    if selectable {
                        headerCell(title: "") {
                            Button {
                                if selectedIds.count == data.count {
                                    selectedIds.removeAll()
                                } else {
                                    selectedIds = Set(data.map { $0.id })
                                }
                            } label: {
                                Image(systemName: selectedIds.count == data.count ? "checkmark.square.fill" : "square")
                                    .foregroundColor(.blue)
                            }
                        }
                        .frame(width: 44)
                    }

                    ForEach(columns) { column in
                        headerCell(title: column.title) {
                            HStack {
                                Text(column.title)
                                    .fontWeight(.semibold)

                                if sortable && column.sortable {
                                    if sortKey == column.key {
                                        Image(systemName: sortDirection == .ascending ? "chevron.up" : "chevron.down")
                                            .font(.caption)
                                    }
                                }
                            }
                        }
                        .frame(width: column.width, alignment: Alignment(horizontal: column.alignment, vertical: .center))
                        .onTapGesture {
                            if sortable && column.sortable {
                                if sortKey == column.key {
                                    sortDirection.toggle()
                                } else {
                                    sortKey = column.key
                                    sortDirection = .ascending
                                }
                            }
                        }
                    }
                }
                .background(Color(.systemGray6))

                // Rows
                ForEach(Array(sortedData.enumerated()), id: \\.element.id) { index, row in
                    HStack(spacing: 0) {
                        if selectable {
                            dataCell {
                                Button {
                                    if selectedIds.contains(row.id) {
                                        selectedIds.remove(row.id)
                                    } else {
                                        selectedIds.insert(row.id)
                                    }
                                } label: {
                                    Image(systemName: selectedIds.contains(row.id) ? "checkmark.square.fill" : "square")
                                        .foregroundColor(.blue)
                                }
                            }
                            .frame(width: 44)
                        }

                        ForEach(columns) { column in
                            dataCell {
                                Text(row[keyPath: column.key])
                            }
                            .frame(width: column.width, alignment: Alignment(horizontal: column.alignment, vertical: .center))
                        }
                    }
                    .background(
                        striped && index % 2 == 1
                            ? Color(.systemGray6).opacity(0.5)
                            : Color.clear
                    )
                    .background(
                        selectedIds.contains(row.id)
                            ? Color.blue.opacity(0.1)
                            : Color.clear
                    )
                    .onTapGesture {
                        onRowTap?(row)
                    }

                    Divider()
                }
            }
        }
    }

    private func headerCell<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
        content()
            .font(.subheadline)
            .foregroundColor(.primary)
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
    }

    private func dataCell<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        content()
            .font(.subheadline)
            .foregroundColor(.primary)
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
    }
}

// MARK: - List-based Table (for iOS native feel)
struct ListTable<T: Identifiable>: View {
    let data: [T]
    let columns: [TableColumn<T>]
    var onRowTap: ((T) -> Void)? = nil

    var body: some View {
        List {
            ForEach(data) { row in
                HStack {
                    ForEach(columns) { column in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(column.title)
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text(row[keyPath: column.key])
                                .font(.body)
                        }
                        if column.id != columns.last?.id {
                            Spacer()
                        }
                    }
                }
                .contentShape(Rectangle())
                .onTapGesture {
                    onRowTap?(row)
                }
            }
        }
        .listStyle(.plain)
    }
}

// MARK: - Simple Key-Value Table
struct KeyValueTable: View {
    let items: [(key: String, value: String)]
    var striped: Bool = true

    var body: some View {
        VStack(spacing: 0) {
            ForEach(Array(items.enumerated()), id: \\.offset) { index, item in
                HStack {
                    Text(item.key)
                        .fontWeight(.medium)
                        .foregroundColor(.secondary)

                    Spacer()

                    Text(item.value)
                        .foregroundColor(.primary)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    striped && index % 2 == 1
                        ? Color(.systemGray6).opacity(0.5)
                        : Color.clear
                )

                if index < items.count - 1 {
                    Divider()
                        .padding(.leading, 16)
                }
            }
        }
        .background(Color(.systemBackground))
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color(.systemGray4), lineWidth: 0.5)
        )
    }
}

// MARK: - Paginated Table
struct PaginatedTable<T: Identifiable>: View {
    let data: [T]
    let columns: [TableColumn<T>]
    var pageSize: Int = 10

    @State private var currentPage = 1

    private var totalPages: Int {
        (data.count + pageSize - 1) / pageSize
    }

    private var paginatedData: [T] {
        let startIndex = (currentPage - 1) * pageSize
        let endIndex = min(startIndex + pageSize, data.count)
        return Array(data[startIndex..<endIndex])
    }

    var body: some View {
        VStack(spacing: 0) {
            DataTable(data: paginatedData, columns: columns, striped: true)

            // Pagination
            if totalPages > 1 {
                HStack {
                    Text("Page \\(currentPage) of \\(totalPages)")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Spacer()

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
                .padding()
                .background(Color(.systemGray6))
            }
        }
    }
}

// MARK: - Preview
struct TablePreview: PreviewProvider {
    struct User: Identifiable {
        let id = UUID()
        let name: String
        let email: String
        let role: String
    }

    static let users = [
        User(name: "John Doe", email: "john@example.com", role: "Admin"),
        User(name: "Jane Smith", email: "jane@example.com", role: "User"),
        User(name: "Bob Wilson", email: "bob@example.com", role: "Editor"),
    ]

    static let columns: [TableColumn<User>] = [
        TableColumn(key: \\.name, title: "Name", width: 120),
        TableColumn(key: \\.email, title: "Email", width: 180),
        TableColumn(key: \\.role, title: "Role", width: 80),
    ]

    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Data Table")
                    .font(.headline)
                DataTable(
                    data: users,
                    columns: columns,
                    sortable: true,
                    selectable: true,
                    striped: true
                )

                Divider()

                Text("Key-Value Table")
                    .font(.headline)
                KeyValueTable(items: [
                    ("Name", "John Doe"),
                    ("Email", "john@example.com"),
                    ("Role", "Administrator"),
                    ("Status", "Active"),
                ])
            }
            .padding()
        }
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3',
        'androidx.compose.foundation:foundation'
      ],
      imports: [
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.clickable',
        'androidx.compose.foundation.horizontalScroll',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.lazy.LazyColumn',
        'androidx.compose.foundation.lazy.itemsIndexed',
        'androidx.compose.foundation.rememberScrollState',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.text.style.TextAlign',
        'androidx.compose.ui.unit.Dp',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Column definition
data class TableColumn<T>(
    val key: String,
    val title: String,
    val width: Dp = 120.dp,
    val sortable: Boolean = true,
    val alignment: TextAlign = TextAlign.Start,
    val getValue: (T) -> String
)

// Sort direction
enum class SortDirection { ASC, DESC }

@Composable
fun <T> DataTable(
    data: List<T>,
    columns: List<TableColumn<T>>,
    modifier: Modifier = Modifier,
    sortable: Boolean = false,
    selectable: Boolean = false,
    striped: Boolean = false,
    pagination: Boolean = false,
    pageSize: Int = 10,
    onRowClick: ((T) -> Unit)? = null,
    onSelectionChange: ((List<T>) -> Unit)? = null,
    emptyMessage: String = "No data available"
) {
    var sortKey by remember { mutableStateOf<String?>(null) }
    var sortDirection by remember { mutableStateOf(SortDirection.ASC) }
    var selectedIndices by remember { mutableStateOf(setOf<Int>()) }
    var currentPage by remember { mutableStateOf(1) }

    // Sort data
    val sortedData = remember(data, sortKey, sortDirection) {
        if (sortKey == null) data
        else {
            val column = columns.find { it.key == sortKey }
            if (column != null) {
                data.sortedWith { a, b ->
                    val aVal = column.getValue(a)
                    val bVal = column.getValue(b)
                    val comparison = aVal.compareTo(bVal)
                    if (sortDirection == SortDirection.ASC) comparison else -comparison
                }
            } else data
        }
    }

    // Paginate data
    val displayData = remember(sortedData, pagination, currentPage, pageSize) {
        if (pagination) {
            val start = (currentPage - 1) * pageSize
            val end = minOf(start + pageSize, sortedData.size)
            sortedData.subList(start, end)
        } else sortedData
    }

    val totalPages = (sortedData.size + pageSize - 1) / pageSize

    Column(modifier = modifier) {
        // Table
        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
        ) {
            Column {
                // Header
                Row(
                    modifier = Modifier
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    if (selectable) {
                        Box(
                            modifier = Modifier
                                .width(48.dp)
                                .padding(12.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Checkbox(
                                checked = selectedIndices.size == displayData.size && displayData.isNotEmpty(),
                                onCheckedChange = { checked ->
                                    selectedIndices = if (checked) {
                                        displayData.indices.toSet()
                                    } else {
                                        emptySet()
                                    }
                                    onSelectionChange?.invoke(
                                        displayData.filterIndexed { index, _ -> selectedIndices.contains(index) }
                                    )
                                }
                            )
                        }
                    }

                    columns.forEach { column ->
                        Box(
                            modifier = Modifier
                                .width(column.width)
                                .clickable(enabled = sortable && column.sortable) {
                                    if (sortKey == column.key) {
                                        sortDirection = if (sortDirection == SortDirection.ASC)
                                            SortDirection.DESC else SortDirection.ASC
                                    } else {
                                        sortKey = column.key
                                        sortDirection = SortDirection.ASC
                                    }
                                }
                                .padding(12.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = column.title,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp
                                )
                                if (sortable && column.sortable && sortKey == column.key) {
                                    Icon(
                                        imageVector = if (sortDirection == SortDirection.ASC)
                                            Icons.Default.KeyboardArrowUp
                                        else
                                            Icons.Default.KeyboardArrowDown,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                Divider()

                // Body
                if (displayData.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = emptyMessage,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                } else {
                    displayData.forEachIndexed { index, item ->
                        Row(
                            modifier = Modifier
                                .background(
                                    when {
                                        selectedIndices.contains(index) -> MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
                                        striped && index % 2 == 1 -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
                                        else -> Color.Transparent
                                    }
                                )
                                .clickable(enabled = onRowClick != null) {
                                    onRowClick?.invoke(item)
                                }
                        ) {
                            if (selectable) {
                                Box(
                                    modifier = Modifier
                                        .width(48.dp)
                                        .padding(12.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Checkbox(
                                        checked = selectedIndices.contains(index),
                                        onCheckedChange = { checked ->
                                            selectedIndices = if (checked) {
                                                selectedIndices + index
                                            } else {
                                                selectedIndices - index
                                            }
                                            onSelectionChange?.invoke(
                                                displayData.filterIndexed { i, _ -> selectedIndices.contains(i) }
                                            )
                                        }
                                    )
                                }
                            }

                            columns.forEach { column ->
                                Box(
                                    modifier = Modifier
                                        .width(column.width)
                                        .padding(12.dp)
                                ) {
                                    Text(
                                        text = column.getValue(item),
                                        fontSize = 14.sp,
                                        textAlign = column.alignment
                                    )
                                }
                            }
                        }

                        Divider()
                    }
                }
            }
        }

        // Pagination
        if (pagination && totalPages > 1) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Page $currentPage of $totalPages",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = { currentPage = maxOf(1, currentPage - 1) },
                        enabled = currentPage > 1
                    ) {
                        Icon(Icons.Default.ChevronLeft, null)
                    }

                    IconButton(
                        onClick = { currentPage = minOf(totalPages, currentPage + 1) },
                        enabled = currentPage < totalPages
                    ) {
                        Icon(Icons.Default.ChevronRight, null)
                    }
                }
            }
        }
    }
}

// Simple key-value table
@Composable
fun KeyValueTable(
    items: List<Pair<String, String>>,
    modifier: Modifier = Modifier,
    striped: Boolean = true
) {
    Card(modifier = modifier) {
        Column {
            items.forEachIndexed { index, (key, value) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            if (striped && index % 2 == 1)
                                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
                            else Color.Transparent
                        )
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = key,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = value,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                if (index < items.lastIndex) {
                    Divider(modifier = Modifier.padding(start = 16.dp))
                }
            }
        }
    }
}

// LazyColumn based table for large datasets
@Composable
fun <T> LazyDataTable(
    data: List<T>,
    columns: List<TableColumn<T>>,
    modifier: Modifier = Modifier,
    striped: Boolean = false,
    onRowClick: ((T) -> Unit)? = null
) {
    Column(modifier = modifier) {
        // Header
        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .background(MaterialTheme.colorScheme.surfaceVariant)
        ) {
            columns.forEach { column ->
                Box(
                    modifier = Modifier
                        .width(column.width)
                        .padding(12.dp)
                ) {
                    Text(
                        text = column.title,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp
                    )
                }
            }
        }

        Divider()

        // Body with LazyColumn
        LazyColumn {
            itemsIndexed(data) { index, item ->
                Row(
                    modifier = Modifier
                        .horizontalScroll(rememberScrollState())
                        .background(
                            if (striped && index % 2 == 1)
                                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
                            else Color.Transparent
                        )
                        .clickable(enabled = onRowClick != null) {
                            onRowClick?.invoke(item)
                        }
                ) {
                    columns.forEach { column ->
                        Box(
                            modifier = Modifier
                                .width(column.width)
                                .padding(12.dp)
                        ) {
                            Text(
                                text = column.getValue(item),
                                fontSize = 14.sp
                            )
                        }
                    }
                }
                Divider()
            }
        }
    }
}
`
    }
  }
}
