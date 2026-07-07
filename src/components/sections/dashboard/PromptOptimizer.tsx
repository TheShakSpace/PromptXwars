/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, SlidersHorizontal, Shrink, Expand, Languages, Briefcase } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

interface PromptOptimizerProps {
  prompt: string;
  onOptimize: (optimizedPrompt: string) => void;
}

export function PromptOptimizer({ prompt, onOptimize }: PromptOptimizerProps) {
  const { addNotification } = useOS();

  const handleImprove = () => {
    if (!prompt.trim()) return;
    const improved = `Act as an elite expert in this domain. Systematically process the following request step-by-step, validating intermediate reasoning before returning final output:\n\nROLE CONTEXT:\n- Absolute precision, professional tone, and modular formatting (utilizing markdown grids and code fences).\n\nPRIMARY DIRECTIVE:\n${prompt}`;
    onOptimize(improved);
    addNotification("Prompt Upgraded", "Engine successfully structured instruction layers.", "success");
  };

  const handleExpand = () => {
    if (!prompt.trim()) return;
    const expanded = `${prompt}\n\nREASONING CONSTRAINTS:\n- Deconstruct problem space using first-principles.\n- Provide detailed edge-cases, scaling limits, and resource calculations.\n- Document testing assumptions explicitly and contrast alternative architectures before final deployment.`;
    onOptimize(expanded);
    addNotification("Prompt Expanded", "Supplemental analysis constraints appended successfully.", "info");
  };

  const handleShorten = () => {
    if (!prompt.trim()) return;
    // Simple mock shorten
    const shortened = `Focus solely on direct functional outcomes. Synthesize response without conversational preambles or greetings:\n\n${prompt.replace(/(Please|Could you|Can you|Write a detailed description of|I need you to|Act as an expert)/gi, "").trim()}`;
    onOptimize(shortened);
    addNotification("Prompt Shortened", "Removed boilerplate fillers.", "info");
  };

  const applyTone = (tone: string) => {
    if (!prompt.trim()) return;
    let toneInstruction = "";
    switch (tone) {
      case "Professional":
        toneInstruction = "RESPONSE PROFILE: Strictly analytical, polished corporate vernacular. Zero conversational fillers.";
        break;
      case "Creative":
        toneInstruction = "RESPONSE PROFILE: High ideation density, lateral thinking, rich analogies, and immersive descriptions.";
        break;
      case "Technical":
        toneInstruction = "RESPONSE PROFILE: Strictly structured system diagrams, code matrices, exact parameters, and API footprints.";
        break;
      case "Academic":
        toneInstruction = "RESPONSE PROFILE: Academic rigor, comprehensive literature context, clear citations, and double-blind structure syntax.";
        break;
      case "Business":
        toneInstruction = "RESPONSE PROFILE: ROI-driven metrics, executive-ready KPIs, GTM strategy matrices, and financial projections.";
        break;
      default:
        break;
    }

    const modified = `${toneInstruction}\n\nDIRECTIVE:\n${prompt}`;
    onOptimize(modified);
    addNotification("Tone Profile Linked", `Tone changed to ${tone.toUpperCase()}`, "success");
  };

  return (
    <div className="flex flex-col gap-4 select-none font-sans">
      <div className="flex items-center gap-2 mb-1 px-1">
        <SlidersHorizontal className="w-4 h-4 text-white/30" />
        <span className="font-mono text-[8.5px] text-white/30 tracking-widest uppercase font-bold">COGNITIVE COMPILER ACTIONS</span>
      </div>

      {/* Core optimization triggers */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleImprove}
          disabled={!prompt.trim()}
          className="p-3.5 rounded-xl border border-white/5 bg-gradient-to-r from-blue-950/20 to-[#1e1b4b]/15 hover:border-[#4F8CFF]/30 text-left transition-all group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex flex-col justify-between h-20"
        >
          <Sparkles className="w-4 h-4 text-[#4F8CFF] group-hover:scale-110 transition-transform" />
          <span className="text-[8.5px] font-mono font-bold text-white/70 group-hover:text-white uppercase tracking-wider mt-2 leading-none">
            AUTO-UPGRADE
          </span>
        </button>

        <button
          onClick={handleExpand}
          disabled={!prompt.trim()}
          className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 text-left transition-all group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex flex-col justify-between h-20"
        >
          <Expand className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-[8.5px] font-mono font-bold text-white/70 group-hover:text-white uppercase tracking-wider mt-2 leading-none">
            EXPAND SCOPE
          </span>
        </button>

        <button
          onClick={handleShorten}
          disabled={!prompt.trim()}
          className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 text-left transition-all group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex flex-col justify-between h-20"
        >
          <Shrink className="w-4 h-4 text-[#EC4899] group-hover:scale-110 transition-transform" />
          <span className="text-[8.5px] font-mono font-bold text-white/70 group-hover:text-white uppercase tracking-wider mt-2 leading-none">
            CONDENSE
          </span>
        </button>
      </div>

      {/* Style Tones Selector Grid */}
      <div className="flex flex-col gap-2.5 bg-black/30 border border-white/5 rounded-2xl p-4">
        <span className="font-mono text-[7.5px] text-white/20 uppercase tracking-widest font-bold">REASONING TONE MAPPING</span>
        
        <div className="grid grid-cols-2 gap-2">
          {["Professional", "Creative", "Technical", "Academic", "Business"].map((tone) => {
            return (
              <button
                key={tone}
                onClick={() => applyTone(tone)}
                disabled={!prompt.trim()}
                className="py-2.5 px-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-left text-[10px] font-mono font-semibold text-white/50 hover:text-white transition-all disabled:opacity-30 cursor-pointer flex items-center justify-between"
              >
                <span>{tone.toUpperCase()}</span>
                <span className="w-1 h-1 rounded-full bg-[#4F8CFF]/50" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
