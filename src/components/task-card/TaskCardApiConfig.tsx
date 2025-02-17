
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
  Plug,
  AlertCircle
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

// Mock data for roles and users - in a real app this would come from an API
const MOCK_ROLES = ["Admin", "Manager", "Approver", "Reviewer"];
const MOCK_USERS = ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown"];

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
    <div className="space-y-8">
      {/* API Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-blue-500" />
            <Label className="text-base font-medium">Integration API</Label>
          </div>
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
          <SelectTrigger className="w-full">
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
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-100">
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">API Type</Label>
            <p className="text-sm font-medium">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedApi.type === 'inbound' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedApi.type === 'inbound' ? '← Inbound' : '→ Outbound'}
              </span>
            </p>
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
              className="h-auto p-0 text-blue-600"
              asChild
            >
              <a
                href={selectedApi.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-blue-700"
              >
                View Integration Details
                <ArrowUpRightFromSquare className="w-4 h-4 ml-1" />
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Fallback Options Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <Label className="text-base font-medium">Fallback Options</Label>
          </div>
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
          className="flex flex-col gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100"
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="sendBack" id="sendBack" className="mt-1" />
            <div className="grid gap-2 leading-none">
              <Label htmlFor="sendBack" className="font-medium">Send back to previous step</Label>
              <p className="text-sm text-gray-500">Return the task to a previous step in the workflow</p>
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
                  <SelectTrigger className="w-[280px] mt-2">
                    <SelectValue placeholder="Select step to return to" />
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

          <div className="flex items-start space-x-3">
            <RadioGroupItem value="assign" id="assign" className="mt-1" />
            <div className="grid gap-2 leading-none">
              <Label htmlFor="assign" className="font-medium">Assign to another person</Label>
              <p className="text-sm text-gray-500">Delegate the task to a specific user or role</p>
              {recourseType === "assign" && (
                <div className="space-y-4 mt-2">
                  <div className="flex gap-2">
                    <Button
                      variant={assigneeType === "user" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAssigneeTypeChange("user")}
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Specific User
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
                  
                  {assigneeType === "role" && (
                    <Select
                      value={failureRecourse?.assignee?.value}
                      onValueChange={(value) =>
                        onFailureRecourseChange({
                          type: "assign",
                          assignee: {
                            type: "role",
                            value
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {assigneeType === "user" && (
                    <Select
                      value={failureRecourse?.assignee?.value}
                      onValueChange={(value) =>
                        onFailureRecourseChange({
                          type: "assign",
                          assignee: {
                            type: "user",
                            value
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_USERS.map((user) => (
                          <SelectItem key={user} value={user}>
                            {user}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
