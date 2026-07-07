/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolMetadata, ToolHealthState } from "./types";
import { z } from "zod";

export abstract class BaseTool<TInput = any, TOutput = any> {
  public abstract readonly metadata: ToolMetadata;
  protected isCancelled = false;

  /**
   * Initializes the tool (e.g. setting up clients, loading data files)
   */
  public async initialize(): Promise<void> {
    this.isCancelled = false;
    this.metadata.status = "Healthy";
  }

  /**
   * Validates the input payload using Zod or custom logic.
   * If a custom Zod schema is returned by getSchema(), it validates against it.
   */
  public async validate(input: any): Promise<TInput> {
    const schema = this.getZodSchema();
    if (schema) {
      return schema.parse(input) as TInput;
    }
    return input as TInput;
  }

  /**
   * Core execution method that must be implemented by concrete tools.
   */
  public abstract execute(input: TInput, context?: any): Promise<TOutput>;

  /**
   * Cancels any active/long-running execution inside this tool.
   */
  public async cancel(): Promise<void> {
    this.isCancelled = true;
  }

  /**
   * Runs a health check on the tool to update its status.
   */
  public async healthCheck(): Promise<ToolHealthState> {
    return this.metadata.status;
  }

  /**
   * Gracefully shuts down the tool (e.g. closing database connections)
   */
  public async shutdown(): Promise<void> {
    this.metadata.status = "Offline";
  }

  /**
   * Get the Zod schema for input validation. Tools should override this if they support Zod validation.
   */
  protected getZodSchema(): z.ZodSchema | null {
    return null;
  }
}
