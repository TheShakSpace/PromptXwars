/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatabaseProvider, QueryOptions, TransactionContext } from "./DatabaseProvider";

export class MongoProvider implements DatabaseProvider {
  public readonly name = "MongoDB";
  private isConnected = false;
  private db: Map<string, any[]> = new Map();
  private backups: Map<string, string> = new Map(); // transactional backup storage

  public async connect(): Promise<void> {
    this.isConnected = true;
    console.log("[MongoProvider] Successfully established connection to simulated MongoDB cluster.");
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log("[MongoProvider] Disconnected from MongoDB cluster.");
  }

  private ensureConnected(): void {
    if (!this.isConnected) {
      throw new Error("MongoDB Connection Error: Client is not connected to any server.");
    }
  }

  public async find<T = any>(
    collection: string,
    filter: Record<string, any>,
    options?: QueryOptions
  ): Promise<T[]> {
    this.ensureConnected();
    const items = this.db.get(collection) || [];
    let filtered = items.filter((item) => this.matchFilter(item, filter));

    if (options?.sort) {
      filtered.sort((a, b) => {
        for (const [key, order] of Object.entries(options.sort!)) {
          if (a[key] < b[key]) return order === 1 ? -1 : 1;
          if (a[key] > b[key]) return order === 1 ? 1 : -1;
        }
        return 0;
      });
    }

    if (options?.skip) {
      filtered = filtered.slice(options.skip);
    }
    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return JSON.parse(JSON.stringify(filtered)) as T[];
  }

  public async findOne<T = any>(
    collection: string,
    filter: Record<string, any>,
    options?: QueryOptions
  ): Promise<T | null> {
    const results = await this.find<T>(collection, filter, { ...options, limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  public async create<T = any>(
    collection: string,
    data: Record<string, any>,
    options?: QueryOptions
  ): Promise<T> {
    this.ensureConnected();
    if (!this.db.has(collection)) {
      this.db.set(collection, []);
    }

    const newRecord = {
      _id: data._id || `id_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };

    if (options?.transaction) {
      const tx = options.transaction as MongoTransactionContext;
      tx.addOperation(() => {
        const list = this.db.get(collection) || [];
        const index = list.findIndex((item) => item._id === newRecord._id);
        if (index !== -1) {
          list.splice(index, 1);
        }
      });
    }

    this.db.get(collection)!.push(newRecord);
    return JSON.parse(JSON.stringify(newRecord)) as T;
  }

  public async update<T = any>(
    collection: string,
    filter: Record<string, any>,
    updateData: Record<string, any>,
    options?: QueryOptions
  ): Promise<T[]> {
    this.ensureConnected();
    const items = this.db.get(collection) || [];
    const matched = items.filter((item) => this.matchFilter(item, filter));

    if (options?.transaction) {
      const tx = options.transaction as MongoTransactionContext;
      const originals = matched.map((item) => JSON.parse(JSON.stringify(item)));
      tx.addOperation(() => {
        const list = this.db.get(collection) || [];
        for (const orig of originals) {
          const index = list.findIndex((x) => x._id === orig._id);
          if (index !== -1) {
            list[index] = orig;
          }
        }
      });
    }

    for (const item of matched) {
      item.updatedAt = new Date();
      if (updateData.$set) {
        Object.assign(item, updateData.$set);
      } else if (updateData.$inc) {
        for (const [k, v] of Object.entries(updateData.$inc)) {
          item[k] = (item[k] || 0) + (v as number);
        }
      } else {
        Object.assign(item, updateData);
      }
    }

    return JSON.parse(JSON.stringify(matched)) as T[];
  }

  public async delete(
    collection: string,
    filter: Record<string, any>,
    options?: QueryOptions
  ): Promise<number> {
    this.ensureConnected();
    const items = this.db.get(collection) || [];
    const toDelete = items.filter((item) => this.matchFilter(item, filter));

    if (options?.transaction) {
      const tx = options.transaction as MongoTransactionContext;
      const deletedSnapshots = toDelete.map((item) => JSON.parse(JSON.stringify(item)));
      tx.addOperation(() => {
        const list = this.db.get(collection) || [];
        list.push(...deletedSnapshots);
      });
    }

    const filtered = items.filter((item) => !this.matchFilter(item, filter));
    this.db.set(collection, filtered);

    return toDelete.length;
  }

  public async aggregate<T = any>(collection: string, pipeline: any[]): Promise<T[]> {
    this.ensureConnected();
    let results = this.db.get(collection) || [];

    for (const stage of pipeline) {
      const key = Object.keys(stage)[0];
      const val = stage[key];

      switch (key) {
        case "$match":
          results = results.filter((item) => this.matchFilter(item, val));
          break;
        case "$sort":
          results = [...results].sort((a, b) => {
            for (const [k, order] of Object.entries(val)) {
              if (a[k] < b[k]) return order === 1 ? -1 : 1;
              if (a[k] > b[k]) return order === 1 ? 1 : -1;
            }
            return 0;
          });
          break;
        case "$limit":
          results = results.slice(0, val);
          break;
        case "$skip":
          results = results.slice(val);
          break;
        case "$project":
          results = results.map((item) => {
            const projected: any = {};
            for (const [k, v] of Object.entries(val)) {
              if (v === 1) projected[k] = item[k];
            }
            if (item._id && val._id !== 0) projected._id = item._id;
            return projected;
          });
          break;
      }
    }

    return JSON.parse(JSON.stringify(results)) as T[];
  }

  public async transaction(): Promise<TransactionContext> {
    this.ensureConnected();
    return new MongoTransactionContext();
  }

  public async healthCheck(): Promise<{ status: "Healthy" | "Degraded" | "Offline"; details?: any }> {
    return this.isConnected
      ? { status: "Healthy", details: { pingMs: 2, collectionsCount: this.db.size } }
      : { status: "Offline", details: { error: "Not Connected" } };
  }

  private matchFilter(obj: any, filter: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === "object" && value !== null) {
        const op = Object.keys(value)[0];
        const val = value[op];
        switch (op) {
          case "$gt":
            if (!(obj[key] > val)) return false;
            break;
          case "$gte":
            if (!(obj[key] >= val)) return false;
            break;
          case "$lt":
            if (!(obj[key] < val)) return false;
            break;
          case "$lte":
            if (!(obj[key] <= val)) return false;
            break;
          case "$ne":
            if (obj[key] === val) return false;
            break;
          case "$in":
            if (!Array.isArray(val) || !val.includes(obj[key])) return false;
            break;
          default:
            if (JSON.stringify(obj[key]) !== JSON.stringify(value)) return false;
        }
      } else {
        if (obj[key] !== value) return false;
      }
    }
    return true;
  }
}

class MongoTransactionContext implements TransactionContext {
  public id = `tx_mongo_${Math.random().toString(36).substring(2, 11)}`;
  private rollbacks: Array<() => void> = [];

  public addOperation(rollback: () => void) {
    this.rollbacks.push(rollback);
  }

  public async commit(): Promise<void> {
    console.log(`[MongoTransactionContext] Transaction ${this.id} committed successfully.`);
    this.rollbacks = [];
  }

  public async rollback(): Promise<void> {
    console.log(`[MongoTransactionContext] Rolling back transaction ${this.id}...`);
    for (const op of this.rollbacks.reverse()) {
      try {
        op();
      } catch (err) {
        console.error("[MongoTransactionContext] Error executing rollback operation:", err);
      }
    }
    this.rollbacks = [];
  }
}
