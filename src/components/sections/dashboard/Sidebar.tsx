/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { 
  LayoutDashboard, Compass, Briefcase, MessageSquareText, 
  Radio, Zap, BarChart3, Database, History, Folder, Settings, 
  ChevronRight, Sparkles 
} from "lucide-react";

export enum SidebarTab {
  DASHBOARD = "dashboard",
  WORKSPACE = "workspace",
  PROJECTS = "projects",
  AI_CHAT = "ai_chat",
  AGENTS = "agents",
  AUTOMATION = "automation",
  ANALYTICS = "analytics",
  KNOWLEDGE = "knowledge",
  HISTORY = "history",
  FILES = "files",
  SETTINGS = "settings",
}

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { activeModel } = useOS();
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarItems = [
    { id: SidebarTab.DASHBOARD, label: "Dashboard", icon: LayoutDashboard, color: "#4F8CFF" },
    { id: SidebarTab.WORKSPACE, label: "Workspace", icon: Compass, color: "#10B981" },
    { id: SidebarTab.PROJECTS, label: "Projects", icon: Briefcase, color: "#F59E0B" },
    { id: SidebarTab.AI_CHAT, label: "AI Chat", icon: MessageSquareText, color: "#EC4899" },
    { id: SidebarTab.AGENTS, label: "AI Agents", icon: Radio, color: "#A855F7" },
    { id: SidebarTab.AUTOMATION, label: "Automation", icon: Zap, color: "#F97316" },
    { id: SidebarTab.ANALYTICS, label: "Analytics", icon: BarChart3, color: "#06B6D4" },
    { id: SidebarTab.KNOWLEDGE, label: "Knowledge", icon: Database, color: "#3B82F6" },
    { id: SidebarTab.HISTORY, label: "History", icon: History, color: "#64748B" },
    { id: SidebarTab.FILES, label: "Files Hub", icon: Folder, color: "#14B8A6" },
    { id: SidebarTab.SETTINGS, label: "Settings", icon: Settings, color: "#94A3B8" },
  ];

  return (
    <motion.aside
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      animate={{ width: isExpanded ? "240px" : "72px" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-4 top-28 bottom-24 z-30 hidden lg:flex flex-col bg-[#050505]/60 border border-white/5 backdrop-blur-2xl rounded-2xl py-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      {/* Absolute sidebar background glowing elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      {/* Action list of sidebar tabs */}
      <div className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto no-scrollbar relative z-10">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative w-full group flex items-center justify-start rounded-xl p-3 cursor-pointer select-none transition-all outline-none"
            >
              {/* Active Backplate background glow */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  transition={{ duration: 0.25, type: "spring", stiffness: 180, damping: 20 }}
                  className="absolute inset-0 rounded-xl bg-white/5 border border-white/10 shadow-inner"
                />
              )}

              {/* Hover highlight bar indicator */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-5 rounded-r bg-[#4F8CFF] transition-all"
                style={{ backgroundColor: isActive ? item.color : "transparent" }}
              />

              {/* Icon component wrapping with lift animation */}
              <div className="flex items-center justify-center shrink-0 w-6 h-6 z-10 transition-transform group-hover:scale-110">
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{
                    color: isActive ? item.color : "rgba(255, 255, 255, 0.45)",
                  }}
                />
              </div>

              {/* Text label showing on sidebar hover expansion */}
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 12 : -10 }}
                transition={{ duration: 0.2 }}
                className="font-sans text-[11px] font-semibold text-white/70 group-hover:text-white leading-none whitespace-nowrap z-10"
                style={{ display: isExpanded ? "inline" : "none" }}
              >
                {item.label}
              </motion.span>

              {/* Right Chevron arrow indicator on active/hover tab */}
              {isExpanded && isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/30 z-10" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mini status indicator at the bottom */}
      <div className="px-4 pt-3.5 border-t border-white/5 mt-auto flex flex-col gap-1 select-none font-mono relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          {isExpanded ? (
            <span className="text-[8px] text-white/40 tracking-widest uppercase">NODE ACTIVE</span>
          ) : (
            <div className="w-1.5 h-1.5" />
          )}
        </div>
        {isExpanded && (
          <p className="text-[7.5px] text-white/20 mt-1 max-w-[150px] leading-tight">
            SYSTEM ENGINE SECURED VIA HELIOS_COGNITIVE_A5
          </p>
        )}
      </div>
    </motion.aside>
  );
}
