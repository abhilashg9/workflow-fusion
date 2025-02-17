import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  GripVertical,
  HelpCircle,
  Settings,
  Settings2,
  GitBranch,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskCardProps, TaskNodeData } from "./task-card/types";
import { TaskCardAssignment } from "./task-card/TaskCardAssignment";
import { TaskCardActions } from "./task-card/TaskCardActions";
import { TaskCardApiConfig } from "./task-card/TaskCardApiConfig";

function TaskCard({ data: nodeData, id }: TaskCardProps) {
  const data = nodeData as TaskNodeData;
  const [label, setLabel] = useState(data.label);
  const [type, setType] = useState(data.type);
  const [tags, setTags] = useState(data.tags || []);
  const [newTag, setNewTag] = useState("");
  const [assignment, setAssignment] = useState(data.assignment);
  const [actions, setActions] = useState(data.actions || []);
  const [apiConfig, setApiConfig] = useState(data.apiConfig);

  useEffect(() => {
    setLabel(data.label);
    setType(data.type);
    setTags(data.tags || []);
    setAssignment(data.assignment);
    setActions(data.actions || []);
    setApiConfig(data.apiConfig);
  }, [data]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    data.setNodeData?.({ ...data, label: e.target.value });
  };

  const handleTypeChange = (value: "create" | "approval" | "integration") => {
    setType(value);
    data.setNodeData?.({ ...data, type: value });
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      data.setNodeData?.({ ...data, tags: newTags });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    data.setNodeData?.({ ...data, tags: newTags });
  };

  const handleAssignmentChange = (newAssignment: AssignmentConfig) => {
    setAssignment(newAssignment);
    data.setNodeData?.({ ...data, assignment: newAssignment });
  };

  const handleAssignmentTypeChange = (type: any) => {
    const newAssignment = { ...assignment, type };
    setAssignment(newAssignment);
    data.setNodeData?.({ ...data, assignment: newAssignment });
  };

  const handleRoleSelect = (role: string) => {
    const newRoles = assignment?.roles ? [...assignment.roles, role] : [role];
    const newAssignment = { ...assignment, roles: newRoles };
    setAssignment(newAssignment);
    data.setNodeData?.({ ...data, assignment: newAssignment });
  };

  const handleFilterSelect = (filter: string) => {
    const newFilters = assignment?.filters ? [...assignment.filters, filter] : [filter];
    const newAssignment = { ...assignment, filters: newFilters };
    setAssignment(newAssignment);
    data.setNodeData?.({ ...data, assignment: newAssignment });
  };

  const handleUserSelect = (user: string) => {
    const newUsers = assignment?.users ? [...assignment.users, user] : [user];
    const newAssignment = { ...assignment, users: newUsers };
    setAssignment(newAssignment);
    data.setNodeData?.({ ...data, assignment: newAssignment });
  };

  const handleDynamicUserSelect = (user: string) => {
    const newDynamicUsers = assignment?.dynamicUsers ? [...assignment.dynamicUsers, user] : [user];
    const newAssignment = { ...assignment, dynamicUsers: newDynamicUsers };
    setAssignment(newAssignment);
    data.setNodeData?.({ ...data, assignment: newAssignment });
  };

  const handleRemoveItem = (type: string, item: string) => {
    let updatedItems;
    switch (type) {
      case "role":
        updatedItems = assignment?.roles?.filter((role) => role !== item);
        setAssignment({ ...assignment, roles: updatedItems });
        data.setNodeData?.({ ...data, assignment: { ...assignment, roles: updatedItems } });
        break;
      case "filter":
        updatedItems = assignment?.filters?.filter((filter) => filter !== item);
        setAssignment({ ...assignment, filters: updatedItems });
        data.setNodeData?.({ ...data, assignment: { ...assignment, filters: updatedItems } });
        break;
      case "user":
        updatedItems = assignment?.users?.filter((user) => user !== item);
        setAssignment({ ...assignment, users: updatedItems });
        data.setNodeData?.({ ...data, assignment: { ...assignment, users: updatedItems } });
        break;
      case "dynamicUser":
        updatedItems = assignment?.dynamicUsers?.filter((user) => user !== item);
        setAssignment({ ...assignment, dynamicUsers: updatedItems });
        data.setNodeData?.({ ...data, assignment: { ...assignment, dynamicUsers: updatedItems } });
        break;
    }
  };

  const handleValueChange = (value: number | undefined) => {
    const newAssignment = { ...assignment, value: value };
    setAssignment(newAssignment);
    data.setNodeData?.({ ...data, assignment: newAssignment });
  };

  const handleActionToggle = (index: number, enabled: boolean) => {
    const newActions = [...actions];
    newActions[index].enabled = enabled;
    setActions(newActions);
    data.setNodeData?.({ ...data, actions: newActions });
  };

  const handleActionLabelChange = (index: number, label: string) => {
    const newActions = [...actions];
    newActions[index].label = label;
    setActions(newActions);
    data.setNodeData?.({ ...data, actions: newActions });
  };

  const handleSendBackStepChange = (stepId: string) => {
    const newActions = actions.map(action => {
      if (action.sendBack) {
        return { ...action, sendBack: { step: stepId } };
      }
      return action;
    });
    setActions(newActions);
    data.setNodeData?.({ ...data, actions: newActions });
  };

  const handleApiConfigChange = (newApiConfig: any) => {
    setApiConfig(newApiConfig);
    data.setNodeData?.({ ...data, apiConfig: newApiConfig });
  };

  return (
    <div className="w-[400px] bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
          <Input
            type="text"
            placeholder="Task Label"
            value={label}
            onChange={handleLabelChange}
            className="text-sm font-semibold"
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <X className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this task and remove it
                from the workflow.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => data.onDelete?.(id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Settings className="w-4 h-4 text-blue-500" />
            <label className="text-sm font-semibold text-gray-900">Task Configuration</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Configure the basic settings for this task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full bg-white border shadow-sm">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create">Create Task</SelectItem>
              <SelectItem value="approval">Approval Task</SelectItem>
              <SelectItem value="integration">Integration Task</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Settings2 className="w-4 h-4 text-blue-500" />
            <label className="text-sm font-semibold text-gray-900">Tags</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Add tags to categorize and filter tasks</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 bg-white border shadow-sm"
            />
            <Button type="button" size="sm" onClick={handleAddTag}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-gray-50 border border-gray-100">
            {!tags.length && <span className="text-sm text-gray-400 italic">No tags added</span>}
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="group py-1.5 px-3">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <TaskCardAssignment
          assignment={assignment}
          onAssignmentTypeChange={handleAssignmentTypeChange}
          onRoleSelect={handleRoleSelect}
          onFilterSelect={handleFilterSelect}
          onUserSelect={handleUserSelect}
          onDynamicUserSelect={handleDynamicUserSelect}
          onRemoveItem={handleRemoveItem}
          onValueChange={handleValueChange}
          taskType={type}
        />

        <TaskCardActions
          actions={actions}
          previousSteps={data.previousSteps}
          onActionToggle={handleActionToggle}
          onActionLabelChange={handleActionLabelChange}
          onSendBackStepChange={handleSendBackStepChange}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <GitBranch className="w-4 h-4 text-blue-500" />
            <label className="text-sm font-semibold text-gray-900">Applies in</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Select which workflow actions this task applies to</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <TaskCardApiConfig
          selectedApi={apiConfig?.selectedApi}
          failureRecourse={apiConfig?.failureRecourse}
          taskType={type}
          previousSteps={data.previousSteps}
          onChange={handleApiConfigChange}
        />
      </div>
    </div>
  );
}

export default TaskCard;
