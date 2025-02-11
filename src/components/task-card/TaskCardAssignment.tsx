
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { AssignmentConfig } from "./types";
import { ROLES_OPTIONS, FILTERS_OPTIONS, USERS_OPTIONS, DYNAMIC_USERS_OPTIONS } from "./constants";

interface TaskCardAssignmentProps {
  assignment: AssignmentConfig;
  onAssignmentTypeChange: (type: AssignmentConfig["type"]) => void;
  onRoleSelect: (role: string) => void;
  onFilterSelect: (filter: string) => void;
  onUserSelect: (user: string) => void;
  onDynamicUserSelect: (user: string) => void;
  onRemoveItem: (type: string, item: string) => void;
}

export const TaskCardAssignment = ({
  assignment,
  onAssignmentTypeChange,
  onRoleSelect,
  onFilterSelect,
  onUserSelect,
  onDynamicUserSelect,
  onRemoveItem,
}: TaskCardAssignmentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Assignment Type</label>
        <Select 
          value={assignment.type}
          onValueChange={(value: AssignmentConfig["type"]) => onAssignmentTypeChange(value)}
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
            <Select onValueChange={onRoleSelect}>
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
                    onClick={() => onRemoveItem("role", role)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Filters (Optional)</label>
            <Select onValueChange={onFilterSelect}>
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
                    onClick={() => onRemoveItem("filter", filter)}
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
          <Select onValueChange={onUserSelect}>
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
                  onClick={() => onRemoveItem("user", user)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {assignment.type === "dynamic_users" && (
        <div>
          <label className="text-sm font-medium mb-2 block">Dynamic Users</label>
          <Select onValueChange={onDynamicUserSelect}>
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
                  onClick={() => onRemoveItem("dynamicUser", user)}
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
  );
};
