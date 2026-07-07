/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkflowEvent, WorkflowEventListener, WorkflowEventType } from "../types";

export class WorkflowEvents {
  private static instance: WorkflowEvents;
  private listeners: Map<string, Set<WorkflowEventListener>> = new Map();

  private constructor() {}

  public static getInstance(): WorkflowEvents {
    if (!WorkflowEvents.instance) {
      WorkflowEvents.instance = new WorkflowEvents();
    }
    return WorkflowEvents.instance;
  }

  /**
   * Subscribe to a specific workflow event type or all events ("*")
   */
  public subscribe(type: WorkflowEventType | "*", listener: WorkflowEventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  /**
   * Unsubscribe from workflow events
   */
  public unsubscribe(type: WorkflowEventType | "*", listener: WorkflowEventListener): void {
    const set = this.listeners.get(type);
    if (set) {
      set.delete(listener);
    }
  }

  /**
   * Publish a workflow event
   */
  public emit(event: WorkflowEvent): void {
    // Notify type-specific listeners
    const specificListeners = this.listeners.get(event.type);
    if (specificListeners) {
      for (const listener of specificListeners) {
        try {
          listener(event);
        } catch (err) {
          console.error(`[WorkflowEvents] Listener error for type ${event.type}:`, err);
        }
      }
    }

    // Notify catch-all listeners
    const allListeners = this.listeners.get("*");
    if (allListeners) {
      for (const listener of allListeners) {
        try {
          listener(event);
        } catch (err) {
          console.error(`[WorkflowEvents] Listener error for type *:`, err);
        }
      }
    }
  }
}

export const workflowEvents = WorkflowEvents.getInstance();
