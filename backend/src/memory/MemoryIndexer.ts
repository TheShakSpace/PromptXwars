/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryStore } from "./MemoryStore";
import { MemoryNode } from "./types";

export class MemoryCacheEntry<T> {
  constructor(
    public value: T,
    public expiry: number // timestamp
  ) {}

  public isExpired(): boolean {
    return Date.now() > this.expiry;
  }
}

export class MemoryIndexer {
  private static instance: MemoryIndexer;
  private cache: Map<string, MemoryCacheEntry<any>> = new Map();

  private constructor() {}

  public static getInstance(): MemoryIndexer {
    if (!MemoryIndexer.instance) {
      MemoryIndexer.instance = new MemoryIndexer();
    }
    return MemoryIndexer.instance;
  }

  /**
   * Fast word matching / index-based retrieval for full-text search fallback
   */
  public searchByText(query: string): MemoryNode[] {
    const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    if (tokens.length === 0) return [];

    const nodes = memoryStore.getAll();
    const results: Array<{ node: MemoryNode; score: number }> = [];

    for (const node of nodes) {
      const contentLower = node.content.toLowerCase();
      let matchCount = 0;

      for (const token of tokens) {
        if (contentLower.includes(token)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        // Simple term frequency scoring
        const score = matchCount / tokens.length;
        results.push({ node, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .map((r) => r.node);
  }

  /**
   * Search nodes matching specified tags
   */
  public searchByTags(tags: string[]): MemoryNode[] {
    if (!tags || tags.length === 0) return [];
    
    const lowercaseTags = tags.map((t) => t.toLowerCase());
    return memoryStore.getAll().filter((node) => {
      return node.tags.some((tag) => lowercaseTags.includes(tag.toLowerCase()));
    });
  }

  /**
   * Cache wrapper to avoid re-computing heavy calculations (e.g. graph traversal, embeddings similarity)
   * @param key Cache identifier
   * @param fallbackFn Async builder function if cache misses
   * @param ttlMs Time-to-live in milliseconds
   */
  public async getOrSet<T>(key: string, fallbackFn: () => Promise<T>, ttlMs = 60000): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && !cached.isExpired()) {
      return cached.value;
    }

    const value = await fallbackFn();
    this.cache.set(key, new MemoryCacheEntry(value, Date.now() + ttlMs));
    return value;
  }

  /**
   * Invalidates a specific cache key
   */
  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Flush the entire cache
   */
  public flush(): void {
    this.cache.clear();
  }
}

export const memoryIndexer = MemoryIndexer.getInstance();
