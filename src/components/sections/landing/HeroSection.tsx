/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { OSMode } from "../../../types";
import { heroData } from "../../../data/heroData";
import { Button } from "../../common/buttons/Button";
import { Terminal, CornerRightDown, Sparkles } from "lucide-react";

export function HeroSection() {
  const { setMode, setIsTerminalOpen } = useOS();

  return (
    <div id="landing-hero" className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 select-none overflow-hidden bg-transparent">
      {/* Background overlay constraints */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-transparent to-[#050505]/90 pointer-events-none z-10" />

      {/* Hero Central Copy block */}
      <div className="relative z-20 max-w-4xl flex flex-col items-center gap-6 mt-16 px-4">
        {/* Futuristic Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-4.5 py-2 rounded-full text-[9px] font-mono tracking-widest text-white/70 shadow-lg select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>{heroData.badgeText}</span>
        </motion.div>

        {/* Display XXL Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <h1 className="font-sans font-black tracking-tighter text-6xl md:text-8xl lg:text-9xl text-white leading-none">
            {heroData.title}
          </h1>
          <p className="font-sans font-medium tracking-widest text-xs md:text-sm text-[#4F8CFF] mt-2 tracking-[0.25em] glow-accent">
            {heroData.highlightText}
          </p>
        </motion.div>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-sans font-light text-sm md:text-base lg:text-lg text-white/65 max-w-2xl leading-relaxed font-light"
        >
          {heroData.subtitle}
        </motion.p>

        {/* High-Fidelity Action Handlers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
        >
          <Button
            variant="accent"
            size="lg"
            glow
            magnetic
            onClick={() => setMode(OSMode.WORKSPACE)}
            className="w-full sm:w-auto font-bold tracking-widest"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{heroData.primaryActionText}</span>
          </Button>

          <Button
            variant="glass"
            size="lg"
            magnetic
            onClick={() => setIsTerminalOpen(true)}
            className="w-full sm:w-auto group font-bold tracking-widest text-white/80"
          >
            <Terminal className="w-4 h-4 shrink-0 text-[#4F8CFF]" />
            <span>{heroData.secondaryActionText}</span>
          </Button>
        </motion.div>
      </div>

      {/* Aesthetic Scroll-down Micro Tip */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/20 font-mono text-[9px] select-none pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0], y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span>SCROLL DOWN TO REVEAL BENTO GRID</span>
        <CornerRightDown className="w-3.5 h-3.5" />
      </motion.div>
    </div>
  );
}
