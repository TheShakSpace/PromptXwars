/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolMetadata, ToolPermissionLevel } from "./types";

export interface PermissionContext {
  userId?: string;
  role?: "user" | "admin" | "system";
  agentId?: string;
}

export class ToolPermissionManager {
  private static instance: ToolPermissionManager;

  private constructor() {}

  public static getInstance(): ToolPermissionManager {
    if (!ToolPermissionManager.instance) {
      ToolPermissionManager.instance = new ToolPermissionManager();
    }
    return ToolPermissionManager.instance;
  }

  /**
   * Evaluates if the current context has adequate authorization to execute a tool.
   */
  public canExecute(toolMetadata: ToolMetadata, context: PermissionContext = {}): boolean {
    const permissions = toolMetadata.permissions;

    // If tool specifies no permissions required, or includes Public, allow anyone
    if (permissions.length === 0 || permissions.includes("Public")) {
      return true;
    }

    // System tasks bypass all security boundaries
    if ((context.role as string) === "system") {
      return true;
    }

    // Check System permission requirement
    if (permissions.includes("System") && (context.role as string) !== "system") {
      return false;
    }

    // Check Admin permission requirement
    if (permissions.includes("Admin") && (context.role as string) !== "admin") {
      return false;
    }

    // Check Authenticated requirement
    if (permissions.includes("Authenticated")) {
      if (!context.userId && !context.agentId) {
        return false;
      }
    }

    // Check Agent Restricted requirement
    if (permissions.includes("Agent Restricted")) {
      if (!context.agentId) {
        return false;
      }
    }

    return true;
  }
}

export const toolPermissionManager = ToolPermissionManager.getInstance();
