/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  MousePointer2,
  GitCommit,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Undo2,
  Redo2,
  Sparkles,
} from "lucide-react";

interface WorkflowToolbarProps {
  tool: "select" | "connect" | "pan";
  setTool: (tool: "select" | "connect" | "pan") => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function WorkflowToolbar({
  tool,
  setTool,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  snapToGrid,
  setSnapToGrid,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: WorkflowToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-[#050505]/80 border border-white/5 backdrop-blur-md rounded-xl select-none">
      {/* Tool select buttons */}
      <div className="flex items-center gap-0.5 border-r border-white/5 pr-1.5 mr-1.5">
        <button
          onClick={() => setTool("select")}
          title="Selection Tool (V)"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            tool === "select"
              ? "bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7]"
              : "border border-transparent text-white/50 hover:text-white hover:bg-white/5"
          }`}
        >
          <MousePointer2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setTool("connect")}
          title="Edge Connector Tool (C)"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            tool === "connect"
              ? "bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]"
              : "border border-transparent text-white/50 hover:text-white hover:bg-white/5"
          }`}
        >
          <GitCommit className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setTool("pan")}
          title="Hand Panning Tool (Space)"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            tool === "pan"
              ? "bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6]"
              : "border border-transparent text-white/50 hover:text-white hover:bg-white/5"
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5 border-r border-white/5 pr-1.5 mr-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-lg cursor-pointer transition-all text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="p-2 rounded-lg cursor-pointer transition-all text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid Alignment */}
      <div className="flex items-center gap-0.5 border-r border-white/5 pr-1.5 mr-1.5">
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          title="Snap to Grid"
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            snapToGrid
              ? "bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B]"
              : "border border-transparent text-white/50 hover:text-white hover:bg-white/5"
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Zoom modifiers */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg cursor-pointer transition-all text-white/50 hover:text-white hover:bg-white/5"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onZoomReset}
          title="Reset Zoom"
          className="px-2 py-1 rounded-lg text-[9px] font-mono font-bold text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg cursor-pointer transition-all text-white/50 hover:text-white hover:bg-white/5"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
