import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  addEdge,
  MarkerType,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FilePlus2, UserCheck, Workflow, GitBranch, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import TaskCard from "./TaskCard";

// Move constants outside the component to make them globally available
const VERTICAL_SPACING = 250;
const START_Y = 150;
const CENTER_X = 250;

interface PreviousStep {
  id: string;
  label: string;
  sequenceNumber: number;
}

interface TaskNodeData {
  type?: "create" | "approval" | "integration";
  label: string;
  tags?: string[];
  previousSteps?: PreviousStep[];
  sequenceNumber?: number;
  onDelete?: (id: string) => void;
}

type TaskType = "create" | "approval" | "integration";

type CustomNode = Node<TaskNodeData>;

interface TaskOptionProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
}

const TaskOption = ({ icon: Icon, title, subtitle, onClick, disabled }: TaskOptionProps) => (
  <div 
    className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
    }`}
    onClick={() => !disabled && onClick()}
  >
    <div className="p-2 rounded-lg bg-primary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const nodeTypes = {
  taskCard: TaskCard,
};

const taskTypes = [
  {
    icon: FilePlus2,
    title: "Create Task",
    subtitle: "Add a create task and assign creators",
    type: "create" as const,
  },
  {
    icon: UserCheck,
    title: "Approval Task",
    subtitle: "Add an approval task and configure",
    type: "approval" as const,
  },
  {
    icon: Workflow,
    title: "Integration Task",
    subtitle: "Add an integration task and configure the APIs",
    type: "integration" as const,
  },
  {
    icon: GitBranch,
    title: "Split Branch",
    subtitle: "Split the workflow into branches with conditions",
    type: "split" as const,
  },
  {
    icon: ArrowRightLeft,
    title: "Parallel Branch",
    subtitle: "Add tasks in parallel that will occur simultaneously",
    type: "parallel" as const,
  },
];

const initialNodes: CustomNode[] = [
  {
    id: "start",
    type: "input",
    position: { x: CENTER_X - 50, y: START_Y },
    data: { label: "Start" },
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
    position: { x: CENTER_X - 50, y: START_Y + VERTICAL_SPACING },
    data: { label: "End" },
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
    
    if (type === "create") {
      const isFirstStep = sourceNode.id === "start";
      const isParallelToCreate = sourceNode.type === "taskCard" && 
                                (sourceNode.data as TaskNodeData).type === "create" && 
                                sourceNode.position.y === START_Y + VERTICAL_SPACING;

      if (!isFirstStep && !isParallelToCreate) {
        toast.error("Create tasks can only be added as the first step or parallel to other create tasks");
        setIsModalOpen(false);
        return;
      }
    }

    const previousNodes: PreviousStep[] = sortedNodes
      .slice(0, sourceNodeIndex + 1)
      .filter(node => node.type === "taskCard")
      .map((node, idx) => ({
        id: node.id,
        label: node.data.label || "",
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
        tags: type === "integration" 
          ? ["API Name"]
          : ["Role 1", "Role 2"],
        previousSteps: previousNodes,
        sequenceNumber: newSequenceNumber,
        onDelete: handleDeleteNode,
      },
      draggable: true,
    };

    const updatedNodes = nodes.map((node) => {
      if (node.position.y >= targetNode.position.y) {
        if (node.type === "taskCard") {
          const nodePreviousSteps: PreviousStep[] = sortedNodes
            .filter(n => n.type === "taskCard" && n.position.y < node.position.y)
            .map((n, idx) => ({
              id: n.id,
              label: n.data.label || "",
              sequenceNumber: idx + 1
            }))
            .reverse();

          return {
            ...node,
            position: {
              x: CENTER_X - 125,
              y: node.position.y + VERTICAL_SPACING,
            },
            data: {
              ...node.data,
              previousSteps: nodePreviousSteps,
              sequenceNumber: nodePreviousSteps.length + 2
            },
          };
        }
        return {
          ...node,
          position: {
            x: CENTER_X - 50,
            y: node.position.y + VERTICAL_SPACING,
          },
          data: {
            ...node.data,
            label: node.data.label,
          },
        };
      }
      return node;
    }) as CustomNode[];

    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id).concat(newEdges));

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
    setIsModalOpen(false);
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
        } : node.data,
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
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          className="bg-canvas"
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "#2563EB" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#2563EB",
            },
          }}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Select task to add</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {taskTypes.map((task, index) => {
              const sourceNode = selectedEdge ? nodes.find(n => n.id === selectedEdge.source) : null;
              const isFirstStep = sourceNode?.id === "start";
              const isParallelToCreate = sourceNode?.type === "taskCard" && 
                                      (sourceNode.data as TaskNodeData).type === "create" &&
                                      sourceNode.position.y === START_Y + VERTICAL_SPACING;
              
              const isDisabled = task.type === "create" && !isFirstStep && !isParallelToCreate;

              return (
                <TaskOption
                  key={index}
                  icon={task.icon}
                  title={task.title}
                  subtitle={task.subtitle}
                  onClick={() => {
                    if (task.type === "create" || task.type === "approval" || task.type === "integration") {
                      handleTaskSelection(task.type);
                    }
                  }}
                  disabled={isDisabled}
                />
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
