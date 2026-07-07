/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { workflowEngine } from "../engine/WorkflowEngine";
import { workflowExecutor } from "../engine/WorkflowExecutor";
import { workflowManager } from "../registry/WorkflowManager";
import { workflowHistory } from "../history/WorkflowHistory";
import { workflowEvents } from "../events/WorkflowEvents";
import { workflowValidator } from "../validator/WorkflowValidator";
import { Workflow, WorkflowStep } from "../types";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

export async function runAllWorkflowTests(): Promise<void> {
  console.log("\n============================================================");
  console.log("RUNNING UNIVERSAL WORKFLOW ENGINE TEST SUITE");
  console.log("============================================================\n");

  try {
    await workflowEngine.initialize();

    // ------------------------------------------------------------
    // TEST 1: Workflow Manager Templates Verification
    // ------------------------------------------------------------
    console.log("1. Testing Workflow Registration & Templates loading...");
    const workflows = workflowManager.getAll();
    await assert(workflows.length >= 5, `Default enterprise templates pre-loaded successfully (Count: ${workflows.length})`);
    
    const research = workflowManager.get("tpl_research");
    await assert(research !== undefined, "Research workflow retrieved successfully.");
    await assert(research?.steps.length === 4, "Research template holds exactly 4 modular steps.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 2: Schema Validation & Logical Cyclical Checks
    // ------------------------------------------------------------
    console.log("2. Testing Logical Connections & Cyclical Checks...");
    
    // Cycle workflow
    const cyclicWorkflow: any = {
      id: "wf_cyclic",
      name: "Cyclic Test",
      description: "Should fail validation",
      version: "1.0.0",
      author: "Test",
      config: { mode: "Sequential" },
      steps: [
        { id: "step1", title: "Step 1", type: "Input", input: {}, nextStepId: "step2" },
        { id: "step2", title: "Step 2", type: "Prompt", input: {}, nextStepId: "step1" }, // cycles back
      ],
    };

    let caughtCycleError = false;
    try {
      workflowValidator.validate(cyclicWorkflow);
    } catch (err: any) {
      caughtCycleError = true;
      await assert(err.message.includes("Cyclic dependencies detected"), "Validation correctly intercepts cyclic dependencies.");
    }
    await assert(caughtCycleError === true, "Validation throws an error for cyclical graphs.");

    // Orphaned target reference
    const orphanWorkflow: any = {
      id: "wf_orphan",
      name: "Orphan Test",
      description: "Should fail validation",
      version: "1.0.0",
      author: "Test",
      config: { mode: "Sequential" },
      steps: [
        { id: "step1", title: "Step 1", type: "Input", input: {}, nextStepId: "non_existent" },
      ],
    };

    let caughtOrphanError = false;
    try {
      workflowValidator.validate(orphanWorkflow);
    } catch (err: any) {
      caughtOrphanError = true;
      await assert(err.message.includes("references non-existent nextStepId"), "Validation catches non-existent step pointer references.");
    }
    await assert(caughtOrphanError === true, "Validation throws an error for orphaned references.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 3: Sequential Execution & Variable Interpolation
    // ------------------------------------------------------------
    console.log("3. Testing Sequential Execution & Variable Interpolation...");
    
    const simpleWorkflow: Workflow = {
      id: "wf_simple_test",
      name: "Simple Interpolation Flow",
      description: "Tests variable parsing and cascading parameters.",
      version: "1.0.0",
      author: "QA Engineer",
      config: { mode: "Sequential" },
      steps: [
        {
          id: "ingest",
          title: "Ingest Data",
          type: "Input",
          input: { text: "Platform Architecture" },
          nextStepId: "process",
        },
        {
          id: "process",
          title: "Process Text",
          type: "Formatting",
          input: { template: "Processed: {{ingest.text}}" },
        },
      ],
    };

    workflowManager.register(simpleWorkflow);
    const runOutputs = await workflowEngine.run("wf_simple_test", { text: "Antigravity Agent" });
    
    await assert(runOutputs["process"] !== undefined, "Step 'process' outputs are registered.");
    await assert(runOutputs["process"].result === "Processed: Antigravity Agent", `Inputs successfully interpolated (Received: ${runOutputs["process"].result})`);
    
    // Clean up
    workflowManager.unregister("wf_simple_test");
    console.log("");

    // ------------------------------------------------------------
    // TEST 4: Branching Logic Conditions Evaluator
    // ------------------------------------------------------------
    console.log("4. Testing Conditional Routing & Branching Evaluator...");

    const branchingWorkflow: Workflow = {
      id: "wf_branching_test",
      name: "Conditional Branch Flow",
      description: "Routes dynamically based on inputs",
      version: "1.0.0",
      author: "Informatics Team",
      config: { mode: "Sequential" },
      steps: [
        {
          id: "check_input",
          title: "Analyze Input Score",
          type: "Input",
          input: { score: 75 },
          condition: {
            field: "score",
            operator: "greater_than",
            value: 50,
            trueStepId: "high_score_step",
            falseStepId: "low_score_step",
          },
        },
        {
          id: "high_score_step",
          title: "High Score Resolution",
          type: "Formatting",
          input: { template: "Excellent Performance" },
        },
        {
          id: "low_score_step",
          title: "Low Score Resolution",
          type: "Formatting",
          input: { template: "Needs Improvement" },
        },
      ],
    };

    workflowManager.register(branchingWorkflow);

    // Test True path (75 > 50)
    const truePathOutputs = await workflowEngine.run("wf_branching_test", { score: 75 });
    await assert(truePathOutputs["high_score_step"] !== undefined, "Branching routed correctly to 'high_score_step'.");
    await assert(truePathOutputs["low_score_step"] === undefined, "Branching bypassed 'low_score_step' as expected.");

    // Test False path (25 < 50)
    const falsePathOutputs = await workflowEngine.run("wf_branching_test", { score: 25 });
    await assert(falsePathOutputs["low_score_step"] !== undefined, "Branching routed correctly to 'low_score_step'.");
    await assert(falsePathOutputs["high_score_step"] === undefined, "Branching bypassed 'high_score_step' as expected.");

    workflowManager.unregister("wf_branching_test");
    console.log("");

    // ------------------------------------------------------------
    // TEST 5: Step Failures & Retry Policies
    // ------------------------------------------------------------
    console.log("5. Testing Step Execution Retries...");

    let testExecutionsCount = 0;
    const failingWorkflow: Workflow = {
      id: "wf_retrying_test",
      name: "Step Retry Test Flow",
      description: "Evaluates retries on failure",
      version: "1.0.0",
      author: "Quality Lead",
      config: { mode: "Sequential" },
      steps: [
        {
          id: "faulty_step",
          title: "Unstable Action Step",
          type: "Custom",
          input: {},
          retryPolicy: {
            maxRetries: 2,
            backoffMs: 10,
          },
        },
      ],
    };

    // Replace the default action inside dynamic executions
    const executorInstance = (workflowEngine as any).workflowExecutor || (failingWorkflow.steps[0] as any);
    const originalAction = (workflowExecutor as any).executeStepAction;
    (workflowExecutor as any).executeStepAction = async (step: WorkflowStep, input: any) => {
      if (step.id === "faulty_step") {
        testExecutionsCount++;
        throw new Error("Temporary network timeout");
      }
      return originalAction.call(workflowExecutor, step, input);
    };

    workflowManager.register(failingWorkflow);
    
    let caughtExecutionError = false;
    try {
      await workflowEngine.run("wf_retrying_test");
    } catch (err: any) {
      caughtExecutionError = true;
    }

    await assert(caughtExecutionError === true, "Execution correctly throws error if step fails after all retry exhaustion.");
    await assert(testExecutionsCount === 3, `Retry policy triggered all retries (Expected: 3 attempts, Counted: ${testExecutionsCount})`);

    // Restore executor original code
    (workflowExecutor as any).executeStepAction = originalAction;
    workflowManager.unregister("wf_retrying_test");
    console.log("");

    // ------------------------------------------------------------
    // TEST 6: Multi-Workflow Sequential Pipelines (A -> B)
    // ------------------------------------------------------------
    console.log("6. Testing Sequential Multi-Workflow Pipelines (A -> B)...");

    const wA: Workflow = {
      id: "wf_part_a",
      name: "Pipeline Part A",
      description: "Generates baseline stats",
      version: "1.0.0",
      author: "System Group",
      config: { mode: "Sequential" },
      steps: [
        {
          id: "step_a",
          title: "Compute Base Value",
          type: "Formatting",
          input: { template: "BASE_OUT" },
        },
      ],
    };

    const wB: Workflow = {
      id: "wf_part_b",
      name: "Pipeline Part B",
      description: "Extends baseline stats",
      version: "1.0.0",
      author: "System Group",
      config: { mode: "Sequential" },
      steps: [
        {
          id: "step_b",
          title: "Extend Value",
          type: "Formatting",
          input: { template: "EXT_ON: {{step_a.result}}" },
        },
      ],
    };

    workflowManager.register(wA);
    workflowManager.register(wB);

    const pipeResult = await workflowEngine.runPipeline(["wf_part_a", "wf_part_b"], { initialKey: "demo" });
    
    await assert(pipeResult.success === true, "Pipeline executed successfully.");
    await assert(pipeResult.history.length === 2, "Both pipeline nested workflows executed in order.");
    await assert(pipeResult.finalOutputs["step_b"]?.result === "EXT_ON: BASE_OUT", `Cascading workflow output parameters passed successfully (Value: ${pipeResult.finalOutputs["step_b"]?.result})`);

    workflowManager.unregister("wf_part_a");
    workflowManager.unregister("wf_part_b");

    console.log("============================================================");
    console.log("ALL UNIVERSAL WORKFLOW ENGINE TESTS PASSED SUCCESSFULLY!");
    console.log("============================================================\n");
  } catch (err: any) {
    console.error(`\n❌ WORKFLOW TEST SUITE FAILURE: ${err.message}`);
    console.error(err.stack);
    throw err;
  }
}
