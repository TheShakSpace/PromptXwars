/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoryEngine, MemoryNode } from "./MemoryEngine";
import { PromptEngine } from "./PromptEngine";

export interface ConsolidatedContext {
  mergedPrompt: string;
  systemPrompt: string;
  tokensEstimated: number;
  relevantKnowledgeNodes: MemoryNode[];
  regulatoryDirectivesApplied: string[];
}

export class ContextEngine {
  /**
   * Merges active parameters to compile a highly precise enterprise context window.
   */
  public static fuse(
    rawPrompt: string,
    activeIndustry: string,
    uploadedFileNames: string[] = []
  ): ConsolidatedContext {
    // 1. Compile primary governing system prompt based on selected industry
    const systemPrompt = PromptEngine.compile("orchestrator-core", { industry: activeIndustry });

    // 2. Query Memory for related knowledge or governance rules
    const semanticMatches = MemoryEngine.retrieveSemanticContext(activeIndustry);
    const pinnedNodes = MemoryEngine.getPinnedNodes();
    const relevantKnowledgeNodes = Array.from(new Set([...semanticMatches, ...pinnedNodes]));

    // 3. Extract key regulatory instructions
    const regulatoryDirectivesApplied = relevantKnowledgeNodes
      .filter((n) => n.category === "regulatory-rule")
      .map((n) => n.content);

    // 4. Incorporate active files context
    let filesPayload = "";
    if (uploadedFileNames.length > 0) {
      filesPayload = `\n\n[ATTACHED_RESOURCES_CONTEXT]\nFiles active: ${uploadedFileNames.join(", ")}\nParsed file content indexes bound to execution context.`;
    }

    // 5. Build final composite prompt
    const knowledgeChunk = relevantKnowledgeNodes
      .map((n) => `[MEMORY_NODE_${n.id.toUpperCase()}] (${n.category}): ${n.content}`)
      .join("\n");

    const mergedPrompt = `[SYSTEM_GOVERNANCE_INSTRUCTION]
${systemPrompt}

[SEMANTIC_KNOWLEDGE_BOUNDARIES]
${knowledgeChunk}
${filesPayload}

[USER_TRANSACTION_PAYLOAD]
${rawPrompt}

[RESPONSE_ENGINEERING_CONTRACT]
Begin step-by-step reasoning tree. Fulfill compliance thresholds completely.`;

    const tokensEstimated = Math.floor(mergedPrompt.length / 3.8);

    return {
      mergedPrompt,
      systemPrompt,
      tokensEstimated,
      relevantKnowledgeNodes,
      regulatoryDirectivesApplied,
    };
  }
}
