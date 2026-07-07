/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { NodeType, WorkflowNode } from "./types";
import {
  LogIn,
  FileText,
  Bookmark,
  BookOpen,
  Search,
  Brain,
  Activity,
  GitPullRequest,
  Eye,
  Scan,
  Mic,
  Wrench,
  Database,
  Zap,
  Globe,
  CheckCircle2,
  Sparkles,
  LogOut,
} from "lucide-react";

export interface NodeTemplate {
  type: NodeType;
  name: string;
  category: "input" | "intelligence" | "processing" | "action" | "output";
  description: string;
  icon: any;
  color: string;
  glowColor: string;
  defaultPrompt?: string;
  defaultSettings?: any;
}

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: "input",
    name: "User Query Trigger",
    category: "input",
    description: "Captures natural language user intent & query input.",
    icon: LogIn,
    color: "#64748B",
    glowColor: "rgba(100,116,139,0.4)",
    defaultPrompt: "What is the capital of France?",
  },
  {
    type: "ocr",
    name: "Document OCR Engine",
    category: "input",
    description: "Extracts textual content from PDF or Image uploads.",
    icon: Scan,
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.4)",
  },
  {
    type: "speech",
    name: "Speech To Text",
    category: "input",
    description: "Converts streaming voice input into clean query tokens.",
    icon: Mic,
    color: "#0EA5E9",
    glowColor: "rgba(14,165,233,0.4)",
  },
  {
    type: "vision",
    name: "Vision Analysis",
    category: "input",
    description: "Processes visuals, detects objects & classifies layout.",
    icon: Eye,
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.4)",
  },
  {
    type: "prompt",
    name: "System Prompt Craft",
    category: "intelligence",
    description: "Sets persona directives, response structures & rules.",
    icon: FileText,
    color: "#EC4899",
    glowColor: "rgba(236,72,153,0.4)",
    defaultPrompt: "You are a helpful assistant.",
    defaultSettings: { temperature: 0.7, maxTokens: 1024 },
  },
  {
    type: "context",
    name: "Static Context Injector",
    category: "intelligence",
    description: "Appends system configurations, schemas & constants.",
    icon: Bookmark,
    color: "#D946EF",
    glowColor: "rgba(217,70,239,0.4)",
  },
  {
    type: "knowledge",
    name: "Knowledge Vector Base",
    category: "intelligence",
    description: "Maintains reference documents & specialized data stores.",
    icon: BookOpen,
    color: "#8B5CF6",
    glowColor: "rgba(139,92,246,0.4)",
  },
  {
    type: "retriever",
    name: "RAG Retrieval Router",
    category: "intelligence",
    description: "Queries high-valency matches using vector similarity.",
    icon: Search,
    color: "#6366F1",
    glowColor: "rgba(99,102,241,0.4)",
  },
  {
    type: "memory",
    name: "Episodic Long-Term Memory",
    category: "intelligence",
    description: "Retrieves past historical interactions & context summary.",
    icon: Brain,
    color: "#A855F7",
    glowColor: "rgba(168,85,247,0.4)",
  },
  {
    type: "reasoning",
    name: "Chain Of Thought Reasoner",
    category: "processing",
    description: "Deconstructs prompts into mathematical verification graphs.",
    icon: Activity,
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.4)",
  },
  {
    type: "planning",
    name: "Task Planner & Decomposer",
    category: "processing",
    description: "Schedules parallel agent calls & evaluates pathways.",
    icon: GitPullRequest,
    color: "#EF4444",
    glowColor: "rgba(239,68,68,0.4)",
  },
  {
    type: "tool",
    name: "Action Execution Tool",
    category: "action",
    description: "Invokes custom Python sandboxes, Web scrapers or shell scripts.",
    icon: Wrench,
    color: "#F97316",
    glowColor: "rgba(249,115,22,0.4)",
  },
  {
    type: "database",
    name: "DBMS Connector",
    category: "action",
    description: "Executes ACID queries, mutations & fetches relational trees.",
    icon: Database,
    color: "#10B981",
    glowColor: "rgba(16,185,129,0.4)",
  },
  {
    type: "automation",
    name: "Trigger Event Webhook",
    category: "action",
    description: "Dispatches events, triggers emails or updates CRM states.",
    icon: Zap,
    color: "#14B8A6",
    glowColor: "rgba(20,184,166,0.4)",
  },
  {
    type: "api",
    name: "Third-Party REST API",
    category: "action",
    description: "Makes authenticated JSON payloads exchanges via HTTPS.",
    icon: Globe,
    color: "#22C55E",
    glowColor: "rgba(34,197,94,0.4)",
  },
  {
    type: "validation",
    name: "Output Guardrails Validator",
    category: "processing",
    description: "Filters toxic phrases, formats JSON & validates type shapes.",
    icon: CheckCircle2,
    color: "#84CC16",
    glowColor: "rgba(132,204,22,0.4)",
  },
  {
    type: "generator",
    name: "Gemini Synthesis Engine",
    category: "processing",
    description: "Generates rich text/code outputs using Gemini 2.5 Flash.",
    icon: Sparkles,
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.4)",
    defaultSettings: { temperature: 0.2, topP: 0.95 },
  },
  {
    type: "output",
    name: "Final Output Renderer",
    category: "output",
    description: "Converts generated responses into clean structured reports.",
    icon: LogOut,
    color: "#10B981",
    glowColor: "rgba(16,185,129,0.4)",
  },
];

export function getNodeTemplateByType(type: NodeType): NodeTemplate {
  return (
    NODE_TEMPLATES.find((t) => t.type === type) || {
      type: "prompt",
      name: "Unknown Node",
      category: "intelligence",
      description: "Custom modular extension.",
      icon: FileText,
      color: "#FFFFFF",
      glowColor: "rgba(255,255,255,0.2)",
    }
  );
}

interface NodeLibraryProps {
  onAddNode: (type: NodeType) => void;
}

export function NodeLibrary({ onAddNode }: NodeLibraryProps) {
  const categories = [
    { id: "input", label: "Inputs & Signals" },
    { id: "intelligence", label: "Cognition & Data" },
    { id: "processing", label: "AI Reasoning" },
    { id: "action", label: "Tools & Integrations" },
    { id: "output", label: "Delivery" },
  ];

  return (
    <div className="flex flex-col gap-4 select-none h-full overflow-y-auto pr-1 scrollbar-thin">
      <div className="border-b border-white/5 pb-2">
        <h3 className="font-mono text-[9px] text-[#A855F7] tracking-widest uppercase font-black">
          NODE BLUEPRINT ARCHIVE
        </h3>
        <p className="text-[10px] text-white/40 mt-0.5">Click any node to inject into canvas</p>
      </div>

      {categories.map((cat) => {
        const templatesInCat = NODE_TEMPLATES.filter((t) => t.category === cat.id);
        if (templatesInCat.length === 0) return null;

        return (
          <div key={cat.id} className="flex flex-col gap-1.5 mt-1">
            <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/30">
              {cat.label}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {templatesInCat.map((tmpl) => {
                const Icon = tmpl.icon;
                return (
                  <button
                    key={tmpl.type}
                    onClick={() => onAddNode(tmpl.type)}
                    className="flex items-start text-left p-2.5 rounded-xl border border-white/5 bg-[#050505]/35 hover:bg-white/[0.04] hover:border-white/10 active:scale-[0.98] transition-all duration-200 group cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300"
                      style={{ backgroundColor: tmpl.color }}
                    />
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 border"
                      style={{
                        backgroundColor: `${tmpl.color}10`,
                        borderColor: `${tmpl.color}25`,
                        color: tmpl.color,
                        boxShadow: `0 0 10px ${tmpl.color}15`,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-white/90 group-hover:text-white transition-colors truncate">
                          {tmpl.name}
                        </span>
                      </div>
                      <p className="text-[8.5px] text-white/35 group-hover:text-white/50 transition-colors leading-snug mt-0.5 truncate">
                        {tmpl.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
