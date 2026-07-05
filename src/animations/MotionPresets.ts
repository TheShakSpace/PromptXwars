/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Variants } from "motion/react";

/**
 * Cinematic, high-fidelity physics definitions inspired by Apple Haptic and Linear.
 */
export const SPRING_PRESETS = {
  // Ultra responsive, snappy and rigid haptic response
  rigid: {
    type: "spring" as const,
    stiffness: 400,
    damping: 28,
    mass: 0.8,
  },
  // Smooth, buttery slow-damping glide
  smooth: {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
    mass: 1,
  },
  // Ethereal, low-gravity floating feel
  float: {
    type: "spring" as const,
    stiffness: 45,
    damping: 12,
    mass: 0.9,
  },
  // Elastic bounce back
  bounce: {
    type: "spring" as const,
    stiffness: 260,
    damping: 15,
    mass: 1.1,
  },
};

/**
 * Standard bezier easing curves for mechanical/smooth transitions.
 */
export const EASE_PRESETS = {
  // Apple ease-out curve (fast out, ultra-smooth deceleration)
  apple: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Elegant ease-in-out curve
  elegant: [0.76, 0, 0.24, 1] as [number, number, number, number],
  // Sharp structural reveal
  sharp: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

/**
 * Standardized reusable animation variants for consistent layouts.
 */
export const MOTION_PRESETS = {
  // Cinematic fade in with subtle focal depth adjustment
  fadeInBlur: {
    hidden: { opacity: 0, filter: "blur(12px)", scale: 0.98 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.8, ease: EASE_PRESETS.apple },
    },
    exit: {
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.98,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  } as Variants,

  // Staggered child reveals (Container must be initial="hidden" animate="visible")
  staggerContainer: (stagger = 0.05, delay = 0) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }) as Variants,

  // Text Character/Word splitting reveal variants
  charReveal: {
    hidden: { opacity: 0, y: "100%", rotateX: 45 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, ease: EASE_PRESETS.apple },
    },
  } as Variants,

  // Luxury Card Tilt and Hover variables
  premiumCard: {
    idle: { scale: 1, y: 0, boxShadow: "0 4px 30px rgba(0,0,0,0.5)" },
    hover: {
      scale: 1.02,
      y: -6,
      boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)",
      transition: SPRING_PRESETS.rigid,
    },
    tap: { scale: 0.98, y: -2, transition: { duration: 0.1 } },
  } as Variants,

  // Elastic drawer/panel sliding reveals
  panelRevealLeft: {
    hidden: { opacity: 0, x: "-100%", filter: "blur(8px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: SPRING_PRESETS.smooth,
    },
    exit: {
      opacity: 0,
      x: "-100%",
      filter: "blur(8px)",
      transition: { duration: 0.35, ease: "easeInOut" },
    },
  } as Variants,

  panelRevealRight: {
    hidden: { opacity: 0, x: "100%", filter: "blur(8px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: SPRING_PRESETS.smooth,
    },
    exit: {
      opacity: 0,
      x: "100%",
      filter: "blur(8px)",
      transition: { duration: 0.35, ease: "easeInOut" },
    },
  } as Variants,

  // Glass-glow micro glitch hover variables
  glowHover: {
    hover: {
      borderColor: "rgba(168, 85, 247, 0.4)",
      boxShadow: "0 0 25px rgba(168, 85, 247, 0.25)",
      transition: { duration: 0.3 },
    },
  } as Variants,
};

export default MOTION_PRESETS;
