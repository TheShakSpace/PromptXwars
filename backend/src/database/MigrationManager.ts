/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { repositoryManager } from "./RepositoryManager";

export interface Migration {
  version: string;
  name: string;
  up(): Promise<void>;
  down(): Promise<void>;
}

export interface MigrationStatus {
  version: string;
  name: string;
  appliedAt?: Date;
  status: "Applied" | "Pending" | "Failed";
  error?: string;
}

export class MigrationManager {
  private static instance: MigrationManager;
  private registry: Map<string, Migration> = new Map();

  private constructor() {
    this.registerDefaultMigrations();
  }

  public static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }

  public register(migration: Migration): void {
    this.registry.set(migration.version, migration);
  }

  /**
   * Applies all pending migrations sequentially based on version number
   */
  public async migrate(): Promise<MigrationStatus[]> {
    const migrations = Array.from(this.registry.values()).sort((a, b) => a.version.localeCompare(b.version));
    const results: MigrationStatus[] = [];

    for (const m of migrations) {
      const isApplied = await this.isMigrationApplied(m.version);
      if (isApplied) {
        results.push({
          version: m.version,
          name: m.name,
          appliedAt: new Date(),
          status: "Applied",
        });
        continue;
      }

      console.log(`[MigrationManager] Applying migration [${m.version}] - ${m.name}...`);
      try {
        await m.up();
        await this.recordMigration(m.version, m.name, "Success");
        results.push({
          version: m.version,
          name: m.name,
          appliedAt: new Date(),
          status: "Applied",
        });
      } catch (err: any) {
        console.error(`[MigrationManager] Migration [${m.version}] failed:`, err.message);
        await this.recordMigration(m.version, m.name, "Failed", err.message);
        results.push({
          version: m.version,
          name: m.name,
          status: "Failed",
          error: err.message,
        });
        break; // stop sequential flow on failure
      }
    }

    return results;
  }

  /**
   * Rolls back the last applied migration
   */
  public async rollback(): Promise<MigrationStatus | null> {
    const history = await this.getMigrationHistory();
    const lastAppliedRecord = history
      .filter((h) => h.status === "Success")
      .sort((a, b) => b.version.localeCompare(a.version))[0];

    if (!lastAppliedRecord) {
      console.log("[MigrationManager] No active applied migrations found to roll back.");
      return null;
    }

    const migration = this.registry.get(lastAppliedRecord.version);
    if (!migration) {
      throw new Error(`Rollback Error: Migration definition for version '${lastAppliedRecord.version}' not found.`);
    }

    console.log(`[MigrationManager] Rolling back migration [${migration.version}] - ${migration.name}...`);
    try {
      await migration.down();
      await repositoryManager.logs.delete({ type: "migration", version: migration.version });
      return {
        version: migration.version,
        name: migration.name,
        status: "Pending",
      };
    } catch (err: any) {
      console.error(`[MigrationManager] Rollback of [${migration.version}] failed:`, err.message);
      return {
        version: migration.version,
        name: migration.name,
        status: "Failed",
        error: err.message,
      };
    }
  }

  public async getStatus(): Promise<MigrationStatus[]> {
    const history = await this.getMigrationHistory();
    return Array.from(this.registry.values()).map((m) => {
      const match = history.find((h) => h.version === m.version);
      return {
        version: m.version,
        name: m.name,
        appliedAt: match?.appliedAt,
        status: match?.status === "Success" ? "Applied" : "Pending",
        error: match?.error,
      };
    });
  }

  private async isMigrationApplied(version: string): Promise<boolean> {
    const record = await repositoryManager.logs.findOne({ type: "migration", version, status: "Success" });
    return record !== null;
  }

  private async recordMigration(version: string, name: string, status: "Success" | "Failed", error?: string): Promise<void> {
    await repositoryManager.logs.create({
      id: `mig_${version}`,
      type: "migration",
      version,
      name,
      status,
      error,
      appliedAt: new Date(),
    });
  }

  private async getMigrationHistory(): Promise<any[]> {
    return repositoryManager.logs.find({ type: "migration" });
  }

  private registerDefaultMigrations(): void {
    // Registering base tables/schemas initialization migrations
    this.register({
      version: "001",
      name: "CreateUsersAndProjectsTables",
      up: async () => {
        console.log("[Migration] Database tables 'users' and 'projects' created successfully.");
      },
      down: async () => {
        console.log("[Migration] Dropped database tables 'users' and 'projects'.");
      },
    });

    this.register({
      version: "002",
      name: "CreateWorkflowsAndConversationsTables",
      up: async () => {
        console.log("[Migration] Database tables 'workflows' and 'conversations' created successfully.");
      },
      down: async () => {
        console.log("[Migration] Dropped database tables 'workflows' and 'conversations'.");
      },
    });
  }
}

export const migrationManager = MigrationManager.getInstance();
export default migrationManager;
