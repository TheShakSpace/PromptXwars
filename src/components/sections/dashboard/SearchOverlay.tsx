/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Search, X, FileCode, Terminal, LayoutGrid, Sparkles } from "lucide-react";
import { SidebarTab } from "./Sidebar";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: SidebarTab) => void;
}

export function SearchOverlay({ isOpen, onClose, onTabChange }: SearchOverlayProps) {
  const { addNotification } = useOS();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const searchIndex = [
    { type: "file", title: "App.tsx", path: "src/App.tsx", route: SidebarTab.FILES },
    { type: "file", title: "OSContext.tsx", path: "src/contexts/OSContext.tsx", route: SidebarTab.FILES },
    { type: "command", title: "SWEEP VRAM CACHE", path: "OPTIMISE GPU CORES", route: SidebarTab.DASHBOARD },
    { type: "command", title: "RUN SECURE HANDSHAKE", path: "DIAGNOSE SESSIONS ENCRYPT", route: SidebarTab.DASHBOARD },
    { type: "project", title: "Helios Autopilot Kernel", path: "AI Agent Routing Controller", route: SidebarTab.PROJECTS },
    { type: "project", title: "Spatial Node Processor", path: "3D Graphics vector compilation", route: SidebarTab.PROJECTS },
  ];

  const results = searchIndex.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.path.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start px-6 pt-32 select-none">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl pointer-events-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto flex flex-col gap-5 relative z-10"
          >
            {/* Input wrapper */}
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl focus-within:border-[#4F8CFF]/50 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
              <Search className="w-5 h-5 text-white/30 ml-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources, commands, compilation maps..."
                className="w-full bg-transparent border-none outline-none p-4 text-sm text-white placeholder-white/20 font-sans"
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white mr-4 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results body */}
            <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin">
              <span className="font-mono text-[8.5px] text-white/20 uppercase tracking-widest px-2 mb-2">
                {query ? `INSTANT COGNITIVE RESULTS (${results.length})` : "SUGGESTED MODULE PATHS"}
              </span>

              {results.length === 0 ? (
                <div className="text-center py-12 text-white/25 font-mono text-[10px] italic">
                  No resource nodes found matching query parameters.
                </div>
              ) : (
                results.map((res) => {
                  return (
                    <div
                      key={res.title}
                      onClick={() => {
                        onTabChange(res.route);
                        onClose();
                        addNotification("Navigation Complete", `Shifted context directory: ${res.title}`, "info");
                      }}
                      className="p-3 rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center justify-between select-none cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center border bg-white/[0.02] border-white/5 group-hover:bg-white/10 transition-colors">
                          {res.type === "file" ? (
                            <FileCode className="w-4 h-4 text-[#14B8A6]" />
                          ) : res.type === "command" ? (
                            <Terminal className="w-4 h-4 text-[#F59E0B]" />
                          ) : (
                            <LayoutGrid className="w-4 h-4 text-[#4F8CFF]" />
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white/95 leading-tight">{res.title}</span>
                          <span className="font-mono text-[8.5px] text-white/35 mt-0.5 uppercase tracking-wide">
                            {res.path}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-[8px] border border-white/5 bg-white/5 px-2 py-0.5 rounded text-white/30 group-hover:text-white/60 transition-colors">
                        GO
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
