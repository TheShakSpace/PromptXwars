/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Play, Square, SkipForward, RotateCcw, Trash2, Sliders, Zap } from "lucide-react";

interface WorkflowControlsProps {
  onRun: () => void;
  onStop: () => void;
  onStep: () => void;
  onClear: () => void;
  isRunning: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onLoadTemplate: (name: "research" | "rag" | "coder" | "simple") => void;
}

export function WorkflowControls({
  onRun,
  onStop,
  onStep,
  onClear,
  isRunning,
  speed,
  onSpeedChange,
  onLoadTemplate,
}: WorkflowControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 select-none backdrop-blur-xl">
      {/* Templates Selector */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[8px] text-white/30 uppercase font-black tracking-wider">
          Flow Preset:
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onLoadTemplate("research")}
            disabled={isRunning}
            className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-[#A855F7]/30 text-[9px] font-bold text-white/70 hover:text-white hover:bg-[#A855F7]/10 disabled:opacity-40 transition-all cursor-pointer"
          >
            Agent Swarm Research
          </button>
          <button
            onClick={() => onLoadTemplate("rag")}
            disabled={isRunning}
            className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-[#10B981]/30 text-[9px] font-bold text-white/70 hover:text-white hover:bg-[#10B981]/10 disabled:opacity-40 transition-all cursor-pointer"
          >
            RAG Vector Query
          </button>
          <button
            onClick={() => onLoadTemplate("coder")}
            disabled={isRunning}
            className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-[#3B82F6]/30 text-[9px] font-bold text-white/70 hover:text-white hover:bg-[#3B82F6]/10 disabled:opacity-40 transition-all cursor-pointer"
          >
            Multi-Modal Vision & OCR
          </button>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        {/* Speed slider */}
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/5 font-mono text-[8px] text-white/40">
          <Sliders className="w-3 h-3 text-white/50" />
          <span>SPEED:</span>
          <div className="flex gap-1.5 font-bold">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-1 rounded cursor-pointer ${
                  speed === s ? "text-[#10B981] bg-[#10B981]/15" : "text-white/60 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClear}
            disabled={isRunning}
            title="Clear all nodes"
            className="p-1.5 rounded bg-red-950/20 border border-red-900/20 hover:border-red-700/40 text-red-400 hover:bg-red-950/40 disabled:opacity-30 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onStep}
            disabled={isRunning}
            title="Single execution step"
            className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer flex items-center gap-1 font-mono text-[9px] font-bold"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>STEP</span>
          </button>

          {isRunning ? (
            <button
              onClick={onStop}
              className="px-3.5 py-1.5 rounded bg-red-900/20 border border-red-500/40 text-red-200 font-mono text-[9.5px] font-black hover:bg-red-900/40 hover:border-red-500/60 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <Square className="w-3.5 h-3.5 fill-red-400/80 stroke-none" />
              <span>TERMINATE</span>
            </button>
          ) : (
            <button
              onClick={onRun}
              className="px-4 py-1.5 rounded bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] font-mono text-[9.5px] font-black hover:bg-[#10B981]/25 hover:border-[#10B981] active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse"
            >
              <Play className="w-3.5 h-3.5 fill-[#10B981] stroke-none" />
              <span>LAUNCH PIPELINE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
