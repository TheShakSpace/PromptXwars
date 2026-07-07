# 🪐 Helios AI JSON Workflow Engine Guide

Helios includes a highly sophisticated, JSON-driven cognitive workflow executor. Instead of hardcoding multi-stage agent pipelines inside frontend buttons, workflows are described as data models.

---

## 📋 JSON Pipeline Schema

A workflow consists of serial or parallel steps executing with designated prompts, tools, and expected latencies:

```json
{
  "id": "clinical-synthesis",
  "name": "HIPAA Clinical SOAP Synthesis",
  "industry": "healthcare",
  "description": "Extract clinical vitals, check interactions, and output structured SOAP summaries.",
  "steps": [
    { 
      "id": "vital-extract", 
      "name": "Vital Metric Ingestion (OCR)", 
      "agentId": "researcher", 
      "toolId": "ocr", 
      "promptKey": "research", 
      "expectedDuration": "600ms" 
    },
    { 
      "id": "soap-compile", 
      "name": "Structured Clinical Note Generation", 
      "agentId": "planner", 
      "promptKey": "default", 
      "outputTemplateKey": "clinical_soap", 
      "expectedDuration": "1100ms" 
    }
  ]
}
```

---

## ⚡ Execution Sequence

When `UniversalWorkflowEngine.executeWorkflow(templateId, query)` is called:
1. The engine fetches the workflow steps from the templates database.
2. The global `useWorkflowStore` is reset, showing the steps on the visual timeline.
3. The engine loops over steps, compiling the system and role instructions using the **Prompt Engine**.
4. Steps are executed, tool payloads are simulated/called, and progress is logged in real-time to the operator telemetry deck.
