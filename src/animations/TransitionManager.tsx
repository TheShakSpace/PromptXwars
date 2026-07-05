/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMotion } from "./MotionContext";

interface TransitionManagerProps {
  children: React.ReactNode;
  stateKey: string;
}

export function TransitionManager({ children, stateKey }: TransitionManagerProps) {
  const { reducedMotion } = useMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateKey}
        initial={{
          opacity: 0,
          scale: 0.94,
          filter: "blur(20px)",
          z: -150,
          transformPerspective: 1200,
          rotateX: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          z: 0,
          rotateX: 0,
          transition: {
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1], // Apple elegant decelerate curve
            staggerChildren: 0.1,
          },
        }}
        exit={{
          opacity: 0,
          scale: 1.05,
          filter: "blur(15px)",
          z: 100,
          rotateX: -5,
          transition: {
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          },
        }}
        className="w-full relative origin-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Sweep Light Ray Overlay Effect */}
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "150%", opacity: [0, 0.2, 0] }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
          className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none -skew-x-12 -z-10"
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default TransitionManager;
