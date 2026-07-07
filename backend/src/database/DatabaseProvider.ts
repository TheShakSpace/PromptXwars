/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TransactionContext {
  id: string;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface QueryOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
  transaction?: TransactionContext;
}

export interface DatabaseProvider {
  name: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  find<T = any>(collection: string, filter: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  findOne<T = any>(collection: string, filter: Record<string, any>, options?: QueryOptions): Promise<T | null>;
  create<T = any>(collection: string, data: Record<string, any>, options?: QueryOptions): Promise<T>;
  update<T = any>(collection: string, filter: Record<string, any>, updateData: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  delete(collection: string, filter: Record<string, any>, options?: QueryOptions): Promise<number>;
  aggregate<T = any>(collection: string, pipeline: any[], options?: QueryOptions): Promise<T[]>;
  transaction(): Promise<TransactionContext>;
  healthCheck(): Promise<{ status: "Healthy" | "Degraded" | "Offline"; details?: any }>;
}
