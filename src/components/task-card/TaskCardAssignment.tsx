
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Users, 
  Filter, 
  X, 
  HelpCircle, 
  Building2, 
  Network, 
  UserCog, 
  GitBranch, 
  DollarSign,
  Settings2
} from "lucide-react";
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
  onValueChange?: (value: number | undefined) => void;
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
  onValueChange,
  taskType
}: TaskCardAssignmentProps) => {
  const isCreateTask = taskType === "create";
  const isApprovalTask = taskType === "approval";

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? undefined : parseInt(e.target.value);
    if (onValueChange && (newValue === undefined || newValue >= 0)) {
      onValueChange(newValue);
    }
  };

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
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Settings2 className="w-4 h-4 text-blue-500" />
          <label className="text-sm font-semibold text-gray-900">Assignment Configuration</label>
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
          <SelectTrigger className="w-full bg-white border shadow-sm">
            <SelectValue placeholder="Select assignment type" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2 text-xs text-gray-500 border-b bg-gray-50">
              {renderAssignmentTypeDescription(assignment.type)}
            </div>
            {isCreateTask ? (
              <>
                <SelectItem value="roles">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-50 rounded">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>Roles</span>
                  </div>
                </SelectItem>
                <SelectItem value="users">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-50 rounded">
                      <User className="w-4 h-4 text-green-500" />
                    </div>
                    <span>Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="supplier">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-purple-50 rounded">
                      <Building2 className="w-4 h-4 text-purple-500" />
                    </div>
                    <span>Supplier</span>
                  </div>
                </SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="roles">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-50 rounded">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>Roles</span>
                  </div>
                </SelectItem>
                <SelectItem value="users">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-50 rounded">
                      <User className="w-4 h-4 text-green-500" />
                    </div>
                    <span>Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="dynamic_users">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-orange-50 rounded">
                      <Network className="w-4 h-4 text-orange-500" />
                    </div>
                    <span>Dynamic Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="supplier">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-purple-50 rounded">
                      <Building2 className="w-4 h-4 text-purple-500" />
                    </div>
                    <span>Supplier</span>
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-indigo-50 rounded">
                      <UserCog className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span>Manager</span>
                  </div>
                </SelectItem>
                <SelectItem value="manager_hierarchy">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-pink-50 rounded">
                      <GitBranch className="w-4 h-4 text-pink-500" />
                    </div>
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Users className="w-4 h-4 text-blue-500" />
              <label className="text-sm font-semibold text-gray-900">Role Configuration</label>
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
              <SelectTrigger className="w-full bg-white border shadow-sm">
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
                      <div className="p-1 bg-blue-50 rounded">
                        <Users className="w-4 h-4 text-blue-500" />
                      </div>
                      <span>{role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-gray-50 border border-gray-100">
              {!assignment.roles?.length && (
                <span className="text-sm text-gray-400 italic">No roles selected</span>
              )}
              {assignment.roles?.map((role) => (
                <Badge key={role} variant="secondary" className="group py-1.5 px-3">
                  <Users className="w-3 h-3 mr-1.5" />
                  {role}
                  <button
                    onClick={() => onRemoveItem("role", role)}
                    className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {!isCreateTask && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Filter className="w-4 h-4 text-blue-500" />
                  <label className="text-sm font-semibold text-gray-900">Dimension Filters</label>
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
                  <SelectTrigger className="w-full bg-white border shadow-sm">
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
                          <div className="p-1 bg-gray-50 rounded">
                            <Filter className="w-4 h-4 text-gray-500" />
                          </div>
                          <span>{filter}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-gray-50 border border-gray-100">
                  {!assignment.filters?.length && (
                    <span className="text-sm text-gray-400 italic">No filters applied</span>
                  )}
                  {assignment.filters?.map((filter) => (
                    <Badge key={filter} variant="outline" className="group py-1.5 px-3">
                      <Filter className="w-3 h-3 mr-1.5" />
                      {filter}
                      <button
                        onClick={() => onRemoveItem("filter", filter)}
                        className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {isApprovalTask && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <label className="text-sm font-semibold text-gray-900">Value Filter</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">Set a value filter for this approval task</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded">
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={assignment.value || ""}
                      onChange={handleValueChange}
                      placeholder="Enter amount threshold"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <HelpCircle className="w-4 h-4 flex-shrink-0" />
                    The task will be active for all transactions with a value greater than the entered amount
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {assignment.type === "users" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User className="w-4 h-4 text-green-500" />
            <label className="text-sm font-semibold text-gray-900">User Assignment</label>
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
            <SelectTrigger className="w-full bg-white border shadow-sm">
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
                    <div className="p-1 bg-green-50 rounded">
                      <User className="w-4 h-4 text-green-500" />
                    </div>
                    <span>{user}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-gray-50 border border-gray-100">
            {!assignment.users?.length && (
              <span className="text-sm text-gray-400 italic">No users selected</span>
            )}
            {assignment.users?.map((user) => (
              <Badge key={user} variant="secondary" className="group py-1.5 px-3">
                <User className="w-3 h-3 mr-1.5" />
                {user}
                <button
                  onClick={() => onRemoveItem("user", user)}
                  className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {assignment.type === "dynamic_users" && !isCreateTask && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Network className="w-4 h-4 text-orange-500" />
            <label className="text-sm font-semibold text-gray-900">Dynamic Assignment</label>
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
            <SelectTrigger className="w-full bg-white border shadow-sm">
              <SelectValue placeholder="Add dynamic users" />
            </SelectTrigger>
            <SelectContent>
              {DYNAMIC_USERS_OPTIONS.map((user) => (
                <SelectItem key={user} value={user}>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-orange-50 rounded">
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <span>{user}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-gray-50 border border-gray-100">
            {!assignment.dynamicUsers?.length && (
              <span className="text-sm text-gray-400 italic">No dynamic users selected</span>
            )}
            {assignment.dynamicUsers?.map((user) => (
              <Badge key={user} variant="secondary" className="group py-1.5 px-3">
                <Users className="w-3 h-3 mr-1.5" />
                {user}
                <button
                  onClick={() => onRemoveItem("dynamicUser", user)}
                  className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
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
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
          <div className="flex items-center gap-2">
            {assignment.type === "supplier" && (
              <div className="p-2 bg-purple-50 rounded">
                <Building2 className="w-4 h-4 text-purple-500" />
              </div>
            )}
            {assignment.type === "manager" && (
              <div className="p-2 bg-indigo-50 rounded">
                <UserCog className="w-4 h-4 text-indigo-500" />
              </div>
            )}
            {assignment.type === "manager_hierarchy" && (
              <div className="p-2 bg-pink-50 rounded">
                <GitBranch className="w-4 h-4 text-pink-500" />
              </div>
            )}
            <div className="text-sm text-gray-600">
              {assignment.type === "supplier" && "Task will be automatically assigned to the supplier"}
              {assignment.type === "manager" && "Task will be automatically assigned to the manager"}
              {assignment.type === "manager_hierarchy" && "Task will be routed through the management hierarchy"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
