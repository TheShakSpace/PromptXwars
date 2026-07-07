/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workflow } from "../types";
import { workflowValidator } from "../validator/WorkflowValidator";
import { workflowParser } from "../parser/WorkflowParser";
import { WorkflowTemplates } from "../templates/WorkflowTemplates";

export class WorkflowManager {
  private static instance: WorkflowManager;
  private workflows = new Map<string, Workflow>();

  private constructor() {
    this.loadTemplates();
  }

  public static getInstance(): WorkflowManager {
    if (!WorkflowManager.instance) {
      WorkflowManager.instance = new WorkflowManager();
    }
    return WorkflowManager.instance;
  }

  /**
   * Registers a validated workflow inside the manager storage
   */
  public register(workflow: Workflow): void {
    const validated = workflowValidator.validate(workflow);
    this.workflows.set(validated.id, validated);
    console.log(`[WorkflowManager] Successfully registered workflow: ${validated.name} (v${validated.version}) [ID: ${validated.id}]`);
  }

  /**
   * Unregisters a workflow by ID
   */
  public unregister(workflowId: string): boolean {
    return this.workflows.delete(workflowId);
  }

  /**
   * Retrieves a workflow by ID
   */
  public get(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Lists all currently registered workflows
   */
  public getAll(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Imports a workflow definition from string content
   */
  public importWorkflow(content: string, format: "json" | "yaml"): Workflow {
    const workflow = workflowParser.parse(content, format);
    this.register(workflow);
    return workflow;
  }

  /**
   * Exports a workflow definition to specified format
   */
  public exportWorkflow(workflowId: string, format: "json" | "yaml" | "markdown"): string {
    const workflow = this.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with ID '${workflowId}' not found.`);
    }
    return workflowParser.stringify(workflow, format);
  }

  /**
   * Loads pre-configured templates into local storage
   */
  private loadTemplates(): void {
    for (const [key, tpl] of Object.entries(WorkflowTemplates)) {
      try {
        this.register(tpl);
      } catch (err: any) {
        console.error(`[WorkflowManager] Failed loading default template '${key}': ${err.message}`);
      }
    }
  }

  /**
   * Clears the workflow manager
   */
  public clear(): void {
    this.workflows.clear();
  }
}

export const workflowManager = WorkflowManager.getInstance();
export default workflowManager;
