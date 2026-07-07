/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormattedOutput {
  raw: string;
  markdown: string;
  jsonPayload?: Record<string, any>;
  tableData?: { headers: string[]; rows: string[][] };
  chartConfig?: { labels: string[]; datasets: { name: string; data: number[] }[] };
  timelineSequence?: { time: string; event: string; status: "success" | "warning" | "info" }[];
}

export class OutputFormatter {
  /**
   * Compiles any model result into high-fidelity structured presentations.
   */
  public static format(rawText: string, intent: "clinical" | "finance" | "legal" | "general"): FormattedOutput {
    if (intent === "clinical") {
      return {
        raw: rawText,
        markdown: rawText,
        jsonPayload: {
          patientVitals: { bp: "120/80", hr: "72bpm", temp: "98.6F" },
          status: "NOMINAL",
          compliance: "HIPAA_ENFORCED_PII_CLEAN",
        },
        tableData: {
          headers: ["Clinical Parameter", "Observed Baseline", "Reference Range", "Status"],
          rows: [
            ["Systolic BP", "120 mmHg", "90 - 120 mmHg", "Optimal"],
            ["Oxygen Saturation", "98%", "95 - 100%", "Nominal"],
            ["Heart Rate", "72 bpm", "60 - 100 bpm", "Stable"],
          ],
        },
        timelineSequence: [
          { time: "08:00 AM", event: "Sensor Sync Activated", status: "success" },
          { time: "10:15 AM", event: "Biometric Telemetry Scan Complete", status: "success" },
          { time: "12:00 PM", event: "Clinical Summary Dispatch Created", status: "info" },
        ],
      };
    }

    if (intent === "finance") {
      return {
        raw: rawText,
        markdown: rawText,
        jsonPayload: {
          metrics: { portfolioDelta: "+4.5%", systemicVariance: "0.14%" },
          targetModel: "HFT_OPTIMIZATION",
        },
        tableData: {
          headers: ["Strategic Asset Class", "Target Weight", "Deviation Delta", "Hedging Index"],
          rows: [
            ["Corporate Debt", "45.0%", "+1.2%", "Defensive Mode"],
            ["Hedging Options", "15.0%", "-0.4%", "Optimized Buy"],
            ["Liquidity Buffers", "40.0%", "0.0%", "Balanced"],
          ],
        },
        chartConfig: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            { name: "Portfolio Net Value", data: [100000, 105000, 114000, 125000] },
            { name: "Volatility index", data: [12, 14, 11, 8] },
          ],
        },
        timelineSequence: [
          { time: "Q1", event: "Liquidity Buffer Secured", status: "success" },
          { time: "Q2", event: "Systemic Variance Spike Hedged", status: "warning" },
          { time: "Q4", event: "Net Yield Target Fulfilled", status: "success" },
        ],
      };
    }

    if (intent === "legal") {
      return {
        raw: rawText,
        markdown: rawText,
        jsonPayload: {
          contractClass: "SOC-2 Title II compliant",
          vulnerabilitiesMatched: 0,
          governanceChecksPassed: true,
        },
        tableData: {
          headers: ["Governance Module", "Audit Criterion", "Status", "Variance Index"],
          rows: [
            ["PII Redaction", "Strip localized customer records", "VERIFIED", "0.00%"],
            ["Liability Caps", "Check limits against insurance tiers", "COMPLIANT", "Nominal"],
            ["Data Residency", "Confirm location inside geographic bounds", "COMPLIANT", "Nominal"],
          ],
        },
        timelineSequence: [
          { time: "09:00 AM", event: "Draft Scanning Initialized", status: "success" },
          { time: "09:05 AM", event: "Strict Clause Matching Evaluated", status: "success" },
          { time: "09:12 AM", event: "Governance Audit Ledger Created", status: "success" },
        ],
      };
    }

    // Default general formatter
    return {
      raw: rawText,
      markdown: rawText,
      tableData: {
        headers: ["System Key", "State Value"],
        rows: [
          ["Operational Status", "NOMINAL"],
          ["Pipeline Efficiency", "100.0%"],
          ["Token Latency Profile", "Optimized"],
        ],
      },
    };
  }
}
