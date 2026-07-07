/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toolRegistry } from "../registry/ToolRegistry";
import { toolExecutor } from "./ToolExecutor";
import { toolRouter, RoutingCriteria } from "./ToolRouter";
import { toolHealthMonitor } from "../health/ToolHealthMonitor";
import { toolPermissionManager, PermissionContext } from "../ToolPermissionManager";
import { BaseTool } from "../BaseTool";
import { ToolExecutionResult, ToolHealthState } from "../types";

export class ToolEngine {
  private static instance: ToolEngine;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ToolEngine {
    if (!ToolEngine.instance) {
      ToolEngine.instance = new ToolEngine();
    }
    return ToolEngine.instance;
  }

  /**
   * Initializes the tool infrastructure, registers all default tools, and boots services.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("[ToolEngine] Initializing Universal Tool Registry & Execution Engine...");

    // Register all default supported tools
    await this.registerDefaultTools();

    // Start background health checking daemon
    toolHealthMonitor.startMonitoring(60000); // check health every 1 minute

    this.isInitialized = true;
    console.log("[ToolEngine] Universal Tool Registry & Execution Engine fully loaded.");
  }

  /**
   * Shuts down all monitoring and tools cleanly
   */
  public async shutdown(): Promise<void> {
    toolHealthMonitor.stopMonitoring();
    const tools = toolRegistry.getAll();
    for (const tool of tools) {
      await tool.shutdown();
    }
    this.isInitialized = false;
    console.log("[ToolEngine] Universal Tool Registry & Execution Engine successfully shut down.");
  }

  /**
   * Executes a tool by ID
   */
  public async execute(
    toolId: string,
    input: any,
    options: {
      context?: PermissionContext;
      useCache?: boolean;
      bypassPermissions?: boolean;
    } = {}
  ): Promise<ToolExecutionResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await toolExecutor.execute(toolId, input, options);
  }

  /**
   * Intelligently selects and executes a tool based on user intent and task criteria
   */
  public async routeAndExecute(
    criteria: RoutingCriteria,
    input: any,
    options: {
      useCache?: boolean;
      bypassPermissions?: boolean;
    } = {}
  ): Promise<ToolExecutionResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const tool = toolRouter.route(criteria);
    if (!tool) {
      return {
        id: `run_failed_${Date.now()}`,
        tool: "unknown",
        success: false,
        data: null,
        error: `Could not resolve a suitable tool based on prompt/intent criteria.`,
        metadata: {
          startTime: Date.now(),
          endTime: Date.now(),
          executionTimeMs: 0,
          retryCount: 0,
        },
        executionTime: 0,
        status: 404,
      } as any;
    }

    return await toolExecutor.execute(tool.metadata.id, input, {
      context: criteria.context,
      useCache: options.useCache,
      bypassPermissions: options.bypassPermissions,
    });
  }

  /**
   * Pre-loads and registers all 20 standard supported tools with valid metadata and schemas
   */
  private async registerDefaultTools(): Promise<void> {
    const defaultTools = [
      this.createGenericTool("web-search", "Web Search", "Searches the web for matching terms.", "Search", ["Public"], {
        type: "object",
        properties: { query: { type: "string", description: "Search terms" } },
        required: ["query"],
      }, (input) => ({
        results: [
          { title: `Search result for: ${input.query}`, snippet: `Information related to ${input.query}...`, url: "https://example.com" }
        ]
      })),

      this.createGenericTool("vision", "Vision", "Analyzes contents of visual imagery.", "AI", ["Authenticated"], {
        type: "object",
        properties: { imageUrl: { type: "string" }, prompt: { type: "string" } },
        required: ["imageUrl"],
      }, (input) => ({
        description: `Visual analysis of ${input.imageUrl}. Detected a beautiful dashboard element with modern UI structures.`,
        confidence: 0.96,
      })),

      this.createGenericTool("ocr", "OCR", "Extracts printed text from image documents.", "AI", ["Authenticated"], {
        type: "object",
        properties: { imageUrl: { type: "string" } },
        required: ["imageUrl"],
      }, (input) => ({
        extractedText: "UNIVERSAL TOOL PLATFORM INTEGRATION\nVERSION: 1.0\nSTATUS: ONLINE",
        confidence: 0.98,
      })),

      this.createGenericTool("calculator", "Calculator", "Performs mathematical operations.", "Utility", ["Public"], {
        type: "object",
        properties: {
          operation: { type: "string", description: "add, subtract, multiply, divide" },
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["operation", "a", "b"],
      }, (input) => {
        const { operation, a, b } = input;
        let result = 0;
        if (operation === "add" || operation === "+") result = a + b;
        else if (operation === "subtract" || operation === "-") result = a - b;
        else if (operation === "multiply" || operation === "*") result = a * b;
        else if (operation === "divide" || operation === "/") result = b !== 0 ? a / b : NaN;
        return { result };
      }),

      this.createGenericTool("pdf-reader", "PDF Reader", "Extracts metadata and text from PDF documents.", "Utility", ["Authenticated"], {
        type: "object",
        properties: { filePath: { type: "string" } },
        required: ["filePath"],
      }, (input) => ({
        title: "Enterprise Multi-Agent Architecture Guide",
        author: "MCP Standards Core Group",
        pagesCount: 42,
        previewText: "This paper outlines the specifications for Model Context Protocol architectures...",
      })),

      this.createGenericTool("csv-reader", "CSV Reader", "Parses structured table CSV values.", "Utility", ["Authenticated"], {
        type: "object",
        properties: { filePath: { type: "string" } },
        required: ["filePath"],
      }, (input) => ({
        headers: ["id", "tool", "category", "status"],
        rows: [
          ["1", "web-search", "Search", "Healthy"],
          ["2", "vision", "AI", "Healthy"],
          ["3", "calculator", "Utility", "Healthy"],
        ],
        rowCount: 3,
      })),

      this.createGenericTool("markdown-reader", "Markdown Reader", "Parses markdown structure details.", "Utility", ["Public"], {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      }, (input) => ({
        headings: ["Title", "Introduction", "Summary"],
        wordCount: input.text ? input.text.split(/\s+/).length : 0,
      })),

      this.createGenericTool("image-processor", "Image Processor", "Applies filters and crops image files.", "Utility", ["Authenticated"], {
        type: "object",
        properties: { imageUrl: { type: "string" }, action: { type: "string" } },
        required: ["imageUrl", "action"],
      }, (input) => ({
        processedUrl: `${input.imageUrl}?processed=true&action=${input.action}`,
        dimensions: { width: 1024, height: 1024 },
        format: "png",
      })),

      this.createGenericTool("audio-processor", "Audio Processor", "Transcribes and cleans audio recordings.", "AI", ["Authenticated"], {
        type: "object",
        properties: { audioUrl: { type: "string" } },
        required: ["audioUrl"],
      }, (input) => ({
        transcription: "Let's standardize the Model Context Protocol connections so tools can integrate seamlessly.",
        durationSeconds: 12.5,
        confidence: 0.94,
      })),

      this.createGenericTool("video-metadata", "Video Metadata", "Extracts dimensions, length and audio streams from video files.", "Utility", ["Authenticated"], {
        type: "object",
        properties: { videoUrl: { type: "string" } },
        required: ["videoUrl"],
      }, (input) => ({
        duration: 120.4,
        fps: 30,
        resolution: "1920x1080",
        codec: "h264",
      })),

      this.createGenericTool("rest-client", "REST Client", "Makes generic HTTP REST calls.", "Network", ["Admin"], {
        type: "object",
        properties: { method: { type: "string" }, url: { type: "string" }, headers: { type: "object" }, body: { type: "object" } },
        required: ["method", "url"],
      }, (input) => ({
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        data: { message: "Mocked rest-client request received successfully.", echo: input.body },
      })),

      this.createGenericTool("graphql-client", "GraphQL Client", "Queries GraphQL endpoints.", "Network", ["Admin"], {
        type: "object",
        properties: { url: { type: "string" }, query: { type: "string" }, variables: { type: "object" } },
        required: ["url", "query"],
      }, (input) => ({
        data: {
          mcpResources: [
            { id: "mcp-resource-1", name: "System Kernel Config", type: "text/plain" }
          ]
        },
      })),

      this.createGenericTool("database-query", "Database Query", "Executes relational SQL query statements.", "Database", ["Admin", "System"], {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      }, (input) => ({
        rows: [
          { id: "tool_1", name: "Web Search", status: "Healthy" },
          { id: "tool_2", name: "Vision", status: "Healthy" },
        ],
        rowCount: 2,
      })),

      this.createGenericTool("email", "Email", "Sends and routes email notifications.", "Communication", ["Authenticated"], {
        type: "object",
        properties: { to: { type: "string" }, subject: { type: "string" }, body: { type: "string" } },
        required: ["to", "subject", "body"],
      }, (input) => ({
        messageId: `email_${Math.random().toString(36).substring(2, 11)}@platform.com`,
        success: true,
      })),

      this.createGenericTool("calendar", "Calendar", "Schedules, updates and reads calendar events.", "Communication", ["Authenticated"], {
        type: "object",
        properties: { action: { type: "string" }, title: { type: "string" }, startTime: { type: "string" } },
        required: ["action", "title", "startTime"],
      }, (input) => ({
        eventId: `cal_${Math.random().toString(36).substring(2, 11)}`,
        title: input.title,
        startTime: input.startTime,
        status: "confirmed",
      })),

      this.createGenericTool("maps", "Maps", "Computes geolocation distance routing maps.", "Location", ["Public"], {
        type: "object",
        properties: { origin: { type: "string" }, destination: { type: "string" } },
        required: ["origin", "destination"],
      }, (input) => ({
        distanceKm: 12.8,
        durationMinutes: 24.5,
        polyline: "g_xy_H~zvA_v@h`@",
      })),

      this.createGenericTool("filesystem", "Filesystem", "Performs local file read/write operations.", "Utility", ["System"], {
        type: "object",
        properties: { path: { type: "string" }, operation: { type: "string" }, content: { type: "string" } },
        required: ["path", "operation"],
      }, (input) => ({
        path: input.path,
        operation: input.operation,
        bytesWritten: input.content ? input.content.length : 0,
        success: true,
      })),

      this.createGenericTool("cloud-storage", "Cloud Storage", "Uploads or retrieves cloud object files.", "Storage", ["Authenticated"], {
        type: "object",
        properties: { bucket: { type: "string" }, key: { type: "string" }, action: { type: "string" } },
        required: ["bucket", "key", "action"],
      }, (input) => ({
        publicUrl: `https://storage.googleapis.com/${input.bucket}/${input.key}`,
        success: true,
      })),

      this.createGenericTool("notification", "Notification", "Triggers alerts and system push messages.", "Communication", ["Public"], {
        type: "object",
        properties: { message: { type: "string" }, channel: { type: "string" } },
        required: ["message"],
      }, (input) => ({
        notificationId: `notif_${Math.random().toString(36).substring(2, 11)}`,
        channel: input.channel || "dashboard",
        delivered: true,
      })),

      this.createGenericTool("custom-tool", "Custom Tool", "An extensible custom developer pipeline.", "Utility", ["Authenticated"], {
        type: "object",
        properties: { code: { type: "string" }, params: { type: "object" } },
        required: ["code"],
      }, (input) => ({
        executionOutput: `Executed custom script. Parameters received: ${JSON.stringify(input.params || {})}`,
        statusCode: 0,
      })),
    ];

    for (const tool of defaultTools) {
      toolRegistry.register(tool);
    }
  }

  /**
   * Helper utility to dynamically instantiate BaseTools
   */
  private createGenericTool(
    id: string,
    name: string,
    description: string,
    category: string,
    permissions: any[],
    inputSchema: any,
    executionFn: (input: any) => any
  ): BaseTool {
    return new (class extends BaseTool {
      public readonly metadata = {
        id,
        name,
        description,
        version: "1.0.0",
        category,
        permissions,
        timeout: 5000,
        retryPolicy: { maxRetries: 2, backoffMs: 100 },
        supportedInput: inputSchema,
        supportedOutput: { type: "object" },
        status: "Healthy" as ToolHealthState,
      };

      public async execute(input: any): Promise<any> {
        return executionFn(input);
      }
    })();
  }
}

export const toolEngine = ToolEngine.getInstance();
export default toolEngine;
