/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { useMagneticElement, useHoverSound, useCursorStyle } from "./MotionHooks";
import { useMotion } from "./MotionContext";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  onClick,
  className = "",
  strength = 0.45,
  disabled = false,
}: MagneticButtonProps) {
  const { reducedMotion } = useMotion();
  const magneticRef = useMagneticElement(reducedMotion ? 0 : strength);
  const soundEvents = useHoverSound("hover");
  const cursorEvents = useCursorStyle("magnetic");

  const combinedRef = (node: HTMLButtonElement | null) => {
    magneticRef.current = node;
  };

  return (
    <button
      ref={combinedRef}
      onClick={onClick}
      disabled={disabled}
      className={`inline-block transition-shadow duration-300 relative select-none cursor-none ${className}`}
      onMouseEnter={(e) => {
        if (!disabled) {
          soundEvents.onMouseEnter();
          cursorEvents.onMouseEnter();
        }
      }}
      onMouseLeave={() => {
        if (!disabled) {
          cursorEvents.onMouseLeave();
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          soundEvents.onMouseDown();
        }
      }}
    >
      {/* Background soft focus glow backing */}
      <span className="absolute inset-0 rounded-xl bg-[#A855F7]/0 hover:bg-[#A855F7]/5 transition-colors pointer-events-none -z-10" />
      {children}
    </button>
  );
}

export default MagneticButton;
