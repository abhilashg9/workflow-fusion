
import { EdgeProps, getBezierPath } from "@xyflow/react";

export const WorkflowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={style}
      className="workflow-edge react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};
