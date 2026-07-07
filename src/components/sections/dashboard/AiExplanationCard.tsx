/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Brain, ShieldAlert, Cpu, CheckCircle } from "lucide-react";

export interface AiExplanationConfig {
  problem: string;
  context: string;
  reasoning: string[];
  toolsUsed: string[];
  confidence: number; // 0 to 100
  limitations: string;
  nextSteps: string[];
}

interface AiExplanationCardProps {
  config?: AiExplanationConfig;
}

export function AiExplanationCard({ config }: AiExplanationCardProps) {
  const defaultExplanation: AiExplanationConfig = {
    problem: "Optimizing multi-agent data ingestion latency bounds across secure nodes.",
    context: "Input context block dispatching high-priority healthcare metrics.",
    reasoning: [
      "Parsed system input tags for patient identity variables.",
      "Synchronized data metrics with active compliance schemas.",
      "Compiled prompt template role instructions prior to model dispatch."
    ],
    toolsUsed: ["Vision OCR Parser", "PII Guardrail Filter", "Semantic Vector Cache"],
    confidence: 98.4,
    limitations: "Real-time verification depends on localized API availability and server speeds.",
    nextSteps: [
      "Review output formatting validation schema.",
      "Initiate secondary automated validation checks."
    ]
  };

  const activeConfig = config || defaultExplanation;

  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4.5 flex flex-col gap-3.5 text-left font-sans">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#4F8CFF] animate-pulse" />
          <span className="font-mono text-[8.5px] text-white/40 tracking-widest uppercase font-bold">
            COGNITIVE AI EXPLANATION
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[8.5px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
          CONFIDENCE: {activeConfig.confidence}%
        </div>
      </div>

      <div className="flex flex-col gap-2.5 text-xs text-white/70 leading-relaxed font-light">
        <div>
          <span className="block font-mono text-[8px] text-[#4F8CFF] uppercase font-bold tracking-wider">01. Problem Identifier</span>
          <p className="mt-0.5 text-white/90">{activeConfig.problem}</p>
        </div>

        <div>
          <span className="block font-mono text-[8px] text-[#4F8CFF] uppercase font-bold tracking-wider">02. Semantic Context</span>
          <p className="mt-0.5 text-white/50">{activeConfig.context}</p>
        </div>

        <div>
          <span className="block font-mono text-[8px] text-[#4F8CFF] uppercase font-bold tracking-wider">03. Operational Reasoning Steps</span>
          <div className="flex flex-col gap-1.5 mt-1">
            {activeConfig.reasoning.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-mono text-[9px] text-[#4F8CFF] font-bold">↳</span>
                <p className="text-[11px] text-white/70">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools and details */}
        <div className="grid grid-cols-2 gap-3 mt-1 pt-2 border-t border-white/5 font-mono text-[9px]">
          <div className="flex flex-col gap-1">
            <span className="text-white/30 uppercase font-bold">Tools Engaged</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {activeConfig.toolsUsed.map((tool, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-white/60">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-white/30 uppercase font-bold">Operational Bounds</span>
            <p className="text-[8.5px] text-white/45 mt-0.5 leading-normal">{activeConfig.limitations}</p>
          </div>
        </div>

        {/* Next actions */}
        <div className="mt-1 pt-2 border-t border-white/5 font-mono text-[9px]">
          <span className="text-white/30 uppercase font-bold block mb-1">Recommended Next Steps</span>
          <div className="flex flex-col gap-1">
            {activeConfig.nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3 h-3 shrink-0" />
                <span className="text-white/70 font-sans text-[10px]">{step}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
