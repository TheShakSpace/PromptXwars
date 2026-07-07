/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  avatarIcon: string;
  authorizedToolIds: string[];
  systemInstruction: string;
  confidenceRating: number; // e.g. 0.98
  reasoningStyle: "deterministic" | "probabilistic" | "rigorous-chain-of-thought";
}

export class AgentManager {
  private static agents: Map<string, AgentPersona> = new Map();

  static {
    this.register({
      id: "agent-planner",
      name: "Tactical Planner",
      role: "Strategic decomposer & task architect.",
      avatarIcon: "Map",
      authorizedToolIds: ["web-search", "filesystem"],
      systemInstruction: "You break raw user requests down into 3 pristine execution milestones with clear retry triggers.",
      confidenceRating: 0.98,
      reasoningStyle: "deterministic",
    });

    this.register({
      id: "agent-research",
      name: "Synaptic Researcher",
      role: "Information miner and fact analyzer.",
      avatarIcon: "Search",
      authorizedToolIds: ["web-search"],
      systemInstruction: "You mine external sources and reference databases, checking for temporal facts.",
      confidenceRating: 0.96,
      reasoningStyle: "probabilistic",
    });

    this.register({
      id: "agent-coding",
      name: "Software Synthesizer",
      role: "High-performance TypeScript engineer.",
      avatarIcon: "Cpu",
      authorizedToolIds: ["filesystem", "calculator"],
      systemInstruction: "You compile robust, syntactically perfect, typed TS scripts matching strict safety parameters.",
      confidenceRating: 0.99,
      reasoningStyle: "deterministic",
    });

    this.register({
      id: "agent-vision",
      name: "Optic Analyst",
      role: "Visual signal parser & OCR node.",
      avatarIcon: "Eye",
      authorizedToolIds: ["vision-ocr"],
      systemInstruction: "You extract semantic fields, medical telemetry, or document structural data from visual uploads.",
      confidenceRating: 0.97,
      reasoningStyle: "deterministic",
    });

    this.register({
      id: "agent-reviewer",
      name: "Compliance Guard",
      role: "Legal & SOC-2 compliance checker.",
      avatarIcon: "ShieldAlert",
      authorizedToolIds: ["calculator"],
      systemInstruction: "You review draft artifacts, scanning for security vulnerabilities and HIPAA/PII leaks.",
      confidenceRating: 0.99,
      reasoningStyle: "rigorous-chain-of-thought",
    });

    this.register({
      id: "agent-reasoner",
      name: "Deep Reasoner",
      role: "Core mathematical logic synthesizer.",
      avatarIcon: "Sparkles",
      authorizedToolIds: ["calculator"],
      systemInstruction: "You analyze logic pathways, evaluating claims, evidence patterns, and counter-factual cases.",
      confidenceRating: 0.98,
      reasoningStyle: "rigorous-chain-of-thought",
    });
  }

  public static register(agent: AgentPersona): void {
    this.agents.set(agent.id, agent);
  }

  public static getAgents(): AgentPersona[] {
    return Array.from(this.agents.values());
  }

  public static getAgentById(id: string): AgentPersona | undefined {
    return this.agents.get(id);
  }

  /**
   * Resolves the highest ranking agent capable of executing the specified tasks
   * based on the tools required and historical accuracy coefficients.
   */
  public static selectAgentForTask(requiredTools: string[]): AgentPersona {
    const list = this.getAgents();
    let bestAgent = list[0];
    let maxMatchCount = -1;

    for (const agent of list) {
      const matchCount = agent.authorizedToolIds.filter((tid) => requiredTools.includes(tid)).length;
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestAgent = agent;
      } else if (matchCount === maxMatchCount && agent.confidenceRating > bestAgent.confidenceRating) {
        bestAgent = agent;
      }
    }

    return bestAgent;
  }
}
