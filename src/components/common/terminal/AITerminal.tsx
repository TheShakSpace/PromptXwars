/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Terminal, X, CornerDownLeft, CircleAlert, Sparkles, Send } from "lucide-react";

export function AITerminal() {
  const { isTerminalOpen, setIsTerminalOpen, terminalHistory, executeCommand, clearTerminal } = useOS();
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on open
  useEffect(() => {
    if (isTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isTerminalOpen]);

  // Scroll to bottom on history change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalHistory, isTerminalOpen]);

  // Global toggle listener (ESC, or Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTerminalOpen) {
        setIsTerminalOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsTerminalOpen(!isTerminalOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalOpen, setIsTerminalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim();
    if (!cmd) return;

    setIsSubmitting(true);
    setInputValue("");
    await executeCommand(cmd);
    setIsSubmitting(false);

    // Refocus input
    inputRef.current?.focus();
  };

  const suggestions = [
    "help",
    "sysinfo",
    "mode workspace",
    "mode immersive",
    "prompt code",
    "model pro"
  ];

  if (!isTerminalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-12">
        {/* Backdrop overlay */}
        <motion.div
          className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTerminalOpen(false)}
        />

        {/* Floating Terminal Console Card */}
        <motion.div
          id="system-terminal"
          className="relative w-full max-w-3xl h-[500px] rounded-xl bg-[#050505]/95 border border-white/10 overflow-hidden flex flex-col shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          {/* Cyber scanner overlay */}
          <div className="absolute inset-0 pointer-events-none scanlines opacity-[0.15]" />

          {/* Console Header */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/5">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-[#4F8CFF] animate-pulse" />
              <span className="font-mono text-xs text-white/80 tracking-wider">HELIOS_AI_AUTONOMOUS_SHELL</span>
            </div>
            <button
              onClick={() => setIsTerminalOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-white/50 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Console Logs History */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs select-text scrollbar-thin"
          >
            {terminalHistory.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                {item.type === "input" ? (
                  <div className="flex items-start gap-2.5 text-white/90">
                    <span className="text-[#4F8CFF] font-bold select-none">❯</span>
                    <span className="font-semibold">{item.content}</span>
                    <span className="ml-auto text-[9px] text-white/20 select-none">{item.timestamp}</span>
                  </div>
                ) : item.type === "system" ? (
                  <div className="text-white/40 border-l border-white/15 pl-3 py-0.5 leading-relaxed">
                    {item.content}
                  </div>
                ) : item.type === "error" ? (
                  <div className="flex items-start gap-2 text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-md leading-relaxed">
                    <CircleAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{item.content}</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 text-white/70 pl-3 leading-relaxed border-l border-[#4F8CFF]/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#4F8CFF] mt-0.5 shrink-0" />
                    <pre className="whitespace-pre-wrap font-sans text-xs flex-1">{item.content}</pre>
                  </div>
                )}
              </div>
            ))}
            {isSubmitting && (
              <div className="flex items-center gap-2 text-white/30 italic">
                <span className="animate-bounce font-bold">...</span>
                <span>Kernel resolving synaptic pathways...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions Rail */}
          <div className="px-6 py-2 bg-white/[0.01] border-t border-white/5 flex gap-2 overflow-x-auto select-none no-scrollbar">
            <span className="font-mono text-[9px] text-white/30 shrink-0 self-center uppercase mr-1">TIPS:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInputValue(s)}
                className="font-mono text-[10px] text-white/50 hover:text-[#4F8CFF] bg-white/5 hover:bg-[#4F8CFF]/10 px-2.5 py-1 rounded border border-white/5 hover:border-[#4F8CFF]/20 transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Command Form Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-3">
            <div className="flex-1 relative flex items-center bg-white/[0.03] border border-white/10 rounded-md focus-within:border-[#4F8CFF]/50 focus-within:shadow-[0_0_15px_rgba(79,140,255,0.15)] transition-all">
              <span className="font-mono text-xs text-[#4F8CFF] font-bold pl-4 pr-1.5 select-none">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Command kernel or request intelligence generation... (e.g. 'help')"
                className="w-full bg-transparent border-none outline-none py-3.5 pr-4 text-white text-xs font-mono placeholder-white/30"
                disabled={isSubmitting}
              />
              <div className="absolute right-4 flex items-center gap-1.5 text-white/20 select-none">
                <span className="text-[10px] font-mono border border-white/10 px-1.5 py-0.5 rounded bg-white/5 leading-none">ENTER</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !inputValue.trim()}
              className="bg-white/5 hover:bg-white/15 border border-white/10 text-white hover:text-[#4F8CFF] hover:border-[#4F8CFF]/30 p-4 rounded-md transition-all active:scale-95 cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
