/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { databaseEngine } from "./DatabaseEngine";
import { DatabaseProvider, QueryOptions } from "./DatabaseProvider";

export class Repository<T extends { id?: string; _id?: string }> {
  constructor(protected collectionName: string) {}

  protected get provider(): DatabaseProvider {
    return databaseEngine.getActiveProvider();
  }

  public async find(filter: Record<string, any> = {}, options?: QueryOptions): Promise<T[]> {
    return this.provider.find<T>(this.collectionName, filter, options);
  }

  public async findOne(filter: Record<string, any> = {}, options?: QueryOptions): Promise<T | null> {
    return this.provider.findOne<T>(this.collectionName, filter, options);
  }

  public async create(data: Record<string, any>, options?: QueryOptions): Promise<T> {
    return this.provider.create<T>(this.collectionName, data, options);
  }

  public async update(filter: Record<string, any>, updateData: Record<string, any>, options?: QueryOptions): Promise<T[]> {
    return this.provider.update<T>(this.collectionName, filter, updateData, options);
  }

  public async delete(filter: Record<string, any>, options?: QueryOptions): Promise<number> {
    return this.provider.delete(this.collectionName, filter, options);
  }

  public async count(filter: Record<string, any> = {}): Promise<number> {
    const list = await this.find(filter);
    return list.length;
  }
}

// Concrete Repositories satisfying all requested items
export class UserRepository extends Repository<any> { constructor() { super("users"); } }
export class ProjectRepository extends Repository<any> { constructor() { super("projects"); } }
export class ChatRepository extends Repository<any> { constructor() { super("chats"); } }
export class ConversationRepository extends Repository<any> { constructor() { super("conversations"); } }
export class WorkflowRepository extends Repository<any> { constructor() { super("workflows"); } }
export class PromptRepository extends Repository<any> { constructor() { super("prompts"); } }
export class AgentRepository extends Repository<any> { constructor() { super("agents"); } }
export class MemoryRepository extends Repository<any> { constructor() { super("memory"); } }
export class FileRepository extends Repository<any> { constructor() { super("files"); } }
export class TemplateRepository extends Repository<any> { constructor() { super("templates"); } }
export class LogRepository extends Repository<any> { constructor() { super("logs"); } }
export class AnalyticsRepository extends Repository<any> { constructor() { super("analytics"); } }

export class RepositoryManager {
  private static instance: RepositoryManager;

  public readonly users = new UserRepository();
  public readonly projects = new ProjectRepository();
  public readonly chats = new ChatRepository();
  public readonly conversations = new ConversationRepository();
  public readonly workflows = new WorkflowRepository();
  public readonly prompts = new PromptRepository();
  public readonly agents = new AgentRepository();
  public readonly memory = new MemoryRepository();
  public readonly files = new FileRepository();
  public readonly templates = new TemplateRepository();
  public readonly logs = new LogRepository();
  public readonly analytics = new AnalyticsRepository();

  private constructor() {}

  public static getInstance(): RepositoryManager {
    if (!RepositoryManager.instance) {
      RepositoryManager.instance = new RepositoryManager();
    }
    return RepositoryManager.instance;
  }
}

export const repositoryManager = RepositoryManager.getInstance();
export default repositoryManager;
