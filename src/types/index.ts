/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AIModel {
  FLASH = "gemini-3.5-flash",
  PRO = "gemini-3.1-pro-preview",
  LIVE = "gemini-3.1-flash-live-preview",
  IMAGE_LITE = "gemini-3.1-flash-lite-image",
  IMAGE = "gemini-3.1-flash-image",
}

export enum OSMode {
  IMMERSIVE = "immersive",
  WORKSPACE = "workspace",
  ANALYTICS = "analytics",
  TERMINAL_SOLO = "terminal_solo",
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}

export interface TerminalCommand {
  command: string;
  description: string;
  category: "system" | "ai" | "utility";
  action: (args: string[]) => string | Promise<string>;
}

export interface TerminalHistoryItem {
  id: string;
  type: "input" | "output" | "error" | "system";
  content: string;
  timestamp: string;
}

export interface NavbarItem {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
  badge?: string;
}

export interface SidebarItem extends NavbarItem {
  category: "navigation" | "tools" | "settings";
}

// Data Architecture Contracts
export interface HeroData {
  title: string;
  subtitle: string;
  highlightText: string;
  primaryActionText: string;
  secondaryActionText: string;
  badgeText: string;
}

export interface FeatureData {
  id: string;
  title: string;
  description: string;
  iconName: string; // lucide icon identifier
  accentColor: string;
  size: "small" | "medium" | "large"; // Bento sizing
}

export interface WorkflowData {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: "idle" | "running" | "completed";
  duration: string;
}

export interface StatData {
  id: string;
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  metricType: "percentage" | "integer" | "time" | "currency";
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "queued" | "completed";
  lastActive: string;
  tokensUsed: number;
}

export interface FAQData {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AIPromptPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: AIModel;
}
