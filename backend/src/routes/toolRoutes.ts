/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { toolController } from "../controllers/toolController";

const router = Router();

router.get("/", toolController.getTools.bind(toolController));
router.get("/health", toolController.getHealth.bind(toolController));
router.get("/:id", toolController.getToolById.bind(toolController));
router.post("/execute", toolController.executeTool.bind(toolController));
router.post("/register", toolController.registerTool.bind(toolController));
router.post("/test", toolController.testTools.bind(toolController));

export default router;
