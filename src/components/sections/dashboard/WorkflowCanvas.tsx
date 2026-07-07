/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOS } from "../../../contexts/OSContext";
import {
  WorkflowNode,
  WorkflowConnection,
  TerminalLog,
  WorkflowStats,
  NodeType,
} from "./workflow/types";
import { WorkflowSidebar } from "./workflow/WorkflowSidebar";
import { WorkflowToolbar } from "./workflow/WorkflowToolbar";
import { WorkflowControls } from "./workflow/WorkflowControls";
import { WorkflowExporter } from "./workflow/WorkflowExporter";
import { WorkflowNode as NodeComponent } from "./workflow/WorkflowNode";
import { WorkflowEdge as EdgeComponent } from "./workflow/WorkflowEdge";
import { MiniMap } from "./workflow/MiniMap";
import { ExecutionConsole } from "./workflow/ExecutionConsole";
import { PropertiesPanel } from "./workflow/PropertiesPanel";
import { SlidersHorizontal, Layers, Play, Zap, HelpCircle } from "lucide-react";

// Initial preset datasets
const PRESETS = {
  research: {
    nodes: [
      {
        id: "node-1",
        name: "USER RESEARCH TRIGGER",
        type: "input" as NodeType,
        x: 60,
        y: 180,
        status: "completed" as const,
        progress: 100,
        runtime: 45,
        description: "Pipeline query parameter trigger",
        prompt: "Research the current tech advancements in fusion energy.",
        settings: { temperature: 0.2, maxTokens: 512 },
      },
      {
        id: "node-2",
        name: "RESEARCH DIRECTIVES",
        type: "prompt" as NodeType,
        x: 360,
        y: 180,
        status: "completed" as const,
        progress: 100,
        runtime: 120,
        description: "Sets persona & RAG search objectives",
        prompt: "Focus on commercial tokamaks & thermal coefficients.",
        settings: { temperature: 0.5, maxTokens: 1024 },
      },
      {
        id: "node-3",
        name: "RAG SEMANTIC MEMORY",
        type: "retriever" as NodeType,
        x: 660,
        y: 180,
        status: "completed" as const,
        progress: 100,
        runtime: 340,
        description: "Queries high-valency vector databases",
        dependencies: ["node-2"],
      },
      {
        id: "node-4",
        name: "LOGICAL REASONER CRITIC",
        type: "reasoning" as NodeType,
        x: 960,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Chain of thought fact checking",
        dependencies: ["node-3"],
      },
      {
        id: "node-5",
        name: "SYNTHESIZED BLUEPRINT",
        type: "output" as NodeType,
        x: 1260,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Saves final structured output report",
        dependencies: ["node-4"],
      },
    ],
    connections: [
      { id: "conn-1", fromNode: "node-1", toNode: "node-2", status: "completed" as const },
      { id: "conn-2", fromNode: "node-2", toNode: "node-3", status: "completed" as const },
      { id: "conn-3", fromNode: "node-3", toNode: "node-4", status: "idle" as const },
      { id: "conn-4", fromNode: "node-4", toNode: "node-5", status: "idle" as const },
    ],
  },
  rag: {
    nodes: [
      {
        id: "node-1",
        name: "KNOWLEDGE QUERY",
        type: "input" as NodeType,
        x: 80,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "User customer support query",
        prompt: "What is our refunds policy under SLA 12?",
      },
      {
        id: "node-2",
        name: "COMPLIANCE DB",
        type: "knowledge" as NodeType,
        x: 380,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Connects to internal refunds policy corpus",
      },
      {
        id: "node-3",
        name: "RAG ROUTER",
        type: "retriever" as NodeType,
        x: 680,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Fetch vector matches",
      },
      {
        id: "node-4",
        name: "GEMINI WRITER",
        type: "generator" as NodeType,
        x: 980,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Generates grounded support responses",
      },
      {
        id: "node-5",
        name: "RENDERED REPORT",
        type: "output" as NodeType,
        x: 1280,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Output rendered to screen",
      },
    ],
    connections: [
      { id: "conn-1", fromNode: "node-1", toNode: "node-3", status: "idle" as const },
      { id: "conn-2", fromNode: "node-2", toNode: "node-3", status: "idle" as const },
      { id: "conn-3", fromNode: "node-3", toNode: "node-4", status: "idle" as const },
      { id: "conn-4", fromNode: "node-4", toNode: "node-5", status: "idle" as const },
    ],
  },
  coder: {
    nodes: [
      {
        id: "node-1",
        name: "SCAN PDF SPECIFICATIONS",
        type: "ocr" as NodeType,
        x: 100,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "OCR scan blueprint parameters",
      },
      {
        id: "node-2",
        name: "LAYOUT VISION MAP",
        type: "vision" as NodeType,
        x: 400,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Analyze grid elements visual balance",
      },
      {
        id: "node-3",
        name: "EXTERNAL REST API",
        type: "api" as NodeType,
        x: 700,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Post visual layout stats to main system",
      },
      {
        id: "node-4",
        name: "RELATIONAL DATABASE",
        type: "database" as NodeType,
        x: 1000,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Commit logs to PostgreSQL database tables",
      },
      {
        id: "node-5",
        name: "DONE TELEMETRY",
        type: "output" as NodeType,
        x: 1300,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Final notification",
      },
    ],
    connections: [
      { id: "conn-1", fromNode: "node-1", toNode: "node-2", status: "idle" as const },
      { id: "conn-2", fromNode: "node-2", toNode: "node-3", status: "idle" as const },
      { id: "conn-3", fromNode: "node-3", toNode: "node-4", status: "idle" as const },
      { id: "conn-4", fromNode: "node-4", toNode: "node-5", status: "idle" as const },
    ],
  },
  simple: {
    nodes: [
      {
        id: "node-1",
        name: "INQUIRY",
        type: "input" as NodeType,
        x: 150,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Generic query initiation",
      },
      {
        id: "node-2",
        name: "DONE",
        type: "output" as NodeType,
        x: 550,
        y: 180,
        status: "idle" as const,
        progress: 0,
        description: "Standard terminal display",
      },
    ],
    connections: [{ id: "conn-1", fromNode: "node-1", toNode: "node-2", status: "idle" as const }],
  },
};

export function WorkflowCanvas() {
  const { addNotification } = useOS();

  // Canvas Viewport Coordinates & States
  const [zoom, setZoom] = useState(0.85);
  const [panX, setPanX] = useState(40);
  const [panY, setPanY] = useState(20);
  const [tool, setTool] = useState<"select" | "connect" | "pan">("select");
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Undo / Redo History States
  const [history, setHistory] = useState<{ nodes: WorkflowNode[]; connections: WorkflowConnection[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Primary Workspace Node Models
  const [nodes, setNodes] = useState<WorkflowNode[]>(PRESETS.research.nodes);
  const [connections, setConnections] = useState<WorkflowConnection[]>(PRESETS.research.connections);

  // Selected details
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-4");
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Running simulator state
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0); // 0 to 7 in reasoning stages
  const [speed, setSpeed] = useState<number>(1);

  // Console feed logs
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: "log-init",
      timestamp: "08:44:50",
      message: "Athene compiler framework initialized. Staged for logical graph pipelines.",
      type: "info",
    },
  ]);
  const [consoleExpanded, setConsoleExpanded] = useState(true);

  // Statistics
  const [stats, setStats] = useState<WorkflowStats>({
    executionTime: 0,
    nodesExecuted: 3,
    memoryUsed: 124,
    latency: 240,
    confidence: 94.5,
  });

  // Mouse drag & link states
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Port connection draft states
  const [linkingFromNodeId, setLinkingFromNodeId] = useState<string | null>(null);
  const [linkingPortType, setLinkingPortType] = useState<"source" | "target" | null>(null);
  const [tempMouseCoords, setTempMouseCoords] = useState({ x: 0, y: 0 });

  // Reference for canvas coordinate calculations
  const canvasRef = useRef<HTMLDivElement>(null);

  // Save current layout to history
  const pushToHistory = (newNodes: WorkflowNode[], newConns: WorkflowConnection[]) => {
    const nextHist = history.slice(0, historyIndex + 1);
    nextHist.push({ nodes: newNodes, connections: newConns });
    setHistory(nextHist);
    setHistoryIndex(nextHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetState = history[historyIndex - 1];
      setNodes(targetState.nodes);
      setConnections(targetState.connections);
      setHistoryIndex(historyIndex - 1);
      addNotification("Undo", "Reverted layout changes.", "info");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetState = history[historyIndex + 1];
      setNodes(targetState.nodes);
      setConnections(targetState.connections);
      setHistoryIndex(historyIndex + 1);
      addNotification("Redo", "Restored layout changes.", "info");
    }
  };

  // Keyboard Event Listeners for space panner / duplicate / undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing on input fields or textarea active editors
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Space = Pan mode toggled
      if (e.code === "Space") {
        setTool("pan");
      }

      // Delete key = Remove node
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) {
          const updatedNodes = nodes.filter((n) => n.id !== selectedNodeId);
          const updatedConns = connections.filter(
            (c) => c.fromNode !== selectedNodeId && c.toNode !== selectedNodeId
          );
          setNodes(updatedNodes);
          setConnections(updatedConns);
          setSelectedNodeId(null);
          pushToHistory(updatedNodes, updatedConns);
          addNotification("Node Removed", "Deleted target node blueprint.", "warning");
        }
      }

      // Ctrl + D = Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        if (selectedNodeId) {
          const original = nodes.find((n) => n.id === selectedNodeId);
          if (original) {
            const dupId = `node-${Date.now()}`;
            const duplicateNode: WorkflowNode = {
              ...original,
              id: dupId,
              x: original.x + 40,
              y: original.y + 40,
              status: "idle",
              progress: 0,
              name: `${original.name} (DUPLICATE)`,
            };
            const nextNodes = [...nodes, duplicateNode];
            setNodes(nextNodes);
            setSelectedNodeId(dupId);
            pushToHistory(nextNodes, connections);
            addNotification("Duplicate", `Cloned node: ${original.name}`, "info");
          }
        }
      }

      // Ctrl + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setTool("select");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [nodes, connections, selectedNodeId, historyIndex, history]);

  // Push initial layout to history
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ nodes, connections }]);
      setHistoryIndex(0);
    }
  }, []);

  // Preset loader
  const handleLoadTemplate = (presetName: keyof typeof PRESETS) => {
    const p = PRESETS[presetName];
    setNodes(p.nodes);
    setConnections(p.connections);
    setSelectedNodeId(p.nodes[0]?.id || null);
    pushToHistory(p.nodes, p.connections);
    addNotification("Template Loaded", `Loaded Preset Workflow template: ${presetName.toUpperCase()}`, "success");
    appendLog(`Loaded visual blueprint template context: ${presetName.toUpperCase()}`, "success");
  };

  // Log feed updater
  const appendLog = (msg: string, type: TerminalLog["type"] = "info") => {
    const now = new Date();
    const ts = now.toTimeString().split(" ")[0];
    const logId = `log-${Date.now()}-${Math.random()}`;
    setLogs((prev) => [...prev, { id: logId, timestamp: ts, message: msg, type }]);
  };

  // Infinite grid zoom-in/out multipliers
  const handleZoomIn = () => setZoom((z) => Math.min(2.0, z + 0.1));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, z - 0.1));
  const handleZoomReset = () => setZoom(0.85);
  const handleRecenter = () => {
    setZoom(0.85);
    setPanX(40);
    setPanY(20);
    addNotification("Viewport Recenter", "Aligned layout view to core coordinates.", "info");
  };

  // Add custom node
  const handleAddNode = (type: NodeType) => {
    const id = `node-${Date.now()}`;
    // Position node relative to viewport center
    const posX = Math.round((-panX + 250) / zoom);
    const posY = Math.round((-panY + 150) / zoom);

    const templateNode: WorkflowNode = {
      id,
      name: `${type.toUpperCase()} OPERATOR`,
      type,
      x: snapToGrid ? Math.round(posX / 20) * 20 : posX,
      y: snapToGrid ? Math.round(posY / 20) * 20 : posY,
      status: "idle",
      progress: 0,
      description: `Custom ${type} automation module.`,
      prompt: type === "prompt" ? "You are a helpful assistant." : undefined,
      settings: { temperature: 0.4, maxTokens: 1024 },
    };

    const nextNodes = [...nodes, templateNode];
    setNodes(nextNodes);
    setSelectedNodeId(id);
    pushToHistory(nextNodes, connections);
    addNotification("Node Created", `Injected ${type.toUpperCase()} block onto grid canvas.`, "success");
    appendLog(`Created modular operator instance: ${type.toUpperCase()}`, "debug");
  };

  // Node modifications
  const handleUpdateNode = (node: WorkflowNode) => {
    const nextNodes = nodes.map((n) => (n.id === node.id ? node : n));
    setNodes(nextNodes);
    pushToHistory(nextNodes, connections);
  };

  const handleDeleteNode = (id: string) => {
    const nextNodes = nodes.filter((n) => n.id !== id);
    const nextConns = connections.filter((c) => c.fromNode !== id && c.toNode !== id);
    setNodes(nextNodes);
    setConnections(nextConns);
    setSelectedNodeId(null);
    pushToHistory(nextNodes, nextConns);
    addNotification("Node Removed", "Deleted target logic node.", "warning");
  };

  // Clear all
  const handleClear = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    pushToHistory([], []);
    addNotification("Canvas Cleared", "Flushed all pipeline layers.", "warning");
    appendLog("Canvas flushed. Zero operational components detected.", "warning");
  };

  // Active Drag and Pan Event Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (tool === "pan" || e.button === 1 || e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // 1. Handle viewport pan dragging
    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
      return;
    }

    // 2. Handle specific node dragging
    if (draggedNodeId) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        // Calculate mouse relative to canvas with zoom scaling
        const mouseX = (e.clientX - rect.left - panX) / zoom;
        const mouseY = (e.clientY - rect.top - panY) / zoom;

        let nx = mouseX - dragOffset.x;
        let ny = mouseY - dragOffset.y;

        // Apply grid snapping if toggled
        if (snapToGrid) {
          nx = Math.round(nx / 20) * 20;
          ny = Math.round(ny / 20) * 20;
        }

        setNodes((prev) =>
          prev.map((n) => (n.id === draggedNodeId ? { ...n, x: nx, y: ny } : n))
        );
      }
      return;
    }

    // 3. Handle drafting active Bezier linkages coordinates
    if (linkingFromNodeId) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mx = (e.clientX - rect.left - panX) / zoom;
        const my = (e.clientY - rect.top - panY) / zoom;
        setTempMouseCoords({ x: mx, y: my });
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (draggedNodeId) {
      setDraggedNodeId(null);
      // Save updated drag coordinates to history
      pushToHistory(nodes, connections);
    }
    if (linkingFromNodeId) {
      setLinkingFromNodeId(null);
      setLinkingPortType(null);
    }
  };

  const handleStartDragNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedNodeId(id);
    setSelectedConnectionId(null);

    const rect = canvasRef.current?.getBoundingClientRect();
    const node = nodes.find((n) => n.id === id);

    if (rect && node) {
      const mouseX = (e.clientX - rect.left - panX) / zoom;
      const mouseY = (e.clientY - rect.top - panY) / zoom;

      setDraggedNodeId(id);
      setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
    }
  };

  const handlePortMouseDown = (
    e: React.MouseEvent,
    id: string,
    portType: "source" | "target"
  ) => {
    e.stopPropagation();
    setLinkingFromNodeId(id);
    setLinkingPortType(portType);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mx = (e.clientX - rect.left - panX) / zoom;
      const my = (e.clientY - rect.top - panY) / zoom;
      setTempMouseCoords({ x: mx, y: my });
    }
  };

  // Dropping connections from port mapping
  const handleNodeClickOrMouseUp = (e: React.MouseEvent, nodeId: string) => {
    // If drawing connections and releasing on another target port
    if (linkingFromNodeId && linkingFromNodeId !== nodeId) {
      const fromNode = nodes.find((n) => n.id === linkingFromNodeId);
      const toNode = nodes.find((n) => n.id === nodeId);

      if (fromNode && toNode) {
        // Source connects to Target. We enforce unique direction mapping
        const sourceId = linkingPortType === "source" ? linkingFromNodeId : nodeId;
        const targetId = linkingPortType === "target" ? linkingFromNodeId : nodeId;

        // Check if connection already exists
        const exists = connections.some(
          (c) => c.fromNode === sourceId && c.toNode === targetId
        );

        if (!exists) {
          const connId = `conn-${Date.now()}`;
          const newConn: WorkflowConnection = {
            id: connId,
            fromNode: sourceId,
            toNode: targetId,
            status: "idle",
          };
          const nextConns = [...connections, newConn];
          setConnections(nextConns);
          pushToHistory(nodes, nextConns);
          addNotification("Link Established", `Synthesized Bezier bridge from Node ${sourceId.split("-")[1]?.substring(0, 4)} to Node ${targetId.split("-")[1]?.substring(0, 4)}.`, "success");
          appendLog(`Synthesized connection: ${fromNode.name} → ${toNode.name}`, "debug");
        }
      }
    } else {
      setSelectedNodeId(nodeId);
      setSelectedConnectionId(null);
    }
    setLinkingFromNodeId(null);
    setLinkingPortType(null);
  };

  // Canvas wheel scroll = Zoom
  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const nextZoom = e.deltaY < 0 ? zoom + zoomIntensity : zoom - zoomIntensity;
    setZoom(Math.max(0.4, Math.min(2.0, nextZoom)));
  };

  // ==================== SEQUENCE SIMULATION PIPELINE ====================
  const handleRunWorkflow = async () => {
    if (nodes.length === 0) {
      addNotification("Empty Grid", "Configure nodes to start compilation.", "error");
      return;
    }

    setIsRunning(true);
    setConsoleExpanded(true);
    addNotification("Initializing Swarm Pipeline", "Connecting endpoints and triggering parameters.", "info");
    appendLog("Launching neural graph compilation... Staging pipeline layers.", "success");

    // Initialize all statuses to idle
    let currentNodesState: WorkflowNode[] = nodes.map((n) => ({
      ...n,
      status: "queued",
      progress: 0,
      runtime: undefined,
    }));
    setNodes(currentNodesState);

    let currentConnsState: WorkflowConnection[] = connections.map((c) => ({
      ...c,
      status: "idle",
    }));
    setConnections(currentConnsState);

    // Run sequentially
    for (let index = 0; index < currentNodesState.length; index++) {
      const node = currentNodesState[index];
      setActiveNodeId(node.id);

      // Adjust reasoning stages timeline based on active node type
      const stepMapping: Record<NodeType, number> = {
        input: 0,
        ocr: 0,
        speech: 0,
        vision: 0,
        prompt: 1,
        context: 1,
        knowledge: 1,
        retriever: 2,
        memory: 2,
        reasoning: 3,
        planning: 4,
        tool: 4,
        database: 4,
        automation: 4,
        api: 4,
        generator: 5,
        validation: 6,
        output: 7,
      };
      const activeStepIndex = stepMapping[node.type] ?? 0;
      setActiveStep(activeStepIndex);

      appendLog(`Activating node operator [${node.type.toUpperCase()}]: ${node.name}`, "info");

      // Set node to running
      currentNodesState = currentNodesState.map((n) =>
        n.id === node.id ? { ...n, status: "running" as const, progress: 10 } : n
      );
      setNodes(currentNodesState);

      // Pulse previous incoming connections to flowing
      currentConnsState = currentConnsState.map((c) =>
        c.toNode === node.id ? { ...c, status: "flowing" as const } : c
      );
      setConnections(currentConnsState);

      // Incremental timer simulating execution speed
      const executionTotalTime = (1000 + Math.random() * 1500) / speed;
      const stepTime = executionTotalTime / 10;

      for (let p = 20; p <= 100; p += 10) {
        await new Promise((resolve) => setTimeout(resolve, stepTime));
        currentNodesState = currentNodesState.map((n) =>
          n.id === node.id ? { ...n, progress: p } : n
        );
        setNodes(currentNodesState);

        if (p === 40) {
          if (node.type === "retriever") {
            appendLog("Index queries returning valency affinity matches.", "debug");
          } else if (node.type === "reasoning") {
            appendLog("Mathematical verification tree converging.", "debug");
          } else if (node.type === "generator") {
            appendLog("Receiving streaming output token matrices from Gemini.", "debug");
          }
        }
      }

      // Mark completed
      const runtimeMs = Math.round(executionTotalTime);
      currentNodesState = currentNodesState.map((n) =>
        n.id === node.id
          ? { ...n, status: "completed" as const, progress: 100, runtime: runtimeMs }
          : n
      );
      setNodes(currentNodesState);

      // Set connection to completed
      currentConnsState = currentConnsState.map((c) =>
        c.toNode === node.id ? { ...c, status: "completed" as const } : c
      );
      setConnections(currentConnsState);

      appendLog(`Operator completed execution in ${runtimeMs}ms. Schema status locked.`, "success");

      // Update statistics live
      setStats((prev) => ({
        ...prev,
        nodesExecuted: index + 1,
        executionTime: prev.executionTime + runtimeMs,
        confidence: Math.min(100, parseFloat((90 + Math.random() * 10).toFixed(1))),
        memoryUsed: Math.min(2048, Math.round(prev.memoryUsed + 12 + Math.random() * 18)),
      }));
    }

    setIsRunning(false);
    setActiveNodeId(null);
    setActiveStep(7);
    addNotification("Pipeline Compilation Succeeded", "All active operational nodes completed successfully.", "success");
    appendLog("Pipeline simulation finished. telemetry records archived.", "success");
  };

  const handleStopWorkflow = () => {
    setIsRunning(false);
    setActiveNodeId(null);
    // Reset all nodes to idle
    setNodes((prev) => prev.map((n) => ({ ...n, status: "idle", progress: 0, runtime: undefined })));
    setConnections((prev) => prev.map((c) => ({ ...c, status: "idle" })));
    addNotification("Pipeline Terminated", "Execution pipeline stopped by operator.", "warning");
    appendLog("Pipeline compilation aborted. Graph registers flushed.", "warning");
  };

  // Step-by-step debugger simulation
  const handleStepWorkflow = () => {
    addNotification("Stepping debugger", "Executing next isolated operational node.", "info");
    const nextIdleNode = nodes.find((n) => n.status === "idle" || n.status === "queued");
    if (!nextIdleNode) {
      appendLog("Debugger: No standby nodes left to step.", "warning");
      return;
    }

    appendLog(`Debugger stepping operator: ${nextIdleNode.name}`, "info");
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nextIdleNode.id
          ? { ...n, status: "completed" as const, progress: 100, runtime: 150 }
          : n
      )
    );
    setConnections((prev) =>
      prev.map((c) => (c.toNode === nextIdleNode.id ? { ...c, status: "completed" as const } : c))
    );
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col gap-4 font-sans select-none overflow-hidden relative">
      {/* Top Controls Overlay Ribbon */}
      <div className="flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 border border-white/5 rounded-2xl backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#A855F7] p-0.5 flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white fill-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white/90 tracking-wide uppercase leading-none">
              Athene AI Studio
            </h1>
            <p className="font-mono text-[7.5px] text-[#A855F7] font-black uppercase tracking-widest mt-0.5">
              Interactive Cognitive Orchestrator
            </p>
          </div>
        </div>

        {/* Dynamic exporter panel */}
        <WorkflowExporter nodes={nodes} connections={connections} />
      </div>

      {/* Main Split Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden relative">
        {/* Left Side: Builder sidebar template drawer */}
        <div className="hidden lg:block lg:col-span-1 h-full overflow-hidden">
          <WorkflowSidebar onAddNode={handleAddNode} />
        </div>

        {/* Center: Infinite Canvas Grid Arena */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-hidden relative">
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onWheel={handleCanvasWheel}
            className={`flex-1 relative border rounded-2xl bg-[#020202]/95 overflow-hidden transition-all duration-300 ${
              tool === "pan" ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            }`}
            style={{
              borderColor: isRunning ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.05)",
              boxShadow: isRunning ? "inset 0 0 40px rgba(59, 130, 246, 0.05)" : "none",
            }}
          >
            {/* Infinite grid blueprint lines */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)`,
                backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
                backgroundPosition: `${panX}px ${panY}px`,
              }}
            />

            {/* Scale & Pan coordinate board */}
            <div
              className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              }}
            >
              {/* Connection SVGs layer */}
              <svg className="absolute inset-0 w-[5000px] h-[3000px] pointer-events-none overflow-visible">
                <defs>
                  {/* Glowing flowing gradient definition */}
                  <linearGradient id="flowGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>

                {/* Draft connection Bezier line */}
                {linkingFromNodeId && (
                  <path
                    d={`M ${
                      (nodes.find((n) => n.id === linkingFromNodeId)?.x || 0) +
                      (linkingPortType === "source" ? 256 : 0)
                    } ${
                      (nodes.find((n) => n.id === linkingFromNodeId)?.y || 0) + 75
                    } C ${
                      (nodes.find((n) => n.id === linkingFromNodeId)?.x || 0) +
                      (linkingPortType === "source" ? 256 + 100 : -100)
                    } ${
                      (nodes.find((n) => n.id === linkingFromNodeId)?.y || 0) + 75
                    }, ${tempMouseCoords.x} ${tempMouseCoords.y}, ${tempMouseCoords.x} ${
                      tempMouseCoords.y
                    }`}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={1.8}
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                )}

                {/* Edges */}
                {connections.map((conn) => {
                  const fromNode = nodes.find((n) => n.id === conn.fromNode);
                  const toNode = nodes.find((n) => n.id === conn.toNode);
                  if (!fromNode || !toNode) return null;

                  return (
                    <EdgeComponent
                      key={conn.id}
                      connection={conn}
                      fromNode={fromNode}
                      toNode={toNode}
                      isSelected={selectedConnectionId === conn.id}
                      onSelect={() => {
                        setSelectedConnectionId(conn.id);
                        setSelectedNodeId(null);
                      }}
                    />
                  );
                })}
              </svg>

              {/* Interactive Nodes Layer */}
              {nodes.map((node) => {
                return (
                  <NodeComponent
                    key={node.id}
                    node={node}
                    isSelected={selectedNodeId === node.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClickOrMouseUp(e, node.id);
                    }}
                    onStartDrag={handleStartDragNode}
                    onPortMouseDown={handlePortMouseDown}
                  />
                );
              })}
            </div>

            {/* Canvas Toolbar Floating Overlay */}
            <div className="absolute top-4 left-4 z-20">
              <WorkflowToolbar
                tool={tool}
                setTool={setTool}
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
                snapToGrid={snapToGrid}
                setSnapToGrid={setSnapToGrid}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
              />
            </div>

            {/* Flow presets & compile pipeline floating triggers */}
            <div className="absolute top-4 right-4 z-20">
              <WorkflowControls
                onRun={handleRunWorkflow}
                onStop={handleStopWorkflow}
                onStep={handleStepWorkflow}
                onClear={handleClear}
                isRunning={isRunning}
                speed={speed}
                onSpeedChange={setSpeed}
                onLoadTemplate={handleLoadTemplate}
              />
            </div>

            {/* Minimap Widget */}
            <MiniMap
              nodes={nodes}
              zoom={zoom}
              panX={panX}
              panY={panY}
              onRecenter={handleRecenter}
            />
          </div>

          {/* Bottom logs rolling execution console */}
          <ExecutionConsole
            logs={logs}
            onClear={() => setLogs([])}
            isExpanded={consoleExpanded}
            onToggleExpanded={() => setConsoleExpanded(!consoleExpanded)}
          />
        </div>

        {/* Right Side: Multi-tab property config / statistics sidebars */}
        <div className="lg:col-span-1 h-full overflow-hidden">
          <PropertiesPanel
            selectedNode={selectedNode}
            nodes={nodes}
            connections={connections}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            isRunning={isRunning}
            activeStep={activeStep}
            activeNodeType={activeNodeId ? nodes.find((n) => n.id === activeNodeId)?.type || null : null}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}
export default WorkflowCanvas;
