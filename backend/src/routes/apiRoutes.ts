/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { apiController } from "../controllers/apiController";
import { uploadService } from "../services/uploadService";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

// Health Check
router.get("/health", apiController.health);

// Cognitive Chat Endpoint
router.post("/chat", rateLimiter, apiController.chat);

// Workflow Engines
router.get("/workflow", apiController.getWorkflows);
router.post("/workflow/run", apiController.runWorkflow);

// Multi-Part File Pipeline
router.post("/upload", uploadService.uploader.single("file"), apiController.upload);

// Data Formatted Export
router.post("/export", apiController.export);

// Prompt Templates
router.get("/templates", apiController.getTemplates);

// Cognitive History Stream
router.get("/history", apiController.getHistory);

// Active Config Indicators
router.get("/config", apiController.getConfig);

export default router;
