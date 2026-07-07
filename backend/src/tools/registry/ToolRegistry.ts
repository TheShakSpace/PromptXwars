/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseTool } from "../BaseTool";
import { ToolMetadata, ToolHealthState } from "../types";

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools = new Map<string, BaseTool>();
  private enabledTools = new Set<string>();

  private constructor() {}

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  /**
   * Registers a tool to the registry. By default, registers as enabled.
   */
  public register(tool: BaseTool): void {
    const id = tool.metadata.id;
    this.tools.set(id, tool);
    this.enabledTools.add(id);
    console.log(`[ToolRegistry] Successfully registered tool: ${tool.metadata.name} (v${tool.metadata.version}) [ID: ${id}]`);
  }

  /**
   * Unregisters/removes a tool from the registry.
   */
  public unregister(toolId: string): boolean {
    this.enabledTools.delete(toolId);
    return this.tools.delete(toolId);
  }

  /**
   * Enables an existing tool
   */
  public enable(toolId: string): boolean {
    if (this.tools.has(toolId)) {
      this.enabledTools.add(toolId);
      return true;
    }
    return false;
  }

  /**
   * Disables an existing tool, preventing execution
   */
  public disable(toolId: string): boolean {
    if (this.tools.has(toolId)) {
      this.enabledTools.delete(toolId);
      return true;
    }
    return false;
  }

  /**
   * Check if a tool is currently enabled
   */
  public isEnabled(toolId: string): boolean {
    return this.enabledTools.has(toolId);
  }

  /**
   * Retrieves a tool by ID
   */
  public get(toolId: string): BaseTool | undefined {
    return this.tools.get(toolId);
  }

  /**
   * Gets all registered tools
   */
  public getAll(): BaseTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Gets all currently enabled tools
   */
  public getEnabled(): BaseTool[] {
    return this.getAll().filter((tool) => this.isEnabled(tool.metadata.id));
  }

  /**
   * Searches and filters tools based on search terms, category, or status
   */
  public search(query: {
    term?: string;
    category?: string;
    status?: ToolHealthState;
  }): BaseTool[] {
    let list = this.getAll();

    if (query.category) {
      const catLower = query.category.toLowerCase();
      list = list.filter((t) => t.metadata.category.toLowerCase() === catLower);
    }

    if (query.status) {
      list = list.filter((t) => t.metadata.status === query.status);
    }

    if (query.term) {
      const termLower = query.term.toLowerCase();
      list = list.filter(
        (t) =>
          t.metadata.name.toLowerCase().includes(termLower) ||
          t.metadata.description.toLowerCase().includes(termLower) ||
          t.metadata.id.toLowerCase().includes(termLower)
      );
    }

    return list;
  }

  /**
   * Clears the entire registry
   */
  public clear(): void {
    this.tools.clear();
    this.enabledTools.clear();
  }
}

export const toolRegistry = ToolRegistry.getInstance();
