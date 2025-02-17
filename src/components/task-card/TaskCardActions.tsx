
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
  const getActionIndex = (actionName: string): number => {
    return actions.findIndex(action => action.action === actionName);
  };

  const handleLabelChange = (actionName: string, value: string) => {
    const index = getActionIndex(actionName);
    if (index !== -1 && value.length <= 15) {
      onActionLabelChange(index, value);
    }
  };

  const handleToggle = (actionName: string, enabled: boolean) => {
    const index = getActionIndex(actionName);
    if (index !== -1) {
      onActionToggle(index, enabled);
    }
  };

  const isRejectEnabled = actions[getActionIndex("reject")]?.enabled || false;

  return (
    <div className="space-y-6">
      {/* Enable Actions Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Enable Actions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Edit</span>
            <Switch
              checked={actions[getActionIndex("edit")]?.enabled || false}
              onCheckedChange={(checked) => handleToggle("edit", checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Reject</span>
            <Switch
              checked={isRejectEnabled}
              onCheckedChange={(checked) => handleToggle("reject", checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Send Back</span>
            <Switch
              checked={actions[getActionIndex("sendBack")]?.enabled || false}
              onCheckedChange={(checked) => handleToggle("sendBack", checked)}
            />
          </div>
        </div>
      </div>

      {/* Label Actions Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Label Actions</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Approve</label>
            <Input
              value={actions[getActionIndex("approve")]?.label || ""}
              onChange={(e) => handleLabelChange("approve", e.target.value)}
              placeholder="Enter label"
              maxLength={15}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Reject</label>
            <Input
              value={actions[getActionIndex("reject")]?.label || ""}
              onChange={(e) => handleLabelChange("reject", e.target.value)}
              placeholder="Enter label"
              maxLength={15}
              className="h-9"
              disabled={!isRejectEnabled}
            />
            {!isRejectEnabled && (
              <p className="text-sm text-gray-500 italic">
                Enable Reject action to modify its label
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Send Back Configuration */}
      {actions[getActionIndex("sendBack")]?.enabled && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <label className="text-sm text-gray-600 block">
            Send Transaction Back To
          </label>
          <Select
            value={actions[getActionIndex("sendBack")]?.sendBack?.step || ""}
            onValueChange={onSendBackStepChange}
            disabled={previousSteps.length === 0}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select step" />
            </SelectTrigger>
            <SelectContent>
              {previousSteps.length === 0 ? (
                <SelectItem value="none" disabled>No previous steps available</SelectItem>
              ) : (
                previousSteps.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    Step {step.sequenceNumber}: {step.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            {previousSteps.length === 0 
              ? "This is the first step in the workflow."
              : "Select a previous step in the workflow to configure the \"send back\" action."}
          </p>
        </div>
      )}
    </div>
  );
};
