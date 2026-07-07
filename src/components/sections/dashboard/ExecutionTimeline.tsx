/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { History, Search, Download, Trash2, ArrowUpRight, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { globalExecutionHistory, ExecutionRecord } from "../../../core/ExecutionHistory";

interface ExecutionTimelineProps {
  onReplayRequest?: (prompt: string) => void;
}

export function ExecutionTimeline({ onReplayRequest }: ExecutionTimelineProps) {
  const [historyRecords, setHistoryRecords] = useState<ExecutionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>("all");

  useEffect(() => {
    // Subscribe to global history updates
    const unsubscribe = globalExecutionHistory.subscribe((recs) => {
      setHistoryRecords([...recs]);
    });
    return unsubscribe;
  }, []);

  const filteredRecords = historyRecords.filter((rec) => {
    const matchesSearch =
      rec.userPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.completion.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustryFilter === "all" || rec.industry === selectedIndustryFilter;
    return matchesSearch && matchesIndustry;
  });

  const handleClear = () => {
    globalExecutionHistory.clear();
  };

  const exportJSON = (rec: ExecutionRecord) => {
    const blob = new Blob([JSON.stringify(rec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `helios-execution-${rec.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden flex flex-col gap-4 text-left font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#F43F5E]" />
          <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
            HISTORIC COGNITIVE TIMELINE
          </span>
        </div>
        {historyRecords.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[8.5px] font-mono text-white/30 hover:text-rose-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> CLEAR_ALL
          </button>
        )}
      </div>

      {/* Query Filters */}
      <div className="flex gap-2 items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search queries or outputs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white outline-none placeholder-white/20 focus:border-white/10"
          />
        </div>

        {/* Industry Filter dropdown */}
        <select
          value={selectedIndustryFilter}
          onChange={(e) => setSelectedIndustryFilter(e.target.value)}
          className="bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs text-white/70 outline-none"
        >
          <option value="all">All Industries</option>
          <option value="clinical">Clinical</option>
          <option value="finance">Finance</option>
          <option value="legal">Legal</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Historic Records */}
      <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto no-scrollbar scrollbar-thin">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-white/25 text-[11px] font-light">
            No previous execution dispatches match filters. Run a new chat query to populate the workspace timeline.
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-2 relative group hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[8px] text-white/30 tracking-wider uppercase font-bold px-1.5 py-0.5 rounded bg-white/5">
                    {rec.industry.toUpperCase()} VERTICAL
                  </span>
                  <p className="text-[11px] text-white/80 font-medium mt-1.5 leading-relaxed">
                    {rec.userPrompt}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onReplayRequest && (
                    <button
                      onClick={() => onReplayRequest(rec.userPrompt)}
                      title="Replay Prompt"
                      className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => exportJSON(rec)}
                    title="Export JSON"
                    className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3 mt-1 border-t border-white/5 pt-2 text-[8.5px] font-mono text-white/35">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {rec.selectedAgent.name}
                </span>
                <span>•</span>
                <span>{(rec.totalDurationMs / 1000).toFixed(2)}s runtime</span>
                <span>•</span>
                <span>{rec.totalTokensUsed.toLocaleString()} tokens</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">${rec.totalCost.toFixed(6)}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
