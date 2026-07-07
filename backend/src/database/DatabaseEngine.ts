/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatabaseProvider } from "./DatabaseProvider";
import { MongoProvider } from "./MongoProvider";
import { PostgresProvider } from "./PostgresProvider";

export class DatabaseEngine {
  private static instance: DatabaseEngine;
  private providers: Map<string, DatabaseProvider> = new Map();
  private activeProviderName = "PostgreSQL"; // default provider

  private constructor() {
    this.registerProvider(new PostgresProvider());
    this.registerProvider(new MongoProvider());
  }

  public static getInstance(): DatabaseEngine {
    if (!DatabaseEngine.instance) {
      DatabaseEngine.instance = new DatabaseEngine();
    }
    return DatabaseEngine.instance;
  }

  public registerProvider(provider: DatabaseProvider): void {
    this.providers.set(provider.name, provider);
  }

  public getActiveProvider(): DatabaseProvider {
    const provider = this.providers.get(this.activeProviderName);
    if (!provider) {
      throw new Error(`Database Engine Error: Active provider '${this.activeProviderName}' is not registered.`);
    }
    return provider;
  }

  public async switchProvider(name: string): Promise<void> {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Database Engine Error: Provider '${name}' does not exist inside register.`);
    }

    const currentProvider = this.getActiveProvider();
    await currentProvider.disconnect();

    this.activeProviderName = name;
    await provider.connect();
    console.log(`[DatabaseEngine] Successfully migrated active pointer connection to [${name}].`);
  }

  public async initialize(): Promise<void> {
    const active = this.getActiveProvider();
    await active.connect();
  }

  public async shutdown(): Promise<void> {
    for (const provider of this.providers.values()) {
      try {
        await provider.disconnect();
      } catch (err: any) {
        console.error(`[DatabaseEngine] Error disconnecting provider '${provider.name}':`, err.message);
      }
    }
  }

  public getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const databaseEngine = DatabaseEngine.getInstance();
export default databaseEngine;
