/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Coordinate state tracking for interactive mouse drifting
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Instantiate dynamic floating cyber particles
    const particleCount = 65;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: -0.3 - Math.random() * 0.8, // rise upwards
      opacity: 0.15 + Math.random() * 0.6,
      depthFactor: 0.5 + Math.random() * 1.5, // 3D depth speed scaling
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinate ease
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particles.forEach((p) => {
        // Calculate interactive wind drag from custom mouse coordination
        const dx = (mouse.x - width / 2) * 0.015 * p.depthFactor;
        const dy = (mouse.y - height / 2) * 0.015 * p.depthFactor;

        // Apply velocities
        p.x += p.speedX + dx;
        p.y += p.speedY + dy;

        // Boundary recycle wrap-around logic
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.y > height + 10) {
          p.y = -10;
        }

        // Draw individual blurred particle nodes
        ctx.fillStyle = `rgba(79, 140, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect tiny high-tech matrix lines between nearby nodes
        particles.forEach((other) => {
          const dist = Math.hypot(p.x - other.x, p.y - other.y);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.06;
            ctx.strokeStyle = `rgba(79, 140, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-15 select-none bg-transparent"
    />
  );
}
