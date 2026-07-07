/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import app from "./app";
import { config } from "./config";
import { logger } from "./utils/logger";
import { databaseEngine } from "./database/DatabaseEngine";
import path from "path";
import express from "express";

async function bootServer() {
  const PORT = config.PORT;

  logger.info("Initializing Database and Storage engines...");
  await databaseEngine.initialize();

  // Vite Dev Server middleware or Static Production assets
  if (config.NODE_ENV !== "production") {
    logger.info("Initializing Vite development middleware server mode...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Register Vite middleware for frontend assets
    app.use(vite.middlewares);
  } else {
    logger.info("Initializing static distribution server mode for production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Let SPA routing catch unknown routes for correct client side navigation
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to 0.0.0.0 and port 3000 as mandated by Cloud Run
  const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`🚀 Helios Cognitive Service Deck active on http://localhost:${PORT}`);
    logger.info(`Running in environment: [${config.NODE_ENV.toUpperCase()}]`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Gracefully decommissioning server active sockets...`);
    server.close(() => {
      logger.info("All server ports successfully unbound. Exiting.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootServer().catch((err) => {
  logger.error({
    msg: "Unrecoverable boot failure on Helios Service Deck",
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
