/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WorkflowNode, WorkflowConnection, WorkflowStats, NodeType } from "./types";
import { ReasoningTimeline } from "./ReasoningTimeline";
import { MemoryGraph } from "./MemoryGraph";
import { ToolExecution } from "./ToolExecution";
import {
  Settings,
  Brain,
  Sliders,
  Sparkles,
  BarChart3,
  Trash2,
  GitCommit,
  Bot,
  ChevronDown,
  ChevronRight,
  GitFork,
  CheckCircle,
  HelpCircle,
  Clock,
  Shield,
  Gauge,
} from "lucide-react";

interface PropertiesPanelProps {
  selectedNode: WorkflowNode | null;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  onUpdateNode: (node: WorkflowNode) => void;
  onDeleteNode: (id: string) => void;
  isRunning: boolean;
  activeStep: number;
  activeNodeType: NodeType | null;
  stats: WorkflowStats;
}

export function PropertiesPanel({
  selectedNode,
  nodes,
  connections,
  onUpdateNode,
  onDeleteNode,
  isRunning,
  activeStep,
  activeNodeType,
  stats,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<"config" | "cognition" | "memory" | "agents" | "telemetry">(
    "config"
  );

  // Expandable Thought Graph State
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({
    root: true,
    retrieve: true,
    synthesis: false,
  });

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = [
    { id: "config", label: "Parameters", icon: Sliders, color: "#EC4899" },
    { id: "cognition", label: "Cognition", icon: Brain, color: "#F59E0B" },
    { id: "memory", label: "Memory Map", icon: Sparkles, color: "#A855F7" },
    { id: "agents", label: "Agent Swarm", icon: Bot, color: "#3B82F6" },
    { id: "telemetry", label: "Telemetry", icon: BarChart3, color: "#10B981" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#030303]/40 border border-white/5 backdrop-blur-xl rounded-2xl overflow-hidden select-none">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-white/5 bg-black/30 p-1 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                borderColor: isActive ? tab.color : "transparent",
                color: isActive ? tab.color : "rgba(255,255,255,0.4)",
              }}
              className="flex-1 py-2 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer hover:bg-white/[0.03] transition-all border-b-2"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Area scroll container */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {/* ==================== CONFIG TAB ==================== */}
        {activeTab === "config" && (
          <div className="flex flex-col gap-4 select-none">
            {selectedNode ? (
              <div className="flex flex-col gap-4">
                {/* Node Metadata Summary */}
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Settings className="w-4 h-4 text-white/30" />
                  <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-black">
                    NODE CONFIGURATION
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[8.5px] text-[#A855F7] font-black uppercase">
                    ID: {selectedNode.id}
                  </span>
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    <label className="text-[7.5px] font-mono text-white/35 uppercase font-bold">
                      Node Name
                    </label>
                    <input
                      type="text"
                      value={selectedNode.name}
                      onChange={(e) => onUpdateNode({ ...selectedNode, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-white/5 bg-[#050505]/60 text-[11px] font-bold text-white/95 focus:border-[#A855F7] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[7.5px] font-mono text-white/35 uppercase font-bold">
                    System Description
                  </label>
                  <textarea
                    rows={2}
                    value={selectedNode.description}
                    onChange={(e) =>
                      onUpdateNode({ ...selectedNode, description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-[#050505]/60 text-[10px] leading-snug text-white/70 focus:border-[#A855F7] focus:outline-none transition-all resize-none font-light"
                  />
                </div>

                {/* Node Prompt System Input */}
                {("prompt" in selectedNode || selectedNode.prompt !== undefined) && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[7.5px] font-mono text-white/35 uppercase font-bold flex justify-between">
                      <span>COGNITIVE DIRECTIVES (PROMPT)</span>
                      <span className="text-[#A855F7] font-black">EDITABLE</span>
                    </label>
                    <textarea
                      rows={4}
                      value={selectedNode.prompt || ""}
                      onChange={(e) =>
                        onUpdateNode({ ...selectedNode, prompt: e.target.value })
                      }
                      placeholder="Input system instructions or prompt template parameters..."
                      className="w-full p-2.5 rounded-xl border border-white/5 bg-[#050505]/60 text-[10px] font-mono leading-relaxed text-white/80 focus:border-[#A855F7] focus:outline-none transition-all resize-none"
                    />
                  </div>
                )}

                {/* Model and parameters sliders */}
                <div className="flex flex-col gap-3.5 bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-[8px] font-mono text-white/30 uppercase font-black tracking-wider">
                    EXECUTION CONTROLS
                  </span>

                  {/* Temperature slider */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between font-mono text-[8px] text-white/40">
                      <span>TEMPERATURE COEF:</span>
                      <span className="text-white font-bold">
                        {selectedNode.settings?.temperature ?? 0.4}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedNode.settings?.temperature ?? 0.4}
                      onChange={(e) => {
                        const temp = parseFloat(e.target.value);
                        onUpdateNode({
                          ...selectedNode,
                          settings: { ...selectedNode.settings, temperature: temp },
                        });
                      }}
                      className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#EC4899]"
                    />
                  </div>

                  {/* Max tokens */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between font-mono text-[8px] text-white/40">
                      <span>MAX OUTPUT TOKEN WINDOW:</span>
                      <span className="text-white font-bold">
                        {selectedNode.settings?.maxTokens ?? 2048}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="256"
                      max="4096"
                      step="256"
                      value={selectedNode.settings?.maxTokens ?? 2048}
                      onChange={(e) => {
                        const tokens = parseInt(e.target.value);
                        onUpdateNode({
                          ...selectedNode,
                          settings: { ...selectedNode.settings, maxTokens: tokens },
                        });
                      }}
                      className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#EC4899]"
                    />
                  </div>
                </div>

                {/* Dependencies custom inputs */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[7.5px] font-mono text-white/35 uppercase font-bold">
                    UPSTREAM NODE DEPENDENCY ID
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="node-X"
                      value={selectedNode.dependencies?.join(", ") || ""}
                      onChange={(e) => {
                        const deps = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        onUpdateNode({ ...selectedNode, dependencies: deps });
                      }}
                      className="w-full p-2 rounded-lg border border-white/5 bg-[#050505]/60 text-[10px] text-white/70 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteNode(selectedNode.id)}
                  className="w-full py-2.5 rounded-xl bg-red-950/10 border border-red-900/20 hover:bg-red-950/20 text-red-400 font-mono text-[9.5px] font-bold hover:border-red-700/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>DELETE NODE BLUEPRINT</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-3 text-white/35">
                <Sliders className="w-8 h-8 text-white/20 animate-pulse" />
                <span className="font-mono text-[9px] tracking-widest uppercase font-black">
                  SELECT NODE ON CANVAS
                </span>
                <p className="text-[9.5px] text-white/25 max-w-xs leading-normal">
                  Click any node trigger or logic card on the canvas grid to tune its neural settings, prompts, and options.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== COGNITION TAB ==================== */}
        {activeTab === "cognition" && (
          <div className="flex flex-col gap-6 select-none">
            {/* Reasoning Timeline */}
            <ReasoningTimeline activeStep={activeStep} isRunning={isRunning} />

            {/* Expandable Thought Graph representation */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-5">
              <div>
                <h3 className="font-mono text-[9px] text-[#A855F7] tracking-widest uppercase font-black flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-[#A855F7]" />
                  DECONSTRUCTED THOUGHT GRAPH
                </h3>
                <p className="text-[10px] text-white/40 mt-0.5">
                  Interactive hierarchical tree coordinates
                </p>
              </div>

              {/* Mind-map hierarchy */}
              <div className="flex flex-col gap-2 font-mono text-[9px] bg-[#050505]/60 p-3 rounded-2xl border border-white/5">
                {/* ROOT NODE */}
                <div className="flex flex-col gap-1.5">
                  <div
                    onClick={() => toggleThought("root")}
                    className="flex items-center gap-1.5 cursor-pointer text-white hover:text-[#A855F7] transition-colors"
                  >
                    {expandedThoughts.root ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                    <span className="font-bold flex items-center gap-1 text-[#10B981]">
                      <CheckCircle className="w-3 h-3" />
                      COGNITIVE_ROOT (Task Initiation)
                    </span>
                  </div>

                  {expandedThoughts.root && (
                    <div className="pl-4 border-l border-dashed border-white/10 ml-2.5 flex flex-col gap-2">
                      <div className="text-white/50 leading-relaxed">
                        Parsed user intent: "Analyze layout files and dispatch code artifacts".
                      </div>

                      {/* Level 2 Thought 1 */}
                      <div className="flex flex-col gap-1.5">
                        <div
                          onClick={() => toggleThought("retrieve")}
                          className="flex items-center gap-1.5 cursor-pointer text-white/80 hover:text-[#A855F7]"
                        >
                          {expandedThoughts.retrieve ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span className="font-semibold text-white/80">CONTEXT_SCAN (Vector Search)</span>
                        </div>

                        {expandedThoughts.retrieve && (
                          <div className="pl-4 border-l border-dashed border-white/10 ml-1.5 flex flex-col gap-1">
                            <div className="text-[#3B82F6] flex items-center gap-1">
                              ● Fetching episodic logs...
                            </div>
                            <div className="text-white/40">✓ Injected 4 text blocks.</div>
                          </div>
                        )}
                      </div>

                      {/* Level 2 Thought 2 */}
                      <div className="flex flex-col gap-1.5">
                        <div
                          onClick={() => toggleThought("synthesis")}
                          className="flex items-center gap-1.5 cursor-pointer text-white/80 hover:text-[#A855F7]"
                        >
                          {expandedThoughts.synthesis ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span className="font-semibold text-white/60">SYNTHESIS_RUN (Model Feed)</span>
                        </div>

                        {expandedThoughts.synthesis && (
                          <div className="pl-4 border-l border-dashed border-white/10 ml-1.5 flex flex-col gap-1">
                            <div className="text-white/30">Staged for generation blocks.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Tool Execution cards */}
            <div className="border-t border-white/5 pt-5">
              <ToolExecution activeNodeType={activeNodeType} isRunning={isRunning} />
            </div>
          </div>
        )}

        {/* ==================== MEMORY TAB ==================== */}
        {activeTab === "memory" && (
          <div className="flex flex-col gap-4 select-none">
            <MemoryGraph />
          </div>
        )}

        {/* ==================== SWARM TAB ==================== */}
        {activeTab === "agents" && (
          <div className="flex flex-col gap-4 select-none pr-1">
            <div className="border-b border-white/5 pb-2">
              <h3 className="font-mono text-[9px] text-[#3B82F6] tracking-widest uppercase font-black flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#3B82F6]" />
                MULTI-AGENT COLLABORATION SWARM
              </h3>
              <p className="text-[10px] text-white/40 mt-0.5">
                Sub-agent lane scheduling and telemetry
              </p>
            </div>

            {/* Agents Lanes Layout */}
            <div className="flex flex-col gap-3 mt-1">
              {[
                { name: "Task Planner", role: "Planning", model: "gemini-2.5-flash", priority: "CRITICAL", active: activeStep === 0 || activeStep === 4 },
                { name: "Athene Research", role: "Search & Memory", model: "gemini-2.5-flash", priority: "HIGH", active: activeStep === 1 || activeStep === 2 },
                { name: "Logic Critic", role: "Chain-of-Thought", model: "gemini-2.5-pro", priority: "HIGH", active: activeStep === 3 },
                { name: "Synthesis Writer", role: "Output Generation", model: "gemini-2.5-flash", priority: "MAX", active: activeStep === 5 },
                { name: "Safety Reviewer", role: "Verification", model: "gemini-2.5-flash", priority: "STRICT", active: activeStep === 6 },
              ].map((agent, idx) => {
                return (
                  <div
                    key={idx}
                    style={{
                      borderColor: agent.active ? "#3B82F6" : "rgba(255,255,255,0.05)",
                      boxShadow: agent.active ? "0 0 15px rgba(59,130,246,0.15)" : undefined,
                    }}
                    className={`p-3 bg-[#050505]/45 border rounded-xl flex flex-col gap-2 relative overflow-hidden transition-all duration-300`}
                  >
                    {agent.active && (
                      <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-[#3B82F6] to-[#A855F7]" />
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border font-mono text-[9px] font-bold ${
                            agent.active
                              ? "bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6]"
                              : "bg-white/5 border-white/5 text-white/30"
                          }`}
                        >
                          A{idx + 1}
                        </div>
                        <div>
                          <h4 className="text-[10.5px] font-bold text-white/90 leading-tight">
                            {agent.name}
                          </h4>
                          <span className="font-mono text-[7px] text-white/30 uppercase">
                            ROLE: {agent.role}
                          </span>
                        </div>
                      </div>

                      {agent.active ? (
                        <span className="font-mono text-[7px] text-[#3B82F6] font-bold tracking-wider uppercase animate-pulse">
                          EXECUTING LANE
                        </span>
                      ) : (
                        <span className="font-mono text-[7px] text-white/20 uppercase">
                          STANDBY
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-2 font-mono text-[7.5px] text-white/35">
                      <span>ENGINE: {agent.model}</span>
                      <span className="font-bold text-white/60">LVL: {agent.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TELEMETRY TAB ==================== */}
        {activeTab === "telemetry" && (
          <div className="flex flex-col gap-4 select-none pr-1">
            <div className="border-b border-white/5 pb-2">
              <h3 className="font-mono text-[9px] text-[#10B981] tracking-widest uppercase font-black flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#10B981]" />
                PIPELINE SYSTEM TELEMETRY
              </h3>
              <p className="text-[10px] text-white/40 mt-0.5">
                Runtime coefficients and latency monitors
              </p>
            </div>

            {/* Statistics details cards */}
            <div className="grid grid-cols-2 gap-3 mt-1 font-mono">
              <div className="p-3 bg-[#050505]/45 border border-white/5 rounded-xl flex flex-col gap-0.5">
                <span className="text-white/30 text-[7px] uppercase font-black">
                  Total Latency
                </span>
                <span className="text-sm font-black text-white">
                  {isRunning ? `${stats.executionTime} ms` : "0 ms"}
                </span>
                <span className="text-white/20 text-[6.5px] mt-0.5 flex items-center gap-0.5">
                  <Clock className="w-2 h-2" /> OVERHEAD: 24ms
                </span>
              </div>

              <div className="p-3 bg-[#050505]/45 border border-white/5 rounded-xl flex flex-col gap-0.5">
                <span className="text-white/30 text-[7px] uppercase font-black">
                  Confidence Rating
                </span>
                <span className="text-sm font-black text-[#10B981]">
                  {isRunning ? `${stats.confidence}%` : "0%"}
                </span>
                <span className="text-white/20 text-[6.5px] mt-0.5 flex items-center gap-0.5">
                  <Shield className="w-2 h-2" /> STRICT GATED
                </span>
              </div>

              <div className="p-3 bg-[#050505]/45 border border-white/5 rounded-xl flex flex-col gap-0.5">
                <span className="text-white/30 text-[7px] uppercase font-black">
                  Nodes Executed
                </span>
                <span className="text-sm font-black text-white">
                  {stats.nodesExecuted} / {nodes.length}
                </span>
                <span className="text-white/20 text-[6.5px] mt-0.5">SUCCESS RATIO: 100%</span>
              </div>

              <div className="p-3 bg-[#050505]/45 border border-white/5 rounded-xl flex flex-col gap-0.5">
                <span className="text-white/30 text-[7px] uppercase font-black">
                  Memory Vector Store
                </span>
                <span className="text-sm font-black text-white">
                  {stats.memoryUsed} MB
                </span>
                <span className="text-white/20 text-[6.5px] mt-0.5">CAP: 2048MB (HEAP)</span>
              </div>
            </div>

            {/* Performance analysis chart wrapper */}
            <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl flex flex-col gap-2 mt-2">
              <span className="font-mono text-[7px] text-white/30 uppercase font-black">
                PIPELINE VELOCITY RATIO
              </span>
              <div className="h-24 flex items-end justify-between px-2 gap-1 bg-black/40 border border-white/5 rounded-lg py-1.5 select-none">
                {[45, 60, 52, 75, 90, 84, 98].map((v, i) => {
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        style={{ height: `${v}%` }}
                        className="w-full bg-[#10B981]/20 rounded border border-[#10B981]/40 flex items-center justify-center relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/10 to-[#10B981]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[6px] font-mono text-white/20">N{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
