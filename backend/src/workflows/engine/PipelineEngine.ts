/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { workflowEngine } from "./WorkflowEngine";

export interface PipelineResult {
  pipelineId: string;
  success: boolean;
  history: Array<{
    workflowId: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    success: boolean;
    executionTimeMs: number;
    error?: string;
  }>;
  finalOutputs: Record<string, any>;
  totalTimeMs: number;
}

export class PipelineEngine {
  private static instance: PipelineEngine;

  private constructor() {}

  public static getInstance(): PipelineEngine {
    if (!PipelineEngine.instance) {
      PipelineEngine.instance = new PipelineEngine();
    }
    return PipelineEngine.instance;
  }

  /**
   * Executes multiple workflow IDs as a cascading sequentially nested pipeline (A -> B -> C)
   */
  public async executePipeline(workflowIds: string[], initialInput: Record<string, any>): Promise<PipelineResult> {
    const pipelineId = `pipe_${Math.random().toString(36).substring(2, 11)}`;
    const startTime = Date.now();
    const history: PipelineResult["history"] = [];
    
    console.log(`[PipelineEngine] Initializing Pipeline '${pipelineId}' for cascading workflows: [${workflowIds.join(" -> ")}]`);

    let currentInput = { ...initialInput };
    let success = true;

    for (const wId of workflowIds) {
      const stepStartTime = Date.now();
      try {
        console.log(`[PipelineEngine] Pipeline '${pipelineId}' executing nested workflow step: ${wId}...`);
        const outputs = await workflowEngine.run(wId, currentInput);
        
        history.push({
          workflowId: wId,
          inputs: { ...currentInput },
          outputs,
          success: true,
          executionTimeMs: Date.now() - stepStartTime,
        });

        // Cascades outputs directly as inputs for the subsequent workflows in sequence
        currentInput = { ...currentInput, ...outputs };
      } catch (err: any) {
        success = false;
        history.push({
          workflowId: wId,
          inputs: { ...currentInput },
          outputs: {},
          success: false,
          executionTimeMs: Date.now() - stepStartTime,
          error: err.message,
        });

        console.error(`[PipelineEngine] Pipeline '${pipelineId}' failed at nested workflow '${wId}': ${err.message}`);
        break;
      }
    }

    return {
      pipelineId,
      success,
      history,
      finalOutputs: currentInput,
      totalTimeMs: Date.now() - startTime,
    };
  }
}

export const pipelineEngine = PipelineEngine.getInstance();
