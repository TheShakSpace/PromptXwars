/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderConfig, ModelInfo } from "../config/ProviderConfig";
import { AIProviderFactory } from "../factory/ProviderFactory";
import { AIProvider, ProviderHealthStatus } from "../interfaces/AIProvider.interface";
import { ProviderHealth } from "../utils/ProviderHealth";

export interface RoutingDecision {
  model: ModelInfo;
  provider: AIProvider;
  reason: string;
}

export class ModelRouter {
  /**
   * Automatically selects the optimal model based on cost, task capability, latency, and health.
   */
  static selectModel(taskType: string, preferredModelId?: string): RoutingDecision {
    const models = ProviderConfig.getModels();

    // 1. If a preferred model is requested specifically, check its availability and task support
    if (preferredModelId) {
      const model = ProviderConfig.getModel(preferredModelId);
      if (model) {
        const provider = AIProviderFactory.getProvider(model.provider);
        const health = ProviderHealth.getHealth(provider.id);
        
        if (health.status === "healthy") {
          return {
            model,
            provider,
            reason: `Direct preference match for model "${preferredModelId}"`
          };
        }
        console.warn(`Preferred model "${preferredModelId}" is unhealthy. Falling back to optimal default routing.`);
      }
    }

    // 2. Filter models by task type capabilities
    const capableModels = models.filter((m) => m.capabilities.includes(taskType.toLowerCase()));
    if (capableModels.length === 0) {
      // Return gemini-3.5-flash as the global robust safety default if no models match the capability
      const defaultModel = ProviderConfig.getModel("gemini-3.5-flash") || models[0];
      return {
        model: defaultModel,
        provider: AIProviderFactory.getProvider(defaultModel.provider),
        reason: `Default fallback - no models specifically matching capability "${taskType}" found.`
      };
    }

    // 3. Filter out currently unhealthy providers (if any)
    const healthyModels = capableModels.filter((m) => {
      const health = ProviderHealth.getHealth(m.provider);
      return health.status === "healthy";
    });

    const candidatePool = healthyModels.length > 0 ? healthyModels : capableModels;

    // 4. Sort candidates based on lowest cost per million output tokens
    candidatePool.sort((a, b) => {
      const costA = a.inputCostPerMillion + a.outputCostPerMillion;
      const costB = b.inputCostPerMillion + b.outputCostPerMillion;
      return costA - costB;
    });

    const optimalModel = candidatePool[0];
    const provider = AIProviderFactory.getProvider(optimalModel.provider);

    return {
      model: optimalModel,
      provider,
      reason: `Optimized selection for task "${taskType}" based on cost ($${optimalModel.outputCostPerMillion}/M) and health availability.`
    };
  }

  /**
   * Automatic Fallback System.
   * If Gemini fails -> Claude -> GPT -> DeepSeek -> Llama.
   */
  static getFallbackChain(failedModelId: string): string[] {
    const defaultChain = ["gemini-3.5-flash", "claude-3-5-sonnet", "gpt-4o", "deepseek-chat", "llama-4"];
    
    const model = ProviderConfig.getModel(failedModelId);
    const customFallback = model?.fallbackModel;

    const chain: string[] = [];
    if (customFallback) {
      chain.push(customFallback);
    }

    for (const modelId of defaultChain) {
      if (modelId !== failedModelId && !chain.includes(modelId)) {
        chain.push(modelId);
      }
    }

    return chain;
  }

  /**
   * Executes a provider action with automated fallback and retry loops.
   */
  static async executeWithFallback<T>(
    taskType: string,
    executeFn: (provider: AIProvider, modelId: string) => Promise<T>,
    preferredModelId?: string,
    onFallbackAttempt?: (error: any, nextModelId: string) => void
  ): Promise<T> {
    const decision = this.selectModel(taskType, preferredModelId);
    let currentModelId = decision.model.id;
    let currentProvider = decision.provider;

    const visitedModels = new Set<string>();
    visitedModels.add(currentModelId);

    const errors: Error[] = [];

    while (true) {
      try {
        return await executeFn(currentProvider, currentModelId);
      } catch (error: any) {
        console.error(`Execution failed on model "${currentModelId}": ${error.message}`);
        errors.push(error);

        // Mark the current provider unhealthy as self-healing telemetry
        const status: ProviderHealthStatus = {
          status: "unhealthy",
          latency: 0,
          error: error.message,
          lastChecked: new Date().toISOString()
        };
        ProviderHealth.setHealth(currentProvider.id, status);

        // Retrieve the next models in the fallback chain
        const fallbackChain = this.getFallbackChain(currentModelId);
        let nextModelId: string | undefined;

        for (const modelId of fallbackChain) {
          if (!visitedModels.has(modelId)) {
            nextModelId = modelId;
            break;
          }
        }

        if (!nextModelId) {
          throw new Error(
            `All models in the fallback chain failed. Root causes:\n${errors.map((e) => `- ${e.message}`).join("\n")}`
          );
        }

        // Setup the next provider
        const nextModel = ProviderConfig.getModel(nextModelId);
        if (!nextModel) {
          throw new Error(`Fallback model ID "${nextModelId}" is not configured in ProviderConfig.`);
        }

        if (onFallbackAttempt) {
          onFallbackAttempt(error, nextModelId);
        }

        visitedModels.add(nextModelId);
        currentModelId = nextModelId;
        currentProvider = AIProviderFactory.getProvider(nextModel.provider);
        console.log(`Automatic Failover Triggered: Switched to fallback model "${currentModelId}"`);
      }
    }
  }
}
