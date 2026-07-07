/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      // Automatically hide after 4s when connection restored
      const timer = setTimeout(() => setShowStatus(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-full px-4 select-none"
        >
          {isOnline ? (
            <div className="bg-emerald-950/60 backdrop-blur-xl border border-emerald-500/20 px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(16,185,129,0.15)]">
              <div className="flex items-center gap-2.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">CONNECTION COGNITION ONLINE</span>
                  <p className="text-[9px] text-white/60 font-light font-mono mt-0.5">Interface synchronizing with global AI routers.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-950/80 backdrop-blur-xl border border-rose-500/10 px-4 py-3.5 rounded-xl flex flex-col gap-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
              <div className="flex items-start gap-2.5 font-sans">
                <WifiOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-wider text-rose-400 font-bold uppercase">OFFLINE SIGNAL BYPASS</span>
                  <p className="text-[9px] text-white/45 font-light leading-normal mt-0.5">
                    Helios lost access to standard intelligence clusters. Switch active presets, diagnostic consoles, or offline workspaces are fully preserved locally.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 border-t border-white/5 pt-2">
                <button
                  onClick={() => {
                    setIsOnline(navigator.onLine);
                    if (navigator.onLine) {
                      setShowStatus(false);
                    }
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[8px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> RETRY ENTRANCE
                </button>
                <button
                  onClick={() => setShowStatus(false)}
                  className="py-1.5 px-3 rounded-lg text-white/40 hover:text-white font-mono text-[8px] uppercase cursor-pointer"
                >
                  DISMISS
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
