/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryStore } from "./MemoryStore";
import { MemoryNode, MemoryType } from "./types";

export class ConversationMemory {
  private static instance: ConversationMemory;

  private constructor() {}

  public static getInstance(): ConversationMemory {
    if (!ConversationMemory.instance) {
      ConversationMemory.instance = new ConversationMemory();
    }
    return ConversationMemory.instance;
  }

  /**
   * Appends a chat message to a conversation log
   */
  public addMessage(
    sessionId: string,
    role: "user" | "model" | "system",
    message: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ): MemoryNode {
    const content = `[${role.toUpperCase()}]: ${message}`;
    return memoryStore.save({
      type: "conversation",
      content,
      tags: ["chat", role, sessionId],
      importance: role === "system" ? 8 : 5,
      confidence: 1.0,
      sessionId,
      userId,
      metadata: {
        role,
        rawMessage: message,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }

  /**
   * Retrieves full conversation logs for a given session
   */
  public getHistory(sessionId: string): MemoryNode[] {
    return memoryStore
      .getAll()
      .filter((n) => n.type === "conversation" && n.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  /**
   * Pin a specific memory node so it stays in top relevance context
   */
  public pin(id: string): MemoryNode | undefined {
    const node = memoryStore.get(id);
    if (node) {
      return memoryStore.save({
        ...node,
        type: "pinned",
        importance: 10, // Max importance for pinned nodes
        metadata: {
          ...node.metadata,
          pinnedAt: new Date().toISOString(),
        },
      });
    }
    return undefined;
  }

  /**
   * Unpin a node, reverting it back to standard memory space
   */
  public unpin(id: string, originalType: MemoryType = "conversation"): MemoryNode | undefined {
    const node = memoryStore.get(id);
    if (node && node.type === "pinned") {
      const metadata = { ...node.metadata };
      delete metadata.pinnedAt;
      return memoryStore.save({
        ...node,
        type: originalType,
        importance: 5,
        metadata,
      });
    }
    return undefined;
  }

  /**
   * Archive specific nodes, marking them archived
   */
  public archive(id: string): MemoryNode | undefined {
    const node = memoryStore.get(id);
    if (node) {
      return memoryStore.save({
        ...node,
        type: "archived",
        metadata: {
          ...node.metadata,
          archivedAt: new Date().toISOString(),
        },
      });
    }
    return undefined;
  }
}

export const conversationMemory = ConversationMemory.getInstance();
