/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MemoryNode {
  id: string;
  category: "fact" | "user-preference" | "regulatory-rule" | "context-pivot";
  content: string;
  timestamp: string;
  isPinned: boolean;
  vectorId?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export class MemoryEngine {
  private static shortTermMemory: string[] = [];
  private static longTermMemory: MemoryNode[] = [];
  private static edges: GraphEdge[] = [];

  static {
    // Seed initial Knowledge Graph nodes
    this.addLongTermNode({
      id: "helios-governance",
      category: "regulatory-rule",
      content: "All clinical summaries must enforce HIPAA PII stripping and generate standard SOAP notes formats.",
      timestamp: new Date().toISOString(),
      isPinned: true,
    });

    this.addLongTermNode({
      id: "helios-finance",
      category: "regulatory-rule",
      content: "All finance charts must project continuous liquidity curves and risk assessment models.",
      timestamp: new Date().toISOString(),
      isPinned: true,
    });

    this.addLongTermNode({
      id: "user-profile",
      category: "user-preference",
      content: "Active user prefers high-contrast dark space UI backgrounds and compact list panels.",
      timestamp: new Date().toISOString(),
      isPinned: false,
    });

    // Link Knowledge Graph edges
    this.edges.push(
      { source: "helios-governance", target: "clinical-agent", relationship: "CONSTRAINS", weight: 0.95 },
      { source: "helios-finance", target: "quantitative-agent", relationship: "GUIDES", weight: 0.9 }
    );
  }

  public static addShortTermLog(log: string): void {
    this.shortTermMemory.push(log);
    if (this.shortTermMemory.length > 50) {
      this.shortTermMemory.shift(); // keep sliding window bounded
    }
  }

  public static getShortTermLogs(): string[] {
    return this.shortTermMemory;
  }

  public static addLongTermNode(node: MemoryNode): void {
    this.longTermMemory.push(node);
  }

  public static getLongTermNodes(): MemoryNode[] {
    return this.longTermMemory;
  }

  public static getPinnedNodes(): MemoryNode[] {
    return this.longTermMemory.filter((n) => n.isPinned);
  }

  public static getGraphEdges(): GraphEdge[] {
    return this.edges;
  }

  /**
   * Performs simulated high-performance semantic retrieval across
   * persistent memory blocks and the active Knowledge Graph.
   */
  public static retrieveSemanticContext(query: string): MemoryNode[] {
    const lc = query.toLowerCase();
    return this.longTermMemory.filter((node) => {
      return (
        node.content.toLowerCase().includes(lc) ||
        node.category.toLowerCase().includes(lc) ||
        node.id.toLowerCase().includes(lc)
      );
    });
  }
}
