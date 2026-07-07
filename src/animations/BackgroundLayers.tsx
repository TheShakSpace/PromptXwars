/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotion } from "./MotionContext";

export function BackgroundLayers() {
  const { reducedMotion } = useMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth pointer spotlight spring coordinates
  const smoothX = useSpring(useMotionValue(0), { stiffness: 80, damping: 25 });
  const smoothY = useSpring(useMotionValue(0), { stiffness: 80, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const x = e.clientX;
      const y = e.clientY;
      smoothX.set(x);
      smoothY.set(y);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion, smoothX, smoothY]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-30 bg-[#020202]"
    >
      {/* LAYER 1: Deep Space Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030304] via-[#050508] to-[#020202]" />

      {/* LAYER 2: Ultra-fine Procedural SVG Noise Grain */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* LAYER 3: Tiny Cinematic Tech Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {!reducedMotion && (
        <>
          {/* LAYER 4: Micro Floating Star Particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => {
              const dur = 10 + i * 4;
              const delay = -i * 2;
              return (
                <div
                  key={i}
                  style={{
                    left: `${(i * 13) % 100}%`,
                    top: `${(i * 7 + 20) % 100}%`,
                    animation: `floatUp ${dur}s infinite linear`,
                    animationDelay: `${delay}s`,
                    width: `${((i * 3) % 3) + 1.5}px`,
                    height: `${((i * 3) % 3) + 1.5}px`,
                  }}
                  className="absolute rounded-full bg-white/20 blur-[0.5px]"
                />
              );
            })}
          </div>

          {/* LAYER 5: Slow Scaling Blurred Orbs (Spatial Depth) */}
          <div className="absolute inset-0 flex items-center justify-center filter blur-[140px] opacity-[0.12]">
            <div
              className="absolute w-[45vw] h-[45vw] rounded-full bg-[#3B82F6] animate-pulse"
              style={{
                top: "10%",
                left: "5%",
                animationDuration: "14s",
              }}
            />
            <div
              className="absolute w-[50vw] h-[50vw] rounded-full bg-[#A855F7] animate-pulse"
              style={{
                bottom: "15%",
                right: "8%",
                animationDuration: "18s",
              }}
            />
          </div>

          {/* LAYER 6: Interactive Mouse Spotlight cursor tracker */}
          <motion.div
            className="absolute inset-0 mix-blend-screen opacity-[0.22] pointer-events-none"
            style={{
              background: `radial-gradient(circle 450px at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.05) 45%, transparent 100%)`,
            }}
          />

          {/* LAYER 7: Animated Volumetric Light Rays */}
          <div className="absolute top-0 left-1/4 w-[50%] h-[120%] bg-gradient-to-b from-[#A855F7]/[0.02] to-transparent origin-top rotate-12 filter blur-[60px] animate-[swivel_25s_infinite_ease-in-out]" />

          {/* LAYER 8: Soft Aurora Borealis Waves */}
          <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#EC4899]/[0.015] via-transparent to-transparent filter blur-[100px] animate-pulse" style={{ animationDuration: "10s" }} />
        </>
      )}

      {/* Embedded floating styles for simple CSS animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20vh) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes swivel {
          0%, 100% {
            transform: rotate(12deg) scaleX(1);
          }
          50% {
            transform: rotate(18deg) scaleX(1.15);
          }
        }
      `}</style>
    </div>
  );
}

export default BackgroundLayers;
