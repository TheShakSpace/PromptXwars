/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderStreamChunk } from "../interfaces/AIProvider.interface";

export class StreamingManager {
  /**
   * Utility to wrap a promise with a timeout.
   */
  static withTimeout<T>(promise: Promise<T>, ms: number, errorMessage = "Operation timed out"): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(errorMessage)), ms);
      promise
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  /**
   * Helper to run a task with exponential backoff retries.
   */
  static async withRetry<T>(
    task: () => Promise<T>,
    retries = 3,
    delayMs = 1000,
    shouldRetry: (err: any) => boolean = () => true
  ): Promise<T> {
    let lastError: any;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await task();
      } catch (err: any) {
        lastError = err;
        if (attempt === retries || !shouldRetry(err)) {
          break;
        }
        console.warn(`Attempt ${attempt} failed: ${err.message}. Retrying in ${currentDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= 2; // exponential backoff
      }
    }

    throw lastError;
  }

  /**
   * Converts an async generator into a standard ReadableStream of ProviderStreamChunks.
   */
  static createReadableStream(
    generator: () => AsyncGenerator<ProviderStreamChunk, void, unknown>,
    onAbort?: () => void
  ): ReadableStream<ProviderStreamChunk> {
    const iterator = generator();

    return new ReadableStream<ProviderStreamChunk>({
      async pull(controller) {
        try {
          const { value, done } = await iterator.next();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value as ProviderStreamChunk);
          }
        } catch (err: any) {
          controller.error(err);
        }
      },
      cancel() {
        if (onAbort) {
          onAbort();
        }
      }
    });
  }
}
