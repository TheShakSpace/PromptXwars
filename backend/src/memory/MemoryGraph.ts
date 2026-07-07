/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from "fs";
import * as path from "path";
import { GraphEdge } from "./types";
import { memoryStore } from "./MemoryStore";

export class MemoryGraph {
  private static instance: MemoryGraph;
  private edges: GraphEdge[] = [];
  private filePath: string;

  private constructor() {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, "universal_memory_graph.json");
    this.loadFromDisk();
  }

  public static getInstance(): MemoryGraph {
    if (!MemoryGraph.instance) {
      MemoryGraph.instance = new MemoryGraph();
    }
    return MemoryGraph.instance;
  }

  /**
   * Adds or updates a relationship link between two memory nodes
   */
  public addEdge(sourceId: string, targetId: string, relation: string, weight = 1.0): void {
    // Prevent duplicate edges
    const existingIndex = this.edges.findIndex(
      (e) => e.sourceId === sourceId && e.targetId === targetId && e.relation === relation
    );

    if (existingIndex >= 0) {
      this.edges[existingIndex].weight = weight;
    } else {
      this.edges.push({ sourceId, targetId, relation, weight });
    }
    this.persistToDisk();
  }

  /**
   * Retrieves all out-edges for a given node ID
   */
  public getOutgoing(nodeId: string): GraphEdge[] {
    return this.edges.filter((e) => e.sourceId === nodeId);
  }

  /**
   * Retrieves all in-edges for a given node ID
   */
  public getIncoming(nodeId: string): GraphEdge[] {
    return this.edges.filter((e) => e.targetId === nodeId);
  }

  /**
   * Performs standard Breadth-First-Search (BFS) traversal starting at nodeId.
   * Traverses up to maxDepth and returns list of reachable memory node IDs.
   */
  public traverse(nodeId: string, maxDepth = 2): Array<{ id: string; relation: string; depth: number }> {
    const visited = new Set<string>([nodeId]);
    const results: Array<{ id: string; relation: string; depth: number }> = [];
    const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (depth >= maxDepth) continue;

      const neighbors = this.edges.filter((e) => e.sourceId === id || e.targetId === id);

      for (const edge of neighbors) {
        const nextId = edge.sourceId === id ? edge.targetId : edge.sourceId;
        if (!visited.has(nextId)) {
          visited.add(nextId);
          results.push({ id: nextId, relation: edge.relation, depth: depth + 1 });
          queue.push({ id: nextId, depth: depth + 1 });
        }
      }
    }

    return results;
  }

  /**
   * Finds related content in the Knowledge Graph by tracing hops.
   * E.g., User -> Conversation -> Files -> Concepts -> Agents -> Outputs
   */
  public getRelatedContext(nodeId: string, maxDepth = 2): string[] {
    const reachable = this.traverse(nodeId, maxDepth);
    const relatedContents: string[] = [];

    for (const item of reachable) {
      const node = memoryStore.get(item.id);
      if (node) {
        relatedContents.push(`[GRAPH NEIGHBOR: ${item.relation}] ${node.content}`);
      }
    }

    return relatedContents;
  }

  /**
   * Resets the graph structure
   */
  public clear(): void {
    this.edges = [];
    this.persistToDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, "utf-8");
        this.edges = JSON.parse(fileContent) as GraphEdge[];
        console.log(`[MemoryGraph] Loaded ${this.edges.length} knowledge graph edges from disk.`);
      }
    } catch (err: any) {
      console.error(`[MemoryGraph] Error loading graph from disk: ${err.message}`);
    }
  }

  private persistToDisk(): void {
    try {
      const data = JSON.stringify(this.edges, null, 2);
      fs.writeFileSync(this.filePath, data, "utf-8");
    } catch (err: any) {
      console.error(`[MemoryGraph] Error writing graph to disk: ${err.message}`);
    }
  }
}

export const memoryGraph = MemoryGraph.getInstance();
