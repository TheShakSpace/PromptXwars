/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const outputTemplates: Record<string, string> = {
  markdown_brief: `---
HELIOS OPERATOR BRIEFING
---
# Executive Summary
[Provide summary here]

## Analytical Framework
[Identify core vectors]

## Execution Plan & Milestones
- [ ] Phase 1
- [ ] Phase 2

---
Telemetry Verified.`,

  diagnostic_json: `{
  "systemStatus": "COMPLETED",
  "confidenceScore": 0.984,
  "executionDurationMs": 1420,
  "diagnosticVector": [],
  "mitigationRecommendation": ""
}`,

  clinical_soap: `# CLINICAL EVALUATION NOTE
**S (Subjective):** [Chief complaints and history]
**O (Objective):** [Vital metrics and observed values]
**A (Assessment):** [Clinical synthesis, ICD-11 reference]
**P (Plan):** [Prescription, monitoring, recommended diagnostic tests]`,
};
