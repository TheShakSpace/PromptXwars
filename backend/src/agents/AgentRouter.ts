/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentTask, AgentHealth } from "./BaseAgent";
import { agentRegistry } from "./AgentRegistry";

export class AgentRouter {
  private static instance: AgentRouter;

  private constructor() {}

  static getInstance(): AgentRouter {
    if (!AgentRouter.instance) {
      AgentRouter.instance = new AgentRouter();
    }
    return AgentRouter.instance;
  }

  /**
   * Evaluates all enabled agents and returns the single best candidate for a task.
   * Leverages multi-tier capability matching, priority weightings, and current busy/idle state.
   */
  route(
    task: AgentTask,
    preferredModel?: string,
    minComplexity: number = 1
  ): BaseAgent {
    const candidates = agentRegistry.getEnabled();

    if (candidates.length === 0) {
      throw new Error("No enabled agents available in the system.");
    }

    const scoredCandidates = candidates.map((agent) => {
      let score = 0;

      // Tier 1: Capability overlap matching
      const taskKeywords = (task.title + " " + task.description).toLowerCase();
      
      const directCapabilityMatches = agent.metadata.capabilities.filter((cap) =>
        taskKeywords.includes(cap.toLowerCase())
      );
      score += directCapabilityMatches.length * 100;

      // Tier 2: Priority bonus
      score += agent.metadata.priority * 10;

      // Tier 3: Model compatibility
      if (preferredModel && agent.metadata.supportedModels.includes(preferredModel)) {
        score += 50;
      }

      // Tier 4: Health status penalty/bonus
      const status = agent.getStatus();
      if (status === AgentHealth.IDLE) {
        score += 40;
      } else if (status === AgentHealth.BUSY) {
        score -= 20; // Busy is okay, but idle is preferred
      } else if (status === AgentHealth.FAILED || status === AgentHealth.OFFLINE) {
        score -= 1000; // Unhealthy agents are penalized extremely heavily
      }

      // Tier 5: Role matching
      const roleKeywords = agent.metadata.role.toLowerCase().split(/\s+/);
      const hasRoleKeyword = roleKeywords.some((kw) => taskKeywords.includes(kw));
      if (hasRoleKeyword) {
        score += 80;
      }

      return { agent, score };
    });

    // Sort descending by score
    scoredCandidates.sort((a, b) => b.score - a.score);

    const topCandidate = scoredCandidates[0];

    // Fallback checking: even if scored low, we must return the top agent if it's healthy, 
    // otherwise warn if all healthy agents have extremely low score
    if (topCandidate.score < 0) {
      // Find any healthy fallback agent
      const healthyFallback = candidates.find((a) => a.getStatus() === AgentHealth.IDLE || a.getStatus() === AgentHealth.BUSY);
      if (healthyFallback) {
        return healthyFallback;
      }
    }

    return topCandidate.agent;
  }
}

export const agentRouter = AgentRouter.getInstance();
