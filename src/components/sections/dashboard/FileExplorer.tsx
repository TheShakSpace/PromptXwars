/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { 
  Folder, FileCode, UploadCloud, ChevronRight, File, 
  Trash2, Plus, ArrowUpRight, Search 
} from "lucide-react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  extension?: "tsx" | "ts" | "json" | "css";
  lastUpdated: string;
}

export function FileExplorer() {
  const { addNotification } = useOS();
  const [currentPath, setCurrentPath] = useState<string[]>(["Root"]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>("file-1");
  const [isDragging, setIsDragging] = useState(false);

  const [files, setFiles] = useState<FileNode[]>([
    { id: "dir-1", name: "components", type: "folder", lastUpdated: "Just now" },
    { id: "dir-2", name: "contexts", type: "folder", lastUpdated: "14m ago" },
    { id: "dir-3", name: "data", type: "folder", lastUpdated: "2h ago" },
    { id: "file-1", name: "App.tsx", type: "file", size: "14.2 KB", extension: "tsx", lastUpdated: "Just now" },
    { id: "file-2", name: "OSContext.tsx", type: "file", size: "8.8 KB", extension: "tsx", lastUpdated: "Just now" },
    { id: "file-3", name: "projectData.ts", type: "file", size: "1.2 KB", extension: "ts", lastUpdated: "3h ago" },
    { id: "file-4", name: "index.css", type: "file", size: "4.5 KB", extension: "css", lastUpdated: "1d ago" },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate drops
    const newFile: FileNode = {
      id: `file-drop-${Date.now()}`,
      name: "schema.ts",
      type: "file",
      size: "2.4 KB",
      extension: "ts",
      lastUpdated: "Just now",
    };

    setFiles((prev) => [...prev, newFile]);
    addNotification("Upload Success", "Consolidated file schema.ts into root directory.", "success");
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(files.filter((f) => f.id !== id));
    if (selectedFileId === id) setSelectedFileId(null);
    addNotification("File Deleted", "Resource removed from workspace successfully.", "warning");
  };

  const selectedFile = files.find((f) => f.id === selectedFileId);

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      
      {/* Directory structure listings */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl flex flex-col justify-between h-full min-h-[400px]">
        
        <div>
          {/* Breadcrumb line */}
          <div className="flex items-center gap-2 mb-6 text-white/40 font-mono text-[9px] select-none tracking-widest uppercase">
            <Folder className="w-4 h-4 text-[#14B8A6]" />
            <div className="flex items-center gap-1">
              {currentPath.map((path, idx) => (
                <React.Fragment key={path}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-white/20" />}
                  <span className={idx === currentPath.length - 1 ? "text-white/80 font-bold" : "hover:text-white transition-colors cursor-pointer"}>
                    {path}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Files grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {files.map((file) => {
              const isSelected = selectedFileId === file.id;
              const isFolder = file.type === "folder";

              return (
                <div
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between relative group select-none cursor-pointer ${
                    isSelected
                      ? "bg-white/5 border-[#14B8A6]/40 shadow-inner"
                      : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                        isSelected ? "bg-white/10 border-white/10" : "bg-white/[0.02] border-white/5"
                      }`}
                    >
                      {isFolder ? (
                        <Folder className="w-4.5 h-4.5 text-[#14B8A6]" />
                      ) : (
                        <FileCode className="w-4.5 h-4.5 text-[#4F8CFF]" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white/95 leading-tight">{file.name}</span>
                      <span className="text-[9px] text-white/35 font-mono mt-0.5 uppercase tracking-wide">
                        {isFolder ? "FOLDER" : file.size}
                      </span>
                    </div>
                  </div>

                  {/* Actions on file */}
                  <button
                    onClick={(e) => handleDeleteFile(file.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-white/35 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drag & Drop interactive zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-6 rounded-2xl border border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 select-none cursor-pointer ${
            isDragging
              ? "bg-[#14B8A6]/10 border-[#14B8A6] text-[#14B8A6] scale-98"
              : "bg-white/[0.01] border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
          }`}
        >
          <UploadCloud className={`w-8 h-8 ${isDragging ? "animate-bounce" : ""}`} />
          <div className="font-sans text-xs font-semibold">
            {isDragging ? "DROP FILES TO STASH" : "DRAG & DROP MODULE FILES"}
          </div>
          <span className="font-mono text-[9px] text-white/25">Supports schemas, tsx, json up to 10MB</span>
        </div>

      </div>

      {/* Side preview card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl h-full flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key={selectedFile.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 select-none"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <FileCode className="w-4 h-4 text-[#4F8CFF]" />
                <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">FILE PREVIEW LAYER</span>
              </div>

              <div>
                <span className="font-mono text-[8px] text-[#14B8A6] tracking-wider uppercase font-bold">RESOURCE INDICES</span>
                <h4 className="font-sans font-black text-sm text-white/95 mt-1">{selectedFile.name}</h4>
                <p className="font-mono text-[9px] text-white/40 mt-1 uppercase">LAST SYNCED: {selectedFile.lastUpdated}</p>
              </div>

              {/* Mock code coordinate preview container */}
              <div className="bg-black/50 border border-white/5 rounded-2xl p-4 font-mono text-[9px] text-white/60 leading-relaxed overflow-x-auto select-text h-44">
                {selectedFile.extension === "tsx" || selectedFile.extension === "ts" ? (
                  <pre>{`/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { useOS } from "./OSContext";

export function Render() {
  const { model } = useOS();
  return (
    <div className="node">
      Loaded successfully.
    </div>
  );
}`}</pre>
                ) : (
                  <pre>{`{
  "name": "helios-os-app",
  "version": "2.4.0",
  "dependencies": {
    "motion": "12.0.0",
    "react": "19.0.0"
  }
}`}</pre>
                )}
              </div>

              <button
                onClick={() => addNotification("Index Initiated", `Parsing abstract syntax tree: ${selectedFile.name}`, "info")}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>COMPILE SYNTAX LAYER</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 gap-3 select-none text-white/30 h-full">
              <File className="w-8 h-8" />
              <span className="font-mono text-[9px] tracking-widest uppercase font-bold">SELECT FILE FOR PREVIEW</span>
            </div>
          )}
        </AnimatePresence>

        {selectedFile && (
          <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[8px] text-white/30">
            <span>MUTATION STATUS: SYNCED</span>
            <span>INDEX SAFE: 100%</span>
          </div>
        )}
      </div>

    </div>
  );
}
