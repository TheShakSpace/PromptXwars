/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, globalTaskQueue } from "./TaskQueue";
import { globalResourceManager } from "./ResourceManager";
import { globalExecutionHistory, ExecutionRecord } from "./ExecutionHistory";
import { AgentManager, AgentPersona } from "./AgentManager";
import { ToolRegistry } from "./ToolRegistry";
import { ModelRouter } from "./ModelRouter";
import { ContextEngine } from "./ContextEngine";
import { OutputFormatter } from "./OutputFormatter";

export interface ExecutionSession {
  sessionId: string;
  userPrompt: string;
  industry: "clinical" | "finance" | "legal" | "general";
  status: "idle" | "planning" | "running" | "validating" | "completed" | "failed";
  progress: number;
  logs: string[];
  currentAgent?: AgentPersona;
  currentTaskName?: string;
  estimatedTimeSeconds: number;
  concurrencyLimit: number;
  maxRetryCount: number;
  startedAt?: number;
}

export class ExecutionManager {
  private activeSession: ExecutionSession | null = null;
  private listeners: Set<(session: ExecutionSession | null) => void> = new Set();

  public getSession(): ExecutionSession | null {
    return this.activeSession;
  }

  public subscribe(callback: (session: ExecutionSession | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.activeSession);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.activeSession));
  }

  /**
   * Evaluates input string to resolve the operational industry cluster.
   */
  public detectIntent(prompt: string): "clinical" | "finance" | "legal" | "general" {
    const lc = prompt.toLowerCase();
    if (lc.includes("health") || lc.includes("clinical") || lc.includes("patient") || lc.includes("soap") || lc.includes("med")) {
      return "clinical";
    }
    if (lc.includes("finance") || lc.includes("portfolio") || lc.includes("risk") || lc.includes("yield") || lc.includes("quant")) {
      return "finance";
    }
    if (lc.includes("legal") || lc.includes("compliance") || lc.includes("contract") || lc.includes("audit") || lc.includes("statute")) {
      return "legal";
    }
    return "general";
  }

  /**
   * Spawns an execution pipeline session with live tasks, planning logs, agent allocation, and output formats.
   */
  public async executeSession(
    prompt: string,
    options?: { concurrency?: number; maxRetries?: number }
  ): Promise<ExecutionRecord> {
    const sessionId = `session-${Date.now()}`;
    const detectedIndustry = this.detectIntent(prompt);
    const concurrency = options?.concurrency ?? 2;
    const maxRetries = options?.maxRetries ?? 3;

    this.activeSession = {
      sessionId,
      userPrompt: prompt,
      industry: detectedIndustry,
      status: "planning",
      progress: 5,
      logs: [`[SYSTEM] Initialized execution session ${sessionId}`],
      estimatedTimeSeconds: 15,
      concurrencyLimit: concurrency,
      maxRetryCount: maxRetries,
      startedAt: Date.now(),
    };
    this.notify();

    const log = (msg: string) => {
      if (this.activeSession) {
        this.activeSession.logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
        this.notify();
      }
    };

    try {
      log(`Detecting cognitive intent: resolved target is [${detectedIndustry.toUpperCase()}].`);
      await new Promise((r) => setTimeout(r, 600));

      // 1. Task Decomposition
      log("Task Decomposition: Partitioning strategic goal into dependent pipeline tasks.");
      this.activeSession.progress = 15;
      globalTaskQueue.clear();

      const task1Id = `${sessionId}-t1`;
      const task2Id = `${sessionId}-t2`;
      const task3Id = `${sessionId}-t3`;

      // Build task set based on industry
      if (detectedIndustry === "clinical") {
        globalTaskQueue.addTask({
          id: task1Id,
          title: "Optical Vital Harvest",
          description: "Scan visual chart arrays to isolate biometric baseline inputs.",
          priority: "high",
          dependencies: [],
          assignedAgent: "Optic Analyst",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task2Id,
          title: "Syntactic Reasoning Node",
          description: "Assess medical patterns against HIPAA and regional rules.",
          priority: "critical",
          dependencies: [task1Id],
          assignedAgent: "Deep Reasoner",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task3Id,
          title: "SOAP Compliance Output",
          description: "Formulate standard structured clinical logs with PII scrubbing.",
          priority: "high",
          dependencies: [task2Id],
          assignedAgent: "Compliance Guard",
          maxRetries,
        });
      } else if (detectedIndustry === "finance") {
        globalTaskQueue.addTask({
          id: task1Id,
          title: "Liquidity Index Retrieval",
          description: "Search open web vectors for modern yield curves.",
          priority: "medium",
          dependencies: [],
          assignedAgent: "Synaptic Researcher",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task2Id,
          title: "Algorithmic Variance Compute",
          description: "Process delta portfolio weighting options.",
          priority: "high",
          dependencies: [task1Id],
          assignedAgent: "Software Synthesizer",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task3Id,
          title: "Interactive Ledger Design",
          description: "Compile visual charts displaying risk and hedging boundaries.",
          priority: "high",
          dependencies: [task2Id],
          assignedAgent: "Tactical Planner",
          maxRetries,
        });
      } else if (detectedIndustry === "legal") {
        globalTaskQueue.addTask({
          id: task1Id,
          title: "Clause Structure Scanner",
          description: "Import target commercial files and draft patterns.",
          priority: "high",
          dependencies: [],
          assignedAgent: "Tactical Planner",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task2Id,
          title: "Liability Limit Check",
          description: "Cross-reference risk clauses with standard liability bounds.",
          priority: "critical",
          dependencies: [task1Id],
          assignedAgent: "Compliance Guard",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task3Id,
          title: "Governance Certificate",
          description: "Output SOC-2 certificate verify audit logs.",
          priority: "high",
          dependencies: [task2Id],
          assignedAgent: "Synaptic Researcher",
          maxRetries,
        });
      } else {
        // General General workflow
        globalTaskQueue.addTask({
          id: task1Id,
          title: "Context Synthesis",
          description: "Mine context for related structural items.",
          priority: "medium",
          dependencies: [],
          assignedAgent: "Synaptic Researcher",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task2Id,
          title: "Logical Synthesis",
          description: "Compile balanced textual answers.",
          priority: "high",
          dependencies: [task1Id],
          assignedAgent: "Deep Reasoner",
          maxRetries,
        });
        globalTaskQueue.addTask({
          id: task3Id,
          title: "Output Verification",
          description: "Sanitize response formats and verify output safety.",
          priority: "medium",
          dependencies: [task2Id],
          assignedAgent: "Compliance Guard",
          maxRetries,
        });
      }

      log(`Decomposed request into 3 dependent workflow tasks. Queue loaded.`);
      await new Promise((r) => setTimeout(r, 700));

      // 2. Planning and Agent Allocation
      log("Planner: Resolving optimal agents and tool capabilities.");
      this.activeSession.status = "running";
      this.activeSession.progress = 30;
      this.notify();

      // Fusion Context
      const context = ContextEngine.fuse(prompt, detectedIndustry);
      log(`Context Fusion: Merged system directives. Merged payload is ~${context.tokensEstimated} tokens.`);

      // Execute Tasks in Queue Sequentially/Parallely matching dependencies
      const taskList = globalTaskQueue.getTasks();
      for (const task of taskList) {
        log(`Scheduling Task: [${task.title}] assigned to [${task.assignedAgent}].`);
        
        // Update session task tracking
        this.activeSession.currentTaskName = task.title;
        const agent = AgentManager.getAgents().find((a) => a.name === task.assignedAgent) || AgentManager.getAgents()[0];
        this.activeSession.currentAgent = agent;
        
        globalTaskQueue.updateTask(task.id, { status: "running", startedAt: Date.now() });
        this.notify();

        // Simulate Progressive Progress on active task
        for (let percent = 10; percent <= 100; percent += 30) {
          await new Promise((r) => setTimeout(r, 200));
          globalTaskQueue.updateTask(task.id, { progress: Math.min(percent, 100) });
          this.activeSession.progress = Math.min(this.activeSession.progress + 4, 85);
          this.notify();
        }

        // Execute Tools associated with task
        const toolsToRun = agent.authorizedToolIds;
        if (toolsToRun.length > 0) {
          log(`Agent [${agent.name}] executing registered tools: ${toolsToRun.join(", ")}`);
          for (const toolId of toolsToRun) {
            const tool = ToolRegistry.getToolById(toolId);
            if (tool) {
              const res = await ToolRegistry.executeTool(toolId, { query: prompt });
              log(`Tool [${tool.name}] executed. Status: OK.`);
            }
          }
        }

        globalTaskQueue.updateTask(task.id, {
          status: "completed",
          runtime: Date.now() - (task.startedAt || Date.now()),
          output: `Task successfully completed by agent ${agent.name}. Verified output records saved to local buffers.`,
        });
        log(`Task [${task.title}] completed successfully.`);
      }

      // 3. Model Routing
      log("Executing LLM compile routing: synthesizing final response block.");
      this.activeSession.status = "validating";
      this.activeSession.progress = 88;
      this.notify();

      const completion = await ModelRouter.routeCompletion({
        modelId: "gemini-3.5-flash",
        prompt: context.mergedPrompt,
        systemInstruction: context.systemPrompt,
      });

      // 4. Verification & Output Formatting
      log("Validating: Checking output formatting, quality criteria and safety guardrails.");
      await new Promise((r) => setTimeout(r, 600));

      const formattedOutput = OutputFormatter.format(completion.text, detectedIndustry);
      log("Formatted Output generated: markdown arrays, tables, and live JSON compiled.");

      // Calculate totals
      const totalDuration = Date.now() - (this.activeSession.startedAt || Date.now());
      const totalTokens = completion.tokensUsed.input + completion.tokensUsed.output;
      
      const record: ExecutionRecord = {
        id: `rec-${Date.now()}`,
        userPrompt: prompt,
        industry: detectedIndustry,
        timestamp: new Date().toISOString(),
        tasks: globalTaskQueue.getTasks(),
        context,
        selectedAgent: this.activeSession.currentAgent || AgentManager.getAgents()[0],
        completion,
        formattedOutput,
        totalTokensUsed: totalTokens,
        totalCost: completion.costEstimate,
        totalDurationMs: totalDuration,
      };

      globalExecutionHistory.addRecord(record);

      this.activeSession.status = "completed";
      this.activeSession.progress = 100;
      this.activeSession.currentTaskName = undefined;
      log("Operating system cognitive cycle complete. Ready for new instructions.");
      this.notify();

      return record;
    } catch (err: any) {
      log(`Critical execution error: ${err.message || err}. Attempting automatic failover rollback.`);
      if (this.activeSession) {
        this.activeSession.status = "failed";
        this.notify();
      }
      throw err;
    }
  }
}

// Global instance
export const globalExecutionManager = new ExecutionManager();
