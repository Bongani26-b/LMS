import { NextResponse } from 'next/server';
import { OllamaProvider } from '@/lib/ai/providers/ollama';

export async function GET() {
  const ollama = new OllamaProvider();
  const isOllamaOnline = await ollama.isAvailable();

  return NextResponse.json({
    status: 'online',
    ollama: {
      connected: isOllamaOnline,
      endpoint: 'http://localhost:11434',
    },
    educationalEngine: {
      status: 'active',
      curriculum: 'South African CAPS (Grades 8-12)',
    },
    rag: {
      status: 'ready',
      indexedResources: 3,
    },
    timestamp: new Date().toISOString(),
  });
}

