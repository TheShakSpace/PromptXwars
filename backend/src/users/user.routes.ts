/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { userController } from "./controllers/user.controller";
import { authenticateJWT } from "../auth/guards/permissions";

const router = Router();

// Secure User and Profile Management
router.patch("/profile", authenticateJWT, userController.updateProfile);
router.patch("/preferences", authenticateJWT, userController.updatePreferences);
router.patch("/settings", authenticateJWT, userController.updateSettings);
router.post("/change-password", authenticateJWT, userController.changePassword);
router.get("/audit-logs", authenticateJWT, userController.getAuditLogs);
router.delete("/account", authenticateJWT, userController.deleteAccount);

export default router;
