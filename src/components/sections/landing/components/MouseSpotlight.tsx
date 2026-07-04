/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

export function MouseSpotlight() {
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

  // High-fidelity hover laser spotlight template
  const background = useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, rgba(79, 140, 255, 0.12) 0%, transparent 80%)`;

  return (
    <motion.div
      style={{ background }}
      className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
    />
  );
}
