/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { workflowManager } from "../registry/WorkflowManager";
import { workflowExecutor } from "./WorkflowExecutor";
import { workflowScheduler } from "../scheduler/WorkflowScheduler";
import { workflowHistory } from "../history/WorkflowHistory";
import { workflowMonitor } from "../monitor/WorkflowMonitor";
import { workflowQueue } from "../queue/WorkflowQueue";
import { pipelineEngine, PipelineResult } from "./PipelineEngine";
import { workflowEvents } from "../events/WorkflowEvents";
import { Workflow } from "../types";

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  /**
   * Boots the workflow engine registry, registers default templates and loads schedulers
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("[WorkflowEngine] Initializing Universal Workflow Engine & State Manager...");
    
    // Warm up the manager (this triggers loadTemplates() internally)
    workflowManager.getAll();

    this.isInitialized = true;
    console.log("[WorkflowEngine] Universal Workflow Engine fully loaded.");
  }

  /**
   * Shuts down all monitoring, triggers, and scheduled recurring jobs cleanly
   */
  public async shutdown(): Promise<void> {
    workflowScheduler.clear();
    workflowQueue.clear();
    workflowMonitor.getActiveRuns().forEach((r) => workflowMonitor.deregisterRun(r.runId));
    this.isInitialized = false;
    console.log("[WorkflowEngine] Universal Workflow Engine gracefully shut down.");
  }

  /**
   * Executes a workflow by its registered ID or definition
   */
  public async run(workflowIdOrDef: string | Workflow, input: Record<string, any> = {}): Promise<Record<string, any>> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    let workflow: Workflow | undefined;

    if (typeof workflowIdOrDef === "string") {
      workflow = workflowManager.get(workflowIdOrDef);
      if (!workflow) {
        throw new Error(`Workflow with ID '${workflowIdOrDef}' not found inside registered store.`);
      }
    } else {
      workflow = workflowIdOrDef;
    }

    return await workflowExecutor.execute(workflow, input);
  }

  /**
   * Executes a sequential pipeline of workflows cascading outputs as inputs (Workflow A -> Workflow B -> Workflow C)
   */
  public async runPipeline(workflowIds: string[], initialInput: Record<string, any> = {}): Promise<PipelineResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await pipelineEngine.executePipeline(workflowIds, initialInput);
  }
}

export const workflowEngine = WorkflowEngine.getInstance();
export default workflowEngine;
