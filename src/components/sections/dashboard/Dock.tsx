/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { SidebarTab } from "./Sidebar";
import { 
  LayoutDashboard, Compass, MessageSquareText, Folder, 
  BarChart3, Settings, Sparkles 
} from "lucide-react";

interface DockProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function Dock({ activeTab, onTabChange }: DockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const dockApps = [
    { id: SidebarTab.DASHBOARD, label: "Dashboard", icon: LayoutDashboard, color: "#4F8CFF" },
    { id: SidebarTab.WORKSPACE, label: "Workspace", icon: Compass, color: "#10B981" },
    { id: SidebarTab.AI_CHAT, label: "AI Chat", icon: MessageSquareText, color: "#EC4899" },
    { id: SidebarTab.FILES, label: "Files", icon: Folder, color: "#14B8A6" },
    { id: SidebarTab.ANALYTICS, label: "Analytics", icon: BarChart3, color: "#06B6D4" },
    { id: SidebarTab.SETTINGS, label: "Settings", icon: Settings, color: "#94A3B8" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl border border-white/5 bg-[#050505]/70 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)] select-none">
      {/* Dock glass highlight rim */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex items-end gap-3.5 h-10">
        {dockApps.map((app, idx) => {
          const Icon = app.icon;
          const isActive = activeTab === app.id;

          // Determine magnification level based on hovered index
          let sizeMultiplier = 1.0;
          if (hoveredIdx !== null) {
            const distance = Math.abs(idx - hoveredIdx);
            if (distance === 0) {
              sizeMultiplier = 1.35;
            } else if (distance === 1) {
              sizeMultiplier = 1.15;
            }
          }

          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onTabChange(app.id)}
            >
              {/* Premium Tooltip */}
              <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-neutral-900/90 text-[8px] font-mono font-black tracking-widest uppercase border border-white/10 px-2.5 py-1.5 rounded-lg text-white pointer-events-none transition-all duration-200 z-50 shadow-xl">
                {app.label}
              </div>

              {/* Dynamic Scaling App Card */}
              <motion.div
                animate={{
                  width: `${sizeMultiplier * 42}px`,
                  height: `${sizeMultiplier * 42}px`,
                  y: hoveredIdx === idx ? -10 : 0,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className={`rounded-xl flex items-center justify-center border transition-all ${
                  isActive
                    ? "bg-white/10 border-white/25 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "bg-white/[0.03] border-white/5 hover:border-white/15"
                }`}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{
                    color: isActive ? app.color : "rgba(255, 255, 255, 0.55)",
                  }}
                />
              </motion.div>

              {/* Small Dot Indicator for Active apps */}
              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full absolute -bottom-1.5 animate-pulse"
                  style={{ backgroundColor: app.color, boxShadow: `0 0 8px ${app.color}` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
