/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Cpu, ChevronDown, Check, Sparkles, Zap, Shield, HelpCircle } from "lucide-react";
import { AIModel } from "../../../types";

interface ModelConfig {
  id: AIModel;
  name: string;
  provider: string;
  badge: string;
  speed: string;
  reasoning: string;
  context: string;
  cost: string;
  color: string;
}

export function ModelSelector() {
  const { activeModel, setActiveModel, addNotification } = useOS();
  const [isOpen, setIsOpen] = useState(false);

  const models: ModelConfig[] = [
    {
      id: AIModel.FLASH,
      name: "Gemini 2.5 Flash",
      provider: "Google DeepMind",
      badge: "ULTRA FAST",
      speed: "⚡ 98/100",
      reasoning: "🧠 75/100",
      context: "📄 1.0M tokens",
      cost: "💎 $0.075 / 1M",
      color: "#14B8A6",
    },
    {
      id: AIModel.PRO,
      name: "Gemini 2.5 Pro Ultra",
      provider: "Google DeepMind",
      badge: "ELITE REASONER",
      speed: "⚡ 82/100",
      reasoning: "🧠 99/100",
      context: "📄 2.0M tokens",
      cost: "💎 $1.25 / 1M",
      color: "#4F8CFF",
    },
    {
      id: AIModel.LIVE,
      name: "Gemini 2.5 Live Multimodal",
      provider: "Google DeepMind",
      badge: "REAL-TIME AUDIO/VISION",
      speed: "⚡ 99/100",
      reasoning: "🧠 80/100",
      context: "📄 128K tokens",
      cost: "💎 $0.15 / 1M",
      color: "#EC4899",
    }
  ];

  const currentModel = models.find((m) => m.id === activeModel) || models[0];

  const selectModel = (id: AIModel) => {
    setActiveModel(id);
    setIsOpen(false);
    addNotification("Model Synchronized", `Core routing aligned with ${id.toUpperCase()}`, "success");
  };

  return (
    <div className="relative font-mono select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-[9px] tracking-widest text-white/80 transition-all cursor-pointer font-bold uppercase"
      >
        <Cpu className="w-3.5 h-3.5" style={{ color: currentModel.color }} />
        <span>{currentModel.name}</span>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 mt-2.5 w-80 z-50 rounded-2xl border border-white/10 bg-[#070707]/90 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden p-3"
            >
              <div className="text-[8.5px] text-white/25 uppercase tracking-widest font-bold px-2 mb-2 pb-1.5 border-b border-white/5 flex items-center justify-between">
                <span>AI COGNITIVE ROUTER</span>
                <Sparkles className="w-3 h-3 text-[#4F8CFF] animate-pulse" />
              </div>

              <div className="flex flex-col gap-1.5">
                {models.map((m) => {
                  const isSelected = m.id === activeModel;
                  return (
                    <button
                      key={m.id}
                      onClick={() => selectModel(m.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col gap-1.5 ${
                        isSelected
                          ? "bg-white/5 border-white/10"
                          : "bg-transparent border-transparent hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5" style={{ color: m.color }} />
                          <span className="text-[10px] font-bold text-white group-hover:text-white leading-none">
                            {m.name}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" style={{ color: m.color }} />}
                      </div>

                      <div className="flex justify-between items-center text-[7.5px] text-white/40 leading-none">
                        <span>{m.provider}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[7px] font-bold"
                          style={{
                            color: m.color,
                            backgroundColor: `${m.color}15`,
                            borderColor: `${m.color}30`,
                            borderWidth: "1px",
                          }}
                        >
                          {m.badge}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 border-t border-white/5 pt-1.5 text-[8px] text-white/30 font-mono">
                        <div className="flex justify-between">
                          <span>SPEED:</span>
                          <span className="text-white/60">{m.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>REASONING:</span>
                          <span className="text-white/60">{m.reasoning}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CONTEXT:</span>
                          <span className="text-white/60">{m.context}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>COST:</span>
                          <span className="text-white/60">{m.cost}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
