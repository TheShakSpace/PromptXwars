/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { databaseEngine } from "../database/DatabaseEngine";
import { storageEngine } from "../storage/StorageEngine";
import { cacheManager } from "../database/CacheManager";
import { migrationManager } from "../database/MigrationManager";

export class DatabaseController {
  /**
   * GET /api/database/health
   */
  public async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbProvider = databaseEngine.getActiveProvider();
      const dbHealth = await dbProvider.healthCheck();

      const storageProvider = storageEngine.getActiveProvider();
      const cacheHealth = cacheManager.getHealth();
      const migrationStatus = await migrationManager.getStatus();

      res.status(200).json({
        database: {
          activeProvider: dbProvider.name,
          status: dbHealth.status,
          details: dbHealth.details,
        },
        storage: {
          activeProvider: storageProvider.type,
          status: "Healthy",
        },
        cache: cacheHealth,
        migrations: migrationStatus,
        systemTime: new Date(),
      });
    } catch (err: any) {
      res.status(500).json({
        status: "Degraded",
        error: err.message,
      });
    }
  }

  /**
   * POST /api/database/switch
   * Allow changing active database provider on-the-fly
   */
  public async switchProvider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { providerName } = req.body;
      if (!providerName) {
        res.status(400).json({ error: "Missing parameter 'providerName' in body." });
        return;
      }

      await databaseEngine.switchProvider(providerName);
      res.status(200).json({
        success: true,
        message: `Database connection migrated successfully to [${providerName}].`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * POST /api/database/migrate
   */
  public async runMigrations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const results = await migrationManager.migrate();
      res.status(200).json({
        message: "Migrations process finished execution.",
        results,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const databaseController = new DatabaseController();
export default databaseController;
