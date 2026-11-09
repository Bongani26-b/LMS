import { EducationalResource } from '@/types';
import { INITIAL_RESOURCES } from '@/lib/data/curriculumData';

export interface RetrievedChunk {
  resourceTitle: string;
  pageNumber: number;
  text: string;
  score: number;
}

export class EducationalRAGService {
  /**
   * Splits text into page or paragraph chunks
   */
  static chunkResource(resource: EducationalResource): Array<{ page: number; text: string }> {
    if (!resource.extracted_text) return [];

    const pageSplits = resource.extracted_text.split(/PAGE \d+:/i);
    const chunks: Array<{ page: number; text: string }> = [];

    pageSplits.forEach((section, index) => {
      const clean = section.trim();
      if (clean) {
        // Break long pages into paragraphs
        const paragraphs = clean.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
        paragraphs.forEach((p) => {
          chunks.push({
            page: index === 0 ? 1 : index,
            text: p.trim(),
          });
        });
      }
    });

    return chunks;
  }

  /**
   * Retrieves the most relevant chunks from approved educational resources
   */
  static retrieveContext(params: {
    query: string;
    highlightedText?: string;
    subjectId?: string;
    gradeId?: string;
    limit?: number;
  }): RetrievedChunk[] {
    const { query, highlightedText, subjectId, limit = 3 } = params;
    const searchTerms = [
      ...query.toLowerCase().split(/\s+/),
      ...(highlightedText ? highlightedText.toLowerCase().split(/\s+/) : []),
    ]
      .filter((w) => w.length > 3)
      .map((w) => w.replace(/[^a-z0-9]/g, ''));

    // Filter resources by subject if specified
    const resources = subjectId
      ? INITIAL_RESOURCES.filter((r) => r.subject_id === subjectId)
      : INITIAL_RESOURCES;

    const scoredChunks: RetrievedChunk[] = [];

    resources.forEach((res) => {
      const chunks = this.chunkResource(res);
      chunks.forEach((chunk) => {
        const lowerText = chunk.text.toLowerCase();
        let score = 0;

        // Exact highlighted text match gives highest score
        if (highlightedText && lowerText.includes(highlightedText.toLowerCase().trim())) {
          score += 50;
        }

        // Term frequency match
        searchTerms.forEach((term) => {
          if (lowerText.includes(term)) {
            score += 5;
          }
        });

        if (score > 0) {
          scoredChunks.push({
            resourceTitle: res.title,
            pageNumber: chunk.page,
            text: chunk.text,
            score,
          });
        }
      });
    });

    // Sort by score descending and return top matches
    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

