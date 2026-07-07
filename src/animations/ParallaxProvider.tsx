/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect } from "react";
import { useMotionValue, useSpring, useScroll, motion, useTransform } from "motion/react";
import { useMotion } from "./MotionContext";

interface ParallaxContextType {
  mouseX: any;
  mouseY: any;
  springX: any;
  springY: any;
  scrollYProgress: any;
}

const ParallaxContext = createContext<ParallaxContextType | undefined>(undefined);

export function ParallaxProvider({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Soft springs for high-end lag and luxurious inertia response
  const springX = useSpring(mouseX, { stiffness: 80, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 22 });

  // Native Framer Motion viewport scroll tracking
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize values between -0.5 and 0.5 relative to center of viewport
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reducedMotion]);

  return (
    <ParallaxContext.Provider value={{ mouseX, mouseY, springX, springY, scrollYProgress }}>
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

interface ParallaxElementProps {
  children: React.ReactNode;
  mouseStrength?: number; // scale multiplier of mouse offset displacement
  scrollStrength?: number; // scale multiplier of scroll displacement
  className?: string;
}

export function ParallaxElement({
  children,
  mouseStrength = 15,
  scrollStrength = -40,
  className = "",
}: ParallaxElementProps) {
  const { springX, springY, scrollYProgress } = useParallax();
  const { reducedMotion } = useMotion();

  // Map normalized spring values to actual pixel displacements
  const translateX = useTransform(springX, (x: number) => (reducedMotion ? 0 : x * mouseStrength));
  const translateYMouse = useTransform(springY, (y: number) => (reducedMotion ? 0 : y * mouseStrength));
  const translateYScroll = useTransform(scrollYProgress, (s: number) => (reducedMotion ? 0 : (s - 0.5) * scrollStrength));

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      style={{
        x: translateX,
        y: useTransform([translateYMouse, translateYScroll], ([ym, ys]: any) => ym + ys),
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
export default ParallaxProvider;
