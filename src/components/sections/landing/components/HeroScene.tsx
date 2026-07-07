/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, useTransform } from "motion/react";
import { useParallax } from "./ParallaxProvider";
import { FloatingCards } from "./FloatingCards";

export function HeroScene() {
  const { springX, springY } = useParallax();

  // Create subtle 3D rotational coordinates for the main graphical ring
  const rotX = useTransform(springY, (val: number) => val * -15);
  const rotY = useTransform(springX, (val: number) => val * 20);

  return (
    <div className="absolute inset-0 md:relative md:w-1/2 h-full flex items-center justify-center pointer-events-none select-none">
      
      {/* 3D Parallax Graphic Centerpiece Container */}
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
        }}
        className="w-80 h-80 md:w-[480px] md:h-[480px] relative flex items-center justify-center pointer-events-auto"
      >
        {/* Soft glowing ambient lighting source inside the rings */}
        <div className="absolute w-72 h-72 rounded-full bg-[#4F8CFF]/10 blur-[90px] animate-pulse-slow" />

        {/* Outer Tech Ring 1 */}
        <div className="absolute w-[95%] h-[95%] rounded-full border border-white/5 border-t-[#4F8CFF]/40 border-b-[#4F8CFF]/10 animate-spin-slow pointer-events-none" />

        {/* Outer Tech Ring 2 */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-white/[0.04] border-r-white/20 animate-[spin_25s_linear_infinite_reverse] pointer-events-none" />

        {/* Outer Tech Ring 3 */}
        <div className="absolute w-[60%] h-[60%] rounded-full border border-white/[0.03] border-l-[#4F8CFF]/30 animate-[spin_12s_ease-in-out_infinite] pointer-events-none" />

        {/* Core HUD target graphic */}
        <div className="absolute w-44 h-44 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl relative">
          {/* Internal core light core */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600/30 via-[#4F8CFF]/20 to-indigo-600/30 flex items-center justify-center border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#4F8CFF]/10 blur-md opacity-50 animate-pulse" />
            {/* Spinning core chip/symbol */}
            <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/15 flex items-center justify-center relative shadow-inner z-10 animate-pulse">
              <span className="font-mono text-[10px] font-black text-[#4F8CFF] tracking-widest animate-pulse">
                HELIOS
              </span>
            </div>
          </div>
          
          {/* Small orbital core dot indicator */}
          <div className="absolute inset-2 border border-white/5 rounded-full animate-spin">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full absolute -top-0.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#4ade80]" />
          </div>
        </div>

        {/* Interactive floating parameters dashboard */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/85 border border-white/10 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-2xl text-center select-none w-56">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            <span className="font-mono text-[9px] text-[#4F8CFF] tracking-widest font-bold uppercase">
              COGNITIVE LEVEL A5
            </span>
          </div>
          <p className="font-sans text-[10px] text-white/50 mt-1 leading-normal">
            Neural Core Online & Fully Synchronized
          </p>
        </div>
      </motion.div>

      {/* Floating Interactive 3D glass labels around the core */}
      <FloatingCards />
    </div>
  );
}
