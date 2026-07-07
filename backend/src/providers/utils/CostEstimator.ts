/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderConfig } from "../config/ProviderConfig";

export class CostEstimator {
  /**
   * Calculates the estimated USD cost of a model execution.
   */
  static calculateCost(modelId: string, inputTokens: number, outputTokens: number): number {
    const model = ProviderConfig.getModel(modelId);
    if (!model) {
      return 0; // Unknown models default to 0 cost
    }

    const inputCost = (inputTokens / 1_000_000) * model.inputCostPerMillion;
    const outputCost = (outputTokens / 1_000_000) * model.outputCostPerMillion;

    return Number((inputCost + outputCost).toFixed(8));
  }
}
