/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationError } from "../errors/customErrors";

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  agentId: string;
  type: "sequential" | "parallel" | "conditional";
  status: "pending" | "running" | "completed" | "failed";
  retryCount: number;
  maxRetries: number;
  timeoutMs: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "clinical" | "finance" | "legal" | "general";
  steps: WorkflowStep[];
}

export class WorkflowService {
  private templates: Map<string, WorkflowTemplate> = new Map();

  constructor() {
    this.templates.set("clinical-intake-workflow", {
      id: "clinical-intake-workflow",
      name: "Automated Clinical Intake & Audit",
      description: "Automates vital data acquisition, diagnostics reasoning, and HIPAA compliance checks.",
      category: "clinical",
      steps: [
        {
          id: "step-ocr",
          name: "Optical Metric Intake",
          description: "Perform vision OCR analysis to harvest patient vitals.",
          agentId: "agent-vision",
          type: "sequential",
          status: "pending",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 5000,
        },
        {
          id: "step-evaluation",
          name: "Synthesizing Diagnostics",
          description: "Assess metrics against local and global clinical guidelines.",
          agentId: "agent-reasoner",
          type: "sequential",
          status: "pending",
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 8000,
        },
        {
          id: "step-compliance",
          name: "HIPAA Security Check",
          description: "Audit completed report and sanitize customer identifiers.",
          agentId: "agent-reviewer",
          type: "sequential",
          status: "pending",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 5000,
        }
      ]
    });

    this.templates.set("portfolio-risk-workflow", {
      id: "portfolio-risk-workflow",
      name: "Dynamic Portfolio Risk Hedging",
      description: "Parallel data crawling, risk formula processing, and unified model compilation.",
      category: "finance",
      steps: [
        {
          id: "step-market-data",
          name: "Retrieve Market Indicators",
          description: "Mine web indexes and liquidity benchmarks.",
          agentId: "agent-research",
          type: "parallel",
          status: "pending",
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 4000,
        },
        {
          id: "step-calculator",
          name: "Run Hedging Formulas",
          description: "Calculate optimal allocation deltas via math engines.",
          agentId: "agent-coding",
          type: "parallel",
          status: "pending",
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 6000,
        },
        {
          id: "step-rebalance",
          name: "Rebalance Portfolio Yields",
          description: "Construct balanced and protected asset vectors.",
          agentId: "agent-planner",
          type: "sequential",
          status: "pending",
          retryCount: 0,
          maxRetries: 2,
          timeoutMs: 5000,
        }
      ]
    });
  }

  public getTemplates(): WorkflowTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): WorkflowTemplate | undefined {
    return this.templates.get(id);
  }

  public register(template: WorkflowTemplate): void {
    this.templates.set(template.id, template);
  }

  public async runWorkflow(id: string): Promise<WorkflowTemplate> {
    const template = this.templates.get(id);
    if (!template) {
      throw new ValidationError(`Workflow template not found: ${id}`);
    }

    // Clone the template to avoid state leaks
    const cloned: WorkflowTemplate = JSON.parse(JSON.stringify(template));

    // Simulate running the steps
    for (const step of cloned.steps) {
      step.status = "running";
      // Simulate real-time delay matching timeout or completion
      await new Promise((r) => setTimeout(r, 400));
      step.status = "completed";
    }

    return cloned;
  }
}

export const workflowService = new WorkflowService();
