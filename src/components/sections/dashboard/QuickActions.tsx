/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Sliders, RefreshCw, Cpu, Shield, Sparkles, AlertCircle } from "lucide-react";

export function QuickActions() {
  const { addNotification } = useOS();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const actions = [
    { id: "opt-mem", label: "SWEEP VRAM CACHE", icon: Cpu, color: "#4F8CFF", desc: "Reclaim unused memory allocations." },
    { id: "sec-audit", label: "RUN CRYPTO AUDIT", icon: Shield, color: "#10B981", desc: "Check ECDSA handshake keys." },
    { id: "sync-db", label: "SYNC FIRESTORE", icon: RefreshCw, color: "#F59E0B", desc: "Synchronize local index rules." },
    { id: "ai-diagnostics", label: "COGNITIVE PROBE", icon: Sparkles, color: "#EC4899", desc: "Test active LLM latency spikes." }
  ];

  const handleTriggerAction = (id: string, label: string) => {
    if (activeActionId) return; // Prevent concurrent actions
    
    setActiveActionId(id);
    setProgress(0);
    addNotification("Operator Task Started", `Initiated task: ${label}...`, "info");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setActiveActionId(null);
            setProgress(0);
            addNotification("Operator Task Complete", `Execution complete: ${label} [0.04ms OK]`, "success");
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-colors h-full flex flex-col justify-between">
      <div>
        {/* Header Title */}
        <div className="flex items-center gap-2 mb-6 select-none">
          <Sliders className="w-4 h-4 text-[#4F8CFF]" />
          <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">QUICK LAUNCH OPERATIONS</span>
        </div>

        {/* List of interactive quick operations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((act) => {
            const Icon = act.icon;
            const isProcessingThis = activeActionId === act.id;

            return (
              <button
                key={act.id}
                onClick={() => handleTriggerAction(act.id, act.label)}
                disabled={activeActionId !== null}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between relative overflow-hidden transition-all group/item ${
                  isProcessingThis
                    ? "bg-white/5 border-white/20"
                    : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02] cursor-pointer"
                }`}
              >
                {/* Micro-glow top corner effect */}
                <div
                  className="absolute -top-6 -right-6 w-12 h-12 rounded-full blur-[20px] opacity-15 group-hover/item:opacity-30 transition-opacity"
                  style={{ background: act.color }}
                />

                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center border"
                    style={{
                      borderColor: `${act.color}20`,
                      background: `${act.color}05`,
                    }}
                  >
                    <Icon
                      className={`w-4 h-4 ${isProcessingThis ? "animate-spin" : ""}`}
                      style={{ color: act.color }}
                    />
                  </div>
                  <span className="font-mono text-[8px] text-white/25">CMD</span>
                </div>

                <div>
                  <h4 className="font-mono text-[9.5px] font-bold text-white tracking-wider uppercase mb-1">
                    {act.label}
                  </h4>
                  <p className="font-sans text-[10px] text-white/40 leading-normal leading-relaxed">
                    {act.desc}
                  </p>
                </div>

                {/* Progress bar overlay during action processing */}
                {isProcessingThis && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System notice */}
      <div className="mt-6 flex items-center gap-2 text-white/40 font-mono text-[8px] leading-relaxed border-t border-white/5 pt-4 select-none">
        <AlertCircle className="w-3.5 h-3.5 text-[#4F8CFF] shrink-0" />
        <span>DIAGNOSTIC TELEMETRY BUFFERS WILL CYCLE AUTOMATICALLY IN 15 MINUTES</span>
      </div>
    </div>
  );
}
