/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import generalData from "./generalData.json";
import healthcareData from "./healthcareData.json";
import financeData from "./financeData.json";
import { platformConfig } from "../config/platformConfig";

export interface IndustryData {
  stats: {
    id: string;
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    metricType: string;
  }[];
  tasks: {
    id: string;
    text: string;
    completed: boolean;
    date: string;
  }[];
  charts: {
    timestamp: string;
    throughput: number;
    latency: number;
    tokens: number;
  }[];
}

export class DatasetManager {
  /**
   * Retrieves the structured dataset corresponding to the active configuration industry.
   */
  public static getActiveData(): IndustryData {
    const industry = platformConfig.activeIndustry;
    switch (industry) {
      case "healthcare":
        return healthcareData as IndustryData;
      case "finance":
        return financeData as IndustryData;
      case "general":
      default:
        return generalData as IndustryData;
    }
  }
}
