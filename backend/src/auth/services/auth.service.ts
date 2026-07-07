/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bcrypt from "bcrypt";
import { userService } from "../../users/services/user.service";
import { sessionService } from "./session.service";
import { JwtService } from "./jwt.service";
import { User, AuditLogEntry, UserRole } from "../types";
import { ValidationError, UnauthorizedError } from "../../errors/customErrors";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../utils/logger";

const auditLogs: AuditLogEntry[] = [];

export class AuthService {
  public async register(
    name: string,
    email: string,
    password?: string,
    role: UserRole = "user"
  ): Promise<User> {
    const user = await userService.create({
      name,
      email,
      password,
      provider: "local",
      role,
    });

    this.logAudit(user.id, "REGISTER", "0.0.0.0", "system", { email });
    return user;
  }

  public async login(
    email: string,
    password?: string,
    userAgent = "unknown",
    ipAddress = "0.0.0.0"
  ): Promise<{ accessToken: string; refreshToken: string; user: Omit<User, "password"> }> {
    const user = await userService.getByEmail(email);
    if (!user) {
      this.logAudit("unknown", "LOGIN_FAILED", ipAddress, userAgent, { email, reason: "user_not_found" });
      throw new UnauthorizedError("Invalid email or password credentials");
    }

    if (user.provider === "local") {
      if (!password || !user.password) {
        throw new ValidationError("Password is required for local sign-in methods");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        this.logAudit(user.id, "LOGIN_FAILED", ipAddress, userAgent, { email, reason: "incorrect_password" });
        throw new UnauthorizedError("Invalid email or password credentials");
      }
    }

    // Generate active session
    const session = sessionService.createSession(user.id, userAgent, ipAddress);

    // Generate Access & Refresh tokens with session info
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    };

    const accessToken = JwtService.generateAccessToken(payload);
    const refreshToken = JwtService.generateRefreshToken(payload);

    this.logAudit(user.id, "LOGIN_SUCCESS", ipAddress, userAgent, { sessionId: session.id });

    const { password: _, ...safeUser } = user;
    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  public async refreshToken(
    oldRefreshToken: string,
    userAgent = "unknown",
    ipAddress = "0.0.0.0"
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = JwtService.verifyRefreshToken(oldRefreshToken);
      if (!payload.sessionId) {
        throw new UnauthorizedError("Malformed token context");
      }

      const activeSession = sessionService.validateSession(payload.sessionId);
      if (!activeSession) {
        throw new UnauthorizedError("Expired or revoked authentication session");
      }

      // Re-extend session lifetime
      sessionService.refreshSession(activeSession.id);

      const user = await userService.getById(payload.userId);
      if (!user) {
        throw new UnauthorizedError("Associated user account no longer active");
      }

      const newPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: activeSession.id,
      };

      const accessToken = JwtService.generateAccessToken(newPayload);
      const refreshToken = JwtService.generateRefreshToken(newPayload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err: any) {
      logger.warn({ msg: "Token renewal failed", err: err.message });
      throw new UnauthorizedError("Invalid or expired refresh token context");
    }
  }

  public async logout(sessionId: string, userId: string): Promise<void> {
    sessionService.invalidateSession(sessionId);
    this.logAudit(userId, "LOGOUT", "0.0.0.0", "system", { sessionId });
  }

  public async logoutAllDevices(userId: string): Promise<void> {
    sessionService.invalidateAllSessions(userId);
    this.logAudit(userId, "LOGOUT_ALL_DEVICES", "0.0.0.0", "system");
  }

  public logAudit(
    userId: string,
    action: string,
    ipAddress: string,
    userAgent: string,
    metadata?: Record<string, any>
  ): void {
    const entry: AuditLogEntry = {
      id: `audit-${uuidv4()}`,
      userId,
      action,
      ipAddress,
      userAgent,
      metadata,
      timestamp: new Date().toISOString(),
    };

    auditLogs.unshift(entry);
    logger.info({ msg: "Audit log recorded", action, userId, ipAddress });
  }

  public getAuditLogs(userId?: string): AuditLogEntry[] {
    if (userId) {
      return auditLogs.filter((log) => log.userId === userId);
    }
    return auditLogs;
  }
}

export const authService = new AuthService();
