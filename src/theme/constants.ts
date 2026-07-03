/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Core Color Palette constants conforming to the requested design system.
 */
export const COLORS = {
  background: "#050505",
  primary: "#FFFFFF",
  secondary: "#BDBDBD",
  accent: "#4F8CFF",
  borders: "rgba(255, 255, 255, 0.08)",
  cards: "rgba(255, 255, 255, 0.05)",
  success: "#22C55E",
  warning: "#FACC15",
  error: "#EF4444",
} as const;

/**
 * Spacing scale system tokens (in pixels/rem equivalents)
 */
export const SPACING = {
  xs: "0.25rem",  // 4px
  sm: "0.5rem",   // 8px
  md: "0.75rem",  // 12px
  lg: "1rem",     // 16px
  xl: "1.25rem",  // 20px
  xxl: "1.5rem",  // 24px
  "3xl": "2rem",  // 32px
  "4xl": "2.5rem", // 40px
  "5xl": "3rem",   // 48px
  "6xl": "4rem",   // 64px
  "7xl": "6rem",   // 96px
  "8xl": "8rem",   // 128px
} as const;

/**
 * Rounded corners radius tokens
 */
export const RADIUS = {
  small: "rounded-sm",    // xs or 4px
  medium: "rounded-md",   // sm or 8px
  large: "rounded-lg",    // md or 12px
  xl: "rounded-xl",       // lg or 16px
  xxl: "rounded-2xl",     // xl or 24px
  "3xl": "rounded-3xl",   // xxl or 32px
  full: "rounded-full",   // full circle
} as const;

/**
 * Standardized High-End Glassmorphic Shadows & Ambient Lighting effects
 */
export const SHADOWS = {
  soft: "shadow-[0_4px_12px_rgba(0,0,0,0.5)]",
  glass: "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-[12px] border border-white/10",
  hero: "shadow-[0_0_80px_rgba(79,140,255,0.15)]",
  floating: "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]",
} as const;

/**
 * Responsive High-Polish Typography Tokens (Geist-based classes)
 */
export const TYPOGRAPHY = {
  displayXXL: "font-sans font-black tracking-tighter text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9]",
  displayXL: "font-sans font-extrabold tracking-tight text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none",
  displayLarge: "font-sans font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight",
  heading1: "font-sans font-semibold tracking-tight text-2xl md:text-3xl lg:text-4xl leading-snug",
  heading2: "font-sans font-medium tracking-tight text-xl md:text-2xl lg:text-3xl leading-snug",
  heading3: "font-sans font-medium tracking-tight text-lg md:text-xl lg:text-2xl leading-normal",
  bodyLarge: "font-sans text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-light",
  bodyMedium: "font-sans text-sm md:text-base text-white/70 leading-relaxed",
  caption: "font-mono text-xs text-white/40 tracking-wider uppercase",
  button: "font-sans font-medium tracking-wide text-xs md:text-sm uppercase select-none",
} as const;

/**
 * Responsive Design Breakpoints for documentation and programatic checks
 */
export const BREAKPOINTS = {
  mobile: "320px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
  ultraWide: "2560px",
} as const;
