/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptTemplate, VariableValues, OutputFormat } from "./PromptTemplate";
import { PromptRegistry } from "./PromptRegistry";
import { PromptBuilder } from "./PromptBuilder";
import { PromptEvaluator, EvaluationResult } from "./PromptEvaluator";
import { PromptOptimizer, OptimizationOptions } from "./PromptOptimizer";
import { PromptCache } from "./PromptCache";
import { ContextPayload } from "./ContextInjector";

export interface RenderOptions {
  version?: string;
  useCache?: boolean;
  ttlMs?: number;
  strict?: boolean;
  roleName?: string;
  customRoleInstruction?: string;
  memories?: string[];
  context?: ContextPayload;
  userInput?: string;
}

export class PromptEngine {
  private static instance: PromptEngine;
  
  private registry = new PromptRegistry();
  private cache = new PromptCache();

  private constructor() {}

  /**
   * Singleton pattern to access the universal prompt infrastructure.
   */
  static getInstance(): PromptEngine {
    if (!PromptEngine.instance) {
      PromptEngine.instance = new PromptEngine();
    }
    return PromptEngine.instance;
  }

  /**
   * Registers a prompt template into the dynamic system registry.
   */
  registerTemplate(template: PromptTemplate): void {
    this.registry.register(template);
  }

  /**
   * Unifies retrieval, context building, cache checking, variable interpolation, and format rendering.
   */
  renderPrompt(
    id: string,
    variables: VariableValues,
    options: RenderOptions = {}
  ): string {
    const useCache = options.useCache !== false;
    const version = options.version;

    // 1. Resolve deterministic cache key
    const cacheKey = this.cache.generateKey(id, version || "latest", {
      variables,
      options
    });

    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // 2. Fetch template from registry
    const templateObj = this.registry.get(id, version);
    if (!templateObj) {
      throw new Error(`Prompt Template with ID "${id}" was not found in the registry (Version: ${version || "latest"}).`);
    }

    // 3. Setup the PromptBuilder pipeline
    const builder = new PromptBuilder()
      .setSystemPrompt(templateObj.template)
      .setVariables(variables)
      .setOutputFormat(templateObj.outputFormat);

    if (options.roleName) {
      builder.setRole(options.roleName, options.customRoleInstruction);
    }

    if (options.memories) {
      builder.setMemory(options.memories);
    }

    if (options.context) {
      builder.setContext(options.context);
    }

    if (options.userInput) {
      builder.setUserInput(options.userInput);
    }

    // 4. Compile the prompt
    const rendered = builder.build(options.strict);

    // 5. Store in cache
    if (useCache) {
      this.cache.set(cacheKey, rendered, options.ttlMs);
    }

    return rendered;
  }

  /**
   * Evaluates a raw prompt or fully rendered string across core criteria.
   */
  evaluatePrompt(promptText: string): EvaluationResult {
    return PromptEvaluator.evaluate(promptText);
  }

  /**
   * Automatically optimizes instructions, formatting, reasoning, and security safeguards of a prompt.
   */
  optimizePrompt(promptText: string, options?: OptimizationOptions): string {
    return PromptOptimizer.optimize(promptText, options);
  }

  /**
   * Exposes the Registry.
   */
  getRegistry(): PromptRegistry {
    return this.registry;
  }

  /**
   * Exposes the Cache.
   */
  getCache(): PromptCache {
    return this.cache;
  }
}

export const promptEngine = PromptEngine.getInstance();
