/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Search, Eye, FileSearch, Database, Zap, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { NodeType } from "./types";

interface ToolExecutionProps {
  activeNodeType: NodeType | null;
  isRunning: boolean;
}

export function ToolExecution({ activeNodeType, isRunning }: ToolExecutionProps) {
  const tools = [
    {
      id: "search",
      label: "Web Search Engine",
      nodeType: "retriever" as NodeType,
      icon: Search,
      color: "#3B82F6",
      desc: "Queries real-time web indexes & parses HTML sources.",
    },
    {
      id: "vision",
      label: "Vision Processor",
      nodeType: "vision" as NodeType,
      icon: Eye,
      color: "#EC4899",
      desc: "Runs CNN classification & boundary layout detection.",
    },
    {
      id: "ocr",
      label: "OCR File Reader",
      nodeType: "ocr" as NodeType,
      icon: FileSearch,
      color: "#0EA5E9",
      desc: "Extracts deep layout nodes from multi-page PDFs.",
    },
    {
      id: "database",
      label: "SQL DBMS Connector",
      nodeType: "database" as NodeType,
      icon: Database,
      color: "#10B981",
      desc: "Executes parameterized transaction mutations.",
    },
    {
      id: "automation",
      label: "Webhook Event Dispatch",
      nodeType: "automation" as NodeType,
      icon: Zap,
      color: "#F59E0B",
      desc: "Pipes state JSON payloads to custom CRM receivers.",
    },
    {
      id: "api",
      label: "REST API Endpoint",
      nodeType: "api" as NodeType,
      icon: Globe,
      color: "#D946EF",
      desc: "Interchanges headers & auth tokens via HTTPS protocols.",
    },
  ];

  return (
    <div className="flex flex-col gap-4 select-none pr-1">
      <div className="border-b border-white/5 pb-2">
        <h3 className="font-mono text-[9px] text-[#22C55E] tracking-widest uppercase font-black flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#22C55E]" />
          ACTIVE TOOL REGISTRY
        </h3>
        <p className="text-[10px] text-white/40 mt-0.5">Live-trigger system execution sandboxes</p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 mt-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = isRunning && activeNodeType === tool.nodeType;

          return (
            <motion.div
              key={tool.id}
              style={{
                borderColor: isActive ? tool.color : "rgba(255, 255, 255, 0.05)",
                boxShadow: isActive ? `0 0 15px ${tool.color}25` : undefined,
                backgroundColor: isActive ? `${tool.color}05` : "rgba(5, 5, 5, 0.35)",
              }}
              className="flex items-start p-3 rounded-xl border transition-all duration-300 relative overflow-hidden"
            >
              {/* Spinning background halo */}
              {isActive && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.01)_80%)] pointer-events-none" />
              )}

              {/* Icon Container */}
              <div
                style={{
                  backgroundColor: `${tool.color}10`,
                  borderColor: isActive ? tool.color : `${tool.color}25`,
                  color: tool.color,
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 border transition-all duration-300"
              >
                {isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-white/90 truncate">
                    {tool.label}
                  </span>

                  {/* Status badge */}
                  {isActive ? (
                    <span
                      style={{ color: tool.color }}
                      className="font-mono text-[7px] font-bold tracking-widest uppercase animate-pulse shrink-0"
                    >
                      INVOKING...
                    </span>
                  ) : (
                    <span className="font-mono text-[7px] text-white/20 shrink-0 uppercase">
                      STANDBY
                    </span>
                  )}
                </div>
                <p className="text-[8.5px] text-white/35 leading-snug mt-0.5 truncate">
                  {tool.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
