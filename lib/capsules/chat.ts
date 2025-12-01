import type { CapsuleDefinition } from './types'

export const ChatCapsule: CapsuleDefinition = {
  id: 'chat',
  name: 'Chat',
  description: 'Chat interface with messages, typing indicators, and file attachments',
  category: 'communication',
  tags: ['chat', 'messages', 'conversation', 'messaging', 'real-time'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react'],
      files: [
        {
          filename: 'Chat.tsx',
          code: `import React, { useState, useRef, useEffect, useCallback } from 'react'

interface ChatMessage {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date | string
  type?: 'text' | 'image' | 'file' | 'system'
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  attachments?: Array<{
    type: 'image' | 'file'
    url: string
    name?: string
    size?: number
  }>
  replyTo?: ChatMessage
}

interface ChatProps {
  messages: ChatMessage[]
  currentUserId: string
  onSendMessage: (content: string, attachments?: File[]) => void
  onLoadMore?: () => void
  isTyping?: boolean
  typingUsers?: string[]
  placeholder?: string
  disabled?: boolean
  showTimestamps?: boolean
  groupByDate?: boolean
  className?: string
}

export function Chat({
  messages,
  currentUserId,
  onSendMessage,
  onLoadMore,
  isTyping = false,
  typingUsers = [],
  placeholder = 'Type a message...',
  disabled = false,
  showTimestamps = true,
  groupByDate = true,
  className = ''
}: ChatProps) {
  const [inputValue, setInputValue] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = useCallback(() => {
    if ((!inputValue.trim() && attachments.length === 0) || disabled) return

    onSendMessage(inputValue.trim(), attachments.length > 0 ? attachments : undefined)
    setInputValue('')
    setAttachments([])
    inputRef.current?.focus()
  }, [inputValue, attachments, disabled, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
  }

  // Group messages by date
  const groupedMessages = groupByDate
    ? messages.reduce((groups, message) => {
        const date = formatDate(message.timestamp)
        if (!groups[date]) groups[date] = []
        groups[date].push(message)
        return groups
      }, {} as Record<string, ChatMessage[]>)
    : { '': messages }

  return (
    <div className={\`flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden \${className}\`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {onLoadMore && (
          <button
            onClick={onLoadMore}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2"
          >
            Load older messages
          </button>
        )}

        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {date && (
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                  {date}
                </span>
              </div>
            )}

            {msgs.map((message, index) => {
              const isOwn = message.sender.id === currentUserId
              const showAvatar = !isOwn && (index === 0 || msgs[index - 1]?.sender.id !== message.sender.id)

              if (message.type === 'system') {
                return (
                  <div key={message.id} className="text-center my-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {message.content}
                    </span>
                  </div>
                )
              }

              return (
                <div
                  key={message.id}
                  className={\`flex gap-2 \${isOwn ? 'flex-row-reverse' : ''}\`}
                >
                  {/* Avatar */}
                  {!isOwn && (
                    <div className="w-8 flex-shrink-0">
                      {showAvatar && (
                        message.sender.avatar ? (
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">
                            {message.sender.name.charAt(0).toUpperCase()}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={\`max-w-[70%] \${isOwn ? 'items-end' : 'items-start'}\`}>
                    {/* Reply preview */}
                    {message.replyTo && (
                      <div className={\`mb-1 p-2 rounded-lg text-xs bg-gray-100 border-l-2 border-blue-400\`}>
                        <span className="font-medium">{message.replyTo.sender.name}</span>
                        <p className="text-gray-600 truncate">{message.replyTo.content}</p>
                      </div>
                    )}

                    <div
                      className={\`px-4 py-2 rounded-2xl \${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }\`}
                    >
                      {/* Attachments */}
                      {message.attachments?.map((att, i) => (
                        <div key={i} className="mb-2">
                          {att.type === 'image' ? (
                            <img
                              src={att.url}
                              alt=""
                              className="max-w-full rounded-lg"
                            />
                          ) : (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={\`flex items-center gap-2 p-2 rounded-lg \${
                                isOwn ? 'bg-blue-500' : 'bg-gray-200'
                              }\`}
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm truncate">{att.name || 'File'}</span>
                            </a>
                          )}
                        </div>
                      ))}

                      {/* Text */}
                      {message.content && (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      )}
                    </div>

                    {/* Timestamp & Status */}
                    {showTimestamps && (
                      <div className={\`flex items-center gap-1 mt-1 text-xs text-gray-400 \${
                        isOwn ? 'justify-end' : ''
                      }\`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {isOwn && message.status && (
                          <span>
                            {message.status === 'sending' && '⏳'}
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && <span className="text-blue-500">✓✓</span>}
                            {message.status === 'error' && <span className="text-red-500">!</span>}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {(isTyping || typingUsers.length > 0) && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>
              {typingUsers.length > 0
                ? \`\${typingUsers.join(', ')} \${typingUsers.length === 1 ? 'is' : 'are'} typing...\`
                : 'Someone is typing...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 flex gap-2 overflow-x-auto">
          {attachments.map((file, index) => (
            <div key={index} className="relative flex-shrink-0">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 max-h-32"
              style={{ minHeight: '40px' }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={disabled || (!inputValue.trim() && attachments.length === 0)}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Chat list/conversations
interface ChatConversation {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: Date | string
  unreadCount?: number
  isOnline?: boolean
  isGroup?: boolean
}

interface ChatListProps {
  conversations: ChatConversation[]
  selectedId?: string
  onSelect: (conversation: ChatConversation) => void
  className?: string
}

export function ChatList({
  conversations,
  selectedId,
  onSelect,
  className = ''
}: ChatListProps) {
  return (
    <div className={\`bg-white rounded-xl shadow-lg overflow-hidden \${className}\`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Messages</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={\`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors \${
              selectedId === conv.id ? 'bg-blue-50' : ''
            }\`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {conv.avatar ? (
                <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-medium">
                  {conv.isGroup ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                    </svg>
                  ) : (
                    conv.name.charAt(0).toUpperCase()
                  )}
                </div>
              )}
              {conv.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 truncate">{conv.name}</span>
                {conv.lastMessageTime && (
                  <span className="text-xs text-gray-500">
                    {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              {conv.lastMessage && (
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              )}
            </div>

            {/* Unread badge */}
            {conv.unreadCount && conv.unreadCount > 0 && (
              <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Message bubble component
interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true
}: MessageBubbleProps) {
  return (
    <div className={\`flex gap-2 \${isOwn ? 'flex-row-reverse' : ''}\`}>
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0">
          {message.sender.avatar ? (
            <img src={message.sender.avatar} alt="" className="w-full h-full rounded-full" />
          ) : (
            message.sender.name.charAt(0).toUpperCase()
          )}
        </div>
      )}

      <div className={\`max-w-[70%]\`}>
        <div
          className={\`px-4 py-2 rounded-2xl \${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }\`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {showTimestamp && (
          <div className={\`mt-1 text-xs text-gray-400 \${isOwn ? 'text-right' : ''}\`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
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
          filename: 'Chat.swift',
          code: `import SwiftUI

// MARK: - Models
struct ChatMessage: Identifiable, Hashable {
    let id: String
    var content: String
    var sender: ChatUser
    var timestamp: Date
    var status: MessageStatus?
    var attachments: [Attachment]?
    var replyTo: ChatMessage?

    struct Attachment: Hashable {
        let type: AttachmentType
        let url: URL
        var name: String?

        enum AttachmentType: String {
            case image, file
        }
    }

    enum MessageStatus: String {
        case sending, sent, delivered, read, error
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    static func == (lhs: ChatMessage, rhs: ChatMessage) -> Bool {
        lhs.id == rhs.id
    }
}

struct ChatUser: Hashable {
    let id: String
    var name: String
    var avatarURL: URL?
    var isOnline: Bool = false
}

// MARK: - Chat View
struct ChatView: View {
    let messages: [ChatMessage]
    let currentUserId: String
    var isTyping: Bool = false
    var typingUsers: [String] = []
    var onSendMessage: ((String) -> Void)?

    @State private var inputText = ""
    @FocusState private var isInputFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            // Messages
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach(messages) { message in
                            MessageRow(
                                message: message,
                                isOwn: message.sender.id == currentUserId
                            )
                            .id(message.id)
                        }

                        // Typing indicator
                        if isTyping || !typingUsers.isEmpty {
                            TypingIndicator(users: typingUsers)
                        }
                    }
                    .padding()
                }
                .onChange(of: messages.count) { _ in
                    if let lastId = messages.last?.id {
                        withAnimation {
                            proxy.scrollTo(lastId, anchor: .bottom)
                        }
                    }
                }
            }

            // Input
            ChatInputBar(
                text: $inputText,
                isFocused: $isInputFocused,
                onSend: {
                    if !inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        onSendMessage?(inputText)
                        inputText = ""
                    }
                }
            )
        }
    }
}

// MARK: - Message Row
struct MessageRow: View {
    let message: ChatMessage
    let isOwn: Bool

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if isOwn { Spacer(minLength: 60) }

            if !isOwn {
                // Avatar
                if let url = message.sender.avatarURL {
                    AsyncImage(url: url) { image in
                        image.resizable()
                    } placeholder: {
                        Color.gray
                    }
                    .frame(width: 32, height: 32)
                    .clipShape(Circle())
                } else {
                    Circle()
                        .fill(Color.blue)
                        .frame(width: 32, height: 32)
                        .overlay(
                            Text(String(message.sender.name.prefix(1)))
                                .font(.caption)
                                .foregroundColor(.white)
                        )
                }
            }

            VStack(alignment: isOwn ? .trailing : .leading, spacing: 4) {
                // Bubble
                Text(message.content)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(isOwn ? Color.blue : Color(.systemGray5))
                    .foregroundColor(isOwn ? .white : .primary)
                    .cornerRadius(20, corners: isOwn ? [.topLeft, .topRight, .bottomLeft] : [.topLeft, .topRight, .bottomRight])

                // Timestamp & Status
                HStack(spacing: 4) {
                    Text(message.timestamp, style: .time)
                        .font(.caption2)
                        .foregroundColor(.secondary)

                    if isOwn, let status = message.status {
                        StatusIcon(status: status)
                    }
                }
            }

            if !isOwn { Spacer(minLength: 60) }
        }
    }
}

// MARK: - Status Icon
struct StatusIcon: View {
    let status: ChatMessage.MessageStatus

    var body: some View {
        switch status {
        case .sending:
            Image(systemName: "clock")
                .font(.caption2)
                .foregroundColor(.secondary)
        case .sent:
            Image(systemName: "checkmark")
                .font(.caption2)
                .foregroundColor(.secondary)
        case .delivered:
            Image(systemName: "checkmark.circle")
                .font(.caption2)
                .foregroundColor(.secondary)
        case .read:
            Image(systemName: "checkmark.circle.fill")
                .font(.caption2)
                .foregroundColor(.blue)
        case .error:
            Image(systemName: "exclamationmark.circle")
                .font(.caption2)
                .foregroundColor(.red)
        }
    }
}

// MARK: - Typing Indicator
struct TypingIndicator: View {
    var users: [String] = []

    @State private var animating = false

    var body: some View {
        HStack(spacing: 8) {
            HStack(spacing: 4) {
                ForEach(0..<3, id: \\.self) { index in
                    Circle()
                        .fill(Color.gray)
                        .frame(width: 6, height: 6)
                        .offset(y: animating ? -4 : 0)
                        .animation(
                            Animation.easeInOut(duration: 0.4)
                                .repeatForever()
                                .delay(Double(index) * 0.15),
                            value: animating
                        )
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(.systemGray5))
            .cornerRadius(16)

            Text(users.isEmpty ? "Someone is typing..." : "\\(users.joined(separator: ", ")) typing...")
                .font(.caption)
                .foregroundColor(.secondary)

            Spacer()
        }
        .onAppear { animating = true }
    }
}

// MARK: - Chat Input Bar
struct ChatInputBar: View {
    @Binding var text: String
    @FocusState.Binding var isFocused: Bool
    var onSend: () -> Void
    var onAttachment: (() -> Void)?

    var body: some View {
        HStack(spacing: 12) {
            // Attachment button
            Button {
                onAttachment?()
            } label: {
                Image(systemName: "plus.circle.fill")
                    .font(.title2)
                    .foregroundColor(.blue)
            }

            // Text field
            TextField("Message", text: $text, axis: .vertical)
                .textFieldStyle(.plain)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color(.systemGray6))
                .cornerRadius(20)
                .focused($isFocused)
                .lineLimit(1...5)

            // Send button
            Button {
                onSend()
            } label: {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title)
                    .foregroundColor(text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? .gray : .blue)
            }
            .disabled(text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .fill(Color(.systemGray4))
                .frame(height: 0.5),
            alignment: .top
        )
    }
}

// MARK: - Chat List
struct ChatListView: View {
    let conversations: [Conversation]
    var selectedId: String?
    var onSelect: ((Conversation) -> Void)?

    struct Conversation: Identifiable {
        let id: String
        var name: String
        var avatarURL: URL?
        var lastMessage: String?
        var lastMessageTime: Date?
        var unreadCount: Int?
        var isOnline: Bool = false
    }

    var body: some View {
        List(conversations) { conversation in
            Button {
                onSelect?(conversation)
            } label: {
                HStack(spacing: 12) {
                    // Avatar
                    ZStack(alignment: .bottomTrailing) {
                        if let url = conversation.avatarURL {
                            AsyncImage(url: url) { image in
                                image.resizable()
                            } placeholder: {
                                Color.gray
                            }
                            .frame(width: 50, height: 50)
                            .clipShape(Circle())
                        } else {
                            Circle()
                                .fill(Color.blue.gradient)
                                .frame(width: 50, height: 50)
                                .overlay(
                                    Text(String(conversation.name.prefix(1)))
                                        .font(.title2)
                                        .foregroundColor(.white)
                                )
                        }

                        if conversation.isOnline {
                            Circle()
                                .fill(Color.green)
                                .frame(width: 14, height: 14)
                                .overlay(
                                    Circle().stroke(Color.white, lineWidth: 2)
                                )
                        }
                    }

                    // Content
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            Text(conversation.name)
                                .fontWeight(.semibold)

                            Spacer()

                            if let time = conversation.lastMessageTime {
                                Text(time, style: .time)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }

                        if let message = conversation.lastMessage {
                            Text(message)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .lineLimit(1)
                        }
                    }

                    // Unread badge
                    if let count = conversation.unreadCount, count > 0 {
                        Text(count > 9 ? "9+" : "\\(count)")
                            .font(.caption2)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .frame(width: 20, height: 20)
                            .background(Color.blue)
                            .clipShape(Circle())
                    }
                }
            }
            .listRowBackground(
                selectedId == conversation.id ? Color.blue.opacity(0.1) : Color.clear
            )
        }
        .listStyle(.plain)
    }
}

// MARK: - Corner Radius Extension
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}

// MARK: - Preview
struct Chat_Previews: PreviewProvider {
    static var previews: some View {
        ChatView(
            messages: [
                ChatMessage(id: "1", content: "Hello!", sender: ChatUser(id: "1", name: "John"), timestamp: Date()),
                ChatMessage(id: "2", content: "Hi there!", sender: ChatUser(id: "me", name: "Me"), timestamp: Date())
            ],
            currentUserId: "me"
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
          filename: 'Chat.kt',
          code: `package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class ChatMessageData(
    val id: String,
    val content: String,
    val sender: ChatUserData,
    val timestamp: Date,
    val status: MessageStatus? = null
) {
    enum class MessageStatus { SENDING, SENT, DELIVERED, READ, ERROR }
}

data class ChatUserData(
    val id: String,
    val name: String,
    val avatarUrl: String? = null,
    val isOnline: Boolean = false
)

data class ConversationData(
    val id: String,
    val name: String,
    val avatarUrl: String? = null,
    val lastMessage: String? = null,
    val lastMessageTime: Date? = null,
    val unreadCount: Int = 0,
    val isOnline: Boolean = false
)

@Composable
fun ChatScreen(
    messages: List<ChatMessageData>,
    currentUserId: String,
    modifier: Modifier = Modifier,
    isTyping: Boolean = false,
    typingUsers: List<String> = emptyList(),
    onSendMessage: (String) -> Unit = {}
) {
    var inputText by remember { mutableStateOf("") }
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Column(modifier = modifier.fillMaxSize()) {
        // Messages
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages, key = { it.id }) { message ->
                MessageBubble(
                    message = message,
                    isOwn = message.sender.id == currentUserId
                )
            }

            if (isTyping || typingUsers.isNotEmpty()) {
                item {
                    TypingIndicator(
                        users = typingUsers
                    )
                }
            }
        }

        // Input
        ChatInputBar(
            text = inputText,
            onTextChange = { inputText = it },
            onSend = {
                if (inputText.isNotBlank()) {
                    onSendMessage(inputText.trim())
                    inputText = ""
                    coroutineScope.launch {
                        listState.animateScrollToItem(messages.size)
                    }
                }
            }
        )
    }
}

@Composable
fun MessageBubble(
    message: ChatMessageData,
    isOwn: Boolean,
    modifier: Modifier = Modifier
) {
    val timeFormat = remember { SimpleDateFormat("HH:mm", Locale.getDefault()) }

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = if (isOwn) Arrangement.End else Arrangement.Start
    ) {
        if (!isOwn) {
            // Avatar
            if (message.sender.avatarUrl != null) {
                AsyncImage(
                    model = message.sender.avatarUrl,
                    contentDescription = message.sender.name,
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                )
            } else {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primary),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        message.sender.name.first().uppercase(),
                        color = Color.White,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
            Spacer(modifier = Modifier.width(8.dp))
        }

        Column(
            horizontalAlignment = if (isOwn) Alignment.End else Alignment.Start
        ) {
            Surface(
                shape = RoundedCornerShape(
                    topStart = 16.dp,
                    topEnd = 16.dp,
                    bottomStart = if (isOwn) 16.dp else 4.dp,
                    bottomEnd = if (isOwn) 4.dp else 16.dp
                ),
                color = if (isOwn) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.surfaceVariant
            ) {
                Text(
                    text = message.content,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                    color = if (isOwn) Color.White
                            else MaterialTheme.colorScheme.onSurface
                )
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(top = 4.dp)
            ) {
                Text(
                    text = timeFormat.format(message.timestamp),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                )

                if (isOwn) {
                    message.status?.let { status ->
                        Icon(
                            imageVector = when (status) {
                                ChatMessageData.MessageStatus.SENDING -> Icons.Default.Schedule
                                ChatMessageData.MessageStatus.SENT -> Icons.Default.Check
                                ChatMessageData.MessageStatus.DELIVERED -> Icons.Default.DoneAll
                                ChatMessageData.MessageStatus.READ -> Icons.Default.DoneAll
                                ChatMessageData.MessageStatus.ERROR -> Icons.Default.ErrorOutline
                            },
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = when (status) {
                                ChatMessageData.MessageStatus.READ -> MaterialTheme.colorScheme.primary
                                ChatMessageData.MessageStatus.ERROR -> Color.Red
                                else -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TypingIndicator(
    users: List<String>,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surfaceVariant
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                repeat(3) { index ->
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f))
                    )
                }
            }
        }

        Text(
            text = if (users.isEmpty()) "Someone is typing..."
                   else "\${users.joinToString(", ")} typing...",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
        )
    }
}

@Composable
fun ChatInputBar(
    text: String,
    onTextChange: (String) -> Unit,
    onSend: () -> Unit,
    modifier: Modifier = Modifier,
    onAttachment: (() -> Unit)? = null
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shadowElevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Attachment
            IconButton(onClick = { onAttachment?.invoke() }) {
                Icon(
                    Icons.Default.AttachFile,
                    "Attach",
                    tint = MaterialTheme.colorScheme.primary
                )
            }

            // Text field
            OutlinedTextField(
                value = text,
                onValueChange = onTextChange,
                placeholder = { Text("Message") },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(24.dp),
                maxLines = 4
            )

            // Send
            IconButton(
                onClick = onSend,
                enabled = text.isNotBlank()
            ) {
                Icon(
                    Icons.Default.Send,
                    "Send",
                    tint = if (text.isNotBlank()) MaterialTheme.colorScheme.primary
                           else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                )
            }
        }
    }
}

// Chat List
@Composable
fun ChatList(
    conversations: List<ConversationData>,
    selectedId: String? = null,
    modifier: Modifier = Modifier,
    onSelect: (ConversationData) -> Unit = {}
) {
    LazyColumn(modifier = modifier) {
        items(conversations, key = { it.id }) { conversation ->
            ConversationItem(
                conversation = conversation,
                isSelected = conversation.id == selectedId,
                onClick = { onSelect(conversation) }
            )
        }
    }
}

@Composable
fun ConversationItem(
    conversation: ConversationData,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val timeFormat = remember { SimpleDateFormat("HH:mm", Locale.getDefault()) }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        color = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                else Color.Transparent
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar
            Box {
                if (conversation.avatarUrl != null) {
                    AsyncImage(
                        model = conversation.avatarUrl,
                        contentDescription = conversation.name,
                        modifier = Modifier
                            .size(50.dp)
                            .clip(CircleShape)
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .size(50.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            conversation.name.first().uppercase(),
                            color = Color.White,
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }

                if (conversation.isOnline) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .size(14.dp)
                            .clip(CircleShape)
                            .background(Color.Green)
                            .padding(2.dp)
                    )
                }
            }

            // Content
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        conversation.name,
                        fontWeight = FontWeight.SemiBold
                    )

                    conversation.lastMessageTime?.let { time ->
                        Text(
                            timeFormat.format(time),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                        )
                    }
                }

                conversation.lastMessage?.let { message ->
                    Text(
                        message,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            // Unread badge
            if (conversation.unreadCount > 0) {
                Box(
                    modifier = Modifier
                        .size(20.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primary),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (conversation.unreadCount > 9) "9+" else conversation.unreadCount.toString(),
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White
                    )
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
          filename: 'Chat.tsx',
          code: `// Desktop uses the same React components with desktop optimizations
export { Chat, ChatList, MessageBubble } from './Chat'
`
        }
      ]
    }
  },
  props: [
    { name: 'messages', type: 'ChatMessage[]', description: 'Array of chat messages', required: true },
    { name: 'currentUserId', type: 'string', description: 'Current user ID', required: true },
    { name: 'onSendMessage', type: '(content: string, attachments?: File[]) => void', description: 'Send message callback', required: true },
    { name: 'onLoadMore', type: '() => void', description: 'Load more messages callback' },
    { name: 'isTyping', type: 'boolean', description: 'Show typing indicator', default: false },
    { name: 'typingUsers', type: 'string[]', description: 'Users currently typing' },
    { name: 'placeholder', type: 'string', description: 'Input placeholder', default: 'Type a message...' },
    { name: 'disabled', type: 'boolean', description: 'Disable input', default: false }
  ],
  examples: [
    {
      title: 'Basic Chat',
      code: `<Chat
  messages={messages}
  currentUserId="user123"
  onSendMessage={(text) => sendMessage(text)}
/>`
    },
    {
      title: 'Chat List',
      code: `<ChatList
  conversations={conversations}
  selectedId={selectedConversationId}
  onSelect={(conv) => setSelected(conv.id)}
/>`
    }
  ]
}
