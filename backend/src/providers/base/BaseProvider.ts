/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AIProvider,
  ProviderOptions,
  ProviderResponse,
  ProviderStreamChunk,
  ModerationResult,
  ProviderHealthStatus
} from "../interfaces/AIProvider.interface";
import { TokenTracker } from "../utils/TokenTracker";
import { CostEstimator } from "../utils/CostEstimator";
import { ProviderHealth } from "../utils/ProviderHealth";
import { v4 as uuidv4 } from "uuid";

export abstract class BaseProvider implements AIProvider {
  abstract id: string;
  abstract name: string;

  abstract initialize(): Promise<void>;

  abstract generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse>;

  abstract stream(prompt: string, options?: ProviderOptions): Promise<ReadableStream<ProviderStreamChunk>>;

  abstract vision(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    options?: ProviderOptions
  ): Promise<ProviderResponse>;

  abstract embedding(text: string | string[], options?: ProviderOptions): Promise<number[][]>;

  /**
   * Default lightweight fallback moderation using a comprehensive regex-based policy filter.
   * Providers can override this if they have native safety moderation endpoints (like OpenAI Moderations API).
   */
  async moderate(text: string): Promise<ModerationResult> {
    const flaggedCategories = {
      violence: /(kill|murder|shoot|bomb|attack|assault|suicide|self-harm)/i.test(text),
      hate: /(hate speech|racial slur|bigot|neo-nazi|white supremacy)/i.test(text),
      harassment: /(harass|abuse|dox|stalk|blackmail)/i.test(text),
      sexual: /(porn|erotica|explicit|nsfw|sexually explicit)/i.test(text),
      illegal: /(buy drugs|make bomb|hack system|pirate software)/i.test(text)
    };

    const flagged = Object.values(flaggedCategories).some((val) => val === true);
    
    const scores = {
      violence: flaggedCategories.violence ? 0.95 : 0.01,
      hate: flaggedCategories.hate ? 0.95 : 0.01,
      harassment: flaggedCategories.harassment ? 0.95 : 0.01,
      sexual: flaggedCategories.sexual ? 0.95 : 0.01,
      illegal: flaggedCategories.illegal ? 0.95 : 0.01
    };

    return {
      flagged,
      categories: flaggedCategories,
      scores
    };
  }

  /**
   * Base token counter using TokenTracker heuristic estimations.
   * Can be overridden by subclasses for precise, native encoder integrations.
   */
  async countTokens(prompt: string): Promise<number> {
    return TokenTracker.estimateTokenCount(prompt);
  }

  /**
   * Universal provider health-checking execution wrapper.
   */
  async healthCheck(): Promise<ProviderHealthStatus> {
    try {
      const start = Date.now();
      // Execute a minimal mock verification or prompt check
      await this.countTokens("ping");
      const latency = Date.now() - start;

      const health: ProviderHealthStatus = {
        status: "healthy",
        latency,
        lastChecked: new Date().toISOString()
      };
      
      ProviderHealth.setHealth(this.id, health);
      return health;
    } catch (err: any) {
      const health: ProviderHealthStatus = {
        status: "unhealthy",
        latency: 0,
        error: err.message,
        lastChecked: new Date().toISOString()
      };
      
      ProviderHealth.setHealth(this.id, health);
      return health;
    }
  }

  /**
   * Standardization helper to construct the common unified response schema.
   */
  protected createStandardResponse(
    modelId: string,
    text: string,
    inputTokens: number,
    outputTokens: number,
    latency: number,
    finishReason = "stop",
    reasoning?: string,
    metadata?: Record<string, any>
  ): ProviderResponse {
    const totalTokens = inputTokens + outputTokens;
    const estimatedCost = CostEstimator.calculateCost(modelId, inputTokens, outputTokens);

    return {
      id: `resp-${uuidv4()}`,
      provider: this.id,
      model: modelId,
      text,
      reasoning,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost
      },
      finishReason,
      latency,
      metadata
    };
  }

  /**
   * Error wrapper maps native provider exceptions to consistent, friendly errors.
   */
  protected handleProviderError(error: any): Error {
    const msg = error.message || String(error);
    
    if (msg.includes("API key") || msg.includes("auth") || msg.includes("unauthorized") || error.status === 401) {
      return new Error(`[${this.name}] Authentication failed. Please verify API configuration keys.`);
    }
    if (msg.includes("rate limit") || msg.includes("429") || error.status === 429) {
      return new Error(`[${this.name}] Rate limit exceeded. Throttling request.`);
    }
    if (msg.includes("quota") || msg.includes("billing")) {
      return new Error(`[${this.name}] Quota exceeded or billing limit reached.`);
    }
    if (msg.includes("timeout") || msg.includes("AbortSignal")) {
      return new Error(`[${this.name}] Provider request timed out or was aborted.`);
    }

    return new Error(`[${this.name}] Execution error: ${msg}`);
  }
}
