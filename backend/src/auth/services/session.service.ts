/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserSession } from "../types";
import { v4 as uuidv4 } from "uuid";

export class SessionService {
  private sessions: Map<string, UserSession> = new Map();

  constructor() {
    // Session cleaner interval to prevent memory footprint leaks
    setInterval(() => {
      const now = new Date();
      for (const [id, session] of this.sessions.entries()) {
        if (new Date(session.expiresAt) < now) {
          this.sessions.delete(id);
        }
      }
    }, 10 * 60 * 1000);
  }

  public createSession(userId: string, userAgent: string, ipAddress: string): UserSession {
    const id = `session-${uuidv4()}`;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 Days expiry

    const session: UserSession = {
      id,
      userId,
      userAgent: userAgent || "unknown",
      ipAddress: ipAddress || "unknown",
      isValid: true,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActiveAt: createdAt.toISOString(),
    };

    this.sessions.set(id, session);
    return session;
  }

  public validateSession(id: string): UserSession | null {
    const session = this.sessions.get(id);
    if (!session || !session.isValid) {
      return null;
    }

    const now = new Date();
    if (new Date(session.expiresAt) < now) {
      session.isValid = false;
      this.sessions.set(id, session);
      return null;
    }

    // Refresh last active timestamp
    session.lastActiveAt = now.toISOString();
    this.sessions.set(id, session);
    return session;
  }

  public refreshSession(id: string): UserSession | null {
    const session = this.sessions.get(id);
    if (!session || !session.isValid) {
      return null;
    }

    const now = new Date();
    session.lastActiveAt = now.toISOString();
    // Re-extend session lifetime by another 7 Days from now
    session.expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    this.sessions.set(id, session);
    return session;
  }

  public invalidateSession(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.isValid = false;
      this.sessions.set(id, session);
    }
  }

  public invalidateAllSessions(userId: string): void {
    for (const [id, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        session.isValid = false;
        this.sessions.set(id, session);
      }
    }
  }

  public getUserSessions(userId: string): UserSession[] {
    return Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId && s.isValid
    );
  }
}

export const sessionService = new SessionService();
