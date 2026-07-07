/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";

interface ThemeState {
  theme: "dark" | "light";
  contrastMode: boolean;
  reducedMotion: boolean;
  toggleTheme: () => void;
  setContrastMode: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  contrastMode: false,
  reducedMotion: false,
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setContrastMode: (enabled) => set({ contrastMode: enabled }),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
}));
