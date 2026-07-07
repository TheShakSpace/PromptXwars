/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StepType =
  | "Input"
  | "Context"
  | "Memory"
  | "Prompt"
  | "Research"
  | "Reasoning"
  | "Vision"
  | "OCR"
  | "Search"
  | "Planning"
  | "Execution"
  | "Validation"
  | "Formatting"
  | "Export"
  | "Notification"
  | "Custom";

export type ExecutionMode =
  | "Sequential"
  | "Parallel"
  | "Conditional"
  | "Pipeline"
  | "Loop"
  | "Branch"
  | "Recursive";

export type WorkflowStatus =
  | "Pending"
  | "Running"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Paused"
  | "Resumed";

export interface StepRetryPolicy {
  maxRetries: number;
  backoffMs: number;
  fallbackStepId?: string;
}

export interface StepCondition {
  field?: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "exists" | "custom";
  value?: any;
  trueStepId?: string;
  falseStepId?: string;
  customRuleCode?: string; // For dynamic evaluator code
}

export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  type: StepType;
  priority?: "Low" | "Medium" | "High";
  agent?: string; // Optional target Agent ID
  tool?: string;  // Optional target Tool ID
  input: Record<string, any> | string; // Config or parameters template
  output?: Record<string, any>; // Captured results mapping
  retryPolicy?: StepRetryPolicy;
  timeout?: number; // In milliseconds
  condition?: StepCondition;
  nextStepId?: string;
}

export interface WorkflowConfig {
  mode: ExecutionMode;
  maxParallelSteps?: number;
  timeout?: number; // Total workflow timeout
  allowFailureSteps?: string[]; // Step IDs that won't halt execution on failure
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  steps: WorkflowStep[];
  agents?: string[]; // Required or assigned Agent IDs
  tools?: string[];  // Required or assigned Tool IDs
  memory?: Record<string, any>; // Workflow local contextual state
  config: WorkflowConfig;
  metadata?: Record<string, any>;
}

export interface WorkflowHistoryEntry {
  id: string; // Unique execution run ID
  workflowId: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  status: WorkflowStatus;
  stepsRun: Array<{
    stepId: string;
    type: StepType;
    input: any;
    output: any;
    success: boolean;
    executionTimeMs: number;
    error?: string;
  }>;
  startTime: Date;
  endTime?: Date;
  executionTimeMs?: number;
  agentsUsed: string[];
  toolsUsed: string[];
  errors: string[];
  memoryState: Record<string, any>;
}

export type WorkflowEventType =
  | "WorkflowStarted"
  | "WorkflowPaused"
  | "WorkflowResumed"
  | "WorkflowFailed"
  | "WorkflowCompleted";

export interface WorkflowEvent {
  type: WorkflowEventType;
  workflowId: string;
  executionId: string;
  timestamp: Date;
  payload?: any;
}

export type WorkflowEventListener = (event: WorkflowEvent) => void;
