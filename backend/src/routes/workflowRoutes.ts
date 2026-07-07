/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { workflowController } from "../controllers/workflowController";

const router = Router();

// Exact match routes FIRST
router.get("/", workflowController.getWorkflows.bind(workflowController));
router.get("/history", workflowController.getHistory.bind(workflowController));
router.get("/monitor", workflowController.getMonitor.bind(workflowController));
router.post("/run", workflowController.runWorkflow.bind(workflowController));
router.post("/create", workflowController.createWorkflow.bind(workflowController));
router.post("/import", workflowController.importWorkflow.bind(workflowController));
router.post("/test", workflowController.testWorkflows.bind(workflowController));

// Parameterized match routes LAST
router.get("/:id", workflowController.getWorkflowById.bind(workflowController));

export default router;
