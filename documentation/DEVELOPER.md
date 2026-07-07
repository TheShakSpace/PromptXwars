# 🚀 Helios AI Rapid Developer & Hackathon Pivot Checklist

When a new hackathon challenge or commercial requirement arrives, follow this checklist to pivot the entire operating system in under 5 minutes.

---

## ⚡ Step-by-Step Pivot Checklist

### 1️⃣ Update Platform Branding
Open `/src/branding/branding.json` and adjust:
- `platformName`: The brand name (e.g. "Cerebro Healthcare")
- `activeTheme`: Visual feel ("cyber", "minimal", "glass", "light")
- `accentColor`: Hex color accent (e.g. "#10B981" for green)

### 2️⃣ Select Industry Focus
Open `/src/config/platformConfig.ts` and change:
- `activeIndustry`: Set to `"healthcare"`, `"finance"`, `"legal"`, `"cybersecurity"`, or `"general"`.

### 3️⃣ Define Prompt Presets & System Personas
If you need custom prompts or specialized output formatting:
1. Register your persona instructions inside `/src/prompts/rolePrompts.ts`.
2. Add any expected output formats (like specific JSON response shapes) into `/src/prompts/outputTemplates.ts`.

### 4️⃣ Describe Agent Workflows
Open `/src/workflows/workflowTemplates.ts` and add a new template describing the agentic steps, tools, and expectations. This instantly compiles a beautiful step-by-step visual tracker on the frontend dashboard without touching CSS or HTML!

### 5️⃣ Load Static / Live Datasets
Open `/src/datasets/` and add your project dataset:
1. Define statistics cards, checklists, and charts under your vertical's JSON file.
2. Ensure it is registered inside `/src/datasets/datasetManager.ts`.

---

## 🛠️ Verification Commands

Run the following scripts from the root directory to verify system integrity and compile clean static artifacts:

```bash
# Validate TypeScript and run code linter
npm run lint

# Compile production-ready React build
npm run build
```
The entire interface will automatically adapt based on your configurations. No custom components required!
