
import React from "react";
import { GitBranch } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface TaskCardWorkflowsProps {
  workflows?: ("amend" | "short-close" | "cancel")[];
  onChange: (workflows: ("amend" | "short-close" | "cancel")[]) => void;
}

const WORKFLOW_OPTIONS = [
  { value: "amend", label: "Amend" },
  { value: "short-close", label: "Short Close" },
  { value: "cancel", label: "Cancel" },
] as const;

export const TaskCardWorkflows = ({ workflows = [], onChange }: TaskCardWorkflowsProps) => {
  const handleWorkflowChange = (checked: boolean, value: "amend" | "short-close" | "cancel") => {
    if (checked) {
      onChange([...workflows, value]);
    } else {
      onChange(workflows.filter((w) => w !== value));
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-5 w-5 p-0 ${workflows.length > 0 ? "text-blue-600" : "text-gray-400"}`}
          >
            <GitBranch className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-2">
            {WORKFLOW_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 rounded p-1 hover:bg-gray-100"
              >
                <Checkbox
                  checked={workflows.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleWorkflowChange(checked as boolean, option.value)
                  }
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {workflows.length > 0 && (
        <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-50">
          {workflows.length}
        </Badge>
      )}
    </div>
  );
};
