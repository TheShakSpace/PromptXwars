/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIntro, IntroState } from "../../../contexts/IntroContext";
import { Cpu, Terminal, Shield, Check } from "lucide-react";

export function BootSequence() {
  const { currentState, setCurrentState, playSound, bootProgress, setBootProgress } = useIntro();
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const rawLogs = [
    "INITIALIZING HELIOS COGNITIVE LAYER...",
    "ESTABLISHING SECURE MEMORY BOUNDARIES... OK",
    "ALLOCATING SYNAPTIC NODES... [128,000 TOKENS]",
    "CONNECTING GPU CORE ACCELERATION...",
    "LOADING NEURAL REASONING CORES...",
    "VERIFYING CRYPTO SHIELDS [ECDSA_P256]... PROTECTED",
    "STARTING HELIOS SENTIENT WORKSPACE MODULE...",
    "LOADING DEEPMIND AGENT CHANNELS...",
    "ALIGNING DYNAMIC TIMELINE SCALES...",
    "SYSTEM SYNCHRONIZATION ESTABLISHED.",
    "HELIOS CORE ENGINE IS READY."
  ];

  useEffect(() => {
    if (currentState !== IntroState.BOOT) return;

    // Increment boot progress smoothly over 3.8s
    const startTime = Date.now();
    const duration = 3800;

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setBootProgress(Math.floor(pct));

      if (pct >= 100) {
        clearInterval(progressTimer);
        // Advance to scanning phase
        setTimeout(() => {
          setCurrentState(IntroState.SCANNING);
        }, 500);
      }
    }, 50);

    return () => clearInterval(progressTimer);
  }, [currentState, setCurrentState, setBootProgress]);

  // Handle naturally typing terminal lines
  useEffect(() => {
    if (currentState !== IntroState.BOOT) return;
    if (currentLineIndex >= rawLogs.length) return;

    const line = rawLogs[currentLineIndex];
    let charIndex = 0;
    let currentText = "";

    const typeChar = () => {
      if (charIndex < line.length) {
        currentText += line[charIndex];
        setTerminalLogs((prev) => {
          const next = [...prev];
          next[currentLineIndex] = currentText;
          return next;
        });
        charIndex++;
        playSound("typing");
        setTimeout(typeChar, Math.random() * 20 + 10);
      } else {
        // Move to next line
        setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
        }, 220);
      }
    };

    typeChar();
  }, [currentState, currentLineIndex]);

  // Keep logs scrolled down
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  if (currentState !== IntroState.BOOT) return null;

  return (
    <div
      id="intro-scene-3"
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col md:flex-row items-center justify-center p-6 gap-10 md:gap-16 select-none overflow-hidden"
    >
      {/* Immersive Space Grid & Cyber Orb overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:40px_40px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4F8CFF]/10 blur-[140px] rounded-full animate-pulse-slow" />
      </div>

      {/* Futuristic Circular Progress Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex flex-col items-center justify-center"
      >
        <div className="w-44 h-44 rounded-full flex items-center justify-center relative">
          {/* Subtle Outer spinning tracking ticks */}
          <div className="absolute inset-0 rounded-full border border-white/5 border-t-[#4F8CFF]/50 border-r-[#4F8CFF]/20 animate-spin-slow" />
          
          {/* Real SVG Progress Circular stroke */}
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-white/5 stroke-[4px] fill-transparent"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-[#4F8CFF] stroke-[4px] fill-transparent transition-all duration-100"
              style={{
                strokeDasharray: 2 * Math.PI * 62,
                strokeDashoffset: 2 * Math.PI * 62 * (1 - bootProgress / 100),
                filter: "drop-shadow(0 0 10px rgba(79, 140, 255, 0.45))",
              }}
            />
          </svg>

          {/* Central Percentage metrics */}
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <span className="text-3xl font-black text-white tracking-tighter">
              {bootProgress}%
            </span>
            <span className="text-[8px] text-white/40 tracking-widest uppercase mt-1 flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5 text-[#4F8CFF] animate-pulse" /> BOOT
            </span>
          </div>
        </div>
      </motion.div>

      {/* Cyber AI Terminal Diagnostics console */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative z-20 w-full max-w-lg h-72 rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 flex flex-col shadow-2xl overflow-hidden group"
      >
        {/* Spotlight Ambient Overlay */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4F8CFF]/30 to-transparent" />

        {/* Console Header Bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-mono text-[9px] text-white/50 tracking-wider">
              HELIOS_SYSTEM_CORE_LOGS
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-500/80 rounded-full" />
            <span className="w-1.5 h-1.5 bg-yellow-500/80 rounded-full" />
            <span className="w-1.5 h-1.5 bg-green-500/80 rounded-full" />
          </div>
        </div>

        {/* Log stream viewport */}
        <div
          ref={logContainerRef}
          className="flex-1 overflow-y-auto font-mono text-[10.5px] text-white/80 flex flex-col gap-2.5 scrollbar-none pr-1 select-text"
        >
          {terminalLogs.map((log, index) => {
            const isDone = index < currentLineIndex;
            return (
              <div key={index} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#4F8CFF] font-semibold select-none">{">"}</span>
                <span className="flex-1">{log}</span>
                {isDone && (
                  <Check className="w-3 h-3 text-green-400 shrink-0 self-center" />
                )}
              </div>
            );
          })}
          {/* Active Blinking prompt cursor */}
          {currentLineIndex < rawLogs.length && (
            <div className="flex items-center gap-2 select-none">
              <span className="text-[#4F8CFF] font-semibold">{">"}</span>
              <span className="w-1.5 h-3.5 bg-[#4F8CFF] animate-[blink_1s_infinite]" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
