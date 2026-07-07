/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("*"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 mins
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  
  // AI Configs
  DEFAULT_MODEL_PROVIDER: z.string().default("google"),
  DEFAULT_MODEL_NAME: z.string().default("gemini-2.5-flash"),
  GEMINI_API_KEY: z.string().optional(),
  
  // Upload Configs
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(20),
  UPLOAD_DIR: z.string().default("uploads"),
  ALLOWED_FILE_TYPES: z.array(z.string()).default([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/csv",
    "application/json",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/zip"
  ]),

  // Export Configs
  EXPORT_DIR: z.string().default("exports"),
});

const parsed = configSchema.safeParse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  API_PREFIX: process.env.API_PREFIX,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
  DEFAULT_MODEL_PROVIDER: process.env.DEFAULT_MODEL_PROVIDER,
  DEFAULT_MODEL_NAME: process.env.DEFAULT_MODEL_NAME,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MAX_UPLOAD_SIZE_MB: process.env.MAX_UPLOAD_SIZE_MB,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  EXPORT_DIR: process.env.EXPORT_DIR,
  // Parse allowed file types if passed in env
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES 
    ? process.env.ALLOWED_FILE_TYPES.split(",") 
    : undefined,
});

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:", parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
