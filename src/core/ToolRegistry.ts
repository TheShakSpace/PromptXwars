/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ToolInputSchema {
  type: "object";
  properties: Record<string, { type: "string" | "number" | "boolean" | "array"; description: string; required?: boolean }>;
}

export interface ToolPlugin {
  id: string;
  name: string;
  description: string;
  category: "utility" | "data" | "communication" | "ai";
  permissions: string[]; // e.g. ["operator", "researcher", "admin"]
  inputSchema: ToolInputSchema;
  outputSchema: Record<string, any>;
  status: "active" | "restricted" | "deprecated";
  execute: (args: Record<string, any>) => Promise<Record<string, any>>;
}

export class ToolRegistry {
  private static tools: Map<string, ToolPlugin> = new Map();

  static {
    // Register Web Search Tool
    this.register({
      id: "web-search",
      name: "Deep Web Retrieval",
      description: "Searches the live public web for temporal events and reference datasets.",
      category: "data",
      permissions: ["operator", "researcher"],
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term or prompt" }
        }
      },
      outputSchema: {
        results: "array",
        summary: "string"
      },
      status: "active",
      execute: async (args) => {
        return {
          results: [
            { title: `Reference on ${args.query}`, url: "https://example.com/data", snippet: "Consolidated commercial performance data." }
          ],
          summary: `Web search complete for '${args.query}'. Found high-relevance matches.`
        };
      }
    });

    // Register Calculator Tool
    this.register({
      id: "calculator",
      name: "Algorithmic Calculator",
      description: "Performs highly precise scientific and algebraic computations.",
      category: "utility",
      permissions: ["operator"],
      inputSchema: {
        type: "object",
        properties: {
          expression: { type: "string", description: "Mathematical expression to evaluate" }
        }
      },
      outputSchema: {
        result: "number",
        formula: "string"
      },
      status: "active",
      execute: async (args) => {
        try {
          // Simple safe evaluation mockup for display
          const clean = args.expression.replace(/[^0-9+\-*/().]/g, "");
          const evaluated = Function(`"use strict"; return (${clean})`)();
          return { result: evaluated, formula: args.expression };
        } catch {
          return { result: 0, error: "Unable to parse expression" };
        }
      }
    });

    // Register OCR Vision Tool
    this.register({
      id: "vision-ocr",
      name: "Vision OCR Parser",
      description: "Extracts textual parameters and vitals from image artifacts.",
      category: "ai",
      permissions: ["operator", "researcher"],
      inputSchema: {
        type: "object",
        properties: {
          imageUrl: { type: "string", description: "URL or base64 stream of image" }
        }
      },
      outputSchema: {
        extractedText: "string",
        confidence: "number"
      },
      status: "active",
      execute: async () => {
        return {
          extractedText: "PATIENT BP: 120/80 | HEART_RATE: 72bpm | TEMP: 98.6F | CH_METRICS: NOMINAL",
          confidence: 0.992
        };
      }
    });

    // Register Database Tool
    this.register({
      id: "database",
      name: "Durable DB Connector",
      description: "Queries or updates structured database transaction logs.",
      category: "data",
      permissions: ["operator", "admin"],
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "SQL statement or collection filter" }
        }
      },
      outputSchema: {
        rows: "array",
        count: "number"
      },
      status: "active",
      execute: async (args) => {
        return {
          rows: [
            { id: "tx-1004", amount: 450000, asset: "HELIOS_BONDS", flag: "RESOLVED" }
          ],
          count: 1
        };
      }
    });

    // Register REST Tool
    this.register({
      id: "rest-api",
      name: "REST Interface Dispatcher",
      description: "Executes HTTP requests to third-party endpoints.",
      category: "communication",
      permissions: ["operator"],
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Endpoint URL" },
          method: { type: "string", description: "HTTP Method" }
        }
      },
      outputSchema: {
        statusCode: "number",
        payload: "object"
      },
      status: "active",
      execute: async (args) => {
        return {
          statusCode: 200,
          payload: { status: "OK", sync: true, target: args.url }
        };
      }
    });

    // Register Filesystem Tool
    this.register({
      id: "filesystem",
      name: "Safe Filesystem Sandbox",
      description: "Reads or commits workspace assets within isolated directory boundaries.",
      category: "utility",
      permissions: ["operator"],
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Relative file path" }
        }
      },
      outputSchema: {
        success: "boolean",
        fileContent: "string"
      },
      status: "active",
      execute: async (args) => {
        return {
          success: true,
          fileContent: `# Unified workspace configuration active.\nPath target: ${args.path}`
        };
      }
    });
  }

  public static register(tool: ToolPlugin): void {
    this.tools.set(tool.id, tool);
  }

  public static getTools(): ToolPlugin[] {
    return Array.from(this.tools.values());
  }

  public static getToolById(id: string): ToolPlugin | undefined {
    return this.tools.get(id);
  }

  public static async executeTool(id: string, args: Record<string, any>): Promise<Record<string, any>> {
    const tool = this.tools.get(id);
    if (!tool) {
      throw new Error(`Tool with ID '${id}' is not registered in the cognitive core.`);
    }
    if (tool.status === "restricted") {
      throw new Error(`Execution denied. Tool '${id}' status is restricted by operator security policies.`);
    }
    return await tool.execute(args);
  }
}
