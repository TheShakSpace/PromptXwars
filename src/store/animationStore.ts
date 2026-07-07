/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";

interface AnimationState {
  particleDensity: number;
  glowIntensity: number;
  hapticFeedbackEnabled: boolean;
  cursorType: "default" | "pointer" | "hidden" | "text" | "none";
  setParticleDensity: (density: number) => void;
  setGlowIntensity: (intensity: number) => void;
  setHapticFeedbackEnabled: (enabled: boolean) => void;
  setCursorType: (type: "default" | "pointer" | "hidden" | "text" | "none") => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  particleDensity: 40,
  glowIntensity: 0.8,
  hapticFeedbackEnabled: true,
  cursorType: "default",
  setParticleDensity: (density) => set({ particleDensity: density }),
  setGlowIntensity: (intensity) => set({ glowIntensity: intensity }),
  setHapticFeedbackEnabled: (enabled) => set({ hapticFeedbackEnabled: enabled }),
  setCursorType: (type) => set({ cursorType: type }),
}));
