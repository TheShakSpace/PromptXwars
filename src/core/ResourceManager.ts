/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ResourceType = "image" | "pdf" | "csv" | "json" | "markdown" | "docx" | "zip" | "memory_context" | "temporary_object";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  sizeBytes: number;
  uri: string;
  uploadedAt: string;
  metadata?: Record<string, any>;
  isTemporary: boolean;
}

export class ResourceManager {
  private resources: Map<string, Resource> = new Map();
  private listeners: Set<(resources: Resource[]) => void> = new Set();

  constructor() {
    // Seed default operational system resources
    this.register({
      id: "hipaa-governance-standards",
      name: "HIPAA_PII_Compliance_Standard.pdf",
      type: "pdf",
      sizeBytes: 1245000,
      uri: "virtual://storage/compliance/hipaa-guideline.pdf",
      uploadedAt: new Date().toISOString(),
      isTemporary: false,
      metadata: { classification: "restricted", checkSum: "0x8fa14b" }
    });
    this.register({
      id: "portfolio-risk-matrix",
      name: "Portfolio_Risk_Parameters.csv",
      type: "csv",
      sizeBytes: 342000,
      uri: "virtual://storage/finance/risk-params.csv",
      uploadedAt: new Date().toISOString(),
      isTemporary: false,
      metadata: { classification: "internal-only" }
    });
    this.register({
      id: "contract-sample-audit",
      name: "Commercial_Service_Agreement_Draft.docx",
      type: "docx",
      sizeBytes: 185000,
      uri: "virtual://storage/legal/contract-sample.docx",
      uploadedAt: new Date().toISOString(),
      isTemporary: false,
      metadata: { classification: "confidential" }
    });
  }

  public getResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  public register(resource: Resource): void {
    this.resources.set(resource.id, resource);
    this.notify();
  }

  public deregister(id: string): void {
    this.resources.delete(id);
    this.notify();
  }

  public clearTemporary(): void {
    for (const [id, res] of this.resources.entries()) {
      if (res.isTemporary) {
        this.resources.delete(id);
      }
    }
    this.notify();
  }

  public subscribe(callback: (resources: Resource[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getResources());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    const list = this.getResources();
    this.listeners.forEach((listener) => listener(list));
  }
}

// Global instance
export const globalResourceManager = new ResourceManager();
