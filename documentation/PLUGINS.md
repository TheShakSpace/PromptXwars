# 🔌 Helios AI Plugin and Tools Guide

Helios treats external models, automation tools, and cognitive agents as swappable plugins. 

---

## 🛠️ Tool Abstraction

All functional components interface with a centralized Tool Orchestrator. To declare a custom tool, add its definition inside `platformConfig.tools`:

```typescript
export interface ToolPluginConfig {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isEnabled: boolean;
}
```

### Supported Core Engines
- **Vision OCR Parser**: Extracts text/vitals from images.
- **Deep Web Retrieval**: Live web searches using standard temporal keys.
- **Computational Engine**: Solves algebraic and algorithmic calculations.
- **Durable Cloud Sync**: Handles offline-first client replication.

---

## 🤖 Dynamic Agent System

Agents are structured cognitive wrappers that utilize prompt templates and specific tool permissions:

```typescript
export interface AgentPluginConfig {
  id: string;
  name: string;
  description: string;
  avatarIcon: string;
  systemPromptPresetId: string;
  isEnabled: boolean;
  isExperimental: boolean;
}
```

To enable or disable an agent across the platform, toggle the `isEnabled` property in `platformConfig.ts`. The sidebar and prompt terminals will immediately adapt.
