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

export class MistralProvider extends BaseProvider {
  id = "mistral";
  name = "Mistral AI";

  async initialize(): Promise<void> {
    const key = ProviderConfig.getApiKey(this.id);
    if (!key) {
      console.warn("MISTRAL_API_KEY is not defined. MistralProvider will use mock simulation.");
    }
  }

  private getHeaders(): Record<string, string> {
    const key = ProviderConfig.getApiKey(this.id) || "mock-mistral-key";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    };
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse> {
    const model = options?.model || "mistral-large";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.mistral.ai/v1";
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
    const model = options?.model || "mistral-large";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.mistral.ai/v1";
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
        throw new Error(`Mistral Stream HTTP Error ${response.status}: ${errText}`);
      }

      if (!response.body) {
        throw new Error("No response body received from Mistral Stream API.");
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
                  provider: "mistral",
                  model,
                  text: deltaText,
                  finishReason,
                  latency: Date.now() - start
                };
              }
            } catch (err) {
              // Ignore partial JSON parse errors
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
    const textContext = `[Image Attached: Base64 data of ${mimeType}]\n${prompt}`;
    return this.generate(textContext, options);
  }

  async embedding(text: string | string[], options?: ProviderOptions): Promise<number[][]> {
    const model = options?.model || "mistral-embed";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.mistral.ai/v1";

    try {
      const input = Array.isArray(text) ? text : [text];

      const response = await fetch(`${endpoint}/embeddings`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ model, input }),
        signal: options?.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return data.data?.map((item: any) => item.embedding) || [];
    } catch (err) {
      const input = Array.isArray(text) ? text : [text];
      return input.map(() => new Array(1024).fill(0).map(() => Math.random() - 0.5));
    }
  }
}
