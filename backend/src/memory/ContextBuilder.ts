/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryRetriever } from "./MemoryRetriever";
import { memoryStore } from "./MemoryStore";
import { memoryGraph } from "./MemoryGraph";
import { MemoryNode, ContextItem } from "./types";

export class ContextBuilder {
  private static instance: ContextBuilder;

  private constructor() {}

  public static getInstance(): ContextBuilder {
    if (!ContextBuilder.instance) {
      ContextBuilder.instance = new ContextBuilder();
    }
    return ContextBuilder.instance;
  }

  /**
   * Compiles conversation logs, vector retrieval, files, workflows, and graph connections
   * to build a unified system context package for an incoming prompt.
   */
  public async build(params: {
    userId?: string;
    sessionId?: string;
    currentPrompt: string;
    agentId?: string;
    workflowId?: string;
  }): Promise<{ formattedContext: string; items: ContextItem[] }> {
    const items: ContextItem[] = [];

    // 1. Gather User profile / Long-term preferences
    const longMemories = await memoryRetriever.retrieve({
      text: params.currentPrompt,
      type: "long",
      userId: params.userId,
      limit: 3,
    });

    for (const mem of longMemories) {
      items.push({
        source: "long_term_memory",
        content: mem.content,
        metadata: mem.metadata,
      });
    }

    // 2. Fetch Active Session Conversations
    if (params.sessionId) {
      const activeConversations = memoryStore
        .getAll()
        .filter((n) => n.type === "conversation" && n.sessionId === params.sessionId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // newest first
        .slice(0, 10) // fetch last 10 messages
        .reverse();

      for (const conv of activeConversations) {
        items.push({
          source: "session_conversation",
          content: conv.content,
          metadata: conv.metadata,
        });
      }
    }

    // 3. Fetch Active Workflow contexts
    if (params.workflowId) {
      const steps = memoryStore
        .getAll()
        .filter((n) => n.type === "workflow" && n.workflowId === params.workflowId)
        .slice(-5); // get last 5 steps

      for (const step of steps) {
        items.push({
          source: "workflow_step",
          content: step.content,
          metadata: step.metadata,
        });
      }
    }

    // 4. Inject Knowledge Graph Context
    // Seed reachable items from graph using the agent or sessionId
    const seedId = params.agentId || params.sessionId;
    if (seedId) {
      const paths = memoryGraph.traverse(seedId, 2);
      for (const p of paths.slice(0, 5)) {
        const node = memoryStore.get(p.id);
        if (node) {
          items.push({
            source: `knowledge_graph_${p.relation}`,
            content: node.content,
            metadata: node.metadata,
          });
        }
      }
    }

    // 5. Format into cohesive XML/Markdown Context block
    let formattedContext = "============================================================\n";
    formattedContext += "COGNITIVE CONTEXT BLOCK (UNIVERSAL MEMORY ENGINE)\n";
    formattedContext += "============================================================\n\n";

    // Group items by source type
    const grouped = this.groupBy(items, (i) => i.source);

    for (const [source, list] of Object.entries(grouped)) {
      formattedContext += `### 📂 Source: ${source.toUpperCase().replace(/_/g, " ")}\n`;
      for (const item of list) {
        formattedContext += `> ${item.content}\n`;
      }
      formattedContext += "\n";
    }

    formattedContext += "============================================================\n";
    formattedContext += "END COGNITIVE CONTEXT BLOCK\n";
    formattedContext += "============================================================\n";

    return { formattedContext, items };
  }

  private groupBy<T, K extends string | number | symbol>(list: T[], getKey: (item: T) => K): Record<K, T[]> {
    return list.reduce((acc, item) => {
      const key = getKey(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<K, T[]>);
  }
}

export const contextBuilder = ContextBuilder.getInstance();
