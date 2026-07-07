/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChatMessage {
  role: string;
  content: string;
  timestamp?: string;
}

export interface KnowledgeDoc {
  source: string;
  content: string;
  score?: number;
}

export interface UploadedFile {
  name: string;
  content: string;
  mimeType?: string;
}

export interface ContextPayload {
  conversation?: ChatMessage[];
  memory?: string[];
  knowledge?: KnowledgeDoc[];
  files?: UploadedFile[];
  workflowState?: Record<string, any>;
  userProfile?: Record<string, any>;
}

export class ContextInjector {
  /**
   * Translates chat history array to a formatted dialogue context block.
   */
  static injectConversation(history: ChatMessage[]): string {
    if (!history || history.length === 0) return "";
    
    let block = "<conversation_history>\n";
    for (const msg of history) {
      const roleName = msg.role.toUpperCase() === "USER" ? "User" : "Assistant";
      block += `[${roleName}]: ${msg.content}\n`;
    }
    block += "</conversation_history>";
    return block;
  }

  /**
   * Translates memories to structured system knowledge.
   */
  static injectMemory(memories: string[]): string {
    if (!memories || memories.length === 0) return "";
    
    let block = "<retrieved_memories>\n";
    for (let i = 0; i < memories.length; i++) {
      block += `- Memory [${i + 1}]: ${memories[i]}\n`;
    }
    block += "</retrieved_memories>";
    return block;
  }

  /**
   * Formats RAG documents/knowledge facts into structured context blocks.
   */
  static injectKnowledge(docs: KnowledgeDoc[]): string {
    if (!docs || docs.length === 0) return "";
    
    let block = "<knowledge_reference_sources>\n";
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const matchText = doc.score !== undefined ? ` (Match Score: ${(doc.score * 100).toFixed(1)}%)` : "";
      block += `[Source ${i + 1}]: "${doc.source}"${matchText}\n`;
      block += `Content:\n"""\n${doc.content}\n"""\n\n`;
    }
    block += "</knowledge_reference_sources>";
    return block;
  }

  /**
   * Formats file attachments/code bases into file structural blocks.
   */
  static injectUploadedFiles(files: UploadedFile[]): string {
    if (!files || files.length === 0) return "";
    
    let block = "<uploaded_files_attachments>\n";
    for (const file of files) {
      block += `File: "${file.name}"${file.mimeType ? ` (Type: ${file.mimeType})` : ""}\n`;
      block += `Content:\n"""\n${file.content}\n"""\n\n`;
    }
    block += "</uploaded_files_attachments>";
    return block;
  }

  /**
   * Formats running workflow environment parameters.
   */
  static injectWorkflowState(state: Record<string, any>): string {
    if (!state || Object.keys(state).length === 0) return "";
    
    return `<active_workflow_state>\n${JSON.stringify(state, null, 2)}\n</active_workflow_state>`;
  }

  /**
   * Formats active user details or preferences.
   */
  static injectUserProfile(profile: Record<string, any>): string {
    if (!profile || Object.keys(profile).length === 0) return "";
    
    return `<user_profile_metadata>\n${JSON.stringify(profile, null, 2)}\n</user_profile_metadata>`;
  }

  /**
   * Combines all available context blocks into a single robust XML structural prompt segment.
   */
  static assemble(payload: ContextPayload): string {
    const blocks: string[] = [];

    if (payload.userProfile) {
      blocks.push(this.injectUserProfile(payload.userProfile));
    }
    if (payload.workflowState) {
      blocks.push(this.injectWorkflowState(payload.workflowState));
    }
    if (payload.memory && payload.memory.length > 0) {
      blocks.push(this.injectMemory(payload.memory));
    }
    if (payload.knowledge && payload.knowledge.length > 0) {
      blocks.push(this.injectKnowledge(payload.knowledge));
    }
    if (payload.files && payload.files.length > 0) {
      blocks.push(this.injectUploadedFiles(payload.files));
    }
    if (payload.conversation && payload.conversation.length > 0) {
      blocks.push(this.injectConversation(payload.conversation));
    }

    return blocks.filter((b) => b.trim().length > 0).join("\n\n");
  }
}
