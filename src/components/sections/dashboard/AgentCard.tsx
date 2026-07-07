/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Radio, CheckCircle, RefreshCw, Layers } from "lucide-react";

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
  status: "idle" | "processing" | "completed";
  currentTask: string;
  intelligence: string;
}

interface AgentCardProps {
  agent: AgentConfig;
  isActive?: boolean;
  onClick?: () => void;
}

export function AgentCard({ agent, isActive, onClick }: AgentCardProps) {
  const getStatusBadge = () => {
    switch (agent.status) {
      case "completed":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[7px] font-extrabold text-green-400 bg-green-400/5 px-2 py-0.5 rounded border border-green-400/10 uppercase tracking-widest leading-none">
            <CheckCircle className="w-2.5 h-2.5" />
            <span>STANDBY</span>
          </span>
        );
      case "processing":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[7px] font-extrabold text-[#4F8CFF] bg-[#4F8CFF]/5 px-2 py-0.5 rounded border border-[#4F8CFF]/10 uppercase tracking-widest leading-none">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>ACTIVE INDEXING</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 font-mono text-[7px] font-extrabold text-white/30 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest leading-none">
            <Radio className="w-2.5 h-2.5" />
            <span>STANDBY</span>
          </span>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all duration-300 select-none cursor-pointer flex flex-col justify-between h-52 relative overflow-hidden group ${
        isActive
          ? "bg-white/5 border-white/20 shadow-[inset_0_1px_20px_rgba(255,255,255,0.05)]"
          : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
      }`}
    >
      {/* Background soft lighting glow matching agent theme */}
      <div
        className="absolute -right-12 -top-12 w-28 h-28 rounded-full blur-[45px] opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: agent.color }}
      />

      <div>
        {/* Core avatar & status indicator */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border font-sans select-none"
              style={{
                borderColor: `${agent.color}30`,
                background: `${agent.color}10`,
                color: agent.color,
              }}
            >
              {agent.avatar}
            </div>

            <div className="flex flex-col">
              <span className="text-[12px] font-black text-white/90 leading-tight">{agent.name}</span>
              <span className="font-mono text-[8px] text-white/35 mt-0.5 uppercase tracking-wider">{agent.role}</span>
            </div>
          </div>

          {getStatusBadge()}
        </div>

        {/* Descriptive details */}
        <p className="text-[10.5px] text-white/45 mt-4 leading-relaxed font-light font-sans line-clamp-2">
          {agent.description}
        </p>
      </div>

      {/* Task indicators */}
      <div className="border-t border-white/5 pt-3 mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[7px] text-white/25 uppercase tracking-widest font-bold">CURRENT PIPELINE TASK</span>
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-mono text-white/70 truncate pr-4 leading-none">{agent.currentTask}</span>
          <span className="text-[7.5px] font-mono text-white/30 shrink-0 uppercase">{agent.intelligence}</span>
        </div>
      </div>
    </div>
  );
}
