/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from "zod";

export class ToolSchemaManager {
  private static instance: ToolSchemaManager;

  private constructor() {}

  public static getInstance(): ToolSchemaManager {
    if (!ToolSchemaManager.instance) {
      ToolSchemaManager.instance = new ToolSchemaManager();
    }
    return ToolSchemaManager.instance;
  }

  /**
   * Compiles a standard simplified JSON Schema into a Zod schema.
   */
  public compileJsonSchema(jsonSchema: Record<string, any>): z.ZodSchema {
    if (!jsonSchema || Object.keys(jsonSchema).length === 0) {
      return z.any();
    }

    const type = jsonSchema.type || "object";

    if (type === "object") {
      const properties = jsonSchema.properties || {};
      const required = jsonSchema.required || [];
      const shape: Record<string, z.ZodTypeAny> = {};

      for (const [key, prop] of Object.entries(properties) as [string, any][]) {
        let fieldSchema: z.ZodTypeAny = z.any();

        if (prop.type === "string") {
          fieldSchema = z.string();
          if (prop.description) fieldSchema = fieldSchema.describe(prop.description);
        } else if (prop.type === "number" || prop.type === "integer") {
          fieldSchema = z.number();
          if (prop.description) fieldSchema = fieldSchema.describe(prop.description);
        } else if (prop.type === "boolean") {
          fieldSchema = z.boolean();
          if (prop.description) fieldSchema = fieldSchema.describe(prop.description);
        } else if (prop.type === "array") {
          const itemsType = prop.items?.type || "any";
          if (itemsType === "string") {
            fieldSchema = z.array(z.string());
          } else if (itemsType === "number") {
            fieldSchema = z.array(z.number());
          } else {
            fieldSchema = z.array(z.any());
          }
          if (prop.description) fieldSchema = fieldSchema.describe(prop.description);
        } else if (prop.type === "object") {
          fieldSchema = this.compileJsonSchema(prop);
        }

        if (!required.includes(key)) {
          fieldSchema = fieldSchema.optional();
        }

        shape[key] = fieldSchema;
      }

      return z.object(shape);
    }

    return z.any();
  }

  /**
   * Validates a payload against a JSON schema.
   * Returns parsed value or throws validation error.
   */
  public validate(payload: any, jsonSchema: Record<string, any>): any {
    const zodSchema = this.compileJsonSchema(jsonSchema);
    return zodSchema.parse(payload);
  }
}

export const toolSchemaManager = ToolSchemaManager.getInstance();
