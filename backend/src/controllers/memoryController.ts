/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { memoryEngine } from "../memory/MemoryEngine";
import { memoryStore } from "../memory/MemoryStore";
import { memoryManager } from "../memory/MemoryManager";
import { runAllMemoryTests } from "../memory/tests/MemoryEngine.test";

export class MemoryController {
  /**
   * GET /api/memory
   * Retrieves all matching memory nodes (with type or sessionId filters in query params)
   */
  async getMemories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, sessionId, agentId, userId } = req.query;
      let nodes = memoryStore.getAll();

      if (type) {
        nodes = nodes.filter((n) => n.type === type);
      }
      if (sessionId) {
        nodes = nodes.filter((n) => n.sessionId === sessionId);
      }
      if (agentId) {
        nodes = nodes.filter((n) => n.agentId === agentId);
      }
      if (userId) {
        nodes = nodes.filter((n) => n.userId === userId);
      }

      res.status(200).json(nodes);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/memory/save
   * Saves a node to the memory engine.
   */
  async saveMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { content, type, tags, importance, confidence, userId, sessionId, agentId, workflowId, fileId, metadata } = req.body;

      if (!content || !type) {
        res.status(400).json({ error: "Missing required 'content' or 'type' parameters in request body." });
        return;
      }

      const savedNode = await memoryManager.save({
        content,
        type,
        tags: Array.isArray(tags) ? tags : [],
        importance: typeof importance === "number" ? importance : 5,
        confidence: typeof confidence === "number" ? confidence : 0.95,
        userId,
        sessionId,
        agentId,
        workflowId,
        fileId,
        metadata: metadata || {},
      });

      res.status(201).json(savedNode);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/memory/search
   * Unified Search across tags, semantic similarities, text indexing and knowledge graph.
   */
  async searchMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { text, tags, type, userId, sessionId, agentId, workflowId, fileId, minImportance, limit } = req.body;

      const results = await memoryEngine.search({
        text,
        tags,
        type,
        userId,
        sessionId,
        agentId,
        workflowId,
        fileId,
        minImportance,
        limit,
      });

      res.status(200).json(results);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/memory/compress
   * Compresses old conversation logs into summarizing nodes, archiving original files.
   */
  async compressSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, userId } = req.body;

      if (!sessionId) {
        res.status(400).json({ error: "Missing required parameter 'sessionId' in request body." });
        return;
      }

      const summaryNode = await memoryManager.compress(sessionId, userId);
      res.status(200).json({
        message: "Session compressed successfully.",
        summaryNode,
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * DELETE /api/memory/:id
   * Deletes a specific memory node from store.
   */
  async deleteMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "Missing required route parameter 'id'." });
        return;
      }

      const success = memoryManager.deleteMemory(id);
      if (success) {
        res.status(200).json({ message: `Successfully deleted memory node: ${id}` });
      } else {
        res.status(404).json({ error: `Memory node with ID ${id} not found.` });
      }
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/memory/test
   * Runs the complete analytical memory engine unit test suite.
   */
  async testMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await runAllMemoryTests();
      res.status(200).json({
        status: "success",
        message: "All Universal Memory Engine unit and integration tests passed successfully."
      });
    } catch (err: any) {
      res.status(500).json({
        status: "failed",
        error: err.message,
        stack: err.stack
      });
    }
  }
}

export const memoryController = new MemoryController();
