/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { workflowData } from "../../../data/workflowData";
import { motion } from "motion/react";
import { Check, Loader2, Play } from "lucide-react";
import { cn } from "../../../utils/cn";

export function WorkflowTimeline() {
  return (
    <div id="system-workflow-timeline" className="relative flex flex-col gap-6 p-4 font-sans">
      {/* Background Vertical Linking Wire */}
      <div className="absolute left-7 top-10 bottom-10 w-[1px] bg-white/10" />

      {workflowData.map((step, idx) => {
        const isCompleted = step.status === "completed";
        const isRunning = step.status === "running";

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-start gap-4 relative group"
          >
            {/* Status node */}
            <div className="relative shrink-0 z-10">
              {isCompleted ? (
                <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-400 flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.4)]">
                  <Check className="w-3.5 h-3.5 text-green-400" />
                </div>
              ) : isRunning ? (
                <div className="w-7 h-7 rounded-full bg-[#4F8CFF]/20 border border-[#4F8CFF] flex items-center justify-center shadow-[0_0_15px_rgba(79,140,255,0.5)] animate-[pulse_1.5s_ease-in-out_infinite]">
                  <Loader2 className="w-3.5 h-3.5 text-[#4F8CFF] animate-spin" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-white/30" />
                </div>
              )}
            </div>

            {/* Step text content details */}
            <div className="flex-1 bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] p-4 rounded-lg transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                  STEP 0{step.stepNumber} // PROCESSOR
                </span>
                <span className="font-mono text-[9px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                  {step.duration}
                </span>
              </div>
              <h4 className={cn(
                "font-sans font-medium text-xs tracking-wide",
                isCompleted ? "text-white/90" : isRunning ? "text-[#4F8CFF]" : "text-white/40"
              )}>
                {step.title}
              </h4>
              <p className="font-sans text-[10px] text-white/40 mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
