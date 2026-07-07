/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "guest" | "user" | "developer" | "admin" | "moderator";

export interface UserPreferences {
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
}

export interface UserSubscription {
  status: "active" | "inactive" | "trial" | "canceled";
  plan: "free" | "developer" | "enterprise";
  expiresAt: string | null;
}

export interface UserSettings {
  privacy: {
    shareDataForTraining: boolean;
    publicProfile: boolean;
  };
  accessibility: {
    screenReaderSupport: boolean;
    highContrastMode: boolean;
    reducedMotion: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password, omitted in JSON transfers
  avatar: string;
  provider: "local" | "google" | "github";
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  subscription: UserSubscription;
  settings: UserSettings;
}

export interface UserSession {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  isValid: boolean;
  createdAt: string;
  expiresAt: string;
  lastActiveAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
