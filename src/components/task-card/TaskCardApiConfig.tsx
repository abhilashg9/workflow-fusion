import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  ArrowUpRightFromSquare, 
  Copy, 
  CheckCircle2, 
  User, 
  Users,
  Plug 
} from "lucide-react";
import { ApiConfig, FailureRecourse, mockApiConfigs, StepOption } from "../workflow/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskCardApiConfigProps {
  selectedApi?: ApiConfig;
  failureRecourse?: FailureRecourse;
  previousSteps?: StepOption[];
  onApiSelect: (api: ApiConfig) => void;
  onFailureRecourseChange: (recourse: FailureRecourse) => void;
}

export const TaskCardApiConfig = ({
  selectedApi,
  failureRecourse,
  previousSteps = [],
  onApiSelect,
  onFailureRecourseChange,
}: TaskCardApiConfigProps) => {
  const [copied, setCopied] = useState(false);
  const [recourseType, setRecourseType] = useState<"sendBack" | "assign">(
    failureRecourse?.type || "sendBack"
  );
  const [assigneeType, setAssigneeType] = useState<"user" | "role">(
    failureRecourse?.assignee?.type || "user"
  );

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyEndpoint = () => {
    if (selectedApi?.endpoint) {
      navigator.clipboard.writeText(selectedApi.endpoint);
      setCopied(true);
    }
  };

  const handleRecourseTypeChange = (value: "sendBack" | "assign") => {
    setRecourseType(value);
    if (value === "sendBack") {
      onFailureRecourseChange({
        type: "sendBack",
        stepId: previousSteps[0]?.id,
      });
    } else {
      onFailureRecourseChange({
        type: "assign",
        assignee: {
          type: assigneeType,
          value: "",
        },
      });
    }
  };

  const handleAssigneeTypeChange = (value: "user" | "role") => {
    setAssigneeType(value);
    onFailureRecourseChange({
      type: "assign",
      assignee: {
        type: value,
        value: "",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="api-select" className="text-sm font-medium">
            Select Integration API(s)
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose the integration API for this task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select
          value={selectedApi?.id}
          onValueChange={(value) => {
            const api = mockApiConfigs.find((api) => api.id === value);
            if (api) onApiSelect(api);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an API" />
          </SelectTrigger>
          <SelectContent>
            {mockApiConfigs.map((api) => (
              <SelectItem key={api.id} value={api.id}>
                <div className="flex items-center gap-2">
                  <Plug className="w-4 h-4" />
                  {api.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedApi && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">API Type</Label>
            <p className="text-sm font-medium capitalize">{selectedApi.type}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">Endpoint</Label>
            <div className="flex items-center gap-2">
              <Input
                value={selectedApi.endpoint}
                readOnly
                className="bg-white font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyEndpoint}
                className="shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          {selectedApi.viewUrl && (
            <Button
              variant="link"
              className="h-auto p-0 text-primary"
              asChild
            >
              <a
                href={selectedApi.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                View Integration
                <ArrowUpRightFromSquare className="w-4 h-4 ml-1" />
              </a>
            </Button>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            Failure Recourse
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Action to take when the integration fails</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <RadioGroup
          value={recourseType}
          onValueChange={(value: "sendBack" | "assign") =>
            handleRecourseTypeChange(value)
          }
          className="flex flex-col gap-4"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="sendBack" id="sendBack" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="sendBack">Send back to previous step</Label>
              {recourseType === "sendBack" && previousSteps.length > 0 && (
                <Select
                  value={failureRecourse?.stepId}
                  onValueChange={(value) =>
                    onFailureRecourseChange({
                      type: "sendBack",
                      stepId: value,
                    })
                  }
                >
                  <SelectTrigger className="w-[200px] mt-2">
                    <SelectValue placeholder="Select step" />
                  </SelectTrigger>
                  <SelectContent>
                    {previousSteps.map((step) => (
                      <SelectItem key={step.id} value={step.id}>
                        Step {step.sequenceNumber}: {step.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <RadioGroupItem value="assign" id="assign" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="assign">Assign to user</Label>
              {recourseType === "assign" && (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={assigneeType === "user" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAssigneeTypeChange("user")}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    User
                  </Button>
                  <Button
                    variant={assigneeType === "role" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAssigneeTypeChange("role")}
                    className="flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Role
                  </Button>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
