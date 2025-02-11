
import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "start",
    type: "input",
    position: { x: 500, y: 100 },
    data: { label: "Start" },
  },
];

const initialEdges: Edge[] = [];

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  return (
    <div className="flex-1 bg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        className="bg-canvas"
      >
        <Background color="#E5E7EB" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
