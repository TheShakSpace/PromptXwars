/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workflow, WorkflowStep, StepCondition } from "../types";

export class WorkflowPlanner {
  private static instance: WorkflowPlanner;

  private constructor() {}

  public static getInstance(): WorkflowPlanner {
    if (!WorkflowPlanner.instance) {
      WorkflowPlanner.instance = new WorkflowPlanner();
    }
    return WorkflowPlanner.instance;
  }

  /**
   * Plans the list of steps to execute sequentially.
   * If workflow mode is Parallel, groups them into concurrent layers.
   */
  public plan(workflow: Workflow): WorkflowStep[][] {
    if (workflow.config.mode === "Parallel") {
      // Group steps by their priority or group everything in a single parallel chunk
      const high: WorkflowStep[] = [];
      const medium: WorkflowStep[] = [];
      const low: WorkflowStep[] = [];

      for (const step of workflow.steps) {
        if (step.priority === "High") high.push(step);
        else if (step.priority === "Low") low.push(step);
        else medium.push(step);
      }

      const plan: WorkflowStep[][] = [];
      if (high.length > 0) plan.push(high);
      if (medium.length > 0) plan.push(medium);
      if (low.length > 0) plan.push(low);

      if (plan.length === 0) plan.push([]);
      return plan;
    }

    // Default sequential: returns steps wrapped in single-step arrays
    return workflow.steps.map((step) => [step]);
  }

  /**
   * Evaluates branch logic for a step and routes to the correct next step ID.
   */
  public evaluateCondition(condition: StepCondition, stepOutput: any, memory: Record<string, any>): string | undefined {
    const { field, operator, value, trueStepId, falseStepId, customRuleCode } = condition;

    // 1. Evaluate custom dynamic evaluation rules if code block exists
    if (operator === "custom" && customRuleCode) {
      try {
        const evaluator = new Function("output", "memory", `
          try {
            ${customRuleCode}
          } catch(err) {
            return false;
          }
        `);
        const passes = evaluator(stepOutput, memory);
        return passes ? trueStepId : falseStepId;
      } catch (err: any) {
        console.error(`[WorkflowPlanner] Custom rule evaluation failed: ${err.message}`);
        return falseStepId;
      }
    }

    // 2. Fetch value to examine
    let targetVal = stepOutput;
    if (field && typeof stepOutput === "object" && stepOutput !== null) {
      targetVal = stepOutput[field];
    } else if (field && memory && memory[field] !== undefined) {
      targetVal = memory[field];
    }

    let isTrue = false;

    switch (operator) {
      case "equals":
        isTrue = String(targetVal) === String(value);
        break;
      case "not_equals":
        isTrue = String(targetVal) !== String(value);
        break;
      case "contains":
        isTrue = typeof targetVal === "string" && targetVal.toLowerCase().includes(String(value).toLowerCase());
        break;
      case "greater_than":
        isTrue = Number(targetVal) > Number(value);
        break;
      case "less_than":
        isTrue = Number(targetVal) < Number(value);
        break;
      case "exists":
        isTrue = targetVal !== undefined && targetVal !== null;
        break;
      default:
        isTrue = false;
    }

    return isTrue ? trueStepId : falseStepId;
  }
}

export const workflowPlanner = WorkflowPlanner.getInstance();
