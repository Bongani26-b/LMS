import { AIQueryRequest, AIQueryResponse } from './types';
import { EducationalRAGService } from './rag';
import { OllamaProvider } from './providers/ollama';
import { OpenAICompatibleProvider } from './providers/openaiCompatible';
import { PedagogicalFallbackProvider } from './providers/pedagogicalFallback';
import { AISettings } from '@/types';

const SERVER_DEFAULT_AI_SETTINGS: AISettings = {
  provider: (process.env.AI_PROVIDER as AISettings['provider']) || 'local_fallback',
  ollama_base_url: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollama_model: process.env.OLLAMA_MODEL || 'llama3.2',
  openai_base_url: process.env.OPENAI_BASE_URL,
  openai_api_key: process.env.OPENAI_API_KEY,
  openai_model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  temperature: 0.3,
  max_tokens: 1024,
  rag_enabled: true,
};

export class AIService {
  static async query(request: AIQueryRequest): Promise<AIQueryResponse> {
    const settings = SERVER_DEFAULT_AI_SETTINGS;

    // 1. RAG retrieval if enabled
    let contextChunks: string[] = [];
    if (settings.rag_enabled) {
      const retrieved = EducationalRAGService.retrieveContext({
        query: request.prompt,
        highlightedText: request.highlightedText,
        subjectId: request.subjectCode,
        limit: 3,
      });

      contextChunks = retrieved.map(
        (c) => `[Source: ${c.resourceTitle}, Page ${c.pageNumber}]\n${c.text}`
      );
    }

    const enhancedRequest: AIQueryRequest = {
      ...request,
      contextChunks: contextChunks.length > 0 ? contextChunks : request.contextChunks,
    };

    // 2. Provider selection & execution
    if (settings.provider === 'ollama') {
      const ollama = new OllamaProvider(settings.ollama_base_url, settings.ollama_model);
      const isOnline = await ollama.isAvailable();
      if (isOnline) {
        try {
          return await ollama.generate(enhancedRequest);
        } catch (err) {
          console.warn('Ollama error, falling back to local educational engine:', err);
        }
      }
    } else if (settings.provider === 'openai_compatible' && settings.openai_api_key) {
      const openai = new OpenAICompatibleProvider(
        settings.openai_base_url,
        settings.openai_api_key,
        settings.openai_model
      );
      try {
        return await openai.generate(enhancedRequest);
      } catch (err) {
        console.warn('OpenAI provider error, falling back to local engine:', err);
      }
    }

    // 3. Fallback to specialized CAPS Educational Engine
    const fallback = new PedagogicalFallbackProvider();
    return await fallback.generate(enhancedRequest);
  }
}
