/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AgentEventType =
  | "TASK_STARTED"
  | "TASK_COMPLETED"
  | "TASK_FAILED"
  | "CONTEXT_UPDATED"
  | "MEMORY_UPDATED"
  | "AGENT_STATE_CHANGED"
  | "SYSTEM_ALERT";

export interface AgentEventPayload {
  taskId?: string;
  agentId?: string;
  timestamp: string;
  data?: any;
  message?: string;
}

export type AgentBusCallback = (payload: AgentEventPayload) => void | Promise<void>;

export class AgentBus {
  private static instance: AgentBus;
  private listeners = new Map<AgentEventType, Set<AgentBusCallback>>();

  private constructor() {}

  static getInstance(): AgentBus {
    if (!AgentBus.instance) {
      AgentBus.instance = new AgentBus();
    }
    return AgentBus.instance;
  }

  /**
   * Subscribe to a specific event type.
   */
  subscribe(event: AgentEventType, callback: AgentBusCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return an unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Publish an event to all subscribers.
   */
  async publish(event: AgentEventType, payload: AgentEventPayload): Promise<void> {
    const callbacks = this.listeners.get(event);
    if (!callbacks || callbacks.size === 0) return;

    const promises: Promise<void>[] = [];
    for (const callback of callbacks) {
      try {
        const res = callback(payload);
        if (res instanceof Promise) {
          promises.push(res);
        }
      } catch (err) {
        console.error(`[AgentBus] Error in subscription callback for event ${event}:`, err);
      }
    }

    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }
  }

  /**
   * Clears all subscribers for testing.
   */
  clear(): void {
    this.listeners.clear();
  }
}

export const agentBus = AgentBus.getInstance();
