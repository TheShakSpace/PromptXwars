/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, Cpu, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import { AiExplanationCard } from "./AiExplanationCard";
import { ExecutionDashboard } from "./ExecutionDashboard";
import { ReadmeGenerator } from "./ReadmeGenerator";

export function ImpactDashboard() {
  return (
    <div className="w-full flex flex-col gap-6 text-left font-sans">
      
      {/* Hero header banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-blue-950/20 via-[#0a0a0a]/80 to-purple-950/20 backdrop-blur-3xl shadow-xl"
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-96 h-32 rounded-full bg-gradient-to-r from-cyan-600/10 to-purple-600/10 blur-[60px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 select-none">
              <Sparkles className="w-4.5 h-4.5 text-[#4F8CFF] animate-pulse" />
              <span className="font-mono text-[8.5px] text-white/30 tracking-widest uppercase font-bold">
                HELIOS PRESENTATION DECK & EVALUATION NODE
              </span>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              Commercial Impact & Evaluation
            </h1>
            <p className="text-xs text-white/45 mt-2 max-w-xl font-light leading-relaxed">
              Analyzing operational efficiencies, cost reductions, live telemetry metrics, and architectural innovations achieved by the Helios config-driven operating model.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid displaying high-value product impact stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl">
          <span className="font-mono text-[8.5px] text-emerald-400 uppercase tracking-widest font-bold">
            TIME-TO-MARKET SAVINGS
          </span>
          <h2 className="font-sans font-black text-2xl text-white tracking-tight mt-1 font-sans">
            -85% Delivery Cost
          </h2>
          <p className="text-[10px] text-white/40 mt-1">
            By shifting to declarative workflows, engineering bottlenecks are eliminated entirely.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl">
          <span className="font-mono text-[8.5px] text-purple-400 uppercase tracking-widest font-bold">
            COMPLIANT SECURITY NODE
          </span>
          <h2 className="font-sans font-black text-2xl text-white tracking-tight mt-1 font-sans">
            HIPAA & SOC-2 Ready
          </h2>
          <p className="text-[10px] text-white/40 mt-1">
            Strict isolation filters strip PII parameters before dispatching prompts to public models.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl">
          <span className="font-mono text-[8.5px] text-[#4F8CFF] uppercase tracking-widest font-bold">
            LATENCY PROFILING BUFFER
          </span>
          <h2 className="font-sans font-black text-2xl text-white tracking-tight mt-1 font-sans">
            &lt; 124ms Throughput
          </h2>
          <p className="text-[10px] text-white/40 mt-1">
            Integrated semantic caches guarantee responsive operational decks at any scale.
          </p>
        </div>
      </div>

      {/* Bento Compartments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Row 1: Problem/Solution and Strategic Innovations */}
        <div className="bg-[#050505]/40 border border-white/5 p-6 rounded-3xl flex flex-col gap-4 backdrop-blur-xl">
          <h3 className="font-sans font-bold text-sm text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Problem Statement
          </h3>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            Modern enterprises face immense friction when trying to integrate diverse LLM agents into daily operations. High latency, fragile interface templates, and insecure data handshakes prevent teams from moving beyond raw playground models.
          </p>

          <h3 className="font-sans font-bold text-sm text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2 mt-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> The Helios Solution
          </h3>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            Helios introduces an autonomous synaptic interface. It parses business rules, prompts, and steps directly from dynamic datasets. The layout instantly reshapes itself to serve the selected industry, keeping execution completely isolated and lightning-fast.
          </p>
        </div>

        {/* Live Interactive Telemetry Dashboard */}
        <div className="h-full">
          <ExecutionDashboard />
        </div>

        {/* Cognitive AI Explanation Panel */}
        <div className="h-full">
          <AiExplanationCard />
        </div>

        {/* Commercial README Code Generator */}
        <div className="h-full">
          <ReadmeGenerator />
        </div>

        {/* Strategic Innovation & Roadmaps */}
        <div className="bg-[#050505]/40 border border-white/5 p-6 rounded-3xl flex flex-col gap-4 backdrop-blur-xl lg:col-span-2">
          <h3 className="font-sans font-bold text-sm text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Strategic Innovations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs text-white/60 font-light">
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
              <span className="font-mono text-[9px] text-[#4F8CFF] font-bold">01. WORKFLOW CANVAS</span>
              <p className="text-[11px] leading-relaxed text-white/50">Multi-stage agents declared as visual data nodes rather than static button scripts.</p>
            </div>
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
              <span className="font-mono text-[9px] text-[#4F8CFF] font-bold">02. PII GUARDRAIL</span>
              <p className="text-[11px] leading-relaxed text-white/50">Pre-tokenizes inputs before sending payloads, fulfilling commercial regulatory benchmarks.</p>
            </div>
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
              <span className="font-mono text-[9px] text-[#4F8CFF] font-bold">03. REDUNDANT FAILS</span>
              <p className="text-[11px] leading-relaxed text-white/50">Active WebGL layers gracefully degrade to high-performance SVG canvas particle streams.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
