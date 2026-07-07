/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NodeType =
  | "input"
  | "prompt"
  | "context"
  | "knowledge"
  | "retriever"
  | "memory"
  | "reasoning"
  | "planning"
  | "vision"
  | "ocr"
  | "speech"
  | "tool"
  | "database"
  | "automation"
  | "api"
  | "validation"
  | "generator"
  | "output";

export type NodeState =
  | "idle"
  | "running"
  | "waiting"
  | "completed"
  | "error"
  | "paused"
  | "queued";

export interface WorkflowNode {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  status: NodeState;
  description: string;
  progress: number; // 0 to 100
  runtime?: number; // in ms
  prompt?: string;
  settings?: {
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    customEndpoint?: string;
    [key: string]: any;
  };
  dependencies?: string[]; // array of node IDs
}

export interface WorkflowConnection {
  id: string;
  fromNode: string;
  toNode: string;
  status: "idle" | "flowing" | "completed" | "error";
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "debug";
}

export interface WorkflowStats {
  executionTime: number; // in ms
  nodesExecuted: number;
  memoryUsed: number; // in MB
  latency: number; // in ms
  confidence: number; // 0 to 100
}

export interface MemoryGraphNode {
  id: string;
  label: string;
  type: "concept" | "memory" | "knowledge" | "entity";
  valency: number;
}

export interface MemoryGraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface ThoughtNode {
  id: string;
  label: string;
  status: "pending" | "active" | "completed";
  duration: number;
}
