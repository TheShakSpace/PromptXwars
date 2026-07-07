/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryStore } from "./MemoryStore";
import { semanticMemory } from "./SemanticMemory";
import { memoryRanker } from "./MemoryRanker";
import { memoryIndexer } from "./MemoryIndexer";
import { memoryGraph } from "./MemoryGraph";
import { MemoryNode, MemorySearchQuery } from "./types";

export class MemoryRetriever {
  private static instance: MemoryRetriever;

  private constructor() {}

  public static getInstance(): MemoryRetriever {
    if (!MemoryRetriever.instance) {
      MemoryRetriever.instance = new MemoryRetriever();
    }
    return MemoryRetriever.instance;
  }

  /**
   * High-performance retrieval pipeline combining semantic vectors, indexing, tag matches, and knowledge graph tracing.
   */
  public async retrieve(query: MemorySearchQuery): Promise<MemoryNode[]> {
    const limit = query.limit || 10;
    let candidates: MemoryNode[] = [];

    // 1. Fetch matching nodes from base store by filter constraints
    let filteredNodes = memoryStore.getAll();

    if (query.type) {
      filteredNodes = filteredNodes.filter((n) => n.type === query.type);
    }
    if (query.userId) {
      filteredNodes = filteredNodes.filter((n) => n.userId === query.userId);
    }
    if (query.sessionId) {
      filteredNodes = filteredNodes.filter((n) => n.sessionId === query.sessionId);
    }
    if (query.agentId) {
      filteredNodes = filteredNodes.filter((n) => n.agentId === query.agentId);
    }
    if (query.workflowId) {
      filteredNodes = filteredNodes.filter((n) => n.workflowId === query.workflowId);
    }
    if (query.fileId) {
      filteredNodes = filteredNodes.filter((n) => n.fileId === query.fileId);
    }
    if (query.minImportance !== undefined) {
      filteredNodes = filteredNodes.filter((n) => n.importance >= query.minImportance!);
    }

    // 2. Perform Tag-based matching
    if (query.tags && query.tags.length > 0) {
      const tagMatches = memoryIndexer.searchByTags(query.tags);
      // Filter tag matches to only include nodes passing our filter constraints
      const allowedIds = new Set(filteredNodes.map((n) => n.id));
      candidates = tagMatches.filter((n) => allowedIds.has(n.id));
    } else {
      candidates = [...filteredNodes];
    }

    // 3. Compute Query Embedding and perform Semantic Ranking
    let queryVector: number[] | undefined;
    if (query.text) {
      queryVector = await semanticMemory.getEmbedding(query.text);
    }

    // Rank candidates using the multi-criteria ranker
    const rankedResults = memoryRanker.rank(
      candidates,
      queryVector,
      query.text,
      {
        relevanceWeight: query.text ? 0.5 : 0.0, // scale weights dynamically
        recencyWeight: 0.2,
        importanceWeight: 0.2,
        confidenceWeight: 0.1,
      }
    );

    let retrievedNodes = rankedResults.map((r) => r.node);

    // 4. Inject Knowledge Graph Traversal Context
    // Trace first-degree neighbors in graph for top retrieved elements to broaden search coverage
    const neighboringNodeIds = new Set<string>();
    const topSeeds = retrievedNodes.slice(0, 3);

    for (const seed of topSeeds) {
      const paths = memoryGraph.traverse(seed.id, 1);
      for (const p of paths) {
        neighboringNodeIds.add(p.id);
      }
    }

    // Fetch and merge the neighboring nodes (if they aren't already included)
    for (const neighborId of neighboringNodeIds) {
      if (!retrievedNodes.some((n) => n.id === neighborId)) {
        const neighborNode = memoryStore.get(neighborId);
        if (neighborNode) {
          // Verify neighbor matches general user-bound constraints
          const passesUserFilter = !query.userId || neighborNode.userId === query.userId;
          if (passesUserFilter) {
            retrievedNodes.push(neighborNode);
          }
        }
      }
    }

    // Re-rank the fully consolidated nodes set
    const finalRanked = memoryRanker.rank(retrievedNodes, queryVector, query.text);

    return finalRanked.slice(0, limit).map((r) => r.node);
  }
}

export const memoryRetriever = MemoryRetriever.getInstance();
