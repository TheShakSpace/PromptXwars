/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart3, TrendingUp, Zap, Calendar, Maximize2 } from "lucide-react";

export function Charts() {
  const [activeMetric, setActiveMetric] = useState<"speed" | "accuracy" | "cost">("speed");

  // Multi-dimensional telemetry datasets
  const data = {
    speed: [
      { label: "00:00", val: 42, text: "42 T/s" },
      { label: "04:00", val: 56, text: "56 T/s" },
      { label: "08:00", val: 89, text: "89 T/s" },
      { label: "12:00", val: 124, text: "124 T/s" },
      { label: "16:00", val: 95, text: "95 T/s" },
      { label: "20:00", val: 140, text: "140 T/s" },
    ],
    accuracy: [
      { label: "00:00", val: 98.2, text: "98.2%" },
      { label: "04:00", val: 98.5, text: "98.5%" },
      { label: "08:00", val: 99.1, text: "99.1%" },
      { label: "12:00", val: 99.4, text: "99.4%" },
      { label: "16:00", val: 99.2, text: "99.2%" },
      { label: "20:00", val: 99.8, text: "99.8%" },
    ],
    cost: [
      { label: "00:00", val: 12, text: "12k tok" },
      { label: "04:00", val: 24, text: "24k tok" },
      { label: "08:00", val: 48, text: "48k tok" },
      { label: "12:00", val: 95, text: "95k tok" },
      { label: "16:00", val: 75, text: "75k tok" },
      { label: "20:00", val: 160, text: "160k tok" },
    ],
  };

  const activeSet = data[activeMetric];
  const maxVal = Math.max(...activeSet.map((d) => d.val));

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-colors h-full flex flex-col justify-between">
      
      <div>
        {/* Header telemetry selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 select-none">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#06B6D4]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">TELEMETRY ANALYTICS WAVE</span>
          </div>

          <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 shrink-0 self-start sm:self-auto">
            {(["speed", "accuracy", "cost"] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`font-mono text-[8.5px] px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold uppercase ${
                  activeMetric === metric
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>

        {/* Real Custom Interactive SVG Line/Area graph */}
        <div className="relative h-44 w-full select-none">
          
          {/* Wave background guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
            <div className="w-full h-[1px] bg-white" />
            <div className="w-full h-[1px] bg-white" />
            <div className="w-full h-[1px] bg-white" />
            <div className="w-full h-[1px] bg-white" />
          </div>

          {/* SVG Wave rendering */}
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Render Area gradient under line */}
            <motion.path
              key={`${activeMetric}-area`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              d={activeSet.reduce((acc, d, i) => {
                const x = (i / (activeSet.length - 1)) * 100;
                const y = 100 - (d.val / maxVal) * 80; // Scale 0-100% inside safe 80% range
                return `${acc} L ${x}% ${y}%`;
              }, `M 0% 100%`) + ` L 100% 100% Z`}
              fill="url(#chartGlow)"
            />

            {/* Main Path line */}
            <motion.path
              key={`${activeMetric}-line`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              d={activeSet.reduce((acc, d, i) => {
                const x = (i / (activeSet.length - 1)) * 100;
                const y = 100 - (d.val / maxVal) * 80;
                return i === 0 ? `M ${x}% ${y}%` : `${acc} L ${x}% ${y}%`;
              }, "")}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Individual floating node circles with hover focus indicator */}
            {activeSet.map((d, i) => {
              const x = `${(i / (activeSet.length - 1)) * 100}%`;
              const y = `${100 - (d.val / maxVal) * 80}%`;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#050505"
                    stroke="#06B6D4"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-150"
                  />
                  {/* Floating tooltip parameters */}
                  <text
                    x={x}
                    y={`calc(${y} - 12px)`}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {d.text}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Horizonal grid markers labels */}
          <div className="flex justify-between mt-3 font-mono text-[8px] text-white/20 select-none">
            {activeSet.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>

        </div>
      </div>

      {/* Summary report text bar */}
      <div className="mt-5 border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 select-none font-mono text-[8.5px] text-white/30">
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>CURRENT SPEED: <span className="text-white font-bold">{activeSet[activeSet.length - 1].text}</span></span>
        </div>
        <div className="flex items-center gap-1 text-[#06B6D4]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>AUTONOMOUS PEAK METRICS ACTIVE</span>
        </div>
      </div>

    </div>
  );
}
