/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from "../interfaces/AIProvider.interface";
import { GeminiProvider } from "../gemini/GeminiProvider";
import { OpenAIProvider } from "../openai/OpenAIProvider";
import { ClaudeProvider } from "../claude/ClaudeProvider";
import { DeepSeekProvider } from "../deepseek/DeepSeekProvider";
import { LlamaProvider } from "../llama/LlamaProvider";
import { MistralProvider } from "../mistral/MistralProvider";
import { GrokProvider } from "../grok/GrokProvider";

export class ProviderRegistry {
  private static providers: Map<string, AIProvider> = new Map();
  private static initialized = false;

  static {
    this.bootstrap();
  }

  /**
   * Bootstraps and registers all default core providers.
   */
  private static bootstrap(): void {
    if (this.initialized) return;

    this.register(new GeminiProvider());
    this.register(new OpenAIProvider());
    this.register(new ClaudeProvider());
    this.register(new DeepSeekProvider());
    this.register(new LlamaProvider());
    this.register(new MistralProvider());
    this.register(new GrokProvider());

    this.initialized = true;
  }

  /**
   * Registers a new provider.
   */
  static register(provider: AIProvider): void {
    this.providers.set(provider.id.toLowerCase(), provider);
  }

  /**
   * Retrieves a registered provider by its ID.
   */
  static get(providerId: string): AIProvider | undefined {
    return this.providers.get(providerId.toLowerCase());
  }

  /**
   * Checks if a provider exists.
   */
  static has(providerId: string): boolean {
    return this.providers.has(providerId.toLowerCase());
  }

  /**
   * Returns all registered providers.
   */
  static getAll(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Initializes all registered providers.
   */
  static async initializeAll(): Promise<void> {
    const promises = Array.from(this.providers.values()).map(async (provider) => {
      try {
        await provider.initialize();
      } catch (err) {
        console.error(`Failed to initialize provider: ${provider.name}`, err);
      }
    });
    await Promise.all(promises);
  }
}
