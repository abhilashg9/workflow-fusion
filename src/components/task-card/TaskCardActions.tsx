
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskAction } from "./types";

interface TaskCardActionsProps {
  actions: TaskAction[];
  previousSteps: { id: string; label: string; sequenceNumber: number }[];
  onActionToggle: (index: number, enabled: boolean) => void;
  onActionLabelChange: (index: number, label: string) => void;
  onSendBackStepChange: (stepId: string) => void;
}

export const TaskCardActions = ({
  actions,
  previousSteps,
  onActionToggle,
  onActionLabelChange,
  onSendBackStepChange,
}: TaskCardActionsProps) => {
  return (
    <div className="space-y-2">
      <div className="p-4 text-sm text-gray-500 text-center">
        No actions configured for this task.
      </div>
    </div>
  );
};

