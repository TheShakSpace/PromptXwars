/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from "react";
import { useMotion } from "./MotionContext";

interface GlowSystemProps {
  children: React.ReactNode;
  glowColor?: string; // CSS color representation
  glowRadius?: number; // pixel radius of radial glow spotlight
  className?: string;
  glowOpacity?: string; // hover opacity e.g. "0.15"
}

export function GlowSystem({
  children,
  glowColor = "168, 85, 247", // rgb of lavender (A855F7)
  glowRadius = 300,
  className = "",
  glowOpacity = "0.12",
}: GlowSystemProps) {
  const { reducedMotion } = useMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty("--glow-x", `${x}px`);
      container.style.setProperty("--glow-y", `${y}px`);
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative group overflow-hidden ${className}`}
      style={
        {
          "--glow-x": "-1000px",
          "--glow-y": "-1000px",
          "--glow-color": glowColor,
          "--glow-radius": `${glowRadius}px`,
          "--glow-opacity": glowOpacity,
        } as React.CSSProperties
      }
    >
      {/* 1. Behind Glow Layer (Illuminates from under the container) */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 -z-10"
          style={{
            background: `radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(var(--glow-color), var(--glow-opacity)) 0%, transparent 100%)`,
          }}
        />
      )}

      {/* 2. Spotlight Border Overlay (Super elegant Vercel-style border illumination) */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 rounded-[inherit] border border-transparent pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-10 [mask-image:linear-gradient(white,white)]"
          style={{
            background: `radial-gradient(calc(var(--glow-radius) * 0.6) circle at var(--glow-x) var(--glow-y), rgba(var(--glow-color), 0.35) 0%, transparent 100%) border-box`,
          }}
        />
      )}

      {children}
    </div>
  );
}

export default GlowSystem;
