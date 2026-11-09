import { AIProvider, AIQueryRequest, AIQueryResponse } from '../types';

export class OpenAICompatibleProvider implements AIProvider {
  name = 'OpenAI Compatible Inference Engine';
  private baseUrl: string;
  private apiKey: string;
  private modelName: string;

  constructor(
    baseUrl = 'https://api.openai.com/v1',
    apiKey = '',
    modelName = 'gpt-4o-mini'
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async generate(request: AIQueryRequest): Promise<AIQueryResponse> {
    const systemPrompt = `You are a dedicated South African CAPS secondary school tutor for ${request.gradeName || 'Grade 10'} ${request.subjectName || 'Secondary'}. Provide clear, encouraging, step-by-step explanations grounded in the supplied educational material.`;

    const userPrompt = `
Context from approved curriculum materials:
${request.contextChunks?.join('\n---\n') || 'None'}

${request.highlightedText ? `Highlighted Textbook Excerpt:\n"${request.highlightedText}"\n` : ''}

Student's Question:
"${request.prompt}"
`;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.statusText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
      answer: content,
      keyTakeaways: ['Study the highlighted core concept.', 'Complete the self-test questions.'],
      suggestedQuestions: ['Can you provide another worked example?', 'How does this appear in past exams?'],
      contextUsed: request.contextChunks || [],
      modelName: this.modelName,
      provider: 'openai_compatible',
      timestamp: new Date().toISOString(),
    };
  }
}

