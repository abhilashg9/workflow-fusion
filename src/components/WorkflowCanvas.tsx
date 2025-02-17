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
  const [nodes, setNodes] = useState<Node<TaskNodeData>[]>(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
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

  const handleNodeDataChange = (nodeId: string, data: Partial<TaskNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedData = {
            ...node.data,
            ...data,
          } as TaskNodeData;
          
          const validationErrors = validateNode(updatedData);
          
          return {
            ...node,
            data: {
              ...updatedData,
              validationErrors,
              onDelete: node.data.onDelete,
            },
            className: validationErrors.length > 0 ? 'border-red-500' : 'border-gray-200',
          };
        }
        return node;
      })
    );
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

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsModalOpen(true);
  };

  const onNodeDragStop = (_: React.MouseEvent, node: Node) => {
    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    const VERTICAL_SPACING = 250;
    const START_Y = 150;
    const CENTER_X = 250;
    
    const updatedNodes = sortedNodes.map((n, index) => {
      const currentSequence = n.type === "taskCard" ? index + 1 : 0;
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
        ...n,
        position: {
          x: CENTER_X - (n.type === "taskCard" ? 125 : 50),
          y: START_Y + (index * VERTICAL_SPACING),
        },
        data: n.type === "taskCard" ? {
          ...n.data,
          previousSteps: previousNodes,
          sequenceNumber: currentSequence
        } : n.data,
        draggable: true,
      };
    });

    setNodes(updatedNodes);
    adjustViewport();
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

  const validateNode = (nodeData: TaskNodeData): string[] => {
    const errors: string[] = [];
    
    if (!nodeData.label || nodeData.label.trim() === '') {
      errors.push('Task label is required');
    }

    if (nodeData.type === 'create') {
      if (!nodeData.assignment?.type) {
        errors.push('Role/User/Supplier selection is required');
      }
    }

    if (nodeData.type === 'approval') {
      if (!nodeData.assignment?.type) {
        errors.push('Role/User/Supplier/Manager selection is required');
      }
      const hasEmptyActionLabel = nodeData.actions?.some(
        action => !action.label || action.label.trim() === ''
      );
      if (hasEmptyActionLabel) {
        errors.push('Accept/Reject labels cannot be empty');
      }
    }

    if (nodeData.type === 'integration') {
      if (!nodeData.apiConfig?.selectedApi) {
        errors.push('API selection is required');
      }
    }

    return errors;
  };

  const handleTaskSelection = (type: TaskType) => {
    if (!selectedEdge) return;

    const sourceNode = nodes.find((n) => n.id === selectedEdge.source);
    const targetNode = nodes.find((n) => n.id === selectedEdge.target);
    
    if (!sourceNode || !targetNode) return;

    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    const sourceNodeIndex = sortedNodes.findIndex(n => n.id === sourceNode.id);

    const hasExistingCreateTask = sortedNodes.some(node => 
      node.type === "taskCard" && node.data.type === "create"
    );

    const isFirstTaskAfterStart = sourceNode.id === "start";
    
    if (type === "create") {
      if (hasExistingCreateTask) {
        toast.error("Only one Create task is allowed in the workflow");
        setIsModalOpen(false);
        return;
      }
      
      if (!isFirstTaskAfterStart) {
        toast.error("Create task can only be added as the first step");
        setIsModalOpen(false);
        return;
      }
    }

    if (isFirstTaskAfterStart && hasExistingCreateTask && type !== "create") {
      toast.error("A Create task must be the first step");
      setIsModalOpen(false);
      return;
    }

    const previousNodes: PreviousStep[] = sortedNodes
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

    const validationErrors = validateNode(initialData);

    const newNode: Node<TaskNodeData> = {
      id: `task-${Date.now()}`,
      type: "taskCard",
      position: { x: CENTER_X - 125, y: newY },
      data: {
        ...initialData,
        validationErrors,
      },
      draggable: true,
      className: validationErrors.length > 0 ? 'border-red-500' : 'border-gray-200',
    };

    const updatedNodes = nodes.map((node) => {
      if (node.position.y >= targetNode.position.y) {
        if (node.type === "taskCard") {
          const nodePreviousSteps: PreviousStep[] = sortedNodes
            .filter(n => n.type === "taskCard" && n.position.y < node.position.y)
            .map((n, idx) => ({
              id: n.id,
              label: n.data.label,
              sequenceNumber: idx + 1
            }))
            .reverse();

          const updatedData: TaskNodeData = {
            ...node.data,
            previousSteps: nodePreviousSteps,
            sequenceNumber: nodePreviousSteps.length + 2,
          };
          
          const nodeValidationErrors = validateNode(updatedData);
          
          return {
            ...node,
            position: {
              x: CENTER_X - 125,
              y: node.position.y + VERTICAL_SPACING,
            },
            data: {
              ...updatedData,
              validationErrors: nodeValidationErrors,
            },
            className: nodeValidationErrors.length > 0 ? 'border-red-500' : 'border-gray-200',
          };
        }
        return {
          ...node,
          position: {
            x: CENTER_X - 50,
            y: node.position.y + VERTICAL_SPACING,
          },
        };
      }
      return node;
    });

    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));

    const newEdges: Edge[] = [
      {
        id: `e-${selectedEdge.source}-${newNode.id}`,
        source: selectedEdge.source,
        target: newNode.id,
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
        id: `e-${newNode.id}-${selectedEdge.target}`,
        source: newNode.id,
        target: selectedEdge.target,
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
          onNodeDragStop={onNodeDragStop}
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
