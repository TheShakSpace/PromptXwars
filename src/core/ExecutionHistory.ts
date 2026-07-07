/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from "./TaskQueue";
import { ConsolidatedContext } from "./ContextEngine";
import { AgentPersona } from "./AgentManager";
import { CompletionResponse } from "./ModelRouter";
import { FormattedOutput } from "./OutputFormatter";

export interface ExecutionRecord {
  id: string;
  userPrompt: string;
  industry: "clinical" | "finance" | "legal" | "general";
  timestamp: string;
  tasks: Task[];
  context: ConsolidatedContext;
  selectedAgent: AgentPersona;
  completion: CompletionResponse;
  formattedOutput: FormattedOutput;
  totalTokensUsed: number;
  totalCost: number;
  totalDurationMs: number;
}

export class ExecutionHistory {
  private records: ExecutionRecord[] = [];
  private listeners: Set<(records: ExecutionRecord[]) => void> = new Set();

  public getRecords(): ExecutionRecord[] {
    return this.records;
  }

  public getRecordById(id: string): ExecutionRecord | undefined {
    return this.records.find((r) => r.id === id);
  }

  public addRecord(record: ExecutionRecord): void {
    this.records.unshift(record); // newest first
    this.notify();
  }

  public clear(): void {
    this.records = [];
    this.notify();
  }

  /**
   * Search and filter histories by query, industry vertical, or agent.
   */
  public queryHistory(filter: {
    search?: string;
    industry?: string;
    agentId?: string;
  }): ExecutionRecord[] {
    return this.records.filter((rec) => {
      if (filter.search) {
        const query = filter.search.toLowerCase();
        const matchesPrompt = rec.userPrompt.toLowerCase().includes(query);
        const matchesOutput = rec.completion.text.toLowerCase().includes(query);
        if (!matchesPrompt && !matchesOutput) return false;
      }
      if (filter.industry && rec.industry !== filter.industry) {
        return false;
      }
      if (filter.agentId && rec.selectedAgent.id !== filter.agentId) {
        return false;
      }
      return true;
    });
  }

  public subscribe(callback: (records: ExecutionRecord[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getRecords());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    const list = this.getRecords();
    this.listeners.forEach((listener) => listener(list));
  }
}

// Global instance
export const globalExecutionHistory = new ExecutionHistory();
