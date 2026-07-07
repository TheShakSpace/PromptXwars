/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bcrypt from "bcrypt";
import { User, UserRole } from "../../auth/types";
import { v4 as uuidv4 } from "uuid";
import { ConflictError, ValidationError } from "../../errors/customErrors";

export class UserService {
  private users: Map<string, User> = new Map();

  constructor() {
    this.seedUsers();
  }

  private async seedUsers() {
    const passwordHash = await bcrypt.hash("Password123!", 10);
    
    const roles: UserRole[] = ["admin", "moderator", "developer", "user", "guest"];
    
    for (const role of roles) {
      const email = `${role}@helios.ai`;
      const id = `user-${role}-id`;
      this.users.set(id, {
        id,
        name: `Helios ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email,
        password: passwordHash,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`,
        provider: "local",
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          theme: "dark",
          language: "en",
          timezone: "UTC",
          notifications: { email: true, push: true, marketing: false },
          aiPreferences: {
            defaultProvider: "google",
            defaultModel: "gemini-2.5-flash",
            temperature: 0.7,
            maxTokens: 2048,
          }
        },
        subscription: {
          status: "active",
          plan: role === "admin" || role === "developer" ? "enterprise" : "free",
          expiresAt: null,
        },
        settings: {
          privacy: { shareDataForTraining: false, publicProfile: true },
          accessibility: {
            screenReaderSupport: false,
            highContrastMode: false,
            reducedMotion: false,
          }
        }
      });
    }
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    const lowerEmail = email.toLowerCase();
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === lowerEmail
    );
  }

  public async getById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  public async create(userParams: Partial<User> & { password?: string }): Promise<User> {
    if (!userParams.email) {
      throw new ValidationError("Email is required for creating a user");
    }

    const existing = await this.getByEmail(userParams.email);
    if (existing) {
      throw new ConflictError(`User with email ${userParams.email} already exists`);
    }

    const id = `user-${uuidv4()}`;
    const passwordHash = userParams.password 
      ? await bcrypt.hash(userParams.password, 10) 
      : undefined;

    const newUser: User = {
      id,
      name: userParams.name || "Helios User",
      email: userParams.email.toLowerCase(),
      password: passwordHash,
      avatar: userParams.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`,
      provider: userParams.provider || "local",
      role: userParams.role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        theme: "dark",
        language: "en",
        timezone: "UTC",
        notifications: { email: true, push: true, marketing: false },
        aiPreferences: {
          defaultProvider: "google",
          defaultModel: "gemini-2.5-flash",
          temperature: 0.7,
          maxTokens: 2048,
          ...userParams.preferences?.aiPreferences,
        },
        ...userParams.preferences,
      },
      subscription: {
        status: "active",
        plan: "free",
        expiresAt: null,
        ...userParams.subscription,
      },
      settings: {
        privacy: { shareDataForTraining: false, publicProfile: true },
        accessibility: {
          screenReaderSupport: false,
          highContrastMode: false,
          reducedMotion: false,
        },
        ...userParams.settings,
      }
    };

    this.users.set(id, newUser);
    return newUser;
  }

  public async update(id: string, updates: Partial<User> & { password?: string }): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new ValidationError(`User with ID ${id} not found`);
    }

    const merged = { ...user };

    if (updates.name) merged.name = updates.name;
    if (updates.avatar) merged.avatar = updates.avatar;
    if (updates.role) merged.role = updates.role;
    if (updates.preferences) merged.preferences = { ...user.preferences, ...updates.preferences };
    if (updates.subscription) merged.subscription = { ...user.subscription, ...updates.subscription };
    if (updates.settings) merged.settings = { ...user.settings, ...updates.settings };
    if (updates.password) {
      merged.password = await bcrypt.hash(updates.password, 10);
    }

    merged.updatedAt = new Date().toISOString();
    this.users.set(id, merged);
    return merged;
  }

  public async delete(id: string): Promise<void> {
    if (!this.users.has(id)) {
      throw new ValidationError(`User with ID ${id} not found`);
    }
    this.users.delete(id);
  }

  public async getAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const userService = new UserService();
