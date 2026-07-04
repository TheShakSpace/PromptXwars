/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { StatusCard } from "./StatusCard";
import { QuickActions } from "./QuickActions";
import { Projects } from "./Projects";
import { Insights } from "./Insights";
import { Activity } from "./Activity";
import { Charts } from "./Charts";
import { 
  Sparkles, ListTodo, Calendar, AlertTriangle, CheckSquare, 
  Square, RefreshCw 
} from "lucide-react";

export function Workspace() {
  const { addNotification } = useOS();
  const [tasks, setTasks] = useState([
    { id: "t-1", text: "Secure cryptographic handshakes with model operator", completed: true, date: "Today" },
    { id: "t-2", text: "Prune active VRAM leak allocations in canvas containers", completed: false, date: "Tomorrow" },
    { id: "t-3", text: "Configure index databases rules on Firestore console", completed: false, date: "Jul 10" },
  ]);

  const handleToggleTask = (id: string, text: string) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
    const target = tasks.find((t) => t.id === id);
    if (target) {
      addNotification("Task Updated", `Milestone marked as ${!target.completed ? "completed" : "pending"}.`, "success");
    }
  };

  // Dynamic welcome wording based on current local hours
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="w-full flex flex-col gap-6 font-sans select-none">
      
      {/* 1. Master Welcome Banner & Quick summary */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-blue-950/20 via-[#0a0a0a]/80 to-violet-950/20 backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] group"
      >
        {/* Animated back glowing blobs */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-96 h-32 rounded-full bg-gradient-to-r from-blue-600/10 to-violet-600/10 blur-[60px] animate-pulse pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 select-none">
              <Sparkles className="w-4 h-4 text-[#4F8CFF] animate-bounce" />
              <span className="font-mono text-[8.5px] text-white/30 tracking-widest uppercase font-bold">OPERATOR TERMINAL ONLINE</span>
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8CFF] to-violet-400">Developer</span>
            </h1>
            <p className="text-xs text-white/45 mt-2 max-w-xl font-light leading-relaxed">
              Your autonomous cognitive workspace is synced. Helios kernel version 2.4 is listening on port 3000, managing model telemetry, memory, and database configurations.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 font-mono text-[9px] text-white/40 shrink-0 select-none">
            <div className="flex justify-between gap-6">
              <span>SYSTEM LOAD:</span>
              <span className="text-green-400 font-bold">0.14ms OK</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>SECURITY LOGS:</span>
              <span className="text-white font-semibold">100% ENCRYPTED</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>ACTIVE CORES:</span>
              <span className="text-[#4F8CFF] font-black">HELIOS_A5</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Responsive Bento Layout cards matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Bento Cell 1: Neural Status */}
        <div className="h-full">
          <StatusCard />
        </div>

        {/* Bento Cell 2: Quick Operations */}
        <div className="h-full">
          <QuickActions />
        </div>

        {/* Bento Cell 3: Recent Projects */}
        <div className="h-full">
          <Projects />
        </div>

        {/* Bento Cell 4: Telemetry waves charts */}
        <div className="lg:col-span-2 h-full">
          <Charts />
        </div>

        {/* Bento Cell 5: AI Insights */}
        <div className="h-full">
          <Insights />
        </div>

        {/* Bento Cell 6: Timeline checklist and progression tracker */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-colors flex flex-col justify-between h-full">
          
          <div>
            {/* Header titles */}
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 select-none">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-green-400" />
                <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">MILESTONES & CHECKS</span>
              </div>
              <span className="font-mono text-[8.5px] text-green-400 font-bold">QUEUE</span>
            </div>

            {/* Checklists rows */}
            <div className="flex flex-col gap-3.5">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t.id, t.text)}
                  className="p-3.5 rounded-2xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex items-start gap-3 select-none cursor-pointer group/task"
                >
                  <button className="text-white/40 group-hover/task:text-white transition-colors mt-0.5">
                    {t.completed ? (
                      <CheckSquare className="w-4.5 h-4.5 text-green-400" />
                    ) : (
                      <Square className="w-4.5 h-4.5 text-white/20" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span className={`text-[11.5px] leading-relaxed block ${t.completed ? "text-white/30 line-through font-light" : "text-white/85"}`}>
                      {t.text}
                    </span>
                    <span className="font-mono text-[7.5px] text-white/25 mt-1 block uppercase tracking-wide">
                      DUE: {t.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist footer */}
          <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
            <span>COMPLETED: {tasks.filter((t) => t.completed).length}/{tasks.length}</span>
            <span>AUTO_SWEEP: INACTIVE</span>
          </div>

        </div>

        {/* Bento Cell 7: History Activity details */}
        <div className="lg:col-span-3 h-full">
          <Activity />
        </div>

      </div>

    </div>
  );
}
