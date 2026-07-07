/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryStore } from "./MemoryStore";
import { MemoryNode, WorkflowStepMemory } from "./types";

export class WorkflowMemory {
  private static instance: WorkflowMemory;

  private constructor() {}

  public static getInstance(): WorkflowMemory {
    if (!WorkflowMemory.instance) {
      WorkflowMemory.instance = new WorkflowMemory();
    }
    return WorkflowMemory.instance;
  }

  /**
   * Logs a workflow step execution state
   */
  public logStep(step: WorkflowStepMemory): MemoryNode {
    const statusSymbol = step.status === "completed" ? "✅" : step.status === "failed" ? "❌" : "⏳";
    const content = `[Workflow Step] [${step.workflowId}] - Step "${step.title}" - Status: ${statusSymbol} ${step.status.toUpperCase()}. Description: ${step.description}`;

    return memoryStore.save({
      type: "workflow",
      content,
      tags: ["workflow-step", step.workflowId, step.status],
      importance: step.status === "failed" ? 9 : 6,
      confidence: 1.0,
      workflowId: step.workflowId,
      metadata: {
        stepId: step.stepId,
        title: step.title,
        status: step.status,
        result: step.result,
        error: step.error,
        durationMs: step.durationMs,
        timestamp: step.timestamp.toISOString(),
      },
    });
  }

  /**
   * Retrieves steps executed for a workflow
   */
  public getSteps(workflowId: string): MemoryNode[] {
    return memoryStore
      .getAll()
      .filter((n) => n.type === "workflow" && n.workflowId === workflowId)
      .sort((a, b) => {
        const timeA = new Date(a.metadata.timestamp).getTime();
        const timeB = new Date(b.metadata.timestamp).getTime();
        return timeA - timeB;
      });
  }

  /**
   * Retrieves all failed steps across all workflows for debugging or agent learning
   */
  public getFailures(): MemoryNode[] {
    return memoryStore
      .getAll()
      .filter((n) => n.type === "workflow" && n.metadata.status === "failed");
  }

  /**
   * Associates a file memory payload with a workflow
   */
  public associateFile(
    workflowId: string,
    fileId: string,
    fileName: string,
    metadata: Record<string, any> = {}
  ): MemoryNode {
    return memoryStore.save({
      type: "knowledge",
      content: `[File Association] File "${fileName}" (ID: ${fileId}) is attached to workflow: ${workflowId}`,
      tags: ["file-association", workflowId, fileId],
      importance: 7,
      confidence: 1.0,
      workflowId,
      fileId,
      metadata: {
        fileName,
        fileId,
        associatedAt: new Date().toISOString(),
        ...metadata,
      },
    });
  }
}

export const workflowMemory = WorkflowMemory.getInstance();
