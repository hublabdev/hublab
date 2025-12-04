/**
 * HubLab Connections System
 *
 * Enables apps to connect with local AI services, APIs, and external systems.
 * Generates native code for iOS, Android, Web, and Desktop.
 *
 * Philosophy: "Your app, your infrastructure. Connect to anything."
 */

// ============================================================================
// CONNECTION TYPES
// ============================================================================

export type ConnectionType =
  | 'supertonic-tts'
  | 'lm-studio'
  | 'ollama'
  | 'openai-compatible'
  | 'rest-api'
  | 'websocket'
  | 'grpc'
  | 'mqtt'

export interface Connection {
  id: string
  type: ConnectionType
  name: string
  icon: string
  description: string
  defaultConfig: ConnectionConfig
  capabilities: string[]
  platforms: string[]
  docsUrl?: string
}

export interface ConnectionConfig {
  baseUrl: string
  port?: number
  apiKey?: string
  headers?: Record<string, string>
  timeout?: number
  retryCount?: number
}

// ============================================================================
// AVAILABLE CONNECTIONS
// ============================================================================

export const CONNECTIONS: Connection[] = [
  {
    id: 'supertonic-tts',
    type: 'supertonic-tts',
    name: 'Supertonic TTS',
    icon: '🔊',
    description: 'High-quality local text-to-speech with ONNX models',
    defaultConfig: {
      baseUrl: 'http://localhost',
      port: 5123,
      timeout: 30000
    },
    capabilities: ['text-to-speech', 'voice-selection', 'streaming', 'offline'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    docsUrl: 'https://github.com/anthropics/supertonic'
  },
  {
    id: 'lm-studio',
    type: 'lm-studio',
    name: 'LM Studio',
    icon: '🧠',
    description: 'Run local LLMs with OpenAI-compatible API',
    defaultConfig: {
      baseUrl: 'http://localhost',
      port: 1234,
      timeout: 60000
    },
    capabilities: ['chat', 'completion', 'embeddings', 'streaming', 'offline'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    docsUrl: 'https://lmstudio.ai/docs'
  },
  {
    id: 'ollama',
    type: 'ollama',
    name: 'Ollama',
    icon: '🦙',
    description: 'Lightweight local LLM runner',
    defaultConfig: {
      baseUrl: 'http://localhost',
      port: 11434,
      timeout: 60000
    },
    capabilities: ['chat', 'completion', 'embeddings', 'pull-models', 'offline'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    docsUrl: 'https://ollama.ai/docs'
  },
  {
    id: 'openai',
    type: 'openai-compatible',
    name: 'OpenAI API',
    icon: '🤖',
    description: 'Connect to OpenAI or compatible endpoints',
    defaultConfig: {
      baseUrl: 'https://api.openai.com/v1',
      timeout: 30000
    },
    capabilities: ['chat', 'completion', 'embeddings', 'images', 'tts', 'whisper'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    docsUrl: 'https://platform.openai.com/docs'
  },
  {
    id: 'groq',
    type: 'openai-compatible',
    name: 'Groq',
    icon: '⚡',
    description: 'Ultra-fast LLM inference',
    defaultConfig: {
      baseUrl: 'https://api.groq.com/openai/v1',
      timeout: 15000
    },
    capabilities: ['chat', 'completion', 'streaming'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    docsUrl: 'https://console.groq.com/docs'
  },
  {
    id: 'anthropic',
    type: 'rest-api',
    name: 'Anthropic Claude',
    icon: '🎭',
    description: 'Connect to Claude API',
    defaultConfig: {
      baseUrl: 'https://api.anthropic.com/v1',
      timeout: 60000,
      headers: {
        'anthropic-version': '2023-06-01'
      }
    },
    capabilities: ['chat', 'streaming', 'vision'],
    platforms: ['ios', 'android', 'web', 'desktop'],
    docsUrl: 'https://docs.anthropic.com'
  },
  {
    id: 'custom-rest',
    type: 'rest-api',
    name: 'Custom REST API',
    icon: '🔌',
    description: 'Connect to any REST API endpoint',
    defaultConfig: {
      baseUrl: 'https://api.example.com',
      timeout: 30000
    },
    capabilities: ['get', 'post', 'put', 'delete', 'patch'],
    platforms: ['ios', 'android', 'web', 'desktop']
  },
  {
    id: 'websocket',
    type: 'websocket',
    name: 'WebSocket',
    icon: '🔄',
    description: 'Real-time bidirectional communication',
    defaultConfig: {
      baseUrl: 'ws://localhost:8080',
      timeout: 10000
    },
    capabilities: ['realtime', 'bidirectional', 'events'],
    platforms: ['ios', 'android', 'web', 'desktop']
  }
]

// ============================================================================
// CONNECTION CAPSULES (for the editor)
// ============================================================================

export interface ConnectionCapsule {
  id: string
  name: string
  icon: string
  category: 'connection'
  connection: ConnectionType
  description: string
  defaultProps: Record<string, unknown>
}

export const CONNECTION_CAPSULES: ConnectionCapsule[] = [
  // TTS
  {
    id: 'supertonic-speak',
    name: 'Speak Text',
    icon: '🔊',
    category: 'connection',
    connection: 'supertonic-tts',
    description: 'Convert text to speech using Supertonic',
    defaultProps: {
      text: 'Hello, world!',
      voice: 'default',
      speed: 1.0,
      pitch: 1.0
    }
  },
  {
    id: 'supertonic-voices',
    name: 'Voice Selector',
    icon: '🎤',
    category: 'connection',
    connection: 'supertonic-tts',
    description: 'Let users choose a voice',
    defaultProps: {
      showPreview: true,
      defaultVoice: 'default'
    }
  },
  // LM Studio / Ollama / OpenAI
  {
    id: 'ai-chat',
    name: 'AI Chat',
    icon: '💬',
    category: 'connection',
    connection: 'lm-studio',
    description: 'Chat interface with local or cloud LLM',
    defaultProps: {
      provider: 'lm-studio',
      model: 'default',
      systemPrompt: 'You are a helpful assistant.',
      temperature: 0.7,
      maxTokens: 1024,
      streaming: true
    }
  },
  {
    id: 'ai-completion',
    name: 'AI Completion',
    icon: '✨',
    category: 'connection',
    connection: 'lm-studio',
    description: 'Get AI completions for text',
    defaultProps: {
      provider: 'lm-studio',
      model: 'default',
      prompt: '',
      temperature: 0.7,
      maxTokens: 256
    }
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: '🤖',
    category: 'connection',
    connection: 'lm-studio',
    description: 'Full-featured AI assistant with memory',
    defaultProps: {
      provider: 'lm-studio',
      model: 'default',
      systemPrompt: 'You are a helpful assistant.',
      enableMemory: true,
      enableVoice: false
    }
  },
  // API Connections
  {
    id: 'api-fetch',
    name: 'API Fetch',
    icon: '📡',
    category: 'connection',
    connection: 'rest-api',
    description: 'Fetch data from any API',
    defaultProps: {
      url: '',
      method: 'GET',
      headers: {},
      body: null
    }
  },
  {
    id: 'api-form',
    name: 'API Form',
    icon: '📝',
    category: 'connection',
    connection: 'rest-api',
    description: 'Submit form data to API',
    defaultProps: {
      url: '',
      method: 'POST',
      fields: ['name', 'email']
    }
  },
  {
    id: 'realtime-sync',
    name: 'Realtime Sync',
    icon: '🔄',
    category: 'connection',
    connection: 'websocket',
    description: 'Sync data in real-time via WebSocket',
    defaultProps: {
      url: 'ws://localhost:8080',
      autoReconnect: true,
      heartbeat: 30000
    }
  }
]

// ============================================================================
// CODE GENERATORS
// ============================================================================

export function generateConnectionCode(
  capsule: ConnectionCapsule,
  config: ConnectionConfig,
  platform: 'swift' | 'kotlin' | 'react' | 'tauri'
): string {
  switch (capsule.connection) {
    case 'supertonic-tts':
      return generateSupertonicCode(capsule, config, platform)
    case 'lm-studio':
    case 'ollama':
    case 'openai-compatible':
      return generateLLMCode(capsule, config, platform)
    case 'rest-api':
      return generateRestCode(capsule, config, platform)
    case 'websocket':
      return generateWebSocketCode(capsule, config, platform)
    default:
      return '// Connection code not available'
  }
}

// ============================================================================
// SUPERTONIC TTS CODE GENERATION
// ============================================================================

function generateSupertonicCode(
  capsule: ConnectionCapsule,
  config: ConnectionConfig,
  platform: 'swift' | 'kotlin' | 'react' | 'tauri'
): string {
  const baseUrl = `${config.baseUrl}:${config.port || 5123}`

  if (platform === 'swift') {
    return `
import AVFoundation

class SupertonicTTS: ObservableObject {
    private let baseURL = "${baseUrl}"
    private var audioPlayer: AVAudioPlayer?
    @Published var isPlaying = false
    @Published var availableVoices: [String] = []

    func speak(text: String, voice: String = "default", speed: Float = 1.0) async throws {
        let url = URL(string: "\\(baseURL)/tts")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "text": text,
            "voice": voice,
            "speed": speed
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)

        DispatchQueue.main.async {
            self.audioPlayer = try? AVAudioPlayer(data: data)
            self.audioPlayer?.play()
            self.isPlaying = true
        }
    }

    func stop() {
        audioPlayer?.stop()
        isPlaying = false
    }

    func fetchVoices() async throws {
        let url = URL(string: "\\(baseURL)/voices")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let voices = try JSONDecoder().decode([String].self, from: data)
        DispatchQueue.main.async {
            self.availableVoices = voices
        }
    }
}

// Usage in SwiftUI View
struct SpeakButton: View {
    @StateObject private var tts = SupertonicTTS()
    let text: String

    var body: some View {
        Button(action: {
            Task {
                try? await tts.speak(text: text)
            }
        }) {
            Image(systemName: tts.isPlaying ? "speaker.wave.3.fill" : "speaker.wave.2")
        }
    }
}
`
  }

  if (platform === 'kotlin') {
    return `
import android.media.MediaPlayer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class SupertonicTTS(private val baseUrl: String = "${baseUrl}") {
    private var mediaPlayer: MediaPlayer? = null

    suspend fun speak(text: String, voice: String = "default", speed: Float = 1.0f) {
        withContext(Dispatchers.IO) {
            val client = OkHttpClient()
            val json = JSONObject().apply {
                put("text", text)
                put("voice", voice)
                put("speed", speed)
            }

            val request = Request.Builder()
                .url("$baseUrl/tts")
                .post(json.toString().toRequestBody("application/json".toMediaType()))
                .build()

            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val tempFile = File.createTempFile("tts", ".wav")
                    response.body?.byteStream()?.copyTo(tempFile.outputStream())

                    withContext(Dispatchers.Main) {
                        mediaPlayer?.release()
                        mediaPlayer = MediaPlayer().apply {
                            setDataSource(tempFile.absolutePath)
                            prepare()
                            start()
                        }
                    }
                }
            }
        }
    }

    fun stop() {
        mediaPlayer?.stop()
        mediaPlayer?.release()
        mediaPlayer = null
    }
}

// Usage in Compose
@Composable
fun SpeakButton(text: String) {
    val tts = remember { SupertonicTTS() }
    val scope = rememberCoroutineScope()

    IconButton(onClick = {
        scope.launch { tts.speak(text) }
    }) {
        Icon(Icons.Default.VolumeUp, contentDescription = "Speak")
    }
}
`
  }

  if (platform === 'react') {
    return `
import { useState, useCallback } from 'react'

const SUPERTONIC_URL = '${baseUrl}'

export function useSupertonicTTS() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState<string[]>([])
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const speak = useCallback(async (
    text: string,
    voice = 'default',
    speed = 1.0
  ) => {
    try {
      const response = await fetch(\`\${SUPERTONIC_URL}/tts\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, speed })
      })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const newAudio = new Audio(url)
      newAudio.onended = () => setIsPlaying(false)
      newAudio.play()

      setAudio(newAudio)
      setIsPlaying(true)
    } catch (error) {
      console.error('TTS error:', error)
    }
  }, [])

  const stop = useCallback(() => {
    audio?.pause()
    setIsPlaying(false)
  }, [audio])

  const fetchVoices = useCallback(async () => {
    try {
      const response = await fetch(\`\${SUPERTONIC_URL}/voices\`)
      const data = await response.json()
      setVoices(data)
    } catch (error) {
      console.error('Failed to fetch voices:', error)
    }
  }, [])

  return { speak, stop, isPlaying, voices, fetchVoices }
}

// Usage
function SpeakButton({ text }: { text: string }) {
  const { speak, isPlaying } = useSupertonicTTS()

  return (
    <button onClick={() => speak(text)}>
      {isPlaying ? '🔊' : '🔈'} Speak
    </button>
  )
}
`
  }

  // Tauri (Rust + TypeScript)
  return `
// Tauri command (Rust side)
#[tauri::command]
async fn speak_text(text: String, voice: String, speed: f32) -> Result<Vec<u8>, String> {
    let client = reqwest::Client::new();
    let response = client
        .post("${baseUrl}/tts")
        .json(&serde_json::json!({
            "text": text,
            "voice": voice,
            "speed": speed
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let bytes = response.bytes().await.map_err(|e| e.to_string())?;
    Ok(bytes.to_vec())
}

// Frontend (TypeScript)
import { invoke } from '@tauri-apps/api/tauri'

export async function speak(text: string, voice = 'default', speed = 1.0) {
  const audioData = await invoke<number[]>('speak_text', { text, voice, speed })
  const blob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' })
  const audio = new Audio(URL.createObjectURL(blob))
  audio.play()
}
`
}

// ============================================================================
// LLM CODE GENERATION (LM Studio, Ollama, OpenAI)
// ============================================================================

function generateLLMCode(
  capsule: ConnectionCapsule,
  config: ConnectionConfig,
  platform: 'swift' | 'kotlin' | 'react' | 'tauri'
): string {
  const baseUrl = config.port
    ? `${config.baseUrl}:${config.port}`
    : config.baseUrl
  const isLocal = config.baseUrl.includes('localhost') || config.baseUrl.includes('127.0.0.1')

  if (platform === 'swift') {
    return `
import Foundation

actor LLMClient {
    private let baseURL: String
    private let apiKey: String?

    init(baseURL: String = "${baseUrl}", apiKey: String? = ${config.apiKey ? `"${config.apiKey}"` : 'nil'}) {
        self.baseURL = baseURL
        self.apiKey = apiKey
    }

    struct Message: Codable {
        let role: String
        let content: String
    }

    struct ChatRequest: Codable {
        let model: String
        let messages: [Message]
        let temperature: Double
        let max_tokens: Int
        let stream: Bool
    }

    struct ChatResponse: Codable {
        struct Choice: Codable {
            struct Message: Codable {
                let content: String
            }
            let message: Message
        }
        let choices: [Choice]
    }

    func chat(
        messages: [Message],
        model: String = "default",
        temperature: Double = 0.7,
        maxTokens: Int = 1024
    ) async throws -> String {
        let url = URL(string: "\\(baseURL)/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let key = apiKey {
            request.setValue("Bearer \\(key)", forHTTPHeaderField: "Authorization")
        }

        let body = ChatRequest(
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
            stream: false
        )
        request.httpBody = try JSONEncoder().encode(body)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(ChatResponse.self, from: data)

        return response.choices.first?.message.content ?? ""
    }

    // Streaming version
    func chatStream(
        messages: [Message],
        model: String = "default",
        onToken: @escaping (String) -> Void
    ) async throws {
        let url = URL(string: "\\(baseURL)/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let key = apiKey {
            request.setValue("Bearer \\(key)", forHTTPHeaderField: "Authorization")
        }

        let body = ChatRequest(
            model: model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024,
            stream: true
        )
        request.httpBody = try JSONEncoder().encode(body)

        let (stream, _) = try await URLSession.shared.bytes(for: request)

        for try await line in stream.lines {
            if line.hasPrefix("data: "), let data = line.dropFirst(6).data(using: .utf8) {
                if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let choices = json["choices"] as? [[String: Any]],
                   let delta = choices.first?["delta"] as? [String: Any],
                   let content = delta["content"] as? String {
                    onToken(content)
                }
            }
        }
    }
}

// SwiftUI Chat View
struct ChatView: View {
    @State private var messages: [LLMClient.Message] = []
    @State private var input = ""
    @State private var isLoading = false
    private let client = LLMClient()

    var body: some View {
        VStack {
            ScrollView {
                ForEach(messages, id: \\.content) { message in
                    HStack {
                        if message.role == "user" { Spacer() }
                        Text(message.content)
                            .padding()
                            .background(message.role == "user" ? Color.blue : Color.gray.opacity(0.2))
                            .cornerRadius(12)
                        if message.role == "assistant" { Spacer() }
                    }
                }
            }

            HStack {
                TextField("Message...", text: $input)
                    .textFieldStyle(.roundedBorder)

                Button(action: sendMessage) {
                    Image(systemName: "arrow.up.circle.fill")
                }
                .disabled(input.isEmpty || isLoading)
            }
            .padding()
        }
    }

    func sendMessage() {
        let userMessage = LLMClient.Message(role: "user", content: input)
        messages.append(userMessage)
        input = ""
        isLoading = true

        Task {
            do {
                let response = try await client.chat(messages: messages)
                messages.append(LLMClient.Message(role: "assistant", content: response))
            } catch {
                print("Error: \\(error)")
            }
            isLoading = false
        }
    }
}
`
  }

  if (platform === 'kotlin') {
    return `
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody

class LLMClient(
    private val baseUrl: String = "${baseUrl}",
    private val apiKey: String? = ${config.apiKey ? `"${config.apiKey}"` : 'null'}
) {
    private val client = OkHttpClient()
    private val json = Json { ignoreUnknownKeys = true }

    @Serializable
    data class Message(val role: String, val content: String)

    @Serializable
    data class ChatRequest(
        val model: String,
        val messages: List<Message>,
        val temperature: Double = 0.7,
        val max_tokens: Int = 1024,
        val stream: Boolean = false
    )

    suspend fun chat(
        messages: List<Message>,
        model: String = "default"
    ): String {
        val request = ChatRequest(model = model, messages = messages)

        val httpRequest = Request.Builder()
            .url("$baseUrl/chat/completions")
            .post(json.encodeToString(request).toRequestBody("application/json".toMediaType()))
            .apply { apiKey?.let { addHeader("Authorization", "Bearer $it") } }
            .build()

        val response = client.newCall(httpRequest).execute()
        val body = response.body?.string() ?: ""
        val jsonResponse = json.parseToJsonElement(body).jsonObject

        return jsonResponse["choices"]?.jsonArray
            ?.firstOrNull()?.jsonObject
            ?.get("message")?.jsonObject
            ?.get("content")?.jsonPrimitive?.content ?: ""
    }

    fun chatStream(messages: List<Message>, model: String = "default"): Flow<String> = flow {
        val request = ChatRequest(model = model, messages = messages, stream = true)

        val httpRequest = Request.Builder()
            .url("$baseUrl/chat/completions")
            .post(json.encodeToString(request).toRequestBody("application/json".toMediaType()))
            .apply { apiKey?.let { addHeader("Authorization", "Bearer $it") } }
            .build()

        client.newCall(httpRequest).execute().use { response ->
            response.body?.source()?.let { source ->
                while (!source.exhausted()) {
                    val line = source.readUtf8Line() ?: continue
                    if (line.startsWith("data: ")) {
                        val data = line.removePrefix("data: ")
                        if (data != "[DONE]") {
                            val chunk = json.parseToJsonElement(data).jsonObject
                            val content = chunk["choices"]?.jsonArray
                                ?.firstOrNull()?.jsonObject
                                ?.get("delta")?.jsonObject
                                ?.get("content")?.jsonPrimitive?.content
                            content?.let { emit(it) }
                        }
                    }
                }
            }
        }
    }
}

// Jetpack Compose Chat UI
@Composable
fun ChatScreen() {
    var messages by remember { mutableStateOf(listOf<LLMClient.Message>()) }
    var input by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val client = remember { LLMClient() }
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(messages) { message ->
                ChatBubble(message)
            }
        }

        Row(modifier = Modifier.padding(16.dp)) {
            TextField(
                value = input,
                onValueChange = { input = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Message...") }
            )
            IconButton(
                onClick = {
                    val userMsg = LLMClient.Message("user", input)
                    messages = messages + userMsg
                    input = ""
                    isLoading = true
                    scope.launch {
                        val response = client.chat(messages)
                        messages = messages + LLMClient.Message("assistant", response)
                        isLoading = false
                    }
                },
                enabled = input.isNotEmpty() && !isLoading
            ) {
                Icon(Icons.Default.Send, "Send")
            }
        }
    }
}
`
  }

  if (platform === 'react') {
    return `
import { useState, useCallback, useRef } from 'react'

const LLM_URL = '${baseUrl}'
const API_KEY = ${config.apiKey ? `'${config.apiKey}'` : 'undefined'}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function useLLM() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const chat = useCallback(async (
    userMessage: string,
    systemPrompt?: string,
    options?: { model?: string; temperature?: number; maxTokens?: number }
  ) => {
    const newMessages: Message[] = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...messages,
      { role: 'user' as const, content: userMessage }
    ]

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(\`\${LLM_URL}/chat/completions\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY ? { 'Authorization': \`Bearer \${API_KEY}\` } : {})
        },
        body: JSON.stringify({
          model: options?.model || 'default',
          messages: newMessages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1024,
          stream: false
        })
      })

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
      return assistantMessage
    } catch (error) {
      console.error('LLM error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const chatStream = useCallback(async (
    userMessage: string,
    onToken: (token: string) => void,
    systemPrompt?: string
  ) => {
    const newMessages: Message[] = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...messages,
      { role: 'user' as const, content: userMessage }
    ]

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    abortRef.current = new AbortController()

    try {
      const response = await fetch(\`\${LLM_URL}/chat/completions\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY ? { 'Authorization': \`Bearer \${API_KEY}\` } : {})
        },
        body: JSON.stringify({
          model: 'default',
          messages: newMessages,
          stream: true
        }),
        signal: abortRef.current.signal
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\\n').filter(line => line.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const token = parsed.choices[0]?.delta?.content || ''
            fullContent += token
            onToken(token)
          } catch {}
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
      return fullContent
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Stream error:', error)
        throw error
      }
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const clear = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, chat, chatStream, stop, clear, isLoading }
}

// Chat Component
export function ChatInterface() {
  const { messages, chat, chatStream, isLoading, clear } = useLLM()
  const [input, setInput] = useState('')
  const [streamedContent, setStreamedContent] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    const message = input
    setInput('')
    setStreamedContent('')

    await chatStream(message, (token) => {
      setStreamedContent(prev => prev + token)
    })
    setStreamedContent('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={\`p-3 rounded-lg \${
              msg.role === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100 mr-auto'
            } max-w-[80%]\`}
          >
            {msg.content}
          </div>
        ))}
        {streamedContent && (
          <div className="p-3 rounded-lg bg-gray-100 mr-auto max-w-[80%]">
            {streamedContent}
            <span className="animate-pulse">|</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
`
  }

  // Tauri
  return `
// lib.rs (Rust backend)
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::State;
use tokio::sync::Mutex;

#[derive(Serialize, Deserialize, Clone)]
pub struct Message {
    role: String,
    content: String,
}

#[derive(Default)]
pub struct LLMState {
    messages: Mutex<Vec<Message>>,
}

#[tauri::command]
async fn chat(
    message: String,
    system_prompt: Option<String>,
    state: State<'_, LLMState>,
) -> Result<String, String> {
    let client = Client::new();
    let mut messages = state.messages.lock().await;

    let mut all_messages = vec![];
    if let Some(prompt) = system_prompt {
        all_messages.push(Message { role: "system".into(), content: prompt });
    }
    all_messages.extend(messages.clone());
    all_messages.push(Message { role: "user".into(), content: message.clone() });

    let response = client
        .post("${baseUrl}/chat/completions")
        .header("Content-Type", "application/json")
        ${config.apiKey ? `.header("Authorization", "Bearer ${config.apiKey}")` : ''}
        .json(&serde_json::json!({
            "model": "default",
            "messages": all_messages,
            "temperature": 0.7,
            "max_tokens": 1024
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let data: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;
    let content = data["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("")
        .to_string();

    messages.push(Message { role: "user".into(), content: message });
    messages.push(Message { role: "assistant".into(), content: content.clone() });

    Ok(content)
}

// Frontend (TypeScript)
import { invoke } from '@tauri-apps/api/tauri'

export async function chat(message: string, systemPrompt?: string): Promise<string> {
  return invoke('chat', { message, systemPrompt })
}
`
}

// ============================================================================
// REST API CODE GENERATION
// ============================================================================

function generateRestCode(
  capsule: ConnectionCapsule,
  config: ConnectionConfig,
  platform: 'swift' | 'kotlin' | 'react' | 'tauri'
): string {
  if (platform === 'react') {
    return `
import { useState, useCallback } from 'react'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
}

export function useAPI(baseUrl = '${config.baseUrl}') {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const request = useCallback(async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(\`\${baseUrl}\${endpoint}\`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ${config.apiKey ? `'Authorization': 'Bearer ${config.apiKey}',` : ''}
          ...options.headers
        },
        ...(options.body ? { body: JSON.stringify(options.body) } : {})
      })

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
      }

      return response.json()
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [baseUrl])

  const get = <T>(endpoint: string) => request<T>(endpoint)
  const post = <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'POST', body })
  const put = <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PUT', body })
  const del = <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' })

  return { get, post, put, del, isLoading, error }
}

// Usage Example
function UserList() {
  const { get, isLoading, error } = useAPI()
  const [users, setUsers] = useState([])

  useEffect(() => {
    get('/users').then(setUsers)
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
`
  }

  return `// REST API code for ${platform} - implement similar pattern`
}

// ============================================================================
// WEBSOCKET CODE GENERATION
// ============================================================================

function generateWebSocketCode(
  capsule: ConnectionCapsule,
  config: ConnectionConfig,
  platform: 'swift' | 'kotlin' | 'react' | 'tauri'
): string {
  if (platform === 'react') {
    return `
import { useEffect, useRef, useState, useCallback } from 'react'

interface WebSocketOptions {
  onMessage?: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  autoReconnect?: boolean
  reconnectInterval?: number
}

export function useWebSocket(url = '${config.baseUrl}', options: WebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<unknown>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    wsRef.current = new WebSocket(url)

    wsRef.current.onopen = () => {
      setIsConnected(true)
      options.onOpen?.()
    }

    wsRef.current.onclose = () => {
      setIsConnected(false)
      options.onClose?.()

      if (options.autoReconnect !== false) {
        reconnectTimeoutRef.current = setTimeout(
          connect,
          options.reconnectInterval || 3000
        )
      }
    }

    wsRef.current.onerror = (error) => {
      options.onError?.(error)
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
        options.onMessage?.(data)
      } catch {
        setLastMessage(event.data)
        options.onMessage?.(event.data)
      }
    }
  }, [url, options])

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimeoutRef.current)
    wsRef.current?.close()
  }, [])

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        typeof data === 'string' ? data : JSON.stringify(data)
      )
    }
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  return { isConnected, lastMessage, send, disconnect, reconnect: connect }
}

// Usage Example
function RealtimeChat() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')

  const { isConnected, send } = useWebSocket('ws://localhost:8080', {
    onMessage: (data) => {
      setMessages(prev => [...prev, data as string])
    }
  })

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className={\`w-2 h-2 rounded-full \${isConnected ? 'bg-green-500' : 'bg-red-500'}\`} />
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded">{msg}</div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={() => { send(input); setInput('') }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}
`
  }

  return `// WebSocket code for ${platform} - implement similar pattern`
}

// ============================================================================
// PROVIDER DETECTION
// ============================================================================

export function detectProvider(url: string): ConnectionType {
  if (url.includes('localhost:5123') || url.includes('supertonic')) {
    return 'supertonic-tts'
  }
  if (url.includes('localhost:1234') || url.includes('lmstudio')) {
    return 'lm-studio'
  }
  if (url.includes('localhost:11434') || url.includes('ollama')) {
    return 'ollama'
  }
  if (url.includes('openai.com')) {
    return 'openai-compatible'
  }
  if (url.includes('groq.com')) {
    return 'openai-compatible'
  }
  if (url.startsWith('ws://') || url.startsWith('wss://')) {
    return 'websocket'
  }
  return 'rest-api'
}

// ============================================================================
// CONNECTION TESTING
// ============================================================================

export async function testConnection(
  connection: Connection,
  config: ConnectionConfig
): Promise<{ success: boolean; message: string; latency?: number }> {
  const startTime = Date.now()
  const baseUrl = config.port
    ? `${config.baseUrl}:${config.port}`
    : config.baseUrl

  try {
    let testUrl = baseUrl

    switch (connection.type) {
      case 'supertonic-tts':
        testUrl = `${baseUrl}/voices`
        break
      case 'lm-studio':
      case 'ollama':
      case 'openai-compatible':
        testUrl = `${baseUrl}/models`
        break
      default:
        testUrl = baseUrl
    }

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: config.apiKey
        ? { Authorization: `Bearer ${config.apiKey}` }
        : {},
      signal: AbortSignal.timeout(config.timeout || 5000)
    })

    const latency = Date.now() - startTime

    if (response.ok) {
      return {
        success: true,
        message: `Connected successfully (${latency}ms)`,
        latency
      }
    } else {
      return {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`,
        latency
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed'
    }
  }
}
