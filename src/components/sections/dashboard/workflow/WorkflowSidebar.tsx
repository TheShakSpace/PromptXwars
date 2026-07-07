/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { NodeLibrary } from "./NodeLibrary";
import { NodeType } from "./types";
import { Keyboard, HelpCircle } from "lucide-react";

interface WorkflowSidebarProps {
  onAddNode: (type: NodeType) => void;
}

export function WorkflowSidebar({ onAddNode }: WorkflowSidebarProps) {
  const shortcuts = [
    { keys: ["Space", "Drag"], label: "Pan Canvas" },
    { keys: ["Scroll"], label: "Zoom Canvas" },
    { keys: ["Del", "Backsp"], label: "Remove Node" },
    { keys: ["Ctrl", "D"], label: "Duplicate Node" },
    { keys: ["Ctrl", "Z"], label: "Undo Action" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between gap-6 select-none bg-[#030303]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-xl">
      {/* Node Templates List */}
      <div className="flex-1 overflow-hidden min-h-[300px]">
        <NodeLibrary onAddNode={onAddNode} />
      </div>

      {/* Keyboard Shortcuts Help Panel */}
      <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5 shrink-0 bg-black/10 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 text-white/50">
          <Keyboard className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="font-mono text-[8px] font-bold uppercase tracking-wider">
            GRID KEYBOARD SHORTCUTS
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between font-mono text-[8px]">
              <span className="text-white/40">{shortcut.label}</span>
              <div className="flex items-center gap-0.5">
                {shortcut.keys.map((k, kIdx) => (
                  <React.Fragment key={kIdx}>
                    {kIdx > 0 && <span className="text-white/20 px-0.5">+</span>}
                    <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 font-semibold">
                      {k}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
