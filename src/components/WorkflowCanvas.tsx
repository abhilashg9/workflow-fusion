
import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  addEdge,
  MiniMap,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FilePlus2, UserCheck, Workflow, GitBranch, ArrowRightLeft } from "lucide-react";
import TaskCard from "./TaskCard";

const TaskOption = ({ icon: Icon, title, subtitle, onClick }: { 
  icon: any, 
  title: string, 
  subtitle: string,
  onClick: () => void 
}) => (
  <div 
    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
    onClick={onClick}
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

const initialNodes: Node[] = [
  {
    id: "start",
    type: "input",
    position: { x: 250, y: 50 },
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
    position: { x: 250, y: 200 },
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

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const onConnect = (params: Connection) => {
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
        prevEdges
      )
    );
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsModalOpen(true);
  };

  const handleTaskSelection = (type: "create" | "approval" | "integration") => {
    if (!selectedEdge) return;

    const sourceNode = nodes.find((n) => n.id === selectedEdge.source);
    const targetNode = nodes.find((n) => n.id === selectedEdge.target);
    
    if (!sourceNode || !targetNode) return;

    // Calculate vertical midpoint between nodes
    const newX = (sourceNode.position.x + targetNode.position.x) / 2;
    const newY = sourceNode.position.y + 
      (targetNode.position.y - sourceNode.position.y) / 2;

    // Create new task node
    const newNode: Node = {
      id: `task-${Date.now()}`,
      type: "taskCard",
      position: { x: newX - 125, y: newY }, // Center the 250px wide card
      data: {
        type,
        label: `New ${type} task`,
        tags: type === "integration" 
          ? ["API Name"]
          : ["Role 1", "Role 2"],
      },
    };

    // Remove the original edge
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));

    // Add two new edges with consistent styling
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

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, ...newEdges]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex-1 bg-canvas">
        <style>
          {`
            .workflow-edge:hover .react-flow__edge-label {
              opacity: 1 !important;
              transition: opacity 0.2s;
            }
            .workflow-edge:hover .react-flow__edge-label-background {
              opacity: 1 !important;
              transition: opacity 0.2s;
            }
            .workflow-edge .react-flow__edge-label,
            .workflow-edge .react-flow__edge-label-background {
              transition: opacity 0.2s;
            }
          `}
        </style>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
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
          <MiniMap
            nodeColor={(node) => {
              switch (node.id) {
                case 'start':
                  return '#8B5CF6';
                case 'end':
                  return '#0EA5E9';
                default:
                  return '#fff';
              }
            }}
            position="bottom-right"
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </ReactFlow>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Select task to add</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {taskTypes.map((task, index) => (
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
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
