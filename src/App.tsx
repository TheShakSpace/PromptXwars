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

// central animation & sound engine imports
import { AnimationProvider } from "./animations/AnimationProvider";
import { BackgroundLayers } from "./animations/BackgroundLayers";
import { TransitionManager } from "./animations/TransitionManager";

// Production resilience imports
import { GlobalErrorBoundary } from "./components/common/error/ErrorBoundary";
import { OfflineIndicator } from "./components/common/offline/OfflineIndicator";

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
      
      {/* 0. Realtime Network Connection Status Overlay */}
      <OfflineIndicator />

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

      {/* 8-layer hardware accelerated premium atmospheric overlays */}
      <BackgroundLayers />

      {/* 6. Dynamic Layout Routing with 3D Lens Shift Transitions */}
      <main className="relative min-h-screen">
        {!isIntroPlaying && (
          isImmersive ? (
            <TransitionManager stateKey="immersive-view">
              <div className="relative w-full flex flex-col">
                <Hero />
              </div>
            </TransitionManager>
          ) : (
            <TransitionManager stateKey="workspace-view">
              <div className="w-full relative">
                <Dashboard />
              </div>
            </TransitionManager>
          )
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AnimationProvider>
        <OSProvider>
          <IntroProvider>
            <AppContent />
          </IntroProvider>
        </OSProvider>
      </AnimationProvider>
    </GlobalErrorBoundary>
  );
}

