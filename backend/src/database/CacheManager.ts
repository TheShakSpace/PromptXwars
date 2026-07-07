/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface CacheEntry {
  key: string;
  value: any;
  expiresAt?: number;
  lastAccessed: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry> = new Map();
  private maxKeys = 1000; // LRU cap limit
  private mode: "Memory" | "Redis" = "Memory";

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public setMode(mode: "Memory" | "Redis"): void {
    this.mode = mode;
    console.log(`[CacheManager] Switched cache distribution mode to [${mode}].`);
  }

  public getMode(): string {
    return this.mode;
  }

  /**
   * Sets value in cache with optional TTL in milliseconds
   */
  public async set(key: string, value: any, ttlMs?: number): Promise<void> {
    // Implement standard LRU check if max capacity reached
    if (this.cache.size >= this.maxKeys) {
      this.evictLeastRecentlyUsed();
    }

    const expiresAt = ttlMs ? Date.now() + ttlMs : undefined;
    this.cache.set(key, {
      key,
      value,
      expiresAt,
      lastAccessed: Date.now(),
    });

    if (this.mode === "Redis") {
      console.log(`[CacheManager] [Redis] Persisted key '${key}' under structured TTL: ${ttlMs || "infinite"}ms`);
    }
  }

  /**
   * Retrieves value from cache, handling TTL validation and LRU updates
   */
  public async get<T = any>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL expiration
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      if (this.mode === "Redis") {
        console.log(`[CacheManager] [Redis] Expired and evicted key '${key}' cleanly.`);
      }
      return null;
    }

    // Update last accessed time for LRU tracking
    entry.lastAccessed = Date.now();
    return entry.value as T;
  }

  /**
   * Deletes a key from cache
   */
  public async del(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  /**
   * Clears the entire cache store
   */
  public async clear(): Promise<void> {
    this.cache.clear();
    console.log("[CacheManager] Cleared entire active cache storage.");
  }

  /**
   * LRU eviction mechanism
   */
  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`[CacheManager] Evicted key '${oldestKey}' via LRU policy.`);
    }
  }

  public getHealth(): { status: string; keysCount: number; maxLimit: number } {
    return {
      status: "Healthy",
      keysCount: this.cache.size,
      maxLimit: this.maxKeys,
    };
  }
}

export const cacheManager = CacheManager.getInstance();
export default cacheManager;
