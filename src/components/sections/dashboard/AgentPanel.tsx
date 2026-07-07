/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AgentCard, AgentConfig } from "./AgentCard";
import { Radio, Users, Sparkles, Play, ArrowRight, Layers, Cpu, HelpCircle, CheckCircle2 } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

export function AgentPanel() {
  const { addNotification } = useOS();
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-1");
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState<boolean>(false);

  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      id: "agent-1",
      name: "Athene Research",
      role: "RESEACH & CLASSIFY",
      avatar: "🔍",
      color: "#06B6D4",
      description: "Harvests semantic intelligence from web indices, papers, and corporate catalogs. High compliance standards.",
      status: "completed",
      currentTask: "Indexed Firestore blueprints schema rules",
      intelligence: "DeepSeek-R1",
    },
    {
      id: "agent-2",
      name: "Daedalus Coder",
      role: "SYNTAX ARCHITECT",
      avatar: "💻",
      color: "#10B981",
      description: "Synthesizes modular TypeScript, React hooks, and optimal performance shaders. Strictly audited syntax.",
      status: "processing",
      currentTask: "Optimizing Spline matrix loading times",
      intelligence: "Gemini Pro",
    },
    {
      id: "agent-3",
      name: "Solon Reasoner",
      role: "LOGIC AUDITOR",
      avatar: "🧠",
      color: "#A855F7",
      description: "Executes double-blind validation checks, chain-of-thought audits, and analyzes complexity matrices.",
      status: "idle",
      currentTask: "Waiting for compiler pipeline request",
      intelligence: "o3-mini",
    },
    {
      id: "agent-4",
      name: "Helios Planner",
      role: "WORKFLOW SCHEDULER",
      avatar: "📅",
      color: "#F59E0B",
      description: "Coordinates multi-step pipelines, parses dependencies, and schedules task dispatches against active hosts.",
      status: "idle",
      currentTask: "Standing by",
      intelligence: "Gemini Flash",
    },
    {
      id: "agent-5",
      name: "Hermes Writer",
      role: "COPYWRITER EXHAUST",
      avatar: "✍️",
      color: "#EC4899",
      description: "Produces pristine executive briefings, documentation matrices, and high-impact conversion landing pages.",
      status: "idle",
      currentTask: "Standing by",
      intelligence: "Claude 3.5 Sonnet",
    },
  ]);

  // Automated step simulation for pipeline visualization
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWorkflowRunning) {
      timer = setTimeout(() => {
        setActiveWorkflowStep((prev) => {
          if (prev >= 4) {
            setIsWorkflowRunning(false);
            addNotification("Consensus Complete", "Collaborative agent cycle resolved perfectly.", "success");
            return 4;
          }
          addNotification("Workflow Dispatched", `Step ${prev + 1} completed. Handoff to next agent.`, "info");
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isWorkflowRunning, activeWorkflowStep, addNotification]);

  const runCollaborationPipeline = () => {
    setActiveWorkflowStep(0);
    setIsWorkflowRunning(true);
    addNotification("Pipeline Initiated", "Launching Multi-Agent collaborative synthesis sequence.", "info");
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  // Workflow steps metadata
  const workflowNodes = [
    { name: "Researcher", icon: "🔍", color: "#06B6D4", text: "Gathers requirements" },
    { name: "Reasoner", icon: "🧠", color: "#A855F7", text: "Validates logic path" },
    { name: "Planner", icon: "📅", color: "#F59E0B", text: "Assembles schedule" },
    { name: "Writer", icon: "✍️", color: "#EC4899", text: "Drafts final blueprint" },
    { name: "Reviewer", icon: "💻", color: "#10B981", text: "Audits for quality compile" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-sans select-none">
      {/* Upper header section */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 select-none">
            <Users className="w-4 h-4 text-[#A855F7] animate-pulse" />
            <span className="font-mono text-[8.5px] text-white/30 tracking-widest uppercase font-bold">COOPERATIVE NEURAL EXPERTS</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Active Agent Laboratory</h2>
          <p className="text-xs text-white/45 mt-1.5 font-light leading-relaxed max-w-xl">
            Meet your custom-tuned intelligence agents. Switch tasks, check active workloads, or dispatch cohesive workflows that operate across multiple LLM routers simultaneously.
          </p>
        </div>

        <button
          onClick={runCollaborationPipeline}
          disabled={isWorkflowRunning}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#4F8CFF] hover:opacity-90 active:scale-98 text-white font-mono text-[10px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>DISPATCH MULTI-AGENT SWARM</span>
        </button>
      </div>

      {/* Dynamic Animated Collaboration Workflow Visualization */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden flex flex-col gap-6 justify-between h-56">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-96 h-20 rounded-full bg-[#A855F7]/5 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[8.5px] text-white/40 tracking-widest uppercase font-bold">COLLABORATIVE PIPELINE HANDOFFS</span>
          </div>
          {isWorkflowRunning && (
            <span className="font-mono text-[8px] text-[#A855F7] font-bold animate-pulse">ACTIVE CONCENSUS EXECUTION...</span>
          )}
        </div>

        {/* Nodes and connecting links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 px-4 relative z-10">
          {workflowNodes.map((node, idx) => {
            const isStepActive = idx === activeWorkflowStep && isWorkflowRunning;
            const isStepCompleted = idx < activeWorkflowStep || (idx === 4 && !isWorkflowRunning && activeWorkflowStep === 4);

            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div className="hidden md:block flex-1 h-[2px] bg-white/5 relative mx-2">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                      style={{
                        width: isStepCompleted ? "100%" : isStepActive ? "50%" : "0%",
                      }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 select-none">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all duration-300 relative ${
                      isStepActive
                        ? "scale-110 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-white/5"
                        : isStepCompleted
                        ? "bg-white/5"
                        : "bg-transparent"
                    }`}
                    style={{
                      borderColor: isStepActive ? node.color : isStepCompleted ? `${node.color}50` : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <span>{node.icon}</span>
                    {isStepCompleted && (
                      <div className="absolute -right-1 -top-1 bg-green-400 rounded-full p-0.5 border border-black">
                        <CheckCircle2 className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-bold text-white/95 block leading-tight">{node.name}</span>
                    <span className="text-[7.5px] font-mono text-white/35 uppercase block tracking-wider mt-0.5">
                      {isStepActive ? "EXECUTING" : isStepCompleted ? "COMPLETE" : "QUEUED"}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Workflow diagnostics output panel */}
        <div className="border-t border-white/5 pt-3 flex justify-between select-none font-mono text-[8.5px] text-white/30">
          <span>ACTIVE PIPELINE ROUTE: ATHENE → DAEDALUS → SOLON → HERMES</span>
          <span>ESTIMATED CONCENSUS LATENCY: ~2,400ms</span>
        </div>
      </div>

      {/* Agents grid and side diagnostic specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isActive={selectedAgentId === agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
            />
          ))}
        </div>

        {/* Sidebar details mapping selected agent */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[350px]">
          <AnimatePresence mode="wait">
            {selectedAgent ? (
              <motion.div
                key={selectedAgent.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5 select-none"
              >
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Cpu className="w-4 h-4 text-white/30" />
                  <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">OPERATIONAL DIRECTORY LAYER</span>
                </div>

                <div>
                  <span
                    className="font-mono text-[8px] uppercase tracking-widest font-bold"
                    style={{ color: selectedAgent.color }}
                  >
                    {selectedAgent.role}
                  </span>
                  <h4 className="font-sans font-black text-sm text-white/95 mt-1">{selectedAgent.name}</h4>
                  <p className="font-mono text-[8.5px] text-white/40 mt-1 uppercase">CONNECTED ROUTER: {selectedAgent.intelligence}</p>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-2xl p-4 font-sans text-xs text-white/50 leading-relaxed font-light">
                  {selectedAgent.description}
                </div>

                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3.5 font-mono text-[8px] text-white/35 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span>STATUS PROFILE:</span>
                    <span className="text-white font-semibold uppercase">{selectedAgent.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ACTIVE DIRECTIVE:</span>
                    <span className="text-white font-semibold uppercase truncate max-w-[120px]">
                      {selectedAgent.currentTask}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    addNotification("Instruction Dispatch", `Forcing update for agent ${selectedAgent.name}`, "info")
                  }
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>SYNC DIRECTIVE SCHEME</span>
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 gap-3 select-none text-white/30 h-full">
                <HelpCircle className="w-8 h-8" />
                <span className="font-mono text-[9px] tracking-widest uppercase font-bold">SELECT AGENT DIAGNOSTICS</span>
              </div>
            )}
          </AnimatePresence>

          {selectedAgent && (
            <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
              <span>MODEL BOUND: SECURED</span>
              <span>SYNCHRONICITY: 100%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
