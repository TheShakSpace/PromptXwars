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
import { HeroSection } from "./components/sections/landing/HeroSection";
import { FeatureGrid } from "./components/sections/landing/FeatureGrid";
import { OSWorkspace } from "./components/sections/workspace/OSWorkspace";
import { StatsOverview } from "./components/sections/dashboard/StatsOverview";
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
      {!isIntroPlaying && <Navbar />}

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
                {/* Landing Sections */}
                <div className="relative w-full">
                  <HeroSection />
                </div>
                <div className="relative w-full bg-[#050505]/65 backdrop-blur-3xl border-t border-white/5 shadow-2xl">
                  <FeatureGrid />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="workspace-view"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full min-h-screen pt-24 px-6 flex flex-col lg:flex-row gap-6 relative"
              >
                {/* Left Side control rail */}
                <Sidebar />

                {/* Main dashboard work area */}
                <div className="flex-1 lg:pl-86">
                  {mode === OSMode.WORKSPACE ? (
                    <OSWorkspace />
                  ) : (
                    <StatsOverview />
                  )}
                </div>
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
