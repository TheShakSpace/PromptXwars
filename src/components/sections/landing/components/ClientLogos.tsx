/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles } from "lucide-react";

export function ClientLogos() {
  const logos = [
    { name: "VERTEX", code: "VTX" },
    { name: "NEXUS", code: "NXS" },
    { name: "QUANTUM", code: "QTM" },
    { name: "AETHER", code: "ATH" },
    { name: "PULSE", code: "PLS" },
    { name: "SOLARIS", code: "SLR" },
    { name: "HELIOS", code: "HLS" },
    { name: "KRONOS", code: "KRS" },
  ];

  // Repeat logos twice to allow seamless infinite marquee scrolling
  const list = [...logos, ...logos, ...logos];

  return (
    <section id="marquee-logos" className="relative py-16 border-t border-b border-white/5 bg-[#050505]/30 backdrop-blur-sm z-20 overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-6 mb-8 flex items-center justify-center md:justify-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#4F8CFF] animate-pulse" />
        <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
          INTEGRATED COGNITIVE ARCHITECTURES
        </span>
      </div>

      {/* Infinite slider tracks */}
      <div className="relative w-full flex overflow-hidden">
        {/* Soft edge radial fades for high-end cinematic blend */}
        <div className="absolute top-0 bottom-0 left-0 w-36 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-36 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-10 animate-infinite-scroll hover:[animation-play-state:paused] py-2">
          {list.map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-white/10 px-6 py-3 rounded-xl backdrop-blur-md shadow-lg transition-colors cursor-pointer shrink-0"
            >
              <div className="w-6 h-6 rounded bg-[#4F8CFF]/15 flex items-center justify-center">
                <span className="font-mono text-[8px] font-black text-[#4F8CFF]">{logo.code}</span>
              </div>
              <span className="font-sans font-black text-xs text-white/60 tracking-[0.25em] uppercase">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
