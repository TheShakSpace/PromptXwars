/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus =
  | "pending"
  | "planning"
  | "queued"
  | "running"
  | "waiting"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dependencies: string[]; // Task IDs that must finish first
  status: TaskStatus;
  runtime: number; // in milliseconds
  assignedAgent: string;
  retryCount: number;
  maxRetries: number;
  progress: number; // 0 to 100
  output?: string;
  error?: string;
  startedAt?: number;
}

export class TaskQueue {
  private tasks: Map<string, Task> = new Map();
  private listeners: Set<(tasks: Task[]) => void> = new Set();

  public getTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public addTask(task: Omit<Task, "runtime" | "retryCount" | "progress" | "status"> & Partial<Pick<Task, "status">>): Task {
    const newTask: Task = {
      ...task,
      status: task.status || "pending",
      runtime: 0,
      retryCount: 0,
      progress: 0,
    };
    this.tasks.set(newTask.id, newTask);
    this.notify();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): void {
    const existing = this.tasks.get(id);
    if (existing) {
      this.tasks.set(id, { ...existing, ...updates });
      this.notify();
    }
  }

  public clear(): void {
    this.tasks.clear();
    this.notify();
  }

  public removeTask(id: string): void {
    this.tasks.delete(id);
    this.notify();
  }

  /**
   * Resolves whether a task is ready to run (i.e. all dependency tasks are completed).
   */
  public isTaskReady(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;
    if (task.status !== "pending" && task.status !== "queued") return false;

    for (const depId of task.dependencies) {
      const depTask = this.tasks.get(depId);
      if (!depTask || depTask.status !== "completed") {
        return false;
      }
    }
    return true;
  }

  public subscribe(callback: (tasks: Task[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getTasks());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    const taskList = this.getTasks();
    this.listeners.forEach((listener) => listener(taskList));
  }
}

// Global instance
export const globalTaskQueue = new TaskQueue();
