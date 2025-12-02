/**
 * DatePicker Capsule - Multi-Platform Date Selection
 *
 * Date and time selection with calendar interface
 */

import { CapsuleDefinition } from './types'

export const DatePickerCapsule: CapsuleDefinition = {
  id: 'datepicker',
  name: 'DatePicker',
  description: 'Date and time selection with calendar interface',
  category: 'forms',
  tags: ['date', 'picker', 'calendar', 'time', 'datetime', 'input'],
  version: '1.0.0',

  props: [
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Selected date value (ISO string)'
    },
    {
      name: 'onChange',
      type: 'action',
      required: false,
      description: 'Callback when date changes'
    },
    {
      name: 'mode',
      type: 'select',
      required: false,
      default: 'date',
      description: 'Picker mode',
      options: ['date', 'time', 'datetime']
    },
    {
      name: 'minDate',
      type: 'string',
      required: false,
      description: 'Minimum selectable date'
    },
    {
      name: 'maxDate',
      type: 'string',
      required: false,
      description: 'Maximum selectable date'
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Label text'
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: 'Select date',
      description: 'Placeholder text'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the picker is disabled'
    },
    {
      name: 'error',
      type: 'string',
      required: false,
      description: 'Error message'
    },
    {
      name: 'format',
      type: 'string',
      required: false,
      description: 'Date format string'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, useRef, useEffect, useId } from 'react'

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  mode?: 'date' | 'time' | 'datetime'
  minDate?: Date
  maxDate?: Date
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  mode = 'date',
  minDate,
  maxDate,
  label,
  placeholder = 'Select date',
  disabled = false,
  error,
  className = ''
}: DatePickerProps) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value || new Date())
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    if (mode === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    if (mode === 'datetime') {
      return date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString()
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    if (value && mode === 'datetime') {
      newDate.setHours(value.getHours(), value.getMinutes())
    }
    onChange?.(newDate)
    if (mode === 'date') {
      setIsOpen(false)
    }
  }

  const handleMonthSelect = (month: number) => {
    setViewDate(new Date(viewDate.getFullYear(), month, 1))
    setViewMode('days')
  }

  const handleYearSelect = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1))
    setViewMode('months')
  }

  const handleTimeChange = (type: 'hours' | 'minutes', val: number) => {
    const newDate = value ? new Date(value) : new Date()
    if (type === 'hours') {
      newDate.setHours(val)
    } else {
      newDate.setMinutes(val)
    }
    onChange?.(newDate)
  }

  const navigateMonth = (direction: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1))
  }

  const navigateYear = (direction: number) => {
    setViewDate(new Date(viewDate.getFullYear() + direction, viewDate.getMonth(), 1))
  }

  const renderDays = () => {
    const days = []
    const daysInMonth = getDaysInMonth(viewDate)
    const firstDay = getFirstDayOfMonth(viewDate)

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={\`empty-\${i}\`} className="p-2" />)
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
      const isSelected = value && isSameDay(date, value)
      const isToday = isSameDay(date, new Date())
      const isDisabled = isDateDisabled(date)

      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateSelect(day)}
          className={\`
            p-2 text-sm rounded-full transition-colors
            \${isSelected
              ? 'bg-blue-600 text-white'
              : isToday
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }
            \${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          \`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const renderMonths = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    return months.map((month, index) => (
      <button
        key={month}
        type="button"
        onClick={() => handleMonthSelect(index)}
        className={\`
          p-2 text-sm rounded-lg transition-colors
          \${viewDate.getMonth() === index
            ? 'bg-blue-600 text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }
        \`}
      >
        {month}
      </button>
    ))
  }

  const renderYears = () => {
    const currentYear = viewDate.getFullYear()
    const startYear = currentYear - 6
    const years = []

    for (let i = 0; i < 12; i++) {
      const year = startYear + i
      years.push(
        <button
          key={year}
          type="button"
          onClick={() => handleYearSelect(year)}
          className={\`
            p-2 text-sm rounded-lg transition-colors
            \${currentYear === year
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          \`}
        >
          {year}
        </button>
      )
    }

    return years
  }

  const renderTimePicker = () => {
    const hours = value?.getHours() || 0
    const minutes = value?.getMinutes() || 0

    return (
      <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
        <select
          value={hours}
          onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <span className="text-xl">:</span>
        <select
          value={minutes}
          onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={\`relative \${className}\`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={\`
          w-full flex items-center justify-between gap-2 px-4 py-2
          bg-white dark:bg-gray-800 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          \${error
            ? 'border-red-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
          \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        \`}
      >
        <span className={\`\${!value ? 'text-gray-400' : 'text-gray-900 dark:text-white'}\`}>
          {value ? formatDate(value) : placeholder}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {(mode === 'date' || mode === 'datetime') && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => viewMode === 'days' ? navigateMonth(-1) : navigateYear(-1)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'days' ? 'months' : viewMode === 'months' ? 'years' : 'days')}
                  className="font-medium hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                >
                  {viewMode === 'days' && \`\${viewDate.toLocaleString('default', { month: 'long' })} \${viewDate.getFullYear()}\`}
                  {viewMode === 'months' && viewDate.getFullYear()}
                  {viewMode === 'years' && \`\${viewDate.getFullYear() - 6} - \${viewDate.getFullYear() + 5}\`}
                </button>

                <button
                  type="button"
                  onClick={() => viewMode === 'days' ? navigateMonth(1) : navigateYear(1)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar body */}
              <div className="p-3">
                {viewMode === 'days' && (
                  <>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="p-2 text-xs text-center text-gray-500 font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {renderDays()}
                    </div>
                  </>
                )}

                {viewMode === 'months' && (
                  <div className="grid grid-cols-3 gap-2">
                    {renderMonths()}
                  </div>
                )}

                {viewMode === 'years' && (
                  <div className="grid grid-cols-3 gap-2">
                    {renderYears()}
                  </div>
                )}
              </div>
            </>
          )}

          {(mode === 'time' || mode === 'datetime') && renderTimePicker()}

          {mode === 'datetime' && (
            <div className="flex justify-end p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Date Range Picker
interface DateRangePickerProps {
  startDate?: Date | null
  endDate?: Date | null
  onRangeChange?: (start: Date | null, end: Date | null) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
  label,
  disabled = false,
  className = ''
}: DateRangePickerProps) {
  const [selectingEnd, setSelectingEnd] = useState(false)

  const handleDateChange = (date: Date | null) => {
    if (!selectingEnd) {
      onRangeChange?.(date, null)
      setSelectingEnd(true)
    } else {
      onRangeChange?.(startDate || null, date)
      setSelectingEnd(false)
    }
  }

  return (
    <div className={\`flex items-center gap-2 \${className}\`}>
      <DatePicker
        value={startDate}
        onChange={(date) => {
          onRangeChange?.(date, endDate || null)
        }}
        label={label ? \`\${label} (Start)\` : 'Start Date'}
        placeholder="Start date"
        disabled={disabled}
        maxDate={endDate || undefined}
      />
      <span className="text-gray-400">→</span>
      <DatePicker
        value={endDate}
        onChange={(date) => {
          onRangeChange?.(startDate || null, date)
        }}
        label={label ? \`\${label} (End)\` : 'End Date'}
        placeholder="End date"
        disabled={disabled}
        minDate={startDate || undefined}
      />
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

// MARK: - DatePicker Mode
enum DatePickerMode {
    case date
    case time
    case dateTime
}

// MARK: - Custom DatePicker
struct CustomDatePicker: View {
    @Binding var selection: Date
    var mode: DatePickerMode = .date
    var label: String? = nil
    var minDate: Date? = nil
    var maxDate: Date? = nil
    var disabled: Bool = false
    var error: String? = nil

    @State private var isPresented = false

    private var dateRange: ClosedRange<Date> {
        let min = minDate ?? Date.distantPast
        let max = maxDate ?? Date.distantFuture
        return min...max
    }

    private var displayComponents: DatePickerComponents {
        switch mode {
        case .date: return .date
        case .time: return .hourAndMinute
        case .dateTime: return [.date, .hourAndMinute]
        }
    }

    private var formattedDate: String {
        let formatter = DateFormatter()
        switch mode {
        case .date:
            formatter.dateStyle = .medium
            formatter.timeStyle = .none
        case .time:
            formatter.dateStyle = .none
            formatter.timeStyle = .short
        case .dateTime:
            formatter.dateStyle = .medium
            formatter.timeStyle = .short
        }
        return formatter.string(from: selection)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.secondary)
            }

            Button {
                if !disabled {
                    isPresented = true
                }
            } label: {
                HStack {
                    Text(formattedDate)
                        .foregroundColor(.primary)

                    Spacer()

                    Image(systemName: mode == .time ? "clock" : "calendar")
                        .foregroundColor(.secondary)
                }
                .padding(12)
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(error != nil ? Color.red : Color.gray.opacity(0.3), lineWidth: 1)
                )
            }
            .disabled(disabled)
            .opacity(disabled ? 0.5 : 1)
            .sheet(isPresented: $isPresented) {
                NavigationView {
                    DatePicker(
                        "",
                        selection: $selection,
                        in: dateRange,
                        displayedComponents: displayComponents
                    )
                    .datePickerStyle(.graphical)
                    .labelsHidden()
                    .padding()
                    .navigationTitle(label ?? "Select Date")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .confirmationAction) {
                            Button("Done") {
                                isPresented = false
                            }
                        }
                    }
                }
                .presentationDetents([.medium])
            }

            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
    }
}

// MARK: - Inline DatePicker
struct InlineDatePicker: View {
    @Binding var selection: Date
    var mode: DatePickerMode = .date
    var label: String? = nil
    var minDate: Date? = nil
    var maxDate: Date? = nil

    private var dateRange: ClosedRange<Date> {
        let min = minDate ?? Date.distantPast
        let max = maxDate ?? Date.distantFuture
        return min...max
    }

    private var displayComponents: DatePickerComponents {
        switch mode {
        case .date: return .date
        case .time: return .hourAndMinute
        case .dateTime: return [.date, .hourAndMinute]
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let label = label {
                Text(label)
                    .font(.headline)
            }

            DatePicker(
                "",
                selection: $selection,
                in: dateRange,
                displayedComponents: displayComponents
            )
            .datePickerStyle(.graphical)
            .labelsHidden()
        }
    }
}

// MARK: - Wheel DatePicker
struct WheelDatePicker: View {
    @Binding var selection: Date
    var mode: DatePickerMode = .dateTime
    var label: String? = nil

    private var displayComponents: DatePickerComponents {
        switch mode {
        case .date: return .date
        case .time: return .hourAndMinute
        case .dateTime: return [.date, .hourAndMinute]
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let label = label {
                Text(label)
                    .font(.headline)
            }

            DatePicker(
                "",
                selection: $selection,
                displayedComponents: displayComponents
            )
            .datePickerStyle(.wheel)
            .labelsHidden()
        }
    }
}

// MARK: - Compact DatePicker
struct CompactDatePicker: View {
    @Binding var selection: Date
    var mode: DatePickerMode = .date
    var label: String

    private var displayComponents: DatePickerComponents {
        switch mode {
        case .date: return .date
        case .time: return .hourAndMinute
        case .dateTime: return [.date, .hourAndMinute]
        }
    }

    var body: some View {
        DatePicker(
            label,
            selection: $selection,
            displayedComponents: displayComponents
        )
        .datePickerStyle(.compact)
    }
}

// MARK: - Date Range Picker
struct DateRangePicker: View {
    @Binding var startDate: Date
    @Binding var endDate: Date
    var label: String? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let label = label {
                Text(label)
                    .font(.headline)
            }

            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Start")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    DatePicker(
                        "",
                        selection: $startDate,
                        in: ...endDate,
                        displayedComponents: .date
                    )
                    .datePickerStyle(.compact)
                    .labelsHidden()
                }

                Image(systemName: "arrow.right")
                    .foregroundColor(.secondary)

                VStack(alignment: .leading, spacing: 4) {
                    Text("End")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    DatePicker(
                        "",
                        selection: $endDate,
                        in: startDate...,
                        displayedComponents: .date
                    )
                    .datePickerStyle(.compact)
                    .labelsHidden()
                }
            }
        }
    }
}

// MARK: - Form Row DatePicker
struct FormDatePicker: View {
    @Binding var selection: Date
    var label: String
    var icon: String? = nil
    var mode: DatePickerMode = .date

    private var displayComponents: DatePickerComponents {
        switch mode {
        case .date: return .date
        case .time: return .hourAndMinute
        case .dateTime: return [.date, .hourAndMinute]
        }
    }

    var body: some View {
        HStack {
            if let icon = icon {
                Image(systemName: icon)
                    .foregroundColor(.blue)
                    .frame(width: 24)
            }

            DatePicker(
                label,
                selection: $selection,
                displayedComponents: displayComponents
            )
        }
    }
}

// MARK: - Preview
struct DatePickerPreview: PreviewProvider {
    struct PreviewContainer: View {
        @State private var date1 = Date()
        @State private var date2 = Date()
        @State private var date3 = Date()
        @State private var startDate = Date()
        @State private var endDate = Date().addingTimeInterval(86400 * 7)

        var body: some View {
            NavigationView {
                Form {
                    Section("Custom DatePicker") {
                        CustomDatePicker(
                            selection: $date1,
                            mode: .date,
                            label: "Select Date"
                        )

                        CustomDatePicker(
                            selection: $date2,
                            mode: .dateTime,
                            label: "Select Date & Time"
                        )

                        CustomDatePicker(
                            selection: $date3,
                            mode: .date,
                            label: "With Error",
                            error: "Please select a valid date"
                        )
                    }

                    Section("Compact Style") {
                        CompactDatePicker(
                            selection: $date1,
                            mode: .date,
                            label: "Date"
                        )

                        CompactDatePicker(
                            selection: $date2,
                            mode: .time,
                            label: "Time"
                        )
                    }

                    Section("Form Row") {
                        FormDatePicker(
                            selection: $date1,
                            label: "Birthday",
                            icon: "gift",
                            mode: .date
                        )

                        FormDatePicker(
                            selection: $date2,
                            label: "Reminder",
                            icon: "bell",
                            mode: .dateTime
                        )
                    }

                    Section("Date Range") {
                        DateRangePicker(
                            startDate: $startDate,
                            endDate: $endDate,
                            label: "Trip Dates"
                        )
                    }
                }
                .navigationTitle("DatePicker")
            }
        }
    }

    static var previews: some View {
        PreviewContainer()
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3'
      ],
      imports: [
        'android.app.DatePickerDialog',
        'android.app.TimePickerDialog',
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.border',
        'androidx.compose.foundation.clickable',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.*',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.platform.LocalContext',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp',
        'java.text.SimpleDateFormat',
        'java.util.*'
      ],
      code: `
package com.hublab.capsules

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.SimpleDateFormat
import java.util.*

// DatePicker modes
enum class DatePickerMode {
    DATE, TIME, DATE_TIME
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomDatePicker(
    selectedDate: Date?,
    onDateSelected: (Date) -> Unit,
    modifier: Modifier = Modifier,
    mode: DatePickerMode = DatePickerMode.DATE,
    label: String? = null,
    placeholder: String = "Select date",
    minDate: Date? = null,
    maxDate: Date? = null,
    disabled: Boolean = false,
    error: String? = null
) {
    val context = LocalContext.current
    val calendar = Calendar.getInstance()
    selectedDate?.let { calendar.time = it }

    val dateFormatter = remember {
        when (mode) {
            DatePickerMode.DATE -> SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            DatePickerMode.TIME -> SimpleDateFormat("HH:mm", Locale.getDefault())
            DatePickerMode.DATE_TIME -> SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault())
        }
    }

    var showDatePicker by remember { mutableStateOf(false) }
    var showTimePicker by remember { mutableStateOf(false) }

    val datePickerState = rememberDatePickerState(
        initialSelectedDateMillis = selectedDate?.time ?: System.currentTimeMillis()
    )

    val timePickerState = rememberTimePickerState(
        initialHour = calendar.get(Calendar.HOUR_OF_DAY),
        initialMinute = calendar.get(Calendar.MINUTE)
    )

    Column(modifier = modifier) {
        if (label != null) {
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .border(
                    width = 1.dp,
                    color = if (error != null)
                        MaterialTheme.colorScheme.error
                    else
                        MaterialTheme.colorScheme.outline,
                    shape = RoundedCornerShape(8.dp)
                )
                .background(MaterialTheme.colorScheme.surface)
                .clickable(enabled = !disabled) {
                    when (mode) {
                        DatePickerMode.DATE -> showDatePicker = true
                        DatePickerMode.TIME -> showTimePicker = true
                        DatePickerMode.DATE_TIME -> showDatePicker = true
                    }
                }
                .padding(horizontal = 16.dp, vertical = 12.dp)
                .alpha(if (disabled) 0.5f else 1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = selectedDate?.let { dateFormatter.format(it) } ?: placeholder,
                color = if (selectedDate != null)
                    MaterialTheme.colorScheme.onSurface
                else
                    MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )

            Icon(
                imageVector = if (mode == DatePickerMode.TIME)
                    Icons.Default.Schedule
                else
                    Icons.Default.CalendarToday,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        if (error != null) {
            Text(
                text = error,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(top = 4.dp, start = 4.dp)
            )
        }
    }

    // Date Picker Dialog
    if (showDatePicker) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        datePickerState.selectedDateMillis?.let { millis ->
                            val newDate = Calendar.getInstance().apply {
                                timeInMillis = millis
                                if (mode == DatePickerMode.DATE_TIME && selectedDate != null) {
                                    val oldCal = Calendar.getInstance().apply { time = selectedDate }
                                    set(Calendar.HOUR_OF_DAY, oldCal.get(Calendar.HOUR_OF_DAY))
                                    set(Calendar.MINUTE, oldCal.get(Calendar.MINUTE))
                                }
                            }.time
                            onDateSelected(newDate)

                            if (mode == DatePickerMode.DATE_TIME) {
                                showDatePicker = false
                                showTimePicker = true
                            } else {
                                showDatePicker = false
                            }
                        }
                    }
                ) {
                    Text(if (mode == DatePickerMode.DATE_TIME) "Next" else "OK")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text("Cancel")
                }
            }
        ) {
            DatePicker(
                state = datePickerState,
                modifier = Modifier.padding(16.dp)
            )
        }
    }

    // Time Picker Dialog
    if (showTimePicker) {
        AlertDialog(
            onDismissRequest = { showTimePicker = false },
            title = { Text("Select Time") },
            text = {
                TimePicker(
                    state = timePickerState,
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        val newDate = Calendar.getInstance().apply {
                            selectedDate?.let { time = it }
                            set(Calendar.HOUR_OF_DAY, timePickerState.hour)
                            set(Calendar.MINUTE, timePickerState.minute)
                        }.time
                        onDateSelected(newDate)
                        showTimePicker = false
                    }
                ) {
                    Text("OK")
                }
            },
            dismissButton = {
                TextButton(onClick = { showTimePicker = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

// Simple Date Field (uses native dialog)
@Composable
fun DateField(
    selectedDate: Date?,
    onDateSelected: (Date) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String = "Select date"
) {
    val context = LocalContext.current
    val calendar = Calendar.getInstance()
    selectedDate?.let { calendar.time = it }

    val dateFormatter = remember {
        SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
    }

    Column(modifier = modifier) {
        if (label != null) {
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        OutlinedTextField(
            value = selectedDate?.let { dateFormatter.format(it) } ?: "",
            onValueChange = {},
            readOnly = true,
            placeholder = { Text(placeholder) },
            trailingIcon = {
                IconButton(
                    onClick = {
                        DatePickerDialog(
                            context,
                            { _, year, month, day ->
                                val newDate = Calendar.getInstance().apply {
                                    set(year, month, day)
                                }.time
                                onDateSelected(newDate)
                            },
                            calendar.get(Calendar.YEAR),
                            calendar.get(Calendar.MONTH),
                            calendar.get(Calendar.DAY_OF_MONTH)
                        ).show()
                    }
                ) {
                    Icon(Icons.Default.CalendarToday, null)
                }
            },
            modifier = Modifier.fillMaxWidth()
        )
    }
}

// Date Range Picker
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DateRangePicker(
    startDate: Date?,
    endDate: Date?,
    onRangeSelected: (Date?, Date?) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null
) {
    val dateFormatter = remember {
        SimpleDateFormat("MMM dd", Locale.getDefault())
    }

    var showPicker by remember { mutableStateOf(false) }

    val dateRangePickerState = rememberDateRangePickerState(
        initialSelectedStartDateMillis = startDate?.time,
        initialSelectedEndDateMillis = endDate?.time
    )

    Column(modifier = modifier) {
        if (label != null) {
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 4.dp)
            )
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(8.dp))
                .background(MaterialTheme.colorScheme.surface)
                .clickable { showPicker = true }
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = Icons.Default.DateRange,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Text(
                text = if (startDate != null && endDate != null) {
                    "${dateFormatter.format(startDate)} - ${dateFormatter.format(endDate)}"
                } else {
                    "Select date range"
                },
                color = if (startDate != null)
                    MaterialTheme.colorScheme.onSurface
                else
                    MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )
        }
    }

    if (showPicker) {
        DatePickerDialog(
            onDismissRequest = { showPicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        val start = dateRangePickerState.selectedStartDateMillis?.let { Date(it) }
                        val end = dateRangePickerState.selectedEndDateMillis?.let { Date(it) }
                        onRangeSelected(start, end)
                        showPicker = false
                    }
                ) {
                    Text("OK")
                }
            },
            dismissButton = {
                TextButton(onClick = { showPicker = false }) {
                    Text("Cancel")
                }
            }
        ) {
            DateRangePicker(
                state = dateRangePickerState,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            )
        }
    }
}

private fun Modifier.alpha(alpha: Float): Modifier = this.then(
    Modifier.graphicsLayer(alpha = alpha)
)

private fun Modifier.graphicsLayer(alpha: Float): Modifier {
    return this
}
`
    }
  }
}
