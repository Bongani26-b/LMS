import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/service';
import { AIQueryRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const body: AIQueryRequest = await req.json();

    if (!body.prompt && !body.highlightedText) {
      return NextResponse.json(
        { error: 'Prompt or highlighted text is required' },
        { status: 400 }
      );
    }

    const response = await AIService.query(body);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('AI Query Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal AI query error' },
      { status: 500 }
    );
  }
}

