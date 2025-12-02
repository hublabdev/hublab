/**
 * Calendar Capsule
 *
 * Full calendar component for date navigation and event display.
 * Generates native SwiftUI, Jetpack Compose, and React code.
 */

import type { CapsuleDefinition } from './types'

export const CalendarCapsule: CapsuleDefinition = {
  id: 'calendar',
  name: 'Calendar',
  description: 'Full calendar component for date navigation and events',
  category: 'input',
  tags: ['calendar', 'date', 'schedule', 'events', 'picker'],

  props: {
    selectedDate: {
      type: 'date',
      description: 'Currently selected date'
    },
    events: {
      type: 'array',
      description: 'Array of calendar events'
    },
    view: {
      type: 'string',
      default: 'month',
      options: ['day', 'week', 'month', 'year'],
      description: 'Calendar view mode'
    },
    minDate: {
      type: 'date',
      description: 'Minimum selectable date'
    },
    maxDate: {
      type: 'date',
      description: 'Maximum selectable date'
    },
    firstDayOfWeek: {
      type: 'number',
      default: 0,
      description: '0 = Sunday, 1 = Monday'
    },
    showWeekNumbers: {
      type: 'boolean',
      default: false,
      description: 'Show week numbers'
    },
    highlightToday: {
      type: 'boolean',
      default: true,
      description: 'Highlight current date'
    },
    onDateSelect: {
      type: 'function',
      description: 'Callback when date is selected'
    },
    onMonthChange: {
      type: 'function',
      description: 'Callback when month changes'
    }
  },

  platforms: {
    web: {
      dependencies: ['react', 'date-fns', 'lucide-react'],
      code: `
import React, { useState, useMemo, useCallback } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isWithinInterval,
  isBefore,
  isAfter,
  getWeek
} from 'date-fns'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  color?: string
  allDay?: boolean
  startTime?: string
  endTime?: string
}

interface CalendarProps {
  selectedDate?: Date
  events?: CalendarEvent[]
  view?: 'day' | 'week' | 'month' | 'year'
  minDate?: Date
  maxDate?: Date
  firstDayOfWeek?: 0 | 1
  showWeekNumbers?: boolean
  highlightToday?: boolean
  onDateSelect?: (date: Date) => void
  onMonthChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  className?: string
}

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']

export function Calendar({
  selectedDate,
  events = [],
  view = 'month',
  minDate,
  maxDate,
  firstDayOfWeek = 0,
  showWeekNumbers = false,
  highlightToday = true,
  onDateSelect,
  onMonthChange,
  onEventClick,
  className = ''
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [currentView, setCurrentView] = useState(view)

  const weekdays = useMemo(() => {
    if (firstDayOfWeek === 1) {
      return [...WEEKDAYS_SHORT.slice(1), WEEKDAYS_SHORT[0]]
    }
    return WEEKDAYS_SHORT
  }, [firstDayOfWeek])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: firstDayOfWeek })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: firstDayOfWeek })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate, firstDayOfWeek])

  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && isBefore(date, minDate)) return true
    if (maxDate && isAfter(date, maxDate)) return true
    return false
  }, [minDate, maxDate])

  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }, [events])

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    const newDate = direction === 'prev'
      ? subMonths(currentDate, 1)
      : addMonths(currentDate, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate)
  }, [currentDate, onMonthChange])

  const navigateYear = useCallback((direction: 'prev' | 'next') => {
    const newDate = direction === 'prev'
      ? subYears(currentDate, 1)
      : addYears(currentDate, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate)
  }, [currentDate, onMonthChange])

  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return
    onDateSelect?.(date)
  }, [isDateDisabled, onDateSelect])

  const goToToday = useCallback(() => {
    const today = new Date()
    setCurrentDate(today)
    onDateSelect?.(today)
    onMonthChange?.(today)
  }, [onDateSelect, onMonthChange])

  // Month View
  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* Weekday headers */}
      {showWeekNumbers && <div className="w-8" />}
      {weekdays.map(day => (
        <div
          key={day}
          className="py-2 text-center text-xs font-medium text-gray-500 uppercase"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarDays.map((day, index) => {
        const dayEvents = getEventsForDate(day)
        const isCurrentMonth = isSameMonth(day, currentDate)
        const isSelected = selectedDate && isSameDay(day, selectedDate)
        const isTodayDate = isToday(day)
        const isDisabled = isDateDisabled(day)

        return (
          <React.Fragment key={day.toISOString()}>
            {showWeekNumbers && index % 7 === 0 && (
              <div className="w-8 flex items-center justify-center text-xs text-gray-400">
                {getWeek(day)}
              </div>
            )}
            <button
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={\`
                relative p-2 min-h-[80px] text-sm rounded-lg transition-colors
                \${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                \${isSelected ? 'bg-blue-600 text-white' : ''}
                \${isTodayDate && highlightToday && !isSelected ? 'ring-2 ring-blue-500' : ''}
                \${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                \${!isSelected && isCurrentMonth && !isDisabled ? 'hover:bg-gray-50' : ''}
              \`}
            >
              <span className={\`
                absolute top-1 left-1 w-6 h-6 flex items-center justify-center rounded-full
                \${isTodayDate && highlightToday && !isSelected ? 'bg-blue-600 text-white' : ''}
              \`}>
                {format(day, 'd')}
              </span>

              {/* Events */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick?.(event)
                      }}
                      className={\`
                        text-xs truncate px-1 py-0.5 rounded cursor-pointer
                        \${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}
                      \`}
                      style={event.color ? { backgroundColor: event.color, color: 'white' } : undefined}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </button>
          </React.Fragment>
        )
      })}
    </div>
  )

  // Year View
  const renderYearView = () => (
    <div className="grid grid-cols-3 gap-4">
      {MONTHS.map((month, index) => {
        const monthDate = new Date(currentDate.getFullYear(), index, 1)
        const monthEvents = events.filter(e => {
          const eventDate = new Date(e.date)
          return eventDate.getMonth() === index &&
                 eventDate.getFullYear() === currentDate.getFullYear()
        })

        return (
          <button
            key={month}
            onClick={() => {
              setCurrentDate(monthDate)
              setCurrentView('month')
            }}
            className={\`
              p-4 rounded-lg border text-left transition-colors hover:bg-gray-50
              \${selectedDate && selectedDate.getMonth() === index &&
                selectedDate.getFullYear() === currentDate.getFullYear()
                ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
            \`}
          >
            <div className="font-medium">{month}</div>
            {monthEvents.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {monthEvents.length} event{monthEvents.length > 1 ? 's' : ''}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className={\`bg-white rounded-xl shadow-sm border border-gray-200 \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => currentView === 'year' ? navigateYear('prev') : navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => setCurrentView(currentView === 'month' ? 'year' : 'month')}
            className="flex items-center gap-1 px-3 py-2 font-semibold hover:bg-gray-100 rounded-lg"
          >
            {currentView === 'year'
              ? currentDate.getFullYear()
              : format(currentDate, 'MMMM yyyy')}
            <ChevronDown size={16} />
          </button>

          <button
            onClick={() => currentView === 'year' ? navigateYear('next') : navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        {currentView === 'month' && renderMonthView()}
        {currentView === 'year' && renderYearView()}
      </div>
    </div>
  )
}

// Mini Calendar (compact version)
export function MiniCalendar({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  className = ''
}: Omit<CalendarProps, 'events' | 'view' | 'showWeekNumbers'>) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  return (
    <div className={\`bg-white rounded-lg shadow-sm border p-3 w-64 \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium">
          {format(currentDate, 'MMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map(day => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isTodayDate = isToday(day)
          const isDisabled = (minDate && isBefore(day, minDate)) ||
                            (maxDate && isAfter(day, maxDate))

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isDisabled && onDateSelect?.(day)}
              disabled={isDisabled}
              className={\`
                w-8 h-8 text-xs rounded-full flex items-center justify-center
                \${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                \${isSelected ? 'bg-blue-600 text-white' : ''}
                \${isTodayDate && !isSelected ? 'border border-blue-500' : ''}
                \${isDisabled ? 'opacity-50' : 'hover:bg-gray-100'}
              \`}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Calendar with Event List
export function CalendarWithEvents({
  events = [],
  onEventClick,
  onAddEvent,
  className = ''
}: {
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onAddEvent?: (date: Date) => void
  className?: string
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const selectedDateEvents = useMemo(() => {
    return events.filter(e => isSameDay(new Date(e.date), selectedDate))
  }, [events, selectedDate])

  return (
    <div className={\`flex gap-6 \${className}\`}>
      <Calendar
        selectedDate={selectedDate}
        events={events}
        onDateSelect={setSelectedDate}
        onEventClick={onEventClick}
        className="flex-1"
      />

      {/* Event List */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            {format(selectedDate, 'EEEE, MMM d')}
          </h3>
          {onAddEvent && (
            <button
              onClick={() => onAddEvent(selectedDate)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Event
            </button>
          )}
        </div>

        {selectedDateEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No events scheduled</p>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.color || '#3b82f6' }}
                  />
                  <span className="font-medium text-sm">{event.title}</span>
                </div>
                {!event.allDay && event.startTime && (
                  <div className="text-xs text-gray-500 mt-1 ml-4">
                    {event.startTime} {event.endTime && \`- \${event.endTime}\`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
`
    },

    ios: {
      dependencies: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Calendar Event
struct CalendarEvent: Identifiable {
    let id: String
    let title: String
    let date: Date
    var color: Color = .blue
    var isAllDay: Bool = true
    var startTime: String?
    var endTime: String?
}

// MARK: - Calendar View
struct CalendarView: View {
    @Binding var selectedDate: Date?
    var events: [CalendarEvent] = []
    var minDate: Date?
    var maxDate: Date?
    var firstDayOfWeek: Int = 1 // 1 = Monday
    var showWeekNumbers: Bool = false
    var highlightToday: Bool = true
    var onDateSelect: ((Date) -> Void)?
    var onEventTap: ((CalendarEvent) -> Void)?

    @State private var currentMonth: Date = Date()
    @State private var showYearView = false

    private let calendar = Calendar.current
    private let weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    private let months = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"]

    private var monthDays: [Date] {
        guard let monthInterval = calendar.dateInterval(of: .month, for: currentMonth),
              let monthFirstWeek = calendar.dateInterval(of: .weekOfMonth, for: monthInterval.start),
              let monthLastWeek = calendar.dateInterval(of: .weekOfMonth, for: monthInterval.end - 1)
        else { return [] }

        let dateInterval = DateInterval(start: monthFirstWeek.start, end: monthLastWeek.end)
        return calendar.generateDates(for: dateInterval, matching: DateComponents(hour: 12))
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView

            // Content
            if showYearView {
                yearView
            } else {
                monthView
            }
        }
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10)
    }

    // MARK: - Header
    private var headerView: some View {
        HStack {
            Button {
                withAnimation {
                    if showYearView {
                        currentMonth = calendar.date(byAdding: .year, value: -1, to: currentMonth) ?? currentMonth
                    } else {
                        currentMonth = calendar.date(byAdding: .month, value: -1, to: currentMonth) ?? currentMonth
                    }
                }
            } label: {
                Image(systemName: "chevron.left")
                    .font(.title3)
                    .foregroundColor(.primary)
            }

            Spacer()

            Button {
                withAnimation {
                    showYearView.toggle()
                }
            } label: {
                Text(headerTitle)
                    .font(.headline)
                    .foregroundColor(.primary)

                Image(systemName: "chevron.down")
                    .font(.caption)
                    .rotationEffect(.degrees(showYearView ? 180 : 0))
            }

            Spacer()

            Button {
                withAnimation {
                    if showYearView {
                        currentMonth = calendar.date(byAdding: .year, value: 1, to: currentMonth) ?? currentMonth
                    } else {
                        currentMonth = calendar.date(byAdding: .month, value: 1, to: currentMonth) ?? currentMonth
                    }
                }
            } label: {
                Image(systemName: "chevron.right")
                    .font(.title3)
                    .foregroundColor(.primary)
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
    }

    private var headerTitle: String {
        if showYearView {
            return String(calendar.component(.year, from: currentMonth))
        }
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        return formatter.string(from: currentMonth)
    }

    // MARK: - Month View
    private var monthView: some View {
        VStack(spacing: 8) {
            // Weekday headers
            HStack(spacing: 0) {
                if showWeekNumbers {
                    Text("Wk")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .frame(width: 30)
                }

                ForEach(weekdays, id: \\.self) { day in
                    Text(day)
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal)

            // Days grid
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 4), count: showWeekNumbers ? 8 : 7), spacing: 4) {
                ForEach(Array(monthDays.enumerated()), id: \\.element) { index, date in
                    if showWeekNumbers && index % 7 == 0 {
                        Text("\\(calendar.component(.weekOfYear, from: date))")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .frame(width: 30)
                    }

                    dayCell(for: date)
                }
            }
            .padding()
        }
    }

    private func dayCell(for date: Date) -> some View {
        let isCurrentMonth = calendar.isDate(date, equalTo: currentMonth, toGranularity: .month)
        let isSelected = selectedDate.map { calendar.isDate(date, inSameDayAs: $0) } ?? false
        let isToday = calendar.isDateInToday(date)
        let dayEvents = events.filter { calendar.isDate($0.date, inSameDayAs: date) }
        let isDisabled = isDateDisabled(date)

        return Button {
            if !isDisabled {
                selectedDate = date
                onDateSelect?(date)
            }
        } label: {
            VStack(spacing: 2) {
                Text("\\(calendar.component(.day, from: date))")
                    .font(.system(.body, design: .rounded))
                    .fontWeight(isToday ? .bold : .regular)
                    .foregroundColor(textColor(isCurrentMonth: isCurrentMonth, isSelected: isSelected, isToday: isToday))

                // Event dots
                if !dayEvents.isEmpty {
                    HStack(spacing: 2) {
                        ForEach(dayEvents.prefix(3)) { event in
                            Circle()
                                .fill(event.color)
                                .frame(width: 4, height: 4)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(backgroundColor(isSelected: isSelected, isToday: isToday && highlightToday))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .strokeBorder(isToday && highlightToday && !isSelected ? Color.blue : Color.clear, lineWidth: 2)
            )
        }
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.4 : 1)
    }

    private func textColor(isCurrentMonth: Bool, isSelected: Bool, isToday: Bool) -> Color {
        if isSelected { return .white }
        if !isCurrentMonth { return .secondary.opacity(0.5) }
        return .primary
    }

    private func backgroundColor(isSelected: Bool, isToday: Bool) -> Color {
        if isSelected { return .blue }
        if isToday { return .blue.opacity(0.1) }
        return .clear
    }

    private func isDateDisabled(_ date: Date) -> Bool {
        if let minDate = minDate, date < minDate { return true }
        if let maxDate = maxDate, date > maxDate { return true }
        return false
    }

    // MARK: - Year View
    private var yearView: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 16) {
            ForEach(0..<12) { monthIndex in
                let monthDate = calendar.date(from: DateComponents(
                    year: calendar.component(.year, from: currentMonth),
                    month: monthIndex + 1
                ))!

                let monthEvents = events.filter {
                    calendar.isDate($0.date, equalTo: monthDate, toGranularity: .month)
                }

                Button {
                    withAnimation {
                        currentMonth = monthDate
                        showYearView = false
                    }
                } label: {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(months[monthIndex])
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(.primary)

                        if !monthEvents.isEmpty {
                            Text("\\(monthEvents.count) events")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(12)
                }
            }
        }
        .padding()
    }
}

// MARK: - Mini Calendar
struct MiniCalendar: View {
    @Binding var selectedDate: Date
    var minDate: Date?
    var maxDate: Date?

    @State private var currentMonth: Date = Date()
    private let calendar = Calendar.current

    private var monthDays: [Date] {
        guard let monthInterval = calendar.dateInterval(of: .month, for: currentMonth),
              let monthFirstWeek = calendar.dateInterval(of: .weekOfMonth, for: monthInterval.start),
              let monthLastWeek = calendar.dateInterval(of: .weekOfMonth, for: monthInterval.end - 1)
        else { return [] }

        let dateInterval = DateInterval(start: monthFirstWeek.start, end: monthLastWeek.end)
        return calendar.generateDates(for: dateInterval, matching: DateComponents(hour: 12))
    }

    var body: some View {
        VStack(spacing: 8) {
            // Header
            HStack {
                Button {
                    currentMonth = calendar.date(byAdding: .month, value: -1, to: currentMonth) ?? currentMonth
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.caption)
                }

                Spacer()

                Text(currentMonth, formatter: monthYearFormatter)
                    .font(.subheadline)
                    .fontWeight(.medium)

                Spacer()

                Button {
                    currentMonth = calendar.date(byAdding: .month, value: 1, to: currentMonth) ?? currentMonth
                } label: {
                    Image(systemName: "chevron.right")
                        .font(.caption)
                }
            }

            // Weekdays
            HStack(spacing: 0) {
                ForEach(["S", "M", "T", "W", "T", "F", "S"], id: \\.self) { day in
                    Text(day)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity)
                }
            }

            // Days
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 2), count: 7), spacing: 2) {
                ForEach(monthDays, id: \\.self) { date in
                    let isCurrentMonth = calendar.isDate(date, equalTo: currentMonth, toGranularity: .month)
                    let isSelected = calendar.isDate(date, inSameDayAs: selectedDate)
                    let isToday = calendar.isDateInToday(date)

                    Button {
                        selectedDate = date
                    } label: {
                        Text("\\(calendar.component(.day, from: date))")
                            .font(.caption)
                            .frame(width: 28, height: 28)
                            .foregroundColor(isSelected ? .white : isCurrentMonth ? .primary : .secondary.opacity(0.5))
                            .background(isSelected ? Color.blue : Color.clear)
                            .clipShape(Circle())
                            .overlay(
                                Circle()
                                    .strokeBorder(isToday && !isSelected ? Color.blue : Color.clear, lineWidth: 1)
                            )
                    }
                }
            }
        }
        .padding()
        .frame(width: 220)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 8)
    }

    private var monthYearFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM yyyy"
        return formatter
    }
}

// MARK: - Calendar Helper Extension
extension Calendar {
    func generateDates(for dateInterval: DateInterval, matching components: DateComponents) -> [Date] {
        var dates: [Date] = []
        dates.append(dateInterval.start)

        enumerateDates(startingAfter: dateInterval.start, matching: components, matchingPolicy: .nextTime) { date, _, stop in
            if let date = date {
                if date < dateInterval.end {
                    dates.append(date)
                } else {
                    stop = true
                }
            }
        }
        return dates
    }
}

// MARK: - Preview
struct CalendarView_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            CalendarView(
                selectedDate: .constant(Date()),
                events: [
                    CalendarEvent(id: "1", title: "Meeting", date: Date(), color: .blue),
                    CalendarEvent(id: "2", title: "Lunch", date: Date(), color: .green)
                ]
            )
            .padding()

            MiniCalendar(selectedDate: .constant(Date()))
        }
    }
}
`
    },

    android: {
      dependencies: ['androidx.compose.material3', 'java.time'],
      code: `
package com.hublab.capsules

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.time.temporal.WeekFields
import java.util.*

// Calendar Event
data class CalendarEvent(
    val id: String,
    val title: String,
    val date: LocalDate,
    val color: Color = Color(0xFF3B82F6),
    val isAllDay: Boolean = true,
    val startTime: String? = null,
    val endTime: String? = null
)

// Calendar View
@Composable
fun CalendarView(
    selectedDate: LocalDate?,
    onDateSelect: (LocalDate) -> Unit,
    modifier: Modifier = Modifier,
    events: List<CalendarEvent> = emptyList(),
    minDate: LocalDate? = null,
    maxDate: LocalDate? = null,
    firstDayOfWeek: DayOfWeek = DayOfWeek.MONDAY,
    showWeekNumbers: Boolean = false,
    highlightToday: Boolean = true,
    onEventClick: ((CalendarEvent) -> Unit)? = null
) {
    var currentMonth by remember { mutableStateOf(YearMonth.now()) }
    var showYearView by remember { mutableStateOf(false) }

    val weekFields = WeekFields.of(firstDayOfWeek, 1)

    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column {
            // Header
            CalendarHeader(
                currentMonth = currentMonth,
                showYearView = showYearView,
                onPrevious = {
                    currentMonth = if (showYearView) {
                        currentMonth.minusYears(1)
                    } else {
                        currentMonth.minusMonths(1)
                    }
                },
                onNext = {
                    currentMonth = if (showYearView) {
                        currentMonth.plusYears(1)
                    } else {
                        currentMonth.plusMonths(1)
                    }
                },
                onToggleView = { showYearView = !showYearView },
                onTodayClick = {
                    currentMonth = YearMonth.now()
                    onDateSelect(LocalDate.now())
                }
            )

            // Content
            AnimatedContent(
                targetState = showYearView,
                transitionSpec = {
                    fadeIn() togetherWith fadeOut()
                }
            ) { yearView ->
                if (yearView) {
                    YearView(
                        currentYear = currentMonth.year,
                        events = events,
                        onMonthSelect = { month ->
                            currentMonth = YearMonth.of(currentMonth.year, month)
                            showYearView = false
                        }
                    )
                } else {
                    MonthView(
                        currentMonth = currentMonth,
                        selectedDate = selectedDate,
                        events = events,
                        minDate = minDate,
                        maxDate = maxDate,
                        firstDayOfWeek = firstDayOfWeek,
                        showWeekNumbers = showWeekNumbers,
                        highlightToday = highlightToday,
                        onDateSelect = onDateSelect,
                        onEventClick = onEventClick
                    )
                }
            }
        }
    }
}

@Composable
private fun CalendarHeader(
    currentMonth: YearMonth,
    showYearView: Boolean,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    onToggleView: () -> Unit,
    onTodayClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onPrevious) {
            Icon(Icons.Default.ChevronLeft, contentDescription = "Previous")
        }

        Row(
            modifier = Modifier.clickable(onClick = onToggleView),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = if (showYearView) {
                    currentMonth.year.toString()
                } else {
                    currentMonth.format(DateTimeFormatter.ofPattern("MMMM yyyy"))
                },
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Icon(
                Icons.Default.KeyboardArrowDown,
                contentDescription = null,
                modifier = Modifier.size(16.dp)
            )
        }

        IconButton(onClick = onNext) {
            Icon(Icons.Default.ChevronRight, contentDescription = "Next")
        }
    }
}

@Composable
private fun MonthView(
    currentMonth: YearMonth,
    selectedDate: LocalDate?,
    events: List<CalendarEvent>,
    minDate: LocalDate?,
    maxDate: LocalDate?,
    firstDayOfWeek: DayOfWeek,
    showWeekNumbers: Boolean,
    highlightToday: Boolean,
    onDateSelect: (LocalDate) -> Unit,
    onEventClick: ((CalendarEvent) -> Unit)?
) {
    val daysOfWeek = remember(firstDayOfWeek) {
        val days = DayOfWeek.values().toMutableList()
        while (days.first() != firstDayOfWeek) {
            days.add(days.removeFirst())
        }
        days
    }

    val calendarDays = remember(currentMonth, firstDayOfWeek) {
        val firstOfMonth = currentMonth.atDay(1)
        val lastOfMonth = currentMonth.atEndOfMonth()

        val startDate = firstOfMonth.minusDays(
            ((firstOfMonth.dayOfWeek.value - firstDayOfWeek.value + 7) % 7).toLong()
        )
        val endDate = lastOfMonth.plusDays(
            ((7 - lastOfMonth.dayOfWeek.value + firstDayOfWeek.value - 1) % 7).toLong()
        )

        generateSequence(startDate) { it.plusDays(1) }
            .takeWhile { !it.isAfter(endDate) }
            .toList()
    }

    Column(modifier = Modifier.padding(16.dp)) {
        // Weekday headers
        Row(modifier = Modifier.fillMaxWidth()) {
            if (showWeekNumbers) {
                Box(modifier = Modifier.width(30.dp))
            }
            daysOfWeek.forEach { day ->
                Text(
                    text = day.getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                    modifier = Modifier.weight(1f),
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Days grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(if (showWeekNumbers) 8 else 7),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            items(calendarDays) { date ->
                val isCurrentMonth = date.month == currentMonth.month
                val isSelected = selectedDate == date
                val isToday = date == LocalDate.now()
                val dayEvents = events.filter { it.date == date }
                val isDisabled = (minDate != null && date.isBefore(minDate)) ||
                        (maxDate != null && date.isAfter(maxDate))

                DayCell(
                    date = date,
                    isCurrentMonth = isCurrentMonth,
                    isSelected = isSelected,
                    isToday = isToday && highlightToday,
                    isDisabled = isDisabled,
                    events = dayEvents,
                    onClick = { if (!isDisabled) onDateSelect(date) },
                    onEventClick = onEventClick
                )
            }
        }
    }
}

@Composable
private fun DayCell(
    date: LocalDate,
    isCurrentMonth: Boolean,
    isSelected: Boolean,
    isToday: Boolean,
    isDisabled: Boolean,
    events: List<CalendarEvent>,
    onClick: () -> Unit,
    onEventClick: ((CalendarEvent) -> Unit)?
) {
    val backgroundColor = when {
        isSelected -> MaterialTheme.colorScheme.primary
        isToday -> MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
        else -> Color.Transparent
    }

    val textColor = when {
        isSelected -> MaterialTheme.colorScheme.onPrimary
        !isCurrentMonth -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
        else -> MaterialTheme.colorScheme.onSurface
    }

    Column(
        modifier = Modifier
            .aspectRatio(1f)
            .clip(RoundedCornerShape(8.dp))
            .background(backgroundColor)
            .then(
                if (isToday && !isSelected) {
                    Modifier.border(2.dp, MaterialTheme.colorScheme.primary, RoundedCornerShape(8.dp))
                } else Modifier
            )
            .clickable(enabled = !isDisabled, onClick = onClick)
            .padding(4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = date.dayOfMonth.toString(),
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = if (isToday) FontWeight.Bold else FontWeight.Normal,
            color = textColor
        )

        if (events.isNotEmpty()) {
            Spacer(modifier = Modifier.height(2.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                events.take(3).forEach { event ->
                    Box(
                        modifier = Modifier
                            .size(4.dp)
                            .background(
                                if (isSelected) MaterialTheme.colorScheme.onPrimary else event.color,
                                CircleShape
                            )
                    )
                }
            }
        }
    }
}

@Composable
private fun YearView(
    currentYear: Int,
    events: List<CalendarEvent>,
    onMonthSelect: (Int) -> Unit
) {
    val months = java.time.Month.values()

    LazyVerticalGrid(
        columns = GridCells.Fixed(3),
        modifier = Modifier.padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(months.toList()) { month ->
            val monthEvents = events.filter {
                it.date.year == currentYear && it.date.month == month
            }

            Card(
                modifier = Modifier.clickable { onMonthSelect(month.value) },
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(
                    modifier = Modifier.padding(12.dp)
                ) {
                    Text(
                        text = month.getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Medium
                    )

                    if (monthEvents.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${monthEvents.size} events",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

// Mini Calendar
@Composable
fun MiniCalendar(
    selectedDate: LocalDate,
    onDateSelect: (LocalDate) -> Unit,
    modifier: Modifier = Modifier,
    minDate: LocalDate? = null,
    maxDate: LocalDate? = null
) {
    var currentMonth by remember { mutableStateOf(YearMonth.from(selectedDate)) }

    val calendarDays = remember(currentMonth) {
        val firstOfMonth = currentMonth.atDay(1)
        val lastOfMonth = currentMonth.atEndOfMonth()
        val startDate = firstOfMonth.minusDays(firstOfMonth.dayOfWeek.value.toLong() % 7)
        val endDate = lastOfMonth.plusDays((6 - lastOfMonth.dayOfWeek.value.toLong() % 7))

        generateSequence(startDate) { it.plusDays(1) }
            .takeWhile { !it.isAfter(endDate) }
            .toList()
    }

    Card(
        modifier = modifier.width(220.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = { currentMonth = currentMonth.minusMonths(1) },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(Icons.Default.ChevronLeft, contentDescription = null, modifier = Modifier.size(16.dp))
                }

                Text(
                    text = currentMonth.format(DateTimeFormatter.ofPattern("MMM yyyy")),
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )

                IconButton(
                    onClick = { currentMonth = currentMonth.plusMonths(1) },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(Icons.Default.ChevronRight, contentDescription = null, modifier = Modifier.size(16.dp))
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Weekdays
            Row(modifier = Modifier.fillMaxWidth()) {
                listOf("S", "M", "T", "W", "T", "F", "S").forEach { day ->
                    Text(
                        text = day,
                        modifier = Modifier.weight(1f),
                        textAlign = TextAlign.Center,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Days
            LazyVerticalGrid(
                columns = GridCells.Fixed(7),
                horizontalArrangement = Arrangement.spacedBy(2.dp),
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                items(calendarDays) { date ->
                    val isCurrentMonth = date.month == currentMonth.month
                    val isSelected = date == selectedDate
                    val isToday = date == LocalDate.now()
                    val isDisabled = (minDate != null && date.isBefore(minDate)) ||
                            (maxDate != null && date.isAfter(maxDate))

                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(CircleShape)
                            .background(if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent)
                            .then(
                                if (isToday && !isSelected) {
                                    Modifier.border(1.dp, MaterialTheme.colorScheme.primary, CircleShape)
                                } else Modifier
                            )
                            .clickable(enabled = !isDisabled) { onDateSelect(date) },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = date.dayOfMonth.toString(),
                            style = MaterialTheme.typography.bodySmall,
                            color = when {
                                isSelected -> MaterialTheme.colorScheme.onPrimary
                                !isCurrentMonth -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                                else -> MaterialTheme.colorScheme.onSurface
                            }
                        )
                    }
                }
            }
        }
    }
}
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
