/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Activity, Cpu, Database, Award, Sliders, Play, RefreshCw, BarChart } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

export function ExecutionDashboard() {
  const { activeModel } = useOS();
  const [latency, setLatency] = useState(124);
  const [cpuUsage, setCpuUsage] = useState(4.2);
  const [ramUsage, setRamUsage] = useState(128.4);
  const [tokens, setTokens] = useState(12540);

  // Dynamic simulation of execution statistics so it looks completely live during presentation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(110 + Math.random() * 25));
      setCpuUsage(parseFloat((3.5 + Math.random() * 1.8).toFixed(2)));
      setRamUsage(parseFloat((127.8 + Math.random() * 2.1).toFixed(2)));
      setTokens((prev) => prev + Math.floor(Math.random() * 12));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden flex flex-col gap-4 text-left">
      <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-32 h-32 rounded-full bg-blue-500/5 blur-[35px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#4F8CFF] animate-pulse" />
          <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
            LIVE EXECUTION TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[8.5px] text-green-400 font-bold bg-green-500/5 border border-green-500/10 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
          TELEMETRY CORE ONLINE
        </div>
      </div>

      {/* Core Telemetry Stats Rows */}
      <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
        
        {/* Latency card */}
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-0.5">
          <span className="text-white/30 text-[8px] uppercase font-bold">Latency Profile</span>
          <span className="text-[#4F8CFF] text-sm font-black font-sans tracking-tight">
            {latency} ms
          </span>
          <span className="text-[7.5px] text-white/20">Average pipeline buffer</span>
        </div>

        {/* Tokens card */}
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-0.5">
          <span className="text-white/30 text-[8px] uppercase font-bold">Tokens Processed</span>
          <span className="text-[#A855F7] text-sm font-black font-sans tracking-tight">
            {tokens.toLocaleString()}
          </span>
          <span className="text-[7.5px] text-white/20">Active session payload</span>
        </div>

        {/* Compute usage */}
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-0.5">
          <span className="text-white/30 text-[8px] uppercase font-bold">CPU Core Load</span>
          <span className="text-white text-sm font-black font-sans tracking-tight">
            {cpuUsage}%
          </span>
          <span className="text-[7.5px] text-white/20">Thread-isolated processes</span>
        </div>

        {/* RAM usage */}
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-0.5">
          <span className="text-white/30 text-[8px] uppercase font-bold">Heap Memory</span>
          <span className="text-cyan-400 text-sm font-black font-sans tracking-tight">
            {ramUsage} MB
          </span>
          <span className="text-[7.5px] text-white/20">V8 active heap allocation</span>
        </div>

      </div>

      {/* Active Model Stack Indicator */}
      <div className="mt-1.5 bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between font-mono text-[9px] text-white/40">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#4F8CFF] animate-spin-slow" />
          <span>Active Cognitive Model Stack:</span>
        </div>
        <span className="text-white font-bold">{activeModel === "gemini-3.5-flash" ? "GEMINI_3.5_FLASH" : "GEMINI_3.1_PRO"}</span>
      </div>

    </div>
  );
}
