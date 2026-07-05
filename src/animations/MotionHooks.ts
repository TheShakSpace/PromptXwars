/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect, useCallback } from "react";
import { useMotion, CursorType } from "./MotionContext";

/**
 * Premium Magnetic attraction effect for buttons/dock icons.
 * Smoothly interpolates the element towards the hover pointer.
 */
export function useMagneticElement(strength = 0.45) {
  const ref = useRef<HTMLElement | null>(null);
  const { setCursorType } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Attract element based on strength
      targetX = deltaX * strength;
      targetY = deltaY * strength;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      setCursorType("default");
    };

    const handleMouseEnter = () => {
      setCursorType("magnetic");
    };

    // Smooth spring-like lerp loop
    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(updatePosition);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseenter", handleMouseEnter);
    updatePosition();

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, [strength, setCursorType]);

  return ref;
}

/**
 * Immersive 3D Tilt effect for premium dashboards, glass panels, and cards.
 * Rotates the element around X and Y axes relative to pointer coordinates.
 */
export function useCard3DTilt(maxRotate = 10, scale = 1.02) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetScale = 1;

    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentScale = 1;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      // Convert coordinate to range of [-0.5, 0.5]
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      // Rotate around X (uses py) and Y (uses px)
      targetRotateX = -py * maxRotate;
      targetRotateY = px * maxRotate;
      targetScale = scale;
    };

    const handleMouseLeave = () => {
      targetRotateX = 0;
      targetRotateY = 0;
      targetScale = 1;
    };

    const update3DTransforms = () => {
      // Lerp computations
      currentRotateX += (targetRotateX - currentRotateX) * 0.1;
      currentRotateY += (targetRotateY - currentRotateY) * 0.1;
      currentScale += (targetScale - currentScale) * 0.15;

      el.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`;
      rafId = requestAnimationFrame(update3DTransforms);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    update3DTransforms();

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, [maxRotate, scale]);

  return ref;
}

/**
 * Automates attaching procedural click and hover sound effects on interactive components.
 */
export function useHoverSound(type: "hover" | "click" | "robot" | "notification" = "hover") {
  const { playAudio } = useMotion();

  const handleMouseEnter = useCallback(() => {
    playAudio(type);
  }, [playAudio, type]);

  const handleMouseDown = useCallback(() => {
    if (type === "hover") {
      playAudio("click");
    }
  }, [playAudio, type]);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseDown: handleMouseDown,
  };
}

/**
 * Dynamically binds pointer custom cursor state styles on standard element events.
 */
export function useCursorStyle(type: CursorType, hoverText = "") {
  const { setCursorType } = useMotion();

  const onMouseEnter = useCallback(() => {
    setCursorType(type, hoverText);
  }, [setCursorType, type, hoverText]);

  const onMouseLeave = useCallback(() => {
    setCursorType("default");
  }, [setCursorType]);

  return {
    onMouseEnter,
    onMouseLeave,
  };
}
