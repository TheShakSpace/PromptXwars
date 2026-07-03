/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";
import { animationPresets } from "../../../animations/presets";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, magnetic = false, children, ...props }, ref) => {
    const baseStyles = "relative font-sans font-medium uppercase tracking-wider text-xs inline-flex items-center justify-center select-none active:scale-98 transition-all overflow-hidden border";
    
    const variants = {
      primary: "bg-white text-[#050505] border-white hover:bg-white/90 shadow-lg",
      secondary: "bg-transparent text-white/80 border-white/10 hover:border-white/20 hover:text-white",
      accent: "bg-[#4F8CFF] text-white border-[#4F8CFF] hover:bg-[#4F8CFF]/90 shadow-[0_0_20px_rgba(79,140,255,0.25)]",
      glass: "bg-white/5 text-white/90 border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20",
      ghost: "bg-transparent text-white/50 border-transparent hover:text-white/85",
    };

    const sizes = {
      sm: "px-4 py-2 rounded-sm text-[10px]",
      md: "px-6 py-3 rounded-md text-[11px]",
      lg: "px-8 py-4 rounded-lg text-xs",
    };

    // Magnetic and spring motion wrapper params
    const motionProps = magnetic 
      ? {
          whileHover: { y: -3, scale: 1.02 },
          whileTap: { y: 0, scale: 0.98 },
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }
      : {
          whileHover: { scale: 1.01 },
          whileTap: { scale: 0.99 },
        };

    return (
      <motion.button
        ref={ref as any}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glow && "after:absolute after:inset-0 after:w-full after:h-full after:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)] after:opacity-0 hover:after:opacity-100 after:transition-opacity",
          className
        )}
        {...motionProps}
        {...(props as any)}
      >
        {/* Glow backdrop shadow filter for special buttons */}
        {glow && variant === "accent" && (
          <span className="absolute inset-0 bg-[#4F8CFF]/30 blur-md rounded-lg pointer-events-none -z-10" />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
