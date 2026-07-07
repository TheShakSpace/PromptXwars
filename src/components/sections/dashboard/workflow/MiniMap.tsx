/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkflowNode } from "./types";
import { getNodeTemplateByType } from "./NodeLibrary";
import { Maximize, ZoomIn, Eye } from "lucide-react";

interface MiniMapProps {
  nodes: WorkflowNode[];
  zoom: number;
  panX: number;
  panY: number;
  onRecenter: () => void;
}

export function MiniMap({ nodes, zoom, panX, panY, onRecenter }: MiniMapProps) {
  const mapWidth = 160;
  const mapHeight = 110;

  // Calculate the bounding box of all nodes
  let minX = -100;
  let maxX = 1100;
  let minY = -100;
  let maxY = 800;

  if (nodes.length > 0) {
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    minX = Math.min(...xs) - 150;
    maxX = Math.max(...xs) + 400;
    minY = Math.min(...ys) - 150;
    maxY = Math.max(...ys) + 300;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // Scale node positions to fit in map
  const getScaledCoords = (x: number, y: number) => {
    const rx = ((x - minX) / rangeX) * mapWidth;
    const ry = ((y - minY) / rangeY) * mapHeight;
    return { x: rx, y: ry };
  };

  // Viewport bounding box representation
  // Screen size can be approximated (e.g., 900x500 relative to grid scale)
  const viewWidth = 900 / zoom;
  const viewHeight = 500 / zoom;
  const viewLeft = -panX / zoom;
  const viewTop = -panY / zoom;

  const viewportScaled = getScaledCoords(viewLeft, viewTop);
  const viewportScaledBottomRight = getScaledCoords(viewLeft + viewWidth, viewTop + viewHeight);

  const vW = Math.max(15, Math.min(mapWidth, viewportScaledBottomRight.x - viewportScaled.x));
  const vH = Math.max(10, Math.min(mapHeight, viewportScaledBottomRight.y - viewportScaled.y));
  const vX = Math.max(0, Math.min(mapWidth - vW, viewportScaled.x));
  const vY = Math.max(0, Math.min(mapHeight - vH, viewportScaled.y));

  return (
    <div className="absolute bottom-4 right-4 z-20 glass-panel p-2.5 rounded-2xl border border-white/5 bg-[#050505]/85 backdrop-blur-md flex flex-col gap-2 shadow-2xl select-none w-44">
      {/* Mini Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-1 text-white/40">
        <span className="font-mono text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
          <Eye className="w-2.5 h-2.5" />
          CANVAS MINIMAP
        </span>
        <button
          onClick={onRecenter}
          title="Recenter view"
          className="hover:text-white cursor-pointer transition-colors"
        >
          <Maximize className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Scaled Wireframe box */}
      <div
        className="relative bg-black/50 rounded-lg border border-white/5 overflow-hidden"
        style={{ width: mapWidth, height: mapHeight }}
      >
        {/* Dynamic Nodes wireframes */}
        {nodes.map((node) => {
          const scaled = getScaledCoords(node.x, node.y);
          const template = getNodeTemplateByType(node.type);

          // Node size on map (typically 256x140 in full scale)
          const nw = (256 / rangeX) * mapWidth;
          const nh = (130 / rangeY) * mapHeight;

          return (
            <div
              key={node.id}
              className="absolute rounded-sm border opacity-60"
              style={{
                left: Math.max(0, Math.min(mapWidth - 4, scaled.x)),
                top: Math.max(0, Math.min(mapHeight - 4, scaled.y)),
                width: Math.max(4, nw),
                height: Math.max(3, nh),
                backgroundColor: `${template.color}15`,
                borderColor: template.color,
              }}
            />
          );
        })}

        {/* Viewport Box (representing active screen coordinates) */}
        <div
          className="absolute border border-[#A855F7] bg-[#A855F7]/5 rounded-sm pointer-events-none"
          style={{
            left: vX,
            top: vY,
            width: vW,
            height: vH,
          }}
        />
      </div>

      {/* Tiny zoom status footer */}
      <div className="flex justify-between items-center text-[7px] font-mono text-white/30">
        <span>Z: {Math.round(zoom * 100)}%</span>
        <span>COUNT: {nodes.length}</span>
      </div>
    </div>
  );
}
