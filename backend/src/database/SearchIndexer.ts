/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IndexDocument {
  id: string;
  collection: string;
  text: string;
  tags: string[];
  metadata: Record<string, any>;
}

export class SearchIndexer {
  private static instance: SearchIndexer;
  private invertedIndex: Map<string, Set<string>> = new Map(); // word -> docIds
  private documents: Map<string, IndexDocument> = new Map();

  private constructor() {}

  public static getInstance(): SearchIndexer {
    if (!SearchIndexer.instance) {
      SearchIndexer.instance = new SearchIndexer();
    }
    return SearchIndexer.instance;
  }

  /**
   * Adds or updates a document inside the full-text search indices
   */
  public indexDocument(id: string, collection: string, text: string, tags: string[] = [], metadata: Record<string, any> = {}): void {
    const doc: IndexDocument = { id, collection, text, tags, metadata };
    this.documents.set(id, doc);

    // Build/Update Inverted Index
    const words = this.tokenize(text);
    for (const word of words) {
      if (!this.invertedIndex.has(word)) {
        this.invertedIndex.set(word, new Set());
      }
      this.invertedIndex.get(word)!.add(id);
    }

    console.log(`[SearchIndexer] Successfully indexed document '${id}' in collection '${collection}' - Keywords count: ${words.length}`);
  }

  /**
   * Removes a document from index tracking
   */
  public deindexDocument(id: string): void {
    const doc = this.documents.get(id);
    if (!doc) return;

    const words = this.tokenize(doc.text);
    for (const word of words) {
      const set = this.invertedIndex.get(word);
      if (set) {
        set.delete(id);
        if (set.size === 0) {
          this.invertedIndex.delete(word);
        }
      }
    }

    this.documents.delete(id);
    console.log(`[SearchIndexer] De-indexed document '${id}'.`);
  }

  /**
   * Performs standard high-speed full-text keyword search with metadata & tag filtering
   */
  public search(query: string, options?: { collection?: string; tags?: string[]; metadata?: Record<string, any> }): IndexDocument[] {
    const queryWords = this.tokenize(query);
    let matchedDocIds: Set<string> | null = null;

    // A. Intersect documents matching query tokens
    if (queryWords.length > 0) {
      for (const word of queryWords) {
        const docIds = this.invertedIndex.get(word) || new Set<string>();
        if (matchedDocIds === null) {
          matchedDocIds = new Set(docIds);
        } else {
          matchedDocIds = new Set(Array.from(matchedDocIds).filter((id) => docIds.has(id)));
        }
      }
    }

    // If query was empty but filters are passed, default match pool to all documents
    const docPool = matchedDocIds === null
      ? Array.from(this.documents.values())
      : Array.from(matchedDocIds).map((id) => this.documents.get(id)!).filter(Boolean);

    // B. Apply advanced metadata, tag & collection filters
    return docPool.filter((doc) => {
      if (options?.collection && doc.collection !== options.collection) {
        return false;
      }

      if (options?.tags && options.tags.length > 0) {
        const hasAllTags = options.tags.every((t) => doc.tags.includes(t));
        if (!hasAllTags) return false;
      }

      if (options?.metadata) {
        for (const [k, v] of Object.entries(options.metadata)) {
          if (doc.metadata[k] !== v) return false;
        }
      }

      return true;
    });
  }

  /**
   * Clears the index registries
   */
  public clearIndex(): void {
    this.invertedIndex.clear();
    this.documents.clear();
    console.log("[SearchIndexer] Cleared all search index tables.");
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1); // skip single-letter noise words
  }
}

export const searchIndexer = SearchIndexer.getInstance();
export default searchIndexer;
