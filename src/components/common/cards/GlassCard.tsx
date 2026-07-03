/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  hoverGlow?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export function GlassCard({
  className,
  glowColor = "rgba(79, 140, 255, 0.15)",
  hoverGlow = true,
  interactive = true,
  children,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverGlow || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
        interactive && "hover:border-white/20 hover:bg-white/[0.05] transition-colors duration-500",
        className
      )}
      whileHover={interactive ? { y: -4, scale: 1.005 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...(props as any)}
    >
      {/* Spotlight Radial Glow Element */}
      {hoverGlow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Subtle border shine effect */}
      {hoverGlow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.25), transparent 60%)`,
            maskImage: "linear-gradient(black, black)",
            WebkitMaskImage: "linear-gradient(black, black)",
            maskComposite: "exclude",
            WebkitMaskComposite: "destination-out",
          }}
        />
      )}

      {/* Card Content container */}
      <div className="relative z-10 w-full h-full p-6">{children}</div>
    </motion.div>
  );
}
