/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OutputFormat, VariableValues } from "./PromptTemplate";
import { PromptVariableResolver } from "./PromptVariableResolver";

export class PromptRenderer {
  /**
   * Translates a format enum into explicit, system-level output constraints.
   */
  static getFormatDirective(format: OutputFormat): string {
    switch (format) {
      case OutputFormat.JSON:
        return [
          "",
          "---",
          "CRITICAL SYSTEM CONSTRAINT ON OUTPUT FORMAT:",
          "Your output MUST be formatted as a valid, parsable JSON block matching the requested schema.",
          "Ensure any double-quotes inside string literals are properly escaped.",
          "Return ONLY the raw JSON string wrapped inside a single standard ```json and ``` code fence, without any conversational preamble or postscript commentary."
        ].join("\n");

      case OutputFormat.TABLE:
        return [
          "",
          "---",
          "CRITICAL SYSTEM CONSTRAINT ON OUTPUT FORMAT:",
          "Your output must be formatted strictly as an elegant, clean Markdown table.",
          "Include a clear header row, proper column dividers, and neat alignment.",
          "Avoid any extra surrounding narrative text."
        ].join("\n");

      case OutputFormat.HTML:
        return [
          "",
          "---",
          "CRITICAL SYSTEM CONSTRAINT ON OUTPUT FORMAT:",
          "Your output must be formatted as semantic, clean, valid HTML5 elements.",
          "Do NOT include outer html/head/body boilerplate tags unless explicitly asked; return only the inner fragments.",
          "Wrap it inside a ```html code fence."
        ].join("\n");

      case OutputFormat.BULLET_LIST:
        return [
          "",
          "---",
          "CRITICAL SYSTEM CONSTRAINT ON OUTPUT FORMAT:",
          "Structure your response exclusively as a highly readable bulleted list.",
          "Each item should begin with a standard asterisk (*) and be concise, action-oriented, and highly scannable."
        ].join("\n");

      case OutputFormat.TIMELINE:
        return [
          "",
          "---",
          "CRITICAL SYSTEM CONSTRAINT ON OUTPUT FORMAT:",
          "Your response must be formatted as a structured chronological timeline.",
          "Use sequential timestamps or phase markers (e.g., [Phase 1], [08:00 AM]) at the start of each event.",
          "Arrange milestones chronologically from earliest to latest."
        ].join("\n");

      case OutputFormat.STRUCTURED_OBJECT:
        return [
          "",
          "---",
          "CRITICAL SYSTEM CONSTRAINT ON OUTPUT FORMAT:",
          "Your response must be structured as a fully detailed object schema.",
          "Use clear key-value attributes to represent all requested fields.",
          "Wrap the output inside a clean JSON code block."
        ].join("\n");

      case OutputFormat.MARKDOWN:
      default:
        return [
          "",
          "---",
          "CRITICAL SYSTEM CONSTRAINT ON OUTPUT FORMAT:",
          "Your response must be structured using standard, highly elegant GitHub Flavored Markdown (GFM).",
          "Use expressive headers, bullet points, numbered lists, code snippets, or inline highlights to maximize readability."
        ].join("\n");
    }
  }

  /**
   * Renders a raw template by resolving variables, appending output directives, and ensuring clean spacing.
   */
  static render(
    template: string,
    variables: VariableValues,
    format: OutputFormat = OutputFormat.MARKDOWN,
    strict = false
  ): string {
    // 1. Resolve variable mappings
    const resolvedPrompt = PromptVariableResolver.resolve(template, variables, strict);

    // 2. Resolve format instructions
    const formatDirective = this.getFormatDirective(format);

    // 3. Assemble and return with clean spacing
    return `${resolvedPrompt.trim()}\n${formatDirective}`;
  }
}
