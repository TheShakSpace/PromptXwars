/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { databaseController } from "../controllers/databaseController";

const router = Router();

router.get("/health", databaseController.getHealth.bind(databaseController));
router.post("/switch", databaseController.switchProvider.bind(databaseController));
router.post("/migrate", databaseController.runMigrations.bind(databaseController));

export default router;
