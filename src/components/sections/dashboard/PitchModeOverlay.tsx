/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDemoStore } from "../../../store/demoStore";
import { ChevronRight, ChevronLeft, X, Sparkles, Presentation, Sliders, PlayCircle } from "lucide-react";

export function PitchModeOverlay() {
  const { isPitchOpen, activeSlideIndex, slides, setPitchOpen, setActiveSlideIndex } = useDemoStore();

  if (!isPitchOpen) return null;

  const currentSlide = slides[activeSlideIndex];

  const handleNext = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    } else {
      setPitchOpen(false);
    }
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 select-none">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 30 }}
          className="bg-neutral-950 border border-white/10 rounded-3xl p-8 max-w-5xl w-full h-[580px] shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative overflow-hidden flex flex-col justify-between"
        >
          {/* Cosmic background flares */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[450px] h-[250px] rounded-full bg-gradient-to-r from-blue-600/10 to-violet-600/10 blur-[90px] animate-pulse pointer-events-none" />

          {/* Slide Deck Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <Presentation className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
                HELIOS AI OPERATING SYSTEM PITCH DECK
              </span>
            </div>
            <button
              onClick={() => setPitchOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Slide content structure: Split layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-6 flex-1 text-left">
            
            {/* Left Col: Slide Bullet Points */}
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[9.5px] text-purple-400 font-bold uppercase tracking-widest">
                SLIDE {activeSlideIndex + 1} OF {slides.length} — {currentSlide.id.toUpperCase()}
              </span>
              <h2 className="font-sans font-black text-2xl tracking-tight text-white sm:text-3xl">
                {currentSlide.title}
              </h2>
              <p className="text-xs text-white/40 font-mono font-light leading-relaxed">
                {currentSlide.subtitle}
              </p>

              <div className="flex flex-col gap-3 mt-2">
                {currentSlide.bulletPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                    <p className="text-xs text-white/75 font-sans leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Graphic illustration layout placeholder */}
            <div className="h-full max-h-[300px] bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/[0.02] to-blue-500/[0.02] pointer-events-none" />
              
              <div className="flex items-center gap-2 select-none">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
                <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
                  Live Neural Core Preview
                </span>
              </div>

              <div className="flex flex-col gap-1 my-4">
                <span className="font-mono text-[10px] text-white/60 leading-relaxed font-light">
                  {currentSlide.illustrationText}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-purple-400/80 uppercase font-black">
                <PlayCircle className="w-3.5 h-3.5" /> Telemetry compilation: PASS
              </div>
            </div>

          </div>

          {/* Slide Deck Actions Footer */}
          <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-4">
            
            {/* Quick selectors indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeSlideIndex ? "w-8 bg-purple-500" : "w-2 bg-white/10"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={activeSlideIndex === 0}
                onClick={handlePrev}
                className="p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleNext}
                className="py-2.5 px-5 bg-white hover:bg-white/90 text-black rounded-xl font-mono text-[10px] font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {activeSlideIndex === slides.length - 1 ? "ENTER SYSTEM" : "NEXT SLIDE"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
