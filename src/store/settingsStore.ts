/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";

interface OperatorSettings {
  developerMode: boolean;
  telemetryLogging: boolean;
  soundVolume: number;
  speechSynthesis: boolean;
  hapticIntensity: "none" | "low" | "medium" | "high";
  maxTokenLimit: number;
  autoSaveCaches: boolean;
}

interface SettingsState {
  settings: OperatorSettings;
  updateSetting: <K extends keyof OperatorSettings>(key: K, value: OperatorSettings[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: OperatorSettings = {
  developerMode: true,
  telemetryLogging: true,
  soundVolume: 0.6,
  speechSynthesis: false,
  hapticIntensity: "medium",
  maxTokenLimit: 128000,
  autoSaveCaches: true,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  updateSetting: (key, value) =>
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    })),
  resetSettings: () => set({ settings: defaultSettings }),
}));
