/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDemoStore } from "../../../store/demoStore";
import { ChevronRight, ChevronLeft, X, Sparkles, Navigation, Layers, ShieldCheck } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  selector?: string; // Optional target selector reference
  tip: string;
}

export function GuidedTour() {
  const { isTourActive, tourStepIndex, setTourActive, setTourStepIndex } = useDemoStore();

  if (!isTourActive) return null;

  const steps: TourStep[] = [
    {
      title: "🚀 Welcome to Helios AI OS",
      description: "An immersive, commercial-grade, autonomous platform layout designed to adapt to any industry focus in under 60 seconds.",
      tip: "Press 'Next' to explore the active modules."
    },
    {
      title: "📊 Unified Executive Dashboard",
      description: "Your primary cockpit. Features dynamic bento grids, real-time performance tracking charts, and actionable checklists.",
      tip: "Everything on this screen is compiled dynamically from active JSON configurations."
    },
    {
      title: "⚙️ Industry Pivot Configurations",
      description: "Instantly redirect prompts, output layouts, and stat cards to Healthcare, Finance, and Legal compliance systems.",
      tip: "Check out active industry configurations inside config/platformConfig.ts."
    },
    {
      title: "⚡ Dynamic JSON Workflows",
      description: "Describe agentic pipelines in structured JSON. Steps activate sequentially, executing prompts and updating live metrics.",
      tip: "Watch connections pulse and node states highlight during execution."
    },
    {
      title: "🛡️ Production-Grade Error Boundaries",
      description: "Triple-redundant layout fallbacks. If Spline WebGL containers timeout, high-fidelity canvas particle systems deploy.",
      tip: "No blank screens. Full offline signal listeners are active natively."
    },
    {
      title: "🏆 Judge Mode Tech Blueprint",
      description: "A fast, 1-click diagnostic layout showcasing directory models, system stacks, prompt registers, and scale limits.",
      tip: "Accessible via the bottom right floating controller panel."
    }
  ];

  const currentStep = steps[tourStepIndex];

  const handleNext = () => {
    if (tourStepIndex < steps.length - 1) {
      setTourStepIndex(tourStepIndex + 1);
    } else {
      setTourActive(false);
    }
  };

  const handlePrev = () => {
    if (tourStepIndex > 0) {
      setTourStepIndex(tourStepIndex - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-neutral-950/90 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden"
        >
          {/* Decorative glowing backdrops */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/10 blur-[40px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyan-500/10 blur-[40px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F8CFF] animate-pulse" />
              <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
                HELIOS GUIDED ONBOARDING
              </span>
            </div>
            <button
              onClick={() => setTourActive(false)}
              className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Indicator */}
          <div className="flex items-center gap-1.5 mb-4">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === tourStepIndex ? "w-6 bg-[#4F8CFF]" : "w-1.5 bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2.5 min-h-[140px]">
            <h2 className="font-sans font-black text-lg text-white leading-tight">
              {currentStep.title}
            </h2>
            <p className="text-xs text-white/60 leading-relaxed font-light font-sans">
              {currentStep.description}
            </p>

            <div className="mt-2 bg-white/5 border border-white/5 p-3 rounded-xl flex items-start gap-2 font-mono text-[10px] text-[#4F8CFF]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#4F8CFF]" />
              <div className="flex flex-col">
                <span className="font-bold uppercase tracking-wider text-[8px] text-white/50">PLATFORM INTELLIGENCE TIP</span>
                <p className="text-white/70 leading-normal mt-0.5">{currentStep.tip}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
            <button
              onClick={() => setTourActive(false)}
              className="font-mono text-[9px] text-white/30 hover:text-white uppercase cursor-pointer"
            >
              SKIP TOUR
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={tourStepIndex === 0}
                onClick={handlePrev}
                className="p-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="py-1.5 px-4 bg-white hover:bg-white/90 text-black rounded-xl font-mono text-[9px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
              >
                {tourStepIndex === steps.length - 1 ? "FINISH" : "NEXT"} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
