
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FilePlus2, UserCheck, Workflow } from "lucide-react";
import { User, Bell, ArrowRight, Eye, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskCardProps {
  data: {
    type: "create" | "approval" | "integration";
    label: string;
    tags?: string[];
  };
}

const TaskCard = memo(({ data }: TaskCardProps) => {
  const getIcon = () => {
    switch (data.type) {
      case "create":
        return <FilePlus2 className="w-5 h-5 text-[#0FA0CE]" />;
      case "approval":
        return <UserCheck className="w-5 h-5 text-[#0EA5E9]" />;
      case "integration":
        return <Workflow className="w-5 h-5 text-[#F97316]" />;
    }
  };

  const isIntegrationTask = data.type === "integration";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 min-w-[250px]">
      <Handle type="target" position={Position.Top} />
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-50">{getIcon()}</div>
          <input
            type="text"
            defaultValue={data.label}
            className="flex-1 text-lg font-medium outline-none border-none focus:ring-1 focus:ring-primary/20 rounded px-1"
            maxLength={50}
          />
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-50 text-gray-600 text-sm rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <TooltipProvider>
            {!isIntegrationTask && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <User className="w-4 h-4 text-gray-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assignment</p>
                </TooltipContent>
              </Tooltip>
            )}

            {isIntegrationTask && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Server className="w-4 h-4 text-gray-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>API Config</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn(
                    "p-2 hover:bg-gray-50 rounded-lg transition-colors",
                    isIntegrationTask && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isIntegrationTask}
                >
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Actions</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn(
                    "p-2 hover:bg-gray-50 rounded-lg transition-colors",
                    isIntegrationTask && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isIntegrationTask}
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visibility</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;

