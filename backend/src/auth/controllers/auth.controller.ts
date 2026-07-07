/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { sessionService } from "../services/session.service";
import { ResponseFormatter } from "../../utils/responseFormatter";
import { ValidationError, UnauthorizedError } from "../../errors/customErrors";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["guest", "user", "developer", "admin", "moderator"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const authController = {
  // POST /auth/register
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid registration details", parsed.error.format());
      }

      const { name, email, password, role } = parsed.data;
      const user = await authService.register(name, email, password, role);

      // Return user omitting password
      const { password: _, ...safeUser } = user;
      ResponseFormatter.success(res, "Account registered successfully.", safeUser, 201);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/login
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid credentials parameters", parsed.error.format());
      }

      const { email, password } = parsed.data;
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown-ip";
      const userAgent = req.headers["user-agent"] || "unknown-agent";

      const { accessToken, refreshToken, user } = await authService.login(
        email,
        password,
        userAgent,
        ipAddress
      );

      // Set Secure HTTP-only cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      ResponseFormatter.success(res, "Authentication successful.", {
        accessToken,
        refreshToken,
        user,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/refresh
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let rToken: string | undefined = req.body.refreshToken;

      // Check cookie if not in body
      if (!rToken && req.headers.cookie) {
        const cookies = req.headers.cookie.split(";").reduce((acc, current) => {
          const [key, val] = current.trim().split("=");
          acc[key] = val;
          return acc;
        }, {} as Record<string, string>);
        rToken = cookies["refreshToken"];
      }

      if (!rToken) {
        throw new UnauthorizedError("Refresh token is missing from requests");
      }

      const ipAddress = req.ip || req.socket.remoteAddress || "unknown-ip";
      const userAgent = req.headers["user-agent"] || "unknown-agent";

      const tokens = await authService.refreshToken(rToken, userAgent, ipAddress);

      // Update Cookies
      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ResponseFormatter.success(res, "Access tokens renewed successfully.", tokens);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/logout
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.tokenPayload?.sessionId;
      const userId = req.user?.id;

      if (sessionId && userId) {
        await authService.logout(sessionId, userId);
      }

      // Clear cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      ResponseFormatter.success(res, "Session terminated successfully.");
    } catch (err) {
      next(err);
    }
  },

  // GET /auth/me
  me: (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("User profile state context missing");
    }
    ResponseFormatter.success(res, "User profile state resolved.", req.user);
  },

  // GET /auth/sessions
  getSessions: (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication session resolution context missing");
    }
    const list = sessionService.getUserSessions(req.user.id);
    ResponseFormatter.success(res, "Active cognitive platform sessions loaded.", list);
  },

  // DELETE /auth/session/:id
  terminateSession: (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required to terminate sessions");
    }
    const { id } = req.params;
    
    // Validate owner
    const sessions = sessionService.getUserSessions(req.user.id);
    const targetSession = sessions.find((s) => s.id === id);
    
    if (!targetSession) {
      throw new ValidationError("Specified active session does not exist or access is forbidden.");
    }

    sessionService.invalidateSession(id);
    authService.logAudit(req.user.id, "TERMINATE_OTHER_SESSION", req.ip || "0.0.0.0", req.headers["user-agent"] || "unknown", { targetSessionId: id });
    
    ResponseFormatter.success(res, `Session ${id} successfully revoked.`);
  }
};
