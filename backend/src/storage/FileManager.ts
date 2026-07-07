/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storageEngine, FileMetadata } from "./StorageEngine";
import { repositoryManager } from "../database/RepositoryManager";

export class FileManager {
  private static instance: FileManager;

  private constructor() {}

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  /**
   * Performs standard file upload, saves metadata to DB files collection repository, and returns full details
   */
  public async saveFile(name: string, buffer: Buffer, mimeType: string): Promise<FileMetadata> {
    // 1. StorageEngine upload
    const metadata = await storageEngine.uploadFile({ name, buffer, mimeType });

    // 2. Persist metadata via FileRepository in RepositoryManager
    await repositoryManager.files.create({
      id: metadata.id,
      name: metadata.name,
      size: metadata.size,
      mimeType: metadata.mimeType,
      provider: metadata.provider,
      path: metadata.path,
      hash: metadata.hash,
      virusScanned: metadata.virusScanned,
      compressed: metadata.compressed,
      uploadedAt: metadata.uploadedAt,
    });

    return metadata;
  }

  /**
   * Downloads a stored file's binary stream
   */
  public async getFile(id: string): Promise<{ buffer: Buffer; metadata: FileMetadata }> {
    return storageEngine.getFileBuffer(id);
  }

  /**
   * Deletes a file's binary storage and repository listing
   */
  public async removeFile(id: string): Promise<boolean> {
    // Remove from repository database
    await repositoryManager.files.delete({ id });

    // Remove from physical storage
    return storageEngine.deleteFile(id);
  }

  /**
   * Lists all files currently stored in database files repository
   */
  public async listFiles(filter: Record<string, any> = {}): Promise<any[]> {
    return repositoryManager.files.find(filter);
  }

  /**
   * Generates a timed signed secure download url for the file
   */
  public async getSignedUrl(id: string, expireInSeconds = 3600): Promise<string> {
    const file = storageEngine.getFileById(id);
    if (!file) {
      throw new Error(`File download signing failed: File '${id}' not found.`);
    }

    const provider = storageEngine.getActiveProvider();
    return provider.generateSignedUrl(file.path, expireInSeconds);
  }
}

export const fileManager = FileManager.getInstance();
export default fileManager;
