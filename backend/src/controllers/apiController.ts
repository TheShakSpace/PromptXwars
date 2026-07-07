/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { ResponseFormatter } from "../utils/responseFormatter";
import { chatRequestSchema, exportRequestSchema, runWorkflowSchema, configOverrideSchema } from "../validators";
import { promptService } from "../services/promptService";
import { workflowService } from "../services/workflowService";
import { ExportService } from "../services/exportService";
import { ValidationError, NotFoundError } from "../errors/customErrors";
import { workflowEngine } from "../workflows/engine/WorkflowEngine";
import { repositoryManager } from "../database/RepositoryManager";
import path from "path";
import fs from "fs";

// Mock history memory store for backend
const cognitiveHistory: any[] = [];

export const apiController = {
  // GET /health
  health: (req: Request, res: Response) => {
    const data = {
      status: "healthy",
      uptime: process.uptime(),
      version: "1.5.0",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      systems: {
        taskQueue: "active",
        resourceManager: "active",
        promptRegistry: "nominal",
        workflowRuntime: "nominal",
      }
    };
    ResponseFormatter.success(res, "System health indexes nominal.", data);
  },

  // POST /chat
  chat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = chatRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Malformed chat request parameters", parsed.error.format());
      }

      const { message, industry = "general" } = parsed.data;

      // Map industry to real workflow template
      const activeWorkflowId = 
        industry === "clinical" ? "tpl_healthcare" :
        industry === "finance" ? "tpl_finance" :
        industry === "legal" ? "tpl_research" :
        "tpl_research";

      console.log(`[apiController] Dispatching chat request to Workflow Engine [ID: ${activeWorkflowId}]`);

      // Run real workflow
      const outputs = await workflowEngine.run(activeWorkflowId, {
        prompt: message,
        notes: message,
        query: message,
        vitals: message,
        complaint: message,
        findings: message,
        positions: message,
        assets: message,
        ticket: message,
        industry,
        category: industry
      });

      // Find the last step output to send as the main response message
      const outputKeys = Object.keys(outputs);
      const lastKey = outputKeys[outputKeys.length - 1];
      const lastOutput = outputs[lastKey];
      const finalResultText = lastOutput?.result || lastOutput?.text || JSON.stringify(lastOutput || "Executed successfully.");

      // Calculate totals/metrics
      let totalLatency = 0;
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let totalCost = 0;

      for (const val of Object.values(outputs) as any[]) {
        if (val && val.metrics) {
          totalLatency += val.metrics.latencyMs || 0;
          totalInputTokens += val.metrics.promptTokens || 0;
          totalOutputTokens += val.metrics.completionTokens || 0;
          totalCost += val.metrics.costEstimate || 0;
        }
      }

      const responseData = {
        id: `chat-${Date.now()}`,
        message: finalResultText,
        industry,
        metrics: {
          promptTokens: totalInputTokens || Math.ceil(message.length / 3),
          completionTokens: totalOutputTokens || Math.ceil(finalResultText.length / 3),
          latencyMs: totalLatency || 450,
          costEstimate: parseFloat((totalCost || 0.00015).toFixed(6)),
        }
      };

      // Save to real database (using RepositoryManager)
      try {
        await repositoryManager.chats.create({
          id: responseData.id,
          userPrompt: message,
          industry,
          timestamp: new Date().toISOString(),
          text: finalResultText,
          metrics: responseData.metrics,
        });
      } catch (dbErr) {
        console.warn("[apiController] Failed to save chat to Database:", dbErr);
      }

      // Save to local cognitive history cache
      cognitiveHistory.unshift({
        id: responseData.id,
        userPrompt: message,
        industry,
        timestamp: new Date().toISOString(),
        text: finalResultText,
        metrics: responseData.metrics,
      });

      ResponseFormatter.success(res, "Cognitive chat dispatch succeeded.", responseData);
    } catch (err) {
      next(err);
    }
  },

  // GET /templates
  getTemplates: (req: Request, res: Response) => {
    const templates = promptService.getTemplates();
    ResponseFormatter.success(res, "Prompt templates loaded successfully.", templates);
  },

  // GET /workflow
  getWorkflows: (req: Request, res: Response) => {
    const workflows = workflowService.getTemplates();
    ResponseFormatter.success(res, "Workflow engine templates loaded.", workflows);
  },

  // POST /workflow/run
  runWorkflow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = runWorkflowSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid workflow running parameters", parsed.error.format());
      }

      const { workflowId } = parsed.data;
      
      // Map workflowService id style to real templates
      const realId = workflowId.includes("clinical") ? "tpl_healthcare" :
                     workflowId.includes("portfolio") ? "tpl_finance" :
                     workflowId;

      console.log(`[apiController] Dispatching manual workflow run [ID: ${realId}]`);
      const outputs = await workflowEngine.run(realId, {
        prompt: "Manual execution trigger.",
        industry: realId === "tpl_healthcare" ? "clinical" : realId === "tpl_finance" ? "finance" : "general"
      });

      ResponseFormatter.success(res, `Workflow [${workflowId}] executed successfully.`, outputs);
    } catch (err) {
      next(err);
    }
  },

  // POST /upload
  upload: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ValidationError("No file attached to the multi-part request.");
      }

      const resource = {
        id: `res-${Date.now()}`,
        name: req.file.originalname,
        filename: req.file.filename,
        sizeBytes: req.file.size,
        mimeType: req.file.mimetype,
        uri: `/uploads/${req.file.filename}`,
        uploadedAt: new Date().toISOString(),
      };

      ResponseFormatter.success(res, "File uploaded and registered successfully.", resource);
    } catch (err) {
      next(err);
    }
  },

  // POST /export
  export: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = exportRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid export payloads", parsed.error.format());
      }

      const { type, data, fileNamePrefix } = parsed.data;
      const result = await ExportService.generateExport(type, data, fileNamePrefix);

      // We send file parameters, or we can pipe the file stream
      res.setHeader("Content-Type", result.mimeType);
      res.setHeader("Content-Disposition", `attachment; filename="${result.fileName}"`);
      
      const fileStream = fs.createReadStream(result.filePath);
      fileStream.pipe(res);
    } catch (err) {
      next(err);
    }
  },

  // GET /history
  getHistory: (req: Request, res: Response) => {
    ResponseFormatter.success(res, "Cognitive histories fetched successfully.", cognitiveHistory);
  },

  // GET /config
  getConfig: (req: Request, res: Response) => {
    const sysConfig = {
      defaultProvider: process.env.DEFAULT_MODEL_PROVIDER || "google",
      defaultModel: process.env.DEFAULT_MODEL_NAME || "gemini-2.5-flash",
      uploadLimits: {
        maxSizeMb: process.env.MAX_UPLOAD_SIZE_MB || 20,
        allowedTypes: process.env.ALLOWED_FILE_TYPES 
          ? process.env.ALLOWED_FILE_TYPES.split(",") 
          : ["image/*", "application/pdf", "text/csv", "application/json"]
      }
    };
    ResponseFormatter.success(res, "System active configs resolved.", sysConfig);
  }
};
