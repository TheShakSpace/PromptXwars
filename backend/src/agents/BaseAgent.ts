/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContextPayload } from "../prompts/ContextInjector";

export enum AgentHealth {
  IDLE = "idle",
  BUSY = "busy",
  OFFLINE = "offline",
  FAILED = "failed",
  RECOVERING = "recovering"
}

export interface AgentMetadata {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  priority: number; // Higher number = higher priority
  supportedModels: string[];
}

export interface AgentState {
  status: AgentHealth;
  lastActive: string;
  errorCount: number;
  completedTasksCount: number;
  currentTaskId?: string;
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  priority: number;
  dependencies: string[]; // List of parent task IDs
  assignedAgent?: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress: number; // 0 to 100
  result?: any;
  error?: string;
}

export abstract class BaseAgent {
  readonly metadata: AgentMetadata;
  protected state: AgentState;
  protected context: ContextPayload = {};
  protected memory: string[] = [];

  constructor(metadata: AgentMetadata) {
    this.metadata = metadata;
    this.state = {
      status: AgentHealth.OFFLINE,
      lastActive: new Date().toISOString(),
      errorCount: 0,
      completedTasksCount: 0
    };
  }

  /**
   * Initializes the agent's internal state, dependencies, or connections.
   */
  async initialize(): Promise<void> {
    this.state.status = AgentHealth.IDLE;
    this.state.lastActive = new Date().toISOString();
    console.log(`[Agent: ${this.metadata.name}] Initialized successfully.`);
  }

  /**
   * Shuts down the agent safely.
   */
  async shutdown(): Promise<void> {
    this.state.status = AgentHealth.OFFLINE;
    this.state.lastActive = new Date().toISOString();
    console.log(`[Agent: ${this.metadata.name}] Shut down.`);
  }

  /**
   * Main execution cycle for a task.
   */
  abstract execute(task: AgentTask): Promise<any>;

  /**
   * Validates the execution results of a task to ensure quality control.
   */
  abstract validate(task: AgentTask, result: any): Promise<{ isValid: boolean; reason?: string }>;

  /**
   * Self-reflection stage allowing the agent to evaluate its own output quality and suggest corrections.
   */
  abstract reflect(task: AgentTask, result: any): Promise<{ confidence: number; reflection: string }>;

  // --- Getters & Context Setters ---

  getStatus(): AgentHealth {
    return this.state.status;
  }

  setStatus(status: AgentHealth): void {
    this.state.status = status;
    this.state.lastActive = new Date().toISOString();
  }

  getState(): AgentState {
    return { ...this.state };
  }

  setContext(context: ContextPayload): void {
    this.context = { ...this.context, ...context };
  }

  getContext(): ContextPayload {
    return this.context;
  }

  addMemory(fact: string): void {
    this.memory.push(fact);
  }

  getMemory(): string[] {
    return [...this.memory];
  }

  clearMemory(): void {
    this.memory = [];
  }

  recordError(): void {
    this.state.errorCount++;
    this.state.lastActive = new Date().toISOString();
  }

  recordSuccess(): void {
    this.state.completedTasksCount++;
    this.state.lastActive = new Date().toISOString();
  }
}
