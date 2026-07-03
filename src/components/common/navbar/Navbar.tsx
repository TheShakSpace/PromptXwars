/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useOS } from "../../../contexts/OSContext";
import { OSMode } from "../../../types";
import { Terminal, Shield, Cpu, Activity, Clock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";

export function Navbar() {
  const { mode, setMode, isTerminalOpen, setIsTerminalOpen, activeModel } = useOS();
  const [time, setTime] = useState("");

  // Live time ticker
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const modes = [
    { id: OSMode.IMMERSIVE, label: "Immersive 3D" },
    { id: OSMode.WORKSPACE, label: "Workspace" },
    { id: OSMode.ANALYTICS, label: "Analytics" },
  ];

  return (
    <motion.header
      id="system-navbar"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-3rem)] max-w-6xl"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
    >
      <div className="glass-panel rounded-full px-6 py-3.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-white/10 relative overflow-hidden">
        {/* Pulsing micro indicator */}
        <div className="absolute top-0 left-12 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#4F8CFF] to-transparent animate-pulse-slow" />

        {/* Logo / Title Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
            <Shield className="w-3.5 h-3.5 text-white" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          </div>
          <span className="font-sans font-black tracking-widest text-sm text-white">HELIOS</span>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5 text-[9px] font-mono text-white/50 tracking-wide uppercase">
            <Cpu className="w-2.5 h-2.5 text-[#4F8CFF]" />
            <span>{activeModel.replace("gemini-", "").toUpperCase()}</span>
          </div>
        </div>

        {/* Mode Toggle Tabs */}
        <nav className="flex items-center bg-white/[0.03] rounded-full p-1 border border-white/5 relative">
          {modes.map((m) => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-[10px] md:text-xs font-sans font-medium tracking-wide uppercase select-none transition-colors cursor-pointer",
                  isActive ? "text-[#050505]" : "text-white/40 hover:text-white"
                )}
              >
                {/* Active slider background slide */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-tab-indicator"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System telemetry logs and Terminal trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-white/30 font-mono text-[10px]">
            <Clock className="w-3.5 h-3.5 text-[#4F8CFF]" />
            <span>{time || "00:00:00"}</span>
          </div>
          
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4F8CFF]/30 px-3.5 py-2 rounded-full font-mono text-[10px] text-white/80 transition-all active:scale-95 cursor-pointer relative group"
            title="Open AI Command Terminal"
          >
            <span className="absolute -inset-px rounded-full bg-[#4F8CFF]/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <Terminal className="w-3.5 h-3.5 text-[#4F8CFF]" />
            <span className="hidden sm:inline">SHELL</span>
            <kbd className="hidden lg:inline-flex items-center text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 leading-none font-sans font-bold border border-white/5 select-none ml-1">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
