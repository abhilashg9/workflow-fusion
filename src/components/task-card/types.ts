
export interface AssignmentConfig {
  type: "roles" | "users" | "dynamic_users" | "supplier" | "manager" | "manager_hierarchy";
  roles?: string[];
  filters?: string[];
  users?: string[];
  dynamicUsers?: string[];
  value?: number;
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

export interface TaskCardProps {
  data: {
    type: "create" | "approval" | "integration";
    label: string;
    tags?: string[];
    assignment?: AssignmentConfig;
    actions?: TaskAction[];
    sequenceNumber?: number;
    apiConfig?: {
      selectedApi?: ApiConfig;
      failureRecourse?: FailureRecourse;
    };
  };
  id: string;
  setNodeData?: (data: any) => void;
  onDelete?: (id: string) => void;
  previousSteps?: { id: string; label: string; sequenceNumber: number }[];
}

export interface TaskCardAssignmentProps {
  assignment: AssignmentConfig;
  taskType: "create" | "approval" | "integration";
  onChange: (assignment: AssignmentConfig) => void;
}

export interface TaskCardActionsProps {
  actions: TaskAction[];
  previousSteps: { id: string; label: string; sequenceNumber: number }[];
  onActionToggle: (index: number, enabled: boolean) => void;
  onActionLabelChange: (index: number, label: string) => void;
  onSendBackStepChange: (stepId: string) => void;
}

export interface TaskCardApiConfigProps {
  selectedApi?: ApiConfig;
  failureRecourse?: FailureRecourse;
  taskType: "create" | "approval" | "integration";
  previousSteps: { id: string; label: string; sequenceNumber: number }[];
  onChange: (apiConfig: any) => void;
}
