/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { ModelRouter } from "../providers/router/ModelRouter";
import { ProviderConfig } from "../providers/config/ProviderConfig";
import { ProviderRegistry } from "../providers/factory/ProviderRegistry";
import { AIProviderFactory } from "../providers/factory/ProviderFactory";
import { PromptCache } from "../providers/utils/PromptCache";
import { TokenTracker } from "../providers/utils/TokenTracker";
import { CostEstimator } from "../providers/utils/CostEstimator";
import { ProviderResponse, ProviderStreamChunk } from "../providers/interfaces/AIProvider.interface";

export class AIController {
  /**
   * POST /api/ai/chat
   * Supports standard non-streaming cognitive chat queries with prompt caching.
   */
  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, model: requestedModel, options } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Missing or invalid prompt parameter." });
        return;
      }

      const activeModelId = requestedModel || "gemini-3.5-flash";

      // Check prompt cache first
      const cachedResponse = PromptCache.get<ProviderResponse>(prompt, activeModelId, options);
      if (cachedResponse) {
        res.status(200).json({
          ...cachedResponse,
          metadata: {
            ...cachedResponse.metadata,
            cached: true,
            cacheTtlRemaining: "active"
          }
        });
        return;
      }

      // Execute request with automatic fallback failover
      const result = await ModelRouter.executeWithFallback(
        "chat",
        async (provider, modelId) => {
          return await provider.generate(prompt, { ...options, model: modelId });
        },
        activeModelId
      );

      // Cache the valid response
      PromptCache.set(prompt, activeModelId, result, undefined, options);

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/ai/stream
   * Handles real-time Server-Sent Events (SSE) chat completion streams.
   */
  async stream(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, model: requestedModel, options } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Missing or invalid prompt parameter." });
        return;
      }

      const activeModelId = requestedModel || "gemini-3.5-flash";

      // Setup Server-Sent Events HTTP headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      // Resolve provider and request streaming chunk generation with fallback
      const activeStream = await ModelRouter.executeWithFallback(
        "chat",
        async (provider, modelId) => {
          return await provider.stream(prompt, { ...options, model: modelId });
        },
        activeModelId
      );

      const reader = activeStream.getReader();
      let inputTokens = TokenTracker.estimateTokenCount(prompt);
      let accumulatedText = "";
      let accumulatedReasoning = "";

      // Handle client connection interruptions
      let isClosed = false;
      req.on("close", () => {
        isClosed = true;
        reader.cancel().catch(() => {});
      });

      try {
        while (!isClosed) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          if (value) {
            accumulatedText += value.text || "";
            accumulatedReasoning += value.reasoning || "";

            // Format standard Event stream transmission
            res.write(`data: ${JSON.stringify(value)}\n\n`);
          }
        }

        if (!isClosed) {
          // Send final total usage and cost statistics chunk
          const outputTokens = TokenTracker.estimateTokenCount(accumulatedText);
          const totalTokens = inputTokens + outputTokens;
          const estimatedCost = CostEstimator.calculateCost(activeModelId, inputTokens, outputTokens);

          const finalChunk: ProviderStreamChunk = {
            id: `stream-final-${Math.random()}`,
            provider: activeStream ? "router" : activeModelId,
            model: activeModelId,
            text: "",
            usage: {
              inputTokens,
              outputTokens,
              totalTokens,
              estimatedCost
            },
            finishReason: "stop"
          };
          res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
          res.write("data: [DONE]\n\n");
        }
      } finally {
        reader.releaseLock();
        res.end();
      }
    } catch (err: any) {
      console.error("SSE Streaming connection aborted or errored:", err);
      if (!res.headersSent) {
        next(err);
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  }

  /**
   * POST /api/ai/vision
   * Standard multi-modal image evaluation endpoint.
   */
  async vision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, imageBase64, mimeType, model: requestedModel, options } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Missing prompt parameter." });
        return;
      }
      if (!imageBase64 || typeof imageBase64 !== "string") {
        res.status(400).json({ error: "Missing imageBase64 payload." });
        return;
      }
      if (!mimeType || typeof mimeType !== "string") {
        res.status(400).json({ error: "Missing standard mimeType parameter." });
        return;
      }

      const activeModelId = requestedModel || "gemini-3.5-flash";

      const result = await ModelRouter.executeWithFallback(
        "vision",
        async (provider, modelId) => {
          return await provider.vision(prompt, imageBase64, mimeType, { ...options, model: modelId });
        },
        activeModelId
      );

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/ai/reason
   * Optimized advanced thinking query endpoint.
   */
  async reason(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, model: requestedModel, options } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Missing or invalid prompt parameter." });
        return;
      }

      const activeModelId = requestedModel || "deepseek-reasoner";

      const result = await ModelRouter.executeWithFallback(
        "reasoning",
        async (provider, modelId) => {
          return await provider.generate(prompt, { ...options, model: modelId });
        },
        activeModelId
      );

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/ai/embed
   * Multi-text text vector embedding computation.
   */
  async embed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { text, model: requestedModel, options } = req.body;

      if (!text || (typeof text !== "string" && !Array.isArray(text))) {
        res.status(400).json({ error: "Missing or invalid text input for vector embeddings." });
        return;
      }

      const activeModelId = requestedModel || "gemini-embedding-2-preview";
      const modelInfo = ProviderConfig.getModel(activeModelId);

      if (!modelInfo) {
        res.status(404).json({ error: `Selected embedding model "${activeModelId}" is not configured.` });
        return;
      }

      const provider = AIProviderFactory.getProvider(modelInfo.provider);
      const embeddings = await provider.embedding(text, { ...options, model: activeModelId });

      res.status(200).json({
        provider: provider.id,
        model: activeModelId,
        embeddings
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/ai/models
   * Returns full models config lists.
   */
  async models(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(ProviderConfig.getModels());
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/ai/providers
   * Returns all supported active providers.
   */
  async providers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const providers = ProviderRegistry.getAll().map((p) => ({
        id: p.id,
        name: p.name
      }));
      res.status(200).json(providers);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/ai/health
   * Triggers parallel health-checks on active engine integrations.
   */
  async health(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const providers = ProviderRegistry.getAll();
      const checks = await Promise.all(
        providers.map(async (provider) => {
          const status = await provider.healthCheck();
          return { provider: provider.id, ...status };
        })
      );

      const isOverallHealthy = checks.every((c) => c.status === "healthy");

      res.status(200).json({
        status: isOverallHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        checks
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export const aiController = new AIController();
