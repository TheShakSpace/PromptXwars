/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDemoStore } from "../../../store/demoStore";
import { X, Cpu, Layers, Terminal, Database, Shield, Zap, RefreshCw } from "lucide-react";
import { platformConfig } from "../../../config/platformConfig";

export function JudgeModePanel() {
  const { isJudgeModeOpen, setJudgeModeOpen } = useDemoStore();

  if (!isJudgeModeOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[115] bg-black/85 backdrop-blur-md flex items-center justify-center p-6 select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="bg-neutral-950 border border-white/10 rounded-3xl p-6 max-w-4xl w-full shadow-[0_24px_60px_rgba(0,0,0,0.95)] relative overflow-hidden flex flex-col gap-5 my-8"
        >
          {/* Subtle scanner laser lines */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 font-mono text-sm">
                🏆
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-black text-white text-sm tracking-tight uppercase">
                  HELIOS JUDGE SUITE
                </span>
                <span className="font-mono text-[8px] text-white/35 tracking-wider">
                  RAPID DIAGNOSTIC AND ARCHITECTURE VERIFIER
                </span>
              </div>
            </div>
            <button
              onClick={() => setJudgeModeOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-Header Presentation Statement */}
          <div className="bg-emerald-950/15 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3 text-left">
            <Zap className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex flex-col font-sans">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                JUDGES DIRECTIVE
              </span>
              <p className="text-[11px] text-white/70 leading-relaxed mt-1">
                Helios is designed as a **Universal AI Shell**. By separating prompts, models, and workflows from visual layers, this exact system can adapt to *any* future hackathon problem statement without altering structural components.
              </p>
            </div>
          </div>

          {/* Tech Spec Grid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            {/* Cell 1: Architecture Core */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="font-sans font-bold text-xs text-white uppercase tracking-tight">System Architecture</h3>
              </div>
              <div className="flex flex-col gap-2 font-mono text-[10px] text-white/50">
                <div className="flex justify-between">
                  <span>FRAMEWORK:</span>
                  <span className="text-white font-bold">React 19 + Vite 6</span>
                </div>
                <div className="flex justify-between">
                  <span>STATE MANAGEMENT:</span>
                  <span className="text-white font-bold">Zustand Stores</span>
                </div>
                <div className="flex justify-between">
                  <span>STYLING:</span>
                  <span className="text-white font-bold">Tailwind CSS v4</span>
                </div>
                <div className="flex justify-between">
                  <span>ROUTING:</span>
                  <span className="text-white font-bold">Framer Motion Deck</span>
                </div>
              </div>
            </div>

            {/* Cell 2: Prompt and Workflow Engine */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Terminal className="w-4 h-4 text-[#4F8CFF]" />
                <h3 className="font-sans font-bold text-xs text-white uppercase tracking-tight">Prompt & Pipelines</h3>
              </div>
              <div className="flex flex-col gap-2 font-mono text-[10px] text-white/50">
                <div className="flex justify-between">
                  <span>COMPILATION ENGINE:</span>
                  <span className="text-white font-bold">Unified Variable Model</span>
                </div>
                <div className="flex justify-between">
                  <span>WORKFLOW SCHEMA:</span>
                  <span className="text-[#4F8CFF] font-bold">Declarative JSON</span>
                </div>
                <div className="flex justify-between">
                  <span>ISOLATED PROMPTS:</span>
                  <span className="text-white font-bold">Role Registry Map</span>
                </div>
                <div className="flex justify-between">
                  <span>TEMPLATES INTEGRATION:</span>
                  <span className="text-white font-bold">Output-Enforced YAML</span>
                </div>
              </div>
            </div>

            {/* Cell 3: Scalability and Resiliences */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Shield className="w-4 h-4 text-[#A855F7]" />
                <h3 className="font-sans font-bold text-xs text-white uppercase tracking-tight">Production Resilience</h3>
              </div>
              <div className="flex flex-col gap-2 font-mono text-[10px] text-white/50">
                <div className="flex justify-between">
                  <span>GL CONTAINER TIMEOUT:</span>
                  <span className="text-white font-bold">Defensive 4000ms</span>
                </div>
                <div className="flex justify-between">
                  <span>REDUNDANT PIPELINE:</span>
                  <span className="text-white font-bold">Orbital Particle Canvas</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCKET SIGNALS:</span>
                  <span className="text-green-400 font-bold">Live offline listeners</span>
                </div>
                <div className="flex justify-between">
                  <span>ERROR BOUNDARY:</span>
                  <span className="text-white font-bold">Stripe-style Diagnostic</span>
                </div>
              </div>
            </div>

          </div>

          {/* Model Registry Database View */}
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl text-left">
            <h4 className="font-mono text-[9px] text-white/40 uppercase tracking-widest font-bold mb-3">
              Configured AI Model Registry
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono text-[10px]">
              {platformConfig.models.map((mod) => (
                <div
                  key={mod.id}
                  className={`p-3 rounded-xl border flex flex-col gap-1 ${
                    mod.isEnabled ? "bg-blue-950/15 border-blue-500/20 text-white" : "bg-neutral-950 border-white/5 text-white/30"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white/90">{mod.name}</span>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        mod.isEnabled ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/35"
                      }`}
                    >
                      {mod.isEnabled ? "ACTIVE" : "FLAGGED OFF"}
                    </span>
                  </div>
                  <span className="text-[8.5px] text-white/40 mt-1">Provider: {mod.provider}</span>
                  <span className="text-[8.5px] text-white/40">Latency Profile: {mod.latencyRating.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Callout row */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2 font-mono text-[9px] text-white/30">
            <span>PLATFORM BUILD COMPILING OK (v2.5.4-PRO)</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">STABLE COGNITIVE SYSTEM</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
