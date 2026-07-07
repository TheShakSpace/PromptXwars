/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve paths for ESM or CJS environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  maxContextTokens: number;
  defaultParams: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxTokens?: number;
    [key: string]: any;
  };
  fallbackModel?: string;
}

export class ProviderConfig {
  private static models: ModelInfo[] = [];

  static {
    try {
      const configPath = path.join(__dirname, "models.json");
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, "utf-8");
        this.models = JSON.parse(raw);
      } else {
        // Fallback hardcoded list if models.json cannot be read
        this.models = [
          {
            id: "gemini-3.5-flash",
            name: "Gemini 3.5 Flash",
            provider: "gemini",
            capabilities: ["chat", "coding", "vision", "ocr", "summarization", "translation", "classification", "extraction", "planning", "research", "automation"],
            inputCostPerMillion: 0.075,
            outputCostPerMillion: 0.3,
            maxContextTokens: 1048576,
            defaultParams: { temperature: 0.7, maxTokens: 4096 },
            fallbackModel: "claude-3-5-sonnet"
          }
        ];
      }
    } catch (err) {
      console.error("Failed to initialize ProviderConfig models list:", err);
    }
  }

  static getModels(): ModelInfo[] {
    return this.models;
  }

  static getModel(id: string): ModelInfo | undefined {
    return this.models.find((m) => m.id === id);
  }

  static getModelsByProvider(provider: string): ModelInfo[] {
    return this.models.filter((m) => m.provider === provider);
  }

  static getModelsByCapability(capability: string): ModelInfo[] {
    return this.models.filter((m) => m.capabilities.includes(capability));
  }

  static getApiKey(provider: string): string | undefined {
    switch (provider.toLowerCase()) {
      case "gemini":
        return process.env.GEMINI_API_KEY;
      case "openai":
        return process.env.OPENAI_API_KEY;
      case "claude":
        return process.env.ANTHROPIC_API_KEY;
      case "deepseek":
        return process.env.DEEPSEEK_API_KEY;
      case "llama":
        return process.env.LLAMA_API_KEY || process.env.REPLICATE_API_KEY;
      case "mistral":
        return process.env.MISTRAL_API_KEY;
      case "grok":
        return process.env.XAI_API_KEY;
      default:
        return undefined;
    }
  }

  static getEndpoint(provider: string): string | undefined {
    switch (provider.toLowerCase()) {
      case "openai":
        return process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
      case "claude":
        return process.env.ANTHROPIC_API_BASE || "https://api.anthropic.com/v1";
      case "deepseek":
        return process.env.DEEPSEEK_API_BASE || "https://api.deepseek.com";
      case "llama":
        return process.env.LLAMA_API_BASE || "https://api.llama-api.com";
      case "mistral":
        return process.env.MISTRAL_API_BASE || "https://api.mistral.ai/v1";
      case "grok":
        return process.env.XAI_API_BASE || "https://api.x.ai/v1";
      default:
        return undefined;
    }
  }
}
