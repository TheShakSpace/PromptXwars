/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/customErrors";
import { ResponseFormatter } from "../utils/responseFormatter";
import { logger } from "../utils/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.headers["x-request-id"] || "unknown";

  if (err instanceof AppError) {
    logger.warn({
      msg: "Operational application error",
      error: err.message,
      statusCode: err.statusCode,
      requestId,
      details: err.details,
    });

    ResponseFormatter.error(
      res,
      err.message,
      err.statusCode,
      err.details,
      { requestId }
    );
    return;
  }

  // Fallback for unhandled developer or database crashes
  logger.error({
    msg: "Unhandled severe system error",
    error: err.message,
    stack: err.stack,
    requestId,
  });

  ResponseFormatter.error(
    res,
    "An unexpected error occurred on the server",
    500,
    process.env.NODE_ENV === "development" ? err.stack : undefined,
    { requestId }
  );
}
