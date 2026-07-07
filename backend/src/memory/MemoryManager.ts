/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryStore } from "./MemoryStore";
import { semanticMemory } from "./SemanticMemory";
import { memoryRetriever } from "./MemoryRetriever";
import { memoryGraph } from "./MemoryGraph";
import { memoryIndexer } from "./MemoryIndexer";
import { memoryCompressor } from "./MemoryCompressor";
import { conversationMemory } from "./ConversationMemory";
import { workflowMemory } from "./WorkflowMemory";
import { MemoryNode, MemorySearchQuery, MemoryType } from "./types";

export class MemoryManager {
  private static instance: MemoryManager;

  private constructor() {}

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Save a node to the memory store.
   * If a text is provided, we can automatically compute its embedding vector!
   */
  public async save(node: Partial<MemoryNode> & { content: string; type: MemoryType }): Promise<MemoryNode> {
    // Automatically populate vector embeddings for semantic matches
    let embedding: number[] | undefined = node.embedding;
    if (!embedding) {
      try {
        embedding = await semanticMemory.getEmbedding(node.content);
      } catch (err: any) {
        console.warn(`[MemoryManager] Failed embedding computation: ${err.message}`);
      }
    }

    const savedNode = memoryStore.save({
      ...node,
      embedding,
    });

    // Automatically index in graph or update cache as required
    memoryIndexer.invalidate("all_memories");
    return savedNode;
  }

  /**
   * Universal Search combining query tags, metadata parameters, text-indexed terms, and semantic similarities.
   */
  public async search(query: MemorySearchQuery): Promise<MemoryNode[]> {
    return await memoryIndexer.getOrSet(
      `search_${JSON.stringify(query)}`,
      async () => {
        return await memoryRetriever.retrieve(query);
      },
      15000 // 15 seconds Cache TTL
    );
  }

  /**
   * Relational Link Builder in Knowledge Graph.
   */
  public link(sourceId: string, targetId: string, relation: string, weight = 1.0): void {
    memoryGraph.addEdge(sourceId, targetId, relation, weight);
    memoryIndexer.invalidate("graph_context");
  }

  /**
   * Retrieve direct relationships for a memory entity.
   */
  public getRelated(nodeId: string, maxDepth = 2): string[] {
    return memoryGraph.getRelatedContext(nodeId, maxDepth);
  }

  /**
   * Triggers background session/conversation compression.
   */
  public async compress(sessionId: string, userId?: string): Promise<MemoryNode> {
    const summaryNode = await memoryCompressor.compressSession(sessionId, userId);
    memoryIndexer.flush(); // Flush search caches to reflect updated session nodes
    return summaryNode;
  }

  /**
   * Appends dialogue message records to session.
   */
  public saveMessage(
    sessionId: string,
    role: "user" | "model" | "system",
    message: string,
    userId?: string
  ): MemoryNode {
    const saved = conversationMemory.addMessage(sessionId, role, message, userId);
    memoryIndexer.invalidate(`session_${sessionId}`);
    return saved;
  }

  /**
   * Returns complete thread context for session.
   */
  public getSessionHistory(sessionId: string): MemoryNode[] {
    return conversationMemory.getHistory(sessionId);
  }

  /**
   * Removes a memory completely.
   */
  public deleteMemory(id: string): boolean {
    const deleted = memoryStore.delete(id);
    if (deleted) {
      memoryIndexer.flush();
    }
    return deleted;
  }
}

export const memoryManager = MemoryManager.getInstance();
