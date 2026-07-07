/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VariableValues } from "./PromptTemplate";

export class PromptVariableResolver {
  private static injectionPatterns = [
    /ignore\s+(?:the\s+)?(?:above|previous|below|instruction|system\s+prompt)/i,
    /bypass\s+restrictions/i,
    /you\s+are\s+now\s+(?:an\s+)?unrestricted/i,
    /system\s+(?:override|bypass|shutdown)/i,
    /do\s+not\s+follow\s+(?:any\s+)?rules/i,
    /forget\s+all\s+(?:previous\s+)?instructions/i,
    /dan\s+mode/i,
    /jailbreak/i,
    /assistant\s+must\s+ignore/i
  ];

  /**
   * Resolves template variables by parsing template format "{{variableName}}" and substituting values.
   */
  static resolve(template: string, values: VariableValues, strict = false): string {
    // Generate default variables if not supplied
    const fullValues: VariableValues = {
      date: new Date().toLocaleDateString("en-US"),
      time: new Date().toLocaleTimeString("en-US"),
      location: "San Francisco, CA", // Default sample
      language: "English",
      ...values
    };

    let rendered = template;
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

    rendered = rendered.replace(regex, (match, key) => {
      const val = fullValues[key];
      if (val === undefined || val === null) {
        if (strict) {
          throw new Error(`Variable "${key}" is missing and strict resolution is active.`);
        }
        return `{{${key}}}`; // Leave placeholders if not found and not strict
      }

      const stringifiedValue = typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
      
      // Perform automated protection checks
      if (this.detectPromptInjection(stringifiedValue)) {
        console.warn(`[Prompt Engine Alert] Potential prompt injection payload blocked on variable "${key}".`);
        return this.sanitize(stringifiedValue) + "\n[Engine Warning: This user-supplied input has been sanitized to preserve instructions]";
      }

      return this.escape(stringifiedValue);
    });

    return rendered;
  }

  /**
   * Sanitizes variables to clean off system overrides or potential structural breakers.
   */
  static sanitize(value: string): string {
    let sanitized = value;
    // Replace injection attempts or dangerous system override key phrases
    for (const pattern of this.injectionPatterns) {
      sanitized = sanitized.replace(pattern, "[redacted bypass attempt]");
    }
    return sanitized;
  }

  /**
   * Escapes special brackets or characters to prevent the input itself from acting as nested templates.
   */
  static escape(value: string): string {
    // Escape standard template braces so that user-provided text cannot inject variables
    return value.replace(/\{\{/g, "\\{\\{").replace(/\}\}/g, "\\}\\}");
  }

  /**
   * Scans a string payload for prompt injection signatures.
   */
  static detectPromptInjection(value: string): boolean {
    return this.injectionPatterns.some((pattern) => pattern.test(value));
  }

  /**
   * Validates a template string against expected variables and checks for brace integrity.
   * Returns list of missing or unparsed placeholders.
   */
  static validate(template: string, expectedVariables: string[] = []): {
    isValid: boolean;
    missing: string[];
    extra: string[];
    errors: string[];
  } {
    const errors: string[] = [];
    const foundVariables = new Set<string>();
    
    // Check brace balance
    const openCount = (template.match(/\{\{/g) || []).length;
    const closeCount = (template.match(/\}\}/g) || []).length;

    if (openCount !== closeCount) {
      errors.push(`Brace imbalance detected: template has ${openCount} open braces "{{", but ${closeCount} close braces "}}".`);
    }

    // Extract variables
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    let match;
    while ((match = regex.exec(template)) !== null) {
      foundVariables.add(match[1]);
    }

    const missing = expectedVariables.filter((v) => !foundVariables.has(v));
    const extra = Array.from(foundVariables).filter((v) => !expectedVariables.includes(v));

    return {
      isValid: errors.length === 0,
      missing,
      extra,
      errors
    };
  }
}
