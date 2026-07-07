/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class PromptCache {
  private static cache = new Map<string, CacheEntry<any>>();
  private static defaultTtlMs = 5 * 60 * 1000; // 5 minutes default

  private static generateKey(prompt: string, modelId: string, options?: any): string {
    const serializedOptions = options ? JSON.stringify({
      temperature: options.temperature,
      topP: options.topP,
      topK: options.topK,
      maxTokens: options.maxTokens
    }) : "";
    return `${modelId}:${prompt}:${serializedOptions}`;
  }

  static get<T>(prompt: string, modelId: string, options?: any): T | null {
    const key = this.generateKey(prompt, modelId, options);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key); // Evict expired entry
      return null;
    }

    return entry.value;
  }

  static set<T>(prompt: string, modelId: string, value: T, ttlMs?: number, options?: any): void {
    const key = this.generateKey(prompt, modelId, options);
    const actualTtl = ttlMs ?? this.defaultTtlMs;
    const expiresAt = Date.now() + actualTtl;

    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  static clear(): void {
    this.cache.clear();
  }

  static removeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}
