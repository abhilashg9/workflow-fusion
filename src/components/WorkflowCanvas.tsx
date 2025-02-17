
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  addEdge,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";
import TaskCard from "./TaskCard";
import { TaskNodeData, TaskType, PreviousStep } from "./workflow/types";
import { TaskSelectionDialog } from "./workflow/TaskSelectionDialog";
import { INITIAL_NODES, INITIAL_EDGES, VERTICAL_SPACING, CENTER_X } from "./workflow/constants";

const nodeTypes = {
  taskCard: TaskCard,
};

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState<Node<TaskNodeData>[]>(INITIAL_NODES as Node<TaskNodeData>[]);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
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

  const onConnect = useCallback((params: Connection) => {
    setEdges((prevEdges) =>
      addEdge(
        {
          ...params,
          type: "smoothstep",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#3388eb",
          },
          label: "+",
          labelStyle: { 
            fill: "#ffffff",
            fontWeight: "bold",
            fontSize: "16px",
            opacity: 0,
          },
          labelBgStyle: { 
            fill: "#3388eb",
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

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsModalOpen(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    const connectedEdges = edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );

    if (connectedEdges.length === 2) {
      const sourceEdge = connectedEdges.find((edge) => edge.target === nodeId);
      const targetEdge = connectedEdges.find((edge) => edge.source === nodeId);

      if (sourceEdge && targetEdge) {
        const newEdge: Edge = {
          id: `e-${sourceEdge.source}-${targetEdge.target}`,
          source: sourceEdge.source,
          target: targetEdge.target,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#3388eb" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#3388eb",
          },
          label: "+",
          labelStyle: { 
            fill: "#ffffff",
            fontWeight: "bold",
            fontSize: "16px",
            opacity: 0,
          },
          labelBgStyle: { 
            fill: "#3388eb",
            opacity: 0,
            borderRadius: "12px",
            width: "24px",
            height: "24px",
          },
          className: "workflow-edge",
        };

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
    const VERTICAL_SPACING = 250;
    const START_Y = 150;
    const CENTER_X = 250;
    
    const updatedNodes = sortedNodes.map((node, index) => {
      const currentSequence = node.type === "taskCard" ? index + 1 : 0;
      const previousNodes: PreviousStep[] = sortedNodes
        .slice(0, index)
        .filter(prev => prev.type === "taskCard")
        .map((prev, idx) => ({
          id: prev.id,
          label: `${idx + 1}. ${prev.data.label}`,
          sequenceNumber: idx + 1
        }))
        .reverse();

      return {
        ...node,
        position: {
          x: CENTER_X - (node.type === "taskCard" ? 125 : 50),
          y: START_Y + (index * VERTICAL_SPACING),
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
  };

  const handleTaskSelection = (type: TaskType) => {
    if (!selectedEdge) return;

    const sourceNode = nodes.find((n) => n.id === selectedEdge.source);
    const targetNode = nodes.find((n) => n.id === selectedEdge.target);
    
    if (!sourceNode || !targetNode) return;

    const sortedNodesList = [...nodes].sort((a, b) => a.position.y - b.position.y);
    const isStartNode = sourceNode.id === "start";
    const hasCreateTask = sortedNodesList.some(node => 
      node.type === "taskCard" && node.data.type === "create"
    );

    if (type === "create") {
      if (hasCreateTask) {
        toast.error("Only one Create task is allowed in the workflow");
        setIsModalOpen(false);
        return;
      }
      
      if (!isStartNode) {
        toast.error("Create task can only be added as the first step");
        setIsModalOpen(false);
        return;
      }
    }

    if (isStartNode && hasCreateTask && type !== "create") {
      toast.error("A Create task must be the first step");
      setIsModalOpen(false);
      return;
    }

    const sourceNodeIndex = sortedNodesList.findIndex(n => n.id === sourceNode.id);

    const previousNodes: PreviousStep[] = sortedNodesList
      .slice(0, sourceNodeIndex + 1)
      .filter(node => node.type === "taskCard")
      .map((node, idx) => ({
        id: node.id,
        label: node.data.label,
        sequenceNumber: idx + 1
      }))
      .reverse();

    const newY = sourceNode.position.y + VERTICAL_SPACING;
    const newSequenceNumber = previousNodes.length + 1;

    const initialData: TaskNodeData = {
      type,
      label: `New ${type} task`,
      tags: type === "integration" ? ["API Name"] : ["Role 1", "Role 2"],
      previousSteps: previousNodes,
      sequenceNumber: newSequenceNumber,
      onDelete: handleDeleteNode,
      validationErrors: [],
    };

    const newNode: Node<TaskNodeData> = {
      id: `task-${Date.now()}`,
      type: "taskCard",
      position: { x: CENTER_X - 125, y: newY },
      data: initialData,
      draggable: true,
    };

    const updatedNodes = nodes.map((node) => {
      if (node.position.y >= targetNode.position.y) {
        return {
          ...node,
          position: {
            x: CENTER_X - (node.type === "taskCard" ? 125 : 50),
            y: node.position.y + VERTICAL_SPACING,
          },
        };
      }
      return node;
    });

    const newEdges: Edge[] = [
      {
        id: `e-${selectedEdge.source}-${newNode.id}`,
        source: selectedEdge.source,
        target: newNode.id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#3388eb" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#3388eb",
        },
        label: "+",
        labelStyle: { 
          fill: "white",
          fontWeight: "bold",
          fontSize: "16px",
          opacity: 0,
        },
        labelBgStyle: { 
          fill: "#3388eb",
          borderRadius: "12px",
          width: 24,
          height: 24,
          opacity: 0,
        },
        className: "workflow-edge",
      },
      {
        id: `e-${newNode.id}-${selectedEdge.target}`,
        source: newNode.id,
        target: selectedEdge.target,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#3388eb" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#3388eb",
        },
        label: "+",
        labelStyle: { 
          fill: "white",
          fontWeight: "bold",
          fontSize: "16px",
          opacity: 0,
        },
        labelBgStyle: { 
          fill: "#3388eb",
          borderRadius: "12px",
          width: 24,
          height: 24,
          opacity: 0,
        },
        className: "workflow-edge",
      },
    ];

    setNodes([...updatedNodes, newNode]);
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id).concat(newEdges));
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex-1 bg-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
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

      <TaskSelectionDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onTaskSelect={handleTaskSelection}
        nodes={nodes}
        selectedEdgeSourceId={selectedEdge?.source ?? null}
      />
    </>
  );
};
