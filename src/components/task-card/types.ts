
import { Node, NodeProps } from '@xyflow/react';

export interface TaskAction {
  label: string;
  enabled: boolean;
  sendBack?: {
    step: string;
  };
}

export interface AssignmentConfig {
  type: "roles" | "users" | "dynamic_users" | "supplier" | "manager" | "manager_hierarchy";
  roles?: string[];
  filters?: string[];
  users?: string[];
  dynamicUsers?: string[];
  value?: number;
}

export interface ApiConfig {
  selectedApi?: string;
  failureRecourse?: string;
}

export interface TaskData extends Record<string, unknown> {
  label: string;
  type: "create" | "approval" | "integration";
  tags?: string[];
  assignment: AssignmentConfig;
  actions?: TaskAction[];
  apiConfig?: ApiConfig;
  setNodeData?: (data: any) => void;
  onDelete?: (id: string) => void;
  previousSteps?: { id: string; label: string }[];
}

export type TaskCardProps = NodeProps<TaskData>;
