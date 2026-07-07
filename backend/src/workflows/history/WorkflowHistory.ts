/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkflowHistoryEntry, WorkflowStatus, StepType } from "../types";

export class WorkflowHistory {
  private static instance: WorkflowHistory;
  private entries: Map<string, WorkflowHistoryEntry> = new Map();

  private constructor() {}

  public static getInstance(): WorkflowHistory {
    if (!WorkflowHistory.instance) {
      WorkflowHistory.instance = new WorkflowHistory();
    }
    return WorkflowHistory.instance;
  }

  /**
   * Begins tracking a new workflow execution run
   */
  public createEntry(runId: string, workflowId: string, inputs: Record<string, any>, initialMemoryState: Record<string, any> = {}): WorkflowHistoryEntry {
    const entry: WorkflowHistoryEntry = {
      id: runId,
      workflowId,
      inputs,
      outputs: {},
      status: "Pending",
      stepsRun: [],
      startTime: new Date(),
      agentsUsed: [],
      toolsUsed: [],
      errors: [],
      memoryState: JSON.parse(JSON.stringify(initialMemoryState)),
    };

    this.entries.set(runId, entry);
    return entry;
  }

  /**
   * Updates an active workflow history entry's status
   */
  public updateStatus(runId: string, status: WorkflowStatus): void {
    const entry = this.entries.get(runId);
    if (entry) {
      entry.status = status;
    }
  }

  /**
   * Logs a single completed step execution within the workflow
   */
  public logStepRun(
    runId: string,
    stepLog: {
      stepId: string;
      type: StepType;
      input: any;
      output: any;
      success: boolean;
      executionTimeMs: number;
      error?: string;
      agentUsed?: string;
      toolUsed?: string;
    }
  ): void {
    const entry = this.entries.get(runId);
    if (entry) {
      entry.stepsRun.push({
        stepId: stepLog.stepId,
        type: stepLog.type,
        input: stepLog.input,
        output: stepLog.output,
        success: stepLog.success,
        executionTimeMs: stepLog.executionTimeMs,
        error: stepLog.error,
      });

      if (stepLog.agentUsed && !entry.agentsUsed.includes(stepLog.agentUsed)) {
        entry.agentsUsed.push(stepLog.agentUsed);
      }
      if (stepLog.toolUsed && !entry.toolsUsed.includes(stepLog.toolUsed)) {
        entry.toolsUsed.push(stepLog.toolUsed);
      }
      if (stepLog.error) {
        entry.errors.push(`Step [${stepLog.stepId}] failed: ${stepLog.error}`);
      }
    }
  }

  /**
   * Concludes a workflow execution run, logging its final output status and saving memory snapshot
   */
  public finalizeEntry(runId: string, status: WorkflowStatus, outputs: Record<string, any>, memoryStateSnapshot: Record<string, any>): WorkflowHistoryEntry | undefined {
    const entry = this.entries.get(runId);
    if (entry) {
      entry.status = status;
      entry.outputs = outputs;
      entry.endTime = new Date();
      entry.executionTimeMs = entry.endTime.getTime() - entry.startTime.getTime();
      entry.memoryState = JSON.parse(JSON.stringify(memoryStateSnapshot));
      return entry;
    }
    return undefined;
  }

  /**
   * Retrieves a single history entry by execution ID
   */
  public get(runId: string): WorkflowHistoryEntry | undefined {
    return this.entries.get(runId);
  }

  /**
   * Gets all historical workflow records
   */
  public getAll(): WorkflowHistoryEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  /**
   * Gets history entries for a specific workflow
   */
  public getByWorkflowId(workflowId: string): WorkflowHistoryEntry[] {
    return this.getAll().filter((entry) => entry.workflowId === workflowId);
  }

  /**
   * Clears the entire historical execution store
   */
  public clear(): void {
    this.entries.clear();
  }
}

export const workflowHistory = WorkflowHistory.getInstance();
