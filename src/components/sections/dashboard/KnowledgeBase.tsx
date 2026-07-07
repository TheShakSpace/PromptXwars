/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Database, Search, FolderOpen, Tag, Info, FileText, ArrowUpRight, HelpCircle } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

interface KnowledgeItem {
  id: string;
  title: string;
  category: "Architecture" | "Security" | "Guides" | "Blueprints";
  excerpt: string;
  content: string;
  tags: string[];
  lastUpdated: string;
}

export function KnowledgeBase() {
  const { addNotification } = useOS();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>("kn-1");

  const [items, setItems] = useState<KnowledgeItem[]>([
    {
      id: "kn-1",
      title: "Helios Autopilot Communication Gateway",
      category: "Architecture",
      excerpt: "Explains how core node messages bind on localhost:3000 securely utilizing ECDSA keys.",
      content: "This guide details the architectural specs of the Helios OS communication mesh. Every packet exchanged between client side contexts and model handlers undergoes real-time asymmetric signing with a 256-bit ECDSA cryptographic wrapper. Sockets listen strictly on port 3000 to prevent outside network intrusions, and are proxied via standard Nginx gateway limits.",
      tags: ["Port 3000", "ECDSA", "Nginx"],
      lastUpdated: "Today",
    },
    {
      id: "kn-2",
      title: "Model Telemetry Security Guidelines",
      category: "Security",
      excerpt: "Essential rules ensuring model keys are isolated and kept server-side in enterprise nodes.",
      content: "To guarantee zero token exposure, secret environment keys (such as the primary Gemini API key) must strictly reside server-side, never rendering on browser contexts. Any data proxying must occur through authorized api endpoints. Local client caches may store transient state, but must clear on socket close.",
      tags: ["Secret Keys", "Isolation", "API Router"],
      lastUpdated: "3d ago",
    },
    {
      id: "kn-3",
      title: "Prompt Engineering Structured Directives",
      category: "Guides",
      excerpt: "Standard blueprints on incorporating template variables and context tags for models.",
      content: "Structuring clear templates with precise double curly brace variables (e.g. {{input}}) triggers semantic optimization within model compilation matrices. Including clear persona definitions, output format constraints (like JSON schematization), and reasoning checkpoints guarantees up to 40% reduction in logic hallucination rates.",
      tags: ["Directives", "JSON schema", "Prompting"],
      lastUpdated: "Jul 01, 2026",
    },
    {
      id: "kn-4",
      title: "Multi-Agent Workflow Pipelines",
      category: "Blueprints",
      excerpt: "Workflow blueprints explaining research-to-reviewer automation structures.",
      content: "This blueprint details how 5 unique agent identities coordinate automatically under a unified scheduling planner. Tasks flow step-by-step from researcher to logic auditor, ensuring every intermediate output complies with rigorous code formatting and syntax standards before final commit triggers.",
      tags: ["Workflows", "Multi-Agent", "Planners"],
      lastUpdated: "1w ago",
    },
  ]);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const selectedItem = items.find((i) => i.id === selectedItemId);

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      
      {/* Directory & Search section */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[420px]">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-[#3B82F6]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">KNOWLEDGE BLUEPRINTS</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 mb-4 focus-within:border-[#3B82F6]/30 transition-all">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library documents, guides, blueprints..."
              className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/20"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 pb-3.5 mb-4 border-b border-white/5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                selectedCategory === null
                  ? "bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6]"
                  : "bg-white/5 border border-transparent text-white/40 hover:text-white"
              }`}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6]"
                    : "bg-white/5 border border-transparent text-white/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {filteredItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative cursor-pointer group ${
                    isSelected
                      ? "bg-white/5 border-[#3B82F6]/30 shadow-inner"
                      : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[7px] text-white/30 border border-white/5 bg-white/5 px-1.5 py-0.5 rounded leading-none">
                        {item.category.toUpperCase()}
                      </span>
                      <span className="text-[7.5px] font-mono text-white/20 uppercase">{item.lastUpdated}</span>
                    </div>

                    <h4 className="text-xs font-black text-white/95 leading-tight group-hover:text-[#3B82F6] transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-white/40 mt-1.5 leading-normal font-light line-clamp-2 font-sans">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 items-center border-t border-white/5 pt-2">
                    {item.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[7px] font-mono text-white/35 uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
          <span>LIBRARY CAPACITY: 4/1000 DOCS</span>
          <span>INTELLIGENCE SYNC: OK</span>
        </div>

      </div>

      {/* Document preview block */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between min-h-[350px]">
        {selectedItem ? (
          <div className="flex flex-col gap-5 select-none h-full">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <FileText className="w-4 h-4 text-[#3B82F6]" />
              <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">LIBRARY PREVIEW LAYER</span>
            </div>

            <div>
              <span className="font-mono text-[8px] text-[#3B82F6] uppercase font-bold">{selectedItem.category} Blueprint</span>
              <h4 className="font-sans font-black text-sm text-white/95 mt-1">{selectedItem.title}</h4>
              <p className="font-mono text-[9px] text-white/40 mt-1 uppercase">LAST RE-INDEXED: {selectedItem.lastUpdated}</p>
            </div>

            <div className="bg-black/50 border border-white/5 rounded-2xl p-4 font-sans text-xs text-white/55 leading-relaxed font-light overflow-y-auto max-h-48 scrollbar-thin select-text">
              {selectedItem.content}
            </div>

            <button
              onClick={() => addNotification("Resource Index Started", `Re-parsing file AST: ${selectedItem.title}`, "info")}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
            >
              <span>INJECT INTO ACTIVE CONTEXT</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#3B82F6]" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-3 select-none text-white/30 h-full">
            <HelpCircle className="w-8 h-8" />
            <span className="font-mono text-[9px] tracking-widest uppercase font-bold">SELECT BLUEPRINT TO PREVIEW</span>
          </div>
        )}

        {selectedItem && (
          <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
            <span>MUTATION STATUS: ACTIVE</span>
            <span>PARSE INTEGRITY: 100%</span>
          </div>
        )}
      </div>

    </div>
  );
}
