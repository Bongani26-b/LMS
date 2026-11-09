export interface AIQueryRequest {
  prompt: string;
  highlightedText?: string;
  subjectName?: string;
  subjectCode?: string;
  gradeName?: string;
  topicTitle?: string;
  resourceTitle?: string;
  resourceId?: string;
  contextChunks?: string[];
}

export interface AIQueryResponse {
  answer: string;
  keyTakeaways: string[];
  suggestedQuestions: string[];
  contextUsed: string[];
  modelName: string;
  provider: string;
  timestamp: string;
}

export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generate(request: AIQueryRequest): Promise<AIQueryResponse>;
}

