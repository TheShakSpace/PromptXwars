/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workflow } from "../types";
import { workflowValidator } from "../validator/WorkflowValidator";

export class WorkflowParser {
  private static instance: WorkflowParser;

  private constructor() {}

  public static getInstance(): WorkflowParser {
    if (!WorkflowParser.instance) {
      WorkflowParser.instance = new WorkflowParser();
    }
    return WorkflowParser.instance;
  }

  /**
   * Imports and validates a workflow from a string definition (JSON or simple YAML)
   */
  public parse(content: string, format: "json" | "yaml"): Workflow {
    let rawObj: any;

    if (format === "json") {
      try {
        rawObj = JSON.parse(content);
      } catch (err: any) {
        throw new Error(`Failed to parse workflow JSON: ${err.message}`);
      }
    } else {
      // Simple lightweight manual YAML parsing for robust dependency-free execution
      try {
        rawObj = this.parseSimpleYaml(content);
      } catch (err: any) {
        throw new Error(`Failed to parse workflow YAML: ${err.message}`);
      }
    }

    return workflowValidator.validate(rawObj);
  }

  /**
   * Exports a workflow object into the targeted string representation
   */
  public stringify(workflow: Workflow, format: "json" | "yaml" | "markdown"): string {
    if (format === "json") {
      return JSON.stringify(workflow, null, 2);
    } else if (format === "yaml") {
      return this.stringifySimpleYaml(workflow);
    } else {
      return this.exportToMarkdown(workflow);
    }
  }

  /**
   * Converts a workflow to a beautifully structured technical Markdown description
   */
  private exportToMarkdown(workflow: Workflow): string {
    let md = `# Workflow: ${workflow.name} (v${workflow.version})\n\n`;
    md += `**Description:** ${workflow.description}\n`;
    md += `**Author:** ${workflow.author}\n`;
    md += `**Execution Mode:** ${workflow.config.mode}\n\n`;

    md += `## Steps Outline\n\n`;
    for (const step of workflow.steps) {
      md += `### Step [${step.id}]: ${step.title}\n`;
      if (step.description) md += `*Description:* ${step.description}\n\n`;
      md += `- **Type:** ${step.type}\n`;
      if (step.agent) md += `- **Target Agent:** \`${step.agent}\`\n`;
      if (step.tool) md += `- **Target Tool:** \`${step.tool}\`\n`;
      if (step.priority) md += `- **Priority:** ${step.priority}\n`;
      if (step.nextStepId) md += `- **Next step on success:** \`${step.nextStepId}\`\n`;
      if (step.condition) {
        const cond = step.condition;
        md += `- **Branching Condition:** If \`${cond.field || "result"}\` ${cond.operator} \`${cond.value || ""}\`\n`;
        if (cond.trueStepId) md += `  - **True path:** \`${cond.trueStepId}\`\n`;
        if (cond.falseStepId) md += `  - **False path:** \`${cond.falseStepId}\`\n`;
      }
      md += `\n`;
    }

    return md;
  }

  /**
   * Custom robust simple YAML line parser
   */
  private parseSimpleYaml(yamlStr: string): any {
    // Falls back to direct JSON if it's already structured as JSON, else uses standard block conversion
    const trimmed = yamlStr.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return JSON.parse(trimmed);
    }

    const lines = yamlStr.split("\n");
    const result: any = {};
    let currentStepList: any[] = [];
    let currentStep: any = null;
    let inSteps = false;

    for (const line of lines) {
      const match = line.match(/^(\s*)([^:]+):(.*)$/);
      if (!match) continue;

      const indent = match[1].length;
      const key = match[2].trim().replace(/^['"]|['"]$/g, "");
      let value = match[3].trim().replace(/^['"]|['"]$/g, "");

      if (key === "steps") {
        inSteps = true;
        result.steps = currentStepList;
        continue;
      }

      if (inSteps) {
        if (line.trim().startsWith("-")) {
          currentStep = {};
          currentStepList.push(currentStep);
          // extract trailing info
          const parts = line.trim().substring(1).split(":");
          if (parts.length > 1) {
            const stepKey = parts[0].trim();
            const stepVal = parts.slice(1).join(":").trim();
            currentStep[stepKey] = stepVal;
          }
          continue;
        }

        if (currentStep && indent >= 4) {
          if (value === "") {
            // handle start of object
            currentStep[key] = {};
          } else {
            // Check nested config or parse primitives
            if (value === "true") currentStep[key] = true;
            else if (value === "false") currentStep[key] = false;
            else if (!isNaN(Number(value))) currentStep[key] = Number(value);
            else currentStep[key] = value;
          }
        }
      } else {
        if (indent === 0) {
          if (value === "") {
            result[key] = {};
          } else {
            if (value === "true") result[key] = true;
            else if (value === "false") result[key] = false;
            else if (!isNaN(Number(value))) result[key] = Number(value);
            else result[key] = value;
          }
        } else if (indent > 0) {
          const keys = Object.keys(result);
          const parentKey = keys[keys.length - 1];
          if (parentKey && typeof result[parentKey] === "object") {
            if (value === "true") result[parentKey][key] = true;
            else if (value === "false") result[parentKey][key] = false;
            else if (!isNaN(Number(value))) result[parentKey][key] = Number(value);
            else result[parentKey][key] = value;
          }
        }
      }
    }

    // Double fallback in case of highly complex nested structures - compile simple representation
    if (!result.steps || result.steps.length === 0) {
      // Just do a basic conversion or structure if simple YAML parser skipped it
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  private stringifySimpleYaml(obj: any, indent = 0): string {
    let yaml = "";
    const prefix = " ".repeat(indent);

    for (const [key, val] of Object.entries(obj)) {
      if (val === null || val === undefined) continue;

      if (Array.isArray(val)) {
        yaml += `${prefix}${key}:\n`;
        for (const item of val) {
          if (typeof item === "object") {
            yaml += `${prefix}  -\n`;
            yaml += this.stringifySimpleYaml(item, indent + 4);
          } else {
            yaml += `${prefix}  - ${item}\n`;
          }
        }
      } else if (typeof val === "object") {
        yaml += `${prefix}${key}:\n`;
        yaml += this.stringifySimpleYaml(val, indent + 2);
      } else {
        yaml += `${prefix}${key}: ${val}\n`;
      }
    }

    return yaml;
  }
}

export const workflowParser = WorkflowParser.getInstance();
