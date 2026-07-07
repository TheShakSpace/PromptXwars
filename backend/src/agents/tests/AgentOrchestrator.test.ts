/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { agentManager } from "../AgentManager";
import { agentRegistry } from "../AgentRegistry";
import { agentBus } from "../AgentBus";
import { agentRouter } from "../AgentRouter";
import { agentScheduler, ExecutionMode } from "../AgentScheduler";
import { AgentTask } from "../BaseAgent";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

export async function runAllAgentTests(): Promise<void> {
  console.log("\n============================================================");
  console.log("RUNNING MULTI-AGENT ORCHESTRATOR TEST SUITE");
  console.log("============================================================\n");

  try {
    const registry = agentManager.getRegistry();
    const coordinator = agentManager.getCoordinator();

    // ------------------------------------------------------------
    // TEST 1: Agent Registration & Metadata Checks
    // ------------------------------------------------------------
    console.log("1. Running Agent Registration & Metadata Tests...");
    const allAgents = registry.getAll();
    await assert(allAgents.length >= 9, "All 9 standard agents are successfully registered in the system on startup.");
    
    const planner = registry.get("planner-agent");
    await assert(planner !== undefined, "Planner agent is registered correctly.");
    await assert(planner?.metadata.id === "planner-agent", "Planner maintains unique identifier matching.");
    
    const coding = registry.get("coding-agent");
    await assert(coding?.metadata.capabilities.includes("coding") === true, "Coding agent exposes coding capability.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 2: Communication Bus & Event Broadcasting
    // ------------------------------------------------------------
    console.log("2. Running Event Bus Broadcasting Tests...");
    let startedTriggered: boolean = false;
    let completedTriggered: boolean = false;

    const unsubStart = agentBus.subscribe("TASK_STARTED", (payload) => {
      if (payload.taskId === "test_event_task") startedTriggered = true;
    });

    const unsubComplete = agentBus.subscribe("TASK_COMPLETED", (payload) => {
      if (payload.taskId === "test_event_task") completedTriggered = true;
    });

    await agentBus.publish("TASK_STARTED", { taskId: "test_event_task", timestamp: new Date().toISOString() });
    await agentBus.publish("TASK_COMPLETED", { taskId: "test_event_task", timestamp: new Date().toISOString() });

    await assert(!!startedTriggered, "Subscribers receive TASK_STARTED events from the AgentBus.");
    await assert(!!completedTriggered, "Subscribers receive TASK_COMPLETED events from the AgentBus.");
    
    unsubStart();
    unsubComplete();
    console.log("");

    // ------------------------------------------------------------
    // TEST 3: Routing Selection Mechanics
    // ------------------------------------------------------------
    console.log("3. Running Routing Selection Tests...");
    const sampleTask: AgentTask = {
      id: "task_coder",
      title: "Develop high performance binary search algorithm",
      description: "Code a high performance binary search algorithm in TypeScript.",
      priority: 3,
      dependencies: [],
      status: "pending",
      progress: 0
    };

    const bestAgent = agentRouter.route(sampleTask);
    console.log(`  DEBUG: Selected Agent ID for coding task: ${bestAgent.metadata.id}`);
    await assert(bestAgent.metadata.id === "coding-agent", "Router correctly selects 'coding-agent' based on 'code' capabilities and keywords.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 4: Scheduler Execution Modes (Sequential, Pipeline, Parallel)
    // ------------------------------------------------------------
    console.log("4. Running Scheduler Execution Mode Tests...");
    
    // Sequential Mode
    const seqTasks: AgentTask[] = [
      {
        id: "seq_1",
        title: "Research target requirements",
        description: "Analyze the technical requirements of the platform",
        priority: 4,
        dependencies: [],
        status: "pending",
        progress: 0
      },
      {
        id: "seq_2",
        title: "Draft synthesis writeup",
        description: "Draft a clean synthesis writeup based on the technical parameters",
        priority: 3,
        dependencies: ["seq_1"],
        status: "pending",
        progress: 0
      }
    ];

    const seqResults = await agentScheduler.scheduleAndRun(seqTasks, ExecutionMode.SEQUENTIAL, { failurePolicy: "retry" });
    await assert(seqResults[0].status === "completed", "Task 1 completed successfully in sequence.");
    await assert(seqResults[1].status === "completed", "Task 2 completed successfully after dependency resolution.");

    // Pipeline Mode
    const pipeTasks: AgentTask[] = [
      {
        id: "pipe_1",
        title: "Research technical parameters",
        description: "Collect design specifications",
        priority: 3,
        dependencies: [],
        status: "pending",
        progress: 0
      },
      {
        id: "pipe_2",
        title: "Synthesize summary text",
        description: "Incorporate findings",
        priority: 3,
        dependencies: [],
        status: "pending",
        progress: 0
      }
    ];

    const pipeResults = await agentScheduler.scheduleAndRun(pipeTasks, ExecutionMode.PIPELINE, { failurePolicy: "retry" });
    await assert(pipeResults[0].status === "completed", "Pipeline stage 1 successfully processed.");
    await assert(pipeResults[1].description.includes("Pipeline Input Context"), "Pipeline stage 2 correctly received context variables from stage 1.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 5: Orchestration Flow (Intent -> Planner -> Scheduling -> Output)
    // ------------------------------------------------------------
    console.log("5. Running Full End-to-End Coordination Orchestration Tests...");
    const userRequest = "Build a lightweight type-safe binary trees utility in TypeScript.";
    const orchestrationResult = await coordinator.execute(userRequest, ExecutionMode.SEQUENTIAL);

    await assert(orchestrationResult.success === true, "Full coordination completed with SUCCESS status.");
    await assert(orchestrationResult.tasks.length > 0, "Strategic planner split the user request into valid subtasks.");
    await assert(orchestrationResult.finalOutput.includes("Orchestration Final Response Report"), "Generated structured report markdown synthesis.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 6: Manager Metrics & Self Tests
    // ------------------------------------------------------------
    console.log("6. Running Operational Self-Tests & Live Tracking...");
    const selfTest = await agentManager.runSelfTests();
    await assert(selfTest.passed === true, "All enabled agents passed their integrated capabilities self-test.");

    const liveStatus = agentManager.getLiveStatus();
    await assert(liveStatus.progress.status === "completed", "Live stats show system is currently idle/completed.");
    await assert(liveStatus.registryHealth.length >= 9, "Registry health reports full listing of registered agents.");

    console.log("============================================================");
    console.log("ALL MULTI-AGENT ORCHESTRATOR TESTS COMPLETED SUCCESSFULLY! [PASSED]");
    console.log("============================================================\n");
  } catch (err: any) {
    console.error("\n❌ MULTI-AGENT ORCHESTRATOR TEST SUITE ENCOUNTERED CRITICAL FAILURES:");
    console.error(err);
    process.exit(1);
  }
}

// Self-run script entrypoint
if (import.meta.url && process.argv[1]?.includes("AgentOrchestrator.test.ts")) {
  runAllAgentTests();
}
