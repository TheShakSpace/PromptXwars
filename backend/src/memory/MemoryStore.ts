/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from "fs";
import * as path from "path";
import { MemoryNode, MemoryType } from "./types";

export class MemoryStore {
  private static instance: MemoryStore;
  private nodes: Map<string, MemoryNode> = new Map();
  private filePath: string;

  private constructor() {
    // Persistent JSON storage location
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, "universal_memory.json");
    this.loadFromDisk();
  }

  public static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  /**
   * Save a single node to memory
   */
  public save(node: Partial<MemoryNode> & { content: string; type: MemoryType }): MemoryNode {
    const id = node.id || `mem_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date();

    const existingNode = this.nodes.get(id);

    const fullNode: MemoryNode = {
      id,
      type: node.type,
      content: node.content,
      tags: node.tags || existingNode?.tags || [],
      importance: node.importance !== undefined ? node.importance : existingNode?.importance || 5,
      confidence: node.confidence !== undefined ? node.confidence : existingNode?.confidence || 0.9,
      createdAt: existingNode?.createdAt || node.createdAt || now,
      updatedAt: now,
      usageCount: existingNode ? existingNode.usageCount + 1 : node.usageCount || 0,
      userId: node.userId || existingNode?.userId,
      sessionId: node.sessionId || existingNode?.sessionId,
      agentId: node.agentId || existingNode?.agentId,
      workflowId: node.workflowId || existingNode?.workflowId,
      fileId: node.fileId || existingNode?.fileId,
      metadata: { ...(existingNode?.metadata || {}), ...(node.metadata || {}) },
      embedding: node.embedding || existingNode?.embedding,
    };

    this.nodes.set(id, fullNode);
    this.persistToDisk();
    return fullNode;
  }

  /**
   * Retrieve a node by ID
   */
  public get(id: string): MemoryNode | undefined {
    const node = this.nodes.get(id);
    if (node) {
      node.usageCount += 1;
      node.updatedAt = new Date();
      this.persistToDisk();
    }
    return node;
  }

  /**
   * Delete a node by ID
   */
  public delete(id: string): boolean {
    const deleted = this.nodes.delete(id);
    if (deleted) {
      this.persistToDisk();
    }
    return deleted;
  }

  /**
   * Clear all memories
   */
  public clear(): void {
    this.nodes.clear();
    this.persistToDisk();
  }

  /**
   * Get all memory nodes
   */
  public getAll(): MemoryNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Disk persistence operations
   */
  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(fileContent) as any[];
        
        for (const item of parsed) {
          this.nodes.set(item.id, {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          });
        }
        console.log(`[MemoryStore] Successfully loaded ${this.nodes.size} memory nodes from disk.`);
      }
    } catch (err: any) {
      console.error(`[MemoryStore] Error loading memories from disk: ${err.message}`);
    }
  }

  private persistToDisk(): void {
    try {
      const data = JSON.stringify(Array.from(this.nodes.values()), null, 2);
      fs.writeFileSync(this.filePath, data, "utf-8");
    } catch (err: any) {
      console.error(`[MemoryStore] Error writing memories to disk: ${err.message}`);
    }
  }
}

export const memoryStore = MemoryStore.getInstance();
