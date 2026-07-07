/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentPersona } from "./AgentManager";

export interface WorkflowStep {
  id: string;
  label: string;
  agentId: string;
  status: "idle" | "running" | "completed" | "failed" | "rolled-back";
  durationMs: number;
  tokensConsumed: number;
  outputLog?: string;
  errorLog?: string;
}

export interface WorkflowPipeline {
  id: string;
  name: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: "pending" | "running" | "success" | "aborted";
  totalTokensUsed: number;
  totalCost: number;
}

export class WorkflowEngine {
  private static pipelines: Map<string, WorkflowPipeline> = new Map();

  /**
   * Compiles and initializes a dynamic workflow pipeline based on user query intent.
   */
  public static createPipeline(id: string, name: string, steps: Omit<WorkflowStep, "status" | "durationMs" | "tokensConsumed">[]): WorkflowPipeline {
    const pipeline: WorkflowPipeline = {
      id,
      name,
      steps: steps.map((s) => ({
        ...s,
        status: "idle",
        durationMs: 0,
        tokensConsumed: 0,
      })),
      currentStepIndex: 0,
      status: "pending",
      totalTokensUsed: 0,
      totalCost: 0,
    };
    this.pipelines.set(id, pipeline);
    return pipeline;
  }

  public static getPipeline(id: string): WorkflowPipeline | undefined {
    return this.pipelines.get(id);
  }

  /**
   * Simulates/Executes steps synchronously or asynchronously with custom retry and rollback mechanisms.
   */
  public static async executeStep(
    pipelineId: string,
    stepIndex: number,
    onProgressUpdate?: (p: WorkflowPipeline) => void
  ): Promise<boolean> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline || stepIndex >= pipeline.steps.length) return false;

    pipeline.status = "running";
    pipeline.currentStepIndex = stepIndex;
    const step = pipeline.steps[stepIndex];
    step.status = "running";
    if (onProgressUpdate) onProgressUpdate({ ...pipeline });

    const stepStart = Date.now();
    // Simulate real execution delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated retry and fallback parameters
    const executionSuccessful = Math.random() > 0.04; // 96% success boundary

    if (executionSuccessful) {
      step.status = "completed";
      step.durationMs = Date.now() - stepStart;
      step.tokensConsumed = Math.floor(150 + Math.random() * 200);
      step.outputLog = `Milestone [${step.label}] verified. Compliance checklists fully validated. Outputs mapped cleanly to down-stream buffers.`;
      
      pipeline.totalTokensUsed += step.tokensConsumed;
      pipeline.totalCost += (step.tokensConsumed * 0.000002); // generic micro-cents metric
    } else {
      // Automatic trigger of step recovery/rollback
      step.status = "failed";
      step.errorLog = "Vulnerabilities detected during strict validation. Triggering recovery fallback.";
      
      // Rollback logic simulation
      await new Promise((resolve) => setTimeout(resolve, 500));
      step.status = "rolled-back";
      step.outputLog = "Pipeline rolled back safely to last known secure snapshot. Executed standard fallback node successfully.";
    }

    if (stepIndex === pipeline.steps.length - 1) {
      pipeline.status = "success";
    }

    if (onProgressUpdate) onProgressUpdate({ ...pipeline });
    return step.status === "completed" || step.status === "rolled-back";
  }
}
