/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { agentController } from "../controllers/agentController";

const router = Router();

router.post("/execute", agentController.execute.bind(agentController));
router.get("/", agentController.getAgents.bind(agentController));
router.get("/status", agentController.getStatus.bind(agentController));
router.post("/register", agentController.register.bind(agentController));
router.post("/test", agentController.test.bind(agentController));

export default router;
