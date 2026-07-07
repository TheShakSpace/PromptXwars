/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentTask } from "./BaseAgent";
import { agentExecutor, ExecutionOptions } from "./AgentExecutor";

export enum ExecutionMode {
  SEQUENTIAL = "sequential",
  PARALLEL = "parallel",
  CONDITIONAL = "conditional",
  PIPELINE = "pipeline"
}

export class AgentScheduler {
  private static instance: AgentScheduler;

  private constructor() {}

  static getInstance(): AgentScheduler {
    if (!AgentScheduler.instance) {
      AgentScheduler.instance = new AgentScheduler();
    }
    return AgentScheduler.instance;
  }

  /**
   * Schedules and executes a batch of tasks based on the desired ExecutionMode.
   */
  async scheduleAndRun(
    tasks: AgentTask[],
    mode: ExecutionMode = ExecutionMode.SEQUENTIAL,
    options: ExecutionOptions = {}
  ): Promise<AgentTask[]> {
    console.log(`[AgentScheduler] Starting execution of ${tasks.length} tasks in "${mode}" mode.`);

    if (tasks.length === 0) return [];

    switch (mode) {
      case ExecutionMode.SEQUENTIAL:
        return await this.runSequential(tasks, options);

      case ExecutionMode.PARALLEL:
        return await this.runParallel(tasks, options);

      case ExecutionMode.PIPELINE:
        return await this.runPipeline(tasks, options);

      case ExecutionMode.CONDITIONAL:
        return await this.runConditional(tasks, options);

      default:
        throw new Error(`Unsupported execution mode: ${mode}`);
    }
  }

  /**
   * Sequential: Executes tasks one by one, respecting dependencies if any are violated.
   */
  private async runSequential(
    tasks: AgentTask[],
    options: ExecutionOptions
  ): Promise<AgentTask[]> {
    const sortedTasks = this.topologicalSort(tasks);

    for (const task of sortedTasks) {
      // Check if any dependency failed, if so cancel this task
      const depFailed = task.dependencies.some((depId) => {
        const depTask = tasks.find((t) => t.id === depId);
        return depTask && (depTask.status === "failed" || depTask.status === "cancelled");
      });

      if (depFailed) {
        task.status = "cancelled";
        task.error = "Cancelled due to dependency failure.";
        continue;
      }

      try {
        await agentExecutor.executeTask(task, options);
      } catch (err: any) {
        console.error(`[AgentScheduler] Sequential task ${task.id} failed:`, err.message);
        if (options.failurePolicy === "abort") {
          // Cancel remaining tasks
          for (const remaining of sortedTasks) {
            if (remaining.status === "pending") {
              remaining.status = "cancelled";
            }
          }
          break;
        }
      }
    }

    return tasks;
  }

  /**
   * Parallel: Runs tasks simultaneously where dependency resolution allows.
   */
  private async runParallel(
    tasks: AgentTask[],
    options: ExecutionOptions
  ): Promise<AgentTask[]> {
    const completed = new Set<string>();
    const active = new Set<string>();
    const failed = new Set<string>();

    const runQueue = async (): Promise<void> => {
      while (true) {
        // Find runnable tasks (pending, and all dependencies are completed)
        const runnable = tasks.filter((t) => {
          if (t.status !== "pending") return false;
          if (active.has(t.id)) return false;
          return t.dependencies.every((depId) => completed.has(depId));
        });

        // If no runnable tasks, check if anything is currently running
        if (runnable.length === 0) {
          if (active.size === 0) {
            // No more work left
            break;
          }
          // Wait briefly for active tasks to complete
          await new Promise((resolve) => setTimeout(resolve, 100));
          continue;
        }

        // Trigger execution of runnable tasks concurrently
        const runPromises = runnable.map(async (task) => {
          active.add(task.id);
          try {
            await agentExecutor.executeTask(task, options);
            completed.add(task.id);
          } catch (err: any) {
            console.error(`[AgentScheduler] Parallel task ${task.id} failed:`, err.message);
            failed.add(task.id);
            // Cancel all downstream dependent tasks recursively
            this.cancelDependentTasks(task.id, tasks);
          } finally {
            active.delete(task.id);
          }
        });

        await Promise.all(runPromises);
      }
    };

    await runQueue();
    return tasks;
  }

  /**
   * Pipeline: Executes tasks where task N's result is passed as input context to task N+1.
   */
  private async runPipeline(
    tasks: AgentTask[],
    options: ExecutionOptions
  ): Promise<AgentTask[]> {
    let lastResult: any = null;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (lastResult !== null) {
        // Feed the previous result into the description or metadata of the current task
        task.description = `${task.description}\n[Pipeline Input Context from previous step]: ${
          typeof lastResult === "object" ? JSON.stringify(lastResult) : String(lastResult)
        }`;
      }

      try {
        lastResult = await agentExecutor.executeTask(task, options);
      } catch (err: any) {
        console.error(`[AgentScheduler] Pipeline broken at task ${task.id}:`, err.message);
        // Cancel all remaining tasks in the pipeline
        for (let j = i + 1; j < tasks.length; j++) {
          tasks[j].status = "cancelled";
          tasks[j].error = "Pipeline aborted due to upstream task failure.";
        }
        break;
      }
    }

    return tasks;
  }

  /**
   * Conditional: Execution path varies based on a user-provided predicate or branching condition on previous results.
   */
  private async runConditional(
    tasks: AgentTask[],
    options: ExecutionOptions
  ): Promise<AgentTask[]> {
    // Run the primary/first task
    const primary = tasks[0];
    if (!primary) return [];

    try {
      const result = await agentExecutor.executeTask(primary, options);

      // Simple branching evaluation:
      // If result contains code-related info, activate coding-related subtasks, else activate text-related subtasks.
      const resultStr = typeof result === "string" ? result.toLowerCase() : JSON.stringify(result).toLowerCase();
      const isTechnical = resultStr.includes("code") || resultStr.includes("function") || resultStr.includes("programming");

      for (let i = 1; i < tasks.length; i++) {
        const subtask = tasks[i];
        const isTechnicalSubtask = subtask.title.toLowerCase().includes("code") || subtask.description.toLowerCase().includes("code");
        
        if (isTechnical === isTechnicalSubtask) {
          await agentExecutor.executeTask(subtask, options);
        } else {
          subtask.status = "cancelled";
          subtask.error = "Bypassed by conditional branching selector.";
        }
      }
    } catch (err: any) {
      console.error(`[AgentScheduler] Conditional master task failed:`, err.message);
      for (let i = 1; i < tasks.length; i++) {
        tasks[i].status = "cancelled";
      }
    }

    return tasks;
  }

  /**
   * Helper: Topological sort for dependency management.
   */
  private topologicalSort(tasks: AgentTask[]): AgentTask[] {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const order: AgentTask[] = [];

    const visit = (task: AgentTask) => {
      if (temp.has(task.id)) {
        throw new Error(`Circular dependency detected at task ID: ${task.id}`);
      }
      if (!visited.has(task.id)) {
        temp.add(task.id);
        
        for (const depId of task.dependencies) {
          const depTask = tasks.find((t) => t.id === depId);
          if (depTask) {
            visit(depTask);
          }
        }

        temp.delete(task.id);
        visited.add(task.id);
        order.push(task);
      }
    };

    for (const task of tasks) {
      if (!visited.has(task.id)) {
        visit(task);
      }
    }

    return order;
  }

  /**
   * Recursively cancels any downstream tasks dependent on a failed task.
   */
  private cancelDependentTasks(failedTaskId: string, tasks: AgentTask[]): void {
    const dependents = tasks.filter((t) => t.dependencies.includes(failedTaskId));
    for (const dep of dependents) {
      if (dep.status === "pending") {
        dep.status = "cancelled";
        dep.error = `Cancelled due to upstream failure of task ${failedTaskId}`;
        this.cancelDependentTasks(dep.id, tasks);
      }
    }
  }
}

export const agentScheduler = AgentScheduler.getInstance();
