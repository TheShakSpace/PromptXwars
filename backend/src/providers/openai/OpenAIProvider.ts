/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseProvider } from "../base/BaseProvider";
import {
  ProviderOptions,
  ProviderResponse,
  ProviderStreamChunk,
  ModerationResult
} from "../interfaces/AIProvider.interface";
import { ProviderConfig } from "../config/ProviderConfig";
import { TokenTracker } from "../utils/TokenTracker";
import { StreamingManager } from "../utils/StreamingManager";

export class OpenAIProvider extends BaseProvider {
  id = "openai";
  name = "OpenAI GPT";

  async initialize(): Promise<void> {
    const key = ProviderConfig.getApiKey(this.id);
    if (!key) {
      console.warn("OPENAI_API_KEY is not defined. OpenAIProvider will use mock simulation.");
    }
  }

  private getHeaders(): Record<string, string> {
    const key = ProviderConfig.getApiKey(this.id) || "mock-openai-key";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    };
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse> {
    const model = options?.model || "gpt-4o";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.openai.com/v1";
    const start = Date.now();

    try {
      const body: Record<string, any> = {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens
      };

      if (options?.topP !== undefined) body.top_p = options?.topP;

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
    const model = options?.model || "gpt-4o";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.openai.com/v1";
    const start = Date.now();

    const headers = this.getHeaders();
    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
      stream: true
    };

    const self = this;

    const streamGenerator = async function* () {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: options?.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI Stream HTTP Error ${response.status}: ${errText}`);
      }

      if (!response.body) {
        throw new Error("No response body received from OpenAI Stream API.");
      }

      // Read SSE stream
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
              const delta = parsed.choices?.[0]?.delta?.content || "";
              const finishReason = parsed.choices?.[0]?.finish_reason || undefined;

              if (delta || finishReason) {
                yield {
                  id: parsed.id || `chunk-${Math.random()}`,
                  provider: "openai",
                  model,
                  text: delta,
                  finishReason,
                  latency: Date.now() - start
                };
              }
            } catch (err) {
              // Ignore partial JSON parsing errors
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
    const model = options?.model || "gpt-4o";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.openai.com/v1";
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
    const model = options?.model || "text-embedding-3-small";
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.openai.com/v1";

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
      throw this.handleProviderError(err);
    }
  }

  override async moderate(text: string): Promise<ModerationResult> {
    const endpoint = ProviderConfig.getEndpoint(this.id) || "https://api.openai.com/v1";
    
    try {
      const response = await fetch(`${endpoint}/moderations`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ input: text })
      });

      if (!response.ok) {
        // Fallback to base regex moderation if endpoint fails
        return super.moderate(text);
      }

      const data = await response.json();
      const results = data.results?.[0];

      if (!results) {
        return super.moderate(text);
      }

      return {
        flagged: results.flagged,
        categories: results.categories,
        scores: results.category_scores
      };
    } catch (err) {
      return super.moderate(text);
    }
  }
}
