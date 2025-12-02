// @ts-nocheck
/**
 * Toast Capsule - Multi-Platform
 *
 * Non-blocking notification messages.
 */

import { CapsuleDefinition } from './types'

export const ToastCapsule: CapsuleDefinition = {
  id: 'toast',
  name: 'Toast',
  description: 'Non-blocking notification messages',
  category: 'feedback',
  tags: ['toast', 'notification', 'snackbar', 'alert', 'message'],
  version: '1.0.0',

  props: [
    {
      name: 'message',
      type: 'string',
      required: true,
      description: 'Toast message'
    },
    {
      name: 'type',
      type: 'select',
      required: false,
      default: 'default',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Toast type/style'
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      default: 3000,
      description: 'Auto-dismiss duration in ms (0 = no auto-dismiss)'
    },
    {
      name: 'position',
      type: 'select',
      required: false,
      default: 'bottom',
      options: ['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Toast position'
    },
    {
      name: 'action',
      type: 'object',
      required: false,
      description: 'Action button { label: string, onPress: () => void }'
    },
    {
      name: 'onDismiss',
      type: 'action',
      required: false,
      description: 'Callback when toast is dismissed'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

// Types
type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'
type ToastPosition = 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface ToastAction {
  label: string
  onPress: () => void
}

interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
  action?: ToastAction
}

interface ToastContextValue {
  toasts: Toast[]
  show: (message: string, options?: Partial<Omit<Toast, 'id' | 'message'>>) => string
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Provider
interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
}

export function ToastProvider({
  children,
  position = 'bottom',
  maxToasts = 5
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  const show = useCallback((
    message: string,
    options: Partial<Omit<Toast, 'id' | 'message'>> = {}
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = {
      id,
      message,
      type: options.type || 'default',
      duration: options.duration ?? 3000,
      action: options.action
    }

    setToasts(prev => {
      const updated = [...prev, toast]
      return updated.slice(-maxToasts)
    })

    return id
  }, [maxToasts])

  const success = useCallback((message: string, options = {}) =>
    show(message, { ...options, type: 'success' }), [show])

  const error = useCallback((message: string, options = {}) =>
    show(message, { ...options, type: 'error' }), [show])

  const warning = useCallback((message: string, options = {}) =>
    show(message, { ...options, type: 'warning' }), [show])

  const info = useCallback((message: string, options = {}) =>
    show(message, { ...options, type: 'info' }), [show])

  const positionClasses: Record<ToastPosition, string> = {
    'top': 'top-4 left-1/2 -translate-x-1/2',
    'bottom': 'bottom-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const containerClasses = `fixed z-50 ${positionClasses[position]} flex flex-col gap-2`

  return (
    <ToastContext.Provider value={{ toasts, show, success, error, warning, info, dismiss, dismissAll }}>
      {children}

      {/* Toast Container */}
      <div className={containerClasses}>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Toast Item
interface ToastItemProps {
  toast: Toast
  onDismiss: () => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true))

    // Auto dismiss
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 200)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onDismiss])

  const typeStyles = {
    default: 'bg-gray-800 text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-600 text-white'
  }

  const icons = {
    default: null,
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
      min-w-[300px] max-w-md
      transform transition-all duration-200
      ${typeStyles[toast.type]}
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
    `}>
      {icons[toast.type]}

      <span className="flex-1 text-sm font-medium">{toast.message}</span>

      {toast.action && (
        <button
          onClick={() => {
            toast.action?.onPress()
            onDismiss()
          }}
          className="text-sm font-semibold hover:underline px-2"
        >
          {toast.action.label}
        </button>
      )}

      <button
        onClick={onDismiss}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
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

enum ToastType {
    case \`default\`, success, error, warning, info

    var backgroundColor: Color {
        switch self {
        case .default: return Color(.systemGray)
        case .success: return .green
        case .error: return .red
        case .warning: return .orange
        case .info: return .blue
        }
    }

    var icon: String? {
        switch self {
        case .default: return nil
        case .success: return "checkmark.circle.fill"
        case .error: return "xmark.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .info: return "info.circle.fill"
        }
    }
}

struct ToastAction {
    let label: String
    let action: () -> Void
}

struct ToastData: Identifiable {
    let id = UUID()
    let message: String
    let type: ToastType
    let duration: TimeInterval
    let action: ToastAction?
}

class ToastManager: ObservableObject {
    @Published var toasts: [ToastData] = []

    static let shared = ToastManager()

    func show(
        _ message: String,
        type: ToastType = .default,
        duration: TimeInterval = 3,
        action: ToastAction? = nil
    ) {
        let toast = ToastData(message: message, type: type, duration: duration, action: action)
        withAnimation(.spring(response: 0.3)) {
            toasts.append(toast)
        }

        if duration > 0 {
            DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                self.dismiss(toast.id)
            }
        }
    }

    func success(_ message: String, duration: TimeInterval = 3) {
        show(message, type: .success, duration: duration)
    }

    func error(_ message: String, duration: TimeInterval = 3) {
        show(message, type: .error, duration: duration)
    }

    func warning(_ message: String, duration: TimeInterval = 3) {
        show(message, type: .warning, duration: duration)
    }

    func info(_ message: String, duration: TimeInterval = 3) {
        show(message, type: .info, duration: duration)
    }

    func dismiss(_ id: UUID) {
        withAnimation(.spring(response: 0.3)) {
            toasts.removeAll { $0.id == id }
        }
    }

    func dismissAll() {
        withAnimation {
            toasts.removeAll()
        }
    }
}

struct ToastContainer: View {
    @ObservedObject var manager = ToastManager.shared
    var position: Edge = .bottom

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                VStack(spacing: 8) {
                    ForEach(manager.toasts) { toast in
                        ToastView(toast: toast) {
                            manager.dismiss(toast.id)
                        }
                        .transition(.move(edge: position).combined(with: .opacity))
                    }
                }
                .padding()
                .frame(
                    maxWidth: .infinity,
                    maxHeight: .infinity,
                    alignment: position == .top ? .top : .bottom
                )
            }
        }
    }
}

struct ToastView: View {
    let toast: ToastData
    let onDismiss: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            if let icon = toast.type.icon {
                Image(systemName: icon)
                    .font(.system(size: 18))
            }

            Text(toast.message)
                .font(.subheadline)
                .fontWeight(.medium)

            Spacer()

            if let action = toast.action {
                Button(action.label) {
                    action.action()
                    onDismiss()
                }
                .font(.subheadline.bold())
            }

            Button(action: onDismiss) {
                Image(systemName: "xmark")
                    .font(.system(size: 12, weight: .bold))
                    .padding(6)
                    .background(Color.white.opacity(0.2))
                    .clipShape(Circle())
            }
        }
        .foregroundColor(.white)
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(toast.type.backgroundColor)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.15), radius: 8, y: 4)
    }
}

// MARK: - View Modifier
struct ToastModifier: ViewModifier {
    @ObservedObject var manager = ToastManager.shared

    func body(content: Content) -> some View {
        ZStack {
            content
            ToastContainer(manager: manager)
        }
    }
}

extension View {
    func withToasts() -> some View {
        modifier(ToastModifier())
    }
}

// MARK: - Preview
#Preview("Toasts") {
    struct ToastDemo: View {
        var body: some View {
            VStack(spacing: 16) {
                Button("Show Success") {
                    ToastManager.shared.success("Operation completed!")
                }
                Button("Show Error") {
                    ToastManager.shared.error("Something went wrong")
                }
                Button("Show Warning") {
                    ToastManager.shared.warning("Please check your input")
                }
                Button("Show Info") {
                    ToastManager.shared.info("New update available")
                }
                Button("Show with Action") {
                    ToastManager.shared.show(
                        "Item deleted",
                        type: .default,
                        action: ToastAction(label: "Undo") {
                            print("Undo tapped")
                        }
                    )
                }
            }
            .withToasts()
        }
    }
    return ToastDemo()
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: ['androidx.compose.material3:material3'],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'androidx.compose.animation.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import java.util.UUID

enum class ToastType(val bg: Color, val icon: ImageVector?) {
    Default(Color(0xFF6B7280), null),
    Success(Color(0xFF22C55E), Icons.Default.CheckCircle),
    Error(Color(0xFFEF4444), Icons.Default.Cancel),
    Warning(Color(0xFFF59E0B), Icons.Default.Warning),
    Info(Color(0xFF3B82F6), Icons.Default.Info)
}

data class ToastAction(
    val label: String,
    val onClick: () -> Unit
)

data class ToastData(
    val id: String = UUID.randomUUID().toString(),
    val message: String,
    val type: ToastType = ToastType.Default,
    val duration: Long = 3000,
    val action: ToastAction? = null
)

class ToastState {
    private val _toasts = mutableStateListOf<ToastData>()
    val toasts: List<ToastData> get() = _toasts

    fun show(
        message: String,
        type: ToastType = ToastType.Default,
        duration: Long = 3000,
        action: ToastAction? = null
    ): String {
        val toast = ToastData(
            message = message,
            type = type,
            duration = duration,
            action = action
        )
        _toasts.add(toast)
        return toast.id
    }

    fun success(message: String, duration: Long = 3000) =
        show(message, ToastType.Success, duration)

    fun error(message: String, duration: Long = 3000) =
        show(message, ToastType.Error, duration)

    fun warning(message: String, duration: Long = 3000) =
        show(message, ToastType.Warning, duration)

    fun info(message: String, duration: Long = 3000) =
        show(message, ToastType.Info, duration)

    fun dismiss(id: String) {
        _toasts.removeAll { it.id == id }
    }

    fun dismissAll() {
        _toasts.clear()
    }
}

@Composable
fun rememberToastState(): ToastState {
    return remember { ToastState() }
}

@Composable
fun ToastHost(
    state: ToastState,
    modifier: Modifier = Modifier,
    alignment: Alignment = Alignment.BottomCenter
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = alignment
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            state.toasts.forEach { toast ->
                key(toast.id) {
                    ToastItem(
                        toast = toast,
                        onDismiss = { state.dismiss(toast.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun ToastItem(
    toast: ToastData,
    onDismiss: () -> Unit
) {
    var isVisible by remember { mutableStateOf(false) }

    LaunchedEffect(toast.id) {
        isVisible = true
        if (toast.duration > 0) {
            delay(toast.duration)
            isVisible = false
            delay(200)
            onDismiss()
        }
    }

    AnimatedVisibility(
        visible = isVisible,
        enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { it }) + fadeOut()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(8.dp, RoundedCornerShape(12.dp))
                .clip(RoundedCornerShape(12.dp))
                .background(toast.type.bg)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            toast.type.icon?.let { icon ->
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }

            Text(
                text = toast.message,
                color = Color.White,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.weight(1f)
            )

            toast.action?.let { action ->
                TextButton(
                    onClick = {
                        action.onClick()
                        onDismiss()
                    }
                ) {
                    Text(
                        text = action.label,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Box(
                modifier = Modifier
                    .size(24.dp)
                    .clip(CircleShape)
                    .background(Color.White.copy(alpha = 0.2f))
                    .clickable { onDismiss() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Dismiss",
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ToastPreview() {
    val toastState = rememberToastState()

    MaterialTheme {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Button(onClick = { toastState.success("Success!") }) {
                    Text("Show Success")
                }
                Spacer(modifier = Modifier.height(8.dp))
                Button(onClick = { toastState.error("Error occurred") }) {
                    Text("Show Error")
                }
                Spacer(modifier = Modifier.height(8.dp))
                Button(onClick = {
                    toastState.show(
                        "Item deleted",
                        action = ToastAction("Undo") { println("Undo!") }
                    )
                }) {
                    Text("Show with Action")
                }
            }

            ToastHost(state = toastState)
        }
    }
}
`
    }
  },

  children: false,
  preview: '/previews/toast.png'
}
