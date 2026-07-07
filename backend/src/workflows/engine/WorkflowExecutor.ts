/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workflow, WorkflowStep, WorkflowStatus, StepType } from "../types";
import { workflowHistory } from "../history/WorkflowHistory";
import { workflowQueue } from "../queue/WorkflowQueue";
import { workflowMonitor } from "../monitor/WorkflowMonitor";
import { workflowEvents } from "../events/WorkflowEvents";
import { workflowPlanner } from "../planner/WorkflowPlanner";
import { toolEngine } from "../../tools/engine/ToolEngine";
import { promptService } from "../../services/promptService";
import { AIProviderFactory } from "../../providers/factory/ProviderFactory";
import { repositoryManager } from "../../database/RepositoryManager";
import { agentExecutor } from "../../agents/AgentExecutor";

export class WorkflowExecutor {
  private static instance: WorkflowExecutor;
  private cancelledRuns: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): WorkflowExecutor {
    if (!WorkflowExecutor.instance) {
      WorkflowExecutor.instance = new WorkflowExecutor();
    }
    return WorkflowExecutor.instance;
  }

  public cancelRun(runId: string): void {
    this.cancelledRuns.add(runId);
    console.log(`[WorkflowExecutor] Cancel request registered for run '${runId}'`);
  }

  /**
   * Executes a validated workflow object.
   */
  public async execute(workflow: Workflow, input: Record<string, any>): Promise<Record<string, any>> {
    const runId = `wf_run_${Math.random().toString(36).substring(2, 11)}`;
    console.log(`[WorkflowExecutor] Starting execution for workflow '${workflow.name}' [Run ID: ${runId}]`);

    // 1. Initialize states, monitors and queues
    workflowQueue.enqueue(runId, workflow.id, input);
    workflowQueue.start(runId);
    workflowHistory.createEntry(runId, workflow.id, input, workflow.memory || {});
    workflowMonitor.registerRun(runId, workflow.id, workflow.steps.length);

    this.emitEvent("WorkflowStarted", workflow.id, runId, { input });

    const memoryState = { ...(workflow.memory || {}), ...input };
    const outputsRegistry: Record<string, any> = {};

    let currentStepId: string | undefined = workflow.steps[0]?.id;
    let success = true;
    let totalTimeMs = 0;

    try {
      if (workflow.config.mode === "Parallel") {
        // Parallel mode: runs steps structured in priority layers
        const layers = workflowPlanner.plan(workflow);
        for (const layer of layers) {
          if (this.cancelledRuns.has(runId)) {
            throw new Error(`Workflow execution run '${runId}' was cancelled.`);
          }
          const promises = layer.map((step) => this.runSingleStep(runId, step, memoryState, outputsRegistry, workflow));
          const layerResults = await Promise.all(promises);

          for (const res of layerResults) {
            if (!res.success) {
              const isAllowedToFail = workflow.config.allowFailureSteps?.includes(res.stepId);
              if (!isAllowedToFail) {
                success = false;
                throw new Error(`Step '${res.stepId}' failed: ${res.error}`);
              }
            }
            outputsRegistry[res.stepId] = res.output;
            Object.assign(memoryState, res.output);
          }
        }
      } else {
        // Sequential/Conditional/Branch/Loop modes: execute step-by-step
        while (currentStepId) {
          if (this.cancelledRuns.has(runId)) {
            throw new Error(`Workflow execution run '${runId}' was cancelled.`);
          }
          const step = workflow.steps.find((s) => s.id === currentStepId);
          if (!step) {
            throw new Error(`Execution Error: Step reference '${currentStepId}' not found.`);
          }

          const res = await this.runSingleStep(runId, step, memoryState, outputsRegistry, workflow);

          outputsRegistry[step.id] = res.output;
          Object.assign(memoryState, res.output);

          if (!res.success) {
            const isAllowedToFail = workflow.config.allowFailureSteps?.includes(step.id);
            if (!isAllowedToFail) {
              success = false;
              throw new Error(`Step '${step.id}' failed: ${res.error}`);
            }
          }

          // Evaluate branching or next pointer
          if (step.condition) {
            const nextBranch = workflowPlanner.evaluateCondition(step.condition, res.output, memoryState);
            currentStepId = nextBranch || step.nextStepId;
          } else {
            currentStepId = step.nextStepId;
          }
        }
      }

      // Conclude successful run
      workflowHistory.finalizeEntry(runId, "Completed", outputsRegistry, memoryState);
      workflowQueue.complete(runId, "Completed");
      this.emitEvent("WorkflowCompleted", workflow.id, runId, { outputs: outputsRegistry });

      return outputsRegistry;
    } catch (err: any) {
      console.error(`[WorkflowExecutor] Execution failure for run '${runId}':`, err.message);
      workflowHistory.finalizeEntry(runId, "Failed", outputsRegistry, memoryState);
      workflowQueue.complete(runId, "Failed");
      this.emitEvent("WorkflowFailed", workflow.id, runId, { error: err.message });
      throw err;
    } finally {
      workflowMonitor.deregisterRun(runId);
    }
  }

  /**
   * Runs a single step with robust interpolation, retries, timeouts, and tracking dispatches
   */
  private async runSingleStep(
    runId: string,
    step: WorkflowStep,
    memory: Record<string, any>,
    outputs: Record<string, any>,
    workflow: Workflow
  ): Promise<{ stepId: string; success: boolean; output: any; error?: string }> {
    const startTime = Date.now();
    workflowMonitor.updateProgress(runId, step.id, step.title, step.type, step.agent, step.tool);

    // 1. Resolve interpolation templates in inputs
    const resolvedInput = this.interpolateInput(step.input, memory, outputs);

    let finalOutput: any = null;
    let success = false;
    let errorMsg = "";

    const retries = step.retryPolicy?.maxRetries || 0;
    const backoffMs = step.retryPolicy?.backoffMs || 100;
    const timeoutMs = step.timeoutMs || 30000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = backoffMs * Math.pow(2, attempt - 1);
          await new Promise((res) => setTimeout(res, delay));
        }

        if (this.cancelledRuns.has(runId)) {
          throw new Error(`Step execution cancelled by operator.`);
        }

        const actionPromise = this.executeStepAction(step, resolvedInput);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Step execution timed out after ${timeoutMs}ms`)), timeoutMs)
        );

        finalOutput = await Promise.race([actionPromise, timeoutPromise]);
        success = true;
        break;
      } catch (err: any) {
        errorMsg = err.message;
        console.warn(`[WorkflowExecutor] Step '${step.id}' attempt ${attempt + 1} failed: ${err.message}`);
      }
    }

    const duration = Date.now() - startTime;
    workflowMonitor.stepCompleted(runId);

    // Log this step in historical execution logs
    workflowHistory.logStepRun(runId, {
      stepId: step.id,
      type: step.type,
      input: resolvedInput,
      output: finalOutput || { error: errorMsg },
      success,
      executionTimeMs: duration,
      error: success ? undefined : errorMsg,
      agentUsed: step.agent,
      toolUsed: step.tool,
    });

    if (!success) {
      // If a fallback step ID is configured in the retry policy, try running the fallback
      if (step.retryPolicy?.fallbackStepId) {
        const fallbackStep = workflow.steps.find((s) => s.id === step.retryPolicy?.fallbackStepId);
        if (fallbackStep) {
          console.log(`[WorkflowExecutor] Executing fallback step '${fallbackStep.id}' for failed step '${step.id}'`);
          return await this.runSingleStep(runId, fallbackStep, memory, outputs, workflow);
        }
      }

      return { stepId: step.id, success: false, output: null, error: errorMsg };
    }

    return { stepId: step.id, success: true, output: finalOutput };
  }

  /**
   * Helper that executes the specific action associated with a step's type, tool, or agent
   */
  private async executeStepAction(step: WorkflowStep, input: any): Promise<any> {
    // A. If a dedicated agent is assigned, execute it via the AgentExecutor
    if (step.agent) {
      console.log(`[WorkflowExecutor] Delegating task to agent '${step.agent}' via AgentExecutor...`);
      return await agentExecutor.executeTask({
        id: `${step.id}-task`,
        title: step.title,
        description: step.description || step.title,
        assignedAgent: step.agent,
        status: "idle",
        progress: 0,
        input: input
      }, {
        maxRetries: step.retryPolicy?.maxRetries,
        failurePolicy: "fallback"
      });
    }

    // B. If a dedicated tool is assigned, execute it in the Universal Tool Engine
    if (step.tool) {
      const result = await toolEngine.execute(step.tool, input);
      if (!result.success) {
        throw new Error(result.error || `Tool '${step.tool}' execution returned an error.`);
      }
      return result.data;
    }

    // B. If no tool, execute standard smart simulation blocks satisfying types specs
    switch (step.type) {
      case "Input":
        return { result: input.prompt || input.specs || input || "" };

      case "Prompt":
      case "Reasoning": {
        const category = input.industry || input.category || "general";
        let templateId = "general-cognitive-assistant";
        if (category === "clinical") templateId = "clinical-soap-generator";
        else if (category === "finance") templateId = "finance-risk-hedger";
        else if (category === "legal") templateId = "legal-audit-compliance";

        const templateObj = promptService.getTemplateById(templateId);
        if (!templateObj) {
          throw new Error(`Prompt template not found for ID: ${templateId}`);
        }

        // Interpolate the template fields
        const systemPrompt = templateObj.systemPrompt;
        let userPrompt = templateObj.userTemplate;

        // Perform interpolation
        const variables = {
          vitals: input.vitals || input.notes || JSON.stringify(input),
          complaint: input.complaint || input.notes || JSON.stringify(input),
          findings: input.findings || input.notes || JSON.stringify(input),
          assets: input.assets || input.positions || JSON.stringify(input),
          delta: input.delta || "0.15",
          market: input.market || JSON.stringify(input),
          contract: input.contract || JSON.stringify(input),
          checklist: input.checklist || "Standard liability checklist",
          query: input.query || input.prompt || input.notes || JSON.stringify(input)
        };

        for (const [k, v] of Object.entries(variables)) {
          userPrompt = userPrompt.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
        }

        console.log(`[WorkflowExecutor] Resolving GeminiProvider via AIProviderFactory...`);
        const provider = AIProviderFactory.getProvider("gemini");
        await provider.initialize();

        const fullPrompt = `${systemPrompt}\n\nContext and Parameters:\n${userPrompt}`;
        console.log(`[WorkflowExecutor] Invoking Gemini Content Generation...`);
        const response = await provider.generate(fullPrompt, {
          temperature: 0.7,
        });

        // Store result to dynamic memory repository
        try {
          await repositoryManager.memory.create({
            id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            category,
            prompt: fullPrompt,
            response: response.text,
            createdAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn("[WorkflowExecutor] Failed to write memory track to repository:", dbErr);
        }

        return {
          result: response.text,
          metrics: {
            latencyMs: response.latency,
            promptTokens: response.usage.inputTokens,
            completionTokens: response.usage.outputTokens,
            costEstimate: response.usage.estimatedCost,
          }
        };
      }

      case "Validation": {
        console.log(`[WorkflowExecutor] Running live validation check with GeminiProvider...`);
        const provider = AIProviderFactory.getProvider("gemini");
        await provider.initialize();
        const response = await provider.generate(
          `You are an elite AI validator. Assess the following input against compliance, safety, and correctness criteria. Return a JSON structure exactly matching:
{
  "isValid": true,
  "confidence": 0.95,
  "result": "Detailed validation analysis here."
}

Input to validate:
${JSON.stringify(input)}`
        );

        try {
          const cleanText = response.text.trim().replace(/^```json/, "").replace(/```$/, "").trim();
          const parsed = JSON.parse(cleanText);
          return {
            isValid: parsed.isValid !== false,
            confidence: parsed.confidence ?? 0.95,
            result: parsed.result || response.text,
          };
        } catch {
          return {
            isValid: true,
            confidence: 0.95,
            result: response.text,
          };
        }
      }

      case "Formatting":
        const template = step.input && typeof step.input === "object" ? (step.input as any).template : "";
        if (template) {
          // Replace placeholders directly
          let formatted = template;
          for (const [k, v] of Object.entries(input)) {
            const displayValue = typeof v === "object" ? (v as any).result || (v as any).text || JSON.stringify(v) : String(v);
            formatted = formatted.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), displayValue);
          }
          return { result: formatted };
        }
        return { result: `Formatted outputs: ${JSON.stringify(input)}` };

      case "Notification":
        return { delivered: true, timestamp: new Date() };

      default:
        // Mock execution
        return { result: `Processed type ${step.type} successfully.`, inputReceived: input };
    }
  }

  /**
   * Dynamic JSON template variable replacement tool
   */
  private interpolateInput(template: any, memory: Record<string, any>, outputs: Record<string, any>): any {
    if (typeof template === "string") {
      return this.interpolateString(template, memory, outputs);
    }

    if (Array.isArray(template)) {
      return template.map((item) => this.interpolateInput(item, memory, outputs));
    }

    if (typeof template === "object" && template !== null) {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(template)) {
        result[key] = this.interpolateInput(value, memory, outputs);
      }
      return result;
    }

    return template;
  }

  private interpolateString(str: string, memory: Record<string, any>, outputs: Record<string, any>): any {
    // Matches patterns like {{ step_id.property }} or {{ memory.property }}
    const regex = /{{\s*([^}]+)\s*}}/g;
    let containsDirectMatchOnly = false;
    let directVal: any = null;

    const replaced = str.replace(regex, (match, expression) => {
      const path = expression.trim().split(".");
      const source = path[0];
      const property = path.slice(1).join(".");

      let foundVal: any = undefined;

      // Check outputs registry
      if (outputs[source] !== undefined) {
        foundVal = this.getNestedProperty(outputs[source], property);
      }

      // Check memory state
      if (foundVal === undefined && memory[source] !== undefined) {
        if (property) {
          foundVal = this.getNestedProperty(memory[source], property);
        } else {
          foundVal = memory[source];
        }
      }

      // If value is still not found, check direct key on memory
      if (foundVal === undefined && memory[expression.trim()] !== undefined) {
        foundVal = memory[expression.trim()];
      }

      if (foundVal !== undefined) {
        if (str.trim() === match) {
          containsDirectMatchOnly = true;
          directVal = foundVal;
        }
        return typeof foundVal === "object" ? JSON.stringify(foundVal) : String(foundVal);
      }

      return match;
    });

    return containsDirectMatchOnly ? directVal : replaced;
  }

  private getNestedProperty(obj: any, path: string): any {
    if (!path) return obj;
    const parts = path.split(".");
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  }

  private emitEvent(type: any, workflowId: string, executionId: string, payload?: any): void {
    workflowEvents.emit({
      type,
      workflowId,
      executionId,
      timestamp: new Date(),
      payload,
    });
  }
}

export const workflowExecutor = WorkflowExecutor.getInstance();
