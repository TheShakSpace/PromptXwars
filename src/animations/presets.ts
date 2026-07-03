/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Variants } from "motion/react";

/**
 * Super clean, high-performance animation physics constants.
 */
export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1,
};

export const SMOOTH_EASE = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Explicit type cast for Bezier curve definition
  duration: 0.8,
};

/**
 * Reusable Framer Motion Variants for layout transitions and elements.
 */
export const animationPresets = {
  // 1. Fade Animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: SMOOTH_EASE },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  } as Variants,

  // 2. Slide Reveal Animations
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: SPRING_TRANSITION },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  } as Variants,

  slideDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: SPRING_TRANSITION },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  } as Variants,

  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: SPRING_TRANSITION },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  } as Variants,

  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: SPRING_TRANSITION },
    exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
  } as Variants,

  // 3. Scale / Elastic Pop-in Animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: SPRING_TRANSITION },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  } as Variants,

  // 4. Futuristic Blur Reveal Animations
  blurIn: {
    hidden: { opacity: 0, filter: "blur(12px)", scale: 0.98 },
    visible: { opacity: 1, filter: "blur(0px)", scale: 1, transition: SMOOTH_EASE },
    exit: { opacity: 0, filter: "blur(6px)", scale: 0.98, transition: { duration: 0.3 } },
  } as Variants,

  // 5. Staggered Container Orchestration
  staggerContainer: (staggerChildren = 0.08, delayChildren = 0) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }) as Variants,

  // 6. Glow/Glitch micro-interactions
  hoverGlow: {
    hover: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(79, 140, 255, 0.35)",
      borderColor: "rgba(79, 140, 255, 0.4)",
      textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  } as Variants,

  // Simple magnetic feel hover
  hoverMagnetic: {
    hover: {
      y: -4,
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  } as Variants,
};
