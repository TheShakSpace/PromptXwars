/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIntro, IntroState } from "../../../contexts/IntroContext";

export function WelcomeScene() {
  const { currentState, setCurrentState, playSound } = useIntro();
  const [glitchActive, setGlitchActive] = useState(false);

  const word = "WELCOME";
  const letters = word.split("");

  useEffect(() => {
    if (currentState !== IntroState.WELCOME) return;

    // Trigger startup sound on mounting/starting intro
    setTimeout(() => {
      playSound("startup");
    }, 200);

    // Scene 1 duration: 1.5s
    const glitchTimer = setTimeout(() => {
      setCurrentState(IntroState.GLITCH);
      setGlitchActive(true);
      playSound("typing");
    }, 1500);

    return () => clearTimeout(glitchTimer);
  }, [currentState, playSound, setCurrentState]);

  useEffect(() => {
    if (currentState !== IntroState.GLITCH) return;

    // Elegant high-fidelity rapid glitch intervals
    const glitchSoundInterval = setInterval(() => {
      playSound("typing");
    }, 180);

    const completeTimer = setTimeout(() => {
      clearInterval(glitchSoundInterval);
      setCurrentState(IntroState.BOOT);
    }, 1300);

    return () => {
      clearInterval(glitchSoundInterval);
      clearTimeout(completeTimer);
    };
  }, [currentState, playSound, setCurrentState]);

  // Framer Motion spring and ease combos
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, scale: 0.88, filter: "blur(15px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 18,
      },
    },
  } as any;

  if (currentState !== IntroState.WELCOME && currentState !== IntroState.GLITCH) {
    return null;
  }

  return (
    <div
      id="intro-scene-1-2"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000 select-none ${
        glitchActive ? "bg-black" : "bg-white"
      }`}
    >
      {/* Glitch CRT Overlay Layer */}
      {glitchActive && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden mix-blend-screen opacity-15">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] animate-flicker" />
        </div>
      )}

      {/* Main Title Typography Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex items-center justify-center gap-1.5 md:gap-3"
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className={`font-sans font-black text-6xl md:text-9xl tracking-[0.05em] select-none ${
              glitchActive
                ? "text-white animate-cyber-glitch relative"
                : "text-[#050505]"
            }`}
            data-text={char}
          >
            {char}
            {/* Chromatic Aberration RGB Duplicate Elements */}
            {glitchActive && (
              <>
                <span className="absolute left-[2px] top-0 text-[#FF0055] opacity-70 mix-blend-screen animate-[glitch-offset_0.8s_infinite] select-none pointer-events-none">
                  {char}
                </span>
                <span className="absolute -left-[2px] top-0 text-[#00FFFF] opacity-70 mix-blend-screen animate-[glitch-offset-2_0.8s_infinite] select-none pointer-events-none">
                  {char}
                </span>
              </>
            )}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
