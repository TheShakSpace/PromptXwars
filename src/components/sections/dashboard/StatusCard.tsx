/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Cpu, Zap, Activity, ShieldCheck } from "lucide-react";

export function StatusCard() {
  const { activeModel } = useOS();
  const [gpuLoad, setGpuLoad] = useState(64);
  const [memUsage, setMemUsage] = useState(12.4);
  const [latency, setLatency] = useState(24);

  // Smooth live telemetry ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setGpuLoad((prev) => {
        const diff = Math.floor(Math.random() * 7) - 3;
        const next = prev + diff;
        return next > 95 ? 80 : next < 40 ? 55 : next;
      });
      setMemUsage((prev) => {
        const diff = Number((Math.random() * 0.2 - 0.1).toFixed(1));
        const next = Number((prev + diff).toFixed(1));
        return next > 15.8 ? 14.2 : next < 10.1 ? 11.4 : next;
      });
      setLatency((prev) => {
        const diff = Math.floor(Math.random() * 5) - 2;
        const next = prev + diff;
        return next > 60 ? 35 : next < 12 ? 18 : next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Ring circumference calculator: 2 * PI * R
  const r = 24;
  const c = 2 * Math.PI * r;
  const gpuOffset = c - (gpuLoad / 100) * c;
  const memOffset = c - ((memUsage / 16) * 100) * c;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/30 transition-colors h-full flex flex-col justify-between">
      {/* Corner back-glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#4F8CFF]/10 blur-[40px] pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

      <div>
        {/* Header indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">COGNITIVE KERNEL LAYER</span>
          </div>
          <span className="font-mono text-[8px] text-green-400 bg-green-500/5 border border-green-500/15 px-2 py-0.5 rounded-full font-bold">
            SECURE
          </span>
        </div>

        {/* Neural Model descriptor info */}
        <div className="border-b border-white/5 pb-4 mb-5">
          <span className="block font-mono text-[8px] text-white/30 uppercase tracking-widest">ACTIVE MACHINE LEARNING ROUTE</span>
          <h3 className="font-sans font-black text-sm text-white/90 uppercase tracking-wide truncate mt-1">
            {activeModel}
          </h3>
          <p className="font-sans text-[10.5px] text-white/45 mt-0.5 leading-normal font-light">
            Dynamic context window scaling up to 1M parameters, fully isolated sandbox client-side router.
          </p>
        </div>

        {/* Circular rings loading load panel */}
        <div className="flex items-center justify-around gap-4 mb-6">
          {/* Ring 1: GPU Load */}
          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.03)" strokeWidth="4.5" fill="transparent" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r={r}
                  stroke="#4F8CFF"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray={c}
                  animate={{ strokeDashoffset: gpuOffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute font-mono text-[10px] font-bold text-white">{gpuLoad}%</span>
            </div>
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">GPU CORE</span>
          </div>

          {/* Ring 2: Memory Usage */}
          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.03)" strokeWidth="4.5" fill="transparent" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r={r}
                  stroke="#A855F7"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray={c}
                  animate={{ strokeDashoffset: memOffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute font-mono text-[9px] font-bold text-white">{memUsage}G</span>
            </div>
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">VRAM MEM</span>
          </div>
        </div>
      </div>

      {/* Latency and telemetry metrics summary */}
      <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 rounded-xl p-3.5 select-none font-mono text-[9px]">
        <div className="flex flex-col">
          <span className="text-white/30 uppercase tracking-wider">LATENCY TIMER</span>
          <span className="text-white font-bold text-xs mt-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            {latency}ms
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-white/30 uppercase tracking-wider">THROUGHPUT RATIO</span>
          <span className="text-green-400 font-bold text-xs mt-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            99.98%
          </span>
        </div>
      </div>
    </div>
  );
}
