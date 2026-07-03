/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export enum IntroState {
  WELCOME = "welcome",
  GLITCH = "glitch",
  BOOT = "boot",
  SCANNING = "scanning",
  CURTAIN = "curtain",
  ROBOT = "robot",
  HERO = "hero",
  COMPLETED = "completed"
}

interface IntroContextType {
  currentState: IntroState;
  setCurrentState: (state: IntroState) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  bootProgress: number;
  setBootProgress: (progress: number) => void;
  isIntroSeen: boolean;
  skipIntro: () => void;
  resetIntro: () => void;
  playSound: (soundType: "startup" | "typing" | "power" | "curtain" | "click" | "hover") => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [currentState, setCurrentState] = useState<IntroState>(IntroState.WELCOME);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false); // muted by default (autoblocking friendly)
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [isIntroSeen, setIsIntroSeen] = useState<boolean>(false);

  // Initialize and check local storage
  useEffect(() => {
    try {
      const seen = window.localStorage.getItem("introSeen") === "true";
      setIsIntroSeen(seen);
      if (seen) {
        setCurrentState(IntroState.COMPLETED);
      }
    } catch (e) {
      console.warn("Storage exception in intro initialization:", e);
    }
  }, []);

  const skipIntro = useCallback(() => {
    try {
      window.localStorage.setItem("introSeen", "true");
    } catch (e) {
      console.warn(e);
    }
    setIsIntroSeen(true);
    setCurrentState(IntroState.COMPLETED);
  }, []);

  const resetIntro = useCallback(() => {
    try {
      window.localStorage.removeItem("introSeen");
    } catch (e) {
      console.warn(e);
    }
    setIsIntroSeen(false);
    setBootProgress(0);
    setCurrentState(IntroState.WELCOME);
  }, []);

  // Futuristic Synthesized Audio Engine (No network assets required, fully local Web Audio API synthesizer)
  const playSound = useCallback((soundType: "startup" | "typing" | "power" | "curtain" | "click" | "hover") => {
    if (!soundEnabled) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const dest = ctx.destination;

      switch (soundType) {
        case "startup": {
          // Warm cinematic chord launch
          const now = ctx.currentTime;
          const freqs = [110, 220, 330, 440, 550, 660];
          freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = i % 2 === 0 ? "sawtooth" : "triangle";
            osc.frequency.value = f;
            
            // Sweep bandpass filter for spatial cinematic opening
            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.Q.value = 8;
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.exponentialRampToValueAtTime(3000, now + 1.8);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(dest);

            osc.start(now);
            osc.stop(now + 2.6);
          });
          break;
        }

        case "typing": {
          // Micro mechanical tap sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1600 + Math.random() * 400, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.015, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);

          osc.connect(gain);
          gain.connect(dest);
          osc.start();
          osc.stop(ctx.currentTime + 0.06);
          break;
        }

        case "power": {
          // Heavy mechanical engine startup with pitching rise
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(50, now);
          osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(100, now);
          filter.frequency.exponentialRampToValueAtTime(1500, now + 1.2);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc.start();
          osc.stop(now + 1.6);
          break;
        }

        case "curtain": {
          // Low heavy swoosh wave sound
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 1.0);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          osc.connect(gain);
          gain.connect(dest);

          osc.start();
          osc.stop(now + 1.3);
          break;
        }

        case "click": {
          // Fast futuristic cyber tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(2200, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(dest);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
          break;
        }

        case "hover": {
          // Super subtle ambient hum
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          gain.gain.setValueAtTime(0.008, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(dest);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
          break;
        }
      }
    } catch (e) {
      console.warn("WebAudio synthesis unavailable:", e);
    }
  }, [soundEnabled]);

  return (
    <IntroContext.Provider
      value={{
        currentState,
        setCurrentState,
        soundEnabled,
        setSoundEnabled,
        bootProgress,
        setBootProgress,
        isIntroSeen,
        skipIntro,
        resetIntro,
        playSound,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (context === undefined) {
    throw new Error("useIntro must be used within an IntroProvider");
  }
  return context;
}
