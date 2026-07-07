/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import pino from "pino";
import { config } from "../config";

export const logger = pino({
  level: config.NODE_ENV === "development" ? "debug" : "info",
  base: {
    env: config.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
