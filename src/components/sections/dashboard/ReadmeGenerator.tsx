/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Clipboard, Check, FileText, Download } from "lucide-react";

export function ReadmeGenerator() {
  const [copied, setCopied] = useState(false);

  const readmeContent = `# 🪐 Helios AI Universal Operating System

An immersive, config-driven commercial AI multi-agent cockpit designed to instantly adapt to distinct compliance industries.

---

## 🏗️ Technical Architecture Diagram

\`\`\`
                     +---------------------------------------+
                     |         platformConfig.json           |
                     |  (Configures active industry/theme)   |
                     +---------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |          DatasetManager               |
                     |  (Resolves metrics & telemetry lists) |
                     +---------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |           LayoutEngine                |
                     |  (Adapts grids, forms, and charts)    |
                     +---------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |          Unified Workspace            |
                     |   (Healthcare, Finance, Legal, etc.)  |
                     +---------------------------------------+
\`\`\`

---

## 📂 Core Folder Structure

\`\`\`
/src
 ├── /animations      # Hardware accelerated cinematic layers
 ├── /branding        # Global color styles and logo builders
 ├── /components      # Core workspace panels & UI systems
 ├── /config          # Static pivot parameters
 ├── /contexts        # State systems & audio registers
 ├── /datasets        # Pivot metric records (JSON)
 ├── /hooks           # Smooth scrolling & viewport listeners
 ├── /modules         # Dynamic bento layout compilers
 └── /prompts         # Role-play prompt compilers
\`\`\`

---

## 🚀 Speed-Run Installation

\`\`\`bash
# 1. Clone repository
git clone https://github.com/example/helios-ai-os.git

# 2. Install production dependencies
npm install

# 3. Launch local developer server (Port: 3000)
npm run dev

# 4. Build optimized deployment bundle
npm run build
\`\`\`

---

## 🛡️ Premium Security Guardrails

- **Dynamic PII Filters**: Filters out customer identifiers prior to compiling prompting payloads.
- **WebGL Degrade Buffer**: Auto-detects legacy hardware and fails gracefully to high-performance SVG canvas particle streams.
- **Offline Sync Queues**: Safely registers transaction actions during network signal loss.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4.5 text-left font-sans flex flex-col gap-3.5">
      
      {/* Header info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#4F8CFF]" />
          <span className="font-mono text-[8.5px] text-white/40 tracking-widest uppercase font-bold">
            README MARKDOWN ENGINE
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 hover:bg-white/10 text-[9px] font-mono text-white/80 rounded-lg transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> COPIED_TO_CLIPBOARD
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" /> COPY_MARKDOWN
            </>
          )}
        </button>
      </div>

      {/* Code box */}
      <div className="relative">
        <pre className="p-4 bg-neutral-950 rounded-xl border border-white/5 text-[9px] text-white/60 font-mono overflow-x-auto max-h-[220px] scrollbar-thin leading-relaxed select-all">
          {readmeContent}
        </pre>
      </div>

    </div>
  );
}
