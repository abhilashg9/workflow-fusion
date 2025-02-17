import { memo, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { 
  FilePlus2, 
  UserCheck, 
  Workflow, 
  Filter, 
  ShieldAlert, 
  Plug, 
  ArrowLeftRight, 
  User,
  Users,
  Server,
  Bell,
  ArrowRight,
  Eye,
  X,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TaskCardActions } from "./task-card/TaskCardActions";
import { TaskCardAssignment } from "./task-card/TaskCardAssignment";
import { TaskCardProps, AssignmentConfig, TaskAction } from "./task-card/types";
import { DEFAULT_ACTIONS } from "./task-card/constants";
import { TaskCardApiConfig } from "./task-card/TaskCardApiConfig";
import { ApiConfig, FailureRecourse } from "../components/workflow/types";

const TaskCard = memo(({
  data,
  id,
  setNodeData,
  onDelete,
  previousSteps = []
}: TaskCardProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("assignment");
  const [taskLabel, setTaskLabel] = useState(data.label);
  const [assignment, setAssignment] = useState<AssignmentConfig>(data.assignment || {
    type: "roles",
    roles: [],
    filters: []
  });
  const [actions, setActions] = useState<TaskAction[]>(data.actions || DEFAULT_ACTIONS);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setTaskLabel(data.label);
    if (data.assignment) {
      setAssignment(data.assignment);
    }
    if (data.actions) {
      setActions(data.actions);
    }
  }, [data.label, data.assignment, data.actions]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setTaskLabel(newLabel);
    if (setNodeData) {
      setNodeData({
        ...data,
        label: newLabel,
      });
    }
  };

  const handleAssignmentChange = (newAssignment: AssignmentConfig) => {
    setAssignment(newAssignment);
    if (setNodeData) {
      setNodeData({
        ...data,
        assignment: newAssignment,
      });
    }
  };

  const handleActionsChange = (newActions: TaskAction[]) => {
    setActions(newActions);
    if (setNodeData) {
      setNodeData({
        ...data,
        actions: newActions,
      });
    }
  };

  const validate = () => {
    const errors: string[] = [];
    if (!taskLabel || taskLabel.trim() === "") {
      errors.push("Task label is required.");
    }

    if (data.type === "approval" && (!assignment.type || (assignment.type !== 'supplier' && (!assignment.roles || assignment.roles.length === 0) && (!assignment.users || assignment.users.length === 0)))) {
      errors.push("Assignment configuration is required for approval tasks.");
    }

    if (data.type === "integration" && (!data.apiConfig?.selectedApi)) {
      errors.push("API configuration is required for integration tasks.");
    }

    setValidationErrors(errors);

    if (setNodeData) {
      setNodeData({
        ...data,
        validationErrors: errors,
      });
    }

    return errors;
  };

  useEffect(() => {
    validate();
  }, [taskLabel, assignment, data.type, data.apiConfig]);

  const getCardHeight = () => {
    if (validationErrors.length > 0) {
      return "h-[140px]";
    }

    return "h-[120px]";
  };

  const renderTypeIcon = () => {
    switch (data.type) {
      case "create":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <FilePlus2 className="w-3 h-3 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "approval":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <UserCheck className="w-3 h-3 text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Approval Task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "integration":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Workflow className="w-3 h-3 text-orange-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Integration Task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  const renderAssignmentTags = () => {
    if (!data.assignment) return null;

    const { type, roles, users } = data.assignment;

    return (
      <div className="flex items-center gap-1">
        {type === "roles" && roles && roles.length > 0 && (
          <>
            <Filter className="w-3 h-3 text-gray-400" />
            {roles.map((role) => (
              <Badge key={role} variant="secondary" className="text-[0.6rem]">
                {role}
              </Badge>
            ))}
          </>
        )}

        {type === "users" && users && users.length > 0 && (
          <>
            <User className="w-3 h-3 text-gray-400" />
            {users.map((user) => (
              <Badge key={user} variant="secondary" className="text-[0.6rem]">
                {user}
              </Badge>
            ))}
          </>
        )}
      </div>
    );
  };

  const handleApiSelect = (selectedApi: ApiConfig) => {
    if (setNodeData) {
      const updatedData = {
        ...data,
        apiConfig: {
          ...data.apiConfig,
          selectedApi
        }
      };
      console.log('Updating API config:', updatedData);
      setNodeData(updatedData);
    }
  };

  const handleFailureRecourseChange = (failureRecourse: FailureRecourse) => {
    if (setNodeData) {
      const updatedData = {
        ...data,
        apiConfig: {
          ...data.apiConfig,
          failureRecourse
        }
      };
      console.log('Updating failure recourse:', updatedData);
      setNodeData(updatedData);
    }
  };

  const renderApiConfig = () => {
    if (data.type !== "integration") return null;

    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-400 flex items-center gap-2 py-1">
          <Server className="w-4 h-4" />
          {!data.apiConfig?.selectedApi ? (
            <span className="italic">Select an API for integration</span>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Plug className="w-3 h-3" />
                {data.apiConfig.selectedApi.name}
              </Badge>
              <span className="text-xs text-gray-500 capitalize">({data.apiConfig.selectedApi.type})</span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2 py-1">
          <ShieldAlert className="w-4 h-4" />
          {!data.apiConfig?.failureRecourse ? (
            <span className="italic">Configure fallback option</span>
          ) : (
            <div className="flex items-center gap-2">
              {data.apiConfig.failureRecourse.type === "sendBack" ? (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3" />
                  Send back to Step {previousSteps.find(step => step.id === data.apiConfig?.failureRecourse?.stepId)?.sequenceNumber}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  {data.apiConfig.failureRecourse.assignee?.type === 'user' ? (
                    <>
                      <User className="w-3 h-3" />
                      Assign to {data.apiConfig.failureRecourse.assignee.value}
                    </>
                  ) : (
                    <>
                      <Users className="w-3 h-3" />
                      Assign to {data.apiConfig.failureRecourse.assignee?.value} (Role)
                    </>
                  )}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const isIntegrationTask = data.type === "integration";

  return (
    <>
      <div 
        className={cn(
          "bg-white rounded-lg shadow-sm border p-4 w-[400px] relative group",
          getCardHeight(),
          validationErrors.length > 0 && "border-red-400"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-2 right-2 space-x-1 hidden group-hover:flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(true)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onDelete ? onDelete(id) : null}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {renderTypeIcon()}
            <Input
              type="text"
              placeholder="Task Label"
              value={taskLabel}
              onChange={handleLabelChange}
              className="text-sm font-medium !ring-0 !border-0 focus-visible:!ring-0 focus-visible:!border-0 !shadow-none !bg-transparent"
            />
          </div>
          <span className="text-xs text-gray-500">Step #{data.sequenceNumber}</span>
        </div>
        
        <div className="space-y-3 bg-gray-50/50 p-3 rounded-lg py-0 px-0">
          {data.type === "integration" ? renderApiConfig() : renderAssignmentTags()}
        </div>

        {validationErrors.length > 0 && (
          <div className="absolute bottom-2 left-4 bg-red-50 border border-red-200 text-red-500 text-xs py-1 px-2 rounded-md flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" />
            <span>Configuration Error</span>
          </div>
        )}

        <Handle type="source" position={Position.Right} id="a" />
        <Handle type="target" position={Position.Left} id="b" />
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="fixed right-0 top-0 h-screen w-[40vw] rounded-none border-l border-gray-200 flex flex-col">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Configure Task</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="assignment" className="m-4" onValueChange={(value) => setActiveTab(value)}>
              <TabsList>
                <TabsTrigger value="assignment">
                  <User className="w-4 h-4 mr-2" />
                  Assignment
                </TabsTrigger>
                <TabsTrigger value="actions">
                  <Bell className="w-4 h-4 mr-2" />
                  Actions
                </TabsTrigger>
                {isIntegrationTask && (
                  <TabsTrigger value="api-config">
                    <Plug className="w-4 h-4 mr-2" />
                    API Configuration
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="assignment">
                <TaskCardAssignment assignment={assignment} setAssignment={handleAssignmentChange} />
              </TabsContent>
              <TabsContent value="actions">
                <TaskCardActions actions={actions} setActions={handleActionsChange} />
              </TabsContent>

              {isIntegrationTask && (
                <TabsContent value="api-config">
                  <TaskCardApiConfig 
                    selectedApi={data.apiConfig?.selectedApi}
                    failureRecourse={data.apiConfig?.failureRecourse}
                    previousSteps={previousSteps}
                    onApiSelect={handleApiSelect}
                    onFailureRecourseChange={handleFailureRecourseChange}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>

          <DrawerFooter className="flex justify-end p-4">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDrawerOpen(false)}>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
