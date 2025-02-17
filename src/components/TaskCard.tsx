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

  const handleLabelChange = (newLabel: string) => {
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

  const getIcon = () => {
    switch (data.type) {
      case "create":
        return <FilePlus2 className="w-5 h-5" />;
      case "approval":
        return <UserCheck className="w-5 h-5" />;
      case "integration":
        return <Plug className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleAssignmentTypeChange = (type: AssignmentConfig["type"]) => {
    setAssignment(prev => ({ ...prev, type }));
    setNodeData({ ...data, assignment: { ...assignment, type } });
  };

  const handleRoleSelect = (role: string) => {
    const newRoles = [...(assignment.roles || []), role];
    setAssignment(prev => ({ ...prev, roles: newRoles }));
    setNodeData({ ...data, assignment: { ...assignment, roles: newRoles } });
  };

  const handleFilterSelect = (filter: string) => {
    const newFilters = [...(assignment.filters || []), filter];
    setAssignment(prev => ({ ...prev, filters: newFilters }));
    setNodeData({ ...data, assignment: { ...assignment, filters: newFilters } });
  };

  const handleUserSelect = (user: string) => {
    const newUsers = [...(assignment.users || []), user];
    setAssignment(prev => ({ ...prev, users: newUsers }));
    setNodeData({ ...data, assignment: { ...assignment, users: newUsers } });
  };

  const handleDynamicUserSelect = (user: string) => {
    const newDynamicUsers = [...(assignment.dynamicUsers || []), user];
    setAssignment(prev => ({ ...prev, dynamicUsers: newDynamicUsers }));
    setNodeData({ ...data, assignment: { ...assignment, dynamicUsers: newDynamicUsers } });
  };

  const removeItem = (type: string, item: string) => {
    let updatedItems;
    switch (type) {
      case "role":
        updatedItems = assignment.roles?.filter(r => r !== item) || [];
        setAssignment(prev => ({ ...prev, roles: updatedItems }));
        setNodeData({ ...data, assignment: { ...assignment, roles: updatedItems } });
        break;
      case "filter":
        updatedItems = assignment.filters?.filter(f => f !== item) || [];
        setAssignment(prev => ({ ...prev, filters: updatedItems }));
        setNodeData({ ...data, assignment: { ...assignment, filters: updatedItems } });
        break;
      case "user":
        updatedItems = assignment.users?.filter(u => u !== item) || [];
        setAssignment(prev => ({ ...prev, users: updatedItems }));
        setNodeData({ ...data, assignment: { ...assignment, users: updatedItems } });
        break;
      case "dynamicUser":
        updatedItems = assignment.dynamicUsers?.filter(u => u !== item) || [];
        setAssignment(prev => ({ ...prev, dynamicUsers: updatedItems }));
        setNodeData({ ...data, assignment: { ...assignment, dynamicUsers: updatedItems } });
        break;
      default:
        break;
    }
  };

  const handleValueChange = (value: number | undefined) => {
    setAssignment(prev => ({ ...prev, value }));
    setNodeData({ ...data, assignment: { ...assignment, value } });
  };

  const handleActionToggle = (index: number, enabled: boolean) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], enabled };
    setActions(newActions);
    setNodeData({ ...data, actions: newActions });
  };

  const handleActionLabelChange = (index: number, label: string) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], label };
    setActions(newActions);
    setNodeData({ ...data, actions: newActions });
  };

  const handleSendBackStepChange = (stepId: string) => {
    const newActions = [...actions];
    const sendBackActionIndex = newActions.findIndex(action => action.action === "sendBack");
    if (sendBackActionIndex !== -1) {
      newActions[sendBackActionIndex] = {
        ...newActions[sendBackActionIndex],
        sendBack: { step: stepId }
      };
      setActions(newActions);
      setNodeData({ ...data, actions: newActions });
    }
  };

  const handleDeleteTask = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsDrawerOpen(false);
  };

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLabelChange(e.target.value)}
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
          <DrawerHeader className="border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">{getIcon()}</div>
                <Input value={taskLabel} onChange={e => handleLabelChange(e.target.value)} className="flex-1 text-lg font-medium h-auto py-1" maxLength={50} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start sticky top-0 z-50 bg-white">
                  {!isIntegrationTask && <TabsTrigger value="assignment">Assignment</TabsTrigger>}
                  {isIntegrationTask && <TabsTrigger value="api-config">API Config</TabsTrigger>}
                  <TabsTrigger value="notifications" disabled={data.type === "create"}>Notifications</TabsTrigger>
                  {!isIntegrationTask && <TabsTrigger value="actions" disabled={data.type === "create"}>Actions</TabsTrigger>}
                  {!isIntegrationTask && <TabsTrigger value="visibility">Visibility</TabsTrigger>}
                </TabsList>

                {!isIntegrationTask && (
                  <TabsContent value="assignment">
                    <TaskCardAssignment
                      assignment={assignment}
                      onAssignmentTypeChange={handleAssignmentTypeChange}
                      onRoleSelect={handleRoleSelect}
                      onFilterSelect={handleFilterSelect}
                      onUserSelect={handleUserSelect}
                      onDynamicUserSelect={handleDynamicUserSelect}
                      onRemoveItem={removeItem}
                      onValueChange={handleValueChange}
                      taskType={data.type}
                    />
                  </TabsContent>
                )}

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

                <TabsContent value="notifications">
                  Notifications content
                </TabsContent>

                {!isIntegrationTask && (
                  <>
                    <TabsContent value="actions">
                      <TaskCardActions 
                        actions={actions}
                        previousSteps={previousSteps}
                        onActionToggle={handleActionToggle}
                        onActionLabelChange={handleActionLabelChange}
                        onSendBackStepChange={handleSendBackStepChange}
                      />
                    </TabsContent>
                    <TabsContent value="visibility">
                      Visibility content
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>
          </div>
          <DrawerFooter className="border-t border-gray-100 mt-auto shrink-0">
            <Button variant="destructive" onClick={handleDeleteTask} className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Task
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
