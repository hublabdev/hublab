/**
 * HubLab AI Edge Capsules
 *
 * Capsulas especializadas para integrar modelos de IA locales (edge AI)
 * en micro-apps. Soporta Ollama, LM Studio, y APIs compatibles con OpenAI.
 *
 * Filosofía: "AI that respects privacy. Local first, always fast."
 */

// ============================================================================
// AI PROVIDER CONFIGURATIONS
// ============================================================================

export interface AIProvider {
  id: string
  name: string
  icon: string
  description: string
  defaultEndpoint: string
  features: string[]
  models: string[]
  requiresKey: boolean
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    icon: '🦙',
    description: 'Run LLMs locally on your Mac, Linux, or Windows',
    defaultEndpoint: 'http://localhost:11434',
    features: ['Local inference', 'No API key required', 'Privacy-first', 'Free'],
    models: ['llama3.2', 'llama3.1', 'mistral', 'gemma2', 'phi3', 'qwen2.5', 'deepseek-r1'],
    requiresKey: false
  },
  {
    id: 'lmstudio',
    name: 'LM Studio',
    icon: '🎬',
    description: 'Discover, download, and run local LLMs with a beautiful UI',
    defaultEndpoint: 'http://localhost:1234/v1',
    features: ['OpenAI-compatible API', 'Model management', 'GPU acceleration', 'Free'],
    models: ['llama-3.2-3b', 'mistral-7b', 'phi-3-mini', 'gemma-2b'],
    requiresKey: false
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    icon: '⚡',
    description: 'Ultra-fast inference with LPU technology',
    defaultEndpoint: 'https://api.groq.com/openai/v1',
    features: ['Blazing fast', 'Cloud-based', 'OpenAI compatible', 'Free tier'],
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    requiresKey: true
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI Compatible',
    icon: '🔌',
    description: 'Any OpenAI-compatible API endpoint',
    defaultEndpoint: '',
    features: ['Universal compatibility', 'Custom endpoints', 'Flexible'],
    models: [],
    requiresKey: true
  }
]

// ============================================================================
// AI CAPSULE TYPES
// ============================================================================

export interface AICapsuleConfig {
  id: string
  name: string
  icon: string
  category: 'ai-edge'
  description: string
  longDescription: string
  platforms: string[]
  defaultProps: Record<string, unknown>
  capabilities: string[]
}

export const AI_EDGE_CAPSULES: AICapsuleConfig[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // CHAT & CONVERSATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-chat-local',
    name: 'AI Chat (Local)',
    icon: '🦙',
    category: 'ai-edge',
    description: 'Chat interface with local AI models',
    longDescription: 'A complete chat interface that connects to local AI models via Ollama or LM Studio. Perfect for private, offline-capable AI assistants.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['text-generation', 'conversation', 'offline'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      systemPrompt: 'You are a helpful assistant.',
      placeholder: 'Type your message...',
      welcomeMessage: 'Hello! How can I help you today?',
      maxTokens: 2048,
      temperature: 0.7,
      streamResponse: true,
      saveHistory: true
    }
  },
  {
    id: 'ai-assistant-widget',
    name: 'AI Assistant Widget',
    icon: '💬',
    category: 'ai-edge',
    description: 'Floating AI assistant button',
    longDescription: 'A floating button that opens an AI chat overlay. Non-intrusive way to add AI assistance to any app.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['text-generation', 'floating-ui'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      position: 'bottom-right',
      buttonText: 'Ask AI',
      buttonIcon: '✨',
      accentColor: '#8B5CF6',
      systemPrompt: 'You are a helpful assistant embedded in an app.',
      expanded: false
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SMART INPUT & SUGGESTIONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-autocomplete',
    name: 'AI Autocomplete',
    icon: '✨',
    category: 'ai-edge',
    description: 'Smart text completion with AI',
    longDescription: 'An input field with AI-powered autocomplete suggestions. Great for forms, search, and creative writing.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['text-completion', 'suggestions'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      placeholder: 'Start typing...',
      triggerKey: 'Tab',
      showSuggestionAfter: 3, // characters
      maxSuggestions: 3,
      context: '',
      debounceMs: 300
    }
  },
  {
    id: 'ai-smart-input',
    name: 'Smart Input',
    icon: '🧠',
    category: 'ai-edge',
    description: 'Input with AI enhancement options',
    longDescription: 'Text input with AI-powered tools: improve writing, fix grammar, translate, summarize.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['text-enhancement', 'grammar', 'translation'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      placeholder: 'Write something...',
      showToolbar: true,
      tools: ['improve', 'grammar', 'shorter', 'longer', 'translate'],
      targetLanguage: 'en'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONTENT GENERATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-content-generator',
    name: 'Content Generator',
    icon: '📝',
    category: 'ai-edge',
    description: 'Generate text content with AI',
    longDescription: 'Generate blog posts, emails, product descriptions, and more. Choose templates or write custom prompts.',
    platforms: ['web', 'desktop'],
    capabilities: ['content-generation', 'templates'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      contentType: 'blog-post',
      tone: 'professional',
      length: 'medium',
      customPrompt: '',
      outputFormat: 'markdown'
    }
  },
  {
    id: 'ai-summarizer',
    name: 'Text Summarizer',
    icon: '📋',
    category: 'ai-edge',
    description: 'Summarize long text with AI',
    longDescription: 'Paste long articles, documents, or text and get concise summaries. Choose summary length and style.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['summarization', 'text-analysis'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      summaryLength: 'short', // short, medium, detailed
      bulletPoints: false,
      extractKeyPoints: true,
      maxInputLength: 10000
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ANALYSIS & UNDERSTANDING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-sentiment-analyzer',
    name: 'Sentiment Analyzer',
    icon: '😊',
    category: 'ai-edge',
    description: 'Analyze text sentiment locally',
    longDescription: 'Analyze the emotional tone of text - positive, negative, neutral. With confidence scores and emotional breakdown.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['sentiment-analysis', 'text-analysis'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      showScore: true,
      showEmoji: true,
      showBreakdown: true, // joy, anger, sadness, etc.
      realtime: false
    }
  },
  {
    id: 'ai-classifier',
    name: 'Text Classifier',
    icon: '🏷️',
    category: 'ai-edge',
    description: 'Classify text into categories',
    longDescription: 'Automatically categorize text into predefined or custom categories. Great for sorting feedback, tickets, content.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['classification', 'categorization'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      categories: 'Question,Bug Report,Feature Request,Praise,Complaint',
      multiLabel: false,
      showConfidence: true
    }
  },
  {
    id: 'ai-entity-extractor',
    name: 'Entity Extractor',
    icon: '🔍',
    category: 'ai-edge',
    description: 'Extract entities from text',
    longDescription: 'Automatically identify and extract people, places, dates, companies, products from text.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['entity-extraction', 'ner'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      entityTypes: 'person,organization,location,date,money,product',
      highlightEntities: true,
      groupByType: true
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // VOICE & AUDIO
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-voice-chat',
    name: 'Voice Chat',
    icon: '🎤',
    category: 'ai-edge',
    description: 'Talk to AI with your voice',
    longDescription: 'Voice-to-voice conversation with AI. Uses browser speech recognition and text-to-speech for natural interaction.',
    platforms: ['web', 'ios', 'android'],
    capabilities: ['voice-input', 'voice-output', 'conversation'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      inputLanguage: 'en-US',
      outputVoice: 'default',
      autoListen: false,
      showTranscript: true,
      systemPrompt: 'You are a voice assistant. Keep responses brief and conversational.'
    }
  },
  {
    id: 'ai-transcription',
    name: 'Audio Transcription',
    icon: '📝',
    category: 'ai-edge',
    description: 'Transcribe audio to text',
    longDescription: 'Convert spoken audio to written text using browser APIs. Works offline on supported devices.',
    platforms: ['web', 'ios', 'android'],
    capabilities: ['transcription', 'speech-to-text'],
    defaultProps: {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      showTimestamps: false,
      autoSave: false
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSLATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-translator-local',
    name: 'AI Translator (Local)',
    icon: '🌐',
    category: 'ai-edge',
    description: 'Translate text with local AI',
    longDescription: 'Translate text between languages using local AI models. No cloud APIs, complete privacy.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['translation', 'multilingual'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      sourceLanguage: 'auto',
      targetLanguage: 'en',
      preserveFormatting: true,
      showOriginal: true
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CODE & TECHNICAL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-code-assistant',
    name: 'Code Assistant',
    icon: '💻',
    category: 'ai-edge',
    description: 'AI help for coding',
    longDescription: 'Get code explanations, generate snippets, fix bugs. Optimized for programming assistance.',
    platforms: ['web', 'desktop'],
    capabilities: ['code-generation', 'code-explanation'],
    defaultProps: {
      provider: 'ollama',
      model: 'deepseek-r1',
      endpoint: 'http://localhost:11434',
      language: 'javascript',
      showLineNumbers: true,
      syntaxHighlighting: true,
      actions: ['explain', 'generate', 'fix', 'optimize', 'convert']
    }
  },
  {
    id: 'ai-json-generator',
    name: 'JSON Generator',
    icon: '📊',
    category: 'ai-edge',
    description: 'Generate JSON from descriptions',
    longDescription: 'Describe the data structure you need and AI generates valid JSON. Perfect for API mocking and prototyping.',
    platforms: ['web', 'desktop'],
    capabilities: ['json-generation', 'data-generation'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      schema: '',
      examples: 3,
      validate: true
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CREATIVE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-idea-generator',
    name: 'Idea Generator',
    icon: '💡',
    category: 'ai-edge',
    description: 'Brainstorm ideas with AI',
    longDescription: 'Get creative ideas, names, concepts. Perfect for brainstorming product names, features, content ideas.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['ideation', 'creativity'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      ideaType: 'general', // names, features, content, business
      quantity: 5,
      creativity: 'balanced', // conservative, balanced, creative, wild
      context: ''
    }
  },
  {
    id: 'ai-story-writer',
    name: 'Story Writer',
    icon: '📖',
    category: 'ai-edge',
    description: 'Collaborative story writing',
    longDescription: 'Write stories together with AI. You write a part, AI continues. Great for creative writing and education.',
    platforms: ['web', 'ios', 'android', 'desktop'],
    capabilities: ['creative-writing', 'storytelling'],
    defaultProps: {
      provider: 'ollama',
      model: 'llama3.2',
      endpoint: 'http://localhost:11434',
      genre: 'general',
      style: 'narrative',
      continuationLength: 'paragraph',
      saveProgress: true
    }
  }
]

// ============================================================================
// AI TEMPLATES - Pre-configured AI mini-apps
// ============================================================================

export interface AITemplate {
  id: string
  name: string
  icon: string
  description: string
  capsules: string[] // IDs of AI capsules used
  systemPrompt: string
  category: 'assistant' | 'creative' | 'productivity' | 'technical'
}

export const AI_TEMPLATES: AITemplate[] = [
  {
    id: 'personal-ai-assistant',
    name: 'Personal AI Assistant',
    icon: '🤖',
    description: 'Your private AI assistant that runs entirely on your device',
    capsules: ['ai-chat-local', 'ai-voice-chat'],
    systemPrompt: 'You are a helpful personal assistant. Be concise, friendly, and proactive in offering help.',
    category: 'assistant'
  },
  {
    id: 'writing-coach',
    name: 'Writing Coach',
    icon: '✍️',
    description: 'AI that helps you write better emails, posts, and documents',
    capsules: ['ai-smart-input', 'ai-content-generator'],
    systemPrompt: 'You are a writing coach. Help users improve their writing, suggest better phrasing, and maintain their voice.',
    category: 'creative'
  },
  {
    id: 'code-buddy',
    name: 'Code Buddy',
    icon: '👨‍💻',
    description: 'Local AI for coding help - explain, generate, debug',
    capsules: ['ai-code-assistant', 'ai-chat-local'],
    systemPrompt: 'You are a senior developer. Help with code questions, debugging, and best practices. Use code examples.',
    category: 'technical'
  },
  {
    id: 'language-tutor',
    name: 'Language Tutor',
    icon: '🗣️',
    description: 'Practice conversations in any language with AI',
    capsules: ['ai-voice-chat', 'ai-translator-local'],
    systemPrompt: 'You are a patient language tutor. Help users practice conversation, correct mistakes gently, explain grammar.',
    category: 'assistant'
  },
  {
    id: 'idea-machine',
    name: 'Idea Machine',
    icon: '🧠',
    description: 'Brainstorm and develop ideas with AI',
    capsules: ['ai-idea-generator', 'ai-chat-local'],
    systemPrompt: 'You are a creative brainstorming partner. Generate ideas, build on user suggestions, think outside the box.',
    category: 'creative'
  },
  {
    id: 'feedback-analyzer',
    name: 'Feedback Analyzer',
    icon: '📊',
    description: 'Analyze customer feedback sentiment and categories',
    capsules: ['ai-sentiment-analyzer', 'ai-classifier', 'ai-entity-extractor'],
    systemPrompt: 'You analyze feedback. Identify sentiment, categorize issues, extract key entities and themes.',
    category: 'productivity'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAICapsuleById(id: string): AICapsuleConfig | undefined {
  return AI_EDGE_CAPSULES.find(c => c.id === id)
}

export function getAIProviderById(id: string): AIProvider | undefined {
  return AI_PROVIDERS.find(p => p.id === id)
}

export function getAITemplateById(id: string): AITemplate | undefined {
  return AI_TEMPLATES.find(t => t.id === id)
}

export function getAICapsulesByCapability(capability: string): AICapsuleConfig[] {
  return AI_EDGE_CAPSULES.filter(c => c.capabilities.includes(capability))
}

// ============================================================================
// AI CLIENT - For connecting to local AI
// ============================================================================

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIClientOptions {
  provider: string
  endpoint: string
  model: string
  apiKey?: string
}

export async function sendAIMessage(
  messages: AIMessage[],
  options: AIClientOptions,
  onStream?: (chunk: string) => void
): Promise<string> {
  const { provider, endpoint, model, apiKey } = options

  // Build the request based on provider
  let url = ''
  let headers: Record<string, string> = { 'Content-Type': 'application/json' }
  let body: Record<string, unknown> = {}

  switch (provider) {
    case 'ollama':
      url = `${endpoint}/api/chat`
      body = {
        model,
        messages,
        stream: !!onStream
      }
      break

    case 'lmstudio':
    case 'groq':
    case 'openai-compatible':
      url = `${endpoint}/chat/completions`
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }
      body = {
        model,
        messages,
        stream: !!onStream
      }
      break

    default:
      throw new Error(`Unknown provider: ${provider}`)
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.statusText}`)
  }

  // Handle streaming response
  if (onStream && response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        try {
          // Ollama format
          if (provider === 'ollama') {
            const data = JSON.parse(line)
            if (data.message?.content) {
              fullResponse += data.message.content
              onStream(data.message.content)
            }
          }
          // OpenAI-compatible format
          else if (line.startsWith('data: ')) {
            const json = line.slice(6)
            if (json === '[DONE]') continue
            const data = JSON.parse(json)
            const content = data.choices?.[0]?.delta?.content || ''
            if (content) {
              fullResponse += content
              onStream(content)
            }
          }
        } catch {
          // Ignore parse errors in streaming
        }
      }
    }

    return fullResponse
  }

  // Handle non-streaming response
  const data = await response.json()

  // Ollama format
  if (provider === 'ollama') {
    return data.message?.content || ''
  }

  // OpenAI-compatible format
  return data.choices?.[0]?.message?.content || ''
}
