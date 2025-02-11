import { memo, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { FilePlus2, UserCheck, Workflow, HelpCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface AssignmentConfig {
  type: "roles" | "users" | "dynamic_users" | "supplier" | "manager" | "manager_hierarchy";
  roles?: string[];
  filters?: string[];
  users?: string[];
  dynamicUsers?: string[];
}

interface TaskAction {
  action: string;
  label: string;
  enabled: boolean;
  sendBack?: {
    step: string;
  };
}

interface TaskCardProps {
  data: {
    type: "create" | "approval" | "integration";
    label: string;
    tags?: string[];
    assignment?: AssignmentConfig;
    actions?: TaskAction[];
  };
  id: string;
  setNodeData?: (data: any) => void;
  onDelete?: (id: string) => void;
}

const ROLES_OPTIONS = ["Finance Manager", "Procurement Manager", "IT Manager", "HR Manager"];
const FILTERS_OPTIONS = ["Dimension 1", "Dimension 2", "Dimension 3", "Dimension 4"];
const USERS_OPTIONS = ["John Doe", "Jane Smith", "Alex Johnson", "Sarah Wilson"];
const DYNAMIC_USERS_OPTIONS = ["PR Owner", "PO Owner", "GRN Owner", "Invoice Owner"];

const DEFAULT_ACTIONS: TaskAction[] = [
  { action: "approve", label: "Accept", enabled: true },
  { action: "reject", label: "Reject", enabled: true },
  { action: "cancel", label: "Close", enabled: true },
  { action: "edit", label: "Modify", enabled: false },
  { action: "delegate", label: "Assign to", enabled: false },
  { 
    action: "sendBack", 
    label: "Send Back", 
    enabled: true,
    sendBack: {
      step: "Previous Step"
    }
  }
];

const TaskCard = memo(({ data, id, setNodeData, onDelete }: TaskCardProps) => {
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

  const getAssignmentSubtitle = () => {
    switch (assignment.type) {
      case "roles":
        return "Roles";
      case "users":
        return "Users";
      case "dynamic_users":
        return "Dynamic Users";
      case "supplier":
        return "Supplier";
      case "manager":
        return "Manager";
      case "manager_hierarchy":
        return "Manager Hierarchy";
      default:
        return "";
    }
  };

  const renderAssignmentTags = () => {
    switch (assignment.type) {
      case "roles":
        return (
          <>
            {assignment.roles?.map((role) => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))}
            {assignment.filters?.map((filter) => (
              <Badge key={filter} variant="outline" className="text-xs">
                {filter}
              </Badge>
            ))}
          </>
        );
      case "users":
        return assignment.users?.map((user) => (
          <Badge key={user} variant="secondary" className="text-xs">
            {user}
          </Badge>
        ));
      case "dynamic_users":
        return assignment.dynamicUsers?.map((user) => (
          <Badge key={user} variant="secondary" className="text-xs">
            {user}
          </Badge>
        ));
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

  const handleSendBackStepChange = (step: string) => {
    const newActions = [...actions];
    const sendBackIndex = newActions.findIndex(a => a.action === "sendBack");
    if (sendBackIndex >= 0) {
      newActions[sendBackIndex] = {
        ...newActions[sendBackIndex],
        sendBack: { step }
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

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleDeleteTask = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsDrawerOpen(false);
  };

  const formatActionName = (action: string): string => {
    return action
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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

  const canToggleAction = (action: string): boolean => {
    return ["cancel", "edit", "sendBack"].includes(action);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 min-w-[250px] relative group"
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
            <div className="p-2 rounded-lg bg-gray-50">{getIcon()}</div>
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={taskLabel}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="w-full text-lg font-medium outline-none border-none focus:ring-1 focus:ring-primary/20 rounded px-1"
                maxLength={50}
              />
              <div className="text-sm text-gray-500">{getAssignmentSubtitle()}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {renderAssignmentTags()}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
            <TooltipProvider>
              {!isIntegrationTask && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => handleActionClick("assignment")}
                    >
                      <User className="w-4 h-4 text-gray-600 mb-1" />
                      <span className="text-xs text-gray-600">Assignment</span>
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
                      <span className="text-xs text-gray-600">API Config</span>
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
                    <span className="text-xs text-gray-600">Notifications</span>
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
                    <span className="text-xs text-gray-600">Actions</span>
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
                    <span className="text-xs text-gray-600">Visibility</span>
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
                <TabsList className="w-full justify-start">
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
                  <TabsContent value="assignment" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Assignment Type</label>
                        <Select 
                          value={assignment.type}
                          onValueChange={(value: AssignmentConfig["type"]) => handleAssignmentTypeChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="roles">Roles</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="dynamic_users">Dynamic Users</SelectItem>
                            <SelectItem value="supplier">Supplier</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="manager_hierarchy">Manager Hierarchy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {assignment.type === "roles" && (
                        <>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Roles</label>
                            <Select onValueChange={handleRoleSelect}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select roles" />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES_OPTIONS.map((role) => (
                                  <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {assignment.roles?.map((role) => (
                                <Badge key={role} variant="secondary" className="gap-1">
                                  {role}
                                  <X 
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={() => removeItem("role", role)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Filters (Optional)</label>
                            <Select onValueChange={handleFilterSelect}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select filters" />
                              </SelectTrigger>
                              <SelectContent>
                                {FILTERS_OPTIONS.map((filter) => (
                                  <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {assignment.filters?.map((filter) => (
                                <Badge key={filter} variant="secondary" className="gap-1">
                                  {filter}
                                  <X 
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={() => removeItem("filter", filter)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {assignment.type === "users" && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Users</label>
                          <Select onValueChange={handleUserSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select users" />
                            </SelectTrigger>
                            <SelectContent>
                              {USERS_OPTIONS.map((user) => (
                                <SelectItem key={user} value={user}>{user}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {assignment.users?.map((user) => (
                              <Badge key={user} variant="secondary" className="gap-1">
                                {user}
                                <X 
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => removeItem("user", user)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {assignment.type === "dynamic_users" && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Dynamic Users</label>
                          <Select onValueChange={handleDynamicUserSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dynamic users" />
                            </SelectTrigger>
                            <SelectContent>
                              {DYNAMIC_USERS_OPTIONS.map((user) => (
                                <SelectItem key={user} value={user}>{user}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {assignment.dynamicUsers?.map((user) => (
                              <Badge key={user} variant="secondary" className="gap-1">
                                {user}
                                <X 
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => removeItem("dynamicUser", user)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {(assignment.type === "supplier" || 
                        assignment.type === "manager" || 
                        assignment.type === "manager_hierarchy") && (
                        <div className="text-sm text-gray-500">
                          {assignment.type === "supplier" && "Task will be assigned to supplier"}
                          {assignment.type === "manager" && "Task will be assigned to manager"}
                          {assignment.type === "manager_hierarchy" && "Task will be assigned based on manager hierarchy"}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                {isIntegrationTask && (
                  <TabsContent value="api-config">
                    API Config content
                  </TabsContent>
                )}
                <TabsContent value="notifications">
                  Notifications content
                </TabsContent>
                {!isIntegrationTask && (
                  <>
                    <TabsContent value="actions" className="space-y-4">
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-600">
                          <div>Action</div>
                          <div>Label</div>
                          <div className="text-right pr-2">Enable Action</div>
                        </div>
                        <div className="space-y-2">
                          {actions.map((action, index) => (
                            <div 
                              key={action.action}
                              className="grid grid-cols-3 gap-4 items-center px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg border border-gray-100"
                            >
                              <div className="text-sm font-medium text-gray-700">{formatActionName(action.action)}</div>
                              <div>
                                <Input
                                  value={action.label}
                                  onChange={(e) => handleActionLabelChange(index, e.target.value)}
                                  className="h-8 text-sm bg-white focus:ring-1 focus:ring-primary/20"
                                />
                              </div>
                              <div className="flex justify-end pr-2">
                                {canToggleAction(action.action) ? (
                                  <Switch
                                    checked={action.enabled}
                                    onCheckedChange={(checked) => handleActionToggle(index, checked)}
                                  />
                                ) : (
                                  <Switch checked={action.enabled} disabled />
                                )}
                              </div>
                              {action.action === "sendBack" && action.enabled && (
                                <div className="col-span-3 space-y-3 mt-2 p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                      <label className="text-sm text-gray-600 mb-1.5 block flex items-center gap-1">
                                        Send Transaction Back To
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <HelpCircle className="w-4 h-4 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Select the step to send back to</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </label>
                                      <Select
                                        value={action.sendBack?.step}
                                        onValueChange={handleSendBackStepChange}
                                      >
                                        <SelectTrigger className="bg-white">
                                          <SelectValue placeholder="Select step" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Previous Step">Previous Step</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-600 mb-1.5 block flex items-center gap-1">
                                        Preview
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <HelpCircle className="w-4 h-4 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Preview the send back action</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </label>
                                      <Button variant="outline" size="sm" className="bg-white">
                                        Button
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 leading-relaxed">
                                    Transfer this task or transaction to another team member or role. 
                                    Delegating ensures that the appropriate person can take action 
                                    while maintaining visibility and accountability. Once delegated, 
                                    you may still track the progress, depending on your permissions.
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
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
