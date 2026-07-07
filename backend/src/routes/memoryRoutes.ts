/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { memoryController } from "../controllers/memoryController";

const router = Router();

router.get("/", memoryController.getMemories.bind(memoryController));
router.post("/save", memoryController.saveMemory.bind(memoryController));
router.post("/search", memoryController.searchMemory.bind(memoryController));
router.post("/compress", memoryController.compressSession.bind(memoryController));
router.post("/test", memoryController.testMemory.bind(memoryController));
router.delete("/:id", memoryController.deleteMemory.bind(memoryController));

export default router;
