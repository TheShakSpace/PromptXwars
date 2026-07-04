/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, useTransform } from "motion/react";
import { useParallax } from "./ParallaxProvider";
import { Sparkles, Cpu, CpuIcon, Layers, Orbit, Workflow, MessageSquareText, ShieldCheck } from "lucide-react";

interface CardProps {
  title: string;
  icon: React.ComponentType<any>;
  top: string;
  left: string;
  delay: number;
  depth: number; // multiplier for parallax strength
}

const cardsData: CardProps[] = [
  {
    title: "AI Agents",
    icon: Orbit,
    top: "12%",
    left: "14%",
    delay: 0.1,
    depth: 18,
  },
  {
    title: "Prompt Design",
    icon: MessageSquareText,
    top: "22%",
    left: "68%",
    delay: 0.25,
    depth: -22,
  },
  {
    title: "Automation",
    icon: Workflow,
    top: "56%",
    left: "10%",
    delay: 0.4,
    depth: 14,
  },
  {
    title: "Reasoning",
    icon: Layers,
    top: "70%",
    left: "62%",
    delay: 0.55,
    depth: -16,
  },
  {
    title: "Vision AI",
    icon: Sparkles,
    top: "40%",
    left: "74%",
    delay: 0.3,
    depth: 25,
  },
];

export function FloatingCards() {
  const { springX, springY } = useParallax();

  return (
    <div className="absolute inset-0 z-20 pointer-events-none w-full h-full overflow-hidden">
      {cardsData.map((card, idx) => {
        const Icon = card.icon;

        // Dynamic 3D parallax transformation based on card's specific depth layer
        const posX = useTransform(springX, (val: number) => val * card.depth);
        const posY = useTransform(springY, (val: number) => val * card.depth);
        const rotX = useTransform(springY, (val: number) => val * (card.depth > 0 ? 8 : -8));
        const rotY = useTransform(springX, (val: number) => val * (card.depth > 0 ? -12 : 12));

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + card.delay, duration: 0.8, type: "spring" }}
            style={{
              top: card.top,
              left: card.left,
              x: posX,
              y: posY,
              rotateX: rotX,
              rotateY: rotY,
              transformStyle: "preserve-3d",
            }}
            className="absolute pointer-events-auto cursor-pointer"
          >
            <motion.div
              whileHover={{
                scale: 1.08,
                translateY: -5,
                borderColor: "rgba(79, 140, 255, 0.4)",
                boxShadow: "0 10px 30px rgba(79, 140, 255, 0.15)",
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md shadow-2xl transition-all duration-300"
            >
              <div className="w-6 h-6 rounded-lg bg-[#4F8CFF]/10 border border-[#4F8CFF]/20 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-[#4F8CFF]" />
              </div>
              <span className="font-sans font-semibold text-[11px] tracking-wide text-white/90">
                {card.title}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
