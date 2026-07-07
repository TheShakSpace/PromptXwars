/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Download, FileText, Share2, Clipboard, CheckCircle, BarChart3, TrendingUp, Cpu } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export function OutputPanel() {
  const { addNotification } = useOS();

  const mockChartData = [
    { name: "01", efficiency: 42, memory: 88 },
    { name: "02", efficiency: 58, memory: 82 },
    { name: "03", efficiency: 65, memory: 74 },
    { name: "04", efficiency: 82, memory: 65 },
    { name: "05", efficiency: 91, memory: 52 },
    { name: "06", efficiency: 96, memory: 40 },
  ];

  const handleExport = (format: string) => {
    addNotification("Export Started", `Compiling outcome to ${format.toUpperCase()}...`, "info");
    setTimeout(() => {
      addNotification("Download Ready", `Ready to write ${format.toUpperCase()} asset.`, "success");
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockChartData, null, 2));
    addNotification("Payload Copied", "Simulated analytics JSON packet cached.", "success");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      
      {/* Code & Rich Text Outcome rendering */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[420px]">
        
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#10B981]" />
              <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">SYNTHESIS OUTPUT BINDINGS</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
                title="Copy Outcome JSON"
              >
                <Clipboard className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
                title="Download PDF Summary"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Formatted Markdown text area */}
          <div className="flex flex-col gap-5 select-text">
            <div>
              <h3 className="text-sm font-black text-white leading-tight">Compile Results: VRAM Socket Router</h3>
              <p className="font-mono text-[8.5px] text-[#10B981] mt-1 uppercase">PIPELINE VERDICT: SECURED & VERIFIED // COMPILER STABLE</p>
            </div>

            <div className="p-4 bg-black/60 border border-white/5 rounded-2xl font-sans text-xs text-white/50 leading-relaxed font-light flex flex-col gap-4">
              <p>
                Core node processes have successfully bound to port 3000 inside the Docker container framework. Visual telemetry states verify zero memory leaks or unhandled promise rejections.
              </p>

              <div>
                <strong className="text-white/80 block mb-1">Functional Features:</strong>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Automatic cleanup sweep intervals (30s swept intervals)</li>
                  <li>Asymmetric 256-bit ECDSA token verification layers</li>
                  <li>Real time throughput indexing supporting 2M concurrent context vectors</li>
                </ul>
              </div>
            </div>

            {/* Rich outcome table */}
            <div className="overflow-x-auto border border-white/5 rounded-2xl">
              <table className="w-full text-left font-mono text-[9px] text-white/40 border-collapse">
                <thead className="bg-white/[0.01] border-b border-white/5 text-white/65">
                  <tr>
                    <th className="p-3">METRIC PARAMETER</th>
                    <th className="p-3">INDEX TARGET</th>
                    <th className="p-3">EFFICIENCY RATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-transparent">
                  <tr>
                    <td className="p-3 text-white/85">ECDSA Auth Delay</td>
                    <td className="p-3">~24ms</td>
                    <td className="p-3 text-green-400">OPTIMAL</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white/85">VRAM Thread Cache</td>
                    <td className="p-3">0.02 KB</td>
                    <td className="p-3 text-green-400">OPTIMAL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
          <span>COMPILED ON HOST: HELIOS_GRID_A5</span>
          <span>PARSE SECURE INTEGRITY: 100%</span>
        </div>

      </div>

      {/* Analytics Recharts widget sidebar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between min-h-[350px]">
        
        <div>
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <BarChart3 className="w-4 h-4 text-[#10B981]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">OUTCOME ANALYTICS CORE</span>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <span className="font-mono text-[8px] text-[#10B981] uppercase font-bold">Telemetry Metrics</span>
              <p className="text-[10.5px] text-white/45 leading-relaxed font-light mt-1">
                Visualizing compiled asset efficiency rates and memory savings sweeps. High ratings indicate exceptional model rendering.
              </p>
            </div>

            {/* Recharts Area Chart container */}
            <div className="h-40 w-full bg-black/40 border border-white/5 rounded-2xl p-2 select-none relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" fontSize={8} />
                  <YAxis stroke="rgba(255,255,255,0.15)" fontSize={8} />
                  <Tooltip contentStyle={{ background: "#050505", border: "1px solid rgba(255,255,255,0.1)", fontSize: 8 }} />
                  <Area type="monotone" dataKey="efficiency" stroke="#10B981" fillOpacity={0.15} fill="rgba(16,185,129,0.15)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="memory" stroke="#4F8CFF" fillOpacity={0.1} fill="rgba(79,140,255,0.1)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono text-white/30 px-1">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> EFFICIENCY</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#4F8CFF]" /> MEMORY SWEEP</span>
            </div>
          </div>
        </div>

        {/* Download triggers buttons row */}
        <div className="flex flex-col gap-2 mt-5">
          <span className="font-mono text-[7px] text-white/20 uppercase font-bold">EXPORT MATRIX ARCHIVES</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExport("json")}
              className="py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-center text-[9px] font-mono font-semibold text-white/50 hover:text-white transition-all cursor-pointer"
            >
              JSON MATRIX
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-center text-[9px] font-mono font-semibold text-white/50 hover:text-white transition-all cursor-pointer"
            >
              CSV SPREADSHEETS
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
