/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userService } from "../../users/services/user.service";
import { logger } from "../../utils/logger";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "mock-google-client-id-12345.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret-abcde";
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback";

export function setupGoogleStrategy(): void {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found in Google OAuth profile"));
          }

          let user = await userService.getByEmail(email);

          if (!user) {
            // Self-register Google User on initial signup
            user = await userService.create({
              name: profile.displayName || "Google User",
              email: email,
              avatar: profile.photos?.[0]?.value || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
              provider: "google",
              role: "user",
            });
            logger.info({ msg: "Registered new Google OAuth user", userId: user.id, email });
          } else {
            // Confirm or bind provider
            if (user.provider !== "google") {
              logger.info({ msg: "Google login match existing email - syncing provider", userId: user.id });
              user = await userService.update(user.id, { provider: "google" });
            }
          }

          return done(null, user);
        } catch (err: any) {
          logger.error({ msg: "Error in Google OAuth Strategy flow", error: err.message });
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userService.getById(id);
      done(null, user || null);
    } catch (err) {
      done(err);
    }
  });
}
