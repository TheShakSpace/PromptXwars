/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseTool } from "./BaseTool";
import { toolSchemaManager } from "./ToolSchemaManager";

export class ToolValidator {
  private static instance: ToolValidator;

  private constructor() {}

  public static getInstance(): ToolValidator {
    if (!ToolValidator.instance) {
      ToolValidator.instance = new ToolValidator();
    }
    return ToolValidator.instance;
  }

  /**
   * Validates the input payload against a tool's defined input schema.
   */
  public async validateInput(tool: BaseTool, input: any): Promise<any> {
    const metadata = tool.metadata;
    
    // First, let the tool's internal validation run
    let validated = await tool.validate(input);

    // Secondly, validate against the published metadata JSON Schema to double guarantee compliance
    if (metadata.supportedInput && Object.keys(metadata.supportedInput).length > 0) {
      validated = toolSchemaManager.validate(validated, metadata.supportedInput);
    }

    return validated;
  }

  /**
   * Validates the tool's output payload against its defined output schema.
   */
  public async validateOutput(tool: BaseTool, output: any): Promise<any> {
    const metadata = tool.metadata;

    if (metadata.supportedOutput && Object.keys(metadata.supportedOutput).length > 0) {
      return toolSchemaManager.validate(output, metadata.supportedOutput);
    }

    return output;
  }
}

export const toolValidator = ToolValidator.getInstance();
