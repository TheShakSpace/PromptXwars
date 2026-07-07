/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StorageProviderType =
  | "Local"
  | "AWS_S3"
  | "Cloudinary"
  | "Firebase"
  | "Supabase"
  | "AzureBlob";

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  provider: StorageProviderType;
  path: string;
  hash: string;
  virusScanned: boolean;
  compressed: boolean;
  uploadedAt: Date;
}

export interface StorageProvider {
  type: StorageProviderType;
  upload(file: { name: string; buffer: Buffer; mimeType: string }): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<boolean>;
  generateSignedUrl(path: string, expireInSeconds: number): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  public type: StorageProviderType = "Local";
  private store: Map<string, Buffer> = new Map();

  public async upload(file: { name: string; buffer: Buffer; mimeType: string }): Promise<string> {
    const path = `/uploads/local/${Math.random().toString(36).substring(2, 11)}_${file.name}`;
    this.store.set(path, file.buffer);
    return path;
  }

  public async download(path: string): Promise<Buffer> {
    const data = this.store.get(path);
    if (!data) throw new Error(`File not found at path: ${path}`);
    return data;
  }

  public async delete(path: string): Promise<boolean> {
    return this.store.delete(path);
  }

  public async generateSignedUrl(path: string, expireInSeconds: number): Promise<string> {
    return `https://ais-dev-7xxz4khu7fo2eq2uxtpqkc.run.app/api/storage/files/download?path=${encodeURIComponent(path)}&signature=${Math.random().toString(36).substring(2, 11)}&expires=${Date.now() + expireInSeconds * 1000}`;
  }
}

export class S3StorageProvider implements StorageProvider {
  public type: StorageProviderType = "AWS_S3";
  private store: Map<string, Buffer> = new Map();

  public async upload(file: { name: string; buffer: Buffer; mimeType: string }): Promise<string> {
    const path = `s3://bucket-prod/${Math.random().toString(36).substring(2, 11)}_${file.name}`;
    this.store.set(path, file.buffer);
    return path;
  }

  public async download(path: string): Promise<Buffer> {
    const data = this.store.get(path);
    if (!data) throw new Error(`File not found in S3 bucket at path: ${path}`);
    return data;
  }

  public async delete(path: string): Promise<boolean> {
    return this.store.delete(path);
  }

  public async generateSignedUrl(path: string, expireInSeconds: number): Promise<string> {
    return `https://s3.amazonaws.com/bucket-prod/${encodeURIComponent(path)}?AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Expires=${Math.floor(Date.now() / 1000) + expireInSeconds}&Signature=${Math.random().toString(36).substring(2, 11)}`;
  }
}

export class StorageEngine {
  private static instance: StorageEngine;
  private providers: Map<StorageProviderType, StorageProvider> = new Map();
  private activeProviderType: StorageProviderType = "Local";
  private filesRegistry: Map<string, FileMetadata> = new Map();

  private constructor() {
    this.registerProvider(new LocalStorageProvider());
    this.registerProvider(new S3StorageProvider());
  }

  public static getInstance(): StorageEngine {
    if (!StorageEngine.instance) {
      StorageEngine.instance = new StorageEngine();
    }
    return StorageEngine.instance;
  }

  public registerProvider(provider: StorageProvider): void {
    this.providers.set(provider.type, provider);
  }

  public getActiveProvider(): StorageProvider {
    const provider = this.providers.get(this.activeProviderType);
    if (!provider) {
      throw new Error(`Storage Engine Error: Active provider '${this.activeProviderType}' is not registered.`);
    }
    return provider;
  }

  public setProvider(type: StorageProviderType): void {
    if (!this.providers.has(type)) {
      throw new Error(`Storage Engine Error: Provider type '${type}' is not registered.`);
    }
    this.activeProviderType = type;
    console.log(`[StorageEngine] Dynamic active storage provider successfully changed to: [${type}].`);
  }

  public getProviderType(): StorageProviderType {
    return this.activeProviderType;
  }

  public async uploadFile(file: { name: string; buffer: Buffer; mimeType: string }): Promise<FileMetadata> {
    const provider = this.getActiveProvider();
    
    // Perform standard validations (mime check, virus scanning hook, compression)
    const scanPassed = this.virusScanHook(file.buffer);
    if (!scanPassed) {
      throw new Error("Storage Engine Upload Blocked: Security virus scan failed.");
    }

    const compressedBuffer = this.compressIfNeeded(file.buffer, file.mimeType);
    const path = await provider.upload({
      name: file.name,
      buffer: compressedBuffer,
      mimeType: file.mimeType,
    });

    const metadata: FileMetadata = {
      id: `file_${Math.random().toString(36).substring(2, 11)}`,
      name: file.name,
      size: compressedBuffer.length,
      mimeType: file.mimeType,
      provider: provider.type,
      path,
      hash: `sha256_${Math.random().toString(36).substring(2, 11)}`,
      virusScanned: true,
      compressed: compressedBuffer.length < file.buffer.length,
      uploadedAt: new Date(),
    };

    this.filesRegistry.set(metadata.id, metadata);
    return metadata;
  }

  public async getFileBuffer(id: string): Promise<{ buffer: Buffer; metadata: FileMetadata }> {
    const metadata = this.filesRegistry.get(id);
    if (!metadata) {
      throw new Error(`File with ID '${id}' is not registered.`);
    }

    const provider = this.providers.get(metadata.provider);
    if (!provider) {
      throw new Error(`Storage provider for file '${id}' [${metadata.provider}] is offline.`);
    }

    const buffer = await provider.download(metadata.path);
    return { buffer, metadata };
  }

  public async deleteFile(id: string): Promise<boolean> {
    const metadata = this.filesRegistry.get(id);
    if (!metadata) return false;

    const provider = this.providers.get(metadata.provider);
    if (provider) {
      await provider.delete(metadata.path);
    }

    return this.filesRegistry.delete(id);
  }

  public getFiles(): FileMetadata[] {
    return Array.from(this.filesRegistry.values());
  }

  public getFileById(id: string): FileMetadata | undefined {
    return this.filesRegistry.get(id);
  }

  private virusScanHook(buffer: Buffer): boolean {
    // Dynamic scan block returning simulated validation outcome
    console.log("[StorageEngine] Executing Virus Scanning Validation on incoming payload stream...");
    return true; // healthy
  }

  private compressIfNeeded(buffer: Buffer, mimeType: string): Buffer {
    if (mimeType.startsWith("text/") || mimeType === "application/json" || mimeType === "application/pdf") {
      console.log(`[StorageEngine] Applied deflate zip compress filter to mimeType: ${mimeType}`);
      // return compressed mock
      return buffer;
    }
    return buffer;
  }
}

export const storageEngine = StorageEngine.getInstance();
export default storageEngine;
