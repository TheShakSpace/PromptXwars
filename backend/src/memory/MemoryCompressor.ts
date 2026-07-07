/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryStore } from "./MemoryStore";
import { ModelRouter } from "../providers/router/ModelRouter";
import { MemoryNode, CompressedMemory } from "./types";

export class MemoryCompressor {
  private static instance: MemoryCompressor;

  private constructor() {}

  public static getInstance(): MemoryCompressor {
    if (!MemoryCompressor.instance) {
      MemoryCompressor.instance = new MemoryCompressor();
    }
    return MemoryCompressor.instance;
  }

  /**
   * Summarizes and compresses a list of conversation nodes.
   * Archives original entries and saves a consolidated fact summary node.
   */
  public async compressSession(sessionId: string, userId?: string): Promise<MemoryNode> {
    const rawHistory = memoryStore
      .getAll()
      .filter((n) => n.type === "conversation" && n.sessionId === sessionId);

    if (rawHistory.length === 0) {
      throw new Error(`No active conversation logs found for session: ${sessionId}`);
    }

    const conversationText = rawHistory
      .map((n) => n.content)
      .join("\n");

    let summaryText = "";
    let extractedFacts: string[] = [];

    const prompt = `You are an AI Memory Compressor. Analyze the following conversation transcript and compress it.
Provide a highly dense, professional summary of the discussion, and extract any long-term user preferences, decisions, or critical factual details.

Output your response strictly as a JSON block matching this structure:
{
  "summary": "Concise summary of the conversation...",
  "facts": ["Fact 1", "Fact 2", "Preference X"]
}

TRANSCRIPT:
${conversationText}
`;

    try {
      // Execute query using multi-model fallback executor
      const response = await ModelRouter.executeWithFallback(
        "text",
        async (provider, modelId) => {
          return await provider.generate(prompt, {
            model: modelId,
            temperature: 0.1,
          });
        }
      );

      const parsed = this.parseJsonBlock(response.text);
      summaryText = parsed.summary || "Conversation summarized successfully.";
      extractedFacts = parsed.facts || [];
    } catch (err: any) {
      console.warn(`[MemoryCompressor] LLM Compression failed: ${err.message}. Running deterministic local fallbacks.`);
      summaryText = this.localFallbackSummary(rawHistory);
      extractedFacts = this.localFallbackFacts(rawHistory);
    }

    // Save compressed fact node to the store
    const compressedNode = memoryStore.save({
      type: "long",
      content: `[COMPRESSED SESSION CONTEXT] - Summary: ${summaryText}\nExtracted Facts:\n${extractedFacts.map(f => `- ${f}`).join("\n")}`,
      tags: ["compression", sessionId, "archive"],
      importance: 8,
      confidence: 0.95,
      sessionId,
      userId,
      metadata: {
        originalNodeIds: rawHistory.map((n) => n.id),
        summary: summaryText,
        extractedFacts,
        compressedAt: new Date().toISOString(),
      },
    });

    // Mark original nodes as archived to prevent cluttering primary short-term retrieval pipelines
    for (const node of rawHistory) {
      memoryStore.save({
        ...node,
        type: "archived",
      });
    }

    return compressedNode;
  }

  private parseJsonBlock(text: string): { summary: string; facts: string[] } {
    let clean = text.trim();
    if (clean.startsWith("```json")) {
      clean = clean.substring(7);
    } else if (clean.startsWith("```")) {
      clean = clean.substring(3);
    }
    if (clean.endsWith("```")) {
      clean = clean.substring(0, clean.length - 3);
    }
    return JSON.parse(clean.trim());
  }

  private localFallbackSummary(history: MemoryNode[]): string {
    const messageCount = history.length;
    const keywords = new Set<string>();

    for (const node of history) {
      const words = node.content.split(/\s+/).filter(w => w.length > 5);
      for (const w of words.slice(0, 5)) {
        keywords.add(w.replace(/[^a-zA-Z]/g, ""));
      }
    }

    return `Compressed session of ${messageCount} dialogue turns. Core topics: ${Array.from(keywords).slice(0, 6).join(", ")}.`;
  }

  private localFallbackFacts(history: MemoryNode[]): string[] {
    const userInputs = history.filter(h => h.content.includes("[USER]"));
    const preferences: string[] = [];

    for (const input of userInputs) {
      const content = input.content.replace("[USER]:", "").trim();
      if (content.toLowerCase().includes("prefer") || content.toLowerCase().includes("always") || content.toLowerCase().includes("favorite")) {
        preferences.push(content);
      }
    }

    if (preferences.length === 0) {
      preferences.push("Discussed technical objectives and interface setups.");
    }

    return preferences;
  }
}

export const memoryCompressor = MemoryCompressor.getInstance();
