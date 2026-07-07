/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolEvent, ToolEventListener, ToolEventType } from "./types";

export class ToolEvents {
  private static instance: ToolEvents;
  private listeners: Map<string, Set<ToolEventListener>> = new Map();

  private constructor() {}

  public static getInstance(): ToolEvents {
    if (!ToolEvents.instance) {
      ToolEvents.instance = new ToolEvents();
    }
    return ToolEvents.instance;
  }

  /**
   * Subscribe to a specific tool event type or all events ("*")
   */
  public subscribe(type: ToolEventType | "*", listener: ToolEventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  /**
   * Unsubscribe from tool events
   */
  public unsubscribe(type: ToolEventType | "*", listener: ToolEventListener): void {
    const set = this.listeners.get(type);
    if (set) {
      set.delete(listener);
    }
  }

  /**
   * Publish a tool event
   */
  public emit(event: ToolEvent): void {
    // Notify type-specific listeners
    const specificListeners = this.listeners.get(event.type);
    if (specificListeners) {
      for (const listener of specificListeners) {
        try {
          listener(event);
        } catch (err) {
          console.error(`[ToolEvents] Listener error for type ${event.type}:`, err);
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
          console.error(`[ToolEvents] Listener error for type *:`, err);
        }
      }
    }
  }
}

export const toolEvents = ToolEvents.getInstance();
