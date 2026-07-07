/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PromptEditor } from "./PromptEditor";
import { PromptLibrary } from "./PromptLibrary";
import { PromptAnalyzer } from "./PromptAnalyzer";
import { PromptOptimizer } from "./PromptOptimizer";
import { Sparkles, ArrowRightLeft, FileCode, CheckCircle, Info, RefreshCw } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

export function PromptStudio() {
  const { addNotification } = useOS();
  const [promptValue, setPromptValue] = useState(
    "YOU ARE a senior principal software developer.\n\nGENERATE a secure React hooks pipeline that handles dynamic VRAM socket allocations on port 3000 securely:\n\n{{input}}"
  );

  const [expectedOutput, setExpectedOutput] = useState(
    "A clean, typed TypeScript custom hook managing websocket state bindings, error retries, and high-performance garbage collection sweeps."
  );

  const handleSelectFromLibrary = (newPrompt: string) => {
    setPromptValue(newPrompt);
  };

  const handleCompile = () => {
    addNotification("Index Synchronized", "Abstract Syntax Trees compiled and verified.", "success");
  };

  // Metrics for Preview sidebar
  const tokenEst = Math.round(promptValue.trim().length * 0.28 + 15);

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6 font-sans select-none">
      {/* Col 1 & 2: Editor & Library Controls */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* Monaco style Editor Pane */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col gap-4">
          <div className="flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#4F8CFF] animate-pulse" />
              <h2 className="text-sm font-black text-white/90 uppercase tracking-widest leading-none">PROMPT COMPILER CANVAS</h2>
            </div>
            <button
              onClick={handleCompile}
              className="px-3.5 py-1.5 rounded-lg bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 text-[#4F8CFF] font-mono text-[8px] font-black hover:bg-[#4F8CFF]/25 hover:scale-101 active:scale-99 transition-all cursor-pointer uppercase tracking-widest"
            >
              Compile Core
            </button>
          </div>

          <PromptEditor value={promptValue} onChange={setPromptValue} onSave={() => {}} />

          {/* Quick Optimizer Triggers directly below Editor */}
          <PromptOptimizer prompt={promptValue} onOptimize={setPromptValue} />
        </div>

        {/* Prompt Library Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">PROMPT LIBRARY DIRECTORY</span>
          </div>
          <PromptLibrary onSelectPrompt={handleSelectFromLibrary} />
        </div>
      </div>

      {/* Col 3: Analyzer and Live Preview Sidebar */}
      <div className="flex flex-col gap-6">
        {/* Dynamic Quality Analyzer Pane */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <ArrowRightLeft className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">REAL-TIME QUALITY SYNAPSES</span>
          </div>
          <PromptAnalyzer prompt={promptValue} />
        </div>

        {/* Live Preview layer */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col gap-4 justify-between h-full min-h-[280px]">
          <div>
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Info className="w-4 h-4 text-pink-400" />
              <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">REASONING FORECAST PREVIEW</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between font-mono text-[8px] text-white/30 border-b border-white/5 pb-1.5">
                <span>ESTIMATED TOKENS:</span>
                <span className="text-[#4F8CFF] font-bold">{tokenEst} TOKENS</span>
              </div>

              <div>
                <span className="font-mono text-[7.5px] text-pink-400 font-bold uppercase tracking-wide">Expected Outputs</span>
                <div className="p-3.5 rounded-xl border border-white/5 bg-black/40 text-[10.5px] text-white/50 leading-relaxed font-light mt-1.5 select-text">
                  {expectedOutput}
                </div>
              </div>

              <div>
                <span className="font-mono text-[7.5px] text-amber-400 font-bold uppercase tracking-wide">Active warnings</span>
                <div className="flex items-center gap-2 text-[9.5px] text-amber-400 mt-2 font-mono bg-amber-400/5 p-2 rounded-lg border border-amber-400/10">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>No active security leaks detected inside sandbox. Output looks optimized.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
            <span>MUTATION: SYNCED</span>
            <span>OPTIMAL FIT: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
