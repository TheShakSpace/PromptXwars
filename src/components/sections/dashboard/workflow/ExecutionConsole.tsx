/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { TerminalLog } from "./types";
import { Terminal, Trash2, ChevronUp, ChevronDown, Download, Copy } from "lucide-react";

interface ExecutionConsoleProps {
  logs: TerminalLog[];
  onClear: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function ExecutionConsole({
  logs,
  onClear,
  isExpanded,
  onToggleExpanded,
}: ExecutionConsoleProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isExpanded]);

  const getLogTypeStyles = (type: TerminalLog["type"]) => {
    switch (type) {
      case "success":
        return { text: "text-[#10B981]", bg: "bg-[#10B981]/10", tag: "SUCCESS" };
      case "warning":
        return { text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", tag: "WARN" };
      case "error":
        return { text: "text-[#EF4444]", bg: "bg-[#EF4444]/10", tag: "ERROR" };
      case "debug":
        return { text: "text-[#A855F7]", bg: "bg-[#A855F7]/10", tag: "DEBUG" };
      default:
        return { text: "text-white/60", bg: "bg-white/5", tag: "INFO" };
    }
  };

  const handleCopyLogs = () => {
    const rawText = logs
      .map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`)
      .join("\n");
    navigator.clipboard.writeText(rawText);
  };

  return (
    <div
      className={`glass-panel border border-white/5 bg-[#030303]/90 backdrop-blur-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 shadow-2xl ${
        isExpanded ? "h-64" : "h-12"
      }`}
    >
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 h-12 shrink-0 border-b border-white/5 select-none bg-black/40">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#10B981]" />
          <span className="font-mono text-[9px] text-[#10B981] tracking-widest uppercase font-black">
            SYSTEM EXECUTION CONSOLE
          </span>
          <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-bold">
            LIVE FEED
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {isExpanded && (
            <>
              {/* Copy logs */}
              <button
                onClick={handleCopyLogs}
                title="Copy Terminal Logs"
                className="p-1 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <Copy className="w-3 h-3" />
              </button>

              {/* Clear logs */}
              <button
                onClick={onClear}
                title="Clear Logs"
                className="p-1 rounded text-white/40 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}

          {/* Toggle Expand */}
          <button
            onClick={onToggleExpanded}
            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Content Screen */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[9.5px] leading-relaxed flex flex-col gap-1.5 bg-[#020202]/95 selection:bg-[#10B981]/30 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 gap-2 text-white/25 h-full">
              <Terminal className="w-6 h-6 animate-pulse" />
              <span>STATION IDLE — PIPELINE READY FOR COMPILATION</span>
            </div>
          ) : (
            logs.map((log) => {
              const styles = getLogTypeStyles(log.type);
              return (
                <div key={log.id} className="flex items-start gap-2.5 group">
                  {/* Timestamp */}
                  <span className="text-white/20 select-none font-light">
                    {log.timestamp}
                  </span>

                  {/* Type Tag */}
                  <span
                    className={`text-[7px] font-bold px-1 rounded shrink-0 select-none tracking-wider ${styles.text} ${styles.bg}`}
                    style={{ minWidth: "44px", textAlign: "center" }}
                  >
                    {styles.tag}
                  </span>

                  {/* Message body */}
                  <span className={`flex-1 break-all ${styles.text} font-medium`}>
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
          <div ref={terminalEndRef} />
        </div>
      )}
    </div>
  );
}
