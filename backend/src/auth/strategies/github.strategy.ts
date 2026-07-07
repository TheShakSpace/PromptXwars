/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { userService } from "../../users/services/user.service";
import { logger } from "../../utils/logger";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "mock-github-client-id-54321";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "mock-github-client-secret-edcba";
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/github/callback";

export function setupGitHubStrategy(): void {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.helios.ai`;
          
          let user = await userService.getByEmail(email);

          if (!user) {
            // Self-register GitHub user
            user = await userService.create({
              name: profile.displayName || profile.username || "GitHub User",
              email: email,
              avatar: profile.photos?.[0]?.value || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
              provider: "github",
              role: "user",
            });
            logger.info({ msg: "Registered new GitHub OAuth user", userId: user.id, email });
          } else {
            if (user.provider !== "github") {
              logger.info({ msg: "GitHub login match existing email - syncing provider", userId: user.id });
              user = await userService.update(user.id, { provider: "github" });
            }
          }

          return done(null, user);
        } catch (err: any) {
          logger.error({ msg: "Error in GitHub OAuth Strategy flow", error: err.message });
          return done(err);
        }
      }
    )
  );
}
