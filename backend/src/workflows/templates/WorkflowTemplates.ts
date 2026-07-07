/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workflow } from "../types";

export const WorkflowTemplates: Record<string, Workflow> = {
  research: {
    id: "tpl_research",
    name: "Enterprise Market & Competitor Research",
    description: "Multi-stage intelligent search, visual cataloging, strategic reasoning, and report formatting pipeline.",
    version: "1.0.0",
    author: "System Architect",
    config: {
      mode: "Sequential",
      timeout: 60000,
    },
    steps: [
      {
        id: "input_topic",
        title: "Ingest Research Topic",
        type: "Input",
        input: { prompt: "Please specify the business sector, competitor domain, or technology trend you want researched." },
        nextStepId: "web_search",
      },
      {
        id: "web_search",
        title: "Execute Multi-Source Search",
        type: "Search",
        tool: "web-search",
        input: { query: "Latest trends and competitor movements in: {{input_topic.prompt}}" },
        nextStepId: "synthesize_trends",
      },
      {
        id: "synthesize_trends",
        title: "Analyze & Synthesize Context",
        type: "Reasoning",
        input: { prompt: "Analyze search logs: {{web_search.results}} and derive a competitor matrix." },
        nextStepId: "format_report",
      },
      {
        id: "format_report",
        title: "Format Final Briefing Document",
        type: "Formatting",
        input: { template: "## Market Intelligence Report\n\n### Matrix Summary\n{{synthesize_trends.result}}" },
      },
    ],
  },

  coding: {
    id: "tpl_coding",
    name: "AI-Powered Code Construction & Validation",
    description: "Generates high quality code from architectural plans, runs immediate code linting tests, and formats final source files.",
    version: "1.0.0",
    author: "Infrastructure Dev Team",
    config: {
      mode: "Sequential",
      timeout: 30000,
    },
    steps: [
      {
        id: "requirements",
        title: "Load Feature Requirements",
        type: "Input",
        input: { specs: "Build a TypeScript base model representing an abstract tool with dynamic property validators." },
        nextStepId: "draft_code",
      },
      {
        id: "draft_code",
        title: "Draft Initial TypeScript Code",
        type: "Prompt",
        input: { instruction: "Write robust TypeScript code satisfying the specifications: {{requirements.specs}}" },
        nextStepId: "validate_syntax",
      },
      {
        id: "validate_syntax",
        title: "Validate TypeScript Syntax Integrity",
        type: "Validation",
        tool: "custom-tool",
        input: { code: "{{draft_code.result}}" },
        nextStepId: "beautify_code",
      },
      {
        id: "beautify_code",
        title: "Format & Export Code Document",
        type: "Export",
        input: { filename: "BaseToolDefinition.ts", content: "{{beautify_code.result}}" },
      },
    ],
  },

  healthcare: {
    id: "tpl_healthcare",
    name: "Clinical Guideline Compliance Assistant",
    description: "Cross-checks clinical notes against professional medical standards schemas with strict safety validations.",
    version: "1.0.0",
    author: "Clinical Informatics Group",
    config: {
      mode: "Sequential",
      timeout: 15000,
    },
    steps: [
      {
        id: "patient_notes",
        title: "Ingest De-identified Patient Notes",
        type: "Input",
        input: { notes: "Patient presents with fatigue and elevated resting pulse of 95 bpm." },
        nextStepId: "standard_lookup",
      },
      {
        id: "standard_lookup",
        title: "Cross-reference Clinical Standards",
        type: "Reasoning",
        input: { guideline: "AHA Guidelines for elevated heart rates", notes: "{{patient_notes.notes}}" },
        nextStepId: "safety_validation",
      },
      {
        id: "safety_validation",
        title: "Strict Safety & Compliance Assessment",
        type: "Validation",
        input: { complianceRules: "Verify compliance with professional billing codes and HIPAA guidelines.", sourceText: "{{standard_lookup.result}}" },
        nextStepId: "clinical_briefing",
      },
      {
        id: "clinical_briefing",
        title: "Generate Physician Summary",
        type: "Formatting",
        input: { outline: "Guideline Verification Report:\n{{safety_validation.result}}" },
      },
    ],
  },

  finance: {
    id: "tpl_finance",
    name: "Automated Portfolio Analytics & Reporting",
    description: "Calculates metric yields, formats compliance spreadsheets, and generates comprehensive investor briefings.",
    version: "1.0.0",
    author: "Risk Analytics Team",
    config: {
      mode: "Sequential",
      timeout: 20000,
    },
    steps: [
      {
        id: "portfolio_data",
        title: "Ingest Asset Ledger",
        type: "Input",
        input: { positions: "Asset A: 100 shares at $45, Asset B: 200 shares at $12" },
        nextStepId: "calculate_risk",
      },
      {
        id: "calculate_risk",
        title: "Calculate Allocation Risk Values",
        type: "Execution",
        tool: "calculator",
        input: { operation: "multiply", a: 100, b: 45 },
        nextStepId: "risk_modeling",
      },
      {
        id: "risk_modeling",
        title: "Perform Compliance Modeling",
        type: "Reasoning",
        input: { positions: "{{portfolio_data.positions}}", computedValue: "{{calculate_risk.result}}" },
        nextStepId: "compile_newsletter",
      },
      {
        id: "compile_newsletter",
        title: "Format Stakeholder Brief",
        type: "Formatting",
        input: { template: "Investor Portfolio Allocation Health: {{risk_modeling.result}}" },
      },
    ],
  },

  customer_support: {
    id: "tpl_customer_support",
    name: "Smart Support Ticket Resolution",
    description: "Intelligently classifies customer ticket intents, pulls relevant matching articles, drafts a reply, and alerts representatives.",
    version: "1.0.0",
    author: "CX Operations",
    config: {
      mode: "Sequential",
      timeout: 10000,
    },
    steps: [
      {
        id: "ticket_input",
        title: "Ingest Ticket Text",
        type: "Input",
        input: { ticket: "I was billed twice for last month's platform subscription renewal." },
        nextStepId: "intent_classification",
      },
      {
        id: "intent_classification",
        title: "Classify Customer Intent",
        type: "Reasoning",
        input: { text: "{{ticket_input.ticket}}" },
        nextStepId: "draft_resolution",
      },
      {
        id: "draft_resolution",
        title: "Draft Suggested CX Reply",
        type: "Prompt",
        input: { context: "Billing resolution guideline", intent: "{{intent_classification.result}}", ticket: "{{ticket_input.ticket}}" },
        nextStepId: "alert_rep",
      },
      {
        id: "alert_rep",
        title: "Push Resolution Draft Alert",
        type: "Notification",
        tool: "notification",
        input: { message: "Suggested response is ready for ticket: {{ticket_input.ticket}}" },
      },
    ],
  },
};
