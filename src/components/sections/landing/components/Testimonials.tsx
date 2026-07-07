/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { MessageSquareText, Sparkles, Star } from "lucide-react";

export function Testimonials() {
  const list = [
    {
      id: "t-1",
      name: "Marcus Aurelius",
      role: "Lead Architect at Vertex",
      text: "The split microsecond latency and flawless 3D render pipeline converted our entire internal control grid in less than a week. An absolute masterwork of OS-tier engineering.",
      avatar: "MA",
    },
    {
      id: "t-2",
      name: "Elena Rostova",
      role: "Senior AI Researcher",
      text: "Having native Gemini interfaces coupled with direct local databases makes playground testing redundant. Helios gives us immediate developer autonomy.",
      avatar: "ER",
    },
    {
      id: "t-3",
      name: "Devon Chen",
      role: "Founder, Kronos Systems",
      text: "Helios is the premium operating layer we've been waiting for. The cognitive integration saves us thousands of hours of manual agent configurations.",
      avatar: "DC",
    },
  ];

  return (
    <section id="system-testimonials" className="relative py-28 px-6 max-w-6xl mx-auto z-20 select-none">
      {/* Title */}
      <div className="flex flex-col items-center text-center gap-3 mb-20">
        <div className="flex items-center gap-2 text-[#4F8CFF] font-mono text-[9px] tracking-[0.25em] uppercase">
          <Sparkles className="w-4 h-4 text-[#4F8CFF] animate-pulse" />
          <span>BUILDER REVIEWS</span>
        </div>
        <h2 className="font-sans font-black tracking-tight text-3xl md:text-5xl text-white">
          Decentralized Endorsement
        </h2>
        <p className="font-sans font-light text-xs md:text-sm text-white/50 max-w-md">
          See why elite engineering teams deploy and optimize their system agents directly inside Helios.
        </p>
      </div>

      {/* Grid with 3D hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {list.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.15, duration: 0.8 }}
            whileHover={{
              rotateX: 4,
              rotateY: -4,
              z: 20,
              borderColor: "rgba(79, 140, 255, 0.35)",
              boxShadow: "0 20px 40px rgba(79, 140, 255, 0.08)",
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="glass-panel rounded-3xl p-8 border border-white/5 bg-black/45 backdrop-blur-xl transition-all duration-300 relative group flex flex-col justify-between"
          >
            {/* Top quote bubble */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <MessageSquareText className="w-4 h-4 text-[#4F8CFF]" />
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#F59E0B] stroke-[#F59E0B]" />
                  ))}
                </div>
              </div>
              <p className="font-sans font-light text-sm text-white/70 leading-relaxed font-light">
                "{item.text}"
              </p>
            </div>

            {/* User profile bar */}
            <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-white/5 select-none">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600/30 via-[#4F8CFF]/20 to-indigo-600/30 border border-white/10 flex items-center justify-center font-sans font-bold text-xs text-white/90">
                {item.avatar}
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-white tracking-wide">
                  {item.name}
                </h4>
                <span className="font-mono text-[9px] text-white/30 tracking-wider">
                  {item.role}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
