
import { Node, Edge, MarkerType } from "@xyflow/react";

export type TaskType = "create" | "approval" | "integration" | "split" | "default" | "condition" | "join";

export interface PreviousStep {
  id: string;
  label: string;
  sequenceNumber: number;
}

export interface StepOption {
  id: string;
  label: string;
  sequenceNumber: number;
}

export interface Condition {
  id: string;
  name: string;
  description?: string;
}

export interface ApiConfig {
  id: string;
  name: string;
  type: "inbound" | "outbound";
  endpoint: string;
  viewUrl?: string;
}

export interface FailureRecourse {
  type: "sendBack" | "assign";
  stepId?: string;
  assignee?: {
    type: "user" | "role";
    value: string;
  };
}

export interface TaskAction {
  action: string;
  label: string;
  enabled: boolean;
  sendBack?: {
    step: string;
  };
}

export interface TaskNodeData extends Record<string, unknown> {
  type: TaskType;
  label: string;
  tags?: string[];
  previousSteps?: PreviousStep[];
  sequenceNumber?: number;
  onDelete?: (id: string) => void;
  validationErrors?: string[];
  assignment?: {
    type?: 'roles' | 'users' | 'supplier' | 'manager' | 'manager_hierarchy';
    roles?: string[];
    users?: string[];
  };
  actions?: TaskAction[];
  apiConfig?: {
    selectedApi?: ApiConfig;
    failureRecourse?: FailureRecourse;
  };
  conditions?: Condition[];
  description?: string;
}

export type CustomNode = Node<TaskNodeData>;

export const mockApiConfigs: ApiConfig[] = [
  {
    id: "po-create",
    name: "Purchase order create",
    type: "inbound",
    endpoint: "https://capp-test.aerchain.com/integration/capp/requisition",
    viewUrl: "https://capp-test.aerchain.com/integration/po-create"
  },
  {
    id: "invoice-post",
    name: "Invoice posting",
    type: "outbound",
    endpoint: "https://capp-test.aerchain.com/integration/capp/invoice",
    viewUrl: "https://capp-test.aerchain.com/integration/invoice-post"
  }
];
