/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

export function BackgroundEffects() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Spotlight radial gradient background style following cursor coordinates
  const spotlightStyle = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(79, 140, 255, 0.08) 0%, transparent 80%)`;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-30 overflow-hidden bg-[#030303] select-none">
      {/* LAYER 1: Deep Space Gradient Mesh */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-900/30 to-blue-900/30 blur-[150px] animate-pulse-slow" />
        <div className="absolute -bottom-[15%] -right-[15%] w-[65%] h-[65%] rounded-full bg-gradient-to-tr from-[#4F8CFF]/15 to-violet-900/25 blur-[160px] animate-pulse-slow [animation-delay:4s]" />
        <div className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full bg-gradient-to-r from-blue-950/20 to-neutral-900/40 blur-[120px]" />
      </div>

      {/* LAYER 2: Digital Noise Overlay Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=')] bg-repeat" />

      {/* LAYER 3: Micro cybernetic grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:48px_48px] opacity-40" />

      {/* LAYER 4: Glowing Floating Blur Orbs */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[15%] w-80 h-80 rounded-full bg-blue-500/5 blur-[90px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 30, -60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[25%] right-[20%] w-96 h-96 rounded-full bg-violet-500/5 blur-[100px]"
        />
      </div>

      {/* LAYER 5: Mouse Spotlight Laser glow effect */}
      <motion.div
        className="absolute inset-0 z-0 opacity-100 transition-opacity duration-300"
        style={{ background: spotlightStyle }}
      />

      {/* Scanline CRT style overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.005] to-transparent bg-[size:100%_4px] opacity-10" />
    </div>
  );
}
