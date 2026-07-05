/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotion, CursorType } from "./MotionContext";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function CursorSystem() {
  const { cursorType, cursorText, reducedMotion } = useMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  // Position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Velocity tracking ref
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  // Spring settings
  const dotSpringX = useSpring(mouseX, { stiffness: 600, damping: 30 });
  const dotSpringY = useSpring(mouseY, { stiffness: 600, damping: 30 });

  const ringSpringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.8 });
  const ringSpringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.8 });

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Compute velocity for pointer distortion stretch
      const now = Date.now();
      const dt = Math.max(1, now - lastMousePos.current.time);
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;

      // Smooth velocity interpolation
      const vx = (dx / dt) * 15;
      const vy = (dy / dt) * 15;

      setVelocity({ x: vx, y: vy });

      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);

      // Add a ripple element
      const newRipple = {
        id: rippleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev, newRipple].slice(-5)); // keep last 5 ripples
    };

    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, isVisible, reducedMotion]);

  // Handle ripple cleanup
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 800);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (reducedMotion || !isVisible) return null;

  // Compute angle and scale of distortion based on mouse speed vector
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const maxStretch = 0.35; // upper cap of stretch distortion
  const stretchAmount = Math.min(speed * 0.012, maxStretch);
  const angleRad = Math.atan2(velocity.y, velocity.x);
  const angleDeg = (angleRad * 180) / Math.PI;

  // State-specific styles
  let ringClasses = "border-white/30 bg-transparent";
  let dotClasses = "bg-[#4F8CFF]";
  let ringSize = 24;

  if (cursorType === "pointer") {
    ringClasses = "border-[#4F8CFF] bg-[#4F8CFF]/10 scale-125 shadow-[0_0_15px_rgba(79,140,255,0.4)]";
    dotClasses = "bg-[#4F8CFF] scale-75";
  } else if (cursorType === "magnetic") {
    ringClasses = "border-[#A855F7] bg-[#A855F7]/15 scale-150 shadow-[0_0_20px_rgba(168,85,247,0.5)]";
    dotClasses = "bg-[#A855F7] scale-50";
    ringSize = 28;
  } else if (cursorType === "text") {
    ringClasses = "border-transparent bg-transparent scale-50";
    dotClasses = "bg-white/80 w-[2px] h-4 rounded-none scale-y-125";
  } else if (cursorType === "drag") {
    ringClasses = "border-[#EC4899] bg-[#EC4899]/15 scale-140";
    dotClasses = "bg-[#EC4899] scale-50";
    ringSize = 32;
  } else if (cursorType === "loading") {
    ringClasses = "border-dashed border-t-[#A855F7] border-white/20 animate-spin scale-125";
    dotClasses = "bg-[#A855F7] scale-75";
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-50 overflow-hidden">
      {/* 1. Mouse Click Ripples */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0.6, scale: 0, filter: "blur(0px)" }}
          animate={{ opacity: 0, scale: 1.8, filter: "blur(2px)" }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: r.x - 30,
            top: r.y - 30,
            width: 60,
            height: 60,
          }}
          className="rounded-full border border-[#A855F7] pointer-events-none"
        />
      ))}

      {/* 2. Custom Outer Ring (With speed-stretching skew transformations) */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full border pointer-events-none select-none flex items-center justify-center transition-colors duration-300 ${ringClasses}`}
        style={{
          x: ringSpringX,
          y: ringSpringY,
          width: ringSize,
          height: ringSize,
          translateX: "-50%",
          translateY: "-50%",
          scale: isClicked ? 0.85 : undefined,
          rotate: `${angleDeg}deg`,
          scaleX: 1 + stretchAmount,
          scaleY: 1 - stretchAmount,
        }}
      >
        {/* Render text placeholder inside ring if hovering custom elements */}
        {cursorText && (
          <span className="font-mono text-[8px] text-white font-bold tracking-widest absolute uppercase bg-black/75 px-1.5 py-0.5 rounded-md border border-white/10 top-8 whitespace-nowrap">
            {cursorText}
          </span>
        )}

        {/* Dynamic Drag Directional Triangles inside outer ring */}
        {cursorType === "drag" && (
          <div className="absolute inset-0 flex items-center justify-between px-1.5 font-bold text-[8px] text-[#EC4899] select-none">
            <span>◀</span>
            <span>▶</span>
          </div>
        )}
      </motion.div>

      {/* 3. Central Hardware Core Dot */}
      <motion.div
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none select-none transition-transform duration-200 ${dotClasses}`}
        style={{
          x: dotSpringX,
          y: dotSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
}

export default CursorSystem;
