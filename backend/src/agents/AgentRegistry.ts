/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentHealth } from "./BaseAgent";

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents = new Map<string, BaseAgent>();
  private enabledAgents = new Set<string>();

  private constructor() {}

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  /**
   * Registers a new agent into the orchestration ecosystem.
   */
  async register(agent: BaseAgent): Promise<void> {
    const id = agent.metadata.id;
    if (this.agents.has(id)) {
      throw new Error(`Agent with ID "${id}" is already registered.`);
    }

    this.agents.set(id, agent);
    this.enabledAgents.add(id);
    await agent.initialize();
  }

  /**
   * Retrieves an agent by its ID.
   */
  get(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  /**
   * De-registers an agent from the system.
   */
  async deregister(id: string): Promise<void> {
    const agent = this.agents.get(id);
    if (agent) {
      await agent.shutdown();
      this.agents.delete(id);
      this.enabledAgents.delete(id);
    }
  }

  /**
   * Returns all registered agents.
   */
  getAll(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Returns all enabled agents.
   */
  getEnabled(): BaseAgent[] {
    return Array.from(this.agents.values()).filter((agent) =>
      this.enabledAgents.has(agent.metadata.id)
    );
  }

  /**
   * Dynamically enables an agent.
   */
  enable(id: string): void {
    if (!this.agents.has(id)) {
      throw new Error(`Cannot enable unregistered Agent: ${id}`);
    }
    this.enabledAgents.add(id);
  }

  /**
   * Dynamically disables an agent.
   */
  disable(id: string): void {
    if (!this.agents.has(id)) {
      throw new Error(`Cannot disable unregistered Agent: ${id}`);
    }
    this.enabledAgents.delete(id);
  }

  /**
   * Checks if an agent is enabled.
   */
  isEnabled(id: string): boolean {
    return this.enabledAgents.has(id);
  }

  /**
   * Resolves the health report of all registered agents.
   */
  getHealthReport() {
    return Array.from(this.agents.values()).map((agent) => ({
      id: agent.metadata.id,
      name: agent.metadata.name,
      role: agent.metadata.role,
      status: agent.getStatus(),
      enabled: this.isEnabled(agent.metadata.id),
      state: agent.getState()
    }));
  }

  /**
   * Resets the registry for testing.
   */
  clear(): void {
    this.agents.clear();
    this.enabledAgents.clear();
  }
}

export const agentRegistry = AgentRegistry.getInstance();
