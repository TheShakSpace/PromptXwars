/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from "zod";

export type ToolHealthState = "Healthy" | "Busy" | "Offline" | "Degraded" | "Maintenance";

export type ToolPermissionLevel = "Public" | "Authenticated" | "Admin" | "System" | "Agent Restricted";

export interface ToolRetryPolicy {
  maxRetries: number;
  backoffMs: number;
}

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  permissions: ToolPermissionLevel[];
  timeout: number; // in milliseconds
  retryPolicy: ToolRetryPolicy;
  supportedInput: Record<string, any>; // JSON Schema format
  supportedOutput: Record<string, any>; // JSON Schema format
  status: ToolHealthState;
}

export interface ToolExecutionResult {
  id: string; // Unique execution run ID
  tool: string; // Tool ID
  success: boolean;
  data: any;
  error?: string;
  metadata: {
    startTime: number;
    endTime: number;
    executionTimeMs: number;
    retryCount: number;
    cached?: boolean;
    [key: string]: any;
  };
  status: number; // HTTP-like status code, e.g. 200, 400, 401, 500
}

export type ToolEventType =
  | "ToolStarted"
  | "ToolCompleted"
  | "ToolFailed"
  | "ToolTimeout"
  | "ToolCancelled";

export interface ToolEvent {
  type: ToolEventType;
  toolId: string;
  executionId: string;
  timestamp: Date;
  payload?: any;
}

export type ToolEventListener = (event: ToolEvent) => void;
