/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentTask, AgentHealth } from "./BaseAgent";
import { agentRegistry } from "./AgentRegistry";
import { agentScheduler, ExecutionMode } from "./AgentScheduler";
import { agentBus } from "./AgentBus";
import { PlannerAgent } from "./PlannerAgent";
import { ResearchAgent } from "./ResearchAgent";
import { ReasoningAgent } from "./ReasoningAgent";
import { CodingAgent } from "./CodingAgent";
import { VisionAgent } from "./VisionAgent";
import { ReviewerAgent } from "./ReviewerAgent";
import { WriterAgent } from "./WriterAgent";
import { AutomationAgent } from "./AutomationAgent";
import { MemoryAgent } from "./MemoryAgent";

export interface ExecutionProgress {
  currentAgentId?: string;
  currentAgentName?: string;
  currentTaskId?: string;
  currentTaskTitle?: string;
  executionTimeMs: number;
  confidence: number;
  status: "idle" | "planning" | "running" | "completed" | "failed";
}

export interface OrchestrationResult {
  originalRequest: string;
  tasks: AgentTask[];
  finalOutput: string;
  executionTimeMs: number;
  averageConfidence: number;
  success: boolean;
}

export class AgentCoordinator {
  private static instance: AgentCoordinator;
  private progressState: ExecutionProgress;
  private activeTasks: AgentTask[] = [];

  private constructor() {
    this.progressState = {
      executionTimeMs: 0,
      confidence: 100,
      status: "idle"
    };

    this.registerDefaultAgents();
    this.setupBusSubscriptions();
  }

  static getInstance(): AgentCoordinator {
    if (!AgentCoordinator.instance) {
      AgentCoordinator.instance = new AgentCoordinator();
    }
    return AgentCoordinator.instance;
  }

  /**
   * Registers all core agents into the Registry.
   */
  private registerDefaultAgents(): void {
    const defaultAgents = [
      new PlannerAgent(),
      new ResearchAgent(),
      new ReasoningAgent(),
      new CodingAgent(),
      new VisionAgent(),
      new ReviewerAgent(),
      new WriterAgent(),
      new AutomationAgent(),
      new MemoryAgent()
    ];

    for (const agent of defaultAgents) {
      try {
        agentRegistry.register(agent);
      } catch (err) {
        // Safe to ignore if already registered
      }
    }
  }

  /**
   * Subscribes to the global agent bus to track live execution states.
   */
  private setupBusSubscriptions(): void {
    agentBus.subscribe("TASK_STARTED", (payload) => {
      const task = this.activeTasks.find((t) => t.id === payload.taskId);
      this.progressState.status = "running";
      this.progressState.currentTaskId = payload.taskId;
      this.progressState.currentTaskTitle = task ? task.title : undefined;
      
      if (payload.agentId) {
        const agent = agentRegistry.get(payload.agentId);
        this.progressState.currentAgentId = payload.agentId;
        this.progressState.currentAgentName = agent ? agent.metadata.name : undefined;
      }
    });

    agentBus.subscribe("TASK_COMPLETED", (payload) => {
      if (payload.data && typeof payload.data.confidence === "number") {
        this.progressState.confidence = Math.round(
          (this.progressState.confidence + payload.data.confidence) / 2
        );
      }
    });

    agentBus.subscribe("TASK_FAILED", (payload) => {
      this.progressState.status = "failed";
    });
  }

  /**
   * High-level Orchestration entrypoint.
   */
  async execute(
    userRequest: string,
    mode: ExecutionMode = ExecutionMode.SEQUENTIAL,
    preferredModel?: string
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    this.progressState.status = "planning";
    this.progressState.executionTimeMs = 0;
    this.progressState.confidence = 100;

    console.log(`[AgentCoordinator] Orchestrating user request: "${userRequest}"`);

    // 1. Intent Analysis Step
    const intent = this.analyzeIntent(userRequest);
    console.log(`[AgentCoordinator] Analyzed intent category: ${intent.category} (Priority: ${intent.priority})`);

    // 2. Planning: Break request into a list of tasks
    const planner = agentRegistry.get("planner-agent") as PlannerAgent;
    if (!planner) {
      throw new Error("Critical Failure: Planner Agent not found in registry.");
    }

    const planningTask: AgentTask = {
      id: "planning_root",
      title: "Synthesize Execution Path Plan",
      description: userRequest,
      priority: 5,
      dependencies: [],
      status: "running",
      progress: 0
    };

    let tasks: AgentTask[] = [];
    try {
      planner.setStatus(AgentHealth.BUSY);
      tasks = await planner.execute(planningTask);
      planner.setStatus(AgentHealth.IDLE);
    } catch (err: any) {
      planner.setStatus(AgentHealth.FAILED);
      throw new Error(`Orchestrator planning stage failed: ${err.message}`);
    }

    // Cache active tasks list for progressive tracking
    this.activeTasks = tasks;

    // 3. Scheduling & Executing tasks
    this.progressState.status = "running";
    try {
      await agentScheduler.scheduleAndRun(tasks, mode, {
        preferredModel,
        failurePolicy: "fallback" // Enforce intelligent agent fallbacks
      });
    } catch (err: any) {
      console.error("[AgentCoordinator] Task scheduling loop experienced failures:", err.message);
    }

    // 4. Aggregating final outputs
    const executionTimeMs = Date.now() - startTime;
    this.progressState.executionTimeMs = executionTimeMs;
    
    const completedTasks = tasks.filter((t) => t.status === "completed");
    const failedTasks = tasks.filter((t) => t.status === "failed");
    const success = completedTasks.length > 0 && failedTasks.length === 0;

    this.progressState.status = success ? "completed" : "failed";

    // Build the final response synthesis string
    const finalOutput = this.synthesizeFinalOutput(userRequest, tasks, success);

    return {
      originalRequest: userRequest,
      tasks,
      finalOutput,
      executionTimeMs,
      averageConfidence: this.progressState.confidence,
      success
    };
  }

  /**
   * Live progress stats getter.
   */
  getProgress(): ExecutionProgress {
    return { ...this.progressState };
  }

  /**
   * Helper: Quick semantic analyzer.
   */
  private analyzeIntent(request: string): { category: string; priority: number } {
    const lower = request.toLowerCase();
    if (lower.includes("code") || lower.includes("build") || lower.includes("write")) {
      return { category: "TECHNICAL_DEVELOPMENT", priority: 4 };
    }
    if (lower.includes("image") || lower.includes("ui") || lower.includes("logo")) {
      return { category: "VISION_DESIGN", priority: 3 };
    }
    if (lower.includes("deploy") || lower.includes("automation") || lower.includes("trigger")) {
      return { category: "INTEGRATION_AUTOMATION", priority: 4 };
    }
    return { category: "KNOWLEDGE_SYNTHESIS", priority: 3 };
  }

  /**
   * Formats the final consolidated multi-agent response markdown block.
   */
  private synthesizeFinalOutput(request: string, tasks: AgentTask[], success: boolean): string {
    let output = `# Orchestration Final Response Report\n`;
    output += `**Global success status**: ${success ? "✅ SUCCESS" : "❌ PARTIAL FAILURE / BLOCKED"}\n\n`;
    
    output += `### 📋 Original Request\n> ${request}\n\n`;

    output += `### 🛠️ Decomposed Tasks & Agent Audits\n`;
    for (const task of tasks) {
      output += `#### - ${task.title}\n`;
      output += `- **Agent**: \`${task.assignedAgent || "Unassigned"}\`\n`;
      output += `- **Status**: ${task.status === "completed" ? "✅ Completed" : "❌ Failed"}\n`;
      if (task.result) {
        let snippet = typeof task.result === "string" ? task.result : JSON.stringify(task.result, null, 2);
        // Truncate if massive
        if (snippet.length > 1000) {
          snippet = snippet.substring(0, 1000) + "\n... [truncated for readability]";
        }
        output += `##### Output Context:\n${snippet}\n\n`;
      } else if (task.error) {
        output += `##### Failure Reason:\n> ${task.error}\n\n`;
      }
    }

    return output;
  }
}

export const agentCoordinator = AgentCoordinator.getInstance();
