/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { fileManager } from "../storage/FileManager";
import { uploadManager } from "../storage/UploadManager";
import { backupManager } from "../database/BackupManager";

export class StorageController {
  /**
   * GET /api/storage/files
   */
  public async getFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await fileManager.listFiles();
      res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/storage/upload
   */
  public async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, mimeType, bufferBase64, chunkNumber, totalChunks, sessionId } = req.body;

      if (!name || !bufferBase64) {
        res.status(400).json({ error: "Missing required parameters 'name' or 'bufferBase64'." });
        return;
      }

      const buffer = Buffer.from(bufferBase64, "base64");

      // Check if chunked upload session
      if (totalChunks && totalChunks > 1) {
        let activeSessionId = sessionId;
        if (!activeSessionId) {
          const newSession = uploadManager.initializeSession(name, buffer.length * totalChunks, mimeType || "application/octet-stream", totalChunks);
          activeSessionId = newSession.sessionId;
        }

        const session = await uploadManager.uploadChunk(activeSessionId, chunkNumber || 1, buffer);

        if (session.receivedChunks.size === session.totalChunks) {
          const finalFile = await uploadManager.assembleAndFinalize(activeSessionId);
          res.status(201).json({
            message: "Chunk upload complete, file successfully assembled.",
            session,
            file: finalFile,
          });
          return;
        }

        res.status(200).json({
          message: "Chunk received successfully.",
          session,
        });
        return;
      }

      // Single standard direct upload
      const file = await fileManager.saveFile(name, buffer, mimeType || "application/octet-stream");
      res.status(201).json({
        message: "File uploaded and indexed successfully.",
        file,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * DELETE /api/storage/delete
   */
  public async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.body;
      if (!id) {
        res.status(400).json({ error: "Missing file 'id' in request body." });
        return;
      }

      const deleted = await fileManager.removeFile(id);
      if (!deleted) {
        res.status(404).json({ error: `File with ID '${id}' not found.` });
        return;
      }

      res.status(200).json({ success: true, message: `File '${id}' successfully deleted.` });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/storage/backup
   */
  public async backup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backup = await backupManager.createBackup();
      res.status(201).json({
        message: "Database snapshot backup completed successfully.",
        backup,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * POST /api/storage/restore
   */
  public async restore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { backupId } = req.body;
      if (!backupId) {
        res.status(400).json({ error: "Missing required parameter 'backupId' in request body." });
        return;
      }

      const outcome = await backupManager.restoreBackup(backupId);
      res.status(200).json({
        message: "Database restored successfully.",
        outcome,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const storageController = new StorageController();
export default storageController;
