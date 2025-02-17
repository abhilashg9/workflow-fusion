
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
import { ROLES_OPTIONS, USERS_OPTIONS } from "./constants";

interface TaskCardAssignmentProps {
  assignment: AssignmentConfig;
  onAssignmentTypeChange: (type: AssignmentConfig["type"]) => void;
  onRoleSelect: (role: string) => void;
  onUserSelect: (user: string) => void;
  onRemoveItem: (type: string, item: string) => void;
}

export const TaskCardAssignment = ({
  assignment,
  onAssignmentTypeChange,
  onRoleSelect,
  onUserSelect,
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
            <SelectItem value="supplier">Supplier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {assignment.type === "roles" && (
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

      {assignment.type === "supplier" && (
        <div className="text-sm text-gray-500">
          Task will be assigned to supplier
        </div>
      )}
    </div>
  );
};
