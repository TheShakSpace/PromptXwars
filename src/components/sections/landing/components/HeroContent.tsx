/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowUpRight, Terminal, UserCheck } from "lucide-react";
import { useOS } from "../../../../contexts/OSContext";
import { OSMode } from "../../../../types";
import { Button } from "../../../common/buttons/Button";

export function HeroContent() {
  const { setMode, setIsTerminalOpen } = useOS();
  const [developerCount, setDeveloperCount] = useState(1420);
  const [researcherCount, setResearcherCount] = useState(98.4);

  // Smooth counting animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setDeveloperCount((prev) => {
        const next = prev + Math.floor(Math.random() * 3) + 1;
        return next > 1850 ? 1420 : next;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const headlineLines = ["BUILDING", "INTELLIGENT", "SYSTEMS"];

  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 35, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-start gap-8 w-full md:w-1/2 relative z-20 select-none text-left"
    >
      {/* Cinematic Status Badge */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest text-white/70 shadow-lg select-none"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="uppercase tracking-widest text-[8px]">CORE OPERATING SYSTEM v2.4</span>
      </motion.div>

      {/* Main Large Typography Headers */}
      <div className="flex flex-col gap-1">
        {headlineLines.map((line, idx) => (
          <div key={idx} className="overflow-hidden h-auto">
            <motion.h1
              variants={itemVariants}
              className="font-sans font-black tracking-tight text-5xl sm:text-7xl lg:text-8xl text-white leading-[0.9] uppercase"
            >
              {line}
            </motion.h1>
          </div>
        ))}
        {/* Glow underscore highlight accent */}
        <motion.div
          variants={itemVariants}
          className="h-1 w-24 bg-gradient-to-r from-[#4F8CFF] to-violet-500 rounded-full mt-4 shadow-[0_0_15px_#4F8CFF]"
        />
      </div>

      {/* Premium Subtitle */}
      <motion.p
        variants={itemVariants}
        className="font-sans font-light text-sm md:text-base text-white/55 max-w-lg leading-relaxed"
      >
        A modular spatial operating system designed for builders, creators and researchers. Orchestrate advanced schemas, databases, and AI runtimes with zero overhead.
      </motion.p>

      {/* Primary and Secondary CTA Button Triggers */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Button
          variant="accent"
          size="lg"
          glow
          magnetic
          onClick={() => setMode(OSMode.WORKSPACE)}
          className="w-full sm:w-auto font-bold tracking-widest text-[10px] group cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>LAUNCH PLATFORM</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>

        <Button
          variant="glass"
          size="lg"
          magnetic
          onClick={() => setIsTerminalOpen(true)}
          className="w-full sm:w-auto font-bold tracking-widest text-[10px] text-white/80 cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-[#4F8CFF]" />
          <span>EXPLORE TECHNOLOGY</span>
        </Button>
      </motion.div>

      {/* Social proof counters */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-6 mt-4 pt-6 border-t border-white/5 w-full select-none"
      >
        <div>
          <span className="block font-sans font-black text-xl text-white tracking-tight">
            {developerCount}+
          </span>
          <span className="block font-mono text-[8px] text-white/30 tracking-widest uppercase">
            Active Builders
          </span>
        </div>

        <div className="h-8 w-[1px] bg-white/5" />

        <div>
          <span className="block font-sans font-black text-xl text-white tracking-tight">
            {researcherCount}%
          </span>
          <span className="block font-mono text-[8px] text-white/30 tracking-widest uppercase">
            Core Accuracy
          </span>
        </div>

        <div className="h-8 w-[1px] bg-white/5" />

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <span className="w-6 h-6 rounded-full border border-[#050505] bg-neutral-800 text-[8px] font-bold flex items-center justify-center text-white/80">AI</span>
            <span className="w-6 h-6 rounded-full border border-[#050505] bg-neutral-700 text-[8px] font-bold flex items-center justify-center text-white/80">DE</span>
            <span className="w-6 h-6 rounded-full border border-[#050505] bg-neutral-600 text-[8px] font-bold flex items-center justify-center text-white/80">RE</span>
          </div>
          <span className="font-mono text-[8px] text-white/40 leading-tight">
            Trusted by top global researchers
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
