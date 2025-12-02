import type { CapsuleDefinition } from './types'

export const RichTextEditorCapsule: CapsuleDefinition = {
  id: 'rich-text-editor',
  name: 'RichTextEditor',
  description: 'Rich text editor with formatting toolbar and HTML output',
  category: 'input',
  tags: ['editor', 'text', 'wysiwyg', 'html', 'markdown', 'formatting'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'RichTextEditor.tsx',
          code: `import React, { useState, useRef, useCallback, useEffect } from 'react'

interface RichTextEditorProps {
  value?: string
  defaultValue?: string
  onChange?: (html: string) => void
  onTextChange?: (text: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  toolbar?: ToolbarOption[]
  minHeight?: number
  maxHeight?: number
  className?: string
}

type ToolbarOption =
  | 'bold' | 'italic' | 'underline' | 'strikethrough'
  | 'h1' | 'h2' | 'h3'
  | 'bulletList' | 'orderedList'
  | 'link' | 'image'
  | 'alignLeft' | 'alignCenter' | 'alignRight'
  | 'quote' | 'code' | 'hr'
  | 'undo' | 'redo'
  | 'clear'

const defaultToolbar: ToolbarOption[] = [
  'bold', 'italic', 'underline', 'strikethrough',
  'h1', 'h2', 'h3',
  'bulletList', 'orderedList',
  'link', 'quote', 'code',
  'alignLeft', 'alignCenter', 'alignRight',
  'undo', 'redo', 'clear'
]

export function RichTextEditor({
  value,
  defaultValue = '',
  onChange,
  onTextChange,
  placeholder = 'Start typing...',
  disabled = false,
  readOnly = false,
  toolbar = defaultToolbar,
  minHeight = 150,
  maxHeight = 400,
  className = ''
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value])

  useEffect(() => {
    if (editorRef.current && defaultValue && !value) {
      editorRef.current.innerHTML = defaultValue
    }
  }, [])

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>()
    if (document.queryCommandState('bold')) formats.add('bold')
    if (document.queryCommandState('italic')) formats.add('italic')
    if (document.queryCommandState('underline')) formats.add('underline')
    if (document.queryCommandState('strikeThrough')) formats.add('strikethrough')
    if (document.queryCommandState('insertUnorderedList')) formats.add('bulletList')
    if (document.queryCommandState('insertOrderedList')) formats.add('orderedList')
    setActiveFormats(formats)
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML)
      onTextChange?.(editorRef.current.textContent || '')
    }
    updateActiveFormats()
  }, [onChange, onTextChange, updateActiveFormats])

  const execCommand = useCallback((command: string, value?: string) => {
    if (disabled || readOnly) return
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }, [disabled, readOnly, handleInput])

  const handleToolbarClick = useCallback((option: ToolbarOption) => {
    switch (option) {
      case 'bold':
        execCommand('bold')
        break
      case 'italic':
        execCommand('italic')
        break
      case 'underline':
        execCommand('underline')
        break
      case 'strikethrough':
        execCommand('strikeThrough')
        break
      case 'h1':
        execCommand('formatBlock', 'h1')
        break
      case 'h2':
        execCommand('formatBlock', 'h2')
        break
      case 'h3':
        execCommand('formatBlock', 'h3')
        break
      case 'bulletList':
        execCommand('insertUnorderedList')
        break
      case 'orderedList':
        execCommand('insertOrderedList')
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) execCommand('createLink', url)
        break
      case 'image':
        const imgUrl = prompt('Enter image URL:')
        if (imgUrl) execCommand('insertImage', imgUrl)
        break
      case 'alignLeft':
        execCommand('justifyLeft')
        break
      case 'alignCenter':
        execCommand('justifyCenter')
        break
      case 'alignRight':
        execCommand('justifyRight')
        break
      case 'quote':
        execCommand('formatBlock', 'blockquote')
        break
      case 'code':
        execCommand('formatBlock', 'pre')
        break
      case 'hr':
        execCommand('insertHorizontalRule')
        break
      case 'undo':
        execCommand('undo')
        break
      case 'redo':
        execCommand('redo')
        break
      case 'clear':
        execCommand('removeFormat')
        break
    }
  }, [execCommand])

  const getIcon = (option: ToolbarOption) => {
    const icons: Record<ToolbarOption, string> = {
      bold: 'B',
      italic: 'I',
      underline: 'U',
      strikethrough: 'S',
      h1: 'H1',
      h2: 'H2',
      h3: 'H3',
      bulletList: '•',
      orderedList: '1.',
      link: '🔗',
      image: '🖼',
      alignLeft: '⬅',
      alignCenter: '⬌',
      alignRight: '➡',
      quote: '"',
      code: '<>',
      hr: '—',
      undo: '↶',
      redo: '↷',
      clear: '✕'
    }
    return icons[option]
  }

  const getTitle = (option: ToolbarOption) => {
    const titles: Record<ToolbarOption, string> = {
      bold: 'Bold (Ctrl+B)',
      italic: 'Italic (Ctrl+I)',
      underline: 'Underline (Ctrl+U)',
      strikethrough: 'Strikethrough',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      bulletList: 'Bullet List',
      orderedList: 'Numbered List',
      link: 'Insert Link',
      image: 'Insert Image',
      alignLeft: 'Align Left',
      alignCenter: 'Align Center',
      alignRight: 'Align Right',
      quote: 'Block Quote',
      code: 'Code Block',
      hr: 'Horizontal Rule',
      undo: 'Undo',
      redo: 'Redo',
      clear: 'Clear Formatting'
    }
    return titles[option]
  }

  return (
    <div className={\`border rounded-lg overflow-hidden \${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'} \${disabled ? 'opacity-50 cursor-not-allowed' : ''} \${className}\`}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
          {toolbar.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleToolbarClick(option)}
              disabled={disabled}
              title={getTitle(option)}
              className={\`px-2 py-1 text-sm font-medium rounded transition-colors \${
                activeFormats.has(option)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed\`}
            >
              {option === 'bold' ? <strong>{getIcon(option)}</strong> :
               option === 'italic' ? <em>{getIcon(option)}</em> :
               option === 'underline' ? <u>{getIcon(option)}</u> :
               option === 'strikethrough' ? <s>{getIcon(option)}</s> :
               getIcon(option)}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled && !readOnly}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSelect={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        data-placeholder={placeholder}
        className="p-4 outline-none overflow-y-auto prose prose-sm max-w-none"
        style={{
          minHeight,
          maxHeight,
        }}
        suppressContentEditableWarning
      />

      <style>{\`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          color: #6b7280;
        }
        .prose pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
      \`}</style>
    </div>
  )
}

// Simplified markdown editor
interface MarkdownEditorProps {
  value?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: number
  className?: string
}

export function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Write markdown...',
  disabled = false,
  minHeight = 200,
  className = ''
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write')
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    onChange?.(e.target.value)
  }

  const simpleMarkdownToHtml = (md: string): string => {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\\*\\*(.*)\\*\\*/gim, '<strong>$1</strong>')
      .replace(/\\*(.*)\\*/gim, '<em>$1</em>')
      .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/gim, '<a href="$2">$1</a>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\\n/gim, '<br>')
  }

  return (
    <div className={\`border border-gray-300 rounded-lg overflow-hidden \${className}\`}>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => setMode('write')}
          className={\`px-4 py-2 text-sm font-medium transition-colors \${
            mode === 'write'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }\`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={\`px-4 py-2 text-sm font-medium transition-colors \${
            mode === 'preview'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }\`}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      {mode === 'write' ? (
        <textarea
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-4 outline-none resize-none font-mono text-sm"
          style={{ minHeight }}
        />
      ) : (
        <div
          className="p-4 prose prose-sm max-w-none"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(text) }}
        />
      )}
    </div>
  )
}

// Simple textarea with character count
interface TextAreaWithCountProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  maxLength?: number
  rows?: number
  disabled?: boolean
  className?: string
}

export function TextAreaWithCount({
  value = '',
  onChange,
  placeholder,
  maxLength = 500,
  rows = 4,
  disabled = false,
  className = ''
}: TextAreaWithCountProps) {
  const [text, setText] = useState(value)
  const remaining = maxLength - text.length

  useEffect(() => {
    setText(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, maxLength)
    setText(newValue)
    onChange?.(newValue)
  }

  return (
    <div className={\`relative \${className}\`}>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={\`w-full px-4 py-3 border rounded-lg outline-none transition-colors resize-none \${
          remaining < 20 ? 'border-orange-400 focus:ring-orange-500' : 'border-gray-300 focus:ring-blue-500'
        } focus:ring-2 disabled:opacity-50\`}
      />
      <span className={\`absolute bottom-2 right-3 text-xs \${
        remaining < 20 ? 'text-orange-500' : 'text-gray-400'
      }\`}>
        {remaining} characters remaining
      </span>
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
          filename: 'RichTextEditor.swift',
          code: `import SwiftUI
import UIKit

// MARK: - Rich Text Editor
struct RichTextEditor: UIViewRepresentable {
    @Binding var text: NSAttributedString
    var placeholder: String = "Start typing..."
    var minHeight: CGFloat = 150
    var isEditable: Bool = true
    var onTextChange: ((String) -> Void)?

    func makeUIView(context: Context) -> UITextView {
        let textView = UITextView()
        textView.delegate = context.coordinator
        textView.isEditable = isEditable
        textView.isScrollEnabled = true
        textView.font = UIFont.systemFont(ofSize: 16)
        textView.textContainerInset = UIEdgeInsets(top: 12, left: 8, bottom: 12, right: 8)
        textView.backgroundColor = .clear
        textView.allowsEditingTextAttributes = true

        // Configure for rich text
        textView.typingAttributes = [
            .font: UIFont.systemFont(ofSize: 16),
            .foregroundColor: UIColor.label
        ]

        return textView
    }

    func updateUIView(_ uiView: UITextView, context: Context) {
        if uiView.attributedText != text {
            uiView.attributedText = text
        }
        uiView.isEditable = isEditable
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UITextViewDelegate {
        var parent: RichTextEditor

        init(_ parent: RichTextEditor) {
            self.parent = parent
        }

        func textViewDidChange(_ textView: UITextView) {
            parent.text = textView.attributedText
            parent.onTextChange?(textView.text)
        }
    }
}

// MARK: - Rich Text Editor with Toolbar
struct RichTextEditorWithToolbar: View {
    @Binding var attributedText: NSAttributedString
    var placeholder: String = "Start typing..."
    var minHeight: CGFloat = 150

    @State private var isBold = false
    @State private var isItalic = false
    @State private var isUnderline = false

    var body: some View {
        VStack(spacing: 0) {
            // Toolbar
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 4) {
                    FormatButton(icon: "bold", isActive: isBold) {
                        isBold.toggle()
                        applyFormat(.bold)
                    }

                    FormatButton(icon: "italic", isActive: isItalic) {
                        isItalic.toggle()
                        applyFormat(.italic)
                    }

                    FormatButton(icon: "underline", isActive: isUnderline) {
                        isUnderline.toggle()
                        applyFormat(.underline)
                    }

                    Divider()
                        .frame(height: 24)

                    FormatButton(icon: "list.bullet", isActive: false) {
                        insertBulletList()
                    }

                    FormatButton(icon: "list.number", isActive: false) {
                        insertNumberedList()
                    }

                    Divider()
                        .frame(height: 24)

                    FormatButton(icon: "text.alignleft", isActive: false) {
                        applyAlignment(.left)
                    }

                    FormatButton(icon: "text.aligncenter", isActive: false) {
                        applyAlignment(.center)
                    }

                    FormatButton(icon: "text.alignright", isActive: false) {
                        applyAlignment(.right)
                    }
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 6)
            }
            .background(Color(.systemGray6))

            // Editor
            RichTextEditor(text: $attributedText, placeholder: placeholder, minHeight: minHeight)
                .frame(minHeight: minHeight)
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(.systemGray4), lineWidth: 1)
        )
    }

    private func applyFormat(_ format: TextFormat) {
        // Format application would require UITextView reference
        // This is a simplified version
    }

    private func insertBulletList() {
        // Insert bullet list
    }

    private func insertNumberedList() {
        // Insert numbered list
    }

    private func applyAlignment(_ alignment: NSTextAlignment) {
        // Apply alignment
    }

    enum TextFormat {
        case bold, italic, underline
    }
}

struct FormatButton: View {
    var icon: String
    var isActive: Bool
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: isActive ? .bold : .regular))
                .foregroundColor(isActive ? .blue : .primary)
                .frame(width: 36, height: 36)
                .background(isActive ? Color.blue.opacity(0.1) : Color.clear)
                .cornerRadius(6)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Simple Text Editor with Placeholder
struct SimpleTextEditor: View {
    @Binding var text: String
    var placeholder: String = "Enter text..."
    var minHeight: CGFloat = 100
    var maxLength: Int?

    var body: some View {
        ZStack(alignment: .topLeading) {
            if text.isEmpty {
                Text(placeholder)
                    .foregroundColor(.gray)
                    .padding(.horizontal, 4)
                    .padding(.vertical, 8)
            }

            TextEditor(text: Binding(
                get: { text },
                set: { newValue in
                    if let maxLen = maxLength {
                        text = String(newValue.prefix(maxLen))
                    } else {
                        text = newValue
                    }
                }
            ))
            .frame(minHeight: minHeight)
            .scrollContentBackground(.hidden)
        }
        .padding(8)
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .overlay(
            Group {
                if let maxLen = maxLength {
                    Text("\\(text.count)/\\(maxLen)")
                        .font(.caption)
                        .foregroundColor(text.count >= maxLen ? .red : .gray)
                        .padding(8)
                }
            },
            alignment: .bottomTrailing
        )
    }
}

// MARK: - Markdown Editor
struct MarkdownEditor: View {
    @Binding var text: String
    var placeholder: String = "Write markdown..."

    @State private var showPreview = false

    var body: some View {
        VStack(spacing: 0) {
            // Tab bar
            HStack(spacing: 0) {
                TabButton(title: "Write", isSelected: !showPreview) {
                    showPreview = false
                }

                TabButton(title: "Preview", isSelected: showPreview) {
                    showPreview = true
                }

                Spacer()
            }
            .background(Color(.systemGray6))

            // Content
            if showPreview {
                ScrollView {
                    Text(attributedMarkdown)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                }
            } else {
                TextEditor(text: $text)
                    .font(.system(.body, design: .monospaced))
                    .scrollContentBackground(.hidden)
                    .padding(8)
            }
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(.systemGray4), lineWidth: 1)
        )
    }

    private var attributedMarkdown: AttributedString {
        do {
            return try AttributedString(markdown: text)
        } catch {
            return AttributedString(text)
        }
    }
}

struct TabButton: View {
    var title: String
    var isSelected: Bool
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? .blue : .gray)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(
                    VStack {
                        Spacer()
                        if isSelected {
                            Rectangle()
                                .fill(Color.blue)
                                .frame(height: 2)
                        }
                    }
                )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Preview
struct RichTextEditor_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            RichTextEditorWithToolbar(
                attributedText: .constant(NSAttributedString(string: "Hello World"))
            )
            .frame(height: 200)

            SimpleTextEditor(
                text: .constant(""),
                placeholder: "Enter your bio...",
                maxLength: 150
            )

            MarkdownEditor(text: .constant("# Hello\\n\\nThis is **bold** text."))
                .frame(height: 200)
        }
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
          filename: 'RichTextEditor.kt',
          code: `package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.*
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class FormatOption(
    val icon: ImageVector,
    val label: String,
    val format: TextFormat
)

enum class TextFormat {
    BOLD, ITALIC, UNDERLINE, STRIKETHROUGH,
    H1, H2, H3,
    BULLET_LIST, NUMBERED_LIST,
    ALIGN_LEFT, ALIGN_CENTER, ALIGN_RIGHT
}

@Composable
fun RichTextEditor(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Start typing...",
    enabled: Boolean = true,
    readOnly: Boolean = false,
    minHeight: Int = 150,
    showToolbar: Boolean = true
) {
    var text by remember { mutableStateOf(value) }
    var activeFormats by remember { mutableStateOf(setOf<TextFormat>()) }

    val formatOptions = listOf(
        FormatOption(Icons.Default.FormatBold, "Bold", TextFormat.BOLD),
        FormatOption(Icons.Default.FormatItalic, "Italic", TextFormat.ITALIC),
        FormatOption(Icons.Default.FormatUnderlined, "Underline", TextFormat.UNDERLINE),
        FormatOption(Icons.Default.FormatStrikethrough, "Strikethrough", TextFormat.STRIKETHROUGH),
        FormatOption(Icons.Default.FormatListBulleted, "Bullet List", TextFormat.BULLET_LIST),
        FormatOption(Icons.Default.FormatListNumbered, "Numbered List", TextFormat.NUMBERED_LIST),
        FormatOption(Icons.Default.FormatAlignLeft, "Align Left", TextFormat.ALIGN_LEFT),
        FormatOption(Icons.Default.FormatAlignCenter, "Align Center", TextFormat.ALIGN_CENTER),
        FormatOption(Icons.Default.FormatAlignRight, "Align Right", TextFormat.ALIGN_RIGHT),
    )

    LaunchedEffect(value) {
        text = value
    }

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
    ) {
        // Toolbar
        if (showToolbar && !readOnly) {
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(horizontal = 8.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(formatOptions) { option ->
                    val isActive = activeFormats.contains(option.format)
                    IconButton(
                        onClick = {
                            activeFormats = if (isActive) {
                                activeFormats - option.format
                            } else {
                                activeFormats + option.format
                            }
                        },
                        modifier = Modifier
                            .size(36.dp)
                            .background(
                                if (isActive) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                                else Color.Transparent,
                                RoundedCornerShape(6.dp)
                            )
                    ) {
                        Icon(
                            imageVector = option.icon,
                            contentDescription = option.label,
                            tint = if (isActive) MaterialTheme.colorScheme.primary
                                   else MaterialTheme.colorScheme.onSurface,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            HorizontalDivider()
        }

        // Editor
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = minHeight.dp)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            if (text.isEmpty() && !readOnly) {
                Text(
                    text = placeholder,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                    style = MaterialTheme.typography.bodyLarge
                )
            }

            val textStyle = buildAnnotatedString {
                withStyle(
                    SpanStyle(
                        fontWeight = if (activeFormats.contains(TextFormat.BOLD)) FontWeight.Bold else FontWeight.Normal,
                        fontStyle = if (activeFormats.contains(TextFormat.ITALIC)) FontStyle.Italic else FontStyle.Normal,
                        textDecoration = when {
                            activeFormats.contains(TextFormat.UNDERLINE) && activeFormats.contains(TextFormat.STRIKETHROUGH) ->
                                TextDecoration.combine(listOf(TextDecoration.Underline, TextDecoration.LineThrough))
                            activeFormats.contains(TextFormat.UNDERLINE) -> TextDecoration.Underline
                            activeFormats.contains(TextFormat.STRIKETHROUGH) -> TextDecoration.LineThrough
                            else -> TextDecoration.None
                        }
                    )
                ) {
                    append(text)
                }
            }

            BasicTextField(
                value = text,
                onValueChange = {
                    text = it
                    onValueChange(it)
                },
                enabled = enabled && !readOnly,
                textStyle = TextStyle(
                    color = MaterialTheme.colorScheme.onSurface,
                    fontSize = 16.sp
                ),
                cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

// Markdown Editor with Preview
@Composable
fun MarkdownEditor(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Write markdown..."
) {
    var showPreview by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
    ) {
        // Tab bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surfaceVariant)
        ) {
            TabButton(
                text = "Write",
                isSelected = !showPreview,
                onClick = { showPreview = false }
            )
            TabButton(
                text = "Preview",
                isSelected = showPreview,
                onClick = { showPreview = true }
            )
        }

        // Content
        if (showPreview) {
            MarkdownPreview(
                markdown = value,
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 200.dp)
                    .padding(16.dp)
            )
        } else {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                textStyle = TextStyle(
                    color = MaterialTheme.colorScheme.onSurface,
                    fontSize = 14.sp,
                    fontFamily = FontFamily.Monospace
                ),
                cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 200.dp)
                    .padding(16.dp),
                decorationBox = { innerTextField ->
                    Box {
                        if (value.isEmpty()) {
                            Text(
                                text = placeholder,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        innerTextField()
                    }
                }
            )
        }
    }
}

@Composable
private fun TabButton(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    TextButton(
        onClick = onClick,
        modifier = Modifier.padding(horizontal = 8.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = text,
                color = if (isSelected) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
            )
            if (isSelected) {
                Spacer(modifier = Modifier.height(4.dp))
                Box(
                    modifier = Modifier
                        .width(40.dp)
                        .height(2.dp)
                        .background(MaterialTheme.colorScheme.primary)
                )
            }
        }
    }
}

@Composable
private fun MarkdownPreview(
    markdown: String,
    modifier: Modifier = Modifier
) {
    // Simple markdown rendering
    val annotatedText = buildAnnotatedString {
        var remaining = markdown

        while (remaining.isNotEmpty()) {
            when {
                remaining.startsWith("# ") -> {
                    val end = remaining.indexOf("\\n").takeIf { it >= 0 } ?: remaining.length
                    withStyle(SpanStyle(fontSize = 24.sp, fontWeight = FontWeight.Bold)) {
                        append(remaining.substring(2, end))
                    }
                    append("\\n")
                    remaining = remaining.drop(end + 1)
                }
                remaining.startsWith("## ") -> {
                    val end = remaining.indexOf("\\n").takeIf { it >= 0 } ?: remaining.length
                    withStyle(SpanStyle(fontSize = 20.sp, fontWeight = FontWeight.Bold)) {
                        append(remaining.substring(3, end))
                    }
                    append("\\n")
                    remaining = remaining.drop(end + 1)
                }
                remaining.startsWith("**") -> {
                    val end = remaining.indexOf("**", 2)
                    if (end > 0) {
                        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) {
                            append(remaining.substring(2, end))
                        }
                        remaining = remaining.drop(end + 2)
                    } else {
                        append(remaining.first())
                        remaining = remaining.drop(1)
                    }
                }
                remaining.startsWith("*") -> {
                    val end = remaining.indexOf("*", 1)
                    if (end > 0) {
                        withStyle(SpanStyle(fontStyle = FontStyle.Italic)) {
                            append(remaining.substring(1, end))
                        }
                        remaining = remaining.drop(end + 1)
                    } else {
                        append(remaining.first())
                        remaining = remaining.drop(1)
                    }
                }
                else -> {
                    append(remaining.first())
                    remaining = remaining.drop(1)
                }
            }
        }
    }

    Text(
        text = annotatedText,
        modifier = modifier
    )
}

// Text Area with Character Count
@Composable
fun TextAreaWithCount(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Enter text...",
    maxLength: Int = 500,
    minLines: Int = 4
) {
    val remaining = maxLength - value.length
    val isNearLimit = remaining < 20

    Column(modifier = modifier) {
        OutlinedTextField(
            value = value,
            onValueChange = { if (it.length <= maxLength) onValueChange(it) },
            placeholder = { Text(placeholder) },
            modifier = Modifier.fillMaxWidth(),
            minLines = minLines,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = if (isNearLimit) Color(0xFFF59E0B) else MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = if (isNearLimit) Color(0xFFF59E0B).copy(alpha = 0.5f) else MaterialTheme.colorScheme.outline
            ),
            shape = RoundedCornerShape(12.dp)
        )

        Text(
            text = "$remaining characters remaining",
            style = MaterialTheme.typography.bodySmall,
            color = if (isNearLimit) Color(0xFFF59E0B) else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
            modifier = Modifier
                .align(Alignment.End)
                .padding(top = 4.dp, end = 4.dp)
        )
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
          filename: 'RichTextEditor.tsx',
          code: `// Desktop implementation uses the same React components as web
export { RichTextEditor, MarkdownEditor, TextAreaWithCount } from './RichTextEditor'
`
        }
      ]
    }
  },
  props: [
    { name: 'value', type: 'string', description: 'HTML content value', default: '' },
    { name: 'defaultValue', type: 'string', description: 'Initial HTML content', default: '' },
    { name: 'onChange', type: '(html: string) => void', description: 'Callback when content changes' },
    { name: 'onTextChange', type: '(text: string) => void', description: 'Callback with plain text content' },
    { name: 'placeholder', type: 'string', description: 'Placeholder text', default: 'Start typing...' },
    { name: 'disabled', type: 'boolean', description: 'Disable editing', default: false },
    { name: 'readOnly', type: 'boolean', description: 'Read-only mode', default: false },
    { name: 'toolbar', type: 'ToolbarOption[]', description: 'Array of toolbar options' },
    { name: 'minHeight', type: 'number', description: 'Minimum editor height', default: 150 },
    { name: 'maxHeight', type: 'number', description: 'Maximum editor height', default: 400 }
  ],
  examples: [
    {
      title: 'Basic Rich Text Editor',
      code: `<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write your article..."
/>`
    },
    {
      title: 'Markdown Editor',
      code: `<MarkdownEditor
  value={markdown}
  onChange={setMarkdown}
/>`
    },
    {
      title: 'Text Area with Count',
      code: `<TextAreaWithCount
  value={bio}
  onChange={setBio}
  maxLength={280}
  placeholder="Write your bio..."
/>`
    }
  ]
}
