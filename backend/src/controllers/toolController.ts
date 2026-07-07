/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { toolEngine } from "../tools/engine/ToolEngine";
import { toolRegistry } from "../tools/registry/ToolRegistry";
import { toolHealthMonitor } from "../tools/health/ToolHealthMonitor";
import { runAllToolTests } from "../tools/tests/ToolEngine.test";
import { BaseTool } from "../tools/BaseTool";
import { ToolHealthState } from "../tools/types";

export class ToolController {
  /**
   * GET /api/tools
   * Lists all tools (with filters for term, category and status)
   */
  async getTools(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { term, category, status } = req.query;
      const tools = toolRegistry.search({
        term: term as string,
        category: category as string,
        status: status as ToolHealthState,
      });

      const response = tools.map((t) => ({
        id: t.metadata.id,
        name: t.metadata.name,
        description: t.metadata.description,
        version: t.metadata.version,
        category: t.metadata.category,
        permissions: t.metadata.permissions,
        timeout: t.metadata.timeout,
        retryPolicy: t.metadata.retryPolicy,
        supportedInput: t.metadata.supportedInput,
        supportedOutput: t.metadata.supportedOutput,
        status: t.metadata.status,
        isEnabled: toolRegistry.isEnabled(t.metadata.id),
      }));

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/tools/:id
   * Retrieves detail metadata of a specific tool
   */
  async getToolById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tool = toolRegistry.get(id);

      if (!tool) {
        res.status(404).json({ error: `Tool with ID '${id}' not found.` });
        return;
      }

      res.status(200).json({
        id: tool.metadata.id,
        name: tool.metadata.name,
        description: tool.metadata.description,
        version: tool.metadata.version,
        category: tool.metadata.category,
        permissions: tool.metadata.permissions,
        timeout: tool.metadata.timeout,
        retryPolicy: tool.metadata.retryPolicy,
        supportedInput: tool.metadata.supportedInput,
        supportedOutput: tool.metadata.supportedOutput,
        status: tool.metadata.status,
        isEnabled: toolRegistry.isEnabled(tool.metadata.id),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/tools/execute
   * Executes a registered tool
   */
  async executeTool(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { toolId, input, options } = req.body;

      if (!toolId) {
        res.status(400).json({ error: "Missing required parameter 'toolId' in request body." });
        return;
      }

      // Extract user or agent identifiers from auth context if available
      const context = {
        userId: (req as any).user?.id,
        role: (req as any).user?.role || "user",
        agentId: options?.agentId,
      };

      const result = await toolEngine.execute(toolId, input, {
        context,
        useCache: options?.useCache,
        bypassPermissions: options?.bypassPermissions,
      });

      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/tools/register
   * Registers a dynamic custom tool
   */
  async registerTool(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, description, category, permissions, timeout, retryPolicy, supportedInput, supportedOutput } = req.body;

      if (!id || !name || !description) {
        res.status(400).json({ error: "Missing required registration parameters 'id', 'name', or 'description' in body." });
        return;
      }

      const customTool = new (class extends BaseTool {
        public readonly metadata = {
          id,
          name,
          description,
          version: "1.0.0",
          category: category || "Custom",
          permissions: Array.isArray(permissions) ? permissions : ["Authenticated"],
          timeout: typeof timeout === "number" ? timeout : 5000,
          retryPolicy: retryPolicy || { maxRetries: 2, backoffMs: 100 },
          supportedInput: supportedInput || { type: "object" },
          supportedOutput: supportedOutput || { type: "object" },
          status: "Healthy" as ToolHealthState,
        };

        public async execute(input: any): Promise<any> {
          return {
            message: `Custom tool '${name}' executed successfully.`,
            inputReceived: input,
            timestamp: new Date(),
          };
        }
      })();

      toolRegistry.register(customTool);

      res.status(201).json({
        message: `Tool '${name}' successfully registered inside the Universal Registry.`,
        metadata: customTool.metadata,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/tools/health
   * Triggers health checks on all tools and returns status overview
   */
  async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const healthReport = await toolHealthMonitor.checkAllHealth();
      res.status(200).json({
        status: "Healthy",
        timestamp: new Date(),
        tools: healthReport,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/tools/test
   * Runs the complete Universal Tool Engine test suite and reports assertions
   */
  async testTools(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await runAllToolTests();
      res.status(200).json({
        status: "success",
        message: "All Universal Tool Registry, routing, caching, validation, eventing, and exception handling tests passed successfully.",
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

export const toolController = new ToolController();
