/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StepType } from "../types";

export interface LiveWorkflowMetrics {
  runId: string;
  workflowId: string;
  currentStepId?: string;
  currentStepTitle?: string;
  currentStepType?: StepType;
  currentAgent?: string;
  currentTool?: string;
  stepsCompleted: number;
  totalSteps: number;
  progressPercent: number;
  elapsedTimeMs: number;
  memoryUsageBytes: number;
}

export class WorkflowMonitor {
  private static instance: WorkflowMonitor;
  private activeRuns: Map<string, {
    workflowId: string;
    startTime: number;
    totalSteps: number;
    stepsCompleted: number;
    currentStepId?: string;
    currentStepTitle?: string;
    currentStepType?: StepType;
    currentAgent?: string;
    currentTool?: string;
  }> = new Map();

  private constructor() {}

  public static getInstance(): WorkflowMonitor {
    if (!WorkflowMonitor.instance) {
      WorkflowMonitor.instance = new WorkflowMonitor();
    }
    return WorkflowMonitor.instance;
  }

  /**
   * Registers a new workflow run with the monitor
   */
  public registerRun(runId: string, workflowId: string, totalSteps: number): void {
    this.activeRuns.set(runId, {
      workflowId,
      startTime: Date.now(),
      totalSteps,
      stepsCompleted: 0,
    });
  }

  /**
   * Updates progress metrics for a running workflow
   */
  public updateProgress(
    runId: string,
    stepId: string,
    stepTitle: string,
    stepType: StepType,
    agent?: string,
    tool?: string
  ): void {
    const run = this.activeRuns.get(runId);
    if (run) {
      run.currentStepId = stepId;
      run.currentStepTitle = stepTitle;
      run.currentStepType = stepType;
      run.currentAgent = agent;
      run.currentTool = tool;
    }
  }

  /**
   * Increment the completed steps count for a run
   */
  public stepCompleted(runId: string): void {
    const run = this.activeRuns.get(runId);
    if (run) {
      run.stepsCompleted++;
    }
  }

  /**
   * Removes a workflow from active tracking
   */
  public deregisterRun(runId: string): void {
    this.activeRuns.delete(runId);
  }

  /**
   * Retrieves active live metrics of a single running workflow
   */
  public getLiveMetrics(runId: string): LiveWorkflowMetrics | undefined {
    const run = this.activeRuns.get(runId);
    if (!run) return undefined;

    const stepsCompleted = run.stepsCompleted;
    const totalSteps = run.totalSteps || 1;
    const progressPercent = Math.min(Math.round((stepsCompleted / totalSteps) * 100), 100);

    return {
      runId,
      workflowId: run.workflowId,
      currentStepId: run.currentStepId,
      currentStepTitle: run.currentStepTitle,
      currentStepType: run.currentStepType,
      currentAgent: run.currentAgent,
      currentTool: run.currentTool,
      stepsCompleted,
      totalSteps,
      progressPercent,
      elapsedTimeMs: Date.now() - run.startTime,
      memoryUsageBytes: process.memoryUsage().heapUsed,
    };
  }

  /**
   * Returns live metrics for all currently running workflows
   */
  public getActiveRuns(): LiveWorkflowMetrics[] {
    return Array.from(this.activeRuns.keys()).map((runId) => this.getLiveMetrics(runId)!);
  }
}

export const workflowMonitor = WorkflowMonitor.getInstance();
export default workflowMonitor;
