/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { TerminalHistoryItem, OSMode, AIModel } from "../types";
import { promptPresets } from "../data/promptPresets";
import { useUIStore } from "./uiStore";
import { useWorkspaceStore } from "./workspaceStore";
import { useNotificationStore } from "./notificationStore";

interface HistoryState {
  terminalHistory: TerminalHistoryItem[];
  addHistoryItem: (item: TerminalHistoryItem) => void;
  clearHistory: () => void;
  executeCommand: (cmdString: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  terminalHistory: [
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
    },
  ],
  addHistoryItem: (item) => set((state) => ({ terminalHistory: [...state.terminalHistory, item] })),
  clearHistory: () => set({ terminalHistory: [] }),
  executeCommand: async (cmdString) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    const inputItem: TerminalHistoryItem = {
      id: `cmd-${Date.now()}-input`,
      type: "input",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    set((state) => ({ terminalHistory: [...state.terminalHistory, inputItem] }));

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputContent = "";
    let isError = false;

    // Resolve stores inside actions
    const uiStore = useUIStore.getState();
    const workspaceStore = useWorkspaceStore.getState();
    const notificationStore = useNotificationStore.getState();

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
Connected Intelligence: ${workspaceStore.activeModel}
Core Handshake Status: SECURE [0.0.0.0:3000]`;
        break;

      case "mode":
        if (args.length === 0) {
          outputContent = `Current layout mode is: '${uiStore.mode}'. Try 'mode workspace' or 'mode immersive'.`;
        } else {
          const targetMode = args[0].toLowerCase() as OSMode;
          if (Object.values(OSMode).includes(targetMode)) {
            uiStore.setMode(targetMode);
            outputContent = `System layout shifted successfully to '${targetMode}'.`;
            notificationStore.addNotification("Layout Adjusted", `Shifted interface context to ${targetMode}.`, "info");
          } else {
            outputContent = `Invalid layout mode '${args[0]}'. Choose from: immersive, workspace, analytics.`;
            isError = true;
          }
        }
        break;

      case "prompt":
        if (args.length === 0) {
          outputContent = `Active profile: '${workspaceStore.activePreset.name}'. Prompts: '${workspaceStore.activePreset.prompt}'.`;
        } else {
          const id = args[0];
          const match = promptPresets.find((p) => p.id.includes(id) || p.name.toLowerCase().includes(id.toLowerCase()));
          if (match) {
            workspaceStore.setActivePreset(match);
            outputContent = `Instruction profiles linked successfully to: '${match.name}'.`;
            notificationStore.addNotification("Synapses Modified", `AI Instruction swapped to ${match.name}.`, "success");
          } else {
            outputContent = `Preset profiles matching '${id}' not found. Try 'prompt code' or 'prompt creative'.`;
            isError = true;
          }
        }
        break;

      case "model":
        if (args.length === 0) {
          outputContent = `Active intelligence router is set to: '${workspaceStore.activeModel}'.`;
        } else {
          const target = args[0].toLowerCase();
          if (target.includes("flash")) {
            workspaceStore.setActiveModel(AIModel.FLASH);
            outputContent = `Intelligence router shifted successfully to 'gemini-3.5-flash'.`;
          } else if (target.includes("pro")) {
            workspaceStore.setActiveModel(AIModel.PRO);
            outputContent = `Intelligence router shifted successfully to 'gemini-3.1-pro-preview'.`;
          } else if (target.includes("live")) {
            workspaceStore.setActiveModel(AIModel.LIVE);
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
          notificationStore.addNotification("System Command Triggered", msg, "warning");
          outputContent = "Broadcast telemetry notification sent.";
        }
        break;

      case "clear":
        get().clearHistory();
        return;

      default:
        outputContent = `Synthesizing model query response for prompt [${trimmed}]...
[${workspaceStore.activeModel}]: Connecting workspace parameters. Operational framework is fully customized. To integrate raw API callbacks, bind endpoints to '/api/gemini'.`;
        break;
    }

    const outputItem: TerminalHistoryItem = {
      id: `cmd-${Date.now()}-output`,
      type: isError ? "error" : "output",
      content: outputContent,
      timestamp: new Date().toLocaleTimeString(),
    };

    set((state) => ({ terminalHistory: [...state.terminalHistory, outputItem] }));
  },
}));
