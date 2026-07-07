/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { History, CheckCircle, Clock, Cpu, Code, Database, AlertCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "system" | "model" | "database" | "error";
  title: string;
  desc: string;
  time: string;
  icon: React.ComponentType<any>;
  color: string;
}

export function Activity() {
  const activities: ActivityItem[] = [
    {
      id: "act-1",
      type: "model",
      title: "Task Instruction Synthesis Complete",
      desc: "Model routing 'gemini-3.5-flash' returned operational parameters inside Helios operator sandboxing.",
      time: "2m ago",
      icon: Cpu,
      color: "#4F8CFF",
    },
    {
      id: "act-2",
      type: "database",
      title: "Index Synced with Cloud Firestore",
      desc: "Successfully consolidated client side state models with remote cluster database indices.",
      time: "14m ago",
      icon: Database,
      color: "#10B981",
    },
    {
      id: "act-3",
      type: "system",
      title: "Secure Node Handshake Confirmed",
      desc: "Cryptographic 256-bit keys validated over SSL port 3000 mapping against remote server host.",
      time: "1h ago",
      icon: Code,
      color: "#F59E0B",
    },
    {
      id: "act-4",
      type: "error",
      title: "Telemetry Sync Timeout",
      desc: "A network socket lag triggered a standard backup reconnect cycle, securing packet integrity.",
      time: "2h ago",
      icon: AlertCircle,
      color: "#EF4444",
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-colors h-full flex flex-col justify-between">
      
      <div>
        {/* Header Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 select-none">
            <History className="w-4 h-4 text-white/50" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">SYSTEM ACTIVITY TIMELINE</span>
          </div>
          <span className="font-mono text-[8.5px] text-white/35">LIVE CHANNELS</span>
        </div>

        {/* Timeline body with visual lines */}
        <div className="relative pl-6 flex flex-col gap-6">
          {/* Vertical connected path line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#4F8CFF]/50 via-white/5 to-white/5" />

          {activities.map((act, index) => {
            const IconComponent = act.icon;

            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative group/item select-none"
              >
                {/* Connector point indicator */}
                <div 
                  className="absolute -left-[21px] top-1 w-[12px] h-[12px] rounded-full border-2 border-black flex items-center justify-center transition-all group-hover/item:scale-125 z-10"
                  style={{ backgroundColor: act.color }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="font-sans font-black text-xs text-white/90 group-hover/item:text-white transition-colors leading-tight block">
                      {act.title}
                    </span>
                    <p className="font-sans text-[10.5px] text-white/40 leading-relaxed font-light mt-1">
                      {act.desc}
                    </p>
                  </div>

                  <span className="font-mono text-[8px] text-white/30 shrink-0 whitespace-nowrap mt-0.5">
                    {act.time}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer statistics */}
      <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
        <span>LOG RETENTION PERIOD: 30 DAYS</span>
        <span>AUDITED LOGS: OK</span>
      </div>

    </div>
  );
}
