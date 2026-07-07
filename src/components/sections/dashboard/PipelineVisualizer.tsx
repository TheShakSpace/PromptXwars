/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { User, Layers, Search, Brain, FileText, CheckCircle, Share2, ArrowRight } from "lucide-react";

interface PipelineVisualizerProps {
  currentStage: "idle" | "planning" | "running" | "validating" | "completed" | "failed";
  progressPercentage?: number;
}

export function PipelineVisualizer({ currentStage, progressPercentage = 0 }: PipelineVisualizerProps) {
  const stages = [
    { id: "user", label: "User Input", icon: User, color: "#10B981" },
    { id: "planner", label: "Planner", icon: Layers, color: "#3B82F6" },
    { id: "research", label: "Research", icon: Search, color: "#F59E0B" },
    { id: "reasoning", label: "Reasoning", icon: Brain, color: "#A855F7" },
    { id: "generation", label: "Generation", icon: FileText, color: "#F43F5E" },
    { id: "validation", label: "Validation", icon: CheckCircle, color: "#14B8A6" },
    { id: "export", label: "Export Output", icon: Share2, color: "#EC4899" },
  ];

  const getStageIndex = (stage: typeof currentStage): number => {
    switch (stage) {
      case "idle": return -1;
      case "planning": return 1;
      case "running": return 3; // reasoning/research
      case "validating": return 5; // validation
      case "completed": return 6; // export
      case "failed": return -1;
      default: return 0;
    }
  };

  const activeIndex = getStageIndex(currentStage);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden flex flex-col gap-4 text-left font-sans">
      <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-32 h-32 rounded-full bg-cyan-500/5 blur-[45px] pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#14B8A6] animate-pulse" />
          <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
            COGNITIVE PIPELINE FLOW VISUALIZATION
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
          PROGRESS: {progressPercentage}%
        </span>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 relative">
        
        {/* Connection guide line */}
        <div className="absolute left-6 right-6 top-[28px] hidden md:block h-0.5 bg-white/5 z-0">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-teal-400"
          />
        </div>

        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < activeIndex || (currentStage === "completed" && idx <= activeIndex);
          const isActive = idx === activeIndex;

          return (
            <div key={stage.id} className="flex flex-col items-center gap-1.5 z-10 relative">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  boxShadow: isActive
                    ? `0 0 20px ${stage.color}40`
                    : "none",
                }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-white/5 border-white/20 text-white"
                    : isActive
                    ? "bg-neutral-900 border-white/40 text-white"
                    : "bg-[#0c0c0c]/90 border-white/5 text-white/20"
                }`}
                style={{
                  borderColor: isActive ? stage.color : isCompleted ? `${stage.color}60` : undefined,
                }}
              >
                <Icon
                  className="w-4.5 h-4.5"
                  style={{
                    color: isCompleted || isActive ? stage.color : "rgba(255,255,255,0.15)",
                  }}
                />

                {/* Pulsing ring around active node */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full border border-white/20 animate-ping pointer-events-none" />
                )}
              </motion.div>

              <span
                className={`text-[9px] font-bold font-mono tracking-tight select-none transition-colors ${
                  isActive ? "text-white" : isCompleted ? "text-white/60" : "text-white/25"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
