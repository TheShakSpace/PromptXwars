/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Code, FileText, Zap, Compass, Languages, HelpCircle, 
  Lightbulb, ShieldCheck 
} from "lucide-react";

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

export function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  const templates = [
    {
      id: "explain",
      label: "EXPLAIN ALGORITHM",
      icon: HelpCircle,
      prompt: "Deconstruct and explain the following algorithm simply, outlining its Big-O performance parameters:\n\n",
      color: "#3B82F6",
    },
    {
      id: "summarize",
      label: "SUMMARIZE FILE",
      icon: FileText,
      prompt: "Synthesize a high-level executive summary of this code file, listing exports, functions, and key design constraints:\n\n",
      color: "#10B981",
    },
    {
      id: "debug",
      label: "DEBUG MEMORY",
      icon: ShieldCheck,
      prompt: "Audit this function block for potential JS memory leaks, infinite useEffect renders, or performance bottlenecks:\n\n",
      color: "#EF4444",
    },
    {
      id: "generate",
      label: "GENERATE CORE",
      icon: Code,
      prompt: "Write a high-performance, modular React hook in TypeScript that handles:\n\n",
      color: "#EC4899",
    },
    {
      id: "improve",
      label: "IMPROVE UX",
      icon: Zap,
      prompt: "Suggest 5 elegant micro-animations and spatial layout improvements for this UI layout block:\n\n",
      color: "#F59E0B",
    },
    {
      id: "brainstorm",
      label: "BRAINSTORM ARCH",
      icon: Lightbulb,
      prompt: "Propose a robust database schema and system architecture design for a distributed real-time collaborative tool: ",
      color: "#A855F7",
    }
  ];

  return (
    <div className="flex flex-col gap-2.5 select-none font-mono">
      <div className="flex items-center gap-2 mb-1.5 px-1">
        <span className="w-1.5 h-1.5 bg-[#4F8CFF] rounded-full animate-pulse" />
        <span className="text-[8.5px] text-white/30 tracking-widest uppercase font-bold">PROMPT COGNITIVE TEMPLATES</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <button
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.prompt)}
              className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 text-left transition-all group cursor-pointer flex flex-col justify-between h-20"
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center border self-start mb-2"
                style={{
                  borderColor: `${tpl.color}20`,
                  background: `${tpl.color}05`,
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: tpl.color }} />
              </div>
              
              <span className="text-[8.5px] font-bold text-white/60 group-hover:text-white uppercase tracking-wider leading-none truncate w-full">
                {tpl.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
