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
import { TokenTracker } from "../utils/TokenTracker";
import { StreamingManager } from "../utils/StreamingManager";

export class MockProvider extends BaseProvider {
  id: string;
  name: string;
  
  // Test configuration hooks
  shouldFail = false;
  simulatedLatencyMs = 10;
  mockResponseText = "Mocked AI Response Content";
  failureMessage = "Mocked service outage or rate limit hit.";

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }

  async initialize(): Promise<void> {}

  async generate(prompt: string, options?: ProviderOptions): Promise<ProviderResponse> {
    const start = Date.now();
    
    if (this.simulatedLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulatedLatencyMs));
    }

    if (this.shouldFail) {
      throw this.handleProviderError(new Error(this.failureMessage));
    }

    const latency = Date.now() - start;
    const text = `${this.mockResponseText} for: ${prompt}`;
    const inputTokens = TokenTracker.estimateTokenCount(prompt);
    const outputTokens = TokenTracker.estimateTokenCount(text);

    return this.createStandardResponse(
      options?.model || "mock-model",
      text,
      inputTokens,
      outputTokens,
      latency
    );
  }

  async stream(prompt: string, options?: ProviderOptions): Promise<ReadableStream<ProviderStreamChunk>> {
    const start = Date.now();
    const model = options?.model || "mock-model";
    const self = this;

    const generator = async function* () {
      if (self.shouldFail) {
        throw self.handleProviderError(new Error(self.failureMessage));
      }

      const words = `${self.mockResponseText} stream chunk`.split(" ");
      for (const word of words) {
        if (self.simulatedLatencyMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, self.simulatedLatencyMs / words.length));
        }

        yield {
          id: `mock-chunk-${Math.random()}`,
          provider: self.id,
          model,
          text: word + " ",
          latency: Date.now() - start
        };
      }
    };

    return StreamingManager.createReadableStream(generator);
  }

  async vision(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    options?: ProviderOptions
  ): Promise<ProviderResponse> {
    return this.generate(`[Vision: ${mimeType}] ${prompt}`, options);
  }

  async embedding(text: string | string[], options?: ProviderOptions): Promise<number[][]> {
    const texts = Array.isArray(text) ? text : [text];
    return texts.map(() => new Array(8).fill(0).map(() => Math.random()));
  }
}
