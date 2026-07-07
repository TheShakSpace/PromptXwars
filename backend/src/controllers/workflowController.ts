/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { workflowEngine } from "../workflows/engine/WorkflowEngine";
import { workflowManager } from "../workflows/registry/WorkflowManager";
import { workflowHistory } from "../workflows/history/WorkflowHistory";
import { workflowMonitor } from "../workflows/monitor/WorkflowMonitor";
import { workflowQueue } from "../workflows/queue/WorkflowQueue";
import { runAllWorkflowTests } from "../workflows/tests/WorkflowEngine.test";

export class WorkflowController {
  /**
   * GET /api/workflows
   * Lists all registered workflows (including pre-loaded templates)
   */
  async getWorkflows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = workflowManager.getAll();
      const response = list.map((w) => ({
        id: w.id,
        name: w.name,
        description: w.description,
        version: w.version,
        author: w.author,
        stepsCount: w.steps.length,
        config: w.config,
        metadata: w.metadata,
      }));
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/workflows/:id
   * Retrieves full definition detail of a workflow
   */
  async getWorkflowById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workflow = workflowManager.get(id);

      if (!workflow) {
        res.status(404).json({ error: `Workflow with ID '${id}' not found.` });
        return;
      }

      res.status(200).json(workflow);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/workflows/run
   * Triggers execution of a workflow or sequential pipeline of workflows
   */
  async runWorkflow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workflowId, workflowIds, input } = req.body;

      if (!workflowId && (!workflowIds || workflowIds.length === 0)) {
        res.status(400).json({ error: "Missing required parameter 'workflowId' or 'workflowIds' in request body." });
        return;
      }

      const initialInput = input || {};

      // A. If a sequential pipeline of multiple workflows is requested (A -> B)
      if (workflowIds && workflowIds.length > 0) {
        const pipelineResult = await workflowEngine.runPipeline(workflowIds, initialInput);
        res.status(pipelineResult.success ? 200 : 500).json(pipelineResult);
        return;
      }

      // B. If a single workflow is requested
      const output = await workflowEngine.run(workflowId, initialInput);
      res.status(200).json({
        success: true,
        workflowId,
        outputs: output,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  /**
   * POST /api/workflows/create
   * Creates/registers a new custom workflow definition dynamically
   */
  async createWorkflow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workflowData = req.body;

      if (!workflowData.id || !workflowData.name || !workflowData.steps) {
        res.status(400).json({ error: "Missing required parameters 'id', 'name', or 'steps' in request body." });
        return;
      }

      workflowManager.register(workflowData);

      res.status(201).json({
        message: `Workflow '${workflowData.name}' successfully registered inside the Universal Registry.`,
        workflow: workflowManager.get(workflowData.id),
      });
    } catch (err: any) {
      res.status(400).json({ error: `Validation failed: ${err.message}` });
    }
  }

  /**
   * POST /api/workflows/import
   * Imports a workflow definition from raw string content (JSON or YAML)
   */
  async importWorkflow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { content, format } = req.body;

      if (!content) {
        res.status(400).json({ error: "Missing required parameter 'content' in request body." });
        return;
      }

      const detectedFormat = format || (content.trim().startsWith("{") ? "json" : "yaml");
      const workflow = workflowManager.importWorkflow(content, detectedFormat);

      res.status(201).json({
        message: `Workflow '${workflow.name}' successfully parsed and imported.`,
        workflow,
      });
    } catch (err: any) {
      res.status(400).json({ error: `Import parsing failed: ${err.message}` });
    }
  }

  /**
   * GET /api/workflows/history
   * Retrieves full execution records history
   */
  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = workflowHistory.getAll();
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/workflows/monitor
   * Retrieves live metrics of running workflows and process parameters
   */
  async getMonitor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeRuns = workflowMonitor.getActiveRuns();
      res.status(200).json({
        activeCount: activeRuns.length,
        runs: activeRuns,
        queue: {
          pending: workflowQueue.getPending().length,
          running: workflowQueue.getRunning().length,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/workflows/test
   * Runs the complete Universal Workflow Engine test suite and reports assertions
   */
  async testWorkflows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await runAllWorkflowTests();
      res.status(200).json({
        status: "success",
        message: "All Universal Workflow Registry, validation, cycle detection, sequential routing, condition branching, step retries, and sequential pipelines tests passed successfully.",
      });
    } catch (err: any) {
      res.status(500).json({
        status: "failed",
        error: err.message,
        stack: err.stack,
      });
    }
  }
}

export const workflowController = new WorkflowController();
