/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { statsData } from "../../../data/statsData";
import { GlassCard } from "../../common/cards/GlassCard";
import { WorkflowTimeline } from "../../common/timeline/WorkflowTimeline";
import { Activity, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";

export function StatsOverview() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  // Render an interactive live-updating wave monitor chart on HTML5 Canvas
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 140);
    const points: number[] = Array(40).fill(height / 2);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Scroll points left & insert new dynamic noise coordinate
      points.shift();
      const last = points[points.length - 1];
      const noise = (Math.random() - 0.5) * 15;
      let next = last + noise;
      // boundary clamping
      if (next < 20) next = 20;
      if (next > height - 20) next = height - 20;
      points.push(next);

      // Draw background vertical system grids
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 0.5;
      const step = width / points.length;
      for (let i = 0; i < points.length; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i * step, 0);
        ctx.lineTo(i * step, height);
        ctx.stroke();
      }

      // Draw standard horizontal baseline grids
      for (let h = 25; h < height; h += 30) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(width, h);
        ctx.stroke();
      }

      // Draw fluid neon metric line graph
      ctx.strokeStyle = "#4F8CFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, points[0]);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(i * step, points[i]);
      }
      ctx.stroke();

      // Create glowing filled path gradient under the line
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "rgba(79, 140, 255, 0.15)");
      grad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = grad;
      ctx.lineTo((points.length - 1) * step, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Draw pulsing live coordinate node at the head
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#4F8CFF";
      ctx.beginPath();
      ctx.arc((points.length - 1) * step, points[points.length - 1], 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Lower frame rate for high performance and styling feel
      setTimeout(() => {
        animationId = requestAnimationFrame(render);
      }, 100);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div id="analytics-panel" className="w-full max-w-6xl mx-auto py-24 px-6 flex flex-col gap-6 z-20 relative">
      
      {/* Cards Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((s, idx) => {
          const isPos = s.isPositive;
          return (
            <GlassCard key={s.id} hoverGlow={false} className="p-5 select-none bg-white/[0.02]">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                  {s.label}
                </span>
                <span className={cn(
                  "flex items-center gap-0.5 font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/5",
                  isPos ? "text-green-400" : "text-red-400"
                )}>
                  {isPos ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {s.change}
                </span>
              </div>
              
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-sans font-extrabold text-2xl text-white tracking-tight">
                  {s.value}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Main Graph & Timeline split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Live Graph Panel */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-between" hoverGlow={true}>
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#4F8CFF]" />
              <span className="font-mono text-[10px] text-white/70 tracking-widest uppercase">
                SYNAPTIC SIGNAL TELEMETRY
              </span>
            </div>
            <span className="flex items-center gap-1 font-mono text-[9px] text-green-400 animate-pulse bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> LIVE FEED
            </span>
          </div>

          <div className="w-full h-40 flex items-center justify-center relative">
            <canvas ref={chartRef} className="w-full h-full block" />
          </div>

          <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-white/35">
            <span>FREQUENCY RANGE: 2.4 - 5.8 GHz</span>
            <span>ERROR CODE: NONE [0x00]</span>
          </div>
        </GlassCard>

        {/* System Operations Steps */}
        <GlassCard className="h-full flex flex-col justify-between" hoverGlow={true}>
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-2">
            <BarChart className="w-4 h-4 text-orange-400" />
            <span className="font-mono text-[10px] text-white/70 tracking-widest uppercase">
              OPERATIONS TIMELINE
            </span>
          </div>
          <WorkflowTimeline />
        </GlassCard>

      </div>
    </div>
  );
}
