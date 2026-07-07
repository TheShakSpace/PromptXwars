/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Upload, Image as ImageIcon, CheckCircle, RefreshCw, Layers, Target, FileText, BarChart3, HelpCircle } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

export function VisionWorkspace() {
  const { addNotification } = useOS();
  const [isDragging, setIsDragging] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Simulated parsed OCR coordinates and boxes
  const boundingBoxes = [
    { label: "CTA Button", confidence: "98.2%", x: "42%", y: "78%", w: "16%", h: "6%" },
    { label: "Display Header text", confidence: "99.4%", x: "20%", y: "24%", w: "60%", h: "12%" },
    { label: "Navigation Navbar", confidence: "95.1%", x: "5%", y: "4%", w: "90%", h: "8%" },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsScanning(true);
    addNotification("Uploading Image Asset", "Caching wireframe raster maps...", "info");

    setTimeout(() => {
      setImageUploaded(true);
      setIsScanning(false);
      addNotification("Vision Compile Complete", "Analyzed OCR bounding coordinates.", "success");
    }, 1800);
  };

  const handleManualUpload = () => {
    setIsScanning(true);
    addNotification("Injecting Mock Raster Assets", "Processing wireframe matrix.", "info");
    setTimeout(() => {
      setImageUploaded(true);
      setIsScanning(false);
      addNotification("Vision OCR Complete", "Loaded layout bounds.", "success");
    }, 1200);
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      
      {/* Upload Zone & Canvas bounding boxes preview */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[420px]">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-4 h-4 text-[#EC4899] animate-pulse" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">COGNITIVE VISION COMPILER</span>
          </div>

          {/* Interactive drag & drop canvas */}
          {!imageUploaded ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleManualUpload}
              className={`p-16 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[280px] ${
                isDragging
                  ? "bg-[#EC4899]/10 border-[#EC4899] text-[#EC4899] scale-98 animate-pulse"
                  : "bg-white/[0.01] border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
              }`}
            >
              {isScanning ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-10 h-10 text-[#EC4899] animate-spin" />
                  <span className="font-mono text-[10px] uppercase font-bold text-white/90">AST RASTER SCANNING...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-white/20" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-white/80">DRAG & DROP WIREFRAME MOCKUP</span>
                    <span className="font-mono text-[8px] text-white/25">Supports PNG, JPG, Figma assets up to 15MB</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Uploaded mock image bounding layer representation */
            <div className="relative rounded-2xl border border-white/10 bg-black/60 overflow-hidden min-h-[280px] flex items-center justify-center">
              {/* Wireframe simulated grid drawing */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              <div className="w-[85%] h-[80%] border-2 border-dashed border-[#EC4899]/30 rounded-lg relative flex flex-col items-center justify-center select-none">
                <ImageIcon className="w-12 h-12 text-[#EC4899]/20" />
                <span className="font-mono text-[8px] text-white/20 mt-2">RASTER MAPPED GRID [1280 x 800]</span>

                {/* Bounding Boxes Overlays */}
                {boundingBoxes.map((box, idx) => {
                  return (
                    <div
                      key={idx}
                      className="absolute border border-green-400 bg-green-400/5 flex items-center justify-start p-1 pointer-events-none"
                      style={{
                        left: box.x,
                        top: box.y,
                        width: box.w,
                        height: box.h,
                      }}
                    >
                      <span className="font-mono text-[6px] text-green-400 bg-black/80 px-1 rounded-sm border border-green-400/20 leading-none">
                        {box.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reset layout trigger */}
              <button
                onClick={() => setImageUploaded(false)}
                className="absolute right-3.5 bottom-3.5 px-2.5 py-1.5 rounded-lg border border-white/5 bg-black/80 hover:bg-white/10 text-white/40 hover:text-white transition-all text-[8px] font-mono cursor-pointer"
              >
                CLEAR Asset
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
          <span>COGNITIVE BOUNDING MODE: CONFIGURED</span>
          <span>INTEGRITY RATE: 99.8%</span>
        </div>

      </div>

      {/* Diagnostics / Insights side cards */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between min-h-[350px]">
        {imageUploaded ? (
          <div className="flex flex-col gap-5 select-none h-full justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                <FileText className="w-4 h-4 text-[#EC4899]" />
                <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">OCR ENTITY COGNITION</span>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <span className="font-mono text-[7.5px] text-[#EC4899] font-bold uppercase tracking-wide">Image Description</span>
                  <p className="text-[10.5px] text-white/50 leading-relaxed font-light mt-1.5 font-sans italic">
                    "A high fidelity SaaS application dashboard mockup wireframe containing a navigation bar, a principal centered metrics widget area, and a green accent CTA submit button."
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[7.5px] text-[#EC4899] font-bold uppercase tracking-wide mb-1.5 block">Bounding Coordinates</span>
                  <div className="flex flex-col gap-1.5">
                    {boundingBoxes.map((box, idx) => (
                      <div key={idx} className="p-2.5 bg-black/40 border border-white/5 rounded-xl font-mono text-[8.5px] flex justify-between items-center text-white/40">
                        <span>{box.label.toUpperCase()}</span>
                        <span className="text-green-400 font-bold">{box.confidence}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => addNotification("Syntax Synthesized", "Created corresponding UI template.", "success")}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-5"
            >
              <span>COMPILE TO COMPONENT CODE</span>
              <BarChart3 className="w-3.5 h-3.5 text-[#EC4899]" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-3 select-none text-white/30 h-full">
            <HelpCircle className="w-8 h-8" />
            <span className="font-mono text-[9px] tracking-widest uppercase font-bold">UPLOAD WIREFRAME MOCK FOR VISION SPECS</span>
          </div>
        )}

        {imageUploaded && (
          <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
            <span>MUTATION PARSE: SYNCED</span>
            <span>INTEGRATION SAFE: 100%</span>
          </div>
        )}
      </div>

    </div>
  );
}
