/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { promptController } from "../controllers/promptController";

const router = Router();

router.get("/", promptController.getPrompts.bind(promptController));
router.get("/:id", promptController.getPromptById.bind(promptController));
router.post("/", promptController.registerPrompt.bind(promptController));
router.post("/render", promptController.renderPrompt.bind(promptController));
router.post("/evaluate", promptController.evaluatePrompt.bind(promptController));
router.post("/optimize", promptController.optimizePrompt.bind(promptController));
router.post("/version", promptController.manageVersion.bind(promptController));

export default router;
