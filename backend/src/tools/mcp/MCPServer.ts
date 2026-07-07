/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MCPTransport, MCPMessage } from "./MCPTransport";
import { toolRegistry } from "../registry/ToolRegistry";
import { toolEngine } from "../engine/ToolEngine";

export interface MCPResource {
  uri: string;
  name: string;
  type: string;
  description?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export class MCPServer {
  private static instance: MCPServer;
  private connections = new Map<string, MCPTransport>();
  
  // Expose some sample resources and prompts to comply with MCP specs
  private resources: MCPResource[] = [
    {
      uri: "mcp://system/config",
      name: "Core System Config",
      type: "application/json",
      description: "Exposes system registry engine and router states."
    },
    {
      uri: "mcp://analytics/latency",
      name: "Tool Performance Stats",
      type: "application/json",
      description: "Aggregates execution latency metrics across all tools."
    }
  ];

  private prompts: MCPPrompt[] = [
    {
      name: "Optimized Search Query Builder",
      description: "Generates high precision search term keywords for web search tools.",
      arguments: [
        { name: "topic", description: "The broad target topic of interest", required: true }
      ]
    }
  ];

  private constructor() {}

  public static getInstance(): MCPServer {
    if (!MCPServer.instance) {
      MCPServer.instance = new MCPServer();
    }
    return MCPServer.instance;
  }

  /**
   * Links a transport channel connection to this MCP Server
   */
  public connect(transport: MCPTransport): void {
    this.connections.set(transport.id, transport);
    
    transport.onMessage(async (msg: MCPMessage) => {
      return await this.handleRequest(msg);
    });

    console.log(`[MCPServer] Connected client transport connection: ${transport.id}`);
  }

  /**
   * Unlinks a transport connection from this MCP Server
   */
  public async disconnect(connectionId: string): Promise<void> {
    const transport = this.connections.get(connectionId);
    if (transport) {
      await transport.close();
      this.connections.delete(connectionId);
      console.log(`[MCPServer] Disconnected client connection: ${connectionId}`);
    }
  }

  /**
   * Standard JSON-RPC handler for MCP request methods
   */
  public async handleRequest(message: MCPMessage): Promise<MCPMessage | void> {
    if (message.jsonrpc !== "2.0") {
      return this.createRpcError(message.id, -32600, "Invalid Request (Not JSON-RPC 2.0)");
    }

    const { method, params, id } = message;
    if (!method) return;

    try {
      switch (method) {
        case "initialize":
          return {
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: {
                tools: {},
                resources: {},
                prompts: {}
              },
              serverInfo: {
                name: "universal-tool-mcp-server",
                version: "1.0.0"
              }
            }
          };

        case "tools/list": {
          const registeredTools = toolRegistry.getEnabled();
          const toolsList = registeredTools.map((t) => ({
            name: t.metadata.id,
            description: t.metadata.description,
            inputSchema: t.metadata.supportedInput,
          }));
          return {
            jsonrpc: "2.0",
            id,
            result: { tools: toolsList }
          };
        }

        case "tools/call": {
          if (!params || !params.name || !params.arguments) {
            return this.createRpcError(id, -32602, "Invalid params for tools/call. Require 'name' and 'arguments'.");
          }
          const executionResult = await toolEngine.execute(params.name, params.arguments);
          return {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(executionResult.data || executionResult.error || {})
                }
              ],
              isError: !executionResult.success
            }
          };
        }

        case "resources/list":
          return {
            jsonrpc: "2.0",
            id,
            result: { resources: this.resources }
          };

        case "resources/read": {
          if (!params || !params.uri) {
            return this.createRpcError(id, -32602, "Missing required parameter 'uri' in resources/read request.");
          }
          const matched = this.resources.find((r) => r.uri === params.uri);
          if (!matched) {
            return this.createRpcError(id, 404, `Resource with URI '${params.uri}' not found.`);
          }
          const content = matched.uri.includes("config") 
            ? JSON.stringify({ toolsCount: toolRegistry.getAll().length, status: "Active" })
            : JSON.stringify({ avgLatencyMs: 14.5 });

          return {
            jsonrpc: "2.0",
            id,
            result: {
              contents: [
                {
                  uri: params.uri,
                  mimeType: matched.type,
                  text: content
                }
              ]
            }
          };
        }

        case "prompts/list":
          return {
            jsonrpc: "2.0",
            id,
            result: { prompts: this.prompts }
          };

        case "prompts/get": {
          if (!params || !params.name) {
            return this.createRpcError(id, -32602, "Missing required parameter 'name' in prompts/get request.");
          }
          const matched = this.prompts.find((p) => p.name === params.name);
          if (!matched) {
            return this.createRpcError(id, 404, `Prompt '${params.name}' not found.`);
          }
          const topic = params.arguments?.topic || "artificial intelligence";
          return {
            jsonrpc: "2.0",
            id,
            result: {
              description: matched.description,
              messages: [
                {
                  role: "user",
                  content: {
                    type: "text",
                    text: `Analyze the topic: '${topic}' and construct 3 optimized, high-density keywords for a web search query. Output only the keywords.`
                  }
                }
              ]
            }
          };
        }

        case "ping":
          return {
            jsonrpc: "2.0",
            id,
            result: "pong"
          };

        default:
          return this.createRpcError(id, -32601, `Method '${method}' not found.`);
      }
    } catch (err: any) {
      return this.createRpcError(id, -32603, err.message || "Internal server error.");
    }
  }

  private createRpcError(id: string | number | undefined, code: number, message: string): MCPMessage {
    return {
      jsonrpc: "2.0",
      id,
      error: { code, message }
    };
  }
}

export const mcpServer = MCPServer.getInstance();
