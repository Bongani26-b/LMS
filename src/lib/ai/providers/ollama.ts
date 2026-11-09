import { AIProvider, AIQueryRequest, AIQueryResponse } from '../types';

export class OllamaProvider implements AIProvider {
  name = 'Ollama (Local Open-Weight Model)';
  private baseUrl: string;
  private modelName: string;

  constructor(baseUrl = 'http://localhost:11434', modelName = 'llama3.2') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.modelName = modelName;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async generate(request: AIQueryRequest): Promise<AIQueryResponse> {
    const systemPrompt = `You are an expert South African Secondary School learning assistant designed for Grade 8 to 12 learners aligned with the CAPS curriculum.
Current Student Context:
- Subject: ${request.subjectName || 'General Secondary'} (${request.subjectCode || ''})
- Grade: ${request.gradeName || 'Grade 10'}
- Topic: ${request.topicTitle || 'Curriculum Module'}

Your instructions:
1. Ground your answers strictly in the approved educational context provided.
2. Explain concepts in clear, student-friendly, age-appropriate language.
3. Break complex explanations into numbered, bite-sized steps.
4. Give a practical real-world analogy if explaining an abstract scientific or mathematical concept.
5. Highlight important terminology for exams.`;

    const userPrompt = `
Approved Textbook Context:
${request.contextChunks?.join('\n---\n') || 'None provided'}

${request.highlightedText ? `Highlighted Section from Student's Textbook:\n"${request.highlightedText}"\n` : ''}

Student's Question:
"${request.prompt}"

Please respond with a structured educational explanation.`;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          system: systemPrompt,
          prompt: userPrompt,
          stream: false,
          options: {
            temperature: 0.3,
            num_ctx: 4096,
          },
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText: string = data.response || '';

      return {
        answer: rawText,
        keyTakeaways: [
          'Review the definition and key formulas in your CAPS syllabus.',
          'Practice corresponding textbook exercises to reinforce understanding.',
        ],
        suggestedQuestions: [
          'Can you show me a step-by-step worked exam example?',
          'What are common mistakes students make on this topic?',
        ],
        contextUsed: request.contextChunks || [],
        modelName: `Ollama (${this.modelName})`,
        provider: 'ollama',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      throw new Error(`Failed to communicate with local Ollama: ${err.message}`);
    }
  }
}

