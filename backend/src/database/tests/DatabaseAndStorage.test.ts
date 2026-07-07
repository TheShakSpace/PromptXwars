/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { databaseEngine } from "../DatabaseEngine";
import { repositoryManager } from "../RepositoryManager";
import { cacheManager } from "../CacheManager";
import { storageEngine } from "../../storage/StorageEngine";
import { uploadManager } from "../../storage/UploadManager";
import { fileManager } from "../../storage/FileManager";
import { migrationManager } from "../MigrationManager";
import { backupManager } from "../BackupManager";
import { searchIndexer } from "../SearchIndexer";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

export async function runAllDatabaseAndStorageTests(): Promise<void> {
  console.log("\n============================================================");
  console.log("RUNNING UNIVERSAL DATABASE & STORAGE ENGINE TEST SUITE");
  console.log("============================================================\n");

  try {
    // Initialize engines
    await databaseEngine.initialize();

    // 1. Database Engine & Providers
    console.log("Testing Database Engine & Providers...");
    const providers = databaseEngine.getRegisteredProviders();
    await assert(providers.includes("PostgreSQL"), "Registered providers include PostgreSQL");
    await assert(providers.includes("MongoDB"), "Registered providers include MongoDB");

    const pgHealth = await databaseEngine.getActiveProvider().healthCheck();
    await assert(pgHealth.status === "Healthy", "Active provider (PostgreSQL) is Healthy");

    // Switch to Mongo
    await databaseEngine.switchProvider("MongoDB");
    await assert(databaseEngine.getActiveProvider().name === "MongoDB", "Successfully switched to MongoDB");

    const mongoHealth = await databaseEngine.getActiveProvider().healthCheck();
    await assert(mongoHealth.status === "Healthy", "Active provider (MongoDB) is Healthy");

    // Switch back to PostgreSQL
    await databaseEngine.switchProvider("PostgreSQL");
    await assert(databaseEngine.getActiveProvider().name === "PostgreSQL", "Successfully switched back to PostgreSQL");

    // Transactions and rollbacks
    const repo = repositoryManager.users;
    const tx = await databaseEngine.getActiveProvider().transaction();
    await repo.create({ id: "tx_user_1", name: "Alice Transact" }, { transaction: tx });
    
    const foundBefore = await repo.findOne({ id: "tx_user_1" });
    await assert(foundBefore !== null, "User visible inside transaction context before rollback");

    await tx.rollback();
    const foundAfter = await repo.findOne({ id: "tx_user_1" });
    await assert(foundAfter === null, "User successfully rolled back and removed from tables");


    // 2. Repository Manager (CRUD)
    console.log("\nTesting Repository Manager (CRUD)...");
    const user = await repo.create({ id: "u123", name: "Developer AI", role: "admin" });
    await assert(user.id === "u123", "User record created successfully");

    const foundUser = await repo.findOne({ id: "u123" });
    await assert(foundUser !== null && foundUser.role === "admin", "User record fetched cleanly");

    const updated = await repo.update({ id: "u123" }, { role: "super_admin" });
    await assert(updated[0].role === "super_admin", "User record updated cleanly");

    const deletedCount = await repo.delete({ id: "u123" });
    await assert(deletedCount === 1, "User record deleted cleanly");


    // 3. Cache Manager (TTL & LRU Eviction)
    console.log("\nTesting Cache Manager (TTL & LRU Eviction)...");
    await cacheManager.clear();
    await cacheManager.set("session_token_1", "secure_claim_payload");
    const val1 = await cacheManager.get("session_token_1");
    await assert(val1 === "secure_claim_payload", "Cache value set and retrieved cleanly");

    cacheManager.setMode("Redis");
    await assert(cacheManager.getMode() === "Redis", "Successfully toggled Redis mode");

    await cacheManager.set("session_token_2", "redis_payload", 5000);
    const val2 = await cacheManager.get("session_token_2");
    await assert(val2 === "redis_payload", "Redis mode Cache value retrieved cleanly");

    cacheManager.setMode("Memory");


    // 4. Storage Engine & Providers
    console.log("\nTesting Storage Engine & Providers...");
    const content = Buffer.from("Hello Helios Storage Interface!");
    const uploadedFile = await storageEngine.uploadFile({
      name: "test_info.txt",
      buffer: content,
      mimeType: "text/plain",
    });
    await assert(uploadedFile.id !== undefined && uploadedFile.name === "test_info.txt", "File uploaded cleanly with secure virus scans");

    const downloadStream = await storageEngine.getFileBuffer(uploadedFile.id);
    await assert(downloadStream.buffer.toString() === "Hello Helios Storage Interface!", "File downloaded matching source bytes");

    storageEngine.setProvider("AWS_S3");
    await assert(storageEngine.getProviderType() === "AWS_S3", "Switched dynamically to AWS S3 storage provider");

    const fileObjS3 = await storageEngine.uploadFile({
      name: "cloud_archive.zip",
      buffer: Buffer.from("ZIPBINARYSTREAM"),
      mimeType: "application/zip",
    });
    const s3Url = await storageEngine.getActiveProvider().generateSignedUrl(fileObjS3.path, 300);
    await assert(s3Url.includes("s3.amazonaws.com"), "AWS S3 signed secure timed download URL successfully generated");

    storageEngine.setProvider("Local");


    // 5. Upload Manager (Chunk & Multi-part upload)
    console.log("\nTesting Upload Manager (Chunk & Multi-part upload)...");
    const session = uploadManager.initializeSession("large_binary.bin", 3000, "application/octet-stream", 3);
    await assert(session.sessionId !== undefined && session.status === "Uploading", "Multi-part chunk session initialized cleanly");

    await uploadManager.uploadChunk(session.sessionId, 1, Buffer.from("CHUNK_A_"));
    await assert(session.progressPercent === 33, "Chunk 1 uploaded, progress tracked successfully");

    uploadManager.pauseSession(session.sessionId);
    await assert(session.status === "Paused", "Upload session paused correctly");

    uploadManager.resumeSession(session.sessionId);
    await assert(session.status === "Uploading", "Upload session resumed correctly");

    await uploadManager.uploadChunk(session.sessionId, 2, Buffer.from("CHUNK_B_"));
    await uploadManager.uploadChunk(session.sessionId, 3, Buffer.from("CHUNK_C"));
    await assert(session.progressPercent === 100, "All chunks uploaded cleanly");

    const completedMeta = await uploadManager.assembleAndFinalize(session.sessionId);
    const downloadMerged = await storageEngine.getFileBuffer(completedMeta.id);
    await assert(downloadMerged.buffer.toString() === "CHUNK_A_CHUNK_B_CHUNK_C", "Chunks dynamically merged in correct sequence");


    // 6. File Manager (Unified Storage and Repository Database)
    console.log("\nTesting File Manager (Unified Storage and Repository Database)...");
    const sample = Buffer.from("Dynamic file data index integration");
    const uploaded = await fileManager.saveFile("index_report.pdf", sample, "application/pdf");
    const filesInRepo = await fileManager.listFiles({ id: uploaded.id });
    await assert(filesInRepo.length === 1 && filesInRepo[0].name === "index_report.pdf", "File metadata recorded inside database files repository");

    const signedUrl = await fileManager.getSignedUrl(uploaded.id);
    await assert(signedUrl !== undefined, "TIMED secure signed URL produced on demand");

    await fileManager.removeFile(uploaded.id);
    const filesAfter = await fileManager.listFiles({ id: uploaded.id });
    await assert(filesAfter.length === 0, "File deleted cleanly from storage and database files repository");


    // 7. Migration Manager (Schema & Versioning)
    console.log("\nTesting Migration Manager (Schema & Versioning)...");
    const statusList = await migrationManager.getStatus();
    await assert(statusList.length > 0, "Migration manager loaded schema statuses");

    const runLog = await migrationManager.migrate();
    await assert(runLog.length > 0 && runLog[0].status === "Applied", "Migrations run sequentially and log successfully");

    const rollbackResult = await migrationManager.rollback();
    await assert(rollbackResult !== null && rollbackResult.status === "Pending", "Rollback last migration sets status correctly to pending");


    // 8. Backup Manager (JSON Payload Export & System Restoration)
    console.log("\nTesting Backup Manager (JSON Payload Export & System Restoration)...");
    await repo.delete({});
    await repo.create({ id: "seed_1", name: "Backup Tester One" });
    await repo.create({ id: "seed_2", name: "Backup Tester Two" });

    const backupMeta = await backupManager.createBackup();
    await assert(backupMeta.id !== undefined && backupMeta.recordsCount >= 2, "Backups export and serialize current repository cleanly");

    await repo.delete({});
    const preRestoreCount = await repo.count({});
    await assert(preRestoreCount === 0, "Tables cleared cleanly for system restoration verification");

    const restoreResult = await backupManager.restoreBackup(backupMeta.id);
    await assert(restoreResult.success === true, "Restore backup execution returned success status");

    const postRestoreCount = await repo.count({});
    await assert(postRestoreCount === 2, "Tables records restored cleanly following rollback database load");


    // 9. Search Indexer (Full Text Searches)
    console.log("\nTesting Search Indexer (Full Text Searches)...");
    searchIndexer.clearIndex();

    searchIndexer.indexDocument(
      "doc_agent_1",
      "agents",
      "Helios Advanced AI Agent capable of orchestrating complex logical paths and workflows",
      ["ai", "orchestrator"],
      { status: "active" }
    );

    searchIndexer.indexDocument(
      "doc_agent_2",
      "agents",
      "Simple greeting and conversation helper agent with basic memory pools",
      ["helper", "greeting"],
      { status: "active" }
    );

    const match1 = searchIndexer.search("orchestrating");
    await assert(match1.length === 1 && match1[0].id === "doc_agent_1", "Keyword search queries matches correctly");

    const match2 = searchIndexer.search("agent", { collection: "agents", metadata: { status: "active" } });
    await assert(match2.length === 2, "Collection and metadata filtered search matches correctly");

    const match3 = searchIndexer.search("agent", { tags: ["helper"] });
    await assert(match3.length === 1 && match3[0].id === "doc_agent_2", "Tag filtered search matches correctly");


    console.log("\n============================================================");
    console.log("ALL UNIVERSAL DATABASE & STORAGE TESTS PASSED SUCCESSFULLY!");
    console.log("============================================================\n");
  } catch (err: any) {
    console.error("\n❌ DATABASE & STORAGE TEST RUNNER CRITICAL ERROR:");
    console.error(err.message);
    console.error(err.stack);
    throw err;
  }
}
