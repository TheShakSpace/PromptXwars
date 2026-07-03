/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { Cpu, Terminal, Shield, Zap } from "lucide-react";

export function Preloader() {
  const { splineProgress } = useOS();
  const [logIndex, setLogIndex] = useState(0);
  const [show, setShow] = useState(true);

  const loadingLogs = [
    "BOOTING HELIOS KERNEL...",
    "HANDSHAKE SECURITY CERTIFICATE...",
    "RESOLVING CLOUD ROUTING CLUSTERS...",
    "LINKING GEMINI INTELLIGENCE presetting...",
    "INITIATING SPATIAL GPU ACCELERATION...",
    "STREAMING 3D VECTOR COORDINATES...",
    "SYNAPTIC NETWORK FULLY OPERATIONAL.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev < loadingLogs.length - 1 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (splineProgress >= 100) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 800); // minor buffer to show completed state
      return () => clearTimeout(timeout);
    }
  }, [splineProgress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="system-preloader"
          className="fixed inset-0 w-full h-full bg-[#050505] z-50 flex flex-col items-center justify-center p-6 select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Futuristic Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />

          <div className="w-full max-w-md flex flex-col items-center">
            {/* Glowing OS Core Symbol */}
            <motion.div
              className="relative w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Zap className="w-6 h-6 text-white animate-pulse" />
              {/* Spinning orbiting dot */}
              <div className="absolute inset-0.5 rounded-full border border-dashed border-white/20 animate-[spin_8s_linear_infinite]" />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-sans font-black tracking-widest text-white text-lg mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              HELIOS AI OPERATING SYSTEM
            </motion.h1>

            <motion.p
              className="font-mono text-[10px] text-white/40 tracking-wider mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              INITIALIZATION SEQUENCER v2.5.4
            </motion.p>

            {/* Simulated Live Loading Terminal */}
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-md p-4 mb-6 font-mono text-[10px] text-white/60 h-20 overflow-hidden flex flex-col justify-end gap-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 text-white/30">
                <Terminal className="w-3 h-3 text-[#4F8CFF]" />
                <span>TERMINAL_BOOT_LOG</span>
              </div>
              <div className="h-[1px] bg-white/5 w-full my-1" />
              <div className="text-white/40">{logIndex > 0 ? loadingLogs[logIndex - 1] : "..."}</div>
              <div className="text-[#4F8CFF] font-semibold flex items-center gap-1.5">
                <span className="animate-pulse">▶</span> {loadingLogs[logIndex]}
              </div>
            </div>

            {/* Glow Progress Bar Container */}
            <div className="w-full bg-white/5 h-[3px] rounded-full overflow-hidden border border-white/5 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4F8CFF] to-white rounded-full shadow-[0_0_12px_rgba(79,140,255,0.8)]"
                initial={{ width: "0%" }}
                animate={{ width: `${splineProgress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Percentage Indicator */}
            <div className="w-full flex justify-between items-center mt-3 font-mono text-[10px] text-white/40">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-400" /> SYS_ENCRYPT_LINKED
              </span>
              <span className="text-white/80 font-semibold">{splineProgress}% LOADED</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
