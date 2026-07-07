/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storageEngine, FileMetadata } from "./StorageEngine";

export interface ChunkUploadSession {
  sessionId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  totalChunks: number;
  receivedChunks: Set<number>;
  chunksBuffers: Map<number, Buffer>;
  status: "Uploading" | "Paused" | "Cancelled" | "Completed";
  progressPercent: number;
}

export class UploadManager {
  private static instance: UploadManager;
  private sessions: Map<string, ChunkUploadSession> = new Map();

  private constructor() {}

  public static getInstance(): UploadManager {
    if (!UploadManager.instance) {
      UploadManager.instance = new UploadManager();
    }
    return UploadManager.instance;
  }

  /**
   * Initializes a chunked multi-part upload session
   */
  public initializeSession(fileName: string, fileSize: number, mimeType: string, totalChunks: number): ChunkUploadSession {
    const sessionId = `upload_session_${Math.random().toString(36).substring(2, 11)}`;
    const session: ChunkUploadSession = {
      sessionId,
      fileName,
      fileSize,
      mimeType,
      totalChunks,
      receivedChunks: new Set(),
      chunksBuffers: new Map(),
      status: "Uploading",
      progressPercent: 0,
    };

    this.sessions.set(sessionId, session);
    console.log(`[UploadManager] Chunk upload session initialized: '${sessionId}' for file '${fileName}' (${fileSize} bytes)`);
    return session;
  }

  /**
   * Appends an individual chunk part to an active upload session
   */
  public async uploadChunk(sessionId: string, chunkNumber: number, chunkBuffer: Buffer): Promise<ChunkUploadSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Upload Error: Active upload session '${sessionId}' not found.`);
    }

    if (session.status === "Cancelled") {
      throw new Error(`Upload Error: Upload has been cancelled.`);
    }

    if (session.status === "Paused") {
      throw new Error(`Upload Error: Upload session is currently paused.`);
    }

    session.receivedChunks.add(chunkNumber);
    session.chunksBuffers.set(chunkNumber, chunkBuffer);

    session.progressPercent = Math.min(
      Math.round((session.receivedChunks.size / session.totalChunks) * 100),
      100
    );

    console.log(`[UploadManager] Received chunk [${chunkNumber}/${session.totalChunks}] for session '${sessionId}' - Progress: ${session.progressPercent}%`);

    return session;
  }

  /**
   * Finalizes the chunked session and merges components into the final Storage engine record
   */
  public async assembleAndFinalize(sessionId: string): Promise<FileMetadata> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Assemble Error: Session '${sessionId}' not found.`);
    }

    if (session.receivedChunks.size !== session.totalChunks) {
      throw new Error(
        `Assemble Error: Missing chunks. Received ${session.receivedChunks.size} of ${session.totalChunks}.`
      );
    }

    console.log(`[UploadManager] Finalizing upload of session '${sessionId}'... merging ${session.totalChunks} chunks.`);

    // Sort and concat chunk buffers
    const sortedBuffers: Buffer[] = [];
    for (let i = 1; i <= session.totalChunks; i++) {
      const buf = session.chunksBuffers.get(i);
      if (!buf) {
        throw new Error(`Assemble Error: Missing chunk key block [${i}].`);
      }
      sortedBuffers.push(buf);
    }

    const mergedBuffer = Buffer.concat(sortedBuffers);

    // Upload to primary active StorageEngine
    const metadata = await storageEngine.uploadFile({
      name: session.fileName,
      buffer: mergedBuffer,
      mimeType: session.mimeType,
    });

    session.status = "Completed";
    session.progressPercent = 100;

    // Clean cache allocations
    session.chunksBuffers.clear();

    return metadata;
  }

  public pauseSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    session.status = "Paused";
    console.log(`[UploadManager] Upload session '${sessionId}' paused by user directive.`);
    return true;
  }

  public resumeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    session.status = "Uploading";
    console.log(`[UploadManager] Upload session '${sessionId}' resumed execution.`);
    return true;
  }

  public cancelSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    session.status = "Cancelled";
    session.chunksBuffers.clear();
    this.sessions.delete(sessionId);
    console.log(`[UploadManager] Upload session '${sessionId}' has been cancelled and memory resources freed.`);
    return true;
  }

  public getSession(sessionId: string): ChunkUploadSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getSessions(): ChunkUploadSession[] {
    return Array.from(this.sessions.values());
  }
}

export const uploadManager = UploadManager.getInstance();
export default uploadManager;
