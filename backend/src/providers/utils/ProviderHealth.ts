/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderHealthStatus } from "../interfaces/AIProvider.interface";

export class ProviderHealth {
  private static healthCache: Record<string, ProviderHealthStatus> = {};

  static setHealth(providerId: string, status: ProviderHealthStatus): void {
    this.healthCache[providerId] = status;
  }

  static getHealth(providerId: string): ProviderHealthStatus {
    return this.healthCache[providerId] || {
      status: "healthy",
      latency: 0,
      lastChecked: new Date().toISOString()
    };
  }

  static getAllHealth(): Record<string, ProviderHealthStatus> {
    return this.healthCache;
  }

  /**
   * Helper to measure latency of a standard operation callback.
   */
  static async measureLatency<T>(operation: () => Promise<T>): Promise<{ result: T; latency: number }> {
    const start = Date.now();
    try {
      const result = await operation();
      const latency = Date.now() - start;
      return { result, latency };
    } catch (err: any) {
      const latency = Date.now() - start;
      throw { error: err, latency };
    }
  }
}
