import { memo, useState, useEffect, useMemo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FilePlus2, UserCheck, Workflow, Users, Filter, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TaskCardProps } from "./task-card/types";

const TaskCard = memo(({
  data,
  id,
  setNodeData,
  onDelete,
  previousSteps = []
}: TaskCardProps) => {
  const [label, setLabel] = useState(data.label || "Task");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setLabel(data.label || "Task");
  }, [data.label]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    setNodeData({ ...data, label: newLabel });
  };

  useEffect(() => {
    if (setNodeData) {
      setNodeData({ ...data, validationErrors });
    }
  }, [validationErrors, data, setNodeData]);

  const taskIcon = useMemo(() => {
    switch (data.type) {
      case "create":
        return FilePlus2;
      case "approval":
        return UserCheck;
      case "integration":
        return Workflow;
      default:
        return FilePlus2;
    }
  }, [data.type]);

  const validateLabel = () => {
    if (!label || label.trim() === "") {
      setValidationErrors(["Task label is required"]);
      return false;
    } else {
      setValidationErrors([]);
      return true;
    }
  };

  const handleOnDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
  };

  useEffect(() => {
    validateLabel();
  }, [label]);

  return (
    <div className="w-64 rounded-md shadow-md bg-white p-4 relative">
      <Handle type="target" position={Position.Top} className="!bg-zinc-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500" />
      {validationErrors.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="w-4 h-4 text-red-500 absolute top-2 right-2 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="w-80">
              <div className="space-y-3 p-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="space-y-1">
                    <ul className="list-disc list-inside">
                      <li className="text-xs text-red-500">
                        {error}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="flex items-center space-x-2 mb-4">
        <taskIcon className="w-5 h-5 text-gray-700" />
        <Input
          type="text"
          placeholder="Task Label"
          value={label}
          onChange={handleLabelChange}
          onBlur={validateLabel}
          className={cn(
            "text-sm font-medium h-8",
            validationErrors.length > 0 ? "border-red-500" : "border-gray-200"
          )}
        />
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        <Users className="w-3 h-3" />
        <span>{data.assignment?.roles?.join(", ") || "No roles"}</span>
        {data.tags && data.tags.length > 0 && (
          <>
            <Filter className="w-3 h-3" />
            <span>{data.tags.join(", ")}</span>
          </>
        )}
      </div>
      <div className="absolute bottom-2 right-2">
        <Button variant="ghost" size="icon" onClick={handleOnDelete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </Button>
      </div>
      <div className="text-xs text-gray-400 absolute bottom-2 left-2">
        Step {data.sequenceNumber}
      </div>
    </div>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
