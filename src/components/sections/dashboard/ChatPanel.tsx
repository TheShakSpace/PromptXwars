/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { PromptTemplates } from "./PromptTemplates";
import { 
  Send, Brain, Cpu, Sparkles, Volume2, VolumeX, Copy, 
  RotateCcw, ThumbsUp, ThumbsDown, Check, Loader2, Play 
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function ChatPanel() {
  const { activeModel, setActiveModel, addNotification } = useOS();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Helios AI Operator online. Write structural requirements or load a model template to synthesize code coordinates.",
      timestamp: "Just now",
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0); // 0: Idle, 1: Thinking, 2: Reasoning, 3: Planning, 4: Generating, 5: Completed
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, thinkingStep]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText("");

    const userMsg: Message = {
      id: `msg-usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setThinkingStep(1); // Thinking...

    // Step-by-step thinking timeline simulated
    setTimeout(() => {
      setThinkingStep(2); // Reasoning...
      setTimeout(() => {
        setThinkingStep(3); // Planning...
        setTimeout(() => {
          setThinkingStep(4); // Generating...

          // Mocking response synthesis based on input keywords
          let aiResponse = "";
          const lowerText = text.toLowerCase();
          if (lowerText.includes("explain") || lowerText.includes("algorithm")) {
            aiResponse = `### Cognitive Algorithm Synthesis\n\n\`\`\`typescript\n// Binary search optimization\nexport function binarySearch<T>(list: T[], target: T): number {\n  let low = 0, high = list.length - 1;\n  while (low <= high) {\n    const mid = (low + high) >> 1;\n    if (list[mid] === target) return mid;\n    list[mid] < target ? low = mid + 1 : high = mid - 1;\n  }\n  return -1;\n}\n\`\`\`\n- **Big-O Scale**: $O(\\log n)$ comparison speed.\n- **VRAM profile**: In-place pointer variables occupy $O(1)$ memory footprints.`;
          } else if (lowerText.includes("summarize") || lowerText.includes("file")) {
            aiResponse = `### Code File High-Level Analysis\n\n1. **Core Interface Exports**: Exposes \`Topbar\`, \`Sidebar\`, and \`StatusCard\` modules.\n2. **State Subsystem**: Synchronized dynamically via \`OSProvider\` context.\n3. **Design Framework**: Adheres to glassmorphism, with soft blur backplates and customizable visual glows.`;
          } else if (lowerText.includes("debug") || lowerText.includes("memory")) {
            aiResponse = `### Memory Allocation Audit Report\n\n- **Issue Detected**: Latent \`useEffect\` hook lack cleanup triggers on canvas frame resize subscriptions.\n- **Resolution**: Return cleanups systematically:\n\`\`\`typescript\nuseEffect(() => {\n  const obs = new ResizeObserver(cb);\n  obs.observe(el);\n  return () => obs.disconnect(); // Correct leak!\n}, []);\n\`\`\``;
          } else {
            aiResponse = `### Synthesis Parameter Compiled successfully.\n\nYour instructions have been executed against \`${activeModel}\`.\n\n- **Response Speed**: 142 Tokens per second.\n- **Cryptographic Hash**: ECDSA_256 Validated.\n\nReady for spatial integration pipelines.`;
          }

          setTimeout(() => {
            setThinkingStep(5); // Completed!
            setTimeout(() => {
              setIsThinking(false);
              setThinkingStep(0);

              const aiMsg: Message = {
                id: `msg-ai-${Date.now()}`,
                sender: "ai",
                text: aiResponse,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              };
              setMessages((prev) => [...prev, aiMsg]);
              addNotification("AI Synthesis Complete", "Processed response successfully.", "success");
            }, 300);
          }, 1000);
        }, 900);
      }, 700);
    }, 600);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addNotification("Copied to Clipboard", "Code blocks stored safely.", "info");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      addNotification("Voice Operator Active", "Mic buffer listening...", "info");
      setTimeout(() => {
        setIsVoiceActive(false);
        setInputText("Optimize memory sweeps against active thread pipelines.");
        addNotification("Voice Captured", "Voice compiled successfully.", "success");
      }, 3000);
    } else {
      setIsVoiceActive(false);
    }
  };

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed right-4 top-28 bottom-24 w-90 hidden xl:flex flex-col bg-[#050505]/60 border border-white/5 backdrop-blur-2xl rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-30"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      {/* Header model controller */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4 select-none relative z-10 font-mono">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#EC4899]" />
          <span className="text-[10px] text-white/40 tracking-widest uppercase font-bold">COGNITIVE COMPILER</span>
        </div>

        {/* Model quick select dropdown */}
        <select
          value={activeModel}
          onChange={(e) => {
            setActiveModel(e.target.value as any);
            addNotification("Router Changed", `Active node: ${e.target.value}`, "info");
          }}
          className="bg-white/5 border border-white/10 rounded-lg text-[9px] px-2 py-1 text-white font-bold outline-none cursor-pointer hover:border-white/20 transition-all"
        >
          <option value="gemini-3.5-flash" className="bg-neutral-950 text-white">FLASH 3.5</option>
          <option value="gemini-3.1-pro-preview" className="bg-neutral-950 text-white">PRO 3.1</option>
        </select>
      </div>

      {/* Conversation Thread bubbles */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mb-4 scrollbar-thin relative z-10">
        {messages.map((msg) => {
          const isAI = msg.sender === "ai";
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isAI ? "self-start" : "self-end"}`}
            >
              {/* Sender parameter header */}
              <span className={`font-mono text-[8px] text-white/20 uppercase tracking-widest mb-1 ${!isAI && "text-right"}`}>
                {isAI ? "HELIOS OPERATOR" : "ME"}
              </span>

              {/* Glass bubble */}
              <div
                className={`p-3.5 rounded-2xl border text-xs leading-relaxed select-text relative group ${
                  isAI
                    ? "bg-white/[0.01] border-white/5 text-white/80 rounded-tl-none"
                    : "bg-[#EC4899]/5 border-[#EC4899]/20 text-white rounded-tr-none"
                }`}
              >
                {/* Custom render markdown highlights */}
                {msg.text.includes("```") ? (
                  <div className="flex flex-col gap-2 font-mono text-[10.5px]">
                    {msg.text.split("```").map((chunk, i) => {
                      if (i % 2 === 1) {
                        return (
                          <div key={i} className="bg-black/40 border border-white/5 rounded-lg p-2.5 overflow-x-auto relative">
                            {/* Copy button overlay */}
                            <button
                              onClick={() => handleCopyText(msg.id, chunk)}
                              className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-white/45 hover:text-white transition-opacity p-1 bg-white/5 rounded"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <pre className="text-white/90">{chunk}</pre>
                          </div>
                        );
                      }
                      return <p key={i} className="font-sans text-xs leading-relaxed">{chunk}</p>;
                    })}
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}

                {/* Micro Actions line for AI message bubbles */}
                {isAI && (
                  <div className="flex items-center gap-2.5 mt-2.5 border-t border-white/5 pt-2 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="text-[8px] font-mono text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" /> COPY
                    </button>
                    <button
                      onClick={() => handleSendMessage(msg.text)}
                      className="text-[8px] font-mono text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> RETRY
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic AI Thinking panel step-by-step progress */}
        {isThinking && (
          <div className="flex flex-col self-start max-w-[85%] font-mono select-none">
            <span className="text-[8px] text-white/20 uppercase tracking-widest mb-1">
              AI THINKING PROFILE
            </span>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col gap-3 text-[10px] text-white/40">
              <div className="flex items-center gap-2 text-white/70">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EC4899]" />
                <span className="font-bold">COMPILING SYNAPSE ROUTING...</span>
              </div>

              {/* Step checklist */}
              <div className="flex flex-col gap-1.5 pl-5 border-l border-white/5 text-[9px]">
                <div className={`flex items-center gap-2 ${thinkingStep >= 1 ? "text-green-400 font-bold" : "text-white/20"}`}>
                  <span>{thinkingStep >= 1 ? "●" : "○"}</span>
                  <span>[1/4] INDEXING PARAMS</span>
                </div>
                <div className={`flex items-center gap-2 ${thinkingStep >= 2 ? "text-green-400 font-bold" : "text-white/20"}`}>
                  <span>{thinkingStep >= 2 ? "●" : "○"}</span>
                  <span>[2/4] REASONING ALIGNMENT</span>
                </div>
                <div className={`flex items-center gap-2 ${thinkingStep >= 3 ? "text-green-400 font-bold" : "text-white/20"}`}>
                  <span>{thinkingStep >= 3 ? "●" : "○"}</span>
                  <span>[3/4] SYSTEM SYNTACTIC PLANNING</span>
                </div>
                <div className={`flex items-center gap-2 ${thinkingStep >= 4 ? "text-[#EC4899] font-black animate-pulse" : "text-white/20"}`}>
                  <span>{thinkingStep >= 4 ? "▶" : "○"}</span>
                  <span>[4/4] STREAMING COORDINATES</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Templates injection tray */}
      <div className="border-t border-white/5 pt-4 mb-4 relative z-10">
        <PromptTemplates onSelectTemplate={(presetText) => setInputText((prev) => prev + presetText)} />
      </div>

      {/* Input textbox control panel */}
      <div className="relative border border-white/10 bg-white/[0.02] rounded-xl focus-within:border-[#EC4899]/40 focus-within:shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all z-10 shrink-0">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Instruct Helios Operator... (Shift+Enter for newline)"
          className="w-full bg-transparent border-none outline-none p-3.5 pr-20 text-white text-xs placeholder-white/25 resize-none h-16 scrollbar-none select-text"
          disabled={isThinking}
        />

        <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2.5 select-none">
          {/* Voice Mic trigger */}
          <button
            onClick={toggleVoice}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
              isVoiceActive
                ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="text-[10px]">🎙</span>
          </button>

          {/* Send arrow */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isThinking}
            className="w-7 h-7 rounded-lg bg-[#EC4899] hover:bg-[#EC4899]/85 disabled:opacity-30 disabled:hover:bg-[#EC4899] text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg shadow-pink-500/20"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
