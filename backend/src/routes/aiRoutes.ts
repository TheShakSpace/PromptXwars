/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { aiController } from "../controllers/aiController";

const router = Router();

router.post("/chat", aiController.chat.bind(aiController));
router.post("/stream", aiController.stream.bind(aiController));
router.post("/vision", aiController.vision.bind(aiController));
router.post("/reason", aiController.reason.bind(aiController));
router.post("/embed", aiController.embed.bind(aiController));
router.get("/models", aiController.models.bind(aiController));
router.get("/providers", aiController.providers.bind(aiController));
router.get("/health", aiController.health.bind(aiController));

export default router;
