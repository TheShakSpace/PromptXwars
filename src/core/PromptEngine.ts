/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
}

export class PromptEngine {
  private static templates: Map<string, PromptTemplate> = new Map();

  static {
    // Register System Prompts
    this.register({
      id: "orchestrator-core",
      name: "Core Orchestrator Prompt",
      template: `You are the Helios AI Operating System Core. You govern agent orchestration, telemetry, and industry pivoting.
Your active context profile is [{{industry}}].
Keep all metrics accurate. Filter all output for PII compliance.
Always reason before dispatching actions.`,
      variables: ["industry"],
    });

    // Register Role Prompts
    this.register({
      id: "agent-planner",
      name: "Planner Persona",
      template: `You are the Lead Strategic Planner Agent. Your goal is to dissect complex requests into structured sequential milestones.
User Goal: "{{goal}}"
Break the goal into exactly 3 execution milestones. Allocate specialized agents to each milestone.
Provide high-confidence scheduling.`,
      variables: ["goal"],
    });

    this.register({
      id: "agent-reasoner",
      name: "Deep Reasoner Persona",
      template: `You are the Cognitive Reasoner. Evaluate the statement: "{{statement}}"
Generate rigorous step-by-step logic. Grade your self-confidence from 0 to 100%. Highlight counter-claims.`,
      variables: ["statement"],
    });

    this.register({
      id: "agent-validator",
      name: "Validator Core",
      template: `You are the Output Validator. Audit the following text for safety, hallucination, and SOC-2 guidelines:
Content: "{{content}}"
Output a validation score from 0.0 to 1.0. Flag any structural violations.`,
      variables: ["content"],
    });

    // Register Safety and PII Filter Template
    this.register({
      id: "safety-guardrail",
      name: "PII & Leakage Guard",
      template: `Scan the following data and redact names, phone numbers, SSNs, and private patient tags prior to model dispatches:
Raw: "{{raw_data}}"`,
      variables: ["raw_data"],
    });
  }

  public static register(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  public static getTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  public static compile(id: string, values: Record<string, string>): string {
    const pt = this.templates.get(id);
    if (!pt) {
      throw new Error(`Prompt template with ID '${id}' is not loaded.`);
    }

    let compiled = pt.template;
    for (const v of pt.variables) {
      const val = values[v] !== undefined ? values[v] : `[MISSING_${v.toUpperCase()}]`;
      compiled = compiled.replace(new RegExp(`{{${v}}}`, "g"), val);
    }
    return compiled;
  }
}
