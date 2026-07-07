/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { authService } from "../../auth/services/auth.service";
import { ResponseFormatter } from "../../utils/responseFormatter";
import { ValidationError, UnauthorizedError } from "../../errors/customErrors";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
});

const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }).optional(),
  aiPreferences: z.object({
    defaultProvider: z.string(),
    defaultModel: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(1),
  }).optional(),
});

const updateSettingsSchema = z.object({
  privacy: z.object({
    shareDataForTraining: z.boolean(),
    publicProfile: z.boolean(),
  }).optional(),
  accessibility: z.object({
    screenReaderSupport: z.boolean(),
    highContrastMode: z.boolean(),
    reducedMotion: z.boolean(),
  }).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const userController = {
  // PATCH /users/profile
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Malformed profile parameters", parsed.error.format());
      }

      const updated = await userService.update(req.user.id, parsed.data);
      const { password: _, ...safeUser } = updated;

      authService.logAudit(req.user.id, "UPDATE_PROFILE", req.ip || "0.0.0.0", req.headers["user-agent"] || "unknown");
      ResponseFormatter.success(res, "Profile metadata updated successfully.", safeUser);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /users/preferences
  updatePreferences: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const parsed = updatePreferencesSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid preferences values", parsed.error.format());
      }

      const updated = await userService.update(req.user.id, { preferences: parsed.data as any });
      const { password: _, ...safeUser } = updated;

      authService.logAudit(req.user.id, "UPDATE_PREFERENCES", req.ip || "0.0.0.0", req.headers["user-agent"] || "unknown");
      ResponseFormatter.success(res, "User preferences updated.", safeUser);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /users/settings
  updateSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const parsed = updateSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid settings payload", parsed.error.format());
      }

      const updated = await userService.update(req.user.id, { settings: parsed.data as any });
      const { password: _, ...safeUser } = updated;

      authService.logAudit(req.user.id, "UPDATE_SETTINGS", req.ip || "0.0.0.0", req.headers["user-agent"] || "unknown");
      ResponseFormatter.success(res, "Account configuration settings updated.", safeUser);
    } catch (err) {
      next(err);
    }
  },

  // POST /users/change-password
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid password parameters", parsed.error.format());
      }

      const { currentPassword, newPassword } = parsed.data;

      // Validate current password (re-fetch user since req.user has no password hashes)
      const user = await userService.getById(req.user.id);
      if (!user || user.provider !== "local" || !user.password) {
        throw new ValidationError("This operation is only supported for local login accounts.");
      }

      const match = await require("bcrypt").compare(currentPassword, user.password);
      if (!match) {
        throw new ValidationError("Your current password is incorrect.");
      }

      await userService.update(user.id, { password: newPassword });

      authService.logAudit(user.id, "CHANGE_PASSWORD_SUCCESS", req.ip || "0.0.0.0", req.headers["user-agent"] || "unknown");
      ResponseFormatter.success(res, "Account password changed successfully.");
    } catch (err) {
      next(err);
    }
  },

  // GET /users/audit-logs
  getAuditLogs: (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const logs = authService.getAuditLogs(req.user.id);
    ResponseFormatter.success(res, "Security event audit logs loaded.", logs);
  },

  // DELETE /users/account
  deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      await userService.delete(req.user.id);
      await authService.logoutAllDevices(req.user.id);

      // Clear cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      ResponseFormatter.success(res, "Your user profile and connected credentials have been wiped.");
    } catch (err) {
      next(err);
    }
  }
};
