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

export class GrokProvider extends BaseProvider {
  id = "grok";
  name = "xAI Grok";

  async initialize(): Promise<void> {
    const key = ProviderConfig.getApiKey(this.id);
    if (!key) {
      console.warn("XAI_API_KEY is not defined. GrokProvider will use mock simulation.");
    }
  }

  private getHeaders(): Record<string, string> {
    const key = ProviderConfig.getApiKey(this.id) || "mock-grok-key";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    };
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse> {
    const model = options?.model || "grok-2";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.x.ai/v1";
    const start = Date.now();

    try {
      const body: Record<string, any> = {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens
      };

      const response = await fetch(`${endpoint}/chat/completions`, {
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

      const text = data.choices?.[0]?.message?.content || "";
      const finishReason = data.choices?.[0]?.finish_reason || "stop";

      const inputTokens = data.usage?.prompt_tokens ?? TokenTracker.estimateTokenCount(prompt);
      const outputTokens = data.usage?.completion_tokens ?? TokenTracker.estimateTokenCount(text);

      return this.createStandardResponse(model, text, inputTokens, outputTokens, latency, finishReason);
    } catch (err) {
      throw this.handleProviderError(err);
    }
  }

  async stream(prompt: string, options?: ProviderOptions): Promise<ReadableStream<ProviderStreamChunk>> {
    const model = options?.model || "grok-2";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.x.ai/v1";
    const start = Date.now();

    const headers = this.getHeaders();
    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
      stream: true
    };

    const streamGenerator = async function* () {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: options?.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Grok Stream HTTP Error ${response.status}: ${errText}`);
      }

      if (!response.body) {
        throw new Error("No response body received from Grok Stream API.");
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
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const deltaText = parsed.choices?.[0]?.delta?.content || "";
              const finishReason = parsed.choices?.[0]?.finish_reason || undefined;

              if (deltaText || finishReason) {
                yield {
                  id: parsed.id || `chunk-${Math.random()}`,
                  provider: "grok",
                  model,
                  text: deltaText,
                  finishReason,
                  latency: Date.now() - start
                };
              }
            } catch (err) {
              // Ignore partial line parses
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
    const model = options?.model || "grok-2";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.x.ai/v1";
    const start = Date.now();

    try {
      const imageUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:${mimeType};base64,${imageBase64}`;

      const body = {
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        temperature: options?.temperature ?? 0.5,
        max_tokens: options?.maxTokens
      };

      const response = await fetch(`${endpoint}/chat/completions`, {
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

      const text = data.choices?.[0]?.message?.content || "";
      const finishReason = data.choices?.[0]?.finish_reason || "stop";

      const inputTokens = data.usage?.prompt_tokens ?? (TokenTracker.estimateTokenCount(prompt) + 200);
      const outputTokens = data.usage?.completion_tokens ?? TokenTracker.estimateTokenCount(text);

      return this.createStandardResponse(model, text, inputTokens, outputTokens, latency, finishReason);
    } catch (err) {
      throw this.handleProviderError(err);
    }
  }

  async embedding(text: string | string[], options?: ProviderOptions): Promise<number[][]> {
    const texts = Array.isArray(text) ? text : [text];
    return texts.map(() => new Array(1536).fill(0).map(() => Math.random() - 0.5));
  }
}
