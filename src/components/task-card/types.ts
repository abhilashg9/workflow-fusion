
export interface AssignmentConfig {
  type: "roles" | "users" | "dynamic_users" | "supplier" | "manager" | "manager_hierarchy";
  roles?: string[];
  filters?: string[];
  users?: string[];
  dynamicUsers?: string[];
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
    value?: number;
    apiConfig?: {
      selectedApi?: {
        id: string;
        name: string;
        type: "inbound" | "outbound";
        endpoint: string;
        viewUrl?: string;
      };
      failureRecourse?: {
        type: "sendBack" | "assign";
        stepId?: string;
        assignee?: {
          type: "user" | "role";
          value: string;
        };
      };
    };
  };
  id: string;
  setNodeData?: (data: any) => void;
  onDelete?: (id: string) => void;
  previousSteps?: { id: string; label: string; sequenceNumber: number }[];
}

