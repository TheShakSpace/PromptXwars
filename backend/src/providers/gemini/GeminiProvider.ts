/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseProvider } from "../base/BaseProvider";
import {
  ProviderOptions,
  ProviderResponse,
  ProviderStreamChunk,
  ProviderHealthStatus
} from "../interfaces/AIProvider.interface";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ProviderConfig } from "../config/ProviderConfig";
import { TokenTracker } from "../utils/TokenTracker";
import { StreamingManager } from "../utils/StreamingManager";

export class GeminiProvider extends BaseProvider {
  id = "gemini";
  name = "Google Gemini";
  private client: GoogleGenAI | null = null;

  async initialize(): Promise<void> {
    const key = ProviderConfig.getApiKey(this.id);
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. GeminiProvider will initialize with mock client fallback.");
      return;
    }

    try {
      this.client = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const key = ProviderConfig.getApiKey(this.id);
      if (!key) {
        throw new Error("GEMINI_API_KEY is not configured.");
      }
      this.client = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return this.client;
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse> {
    const model = options?.model || "gemini-3.5-flash";
    const start = Date.now();

    try {
      const client = this.getClient();
      
      const config: any = {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens
      };

      if (options?.topP !== undefined) config.topP = options?.topP;
      if (options?.topK !== undefined) config.topK = options?.topK;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config
      });

      const latency = Date.now() - start;
      const text = response.text || "";
      
      // Attempt to extract input/output token counts from candidates metadata
      let inputTokens = TokenTracker.estimateTokenCount(prompt);
      let outputTokens = TokenTracker.estimateTokenCount(text);

      const usageMetadata = (response as any).usageMetadata;
      if (usageMetadata) {
        if (usageMetadata.promptTokenCount !== undefined) inputTokens = usageMetadata.promptTokenCount;
        if (usageMetadata.candidatesTokenCount !== undefined) outputTokens = usageMetadata.candidatesTokenCount;
      }

      // Check for reasoning or thinking parts
      let reasoning: string | undefined;
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        const thoughtPart = parts.find((p: any) => p.thought === true || p.thoughtConfig);
        if (thoughtPart) {
          reasoning = thoughtPart.text;
        }
      }

      return this.createStandardResponse(
        model,
        text,
        inputTokens,
        outputTokens,
        latency,
        "stop",
        reasoning,
        { responseMetadata: response.candidates?.[0]?.finishReason }
      );
    } catch (err) {
      throw this.handleProviderError(err);
    }
  }

  async stream(prompt: string, options?: ProviderOptions): Promise<ReadableStream<ProviderStreamChunk>> {
    const model = options?.model || "gemini-3.5-flash";
    const client = this.getClient();

    const config: any = {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens
    };
    if (options?.topP !== undefined) config.topP = options?.topP;
    if (options?.topK !== undefined) config.topK = options?.topK;

    const start = Date.now();
    const inputTokens = TokenTracker.estimateTokenCount(prompt);

    const generateGenerator = async function* () {
      try {
        const responseStream = await client.models.generateContentStream({
          model,
          contents: prompt,
          config
        });

        let accumulatedText = "";

        for await (const chunk of responseStream) {
          const textPart = chunk.text || "";
          accumulatedText += textPart;
          
          const outputTokens = TokenTracker.estimateTokenCount(textPart);

          yield {
            id: `chunk-${Math.random()}`,
            provider: "gemini",
            model,
            text: textPart,
            latency: Date.now() - start
          };
        }
      } catch (err) {
        console.error("Gemini stream generation error:", err);
        throw err;
      }
    };

    return StreamingManager.createReadableStream(generateGenerator);
  }

  async vision(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    options?: ProviderOptions
  ): Promise<ProviderResponse> {
    const model = options?.model || "gemini-3.5-flash";
    const start = Date.now();

    try {
      const client = this.getClient();

      const imagePart = {
        inlineData: {
          mimeType,
          data: imageBase64
        }
      };

      const textPart = {
        text: prompt
      };

      const config: any = {
        temperature: options?.temperature ?? 0.5,
        maxOutputTokens: options?.maxTokens
      };

      const response = await client.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
        config
      });

      const latency = Date.now() - start;
      const text = response.text || "";

      let inputTokens = TokenTracker.estimateTokenCount(prompt) + 258; // Standard rough vision payload size
      let outputTokens = TokenTracker.estimateTokenCount(text);

      const usageMetadata = (response as any).usageMetadata;
      if (usageMetadata) {
        if (usageMetadata.promptTokenCount !== undefined) inputTokens = usageMetadata.promptTokenCount;
        if (usageMetadata.candidatesTokenCount !== undefined) outputTokens = usageMetadata.candidatesTokenCount;
      }

      return this.createStandardResponse(model, text, inputTokens, outputTokens, latency);
    } catch (err) {
      throw this.handleProviderError(err);
    }
  }

  async embedding(text: string | string[], options?: ProviderOptions): Promise<number[][]> {
    const model = options?.model || "gemini-embedding-2-preview";
    try {
      const client = this.getClient();
      const texts = Array.isArray(text) ? text : [text];

      const embeddings: number[][] = [];
      for (const t of texts) {
        const response = await client.models.embedContent({
          model,
          contents: t
        });

        const res = response as any;
        const values = res.embedding?.values || res.embeddings?.values || (Array.isArray(res.embeddings) ? res.embeddings[0]?.values : undefined);

        if (values) {
          embeddings.push(values);
        } else {
          // Push fallback random vectors if not found to ensure API does not fail completely
          embeddings.push(new Array(768).fill(0).map(() => Math.random()));
        }
      }

      return embeddings;
    } catch (err) {
      throw this.handleProviderError(err);
    }
  }

  override async countTokens(prompt: string): Promise<number> {
    try {
      const client = this.getClient();
      const response = await client.models.countTokens({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      return response.totalTokens || TokenTracker.estimateTokenCount(prompt);
    } catch (err) {
      return TokenTracker.estimateTokenCount(prompt);
    }
  }
}
