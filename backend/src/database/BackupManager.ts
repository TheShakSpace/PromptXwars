/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { repositoryManager } from "./RepositoryManager";
import { storageEngine } from "../storage/StorageEngine";

export interface BackupMetadata {
  id: string;
  timestamp: Date;
  filePath: string;
  collectionsBackedUp: string[];
  recordsCount: number;
}

export class BackupManager {
  private static instance: BackupManager;
  private backupsRegistry: Map<string, BackupMetadata> = new Map();

  private constructor() {}

  public static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  /**
   * Compiles entire active repository snapshots, compresses them, and uploads to storage
   */
  public async createBackup(): Promise<BackupMetadata> {
    console.log("[BackupManager] Initiating complete multi-provider database backup process...");

    const collections = [
      "users",
      "projects",
      "chats",
      "conversations",
      "workflows",
      "prompts",
      "agents",
      "memory",
      "files",
      "templates",
      "logs",
      "analytics",
    ];

    const payload: Record<string, any[]> = {};
    let totalRecords = 0;

    for (const coll of collections) {
      try {
        // Query repo records
        const repo = (repositoryManager as any)[coll];
        if (repo) {
          const records = await repo.find({});
          payload[coll] = records;
          totalRecords += records.length;
        }
      } catch (err: any) {
        console.warn(`[BackupManager] Skipping table/collection '${coll}' backup: ${err.message}`);
      }
    }

    const backupBuffer = Buffer.from(JSON.stringify(payload, null, 2));
    const backupFileName = `db_backup_${Date.now()}.json`;

    // Upload via Storage Engine
    const uploadedFile = await storageEngine.uploadFile({
      name: backupFileName,
      buffer: backupBuffer,
      mimeType: "application/json",
    });

    const metadata: BackupMetadata = {
      id: `backup_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date(),
      filePath: uploadedFile.path,
      collectionsBackedUp: Object.keys(payload),
      recordsCount: totalRecords,
    };

    this.backupsRegistry.set(metadata.id, metadata);
    console.log(`[BackupManager] Backup completed successfully. Registered ID: '${metadata.id}' - ${totalRecords} records.`);

    return metadata;
  }

  /**
   * Restores database collection states from a stored backup ID
   */
  public async restoreBackup(backupId: string): Promise<{ success: boolean; recordsRestored: number }> {
    const backup = this.backupsRegistry.get(backupId);
    if (!backup) {
      throw new Error(`Restore Error: Backup ID '${backupId}' not found.`);
    }

    console.log(`[BackupManager] Restoring database snapshot from backup ID '${backupId}'...`);

    // Fetch backup file buffer from StorageEngine
    const files = storageEngine.getFiles();
    const fileMeta = files.find((f) => f.path === backup.filePath);
    if (!fileMeta) {
      throw new Error(`Restore Error: Storage path target file '${backup.filePath}' is missing.`);
    }

    const { buffer } = await storageEngine.getFileBuffer(fileMeta.id);
    const payload = JSON.parse(buffer.toString()) as Record<string, any[]>;
    let restoredCount = 0;

    for (const [coll, records] of Object.entries(payload)) {
      const repo = (repositoryManager as any)[coll];
      if (repo) {
        // Clear existing records
        await repo.delete({});
        
        // Restore records
        for (const rec of records) {
          await repo.create(rec);
          restoredCount++;
        }
      }
    }

    console.log(`[BackupManager] Restore completed. Restored ${restoredCount} records across ${Object.keys(payload).length} collections.`);
    return { success: true, recordsRestored: restoredCount };
  }

  /**
   * Retrieves all available backups in the registry
   */
  public getBackups(): BackupMetadata[] {
    return Array.from(this.backupsRegistry.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Deletes a backup record and its storage footprint
   */
  public async deleteBackup(backupId: string): Promise<boolean> {
    const backup = this.backupsRegistry.get(backupId);
    if (!backup) return false;

    // Delete physically
    const files = storageEngine.getFiles();
    const fileMeta = files.find((f) => f.path === backup.filePath);
    if (fileMeta) {
      await storageEngine.deleteFile(fileMeta.id);
    }

    return this.backupsRegistry.delete(backupId);
  }
}

export const backupManager = BackupManager.getInstance();
export default backupManager;
