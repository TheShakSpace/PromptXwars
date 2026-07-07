/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseTool } from "../BaseTool";
import { toolRegistry } from "../registry/ToolRegistry";
import { toolPermissionManager, PermissionContext } from "../ToolPermissionManager";

export interface RoutingCriteria {
  intent?: string;
  task?: string;
  agentId?: string;
  context?: PermissionContext;
}

export class ToolRouter {
  private static instance: ToolRouter;

  private constructor() {}

  public static getInstance(): ToolRouter {
    if (!ToolRouter.instance) {
      ToolRouter.instance = new ToolRouter();
    }
    return ToolRouter.instance;
  }

  /**
   * Routes the request to the best matching enabled and authorized tool.
   */
  public route(criteria: RoutingCriteria): BaseTool | undefined {
    const candidates = toolRegistry.getEnabled();
    const authorized = candidates.filter((tool) =>
      toolPermissionManager.canExecute(tool.metadata, criteria.context)
    );

    if (authorized.length === 0) {
      return undefined;
    }

    // Sort or match tools by searching text/intent mappings
    const searchText = `${criteria.intent || ""} ${criteria.task || ""}`.toLowerCase().trim();
    if (!searchText) {
      // Fallback to highest availability / healthy status
      return this.sortByStatus(authorized)[0];
    }

    const scored = authorized.map((tool) => {
      let score = 0;
      const metadata = tool.metadata;

      // Exact name match or keyword match
      if (metadata.name.toLowerCase().includes(searchText) || searchText.includes(metadata.name.toLowerCase())) {
        score += 10;
      }

      // Keyword match on ID
      if (metadata.id.toLowerCase().includes(searchText) || searchText.includes(metadata.id.toLowerCase())) {
        score += 8;
      }

      // Description matching
      if (metadata.description.toLowerCase().includes(searchText)) {
        score += 5;
      }

      // Category matching
      if (metadata.category.toLowerCase().includes(searchText) || searchText.includes(metadata.category.toLowerCase())) {
        score += 4;
      }

      // Health status weighting
      if (metadata.status === "Healthy") {
        score += 2;
      } else if (metadata.status === "Busy" || metadata.status === "Degraded") {
        score -= 2;
      } else if (metadata.status === "Offline" || metadata.status === "Maintenance") {
        score -= 100; // heavily penalize offline tools
      }

      return { tool, score };
    });

    // Sort descending by score
    const sorted = scored.sort((a, b) => b.score - a.score);
    const topMatch = sorted[0];

    if (topMatch && topMatch.score > 0) {
      return topMatch.tool;
    }

    // Default fallback to first healthy tool
    return this.sortByStatus(authorized)[0];
  }

  private sortByStatus(tools: BaseTool[]): BaseTool[] {
    const order: Record<string, number> = {
      Healthy: 0,
      Busy: 1,
      Degraded: 2,
      Maintenance: 3,
      Offline: 4,
    };
    return [...tools].sort((a, b) => {
      const rankA = order[a.metadata.status] ?? 99;
      const rankB = order[b.metadata.status] ?? 99;
      return rankA - rankB;
    });
  }
}

export const toolRouter = ToolRouter.getInstance();
