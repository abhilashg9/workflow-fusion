import React from "react";
import { X } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

import { TaskCardProps } from "./task-card/types";
import { Button } from "@/components/ui/button";
import { TaskCardActions } from "./task-card/TaskCardActions";
import { TaskCardAssignment } from "./task-card/TaskCardAssignment";
import { TaskCardApiConfig } from "./task-card/TaskCardApiConfig";
import { TaskCardWorkflows } from "./task-card/TaskCardWorkflows";

export const TaskCard = ({ data, id, setNodeData, onDelete, previousSteps }: TaskCardProps) => {
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        label: event.target.value,
      });
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        type: event.target.value,
      });
    }
  };

  const handleWorkflowsChange = (workflows: ("amend" | "short-close" | "cancel")[]) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        workflows,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm w-[360px]">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TaskCardWorkflows
              workflows={data.workflows}
              onChange={handleWorkflowsChange}
            />
            <h3 className="font-medium text-gray-900">
              {data.label}
              {data.sequenceNumber && (
                <span className="ml-1 text-gray-500">#{data.sequenceNumber}</span>
              )}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete?.(id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                Label
              </label>
              <input
                type="text"
                name="label"
                id="label"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={data.label}
                onChange={handleLabelChange}
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={data.type}
                onChange={handleTypeChange}
              >
                <option value="create">Create</option>
                <option value="approval">Approval</option>
                <option value="integration">Integration</option>
              </select>
            </div>
          </div>
        </div>

        <TaskCardAssignment data={data} setNodeData={setNodeData} />

        <TaskCardActions data={data} setNodeData={setNodeData} />

        <TaskCardApiConfig data={data} setNodeData={setNodeData} previousSteps={previousSteps} />
      </div>
      <Handle type="source" position={Position.Right} id="a" />
      <Handle type="target" position={Position.Left} id="b" />
    </div>
  );
};
