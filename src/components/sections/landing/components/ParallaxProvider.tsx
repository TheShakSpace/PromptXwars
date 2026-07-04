/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";

interface ParallaxContextType {
  mouseX: any;
  mouseY: any;
  springX: any;
  springY: any;
}

const ParallaxContext = createContext<ParallaxContextType | undefined>(undefined);

export function ParallaxProvider({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end lag and luxurious tilt response
  const springX = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize values between -1 and 1 relative to center of viewport
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <ParallaxContext.Provider value={{ mouseX, mouseY, springX, springY }}>
      {children}
    </ParallaxContext.Provider>
  );
}

export function useParallax() {
  const context = useContext(ParallaxContext);
  if (context === undefined) {
    throw new Error("useParallax must be used within a ParallaxProvider");
  }
  return context;
}
