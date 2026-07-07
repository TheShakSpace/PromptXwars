/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WorkflowNode, WorkflowConnection } from "./types";
import { Download, FileJson, FileCode, Share2, Sparkles } from "lucide-react";
import { useOS } from "../../../../contexts/OSContext";

interface WorkflowExporterProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

export function WorkflowExporter({ nodes, connections }: WorkflowExporterProps) {
  const { addNotification } = useOS();

  const exportAsJSON = () => {
    try {
      const dataStr = JSON.stringify({ nodes, connections }, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `ai-workflow-template-${Date.now()}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      addNotification(
        "Export Successful",
        "Pipeline schema exported as a production JSON template.",
        "success"
      );
    } catch (err) {
      addNotification("Export Failed", "Error serializing workflow schema.", "error");
    }
  };

  const exportAsSVG = () => {
    try {
      // Find canvas bounds
      const xs = nodes.map((n) => n.x);
      const ys = nodes.map((n) => n.y);
      const minX = Math.min(...xs, 0) - 50;
      const maxX = Math.max(...xs, 1000) + 300;
      const minY = Math.min(...ys, 0) - 50;
      const maxY = Math.max(...ys, 600) + 200;

      const w = maxX - minX;
      const h = maxY - minY;

      let svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" width="${w}" height="${h}">`;
      svgString += `<rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="#050505"/>`;

      // Render grid pattern
      svgString += `<defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity="0.03"/></pattern></defs>`;
      svgString += `<rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="url(#grid)"/>`;

      // Draw edges
      connections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.fromNode);
        const toNode = nodes.find((n) => n.id === conn.toNode);
        if (fromNode && toNode) {
          const x1 = fromNode.x + 256;
          const y1 = fromNode.y + 75;
          const x2 = toNode.x;
          const y2 = toNode.y + 75;
          const dx = Math.max(60, Math.abs(x2 - x1) * 0.45);
          svgString += `<path d="M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" stroke-dasharray="4,4"/>`;
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        svgString += `<rect x="${node.x}" y="${node.y}" width="256" height="130" rx="16" fill="#0c0c0c" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
        svgString += `<text x="${node.x + 16}" y="${node.y + 32}" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">${node.name}</text>`;
        svgString += `<text x="${node.x + 16}" y="${node.y + 54}" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-size="9">${node.description}</text>`;
        svgString += `<text x="${node.x + 16}" y="${node.y + 76}" fill="rgba(255,255,255,0.2)" font-family="monospace" font-size="7">TYPE: ${node.type.toUpperCase()}</text>`;
      });

      svgString += "</svg>";

      const dataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", `ai-workflow-vector-${Date.now()}.svg`);
      linkElement.click();

      addNotification("Export SVG", "Successfully downloaded vector asset (SVG) of pipeline.", "success");
    } catch (err) {
      addNotification("Export Failed", "Error creating vector file.", "error");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(JSON.stringify({ nodes, connections }));
    addNotification("Copied to Clipboard", "Workflow template schema JSON copied for instant share.", "info");
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#050505]/60 border border-white/5 rounded-xl">
      <button
        onClick={exportAsJSON}
        className="px-2.5 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 font-mono text-[8.5px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
      >
        <FileJson className="w-3.5 h-3.5 text-[#A855F7]" />
        <span>EXPORT JSON</span>
      </button>

      <button
        onClick={exportAsSVG}
        className="px-2.5 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 font-mono text-[8.5px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
      >
        <FileCode className="w-3.5 h-3.5 text-[#10B981]" />
        <span>DOWNLOAD SVG</span>
      </button>

      <button
        onClick={handleShare}
        className="px-2.5 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 font-mono text-[8.5px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
      >
        <Share2 className="w-3.5 h-3.5 text-[#3B82F6]" />
        <span>SHARE SCHEMA</span>
      </button>
    </div>
  );
}
