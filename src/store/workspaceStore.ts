/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { AIModel, AIPromptPreset } from "../types";
import { promptPresets } from "../data/promptPresets";

interface WorkspaceState {
  activePreset: AIPromptPreset;
  activeModel: AIModel;
  activeProjectId: string;
  setActivePreset: (preset: AIPromptPreset) => void;
  setActiveModel: (model: AIModel) => void;
  setActiveProjectId: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activePreset: promptPresets[0],
  activeModel: AIModel.FLASH,
  activeProjectId: "proj-helios-core",
  setActivePreset: (preset) => set({ activePreset: preset }),
  setActiveModel: (model) => set({ activeModel: model }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
}));
