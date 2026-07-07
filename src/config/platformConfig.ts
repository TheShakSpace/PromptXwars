/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIModel } from "../types";

// Define the model config to switch across different global AI vendors
export interface ModelConfig {
  id: string;
  name: string;
  provider: "Google" | "Anthropic" | "OpenAI" | "DeepSeek" | "Meta";
  modelName: string;
  maxTokens: number;
  costPer1kInput: number;
  costPer1kOutput: number;
  latencyRating: "excellent" | "good" | "fair";
  isEnabled: boolean;
}

// Sidebar modular navigation structures
export interface SidebarModuleConfig {
  id: string;
  label: string;
  iconName: string;
  badge?: string;
  isEnabled: boolean;
  category: "navigation" | "tools" | "settings";
}

// Autonomous Agent declarations
export interface AgentPluginConfig {
  id: string;
  name: string;
  description: string;
  avatarIcon: string;
  systemPromptPresetId: string;
  isEnabled: boolean;
  isExperimental: boolean;
}

// Tool plugins
export interface ToolPluginConfig {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isEnabled: boolean;
}

// Feature Flag controls
export interface FeatureFlags {
  enableBetaFeatures: boolean;
  enableDeveloperMode: boolean;
  telemetryLogging: boolean;
  hapticFeedback: boolean;
  offlineSupport: boolean;
}

// Root Platform Configuration schema
export interface UniversalPlatformConfig {
  activeIndustry: "general" | "healthcare" | "finance" | "education" | "legal" | "cybersecurity";
  defaultModelId: string;
  models: ModelConfig[];
  modules: SidebarModuleConfig[];
  agents: AgentPluginConfig[];
  tools: ToolPluginConfig[];
  featureFlags: FeatureFlags;
}

export const platformConfig: UniversalPlatformConfig = {
  activeIndustry: "general", // "general" | "healthcare" | "finance" | "education" | "legal" | "cybersecurity"
  defaultModelId: "gemini-3.5-flash",
  models: [
    {
      id: "gemini-3.5-flash",
      name: "Gemini 1.5 Flash (Default)",
      provider: "Google",
      modelName: "gemini-3.5-flash",
      maxTokens: 1048576,
      costPer1kInput: 0.000075,
      costPer1kOutput: 0.0003,
      latencyRating: "excellent",
      isEnabled: true,
    },
    {
      id: "gemini-3.1-pro",
      name: "Gemini 1.5 Pro (Precision Mode)",
      provider: "Google",
      modelName: "gemini-3.1-pro-preview",
      maxTokens: 2097152,
      costPer1kInput: 0.00125,
      costPer1kOutput: 0.00375,
      latencyRating: "good",
      isEnabled: true,
    },
    {
      id: "gpt-4o",
      name: "GPT-4o Omniscient",
      provider: "OpenAI",
      modelName: "gpt-4o",
      maxTokens: 128000,
      costPer1kInput: 0.0025,
      costPer1kOutput: 0.0075,
      latencyRating: "good",
      isEnabled: false, // Flagged off in local preview configuration
    },
    {
      id: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      modelName: "claude-3-5-sonnet",
      maxTokens: 200000,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
      latencyRating: "good",
      isEnabled: false,
    },
    {
      id: "deepseek-coder",
      name: "DeepSeek R1",
      provider: "DeepSeek",
      modelName: "deepseek-reasoner",
      maxTokens: 64000,
      costPer1kInput: 0.00014,
      costPer1kOutput: 0.00028,
      latencyRating: "fair",
      isEnabled: false,
    },
  ],
  modules: [
    { id: "dashboard", label: "Helios Dashboard", iconName: "Cpu", isEnabled: true, category: "navigation" },
    { id: "chat", label: "Neural Handshake", iconName: "MessageSquare", isEnabled: true, category: "navigation" },
    { id: "vision", label: "Vision Workspace", iconName: "Eye", isEnabled: true, category: "navigation" },
    { id: "knowledge", label: "Knowledge Bank", iconName: "BookOpen", isEnabled: true, category: "tools" },
    { id: "design-system", label: "Design System", iconName: "Layers", isEnabled: true, category: "tools" },
    { id: "settings", label: "Settings & Caches", iconName: "Settings", isEnabled: true, category: "settings" },
  ],
  agents: [
    {
      id: "researcher",
      name: "Synaptic Researcher",
      description: "Performs deep multi-agent web retrieval and synthesizes references with citations.",
      avatarIcon: "Search",
      systemPromptPresetId: "sys-research",
      isEnabled: true,
      isExperimental: false,
    },
    {
      id: "coder",
      name: "Synthesis Engineer",
      description: "Produces strictly-typed, self-documenting TypeScript components adhering to modular guidelines.",
      avatarIcon: "Terminal",
      systemPromptPresetId: "sys-coding",
      isEnabled: true,
      isExperimental: false,
    },
    {
      id: "planner",
      name: "Orchestration Planner",
      description: "Generates linear step-by-step workflow definitions mapping out cognitive reasoning routes.",
      avatarIcon: "Workflow",
      systemPromptPresetId: "sys-planning",
      isEnabled: true,
      isExperimental: false,
    },
  ],
  tools: [
    { id: "ocr", name: "Vision OCR Parser", description: "Converts complex images and PDF frames into raw structures.", iconName: "Eye", isEnabled: true },
    { id: "web_search", name: "Deep Web Retrieval", description: "Grabs contextual references with temporal validation.", iconName: "Search", isEnabled: true },
    { id: "calculator", name: "Computational Engine", description: "Handles algebraic parsing and floating-point computations.", iconName: "Cpu", isEnabled: true },
    { id: "database", name: "Durable Cloud Sync", description: "Pushes offline mutations to distributed datastores.", iconName: "Database", isEnabled: true },
  ],
  featureFlags: {
    enableBetaFeatures: true,
    enableDeveloperMode: true,
    telemetryLogging: true,
    hapticFeedback: true,
    offlineSupport: true,
  },
};
