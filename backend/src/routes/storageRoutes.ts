/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { storageController } from "../controllers/storageController";

const router = Router();

router.get("/files", storageController.getFiles.bind(storageController));
router.post("/upload", storageController.upload.bind(storageController));
router.delete("/delete", storageController.deleteFile.bind(storageController));
router.post("/backup", storageController.backup.bind(storageController));
router.post("/restore", storageController.restore.bind(storageController));

export default router;
