/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { OSMode, AIModel, type SystemNotification, type TerminalHistoryItem, type AIPromptPreset } from "../types";
import { promptPresets } from "../data/promptPresets";

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
  const [mode, setMode] = useState<OSMode>(OSMode.IMMERSIVE);
  const [activePreset, setActivePreset] = useState<AIPromptPreset>(promptPresets[0]);
  const [activeModel, setActiveModel] = useState<AIModel>(AIModel.FLASH);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [splineProgress, setSplineProgress] = useState<number>(0);
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-helios-core");
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "init-noti",
      title: "Helios OS Active",
      message: "Autonomous AI kernel version 2.5.4 successfully loaded.",
      type: "success",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>([
    {
      id: "welcome-1",
      type: "system",
      content: "HELIOS OS KERNEL BUILD v2.5.4-STABLE (TypeScript/React-19)",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "welcome-2",
      type: "system",
      content: "Type 'help' to print list of autonomous shell operations.",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  const addNotification = useCallback((title: string, message: string, type: SystemNotification["type"] = "info") => {
    const newNoti: SystemNotification = {
      id: `noti-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNoti, ...prev.slice(0, 9)]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearTerminal = useCallback(() => {
    setTerminalHistory([]);
  }, []);

  const executeCommand = useCallback(async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    const inputItem: TerminalHistoryItem = {
      id: `cmd-${Date.now()}-input`,
      type: "input",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTerminalHistory((prev) => [...prev, inputItem]);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputContent = "";
    let isError = false;

    // Handle basic command evaluations in OS kernel
    switch (command) {
      case "help":
        outputContent = `Available operations:
  help                    Display all functional commands.
  sysinfo                 Print core hardware parameters.
  mode [name]             Switch workspace views ('immersive', 'workspace', 'analytics').
  prompt [id]             Configure system instruction sets.
  model [name]            Switch Active Gemini intelligence.
  notify [msg]            Test real-time telemetry notification layers.
  clear                   Flush prompt terminal caches.`;
        break;

      case "sysinfo":
        outputContent = `HELIOS OS v2.5.4
Runtime Environment: React 19 / Vite 6 / Tailwind CSS v4
Primary 3D Pipeline: Spline GPU Vector Engine
Connected Intelligence: ${activeModel}
Core Handshake Status: SECURE [0.0.0.0:3000]`;
        break;

      case "mode":
        if (args.length === 0) {
          outputContent = `Current layout mode is: '${mode}'. Try 'mode workspace' or 'mode immersive'.`;
        } else {
          const targetMode = args[0].toLowerCase() as OSMode;
          if (Object.values(OSMode).includes(targetMode)) {
            setMode(targetMode);
            outputContent = `System layout shifted successfully to '${targetMode}'.`;
            addNotification("Layout Adjusted", `Shifted interface context to ${targetMode}.`, "info");
          } else {
            outputContent = `Invalid layout mode '${args[0]}'. Choose from: immersive, workspace, analytics.`;
            isError = true;
          }
        }
        break;

      case "prompt":
        if (args.length === 0) {
          outputContent = `Active profile: '${activePreset.name}'. Prompts: '${activePreset.prompt}'.`;
        } else {
          const id = args[0];
          const match = promptPresets.find((p) => p.id.includes(id) || p.name.toLowerCase().includes(id.toLowerCase()));
          if (match) {
            setActivePreset(match);
            outputContent = `Instruction profiles linked successfully to: '${match.name}'.`;
            addNotification("Synapses Modified", `AI Instruction swapped to ${match.name}.`, "success");
          } else {
            outputContent = `Preset profiles matching '${id}' not found. Try 'prompt code' or 'prompt creative'.`;
            isError = true;
          }
        }
        break;

      case "model":
        if (args.length === 0) {
          outputContent = `Active intelligence router is set to: '${activeModel}'.`;
        } else {
          const target = args[0].toLowerCase();
          if (target.includes("flash")) {
            setActiveModel(AIModel.FLASH);
            outputContent = `Intelligence router shifted successfully to 'gemini-3.5-flash'.`;
          } else if (target.includes("pro")) {
            setActiveModel(AIModel.PRO);
            outputContent = `Intelligence router shifted successfully to 'gemini-3.1-pro-preview'.`;
          } else if (target.includes("live")) {
            setActiveModel(AIModel.LIVE);
            outputContent = `Intelligence router shifted successfully to 'gemini-3.1-flash-live-preview'.`;
          } else {
            outputContent = `Intelligence router code '${args[0]}' unrecognized. Try 'model pro' or 'model flash'.`;
            isError = true;
          }
        }
        break;

      case "notify":
        if (args.length === 0) {
          outputContent = "Provide notification parameter. E.g., 'notify Workspace active'.";
        } else {
          const msg = args.join(" ");
          addNotification("System Command Triggered", msg, "warning");
          outputContent = "Broadcast telemetry notification sent.";
        }
        break;

      case "clear":
        clearTerminal();
        return;

      default:
        // Mock prompt compilation output for unmapped commands (acting as direct Gemini translation)
        outputContent = `Synthesizing model query response for prompt [${trimmed}]...
[${activeModel}]: Connecting workspace parameters. Operational framework is fully customized. To integrate raw API callbacks, bind endpoints to '/api/gemini'.`;
        break;
    }

    const outputItem: TerminalHistoryItem = {
      id: `cmd-${Date.now()}-output`,
      type: isError ? "error" : "output",
      content: outputContent,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTerminalHistory((prev) => [...prev, outputItem]);
  }, [mode, activeModel, activePreset, addNotification, clearTerminal]);

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
        clearTerminal,
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
