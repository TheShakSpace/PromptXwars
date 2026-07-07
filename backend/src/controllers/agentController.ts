/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { agentManager } from "../agents/AgentManager";
import { BaseAgent, AgentHealth } from "../agents/BaseAgent";
import { ExecutionMode } from "../agents/AgentScheduler";

export class AgentController {
  /**
   * POST /api/agents/execute
   * Orchestrates a user request across multiple agents.
   */
  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { request, mode, preferredModel } = req.body;

      if (!request || typeof request !== "string") {
        res.status(400).json({ error: "Missing or invalid required 'request' body parameter." });
        return;
      }

      const executionMode = Object.values(ExecutionMode).includes(mode)
        ? (mode as ExecutionMode)
        : ExecutionMode.SEQUENTIAL;

      const result = await agentManager.executeRequest(request, executionMode, preferredModel);
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/agents
   * Retrieves all registered agents.
   */
  getAgents(req: Request, res: Response, next: NextFunction): void {
    try {
      const agents = agentManager.getRegistry().getAll().map((agent) => ({
        id: agent.metadata.id,
        name: agent.metadata.name,
        role: agent.metadata.role,
        description: agent.metadata.description,
        capabilities: agent.metadata.capabilities,
        priority: agent.metadata.priority,
        supportedModels: agent.metadata.supportedModels,
        status: agent.getStatus(),
        enabled: agentManager.getRegistry().isEnabled(agent.metadata.id)
      }));

      res.status(200).json(agents);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/agents/status
   * Retrieves live metrics of running agents and active tasks.
   */
  getStatus(req: Request, res: Response, next: NextFunction): void {
    try {
      const status = agentManager.getLiveStatus();
      res.status(200).json(status);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/agents/register
   * Dynamically registers a custom agent.
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, role, description, capabilities, priority, supportedModels } = req.body;

      if (!id || !name || !role || !description || !capabilities) {
        res.status(400).json({
          error: "Missing required registration parameters. Provide 'id', 'name', 'role', 'description', and 'capabilities'."
        });
        return;
      }

      // Create a dynamic inline agent subclassing BaseAgent
      class DynamicCustomAgent extends BaseAgent {
        async execute(task: any): Promise<string> {
          return `Dynamic Agent ${name} completed the task successfully. Context: ${task.description}`;
        }
        async validate(): Promise<{ isValid: boolean }> {
          return { isValid: true };
        }
        async reflect(): Promise<{ confidence: number; reflection: string }> {
          return { confidence: 90, reflection: "Executed custom dynamic runtime instructions." };
        }
      }

      const customAgent = new DynamicCustomAgent({
        id,
        name,
        role,
        description,
        capabilities: Array.isArray(capabilities) ? capabilities : [],
        priority: typeof priority === "number" ? priority : 5,
        supportedModels: Array.isArray(supportedModels) ? supportedModels : ["gemini-3.5-flash"]
      });

      await agentManager.getRegistry().register(customAgent);

      res.status(201).json({
        message: `Dynamic custom Agent "${name}" registered successfully.`,
        agent: {
          id: customAgent.metadata.id,
          name: customAgent.metadata.name,
          role: customAgent.metadata.role,
          capabilities: customAgent.metadata.capabilities,
          priority: customAgent.metadata.priority
        }
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/agents/test
   * Runs operational self-tests for active agents.
   */
  async test(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testReport = await agentManager.runSelfTests();
      res.status(200).json(testReport);
    } catch (err: any) {
      next(err);
    }
  }
}

export const agentController = new AgentController();
