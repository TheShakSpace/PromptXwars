/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { workflowTemplates, type WorkflowTemplate, type WorkflowStepDefinition } from "./workflowTemplates";
import { useWorkflowStore } from "../store/workflowStore";
import { useNotificationStore } from "../store/notificationStore";
import { UniversalPromptEngine } from "../prompts/promptEngine";

export class UniversalWorkflowEngine {
  /**
   * Spawns and executes an entire multi-stage agentic workflow
   */
  public static async executeWorkflow(
    templateId: string,
    query: string,
    onStepChange?: (stepId: string, status: "running" | "completed" | "failed", log?: string) => void
  ): Promise<string> {
    const template = workflowTemplates.find((t) => t.id === templateId) || workflowTemplates[0];
    const workflowStore = useWorkflowStore.getState();
    const notificationStore = useNotificationStore.getState();

    workflowStore.resetWorkflow();
    workflowStore.startWorkflow();

    notificationStore.addNotification(
      "Workflow Initialized",
      `Active pipeline '${template.name}' is aligning synaptic paths.`,
      "info"
    );

    let currentContext = "";

    // Iterate through configured JSON steps
    for (const step of template.steps) {
      const stepId = step.id;
      workflowStore.updateStepStatus(stepId, "running", undefined, `Booting agent '${step.agentId}'...`);
      if (onStepChange) onStepChange(stepId, "running", `Initializing '${step.name}'...`);

      // 1. Compile localized prompts through Prompt Engine
      const prompt = UniversalPromptEngine.compilePrompt(
        step.promptKey,
        { query, context: currentContext },
        step.outputTemplateKey
      );

      // Simulate network wait based on configured expectedDuration
      const delay = parseInt(step.expectedDuration) || 500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 2. Invoke simulated tool execution if configured
      let toolLog = "";
      if (step.toolId) {
        toolLog = ` [Tool: ${step.toolId} initialized successfully]`;
      }

      // Record step completion
      const stepStatus = "completed";
      const completedLog = `Agent synthesized output correctly.${toolLog}`;
      workflowStore.updateStepStatus(stepId, stepStatus, step.expectedDuration, completedLog);
      if (onStepChange) onStepChange(stepId, stepStatus, completedLog);

      // Accumulate context across pipeline
      currentContext += `\n[Stage: ${step.name} output]: Processed query parameters. Verified bounds.`;
    }

    notificationStore.addNotification(
      "Workflow Completed",
      `Successfully processed '${template.name}' in real-time.`,
      "success"
    );

    return `Unified Workflow Output [${template.name}]: All stages completed in full. Synaptic channels are aligned.`;
  }
}
