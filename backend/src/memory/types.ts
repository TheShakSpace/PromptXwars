/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MemoryType =
  | "short"
  | "long"
  | "session"
  | "conversation"
  | "knowledge"
  | "agent"
  | "workflow"
  | "temporary"
  | "pinned"
  | "archived";

export interface MemoryNode {
  id: string;
  type: MemoryType;
  content: string;
  tags: string[];
  importance: number; // 1 to 10 scale
  confidence: number; // 0 to 1 scale
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  userId?: string;
  sessionId?: string;
  agentId?: string;
  workflowId?: string;
  fileId?: string;
  metadata: Record<string, any>;
  embedding?: number[]; // Simulated or real semantic embedding vector
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
  relation: string; // e.g., "USER_HAD_CONVERSATION", "CONVERSATION_HAS_FILE", "FILE_CONTAINS_CONCEPT", "CONCEPT_USED_BY_AGENT"
  weight: number; // 0 to 1 scale
}

export interface MemorySearchQuery {
  text?: string;
  tags?: string[];
  type?: MemoryType;
  userId?: string;
  sessionId?: string;
  agentId?: string;
  workflowId?: string;
  fileId?: string;
  minImportance?: number;
  limit?: number;
}

export interface MemoryRankCriteria {
  relevanceWeight?: number;
  confidenceWeight?: number;
  recencyWeight?: number;
  usageWeight?: number;
  importanceWeight?: number;
}

export interface ContextItem {
  source: string; // e.g. "short_memory", "long_memory", "knowledge_graph", "user_profile"
  content: string;
  metadata?: Record<string, any>;
}

export interface CompressedMemory {
  originalIds: string[];
  summary: string;
  archivedAt: Date;
  extractedFacts: string[];
}

export interface WorkflowStepMemory {
  stepId: string;
  workflowId: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: any;
  error?: string;
  durationMs?: number;
  timestamp: Date;
}

export interface FileMemoryAssociation {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sessionId?: string;
  agentId?: string;
  workflowId?: string;
  concepts: string[];
  metadata: Record<string, any>;
}
