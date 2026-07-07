/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ReasoningTimeline, TimelineStep } from "./ReasoningTimeline";
import { useOS } from "../../../contexts/OSContext";
import { Send, Sparkles, Paperclip, Mic, Copy, RefreshCw, Pin, Bookmark, ArrowUpRight, HelpCircle, CornerDownLeft } from "lucide-react";
import { globalExecutionManager, ExecutionSession } from "../../../core/ExecutionManager";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  agent?: string;
  isForked?: boolean;
}

export function ChatWorkspace() {
  const { addNotification } = useOS();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "user",
      text: "Deconstruct the server.ts entry point for port 3000 safety limits.",
      timestamp: "Today, 08:30 AM",
    },
    {
      id: "msg-2",
      sender: "ai",
      text: "Deconstructing server.ts... System bounds comply fully with Nginx reverse proxy guidelines. Host binding configured securely to '0.0.0.0' with port fixed strictly to 3000.",
      timestamp: "Today, 08:31 AM",
      agent: "Daedalus Coder",
    },
  ]);

  const [session, setSession] = useState<ExecutionSession | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Simulated Thinking steps pipeline synced to live session
  const [thinkingSteps, setThinkingSteps] = useState<TimelineStep[]>([
    { id: "step-1", label: "Planning", status: "done", description: "Parsing semantic intent parameters & constructing workflow templates", duration: "12ms" },
    { id: "step-2", label: "Reasoning", status: "done", description: "Allocating agent nodes and evaluating rules matrices", duration: "24ms" },
    { id: "step-3", label: "Searching", status: "idle", description: "Querying indexers and semantic memory retrieval paths" },
    { id: "step-4", label: "Generating", status: "idle", description: "Streaming cognitive content from Gemini provider" },
    { id: "step-5", label: "Formatting", status: "idle", description: "Applying structural layout sanitizations & output templates" },
    { id: "step-6", label: "Completed", status: "idle", description: "Execution loop completed successfully" },
  ]);

  useEffect(() => {
    // Sync thinking steps and state to the live Execution Manager
    const unsubscribe = globalExecutionManager.subscribe((activeSession) => {
      setSession(activeSession ? { ...activeSession } : null);
      if (activeSession) {
        setIsThinking(activeSession.status !== "completed" && activeSession.status !== "failed");
        
        // Update thinking timeline states depending on pipeline stages
        setThinkingSteps([
          {
            id: "step-1",
            label: "Planning",
            status: activeSession.status === "planning" ? "running" : "done",
            description: "Parsing semantic intent parameters & constructing workflow templates",
            duration: activeSession.status === "planning" ? undefined : "15ms",
          },
          {
            id: "step-2",
            label: "Reasoning",
            status: activeSession.status === "planning" ? "idle" : activeSession.status === "running" ? "running" : "done",
            description: "Allocating agent nodes and evaluating rules matrices",
            duration: activeSession.status === "running" || activeSession.status === "planning" ? undefined : "45ms",
          },
          {
            id: "step-3",
            label: "Searching",
            status: activeSession.status === "planning" ? "idle" : activeSession.status === "running" ? "running" : "done",
            description: "Querying indexers and semantic memory retrieval paths",
            duration: activeSession.status === "running" || activeSession.status === "planning" ? undefined : "28ms",
          },
          {
            id: "step-4",
            label: "Generating",
            status: activeSession.status === "validating" ? "running" : activeSession.status === "completed" ? "done" : "idle",
            description: "Streaming cognitive content from Gemini provider",
            duration: activeSession.status === "completed" ? "320ms" : undefined,
          },
          {
            id: "step-5",
            label: "Formatting",
            status: activeSession.status === "validating" ? "running" : activeSession.status === "completed" ? "done" : "idle",
            description: "Applying structural layout sanitizations & output templates",
            duration: activeSession.status === "completed" ? "35ms" : undefined,
          },
          {
            id: "step-6",
            label: "Completed",
            status: activeSession.status === "completed" ? "done" : "idle",
            description: "Execution loop completed successfully",
            duration: activeSession.status === "completed" ? "2ms" : undefined,
          },
        ]);
      } else {
        setIsThinking(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userM: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userM]);
    const rawPrompt = inputText;
    setInputText("");
    addNotification("Directive Transferred", "Streaming query matrix to Helios Planner.", "info");

    try {
      const record = await globalExecutionManager.executeSession(rawPrompt);
      const aiM: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: record.completion.text,
        timestamp: "Just now",
        agent: record.selectedAgent.name,
      };
      setMessages((prev) => [...prev, aiM]);
      addNotification("Consensus Complete", "Response successfully compiled and validated.", "success");
    } catch {
      addNotification("Failover Roller Triggered", "Automatic rollback completed.", "error");
    }
  };

  const handleAction = (type: string, id: string) => {
    addNotification("Action Logged", `Executed: ${type.toUpperCase()}`, "info");
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      
      {/* Messages Canvas Workspace */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[480px]">
        
        {/* Messages Stack */}
        <div className="flex-1 overflow-y-auto max-h-[350px] flex flex-col gap-5 pr-1.5 scrollbar-thin mb-4">
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={`flex gap-4 p-4 rounded-2xl border transition-all relative group ${
                  isAI
                    ? "bg-white/[0.01] border-white/5"
                    : "bg-[#4F8CFF]/5 border-[#4F8CFF]/15"
                }`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-sm font-sans shrink-0">
                  {isAI ? "🤖" : "👤"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1 select-none">
                    <span className="text-[10px] font-black text-white/95 uppercase">
                      {isAI ? msg.agent : "YOU"}
                    </span>
                    <span className="font-mono text-[7px] text-white/20 uppercase">{msg.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-white/70 leading-relaxed font-light select-text">
                    {msg.text}
                  </p>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5 mt-3 border-t border-white/5 pt-2.5 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    <button
                      onClick={() => handleAction("copy", msg.id)}
                      className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white transition-colors cursor-pointer"
                      title="Copy text"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAction("retry", msg.id)}
                      className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white transition-colors cursor-pointer"
                      title="Re-run pipeline"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAction("pin", msg.id)}
                      className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white transition-colors cursor-pointer"
                      title="Pin memory"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-4 p-4 rounded-2xl border border-dashed border-white/5 bg-transparent animate-pulse select-none">
              <div className="w-8 h-8 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-sm text-white/30 font-sans shrink-0">
                <LoaderIcon />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-[#4F8CFF] font-bold uppercase tracking-wider">SOLON REASONER THINKING...</span>
                <p className="text-[10px] text-white/25 mt-1 font-mono italic">"Analyzing parameter indices..."</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar Section */}
        <div className="flex items-center gap-2 border border-white/5 bg-[#050505]/60 rounded-2xl px-3 py-2.5 relative focus-within:border-[#4F8CFF]/30 transition-all select-none">
          <button
            onClick={() => addNotification("Assets Panel Link", "Asset browser opened.", "info")}
            className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-white/30 hover:text-white transition-all cursor-pointer"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type command / directive to system routing layer..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-white/20 select-text font-sans py-1"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isThinking}
            className="p-2 rounded-xl bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 text-[#4F8CFF] hover:bg-[#4F8CFF]/25 hover:scale-101 active:scale-99 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-3.5 h-3.5 fill-[#4F8CFF]" />
          </button>
        </div>

      </div>

      {/* Reasoning Timeline diagnostic sidebar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between min-h-[350px]">
        
        <div>
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Sparkles className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">REASONING PROCESS MONITOR</span>
          </div>

          <ReasoningTimeline steps={thinkingSteps} />
        </div>

        <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
          <span>COMPILED LOGIC INTEGRITY: 100%</span>
          <span>AUTOPILOT STATE: SYNCED</span>
        </div>

      </div>

    </div>
  );
}

function LoaderIcon() {
  return (
    <svg className="animate-spin h-4 w-4 text-[#4F8CFF]" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
