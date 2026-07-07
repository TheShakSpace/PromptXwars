/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatabaseProvider, QueryOptions, TransactionContext } from "./DatabaseProvider";

export class PostgresProvider implements DatabaseProvider {
  public readonly name = "PostgreSQL";
  private isConnected = false;
  private tables: Map<string, any[]> = new Map();

  public async connect(): Promise<void> {
    this.isConnected = true;
    console.log("[PostgresProvider] Successfully connected to simulated PostgreSQL instance.");
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log("[PostgresProvider] Closed connection with PostgreSQL database.");
  }

  private ensureConnected(): void {
    if (!this.isConnected) {
      throw new Error("PostgreSQL Connection Error: connection state is offline.");
    }
  }

  public async find<T = any>(
    table: string,
    filter: Record<string, any>,
    options?: QueryOptions
  ): Promise<T[]> {
    this.ensureConnected();
    const rows = this.tables.get(table) || [];
    let filtered = rows.filter((row) => this.matchRow(row, filter));

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
    table: string,
    filter: Record<string, any>,
    options?: QueryOptions
  ): Promise<T | null> {
    const results = await this.find<T>(table, filter, { ...options, limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  public async create<T = any>(
    table: string,
    data: Record<string, any>,
    options?: QueryOptions
  ): Promise<T> {
    this.ensureConnected();
    if (!this.tables.has(table)) {
      this.tables.set(table, []);
    }

    const newRow = {
      id: data.id || `pg_id_${Math.random().toString(36).substring(2, 11)}`,
      created_at: new Date(),
      updated_at: new Date(),
      ...data,
    };

    if (options?.transaction) {
      const tx = options.transaction as PostgresTransactionContext;
      tx.addOperation(() => {
        const rows = this.tables.get(table) || [];
        const idx = rows.findIndex((r) => r.id === newRow.id);
        if (idx !== -1) {
          rows.splice(idx, 1);
        }
      });
    }

    this.tables.get(table)!.push(newRow);
    return JSON.parse(JSON.stringify(newRow)) as T;
  }

  public async update<T = any>(
    table: string,
    filter: Record<string, any>,
    updateData: Record<string, any>,
    options?: QueryOptions
  ): Promise<T[]> {
    this.ensureConnected();
    const rows = this.tables.get(table) || [];
    const matched = rows.filter((row) => this.matchRow(row, filter));

    if (options?.transaction) {
      const tx = options.transaction as PostgresTransactionContext;
      const originalRows = matched.map((r) => JSON.parse(JSON.stringify(r)));
      tx.addOperation(() => {
        const tableRows = this.tables.get(table) || [];
        for (const orig of originalRows) {
          const idx = tableRows.findIndex((r) => r.id === orig.id);
          if (idx !== -1) {
            tableRows[idx] = orig;
          }
        }
      });
    }

    for (const row of matched) {
      row.updated_at = new Date();
      Object.assign(row, updateData);
    }

    return JSON.parse(JSON.stringify(matched)) as T[];
  }

  public async delete(
    table: string,
    filter: Record<string, any>,
    options?: QueryOptions
  ): Promise<number> {
    this.ensureConnected();
    const rows = this.tables.get(table) || [];
    const toDelete = rows.filter((row) => this.matchRow(row, filter));

    if (options?.transaction) {
      const tx = options.transaction as PostgresTransactionContext;
      const originalSnapshots = toDelete.map((r) => JSON.parse(JSON.stringify(r)));
      tx.addOperation(() => {
        const tableRows = this.tables.get(table) || [];
        tableRows.push(...originalSnapshots);
      });
    }

    const filtered = rows.filter((row) => !this.matchRow(row, filter));
    this.tables.set(table, filtered);

    return toDelete.length;
  }

  public async aggregate<T = any>(table: string, pipeline: any[]): Promise<T[]> {
    // Basic aggregation simulating relational GROUP BY/HAVING mappings
    this.ensureConnected();
    const rows = this.tables.get(table) || [];
    return JSON.parse(JSON.stringify(rows)) as T[];
  }

  public async transaction(): Promise<TransactionContext> {
    this.ensureConnected();
    return new PostgresTransactionContext();
  }

  public async healthCheck(): Promise<{ status: "Healthy" | "Degraded" | "Offline"; details?: any }> {
    return this.isConnected
      ? { status: "Healthy", details: { activeConnections: 3, poolSize: 10 } }
      : { status: "Offline", details: { error: "DB Client Connection offline" } };
  }

  private matchRow(row: any, filter: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(filter)) {
      if (row[key] !== value) return false;
    }
    return true;
  }
}

class PostgresTransactionContext implements TransactionContext {
  public id = `tx_pg_${Math.random().toString(36).substring(2, 11)}`;
  private rollbacks: Array<() => void> = [];

  public addOperation(rollback: () => void) {
    this.rollbacks.push(rollback);
  }

  public async commit(): Promise<void> {
    console.log(`[PostgresTransactionContext] Transaction ${this.id} committed successfully.`);
    this.rollbacks = [];
  }

  public async rollback(): Promise<void> {
    console.log(`[PostgresTransactionContext] Performing rollback on transaction ${this.id}...`);
    for (const op of this.rollbacks.reverse()) {
      try {
        op();
      } catch (err) {
        console.error("[PostgresTransactionContext] Error executing rollback step:", err);
      }
    }
    this.rollbacks = [];
  }
}
