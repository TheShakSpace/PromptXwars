/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Terminal, Copy, Save, Sparkles, Check, Code } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

interface PromptEditorProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: () => void;
}

export function PromptEditor({ value, onChange, onSave }: PromptEditorProps) {
  const { addNotification } = useOS();
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate line numbers matching content
  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 6);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    addNotification("Copied to Clipboard", "Prompt syntax copied securely.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener inside editor (e.g., Ctrl+S to save, Ctrl+Enter to submit/execute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSave?.();
        addNotification("Draft Preserved", "Secure local snapshot cached.", "success");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, value, onSave, addNotification]);

  // Simulated basic syntax highlighting logic for visualization
  const renderHighlightedCode = () => {
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-4" />;
      }

      // Basic tokens matching
      const words = line.split(/(\s+)/);
      const highlightedWords = words.map((word, wordIdx) => {
        // Highlight prompt variables like {{variable_name}}
        if (word.startsWith("{{") && word.endsWith("}}")) {
          return (
            <span key={wordIdx} className="text-[#EC4899] font-bold">
              {word}
            </span>
          );
        }
        // Highlight instructions / uppercase keywords
        if (/^(SELECT|FROM|WHERE|GENERATE|OPTIMIZE|RUN|ANALYSIS|ROLE|INSTRUCTIONS|CONTEXT|CONSTRAINTS)$/.test(word.toUpperCase())) {
          return (
            <span key={wordIdx} className="text-[#4F8CFF] font-extrabold tracking-wide">
              {word}
            </span>
          );
        }
        // Highlight strings
        if (word.startsWith('"') && word.endsWith('"')) {
          return (
            <span key={wordIdx} className="text-[#10B981]">
              {word}
            </span>
          );
        }
        // Highlight comments
        if (word.startsWith("//") || word.startsWith("#")) {
          return (
            <span key={wordIdx} className="text-white/30 italic">
              {word}
            </span>
          );
        }
        return <span key={wordIdx}>{word}</span>;
      });

      return (
        <div key={idx} className="font-mono text-[11px] leading-5 text-white/70">
          {highlightedWords}
        </div>
      );
    });
  };

  return (
    <div
      className={`relative w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-[#030303] select-none ${
        isFocused
          ? "border-[#4F8CFF]/50 shadow-[0_0_20px_rgba(79,140,255,0.15)] ring-1 ring-[#4F8CFF]/30"
          : "border-white/5 shadow-2xl"
      }`}
    >
      {/* Top utility sub-header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#070707]">
        <div className="flex items-center gap-2">
          <Code className="w-3.5 h-3.5 text-white/35" />
          <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase font-bold">COGNITIVE PROMPT WRITER</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
            title="Copy Syntax"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onSave}
            className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
            title="Snapshot Prompt (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Main Canvas Row */}
      <div className="flex w-full min-h-[180px] max-h-[300px] overflow-y-auto no-scrollbar relative font-mono text-[11px]">
        {/* Line numbers bar */}
        <div className="w-10 bg-[#050505]/60 text-right pr-3 select-none py-4 border-r border-white/5 flex flex-col gap-0 text-white/20 select-none">
          {Array.from({ length: lineCount }).map((_, idx) => (
            <div key={idx} className="h-5 text-[10px] leading-5 leading-none pr-0.5">
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Text Area overlaying highlighted text */}
        <div className="flex-1 relative bg-transparent py-4 px-4 min-h-[180px]">
          {/* Custom syntax output display behind textarea */}
          <div className="absolute inset-0 p-4 pt-4 pl-4 select-none pointer-events-none overflow-hidden h-full">
            {renderHighlightedCode()}
          </div>

          {/* Real transparent typing textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none p-4 font-mono text-[11px] leading-5 text-transparent caret-white selection:bg-[#4F8CFF]/30 select-text"
            placeholder="Type your prompt logic here... E.g., Use variables like {{input}} to customize query states."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Footer statistics */}
      <div className="px-4 py-1.5 border-t border-white/5 bg-[#050505]/40 flex justify-between items-center text-[7.5px] font-mono text-white/30">
        <span>MODE: PARAMETRIC PROMPT SPEC</span>
        <span>SHORTCUTS: CTRL+S TO SAVE // CTRL+ENTER TO RUN</span>
      </div>
    </div>
  );
}
