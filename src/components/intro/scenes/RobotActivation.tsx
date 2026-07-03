/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIntro, IntroState } from "../../../contexts/IntroContext";
import { Cpu, Activity, BatteryCharging, Zap } from "lucide-react";

export function RobotActivation() {
  const { currentState, setCurrentState, playSound } = useIntro();
  const [metricPulse, setMetricPulse] = useState(0);

  useEffect(() => {
    if (currentState !== IntroState.ROBOT) return;

    playSound("power");

    // Dynamic metrics ticks
    const pulseInterval = setInterval(() => {
      setMetricPulse((prev) => (prev + 1) % 100);
    }, 400);

    // After 2.6 seconds, zoom camera & trigger Hero reveal
    const advanceTimer = setTimeout(() => {
      clearInterval(pulseInterval);
      setCurrentState(IntroState.HERO);
    }, 2600);

    return () => {
      clearInterval(pulseInterval);
      clearTimeout(advanceTimer);
    };
  }, [currentState, setCurrentState, playSound]);

  if (currentState !== IntroState.ROBOT) return null;

  return (
    <div
      id="intro-scene-6"
      className="fixed inset-0 z-40 bg-[#050505]/40 backdrop-blur-[2px] flex flex-col justify-between p-8 select-none pointer-events-none"
    >
      {/* 3D Core Power Grid overlay lines */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4F8CFF]/20 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />
        <div className="absolute left-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#4F8CFF]/10 to-transparent" />
        <div className="absolute right-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#4F8CFF]/10 to-transparent" />
      </div>

      {/* Top Left Header status */}
      <div className="relative z-20 flex items-start gap-3 mt-24">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-pulse">
          <Zap className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">
            POWER SECTOR // NODE_B
          </span>
          <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wide">
            SPLINE COGNITIVE ROBOTIC REBUILD
          </h3>
          <p className="font-mono text-[9px] text-[#4F8CFF] mt-0.5">
            STATUS: OVERVOLTAGE STABLE
          </p>
        </div>
      </div>

      {/* Central HUD Scan targets */}
      <div className="absolute inset-0 z-15 flex items-center justify-center">
        <div className="relative w-72 h-72 border border-[#4F8CFF]/15 rounded-full flex items-center justify-center">
          {/* Glowing target box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 border-l border-t border-[#4F8CFF] -mt-2" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 border-l border-b border-[#4F8CFF] -mb-2" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 border-l border-t border-[#4F8CFF] -ml-2" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-r border-t border-[#4F8CFF] -mr-2" />

          {/* Target telemetry readout */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/75 border border-white/15 px-3 py-1.5 rounded text-[8px] font-mono text-white/80 tracking-widest uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            <span>AI_EYE_CALIBRATION_0x24</span>
          </div>
        </div>
      </div>

      {/* Bottom Right Diagnostic Telemetry Grid */}
      <div className="relative z-20 self-end flex flex-col gap-2.5 max-w-xs mb-6 text-right">
        <div className="flex items-center justify-end gap-2 text-white/40 font-mono text-[9px] tracking-widest uppercase border-b border-white/5 pb-1.5">
          <Activity className="w-3.5 h-3.5 text-[#4F8CFF]" />
          <span>CYBERNETIC TELEMETRY</span>
        </div>

        <div className="flex flex-col gap-1.5 font-mono text-[9px] text-white/50 text-right">
          <div>EYE_VOLTAGE_COEFFICIENT: <span className="text-white font-semibold">12.4V [STABLE]</span></div>
          <div>JOINT_ALPHA_REACTION: <span className="text-white font-semibold">0.02ms</span></div>
          <div>TEMP_CORE_REASONING: <span className="text-[#4F8CFF] font-semibold">31.4°C</span></div>
          <div className="flex items-center justify-end gap-1.5 text-[8px] uppercase tracking-wider text-green-400 mt-1 font-bold">
            <BatteryCharging className="w-3 h-3 text-green-400" />
            <span>CELL_MATRIX_SYNCED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
