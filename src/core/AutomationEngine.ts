/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskPriority, TaskStatus } from "./TaskQueue";

export type WorkflowType = "sequential" | "parallel" | "conditional";

export interface AutomationStep {
  id: string;
  title: string;
  description: string;
  agentId: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: WorkflowType;
  dependencies: string[];
  retryCount: number;
  maxRetries: number;
  timeoutMs: number;
  condition?: (context: any) => boolean;
  nextStepIds?: string[]; // Conditional branch mappings
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  steps: AutomationStep[];
  status: "idle" | "running" | "success" | "failed" | "cancelled";
  currentStepIndex: number;
  context: Record<string, any>;
  startedAt?: number;
}

export class AutomationEngine {
  private workflows: Map<string, AutomationWorkflow> = new Map();
  private listeners: Set<(workflows: AutomationWorkflow[]) => void> = new Set();

  constructor() {
    // Seed default automated agent workflow templates
    
    // 1. Clinical Intake & Audit (Sequential)
    this.register({
      id: "clinical-intake-workflow",
      name: "Automated Clinical Intake & Audit",
      status: "idle",
      currentStepIndex: 0,
      context: {},
      steps: [
        {
          id: "step-ocr",
          title: "Optical Metric Intake",
          description: "Perform vision OCR analysis to harvest patient vitals.",
          agentId: "agent-vision",
          priority: "high",
          status: "pending",
          type: "sequential",
          dependencies: [],
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 5000,
        },
        {
          id: "step-evaluation",
          title: "Synthesizing Diagnostics",
          description: "Assess metrics against local and global clinical guidelines.",
          agentId: "agent-reasoner",
          priority: "critical",
          status: "pending",
          type: "sequential",
          dependencies: ["step-ocr"],
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 8000,
        },
        {
          id: "step-compliance",
          title: "HIPAA Security Check",
          description: "Audit completed report and sanitize customer identifiers.",
          agentId: "agent-reviewer",
          priority: "high",
          status: "pending",
          type: "sequential",
          dependencies: ["step-evaluation"],
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 5000,
        },
      ]
    });

    // 2. Portfolio Risk Hedging (Parallel execution)
    this.register({
      id: "portfolio-risk-workflow",
      name: "Dynamic Portfolio Risk Hedging",
      status: "idle",
      currentStepIndex: 0,
      context: {},
      steps: [
        {
          id: "step-market-data",
          title: "Retrieve Market Indicators",
          description: "Mine web indexes and liquidity benchmarks.",
          agentId: "agent-research",
          priority: "medium",
          status: "pending",
          type: "parallel",
          dependencies: [],
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 4000,
        },
        {
          id: "step-calculator",
          title: "Run Hedging Formulas",
          description: "Calculate optimal allocation deltas via math engines.",
          agentId: "agent-coding",
          priority: "high",
          status: "pending",
          type: "parallel",
          dependencies: [],
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 6000,
        },
        {
          id: "step-rebalance",
          title: "Rebalance Portfolio Yields",
          description: "Construct balanced and protected asset vectors.",
          agentId: "agent-planner",
          priority: "high",
          status: "pending",
          type: "sequential",
          dependencies: ["step-market-data", "step-calculator"],
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 5000,
        }
      ]
    });
  }

  public getWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  public register(workflow: AutomationWorkflow): void {
    this.workflows.set(workflow.id, workflow);
    this.notify();
  }

  public updateWorkflow(id: string, updates: Partial<AutomationWorkflow>): void {
    const existing = this.workflows.get(id);
    if (existing) {
      this.workflows.set(id, { ...existing, ...updates });
      this.notify();
    }
  }

  public subscribe(callback: (workflows: AutomationWorkflow[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getWorkflows());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    const list = this.getWorkflows();
    this.listeners.forEach((listener) => listener(list));
  }
}

// Global instance
export const globalAutomationEngine = new AutomationEngine();
