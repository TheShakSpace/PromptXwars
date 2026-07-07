/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from "express";

export interface StandardResponsePayload<T = any> {
  success: boolean;
  message: string;
  data?: T;
  metadata?: Record<string, any>;
  timestamp: string;
}

export class ResponseFormatter {
  public static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    metadata?: Record<string, any>
  ): Response<StandardResponsePayload<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  public static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: any,
    metadata?: Record<string, any>
  ): Response<StandardResponsePayload> {
    return res.status(statusCode).json({
      success: false,
      message,
      data: details ? { details } : undefined,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }
}
