/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentTask, AgentHealth } from "./BaseAgent";
import { agentRouter } from "./AgentRouter";
import { agentBus } from "./AgentBus";
import { agentRegistry } from "./AgentRegistry";

export interface ExecutionOptions {
  maxRetries?: number;
  failurePolicy?: "retry" | "fallback" | "escalate" | "abort" | "rollback";
  preferredModel?: string;
  onProgress?: (progress: number) => void;
}

export class AgentExecutor {
  private static instance: AgentExecutor;

  private constructor() {}

  static getInstance(): AgentExecutor {
    if (!AgentExecutor.instance) {
      AgentExecutor.instance = new AgentExecutor();
    }
    return AgentExecutor.instance;
  }

  /**
   * High-fidelity single task execution lifecycle with integrated validation, 
   * reflection, progress tracking, and custom error policy recovery.
   */
  async executeTask(
    task: AgentTask,
    options: ExecutionOptions = {}
  ): Promise<any> {
    const policy = options.failurePolicy || "retry";
    const maxRetries = options.maxRetries !== undefined ? options.maxRetries : 2;
    let attempt = 0;

    task.status = "running";
    task.progress = 10;
    
    await agentBus.publish("TASK_STARTED", {
      taskId: task.id,
      timestamp: new Date().toISOString(),
      message: `Task "${task.title}" started.`,
      data: { task }
    });

    let currentAgent: BaseAgent;
    try {
      if (task.assignedAgent) {
        const assigned = agentRegistry.get(task.assignedAgent);
        if (assigned) {
          currentAgent = assigned;
        } else {
          currentAgent = agentRouter.route(task, options.preferredModel);
        }
      } else {
        currentAgent = agentRouter.route(task, options.preferredModel);
      }
    } catch (err: any) {
      return await this.handleTaskFailure(task, err.message, policy, maxRetries, options);
    }

    task.assignedAgent = currentAgent.metadata.id;

    while (attempt <= maxRetries) {
      try {
        console.log(`[AgentExecutor] Attempt ${attempt + 1}/${maxRetries + 1} for task "${task.title}" using agent "${currentAgent.metadata.name}"`);
        
        currentAgent.setStatus(AgentHealth.BUSY);
        task.progress = 30 + Math.min(attempt * 10, 20);

        // Run the agent's execute implementation
        const result = await currentAgent.execute(task);
        task.progress = 70;

        // Perform validation check
        const validation = await currentAgent.validate(task, result);
        if (!validation.isValid) {
          throw new Error(`Task validation failed: ${validation.reason || "Unknown constraint violation"}`);
        }

        // Perform self-reflection stage
        const reflection = await currentAgent.reflect(task, result);
        console.log(`[AgentExecutor] Agent reflection (Confidence: ${reflection.confidence}%): ${reflection.reflection}`);

        // Success Path
        task.status = "completed";
        task.progress = 100;
        task.result = result;
        
        currentAgent.recordSuccess();
        currentAgent.setStatus(AgentHealth.IDLE);

        await agentBus.publish("TASK_COMPLETED", {
          taskId: task.id,
          agentId: currentAgent.metadata.id,
          timestamp: new Date().toISOString(),
          message: `Task "${task.title}" completed successfully.`,
          data: { result, confidence: reflection.confidence, reflection: reflection.reflection }
        });

        return result;
      } catch (err: any) {
        console.error(`[AgentExecutor] Attempt ${attempt + 1} failed for task "${task.id}":`, err.message);
        currentAgent.recordError();
        
        attempt++;
        if (attempt <= maxRetries && policy === "retry") {
          // Delay briefly before retrying
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }

        // Try applying advanced fallback / escalation policies
        currentAgent.setStatus(AgentHealth.FAILED);
        return await this.handleTaskFailure(task, err.message, policy, maxRetries, options, currentAgent);
      }
    }
  }

  /**
   * Dynamic fallback router & error recovery mechanism.
   */
  private async handleTaskFailure(
    task: AgentTask,
    errorMessage: string,
    policy: string,
    maxRetries: number,
    options: ExecutionOptions,
    failedAgent?: BaseAgent
  ): Promise<any> {
    console.warn(`[AgentExecutor] Running failure policy "${policy}" for task "${task.id}"`);

    if (policy === "fallback" && (!failedAgent || failedAgent.metadata.id)) {
      // Temporarily disable the failed agent so we can route to a fallback agent
      if (failedAgent) {
        agentRegistry.disable(failedAgent.metadata.id);
      }

      try {
        const fallbackAgent = agentRouter.route(task, options.preferredModel);
        console.log(`[AgentExecutor] Fallback policy routing to Agent "${fallbackAgent.metadata.name}"`);
        
        // Re-enable the failed agent in background (since it's now just recovering or idle)
        if (failedAgent) {
          setTimeout(() => agentRegistry.enable(failedAgent.metadata.id), 2000);
        }

        // Execute task with the fallback agent
        task.assignedAgent = fallbackAgent.metadata.id;
        return await this.executeTask(task, { ...options, failurePolicy: "retry" }); // run with simple retry to prevent loop
      } catch (routingErr) {
        if (failedAgent) {
          agentRegistry.enable(failedAgent.metadata.id);
        }
        // Fallthrough to abort if routing fallback fails
      }
    }

    if (policy === "escalate") {
      console.log(`[AgentExecutor] Escalating priority for task "${task.title}"`);
      task.priority += 2; // Boost priority
      
      // Select the absolute highest priority / capability agent available
      const highPriorityAgent = agentRegistry.getEnabled()
        .sort((a, b) => b.metadata.priority - a.metadata.priority)[0];

      if (highPriorityAgent && highPriorityAgent.metadata.id !== failedAgent?.metadata.id) {
        task.assignedAgent = highPriorityAgent.metadata.id;
        return await this.executeTask(task, { ...options, failurePolicy: "retry" });
      }
    }

    if (policy === "rollback") {
      console.log(`[AgentExecutor] Executing state rollback operations for task "${task.title}"`);
      // Rollback results & states
      task.result = undefined;
      task.progress = 0;
    }

    // Default: Abort / fail
    task.status = "failed";
    task.error = errorMessage;
    task.progress = 100;

    await agentBus.publish("TASK_FAILED", {
      taskId: task.id,
      agentId: failedAgent?.metadata.id,
      timestamp: new Date().toISOString(),
      message: `Task "${task.title}" failed: ${errorMessage}`,
      data: { error: errorMessage }
    });

    throw new Error(`Task execution aborted: ${errorMessage}`);
  }
}

export const agentExecutor = AgentExecutor.getInstance();
