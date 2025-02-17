
import { memo, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { FilePlus2, UserCheck, Workflow, Users, Filter } from "lucide-react";
import { User, Bell, ArrowRight, Eye, Server, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TaskCardActions } from "./task-card/TaskCardActions";
import { TaskCardAssignment } from "./task-card/TaskCardAssignment";
import { TaskCardProps, AssignmentConfig, TaskAction } from "./task-card/types";
import { DEFAULT_ACTIONS } from "./task-card/constants";
import { TaskCardApiConfig } from "./task-card/TaskCardApiConfig";
import { ApiConfig, FailureRecourse } from "./workflow/types";

const TaskCard = memo(({ data, id, setNodeData, onDelete, previousSteps = [] }: TaskCardProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("assignment");
  const [taskLabel, setTaskLabel] = useState(data.label);
  const [assignment, setAssignment] = useState<AssignmentConfig>(
    data.assignment || { type: "roles", roles: [], filters: [] }
  );
  const [isHovered, setIsHovered] = useState(false);
  const [actions, setActions] = useState<TaskAction[]>(
    data.actions || DEFAULT_ACTIONS
  );

  useEffect(() => {
    setTaskLabel(data.label);
  }, [data.label]);

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

  const handleActionClick = (tab: string) => {
    setActiveTab(tab);
    setIsDrawerOpen(true);
  };

  const handleLabelChange = (newLabel: string) => {
    setTaskLabel(newLabel);
    if (setNodeData) {
      setNodeData({
        ...data,
        label: newLabel,
      });
    }
  };

  const handleAssignmentTypeChange = (type: AssignmentConfig["type"]) => {
    const newAssignment: AssignmentConfig = { type };
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
        assignment: newAssignment,
      });
    }
  };

  const handleRoleSelect = (role: string) => {
    if (assignment.type === "roles" && !assignment.roles?.includes(role)) {
      const newRoles = [...(assignment.roles || []), role];
      setAssignment({ ...assignment, roles: newRoles });
      updateNodeData({ ...assignment, roles: newRoles });
    }
  };

  const handleFilterSelect = (filter: string) => {
    if (assignment.type === "roles" && !assignment.filters?.includes(filter)) {
      const newFilters = [...(assignment.filters || []), filter];
      setAssignment({ ...assignment, filters: newFilters });
      updateNodeData({ ...assignment, filters: newFilters });
    }
  };

  const handleUserSelect = (user: string) => {
    if (assignment.type === "users" && !assignment.users?.includes(user)) {
      const newUsers = [...(assignment.users || []), user];
      setAssignment({ ...assignment, users: newUsers });
      updateNodeData({ ...assignment, users: newUsers });
    }
  };

  const handleDynamicUserSelect = (user: string) => {
    if (assignment.type === "dynamic_users" && !assignment.dynamicUsers?.includes(user)) {
      const newUsers = [...(assignment.dynamicUsers || []), user];
      setAssignment({ ...assignment, dynamicUsers: newUsers });
      updateNodeData({ ...assignment, dynamicUsers: newUsers });
    }
  };

  const removeItem = (type: string, item: string) => {
    let newAssignment = { ...assignment };
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
    newActions[actionIndex] = { ...newActions[actionIndex], enabled };
    setActions(newActions);
    if (setNodeData) {
      setNodeData({
        ...data,
        actions: newActions,
      });
    }
  };

  const handleActionLabelChange = (actionIndex: number, newLabel: string) => {
    const newActions = [...actions];
    newActions[actionIndex] = { ...newActions[actionIndex], label: newLabel };
    setActions(newActions);
    if (setNodeData) {
      setNodeData({
        ...data,
        actions: newActions,
      });
    }
  };

  const handleSendBackStepChange = (stepId: string) => {
    const newActions = [...actions];
    const sendBackIndex = newActions.findIndex(a => a.action === "sendBack");
    if (sendBackIndex >= 0) {
      newActions[sendBackIndex] = {
        ...newActions[sendBackIndex],
        sendBack: { step: stepId }
      };
      setActions(newActions);
      if (setNodeData) {
        setNodeData({
          ...data,
          actions: newActions,
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
    const renderAbbreviatedList = (items: string[] | undefined, placeholderText: string) => {
      if (!items?.length) {
        return (
          <div className="text-sm text-gray-400 flex items-center gap-2 py-1">
            {placeholderText === "Select roles or users" ? (
              <Users className="w-4 h-4" />
            ) : (
              <Filter className="w-4 h-4" />
            )}
            <span className="italic">{placeholderText}</span>
          </div>
        );
      }

      const maxDisplay = 2;
      const remainingCount = items.length - maxDisplay;

      return (
        <div className="flex flex-wrap gap-2">
          {items.slice(0, maxDisplay).map((item) => (
            <Badge 
              key={item} 
              variant={placeholderText.includes("roles") ? "secondary" : "outline"}
              className="text-xs"
            >
              {item}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant={placeholderText.includes("roles") ? "secondary" : "outline"}
                    className="text-xs cursor-help"
                  >
                    +{remainingCount}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  <div className="space-y-1">
                    {items.slice(maxDisplay).map((item) => (
                      <div key={item} className="text-xs">{item}</div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    };

    switch (assignment.type) {
      case "roles":
        return (
          <div className="space-y-2">
            {renderAbbreviatedList(assignment.roles, "Select roles or users")}
            {renderAbbreviatedList(assignment.filters, "Select dimensions or filters")}
          </div>
        );
      case "users":
        return renderAbbreviatedList(assignment.users, "Select users");
      case "dynamic_users":
        return renderAbbreviatedList(assignment.dynamicUsers, "Select dynamic users");
      case "supplier":
        return <Badge variant="secondary" className="text-xs">Supplier</Badge>;
      case "manager":
        return <Badge variant="secondary" className="text-xs">Manager</Badge>;
      case "manager_hierarchy":
        return <Badge variant="secondary" className="text-xs">Manager Hierarchy</Badge>;
      default:
        return null;
    }
  };

  const handleApiSelect = (selectedApi: ApiConfig) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        apiConfig: {
          ...data.apiConfig,
          selectedApi,
        },
      });
    }
  };

  const handleFailureRecourseChange = (failureRecourse: FailureRecourse) => {
    if (setNodeData) {
      setNodeData({
        ...data,
        apiConfig: {
          ...data.apiConfig,
          failureRecourse,
        },
      });
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-md border border-gray-100 p-5 w-[400px] h-[225px] relative group transition-shadow hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Handle type="target" position={Position.Top} />
        {isHovered && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDeleteTask}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gray-50/80 ring-1 ring-gray-100">{getIcon()}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={taskLabel}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  className="flex-1 text-lg font-medium outline-none border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-2 py-1 transition-all"
                  maxLength={50}
                />
                {data.sequenceNumber > 0 && (
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0">
                    Step {data.sequenceNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-gray-50/50 p-3.5 rounded-xl ring-1 ring-gray-100/50">
            {renderAssignmentTags()}
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
            <TooltipProvider>
              {!isIntegrationTask && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => handleActionClick("assignment")}
                    >
                      <User className="w-4 h-4 text-gray-600 mb-1" />
                      <span className="text-xs font-medium text-gray-600">Assignment</span>
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
                    <button 
                      className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => handleActionClick("api-config")}
                    >
                      <Server className="w-4 h-4 text-gray-600 mb-1" />
                      <span className="text-xs font-medium text-gray-600">API Config</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>API Config</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => handleActionClick("notifications")}
                  >
                    <Bell className="w-4 h-4 text-gray-600 mb-1" />
                    <span className="text-xs font-medium text-gray-600">Notifications</span>
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
                      "flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors",
                      isIntegrationTask && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isIntegrationTask}
                    onClick={() => !isIntegrationTask && handleActionClick("actions")}
                  >
                    <ArrowRight className="w-4 h-4 text-gray-600 mb-1" />
                    <span className="text-xs font-medium text-gray-600">Actions</span>
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
                      "flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors",
                      isIntegrationTask && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isIntegrationTask}
                    onClick={() => !isIntegrationTask && handleActionClick("visibility")}
                  >
                    <Eye className="w-4 h-4 text-gray-600 mb-1" />
                    <span className="text-xs font-medium text-gray-600">Visibility</span>
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="fixed right-0 top-0 h-screen w-[40vw] rounded-none border-l border-gray-200 flex flex-col">
          <DrawerHeader className="border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">{getIcon()}</div>
                <Input
                  value={taskLabel}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  className="flex-1 text-lg font-medium h-auto py-1"
                  maxLength={50}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start sticky top-0 z-50 bg-white">
                  {!isIntegrationTask && (
                    <TabsTrigger value="assignment">Assignment</TabsTrigger>
                  )}
                  {isIntegrationTask && (
                    <TabsTrigger value="api-config">API Config</TabsTrigger>
                  )}
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  {!isIntegrationTask && (
                    <>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                      <TabsTrigger value="visibility">Visibility</TabsTrigger>
                    </>
                  )}
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
            <Button 
              variant="destructive" 
              onClick={handleDeleteTask}
              className="w-full"
            >
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
