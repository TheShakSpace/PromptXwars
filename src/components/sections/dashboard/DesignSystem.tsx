/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Palette, Type, Sliders, Layout, Table, LineChart, 
  HelpCircle, Info, CheckCircle, AlertTriangle, XCircle, 
  Code2, Terminal, ExternalLink, Eye, EyeOff, Search, 
  Lock, Plus, ChevronRight, ChevronDown, Play, Sparkles, 
  Cpu, Layers, Bot, Workflow, Brain, UploadCloud, 
  FileText, Check, Settings, RefreshCw, SlidersHorizontal, 
  Download, Moon, Sun, ArrowRight, User, Trash2, ShieldAlert
} from "lucide-react";
import { useMotion } from "../../../animations/MotionContext";
import { useOS } from "../../../contexts/OSContext";
import { ParticleSystem } from "../../../animations/ParticleSystem";
import { GlowSystem } from "../../../animations/GlowSystem";
import { FloatingElements } from "../../../animations/FloatingElements";
import { MagneticButton } from "../../../animations/MagneticButton";

// Custom type definitions
type DSTab = "tokens" | "components_one" | "components_two" | "data_viz" | "overlays_feedback" | "documentation";

interface ColorShade {
  hex: string;
  weight: number;
}

interface ColorFamily {
  name: string;
  base: string;
  shades: ColorShade[];
}

export function DesignSystem() {
  const { addNotification } = useOS();
  const { playAudio, setCursorType, reducedMotion } = useMotion();
  const [activeDSTab, setActiveDSTab] = useState<DSTab>("tokens");

  // Accessibility States
  const [accessibleFocusMode, setAccessibleFocusMode] = useState(false);
  const [simulatedReducedMotion, setSimulatedReducedMotion] = useState(false);

  // Sound triggering helper
  const triggerAudio = (type: "hover" | "click" | "notification" | "startup" | "workflow" | "robot") => {
    playAudio(type);
  };

  // State for dynamic interactive elements
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonSuccess, setButtonSuccess] = useState(false);

  // OTP inputs
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (value: string, idx: number) => {
    const nextVals = [...otpValues];
    nextVals[idx] = value.slice(-1);
    setOtpValues(nextVals);

    if (value && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  // Tag inputs
  const [tags, setTags] = useState(["AI-Core", "Helios", "DesignSystem", "Tailwind"]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      triggerAudio("hover");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
    triggerAudio("click");
  };

  // Slider state
  const [sliderVal, setSliderVal] = useState(45);
  const [confidenceMeter, setConfidenceMeter] = useState(88);

  // Toggle & Checklist
  const [toggleActive, setToggleActive] = useState(true);
  const [checkboxState, setCheckboxState] = useState({
    keyboardAccess: true,
    screenReader: false,
    contrastPass: true,
  });

  // Uploader system state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; progress: number; type: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach((file) => {
      const newFile = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        progress: 0,
        type: file.type,
      };
      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setUploadedFiles((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, progress: Math.min(100, currentProgress) } : f))
        );
        if (currentProgress >= 100) {
          clearInterval(interval);
          addNotification("Asset Dispatch Complete", `${file.name} integrated to system registry.`, "success");
          triggerAudio("notification");
        }
      }, 150);
    });
  };

  // Color generator (10 mathematical shades calculated for standard colors)
  const colors: ColorFamily[] = [
    {
      name: "Primary (Slate)",
      base: "#FFFFFF",
      shades: [
        { hex: "#FFFFFF", weight: 950 },
        { hex: "#F8FAFC", weight: 900 },
        { hex: "#F1F5F9", weight: 800 },
        { hex: "#E2E8F0", weight: 700 },
        { hex: "#CBD5E1", weight: 600 },
        { hex: "#94A3B8", weight: 500 },
        { hex: "#64748B", weight: 400 },
        { hex: "#475569", weight: 300 },
        { hex: "#334155", weight: 200 },
        { hex: "#1E293B", weight: 100 },
      ],
    },
    {
      name: "Accent (Lavender / Purple)",
      base: "#A855F7",
      shades: [
        { hex: "#FAF5FF", weight: 50 },
        { hex: "#F3E8FF", weight: 100 },
        { hex: "#E9D5FF", weight: 200 },
        { hex: "#D8B4FE", weight: 300 },
        { hex: "#C084FC", weight: 400 },
        { hex: "#A855F7", weight: 500 },
        { hex: "#9333EA", weight: 600 },
        { hex: "#7E22CE", weight: 700 },
        { hex: "#6B21A8", weight: 800 },
        { hex: "#581C87", weight: 900 },
      ],
    },
    {
      name: "Helios Blue (Cognitive Info)",
      base: "#3B82F6",
      shades: [
        { hex: "#EFF6FF", weight: 50 },
        { hex: "#DBEAFE", weight: 100 },
        { hex: "#BFDBFE", weight: 200 },
        { hex: "#93C5FD", weight: 300 },
        { hex: "#60A5FA", weight: 400 },
        { hex: "#3B82F6", weight: 500 },
        { hex: "#2563EB", weight: 600 },
        { hex: "#1D4ED8", weight: 700 },
        { hex: "#1E40AF", weight: 800 },
        { hex: "#1E3A8A", weight: 900 },
      ],
    },
    {
      name: "Success State (Emerald)",
      base: "#10B981",
      shades: [
        { hex: "#ECFDF5", weight: 50 },
        { hex: "#D1FAE5", weight: 100 },
        { hex: "#A7F3D0", weight: 200 },
        { hex: "#6EE7B7", weight: 300 },
        { hex: "#34D399", weight: 400 },
        { hex: "#10B981", weight: 500 },
        { hex: "#059669", weight: 600 },
        { hex: "#047857", weight: 700 },
        { hex: "#065F46", weight: 800 },
        { hex: "#064E3B", weight: 900 },
      ],
    },
    {
      name: "Critical Hazard (Rose / Error)",
      base: "#F43F5E",
      shades: [
        { hex: "#FFF1F2", weight: 50 },
        { hex: "#FFE4E6", weight: 100 },
        { hex: "#FECDD3", weight: 200 },
        { hex: "#FDA4AF", weight: 300 },
        { hex: "#FB7185", weight: 400 },
        { hex: "#F43F5E", weight: 500 },
        { hex: "#E11D48", weight: 600 },
        { hex: "#BE123C", weight: 700 },
        { hex: "#9F1239", weight: 800 },
        { hex: "#881337", weight: 900 },
      ],
    },
  ];

  // Table sorting & filtering
  const [dataSearch, setDataSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "status" | "latency" | "throughput">("latency");
  const [sortAsc, setSortAsc] = useState(true);

  const initialTableData = [
    { id: "M01", name: "Helios-Omni-Flash", status: "Active", latency: 82, throughput: "4.8K T/s", region: "us-central" },
    { id: "M02", name: "DeepMind-Agent-Reasoning", status: "Scaling", latency: 310, throughput: "1.2K T/s", region: "eu-west" },
    { id: "M03", name: "Helios-Core-Text", status: "Active", latency: 45, throughput: "12.4K T/s", region: "us-east" },
    { id: "M04", name: "Llama-3-Refined", status: "Idle", latency: 195, throughput: "2.5K T/s", region: "asia-east" },
    { id: "M05", name: "Helios-Vision-Pro", status: "Warning", latency: 420, throughput: "0.8K T/s", region: "us-central" },
  ];

  const handleSort = (field: "name" | "status" | "latency" | "throughput") => {
    setSortField(field);
    setSortAsc(!sortAsc);
    triggerAudio("hover");
  };

  const filteredTableData = initialTableData
    .filter((row) => row.name.toLowerCase().includes(dataSearch.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  // Modal State Trigger
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Streaming Text mock
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const fullText = "Analyzing prompt structures... Aligning cognitive parameters. Synaptic matrix successfully synthesized at 240 GFLOPs/s. Autopilot is active and operational.";

  const startStreaming = () => {
    if (isStreaming) return;
    setIsStreaming(true);
    setStreamingText("");
    triggerAudio("robot");
    
    let index = 0;
    const interval = setInterval(() => {
      setStreamingText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsStreaming(false);
        triggerAudio("notification");
      }
    }, 25);
  };

  return (
    <div className="w-full relative flex flex-col gap-8 pb-16">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="font-mono text-[9px] font-black text-[#A855F7] tracking-widest uppercase flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 animate-pulse" /> ATHENE COGNITIVE PLATFORM
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
            Design Language System <span className="text-xs text-white/40 font-mono tracking-wider lowercase px-2.5 py-1 rounded-full border border-white/10 bg-white/5 align-middle">v1.8.0</span>
          </h1>
          <p className="text-xs text-white/50 max-w-2xl mt-1.5 font-light leading-relaxed">
            The core design engine powering Athene OS. Unified modular physics, responsive high-contrast layouts, full keyboard accessibility, and procedural haptic-sound feedback.
          </p>
        </div>

        {/* Diagnostic Accessibility Controls */}
        <div className="flex items-center gap-2 bg-neutral-950/60 border border-white/5 p-2 rounded-xl backdrop-blur-md">
          <button
            onClick={() => {
              setAccessibleFocusMode(!accessibleFocusMode);
              triggerAudio("click");
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold tracking-wider transition-colors select-none cursor-pointer ${
              accessibleFocusMode ? "bg-[#3B82F6] text-white" : "bg-white/5 text-white/40 hover:text-white/70"
            }`}
          >
            FOCUS RING: {accessibleFocusMode ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => {
              setSimulatedReducedMotion(!simulatedReducedMotion);
              addNotification(
                "Motion Profile Modified",
                `Spring coefficients set to ${!simulatedReducedMotion ? "zero inertia" : "fluid physics"}.`,
                "info"
              );
              triggerAudio("workflow");
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold tracking-wider transition-colors select-none cursor-pointer ${
              simulatedReducedMotion ? "bg-[#EC4899] text-white" : "bg-white/5 text-white/40 hover:text-white/70"
            }`}
          >
            REDUCED MOTION: {simulatedReducedMotion ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Main Grid Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 select-none">
        {(
          [
            { id: "tokens", label: "DESIGN TOKENS", icon: Palette, color: "#A855F7" },
            { id: "components_one", label: "BUTTONS & INPUTS", icon: Sliders, color: "#10B981" },
            { id: "components_two", label: "CARDS & AI COMPONENT ENGINE", icon: Brain, color: "#4F8CFF" },
            { id: "data_viz", label: "DATA TABLES & CHARTS", icon: LineChart, color: "#3B82F6" },
            { id: "overlays_feedback", label: "OVERLAYS & FEEDBACK", icon: Layout, color: "#EC4899" },
            { id: "documentation", label: "SYSTEM DOCUMENTATION", icon: Code2, color: "#64748B" },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDSTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveDSTab(tab.id);
                triggerAudio("hover");
              }}
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-xl border font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-white/5 border-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.04)]"
                  : "border-transparent text-white/45 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: tab.color }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Interactive Tabs Panel Render Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDSTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* TAB 1: DESIGN TOKENS */}
            {activeDSTab === "tokens" && (
              <div className="flex flex-col gap-10">
                
                {/* Visual Tokens Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Grid System / Container Spacing card */}
                  <GlowSystem glowColor="168, 85, 247" className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40">
                    <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-bold">GRID & SPACING INDEX</span>
                    <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-1.5 mb-4">Responsive Boundary Sizing</h3>
                    
                    <div className="flex flex-col gap-3 font-mono text-[9px]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-white/40">
                        <span>TOKEN</span>
                        <span>VALUE</span>
                        <span>PIXELS</span>
                      </div>
                      <div className="flex items-center justify-between text-white/75">
                        <span className="text-white/40 font-bold">SPACING_XS</span>
                        <span className="text-[#A855F7]">0.25rem</span>
                        <span>4px</span>
                      </div>
                      <div className="flex items-center justify-between text-white/75">
                        <span className="text-white/40 font-bold">SPACING_SM</span>
                        <span className="text-[#A855F7]">0.5rem</span>
                        <span>8px</span>
                      </div>
                      <div className="flex items-center justify-between text-white/75">
                        <span className="text-white/40 font-bold">SPACING_MD</span>
                        <span className="text-[#A855F7]">0.75rem</span>
                        <span>12px</span>
                      </div>
                      <div className="flex items-center justify-between text-white/75">
                        <span className="text-white/40 font-bold">SPACING_LG</span>
                        <span className="text-[#A855F7]">1rem</span>
                        <span>16px</span>
                      </div>
                      <div className="flex items-center justify-between text-white/75">
                        <span className="text-white/40 font-bold">SPACING_XL</span>
                        <span className="text-[#A855F7]">1.25rem</span>
                        <span>20px</span>
                      </div>
                      <div className="flex items-center justify-between text-white/75">
                        <span className="text-white/40 font-bold">SPACING_XXL</span>
                        <span className="text-[#A855F7]">1.5rem</span>
                        <span>24px</span>
                      </div>
                    </div>

                    {/* Interactive Spacing Slider Visualizer */}
                    <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[8px] text-white/40">DYNAMIC SPACER SCALE</span>
                        <span className="font-mono text-[8px] text-[#A855F7] font-bold">{(sliderVal / 10).toFixed(1)}rem</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="80"
                        value={sliderVal}
                        onChange={(e) => setSliderVal(Number(e.target.value))}
                        className="w-full accent-[#A855F7] cursor-pointer"
                      />
                      <div 
                        className="bg-gradient-to-r from-[#A855F7]/30 to-[#3B82F6]/30 rounded mt-3 transition-all duration-150"
                        style={{ height: `${sliderVal}px` }}
                      />
                    </div>
                  </GlowSystem>

                  {/* Typography Scales */}
                  <GlowSystem glowColor="59, 130, 246" className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 lg:col-span-2">
                    <span className="font-mono text-[8px] text-[#3B82F6] tracking-wider uppercase font-bold">TYPOGRAPHY INDEX</span>
                    <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-1.5 mb-4">Fluid Scale Rendering</h3>

                    <div className="flex flex-col gap-4 font-sans">
                      <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-[8px] text-white/40">TYPE SCALE LEVEL</span>
                        <span className="font-mono text-[8px] text-white/40">RENDER MOCK</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="font-mono text-[9px] text-white/40">
                          <p className="font-bold text-white/80">Display XXL</p>
                          <p>font-sans text-5xl md:text-7xl font-black</p>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-sans font-black tracking-tighter text-white uppercase select-all">
                          ATHENE
                        </h1>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="font-mono text-[9px] text-white/40">
                          <p className="font-bold text-white/80">Heading XL</p>
                          <p>font-sans text-xl md:text-2xl font-semibold</p>
                        </div>
                        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white/90">
                          Helios Core Autopilot
                        </h2>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="font-mono text-[9px] text-white/40">
                          <p className="font-bold text-white/80">Body Medium</p>
                          <p>font-sans text-xs md:text-sm text-white/60</p>
                        </div>
                        <p className="text-xs text-white/60 max-w-xs text-left leading-relaxed">
                          Athene OS deploys standard Inter sans-serif typeface for interface telemetry blocks.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="font-mono text-[9px] text-white/40">
                          <p className="font-bold text-white/80">Code & Mono</p>
                          <p>font-mono text-[10px] text-purple-400</p>
                        </div>
                        <span className="font-mono text-[10px] text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded border border-purple-900/50">
                          systemctl restart helios
                        </span>
                      </div>
                    </div>
                  </GlowSystem>
                </div>

                {/* 10 Shades for Every Color Family */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <div>
                      <span className="font-mono text-[8px] text-[#10B981] tracking-wider uppercase font-bold">10-LEVEL PALETTES</span>
                      <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-1">Mathematical Color Shades</h3>
                    </div>
                    <span className="font-mono text-[8px] text-white/30 hidden sm:inline">SATURATION SCALES</span>
                  </div>

                  <div className="flex flex-col gap-6">
                    {colors.map((colorFam) => (
                      <div key={colorFam.name} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs font-bold text-white/80">{colorFam.name}</span>
                          <span className="font-mono text-[8px] text-white/40 uppercase">BASE: {colorFam.base}</span>
                        </div>
                        
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                          {colorFam.shades.map((shade, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                navigator.clipboard.writeText(shade.hex);
                                addNotification("Hex Copied", `Value ${shade.hex} added to copy clipboard.`, "info");
                                triggerAudio("click");
                              }}
                              className="group relative h-14 rounded-xl border border-white/5 cursor-pointer flex flex-col justify-end p-2 transition-all hover:scale-105 hover:border-white/25 shadow-md overflow-hidden select-none"
                              style={{ backgroundColor: shade.hex }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className="font-mono text-[8px] text-black mix-blend-difference font-bold group-hover:hidden">
                                {shade.weight}
                              </span>
                              <span className="font-mono text-[7px] text-white font-bold tracking-tight absolute inset-x-1 bottom-1 hidden group-hover:block truncate">
                                {shade.hex}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radius, Elevation, Blur & Borders */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-[10px]">
                  
                  {/* Radius */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-neutral-950/20 flex flex-col justify-between h-44">
                    <div>
                      <span className="text-[#A855F7] font-bold">RADIUS TOKENS</span>
                      <p className="text-white/40 text-[9px] mt-1">Conforming core container roundedness</p>
                    </div>
                    <div className="flex gap-2.5 mt-4">
                      <div className="w-10 h-10 rounded-sm border border-white/20 bg-white/5 flex items-center justify-center text-[7px] text-white/40">SM</div>
                      <div className="w-10 h-10 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center text-[7px] text-white/40">MD</div>
                      <div className="w-10 h-10 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-[7px] text-white/40">2XL</div>
                      <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-[7px] text-white/40">FULL</div>
                    </div>
                  </div>

                  {/* Z-Index Hierarchy */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-neutral-950/20 flex flex-col justify-between h-44">
                    <div>
                      <span className="text-[#3B82F6] font-bold">Z-INDEX TOKENS</span>
                      <p className="text-white/40 text-[9px] mt-1">Spatial interface layout elevation layers</p>
                    </div>
                    <div className="flex flex-col gap-1 text-[9px]">
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">z-50</span><span className="text-white/80 font-bold">Overlays / Cursors</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">z-40</span><span className="text-white/80 font-bold">Navigation Docks</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">z-30</span><span className="text-white/80 font-bold">Drawers & Sidebars</span></div>
                    </div>
                  </div>

                  {/* Shadow elevation */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-neutral-950/20 flex flex-col justify-between h-44">
                    <div>
                      <span className="text-[#10B981] font-bold">SHADOW ELEVATION</span>
                      <p className="text-white/40 text-[9px] mt-1">Depth modeling & atmospheric shadows</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-12 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner flex items-center justify-center text-[8px] text-white/30">INNER</div>
                      <div className="flex-1 h-12 rounded-xl bg-white/[0.02] border border-white/5 shadow-lg flex items-center justify-center text-[8px] text-white/30">ELEVATED</div>
                      <div className="flex-1 h-12 rounded-xl bg-[#A855F7]/5 border border-[#A855F7]/10 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center justify-center text-[8px] text-[#A855F7]">GLOW</div>
                    </div>
                  </div>

                  {/* Backdrop Blur */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-neutral-950/20 flex flex-col justify-between h-44">
                    <div>
                      <span className="text-[#EC4899] font-bold">BACKDROP BLURS</span>
                      <p className="text-white/40 text-[9px] mt-1">Refraction lens filters & privacy filters</p>
                    </div>
                    <div className="flex gap-2 font-mono text-[8px]">
                      <div className="flex-1 h-10 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/60">blur-sm (4px)</div>
                      <div className="flex-1 h-10 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white/60">blur-xl (24px)</div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: BUTTONS & INPUT SYSTEMS */}
            {activeDSTab === "components_one" && (
              <div className="flex flex-col gap-10">
                
                {/* BUTTONS SYSTEM SECTION */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40">
                  <div className="border-b border-white/5 pb-4 mb-6">
                    <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-bold">INTERACTIVE TRIGGERS</span>
                    <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-1">Button System Playground</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Buttons Families Column */}
                    <div className="flex flex-col gap-4">
                      <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider">CORE BRAND VARIATIONS</span>
                      
                      <button
                        onClick={() => triggerAudio("click")}
                        className="w-full py-3 px-5 rounded-xl bg-white text-black font-sans font-black text-xs uppercase tracking-wider shadow-xl hover:bg-neutral-200 transition-colors cursor-none interactive-cursor"
                        onMouseEnter={() => setCursorType("pointer")}
                        onMouseLeave={() => setCursorType("default")}
                      >
                        Primary Action
                      </button>

                      <button
                        onClick={() => triggerAudio("click")}
                        className="w-full py-3 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans font-semibold text-xs uppercase tracking-wider transition-all cursor-none interactive-cursor"
                        onMouseEnter={() => setCursorType("pointer")}
                        onMouseLeave={() => setCursorType("default")}
                      >
                        Secondary Frame
                      </button>

                      <button
                        onClick={() => triggerAudio("click")}
                        className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white font-sans font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-none interactive-cursor"
                        onMouseEnter={() => setCursorType("pointer")}
                        onMouseLeave={() => setCursorType("default")}
                      >
                        Gradient Catalyst
                      </button>
                    </div>

                    {/* Specialized & Interactive Buttons Column */}
                    <div className="flex flex-col gap-4">
                      <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider">SPECIALIZED PHYSICS</span>
                      
                      {/* Premium Magnetic Button */}
                      <MagneticButton
                        className="w-full py-3 px-5 rounded-xl border border-white/5 bg-[#A855F7]/10 hover:bg-[#A855F7]/20 text-[#A855F7] font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 outline-none shadow-md"
                        strength={0.5}
                      >
                        <Sparkles className="w-4 h-4 text-[#A855F7]" /> Magnetic Orbiter
                      </MagneticButton>

                      {/* Loading & Async Trigger Mock */}
                      <button
                        disabled={buttonLoading || buttonSuccess}
                        onClick={() => {
                          setButtonLoading(true);
                          triggerAudio("workflow");
                          setTimeout(() => {
                            setButtonLoading(false);
                            setButtonSuccess(true);
                            triggerAudio("notification");
                            setTimeout(() => setButtonSuccess(false), 2000);
                          }, 1800);
                        }}
                        className={`w-full py-3 px-5 rounded-xl border font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all select-none cursor-none interactive-cursor ${
                          buttonSuccess
                            ? "bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]"
                            : "bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/5"
                        }`}
                        onMouseEnter={() => setCursorType("pointer")}
                        onMouseLeave={() => setCursorType("default")}
                      >
                        {buttonLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                            <span>SYNCHRONIZING CORE...</span>
                          </>
                        ) : buttonSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>SUCCESS VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-white/50" />
                            <span>TRIGGER ASYNC PROCESS</span>
                          </>
                        )}
                      </button>

                      {/* Critical Hazard Alert Button */}
                      <button
                        onClick={() => {
                          triggerAudio("click");
                          addNotification("Critical Trigger Locked", "Manual clearance key is required to dispatch core warp protocols.", "error");
                        }}
                        className="w-full py-3 px-5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-sans font-black text-xs uppercase tracking-wider transition-all cursor-none interactive-cursor flex items-center justify-center gap-2"
                        onMouseEnter={() => setCursorType("pointer")}
                        onMouseLeave={() => setCursorType("default")}
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" /> Dispatch Core Warp
                      </button>
                    </div>

                    {/* Micro-Interaction / States preview */}
                    <div className="flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                      <div>
                        <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider block mb-2">MICRO-INTERACTION NOTES</span>
                        <p className="font-mono text-[8.5px] text-white/50 leading-relaxed font-light">
                          Our triggers contain native reactive audio feedback loop hooks that procedurally synth analog click ticks.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <button disabled className="flex-1 py-2 px-3 rounded-lg border border-white/5 text-white/20 text-[9px] font-mono cursor-not-allowed">DISABLED</button>
                        <button className="flex-1 py-2 px-3 rounded-lg border border-white/25 bg-white/5 text-white text-[9px] font-mono outline-none shadow-md ring-2 ring-[#3B82F6]/50">FOCUS MODE</button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* INPUTS SYSTEM SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Inputs Fields Form column */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 lg:col-span-2 flex flex-col gap-5">
                    <div className="border-b border-white/5 pb-3.5">
                      <span className="font-mono text-[8px] text-[#10B981] tracking-wider uppercase font-bold">DATA CAPTURE FIELDS</span>
                      <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Unified Input Sandbox</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Standard text input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[8px] text-white/40 uppercase font-black tracking-widest">USER UNIQUE IDENTITY</label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="helios_operator_a5"
                            className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#A855F7]/80 focus:bg-[#A855F7]/[0.01] rounded-xl py-2.5 pl-9 pr-4 text-xs text-white outline-none transition-all placeholder:text-white/20"
                          />
                        </div>
                      </div>

                      {/* Password input with visual locks */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[8px] text-white/40 uppercase font-black tracking-widest">ACCESS CODE DECRYPTION</label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            defaultValue="masterkey_system"
                            className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-[#A855F7]/80 focus:bg-[#A855F7]/[0.01] rounded-xl py-2.5 pl-9 pr-10 text-xs text-white outline-none transition-all placeholder:text-white/20"
                          />
                          <button onClick={() => triggerAudio("click")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white cursor-pointer select-none">
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Tags list interactive block */}
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="font-mono text-[8px] text-white/40 uppercase font-black tracking-widest">COGNITIVE TAG INDEXING (PRESS ENTER)</label>
                        <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-white/10 bg-white/[0.01] min-h-11">
                          {tags.map((tag, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-mono text-[9px] text-white/85">
                              {tag}
                              <button onClick={() => removeTag(idx)} className="text-white/30 hover:text-rose-400 font-bold ml-1 cursor-pointer">×</button>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder="Add tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTag()}
                            className="bg-transparent text-xs text-white outline-none border-none py-1 px-1 max-w-[120px]"
                          />
                        </div>
                      </div>

                      {/* 6-Digit Verification OTP Code */}
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="font-mono text-[8px] text-white/40 uppercase font-black tracking-widest">OTP AUTHENTICATION CHANNEL</label>
                        <div className="flex justify-between gap-2.5">
                          {otpValues.map((val, idx) => (
                            <input
                              key={idx}
                              ref={(el) => { otpRefs.current[idx] = el; }}
                              type="text"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleOtpChange(e.target.value, idx)}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace" && !val && idx > 0) {
                                  otpRefs.current[idx - 1]?.focus();
                                }
                              }}
                              className="w-full h-11 text-center bg-white/[0.02] border border-white/10 rounded-lg text-sm font-mono font-bold text-[#A855F7] outline-none focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/20 transition-all"
                            />
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Drag-Drop Uploader System panel */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col justify-between gap-4">
                    <div>
                      <div className="border-b border-white/5 pb-3 mb-4">
                        <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-bold">MEDIA INGESTION</span>
                        <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Asset Upload Engine</h3>
                      </div>

                      {/* Drop area */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all min-h-36 relative select-none ${
                          isDragging
                            ? "border-[#A855F7] bg-[#A855F7]/5"
                            : "border-white/10 hover:border-white/20 hover:bg-white/[0.01]"
                        }`}
                      >
                        <UploadCloud className={`w-8 h-8 text-white/20 ${isDragging ? "animate-bounce text-[#A855F7]" : ""}`} />
                        <span className="font-mono text-[9px] font-bold text-white/70">DRAG & DROP SYSTEM METRICS</span>
                        <p className="text-[8px] text-white/35 max-w-[160px] leading-relaxed">
                          Accepts PDF, JSON, CSV files up to 24MB. Auto compiles model synapses.
                        </p>
                      </div>
                    </div>

                    {/* Progress upload queue */}
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2 max-h-32 overflow-y-auto pr-1 no-scrollbar">
                        {uploadedFiles.map((f, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.01] flex flex-col gap-1.5 font-mono text-[8px]">
                            <div className="flex items-center justify-between text-white/60">
                              <span className="truncate max-w-[120px] font-bold text-white/80">{f.name}</span>
                              <span>{f.size}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#A855F7] to-[#3B82F6] transition-all duration-150" style={{ width: `${f.progress}%` }} />
                              </div>
                              <span className="text-[#A855F7] font-bold">{f.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: CARDS & AI OPERATING WORKFLOWS */}
            {activeDSTab === "components_two" && (
              <div className="flex flex-col gap-8">
                
                {/* AI Interactive Micro Component Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Model Card / Selector */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 flex flex-col justify-between h-48 select-none">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Bot className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-mono text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full">ACTIVE</span>
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-white uppercase text-xs">HELIOS OMNI FLASH</h4>
                      <p className="font-mono text-[8px] text-white/35 mt-1 leading-relaxed">High fidelity text, visual, and analytical token compilation model.</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2 font-mono text-[8px] text-white/45">
                      <span>COST: $0.0015/1K</span>
                      <span className="text-emerald-400 font-bold">99.8% READY</span>
                    </div>
                  </div>

                  {/* Streaming Output Optimizer with simulated live terminal output */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 flex flex-col justify-between h-48 lg:col-span-2 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 z-10">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                        <span className="font-mono text-[8px] text-white/60 tracking-wider">COGNITIVE COMPILING TELEMETRY</span>
                      </div>
                      <button
                        onClick={startStreaming}
                        className="font-mono text-[7.5px] font-bold px-2 py-1 bg-white/5 border border-white/10 text-white/70 hover:text-white rounded cursor-pointer select-none"
                      >
                        {isStreaming ? "PROCESSING..." : "TEST STREAM"}
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] text-[#A855F7] min-h-20 leading-relaxed pr-2 z-10 whitespace-pre-wrap">
                      {streamingText || "Click 'TEST STREAM' to trigger the procedural terminal typewriter output system simulated live at 240 GFLOPs/s."}
                    </div>

                    {/* Faint ambient grid background layer */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.03)_0%,transparent_80%)] pointer-events-none" />
                  </div>

                  {/* Confidence Meter Widget */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 flex flex-col justify-between h-48 select-none">
                    <span className="font-mono text-[8px] text-white/40 uppercase">EVALUATION METRICS</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-sans font-black text-3xl text-white">{confidenceMeter}%</span>
                      <span className="font-mono text-[9px] text-[#10B981] font-bold">▲ CORE CONFIDENCE</span>
                    </div>
                    <div className="mt-4 flex flex-col gap-1">
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={confidenceMeter}
                        onChange={(e) => setConfidenceMeter(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between font-mono text-[7px] text-white/20 mt-1">
                        <span>MIN: 50%</span>
                        <span>MAX: 100%</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* AI Agents Workflow Canvas & Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Reasoning Timeline View */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-4">
                    <div className="border-b border-white/5 pb-3">
                      <span className="font-mono text-[8px] text-[#EC4899] tracking-wider uppercase font-bold">COGNITIVE PATHWAY</span>
                      <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Reasoning Timeline</h3>
                    </div>

                    <div className="flex flex-col gap-4 relative pl-4 border-l border-white/10">
                      
                      {/* Node 1 */}
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EC4899] absolute -left-[21.5px] top-1 border border-black shadow-[0_0_8px_#EC4899]" />
                        <span className="font-mono text-[7px] text-white/30 font-bold block">STEP 01 // SENTENCE PARSE</span>
                        <p className="text-[10px] text-white/70 font-sans mt-0.5 font-light leading-relaxed">Analyzing semantic user intents. Intent parsed as Design System Lookup.</p>
                      </div>

                      {/* Node 2 */}
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] absolute -left-[21.5px] top-1 border border-black shadow-[0_0_8px_#3B82F6]" />
                        <span className="font-mono text-[7px] text-white/30 font-bold block">STEP 02 // VECTOR EXTRACTION</span>
                        <p className="text-[10px] text-white/70 font-sans mt-0.5 font-light leading-relaxed">Querying vectorized model database parameters for design layouts.</p>
                      </div>

                      {/* Node 3 */}
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] absolute -left-[21.5px] top-1 border border-black shadow-[0_0_8px_#10B981]" />
                        <span className="font-mono text-[7px] text-white/30 font-bold block">STEP 03 // MATRIX COMPILATION</span>
                        <p className="text-[10px] text-white/70 font-sans mt-0.5 font-light leading-relaxed">Design language parameters synthesized in 0.04s. System OK.</p>
                      </div>

                    </div>
                  </div>

                  {/* Core Prompt Optimizer */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 lg:col-span-2 flex flex-col justify-between gap-4">
                    <div>
                      <div className="border-b border-white/5 pb-3 mb-4">
                        <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-bold">SYNAPSE OPTIMIZATION</span>
                        <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Structured Prompt Optimizer</h3>
                      </div>

                      <div className="flex flex-col gap-4 font-mono text-[9px]">
                        <div className="p-3 rounded-lg border border-red-500/10 bg-red-950/10 flex flex-col gap-1.5">
                          <span className="font-bold text-red-400">UNOPTIMIZED INPUT:</span>
                          <p className="text-white/60 font-light">"make some premium cards for my dashboard that look very beautiful"</p>
                        </div>

                        <div className="p-3 rounded-lg border border-emerald-500/10 bg-emerald-950/10 flex flex-col gap-1.5">
                          <span className="font-bold text-emerald-400">OPTIMIZED HYPER-SYNAPSE DISPATCH:</span>
                          <p className="text-white/80 font-light">"Build an array of glassmorphic dashboard panels conforming to strict Material You color shade tokens. Apply micro-interactive magnetic coordinates on hover elements."</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-2 font-mono text-[8px] text-white/40">
                      <span>TOKEN EFFICIENCY: +42% SAVED</span>
                      <span className="text-[#A855F7] font-bold">AUTO RE-WRITER ON</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: DATA TABLES & ANIMATED CHARTS */}
            {activeDSTab === "data_viz" && (
              <div className="flex flex-col gap-8">
                
                {/* Premium Interactive Data Table */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4 select-none">
                    <div>
                      <span className="font-mono text-[8px] text-[#3B82F6] tracking-wider uppercase font-bold">SYSTEM METRICS TELEMETRY</span>
                      <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Autonomous Core Telemetry Table</h3>
                    </div>

                    {/* Table Filters Search */}
                    <div className="relative max-w-xs">
                      <Search className="w-3.5 h-3.5 text-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filter system models..."
                        value={dataSearch}
                        onChange={(e) => {
                          setDataSearch(e.target.value);
                          triggerAudio("hover");
                        }}
                        className="bg-white/[0.02] border border-white/10 focus:border-[#3B82F6] rounded-xl pl-8.5 pr-4 py-2 text-[10px] text-white outline-none w-52 placeholder:text-white/20 font-mono"
                      />
                    </div>
                  </div>

                  {/* Scrollable table container */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-white/40 uppercase text-[8px] select-none">
                          <th className="py-3 px-4">CORE ID</th>
                          <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("name")}>
                            MODEL NAME {sortField === "name" && (sortAsc ? "▲" : "▼")}
                          </th>
                          <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("status")}>
                            RUN STATUS {sortField === "status" && (sortAsc ? "▲" : "▼")}
                          </th>
                          <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort("latency")}>
                            LATENCY {sortField === "latency" && (sortAsc ? "▲" : "▼")}
                          </th>
                          <th className="py-3 px-4 text-right">THROUGHPUT</th>
                          <th className="py-3 px-4 text-center">CLUSTER</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTableData.map((row) => (
                          <tr key={row.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                            <td className="py-3 px-4 font-bold text-white/40">{row.id}</td>
                            <td className="py-3 px-4 text-white font-semibold">{row.name}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                                row.status === "Active"
                                  ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400"
                                  : row.status === "Scaling"
                                  ? "bg-blue-950/30 border-blue-900/60 text-blue-400"
                                  : row.status === "Warning"
                                  ? "bg-rose-950/30 border-rose-900/60 text-rose-400"
                                  : "bg-neutral-900 border-white/10 text-white/40"
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  row.status === "Active"
                                    ? "bg-emerald-400 animate-pulse"
                                    : row.status === "Scaling"
                                    ? "bg-blue-400 animate-bounce"
                                    : row.status === "Warning"
                                    ? "bg-rose-400 animate-ping"
                                    : "bg-white/20"
                                }`} />
                                {row.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-white/80 font-bold">{row.latency} ms</td>
                            <td className="py-3 px-4 text-right text-[#3B82F6] font-bold">{row.throughput}</td>
                            <td className="py-3 px-4 text-center text-white/40 font-light">{row.region}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer */}
                  <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4 text-white/30 font-mono text-[8px]">
                    <span>SHOWING {filteredTableData.length} OF 5 CORE NODES</span>
                    <button
                      onClick={() => {
                        triggerAudio("notification");
                        addNotification("Export complete", "Operational schema exported to CSV schema structure.", "success");
                      }}
                      className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center gap-1 cursor-pointer select-none"
                    >
                      <Download className="w-3 h-3 text-white" /> EXPORT EXCEL SCHEMA
                    </button>
                  </div>
                </div>

                {/* Animated SVG Performance Chart Visualizers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
                  
                  {/* Dynamic Area Chart Simulation */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#050505]/40 flex flex-col justify-between h-72">
                    <div className="border-b border-white/5 pb-2">
                      <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-bold">LATENCY PROFILE OVER TIME</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider mt-0.5">Synchronized Signal Latency</h4>
                    </div>

                    {/* Handmade fluid vector wave SVG with elegant loading slide */}
                    <div className="flex-1 w-full flex items-end justify-center relative mt-4 h-40">
                      <svg className="w-full h-full text-purple-500 overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.0)" />
                          </linearGradient>
                        </defs>
                        
                        {/* Shimmer Area Path */}
                        <motion.path
                          d="M 0 100 Q 50 20, 100 80 T 200 40 T 300 90 T 400 10 L 400 120 L 0 120 Z"
                          fill="url(#chartGradient)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        {/* Stroke Path line */}
                        <motion.path
                          d="M 0 100 Q 50 20, 100 80 T 200 40 T 300 90 T 400 10"
                          fill="none"
                          stroke="rgba(168, 85, 247, 0.9)"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.8, ease: "easeInOut" }}
                        />

                        {/* Interactive dots */}
                        <circle cx="100" cy="80" r="4.5" fill="#A855F7" stroke="white" strokeWidth="1.5" />
                        <circle cx="200" cy="40" r="4.5" fill="#A855F7" stroke="white" strokeWidth="1.5" />
                        <circle cx="300" cy="90" r="4.5" fill="#A855F7" stroke="white" strokeWidth="1.5" />
                      </svg>

                      {/* HUD Overlays */}
                      <div className="absolute top-2 left-4 font-mono text-[8px] text-white/50 bg-black/50 p-2 border border-white/5 rounded-lg">
                        <span className="font-bold text-[#A855F7]">NODE_LATENCY_PEAK:</span> 82ms at T+24s
                      </div>
                    </div>

                    <div className="flex justify-between font-mono text-[7px] text-white/20 mt-2 border-t border-white/5 pt-2">
                      <span>T+0s</span>
                      <span>T+10s</span>
                      <span>T+20s</span>
                      <span>T+30s</span>
                      <span>T+40s</span>
                    </div>
                  </div>

                  {/* Progress Ring Performance metric */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#050505]/40 flex flex-col justify-between h-72">
                    <div className="border-b border-white/5 pb-2">
                      <span className="font-mono text-[8px] text-[#10B981] tracking-wider uppercase font-bold">CORE ALLOCATION PROFILE</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider mt-0.5">Memory Compression Ratio</h4>
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-4 mt-4">
                      
                      {/* Breathtaking circular progress ring */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full rotate-[-90deg]">
                          <circle cx="64" cy="64" r="54" className="stroke-white/5 stroke-[8] fill-none" />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="54"
                            className="stroke-[#10B981] stroke-[8] fill-none"
                            strokeDasharray="339.29"
                            initial={{ strokeDashoffset: 339.29 }}
                            animate={{ strokeDashoffset: 339.29 - (339.29 * 0.78) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        <div className="absolute flex flex-col items-center">
                          <span className="font-sans font-black text-2xl text-white">78%</span>
                          <span className="font-mono text-[6.5px] text-white/40 uppercase tracking-widest">SAVED CORES</span>
                        </div>
                      </div>

                      {/* Detail metrics list */}
                      <div className="font-mono text-[9px] flex flex-col gap-2 bg-neutral-950/40 p-4 border border-white/5 rounded-xl">
                        <div className="flex justify-between w-40 border-b border-white/5 pb-1"><span className="text-white/40">DURABLE STORAGE</span><span className="text-white/80 font-bold">124.8 GB</span></div>
                        <div className="flex justify-between w-40 border-b border-white/5 pb-1"><span className="text-white/40">CACHED VECTORS</span><span className="text-white/80 font-bold">4.2M ITEMS</span></div>
                        <div className="flex justify-between w-40"><span className="text-[#10B981]">SYSTEM COMPRESS</span><span className="text-[#10B981] font-bold">4.8x LEVEL</span></div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 5: OVERLAYS, NAVIGATION & FEEDBACK */}
            {activeDSTab === "overlays_feedback" && (
              <div className="flex flex-col gap-10">
                
                {/* Feedback Toast & Alert System */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40">
                  <div className="border-b border-white/5 pb-3 mb-6">
                    <span className="font-mono text-[8px] text-[#EC4899] tracking-wider uppercase font-bold">SYSTEM BROADCAST FEEDBACK</span>
                    <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Diagnostic Notification System</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Trigger Toasts */}
                    <div className="flex flex-col gap-3.5">
                      <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider">FIRE REALTIME TOASTS</span>
                      
                      <button
                        onClick={() => {
                          triggerAudio("notification");
                          addNotification("Process Dispatched", "Helios core model updated to version 1.8.0 successfully.", "success");
                        }}
                        className="py-3.5 px-4 rounded-xl border border-emerald-500/10 bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-400 font-mono text-[10px] font-bold text-left flex items-center justify-between cursor-pointer select-none"
                      >
                        <span>TRIGGER SUCCESS MESSAGE</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      </button>

                      <button
                        onClick={() => {
                          triggerAudio("click");
                          addNotification("Connection Refused", "Database socket connection timed out after 3000ms retry limit.", "error");
                        }}
                        className="py-3.5 px-4 rounded-xl border border-rose-500/10 bg-rose-950/10 hover:bg-rose-950/20 text-rose-400 font-mono text-[10px] font-bold text-left flex items-center justify-between cursor-pointer select-none"
                      >
                        <span>TRIGGER CRITICAL FAULT</span>
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      </button>

                      <button
                        onClick={() => {
                          triggerAudio("hover");
                          addNotification("Autopilot Calibration", "The autopilot core model is adjusting to high throughput rates.", "warning");
                        }}
                        className="py-3.5 px-4 rounded-xl border border-yellow-500/10 bg-yellow-950/10 hover:bg-yellow-950/20 text-yellow-400 font-mono text-[10px] font-bold text-left flex items-center justify-between cursor-pointer select-none"
                      >
                        <span>TRIGGER CORE NOTICE</span>
                        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                      </button>
                    </div>

                    {/* Alert boxes templates */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                      <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider">IN-PAGE BROADCAST BANNER ALERTS</span>
                      
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex gap-3 text-white/70">
                        <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1 font-sans text-xs">
                          <span className="font-bold text-white uppercase text-[9px] font-mono tracking-wider">SYSTEM MAINTENANCE INTERVAL</span>
                          <p className="font-light leading-relaxed">
                            The Helios cognitive network cluster is scheduled for routine performance calibration on Saturday, July 11th, at 04:00 UTC. No client disruptions are expected.
                          </p>
                        </div>
                      </div>

                      {/* Skeleton loader animation mock */}
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-2.5">
                        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">SKELETON COMPONENT LOADERS</span>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse shrink-0" />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="w-1/3 h-2 bg-white/5 rounded animate-pulse" />
                            <div className="w-3/4 h-2 bg-white/5 rounded animate-pulse" />
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Overlays / Modal Drawer Trigger sandbox */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                  
                  {/* Modal triggering showcase */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col justify-between gap-4 h-48">
                    <div>
                      <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-bold">SPATIAL MODAL LAYER</span>
                      <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Central Overlay Window</h3>
                      <p className="text-[10px] text-white/45 font-light mt-1.5 leading-relaxed">
                        Centrally anchored immersive backdrop panel with auto glass refractive blur filter.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsOverlayOpen(true);
                        triggerAudio("notification");
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#A855F7]/10 hover:bg-[#A855F7]/25 border border-[#A855F7]/20 text-[#A855F7] font-mono text-[10px] font-bold uppercase transition-all cursor-pointer text-center"
                    >
                      OPEN SPATIAL OVERLAY WINDOW
                    </button>
                  </div>

                  {/* Drawer triggering showcase */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col justify-between gap-4 h-48">
                    <div>
                      <span className="font-mono text-[8px] text-[#EC4899] tracking-wider uppercase font-bold">SLIDE DRAWER MODULE</span>
                      <h3 className="text-sm font-black text-white/90 uppercase tracking-wider mt-0.5">Lateral Dock Drawer</h3>
                      <p className="text-[10px] text-white/45 font-light mt-1.5 leading-relaxed">
                        Side-mounted modular tray that slides on structural springs, preserving viewport proportions.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(true);
                        triggerAudio("notification");
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#EC4899]/10 hover:bg-[#EC4899]/25 border border-[#EC4899]/20 text-[#EC4899] font-mono text-[10px] font-bold uppercase transition-all cursor-pointer text-center"
                    >
                      SLIDE DRAWER OPEN
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 6: COMPREHENSIVE DOCUMENTATION & ACCESS PROTOCOLS */}
            {activeDSTab === "documentation" && (
              <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-neutral-950/40 flex flex-col gap-6">
                
                <div className="border-b border-white/5 pb-4">
                  <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-bold">SYSTEM HANDBOOK</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mt-0.5">Athene Design Architecture Rules</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[9px] text-white/60 leading-relaxed font-light">
                  
                  {/* Philosophy */}
                  <div className="flex flex-col gap-2.5">
                    <span className="font-bold text-white text-[10px] uppercase tracking-wider border-b border-white/5 pb-1">Philosophical Craft</span>
                    <p>
                      Athene avoids decorative UI slop. Our borders correspond directly to hardware compilation modules. Design cues are delivered via micro-interactive sound ticks and spring coordinate shifts.
                    </p>
                  </div>

                  {/* Accessibility Standards */}
                  <div className="flex flex-col gap-2.5">
                    <span className="font-bold text-white text-[10px] uppercase tracking-wider border-b border-white/5 pb-1">Accessibility (A11Y)</span>
                    <p>
                      All interactives contain custom focus indicators. Text color weight ratios pass strict WCAG AA contrast rules (4.5:1 ratio minimum). Reduced motion switches throttle GSAP timelines immediately.
                    </p>
                  </div>

                  {/* Operational Tokens Export */}
                  <div className="flex flex-col gap-2.5">
                    <span className="font-bold text-white text-[10px] uppercase tracking-wider border-b border-white/5 pb-1">Telemetry Core API</span>
                    <p>
                      Our tokens are fully compiled to static variables and exported globally inside <code className="text-[#A855F7]">src/theme/constants.ts</code> for zero runtime re-evaluation lag.
                    </p>
                  </div>

                </div>

                {/* Live Code Token Config Preview */}
                <div className="mt-4 p-4 rounded-xl border border-white/5 bg-black/60 relative">
                  <div className="absolute right-3 top-3">
                    <span className="font-mono text-[7px] text-white/20 font-bold bg-white/5 px-2 py-1 rounded">JSON EXPORTABLE</span>
                  </div>
                  <pre className="font-mono text-[9px] text-purple-300 overflow-x-auto select-all p-1 whitespace-pre-wrap leading-relaxed">
{`{
  "METRICS": {
    "VERSION": "1.8.0",
    "PRIMARY_BACKGROUND": "#050505",
    "HELIOS_ACCENT": "#A855F7",
    "REDUCED_MOTION_SPRING_COEFFICIENTS": { "stiffness": 0, "damping": 0 },
    "ATHENE_ELEVATION_HIERARCHY_Z": [50, 40, 30, 20, 10]
  }
}`}
                  </pre>
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* OVERLAYS BACKDROP TRIGGERS */}
      
      {/* 1. Immersive Overlay Modal Window */}
      <AnimatePresence>
        {isOverlayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOverlayOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-2xl p-6 select-none shadow-[0_24px_60px_rgba(0,0,0,0.9)] z-10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
                <span className="font-mono text-[8px] text-[#A855F7] tracking-wider uppercase font-black">SECURITY CHALLENGE</span>
                <button onClick={() => setIsOverlayOpen(false)} className="text-white/40 hover:text-white font-bold font-mono text-xs cursor-pointer">×</button>
              </div>

              <h4 className="font-sans font-black text-base text-white uppercase tracking-tight">MANUAL COGNITIVE DISPATCH REQUIRED</h4>
              <p className="text-xs text-white/45 font-light mt-1.5 leading-relaxed">
                A system clearance key has been generated on your satellite device. Enter authorization keys to proceed.
              </p>

              <div className="flex justify-between gap-2.5 mt-6 mb-6">
                {[...Array(4)].map((_, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    className="w-11 h-11 text-center bg-white/5 border border-white/10 rounded-lg text-sm font-mono font-bold text-white outline-none focus:border-[#A855F7]"
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsOverlayOpen(false);
                    triggerAudio("click");
                  }}
                  className="flex-1 py-2 px-4 rounded-xl border border-white/5 hover:bg-white/5 text-white/50 hover:text-white font-mono text-[10px] transition-all cursor-pointer"
                >
                  BYPASS CANCEL
                </button>
                <button
                  onClick={() => {
                    setIsOverlayOpen(false);
                    addNotification("System Override Clear", "Warp protocol fully cleared.", "success");
                    triggerAudio("notification");
                  }}
                  className="flex-1 py-2 px-4 rounded-xl bg-[#A855F7] text-white font-sans font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  VERIFY OVERRIDE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Side spring Slide Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-80 h-full bg-[#050505] border-l border-white/10 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 select-none"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <span className="font-mono text-[8px] text-[#EC4899] tracking-wider uppercase font-bold">SYSTEM CONSOLE DRAWER</span>
                  <button onClick={() => setIsDrawerOpen(false)} className="text-white/45 hover:text-white cursor-pointer font-bold font-mono text-xs">×</button>
                </div>

                <div className="flex flex-col gap-4 font-mono text-[9px] text-white/60">
                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <span className="text-white/30 block mb-1">PROCESS_ID:</span>
                    <span className="font-bold text-white">#HELIOS_SYS_84920</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <span className="text-white/30 block mb-1">SYNAPTIC TEMPERATURE:</span>
                    <span className="font-bold text-[#EC4899]">34.5°C (NORMAL)</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <span className="text-white/30 block mb-1">CLUSTER ALLOCATE:</span>
                    <span className="font-bold text-emerald-400">92% PERFORMANCE</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  triggerAudio("click");
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] font-bold uppercase transition-all cursor-pointer"
              >
                DISMISS SYSTEMS TRAY
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default DesignSystem;
