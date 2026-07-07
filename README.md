# 🪐 Helios AI | Autonomous Synaptic OS Interface

Helios is a world-class, production-ready, GPU-accelerated immersive desktop experience designed for next-generation intelligence orchestration. Powered by React 19, Vite 6, Tailwind CSS v4, and dynamic Zustand stores, Helios sets a new standard for fast, resilient, and beautiful AI computing environments.

---

## 💎 Design Philosophy & Core Principles

At Helios, we reject generic UI slop and cookie-cutter dashboard frameworks. Every layout boundary, animation curve, and sound effect is mathematically optimized to feel tactile, architectural, and highly responsive:

- **Architectural Honesty**: No decoration for decoration's sake. Borders reflect actual hardware compilation bounds; layout lines trace GPU and Web Audio API initialization progress.
- **Micro-Interactive Soundscapes**: Subtle mechanical tap feedback, swoosh transitions, and futuristic cyber alerts are synthesized dynamically in the browser using raw Web Audio API oscillators—requiring zero network asset fetches.
- **Space-Grade Contrast & Typography**: High-contrast slate color palettes (`#050505`) paired with gorgeous `Geist` & `Space Grotesk` display typography ensure WCAG AA accessibility compliance under any lighting.

---

## 📂 Modular File Architecture

```
src/
├── App.tsx                       # Main application entry and global error boundary wrappers
├── main.tsx                      # Runtime initialization with React 19 concurrent features
├── index.css                     # Global Tailwind CSS v4 utility custom theme layer
│
├── store/                        # Consolidated, modular state architecture (Zustand)
│   ├── index.ts                  # Central store exports
│   ├── uiStore.ts                # Sidebar navigation, Solo/Terminal windows, layouts
│   ├── themeStore.ts             # Light/Dark tokens, reduced motion hooks
│   ├── animationStore.ts         # GPU haptic rates, particle density multipliers
│   ├── workspaceStore.ts         # Active models, preset system instruction profiles
│   ├── chatStore.ts              # Immersive chat, neural stream tokens
│   ├── workflowStore.ts          # Step executions and active deployments
│   ├── settingsStore.ts          # Advanced diagnostic flags and sound volume bounds
│   ├── notificationStore.ts      # Telemetry toast queues
│   ├── memoryStore.ts            # Key-value memories, confidence metrics, and context logs
│   └── historyStore.ts           # Shell command interpreters and terminal histories
│
├── contexts/                     # Backwards-compatible legacy bridge layers
│   ├── OSContext.tsx             # Context bridge feeding into high-speed Zustand stores
│   └── IntroContext.tsx          # Boot sequence & cinematic audio generator context
│
├── animations/                   # Advanced orchestration systems (GSAP / Framer Motion)
│   ├── AnimationProvider.tsx     # Context, scroll triggers, and haptic loop registers
│   ├── BackgroundLayers.tsx      # Multi-layered glowing vector backdrops
│   ├── TransitionManager.tsx     # 3D Lens-Shift component routing transitions
│   └── MotionHooks.ts            # Physics-based spring and haptic feedback hooks
│
├── components/                   # Production-grade encapsulated components
│   ├── common/
│   │   ├── error/                # GlobalErrorBoundary component with stack analytics
│   │   ├── offline/              # OfflineIndicator with connectivity listeners
│   │   ├── spline/               # GPU Spline viewer with Canvas orbital particle fallbacks
│   │   ├── terminal/             # Interactive diagnostic shell console
│   │   └── cursor/               # Custom hardware-accelerated cursor
│   │
│   ├── intro/                    # Cinematic boot, glitch, and matrix scene managers
│   └── sections/
│       ├── landing/              # Immersive state presentation panels
│       ├── workspace/            # Structured, bento-grid multi-agent workspaces
│       └── dashboard/            # System metrics, real-time telemetry, & Design System
│
├── types/
│   └── index.ts                  # Shared strictly-typed domain contract declarations
│
└── utils/
    └── cn.ts                     # High-performance CSS class merger utilities
```

---

## ⚡ Performance & Resilience Architecture

### 🛡️ 1. GPU Pipeline Fallbacks (Resilient Spline Viewer)
Spline 3D canvas rendering can be brittle inside isolated sandboxes or low-end hardware. Helios solves this with a **triple-redundant loading pipeline**:
- **Defensive Timeout Budget (4000ms)**: If WASM compilation or Spline resources take more than 4 seconds, the view immediately self-heals by switching to a beautiful local canvas simulation.
- **Global Error Interceptors**: Real-time error and unhandled rejection listeners catch underlying WebGL or out-of-buffer memory leaks, self-remediating the layout without showing a blank screen.
- **3D Orbital Particle Canvas Fallback**: When activated, a local 2D context draws physical orbital gravitational networks with glowing AI Core centers, giving users a mesmerizing and fully responsive experience on any browser.

### 🔌 2. Offline Signals & Local Recovery
An elegant, non-blocking `OfflineIndicator` listens to real-time `window.online` and `window.offline` socket states:
- If connections drop, Helios redirects telemetry to local cache memory, alerts the user, and prompts key action bypasses.
- When signals return, the indicator provides a synchronized haptic success chime and silently updates the workspace.

### 🩺 3. Central Error Boundaries
The entire layout is protected by a premium Stripe-style `GlobalErrorBoundary` that isolates exceptions, displays interactive stack trace telemetry, and provides a single-click **OS Kernel Reboot** option to flush memory and reload safely.

---

## 🚀 DevOps & Deployment Guides

Helios is prepared out-of-the-box for production scale. Choose your target environment:

### 🌟 1. Vercel / Netlify
Vercel handles React-19 Single Page Applications natively. Standard deployments automatically utilize the Vite configuration to build statically into `dist/`.
```bash
# Clean install, build, and deploy
npm run clean
npm run build
vercel --prod
```

### 🐳 2. Docker / Cloud Run (Full-Stack Container)
The container setup supports bundling custom production web servers. Customize the included Dockerfile:
```dockerfile
# Use Node alpine container
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "preview"]
```
Build and run the container:
```bash
docker build -t helios-interface .
docker run -p 3000:3000 helios-interface
```

---

## 🛠️ Developer Protocol

- **Adding a Store**: Create a new Zustand store under `src/store/` and register its exports in `src/store/index.ts`.
- **Modifying Icons**: Import from `lucide-react` exclusively. Do not write raw SVG icon templates.
- **Theme Adjustments**: Edit theme variables dynamically inside the Tailwind `@theme` tag in `src/index.css`. This ensures compile-time token optimization.
