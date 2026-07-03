/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "../../../utils/cn";

export function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs to avoid jerky mouse tracking
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.6 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 10); // Center the 20px pointer ring
      mouseY.set(e.clientY - 10);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        target.closest("[role='button']") !== null ||
        target.closest(".interactive-cursor") !== null;

      setHovered(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Interactive Lagging Core Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#4F8CFF] rounded-full pointer-events-none z-50 mix-blend-screen select-none"
        style={{
          x: springX,
          y: springY,
          transform: "translate(6px, 6px)", // center offset for inner dot
        }}
      />

      {/* Outward Spatial Ring */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-5 h-5 rounded-full border pointer-events-none z-50 select-none transition-all duration-300",
          hovered
            ? "border-[#4F8CFF] bg-[#4F8CFF]/10 scale-150 shadow-[0_0_15px_rgba(79,140,255,0.4)]"
            : "border-white/20 bg-transparent scale-100"
        )}
        style={{
          x: springX,
          y: springY,
        }}
      />
    </>
  );
}
