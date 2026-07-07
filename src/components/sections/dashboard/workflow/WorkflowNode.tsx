/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { type WorkflowNode } from "./types";
import { getNodeTemplateByType } from "./NodeLibrary";
import {
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Settings,
  Zap,
  Pause,
} from "lucide-react";

interface WorkflowNodeProps {
  node: WorkflowNode;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onStartDrag: (e: React.MouseEvent, id: string) => void;
  onPortMouseDown: (e: React.MouseEvent, id: string, portType: "source" | "target") => void;
}

export function WorkflowNode({
  node,
  isSelected,
  onClick,
  onStartDrag,
  onPortMouseDown,
}: WorkflowNodeProps) {
  const template = getNodeTemplateByType(node.type);
  const Icon = template.icon;

  // Derive status style details
  let statusColor = "text-white/40";
  let statusBg = "bg-white/5";
  let statusBorder = "border-white/5";
  let pulseBorder = false;

  switch (node.status) {
    case "running":
      statusColor = "text-[#3B82F6]";
      statusBg = "bg-[#3B82F6]/10";
      statusBorder = "border-[#3B82F6]/30";
      pulseBorder = true;
      break;
    case "completed":
      statusColor = "text-[#10B981]";
      statusBg = "bg-[#10B981]/10";
      statusBorder = "border-[#10B981]/30";
      break;
    case "error":
      statusColor = "text-[#EF4444]";
      statusBg = "bg-[#EF4444]/10";
      statusBorder = "border-[#EF4444]/30";
      break;
    case "waiting":
      statusColor = "text-[#F59E0B]";
      statusBg = "bg-[#F59E0B]/10";
      statusBorder = "border-[#F59E0B]/30";
      break;
    case "queued":
      statusColor = "text-[#A855F7]";
      statusBg = "bg-[#A855F7]/10";
      statusBorder = "border-[#A855F7]/30";
      break;
    case "paused":
      statusColor = "text-white/60";
      statusBg = "bg-white/10";
      statusBorder = "border-white/20";
      break;
  }

  return (
    <motion.div
      onClick={onClick}
      style={{
        left: node.x,
        top: node.y,
        boxShadow: isSelected
          ? `0 0 25px ${template.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
          : node.status === "running"
          ? `0 0 20px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
        borderColor: isSelected
          ? template.color
          : node.status === "running"
          ? "#3B82F6"
          : "rgba(255,255,255,0.08)",
      }}
      className={`absolute w-64 rounded-2xl border bg-[#050505]/80 backdrop-blur-xl p-4 transition-shadow duration-300 select-none ${
        isSelected ? "z-20 border-opacity-100" : "z-10"
      }`}
    >
      {/* Node Drag Handle */}
      <div
        onMouseDown={(e) => onStartDrag(e, node.id)}
        className="absolute top-0 left-0 right-0 h-4 cursor-grab active:cursor-grabbing rounded-t-2xl flex items-center justify-center group"
      >
        <div className="w-10 h-1 rounded bg-white/10 group-hover:bg-white/30 transition-colors mt-1.5" />
      </div>

      {/* Inputs/Outputs Connection Ports (Anchors) */}
      {/* Target Port (Left) */}
      {node.type !== "input" && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            onPortMouseDown(e, node.id, "target");
          }}
          title="Input Target Port"
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-white/20 hover:border-[#10B981] hover:scale-125 transition-all cursor-crosshair flex items-center justify-center z-30"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-[#10B981]" />
        </div>
      )}

      {/* Source Port (Right) */}
      {node.type !== "output" && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            onPortMouseDown(e, node.id, "source");
          }}
          title="Output Source Port"
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-white/20 hover:border-[#A855F7] hover:scale-125 transition-all cursor-crosshair flex items-center justify-center z-30"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-[#A855F7]" />
        </div>
      )}

      {/* Main Content Info */}
      <div className="flex items-start gap-3 mt-1.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5"
          style={{
            backgroundColor: `${template.color}10`,
            borderColor: `${template.color}30`,
            color: template.color,
          }}
        >
          {node.status === "running" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-[7px] font-mono font-black uppercase tracking-widest"
              style={{ color: template.color }}
            >
              {node.type}
            </span>

            {/* Runtime Indicator */}
            {node.runtime !== undefined && (
              <span className="font-mono text-[7px] text-white/30 flex items-center gap-0.5">
                <Clock className="w-2 h-2" />
                {node.runtime}ms
              </span>
            )}
          </div>

          <h4 className="text-[11.5px] font-bold text-white tracking-wide truncate mt-0.5">
            {node.name}
          </h4>

          <p className="text-[9px] text-white/40 leading-snug mt-1 line-clamp-2">
            {node.description}
          </p>
        </div>
      </div>

      {/* Progress or Execution Bar */}
      {node.status === "running" && (
        <div className="mt-3.5 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[7.5px] font-mono text-[#3B82F6] font-bold">
            <span>EXECUTING OPERATOR...</span>
            <span>{Math.round(node.progress)}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${node.progress}%` }}
              transition={{ ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A855F7] rounded-full"
            />
          </div>
        </div>
      )}

      {node.status === "completed" && (
        <div className="mt-3.5 flex items-center justify-between text-[7px] font-mono text-[#10B981] font-bold bg-[#10B981]/5 border border-[#10B981]/15 px-2 py-1 rounded-lg">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" />
            COMPLETED SUCCESS
          </span>
          <span>100%</span>
        </div>
      )}

      {node.status === "error" && (
        <div className="mt-3.5 flex items-center justify-between text-[7px] font-mono text-[#EF4444] font-bold bg-[#EF4444]/5 border border-[#EF4444]/15 px-2 py-1 rounded-lg">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" />
            EXECUTION FAILED
          </span>
          <span>ERR</span>
        </div>
      )}

      {node.status === "waiting" && (
        <div className="mt-3.5 flex items-center justify-between text-[7px] font-mono text-[#F59E0B] font-bold bg-[#F59E0B]/5 border border-[#F59E0B]/15 px-2 py-1 rounded-lg">
          <span className="flex items-center gap-1">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            WAITING DEPS...
          </span>
          <span>STALL</span>
        </div>
      )}

      {node.status === "paused" && (
        <div className="mt-3.5 flex items-center justify-between text-[7px] font-mono text-white/50 font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
          <span className="flex items-center gap-1">
            <Pause className="w-2.5 h-2.5" />
            STALL PAUSED
          </span>
          <span>HOLD</span>
        </div>
      )}

      {/* Decorative tiny status code */}
      <div className="mt-2.5 border-t border-white/5 pt-1.5 flex justify-between font-mono text-[6.5px] text-white/20">
        <span>S_CODE: 0x{node.id.split("-")[1]?.substring(0, 4) || "F83D"}</span>
        <span>FLOW: READY</span>
      </div>
    </motion.div>
  );
}
