/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { authController } from "./controllers/auth.controller";
import { authenticateJWT } from "./guards/permissions";
import passport from "passport";

const router = Router();

// Public Authentication Endpoints
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Protected Authentication Endpoints
router.post("/logout", authenticateJWT, authController.logout);
router.get("/me", authenticateJWT, authController.me);
router.get("/sessions", authenticateJWT, authController.getSessions);
router.delete("/session/:id", authenticateJWT, authController.terminateSession);

// OAuth routes (supporting mock / passport redirects)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Standard secure redirect back to preview frontend
    res.redirect("/");
  }
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
