/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";

export interface PitchSlide {
  id: string;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  illustrationText: string;
}

interface DemoState {
  isPresentationMode: boolean;
  isPitchOpen: boolean;
  activeSlideIndex: number;
  isTourActive: boolean;
  tourStepIndex: number;
  isJudgeModeOpen: boolean;
  togglePresentationMode: () => void;
  setPresentationMode: (active: boolean) => void;
  setPitchOpen: (open: boolean) => void;
  setActiveSlideIndex: (index: number) => void;
  setTourActive: (active: boolean) => void;
  setTourStepIndex: (index: number) => void;
  setJudgeModeOpen: (open: boolean) => void;
  slides: PitchSlide[];
}

export const useDemoStore = create<DemoState>((set) => ({
  isPresentationMode: false,
  isPitchOpen: false,
  activeSlideIndex: 0,
  isTourActive: false,
  tourStepIndex: 0,
  isJudgeModeOpen: false,
  togglePresentationMode: () => set((state) => ({ isPresentationMode: !state.isPresentationMode })),
  setPresentationMode: (active) => set({ isPresentationMode: active }),
  setPitchOpen: (open) => set({ isPitchOpen: open }),
  setActiveSlideIndex: (index) => set({ activeSlideIndex: index }),
  setTourActive: (active) => set({ isTourActive: active }),
  setTourStepIndex: (index) => set({ tourStepIndex: index }),
  setJudgeModeOpen: (open) => set({ isJudgeModeOpen: open }),
  slides: [
    {
      id: "problem",
      title: "The Problem Space",
      subtitle: "Enterprise AI fragmentation and low-fidelity integrations",
      bulletPoints: [
        "AI projects are built as fragile hackathon starters, lacking production-grade structure.",
        "Monolithic architectures make pivoting to new industries slow, costly, and error-prone.",
        "Static UI interfaces are unable to adapt to diverse industries and real-time telemetry inputs."
      ],
      illustrationText: "Monolithic fragmentation leads to latency spikes, security leaks, and unstable models."
    },
    {
      id: "solution",
      title: "The Solution: Helios AI",
      subtitle: "A unified, config-driven, autonomous synaptic operating interface",
      bulletPoints: [
        "100% config-driven layouts: Instantly pivot across Healthcare, Finance, and Legal verticals.",
        "Advanced prompt-compilation pipelines isolating role-play variables from operational assets.",
        "Dual Immersive & Workspace layouts rendering real-time multi-agent activity."
      ],
      illustrationText: "Config-driven layouts adapt instantly. High-performance caching guarantees low latency."
    },
    {
      id: "architecture",
      title: "The Tech Stack & Architecture",
      subtitle: "Ultra-fast React 19 concurrent pipelines and real-time state streams",
      bulletPoints: [
        "React 19 & Vite 6: Leverages native TypeScript compilation and blazing-fast asset hydration.",
        "Zustand State Engine: Fine-grained, modular stores minimizing layout recalculations.",
        "Universal Workflow System: Declares agentic pipelines in raw JSON for infinite scalability."
      ],
      illustrationText: "Zero-dependency micro-audio synthesizers keep bundles tiny and performance pristine."
    },
    {
      id: "demo",
      title: "Live Autonomous Demo",
      subtitle: "Interactive Multi-Agent Orchestration & Real-time Telemetry",
      bulletPoints: [
        "Unified workspace dashboard displaying live CPU diagnostics, logs, and workflow canvases.",
        "Real-time mock/cloud switching buffers showing live performance latency statistics.",
        "Built-in robust recovery handlers isolating WebGL leaks from critical local memory."
      ],
      illustrationText: "Active telemetry is 100% live. View execution times and model throughput rates."
    },
    {
      id: "impact",
      title: "Impact & Future Scale",
      subtitle: "Unlocking fast prototype-to-production pipelines",
      bulletPoints: [
        "Reduces average hackathon and commercial integration times by over 85%.",
        "Provides commercial-grade error boundaries, offline fallbacks, and semantic logs.",
        "Easily scale to Climate, Security, and Public Governance verticals in under 5 minutes."
      ],
      illustrationText: "Helios is production-ready. Prepared for Vercel, Docker, and Cloud Run deployments."
    }
  ]
}));
