/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkflowStatus } from "../types";

export interface QueueItem {
  id: string; // runId
  workflowId: string;
  status: WorkflowStatus;
  input: Record<string, any>;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export class WorkflowQueue {
  private static instance: WorkflowQueue;
  private queue: Map<string, QueueItem> = new Map();

  private constructor() {}

  public static getInstance(): WorkflowQueue {
    if (!WorkflowQueue.instance) {
      WorkflowQueue.instance = new WorkflowQueue();
    }
    return WorkflowQueue.instance;
  }

  /**
   * Enqueues a new workflow execution request
   */
  public enqueue(runId: string, workflowId: string, input: Record<string, any>): QueueItem {
    const item: QueueItem = {
      id: runId,
      workflowId,
      status: "Pending",
      input,
      addedAt: new Date(),
    };
    this.queue.set(runId, item);
    return item;
  }

  /**
   * Transitions a queue item to running status
   */
  public start(runId: string): QueueItem | undefined {
    const item = this.queue.get(runId);
    if (item) {
      item.status = "Running";
      item.startedAt = new Date();
    }
    return item;
  }

  /**
   * Completes a queue item
   */
  public complete(runId: string, status: "Completed" | "Failed" | "Cancelled"): QueueItem | undefined {
    const item = this.queue.get(runId);
    if (item) {
      item.status = status;
      item.completedAt = new Date();
    }
    return item;
  }

  /**
   * Retrieves a queue item by ID
   */
  public get(runId: string): QueueItem | undefined {
    return this.queue.get(runId);
  }

  /**
   * Retrieves all items in the queue
   */
  public getAll(): QueueItem[] {
    return Array.from(this.queue.values());
  }

  /**
   * Returns items currently waiting to be run
   */
  public getPending(): QueueItem[] {
    return this.getAll().filter((item) => item.status === "Pending");
  }

  /**
   * Returns items currently executing
   */
  public getRunning(): QueueItem[] {
    return this.getAll().filter((item) => item.status === "Running");
  }

  /**
   * Clears the entire queue history
   */
  public clear(): void {
    this.queue.clear();
  }
}

export const workflowQueue = WorkflowQueue.getInstance();
