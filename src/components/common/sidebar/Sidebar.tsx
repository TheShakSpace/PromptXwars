/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useOS } from "../../../contexts/OSContext";
import { promptPresets } from "../../../data/promptPresets";
import { Sparkles, Bell, LayoutDashboard, Brain, History, Settings, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../utils/cn";

export function Sidebar() {
  const {
    activePreset,
    setActivePreset,
    notifications,
    dismissNotification,
    activeModel,
    mode,
  } = useOS();

  return (
    <motion.aside
      id="system-sidebar"
      className="fixed left-6 top-24 bottom-6 z-20 w-80 hidden lg:flex flex-col gap-4"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.3 }}
    >
      {/* 1. Synaptic Context Controller */}
      <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 shadow-xl border-white/10 flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] tracking-widest uppercase border-b border-white/5 pb-2">
          <Brain className="w-4 h-4 text-[#4F8CFF]" />
          <span>SYNAPTIC PRESETS</span>
        </div>

        {/* AI Presets List */}
        <div className="flex flex-col gap-2.5">
          {promptPresets.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setActivePreset(preset)}
                className={cn(
                  "relative w-full text-left p-3.5 rounded-lg border flex flex-col gap-1 transition-all group cursor-pointer",
                  isSelected
                    ? "bg-white/5 border-[#4F8CFF]/50 shadow-[0_4px_20px_rgba(79,140,255,0.1)]"
                    : "bg-transparent border-white/5 hover:border-white/15 hover:bg-white/[0.02]"
                )}
              >
                {isSelected && (
                  <div className="absolute right-3.5 top-3.5 w-4 h-4 rounded-full bg-[#4F8CFF]/20 flex items-center justify-center border border-[#4F8CFF]/40">
                    <Check className="w-2.5 h-2.5 text-[#4F8CFF]" />
                  </div>
                )}
                <div className="font-sans font-medium text-xs text-white/90 group-hover:text-white transition-colors">
                  {preset.name}
                </div>
                <div className="font-sans text-[10px] text-white/50 leading-relaxed pr-6">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* System Active Status Parameters */}
        <div className="mt-auto flex flex-col gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-lg font-mono text-[9px] text-white/40">
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span>ACTIVE CORE</span>
            <span className="text-white font-medium text-[10px] tracking-wide text-green-400">● ONLINE</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span>MODEL LAYER</span>
            <span className="text-white font-semibold text-[10px]">{activeModel.replace("gemini-", "").toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span>CONTEXT SCALE</span>
            <span className="text-white font-semibold text-[10px]">128K TOKENS</span>
          </div>
          <div className="flex justify-between items-center">
            <span>ENCRYPT NODE</span>
            <span className="text-[#4F8CFF] font-semibold text-[10px]">ECDSA_P256</span>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Telemetry Alerts Feed */}
      <div className="glass-panel rounded-xl p-5 flex flex-col gap-3.5 shadow-xl border-white/10 max-h-60 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] tracking-widest uppercase">
            <Bell className="w-4 h-4 text-orange-400" />
            <span>TELEMETRY METRICS</span>
          </div>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-[9px] font-mono text-white/80">
            {notifications.length}
          </span>
        </div>

        {/* Dynamic Alerts List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 scrollbar-thin">
          <AnimatePresence initial={false}>
            {notifications.length === 0 ? (
              <div className="font-mono text-[10px] text-white/30 italic text-center py-4">
                No active telemetry alerts.
              </div>
            ) : (
              notifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  onClick={() => dismissNotification(n.id)}
                  className={cn(
                    "p-3 rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-all flex flex-col gap-1 relative overflow-hidden group",
                    n.type === "success" && "border-green-500/10 bg-green-950/5 hover:border-green-500/25",
                    n.type === "warning" && "border-yellow-500/10 bg-yellow-950/5 hover:border-yellow-500/25",
                    n.type === "error" && "border-red-500/10 bg-red-950/5 hover:border-red-500/25"
                  )}
                >
                  {/* Hover check sign to dismiss */}
                  <span className="absolute right-2 top-2 text-[8px] font-mono text-white/25 opacity-0 group-hover:opacity-100 transition-opacity">
                    [DISMISS]
                  </span>
                  <div className="font-sans font-semibold text-[10.5px] text-white/95">{n.title}</div>
                  <div className="font-sans text-[9px] text-white/50 leading-relaxed">{n.message}</div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
