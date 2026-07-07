# 🗺️ Helios AI Universal Platform Architecture Guide

Helios is a modular, config-driven commercial AI platform framework. By isolating business datasets, persona instructions, layout specifications, and routing layers from client-side component code, Helios achieves unmatched adaptability.

---

## 🏗️ Architectural Layout

The platform behaves like a compiler, materializing specific domain interfaces on-the-fly:

```
+-------------------------------------------------------------+
|                     platformConfig.ts                       |
|   (Defines vertical industry, active models, active tabs)   |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                      DatasetManager                         |
|   (Resolves metrics, checklists, and charts from JSON)      |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                       LayoutEngine                          |
|   (Dynamic Bento Grid, ChartEngine, FormEngine, TableEngine)|
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                      Workspace Stage                        |
|   (Instantly pivots to Finance, Healthcare, Legal, etc.)    |
+-------------------------------------------------------------+
```

---

## 🔌 Modules & Plugins

Every screen is treated as an isolated, sandboxed **Module**. 
- Enabled/disabled dynamically via `platformConfig.modules`.
- Exposes clean interfaces for tool calls, prompt overrides, and state syncs.
- Allows seamless switching between **Immersive Cinematic** and **Enterprise Workspace** modes without layout shifting.

---

## 💾 Core Principles

1. **State Isolation**: React local state is used exclusively for transient visual properties. Business logic, model histories, telemetries, and workflow steps are held in standalone, specialized Zustand stores.
2. **Strict Type Safety**: All domain contracts (models, layout categories, workflow stages) are typed explicitly inside `/src/types/index.ts`.
3. **Redundant Failbacks**: Active WebGL/Spline canvas layers have a defensive 4-second timeout that self-heals, defaulting to high-fidelity SVG/Canvas animations on low-power clients.
