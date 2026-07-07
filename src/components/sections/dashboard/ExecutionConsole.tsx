/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Copy, Check, CircleDot, PlayCircle } from "lucide-react";
import { globalExecutionManager, ExecutionSession } from "../../../core/ExecutionManager";

export function ExecutionConsole() {
  const [session, setSession] = useState<ExecutionSession | null>(null);
  const [copied, setCopied] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = globalExecutionManager.subscribe((activeSession) => {
      setSession(activeSession ? { ...activeSession } : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Scroll to bottom on log additions
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [session?.logs?.length]);

  const handleCopyLogs = () => {
    if (!session?.logs) return;
    const text = session.logs.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockPreLogs = [
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Cognitive Operating System Shell online. Ready.`,
    `[${new Date().toLocaleTimeString()}] [MONITOR] Port 3000 bound. Active routing loops nominal.`,
    `[${new Date().toLocaleTimeString()}] [SANDBOX] Redundant WebGL safety buffer activated.`
  ];

  const logsToRender = session ? session.logs : mockPreLogs;

  return (
    <div className="glass-panel rounded-2xl border border-white/5 bg-neutral-950 flex flex-col font-mono text-[9.5px] text-zinc-400 h-[280px] text-left relative overflow-hidden">
      
      {/* Console Topbar */}
      <div className="flex items-center justify-between bg-zinc-900/50 border-b border-white/5 px-4 py-2 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="font-bold text-zinc-300 tracking-wider">HELIOS_AUTONOMOUS_SHELL_v1.5</span>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-1 text-[8px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
              <CircleDot className="w-2.5 h-2.5 animate-ping" />
              STATUS: {session.status.toUpperCase()}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[8px] font-bold text-zinc-500 bg-zinc-500/10 px-1.5 py-0.5 rounded">
              <PlayCircle className="w-2.5 h-2.5" />
              CONSOLE: IDLE
            </div>
          )}

          {session && (
            <button
              onClick={handleCopyLogs}
              className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Log Box */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar scrollbar-thin flex flex-col gap-1.5 leading-relaxed bg-[#020202]">
        {logsToRender.map((log, index) => {
          let colorClass = "text-zinc-400";
          if (log.includes("[SYSTEM]")) colorClass = "text-[#3B82F6] font-bold";
          else if (log.includes("Detecting") || log.includes("Task Decomposition")) colorClass = "text-emerald-400";
          else if (log.includes("Routing") || log.includes("Reasoning")) colorClass = "text-purple-400";
          else if (log.includes("Validating") || log.includes("checking")) colorClass = "text-yellow-400";
          else if (log.includes("error") || log.includes("Critical")) colorClass = "text-rose-400 font-bold";

          return (
            <div key={index} className={`whitespace-pre-wrap ${colorClass}`}>
              {log}
            </div>
          );
        })}
        <div ref={consoleEndRef} />
      </div>

    </div>
  );
}
