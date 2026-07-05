/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, ReactNode } from "react";
import { OSMode, AIModel, type SystemNotification, type TerminalHistoryItem, type AIPromptPreset } from "../types";
import {
  useUIStore,
  useWorkspaceStore,
  useNotificationStore,
  useHistoryStore,
} from "../store";

interface OSContextType {
  mode: OSMode;
  setMode: (mode: OSMode) => void;
  activePreset: AIPromptPreset;
  setActivePreset: (preset: AIPromptPreset) => void;
  activeModel: AIModel;
  setActiveModel: (model: AIModel) => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  terminalHistory: TerminalHistoryItem[];
  executeCommand: (cmdString: string) => Promise<void>;
  clearTerminal: () => void;
  notifications: SystemNotification[];
  addNotification: (title: string, message: string, type?: SystemNotification["type"]) => void;
  dismissNotification: (id: string) => void;
  splineProgress: number;
  setSplineProgress: (pct: number) => void;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: ReactNode }) {
  // Bridge to Zustand stores for ultra-high performance and fine-grained state management
  const { mode, setMode, isTerminalOpen, setIsTerminalOpen, splineProgress, setSplineProgress } = useUIStore();
  const { activePreset, setActivePreset, activeModel, setActiveModel, activeProjectId, setActiveProjectId } = useWorkspaceStore();
  const { notifications, addNotification, dismissNotification } = useNotificationStore();
  const { terminalHistory, executeCommand, clearHistory } = useHistoryStore();

  return (
    <OSContext.Provider
      value={{
        mode,
        setMode,
        activePreset,
        setActivePreset,
        activeModel,
        setActiveModel,
        isTerminalOpen,
        setIsTerminalOpen,
        terminalHistory,
        executeCommand,
        clearTerminal: clearHistory,
        notifications,
        addNotification,
        dismissNotification,
        splineProgress,
        setSplineProgress,
        activeProjectId,
        setActiveProjectId,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error("useOS must be used within an OSProvider");
  }
  return context;
}
