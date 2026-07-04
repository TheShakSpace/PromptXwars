/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Sparkles, RefreshCw, ArrowUpRight, Zap, Flame, BrainCircuit } from "lucide-react";

interface InsightItem {
  id: string;
  title: string;
  desc: string;
  impact: "Critical" | "Optimal" | "Advisory";
  type: "warning" | "success" | "info";
  score: string;
}

export function Insights() {
  const { addNotification } = useOS();
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [insights, setInsights] = useState<InsightItem[]>([
    {
      id: "ins-1",
      title: "Prune Latent VRAM Nodes",
      desc: "Pruning inactive node buffers in Spline GPU will save up to 140MB memory leaks on high-definition canvases.",
      impact: "Critical",
      type: "warning",
      score: "+34.5% Efficiency",
    },
    {
      id: "ins-2",
      title: "Model Pipeline Optimized",
      desc: "Swapping active prompt preset routes from creative modes to structural code blocks reduced throughput latency by 12ms.",
      impact: "Optimal",
      type: "success",
      score: "-14ms Latency",
    }
  ]);

  const handleSynthesizeInsights = () => {
    setIsSynthesizing(true);
    addNotification("Cognitive Insights Syncing", "Spinning up semantic inference parser against pipeline metrics...", "info");

    setTimeout(() => {
      setIsSynthesizing(false);
      setInsights([
        {
          id: "ins-new-1",
          title: "GPU Pipeline Alignment",
          desc: "Allocating floating-point model calculations exclusively to unified memory channels prevents page-file swap overheads.",
          impact: "Optimal",
          type: "success",
          score: "+45 FPS Canvas",
        },
        {
          id: "ins-new-2",
          title: "Optimize System Presets",
          desc: "Your primary preset has been queried 14 times. Merging prompt redundancies will save up to 4,200 input tokens per query.",
          impact: "Advisory",
          type: "info",
          score: "Token Savings",
        }
      ]);
      addNotification("Insights Compiled", "Generated 2 new cognitive recommendations.", "success");
    }, 1500);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-colors h-full flex flex-col justify-between">
      
      <div>
        {/* Header indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 select-none">
            <BrainCircuit className="w-4 h-4 text-[#A855F7]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">COGNITIVE INSIGHTS HUB</span>
          </div>

          <button
            onClick={handleSynthesizeInsights}
            disabled={isSynthesizing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/25 text-[8.5px] font-mono text-[#A855F7] hover:text-white hover:bg-[#A855F7]/25 hover:border-[#A855F7]/50 transition-all cursor-pointer font-bold disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSynthesizing ? "animate-spin" : ""}`} />
            <span>SYNTHESIZE</span>
          </button>
        </div>

        {/* Insight items lists */}
        <div className="flex flex-col gap-4 relative">
          <AnimatePresence mode="wait">
            {isSynthesizing ? (
              <motion.div
                key="synthesizing-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 gap-3"
              >
                <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[#A855F7] animate-spin" />
                <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase animate-pulse">RECOMPILING SYNAPSE METRICS...</span>
              </motion.div>
            ) : (
              <motion.div
                key="insight-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-3.5"
              >
                {insights.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all flex flex-col gap-2 relative overflow-hidden group/card select-none"
                  >
                    {/* Impact Tag overlay */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ins.type === "warning" ? "bg-amber-400" : ins.type === "success" ? "bg-green-400" : "bg-[#4F8CFF]"
                          }`}
                        />
                        <span className="font-mono text-[9px] text-white/80 font-semibold uppercase tracking-wider leading-none">
                          {ins.title}
                        </span>
                      </div>
                      <span className="font-mono text-[8px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/45">
                        {ins.score}
                      </span>
                    </div>

                    <p className="font-sans text-[10.5px] text-white/45 leading-relaxed font-light">
                      {ins.desc}
                    </p>

                    <div className="flex items-center justify-between mt-1 select-none">
                      <span className="font-mono text-[8.5px] text-white/20">
                        IMPACT: <span className="text-white/60 font-bold">{ins.impact.toUpperCase()}</span>
                      </span>

                      <button 
                        onClick={() => addNotification("Insight Executed", `Applied strategy: ${ins.title}`, "success")}
                        className="opacity-0 group-hover/card:opacity-100 flex items-center gap-1 font-mono text-[8px] text-[#A855F7] hover:text-white transition-all cursor-pointer font-bold uppercase"
                      >
                        <span>APPLY STRATEGY</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer system status */}
      <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
        <span>AI RECOMMENDATIONS AGING: REAL-TIME</span>
        <span>ACCURACY RATE: 99.4%</span>
      </div>

    </div>
  );
}
