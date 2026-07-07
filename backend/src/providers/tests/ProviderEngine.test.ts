/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MockProvider } from "./MockProvider";
import { ProviderRegistry } from "../factory/ProviderRegistry";
import { ModelRouter } from "../router/ModelRouter";
import { CostEstimator } from "../utils/CostEstimator";
import { TokenTracker } from "../utils/TokenTracker";
import { PromptCache } from "../utils/PromptCache";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

export async function runAllTests(): Promise<void> {
  console.log("\n============================================================");
  console.log("RUNNING UNIVERSAL AI PROVIDER LAYER TEST SUITE");
  console.log("============================================================\n");

  try {
    // ------------------------------------------------------------
    // TEST 1: Token Estimations and Pricing Calculations
    // ------------------------------------------------------------
    console.log("1. Running Token Tracker and Cost Estimator Tests...");
    const samplePrompt = "Hello, world! This is a robust test sentence.";
    const estimatedTokens = TokenTracker.estimateTokenCount(samplePrompt);
    await assert(estimatedTokens > 0, `Prompt token estimate: ${estimatedTokens}`);

    // Cost estimation for gemini-3.5-flash: input ($0.075/M), output ($0.3/M)
    const cost = CostEstimator.calculateCost("gemini-3.5-flash", 1000000, 1000000);
    await assert(cost === 0.375, `Pricing calculation matches config: $${cost} (Expected: $0.375)`);
    console.log("");

    // ------------------------------------------------------------
    // TEST 2: Provider Base & Mock Capabilities
    // ------------------------------------------------------------
    console.log("2. Running Provider Contract Tests...");
    const mockGemini = new MockProvider("gemini-test", "Test Gemini");
    mockGemini.simulatedLatencyMs = 15;
    const response = await mockGemini.generate("Explain black holes.");
    
    await assert(response.provider === "gemini-test", `Response provider: ${response.provider}`);
    await assert(response.text.includes("Explain black holes"), "Response incorporates the prompt.");
    await assert(response.latency >= 15, `Latency recorded correctly: ${response.latency}ms`);
    await assert(response.usage.totalTokens > 0, `Token counts tracked: ${response.usage.totalTokens}`);
    console.log("");

    // ------------------------------------------------------------
    // TEST 3: Streaming Engine Tests
    // ------------------------------------------------------------
    console.log("3. Running Streaming SSE Chunk Tests...");
    const stream = await mockGemini.stream("Generate a listing of numbers.");
    const reader = stream.getReader();
    let chunkCount = 0;
    let accumulatedText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      chunkCount++;
      accumulatedText += value.text || "";
    }
    reader.releaseLock();

    await assert(chunkCount > 0, `Total SSE stream chunks received: ${chunkCount}`);
    await assert(accumulatedText.length > 0, `Accumulated text: "${accumulatedText.trim()}"`);
    console.log("");

    // ------------------------------------------------------------
    // TEST 4: Prompt Cache Validation
    // ------------------------------------------------------------
    console.log("4. Running Prompt Cache Validation...");
    PromptCache.clear();
    const promptKey = "Predict the weather in Paris.";
    const cacheResult = PromptCache.get(promptKey, "gemini-3.5-flash");
    await assert(cacheResult === null, "Cache starts empty (cache miss).");

    PromptCache.set(promptKey, "gemini-3.5-flash", response);
    const cachedResponse = PromptCache.get<any>(promptKey, "gemini-3.5-flash");
    await assert(cachedResponse !== null, "Cache stores and returns values (cache hit).");
    await assert(cachedResponse.text === response.text, "Cached content matches original.");
    console.log("");

    // ------------------------------------------------------------
    // TEST 5: Automatic Fallback Failure System (Gemini -> Claude -> GPT -> DeepSeek)
    // ------------------------------------------------------------
    console.log("5. Running Automated Failover (Fallback) Tests...");
    
    // Register temporary mock nodes to Registry to simulate the fallback chain safely
    const mockPrimary = new MockProvider("gemini", "Mock Gemini Primary");
    mockPrimary.shouldFail = true; // Invalidate primary node to trigger fallback
    mockPrimary.failureMessage = "Gemini API Quota Exceeded (429)";

    const mockSecondary = new MockProvider("claude", "Mock Claude Secondary");
    mockSecondary.shouldFail = false; // Healthy fallback
    mockSecondary.mockResponseText = "Successful Claude Fallback Text";

    // Inject into registry
    ProviderRegistry.register(mockPrimary);
    ProviderRegistry.register(mockSecondary);

    let fallbackTriggered: any = false;
    let fallbackModelTriggered = "";

    const finalResult = await ModelRouter.executeWithFallback(
      "chat",
      async (provider, modelId) => {
        return await provider.generate("Give me fallback answers.", { model: modelId });
      },
      "gemini-3.5-flash", // Preferred model
      (err, nextModelId) => {
        fallbackTriggered = true;
        fallbackModelTriggered = nextModelId;
        console.log(`    [Failover Action] Logged Error: "${err.message}". Rerouting to next model: "${nextModelId}"`);
      }
    );

    await assert(fallbackTriggered === true, "Automatic failover was successfully triggered.");
    await assert(fallbackModelTriggered === "claude-3-5-sonnet", `Failed over to next chain candidate: "${fallbackModelTriggered}"`);
    await assert(finalResult.text.includes("Successful Claude Fallback Text"), `Fallback response obtained: "${finalResult.text}"`);
    console.log("");

    console.log("============================================================");
    console.log("ALL TESTS COMPLETED SUCCESSFULLY! [PASSED]");
    console.log("============================================================\n");
  } catch (err: any) {
    console.error("\n❌ TEST SUITE RUN ENCOUNTERED CRITICAL FAILURES:");
    console.error(err);
    process.exit(1);
  }
}

// Self-run script entrypoint
if (import.meta.url && process.argv[1]?.includes("ProviderEngine.test.ts")) {
  runAllTests();
}
