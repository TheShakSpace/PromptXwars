/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryStore } from "./MemoryStore";
import { memoryManager } from "./MemoryManager";
import { memoryRetriever } from "./MemoryRetriever";
import { memoryRanker } from "./MemoryRanker";
import { memoryGraph } from "./MemoryGraph";
import { memoryIndexer } from "./MemoryIndexer";
import { memoryCompressor } from "./MemoryCompressor";
import { contextBuilder } from "./ContextBuilder";
import { MemoryNode, MemorySearchQuery } from "./types";

export interface MemoryEngineConfig {
  cacheTTLMs?: number;
  autoPersist?: boolean;
}

export class MemoryEngine {
  private static instance: MemoryEngine;
  private config: MemoryEngineConfig = {
    cacheTTLMs: 30000,
    autoPersist: true,
  };

  private constructor() {}

  public static getInstance(): MemoryEngine {
    if (!MemoryEngine.instance) {
      MemoryEngine.instance = new MemoryEngine();
    }
    return MemoryEngine.instance;
  }

  /**
   * Universal initializer for the Memory subsystem.
   */
  public async initialize(config: MemoryEngineConfig = {}): Promise<void> {
    this.config = { ...this.config, ...config };
    console.log(`[MemoryEngine] Enterprise Universal Memory Engine initialized successfully.`);
  }

  /**
   * Facade: High level query search interface
   */
  public async search(query: MemorySearchQuery): Promise<MemoryNode[]> {
    return await memoryManager.search(query);
  }

  /**
   * Facade: High level save memory node interface
   */
  public async save(node: Partial<MemoryNode> & { content: string; type: any }): Promise<MemoryNode> {
    return await memoryManager.save(node);
  }

  /**
   * Facade: Unified context assembler
   */
  public async assembleContext(params: {
    userId?: string;
    sessionId?: string;
    currentPrompt: string;
    agentId?: string;
    workflowId?: string;
  }) {
    return await contextBuilder.build(params);
  }

  /**
   * Getter structures for sub-modules
   */
  public getStore() {
    return memoryStore;
  }

  public getManager() {
    return memoryManager;
  }

  public getRetriever() {
    return memoryRetriever;
  }

  public getRanker() {
    return memoryRanker;
  }

  public getGraph() {
    return memoryGraph;
  }

  public getIndexer() {
    return memoryIndexer;
  }

  public getCompressor() {
    return memoryCompressor;
  }

  public getContextBuilder() {
    return contextBuilder;
  }
}

export const memoryEngine = MemoryEngine.getInstance();
export default memoryEngine;
