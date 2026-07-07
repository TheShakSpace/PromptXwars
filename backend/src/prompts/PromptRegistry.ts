/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptTemplate } from "./PromptTemplate";
import { PromptVersionManager } from "./PromptVersionManager";

export class PromptRegistry {
  private activeTemplates = new Map<string, PromptTemplate>();
  private versionManager = new PromptVersionManager();

  /**
   * Registers a prompt template dynamically.
   * Automatically backs it up in version history.
   */
  register(template: PromptTemplate): void {
    if (!template.id) {
      throw new Error("Cannot register a prompt template without a valid ID.");
    }
    
    this.activeTemplates.set(template.id, template);
    this.versionManager.saveVersion(template);
  }

  /**
   * Retrieves an active template by ID, or a specific version if requested.
   */
  get(id: string, version?: string): PromptTemplate | null {
    if (version) {
      return this.versionManager.getVersion(id, version);
    }
    return this.activeTemplates.get(id) || null;
  }

  /**
   * Deletes a template from the registry (history remains intact).
   */
  delete(id: string): boolean {
    return this.activeTemplates.delete(id);
  }

  /**
   * Searches the registered prompt templates based on keyword query, category, or tags.
   */
  search(query?: string, category?: string, tags?: string[]): PromptTemplate[] {
    let list = Array.from(this.activeTemplates.values());

    if (query) {
      const cleanQuery = query.toLowerCase().trim();
      list = list.filter((p) => 
        p.id.toLowerCase().includes(cleanQuery) ||
        p.name.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery) ||
        p.template.toLowerCase().includes(cleanQuery)
      );
    }

    if (category) {
      const cleanCategory = category.toLowerCase().trim();
      list = list.filter((p) => p.category.toLowerCase().trim() === cleanCategory);
    }

    if (tags && tags.length > 0) {
      const cleanTags = tags.map((t) => t.toLowerCase().trim());
      list = list.filter((p) => 
        p.tags.some((tag) => cleanTags.includes(tag.toLowerCase().trim()))
      );
    }

    return list;
  }

  /**
   * Returns all active templates registered.
   */
  getAll(): PromptTemplate[] {
    return Array.from(this.activeTemplates.values());
  }

  /**
   * Exposes the associated Version Manager for rollback and history access.
   */
  getVersionManager(): PromptVersionManager {
    return this.versionManager;
  }

  /**
   * Resets and clears the registry and version manager (primarily for testing).
   */
  clear(): void {
    this.activeTemplates.clear();
    this.versionManager.clear();
  }
}
