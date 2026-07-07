/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Star, FolderOpen, Tag, Plus, Check, Play } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

interface PromptItem {
  id: string;
  title: string;
  category: string;
  prompt: string;
  tokens: string;
  isFavorite: boolean;
  tags: string[];
}

interface PromptLibraryProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptLibrary({ onSelectPrompt }: PromptLibraryProps) {
  const { addNotification } = useOS();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [prompts, setPrompts] = useState<PromptItem[]>([
    {
      id: "lib-1",
      title: "Abstract Code Analyzer",
      category: "Code",
      prompt: "Deconstruct the provided {{input}} into its architectural design. Outline details for execution, memory efficiency, and prospective race conditions, with optimized TypeScript code alternatives.",
      tokens: "~350 tokens",
      isFavorite: true,
      tags: ["TypeScript", "Optimization", "Audit"],
    },
    {
      id: "lib-2",
      title: "Scientific Reasoning Loop",
      category: "Logic",
      prompt: "Execute a chain-of-thought analysis step-by-step for the following problem: {{input}}. Formulate initial hypotheses, challenge assertions, and state confidence ratings for final deductions.",
      tokens: "~420 tokens",
      isFavorite: false,
      tags: ["Chain of Thought", "Scientific Method"],
    },
    {
      id: "lib-3",
      title: "High-Converting Sales Copywriter",
      category: "Marketing",
      prompt: "Draft high-converting landing page copywriting for {{input}} adhering to the AIDA (Attention, Interest, Desire, Action) marketing funnel. Maintain a highly professional and persuasive corporate tone.",
      tokens: "~280 tokens",
      isFavorite: true,
      tags: ["Conversion", "Copywriting", "AIDA"],
    },
    {
      id: "lib-4",
      title: "OCR Entity Data Structurer",
      category: "Data",
      prompt: "Parse the following raw text OCR snippet: {{input}}. Normalize dates, numbers, and currency nodes into a highly structured JSON entity format matching standard schema blueprints.",
      tokens: "~210 tokens",
      isFavorite: false,
      tags: ["OCR", "JSON Structuring", "Regex"],
    },
    {
      id: "lib-5",
      title: "Strategic Workflow Roadmap",
      category: "Planning",
      prompt: "Build an step-by-step project deployment outline for: {{input}}. Outline critical paths, external API resource dependencies, and mitigate bottleneck risks with standard fallbacks.",
      tokens: "~550 tokens",
      isFavorite: false,
      tags: ["Project Management", "Gantt Planning"],
    }
  ]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrompts(prompts.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)));
    const item = prompts.find((p) => p.id === id);
    if (item) {
      addNotification("Library Updated", `${item.title} ${!item.isFavorite ? "added to favorites" : "removed from favorites"}.`, "success");
    }
  };

  const categories = Array.from(new Set(prompts.map((p) => p.category)));

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full select-none font-sans">
      {/* Search Header */}
      <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 mb-4 focus-within:border-[#4F8CFF]/30 transition-all">
        <Search className="w-4 h-4 text-white/30 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search collections, templates, tags..."
          className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/20"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 pb-3.5 mb-2 overflow-x-auto no-scrollbar border-b border-white/5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
            selectedCategory === null
              ? "bg-[#4F8CFF]/10 border border-[#4F8CFF]/30 text-[#4F8CFF]"
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
                ? "bg-[#4F8CFF]/10 border border-[#4F8CFF]/30 text-[#4F8CFF]"
                : "bg-white/5 border border-transparent text-white/40 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompt Items Grid/Stack */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[300px] pr-1.5 scrollbar-thin">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12 text-white/20 text-xs italic font-mono">
            No matching prompt directives found.
          </div>
        ) : (
          filteredPrompts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectPrompt(p.prompt);
                addNotification("Prompt Selected", `Injected: ${p.title}`, "info");
              }}
              className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer flex flex-col gap-2.5 group relative"
            >
              {/* Info Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-white/30 group-hover:text-[#4F8CFF] transition-colors" />
                  <span className="text-xs font-bold text-white/90 leading-none">{p.title}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest">{p.tokens}</span>
                  <button
                    onClick={(e) => toggleFavorite(p.id, e)}
                    className="p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 transition-colors ${
                        p.isFavorite ? "text-amber-400 fill-amber-400" : "text-white/20 hover:text-amber-400"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Snippet text */}
              <p className="text-[10.5px] text-white/40 leading-normal line-clamp-2 italic font-light font-sans group-hover:text-white/60 transition-colors">
                "{p.prompt}"
              </p>

              {/* Tags block */}
              <div className="flex flex-wrap gap-1 items-center mt-1">
                <Tag className="w-2.5 h-2.5 text-white/20 mr-1" />
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[7px] font-mono text-white/35 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover Quick Play trigger */}
              <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 text-[#4F8CFF] transition-all transform scale-95 group-hover:scale-100">
                <Play className="w-3 h-3 fill-[#4F8CFF]" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
