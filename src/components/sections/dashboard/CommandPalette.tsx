/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { SidebarTab } from "./Sidebar";
import { 
  Search, Terminal, ArrowRight, ShieldCheck, Compass, 
  Settings, Database, Cpu, MessageSquare, Briefcase, Clock 
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: SidebarTab) => void;
}

export function CommandPalette({ isOpen, onClose, onTabChange }: CommandPaletteProps) {
  const { setActiveModel, addNotification, activeModel } = useOS();
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems = [
    { category: "SYSTEM", label: "NAVIGATE_DASHBOARD", desc: "Open system telemetry dashboard", icon: ShieldCheck, action: () => onTabChange(SidebarTab.DASHBOARD) },
    { category: "SYSTEM", label: "NAVIGATE_WORKSPACE", desc: "Open prompt compiler compiler workspace", icon: Compass, action: () => onTabChange(SidebarTab.WORKSPACE) },
    { category: "SYSTEM", label: "NAVIGATE_FILES", desc: "Open file index repository directory", icon: Database, action: () => onTabChange(SidebarTab.FILES) },
    { category: "SYSTEM", label: "NAVIGATE_SETTINGS", desc: "Configure account and API preferences", icon: Settings, action: () => onTabChange(SidebarTab.SETTINGS) },
    { category: "COGNITIVE", label: "ROUT_MODEL_FLASH", desc: "Bind intelligence router to gemini-3.5-flash", icon: Cpu, action: () => { setActiveModel("gemini-3.5-flash" as any); addNotification("Router Updated", "Active model shifted to Gemini-3.5-flash.", "success"); } },
    { category: "COGNITIVE", label: "ROUT_MODEL_PRO", desc: "Bind intelligence router to gemini-3.1-pro-preview", icon: Cpu, action: () => { setActiveModel("gemini-3.1-pro-preview" as any); addNotification("Router Updated", "Active model shifted to Gemini-3.1-pro.", "success"); } },
    { category: "AUTOMATION", label: "LAUNCH_AI_AGENT", desc: "Initialize background pipeline autonomous process", icon: MessageSquare, action: () => { addNotification("AI Agent Provisioned", "Autonomous automation node listening.", "success"); } },
  ];

  const filteredCommands = commandItems.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setHighlightedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : onClose(); // handled by parent but safe
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[highlightedIdx]) {
          filteredCommands[highlightedIdx].action();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, highlightedIdx, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 select-none">
          {/* Backdrop screen filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
          />

          {/* Core Spotlight Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
          >
            {/* Input field row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-white/[0.01]">
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIdx(0);
                }}
                placeholder="Type command keywords or route parameters..."
                className="w-full bg-transparent border-none outline-none text-white text-xs placeholder-white/20 font-sans"
              />
              <span className="font-mono text-[9px] text-white/25 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                ESC
              </span>
            </div>

            {/* Scrollable list content */}
            <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1 scrollbar-thin">
              {filteredCommands.length === 0 ? (
                <div className="text-center py-10 font-mono text-[10px] text-white/30 italic">
                  Command route parameters not found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isHighlighted = idx === highlightedIdx;

                  return (
                    <button
                      key={cmd.label}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setHighlightedIdx(idx)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                        isHighlighted
                          ? "bg-white/5 border border-white/10 text-white"
                          : "bg-transparent border border-transparent text-white/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                            isHighlighted ? "bg-white/10 border-white/10" : "bg-white/[0.02] border-white/5"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-[#4F8CFF]" />
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9.5px] font-bold tracking-wider">{cmd.label}</span>
                            <span className="font-mono text-[7px] text-white/20 bg-white/5 px-1 rounded">
                              {cmd.category}
                            </span>
                          </div>
                          <span className="font-sans text-[10px] text-white/40 mt-0.5 font-light">
                            {cmd.desc}
                          </span>
                        </div>
                      </div>

                      {isHighlighted && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#4F8CFF] shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Helper footer */}
            <div className="px-4 py-2 bg-white/[0.01] border-t border-white/5 flex justify-between select-none font-mono text-[7.5px] text-white/20">
              <span className="flex items-center gap-1.5">
                <span>↑↓</span> NAVIGATE
              </span>
              <span>ENTER TO ACTIVATE</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
