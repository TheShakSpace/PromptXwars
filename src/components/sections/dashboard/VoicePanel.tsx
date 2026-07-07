/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Mic, MicOff, RefreshCw, Radio, CheckCircle, Volume2, Sparkles } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

export function VoicePanel() {
  const { addNotification } = useOS();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [transcriptionIndex, setTranscriptionIndex] = useState(0);

  const sentences = [
    "Compile dynamic React component layout nodes inside index grid safely...",
    "Inject model routing parameters utilizing secure DeepSeek APIs...",
    "Check memory boundaries on port 3000 to prevent outside network leakage...",
    "Verify symmetric ECDSA authentication keys for Helios client modules...",
  ];

  // Simulated transcription loop during recording
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setTimeout(() => {
        setTranscription((prev) => prev + " " + sentences[transcriptionIndex]);
        setTranscriptionIndex((prev) => (prev + 1) % sentences.length);
        addNotification("Voice Packet Transcribed", "Synthesizing vocal speech waveforms.", "info");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [isRecording, transcriptionIndex, addNotification]);

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      addNotification("Voice Stream Clamped", "Vocal input stream terminated.", "success");
    } else {
      setIsRecording(true);
      setTranscription("Initializing vocal telemetry stream...");
      addNotification("Voice Stream Linked", "Microphone pipeline open.", "info");
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      
      {/* Microphone controls & Frequency Visualizer */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[400px]">
        
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Volume2 className="w-4 h-4 text-[#14B8A6] animate-pulse" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">MULTIMODAL VOICE COGNITION</span>
          </div>

          <div className="flex flex-col items-center justify-center py-10 gap-6 select-none">
            {/* Pulsing visualizer circle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full bg-[#14B8A6]/5 border border-[#14B8A6]/20 animate-ping" />
                  <div className="absolute inset-4 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 animate-pulse" />
                </>
              )}

              <button
                onClick={handleToggleRecord}
                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer z-10 relative ${
                  isRecording
                    ? "bg-[#14B8A6]/15 border-[#14B8A6] shadow-[0_0_30px_rgba(20,184,166,0.3)] text-[#14B8A6]"
                    : "bg-white/[0.01] border-white/10 text-white/30 hover:border-white/35 hover:text-white/75"
                }`}
              >
                {isRecording ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-8 h-8" />}
              </button>
            </div>

            {/* Vocal wave indicator animation bars */}
            <div className="flex items-center gap-1.5 h-10">
              {Array.from({ length: 15 }).map((_, idx) => {
                return (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isRecording ? "bg-[#14B8A6]" : "bg-white/10"
                    }`}
                    style={{
                      height: isRecording ? `${Math.max(10, Math.random() * 40)}px` : "8px",
                      animationDelay: `${idx * 0.1}s`,
                      animationDuration: "0.5s",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
          <span>MICROPHONE SOURCE: INTERNAL STREAM</span>
          <span>AUTONOMOUS TRANSCRIPTION RATE: 99.1%</span>
        </div>

      </div>

      {/* Transcription real time telemetry logs */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between min-h-[350px]">
        
        <div>
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <Radio className="w-4 h-4 text-[#14B8A6]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">REAL-TIME TELEMETRY STREAM</span>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <span className="font-mono text-[7.5px] text-[#14B8A6] font-bold uppercase tracking-wide">Live Transcript</span>
              <div className="p-4 bg-black/60 border border-white/5 rounded-2xl font-mono text-[11px] leading-relaxed text-white/70 h-44 overflow-y-auto mt-2 select-text">
                {transcription || (
                  <span className="text-white/20 italic font-light">"Standby. Engage microphone to transcribe telemetry commands..."</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isRecording && (
          <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
            <span>MUTATION PARSE: SYNCED</span>
            <span>VOICE COGNITION: ENABLED</span>
          </div>
        )}
      </div>

    </div>
  );
}
