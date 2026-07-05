/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { useMotion } from "./MotionContext";

interface FloatingElementsProps {
  children: React.ReactNode;
  speed?: number; // duration of cycle in seconds
  amplitudeY?: number; // pixel offset range
  amplitudeX?: number; // horizontal drift pixel offset range
  rotateRange?: number; // degree rotational swing range
  delay?: number; // start offset delay
  className?: string;
}

export function FloatingElements({
  children,
  speed = 6,
  amplitudeY = 12,
  amplitudeX = 6,
  rotateRange = 3,
  delay = 0,
  className = "",
}: FloatingElementsProps) {
  const { reducedMotion } = useMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [-amplitudeY, amplitudeY, -amplitudeY],
        x: [-amplitudeX, amplitudeX, -amplitudeX],
        rotate: [-rotateRange, rotateRange, -rotateRange],
      }}
      transition={{
        duration: speed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror" as const,
        delay: delay,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default FloatingElements;
