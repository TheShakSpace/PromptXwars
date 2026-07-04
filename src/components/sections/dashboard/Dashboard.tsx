/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Topbar } from "./Topbar";
import { Sidebar, SidebarTab } from "./Sidebar";
import { Dock } from "./Dock";
import { Workspace } from "./Workspace";
import { ChatPanel } from "./ChatPanel";
import { Analytics } from "./Analytics";
import { Projects } from "./Projects";
import { FileExplorer } from "./FileExplorer";
import { SettingsPage } from "./Settings";
import { CommandPalette } from "./CommandPalette";
import { SearchOverlay } from "./SearchOverlay";
import { Sparkles, MessageSquare, Menu, X, ArrowLeft } from "lucide-react";

export function Dashboard() {
  const { mode, setMode, addNotification } = useOS();
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.DASHBOARD);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Keyboard shortcut listener for Command Palette (Ctrl/⌘ + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync activeTab with global OS Mode where relevant
  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    addNotification("Directory Swapped", `Focused operational tab: ${tab.toUpperCase()}`, "info");
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case SidebarTab.DASHBOARD:
      case SidebarTab.WORKSPACE:
        return <Workspace />;
      case SidebarTab.ANALYTICS:
        return <Analytics />;
      case SidebarTab.PROJECTS:
        return (
          <div className="max-w-2xl mx-auto py-4">
            <Projects />
          </div>
        );
      case SidebarTab.FILES:
        return <FileExplorer />;
      case SidebarTab.SETTINGS:
        return <SettingsPage />;
      default:
        // Elegant fallback card for un-implemented items
        return (
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl text-center flex flex-col items-center justify-center gap-4 py-20 select-none">
            <div className="w-12 h-12 rounded-2xl bg-[#4F8CFF]/10 border border-[#4F8CFF]/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#4F8CFF] animate-pulse" />
            </div>
            <h2 className="text-lg font-black text-white/90 uppercase tracking-widest">AUTONOMOUS SYNAPSES LINKED</h2>
            <p className="text-xs text-white/45 max-w-md font-light leading-relaxed">
              This node's subprocesses are fully managed under the Helios core autopilot pipeline. No active client parameters are required.
            </p>
            <button
              onClick={() => handleTabChange(SidebarTab.DASHBOARD)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold hover:bg-white/10 transition-all cursor-pointer"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white relative overflow-x-hidden font-sans pb-32">
      
      {/* 1. Immersive spatial particle canvas field overlay */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Spot light hover highlights */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-900/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-900/5 blur-[100px] animate-pulse-slow" />
        
        {/* Linear geometric ambient grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
      </div>

      {/* 2. Top Header Navigation */}
      <Topbar
        onSearchClick={() => setIsSearchOpen(true)}
        onCommandPaletteClick={() => setIsCommandPaletteOpen(true)}
        onSettingsClick={() => handleTabChange(SidebarTab.SETTINGS)}
      />

      {/* 3. Main content body framing */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-28 flex gap-6 relative z-10">
        
        {/* Left Side Sidebar Menu */}
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Central Workspace frame view (Responsive padding bounds) */}
        <main className="flex-1 lg:pl-20 xl:pr-96 transition-all duration-300">
          
          {/* Mobile responsive toggle header bar */}
          <div className="flex lg:hidden items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl mb-6">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            <span className="font-mono text-[9px] font-black tracking-widest uppercase">
              HELIOS // {activeTab.toUpperCase()}
            </span>

            <button
              onClick={() => setIsMobileChatOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#EC4899]"
            >
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderActiveContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Side AI Operator Chat panel */}
        <ChatPanel />

      </div>

      {/* 4. Bottom MacOS style launching Dock */}
      <div className="hidden md:block">
        <Dock activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* 5. Spotlight Search Overlays (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onTabChange={handleTabChange}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onTabChange={handleTabChange}
      />

      {/* 6. Mobile Slide-in Drawer Menus */}
      <AnimatePresence>
        {/* Mobile Navigation Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-72 h-full bg-[#050505] border-r border-white/10 p-6 flex flex-col gap-5 justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <span className="font-sans font-black text-xs tracking-wider">HELIOS OS</span>
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="text-white/45 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 font-mono text-[10px]">
                  {Object.values(SidebarTab).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between ${
                        activeTab === tab ? "bg-white/5 border border-white/10 text-white" : "text-white/45 hover:text-white"
                      }`}
                    >
                      <span>{tab.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="font-mono text-[7px] text-white/20">
                SYSTEM MODULES LOADED OK
              </div>
            </motion.div>
          </div>
        )}

        {/* Mobile AI Chat Assistant Drawer */}
        {isMobileChatOpen && (
          <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileChatOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-80 h-full bg-[#050505] border-l border-white/10 p-4 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <button onClick={() => setIsMobileChatOpen(false)} className="text-white/45 hover:text-white mr-2">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-[9px] font-black tracking-widest uppercase">COGNITIVE COMPILER</span>
              </div>

              {/* Chat Content directly */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <ChatPanel />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
