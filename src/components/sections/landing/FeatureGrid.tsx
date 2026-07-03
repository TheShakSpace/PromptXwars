/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { featureData } from "../../../data/featureData";
import { GlassCard } from "../../common/cards/GlassCard";
import { Cpu, Terminal, Database, Cuboid, Activity, Workflow, Sparkles } from "lucide-react";
import { cn } from "../../../utils/cn";

export function FeatureGrid() {
  // Map string names to solid Lucide components
  const iconMap: Record<string, React.ComponentType<any>> = {
    Cpu: Cpu,
    Terminal: Terminal,
    Database: Database,
    Cuboid: Cuboid,
    Activity: Activity,
    Workflow: Workflow,
  };

  return (
    <section id="features-bento" className="relative py-24 px-6 max-w-6xl mx-auto z-20">
      {/* Title block */}
      <div className="flex flex-col gap-3 mb-16 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 font-mono text-[10px] tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-[#4F8CFF]" />
          <span>ARCHITECTURE BLUEPRINT</span>
        </div>
        <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl text-white">
          Sovereign Operating Capabilities
        </h2>
        <p className="font-sans font-light text-sm text-white/50 max-w-lg leading-relaxed">
          Our design decouples processing engines, rendering structures, and persistent schemas for pristine, fluid operations.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[220px]">
        {featureData.map((f, idx) => {
          const Icon = iconMap[f.iconName] || Cpu;
          const isLarge = f.size === "large";
          const isMedium = f.size === "medium";

          return (
            <GlassCard
              key={f.id}
              glowColor={`${f.accentColor}1C`} // 1C is minor hex transparency
              className={cn(
                "md:col-span-2",
                isLarge && "md:col-span-4 md:row-span-2 h-full",
                isMedium && "md:col-span-3 h-full"
              )}
              interactive
            >
              <div className="flex flex-col justify-between h-full p-2">
                {/* Glowing Icon head */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border relative"
                  style={{
                    borderColor: `${f.accentColor}30`,
                    background: `${f.accentColor}0A`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.accentColor }} />
                  <span
                    className="absolute inset-0 rounded-lg blur-md opacity-30 pointer-events-none"
                    style={{ background: f.accentColor }}
                  />
                </div>

                {/* Text details */}
                <div className="mt-6">
                  <h3 className="font-sans font-semibold text-sm md:text-base text-white/90 tracking-wide mb-2">
                    {f.title}
                  </h3>
                  <p className="font-sans text-xs text-white/45 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
