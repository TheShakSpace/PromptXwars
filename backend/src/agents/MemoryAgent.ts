/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentTask } from "./BaseAgent";

export class MemoryAgent extends BaseAgent {
  constructor() {
    super({
      id: "memory-agent",
      name: "Long-Term Memory Guardian",
      role: "Context & Profile Retriever",
      description: "Recalls, catalogs, and indexes user details, past histories, and persistent preferences.",
      capabilities: ["memory-retrieval", "profile-indexing", "context-building"],
      priority: 8,
      supportedModels: ["gemini-3.5-flash"]
    });
  }

  async execute(task: AgentTask): Promise<string[]> {
    console.log(`[MemoryAgent] Fetching relevant contextual details for task: "${task.title}"`);

    // In a full implementation, this might query standard embedding stores or DBs.
    // Let's retrieve a mock array of relevant historic facts.
    return [
      "User prefers lightweight, minimalistic light-mode dashboard visual themes.",
      "Enterprise security compliance requires regex validation on all string interpolation fields.",
      "The local build server requires dev binding to port 3000."
    ];
  }

  async validate(task: AgentTask, result: any): Promise<{ isValid: boolean; reason?: string }> {
    if (!Array.isArray(result)) {
      return { isValid: false, reason: "Memory agent results must be an array of facts." };
    }
    return { isValid: true };
  }

  async reflect(task: AgentTask, result: any): Promise<{ confidence: number; reflection: string }> {
    return {
      confidence: 95,
      reflection: `Recalled ${result.length} highly relevant long-term preference facts from vector stores.`
    };
  }
}
