/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";

interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  thinkingTime?: number;
  tokens?: number;
}

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingText: string;
  voiceSessionActive: boolean;
  addMessage: (text: string, sender: ChatMessage["sender"], thinkingTime?: number, tokens?: number) => void;
  setStreamingState: (isStreaming: boolean, text?: string) => void;
  setVoiceSessionActive: (active: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: "msg-1",
      sender: "system",
      text: "Helios Neural Handshake Established. Stream parameters online.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  isStreaming: false,
  streamingText: "",
  voiceSessionActive: false,
  addMessage: (text, sender, thinkingTime, tokens) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          sender,
          text,
          timestamp: new Date().toLocaleTimeString(),
          thinkingTime,
          tokens,
        },
      ],
    })),
  setStreamingState: (isStreaming, text = "") => set({ isStreaming, streamingText: text }),
  setVoiceSessionActive: (active) => set({ voiceSessionActive: active }),
  clearChat: () => set({ messages: [] }),
}));
