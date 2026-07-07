/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from "../interfaces/AIProvider.interface";
import { ProviderRegistry } from "./ProviderRegistry";

export class AIProviderFactory {
  /**
   * Resolves and returns the registered provider for a given provider name or ID.
   * Throws an error if the provider is unsupported.
   */
  static getProvider(providerName: string): AIProvider {
    const cleanName = providerName.trim().toLowerCase();
    
    // Direct lookup in registry
    const provider = ProviderRegistry.get(cleanName);
    if (provider) {
      return provider;
    }

    // Handle loose naming variations
    const allProviders = ProviderRegistry.getAll();
    const fuzzyMatch = allProviders.find((p) => 
      p.name.toLowerCase().includes(cleanName) || cleanName.includes(p.id)
    );

    if (fuzzyMatch) {
      return fuzzyMatch;
    }

    throw new Error(`AI Provider "${providerName}" is not registered or supported by this engine.`);
  }
}
