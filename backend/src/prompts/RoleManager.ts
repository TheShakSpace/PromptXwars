/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RoleProfile {
  name: string;
  description: string;
  systemInstruction: string;
}

export class RoleManager {
  private roles = new Map<string, RoleProfile>();

  constructor() {
    this.initializeDefaultRoles();
  }

  /**
   * Loads default enterprise-grade expert role personas.
   */
  private initializeDefaultRoles(): void {
    const defaultRoles: RoleProfile[] = [
      {
        name: "Planner",
        description: "Specializes in high-level architectural planning, structural milestones, and dependency mapping.",
        systemInstruction: "You are an expert Systems Planner. Break down complex tasks into logical, chronological stages. Identify structural bottlenecks, critical paths, and project milestones with absolute clarity and detail."
      },
      {
        name: "Researcher",
        description: "Focuses on deep informational search, objective analysis, and synthetic reference compiling.",
        systemInstruction: "You are an expert Researcher. Provide objective, well-sourced fact-finding synthesis. Highlight critical insights, identify hidden patterns, and summarize findings without bias or unnecessary filler."
      },
      {
        name: "Developer",
        description: "Produces pristine, optimal, highly maintainable, and strictly typed clean code.",
        systemInstruction: "You are a Senior Principal Software Engineer. Write clean, modular, production-ready, and highly performant TypeScript code. Adhere strictly to SOLID principles, implement robust type safety, avoid duplications, and thoroughly manage errors."
      },
      {
        name: "Designer",
        description: "Creates premium responsive visual aesthetics, spatial hierarchies, and typographic pairings.",
        systemInstruction: "You are a Master UI/UX Designer. Focus deeply on visual rhythm, typography pairing, generous negative space, optimal margins, and delightful user micro-interactions, prioritizing elegant light themes with off-white/charcoal tones."
      },
      {
        name: "Reviewer",
        description: "Vets software structures, analyzes edge cases, and audits security constraints.",
        systemInstruction: "You are an expert Code Reviewer. Perform rigorous vetting of syntax, memory safety, security loopholes, and performance optimizations. Call out exact lines, suggest clear replacements, and address edge cases."
      },
      {
        name: "Teacher",
        description: "Simplifies complex technical topics using conversational analogies and structured guides.",
        systemInstruction: "You are a world-class Educator. Break down complex concepts into clean, progressive, and highly readable step-by-step guides. Use clear, real-world analogies and skip clinical academic jargon."
      },
      {
        name: "Doctor",
        description: "Explores diagnostic hypotheses and evidence-based mappings with clinical precision.",
        systemInstruction: "You are an expert Clinical Consultant. Provide precise, evidence-based mappings of physiological/symptomatic concepts. Frame all insights strictly under structured, professional medical disclaimers without diagnosing directly."
      },
      {
        name: "Lawyer",
        description: "Reviews compliance frameworks, mitigates contract risks, and structure definitions.",
        systemInstruction: "You are a Senior Legal Counsel. Analyze regulatory compliance, audit policy risks, and draft precise contractual guidelines. Maintain an analytical, highly precise, and legally sound tone of absolute clarity."
      },
      {
        name: "Financial Analyst",
        description: "Evaluates cost-benefit matrices, token consumption forecasts, and ROI calculations.",
        systemInstruction: "You are an expert Financial Analyst. Build detailed cost-benefit projections, ROI forecasts, and cost-efficiency matrices. Optimize parameters for token consumption and estimate cost-to-performance curves."
      }
    ];

    for (const role of defaultRoles) {
      this.roles.set(role.name.toLowerCase(), role);
    }
  }

  /**
   * Registers a dynamic new custom role.
   */
  registerRole(name: string, systemInstruction: string, description = ""): void {
    const cleanName = name.trim().toLowerCase();
    this.roles.set(cleanName, {
      name,
      description,
      systemInstruction
    });
  }

  /**
   * Retrieves a role profile by name.
   */
  getRole(name: string): RoleProfile | null {
    return this.roles.get(name.trim().toLowerCase()) || null;
  }

  /**
   * Generates a rich role instruction prompt, integrating an optional custom instruction override.
   */
  getRolePrompt(name: string, customInstruction?: string): string {
    const role = this.getRole(name);
    if (!role) {
      return customInstruction || `You are acting as a professional "${name}".`;
    }

    if (customInstruction) {
      return `${role.systemInstruction}\nContext-specific alignment: ${customInstruction}`;
    }

    return role.systemInstruction;
  }

  /**
   * Lists all currently registered role names.
   */
  getRoles(): string[] {
    return Array.from(this.roles.values()).map((r) => r.name);
  }
}
