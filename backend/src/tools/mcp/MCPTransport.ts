/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MCPMessage {
  jsonrpc: "2.0";
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export type MCPMessageHandler = (message: MCPMessage) => Promise<MCPMessage | void>;

export interface MCPTransport {
  id: string;
  onMessage(handler: MCPMessageHandler): void;
  send(message: MCPMessage): Promise<void>;
  close(): Promise<void>;
}

export class InMemoryMCPTransport implements MCPTransport {
  public readonly id: string;
  private messageHandler: MCPMessageHandler | null = null;
  private peer: InMemoryMCPTransport | null = null;

  constructor(id?: string) {
    this.id = id || `mcp_trans_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Links two transports in memory to exchange packets directly
   */
  public link(peer: InMemoryMCPTransport): void {
    this.peer = peer;
    peer.peer = this;
  }

  public onMessage(handler: MCPMessageHandler): void {
    this.messageHandler = handler;
  }

  public async send(message: MCPMessage): Promise<void> {
    if (this.peer && this.peer.messageHandler) {
      // Simulate microtask dispatch
      setImmediate(async () => {
        try {
          const response = await this.peer!.messageHandler!(message);
          if (response) {
            await this.peer!.send(response);
          }
        } catch (err: any) {
          console.error(`[MCPTransport] Peer handler error:`, err);
        }
      });
    }
  }

  public async close(): Promise<void> {
    this.peer = null;
    this.messageHandler = null;
  }
}
