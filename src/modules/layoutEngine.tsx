/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useOS } from "../contexts/OSContext";
import { DatasetManager } from "../datasets/datasetManager";
import { ChartEngine, type ChartItemConfig } from "./chartEngine";
import { TableEngine, type TableColumnSchema } from "./tableEngine";
import { FormEngine, type FormSchema } from "./formEngine";
import { PlatformLogo } from "../branding/logo";
import { platformConfig } from "../config/platformConfig";
import { getIcon } from "../branding/icons";
import { StatusCard } from "../components/sections/dashboard/StatusCard";
import { QuickActions } from "../components/sections/dashboard/QuickActions";
import { Projects } from "../components/sections/dashboard/Projects";
import { Insights } from "../components/sections/dashboard/Insights";
import { Activity } from "../components/sections/dashboard/Activity";

// Execution Engine imports
import { PipelineVisualizer } from "../components/sections/dashboard/PipelineVisualizer";
import { ExecutionConsole } from "../components/sections/dashboard/ExecutionConsole";
import { ExecutionSettings } from "../components/sections/dashboard/ExecutionSettings";
import { ExecutionTimeline } from "../components/sections/dashboard/ExecutionTimeline";
import { globalExecutionManager, ExecutionSession } from "../core/ExecutionManager";

interface LayoutEngineProps {
  query?: string;
  onAction?: (actionId: string, params?: any) => void;
}

export function LayoutEngine({ query = "", onAction }: LayoutEngineProps) {
  const { addNotification } = useOS();
  const dataset = DatasetManager.getActiveData();
  const industry = platformConfig.activeIndustry;

  const [session, setSession] = useState<ExecutionSession | null>(null);

  useEffect(() => {
    const unsubscribe = globalExecutionManager.subscribe((activeSession) => {
      setSession(activeSession ? { ...activeSession } : null);
    });
    return unsubscribe;
  }, []);

  // Compile table schemas dynamically
  const taskColumns: TableColumnSchema<any>[] = [
    { id: "text", header: "Task / Checkpoint", accessor: (row) => row.text, sortable: true },
    { id: "date", header: "Target Due", accessor: (row) => row.date },
    {
      id: "completed",
      header: "Status Flags",
      accessor: (row) => row.completed,
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold ${
            val ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {val ? "RESOLVED" : "IN QUEUE"}
        </span>
      ),
    },
  ];

  // Compile chart configs dynamically
  const chartItems: ChartItemConfig[] = [
    { key: "latency", name: "COGNITIVE SPEED (ms)", color: "#4F8CFF", type: "area" },
    { key: "throughput", name: "THROUGHPUT RATIO", color: "#06B6D4", type: "line" },
  ];

  // Dynamic system greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Build a custom form schema dynamically for testing input parameters
  const testFormSchema: FormSchema = {
    id: "system-query-form",
    title: `Synaptic ${industry.toUpperCase()} Ingestion Form`,
    description: `Configure variable telemetry and compile ${industry} parameters.`,
    fields: [
      { id: "contextTitle", label: "Incident / Log Identifier", type: "text", placeholder: `E.g., helios-${industry}-triage`, required: true },
      { id: "priority", label: "Operational Priority", type: "select", options: [
        { value: "low", label: "LOW priority telemetry" },
        { value: "medium", label: "MEDIUM optimization scale" },
        { value: "high", label: "HIGH neural compute burst" }
      ], required: true },
      { id: "payload", label: "Context Query String", type: "textarea", placeholder: "Input prompt or diagnostic parameters..." }
    ],
    submitLabel: "Dispatch Context Block",
    onSubmit: async (data) => {
      addNotification(
        "Context Block Dispatched",
        `Dispatched '${data.contextTitle}' priority ${data.priority.toUpperCase()} payload.`,
        "success"
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      
      {/* Dynamic Header Banner compiled on branding context values */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-blue-950/20 via-[#0a0a0a]/80 to-violet-950/20 backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] group"
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-96 h-32 rounded-full bg-gradient-to-r from-blue-600/10 to-violet-600/10 blur-[60px] animate-pulse pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 select-none">
              <PlatformLogo size={14} variant="icon" />
              <span className="font-mono text-[8.5px] text-white/30 tracking-widest uppercase font-bold">
                OPERATIONAL CONTEXT: {industry.toUpperCase()} SUITE
              </span>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8CFF] to-violet-400">Operator</span>
            </h1>
            <p className="text-xs text-white/45 mt-2 max-w-xl font-light leading-relaxed">
              Unified operating panel configured dynamically for the **{industry}** intelligence vertical. Secure handshakes and telemetry sockets are live.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 font-mono text-[9px] text-white/40 shrink-0 select-none">
            <div className="flex justify-between gap-6">
              <span>ACTIVE CORES:</span>
              <span className="text-[#4F8CFF] font-black">HELIOS_{industry.toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>TELEMETRY METRICS:</span>
              <span className="text-emerald-400 font-bold">100% ONLINE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Cognitive Pipeline Visualizer */}
      <PipelineVisualizer
        currentStage={session?.status || "idle"}
        progressPercentage={session?.progress || 0}
      />

      {/* Dynamic 3-Column Metric Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dataset.stats.map((stat) => (
          <div
            key={stat.id}
            className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/25 transition-all"
          >
            <span className="block font-mono text-[8.5px] text-white/30 uppercase tracking-widest font-bold">
              {stat.label}
            </span>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="font-sans font-black text-2xl text-white tracking-tight">
                {stat.value}
              </span>
              <span
                className={`font-mono text-[9px] font-bold ${
                  stat.isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            {/* Background glowing indicator */}
            <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-[#4F8CFF]/5 blur-[25px] pointer-events-none group-hover:scale-125 transition-transform" />
          </div>
        ))}
      </div>

      {/* COGNITIVE EXECUTION ENGINE CONTROL DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExecutionConsole />
        </div>
        <div>
          <ExecutionSettings />
        </div>
      </div>

      {/* Primary Bento Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cell 1: Unified Status Widget */}
        <div className="h-full">
          <StatusCard />
        </div>

        {/* Cell 2: Quick actions & commands mapper */}
        <div className="h-full">
          <QuickActions />
        </div>

        {/* Cell 3: Projects summary tracker */}
        <div className="h-full">
          <Projects />
        </div>

        {/* Cell 4: Configured Chart Engine (2 columns wide) */}
        <div className="lg:col-span-2 h-full">
          <ChartEngine
            data={dataset.charts}
            items={chartItems}
            xAxisKey="timestamp"
            title={`${industry.toUpperCase()} Performance Telemetry`}
            subtitle="Real-time multi-agent throughput indexes and execution latency bounds."
          />
        </div>

        {/* Cell 5: Insights feedback panel */}
        <div className="h-full">
          <Insights />
        </div>

        {/* Cell 6: Dynamic Table Engine (2 columns wide) */}
        <div className="lg:col-span-2">
          <TableEngine
            data={dataset.tasks}
            columns={taskColumns}
            title={`${industry.toUpperCase()} Checkpoints & Milestones`}
            searchPlaceholder="Filter diagnostic steps..."
            enableSearch={true}
          />
        </div>

        {/* Cell 7: Schema-Driven Context Form */}
        <div className="h-full">
          <FormEngine schema={testFormSchema} />
        </div>

        {/* Cell 7.5: Historic Execution Timeline */}
        <div className="lg:col-span-3">
          <ExecutionTimeline />
        </div>

        {/* Cell 8: System activity stream log logs (Full Width) */}
        <div className="lg:col-span-3">
          <Activity />
        </div>

      </div>

    </div>
  );
}
