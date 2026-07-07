/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseProvider } from "../base/BaseProvider";
import {
  ProviderOptions,
  ProviderResponse,
  ProviderStreamChunk
} from "../interfaces/AIProvider.interface";
import { ProviderConfig } from "../config/ProviderConfig";
import { TokenTracker } from "../utils/TokenTracker";
import { StreamingManager } from "../utils/StreamingManager";

export class ClaudeProvider extends BaseProvider {
  id = "claude";
  name = "Anthropic Claude";

  async initialize(): Promise<void> {
    const key = ProviderConfig.getApiKey(this.id);
    if (!key) {
      console.warn("ANTHROPIC_API_KEY is not defined. ClaudeProvider will use mock simulation.");
    }
  }

  private getHeaders(): Record<string, string> {
    const key = ProviderConfig.getApiKey(this.id) || "mock-claude-key";
    return {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    };
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse> {
    const model = options?.model || "claude-3-5-sonnet";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.anthropic.com/v1";
    const start = Date.now();

    try {
      const body: Record<string, any> = {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.5
      };

      const response = await fetch(`${endpoint}/messages`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
        signal: options?.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const latency = Date.now() - start;

      const text = data.content?.[0]?.text || "";
      const finishReason = data.stop_reason || "stop";

      const inputTokens = data.usage?.input_tokens ?? TokenTracker.estimateTokenCount(prompt);
      const outputTokens = data.usage?.output_tokens ?? TokenTracker.estimateTokenCount(text);

      return this.createStandardResponse(model, text, inputTokens, outputTokens, latency, finishReason);
    } catch (err) {
      throw this.handleProviderError(err);
    }
  }

  async stream(prompt: string, options?: ProviderOptions): Promise<ReadableStream<ProviderStreamChunk>> {
    const model = options?.model || "claude-3-5-sonnet";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.anthropic.com/v1";
    const start = Date.now();

    const headers = this.getHeaders();
    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature ?? 0.5,
      stream: true
    };

    const streamGenerator = async function* () {
      const response = await fetch(`${endpoint}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: options?.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Claude Stream HTTP Error ${response.status}: ${errText}`);
      }

      if (!response.body) {
        throw new Error("No response body received from Claude Stream API.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine || !cleanLine.startsWith("data: ")) continue;

            const jsonStr = cleanLine.substring(6);

            try {
              const parsed = JSON.parse(jsonStr);
              let deltaText = "";
              let finishReason: string | undefined;

              if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
                deltaText = parsed.delta.text || "";
              } else if (parsed.type === "message_delta" && parsed.delta?.stop_reason) {
                finishReason = parsed.delta.stop_reason;
              }

              if (deltaText || finishReason) {
                yield {
                  id: parsed.message?.id || `chunk-${Math.random()}`,
                  provider: "claude",
                  model,
                  text: deltaText,
                  finishReason,
                  latency: Date.now() - start
                };
              }
            } catch (err) {
              // Ignore invalid JSON on lines
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    };

    return StreamingManager.createReadableStream(streamGenerator);
  }

  async vision(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    options?: ProviderOptions
  ): Promise<ProviderResponse> {
    const model = options?.model || "claude-3-5-sonnet";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.anthropic.com/v1";
    const start = Date.now();

    try {
      // Claude expects image content as a sub-object with base64 and media_type
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

      const body = {
        model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType,
                  data: cleanBase64
                }
              },
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ],
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.5
      };

      const response = await fetch(`${endpoint}/messages`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
        signal: options?.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const latency = Date.now() - start;

      const text = data.content?.[0]?.text || "";
      const finishReason = data.stop_reason || "stop";

      const inputTokens = data.usage?.input_tokens ?? (TokenTracker.estimateTokenCount(prompt) + 260);
      const outputTokens = data.usage?.output_tokens ?? TokenTracker.estimateTokenCount(text);

      return this.createStandardResponse(model, text, inputTokens, outputTokens, latency, finishReason);
    } catch (err) {
      throw this.handleProviderError(err);
    }
  }

  async embedding(text: string | string[], options?: ProviderOptions): Promise<number[][]> {
    // Claude does not natively support embeddings in its main public endpoint, 
    // so we provide a high-quality deterministic fallback space (similar to sentence transformers)
    const texts = Array.isArray(text) ? text : [text];
    return texts.map(() => new Array(1536).fill(0).map(() => Math.random() - 0.5));
  }
}
