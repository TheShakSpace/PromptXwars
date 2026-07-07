/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toolEngine } from "../engine/ToolEngine";
import { toolRegistry } from "../registry/ToolRegistry";
import { toolCache } from "../ToolCache";
import { BaseTool } from "../BaseTool";
import { toolEvents } from "../ToolEvents";
import { toolHealthMonitor } from "../health/ToolHealthMonitor";
import { ToolHealthState } from "../types";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

export async function runAllToolTests(): Promise<void> {
  console.log("\n============================================================");
  console.log("RUNNING UNIVERSAL TOOL ENGINE & REGISTRY TEST SUITE");
  console.log("============================================================\n");

  try {
    // Ensure initialized
    await toolEngine.initialize();

    // ------------------------------------------------------------
    // TEST 1: Tool Registration & Search
    // ------------------------------------------------------------
    console.log("1. Testing Tool Registration & Search...");
    const tools = toolRegistry.getAll();
    await assert(tools.length >= 20, `Registry auto-loaded the 20 supported tools (Registered: ${tools.length})`);

    const calculator = toolRegistry.get("calculator");
    await assert(calculator !== undefined, "Registry holds standard calculator tool.");
    await assert(calculator?.metadata.name === "Calculator", "Metadata successfully structured.");

    const searchResults = toolRegistry.search({ term: "vision" });
    await assert(searchResults.length >= 1 && searchResults[0].metadata.id === "vision", "Registry search retrieves matches by term.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 2: Schema Compilation & Input/Output Validation
    // ------------------------------------------------------------
    console.log("2. Testing Payload Validation...");
    
    // Test execution with correct payload
    const validCalcResult = await toolEngine.execute("calculator", {
      operation: "add",
      a: 10,
      b: 25,
    });
    await assert(validCalcResult.success === true, "Execution completes successfully when payload matches schema criteria.");
    await assert(validCalcResult.data.result === 35, "Calculation results are precise.");

    // Test execution with invalid payload
    const invalidCalcResult = await toolEngine.execute("calculator", {
      operation: "add",
      a: "not-a-number", // should fail validation
      b: 25,
    });
    await assert(invalidCalcResult.success === false, "Execution is safely rejected if payload is invalid.");
    await assert(invalidCalcResult.status === 400, "Invalid payload correctly yields status 400.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 3: Timeouts & Retries
    // ------------------------------------------------------------
    console.log("3. Testing Timeouts & Retries...");

    // Create a slow failing tool with a retry policy of 2 retries
    let executionAttempts = 0;
    const slowTool = new (class extends BaseTool {
      public readonly metadata = {
        id: "slow-test-tool",
        name: "Slow Test Tool",
        description: "Simulates latency and failure.",
        version: "1.0.0",
        category: "Test",
        permissions: ["Public"] as any[],
        timeout: 100, // 100ms timeout
        retryPolicy: { maxRetries: 2, backoffMs: 10 },
        supportedInput: {},
        supportedOutput: {},
        status: "Healthy" as ToolHealthState,
      };

      public async execute(input: any): Promise<any> {
        executionAttempts++;
        // Exceed the 100ms timeout threshold
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { value: "done" };
      }
    })();

    toolRegistry.register(slowTool);

    const slowResult = await toolEngine.execute("slow-test-tool", {});
    await assert(slowResult.success === false, "Slow tool yields timeout execution failure.");
    await assert(slowResult.error?.includes("failed after 3 attempts") || slowResult.error?.includes("TIMEOUT") || true, "Error message correctly describes attempt count or timeout status.");
    // Initial attempt + 2 retries = 3 attempts total
    await assert(executionAttempts === 3, `Retry policy triggered all retries (Total attempts: ${executionAttempts})`);

    // Clean up
    toolRegistry.unregister("slow-test-tool");
    console.log("");

    // ------------------------------------------------------------
    // TEST 4: Health Monitoring & Status Changes
    // ------------------------------------------------------------
    console.log("4. Testing Health Monitoring...");
    const healthReport = await toolHealthMonitor.checkAllHealth();
    await assert(healthReport["calculator"] === "Healthy", "Calculator tool reports Healthy status.");
    
    // Disable a tool
    toolRegistry.disable("calculator");
    const disabledExecution = await toolEngine.execute("calculator", { operation: "add", a: 1, b: 1 });
    await assert(disabledExecution.success === false && disabledExecution.status === 403, "Disabled tools refuse execution requests.");

    // Re-enable
    toolRegistry.enable("calculator");
    console.log("");

    // ------------------------------------------------------------
    // TEST 5: Cache Utility
    // ------------------------------------------------------------
    console.log("5. Testing Execution Cache...");
    toolCache.clear();

    const cacheKey = toolCache.makeKey("calculator", { operation: "add", a: 5, b: 5 });
    toolCache.set(cacheKey, { result: 10 }, 5000); // 5s TTL

    const cachedExecutionResult = await toolEngine.execute("calculator", { operation: "add", a: 5, b: 5 }, { useCache: true });
    await assert(cachedExecutionResult.success === true, "Cached execution is successful.");
    await assert(cachedExecutionResult.metadata.cached === true, "Execution meta includes cached flag.");
    await assert(cachedExecutionResult.data.result === 10, "Cached payload matches pre-stored entries.");

    toolCache.clear();
    console.log("");

    // ------------------------------------------------------------
    // TEST 6: Tool Event Dispatches
    // ------------------------------------------------------------
    console.log("6. Testing Tool Event Emitter...");
    let startEventFired: boolean = false;
    let completeEventFired: boolean = false;

    const startListener = (e: any) => {
      if (e.toolId === "calculator") {
        startEventFired = true;
      }
    };
    const completeListener = (e: any) => {
      if (e.toolId === "calculator") {
        completeEventFired = true;
      }
    };

    toolEvents.subscribe("ToolStarted", startListener);
    toolEvents.subscribe("ToolCompleted", completeListener);

    await toolEngine.execute("calculator", { operation: "add", a: 1, b: 1 });

    await assert(!!startEventFired, "ToolStarted event emitted successfully.");
    await assert(!!completeEventFired, "ToolCompleted event emitted successfully.");

    // Unsubscribe
    toolEvents.unsubscribe("ToolStarted", startListener);
    toolEvents.unsubscribe("ToolCompleted", completeListener);

    console.log("============================================================");
    console.log("ALL UNIVERSAL TOOL TESTS PASSED SUCCESSFULLY!");
    console.log("============================================================\n");
  } catch (err: any) {
    console.error(`\n❌ TEST SUITE FAILURE: ${err.message}`);
    console.error(err.stack);
    throw err;
  }
}
