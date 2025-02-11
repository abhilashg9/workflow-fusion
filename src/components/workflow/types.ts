
import { Node, Edge } from "@xyflow/react";

export type TaskType = "create" | "approval" | "integration";

export interface PreviousStep {
  id: string;
  label: string;
  sequenceNumber: number;
}

export interface TaskNodeData extends Record<string, unknown> {
  type: TaskType;
  label: string;
  tags?: string[];
  previousSteps?: PreviousStep[];
  sequenceNumber?: number;
  onDelete?: (id: string) => void;
}

export type CustomNode = Node<TaskNodeData> | Node<{ label: string }>;
