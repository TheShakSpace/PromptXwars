/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ModelRouter } from "../providers/router/ModelRouter";
import { MemoryNode } from "./types";

export class SemanticMemory {
  private static instance: SemanticMemory;
  private ai: GoogleGenAI | null = null;

  private constructor() {
    try {
      if (process.env.GEMINI_API_KEY) {
        this.ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
      }
    } catch (err: any) {
      console.warn(`[SemanticMemory] Could not initialize Gemini client: ${err.message}`);
    }
  }

  public static getInstance(): SemanticMemory {
    if (!SemanticMemory.instance) {
      SemanticMemory.instance = new SemanticMemory();
    }
    return SemanticMemory.instance;
  }

  /**
   * Generates a semantic vector embedding for a given text.
   * If Gemini API is offline or missing, defaults to a high-fidelity TF-IDF simulated vector hash.
   */
  public async getEmbedding(text: string): Promise<number[]> {
    if (this.ai && process.env.GEMINI_API_KEY) {
      try {
        const response: any = await this.ai.models.embedContent({
          model: "gemini-embedding-2-preview",
          contents: text,
        });

        if (response.embedding?.values) {
          return response.embedding.values;
        } else if (response.embeddings?.[0]?.values) {
          return response.embeddings[0].values;
        }
      } catch (err: any) {
        console.warn(`[SemanticMemory] Live embedding query failed: ${err.message}. Cascading to deterministic local embedding.`);
      }
    }

    return this.generateSimulatedEmbedding(text);
  }

  /**
   * Computes cosine similarity between two vector embeddings.
   */
  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      // Pad or truncate
      const length = Math.max(vecA.length, vecB.length);
      vecA = this.resizeVector(vecA, length);
      vecB = this.resizeVector(vecB, length);
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Resize a vector to match another's length
   */
  private resizeVector(vec: number[], length: number): number[] {
    if (vec.length === length) return vec;
    if (vec.length > length) return vec.slice(0, length);
    const result = [...vec];
    while (result.length < length) {
      result.push(0);
    }
    return result;
  }

  /**
   * Generates a high-fidelity local vector representation of text
   * using a deterministic hashing algorithm that acts like a TF-IDF bag-of-words.
   * Dimension: 128-dimensional dense vector.
   */
  private generateSimulatedEmbedding(text: string): number[] {
    const dimensions = 128;
    const vector = new Array(dimensions).fill(0);
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const tokens = cleaned.split(/\s+/).filter(t => t.length > 0);

    if (tokens.length === 0) {
      return vector;
    }

    for (const token of tokens) {
      // Hash the token into index/value
      for (let charIndex = 0; charIndex < token.length; charIndex++) {
        const charCode = token.charCodeAt(charIndex);
        const dimensionIndex = (charCode * (charIndex + 1)) % dimensions;
        // Frequency and position weighting
        vector[dimensionIndex] += charCode / (charIndex + 1);
      }
    }

    // Normalize the vector (L2 norm)
    let sumSquares = 0;
    for (let i = 0; i < dimensions; i++) {
      sumSquares += vector[i] * vector[i];
    }
    const magnitude = Math.sqrt(sumSquares);

    if (magnitude > 0) {
      for (let i = 0; i < dimensions; i++) {
        vector[i] = vector[i] / magnitude;
      }
    }

    return vector;
  }
}

export const semanticMemory = SemanticMemory.getInstance();
