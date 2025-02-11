
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
    },
    labelBgStyle: { 
      fill: "#2563EB",
      borderRadius: "12px",
      width: 24,
      height: 24,
    },
  },
];

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
        },
        prevEdges
      )
    );
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
  );
};
