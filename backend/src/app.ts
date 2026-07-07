/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";
import { config } from "./config";
import { requestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes/apiRoutes";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./users/user.routes";
import aiRoutes from "./routes/aiRoutes";
import promptRoutes from "./routes/promptRoutes";
import agentRoutes from "./routes/agentRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import toolRoutes from "./routes/toolRoutes";
import workflowRoutes from "./routes/workflowRoutes";
import storageRoutes from "./routes/storageRoutes";
import databaseRoutes from "./routes/databaseRoutes";
import { setupGoogleStrategy } from "./auth/strategies/google.strategy";
import { setupGitHubStrategy } from "./auth/strategies/github.strategy";
import { NotFoundError } from "./errors/customErrors";

const app = express();

// Initialize passport strategies
setupGoogleStrategy();
setupGitHubStrategy();

// Enable secure header sets
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP so Vite dev mode iframe loads perfectly without browser blocks
}));

// Cross-origin setups
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
}));

// Output payload compression
app.use(compression());

// Body decoders
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Attach tracing ID
app.use(requestId);

// Trace requests
app.use(requestLogger);

// Initialize Passport middleware
app.use(passport.initialize());

// Attach the Authentication and User routing tables under configured prefix
app.use(`${config.API_PREFIX}/auth`, authRoutes);
app.use(`${config.API_PREFIX}/users`, userRoutes);
app.use(`${config.API_PREFIX}/ai`, aiRoutes);
app.use(`${config.API_PREFIX}/prompts`, promptRoutes);
app.use(`${config.API_PREFIX}/agents`, agentRoutes);
app.use(`${config.API_PREFIX}/memory`, memoryRoutes);
app.use(`${config.API_PREFIX}/tools`, toolRoutes);
app.use(`${config.API_PREFIX}/workflows`, workflowRoutes);
app.use(`${config.API_PREFIX}/storage`, storageRoutes);
app.use(`${config.API_PREFIX}/database`, databaseRoutes);

// Attach the API routing table under configured prefix
app.use(config.API_PREFIX, apiRoutes);


// Catch-all route to trigger 404 errors for unmatched API paths
app.use(config.API_PREFIX, (req, res, next) => {
  next(new NotFoundError(`The requested path ${req.originalUrl} does not exist.`));
});

// Register Global Exception Middleware
app.use(errorHandler);

export default app;
