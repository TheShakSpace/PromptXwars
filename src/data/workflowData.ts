import { type WorkflowData } from "../types";

export const workflowData: WorkflowData[] = [
  {
    id: "step-1",
    stepNumber: 1,
    title: "Authenticate Workspace",
    description: "Initialize security handshake and verify local system context.",
    status: "completed",
    duration: "140ms",
  },
  {
    id: "step-2",
    stepNumber: 2,
    title: "Load 3D Spatial Canvas",
    description: "Compile and stream Spline vector coordinates directly to GPU.",
    status: "running",
    duration: "450ms",
  },
  {
    id: "step-3",
    stepNumber: 3,
    title: "Link Generative Routines",
    description: "Prepare secondary API nodes and cache standard prompt frameworks.",
    status: "idle",
    duration: "85ms",
  },
  {
    id: "step-4",
    stepNumber: 4,
    title: "Synaptic Core Handshake",
    description: "Complete full telemetry loop and broadcast operational ready state.",
    status: "idle",
    duration: "30ms",
  },
];
