/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { useDemoStore } from "../../../store/demoStore";
import { Play, Eye, Award, Presentation, HelpCircle, Monitor } from "lucide-react";
import { useOS } from "../../../contexts/OSContext";

export function PresentationControls() {
  const {
    isPresentationMode,
    togglePresentationMode,
    setPitchOpen,
    setTourActive,
    setTourStepIndex,
    setJudgeModeOpen,
  } = useDemoStore();

  const { addNotification } = useOS();

  // Listen to Ctrl + Shift + D hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        togglePresentationMode();
        addNotification(
          "Presentation Mode Toggle",
          `Presentation mode is now ${!isPresentationMode ? "active" : "inactive"}. Spacing adjusted.`,
          "info"
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresentationMode, togglePresentationMode, addNotification]);

  return (
    <div className="fixed bottom-6 right-6 z-[90] bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] max-w-sm select-none">
      
      {/* Title / Header Indicator */}
      <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl font-mono text-[8px] text-[#4F8CFF] font-black uppercase shrink-0">
        DEMO CONTROLS
      </div>

      <div className="h-4 w-[1px] bg-white/10" />

      {/* Presentation Layout Switcher */}
      <button
        onClick={() => {
          togglePresentationMode();
          addNotification(
            "Presentation Mode",
            `Presentation layout is now ${!isPresentationMode ? "ACTIVE" : "INACTIVE"}.`,
            "success"
          );
        }}
        className={`p-2 rounded-xl border transition-all cursor-pointer ${
          isPresentationMode
            ? "bg-[#4F8CFF] border-[#4F8CFF] text-black shadow-[0_0_12px_#4F8CFF]"
            : "bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10"
        }`}
        title="Toggle Presentation Spacing (Ctrl + Shift + D)"
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>

      {/* Guided Product Tour */}
      <button
        onClick={() => {
          setTourActive(true);
          setTourStepIndex(0);
          addNotification("Tour Initiated", "Interactive guided tour has started.", "info");
        }}
        className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white transition-all cursor-pointer"
        title="Start Guided Product Tour"
      >
        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
      </button>

      {/* Judge Mode Desk */}
      <button
        onClick={() => {
          setJudgeModeOpen(true);
          addNotification("Judge Suite Active", "Interactive engineering blueprint is open.", "success");
        }}
        className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white transition-all cursor-pointer"
        title="View Judge Mode Specs"
      >
        <Award className="w-3.5 h-3.5 text-emerald-400" />
      </button>

      {/* Pitch Slide Presentation */}
      <button
        onClick={() => {
          setPitchOpen(true);
          addNotification("Pitch Deployed", "Pitch Deck slides have been loaded.", "info");
        }}
        className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white transition-all cursor-pointer"
        title="Open Pitch Slide Overlay"
      >
        <Presentation className="w-3.5 h-3.5 text-purple-400" />
      </button>

    </div>
  );
}
