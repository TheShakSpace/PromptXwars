/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Loader2, Sparkles, HelpCircle } from "lucide-react";

interface ReasoningTimelineProps {
  activeStep: number; // 0 to 7
  isRunning: boolean;
}

export interface StepInfo {
  title: string;
  desc: string;
  statCode: string;
}

export const REASONING_STEPS: StepInfo[] = [
  { title: "Understanding Context", desc: "Deconstructing prompt syntax, mapping variables & resolving system rules.", statCode: "0xCNX_INIT" },
  { title: "Searching Memory", desc: "Querying vector embeddings & querying long-term user context index.", statCode: "0xMEM_VEC" },
  { title: "Selecting Tools", desc: "Determining tool utility vectors & resolving custom schema declarations.", statCode: "0xTOOL_RTR" },
  { title: "Evaluating Options", desc: "Running local validation simulations & estimating latency bounds.", statCode: "0xSIM_EVAL" },
  { title: "Planning Response", desc: "Composing task tree paths & scheduling parallel agent executors.", statCode: "0xPLAN_SCH" },
  { title: "Generating Output", desc: "Synthesizing output token streams using Gemini core models.", statCode: "0xGEN_TOK" },
  { title: "Reviewing Code/Safety", desc: "Running guardrails compliance filters & ensuring schema conformity.", statCode: "0xSAFE_GND" },
  { title: "Completed Output", desc: "Dispatching final telemetry packets & compiling visual dashboard states.", statCode: "0xEXEC_END" },
];

export function ReasoningTimeline({ activeStep, isRunning }: ReasoningTimelineProps) {
  return (
    <div className="flex flex-col gap-4 select-none pr-1">
      <div className="border-b border-white/5 pb-2">
        <h3 className="font-mono text-[9px] text-[#F59E0B] tracking-widest uppercase font-black flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          COGNITIVE REASONING STAGES
        </h3>
        <p className="text-[10px] text-white/40 mt-0.5">Step-by-step cognitive deconstruction</p>
      </div>

      <div className="relative flex flex-col gap-4 pl-6 border-l border-white/5 mt-1 ml-2">
        {REASONING_STEPS.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep && isRunning;
          const isPending = idx > activeStep || (!isRunning && idx === activeStep);

          let circleColor = "border-white/10 text-white/20";
          let textColor = "text-white/30";
          let descColor = "text-white/20";
          let glowClass = "";

          if (isCompleted) {
            circleColor = "border-[#10B981] bg-[#10B981]/15 text-[#10B981]";
            textColor = "text-white/80 font-bold";
            descColor = "text-white/50";
          } else if (isActive) {
            circleColor = "border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]";
            textColor = "text-white font-black";
            descColor = "text-white/70";
            glowClass = "shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse";
          }

          return (
            <div key={idx} className="relative flex flex-col gap-1 select-none">
              {/* Timeline Indicator Node */}
              <div
                className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full border bg-black flex items-center justify-center transition-all duration-300 ${circleColor} ${glowClass}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isActive ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span className="font-mono text-[8px] font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex items-start justify-between">
                <span className={`text-[10.5px] transition-colors duration-300 ${textColor}`}>
                  {step.title}
                </span>
                <span className="font-mono text-[7px] text-white/20">
                  {step.statCode}
                </span>
              </div>

              <p className={`text-[8.5px] leading-relaxed transition-colors duration-300 ${descColor}`}>
                {step.desc}
              </p>

              {isActive && (
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent w-1/3"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
