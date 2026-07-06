<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Helios AI — Autonomous Synaptic OS Interface

An immersive, high-performance “AI OS” UI built with **React + TypeScript**, **Tailwind CSS**, and advanced motion/3D effects (GSAP, Framer Motion-style primitives, Lenis, and Spline/Three.js). The UI is designed to feel like a real operating system experience: animated dashboards, interactive panels, and an AI-powered chat/workflow surface.

View your app in AI Studio: https://ai.studio/apps/9657e4db-97f1-4a60-9467-6fb6f9ce7e50

---

## Quick start

### Prerequisites

- **Node.js** (LTS recommended)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure Gemini

This project is wired to Gemini via the **Google GenAI** SDK (`@google/genai`).

Create/set your environment file for local development:

- Set `GEMINI_API_KEY` in `.env.local`

Example (conceptual):

```bash
GEMINI_API_KEY="YOUR_KEY_HERE"
```

> Note: The repository references `.env.local` in the README. If you don’t already have it, create it at the project root.

### 3) Run the dev server

```bash
npm run dev
```

- Dev server runs on **http://localhost:3000**

---

## Scripts

From `package.json`:

- `npm run dev` — start Vite dev server (port **3000**, host `0.0.0.0`)
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
- `npm run lint` — typecheck with `tsc --noEmit`
- `npm run clean` — remove build artifacts (`dist`, `server.js`)

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (fast bundler/dev server)
- **Tailwind CSS v4** (+ `@tailwindcss/vite`)
- **Motion/animation**:
  - `gsap`
  - `motion`
  - `lenis` (smooth scrolling)
- **3D / visuals**:
  - `three`
  - `@splinetool/react-spline` (Spline integration)
- **AI / Gemini**:
  - `@google/genai`
- Utility libs:
  - `clsx`, `tailwind-merge`

---

## Environment variables

### `GEMINI_API_KEY`

Used by the application to authenticate calls to Gemini (via `@google/genai`).

---

## What the app includes (high-level)

This UI is organized around two main experiences:

1. **Landing / intro experience**
   - Hero scenes and interactive background effects
   - Floating cards, spotlight/mouse interactions, client/logo sections, stats, testimonials
   - Intro/scene orchestration under `src/components/intro/*`

2. **Dashboard / OS workspace experience**
   - Dashboard modules: analytics, activity, insights, projects, prompt templates, settings
   - Interactive UX elements: command palette, search overlay, chat panel
   - Workspace state & workflows

### Key code areas

- **Animations**: `src/animations/*`
  - Animation providers, parallax, cursor systems, scroll controller, transition manager, etc.
- **UI components**: `src/components/*`
  - `sections/landing/*` for the marketing/intro visuals
  - `sections/dashboard/*` for the OS-like application interface
  - `common/*` for shared UI (buttons, cards, cursor, terminal UI, offline indicator, error boundary)
- **State management**: `src/store/*`
  - UI, workspace, chat, workflow, settings, notifications, memory/history
- **Contexts**: `src/contexts/*`
  - Intro + OS context orchestration

---

## Deployment notes

- This is a **Vite** project, so production output is produced by `npm run build` and served as static assets.
- Use any static hosting provider (or a simple static file server) for the `dist/` output.
- If you’re deploying to an environment that also supports the AI Studio flow, ensure `GEMINI_API_KEY` is set in the runtime environment used by your hosting platform.

---

## Troubleshooting

### Dev server won’t start

- Ensure Node.js is installed and you can run `node -v`.
- Re-run dependencies:
  ```bash
  npm install
  ```

### App loads but AI features fail

- Verify `GEMINI_API_KEY` is present in `.env.local`.
- If you’re using a platform-specific env system, ensure the variable is defined there instead.

### Port / host issues

- The dev server explicitly listens on `--port=3000 --host=0.0.0.0`.
- If you’re running in a container/VM, make sure port **3000** is exposed.

---

## Development workflow tips

- When iterating on UI/animation behavior, prefer starting the dev server once and then using HMR (unless your environment disables it).
- For correctness, use:
  ```bash
  npm run lint
  ```
  which typechecks the codebase.

