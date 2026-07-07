/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, Loader, Play, ShieldAlert, Sparkles } from "lucide-react";

export interface TimelineStep {
  id: string;
  label: string;
  status: "idle" | "running" | "done" | "error";
  description: string;
  duration?: string;
}

interface ReasoningTimelineProps {
  steps: TimelineStep[];
}

export function ReasoningTimeline({ steps }: ReasoningTimelineProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case "done":
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-emerald-400" />
          </div>
        );
      case "running":
        return (
          <div className="w-5 h-5 rounded-full bg-[#4F8CFF]/15 border border-[#4F8CFF]/40 flex items-center justify-center shrink-0">
            <Loader className="w-3 h-3 text-[#4F8CFF] animate-spin" />
          </div>
        );
      case "error":
        return (
          <div className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3 h-3 text-red-400" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3 select-none font-sans">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles className="w-4 h-4 text-white/30" />
        <span className="font-mono text-[8.5px] text-white/30 tracking-widest uppercase font-bold">REASONING PIPELINE SEQUENCE</span>
      </div>

      <div className="flex flex-col gap-2">
        {steps.map((step, idx) => {
          const isActive = step.status === "running";
          const isDone = step.status === "done";

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                isActive
                  ? "bg-white/5 border-[#4F8CFF]/30 shadow-md scale-101"
                  : isDone
                  ? "bg-transparent border-white/5 opacity-80"
                  : "bg-transparent border-transparent opacity-40"
              }`}
            >
              {getStepIcon(step.status)}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span
                    className={`text-[10.5px] font-bold leading-tight ${
                      isActive ? "text-[#4F8CFF]" : isDone ? "text-white/80" : "text-white/40"
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.duration && (
                    <span className="font-mono text-[7px] text-white/30 uppercase shrink-0">
                      {step.duration}
                    </span>
                  )}
                </div>
                <p className="text-[9.5px] text-white/40 mt-1 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
