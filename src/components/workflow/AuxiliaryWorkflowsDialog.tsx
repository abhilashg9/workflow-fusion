
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface AuxiliaryWorkflow {
  id: string;
  name: string;
  description: string;
}

const auxiliaryWorkflows: AuxiliaryWorkflow[] = [
  {
    id: "amend",
    name: "Amend",
    description: "Explanation of that create task do or whats in there."
  },
  {
    id: "short-close",
    name: "Short Close",
    description: "Explanation of that create task do or whats in there."
  },
  {
    id: "terminate",
    name: "Terminate",
    description: "Explanation of that create task do or whats in there."
  },
  {
    id: "renew",
    name: "Renew",
    description: "Explanation of that create task do or whats in there."
  }
];

interface AuxiliaryWorkflowsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (workflowId: string) => void;
}

export function AuxiliaryWorkflowsDialog({
  open,
  onOpenChange,
  onSelect
}: AuxiliaryWorkflowsDialogProps) {
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<string>("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center space-y-0 gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onOpenChange(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <DialogTitle className="text-xl">Auxiliary Workflows</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-6">
          <RadioGroup
            value={selectedWorkflow}
            onValueChange={(value) => {
              setSelectedWorkflow(value);
              onSelect(value);
              onOpenChange(false);
            }}
          >
            <div className="space-y-6">
              {auxiliaryWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedWorkflow(workflow.id);
                    onSelect(workflow.id);
                    onOpenChange(false);
                  }}
                >
                  <RadioGroupItem value={workflow.id} id={workflow.id} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={workflow.id}
                      className="text-base font-medium cursor-pointer"
                    >
                      {workflow.name}
                    </Label>
                    <p className="text-sm text-gray-500">{workflow.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
