/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Charts } from "./Charts";
import { StatusCard } from "./StatusCard";
import { Activity } from "./Activity";
import { BarChart3, ShieldAlert, Cpu, Activity as ActivityIcon } from "lucide-react";

export function Analytics() {
  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* Upper overview metrics header banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between select-none">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">AVERAGE LATENCY RESPONSE</span>
          </div>
          <div>
            <span className="text-3xl font-black text-white tracking-tight">14.2ms</span>
            <p className="text-[10px] text-green-400 font-mono mt-1 font-bold">▲ 12% FASTER THAN MEAN</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between select-none">
          <div className="flex items-center gap-2 mb-4">
            <ActivityIcon className="w-4 h-4 text-[#10B981]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">AUTONOMOUS DISPATCHES</span>
          </div>
          <div>
            <span className="text-3xl font-black text-white tracking-tight">4,209</span>
            <p className="text-[10px] text-white/35 font-mono mt-1 font-bold">BATCH SIZE: 64 CORES</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between select-none">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">CONGESTION MARGIN RATE</span>
          </div>
          <div>
            <span className="text-3xl font-black text-white tracking-tight">0.02%</span>
            <p className="text-[10px] text-green-400 font-mono mt-1 font-bold">▼ SAFE TOLERANCE MARGIN</p>
          </div>
        </div>

      </div>

      {/* Main body widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Charts />
        </div>
        <div>
          <StatusCard />
        </div>
        <div className="lg:col-span-3">
          <Activity />
        </div>
      </div>

    </div>
  );
}
