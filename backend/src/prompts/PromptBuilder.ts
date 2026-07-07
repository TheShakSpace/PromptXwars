/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OutputFormat, VariableValues } from "./PromptTemplate";
import { RoleManager } from "./RoleManager";
import { ContextInjector, ContextPayload } from "./ContextInjector";
import { PromptRenderer } from "./PromptRenderer";
import { PromptVariableResolver } from "./PromptVariableResolver";

export class PromptBuilder {
  private systemPrompt = "";
  private roleName = "";
  private roleInstruction = "";
  private userInput = "";
  private outputFormat = OutputFormat.MARKDOWN;
  private memories: string[] = [];
  private contextPayload: ContextPayload = {};
  private variables: VariableValues = {};

  private static roleManager = new RoleManager();

  /**
   * Appends/sets a global system prompt structure.
   */
  setSystemPrompt(prompt: string): this {
    this.systemPrompt = prompt;
    return this;
  }

  /**
   * Sets an expert role for the prompt persona.
   */
  setRole(roleName: string, customInstruction?: string): this {
    this.roleName = roleName;
    this.roleInstruction = PromptBuilder.roleManager.getRolePrompt(roleName, customInstruction);
    return this;
  }

  /**
   * Adds custom memories to the prompt state.
   */
  setMemory(memories: string[]): this {
    this.memories = memories;
    return this;
  }

  /**
   * Loads complex contexts (conversations, RAG search results, file payloads).
   */
  setContext(payload: ContextPayload): this {
    this.contextPayload = { ...this.contextPayload, ...payload };
    return this;
  }

  /**
   * Merges specific variables or values.
   */
  setVariables(variables: VariableValues): this {
    this.variables = { ...this.variables, ...variables };
    return this;
  }

  /**
   * Sets the core dynamic user request.
   */
  setUserInput(input: string): this {
    this.userInput = input;
    return this;
  }

  /**
   * Sets the expected output constraint format.
   */
  setOutputFormat(format: OutputFormat): this {
    this.outputFormat = format;
    return this;
  }

  /**
   * Executes the prompt building assembly pipeline:
   * System Prompt
   * ↓
   * Role Prompt
   * ↓
   * Memory / Profile
   * ↓
   * Context / Attachments
   * ↓
   * User Input / Task Details
   * ↓
   * Variable Interpolation
   * ↓
   * Format Directives
   * ↓
   * Final Rendered Prompt
   */
  build(strict = false): string {
    const segments: string[] = [];

    // 1. Core Instructions
    if (this.systemPrompt) {
      segments.push("=== SYSTEM INSTRUCTIONS ===\n" + this.systemPrompt);
    }

    // 2. Role Identity
    if (this.roleInstruction) {
      segments.push("=== EXPERT PERSONA ===\n" + this.roleInstruction);
    }

    // 3. Inject memories if available
    const assembledPayload: ContextPayload = { ...this.contextPayload };
    if (this.memories.length > 0) {
      assembledPayload.memory = [...(assembledPayload.memory || []), ...this.memories];
    }

    // 4. Assemble complex context structures
    const contextBlock = ContextInjector.assemble(assembledPayload);
    if (contextBlock) {
      segments.push("=== RELEVANT CONTEXT AND ENVIRONMENT ===\n" + contextBlock);
    }

    // 5. User Input
    if (this.userInput) {
      segments.push("=== USER TASK AND REQUEST ===\n" + this.userInput);
    }

    // Combine all sections with high-contrast demarcators
    const rawCompiledTemplate = segments.join("\n\n");

    // 6. Resolve variables and append format directives
    return PromptRenderer.render(
      rawCompiledTemplate,
      this.variables,
      this.outputFormat,
      strict
    );
  }
}
