
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WorkflowHeader = () => {
  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="font-medium">Invoice Workflow</h1>
        <Button variant="ghost" className="text-sm text-blue-600">
          v1.2
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="outline">Cancel</Button>
        <Button>Publish</Button>
      </div>
    </div>
  );
};
