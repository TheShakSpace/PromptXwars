/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Brain, Star, Trash2, Calendar, ShieldAlert, Pin, Bookmark, Plus } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

interface MemoryNode {
  id: string;
  key: string;
  value: string;
  category: "User Preferences" | "Instruction Context" | "Entity Maps" | "Session State";
  timestamp: string;
}

export function MemoryPanel() {
  const { addNotification } = useOS();
  const [memories, setMemories] = useState<MemoryNode[]>([
    {
      id: "mem-1",
      key: "preferred_programming_framework",
      value: "React 19 / TypeScript / Tailwind CSS v4",
      category: "User Preferences",
      timestamp: "Today, 08:12 AM",
    },
    {
      id: "mem-2",
      key: "handshake_encryption_scheme",
      value: "ECDSA_P256 256-bit",
      category: "Session State",
      timestamp: "Today, 07:30 AM",
    },
    {
      id: "mem-3",
      key: "knowledge_catalog_rules",
      value: "Adhere to strict material blueprint parsing algorithms.",
      category: "Instruction Context",
      timestamp: "Yesterday",
    },
    {
      id: "mem-4",
      key: "active_ingress_port",
      value: "Port 3000 (secured under Helios gateway)",
      category: "Session State",
      timestamp: "Jul 01, 2026",
    },
  ]);

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAddMemory = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    const newM: MemoryNode = {
      id: `mem-${Date.now()}`,
      key: newKey.toLowerCase().replace(/\s+/g, "_"),
      value: newValue,
      category: "User Preferences",
      timestamp: "Just now",
    };
    setMemories([newM, ...memories]);
    setNewKey("");
    setNewValue("");
    addNotification("Memory Synced", `Stored core memory key: ${newM.key}`, "success");
  };

  const handleDeleteMemory = (id: string, key: string) => {
    setMemories(memories.filter((m) => m.id !== id));
    addNotification("Memory Expelled", `Removed system index: ${key}`, "warning");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      
      {/* List of active stored memory registers */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[400px]">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 select-none">
            <Brain className="w-4 h-4 text-pink-400" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">PERSISTENT SYSTEM REGISTER</span>
          </div>

          {/* Table / List layout */}
          <div className="flex flex-col gap-3">
            {memories.map((mem) => {
              return (
                <div
                  key={mem.id}
                  className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex items-center justify-between group transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center shrink-0 text-white/40 group-hover:text-pink-400 group-hover:border-pink-400/20 transition-all">
                      <Star className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-white/95 truncate">
                          {mem.key}
                        </span>
                        <span className="text-[7px] font-mono text-white/30 border border-white/5 bg-white/5 px-1.5 py-0.5 rounded leading-none">
                          {mem.category.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-white/50 mt-1 font-light leading-relaxed truncate select-text">
                        {mem.value}
                      </span>
                    </div>
                  </div>

                  {/* Actions on file */}
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <span className="text-[7.5px] font-mono text-white/20 uppercase mr-2">{mem.timestamp}</span>
                    <button
                      onClick={() => handleDeleteMemory(mem.id, mem.key)}
                      className="opacity-0 group-hover:opacity-100 text-white/35 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info footer */}
        <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
          <span>COGNITIVE REGISTER STORAGE: 4/1000 NODES</span>
          <span>AUTOSYNC: ACTIVE</span>
        </div>

      </div>

      {/* Add Memory Register Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 select-none">
            <Plus className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">APPEND INDEX MEMORY</span>
          </div>

          <div className="flex flex-col gap-5">
            {/* explanation */}
            <div>
              <span className="font-mono text-[8.5px] text-[#4F8CFF] uppercase font-bold">COGNITIVE PIN</span>
              <p className="text-[10.5px] text-white/45 leading-relaxed font-light mt-1.5">
                Inject custom fact arrays or variable overrides directly. These form direct contexts inside the model's active reasoning pipeline.
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-mono text-white/30 uppercase font-bold">MEMORY ID KEY</span>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="E.g. preferred_naming_scheme"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 font-mono outline-none focus:border-[#4F8CFF]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-mono text-white/30 uppercase font-bold">MEMORY VALUE TARGET</span>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="E.g. Upper camelcase only"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 outline-none focus:border-[#4F8CFF]/40"
                />
              </div>
            </div>

            {/* Dynamic timeline list */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 font-mono text-[8px] text-white/35 flex flex-col gap-1.5">
              <span className="font-bold border-b border-white/5 pb-1">REASONING OVERLAY</span>
              <div className="flex justify-between mt-1">
                <span>MEM_OVERHEAD:</span>
                <span className="text-white/60 font-semibold">0.02 KB</span>
              </div>
              <div className="flex justify-between">
                <span>INJECTED PRIORITY:</span>
                <span className="text-white/60 font-semibold">HIGH CONTEXT HIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch button */}
        <button
          onClick={handleAddMemory}
          disabled={!newKey.trim() || !newValue.trim()}
          className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold hover:bg-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>SYNC MEMORY SYSTEM</span>
        </button>

      </div>

    </div>
  );
}
