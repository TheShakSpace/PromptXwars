/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { 
  Search, Bell, Sparkles, Cpu, Clock, Shield, Wifi, User, 
  Terminal, Sliders, ChevronDown, Check, X 
} from "lucide-react";

interface TopbarProps {
  onSearchClick: () => void;
  onCommandPaletteClick: () => void;
  onSettingsClick: () => void;
}

export function Topbar({ onSearchClick, onCommandPaletteClick, onSettingsClick }: TopbarProps) {
  const { notifications, dismissNotification, activeModel, addNotification } = useOS();
  const [time, setTime] = useState(new Date());
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formattedDate = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  const unreadCount = notifications.length;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-4 right-4 z-40"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl border border-white/5 bg-[#050505]/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group">
        
        {/* Subtle top edge scanner line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4F8CFF]/30 to-transparent" />
        
        {/* Left Side: Logo & System status */}
        <div className="flex items-center gap-4 select-none">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600/20 via-[#4F8CFF]/20 to-violet-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(79,140,255,0.15)] relative overflow-hidden group-hover:border-[#4F8CFF]/30 transition-colors">
              <Sparkles className="w-4.5 h-4.5 text-[#4F8CFF] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-xs tracking-[0.2em] text-white">HELIOS <span className="text-[#4F8CFF]">OS</span></span>
              <span className="font-mono text-[8px] text-white/40 tracking-wider">SECURE_CORE_v2.4</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg font-mono text-[8.5px] text-white/50">
            <Shield className="w-3 h-3 text-green-400" />
            <span>ENCRYPTED_NODE</span>
          </div>
        </div>

        {/* Center: Global Search trigger */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <button
            onClick={onSearchClick}
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 text-white/30 hover:text-white/50 text-xs font-sans transition-all cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-white/30" />
              <span>Search node directory, commands...</span>
            </div>
            <kbd className="font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-white/45">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Network Status, Clock, Quick buttons, Profile */}
        <div className="flex items-center gap-4 font-mono select-none">
          
          {/* Live Clock block */}
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="font-mono text-xs font-bold text-white tracking-widest">{formattedTime}</span>
            <span className="font-mono text-[8px] text-white/30 tracking-wider uppercase">{formattedDate}</span>
          </div>

          <div className="h-6 w-[1px] bg-white/5 hidden lg:block" />

          {/* AI Status Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#4F8CFF]/5 border border-[#4F8CFF]/15 px-3 py-1.5 rounded-xl text-[9px] text-[#4F8CFF] font-bold">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{activeModel === "gemini-3.5-flash" ? "FLASH 3.5" : "PRO 3.1"}</span>
          </div>

          {/* System Online / Wifi indicator */}
          <div className="flex items-center gap-1.5 text-green-400 text-[9px] font-bold bg-green-500/5 border border-green-500/10 px-2.5 py-1.5 rounded-xl">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden md:inline">ONLINE</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Search (Mobile visible trigger) */}
            <button
              onClick={onSearchClick}
              className="md:hidden w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Terminal toggle command palette */}
            <button
              onClick={onCommandPaletteClick}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer relative group/btn"
              title="Command Palette"
            >
              <Terminal className="w-4 h-4" />
              <div className="absolute top-10 right-0 bg-black border border-white/10 rounded px-2 py-0.5 text-[8px] whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                Open Command Shell
              </div>
            </button>

            {/* Notification Bell hub dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer relative ${
                  isNotificationsOpen ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#4F8CFF] shadow-[0_0_8px_#4F8CFF] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-[#050505]/95 backdrop-blur-2xl shadow-2xl p-4 flex flex-col gap-3 z-50 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] text-white/40 tracking-wider uppercase font-bold">SYSTEM TELEMETRY ALERT</span>
                      {unreadCount > 0 && (
                        <span className="text-[8px] text-[#4F8CFF] bg-[#4F8CFF]/10 px-1.5 py-0.5 rounded-full font-bold">
                          {unreadCount} ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-white/30 text-[10px] italic">
                          No alerts queueing in telemetry.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all relative group flex flex-col gap-1 cursor-pointer"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notif.id);
                              }}
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/80 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <span className="text-[10px] text-white/90 font-bold pr-4 leading-tight">{notif.title}</span>
                            <p className="text-[9px] text-white/40 leading-relaxed font-sans">{notif.message}</p>
                            <span className="text-[7.5px] text-white/20 text-right mt-1 font-mono">{notif.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/5" />

          {/* User Profile avatar menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer group/profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F8CFF]/30 to-indigo-600/30 border border-white/10 flex items-center justify-center font-sans font-bold text-xs text-white/90 shadow-lg group-hover/profile:border-[#4F8CFF]/40 transition-colors">
                ME
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-[#050505]/95 backdrop-blur-2xl shadow-2xl p-3 flex flex-col gap-2.5 z-50 text-left font-sans"
                >
                  <div className="px-2 py-1.5 border-b border-white/5 select-none">
                    <span className="block text-xs font-bold text-white leading-none">Developer Account</span>
                    <span className="block text-[9px] text-white/40 mt-1 font-mono tracking-wide">shakshikumari2541@gmail.com</span>
                  </div>

                  <div className="flex flex-col gap-1 font-mono text-[10px]">
                    <button
                      onClick={() => {
                        onSettingsClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      ⚙ ACCOUNT_SETTINGS
                    </button>
                    <button
                      onClick={() => {
                        addNotification("Sync Initiated", "Synchronizing local data with remote server clusters...", "info");
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      🔄 SYNC_CLOUD_CORE
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </motion.header>
  );
}
