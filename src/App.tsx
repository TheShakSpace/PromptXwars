/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { OSProvider, useOS } from "./contexts/OSContext";
import { IntroProvider, useIntro, IntroState } from "./contexts/IntroContext";
import { SceneManager } from "./components/intro/SceneManager";
import { OSMode } from "./types";
import { CustomCursor } from "./components/common/cursor/CustomCursor";
import { Navbar } from "./components/common/navbar/Navbar";
import { Sidebar } from "./components/common/sidebar/Sidebar";
import { AITerminal } from "./components/common/terminal/AITerminal";
import { SplineViewer } from "./components/common/spline/SplineViewer";
import { Hero } from "./components/sections/landing/Hero";
import { OSWorkspace } from "./components/sections/workspace/OSWorkspace";
import { StatsOverview } from "./components/sections/dashboard/StatsOverview";
import { Dashboard } from "./components/sections/dashboard/Dashboard";
import { useLenis } from "./hooks/useLenis";
import { motion, AnimatePresence } from "motion/react";

// Inner core app block to consume context
function AppContent() {
  const { mode } = useOS();
  const { currentState } = useIntro();
  
  // Enable Lenis smooth scrolling for immersive mode, disable for fixed workspace panels
  const isImmersive = mode === OSMode.IMMERSIVE;
  useLenis(isImmersive);

  // Keep application layout hidden or blurred until the intro gets to HERO/COMPLETED state
  const isIntroPlaying = currentState !== IntroState.HERO && currentState !== IntroState.COMPLETED;

  return (
    <div className="relative min-h-screen text-white select-none overflow-x-hidden">
      
      {/* 1. Custom Hardware Cursor */}
      <CustomCursor />

      {/* 2. Cinematic AI OS Initializer Intro Sequencer */}
      <SceneManager />

      {/* 3. Global Floating Header */}
      {!isIntroPlaying && isImmersive && <Navbar />}

      {/* 4. Synaptic AI Shell Terminal Overlay (Cmd+K) */}
      {!isIntroPlaying && <AITerminal />}

      {/* 5. Spatial 3D Backdrop (Primary Spline Render with Canvas Bypasses) */}
      <div className="fixed inset-0 w-full h-full -z-20">
        <SplineViewer />
      </div>

      {/* Ambient background spatial grid overlays */}
      <div className="fixed inset-0 bg-[#050505]/40 backdrop-blur-[1px] pointer-events-none -z-10" />

      {/* 6. Dynamic Layout Routing */}
      <main className="relative min-h-screen">
        <AnimatePresence mode="wait">
          {!isIntroPlaying && (
            isImmersive ? (
              <motion.div
                key="immersive-view"
                initial={{ opacity: 0, filter: "blur(15px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full flex flex-col"
              >
                {/* Immersive Modular Landing Experience */}
                <Hero />
              </motion.div>
            ) : (
              <motion.div
                key="workspace-view"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full relative"
              >
                <Dashboard />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <IntroProvider>
        <AppContent />
      </IntroProvider>
    </OSProvider>
  );
}
