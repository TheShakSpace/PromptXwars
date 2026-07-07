/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Cpu, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught exception in core React tree:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center p-6 text-white select-none">
          {/* Spatial Grid Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] pointer-events-none" />

          <div className="w-full max-w-lg bg-neutral-950/40 backdrop-blur-xl border border-rose-500/10 p-8 rounded-2xl relative shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            {/* Top diagnostic rail */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <span className="font-mono text-[8px] text-rose-400 tracking-wider uppercase font-black flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                SYSTEM CRITICAL FAULT [STATUS_500]
              </span>
              <span className="font-mono text-[8px] text-white/35">HELIOS_KERN_V2.5.4</span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="font-sans font-black text-2xl uppercase tracking-tight text-white/90">
                Cognitive Pipeline Interrupted
              </h1>
              <p className="text-xs text-white/45 font-light leading-relaxed">
                An unexpected exception interrupted the React viewport compilation. The runtime kernel has isolated this threat to protect local storage buffers.
              </p>

              {/* Diagnostic Log Box */}
              <div className="bg-[#050505]/80 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-rose-300 overflow-auto max-h-44 flex flex-col gap-1.5 select-all shadow-inner">
                <div className="text-white/30 font-bold border-b border-white/5 pb-1 flex items-center gap-1.5 mb-1">
                  <Cpu className="w-3 h-3 text-rose-400" />
                  RUNTIME_DIAGNOSTIC_STACK
                </div>
                <span className="font-bold text-white uppercase">{this.state.error?.name}: {this.state.error?.message}</span>
                <span className="text-white/40 text-[8px] leading-tight mt-1 whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack || this.state.error?.stack || "No additional trace compiled."}
                </span>
              </div>

              {/* Action Rows */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" /> Return Home
                </button>
                <button
                  onClick={this.handleReset}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-950/20 hover:bg-rose-950/35 border border-rose-900/60 text-rose-400 font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.08)]"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reboot OS Kernel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
