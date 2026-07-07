/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { systemPrompts } from "./systemPrompts";
import { rolePrompts } from "./rolePrompts";
import { outputTemplates } from "./outputTemplates";

interface PromptVariables {
  query: string;
  context?: string;
  industry?: string;
  [key: string]: any;
}

export class UniversalPromptEngine {
  /**
   * Compiles a highly tailored AI instruction set based on active platform settings.
   */
  public static compilePrompt(
    systemKey: string,
    variables: PromptVariables,
    outputTemplateKey?: string
  ): string {
    const baseSystem = systemPrompts[systemKey] || systemPrompts.default;
    const industryKey = variables.industry || "general";
    const industryRole = rolePrompts[industryKey] || rolePrompts.general;
    const activeTemplate = outputTemplateKey ? (outputTemplates[outputTemplateKey] || "") : "";

    let compiled = `[SYSTEM INSTRUCTION]\n${baseSystem}\n\n[INDUSTRY ROLE]\n${industryRole}\n\n`;

    if (variables.context) {
      compiled += `[KNOWLEDGE CONTEXT]\n${variables.context}\n\n`;
    }

    compiled += `[USER PARAMETER]\n${variables.query}\n\n`;

    if (activeTemplate) {
      compiled += `[OUTPUT TEMPLATE SPECIFICATION - PLEASE STRICTLY CONFORM TO THIS FORMAT]\n${activeTemplate}\n`;
    }

    // Substitute variables if any brackets exist
    Object.keys(variables).forEach((key) => {
      if (key !== "query" && key !== "context") {
        compiled = compiled.replace(new RegExp(`{${key}}`, "g"), String(variables[key]));
      }
    });

    return compiled;
  }
}
