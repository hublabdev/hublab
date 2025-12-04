/**
 * HubLab Universal Connectors
 *
 * Connect your app to any AI service, storage, or data source.
 * One interface, infinite possibilities.
 *
 * Philosophy: "Build once, connect anywhere."
 */

// ============================================================================
// AI PROVIDERS - Complete list of supported AI services
// ============================================================================

export interface AIProvider {
  id: string
  name: string
  icon: string
  type: 'cloud' | 'local' | 'edge'
  capabilities: AICapability[]
  models: AIModel[]
  authType: 'api-key' | 'oauth' | 'none'
  baseUrl: string
  docsUrl: string
  pricing: 'free' | 'freemium' | 'paid'
}

export type AICapability =
  | 'chat'
  | 'completion'
  | 'embeddings'
  | 'images'
  | 'vision'
  | 'audio'
  | 'tts'
  | 'stt'
  | 'code'
  | 'function-calling'
  | 'streaming'
  | 'rag'

export interface AIModel {
  id: string
  name: string
  contextWindow: number
  maxOutput: number
  capabilities: AICapability[]
  pricing?: { input: number; output: number } // per 1M tokens
}

export const AI_PROVIDERS: AIProvider[] = [
  // ===================== CLOUD AI PROVIDERS =====================
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🌐',
    type: 'cloud',
    capabilities: ['chat', 'completion', 'embeddings', 'images', 'vision', 'tts', 'stt', 'code', 'function-calling', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.openai.com/v1',
    docsUrl: 'https://platform.openai.com/docs',
    pricing: 'paid',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000, maxOutput: 16384, capabilities: ['chat', 'vision', 'function-calling', 'streaming'], pricing: { input: 2.5, output: 10 } },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', contextWindow: 128000, maxOutput: 16384, capabilities: ['chat', 'vision', 'function-calling', 'streaming'], pricing: { input: 0.15, output: 0.6 } },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextWindow: 128000, maxOutput: 4096, capabilities: ['chat', 'vision', 'function-calling', 'streaming'], pricing: { input: 10, output: 30 } },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16385, maxOutput: 4096, capabilities: ['chat', 'function-calling', 'streaming'], pricing: { input: 0.5, output: 1.5 } },
      { id: 'text-embedding-3-large', name: 'Embedding Large', contextWindow: 8191, maxOutput: 3072, capabilities: ['embeddings'], pricing: { input: 0.13, output: 0 } },
      { id: 'text-embedding-3-small', name: 'Embedding Small', contextWindow: 8191, maxOutput: 1536, capabilities: ['embeddings'], pricing: { input: 0.02, output: 0 } },
      { id: 'dall-e-3', name: 'DALL-E 3', contextWindow: 4000, maxOutput: 1, capabilities: ['images'] },
      { id: 'whisper-1', name: 'Whisper', contextWindow: 0, maxOutput: 0, capabilities: ['stt'] },
      { id: 'tts-1', name: 'TTS', contextWindow: 4096, maxOutput: 0, capabilities: ['tts'] },
      { id: 'tts-1-hd', name: 'TTS HD', contextWindow: 4096, maxOutput: 0, capabilities: ['tts'] },
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🎭',
    type: 'cloud',
    capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.anthropic.com/v1',
    docsUrl: 'https://docs.anthropic.com',
    pricing: 'paid',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', contextWindow: 200000, maxOutput: 64000, capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'], pricing: { input: 3, output: 15 } },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', contextWindow: 200000, maxOutput: 8192, capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'], pricing: { input: 3, output: 15 } },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', contextWindow: 200000, maxOutput: 8192, capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'], pricing: { input: 0.8, output: 4 } },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', contextWindow: 200000, maxOutput: 4096, capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'], pricing: { input: 15, output: 75 } },
    ]
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: '🔷',
    type: 'cloud',
    capabilities: ['chat', 'vision', 'embeddings', 'code', 'function-calling', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    docsUrl: 'https://ai.google.dev/docs',
    pricing: 'freemium',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', contextWindow: 1000000, maxOutput: 8192, capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'], pricing: { input: 0.075, output: 0.3 } },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', contextWindow: 2000000, maxOutput: 8192, capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'], pricing: { input: 1.25, output: 5 } },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', contextWindow: 1000000, maxOutput: 8192, capabilities: ['chat', 'vision', 'code', 'function-calling', 'streaming'], pricing: { input: 0.075, output: 0.3 } },
      { id: 'text-embedding-004', name: 'Embedding', contextWindow: 2048, maxOutput: 768, capabilities: ['embeddings'] },
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    type: 'cloud',
    capabilities: ['chat', 'code', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.groq.com/openai/v1',
    docsUrl: 'https://console.groq.com/docs',
    pricing: 'freemium',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', contextWindow: 128000, maxOutput: 32768, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 0.59, output: 0.79 } },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', contextWindow: 128000, maxOutput: 8000, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 0.05, output: 0.08 } },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', contextWindow: 32768, maxOutput: 32768, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 0.24, output: 0.24 } },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', contextWindow: 8192, maxOutput: 8192, capabilities: ['chat', 'streaming'], pricing: { input: 0.2, output: 0.2 } },
    ]
  },
  {
    id: 'together',
    name: 'Together AI',
    icon: '🤝',
    type: 'cloud',
    capabilities: ['chat', 'completion', 'embeddings', 'images', 'code', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.together.xyz/v1',
    docsUrl: 'https://docs.together.ai',
    pricing: 'paid',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', name: 'Llama 3.3 70B Turbo', contextWindow: 128000, maxOutput: 4096, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 0.88, output: 0.88 } },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B', contextWindow: 32768, maxOutput: 4096, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 1.2, output: 1.2 } },
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3', contextWindow: 64000, maxOutput: 8192, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 0.9, output: 0.9 } },
      { id: 'black-forest-labs/FLUX.1-schnell', name: 'FLUX Schnell', contextWindow: 0, maxOutput: 1, capabilities: ['images'] },
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌊',
    type: 'cloud',
    capabilities: ['chat', 'embeddings', 'code', 'function-calling', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.mistral.ai/v1',
    docsUrl: 'https://docs.mistral.ai',
    pricing: 'paid',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', contextWindow: 128000, maxOutput: 8192, capabilities: ['chat', 'code', 'function-calling', 'streaming'], pricing: { input: 2, output: 6 } },
      { id: 'mistral-medium-latest', name: 'Mistral Medium', contextWindow: 32000, maxOutput: 8192, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 2.7, output: 8.1 } },
      { id: 'mistral-small-latest', name: 'Mistral Small', contextWindow: 32000, maxOutput: 8192, capabilities: ['chat', 'code', 'streaming'], pricing: { input: 0.2, output: 0.6 } },
      { id: 'codestral-latest', name: 'Codestral', contextWindow: 32000, maxOutput: 8192, capabilities: ['code', 'streaming'], pricing: { input: 0.2, output: 0.6 } },
      { id: 'mistral-embed', name: 'Mistral Embed', contextWindow: 8192, maxOutput: 1024, capabilities: ['embeddings'], pricing: { input: 0.1, output: 0 } },
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🔮',
    type: 'cloud',
    capabilities: ['chat', 'embeddings', 'rag', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.cohere.ai/v1',
    docsUrl: 'https://docs.cohere.com',
    pricing: 'freemium',
    models: [
      { id: 'command-r-plus', name: 'Command R+', contextWindow: 128000, maxOutput: 4096, capabilities: ['chat', 'rag', 'streaming'], pricing: { input: 2.5, output: 10 } },
      { id: 'command-r', name: 'Command R', contextWindow: 128000, maxOutput: 4096, capabilities: ['chat', 'rag', 'streaming'], pricing: { input: 0.15, output: 0.6 } },
      { id: 'embed-english-v3.0', name: 'Embed English v3', contextWindow: 512, maxOutput: 1024, capabilities: ['embeddings'], pricing: { input: 0.1, output: 0 } },
      { id: 'embed-multilingual-v3.0', name: 'Embed Multilingual v3', contextWindow: 512, maxOutput: 1024, capabilities: ['embeddings'], pricing: { input: 0.1, output: 0 } },
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: '🔍',
    type: 'cloud',
    capabilities: ['chat', 'rag', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.perplexity.ai',
    docsUrl: 'https://docs.perplexity.ai',
    pricing: 'paid',
    models: [
      { id: 'llama-3.1-sonar-huge-128k-online', name: 'Sonar Huge Online', contextWindow: 128000, maxOutput: 8192, capabilities: ['chat', 'rag', 'streaming'], pricing: { input: 5, output: 5 } },
      { id: 'llama-3.1-sonar-large-128k-online', name: 'Sonar Large Online', contextWindow: 128000, maxOutput: 8192, capabilities: ['chat', 'rag', 'streaming'], pricing: { input: 1, output: 1 } },
      { id: 'llama-3.1-sonar-small-128k-online', name: 'Sonar Small Online', contextWindow: 128000, maxOutput: 8192, capabilities: ['chat', 'rag', 'streaming'], pricing: { input: 0.2, output: 0.2 } },
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🌊',
    type: 'cloud',
    capabilities: ['chat', 'code', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.deepseek.com',
    docsUrl: 'https://platform.deepseek.com/docs',
    pricing: 'paid',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', contextWindow: 64000, maxOutput: 8192, capabilities: ['chat', 'streaming'], pricing: { input: 0.14, output: 0.28 } },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', contextWindow: 64000, maxOutput: 8192, capabilities: ['code', 'streaming'], pricing: { input: 0.14, output: 0.28 } },
    ]
  },
  {
    id: 'replicate',
    name: 'Replicate',
    icon: '🔁',
    type: 'cloud',
    capabilities: ['chat', 'images', 'audio', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.replicate.com/v1',
    docsUrl: 'https://replicate.com/docs',
    pricing: 'paid',
    models: [
      { id: 'meta/llama-2-70b-chat', name: 'Llama 2 70B', contextWindow: 4096, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
      { id: 'stability-ai/sdxl', name: 'SDXL', contextWindow: 0, maxOutput: 1, capabilities: ['images'] },
      { id: 'lucataco/flux-dev-lora', name: 'FLUX LoRA', contextWindow: 0, maxOutput: 1, capabilities: ['images'] },
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: '🤗',
    type: 'cloud',
    capabilities: ['chat', 'embeddings', 'images', 'audio', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api-inference.huggingface.co',
    docsUrl: 'https://huggingface.co/docs/api-inference',
    pricing: 'freemium',
    models: [
      { id: 'meta-llama/Meta-Llama-3-8B-Instruct', name: 'Llama 3 8B', contextWindow: 8192, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
      { id: 'sentence-transformers/all-MiniLM-L6-v2', name: 'MiniLM Embeddings', contextWindow: 512, maxOutput: 384, capabilities: ['embeddings'] },
    ]
  },
  {
    id: 'xai',
    name: 'xAI',
    icon: '✖️',
    type: 'cloud',
    capabilities: ['chat', 'vision', 'function-calling', 'streaming'],
    authType: 'api-key',
    baseUrl: 'https://api.x.ai/v1',
    docsUrl: 'https://docs.x.ai',
    pricing: 'paid',
    models: [
      { id: 'grok-2', name: 'Grok 2', contextWindow: 128000, maxOutput: 8192, capabilities: ['chat', 'vision', 'function-calling', 'streaming'], pricing: { input: 2, output: 10 } },
      { id: 'grok-2-mini', name: 'Grok 2 Mini', contextWindow: 128000, maxOutput: 8192, capabilities: ['chat', 'vision', 'streaming'], pricing: { input: 0.2, output: 1 } },
    ]
  },
  // ===================== LOCAL AI PROVIDERS =====================
  {
    id: 'ollama',
    name: 'Ollama',
    icon: '🦙',
    type: 'local',
    capabilities: ['chat', 'embeddings', 'vision', 'code', 'streaming'],
    authType: 'none',
    baseUrl: 'http://localhost:11434',
    docsUrl: 'https://ollama.ai',
    pricing: 'free',
    models: [
      { id: 'llama3.2', name: 'Llama 3.2', contextWindow: 128000, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
      { id: 'llama3.2-vision', name: 'Llama 3.2 Vision', contextWindow: 128000, maxOutput: 4096, capabilities: ['chat', 'vision', 'streaming'] },
      { id: 'codellama', name: 'Code Llama', contextWindow: 16000, maxOutput: 4096, capabilities: ['code', 'streaming'] },
      { id: 'mistral', name: 'Mistral', contextWindow: 32000, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
      { id: 'mixtral', name: 'Mixtral', contextWindow: 32000, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
      { id: 'phi3', name: 'Phi 3', contextWindow: 4096, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
      { id: 'qwen2.5', name: 'Qwen 2.5', contextWindow: 32000, maxOutput: 4096, capabilities: ['chat', 'code', 'streaming'] },
      { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', contextWindow: 64000, maxOutput: 4096, capabilities: ['code', 'streaming'] },
      { id: 'nomic-embed-text', name: 'Nomic Embed', contextWindow: 8192, maxOutput: 768, capabilities: ['embeddings'] },
      { id: 'mxbai-embed-large', name: 'MxBai Embed', contextWindow: 512, maxOutput: 1024, capabilities: ['embeddings'] },
    ]
  },
  {
    id: 'lmstudio',
    name: 'LM Studio',
    icon: '🧠',
    type: 'local',
    capabilities: ['chat', 'embeddings', 'code', 'streaming'],
    authType: 'none',
    baseUrl: 'http://localhost:1234/v1',
    docsUrl: 'https://lmstudio.ai/docs',
    pricing: 'free',
    models: [
      { id: 'local-model', name: 'Local Model', contextWindow: 4096, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
    ]
  },
  {
    id: 'llamacpp',
    name: 'llama.cpp',
    icon: '🦙',
    type: 'local',
    capabilities: ['chat', 'embeddings', 'streaming'],
    authType: 'none',
    baseUrl: 'http://localhost:8080',
    docsUrl: 'https://github.com/ggerganov/llama.cpp',
    pricing: 'free',
    models: [
      { id: 'gguf-model', name: 'GGUF Model', contextWindow: 4096, maxOutput: 4096, capabilities: ['chat', 'streaming'] },
    ]
  },
  {
    id: 'supertonic',
    name: 'Supertonic TTS',
    icon: '🔊',
    type: 'local',
    capabilities: ['tts'],
    authType: 'none',
    baseUrl: 'http://localhost:5123',
    docsUrl: 'https://github.com/anthropics/supertonic',
    pricing: 'free',
    models: [
      { id: 'kokoro', name: 'Kokoro', contextWindow: 0, maxOutput: 0, capabilities: ['tts'] },
      { id: 'piper', name: 'Piper', contextWindow: 0, maxOutput: 0, capabilities: ['tts'] },
    ]
  },
  {
    id: 'whisper-local',
    name: 'Whisper Local',
    icon: '🎤',
    type: 'local',
    capabilities: ['stt'],
    authType: 'none',
    baseUrl: 'http://localhost:9000',
    docsUrl: 'https://github.com/openai/whisper',
    pricing: 'free',
    models: [
      { id: 'whisper-tiny', name: 'Whisper Tiny', contextWindow: 0, maxOutput: 0, capabilities: ['stt'] },
      { id: 'whisper-base', name: 'Whisper Base', contextWindow: 0, maxOutput: 0, capabilities: ['stt'] },
      { id: 'whisper-large', name: 'Whisper Large', contextWindow: 0, maxOutput: 0, capabilities: ['stt'] },
    ]
  },
]

// ============================================================================
// STORAGE CONNECTORS
// ============================================================================

export interface StorageProvider {
  id: string
  name: string
  icon: string
  type: 'cloud' | 'local' | 'database'
  capabilities: StorageCapability[]
  authType: 'oauth' | 'api-key' | 'connection-string' | 'none'
  docsUrl: string
}

export type StorageCapability =
  | 'files'
  | 'folders'
  | 'sharing'
  | 'sync'
  | 'versioning'
  | 'search'
  | 'realtime'
  | 'vector-search'

export const STORAGE_PROVIDERS: StorageProvider[] = [
  // Cloud Storage
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '📁',
    type: 'cloud',
    capabilities: ['files', 'folders', 'sharing', 'sync', 'versioning', 'search'],
    authType: 'oauth',
    docsUrl: 'https://developers.google.com/drive'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    type: 'cloud',
    capabilities: ['files', 'folders', 'sharing', 'sync', 'versioning'],
    authType: 'oauth',
    docsUrl: 'https://www.dropbox.com/developers'
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    type: 'cloud',
    capabilities: ['files', 'folders', 'sharing', 'sync', 'versioning'],
    authType: 'oauth',
    docsUrl: 'https://learn.microsoft.com/onedrive/developer'
  },
  {
    id: 's3',
    name: 'AWS S3',
    icon: '🪣',
    type: 'cloud',
    capabilities: ['files', 'folders', 'versioning'],
    authType: 'api-key',
    docsUrl: 'https://docs.aws.amazon.com/s3'
  },
  {
    id: 'gcs',
    name: 'Google Cloud Storage',
    icon: '🌩️',
    type: 'cloud',
    capabilities: ['files', 'folders', 'versioning'],
    authType: 'api-key',
    docsUrl: 'https://cloud.google.com/storage/docs'
  },
  {
    id: 'cloudflare-r2',
    name: 'Cloudflare R2',
    icon: '🟠',
    type: 'cloud',
    capabilities: ['files', 'folders'],
    authType: 'api-key',
    docsUrl: 'https://developers.cloudflare.com/r2'
  },
  // Vector Databases for RAG
  {
    id: 'pinecone',
    name: 'Pinecone',
    icon: '🌲',
    type: 'database',
    capabilities: ['vector-search', 'realtime'],
    authType: 'api-key',
    docsUrl: 'https://docs.pinecone.io'
  },
  {
    id: 'weaviate',
    name: 'Weaviate',
    icon: '🔷',
    type: 'database',
    capabilities: ['vector-search', 'search', 'realtime'],
    authType: 'api-key',
    docsUrl: 'https://weaviate.io/developers/weaviate'
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    icon: '🔶',
    type: 'database',
    capabilities: ['vector-search', 'search'],
    authType: 'api-key',
    docsUrl: 'https://qdrant.tech/documentation'
  },
  {
    id: 'chroma',
    name: 'ChromaDB',
    icon: '🎨',
    type: 'database',
    capabilities: ['vector-search'],
    authType: 'none',
    docsUrl: 'https://docs.trychroma.com'
  },
  {
    id: 'supabase-vector',
    name: 'Supabase Vector',
    icon: '⚡',
    type: 'database',
    capabilities: ['vector-search', 'realtime', 'search'],
    authType: 'api-key',
    docsUrl: 'https://supabase.com/docs/guides/ai'
  },
  {
    id: 'pgvector',
    name: 'pgvector',
    icon: '🐘',
    type: 'database',
    capabilities: ['vector-search', 'search'],
    authType: 'connection-string',
    docsUrl: 'https://github.com/pgvector/pgvector'
  },
]

// ============================================================================
// RAG (Retrieval Augmented Generation) SYSTEM
// ============================================================================

export interface RAGConfig {
  id: string
  name: string
  description: string
  vectorStore: string
  embeddingProvider: string
  embeddingModel: string
  chatProvider: string
  chatModel: string
  chunkSize: number
  chunkOverlap: number
  topK: number
}

export const RAG_PRESETS: RAGConfig[] = [
  {
    id: 'basic-openai',
    name: 'Basic OpenAI RAG',
    description: 'Simple RAG with OpenAI embeddings and GPT-4o',
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    embeddingModel: 'text-embedding-3-small',
    chatProvider: 'openai',
    chatModel: 'gpt-4o-mini',
    chunkSize: 1000,
    chunkOverlap: 200,
    topK: 5
  },
  {
    id: 'local-ollama',
    name: 'Local Ollama RAG',
    description: 'Fully local RAG with Ollama and ChromaDB',
    vectorStore: 'chroma',
    embeddingProvider: 'ollama',
    embeddingModel: 'nomic-embed-text',
    chatProvider: 'ollama',
    chatModel: 'llama3.2',
    chunkSize: 500,
    chunkOverlap: 100,
    topK: 3
  },
  {
    id: 'hybrid-cohere',
    name: 'Hybrid Cohere RAG',
    description: 'Cohere with native RAG support',
    vectorStore: 'weaviate',
    embeddingProvider: 'cohere',
    embeddingModel: 'embed-english-v3.0',
    chatProvider: 'cohere',
    chatModel: 'command-r-plus',
    chunkSize: 800,
    chunkOverlap: 150,
    topK: 7
  },
  {
    id: 'supabase-full',
    name: 'Supabase Full Stack',
    description: 'Supabase pgvector with any chat model',
    vectorStore: 'supabase-vector',
    embeddingProvider: 'openai',
    embeddingModel: 'text-embedding-3-small',
    chatProvider: 'anthropic',
    chatModel: 'claude-sonnet-4-20250514',
    chunkSize: 1000,
    chunkOverlap: 200,
    topK: 5
  },
]

// ============================================================================
// CONNECTOR CAPSULES
// ============================================================================

export interface ConnectorCapsule {
  id: string
  name: string
  icon: string
  category: string
  description: string
  provider?: string
  defaultConfig: Record<string, unknown>
}

export const CONNECTOR_CAPSULES: ConnectorCapsule[] = [
  // AI Chat Connectors
  { id: 'chat-openai', name: 'OpenAI Chat', icon: '🌐', category: 'AI Chat', description: 'Chat with GPT models', provider: 'openai', defaultConfig: { model: 'gpt-4o-mini', temperature: 0.7, streaming: true } },
  { id: 'chat-anthropic', name: 'Claude Chat', icon: '🎭', category: 'AI Chat', description: 'Chat with Claude models', provider: 'anthropic', defaultConfig: { model: 'claude-sonnet-4-20250514', temperature: 0.7, streaming: true } },
  { id: 'chat-google', name: 'Gemini Chat', icon: '🔷', category: 'AI Chat', description: 'Chat with Gemini models', provider: 'google', defaultConfig: { model: 'gemini-2.0-flash', temperature: 0.7, streaming: true } },
  { id: 'chat-groq', name: 'Groq Chat', icon: '⚡', category: 'AI Chat', description: 'Ultra-fast inference with Groq', provider: 'groq', defaultConfig: { model: 'llama-3.3-70b-versatile', temperature: 0.7, streaming: true } },
  { id: 'chat-mistral', name: 'Mistral Chat', icon: '🌊', category: 'AI Chat', description: 'Chat with Mistral models', provider: 'mistral', defaultConfig: { model: 'mistral-large-latest', temperature: 0.7, streaming: true } },
  { id: 'chat-cohere', name: 'Cohere Chat', icon: '🔮', category: 'AI Chat', description: 'Chat with Command models', provider: 'cohere', defaultConfig: { model: 'command-r-plus', temperature: 0.7, streaming: true } },
  { id: 'chat-perplexity', name: 'Perplexity Chat', icon: '🔍', category: 'AI Chat', description: 'Chat with web search', provider: 'perplexity', defaultConfig: { model: 'llama-3.1-sonar-large-128k-online', temperature: 0.7, streaming: true } },
  { id: 'chat-xai', name: 'Grok Chat', icon: '✖️', category: 'AI Chat', description: 'Chat with Grok', provider: 'xai', defaultConfig: { model: 'grok-2', temperature: 0.7, streaming: true } },
  { id: 'chat-ollama', name: 'Ollama Chat', icon: '🦙', category: 'AI Chat', description: 'Local Ollama chat', provider: 'ollama', defaultConfig: { model: 'llama3.2', temperature: 0.7, streaming: true } },
  { id: 'chat-lmstudio', name: 'LM Studio Chat', icon: '🧠', category: 'AI Chat', description: 'Local LM Studio chat', provider: 'lmstudio', defaultConfig: { model: 'local-model', temperature: 0.7, streaming: true } },

  // Voice & Audio
  { id: 'tts-openai', name: 'OpenAI TTS', icon: '🔊', category: 'Voice', description: 'Text to speech with OpenAI', provider: 'openai', defaultConfig: { model: 'tts-1', voice: 'alloy' } },
  { id: 'tts-supertonic', name: 'Supertonic TTS', icon: '🔊', category: 'Voice', description: 'Local high-quality TTS', provider: 'supertonic', defaultConfig: { voice: 'default', speed: 1.0 } },
  { id: 'stt-openai', name: 'OpenAI Whisper', icon: '🎤', category: 'Voice', description: 'Speech to text with Whisper', provider: 'openai', defaultConfig: { model: 'whisper-1' } },
  { id: 'stt-local', name: 'Local Whisper', icon: '🎤', category: 'Voice', description: 'Local speech to text', provider: 'whisper-local', defaultConfig: { model: 'whisper-base' } },

  // Image Generation
  { id: 'image-dalle', name: 'DALL-E', icon: '🎨', category: 'Images', description: 'Generate images with DALL-E', provider: 'openai', defaultConfig: { model: 'dall-e-3', size: '1024x1024' } },
  { id: 'image-flux', name: 'FLUX', icon: '🌊', category: 'Images', description: 'Generate images with FLUX', provider: 'together', defaultConfig: { model: 'black-forest-labs/FLUX.1-schnell' } },
  { id: 'image-sdxl', name: 'SDXL', icon: '🖼️', category: 'Images', description: 'Generate images with SDXL', provider: 'replicate', defaultConfig: { model: 'stability-ai/sdxl' } },

  // Embeddings
  { id: 'embed-openai', name: 'OpenAI Embed', icon: '📊', category: 'Embeddings', description: 'Generate embeddings with OpenAI', provider: 'openai', defaultConfig: { model: 'text-embedding-3-small' } },
  { id: 'embed-cohere', name: 'Cohere Embed', icon: '📊', category: 'Embeddings', description: 'Generate embeddings with Cohere', provider: 'cohere', defaultConfig: { model: 'embed-english-v3.0' } },
  { id: 'embed-ollama', name: 'Ollama Embed', icon: '📊', category: 'Embeddings', description: 'Local embeddings with Ollama', provider: 'ollama', defaultConfig: { model: 'nomic-embed-text' } },

  // RAG
  { id: 'rag-basic', name: 'RAG Chat', icon: '📚', category: 'RAG', description: 'Chat with your documents', defaultConfig: { preset: 'basic-openai' } },
  { id: 'rag-local', name: 'Local RAG', icon: '📚', category: 'RAG', description: 'Fully local document chat', defaultConfig: { preset: 'local-ollama' } },
  { id: 'rag-upload', name: 'Document Upload', icon: '📤', category: 'RAG', description: 'Upload documents for RAG', defaultConfig: { formats: ['pdf', 'txt', 'md', 'docx'] } },
  { id: 'rag-search', name: 'Semantic Search', icon: '🔍', category: 'RAG', description: 'Search your documents', defaultConfig: { topK: 5 } },

  // Storage
  { id: 'storage-gdrive', name: 'Google Drive', icon: '📁', category: 'Storage', description: 'Connect to Google Drive', provider: 'google-drive', defaultConfig: {} },
  { id: 'storage-dropbox', name: 'Dropbox', icon: '📦', category: 'Storage', description: 'Connect to Dropbox', provider: 'dropbox', defaultConfig: {} },
  { id: 'storage-s3', name: 'AWS S3', icon: '🪣', category: 'Storage', description: 'Connect to S3 bucket', provider: 's3', defaultConfig: { region: 'us-east-1' } },

  // Vector Databases
  { id: 'vector-pinecone', name: 'Pinecone', icon: '🌲', category: 'Vector DB', description: 'Connect to Pinecone', provider: 'pinecone', defaultConfig: {} },
  { id: 'vector-weaviate', name: 'Weaviate', icon: '🔷', category: 'Vector DB', description: 'Connect to Weaviate', provider: 'weaviate', defaultConfig: {} },
  { id: 'vector-qdrant', name: 'Qdrant', icon: '🔶', category: 'Vector DB', description: 'Connect to Qdrant', provider: 'qdrant', defaultConfig: {} },
  { id: 'vector-chroma', name: 'ChromaDB', icon: '🎨', category: 'Vector DB', description: 'Local ChromaDB', provider: 'chroma', defaultConfig: { path: './chroma_db' } },
  { id: 'vector-supabase', name: 'Supabase Vector', icon: '⚡', category: 'Vector DB', description: 'Supabase pgvector', provider: 'supabase-vector', defaultConfig: {} },
]

// ============================================================================
// CODE GENERATORS
// ============================================================================

export function generateChatCode(
  provider: string,
  model: string,
  platform: 'react' | 'swift' | 'kotlin'
): string {
  const providerConfig = AI_PROVIDERS.find(p => p.id === provider)
  if (!providerConfig) return '// Provider not found'

  if (platform === 'react') {
    return `
import { useState, useCallback } from 'react'

const API_URL = '${providerConfig.baseUrl}'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function useChat(apiKey: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string, systemPrompt?: string) => {
    const userMessage: Message = { role: 'user', content }
    const allMessages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...messages,
      userMessage
    ]

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(\`\${API_URL}/chat/completions\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${apiKey}\`,
          ${provider === 'anthropic' ? "'anthropic-version': '2023-06-01'," : ''}
        },
        body: JSON.stringify({
          model: '${model}',
          messages: allMessages,
          stream: false
        })
      })

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
      return assistantMessage
    } catch (error) {
      console.error('Chat error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [messages, apiKey])

  const clear = useCallback(() => setMessages([]), [])

  return { messages, sendMessage, isLoading, clear }
}

// Chat Component
export function ChatInterface({ apiKey }: { apiKey: string }) {
  const { messages, sendMessage, isLoading } = useChat(apiKey)
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    const message = input
    setInput('')
    await sendMessage(message)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={\`p-3 rounded-lg max-w-[80%] \${
              msg.role === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100 mr-auto'
            }\`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 bg-gray-100 rounded-lg mr-auto animate-pulse">
            Thinking...
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

  return `// Code for ${platform} coming soon`
}

export function generateRAGCode(config: RAGConfig, platform: 'react'): string {
  return `
import { useState, useCallback } from 'react'

// RAG Configuration: ${config.name}
// ${config.description}

interface Document {
  id: string
  content: string
  metadata?: Record<string, unknown>
}

interface SearchResult {
  document: Document
  score: number
}

export function useRAG() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Chunk text into smaller pieces
  const chunkText = (text: string): string[] => {
    const chunks: string[] = []
    const chunkSize = ${config.chunkSize}
    const overlap = ${config.chunkOverlap}

    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      chunks.push(text.slice(i, i + chunkSize))
    }
    return chunks
  }

  // Generate embeddings
  const embed = async (texts: string[]): Promise<number[][]> => {
    const response = await fetch('${AI_PROVIDERS.find(p => p.id === config.embeddingProvider)?.baseUrl}/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.EMBEDDING_API_KEY}\`
      },
      body: JSON.stringify({
        model: '${config.embeddingModel}',
        input: texts
      })
    })
    const data = await response.json()
    return data.data.map((d: { embedding: number[] }) => d.embedding)
  }

  // Add document to vector store
  const addDocument = useCallback(async (content: string, metadata?: Record<string, unknown>) => {
    setIsProcessing(true)
    try {
      const chunks = chunkText(content)
      const embeddings = await embed(chunks)

      // Store in vector database (${config.vectorStore})
      // Implementation depends on your vector store choice

      const newDocs = chunks.map((chunk, i) => ({
        id: crypto.randomUUID(),
        content: chunk,
        metadata: { ...metadata, embedding: embeddings[i] }
      }))

      setDocuments(prev => [...prev, ...newDocs])
    } finally {
      setIsProcessing(false)
    }
  }, [])

  // Search similar documents
  const search = useCallback(async (query: string): Promise<SearchResult[]> => {
    const [queryEmbedding] = await embed([query])

    // Vector similarity search
    // Returns top ${config.topK} results
    // Implementation depends on your vector store

    return [] // Replace with actual search results
  }, [])

  // Chat with RAG context
  const chat = useCallback(async (query: string): Promise<string> => {
    const results = await search(query)
    const context = results.map(r => r.document.content).join('\\n\\n')

    const response = await fetch('${AI_PROVIDERS.find(p => p.id === config.chatProvider)?.baseUrl}/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.CHAT_API_KEY}\`
      },
      body: JSON.stringify({
        model: '${config.chatModel}',
        messages: [
          {
            role: 'system',
            content: \`Answer based on this context:\\n\\n\${context}\`
          },
          { role: 'user', content: query }
        ]
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  }, [search])

  return { documents, addDocument, search, chat, isProcessing }
}

// RAG Chat Component
export function RAGChat() {
  const { chat, addDocument, isProcessing } = useRAG()
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    const query = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: query }])

    const response = await chat(query)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const text = await file.text()
      await addDocument(text, { filename: file.name })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <input type="file" onChange={handleUpload} disabled={isProcessing} />
        {isProcessing && <span className="ml-2 text-sm">Processing...</span>}
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={\`p-3 rounded-lg max-w-[80%] \${
              msg.role === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100 mr-auto'
            }\`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your documents..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Ask
        </button>
      </div>
    </div>
  )
}
`
}

export function generateStorageCode(provider: string, platform: 'react'): string {
  const storageConfig = STORAGE_PROVIDERS.find(p => p.id === provider)
  if (!storageConfig) return '// Storage provider not found'

  if (provider === 'google-drive') {
    return `
import { useEffect, useState, useCallback } from 'react'

// Google Drive Connector
// Requires: npm install @react-oauth/google

interface DriveFile {
  id: string
  name: string
  mimeType: string
  modifiedTime: string
  size?: string
}

export function useGoogleDrive() {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // List files
  const listFiles = useCallback(async (folderId = 'root') => {
    if (!accessToken) return

    setIsLoading(true)
    try {
      const response = await fetch(
        \`https://www.googleapis.com/drive/v3/files?q='\${folderId}'+in+parents&fields=files(id,name,mimeType,modifiedTime,size)\`,
        {
          headers: { Authorization: \`Bearer \${accessToken}\` }
        }
      )
      const data = await response.json()
      setFiles(data.files || [])
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  // Upload file
  const uploadFile = useCallback(async (file: File, folderId = 'root') => {
    if (!accessToken) return

    const metadata = {
      name: file.name,
      parents: [folderId]
    }

    const formData = new FormData()
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    formData.append('file', file)

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: { Authorization: \`Bearer \${accessToken}\` },
        body: formData
      }
    )

    return response.json()
  }, [accessToken])

  // Download file
  const downloadFile = useCallback(async (fileId: string) => {
    if (!accessToken) return

    const response = await fetch(
      \`https://www.googleapis.com/drive/v3/files/\${fileId}?alt=media\`,
      {
        headers: { Authorization: \`Bearer \${accessToken}\` }
      }
    )

    return response.blob()
  }, [accessToken])

  // Search files
  const searchFiles = useCallback(async (query: string) => {
    if (!accessToken) return

    const response = await fetch(
      \`https://www.googleapis.com/drive/v3/files?q=name+contains+'\${query}'&fields=files(id,name,mimeType)\`,
      {
        headers: { Authorization: \`Bearer \${accessToken}\` }
      }
    )

    const data = await response.json()
    return data.files || []
  }, [accessToken])

  return { files, listFiles, uploadFile, downloadFile, searchFiles, isLoading, setAccessToken }
}

// File Browser Component
export function DriveFileBrowser() {
  const { files, listFiles, uploadFile, isLoading, setAccessToken } = useGoogleDrive()
  const [currentFolder, setCurrentFolder] = useState('root')

  useEffect(() => {
    // Get access token from OAuth flow
    // setAccessToken(token)
    listFiles(currentFolder)
  }, [currentFolder, listFiles])

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">Google Drive</h2>
        <input
          type="file"
          onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])}
          className="text-sm"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => file.mimeType === 'application/vnd.google-apps.folder' && setCurrentFolder(file.id)}
            >
              <span>{file.mimeType.includes('folder') ? '📁' : '📄'}</span>
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
`
  }

  return `// Storage connector for ${provider}`
}

// ============================================================================
// HELPERS
// ============================================================================

export function getProvidersByCapability(capability: AICapability): AIProvider[] {
  return AI_PROVIDERS.filter(p => p.capabilities.includes(capability))
}

export function getModelsByCapability(capability: AICapability): { provider: AIProvider; model: AIModel }[] {
  const results: { provider: AIProvider; model: AIModel }[] = []

  for (const provider of AI_PROVIDERS) {
    for (const model of provider.models) {
      if (model.capabilities.includes(capability)) {
        results.push({ provider, model })
      }
    }
  }

  return results
}

export function getLocalProviders(): AIProvider[] {
  return AI_PROVIDERS.filter(p => p.type === 'local')
}

export function getCloudProviders(): AIProvider[] {
  return AI_PROVIDERS.filter(p => p.type === 'cloud')
}

export function getFreeProviders(): AIProvider[] {
  return AI_PROVIDERS.filter(p => p.pricing === 'free' || p.pricing === 'freemium')
}
