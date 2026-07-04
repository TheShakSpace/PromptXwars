/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ParallaxProvider } from "./components/ParallaxProvider";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { ScrollIndicator } from "./components/ScrollIndicator";
import { HeroContent } from "./components/HeroContent";
import { HeroScene } from "./components/HeroScene";
import { Stats } from "./components/Stats";
import { ClientLogos } from "./components/ClientLogos";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Cpu, Shield, Sparkles, Terminal, Activity, Layers, Play, Zap, ArrowRight, Laptop } from "lucide-react";

export function Hero() {
  const [demoCommand, setDemoCommand] = useState("");
  const [demoLog, setDemoLog] = useState<string[]>([]);
  const [demoStep, setDemoStep] = useState(0);

  // High-fidelity typewriter loop for Section 4 Interactive MacBook demo
  useEffect(() => {
    const commands = [
      "helios run agent --cognitive=deepmind",
      "helios deploy database --region=us-east",
      "helios optimize memory --gc=aggressive"
    ];

    const logs = [
      [
        "Initializing synaptic pathing...",
        "Linking spatial neural engine...",
        "DeepMind agent core: ONLINE"
      ],
      [
        "Provisioning serverless Firestore schema...",
        "Generating rules.firestore... DONE",
        "Cloud database cluster: LIVE"
      ],
      [
        "GC sweeping allocated pointers...",
        "Pristine memory state recycled [42.4MB saved]",
        "Optimization sequence: COMPLETE"
      ]
    ];

    let currentIdx = 0;
    let charIdx = 0;
    let typingTimer: NodeJS.Timeout;
    let logTimer: NodeJS.Timeout;

    const runSequence = () => {
      setDemoLog([]);
      setDemoCommand("");
      const cmd = commands[currentIdx];
      charIdx = 0;

      const type = () => {
        if (charIdx < cmd.length) {
          setDemoCommand((prev) => prev + cmd[charIdx]);
          charIdx++;
          typingTimer = setTimeout(type, 35);
        } else {
          // Type completed, dump logs sequentially
          let logIdx = 0;
          const showLogs = () => {
            if (logIdx < logs[currentIdx].length) {
              setDemoLog((prev) => [...prev, logs[currentIdx][logIdx]]);
              logIdx++;
              logTimer = setTimeout(showLogs, 450);
            } else {
              // Wait and loop to next command
              setTimeout(() => {
                currentIdx = (currentIdx + 1) % commands.length;
                setDemoStep(currentIdx);
                runSequence();
              }, 2500);
            }
          };
          logTimer = setTimeout(showLogs, 300);
        }
      };
      type();
    };

    runSequence();

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(logTimer);
    };
  }, []);

  return (
    <ParallaxProvider>
      <div className="relative min-h-screen bg-[#030303] text-white">
        
        {/* Cinematic Backdrop layers */}
        <BackgroundEffects />

        {/* ========================================================
            MASTER HERO SECTION BLOCK
         ======================================================== */}
        <section className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-10 md:gap-4 overflow-hidden">
          {/* Left Text / CTAs */}
          <HeroContent />

          {/* Right 3D Spatial graphic */}
          <HeroScene />

          {/* Interactive bottom micro scroll arrow indicator */}
          <ScrollIndicator />
        </section>

        {/* ========================================================
            SECTION 1: ABOUT THE PLATFORM
         ======================================================== */}
        <section id="about-platform" className="relative py-28 px-6 max-w-6xl mx-auto z-20 select-none">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left huge heading & descriptive slide */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-[#4F8CFF] font-mono text-[9px] tracking-[0.25em] uppercase">
                <Sparkles className="w-4 h-4 text-[#4F8CFF]" />
                <span>SOVEREIGN ARCHITECTURE</span>
              </div>
              <h2 className="font-sans font-black tracking-tight text-4xl md:text-6xl text-white leading-none">
                THE MIND OF THE MACHINE.
              </h2>
              <div className="h-[2px] w-16 bg-[#4F8CFF] rounded" />
              <p className="font-sans font-light text-sm md:text-base text-white/55 leading-relaxed">
                Helios is a client-first, serverless ecosystem that leverages advanced Web3, local SQLite, and Gemini-tier LLM integrations to give you unmatched engineering luxury. Write apps that load instantly, secure themselves locally, and think autonomously.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-4.5 py-2.5 rounded-xl font-mono text-[10px] text-white/80">
                  <Cpu className="w-3.5 h-3.5 text-[#4F8CFF]" />
                  <span>3D WASM COMPLIANT</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-4.5 py-2.5 rounded-xl font-mono text-[10px] text-white/80">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  <span>ISO_27001 PROTECTED</span>
                </div>
              </div>
            </div>

            {/* Right high-contrast decorative preview card */}
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="w-full h-80 rounded-3xl border border-white/10 bg-gradient-to-tr from-neutral-900/80 via-black/40 to-neutral-800/20 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#4F8CFF]/10 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                    ENVIRONMENT CORE v2
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center select-none">
                  <span className="text-3xl md:text-4xl font-sans font-black tracking-tighter text-white leading-tight uppercase">
                    REDUCING LATENCY TO ZERO
                  </span>
                  <p className="font-mono text-[10px] text-[#4F8CFF] uppercase tracking-[0.2em] mt-2">
                    COGNITIVE SUBSYSTEM ENGAGED
                  </p>
                </div>

                <div className="flex items-center justify-between font-mono text-[9px] text-white/40 pt-4 border-t border-white/5">
                  <span>STABLE ENGINE RAILS</span>
                  <span>LATENCY: 0.04ms</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: WHY THIS PLATFORM (BENTO GRID)
         ======================================================== */}
        <section id="why-platform" className="relative py-28 px-6 max-w-6xl mx-auto z-20 select-none">
          <div className="flex flex-col gap-3 mb-16 text-center">
            <span className="font-mono text-[9px] text-[#4F8CFF] tracking-[0.25em] uppercase">
              BENTO GRID AUDIT
            </span>
            <h2 className="font-sans font-black tracking-tight text-3xl md:text-5xl text-white">
              Why Engineers Choose Helios
            </h2>
            <p className="font-sans font-light text-xs md:text-sm text-white/50 max-w-md mx-auto">
              Decoupled systems engineered to prioritize speed, robust crypto shields, and beautiful UI fluidities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[220px]">
            {/* Card 1: AI Powered (Large) */}
            <div className="md:col-span-4 md:row-span-2 glass-panel rounded-3xl p-8 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between shadow-xl relative group overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#4F8CFF]/15 blur-[60px] rounded-full pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Cpu className="w-5.5 h-5.5 text-[#4F8CFF]" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider mb-1.5 block">FEATURE // 01</span>
                <h3 className="font-sans font-black text-xl md:text-2xl text-white tracking-wide mb-2 uppercase">
                  AI CORE INFERENCE ENGINE
                </h3>
                <p className="font-sans font-light text-sm text-white/50 leading-relaxed max-w-lg">
                  Integrate advanced multi-modal models including Gemini Flash and DeepMind networks. Directly orchestrate pipelines with zero middleware latency.
                </p>
              </div>
            </div>

            {/* Card 2: Secure (Medium) */}
            <div className="md:col-span-2 glass-panel rounded-3xl p-6 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between shadow-xl relative group overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-1">SECURE SCHEMAS</h4>
                <p className="font-sans text-xs text-white/45 leading-relaxed">
                  Every local node utilizes end-to-end ECDSA crypto-signatures protecting your operations.
                </p>
              </div>
            </div>

            {/* Card 3: Fast (Medium) */}
            <div className="md:col-span-2 glass-panel rounded-3xl p-6 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between shadow-xl relative group overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-1">GPU ACCELERATED</h4>
                <p className="font-sans text-xs text-white/45 leading-relaxed">
                  Harness modern WebGPU rendering buffers to ensure consistent, premium 60FPS fluid loops.
                </p>
              </div>
            </div>

            {/* Card 4: Developer Friendly */}
            <div className="md:col-span-3 glass-panel rounded-3xl p-6 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between shadow-xl relative group overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-1">COMMAND CLI</h4>
                <p className="font-sans text-xs text-white/45 leading-relaxed">
                  Boot up deep diagnostics using our local sandbox console. Type queries directly over the model.
                </p>
              </div>
            </div>

            {/* Card 5: Scalable */}
            <div className="md:col-span-3 glass-panel rounded-3xl p-6 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between shadow-xl relative group overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-1">AUTONOMIC SYSTEMS</h4>
                <p className="font-sans text-xs text-white/45 leading-relaxed">
                  Deploy multiple self-healing background threads executing critical syncs securely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: FEATURE HIGHLIGHTS (EXPANDING HORIZONTAL CARDS)
         ======================================================== */}
        <section id="features-expanded" className="relative py-28 px-6 max-w-6xl mx-auto z-20 select-none">
          <div className="flex flex-col gap-3 mb-16 text-center">
            <span className="font-mono text-[9px] text-[#4F8CFF] tracking-[0.25em] uppercase">
              DEEP INSPECT
            </span>
            <h2 className="font-sans font-black tracking-tight text-3xl md:text-5xl text-white">
              Sovereign Operating Layouts
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Card 1 */}
            <div className="flex-1 glass-panel rounded-3xl p-8 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between min-h-72 shadow-xl hover:border-[#4F8CFF]/30 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[9px] text-[#4F8CFF] tracking-widest font-bold">01 // TELEMETRY</span>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[#4F8CFF]" />
                </div>
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white uppercase tracking-wide mb-2 group-hover:text-[#4F8CFF] transition-colors">
                  Inference Graphs
                </h3>
                <p className="font-sans text-xs text-white/50 leading-relaxed">
                  Real-time visual monitoring dashboards displaying prompt tokens, model status, and accuracy indexes.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-1 glass-panel rounded-3xl p-8 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between min-h-72 shadow-xl hover:border-green-500/30 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[9px] text-green-400 tracking-widest font-bold">02 // STORAGE</span>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white uppercase tracking-wide mb-2 group-hover:text-green-400 transition-colors">
                  Encrypted State
                </h3>
                <p className="font-sans text-xs text-white/50 leading-relaxed">
                  Durable client-side SQLite database layers backed directly by cloud-hosted serverless replication nodes.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex-1 glass-panel rounded-3xl p-8 border border-white/5 bg-black/45 backdrop-blur-xl flex flex-col justify-between min-h-72 shadow-xl hover:border-orange-500/30 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[9px] text-orange-400 tracking-widest font-bold">03 // SHELL</span>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white uppercase tracking-wide mb-2 group-hover:text-orange-400 transition-colors">
                  Active Sandbox
                </h3>
                <p className="font-sans text-xs text-white/50 leading-relaxed">
                  Execute custom JavaScript functions, API proxy tunnels, and command utilities without exposing local credentials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: INTERACTIVE DEMO (MACBOOK CONSOLE TYPESETTER)
         ======================================================== */}
        <section id="interactive-demo" className="relative py-28 px-6 max-w-6xl mx-auto z-20 select-none">
          <div className="flex flex-col gap-3 mb-16 text-center">
            <span className="font-mono text-[9px] text-[#4F8CFF] tracking-[0.25em] uppercase">
              SANDBOX SIMULATION
            </span>
            <h2 className="font-sans font-black tracking-tight text-3xl md:text-5xl text-white">
              Interactive System Workspace
            </h2>
            <p className="font-sans font-light text-xs md:text-sm text-white/50 max-w-sm mx-auto">
              Test cognitive runtime orchestration directly in the hardware mock-frame.
            </p>
          </div>

          {/* Luxury Mock MacBook Console viewport */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden">
              
              {/* Window Frame Header */}
              <div className="bg-neutral-950 px-4 py-3 border-b border-white/5 flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500/70 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-yellow-500/70 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-green-500/70 rounded-full" />
                </div>
                <div className="flex items-center gap-2 text-white/40 font-mono text-[8.5px] uppercase tracking-widest">
                  <Laptop className="w-3.5 h-3.5 text-[#4F8CFF]" />
                  <span>HELIOS_ACTIVE_MACBOOK_MOCK_01</span>
                </div>
                <div className="w-10 h-1" />
              </div>

              {/* Console Workspace area */}
              <div className="p-6 h-64 md:h-72 bg-[#050505] font-mono text-[11px] text-white/80 flex flex-col gap-3.5 select-text overflow-y-auto scrollbar-none">
                <div className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-white/40 select-none">09:36:17</span>
                  <span className="text-[#4F8CFF] font-black select-none">{"$"}</span>
                  <span className="flex-1">{demoCommand}</span>
                  <span className="w-1.5 h-3.5 bg-[#4F8CFF] animate-pulse shrink-0" />
                </div>

                <AnimatePresence>
                  {demoLog.map((logLine, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2.5 leading-relaxed text-white/50 pl-16 font-semibold"
                    >
                      <span className="text-green-400 select-none">✔</span>
                      <span>{logLine}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Status bar */}
              <div className="bg-neutral-950 border-t border-white/5 px-6 py-2.5 flex items-center justify-between font-mono text-[9px] text-white/40 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F8CFF] animate-pulse" />
                  <span>SYSTEM LAYER: ACTIVE</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>RAM: 14.2GB</span>
                  <span>FPS: 60.00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: SYSTEM TELEMETRY METRIC STATS
         ======================================================== */}
        <Stats />

        {/* ========================================================
            SECTION 6: INFINITE CLIENT LOGOS MARQUEE
         ======================================================== */}
        <ClientLogos />

        {/* ========================================================
            SECTION 7: CLIENT TESTIMONIAL REVIEWS
         ======================================================== */}
        <Testimonials />

        {/* ========================================================
            SECTION 8: CALL TO ACTION FOOTER
         ======================================================== */}
        <CTA />

      </div>
    </ParallaxProvider>
  );
}
