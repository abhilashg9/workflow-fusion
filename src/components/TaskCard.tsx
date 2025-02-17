import { memo, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { 
  FilePlus2, 
  UserCheck, 
  Workflow, 
  Users, 
  Filter, 
  ShieldAlert, 
  Plug, 
  AlertCircle, 
  UserRound, 
  UsersRound,
  User, 
  Bell, 
  ArrowRight, 
  Eye, 
  Server, 
  X,
  GitBranch,
  Trash,
  CheckSquare
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
import { TaskCardProps, AssignmentConfig, TaskAction, ApiConfig, FailureRecourse } from "./task-card/types";
import { DEFAULT_ACTIONS } from "./task-card/constants";
import { TaskCardApiConfig } from "./task-card/TaskCardApiConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isHovered, setIsHovered] = useState(false);
  const [actions, setActions] = useState<TaskAction[]>(data.actions || DEFAULT_ACTIONS);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedWorkflowActions, setSelectedWorkflowActions] = useState<string[]>([]);

  useEffect(() => {
    validateTask();
  }, [data]);

  const handleWorkflowActionToggle = (action: string) => {
    setSelectedWorkflowActions(prev => {
      if (prev.includes(action)) {
        return prev.filter(a => a !== action);
      }
      return [...prev, action];
    });
  };

  const validateTask = () => {
    const errors: string[] = [];

    // Common validations
    if (!data.label || data.label.trim() === '') {
      errors.push('Task label is required');
    }

    // Create task validations
    if (data.type === 'create') {
      if (!data.assignment?.type) {
        errors.push('Role/User/Supplier selection is required');
      }
    }

    // Approval task validations
    if (data.type === 'approval') {
      if (!data.assignment?.type) {
        errors.push('Role/User/Supplier/Manager selection is required');
      }
      const hasEmptyActionLabel = data.actions?.some(action => !action.label || action.label.trim() === '');
      if (hasEmptyActionLabel) {
        errors.push('Accept/Reject labels cannot be empty');
      }
    }

    // Integration task validations
    if (data.type === 'integration') {
      if (!data.apiConfig?.selectedApi) {
        errors.push('API selection is required');
      }
    }
    setValidationErrors(errors);
    if (setNodeData) {
      setNodeData({
        ...data,
        validationErrors: errors
      });
    }
  };

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

  const isCreateTask = data.type === "create";
  const isIntegrationTask = data.type === "integration";

  const getCardHeight = () => {
    if (data.type === "create") return "h-[175px]";
    if (data.type === "integration") return "h-[225px]";
    if (data.type === "approval") {
      if (assignment.type === "roles") return "h-[225px]";
      return "h-[175px]";
    }
    return "h-[225px]";
  };

  const handleActionClick = (tab: string) => {
    setActiveTab(tab);
    setIsDrawerOpen(true);
  };

  const handleLabelChange = (newLabel: string) => {
    setTaskLabel(newLabel);
    if (setNodeData) {
      setNodeData({
        ...data,
        label: newLabel
      });
    }
  };

  const handleAssignmentTypeChange = (type: AssignmentConfig["type"]) => {
    const newAssignment: AssignmentConfig = {
      type
    };
    switch (type) {
      case "roles":
        newAssignment.roles = [];
        newAssignment.filters = [];
        break;
      case "users":
        newAssignment.users = [];
        break;
      case "dynamic_users":
        newAssignment.dynamicUsers = [];
        break;
    }
    setAssignment(newAssignment);
    updateNodeData(newAssignment);
  };

  const updateNodeData = (newAssignment: AssignmentConfig) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        assignment: newAssignment
      });
    }
  };

  const handleRoleSelect = (role: string) => {
    if (assignment.type === "roles" && !assignment.roles?.includes(role)) {
      const newRoles = [...(assignment.roles || []), role];
      setAssignment({
        ...assignment,
        roles: newRoles
      });
      updateNodeData({
        ...assignment,
        roles: newRoles
      });
    }
  };

  const handleFilterSelect = (filter: string) => {
    if (assignment.type === "roles" && !assignment.filters?.includes(filter)) {
      const newFilters = [...(assignment.filters || []), filter];
      setAssignment({
        ...assignment,
        filters: newFilters
      });
      updateNodeData({
        ...assignment,
        filters: newFilters
      });
    }
  };

  const handleUserSelect = (user: string) => {
    if (assignment.type === "users" && !assignment.users?.includes(user)) {
      const newUsers = [...(assignment.users || []), user];
      setAssignment({
        ...assignment,
        users: newUsers
      });
      updateNodeData({
        ...assignment,
        users: newUsers
      });
    }
  };

  const handleDynamicUserSelect = (user: string) => {
    if (assignment.type === "dynamic_users" && !assignment.dynamicUsers?.includes(user)) {
      const newUsers = [...(assignment.dynamicUsers || []), user];
      setAssignment({
        ...assignment,
        dynamicUsers: newUsers
      });
      updateNodeData({
        ...assignment,
        dynamicUsers: newUsers
      });
    }
  };

  const removeItem = (type: string, item: string) => {
    let newAssignment = {
      ...assignment
    };
    switch (type) {
      case "role":
        newAssignment.roles = assignment.roles?.filter(r => r !== item);
        break;
      case "filter":
        newAssignment.filters = assignment.filters?.filter(f => f !== item);
        break;
      case "user":
        newAssignment.users = assignment.users?.filter(u => u !== item);
        break;
      case "dynamicUser":
        newAssignment.dynamicUsers = assignment.dynamicUsers?.filter(u => u !== item);
        break;
    }
    setAssignment(newAssignment);
    updateNodeData(newAssignment);
  };

  const handleActionToggle = (actionIndex: number, enabled: boolean) => {
    const newActions = [...actions];
    newActions[actionIndex] = {
      ...newActions[actionIndex],
      enabled
    };
    setActions(newActions);
    if (setNodeData) {
      setNodeData({
        ...data,
        actions: newActions
      });
    }
  };

  const handleActionLabelChange = (actionIndex: number, newLabel: string) => {
    const newActions = [...actions];
    newActions[actionIndex] = {
      ...newActions[actionIndex],
      label: newLabel
    };
    setActions(newActions);
    if (setNodeData) {
      setNodeData({
        ...data,
        actions: newActions
      });
    }
  };

  const handleSendBackStepChange = (stepId: string) => {
    const newActions = [...actions];
    const sendBackIndex = newActions.findIndex(a => a.action === "sendBack");
    if (sendBackIndex >= 0) {
      newActions[sendBackIndex] = {
        ...newActions[sendBackIndex],
        sendBack: {
          step: stepId
        }
      };
      setActions(newActions);
      if (setNodeData) {
        setNodeData({
          ...data,
          actions: newActions
        });
      }
    }
  };

  const handleDeleteTask = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsDrawerOpen(false);
  };

  const renderAssignmentTags = () => {
    const renderAbbreviatedList = (items: string[] | undefined, type: 'roles' | 'filters') => {
      const Icon = type === 'roles' ? Users : Filter;
      const placeholderText = data.type === "create" ? "Selected users & roles will appear here" : type === 'roles' ? "Selected users, roles & filters will appear here" : "Selected dimensions will appear here";
      return <div className="text-sm text-gray-400 flex items-center gap-2 py-1">
          <Icon className="w-4 h-4" />
          {!items?.length ? <span className="italic">{placeholderText}</span> : <div className="flex flex-wrap gap-2">
              {items.slice(0, 2).map(item => <Badge key={item} variant={type === 'roles' ? "secondary" : "outline"} className="text-xs">
                  {item}
                </Badge>)}
              {items.length > 2 && <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={type === 'roles' ? "secondary" : "outline"} className="text-xs cursor-help">
                        +{items.length - 2}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="p-2">
                      <div className="space-y-1">
                        {items.slice(2).map(item => <div key={item} className="text-xs">{item}</div>)}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>}
            </div>}
        </div>;
    };

    if (data.type === "integration") {
      return <div className="space-y-2">
          <div className="text-sm text-gray-400 flex items-center gap-2 py-1">
            <Plug className="w-4 h-4" />
            {!data.apiConfig?.selectedApi ? <span className="italic">Selected API will appear here</span> : <Badge variant="secondary" className="text-xs">
                <div className="flex items-center gap-1.5">
                  {data.apiConfig.selectedApi.name}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${data.apiConfig.selectedApi.type === 'inbound' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {data.apiConfig.selectedApi.type === 'inbound' ? '← Inbound' : '→ Outbound'}
                  </span>
                </div>
              </Badge>}
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2 py-1">
            <AlertCircle className="w-4 h-4" />
            {!data.apiConfig?.failureRecourse ? <span className="italic">Selected fallback option will appear here</span> : <Badge variant="outline" className="text-xs">
                {data.apiConfig.failureRecourse.type === "sendBack" ? <div className="flex items-center gap-1.5">
                    Send back to Step {previousSteps.find(step => step.id === data.apiConfig?.failureRecourse?.stepId)?.sequenceNumber}
                  </div> : <div className="flex items-center gap-1.5">
                    {data.apiConfig.failureRecourse.assignee?.type === 'user' ? <>
                        <UserRound className="w-3 h-3" />
                        {data.apiConfig.failureRecourse.assignee.value}
                      </> : <>
                        <UsersRound className="w-3 h-3" />
                        {data.apiConfig.failureRecourse.assignee?.value}
                      </>}
                  </div>}
              </Badge>}
          </div>
        </div>;
    }

    switch (assignment.type) {
      case "roles":
        return <div className="space-y-2">
            {renderAbbreviatedList(assignment.roles, 'roles')}
            {!data.type || data.type !== "create" && renderAbbreviatedList(assignment.filters, 'filters')}
          </div>;
      case "users":
        return renderAbbreviatedList(assignment.users, 'roles');
      case "dynamic_users":
        return renderAbbreviatedList(assignment.dynamicUsers, 'roles');
      case "supplier":
        return <Badge variant="secondary" className="text-xs">Supplier</Badge>;
      case "manager":
        return <Badge variant="secondary" className="text-xs">Manager</Badge>;
      case "manager_hierarchy":
        return <Badge variant="secondary" className="text-xs">Manager Hierarchy</Badge>;
      default:
        return renderAbbreviatedList([], 'roles');
    }
  };

  const handleApiSelect = (selectedApi: ApiConfig) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        apiConfig: {
          ...data.apiConfig,
          selectedApi
        }
      });
    }
  };

  const handleFailureRecourseChange = (failureRecourse: FailureRecourse) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        apiConfig: {
          ...data.apiConfig,
          failureRecourse
        }
      });
    }
  };

  const handleValueChange = (newValue: number | undefined) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        assignment: {
          ...data.assignment,
          value: newValue
        }
      });
    }
  };

  const renderActionButtons = () => {
    return <TooltipProvider>
        {!isIntegrationTask && <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => handleActionClick("assignment")}>
              <User className="w-4 h-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">Assignment</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Assignment</p>
          </TooltipContent>
        </Tooltip>}

        {isIntegrationTask && <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => handleActionClick("api-config")}>
              <Server className="w-4 h-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">API Config</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>API Config</p>
          </TooltipContent>
        </Tooltip>}

        <Tooltip>
          <TooltipTrigger asChild>
            <button className={cn("flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors", isCreateTask && "opacity-50 cursor-not-allowed")} onClick={() => !isCreateTask && handleActionClick("notifications")} disabled={isCreateTask}>
              <Bell className="w-4 h-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">Notifications</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className={cn("flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors", (isIntegrationTask || isCreateTask) && "opacity-50 cursor-not-allowed")} onClick={() => !isIntegrationTask && !isCreateTask && handleActionClick("actions")} disabled={isIntegrationTask || isCreateTask}>
              <ArrowRight className="w-4 h-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">Actions</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Actions</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => handleActionClick("visibility")}>
              <Eye className="w-4 h-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">Visibility</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visibility</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>;
  };

  return <div className={cn("bg-white rounded-lg shadow-sm border p-4 w-[400px] relative group", getCardHeight(), validationErrors.length > 0 && "border-red-400")} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {validationErrors.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute top-2 right-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index} className="text-xs text-red-500">{error}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isHovered && <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleDeleteTask}>
          <X className="h-4 w-4" />
        </Button>}
      <Handle type="target" position={Position.Top} />
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-50">{getIcon()}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <input type="text" value={taskLabel} onChange={e => handleLabelChange(e.target.value)} className="flex-1 text-base font-medium outline-none border-none focus:ring-1 focus:ring-primary/20 rounded px-1" maxLength={50} />
              <div className="flex items-center gap-1 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-0">
                      <GitBranch className="w-4 h-4 text-gray-400 py-0 px-0 mx-[12px] my-[12px] bg-slate-50 rounded hover:bg-slate-100 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Workflow Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedWorkflowActions.includes('amend')}
                      onCheckedChange={() => handleWorkflowActionToggle('amend')}
                    >
                      <span className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Amend
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedWorkflowActions.includes('short_close')}
                      onCheckedChange={() => handleWorkflowActionToggle('short_close')}
                    >
                      <span className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Short Close
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedWorkflowActions.includes('cancel')}
                      onCheckedChange={() => handleWorkflowActionToggle('cancel')}
                    >
                      <span className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Cancel
                      </span>
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {data.sequenceNumber > 0 && (
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                    Step {data.sequenceNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 bg-gray-50/50 p-3 rounded-lg py-0 px-0">
          {renderAssignmentTags()}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
          {renderActionButtons()}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />

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
                  <TabsTrigger value="notifications" disabled={isCreateTask}>Notifications</TabsTrigger>
                  {!isIntegrationTask && <TabsTrigger value="actions" disabled={isCreateTask}>Actions</TabsTrigger>}
                  {!isIntegrationTask && <TabsTrigger value="visibility">Visibility</TabsTrigger>}
                </TabsList>

                {!isIntegrationTask && <TabsContent value="assignment">
                    <TaskCardAssignment assignment={assignment} onAssignmentTypeChange={handleAssignmentTypeChange} onRoleSelect={handleRoleSelect} onFilterSelect={handleFilterSelect} onUserSelect={handleUserSelect} onDynamicUserSelect={handleDynamicUserSelect} onRemoveItem={removeItem} onValueChange={handleValueChange} taskType={data.type} />
                  </TabsContent>}

                {isIntegrationTask && <TabsContent value="api-config">
                  <TaskCardApiConfig selectedApi={data.apiConfig?.selectedApi} failureRecourse={data.apiConfig?.failureRecourse} previousSteps={previousSteps} onApiSelect={handleApiSelect} onFailureRecourseChange={handleFailureRecourseChange} />
                </TabsContent>}

                <TabsContent value="notifications">
                  Notifications content
                </TabsContent>

                {!isIntegrationTask && <>
                  <TabsContent value="actions">
                    <TaskCardActions actions={actions} previousSteps={previousSteps} onActionToggle={handleActionToggle} onActionLabelChange={handleActionLabelChange} onSendBackStepChange={handleSendBackStepChange} />
                  </TabsContent>
                  <TabsContent value="visibility">
                    Visibility content
                  </TabsContent>
                </>}
              </Tabs>
            </div>
          </div>
          <DrawerFooter className="border-t border-gray-100 mt-auto shrink-0">
            <Button variant="destructive" onClick={handleDeleteTask} className="w-full">
              <Trash className="w-4 h-4 mr-2" />
              Delete Task
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>;
});

TaskCard.displayName = "TaskCard";
export default TaskCard;
