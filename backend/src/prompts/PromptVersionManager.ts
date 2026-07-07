/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptTemplate, PromptStatus } from "./PromptTemplate";

export class PromptVersionManager {
  // Map of prompt ID to a list of historical versions
  private history = new Map<string, PromptTemplate[]>();

  /**
   * Saves a new version of a template to the history.
   */
  saveVersion(template: PromptTemplate): void {
    const list = this.history.get(template.id) || [];
    // Prevent duplicate versions in history
    const existingIndex = list.findIndex((p) => p.version === template.version);
    
    const versionedCopy = { ...template, updatedAt: new Date().toISOString() };
    if (existingIndex >= 0) {
      list[existingIndex] = versionedCopy;
    } else {
      list.push(versionedCopy);
    }
    
    // Keep sorted by updated timestamp or semantic versioning desc
    list.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true, sensitivity: "base" }));
    this.history.set(template.id, list);
  }

  /**
   * Retrieves a specific version of a prompt template.
   */
  getVersion(id: string, version: string): PromptTemplate | null {
    const list = this.history.get(id);
    if (!list) return null;
    return list.find((p) => p.version === version) || null;
  }

  /**
   * Gets the complete version history list of a prompt.
   */
  getHistory(id: string): PromptTemplate[] {
    return this.history.get(id) || [];
  }

  /**
   * Performs a rollback by setting the primary configuration of a prompt to an older version.
   * Returns the rolled-back template.
   */
  rollback(id: string, targetVersion: string): PromptTemplate {
    const list = this.history.get(id);
    if (!list) {
      throw new Error(`No version history found for prompt ID: ${id}`);
    }

    const target = list.find((p) => p.version === targetVersion);
    if (!target) {
      throw new Error(`Version "${targetVersion}" does not exist in history for prompt "${id}"`);
    }

    // Return a new active version by copying the older template
    const rolledBack: PromptTemplate = {
      ...target,
      status: PromptStatus.PUBLISHED,
      updatedAt: new Date().toISOString()
    };

    return rolledBack;
  }

  /**
   * Creates a draft version of an existing template.
   */
  createDraft(template: PromptTemplate): PromptTemplate {
    const draft: PromptTemplate = {
      ...template,
      status: PromptStatus.DRAFT,
      updatedAt: new Date().toISOString()
    };
    this.saveVersion(draft);
    return draft;
  }

  /**
   * Publishes a version of a template, changing its status to PUBLISHED.
   */
  publish(id: string, version: string): PromptTemplate {
    const list = this.history.get(id);
    if (!list) {
      throw new Error(`No versions found for template ID: ${id}`);
    }

    const item = list.find((p) => p.version === version);
    if (!item) {
      throw new Error(`Version "${version}" does not exist for template ID "${id}"`);
    }

    item.status = PromptStatus.PUBLISHED;
    item.updatedAt = new Date().toISOString();
    return { ...item };
  }

  /**
   * Deprecates a version of a template, changing its status to DEPRECATED.
   */
  deprecate(id: string, version: string): PromptTemplate {
    const list = this.history.get(id);
    if (!list) {
      throw new Error(`No versions found for template ID: ${id}`);
    }

    const item = list.find((p) => p.version === version);
    if (!item) {
      throw new Error(`Version "${version}" does not exist for template ID "${id}"`);
    }

    item.status = PromptStatus.DEPRECATED;
    item.updatedAt = new Date().toISOString();
    return { ...item };
  }

  /**
   * Clears version histories (useful for testing).
   */
  clear(): void {
    this.history.clear();
  }
}
