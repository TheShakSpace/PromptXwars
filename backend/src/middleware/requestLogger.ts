/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import morgan from "morgan";
import { Request, Response } from "express";
import { logger } from "../utils/logger";

morgan.token("id", (req: Request) => req.id || "unknown");

export const requestLogger = morgan(
  ":id :remote-addr :method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message: string) => {
        logger.info({
          msg: "HTTP Request",
          meta: message.trim(),
        });
      },
    },
  }
);
