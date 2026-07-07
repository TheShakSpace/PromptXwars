/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProviderOptions {
  model?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  safetySettings?: Record<string, any>;
  reasoningBudget?: number;
  signal?: AbortSignal;
}

export interface ProviderUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface ProviderResponse {
  id: string;
  provider: string;
  model: string;
  text: string;
  reasoning?: string;
  usage: ProviderUsage;
  finishReason: string;
  latency: number;
  metadata?: Record<string, any>;
}

export interface ProviderStreamChunk {
  id: string;
  provider: string;
  model: string;
  text: string;
  reasoning?: string;
  usage?: ProviderUsage;
  finishReason?: string;
  latency?: number;
  metadata?: Record<string, any>;
}

export interface ModerationResult {
  flagged: boolean;
  categories: Record<string, boolean>;
  scores: Record<string, number>;
}

export interface ProviderHealthStatus {
  status: "healthy" | "unhealthy";
  latency: number;
  error?: string;
  lastChecked: string;
}

export interface AIProvider {
  id: string;
  name: string;
  initialize(): Promise<void>;
  generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse>;
  stream(prompt: string, options?: ProviderOptions): Promise<ReadableStream<ProviderStreamChunk>>;
  vision(prompt: string, imageBase64: string, mimeType: string, options?: ProviderOptions): Promise<ProviderResponse>;
  embedding(text: string | string[], options?: ProviderOptions): Promise<number[][]>;
  moderate(text: string): Promise<ModerationResult>;
  countTokens(prompt: string): Promise<number>;
  healthCheck(): Promise<ProviderHealthStatus>;
}
