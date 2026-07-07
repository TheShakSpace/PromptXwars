/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkflowStepDefinition {
  id: string;
  name: string;
  agentId: string;
  toolId?: string;
  promptKey: string;
  outputTemplateKey?: string;
  expectedDuration: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  industry: "general" | "healthcare" | "finance" | "education" | "legal" | "cybersecurity";
  description: string;
  steps: WorkflowStepDefinition[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "general-research",
    name: "Autonomous Research Workflow",
    industry: "general",
    description: "Multi-stage data ingestion, planner evaluation, reasoning synthesis, and executive briefing output.",
    steps: [
      { id: "ingest", name: "Semantic Query Parsing", agentId: "planner", promptKey: "default", expectedDuration: "250ms" },
      { id: "retrieve", name: "Deep Web Index Retrieval", agentId: "researcher", toolId: "web_search", promptKey: "research", expectedDuration: "1400ms" },
      { id: "synthesize", name: "Executive Briefing Compilation", agentId: "coder", promptKey: "coding", outputTemplateKey: "markdown_brief", expectedDuration: "800ms" },
    ],
  },
  {
    id: "clinical-synthesis",
    name: "HIPAA Clinical SOAP Synthesis",
    industry: "healthcare",
    description: "Extract clinical vitals, check interactions, cross-examine with research journals, and output structured SOAP summaries.",
    steps: [
      { id: "vital-extract", name: "Vital Metric Ingestion (OCR)", agentId: "researcher", toolId: "ocr", promptKey: "research", expectedDuration: "600ms" },
      { id: "journal-check", name: "PubMed Research Cross-Examination", agentId: "researcher", toolId: "web_search", promptKey: "research", expectedDuration: "1800ms" },
      { id: "soap-compile", name: "Structured Clinical Note Generation", agentId: "planner", promptKey: "default", outputTemplateKey: "clinical_soap", expectedDuration: "1100ms" },
    ],
  },
  {
    id: "finance-risk",
    name: "Algorithmic Risk Attribution",
    industry: "finance",
    description: "Ingest asset parameters, parse corporate balance sheets, execute model-based valuations, and build risk reports.",
    steps: [
      { id: "balance-parse", name: "Asset Portfolio Extraction", agentId: "researcher", toolId: "ocr", promptKey: "research", expectedDuration: "900ms" },
      { id: "valuation-eval", name: "Quantitative Matrix Computation", agentId: "coder", toolId: "calculator", promptKey: "coding", outputTemplateKey: "diagnostic_json", expectedDuration: "1200ms" },
    ],
  },
  {
    id: "security-audit",
    name: "SAST Vulnerability Evaluation",
    industry: "cybersecurity",
    description: "Inspect code repositories for security flaws, run taint evaluations, compile patches, and verify defenses.",
    steps: [
      { id: "taint-scan", name: "Vulnerability Pattern Matcher", agentId: "researcher", toolId: "ocr", promptKey: "research", expectedDuration: "500ms" },
      { id: "defense-verify", name: "Threat Vector Modeling", agentId: "coder", promptKey: "coding", outputTemplateKey: "diagnostic_json", expectedDuration: "1300ms" },
    ],
  },
];
