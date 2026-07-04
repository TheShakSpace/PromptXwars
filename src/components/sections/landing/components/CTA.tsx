/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Sparkles, Terminal, ArrowUpRight, Github } from "lucide-react";
import { useOS } from "../../../../contexts/OSContext";
import { OSMode } from "../../../../types";
import { Button } from "../../../common/buttons/Button";

export function CTA() {
  const { setMode, setIsTerminalOpen } = useOS();

  return (
    <section id="cta-final" className="relative py-32 px-6 overflow-hidden z-20 select-none">
      {/* Heavy concentric background glow rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-t from-[#4F8CFF]/15 via-violet-900/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] h-[1px] bg-gradient-to-r from-transparent via-[#4F8CFF]/50 to-transparent shadow-[0_0_20px_#4F8CFF]" />
      </div>

      <div className="max-w-4xl mx-auto border border-white/5 bg-black/40 backdrop-blur-3xl rounded-3xl p-12 md:p-20 text-center relative shadow-[0_12px_64px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Subtle grid accent inside CTA box */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

        {/* Central Core status */}
        <div className="flex flex-col items-center gap-6 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-[#4F8CFF] animate-pulse" />
          </motion.div>

          <h2 className="font-sans font-black tracking-tight text-4xl sm:text-6xl text-white uppercase max-w-2xl leading-none">
            Ready to Orchestrate the Future?
          </h2>

          <p className="font-sans font-light text-sm md:text-base text-white/50 max-w-lg leading-relaxed mt-2">
            Unlock sovereign AI workspace environments, direct hardware-accelerated rendering, and secure telemetry controls right inside your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
            <Button
              variant="accent"
              size="lg"
              glow
              magnetic
              onClick={() => setMode(OSMode.WORKSPACE)}
              className="w-full sm:w-auto font-bold tracking-widest text-[10px] group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAUNCH OS SYSTEM</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>

            <Button
              variant="glass"
              size="lg"
              magnetic
              onClick={() => setIsTerminalOpen(true)}
              className="w-full sm:w-auto font-bold tracking-widest text-[10px] text-white/85 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-[#4F8CFF]" />
              <span>LAUNCH COMMAND LINE</span>
            </Button>
          </div>

          {/* Quick System Metrics */}
          <div className="flex items-center gap-3 font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mt-10">
            <span>HEL_VERSION_2.4</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>PLATFORM: SERVERLESS_WEB</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>INFRA: SECURE_SANDBOX</span>
          </div>
        </div>
      </div>
    </section>
  );
}
