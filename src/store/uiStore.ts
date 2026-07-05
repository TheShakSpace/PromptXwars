/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { OSMode } from "../types";

interface UIState {
  mode: OSMode;
  isTerminalOpen: boolean;
  activeSidebarTab: string;
  splineProgress: number;
  isCommandPaletteOpen: boolean;
  setMode: (mode: OSMode) => void;
  setIsTerminalOpen: (open: boolean) => void;
  setActiveSidebarTab: (tab: string) => void;
  setSplineProgress: (pct: number) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mode: OSMode.IMMERSIVE,
  isTerminalOpen: false,
  activeSidebarTab: "dashboard",
  splineProgress: 0,
  isCommandPaletteOpen: false,
  setMode: (mode) => set({ mode }),
  setIsTerminalOpen: (open) => set({ isTerminalOpen: open }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setSplineProgress: (pct) => set({ splineProgress: pct }),
  setIsCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
