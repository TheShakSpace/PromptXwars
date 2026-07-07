/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toolRegistry } from "../registry/ToolRegistry";
import { ToolHealthState } from "../types";

export class ToolHealthMonitor {
  private static instance: ToolHealthMonitor;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): ToolHealthMonitor {
    if (!ToolHealthMonitor.instance) {
      ToolHealthMonitor.instance = new ToolHealthMonitor();
    }
    return ToolHealthMonitor.instance;
  }

  /**
   * Starts a background polling check on all registered tools
   */
  public startMonitoring(intervalMs = 30000): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      await this.checkAllHealth();
    }, intervalMs);

    // Prevent blocking node exit
    this.intervalId.unref?.();
    console.log(`[ToolHealthMonitor] Tool health monitor daemon started with interval: ${intervalMs}ms`);
  }

  /**
   * Stops the background polling loop
   */
  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log(`[ToolHealthMonitor] Tool health monitor daemon stopped.`);
    }
  }

  /**
   * Triggers a comprehensive health assessment for all registered tools
   */
  public async checkAllHealth(): Promise<Record<string, ToolHealthState>> {
    const results: Record<string, ToolHealthState> = {};
    const tools = toolRegistry.getAll();

    for (const tool of tools) {
      try {
        const state = await tool.healthCheck();
        tool.metadata.status = state;
        results[tool.metadata.id] = state;
      } catch (err: any) {
        console.error(`[ToolHealthMonitor] Failed checking health of ${tool.metadata.id}: ${err.message}`);
        tool.metadata.status = "Degraded";
        results[tool.metadata.id] = "Degraded";
      }
    }

    return results;
  }

  /**
   * Updates status of a tool directly (e.g., during failures or busy execution states)
   */
  public updateStatus(toolId: string, status: ToolHealthState): void {
    const tool = toolRegistry.get(toolId);
    if (tool) {
      tool.metadata.status = status;
    }
  }
}

export const toolHealthMonitor = ToolHealthMonitor.getInstance();
