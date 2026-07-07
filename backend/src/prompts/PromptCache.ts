/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CacheEntry {
  value: string;
  expiresAt: number;
}

export class PromptCache {
  private cache = new Map<string, CacheEntry>();
  private defaultTtlMs = 10 * 60 * 1000; // 10 minutes default

  /**
   * Generates a deterministic key based on prompt ID, version, and serialized variable state.
   */
  generateKey(id: string, version: string, variables?: any): string {
    const serializedVars = variables ? JSON.stringify(variables) : "";
    return `${id}:${version}:${serializedVars}`;
  }

  /**
   * Retrieves an item from the cache. Returns null if missing or expired.
   */
  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key); // Evict expired entry
      return null;
    }

    return entry.value;
  }

  /**
   * Saves a rendered prompt string to the cache with a specified or default TTL.
   */
  set(key: string, value: string, ttlMs?: number): void {
    const actualTtl = ttlMs ?? this.defaultTtlMs;
    const expiresAt = Date.now() + actualTtl;

    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Removes all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Iterates and deletes all expired entries.
   */
  evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Gets the total number of cached entries.
   */
  size(): number {
    return this.cache.size;
  }
}
