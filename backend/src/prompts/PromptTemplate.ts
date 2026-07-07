/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PromptType {
  SYSTEM = "system",
  ROLE = "role",
  TASK = "task",
  CONTEXT = "context",
  REFLECTION = "reflection",
  EVALUATION = "evaluation",
  MEMORY = "memory",
  TOOL = "tool",
  VISION = "vision",
  SAFETY = "safety",
  CHAIN = "chain"
}

export enum OutputFormat {
  MARKDOWN = "markdown",
  JSON = "json",
  TABLE = "table",
  HTML = "html",
  BULLET_LIST = "bullet_list",
  TIMELINE = "timeline",
  STRUCTURED_OBJECT = "structured_object"
}

export enum PromptStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  DEPRECATED = "deprecated"
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  variables: string[]; // List of expected variable names, e.g. ["user", "date"]
  template: string; // The raw template string containing placeholder expressions like {{user}}
  outputFormat: OutputFormat;
  tags: string[];
  status: PromptStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VariableValues {
  user?: string;
  conversation?: string;
  memory?: string;
  history?: string;
  date?: string;
  time?: string;
  location?: string;
  workflow?: string;
  agent?: string;
  tools?: string;
  language?: string;
  [customKey: string]: any; // Allow custom variables dynamically
}
