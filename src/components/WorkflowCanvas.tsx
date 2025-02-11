
import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "start",
    type: "input",
    position: { x: 100, y: 100 },
    data: { label: "Start" },
    style: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "10px 20px",
    },
  },
  {
    id: "end",
    type: "output",
    position: { x: 500, y: 100 },
    data: { label: "End" },
    style: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "10px 20px",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "start-end",
    source: "start",
    target: "end",
    type: "smoothstep", // This creates an elbow connector
    animated: true,
    style: { stroke: "#2563EB" },
  },
];

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect = (params: Connection) => {
    setEdges((prevEdges) => addEdge(params, prevEdges));
  };

  return (
    <div className="flex-1 bg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
        className="bg-canvas"
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "#2563EB" },
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
  );
};
