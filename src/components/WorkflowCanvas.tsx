
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
    position: { x: 250, y: 50 },
    data: { label: "Start" },
    style: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "10px 20px",
    },
  },
  {
    id: "parallel1",
    type: "default",
    position: { x: 100, y: 200 },
    data: { label: "Step 1A" },
    style: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "10px 20px",
    },
  },
  {
    id: "parallel2",
    type: "default",
    position: { x: 400, y: 200 },
    data: { label: "Step 1B" },
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
    position: { x: 250, y: 350 },
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
    id: "start-parallel1",
    source: "start",
    target: "parallel1",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#2563EB" },
  },
  {
    id: "start-parallel2",
    source: "start",
    target: "parallel2",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#2563EB" },
  },
  {
    id: "parallel1-end",
    source: "parallel1",
    target: "end",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#2563EB" },
  },
  {
    id: "parallel2-end",
    source: "parallel2",
    target: "end",
    type: "smoothstep",
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
