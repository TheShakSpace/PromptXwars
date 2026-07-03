/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useOS } from "../../../contexts/OSContext";
import { projectData } from "../../../data/projectData";
import { promptPresets } from "../../../data/promptPresets";
import { GlassCard } from "../../common/cards/GlassCard";
import { Button } from "../../common/buttons/Button";
import { FolderGit2, Cpu, Terminal, Sparkles, Send, RefreshCw, Layers, Compass, Code } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../utils/cn";

export function OSWorkspace() {
  const {
    activePreset,
    setActivePreset,
    activeModel,
    activeProjectId,
    setActiveProjectId,
    addNotification,
  } = useOS();

  const [promptText, setPromptText] = useState("");
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunTask = () => {
    if (!promptText.trim()) return;

    setIsLoading(true);
    setResponseLog(null);
    addNotification("Queueing Command", "Sending instruction pack to active Helios model routing...", "info");

    setTimeout(() => {
      setIsLoading(false);
      setResponseLog(
        `[HELIOS OPERATOR HANDSHAKE SUCCESS]
Model: ${activeModel}
System Instruction Set: "${activePreset.prompt}"
Query: "${promptText}"

[EXECUTION LOG]
- Handshake validated with 256-bit ECDSA keys.
- Cache hit: Semantic prompt framework context parsed.
- Synthesis: Task executed successfully inside Helios sandbox.
Result: Spatial parameters generated. Ready for backend hookup.`
      );
      addNotification("Routine Complete", "Helios workspace context processed successfully.", "success");
    }, 1200);
  };

  const activeProject = projectData.find((p) => p.id === activeProjectId) || projectData[0];

  return (
    <div id="workspace-layout" className="w-full max-w-6xl mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-4 gap-6 z-20 relative select-none">
      
      {/* 1. Left Hand directory / Threads List */}
      <div className="flex flex-col gap-4">
        {/* Workspace panel identifier */}
        <div className="glass-panel rounded-xl p-4 border-white/10 flex flex-col gap-3 shadow-md bg-white/[0.01]">
          <div className="flex items-center gap-2 text-white/40 font-mono text-[9px] tracking-widest uppercase">
            <FolderGit2 className="w-4 h-4 text-[#4F8CFF]" />
            <span>ACTIVE SYSTEM CORES</span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {projectData.map((project) => {
              const isSelected = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProjectId(project.id);
                    addNotification("Thread Swapped", `Focused operational thread: ${project.name}`, "info");
                  }}
                  className={cn(
                    "text-left p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center justify-between",
                    isSelected
                      ? "bg-white/5 border-white/20 text-white shadow-inner"
                      : "bg-transparent border-transparent text-white/45 hover:text-white/80 hover:bg-white/[0.01]"
                  )}
                >
                  <span className="truncate">{project.name}</span>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    project.status === "active" ? "bg-green-400 animate-pulse" : project.status === "queued" ? "bg-amber-400" : "bg-white/30"
                  )} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Project Details metadata */}
        <GlassCard className="p-4 flex flex-col gap-3 text-xs bg-white/[0.01] border-white/5" hoverGlow={false}>
          <div className="text-white/30 font-mono text-[9px] tracking-widest uppercase">
            METRICS LAYER
          </div>
          <div className="flex flex-col gap-2 font-sans">
            <div className="flex justify-between items-center text-white/50">
              <span>Category:</span>
              <span className="text-white/90 font-medium">{activeProject.category}</span>
            </div>
            <div className="flex justify-between items-center text-white/50">
              <span>Last Active:</span>
              <span className="text-white/90 font-medium">{activeProject.lastActive}</span>
            </div>
            <div className="flex justify-between items-center text-white/50">
              <span>Session Cost:</span>
              <span className="text-white/90 font-mono text-[10px] font-semibold">
                {(activeProject.tokensUsed / 1000).toFixed(1)}k tokens
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 2. Central Prompt Compiler Console area */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        
        {/* Core Prompt input Card */}
        <GlassCard className="p-6 flex flex-col gap-4" hoverGlow={true}>
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-[#4F8CFF] animate-pulse" />
              <span className="font-mono text-[10px] text-white/80 tracking-widest uppercase">
                COGNITIVE OPERATOR CONTROL
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md text-[9px] font-mono text-white/60 uppercase">
              <Cpu className="w-3 h-3 text-[#4F8CFF]" />
              <span>{activeModel}</span>
            </div>
          </div>

          {/* Quick preset indicators (re-linked) */}
          <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
            {promptPresets.map((p) => {
              const isSelected = activePreset.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePreset(p);
                    addNotification("Preset Changed", `Instruction active: ${p.name}`, "success");
                  }}
                  className={cn(
                    "font-mono text-[9px] px-3 py-1.5 rounded-full border cursor-pointer shrink-0 transition-all uppercase tracking-wide",
                    isSelected
                      ? "bg-[#4F8CFF]/15 border-[#4F8CFF]/40 text-[#4F8CFF]"
                      : "bg-white/5 border-white/5 text-white/40 hover:text-white/85"
                  )}
                >
                  {p.name.replace("Standard ", "")}
                </button>
              );
            })}
          </div>

          {/* Active System prompt banner block */}
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg flex flex-col gap-1 select-text">
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
              ACTIVE SYSTEM INSTRUCTIONS //
            </span>
            <p className="font-sans text-[11px] text-white/60 italic leading-relaxed">
              "{activePreset.prompt}"
            </p>
          </div>

          {/* Prompt Entry Box */}
          <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-lg focus-within:border-[#4F8CFF]/40 focus-within:shadow-[0_0_15px_rgba(79,140,255,0.1)] transition-all">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Write raw instruction parameters to execute against active models... (e.g. 'Synthesize shader coordinate algorithms')"
              className="w-full bg-transparent border-none outline-none p-4 pb-14 text-white text-xs font-sans placeholder-white/25 resize-none h-24 select-text"
              disabled={isLoading}
            />
            
            {/* Control buttons below text */}
            <div className="absolute bottom-3.5 right-4 flex items-center gap-3">
              <Button
                variant="accent"
                size="sm"
                glow
                onClick={handleRunTask}
                disabled={isLoading || !promptText.trim()}
                className="font-bold tracking-widest gap-1"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>EXECUTING...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>EXECUTE</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* 3. Output Synthesis Card log panel */}
        <AnimatePresence mode="wait">
          {responseLog && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6 bg-black/40 border-white/10 flex flex-col gap-4 font-mono select-text shadow-xl">
                <div className="flex items-center gap-2 text-white/40 font-mono text-[9px] tracking-widest uppercase border-b border-white/5 pb-2.5">
                  <Terminal className="w-4 h-4 text-[#22C55E]" />
                  <span>OUTPUT SYNTHESIS CHANNELS</span>
                </div>
                
                <pre className="text-[10px] md:text-xs text-white/80 leading-relaxed font-mono whitespace-pre-wrap">
                  {responseLog}
                </pre>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
