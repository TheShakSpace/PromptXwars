/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, useState, useEffect, useRef, Suspense } from "react";
import Spline from "@splinetool/react-spline";
import { useOS } from "../../../contexts/OSContext";
import { Play, RotateCw, WifiOff, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SplineViewerProps {
  sceneUrl?: string;
}

export function SplineViewer({ sceneUrl = "https://prod.spline.design/kZiS7h00qS8zY3b6/scene.splinecode" }: SplineViewerProps) {
  const { splineProgress, setSplineProgress, addNotification } = useOS();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSplineLoad = () => {
    setIsLoaded(true);
    setSplineProgress(100);
    addNotification("Spatial Canvas Live", "Spline 3D geometry rendered successfully on the GPU.", "success");
  };

  const handleSplineError = () => {
    setHasError(true);
    setUseFallback(true);
    setSplineProgress(100);
    addNotification("Spline Bypass Active", "Using spatial HTML Canvas rendering due to sandbox restrictions.", "warning");
  };

  // Sync progress when fallback is active
  useEffect(() => {
    if (useFallback || hasError) {
      setSplineProgress(100);
    }
  }, [useFallback, hasError, setSplineProgress]);

  // Global uncaught error and promise rejection listeners to intercept async Spline failures
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || "";
      const errorStack = event.error?.stack || "";
      if (
        msg.includes("end of buffer") || 
        msg.includes("Spline") || 
        msg.includes("spline") ||
        errorStack.includes("spline") ||
        errorStack.includes("Spline")
      ) {
        console.warn("Intercepted global Spline error:", msg);
        handleSplineError();
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || "";
      const reasonStack = event.reason?.stack || "";
      if (
        reason.includes("end of buffer") || 
        reason.includes("Spline") || 
        reason.includes("spline") ||
        reasonStack.includes("spline") ||
        reasonStack.includes("Spline")
      ) {
        console.warn("Intercepted global Spline unhandled promise rejection:", reason);
        handleSplineError();
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("error", handleGlobalError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection, true);

    return () => {
      window.removeEventListener("error", handleGlobalError, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true);
    };
  }, []);

  // Defensive timeout to prevent infinite loading of Spline inside restricted sandboxes
  useEffect(() => {
    if (isLoaded || hasError || useFallback) return;

    const timer = setTimeout(() => {
      if (!isLoaded && !hasError && !useFallback) {
        console.warn("Spline GPU pipeline loading timed out. Transitioning to Canvas fallback...");
        handleSplineError();
      }
    }, 4000); // 4-second budget for network fetch + WASM boot

    return () => clearTimeout(timer);
  }, [isLoaded, hasError, useFallback]);

  // Progressive loading simulation
  useEffect(() => {
    if (isLoaded || hasError || useFallback) return;
    
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 95) {
        current = 95;
        clearInterval(interval);
      }
      setSplineProgress(current);
    }, 120);

    return () => clearInterval(interval);
  }, [isLoaded, hasError, useFallback, setSplineProgress]);

  // Fallback 3D Orbital Particle System Simulation on HTML5 Canvas
  useEffect(() => {
    if (!useFallback && !hasError) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      angle: number;
      distance: number;
      pulseSpeed: number;
      pulseMax: number;
    }> = [];

    // Create central core particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? "rgba(79, 140, 255, 0.6)" : "rgba(255, 255, 255, 0.4)",
        speed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * (Math.min(width, height) * 0.35) + 30,
        pulseSpeed: Math.random() * 0.05 + 0.01,
        pulseMax: Math.random() * 5 + 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.2)"; // trailing fade for fluid motion
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle spatial wireframe rings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      for (let r = 100; r <= 400; r += 100) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Render connected lines (neural mesh feel)
      ctx.strokeStyle = "rgba(79, 140, 255, 0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (centerX + Math.cos(particles[i].angle) * particles[i].distance) - (centerX + Math.cos(particles[j].angle) * particles[j].distance);
          const dy = (centerY + Math.sin(particles[i].angle) * particles[i].distance) - (centerY + Math.sin(particles[j].angle) * particles[j].distance);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(particles[i].angle) * particles[i].distance, centerY + Math.sin(particles[i].angle) * particles[i].distance);
            ctx.lineTo(centerX + Math.cos(particles[j].angle) * particles[j].distance, centerY + Math.sin(particles[j].angle) * particles[j].distance);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.distance;
        const y = centerY + Math.sin(p.angle) * p.distance;

        // Draw outer orbits glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // reset shadow
      });

      // Draw glowing AI Core center
      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 45);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.3, "rgba(79, 140, 255, 0.5)");
      gradient.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [useFallback, hasError]);

  return (
    <div id="spline-container" className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#050505]">
      {/* 3D Spline Canvas */}
      {!useFallback && !hasError && (
        <ErrorBoundary
          fallback={<canvas ref={canvasRef} className="w-full h-full block opacity-80" />}
          onError={handleSplineError}
        >
          <Suspense fallback={null}>
            <Spline
              scene={sceneUrl}
              onLoad={handleSplineLoad}
              onError={handleSplineError}
              className="w-full h-full block"
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Backup Interactive HTML5 Particle Network Canvas */}
      {(useFallback || hasError) && (
        <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
      )}

      {/* Floating Spatial Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,#050505_100%)]" />

      {/* UI Controls overlay for Spline status */}
      <div className="absolute top-24 right-8 z-20 flex gap-3">
        {(useFallback || hasError) ? (
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white/60 shadow-lg">
            <WifiOff className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>3D BYPASS ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white/60 shadow-lg">
            <Cpu className="w-3.5 h-3.5 text-green-400" />
            <span>GPU PIPELINE INITALIZED</span>
          </div>
        )}

        <button
          onClick={() => {
            if (useFallback) {
              setUseFallback(false);
              setHasError(false);
              setIsLoaded(false);
              setSplineProgress(0);
            } else {
              setUseFallback(true);
            }
          }}
          className="bg-white/5 hover:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white/80 flex items-center gap-1.5 transition-all active:scale-95 shadow-lg"
          title="Toggle Canvas/Spline Fallbacks"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{useFallback ? "RE-ENGAGE SPLINE" : "SWAP FALLBACK"}</span>
        </button>
      </div>
    </div>
  );
}
