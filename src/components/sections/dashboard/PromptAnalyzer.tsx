/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Activity, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

interface PromptAnalyzerProps {
  prompt: string;
}

export function PromptAnalyzer({ prompt }: PromptAnalyzerProps) {
  // Simple heuristic analyzers to calculate dynamic prompt quality scores based on string composition
  const length = prompt.trim().length;
  const wordCount = length > 0 ? prompt.split(/\s+/).length : 0;
  const hasVariables = prompt.includes("{{") && prompt.includes("}}");
  const hasFormatGuidelines = /JSON|markdown|format|list|bullet|table|xml/i.test(prompt);
  const hasRoleDefinition = /you are|act as|role|expert|system/i.test(prompt);

  // Math formulas for scores
  const clarity = Math.min(Math.max(wordCount > 5 ? 65 : 20 + wordCount * 5, 0), 95) + (hasRoleDefinition ? 5 : 0);
  const specificity = Math.min(Math.max(length > 50 ? 55 + Math.floor(length / 20) : wordCount * 4, 15), 98);
  const context = Math.min((hasVariables ? 40 : 10) + (length > 100 ? 50 : Math.floor(length / 2)), 99);
  const completeness = Math.min(
    (hasRoleDefinition ? 30 : 10) + (hasFormatGuidelines ? 35 : 10) + (length > 80 ? 34 : 10),
    98
  );

  const overallScore = Math.round((clarity + specificity + context + completeness) / 4);

  // SVG circular rendering parameters
  const strokeDash = (pct: number) => {
    const radius = 24;
    const circ = 2 * Math.PI * radius;
    return {
      strokeDasharray: `${circ}`,
      strokeDashoffset: `${circ - (pct / 100) * circ}`,
    };
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return "#10B981"; // emerald
    if (score > 50) return "#4F8CFF"; // blue
    return "#F59E0B"; // amber
  };

  return (
    <div className="flex flex-col gap-5 select-none font-sans h-full justify-between">
      {/* Top score visualizer ring */}
      <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
        {/* SVG Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="24" className="stroke-white/5 fill-none" strokeWidth="4" />
            <circle
              cx="32"
              cy="32"
              r="24"
              className="fill-none transition-all duration-500 ease-out"
              strokeWidth="4"
              strokeLinecap="round"
              style={strokeDash(overallScore)}
              stroke={getScoreColor(overallScore)}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-sm font-black font-mono text-white leading-none">{overallScore}%</span>
            <span className="text-[6.5px] font-mono text-white/35 uppercase tracking-widest mt-0.5">SCORE</span>
          </div>
        </div>

        {/* Diagnostic rating text */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5" style={{ color: getScoreColor(overallScore) }} />
            <span className="text-[10px] font-mono font-bold tracking-wider text-white/90 uppercase">
              {overallScore > 80 ? "COGNITIVE GOLD STANDARD" : overallScore > 50 ? "STRONG PARAMETRIC SPECS" : "DRAFT DIRECTIVE"}
            </span>
          </div>
          <p className="text-[9.5px] text-white/45 leading-relaxed font-light">
            {overallScore > 80
              ? "This directive incorporates roles, variables, and output schemas perfectly. Exceptional response alignment expected."
              : overallScore > 50
              ? "Adding structured context or specifying formatting rules will optimize the reasoning accuracy."
              : "Expand with role modeling or specify target outputs to improve context-mapping scores."}
          </p>
        </div>
      </div>

      {/* Grid of sub-metric scores */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Metric 1 */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none">CLARITY</span>
            <span className="text-xs font-bold font-mono text-white/90 mt-1">{clarity}%</span>
          </div>
          <div className="w-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${clarity}%` }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none">SPECIFICITY</span>
            <span className="text-xs font-bold font-mono text-white/90 mt-1">{specificity}%</span>
          </div>
          <div className="w-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#4F8CFF]" style={{ width: `${specificity}%` }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none">CONTEXT SCALE</span>
            <span className="text-xs font-bold font-mono text-white/90 mt-1">{context}%</span>
          </div>
          <div className="w-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-violet-400" style={{ width: `${context}%` }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest leading-none">COMPLETENESS</span>
            <span className="text-xs font-bold font-mono text-white/90 mt-1">{completeness}%</span>
          </div>
          <div className="w-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400" style={{ width: `${completeness}%` }} />
          </div>
        </div>
      </div>

      {/* Dynamic Suggestions List */}
      <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-2 text-[10px] font-mono">
        <span className="text-white/30 uppercase font-bold text-[8px] tracking-wider">COMPILER SUGGESTIONS</span>
        
        <div className="flex flex-col gap-1.5 text-white/60">
          {!hasRoleDefinition && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>No expert persona mapped. Prefix with "You are a senior UX designer..."</span>
            </div>
          )}
          {!hasVariables && (
            <div className="flex items-center gap-1.5 text-[#4F8CFF]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Incorporate dynamic braces like &#123;&#123;input&#125;&#125; to test varying criteria.</span>
            </div>
          )}
          {!hasFormatGuidelines && (
            <div className="flex items-center gap-1.5 text-white/40">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-white/20" />
              <span>Include "Response Format: JSON" to solidify schema binding.</span>
            </div>
          )}
          {hasRoleDefinition && hasVariables && hasFormatGuidelines && (
            <div className="flex items-center gap-1.5 text-green-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Aesthetic configuration matches strict enterprise requirements perfectly!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
