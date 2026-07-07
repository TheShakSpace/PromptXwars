# ✍️ Helios AI Prompt Engineering & Compilation Guide

Helios strictly forbids inline or hardcoded prompt templates. All prompts must be managed within the `/src/prompts/` layer.

---

## 🏛️ Compilation Architecture

When compiling instructions, the `UniversalPromptEngine` merges multiple files to create a unified cognitive context:

```
[System Instruction]   +   [Industry Role Card]   +   [Knowledge Context]   +   [User Input]   +   [Output Template]
```

---

## 📂 Prompt Registry folders

- `/src/prompts/systemPrompts.ts`: Direct core behaviors and code logic guidelines for agents (e.g. Coder, Researcher, Planner).
- `/src/prompts/rolePrompts.ts`: Industry specific guidelines that adapt the voice (e.g. Clinical Officer, Quantitative Architect, Legal Counsel).
- `/src/prompts/outputTemplates.ts`: Forces exact structuring constraints (e.g. SOAP Notes, executive markdown, nested JSON logs).

---

## ⚡ Code Integration Example

```typescript
import { UniversalPromptEngine } from "../prompts/promptEngine";

const finalInstruction = UniversalPromptEngine.compilePrompt(
  "research", // systemKey
  { query: "Analyze patient history", context: "Patient age 45, BP 120/80", industry: "healthcare" }, // variables
  "clinical_soap" // outputTemplateKey
);
```
