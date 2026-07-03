/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIntro, IntroState } from "../../../contexts/IntroContext";
import { Activity, Shield, Cpu, Radar } from "lucide-react";

interface FloatingTag {
  id: number;
  label: string;
  x: number; // percentage
  y: number; // percentage
  delay: number;
}

export function SystemScanner() {
  const { currentState, setCurrentState, playSound } = useIntro();
  const [activeTags, setActiveTags] = useState<FloatingTag[]>([]);

  const rawLabels = ["AI_MODEL", "VISION_MATRIX", "LLM_SYNTAX", "PROMPT_ENGINE", "NEURAL_MEM", "INTELLIGENT_AGENT", "ECDSA_SHIELD", "D3_TELEMETRY"];

  useEffect(() => {
    if (currentState !== IntroState.SCANNING) return;

    // Build dynamic drifting coordinates
    const initialTags: FloatingTag[] = rawLabels.map((lbl, idx) => ({
      id: idx,
      label: lbl,
      x: 15 + Math.random() * 70, // stay away from center or boundaries
      y: 15 + Math.random() * 70,
      delay: idx * 0.15,
    }));
    setActiveTags(initialTags);

    playSound("power");

    // Hold scene 4 scanning for 3.2 seconds
    const advanceTimer = setTimeout(() => {
      setCurrentState(IntroState.CURTAIN);
    }, 3200);

    return () => clearTimeout(advanceTimer);
  }, [currentState, setCurrentState, playSound]);

  if (currentState !== IntroState.SCANNING) return null;

  return (
    <div
      id="intro-scene-4"
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background Matrix/Grid wire overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(79,140,255,0.035)_0%,_transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.012)_1px,_transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Main Radar Scanning Frame */}
      <div className="relative z-20 w-80 h-80 md:w-[420px] md:h-[420px] rounded-full border border-white/5 flex items-center justify-center">
        {/* Radar Concentric Circles */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-white/[0.03] flex items-center justify-center">
          <div className="absolute w-[70%] h-[70%] rounded-full border border-[#4F8CFF]/5 flex items-center justify-center">
            <div className="absolute w-[50%] h-[50%] rounded-full border border-[#4F8CFF]/10 flex items-center justify-center">
              <div className="absolute w-6 h-6 rounded-full bg-[#4F8CFF]/20 border border-[#4F8CFF]/40 animate-ping" />
            </div>
          </div>
        </div>

        {/* Diagonal Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[1px] h-full bg-white/[0.04]" />
          <div className="h-[1px] w-full bg-white/[0.04]" />
        </div>

        {/* Sweeping Laser Radar Line vector */}
        <div className="absolute inset-0 rounded-full animate-[spin_4s_linear_infinite] pointer-events-none origin-center">
          <div className="absolute top-1/2 left-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-[#4F8CFF]/50 to-[#4F8CFF] origin-left shadow-[0_0_15px_#4F8CFF]" />
        </div>

        {/* Central Core Status Overlay badge */}
        <div className="absolute z-30 flex flex-col items-center justify-center font-mono">
          <Radar className="w-6 h-6 text-[#4F8CFF] animate-pulse mb-2" />
          <span className="text-[10px] text-white/80 tracking-widest uppercase font-bold">
            SCANNING SYSTEM
          </span>
          <span className="text-[8px] text-green-400 mt-1 tracking-wider uppercase font-semibold">
            STATUS: INTEGRATING
          </span>
        </div>
      </div>

      {/* Floating System Parameters */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence>
          {activeTags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
              animate={{
                opacity: [0, 0.7, 0.4, 0.8, 0],
                scale: [0.95, 1, 1.02, 1, 0.9],
                y: [0, -30, -60, -90, -120],
                filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(3px)"],
              }}
              transition={{
                duration: 2.8,
                delay: tag.delay,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                position: "absolute",
                left: `${tag.x}%`,
                top: `${tag.y}%`,
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#4F8CFF]/15 bg-[#050505]/80 backdrop-blur-md shadow-lg"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4F8CFF] animate-pulse" />
              <span className="font-mono text-[9px] text-white/60 tracking-wider">
                {tag.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
