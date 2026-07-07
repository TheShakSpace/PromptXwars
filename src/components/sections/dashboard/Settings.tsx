/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { 
  Settings, Sliders, Shield, Key, Eye, ToggleLeft, 
  ToggleRight, Check, RefreshCw 
} from "lucide-react";

export function SettingsPage() {
  const { addNotification } = useOS();
  const [isGpuOn, setIsGpuOn] = useState(true);
  const [isEncryptOn, setIsEncryptOn] = useState(true);
  const [isParticlesOn, setIsParticlesOn] = useState(true);
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••••");
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  const handleToggleGpu = () => {
    setIsGpuOn(!isGpuOn);
    addNotification("Preference Adjusted", `GPU Accelerations ${!isGpuOn ? "enabled" : "disabled"}.`, "info");
  };

  const handleToggleEncrypt = () => {
    setIsEncryptOn(!isEncryptOn);
    addNotification("Security Tuned", `Handshake encryption ${!isEncryptOn ? "enforced" : "relaxed"}.`, "warning");
  };

  const handleToggleParticles = () => {
    setIsParticlesOn(!isParticlesOn);
    addNotification("Layout Swapped", `Background particle field ${!isParticlesOn ? "active" : "standby"}.`, "info");
  };

  const handleSavePreferences = () => {
    addNotification("Configuration Consolidated", "System preferences saved successfully.", "success");
  };

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-6 font-sans select-none">
      
      {/* 1. Core preferences pane */}
      <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[400px]">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 select-none">
            <Sliders className="w-4 h-4 text-[#94A3B8]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">SYSTEM CONFIGURATIONS</span>
          </div>

          {/* Toggle Switches lists */}
          <div className="flex flex-col gap-4">
            
            {/* Toggle 1 */}
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex flex-col gap-1 pr-6">
                <span className="text-xs font-semibold text-white/95">UNIFIED VRAM ACCELERATION</span>
                <p className="text-[10.5px] text-white/45 font-light leading-normal">
                  Renders Spline meshes and 3D coordinate matrices directly on discrete user graphics cards.
                </p>
              </div>
              
              <button onClick={handleToggleGpu} className="cursor-pointer">
                {isGpuOn ? (
                  <ToggleRight className="w-10 h-10 text-green-400" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-white/20" />
                )}
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex flex-col gap-1 pr-6">
                <span className="text-xs font-semibold text-white/95">ENCRYPT NODE COMMUNICATIONS</span>
                <p className="text-[10.5px] text-white/45 font-light leading-normal">
                  Encrypts outgoing instructions and telemetry bundles via 256-bit ECDSA cryptographic layers.
                </p>
              </div>

              <button onClick={handleToggleEncrypt} className="cursor-pointer">
                {isEncryptOn ? (
                  <ToggleRight className="w-10 h-10 text-[#4F8CFF]" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-white/20" />
                )}
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex flex-col gap-1 pr-6">
                <span className="text-xs font-semibold text-white/95">PARTICLE EFFECTS BACKGROUND</span>
                <p className="text-[10.5px] text-white/45 font-light leading-normal">
                  Displays fine animated floaters and vector grids for immersive depth parameters.
                </p>
              </div>

              <button onClick={handleToggleParticles} className="cursor-pointer">
                {isParticlesOn ? (
                  <ToggleRight className="w-10 h-10 text-green-400" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-white/20" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Save button footer */}
        <button
          onClick={handleSavePreferences}
          className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4 text-green-400" />
          <span>CONSOLIDATE SYSTEM PREFERENCES</span>
        </button>

      </div>

      {/* 2. Security / Key credentials pane */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 select-none">
            <Shield className="w-4 h-4 text-[#4F8CFF]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">NODE SECURITY</span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Credentials explanation */}
            <div>
              <span className="font-mono text-[8.5px] text-[#4F8CFF] uppercase font-bold">API KEY OVERRIDE</span>
              <p className="text-[10.5px] text-white/45 leading-relaxed font-light mt-1.5">
                Override system models keys by providing an authorized credentials packet. Keep this isolated.
              </p>
            </div>

            {/* Key entry area */}
            <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-xl focus-within:border-[#4F8CFF]/40 transition-all">
              <input
                type={isKeyVisible ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-transparent border-none outline-none p-3.5 pr-12 text-white text-xs font-mono"
              />
              <button
                onClick={() => setIsKeyVisible(!isKeyVisible)}
                className="absolute right-3.5 text-white/35 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Cryptographic metadata */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 font-mono text-[8px] text-white/35 flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span>PROJECT ID:</span>
                <span className="text-white/60 font-semibold">HELIOS-CORE-NODE</span>
              </div>
              <div className="flex justify-between">
                <span>ENCRYPT SCHEME:</span>
                <span className="text-white/60 font-semibold">ECDSA_P256</span>
              </div>
              <div className="flex justify-between">
                <span>SOCKET INGRESS:</span>
                <span className="text-green-400 font-bold">PORT 3000 ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
          <span>HOST: 0.0.0.0</span>
          <span>ROUTING: LOCALHOST</span>
        </div>

      </div>

    </div>
  );
}
