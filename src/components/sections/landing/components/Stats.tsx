/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Activity, Cpu, Layers, Database } from "lucide-react";

export function Stats() {
  const [requests, setRequests] = useState(1048576);

  // Smooth live ticking animation for AI requests
  useEffect(() => {
    const timer = setInterval(() => {
      setRequests((prev) => prev + Math.floor(Math.random() * 8) + 1);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const statsData = [
    {
      id: "stat-1",
      value: "99.98%",
      label: "Operational Uptime",
      description: "Distributed across global serverless environments",
      icon: Cpu,
      color: "#4F8CFF",
    },
    {
      id: "stat-2",
      value: requests.toLocaleString(),
      label: "Total AI Requests",
      description: "Real-time processed cognitive inference queries",
      icon: Activity,
      color: "#10B981",
    },
    {
      id: "stat-3",
      value: "150+",
      label: "Enterprise Projects",
      description: "Fully orchestrated systems in secure production",
      icon: Database,
      color: "#F59E0B",
    },
    {
      id: "stat-4",
      value: "100+",
      label: "System Blueprints",
      description: "Instant-deployable pre-configured templates",
      icon: Layers,
      color: "#EC4899",
    },
  ];

  return (
    <section id="system-stats" className="relative py-28 px-6 max-w-6xl mx-auto z-20 select-none">
      {/* Title */}
      <div className="flex flex-col items-center text-center gap-3 mb-16">
        <span className="font-mono text-[9px] text-[#4F8CFF] tracking-[0.25em] uppercase">
          METRIC AUDIT
        </span>
        <h2 className="font-sans font-black tracking-tight text-3xl md:text-5xl text-white">
          Inference Engine Telemetry
        </h2>
        <p className="font-sans font-light text-xs md:text-sm text-white/50 max-w-md">
          Live audit reports tracking performance, loads, and system capabilities worldwide.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{
                y: -5,
                borderColor: `${stat.color}40`,
                boxShadow: `0 12px 30px ${stat.color}0F`,
              }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/5 bg-black/40 backdrop-blur-md transition-all duration-300 relative group overflow-hidden"
            >
              {/* Corner ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                style={{ background: stat.color }}
              />

              <div className="flex items-center justify-between mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border relative"
                  style={{
                    borderColor: `${stat.color}25`,
                    background: `${stat.color}0A`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
                  SYS_METRIC_0{index + 1}
                </span>
              </div>

              <div>
                <span className="block font-sans font-black text-3xl md:text-4xl text-white tracking-tight leading-none mb-2">
                  {stat.value}
                </span>
                <span className="block font-sans font-bold text-xs text-white/90 mb-1 tracking-wide uppercase">
                  {stat.label}
                </span>
                <p className="font-sans text-[11px] text-white/40 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
