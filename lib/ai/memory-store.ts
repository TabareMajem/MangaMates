import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { AnthropicEmbeddings } from "langchain/embeddings/anthropic";
import type { JournalEntry } from '@/lib/types/journal';

export class JournalMemoryStore {
  private store: MemoryVectorStore;
  private embeddings: AnthropicEmbeddings;

  constructor() {
    this.embeddings = new AnthropicEmbeddings({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.store = new MemoryVectorStore(this.embeddings);
  }

  async addEntry(entry: JournalEntry) {
    await this.store.addDocuments([{
      pageContent: entry.content,
      metadata: {
        id: entry.id,
        createdAt: entry.createdAt,
        concepts: entry.concepts
      }
    }]);
  }

  async findSimilarEntries(content: string, limit = 5) {
    const results = await this.store.similaritySearch(content, limit);
    return results.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata
    }));
  }

  async searchByTheme(theme: string, limit = 5) {
    return this.store.similaritySearch(
      `Find entries related to ${theme}`,
      limit
    );
  }
}
