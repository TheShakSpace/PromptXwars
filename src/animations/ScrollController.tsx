/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useMotion } from "./MotionContext";
import { motion, useScroll, useSpring } from "motion/react";

interface ScrollControllerProps {
  children: React.ReactNode;
}

export function ScrollController({ children }: ScrollControllerProps) {
  const { reducedMotion, setTimelineProgress } = useMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("Hero");

  // Framer Motion native scroll hook
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = window.scrollY / docHeight;
      setScrollProgress(progress);
      setTimelineProgress(progress);

      // Section tracking
      const sections = ["hero", "about-platform", "why-platform", "interactive-demo", "system-telemetry", "cta-footer"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= -200 && rect.top <= window.innerHeight / 2) {
            setActiveSection(sectionId.replace("-", " ").toUpperCase());
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setTimelineProgress]);

  if (reducedMotion) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="relative w-full">
      {/* Premium minimal scroll-top bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#3B82F6] via-[#A855F7] to-[#EC4899] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      {/* Floating minimalist HUD showing scrolling section name */}
      <div className="fixed bottom-8 left-8 z-40 hidden md:flex items-center gap-3 font-mono text-[9px] text-white/40 tracking-wider bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
        <span className="font-bold text-white/70">{activeSection}</span>
        <span className="text-white/20">|</span>
        <span>{Math.round(scrollProgress * 100)}% DISPATCHED</span>
      </div>

      {children}
    </div>
  );
}

export default ScrollController;
