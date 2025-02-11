
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Connection,
  Edge,
  addEdge,
  MarkerType,
  useReactFlow,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TaskCard from "../TaskCard";
import { TaskSelectionModal } from "./TaskSelectionModal";
import { WorkflowEdge } from "./WorkflowEdge";
import { CustomNode, TaskNodeData, TaskType, PreviousStep } from "./types";

const nodeTypes = {
  taskCard: TaskCard,
};

const edgeTypes = {
  workflow: WorkflowEdge,
};

const VERTICAL_SPACING = 250;
const CENTER_X = 250;

const initialNodes: CustomNode[] = [
  {
    id: "start",
    type: "input",
    position: { x: CENTER_X - 50, y: 150 },
    data: {
      type: "create" as TaskType,
      label: "Start",
    },
    style: {
      background: "#8B5CF6",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      minWidth: "100px",
      textAlign: "center",
    },
  },
  {
    id: "end",
    type: "output",
    position: { x: CENTER_X - 50, y: 400 },
    data: {
      type: "create" as TaskType,
      label: "End",
    },
    style: {
      background: "#0EA5E9",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      minWidth: "100px",
      textAlign: "center",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "start-end",
    source: "start",
    target: "end",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#2563EB" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#2563EB",
    },
    label: "+",
    labelStyle: { 
      fill: "#ffffff",
      fontWeight: "bold",
      fontSize: "16px",
      opacity: 0,
    },
    labelBgStyle: { 
      fill: "#2563EB",
      opacity: 0,
      borderRadius: "12px",
      width: "24px",
      height: "24px",
    },
    className: "workflow-edge",
  },
];

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState<CustomNode[]>(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const { fitView } = useReactFlow();

  const adjustViewport = useCallback(() => {
    setTimeout(() => {
      fitView({
        padding: 0.2,
        minZoom: 0.75,
        maxZoom: 2.25,
        duration: 200,
        nodes: nodes.slice(0, 3)
      });
    }, 50);
  }, [fitView, nodes]);

  useEffect(() => {
    adjustViewport();
  }, [nodes.length, adjustViewport]);

  const handleTaskSelection = (type: TaskType) => {
    if (!selectedEdge) return;

    const sourceNode = nodes.find((n) => n.id === selectedEdge.source);
    const targetNode = nodes.find((n) => n.id === selectedEdge.target);
    
    if (!sourceNode || !targetNode) return;

    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    const sourceNodeIndex = sortedNodes.findIndex(n => n.id === sourceNode.id);
    
    const previousNodes: PreviousStep[] = sortedNodes
      .slice(0, sourceNodeIndex + 1)
      .filter(node => node.type === "taskCard")
      .map((node, idx) => ({
        id: node.id,
        label: (node.data as TaskNodeData).label || "",
        sequenceNumber: idx + 1
      }))
      .reverse();

    const newY = sourceNode.position.y + VERTICAL_SPACING;
    const newSequenceNumber = previousNodes.length + 1;

    const newNode: CustomNode = {
      id: `task-${Date.now()}`,
      type: "taskCard",
      position: { x: CENTER_X - 125, y: newY },
      data: {
        type,
        label: `New ${type} task`,
        tags: type === "integration" ? ["API Name"] : ["Role 1", "Role 2"],
        previousSteps: previousNodes,
        sequenceNumber: newSequenceNumber,
        onDelete: handleDeleteNode,
      },
      draggable: true,
    };

    const updatedNodes = nodes.map((node) => {
      if (node.position.y >= targetNode.position.y) {
        const nodePreviousSteps: PreviousStep[] = sortedNodes
          .filter(n => n.type === "taskCard" && n.position.y < node.position.y)
          .map((n, idx) => ({
            id: n.id,
            label: (n.data as TaskNodeData).label || "",
            sequenceNumber: idx + 1
          }))
          .reverse();

        return {
          ...node,
          position: {
            x: CENTER_X - (node.type === "taskCard" ? 125 : 50),
            y: node.id === targetNode.id ? newY + VERTICAL_SPACING : node.position.y + VERTICAL_SPACING,
          },
          data: node.type === "taskCard" ? {
            ...node.data,
            previousSteps: nodePreviousSteps,
            sequenceNumber: nodePreviousSteps.length + 2,
          } : node.data,
        };
      }
      return node;
    });

    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
    const newEdges = createEdgesForNode(selectedEdge.source, newNode.id, selectedEdge.target);
    
    setNodes([...updatedNodes, newNode]);
    setEdges((eds) => [...eds, ...newEdges]);
    setIsModalOpen(false);
  };

  const createEdgesForNode = (sourceId: string, nodeId: string, targetId: string): Edge[] => {
    return [
      {
        id: `e-${sourceId}-${nodeId}`,
        source: sourceId,
        target: nodeId,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#2563EB" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#2563EB",
        },
        label: "+",
        labelStyle: { 
          fill: "white",
          fontWeight: "bold",
          fontSize: "16px",
          opacity: 0,
        },
        labelBgStyle: { 
          fill: "#2563EB",
          borderRadius: "12px",
          width: 24,
          height: 24,
          opacity: 0,
        },
        className: "workflow-edge",
      },
      {
        id: `e-${nodeId}-${targetId}`,
        source: nodeId,
        target: targetId,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#2563EB" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#2563EB",
        },
        label: "+",
        labelStyle: { 
          fill: "white",
          fontWeight: "bold",
          fontSize: "16px",
          opacity: 0,
        },
        labelBgStyle: { 
          fill: "#2563EB",
          borderRadius: "12px",
          width: 24,
          height: 24,
          opacity: 0,
        },
        className: "workflow-edge",
      },
    ];
  };

  const onConnect = useCallback((params: Connection) => {
    setEdges((prevEdges) =>
      addEdge(
        {
          ...params,
          type: "smoothstep",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#2563EB",
          },
          label: "+",
          labelStyle: { 
            fill: "#ffffff",
            fontWeight: "bold",
            fontSize: "16px",
            opacity: 0,
          },
          labelBgStyle: { 
            fill: "#2563EB",
            opacity: 0,
            borderRadius: "12px",
            width: "24px",
            height: "24px",
          },
          className: "workflow-edge",
        },
        prevEdges
      )
    );
  }, []);

  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsModalOpen(true);
  };

  const handleDeleteNode = useCallback((nodeId: string) => {
    const connectedEdges = edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );

    if (connectedEdges.length === 2) {
      const sourceEdge = connectedEdges.find((edge) => edge.target === nodeId);
      const targetEdge = connectedEdges.find((edge) => edge.source === nodeId);

      if (sourceEdge && targetEdge) {
        const newEdge = createEdgesForNode(sourceEdge.source, targetEdge.target, targetEdge.target)[0];
        setEdges((eds) => 
          eds
            .filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
            .concat(newEdge)
        );
      }
    } else {
      setEdges((eds) => 
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    }

    const remainingNodes = nodes.filter((node) => node.id !== nodeId);
    const sortedNodes = remainingNodes.sort((a, b) => a.position.y - b.position.y);
    
    const updatedNodes = sortedNodes.map((node, index) => {
      const currentSequence = node.type === "taskCard" ? index + 1 : 0;
      const previousNodes: PreviousStep[] = sortedNodes
        .slice(0, index)
        .filter(prev => prev.type === "taskCard")
        .map((prev, idx) => ({
          id: prev.id,
          label: (prev.data as TaskNodeData).label || "",
          sequenceNumber: idx + 1
        }))
        .reverse();

      return {
        ...node,
        position: {
          x: CENTER_X - (node.type === "taskCard" ? 125 : 50),
          y: 150 + (index * VERTICAL_SPACING),
        },
        data: node.type === "taskCard" ? {
          ...node.data,
          previousSteps: previousNodes,
          sequenceNumber: currentSequence
        } : node.data,
      };
    });

    setNodes(updatedNodes);
    adjustViewport();
  }, [edges, nodes, adjustViewport]);

  return (
    <>
      <div className="flex-1 bg-canvas">
        <style>
          {`
            .workflow-edge:hover .react-flow__edge-label {
              opacity: 1 !important;
              transition: opacity 0.3s ease;
            }
            .workflow-edge:hover .react-flow__edge-label-background {
              opacity: 1 !important;
              transition: opacity 0.3s ease;
            }
            .workflow-edge .react-flow__edge-label,
            .workflow-edge .react-flow__edge-label-background {
              transition: opacity 0.3s ease;
            }
            .react-flow__edge-label {
              background: transparent !important;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .react-flow__edge-label-background {
              border-radius: 50% !important;
              width: 24px !important;
              height: 24px !important;
            }
          `}
        </style>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "#2563EB" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#2563EB",
            },
          }}
          fitView
          className="bg-canvas"
        >
          <Background
            color="#ccc"
            gap={20}
            size={1}
            style={{ backgroundColor: "#fafafa" }}
          />
          <Controls />
        </ReactFlow>
      </div>

      <TaskSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSelect={handleTaskSelection}
      />
    </>
  );
};
