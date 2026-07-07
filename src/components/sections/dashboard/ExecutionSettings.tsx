/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sliders, HelpCircle, ToggleLeft, ToggleRight, Check } from "lucide-react";

export interface SystemExecutionSettings {
  concurrency: number;
  maxRetries: number;
  timeoutSeconds: number;
  streamingEnabled: boolean;
  heapAllocationLimitMb: number;
  fallbackEnabled: boolean;
}

interface ExecutionSettingsProps {
  onSettingsChange?: (settings: SystemExecutionSettings) => void;
}

export function ExecutionSettings({ onSettingsChange }: ExecutionSettingsProps) {
  const [settings, setSettings] = useState<SystemExecutionSettings>({
    concurrency: 2,
    maxRetries: 3,
    timeoutSeconds: 30,
    streamingEnabled: true,
    heapAllocationLimitMb: 512,
    fallbackEnabled: true,
  });

  const [saved, setSaved] = useState(false);

  const handleUpdate = (updates: Partial<SystemExecutionSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    if (onSettingsChange) {
      onSettingsChange(updated);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden flex flex-col gap-4 text-left font-sans">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-[45px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#A855F7]" />
          <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
            EXECUTION PIPELINE PARAMETERS
          </span>
        </div>
        {saved && (
          <span className="flex items-center gap-1 font-mono text-[8.5px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-md">
            <Check className="w-3 h-3" /> SETTINGS_APPLIED
          </span>
        )}
      </div>

      {/* Settings inputs */}
      <div className="flex flex-col gap-4.5">
        
        {/* Concurrency Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white/80">Task Concurrency</span>
            <span className="text-[9.5px] text-white/40">Max parallel execution threads</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-xl p-0.5">
            {[1, 2, 4, 8].map((num) => (
              <button
                key={num}
                onClick={() => handleUpdate({ concurrency: num })}
                className={`px-3 py-1 text-[9.5px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  settings.concurrency === num
                    ? "bg-[#A855F7] text-white shadow-md"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {num}x
              </button>
            ))}
          </div>
        </div>

        {/* Retry Limit */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white/80">Auto-Retry Threshold</span>
            <span className="text-[9.5px] text-white/40">Attempts before rollback trigger</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-xl p-0.5">
            {[1, 2, 3, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleUpdate({ maxRetries: num })}
                className={`px-3 py-1 text-[9.5px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  settings.maxRetries === num
                    ? "bg-[#A855F7] text-white"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Timeout Limit slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white/80">Timeout Limits</span>
              <span className="text-[9.5px] text-white/40">Aborts frozen threads after delay</span>
            </div>
            <span className="text-[10px] font-mono text-[#A855F7] font-bold">{settings.timeoutSeconds}s</span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={settings.timeoutSeconds}
            onChange={(e) => handleUpdate({ timeoutSeconds: parseInt(e.target.value) })}
            className="w-full accent-[#A855F7] bg-white/5 h-1 rounded-lg outline-none cursor-pointer"
          />
        </div>

        {/* Token Streaming switch */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white/80">Real-Time Token Streaming</span>
            <span className="text-[9.5px] text-white/40">Streams model tokens on generation</span>
          </div>
          <button
            onClick={() => handleUpdate({ streamingEnabled: !settings.streamingEnabled })}
            className="text-white/80 cursor-pointer"
          >
            {settings.streamingEnabled ? (
              <ToggleRight className="w-7 h-7 text-[#A855F7]" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-white/30" />
            )}
          </button>
        </div>

        {/* Fallback Switch */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white/80">Automatic Model Failover</span>
            <span className="text-[9.5px] text-white/40">Swaps to fallback node on error</span>
          </div>
          <button
            onClick={() => handleUpdate({ fallbackEnabled: !settings.fallbackEnabled })}
            className="text-white/80 cursor-pointer"
          >
            {settings.fallbackEnabled ? (
              <ToggleRight className="w-7 h-7 text-[#A855F7]" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-white/30" />
            )}
          </button>
        </div>

        {/* Heap limit Selector */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white/80">Sandbox Heap Bound</span>
            <span className="text-[9.5px] text-white/40">Virtual V8 sandbox heap capacity</span>
          </div>
          <select
            value={settings.heapAllocationLimitMb}
            onChange={(e) => handleUpdate({ heapAllocationLimitMb: parseInt(e.target.value) })}
            className="bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1 text-[10px] font-mono text-white/70 outline-none"
          >
            <option value={128}>128 MB</option>
            <option value={256}>256 MB</option>
            <option value={512}>512 MB</option>
            <option value={1024}>1024 MB</option>
          </select>
        </div>

      </div>

    </div>
  );
}
