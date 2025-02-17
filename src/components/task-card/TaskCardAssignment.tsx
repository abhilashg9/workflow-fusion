import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Users, Filter, X, HelpCircle, Building2, Network, UserCog, GitBranch } from "lucide-react";
import { AssignmentConfig } from "./types";
import { ROLES_OPTIONS, FILTERS_OPTIONS, USERS_OPTIONS, DYNAMIC_USERS_OPTIONS } from "./constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskCardAssignmentProps {
  assignment: AssignmentConfig;
  onAssignmentTypeChange: (type: AssignmentConfig["type"]) => void;
  onRoleSelect: (role: string) => void;
  onFilterSelect: (filter: string) => void;
  onUserSelect: (user: string) => void;
  onDynamicUserSelect: (user: string) => void;
  onRemoveItem: (type: string, item: string) => void;
  taskType: "create" | "approval" | "integration";
}

export const TaskCardAssignment = ({
  assignment,
  onAssignmentTypeChange,
  onRoleSelect,
  onFilterSelect,
  onUserSelect,
  onDynamicUserSelect,
  onRemoveItem,
  taskType
}: TaskCardAssignmentProps) => {
  const isCreateTask = taskType === "create";

  const handleSelect = (type: 'role' | 'filter' | 'user' | 'dynamicUser', value: string) => {
    switch(type) {
      case 'role':
        if (!assignment.roles?.includes(value)) {
          onRoleSelect(value);
        }
        break;
      case 'filter':
        if (!assignment.filters?.includes(value)) {
          onFilterSelect(value);
        }
        break;
      case 'user':
        if (!assignment.users?.includes(value)) {
          onUserSelect(value);
        }
        break;
      case 'dynamicUser':
        if (!assignment.dynamicUsers?.includes(value)) {
          onDynamicUserSelect(value);
        }
        break;
    }
  };

  const renderAssignmentTypeDescription = (type: AssignmentConfig["type"]) => {
    switch (type) {
      case "roles":
        return "Assign to users with specific roles and apply filters";
      case "users":
        return "Assign to specific users directly";
      case "dynamic_users":
        return "Assign based on dynamic user criteria";
      case "supplier":
        return "Automatically assign to the supplier";
      case "manager":
        return "Automatically assign to the manager";
      case "manager_hierarchy":
        return "Route through management hierarchy";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Assignment Type</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">Choose how this task should be assigned to users</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={assignment.type}
          onValueChange={(value: AssignmentConfig["type"]) => onAssignmentTypeChange(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select assignment type" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2 text-xs text-gray-500 border-b">
              {renderAssignmentTypeDescription(assignment.type)}
            </div>
            {isCreateTask ? (
              <>
                <SelectItem value="roles">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Roles</span>
                  </div>
                </SelectItem>
                <SelectItem value="users">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="supplier">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Supplier</span>
                  </div>
                </SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="roles">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Roles</span>
                  </div>
                </SelectItem>
                <SelectItem value="users">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="dynamic_users">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    <span>Dynamic Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="supplier">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Supplier</span>
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4" />
                    <span>Manager</span>
                  </div>
                </SelectItem>
                <SelectItem value="manager_hierarchy">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    <span>Manager Hierarchy</span>
                  </div>
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {assignment.type === "roles" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Roles</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">Select one or more roles that can perform this task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select onValueChange={(value) => handleSelect('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Add roles" />
              </SelectTrigger>
              <SelectContent>
                {ROLES_OPTIONS.map((role) => (
                  <SelectItem 
                    key={role} 
                    value={role}
                    disabled={assignment.roles?.includes(role)}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 min-h-[32px] p-2 rounded-md bg-gray-50/50">
              {!assignment.roles?.length && (
                <span className="text-sm text-gray-400 italic">No roles selected</span>
              )}
              {assignment.roles?.map((role) => (
                <Badge key={role} variant="secondary" className="group">
                  <Users className="w-3 h-3 mr-1" />
                  {role}
                  <button
                    onClick={() => onRemoveItem("role", role)}
                    className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {!isCreateTask && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Filters (Optional)</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Add filters to refine which users can perform this task</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select onValueChange={(value) => handleSelect('filter', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Add filters" />
                </SelectTrigger>
                <SelectContent>
                  {FILTERS_OPTIONS.map((filter) => (
                    <SelectItem 
                      key={filter} 
                      value={filter}
                      disabled={assignment.filters?.includes(filter)}
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>{filter}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 min-h-[32px] p-2 rounded-md bg-gray-50/50">
                {!assignment.filters?.length && (
                  <span className="text-sm text-gray-400 italic">No filters applied</span>
                )}
                {assignment.filters?.map((filter) => (
                  <Badge key={filter} variant="outline" className="group">
                    <Filter className="w-3 h-3 mr-1" />
                    {filter}
                    <button
                      onClick={() => onRemoveItem("filter", filter)}
                      className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {assignment.type === "users" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Users</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Select specific users to assign this task to</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select onValueChange={(value) => handleSelect('user', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Add users" />
            </SelectTrigger>
            <SelectContent>
              {USERS_OPTIONS.map((user) => (
                <SelectItem 
                  key={user} 
                  value={user}
                  disabled={assignment.users?.includes(user)}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 min-h-[32px] p-2 rounded-md bg-gray-50/50">
            {!assignment.users?.length && (
              <span className="text-sm text-gray-400 italic">No users selected</span>
            )}
            {assignment.users?.map((user) => (
              <Badge key={user} variant="secondary" className="group">
                <User className="w-3 h-3 mr-1" />
                {user}
                <button
                  onClick={() => onRemoveItem("user", user)}
                  className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {assignment.type === "dynamic_users" && !isCreateTask && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Dynamic Users</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Select dynamic user criteria for task assignment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select onValueChange={(value) => handleSelect('dynamicUser', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Add dynamic users" />
            </SelectTrigger>
            <SelectContent>
              {DYNAMIC_USERS_OPTIONS.map((user) => (
                <SelectItem key={user} value={user}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{user}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 min-h-[32px] p-2 rounded-md bg-gray-50/50">
            {!assignment.dynamicUsers?.length && (
              <span className="text-sm text-gray-400 italic">No dynamic users selected</span>
            )}
            {assignment.dynamicUsers?.map((user) => (
              <Badge key={user} variant="secondary" className="group">
                <Users className="w-3 h-3 mr-1" />
                {user}
                <button
                  onClick={() => onRemoveItem("dynamicUser", user)}
                  className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {(assignment.type === "supplier" || 
        assignment.type === "manager" || 
        assignment.type === "manager_hierarchy") && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-600">
            {assignment.type === "supplier" && "Task will be automatically assigned to the supplier"}
            {assignment.type === "manager" && "Task will be automatically assigned to the manager"}
            {assignment.type === "manager_hierarchy" && "Task will be routed through the management hierarchy"}
          </div>
        </div>
      )}
    </div>
  );
};
