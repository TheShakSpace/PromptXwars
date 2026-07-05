/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export type CursorType = "default" | "pointer" | "drag" | "text" | "loading" | "click" | "magnetic";

export interface MotionContextType {
  reducedMotion: boolean;
  cursorType: CursorType;
  cursorText: string;
  isMuted: boolean;
  setCursorType: (type: CursorType, text?: string) => void;
  toggleMute: () => void;
  playAudio: (type: "hover" | "click" | "notification" | "startup" | "workflow" | "robot") => void;
  isIntroPlaying: boolean;
  setIntroPlaying: (playing: boolean) => void;
  timelineProgress: number;
  setTimelineProgress: (progress: number) => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cursorType, setCursorTypeState] = useState<CursorType>("default");
  const [cursorText, setCursorText] = useState("");
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("athene_sound_muted");
    return saved === "true";
  });
  const [isIntroPlaying, setIntroPlaying] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(0);

  // Audio Context for synthesized sound cues (Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Detect system reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const setCursorType = (type: CursorType, text = "") => {
    setCursorTypeState(type);
    setCursorText(text);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("athene_sound_muted", String(next));
      return next;
    });
  };

  // Lazy initialize Audio Context on user gesture to avoid browser restrictions
  const getAudioContext = (): AudioContext | null => {
    if (isMuted) return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    // Resume context if suspended (common browser security policy)
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Handcrafted procedurally synthesized sound effects (Zero asset footprint, 100% responsive)
  const playAudio = (type: "hover" | "click" | "notification" | "startup" | "workflow" | "robot") => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const dest = ctx.destination;
      const now = ctx.currentTime;

      if (type === "hover") {
        // High-end minimalist tick, very crisp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.015);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.02);
      } else if (type === "click") {
        // Soft analog pop, premium haptic feedback
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "notification") {
        // Pure chime arpeggio, celestial and elegant
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const timeOffset = idx * 0.06;

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + timeOffset);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.03, now + timeOffset + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.25);

          osc.connect(gain);
          gain.connect(dest);

          osc.start(now + timeOffset);
          osc.stop(now + timeOffset + 0.3);
        });
      } else if (type === "startup") {
        // Deep ambient mechanical boot hum + ethereal drone chord
        const chord = [110.0, 220.0, 329.63, 440.0, 554.37]; // A2, A3, E4, A4, C#5
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = idx < 2 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freq, now);
          
          // Ethereal filter effect simulated via soft envelope
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.025, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

          osc.connect(gain);
          gain.connect(dest);

          osc.start(now);
          osc.stop(now + 2.0);
        });
      } else if (type === "workflow") {
        // High-frequency digital processing click train
        const clicks = 5;
        for (let i = 0; i < clicks; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const timeOffset = i * 0.05 + Math.random() * 0.02;

          osc.type = "sine";
          osc.frequency.setValueAtTime(1800 - i * 150, now + timeOffset);

          gain.gain.setValueAtTime(0.008, now + timeOffset);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.02);

          osc.connect(gain);
          gain.connect(dest);

          osc.start(now + timeOffset);
          osc.stop(now + timeOffset + 0.025);
        }
      } else if (type === "robot") {
        // High-tech AI cognitive chirp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(1760, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {
      console.warn("Synthesized sound trigger bypassed:", e);
    }
  };

  return (
    <MotionContext.Provider
      value={{
        reducedMotion,
        cursorType,
        cursorText,
        isMuted,
        setCursorType,
        toggleMute,
        playAudio,
        isIntroPlaying,
        setIntroPlaying,
        timelineProgress,
        setTimelineProgress,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error("useMotion must be used within a MotionProvider / AnimationProvider");
  }
  return context;
}
