
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
  const formatActionName = (action: string): string => {
    return action
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const canToggleAction = (action: string): boolean => {
    return ["cancel", "edit", "sendBack"].includes(action);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-600 sticky top-[45px] z-40">
        <div>Action</div>
        <div className="text-center">Label</div>
        <div className="text-right pr-2">Enable</div>
      </div>
      <div className="space-y-2 relative z-30">
        {actions.map((action, index) => (
          <div key={action.action}>
            <div className="grid grid-cols-3 gap-4 items-center px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg border border-gray-100 bg-white">
              <div className="text-sm font-medium text-gray-700">
                {formatActionName(action.action)}
              </div>
              <div>
                <Input
                  value={action.label}
                  onChange={(e) => onActionLabelChange(index, e.target.value)}
                  className="h-8 text-sm bg-white focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div className="flex justify-end pr-2">
                {canToggleAction(action.action) ? (
                  <Switch
                    checked={action.enabled}
                    onCheckedChange={(checked) => onActionToggle(index, checked)}
                  />
                ) : (
                  <Switch checked={action.enabled} disabled />
                )}
              </div>
            </div>
            {action.action === "sendBack" && action.enabled && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg mx-4">
                <div className="space-y-3">
                  <label className="text-sm text-gray-600 mb-1.5 block">
                    Send Transaction Back To
                  </label>
                  <Select
                    value={action.sendBack?.step || ""}
                    onValueChange={onSendBackStepChange}
                    disabled={previousSteps.length === 0}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue 
                        placeholder={
                          previousSteps.length === 0 
                            ? "No previous steps available" 
                            : `${previousSteps.length} previous steps available`
                        } 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {previousSteps.length === 0 ? (
                        <SelectItem value="none" disabled>No previous steps available</SelectItem>
                      ) : (
                        previousSteps
                          .sort((a, b) => b.sequenceNumber - a.sequenceNumber)
                          .map((step) => (
                            <SelectItem key={step.id} value={step.id}>
                              Step {step.sequenceNumber}: {step.label}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {previousSteps.length === 0 
                      ? "This is the first step in the workflow."
                      : `You can send this item back to any of the previous ${previousSteps.length} steps.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
