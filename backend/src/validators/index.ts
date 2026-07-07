/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  industry: z.enum(["clinical", "finance", "legal", "general"]).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
});

export const exportRequestSchema = z.object({
  type: z.enum(["json", "csv", "markdown", "pdf"]),
  data: z.any(),
  fileNamePrefix: z.string().optional(),
});

export const runWorkflowSchema = z.object({
  workflowId: z.string().min(1, "workflowId is required"),
});

export const configOverrideSchema = z.object({
  concurrency: z.number().min(1).max(10).optional(),
  maxRetries: z.number().min(1).max(5).optional(),
  timeoutSeconds: z.number().min(5).max(300).optional(),
});
