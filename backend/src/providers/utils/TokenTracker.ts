/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class TokenTracker {
  /**
   * Generates a fast, defensive heuristic-based token estimate when a model does not provide native token counts.
   * On average, for English, 1 token is approximately 4 characters.
   */
  static estimateTokenCount(text: string): number {
    if (!text) return 0;
    
    // Trim and handle whitespace
    const trimmed = text.trim();
    if (trimmed.length === 0) return 0;

    // Approximate token count: 1 token per 4 characters, with word-boundary weight adjustments
    const charCount = trimmed.length;
    const wordCount = trimmed.split(/\s+/).length;

    // Blend of words and characters for higher precision across code and text
    const estimate = Math.ceil((charCount / 4 + wordCount * 0.75) / 1.5);
    return Math.max(1, estimate);
  }
}
