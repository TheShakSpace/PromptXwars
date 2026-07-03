/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useIntro, IntroState } from "../../contexts/IntroContext";
import { WelcomeScene } from "./scenes/WelcomeScene";
import { BootSequence } from "./scenes/BootSequence";
import { SystemScanner } from "./scenes/SystemScanner";
import { CurtainReveal } from "./scenes/CurtainReveal";
import { RobotActivation } from "./scenes/RobotActivation";
import { ParticleField } from "./ParticleField";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, FastForward } from "lucide-react";

export function SceneManager() {
  const { currentState, skipIntro, soundEnabled, setSoundEnabled, playSound } = useIntro();

  if (currentState === IntroState.COMPLETED) return null;

  return (
    <div id="intro-system-stage" className="fixed inset-0 z-50 overflow-hidden bg-[#050505] select-none">
      
      {/* 1. Interactive Starry Particle backdrop for technical immersion */}
      {currentState !== IntroState.WELCOME && currentState !== IntroState.GLITCH && (
        <ParticleField />
      )}

      {/* 2. Top-Right floating Sound / Control HUD overlay */}
      <div className="absolute top-8 right-8 z-[60] flex items-center gap-3 pointer-events-auto">
        {/* Skip button with high-contrast tactical style */}
        <button
          onClick={() => {
            playSound("click");
            skipIntro();
          }}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 rounded-full font-mono text-[9px] text-white/70 hover:text-white uppercase tracking-wider transition-all cursor-pointer active:scale-95"
          title="Skip System Intro sequence"
        >
          <FastForward className="w-3 h-3 text-[#4F8CFF]" />
          <span>SKIP INTRO</span>
        </button>

        {/* Audio Mute toggling selector */}
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            playSound("click");
          }}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer active:scale-95"
          title={soundEnabled ? "Mute interface audio" : "Unmute interactive audio synthesis"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#4F8CFF]" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* 3. Render current active scene step based on the state machine */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full"
        >
          {currentState === IntroState.WELCOME || currentState === IntroState.GLITCH ? (
            <WelcomeScene />
          ) : currentState === IntroState.BOOT ? (
            <BootSequence />
          ) : currentState === IntroState.SCANNING ? (
            <SystemScanner />
          ) : currentState === IntroState.CURTAIN ? (
            <CurtainReveal />
          ) : currentState === IntroState.ROBOT ? (
            <RobotActivation />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* 4. Center Audio permission helper hint for the user */}
      {currentState === IntroState.WELCOME && !soundEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white/5 border border-white/5 px-4.5 py-2.5 rounded-full backdrop-blur-md flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors pointer-events-auto"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#4F8CFF] animate-pulse" />
          <button
            onClick={() => {
              setSoundEnabled(true);
              playSound("startup");
            }}
            className="font-mono text-[9px] uppercase tracking-wider cursor-pointer"
          >
            Click here to enable interactive cyber audio
          </button>
        </motion.div>
      )}
    </div>
  );
}
