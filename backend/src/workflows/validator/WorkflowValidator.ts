/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workflow, WorkflowStep } from "../types";
import { z } from "zod";

const StepRetryPolicySchema = z.object({
  maxRetries: z.number().int().nonnegative(),
  backoffMs: z.number().int().nonnegative(),
  fallbackStepId: z.string().optional(),
});

const StepConditionSchema = z.object({
  field: z.string().optional(),
  operator: z.enum([
    "equals",
    "not_equals",
    "contains",
    "greater_than",
    "less_than",
    "exists",
    "custom",
  ]),
  value: z.any().optional(),
  trueStepId: z.string().optional(),
  falseStepId: z.string().optional(),
  customRuleCode: z.string().optional(),
});

const WorkflowStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum([
    "Input",
    "Context",
    "Memory",
    "Prompt",
    "Research",
    "Reasoning",
    "Vision",
    "OCR",
    "Search",
    "Planning",
    "Execution",
    "Validation",
    "Formatting",
    "Export",
    "Notification",
    "Custom",
  ]),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  agent: z.string().optional(),
  tool: z.string().optional(),
  input: z.union([z.record(z.string(), z.any()), z.string()]),
  output: z.record(z.string(), z.any()).optional(),
  retryPolicy: StepRetryPolicySchema.optional(),
  timeout: z.number().int().positive().optional(),
  condition: StepConditionSchema.optional(),
  nextStepId: z.string().optional(),
});

const WorkflowConfigSchema = z.object({
  mode: z.enum([
    "Sequential",
    "Parallel",
    "Conditional",
    "Pipeline",
    "Loop",
    "Branch",
    "Recursive",
  ]),
  maxParallelSteps: z.number().int().positive().optional(),
  timeout: z.number().int().positive().optional(),
  allowFailureSteps: z.array(z.string()).optional(),
});

const WorkflowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  version: z.string(),
  author: z.string(),
  steps: z.array(WorkflowStepSchema),
  agents: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  memory: z.record(z.string(), z.any()).optional(),
  config: WorkflowConfigSchema,
  metadata: z.record(z.string(), z.any()).optional(),
});

export class WorkflowValidator {
  private static instance: WorkflowValidator;

  private constructor() {}

  public static getInstance(): WorkflowValidator {
    if (!WorkflowValidator.instance) {
      WorkflowValidator.instance = new WorkflowValidator();
    }
    return WorkflowValidator.instance;
  }

  /**
   * Performs deep schema and structural logical validation of a workflow.
   */
  public validate(workflow: any): Workflow {
    // 1. Zod parse validation
    const parsed = WorkflowSchema.parse(workflow) as Workflow;

    // 2. Custom validation of references and cycles
    this.validateLogicalConnections(parsed);

    return parsed;
  }

  /**
   * Analyzes logical integrity of steps, checking for duplicated IDs and correct branch mappings
   */
  private validateLogicalConnections(workflow: Workflow): void {
    const stepIds = new Set<string>();
    for (const step of workflow.steps) {
      if (stepIds.has(step.id)) {
        throw new Error(`Logical Integrity Error: Duplicate step ID '${step.id}' detected.`);
      }
      stepIds.add(step.id);
    }

    // Validate connection paths
    for (const step of workflow.steps) {
      if (step.nextStepId && !stepIds.has(step.nextStepId)) {
        throw new Error(`Logical Integrity Error: Step '${step.id}' references non-existent nextStepId '${step.nextStepId}'.`);
      }

      if (step.condition) {
        const { trueStepId, falseStepId } = step.condition;
        if (trueStepId && !stepIds.has(trueStepId)) {
          throw new Error(`Logical Integrity Error: Condition on Step '${step.id}' references non-existent trueStepId '${trueStepId}'.`);
        }
        if (falseStepId && !stepIds.has(falseStepId)) {
          throw new Error(`Logical Integrity Error: Condition on Step '${step.id}' references non-existent falseStepId '${falseStepId}'.`);
        }
      }

      if (step.retryPolicy?.fallbackStepId && !stepIds.has(step.retryPolicy.fallbackStepId)) {
        throw new Error(
          `Logical Integrity Error: Step '${step.id}' references non-existent fallbackStepId '${step.retryPolicy.fallbackStepId}' inside retry policy.`
        );
      }
    }

    // Check for obvious sequential cycles if running sequentially
    if (workflow.config.mode === "Sequential") {
      this.detectCycles(workflow.steps);
    }
  }

  /**
   * Helper algorithm to detect simple cycle path loops
   */
  private detectCycles(steps: WorkflowStep[]): void {
    const adjList = new Map<string, string[]>();
    for (const step of steps) {
      const children: string[] = [];
      if (step.nextStepId) children.push(step.nextStepId);
      if (step.condition?.trueStepId) children.push(step.condition.trueStepId);
      if (step.condition?.falseStepId) children.push(step.condition.falseStepId);
      adjList.set(step.id, children);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const children = adjList.get(nodeId) || [];
      for (const child of children) {
        if (!visited.has(child)) {
          if (dfs(child)) return true;
        } else if (recStack.has(child)) {
          return true; // Cycle detected
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const step of steps) {
      if (!visited.has(step.id)) {
        if (dfs(step.id)) {
          throw new Error("Logical Integrity Error: Cyclic dependencies detected among steps.");
        }
      }
    }
  }
}

export const workflowValidator = WorkflowValidator.getInstance();
