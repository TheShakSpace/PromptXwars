/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { RateLimitError } from "../errors/customErrors";
import { config } from "../config";

interface ClientRateLimitState {
  requests: number;
  resetTime: number;
}

const clientLimitMap = new Map<string, ClientRateLimitState>();

// Periodically clean up expired records to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, state] of clientLimitMap.entries()) {
    if (now > state.resetTime) {
      clientLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
  const now = Date.now();

  let clientState = clientLimitMap.get(ip);

  if (!clientState || now > clientState.resetTime) {
    clientState = {
      requests: 1,
      resetTime: now + config.RATE_LIMIT_WINDOW_MS,
    };
    clientLimitMap.set(ip, clientState);
    next();
    return;
  }

  clientState.requests += 1;

  if (clientState.requests > config.RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((clientState.resetTime - now) / 1000);
    res.setHeader("Retry-After", retryAfterSeconds);
    next(new RateLimitError(`Too many requests from IP ${ip}. Please try again in ${retryAfterSeconds} seconds.`));
    return;
  }

  next();
}
