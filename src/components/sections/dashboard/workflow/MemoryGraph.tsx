/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Star, Link, Server, FileText } from "lucide-react";
import { MemoryGraphNode, MemoryGraphEdge } from "./types";

const INITIAL_NODES: MemoryGraphNode[] = [
  { id: "center", label: "Task Goal: Code Refactoring", type: "concept", valency: 95 },
  { id: "mem1", label: "Pref: High-Contrast Light Theme", type: "memory", valency: 82 },
  { id: "mem2", label: "Context: Previous SQL DB Schema", type: "memory", valency: 64 },
  { id: "kn1", label: "Spec: esbuild Module resolution", type: "knowledge", valency: 78 },
  { id: "kn2", label: "Docs: React 19 Ref callbacks", type: "knowledge", valency: 88 },
  { id: "ent1", label: "Entity: Google GenAI SDK", type: "entity", valency: 91 },
  { id: "ent2", label: "Entity: Tailwind v4 rules", type: "entity", valency: 74 },
];

const EDGES: MemoryGraphEdge[] = [
  { source: "center", target: "mem1", weight: 3 },
  { source: "center", target: "mem2", weight: 4 },
  { source: "center", target: "kn1", weight: 5 },
  { source: "center", target: "kn2", weight: 4 },
  { source: "center", target: "ent1", weight: 5 },
  { source: "center", target: "ent2", weight: 2 },
  { source: "mem1", target: "kn2", weight: 1 },
  { source: "kn1", target: "ent1", weight: 3 },
];

// Coordinate map for nodes to arrange them beautifully in SVG bounds
const COORDINATES: Record<string, { x: number; y: number }> = {
  center: { x: 100, y: 100 },
  mem1: { x: 40, y: 50 },
  mem2: { x: 45, y: 145 },
  kn1: { x: 155, y: 40 },
  kn2: { x: 150, y: 150 },
  ent1: { x: 110, y: 30 },
  ent2: { x: 90, y: 165 },
};

export function MemoryGraph() {
  const [nodes, setNodes] = useState<MemoryGraphNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("center");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const getNodeColor = (type: MemoryGraphNode["type"]) => {
    switch (type) {
      case "memory":
        return { color: "#A855F7", bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.4)" };
      case "knowledge":
        return { color: "#10B981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)" };
      case "entity":
        return { color: "#3B82F6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)" };
      default:
        return { color: "#F59E0B", bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.5)" };
    }
  };

  return (
    <div className="flex flex-col gap-4 select-none pr-1">
      <div className="border-b border-white/5 pb-2">
        <h3 className="font-mono text-[9px] text-[#A855F7] tracking-widest uppercase font-black flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-[#A855F7]" />
          EPISODIC MEMORY MAP
        </h3>
        <p className="text-[10px] text-white/40 mt-0.5">High-affinity vector memory graphs</p>
      </div>

      {/* SVG Graph Arena */}
      <div className="relative h-56 bg-black/40 border border-white/5 rounded-2xl overflow-hidden mt-1 select-none flex items-center justify-center">
        {/* Constellation SVG lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {EDGES.map((edge, idx) => {
            const p1 = COORDINATES[edge.source];
            const p2 = COORDINATES[edge.target];
            if (!p1 || !p2) return null;

            const isHighlighted =
              selectedNodeId === edge.source ||
              selectedNodeId === edge.target ||
              hoveredNodeId === edge.source ||
              hoveredNodeId === edge.target;

            return (
              <line
                key={idx}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isHighlighted ? "#A855F7" : "rgba(255, 255, 255, 0.06)"}
                strokeWidth={isHighlighted ? edge.weight * 0.35 : edge.weight * 0.15}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Nodes layer */}
        {nodes.map((node) => {
          const coord = COORDINATES[node.id];
          if (!coord) return null;

          const theme = getNodeColor(node.type);
          const isSelected = selectedNodeId === node.id;
          const isHovered = hoveredNodeId === node.id;

          return (
            <motion.div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              whileHover={{ scale: 1.15 }}
              style={{
                left: coord.x * 2 - 10, // scaling coordinates to fit canvas
                top: coord.y * 2 - 10,
                backgroundColor: isSelected ? theme.color : theme.bg,
                borderColor: isSelected ? "white" : theme.border,
                boxShadow: isSelected
                  ? `0 0 15px ${theme.color}`
                  : isHovered
                  ? `0 0 10px ${theme.color}40`
                  : undefined,
              }}
              className="absolute w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-shadow duration-300 z-10"
            >
              {node.id === "center" ? (
                <Star className={`w-2.5 h-2.5 ${isSelected ? "text-black" : "text-[#F59E0B]"}`} />
              ) : node.type === "memory" ? (
                <Brain className={`w-2.5 h-2.5 ${isSelected ? "text-black" : "text-[#A855F7]"}`} />
              ) : node.type === "knowledge" ? (
                <FileText className={`w-2.5 h-2.5 ${isSelected ? "text-black" : "text-[#10B981]"}`} />
              ) : (
                <Server className={`w-2.5 h-2.5 ${isSelected ? "text-black" : "text-[#3B82F6]"}`} />
              )}
            </motion.div>
          );
        })}

        {/* Floating tooltip overlay */}
        <AnimatePresence>
          {hoveredNodeId && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10 font-mono text-[7.5px] text-white/80 pointer-events-none flex justify-between items-center"
            >
              <span>{nodes.find((n) => n.id === hoveredNodeId)?.label}</span>
              <span className="text-white/40 font-bold">W: {nodes.find((n) => n.id === hoveredNodeId)?.valency}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Node Details Display */}
      {selectedNode && (
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-1.5 mt-0.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[8px] text-white/30 uppercase font-black">
              SELECTED MEMORY INDEX
            </span>
            <span
              className="font-mono text-[7px] font-bold px-1.5 py-0.5 rounded uppercase"
              style={{
                backgroundColor: `${getNodeColor(selectedNode.type).color}15`,
                color: getNodeColor(selectedNode.type).color,
              }}
            >
              {selectedNode.type}
            </span>
          </div>
          <h4 className="text-[11px] font-bold text-white/90 leading-tight">
            {selectedNode.label}
          </h4>
          <div className="flex justify-between text-[8px] font-mono text-white/40 border-t border-white/5 pt-1.5 mt-0.5">
            <span>SEMANTIC COEF:</span>
            <span className="text-white font-bold">{selectedNode.valency / 100}</span>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/40">
            <span>INDEX STABILITY:</span>
            <span className="text-green-400 font-bold">STABLE</span>
          </div>
        </div>
      )}
    </div>
  );
}
