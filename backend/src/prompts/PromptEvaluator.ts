/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EvaluationResult {
  scores: {
    clarity: number; // 0-100
    completeness: number; // 0-100
    specificity: number; // 0-100
    reasoning: number; // 0-100
    safety: number; // 0-100
    overall: number; // 0-100
  };
  metrics: {
    wordCount: number;
    estimatedTokens: number;
    hasFormattingDirectives: boolean;
    hasNegativeConstraints: boolean;
    hasPersonaDef: boolean;
  };
  recommendations: string[];
}

export class PromptEvaluator {
  /**
   * Evaluates a prompt text against core linguistic and structural dimensions.
   */
  static evaluate(prompt: string): EvaluationResult {
    const cleanPrompt = prompt.trim();
    const recommendations: string[] = [];

    if (cleanPrompt.length === 0) {
      return {
        scores: { clarity: 0, completeness: 0, specificity: 0, reasoning: 0, safety: 100, overall: 0 },
        metrics: { wordCount: 0, estimatedTokens: 0, hasFormattingDirectives: false, hasNegativeConstraints: false, hasPersonaDef: false },
        recommendations: ["Prompt is completely empty. Please supply instructions."]
      };
    }

    const words = cleanPrompt.split(/\s+/);
    const wordCount = words.length;
    // Standard rule: 1 word ~ 1.33 tokens
    const estimatedTokens = Math.ceil(wordCount * 1.33);

    // 1. Evaluate Clarity
    // Clarity check: presence of action verbs or explicit directives
    const actionVerbs = /\b(create|generate|analyze|explain|summarize|translate|review|write|refactor|build|evaluate)\b/i;
    let clarityScore = 50;
    if (actionVerbs.test(cleanPrompt)) clarityScore += 30;
    if (wordCount > 15) clarityScore += 20;
    clarityScore = Math.min(clarityScore, 100);

    if (clarityScore < 75) {
      recommendations.push("Enhance Clarity: Add active command verbs (e.g., 'Analyze', 'Generate', 'Review') at the start of instructions to declare explicit goals.");
    }

    // 2. Evaluate Completeness
    // Completeness check: presence of contextual elements or structured frames
    const contextIndicators = /(context|background|reference|scenario|role|persona|user)/i;
    const structureIndicators = /(format|markdown|json|output|schema|structure)/i;
    let completenessScore = 40;
    if (contextIndicators.test(cleanPrompt)) completenessScore += 30;
    if (structureIndicators.test(cleanPrompt)) completenessScore += 30;
    completenessScore = Math.min(completenessScore, 100);

    if (!structureIndicators.test(cleanPrompt)) {
      recommendations.push("Enhance Completeness: Provide clear guidelines regarding the target output structure or schema (e.g., Markdown, JSON, Bullet points).");
    }
    if (!contextIndicators.test(cleanPrompt)) {
      recommendations.push("Enhance Completeness: Define a background scenario or supply reference source blocks for the model to ground its response.");
    }

    // 3. Evaluate Specificity
    // Specificity check: presence of limiters, numbers, lists, or negative constraints
    const negativeConstraints = /\b(do not|never|avoid|except|without|limit|limits|restrict|constraint|constraints|bounds)\b/i;
    const specificityIndicators = /\b(exactly|specifically|must|require|example|scenario|rules)\b/i;
    let specificityScore = 40;
    if (negativeConstraints.test(cleanPrompt)) specificityScore += 30;
    if (specificityIndicators.test(cleanPrompt)) specificityScore += 30;
    specificityScore = Math.min(specificityScore, 100);

    if (!negativeConstraints.test(cleanPrompt)) {
      recommendations.push("Enhance Specificity: Detail negative constraints (e.g., 'Do not mention X', 'Avoid Y') to outline the boundaries of acceptable answers.");
    }

    // 4. Evaluate Reasoning Quality
    // Reasoning check: triggers for chain-of-thought, thinking, explanations, reasoning
    const reasoningTriggers = /\b(think step-by-step|reasoning|explain your reasoning|step-by-step|first analyze|rationale|thought process)\b/i;
    let reasoningScore = 30;
    if (reasoningTriggers.test(cleanPrompt)) {
      reasoningScore = 100;
    } else if (wordCount > 80) {
      reasoningScore = 60;
    }

    if (reasoningScore < 70) {
      recommendations.push("Enhance Reasoning: Encourage logical step-by-step thinking by appending explicit triggers (e.g., 'Explain your reasoning step-by-step before answering').");
    }

    // 5. Evaluate Safety
    // Safety check: presence of system prompt safeguards, protection key terms
    const safetyKeywords = /\b(safeguard|sanitize|secure|validate|escape|prevent|injection|unauthorized|filter)\b/i;
    let safetyScore = 80;
    if (safetyKeywords.test(cleanPrompt)) safetyScore = 100;
    // Check for potential vulnerability markers in templates (unbalanced braces)
    const openBraces = (cleanPrompt.match(/\{\{/g) || []).length;
    const closeBraces = (cleanPrompt.match(/\}\}/g) || []).length;
    if (openBraces !== closeBraces) {
      safetyScore = Math.max(20, safetyScore - 50);
      recommendations.push("Enhance Safety: Fix unbalanced brace mappings in your template. Brace counts must align exactly.");
    }

    // Combine into an overall score weighted average
    const overallScore = Math.round(
      clarityScore * 0.25 +
      completenessScore * 0.25 +
      specificityScore * 0.2 +
      reasoningScore * 0.15 +
      safetyScore * 0.15
    );

    return {
      scores: {
        clarity: clarityScore,
        completeness: completenessScore,
        specificity: specificityScore,
        reasoning: reasoningScore,
        safety: safetyScore,
        overall: overallScore
      },
      metrics: {
        wordCount,
        estimatedTokens,
        hasFormattingDirectives: structureIndicators.test(cleanPrompt),
        hasNegativeConstraints: negativeConstraints.test(cleanPrompt),
        hasPersonaDef: contextIndicators.test(cleanPrompt)
      },
      recommendations
    };
  }
}
