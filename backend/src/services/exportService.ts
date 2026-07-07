/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { config } from "../config";
import { ValidationError } from "../errors/customErrors";

const exportPath = path.resolve(config.EXPORT_DIR);
if (!fs.existsSync(exportPath)) {
  fs.mkdirSync(exportPath, { recursive: true });
}

export class ExportService {
  public static async generateExport(
    type: "json" | "csv" | "markdown" | "pdf",
    data: any,
    fileNamePrefix: string = "export"
  ): Promise<{ filePath: string; fileName: string; mimeType: string }> {
    const timestamp = Date.now();
    let fileName = "";
    let fileContent = "";
    let mimeType = "";

    switch (type) {
      case "json":
        fileName = `${fileNamePrefix}-${timestamp}.json`;
        fileContent = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        break;

      case "csv":
        fileName = `${fileNamePrefix}-${timestamp}.csv`;
        fileContent = this.convertToCSV(data);
        mimeType = "text/csv";
        break;

      case "markdown":
        fileName = `${fileNamePrefix}-${timestamp}.md`;
        fileContent = this.convertToMarkdown(data);
        mimeType = "text/markdown";
        break;

      case "pdf":
        // PDF production implementation uses a structured printable mock PDF since true PDF compiles are heavy.
        fileName = `${fileNamePrefix}-${timestamp}.pdf`;
        fileContent = `--- HELIOS AI PLATFORM COGNITIVE AUDIT --- \nGenerated At: ${new Date().toISOString()}\nPayload:\n${JSON.stringify(data, null, 2)}`;
        mimeType = "application/pdf";
        break;

      default:
        throw new ValidationError(`Unsupported export output type: ${type}`);
    }

    const filePath = path.join(exportPath, fileName);
    await fs.promises.writeFile(filePath, fileContent, "utf-8");

    return {
      filePath,
      fileName,
      mimeType,
    };
  }

  private static convertToCSV(data: any): string {
    if (!data) return "";
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) return "";

    const headers = Object.keys(items[0]);
    const csvRows = [headers.join(",")];

    for (const item of items) {
      const values = headers.map((header) => {
        const val = item[header];
        const strVal = typeof val === "object" ? JSON.stringify(val) : String(val);
        // Escape quotes
        return `"${strVal.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }

  private static convertToMarkdown(data: any): string {
    if (!data) return "";
    let md = `# HELIOS COGNITIVE EXPORT REPORT\n\n`;
    md += `**Date:** ${new Date().toLocaleString()}\n\n`;

    if (Array.isArray(data)) {
      md += `## Record List\n\n`;
      data.forEach((item, idx) => {
        md += `### Item ${idx + 1}\n`;
        for (const [key, val] of Object.entries(item)) {
          md += `- **${key}:** ${typeof val === "object" ? JSON.stringify(val) : val}\n`;
        }
        md += `\n`;
      });
    } else if (typeof data === "object") {
      md += `## Metadata parameters\n\n`;
      for (const [key, val] of Object.entries(data)) {
        md += `- **${key}:** ${typeof val === "object" ? JSON.stringify(val) : val}\n`;
      }
    } else {
      md += `${data}`;
    }

    return md;
  }
}
