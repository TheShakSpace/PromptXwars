/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { JwtService, TokenPayload } from "../services/jwt.service";
import { userService } from "../../users/services/user.service";
import { UnauthorizedError, AppError } from "../../errors/customErrors";
import { User, UserRole } from "../types";

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      avatar: string;
      provider: "local" | "google" | "github";
      role: UserRole;
      createdAt: string;
      updatedAt: string;
      preferences: {
        theme: "light" | "dark" | "system";
        language: string;
        timezone: string;
        notifications: {
          email: boolean;
          push: boolean;
          marketing: boolean;
        };
        aiPreferences: {
          defaultProvider: string;
          defaultModel: string;
          temperature: number;
          maxTokens: number;
        };
      };
      subscription: {
        status: "active" | "inactive" | "trial" | "canceled";
        plan: "free" | "developer" | "enterprise";
        expiresAt: string | null;
      };
      settings: {
        privacy: {
          shareDataForTraining: boolean;
          publicProfile: boolean;
        };
        accessibility: {
          screenReaderSupport: boolean;
          highContrastMode: boolean;
          reducedMotion: boolean;
        };
      };
    }
    interface Request {
      user?: User;
      tokenPayload?: TokenPayload;
    }
  }
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // 2. Check HTTP-only Cookies
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").reduce((acc, current) => {
        const [key, val] = current.trim().split("=");
        acc[key] = val;
        return acc;
      }, {} as Record<string, string>);
      token = cookies["accessToken"];
    }

    if (!token) {
      throw new UnauthorizedError("Authentication token is missing. Please log in.");
    }

    const payload = JwtService.verifyAccessToken(token);
    const user = await userService.getById(payload.userId);
    
    if (!user) {
      throw new UnauthorizedError("Associated user profile is inactive or deleted.");
    }

    const { password: _, ...safeUser } = user;
    req.user = safeUser;
    req.tokenPayload = payload;

    next();
  } catch (err: any) {
    next(new UnauthorizedError(err.message || "Invalid or expired token"));
  }
}

export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required for role verification"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(`Forbidden: Access restricted. Required role(s): [${roles.join(", ")}]`, 403));
      return;
    }

    next();
  };
}

export function requireSubscriptionPlan(plan: "free" | "developer" | "enterprise") {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required for subscription verification"));
      return;
    }

    const tierHierarchy = { free: 0, developer: 1, enterprise: 2 };
    const userPlan = req.user.subscription.plan;
    
    if (tierHierarchy[userPlan] < tierHierarchy[plan]) {
      next(new AppError(`Forbidden: This operation requires a [${plan.toUpperCase()}] subscription plan or higher.`, 403));
      return;
    }

    next();
  };
}
