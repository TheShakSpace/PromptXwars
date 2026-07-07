/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { agentRegistry, AgentRegistry } from "./AgentRegistry";
import { agentCoordinator, AgentCoordinator, OrchestrationResult, ExecutionProgress } from "./AgentCoordinator";
import { agentBus } from "./AgentBus";
import { BaseAgent, AgentTask } from "./BaseAgent";
import { ExecutionMode } from "./AgentScheduler";

export class AgentManager {
  private static instance: AgentManager;

  private constructor() {}

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  /**
   * Retrieves the dynamic system-wide registry.
   */
  getRegistry(): AgentRegistry {
    return agentRegistry;
  }

  /**
   * Retrieves the master execution coordinator.
   */
  getCoordinator(): AgentCoordinator {
    return agentCoordinator;
  }

  /**
   * Executes a user request through the multi-agent planning & coordination pipeline.
   */
  async executeRequest(
    userRequest: string,
    mode: ExecutionMode = ExecutionMode.SEQUENTIAL,
    preferredModel?: string
  ): Promise<OrchestrationResult> {
    return await agentCoordinator.execute(userRequest, mode, preferredModel);
  }

  /**
   * Retrieves live metrics of running agents and active tasks.
   */
  getLiveStatus(): {
    progress: ExecutionProgress;
    registryHealth: any[];
  } {
    return {
      progress: agentCoordinator.getProgress(),
      registryHealth: agentRegistry.getHealthReport()
    };
  }

  /**
   * Triggers high-fidelity self-test verification of registered agent capabilities.
   */
  async runSelfTests(): Promise<{
    passed: boolean;
    reports: Array<{ agentId: string; status: "success" | "failed"; error?: string }>;
  }> {
    const agents = agentRegistry.getEnabled();
    const reports: Array<{ agentId: string; status: "success" | "failed"; error?: string }> = [];

    console.log(`[AgentManager] Initiating operational self-test for ${agents.length} enabled agents...`);

    for (const agent of agents) {
      if (agent.metadata.id === "planner-agent") continue; // Planner requires recursive checks

      const testTask: AgentTask = {
        id: `test_${agent.metadata.id}`,
        title: `Self-Test Task for ${agent.metadata.name}`,
        description: `Verify operational status and capabilities: ${agent.metadata.capabilities.join(", ")}`,
        priority: 1,
        dependencies: [],
        status: "pending",
        progress: 0
      };

      try {
        const result = await agent.execute(testTask);
        const validation = await agent.validate(testTask, result);
        if (!validation.isValid) {
          throw new Error(`Self-test validation failed: ${validation.reason}`);
        }
        reports.push({ agentId: agent.metadata.id, status: "success" });
      } catch (err: any) {
        reports.push({ agentId: agent.metadata.id, status: "failed", error: err.message });
      }
    }

    const passed = reports.every((r) => r.status === "success");
    return { passed, reports };
  }

  /**
   * Resets registry and clears coordinator task histories.
   */
  async resetAll(): Promise<void> {
    agentRegistry.clear();
    agentBus.clear();
    console.log("[AgentManager] Multi-agent ecosystem state cleared.");
  }
}

export const agentManager = AgentManager.getInstance();
