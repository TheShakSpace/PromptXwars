/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkflowConnection, WorkflowNode } from "./types";

interface WorkflowEdgeProps {
  connection: WorkflowConnection;
  fromNode: WorkflowNode;
  toNode: WorkflowNode;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function WorkflowEdge({
  connection,
  fromNode,
  toNode,
  isSelected = false,
  onSelect,
}: WorkflowEdgeProps) {
  // Estimated port centers based on node positions
  // Node width is w-64 = 256px.
  // We approximate the height of nodes is ~140px, so top-to-port-y is ~75px.
  const x1 = fromNode.x + 256;
  const y1 = fromNode.y + 75;

  const x2 = toNode.x;
  const y2 = toNode.y + 75;

  // Horizontal distance for control points
  const dx = Math.max(60, Math.abs(x2 - x1) * 0.45);
  const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

  // Color depending on connection status
  let strokeColor = "rgba(255, 255, 255, 0.12)";
  let flowParticleColor = "#A855F7"; // Purple
  let strokeWidth = 1.5;
  let isPulsing = false;

  switch (connection.status) {
    case "flowing":
      strokeColor = "url(#flowGradientActive)";
      flowParticleColor = "#3B82F6"; // Blue
      strokeWidth = 2.2;
      isPulsing = true;
      break;
    case "completed":
      strokeColor = "rgba(16, 185, 129, 0.4)";
      flowParticleColor = "#10B981"; // Green
      strokeWidth = 1.8;
      break;
    case "error":
      strokeColor = "rgba(239, 68, 68, 0.4)";
      flowParticleColor = "#EF4444"; // Red
      strokeWidth = 1.8;
      break;
  }

  if (isSelected) {
    strokeColor = "#F59E0B"; // Amber
    strokeWidth = 2.5;
  }

  return (
    <g className="select-none" onClick={onSelect}>
      {/* Glow path behind */}
      {(connection.status === "flowing" || isSelected) && (
        <path
          d={pathData}
          fill="none"
          stroke={isSelected ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)"}
          strokeWidth={strokeWidth + 6}
          className="pointer-events-none filter blur-sm"
        />
      )}

      {/* Invisible thicker interaction helper line */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth={15}
        className="cursor-pointer hover:stroke-white/5 transition-colors duration-200"
      />

      {/* Primary Bezier Connector Line */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="transition-all duration-300"
        strokeDasharray={connection.status === "idle" ? "5, 5" : undefined}
      />

      {/* Moving Particles along curve */}
      {connection.status === "flowing" && (
        <>
          {/* Particle 1 */}
          <circle r="3" fill={flowParticleColor} className="filter drop-shadow-[0_0_4px_currentColor]">
            <animateMotion
              path={pathData}
              dur="2.4s"
              repeatCount="indefinite"
              fill="freeze"
            />
          </circle>

          {/* Particle 2 (Staggered offset) */}
          <circle r="2.2" fill="#A855F7" className="filter drop-shadow-[0_0_3px_currentColor]">
            <animateMotion
              path={pathData}
              dur="2.4s"
              begin="0.8s"
              repeatCount="indefinite"
              fill="freeze"
            />
          </circle>

          {/* Particle 3 (Fast data byte) */}
          <circle r="1.8" fill="#EC4899" className="filter drop-shadow-[0_0_3px_currentColor]">
            <animateMotion
              path={pathData}
              dur="1.8s"
              begin="1.4s"
              repeatCount="indefinite"
              fill="freeze"
            />
          </circle>
        </>
      )}

      {/* Static status node markers along line if complete */}
      {connection.status === "completed" && (
        <circle cx={x1 + (x2 - x1) * 0.5} cy={y1 + (y2 - y1) * 0.5} r="2.5" fill="#10B981" />
      )}
    </g>
  );
}
