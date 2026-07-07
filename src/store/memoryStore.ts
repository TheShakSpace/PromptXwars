/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";

interface MemoryItem {
  key: string;
  value: string;
  timestamp: string;
  confidence: number;
}

interface MemoryState {
  memoryKeys: MemoryItem[];
  confidenceScore: number;
  tokensProcessed: number;
  addMemoryKey: (key: string, value: string, confidence?: number) => void;
  removeMemoryKey: (key: string) => void;
  setConfidenceScore: (score: number) => void;
  incrementTokensProcessed: (amt: number) => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memoryKeys: [
    { key: "system_kernel", value: "Helios-v2.5.4-React-19", timestamp: new Date().toLocaleTimeString(), confidence: 0.99 },
    { key: "active_user", value: "shakshikumari2541@gmail.com", timestamp: new Date().toLocaleTimeString(), confidence: 0.95 },
  ],
  confidenceScore: 98.4,
  tokensProcessed: 142850,
  addMemoryKey: (key, value, confidence = 0.9) =>
    set((state) => ({
      memoryKeys: [
        ...state.memoryKeys.filter((m) => m.key !== key),
        { key, value, timestamp: new Date().toLocaleTimeString(), confidence },
      ],
    })),
  removeMemoryKey: (key) =>
    set((state) => ({
      memoryKeys: state.memoryKeys.filter((m) => m.key !== key),
    })),
  setConfidenceScore: (score) => set({ confidenceScore: score }),
  incrementTokensProcessed: (amt) => set((state) => ({ tokensProcessed: state.tokensProcessed + amt })),
}));
