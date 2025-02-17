
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
import { Edit2, Ban, ArrowLeftRight, Check, AlertCircle, Settings2 } from "lucide-react";

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
    <div className="space-y-8">
      {/* Enable Actions Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b">
          <Settings2 className="w-4 h-4 text-blue-500" />
          Configure Actions
        </h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:border-blue-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-md">
                <Edit2 className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Edit</span>
                <p className="text-xs text-gray-500 mt-0.5">Allow users to modify the content</p>
              </div>
            </div>
            <Switch
              checked={actions[getActionIndex("edit")]?.enabled || false}
              onCheckedChange={(checked) => handleToggle("edit", checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:border-red-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-md">
                <Ban className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Reject</span>
                <p className="text-xs text-gray-500 mt-0.5">Allow users to reject the request</p>
              </div>
            </div>
            <Switch
              checked={isRejectEnabled}
              onCheckedChange={(checked) => handleToggle("reject", checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:border-orange-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-md">
                <ArrowLeftRight className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Send Back</span>
                <p className="text-xs text-gray-500 mt-0.5">Return to a previous step</p>
              </div>
            </div>
            <Switch
              checked={actions[getActionIndex("sendBack")]?.enabled || false}
              onCheckedChange={(checked) => handleToggle("sendBack", checked)}
            />
          </div>
        </div>
      </div>

      {/* Label Actions Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          Action Labels
        </h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-50 rounded-md">
                <Check className="w-3.5 h-3.5 text-green-500" />
              </div>
              <label className="text-sm font-medium text-gray-700">Approve Label</label>
            </div>
            <Input
              value={actions[getActionIndex("approve")]?.label || ""}
              onChange={(e) => handleLabelChange("approve", e.target.value)}
              placeholder="Enter approve button label"
              maxLength={15}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-50 rounded-md">
                <Ban className="w-3.5 h-3.5 text-red-500" />
              </div>
              <label className="text-sm font-medium text-gray-700">Reject Label</label>
            </div>
            <Input
              value={actions[getActionIndex("reject")]?.label || ""}
              onChange={(e) => handleLabelChange("reject", e.target.value)}
              placeholder="Enter reject button label"
              maxLength={15}
              className="h-9"
              disabled={!isRejectEnabled}
            />
            {!isRejectEnabled && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md mt-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">Enable Reject action to modify its label</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Back Configuration */}
      {actions[getActionIndex("sendBack")]?.enabled && (
        <div className="space-y-4 border rounded-lg p-4 bg-orange-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 rounded-md">
              <ArrowLeftRight className="w-4 h-4 text-orange-500" />
            </div>
            <label className="text-sm font-medium text-gray-700">Send Back Configuration</label>
          </div>
          <Select
            value={actions[getActionIndex("sendBack")]?.sendBack?.step || ""}
            onValueChange={onSendBackStepChange}
            disabled={previousSteps.length === 0}
          >
            <SelectTrigger className="bg-white border-orange-200">
              <SelectValue placeholder="Select a step to send back to" />
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
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            {previousSteps.length === 0 
              ? "This is the first step in the workflow."
              : "Select a previous step to send the workflow back to."}
          </p>
        </div>
      )}
    </div>
  );
};
