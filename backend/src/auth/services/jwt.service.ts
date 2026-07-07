/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jwt from "jsonwebtoken";
import { config } from "../../config";

const JWT_SECRET = process.env.JWT_SECRET || "helios-super-secret-key-for-jwt-tokens-2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "helios-super-secret-refresh-key-for-jwt-tokens-2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}

export class JwtService {
  public static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "15m",
    });
  }

  public static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }

  public static generateVerificationToken(userId: string): string {
    return jwt.sign({ userId, purpose: "verification" }, JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  public static generateResetPasswordToken(userId: string): string {
    return jwt.sign({ userId, purpose: "reset-password" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  public static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }

  public static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  }

  public static verifyPurposeToken(token: string, purpose: "verification" | "reset-password"): { userId: string } {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; purpose: string };
    if (payload.purpose !== purpose) {
      throw new Error("Invalid token purpose");
    }
    return { userId: payload.userId };
  }
}
