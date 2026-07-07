/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  userTemplate: string;
  category: "clinical" | "finance" | "legal" | "general";
}

export class PromptService {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    // Register Default Universal Prompts
    this.register({
      id: "clinical-soap-generator",
      name: "Clinical SOAP Summary Notes",
      description: "Generates standardized medical record SOAP envelopes.",
      category: "clinical",
      systemPrompt: "You are an elite Clinical Scribe & AI SOAP Expert. Analyze vital signs, subjective medical histories, objective testing parameters, and generate high-compliance SOAP charts. Scrub all identifying PII in the output.",
      userTemplate: "Vitals: {{vitals}}\nSubjective Complaint: {{complaint}}\nObjective Findings: {{findings}}",
    });

    this.register({
      id: "finance-risk-hedger",
      name: "Portfolio Risk Hedger",
      description: "Provides hedging formulations for unstable asset clusters.",
      category: "finance",
      systemPrompt: "You are a Quantitative Risk Analyst and Portfolio Hedging Strategist. Evaluate yield curves, standard deviation ratios, and calculate optimal hedging vectors to minimize risk exposure.",
      userTemplate: "Portfolio Assets: {{assets}}\nTarget Protection Delta: {{delta}}\nMarket Index Variables: {{market}}",
    });

    this.register({
      id: "legal-audit-compliance",
      name: "Liability Statute Auditor",
      description: "Checks commercial contract patterns against regulatory risk.",
      category: "legal",
      systemPrompt: "You are a Corporate Legal Counsel & Compliance Auditor. Cross-reference contract clauses with liability statutes and safety boundaries to mark gaps and suggest optimal fallback legal text.",
      userTemplate: "Target Agreement Draft: {{contract}}\nRegulatory Standard Checklist: {{checklist}}",
    });

    this.register({
      id: "general-cognitive-assistant",
      name: "Helios Reasoner Mode",
      description: "General deep-reasoning multi-step answers.",
      category: "general",
      systemPrompt: "You are Helios, the core cognitive reasoner. Answer user requests with step-by-step logic, clear structure, and modular output formatting.",
      userTemplate: "Target Query: {{query}}",
    });
  }

  public getTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  public register(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }
}

// Global service
export const promptService = new PromptService();
