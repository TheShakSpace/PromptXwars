/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoryNode, MemoryRankCriteria } from "./types";

export class MemoryRanker {
  private static instance: MemoryRanker;

  private constructor() {}

  public static getInstance(): MemoryRanker {
    if (!MemoryRanker.instance) {
      MemoryRanker.instance = new MemoryRanker();
    }
    return MemoryRanker.instance;
  }

  /**
   * Scores and sorts a list of memory nodes based on multi-criteria variables
   * @param nodes Nodes to score
   * @param queryVector Query vector for semantic similarity calculation (optional)
   * @param queryText Query text for keyword match calculations (optional)
   * @param criteria custom weights config
   */
  public rank(
    nodes: MemoryNode[],
    queryVector?: number[],
    queryText?: string,
    criteria: MemoryRankCriteria = {}
  ): Array<{ node: MemoryNode; score: number }> {
    const weights = {
      relevanceWeight: criteria.relevanceWeight !== undefined ? criteria.relevanceWeight : 0.4,
      confidenceWeight: criteria.confidenceWeight !== undefined ? criteria.confidenceWeight : 0.1,
      recencyWeight: criteria.recencyWeight !== undefined ? criteria.recencyWeight : 0.2,
      usageWeight: criteria.usageWeight !== undefined ? criteria.usageWeight : 0.1,
      importanceWeight: criteria.importanceWeight !== undefined ? criteria.importanceWeight : 0.2,
    };

    const scored = nodes.map((node) => {
      // 1. Calculate Relevance Score (0 - 1)
      let relevance = 0.5; // default fallback if no query criteria is matched
      if (queryVector && node.embedding) {
        // cosine similarity math
        relevance = this.cosineSimilarity(queryVector, node.embedding);
      } else if (queryText) {
        // substring text matching score
        const queryClean = queryText.toLowerCase();
        const contentClean = node.content.toLowerCase();
        if (contentClean.includes(queryClean)) {
          relevance = 1.0;
        } else {
          // partial text intersections
          const words = queryClean.split(/\s+/).filter((w) => w.length > 2);
          const matches = words.filter((w) => contentClean.includes(w));
          relevance = words.length > 0 ? matches.length / words.length : 0.5;
        }
      }

      // 2. Calculate Recency Score (0 - 1)
      const now = Date.now();
      const ageMs = now - node.createdAt.getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const recency = Math.exp(-ageMs / (7 * oneDayMs)); // exponential decay over a 7-day half-life

      // 3. Calculate Usage Score (0 - 1)
      const maxUsage = Math.max(...nodes.map((n) => n.usageCount), 1);
      const usage = node.usageCount / maxUsage;

      // 4. Calculate Importance Score (0 - 1)
      const importance = node.importance / 10;

      // 5. Calculate Confidence Score (0 - 1)
      const confidence = node.confidence;

      // Calculate aggregated weighted score
      const finalScore =
        relevance * weights.relevanceWeight +
        recency * weights.recencyWeight +
        usage * weights.usageWeight +
        importance * weights.importanceWeight +
        confidence * weights.confidenceWeight;

      return { node, score: finalScore };
    });

    // Return descending sorted nodes list
    return scored.sort((a, b) => b.score - a.score);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    const length = Math.min(vecA.length, vecB.length);

    for (let i = 0; i < length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const memoryRanker = MemoryRanker.getInstance();
