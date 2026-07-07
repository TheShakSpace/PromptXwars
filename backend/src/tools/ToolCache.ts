/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface CacheEntry {
  value: any;
  expiresAt: number;
}

export class ToolCache {
  private static instance: ToolCache;
  private store = new Map<string, CacheEntry>();

  private constructor() {
    // Start background sweeping for expired entries every 30 seconds
    setInterval(() => this.sweep(), 30000).unref?.();
  }

  public static getInstance(): ToolCache {
    if (!ToolCache.instance) {
      ToolCache.instance = new ToolCache();
    }
    return ToolCache.instance;
  }

  /**
   * Computes a unique string key based on tool ID and its structured parameters
   */
  public makeKey(toolId: string, input: any): string {
    const serialized = typeof input === "object" ? JSON.stringify(input) : String(input);
    return `${toolId}:${serialized}`;
  }

  /**
   * Retrieves a value from the cache if it hasn't expired
   */
  public get(key: string): any | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Stores a value in the cache with a specified TTL in milliseconds
   */
  public set(key: string, value: any, ttlMs: number): void {
    if (ttlMs <= 0) return;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Deletes a specific key from the cache
   */
  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Flushes all elements in the cache
   */
  public clear(): void {
    this.store.clear();
  }

  /**
   * Removes all expired entries from cache to free memory
   */
  private sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

export const toolCache = ToolCache.getInstance();
export default toolCache;
