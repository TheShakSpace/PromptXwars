/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseTool } from "../BaseTool";
import { ToolExecutionResult, ToolEvent, ToolPermissionLevel } from "../types";
import { toolEvents } from "../ToolEvents";
import { toolValidator } from "../ToolValidator";
import { toolCache } from "../ToolCache";
import { toolPermissionManager, PermissionContext } from "../ToolPermissionManager";
import { toolRegistry } from "../registry/ToolRegistry";

export class ToolExecutor {
  private static instance: ToolExecutor;

  private constructor() {}

  public static getInstance(): ToolExecutor {
    if (!ToolExecutor.instance) {
      ToolExecutor.instance = new ToolExecutor();
    }
    return ToolExecutor.instance;
  }

  /**
   * Executes a tool with robust isolation, timing, timeouts, retries, and caching support.
   */
  public async execute(
    toolId: string,
    input: any,
    options: {
      context?: PermissionContext;
      useCache?: boolean;
      bypassPermissions?: boolean;
    } = {}
  ): Promise<ToolExecutionResult> {
    const runId = `run_${Math.random().toString(36).substring(2, 11)}`;
    const startTime = Date.now();

    const tool = toolRegistry.get(toolId);
    if (!tool) {
      return this.createErrorResult(runId, toolId, `Tool '${toolId}' not found in registry.`, 404, startTime);
    }

    // Verify registration and status
    if (!toolRegistry.isEnabled(toolId)) {
      return this.createErrorResult(runId, toolId, `Tool '${toolId}' is currently disabled.`, 403, startTime);
    }

    // 1. Permission checks
    if (!options.bypassPermissions) {
      const allowed = toolPermissionManager.canExecute(tool.metadata, options.context);
      if (!allowed) {
        return this.createErrorResult(
          runId,
          toolId,
          `Execution denied. Insufficient permissions for tool '${toolId}'. Required permissions: ${tool.metadata.permissions.join(", ")}`,
          401,
          startTime
        );
      }
    }

    // 2. Cache retrieval
    const cacheKey = toolCache.makeKey(toolId, input);
    const cachedData = options.useCache !== false ? toolCache.get(cacheKey) : undefined;
    if (cachedData !== undefined) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Emit events
      this.emitEvent("ToolStarted", toolId, runId, { input, cached: true });
      this.emitEvent("ToolCompleted", toolId, runId, { output: cachedData, cached: true });

      return {
        id: runId,
        tool: toolId,
        success: true,
        data: cachedData,
        metadata: {
          startTime,
          endTime,
          executionTimeMs: executionTime,
          retryCount: 0,
          cached: true,
        },
        executionTime,
        status: 200,
      } as any;
    }

    // Emit start event
    this.emitEvent("ToolStarted", toolId, runId, { input });

    // 3. Input Validation
    let validatedInput: any;
    try {
      validatedInput = await toolValidator.validateInput(tool, input);
    } catch (err: any) {
      const errorMessage = `Input validation failed: ${err.message}`;
      this.emitEvent("ToolFailed", toolId, runId, { error: errorMessage });
      return this.createErrorResult(runId, toolId, errorMessage, 400, startTime);
    }

    // 4. Execution with Retries & Timeout
    const maxRetries = tool.metadata.retryPolicy.maxRetries;
    const backoffMs = tool.metadata.retryPolicy.backoffMs;
    const timeoutMs = tool.metadata.timeout;

    let attempt = 0;
    let output: any;
    let success = false;
    let errorMsg = "";

    while (attempt <= maxRetries) {
      try {
        if (attempt > 0) {
          // Wait before retrying (exponential backoff)
          const delay = backoffMs * Math.pow(2, attempt - 1);
          await new Promise((res) => setTimeout(res, delay));
        }

        output = await this.executeWithTimeout(tool, validatedInput, timeoutMs);
        success = true;
        break;
      } catch (err: any) {
        attempt++;
        errorMsg = err.message;
        console.warn(`[ToolExecutor] Tool '${toolId}' execution attempt ${attempt} failed: ${err.message}`);

        if (err.message === "TIMEOUT") {
          this.emitEvent("ToolTimeout", toolId, runId, { attempt, maxRetries });
        }
      }
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    if (!success) {
      this.emitEvent("ToolFailed", toolId, runId, { error: errorMsg, attempt });
      return this.createErrorResult(runId, toolId, `Tool execution failed after ${attempt} attempts. Root error: ${errorMsg}`, 500, startTime, attempt);
    }

    // 5. Output Validation
    let validatedOutput = output;
    try {
      validatedOutput = await toolValidator.validateOutput(tool, output);
    } catch (err: any) {
      console.warn(`[ToolExecutor] Output validation failed for ${toolId}: ${err.message}`);
    }

    // 6. Cache write
    toolCache.set(cacheKey, validatedOutput, 60000); // Default TTL of 60 seconds for successful responses

    this.emitEvent("ToolCompleted", toolId, runId, { output: validatedOutput });

    return {
      id: runId,
      tool: toolId,
      success: true,
      data: validatedOutput,
      metadata: {
        startTime,
        endTime,
        executionTimeMs: executionTime,
        retryCount: attempt,
      },
      executionTime,
      status: 200,
    } as any;
  }

  /**
   * Helper to execute a promise with strict timeout constraints
   */
  private executeWithTimeout(tool: BaseTool, input: any, timeoutMs: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        tool.cancel().catch(console.error);
        reject(new Error("TIMEOUT"));
      }, timeoutMs);

      tool.execute(input)
        .then((result) => {
          if (!timedOut) {
            clearTimeout(timeout);
            resolve(result);
          }
        })
        .catch((err) => {
          if (!timedOut) {
            clearTimeout(timeout);
            reject(err);
          }
        });
    });
  }

  private emitEvent(type: any, toolId: string, executionId: string, payload?: any): void {
    toolEvents.emit({
      type,
      toolId,
      executionId,
      timestamp: new Date(),
      payload,
    });
  }

  private createErrorResult(
    id: string,
    toolId: string,
    message: string,
    status: number,
    startTime: number,
    retryCount = 0
  ): ToolExecutionResult {
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    return {
      id,
      tool: toolId,
      success: false,
      data: null,
      error: message,
      metadata: {
        startTime,
        endTime,
        executionTimeMs: executionTime,
        retryCount,
      },
      executionTime,
      status,
    } as any;
  }
}

export const toolExecutor = ToolExecutor.getInstance();
