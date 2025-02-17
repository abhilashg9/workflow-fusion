
import React from 'react';

interface TaskCardApiConfigProps {
  selectedApi?: string;
  failureRecourse?: string;
  taskType: "create" | "approval" | "integration";
  previousSteps: { id: string; label: string }[];
  onChange: (config: any) => void;
}

export const TaskCardApiConfig: React.FC<TaskCardApiConfigProps> = ({
  selectedApi,
  failureRecourse,
  taskType,
  previousSteps,
  onChange
}) => {
  return <div>API Config Component</div>; // Placeholder implementation
};
