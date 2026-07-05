/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";

interface WorkflowStep {
  id: string;
  name: string;
  status: "idle" | "running" | "completed" | "failed";
  duration?: string;
  logs?: string[];
}

interface WorkflowState {
  workflowActive: boolean;
  steps: WorkflowStep[];
  startWorkflow: () => void;
  updateStepStatus: (id: string, status: WorkflowStep["status"], duration?: string, log?: string) => void;
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflowActive: false,
  steps: [
    { id: "step-1", name: "Helios Synaptic Context Alignment", status: "idle", logs: [] },
    { id: "step-2", name: "Cognitive Weights Parameter Verification", status: "idle", logs: [] },
    { id: "step-3", name: "Neural Inference Path Optimization", status: "idle", logs: [] },
    { id: "step-4", name: "Hyper-Parameter Dispatch Deployment", status: "idle", logs: [] },
  ],
  startWorkflow: () => set({ workflowActive: true }),
  updateStepStatus: (id, status, duration, log) =>
    set((state) => ({
      steps: state.steps.map((step) => {
        if (step.id === id) {
          const updatedLogs = log && step.logs ? [...step.logs, log] : step.logs;
          return { ...step, status, duration, logs: updatedLogs };
        }
        return step;
      }),
    })),
  resetWorkflow: () =>
    set((state) => ({
      workflowActive: false,
      steps: state.steps.map((s) => ({ ...s, status: "idle", duration: undefined, logs: [] })),
    })),
}));
