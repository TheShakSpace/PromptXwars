/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { MotionProvider } from "./MotionContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safely register GSAP ScrollTrigger if running in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Optimize GSAP defaults for lag prevention and smooth rendering
  gsap.config({
    autoSleep: 60,
    force3D: true,
    nullTargetWarn: false,
  });

  // Align GSAP scroll tick rate with requestAnimationFrame
  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 100,
  });
}

interface AnimationProviderProps {
  children: React.ReactNode;
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Scroll restoration setting to allow smooth ScrollTrigger computations
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      // Cleanup all ScrollTrigger instances on app unmount
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <MotionProvider>
      {children}
    </MotionProvider>
  );
}

export default AnimationProvider;
