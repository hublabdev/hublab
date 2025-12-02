/**
 * Modal Capsule - Multi-Platform
 *
 * Overlay dialog with customizable content and actions.
 */

import { CapsuleDefinition } from './types'

export const ModalCapsule: CapsuleDefinition = {
  id: 'modal',
  name: 'Modal',
  description: 'Overlay dialog for alerts, confirmations, and forms',
  category: 'feedback',
  tags: ['overlay', 'dialog', 'popup', 'alert'],
  version: '1.0.0',

  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      required: true,
      description: 'Control modal visibility'
    },
    {
      name: 'onClose',
      type: 'action',
      required: true,
      description: 'Callback to close the modal'
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Modal header title'
    },
    {
      name: 'size',
      type: 'select',
      required: false,
      default: 'md',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Modal size'
    },
    {
      name: 'dismissible',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Allow closing by clicking backdrop'
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show X close button'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
  dismissible?: boolean
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  dismissible = true,
  showCloseButton = true,
  footer
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, dismissible])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    full: 'max-w-full mx-4'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={dismissible ? onClose : undefined}
      />

      {/* Modal */}
      <div className={\`
        relative w-full \${sizes[size]} mx-4
        bg-white rounded-2xl shadow-2xl
        transform transition-all duration-200
        animate-in fade-in zoom-in-95
      \`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
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

enum ModalSize {
    case sm, md, lg, full

    var maxWidth: CGFloat {
        switch self {
        case .sm: return 300
        case .md: return 400
        case .lg: return 600
        case .full: return .infinity
        }
    }
}

struct HubLabModal<Content: View, Footer: View>: View {
    @Binding var isOpen: Bool
    var title: String? = nil
    var size: ModalSize = .md
    var dismissible: Bool = true
    var showCloseButton: Bool = true
    @ViewBuilder let content: () -> Content
    @ViewBuilder let footer: () -> Footer

    init(
        isOpen: Binding<Bool>,
        title: String? = nil,
        size: ModalSize = .md,
        dismissible: Bool = true,
        showCloseButton: Bool = true,
        @ViewBuilder content: @escaping () -> Content,
        @ViewBuilder footer: @escaping () -> Footer = { EmptyView() }
    ) {
        self._isOpen = isOpen
        self.title = title
        self.size = size
        self.dismissible = dismissible
        self.showCloseButton = showCloseButton
        self.content = content
        self.footer = footer
    }

    var body: some View {
        ZStack {
            if isOpen {
                // Backdrop
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        if dismissible {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                isOpen = false
                            }
                        }
                    }

                // Modal
                VStack(spacing: 0) {
                    // Header
                    if title != nil || showCloseButton {
                        HStack {
                            if let title = title {
                                Text(title)
                                    .font(.headline)
                            }
                            Spacer()
                            if showCloseButton {
                                Button(action: { isOpen = false }) {
                                    Image(systemName: "xmark")
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(.secondary)
                                        .padding(8)
                                        .background(Color(.systemGray5))
                                        .clipShape(Circle())
                                }
                            }
                        }
                        .padding()
                        Divider()
                    }

                    // Content
                    ScrollView {
                        content()
                            .padding()
                    }
                    .frame(maxHeight: UIScreen.main.bounds.height * 0.6)

                    // Footer
                    if Footer.self != EmptyView.self {
                        Divider()
                        footer()
                            .padding()
                            .background(Color(.secondarySystemBackground))
                    }
                }
                .frame(maxWidth: size.maxWidth)
                .background(Color(.systemBackground))
                .cornerRadius(20)
                .shadow(color: .black.opacity(0.2), radius: 20)
                .padding()
                .transition(.opacity.combined(with: .scale(scale: 0.95)))
            }
        }
        .animation(.easeInOut(duration: 0.2), value: isOpen)
    }
}

// MARK: - Convenience Alert Modal
struct AlertModal: View {
    @Binding var isOpen: Bool
    let title: String
    let message: String
    var primaryAction: (title: String, action: () -> Void)?
    var secondaryAction: (title: String, action: () -> Void)?

    var body: some View {
        HubLabModal(isOpen: $isOpen, title: title, size: .sm) {
            Text(message)
                .foregroundColor(.secondary)
        } footer: {
            HStack {
                if let secondary = secondaryAction {
                    Button(secondary.title) {
                        secondary.action()
                        isOpen = false
                    }
                    .buttonStyle(.bordered)
                }
                Spacer()
                if let primary = primaryAction {
                    Button(primary.title) {
                        primary.action()
                        isOpen = false
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
        }
    }
}

// MARK: - Previews
#Preview("Modal Demo") {
    struct PreviewWrapper: View {
        @State var showModal = true

        var body: some View {
            ZStack {
                Button("Show Modal") {
                    showModal = true
                }

                HubLabModal(isOpen: $showModal, title: "Modal Title") {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("This is the modal content")
                        Text("You can put any views here")
                    }
                } footer: {
                    HStack {
                        Button("Cancel") { showModal = false }
                            .buttonStyle(.bordered)
                        Spacer()
                        Button("Confirm") { showModal = false }
                            .buttonStyle(.borderedProminent)
                    }
                }
            }
        }
    }
    return PreviewWrapper()
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
        'androidx.compose.ui.window.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

enum class ModalSize(val maxWidth: Dp) {
    Sm(300.dp), Md(400.dp), Lg(600.dp), Full(Dp.Infinity)
}

@Composable
fun HubLabModal(
    isOpen: Boolean,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
    title: String? = null,
    size: ModalSize = ModalSize.Md,
    dismissible: Boolean = true,
    showCloseButton: Boolean = true,
    footer: @Composable (() -> Unit)? = null,
    content: @Composable () -> Unit
) {
    if (!isOpen) return

    Dialog(
        onDismissRequest = { if (dismissible) onClose() },
        properties = DialogProperties(
            dismissOnBackPress = dismissible,
            dismissOnClickOutside = dismissible,
            usePlatformDefaultWidth = false
        )
    ) {
        Surface(
            modifier = modifier
                .widthIn(max = size.maxWidth)
                .padding(16.dp),
            shape = RoundedCornerShape(24.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column {
                // Header
                if (title != null || showCloseButton) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (title != null) {
                            Text(
                                text = title,
                                style = MaterialTheme.typography.titleLarge,
                                modifier = Modifier.weight(1f)
                            )
                        } else {
                            Spacer(Modifier.weight(1f))
                        }

                        if (showCloseButton) {
                            IconButton(
                                onClick = onClose,
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Icon(
                                    Icons.Default.Close,
                                    contentDescription = "Close",
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                    HorizontalDivider()
                }

                // Content
                Box(
                    modifier = Modifier
                        .weight(1f, fill = false)
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp)
                ) {
                    content()
                }

                // Footer
                if (footer != null) {
                    HorizontalDivider()
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                            .padding(16.dp)
                    ) {
                        footer()
                    }
                }
            }
        }
    }
}

@Preview
@Composable
fun HubLabModalPreview() {
    var showModal by remember { mutableStateOf(true) }

    MaterialTheme {
        Box(modifier = Modifier.fillMaxSize()) {
            Button(onClick = { showModal = true }) {
                Text("Show Modal")
            }

            HubLabModal(
                isOpen = showModal,
                onClose = { showModal = false },
                title = "Modal Title"
            ) {
                Text("This is the modal content. You can add any composables here.")
            }
        }
    }
}
`
    }
  },

  children: true,
  slots: ['footer'],
  preview: '/previews/modal.png'
}
