/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentTask, AgentHealth } from "./BaseAgent";
import { ModelRouter } from "../providers/router/ModelRouter";

export class PlannerAgent extends BaseAgent {
  constructor() {
    super({
      id: "planner-agent",
      name: "Strategic Planner Agent",
      role: "Architect & Project Planner",
      description: "Deconstructs complex requests into distinct, dependency-mapped executable task lists.",
      capabilities: ["plan", "breakdown", "schedule", "coordinate"],
      priority: 9,
      supportedModels: ["gemini-3.5-flash", "claude-3-5-sonnet", "gpt-4o"]
    });
  }

  async execute(task: AgentTask): Promise<AgentTask[]> {
    const userPrompt = task.description;
    const promptText = `You are a world-class strategic planning AI. Break down the following request into a logical series of independent or sequential tasks.
Each task must have:
- An id (e.g. "task_1", "task_2")
- A clean, specific title
- A descriptive action instruction for the assigned agent
- A priority number (1 to 5, 5 being highest)
- A list of upstream dependency ids (e.g. ["task_1"])
- A recommended agent type or ID (Choose from: "planner-agent", "research-agent", "reasoning-agent", "coding-agent", "vision-agent", "reviewer-agent", "writer-agent", "automation-agent", "memory-agent")

Request to break down:
"${userPrompt}"

Output your response ONLY as a valid, parsable JSON array of tasks matching this TypeScript interface structure:
interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  dependencies: string[];
  assignedAgent?: string;
}
`;

    try {
      const response = await ModelRouter.executeWithFallback(
        "text",
        async (provider, modelId) => {
          return await provider.generate(promptText, { model: modelId, temperature: 0.1 });
        }
      );

      const cleanedText = this.sanitizeJsonString(response.text);
      const parsedTasks: any[] = JSON.parse(cleanedText);
      
      return parsedTasks.map((t, idx) => ({
        id: t.id || `task_${idx + 1}`,
        title: t.title || `Subtask ${idx + 1}`,
        description: t.description || "No description provided.",
        priority: typeof t.priority === "number" ? t.priority : 3,
        dependencies: Array.isArray(t.dependencies) ? t.dependencies : [],
        assignedAgent: t.assignedAgent,
        status: "pending",
        progress: 0
      }));
    } catch (err: any) {
      console.warn(`[PlannerAgent] Model-based planning failed or unconfigured: ${err.message}. Cascading to dynamic heuristic breakdown.`);
      
      // Heuristic Fallback
      return this.heuristicPlanning(userPrompt);
    }
  }

  async validate(task: AgentTask, result: any): Promise<{ isValid: boolean; reason?: string }> {
    if (!Array.isArray(result)) {
      return { isValid: false, reason: "Result is not an array of tasks." };
    }
    if (result.length === 0) {
      return { isValid: false, reason: "Generated task list is empty." };
    }
    return { isValid: true };
  }

  async reflect(task: AgentTask, result: any): Promise<{ confidence: number; reflection: string }> {
    const taskCount = Array.isArray(result) ? result.length : 0;
    return {
      confidence: taskCount > 0 ? 95 : 20,
      reflection: `Successfully decomposed the objective into ${taskCount} highly granular, dependency-resolved task nodes.`
    };
  }

  private sanitizeJsonString(text: string): string {
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    return cleaned.trim();
  }

  private heuristicPlanning(userPrompt: string): AgentTask[] {
    const tasks: AgentTask[] = [];
    const lower = userPrompt.toLowerCase();

    // Analyze query and construct optimal steps
    if (lower.includes("code") || lower.includes("build") || lower.includes("write an app")) {
      tasks.push({
        id: "task_research",
        title: "Research technical specifications and paradigms",
        description: `Gather dependencies, optimal architecture, and design patterns for building: ${userPrompt}`,
        priority: 4,
        dependencies: [],
        assignedAgent: "research-agent",
        status: "pending",
        progress: 0
      });
      tasks.push({
        id: "task_coding",
        title: "Synthesize target code files and modules",
        description: `Implement the full-stack code solution. Refer to gathered research specifications.`,
        priority: 5,
        dependencies: ["task_research"],
        assignedAgent: "coding-agent",
        status: "pending",
        progress: 0
      });
      tasks.push({
        id: "task_review",
        title: "Review safety, security limits, and quality verification",
        description: "Analyze the generated code for potential bugs, logical loopholes, and security constraints.",
        priority: 3,
        dependencies: ["task_coding"],
        assignedAgent: "reviewer-agent",
        status: "pending",
        progress: 0
      });
    } else {
      // General Task breakdown
      tasks.push({
        id: "task_1",
        title: "Perform structured semantic research",
        description: `Gather background context and verify facts relative to: ${userPrompt}`,
        priority: 4,
        dependencies: [],
        assignedAgent: "research-agent",
        status: "pending",
        progress: 0
      });
      tasks.push({
        id: "task_2",
        title: "Synthesize final response draft",
        description: `Compose a high-fidelity report based on the gathered information and strategic research insights.`,
        priority: 5,
        dependencies: ["task_1"],
        assignedAgent: "writer-agent",
        status: "pending",
        progress: 0
      });
      tasks.push({
        id: "task_3",
        title: "Verify structural alignment and logical consistency",
        description: "Review and refine the report contents to ensure extreme factual correctness and accuracy.",
        priority: 3,
        dependencies: ["task_2"],
        assignedAgent: "reviewer-agent",
        status: "pending",
        progress: 0
      });
    }

    return tasks;
  }
}
