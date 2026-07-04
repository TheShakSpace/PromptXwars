/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import { projectData } from "../../../data/projectData";
import { Briefcase, ChevronRight, Pin, Plus, FolderGit2, CheckCircle, RefreshCw } from "lucide-react";

export function Projects() {
  const { activeProjectId, setActiveProjectId, addNotification } = useOS();
  const [pinnedIds, setPinnedIds] = useState<string[]>(["proj-helios-core"]);

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pinnedIds.includes(id)) {
      setPinnedIds(pinnedIds.filter((pId) => pId !== id));
      addNotification("Pin Removed", "Project unpinned from priority view.", "info");
    } else {
      setPinnedIds([...pinnedIds, id]);
      addNotification("Project Pinned", "Project set as priority operational node.", "success");
    }
  };

  const handleAddNewProject = () => {
    addNotification("Access Restricted", "Operator limits reached. Upgrades are managed in Settings.", "warning");
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#050505]/40 backdrop-blur-xl relative overflow-hidden group hover:border-[#4F8CFF]/20 transition-colors h-full flex flex-col justify-between">
      
      <div>
        {/* Header Block */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 select-none">
            <Briefcase className="w-4 h-4 text-[#F59E0B]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">ACTIVE REPOSITORIES</span>
          </div>

          <button
            onClick={handleAddNewProject}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all flex items-center justify-center cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Projects List Stack */}
        <div className="flex flex-col gap-3.5">
          {projectData.map((project) => {
            const isActive = project.id === activeProjectId;
            const isPinned = pinnedIds.includes(project.id);

            // Mock complete progression rates
            const completionRate = project.status === "completed" ? 100 : project.status === "active" ? 78 : 34;

            return (
              <div
                key={project.id}
                onClick={() => {
                  setActiveProjectId(project.id);
                  addNotification("Focus Node Swapped", `Operational focus focused on thread: ${project.name}`, "info");
                }}
                className={`p-4 rounded-2xl border transition-all relative select-none cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-white/5 border-[#F59E0B]/30 shadow-[0_4px_25px_rgba(245,158,11,0.05)]"
                    : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                }`}
              >
                {/* Upper row: meta details */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-black text-xs text-white truncate leading-tight">
                        {project.name}
                      </span>
                      {isPinned && <Pin className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />}
                    </div>
                    <span className="font-mono text-[8.5px] text-[#F59E0B] tracking-wider uppercase mt-1 block">
                      {project.category}
                    </span>
                  </div>

                  {/* Actions pin */}
                  <button
                    onClick={(e) => handleTogglePin(project.id, e)}
                    className="opacity-40 hover:opacity-100 transition-opacity p-1"
                  >
                    <Pin className={`w-3.5 h-3.5 ${isPinned ? "text-[#F59E0B]" : "text-white/40"}`} />
                  </button>
                </div>

                {/* Main description description body */}
                <p className="font-sans text-[10.5px] text-white/40 leading-relaxed font-light mb-3 truncate-3-lines">
                  {project.description}
                </p>

                {/* Progression metric and lower details */}
                <div className="flex flex-col gap-2.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between font-mono text-[8.5px] text-white/35">
                    <span>PROGRESSION LAYER</span>
                    <span className="text-white/70 font-semibold">{completionRate}%</span>
                  </div>

                  {/* Glass slide slider */}
                  <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: project.status === "completed" 
                          ? "#10B981" 
                          : project.status === "active" 
                          ? "#F59E0B" 
                          : "#4F8CFF",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Lowest stats bar */}
                  <div className="flex items-center justify-between mt-1 font-mono text-[8px] text-white/30">
                    <span className="flex items-center gap-1">
                      {project.status === "active" ? (
                        <RefreshCw className="w-2.5 h-2.5 text-[#F59E0B] animate-spin" />
                      ) : (
                        <CheckCircle className="w-2.5 h-2.5 text-green-400" />
                      )}
                      {project.status.toUpperCase()}
                    </span>
                    <span>{(project.tokensUsed / 1000).toFixed(0)}k Tokens</span>
                    <span>{project.lastActive}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview stats layer */}
      <div className="mt-5 border-t border-white/5 pt-4 flex justify-between select-none font-mono text-[9px] text-white/40">
        <span>TOTAL SAVED ARCHIVES: {projectData.length}</span>
        <span>PRIORITY LEVEL: HIGH</span>
      </div>

    </div>
  );
}
