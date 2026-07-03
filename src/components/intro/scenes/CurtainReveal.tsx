/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useIntro, IntroState } from "../../../contexts/IntroContext";
import { Sparkles, Layers } from "lucide-react";

export function CurtainReveal() {
  const { currentState, setCurrentState, playSound } = useIntro();
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const contentControls = useAnimation();

  useEffect(() => {
    if (currentState !== IntroState.CURTAIN) return;

    // Trigger rich mechanical curtain sliding sound
    playSound("curtain");

    // Start curtains sliding open in parallel
    leftControls.start({
      x: "-100%",
      transition: { duration: 1.8, ease: [0.77, 0, 0.175, 1] },
    });
    rightControls.start({
      x: "100%",
      transition: { duration: 1.8, ease: [0.77, 0, 0.175, 1] },
    });

    // Content fade up
    contentControls.start({
      opacity: [0, 1, 0],
      scale: [0.95, 1, 1.05],
      filter: ["blur(5px)", "blur(0px)", "blur(10px)"],
      transition: { duration: 1.9, ease: "easeInOut" },
    });

    // Transition to scene 6: Spline Robot Power On
    const transitionTimer = setTimeout(() => {
      setCurrentState(IntroState.ROBOT);
    }, 1900);

    return () => clearTimeout(transitionTimer);
  }, [currentState, leftControls, rightControls, contentControls, setCurrentState, playSound]);

  if (currentState !== IntroState.CURTAIN) return null;

  return (
    <div
      id="intro-scene-5"
      className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden bg-transparent"
    >
      {/* Cinematic Curtains Left Half */}
      <motion.div
        initial={{ x: "0%" }}
        animate={leftControls}
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.8)] z-40 flex items-center justify-end overflow-hidden"
      >
        {/* Soft textile fold shadows */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,_transparent,_transparent_40px,_rgba(0,0,0,0.3)_60px,_rgba(0,0,0,0.3)_100px)] pointer-events-none opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4F8CFF]/5 to-transparent pointer-events-none opacity-20" />
        
        {/* Subtle decorative gold/white vertical rim light */}
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </motion.div>

      {/* Cinematic Curtains Right Half */}
      <motion.div
        initial={{ x: "0%" }}
        animate={rightControls}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-neutral-950 via-neutral-900 to-neutral-800 border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-40 flex items-center justify-start overflow-hidden"
      >
        {/* Soft textile fold shadows */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-90deg,_transparent,_transparent_40px,_rgba(0,0,0,0.3)_60px,_rgba(0,0,0,0.3)_100px)] pointer-events-none opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4F8CFF]/5 to-transparent pointer-events-none opacity-20" />

        {/* Subtle decorative gold/white vertical rim light */}
        <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </motion.div>

      {/* Escaping particles & Light leak flare */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [0.5, 2.5],
            opacity: [0, 0.45, 0],
          }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute w-96 h-96 rounded-full bg-[#4F8CFF]/15 blur-[60px]"
        />

        {/* Central Core Signal Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={contentControls}
          className="flex flex-col items-center justify-center font-sans text-center relative"
        >
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Layers className="w-7 h-7 text-[#4F8CFF] animate-pulse" />
          </div>
          <h2 className="text-xl font-bold tracking-widest text-white uppercase select-none">
            REVEALING COGNITIVE VECTOR CORE
          </h2>
          <p className="text-[10px] font-mono text-[#4F8CFF] uppercase tracking-[0.2em] mt-2">
            INITIATING SPATIAL SUBSYSTEMS
          </p>
        </motion.div>
      </div>
    </div>
  );
}
