import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow, Node } from "@xyflow/react";
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NodeData extends Record<string, unknown> {
  type: 'create' | 'approval' | 'integration';
  label: string;
  sequenceNumber?: number;
  assignment?: {
    type?: 'roles' | 'users' | 'supplier' | 'manager' | 'manager_hierarchy';
    roles?: string[];
    users?: string[];
  };
  actions?: Array<{
    action: string;
    label: string;
  }>;
  apiConfig?: {
    selectedApi?: {
      id: string;
      name: string;
    };
  };
  validationErrors?: string[];
}

type CustomNode = Node<NodeData>;

export const WorkflowHeader = () => {
  const { getNodes } = useReactFlow<CustomNode>();

  const validateNodes = () => {
    const nodes = getNodes();
    let allErrors: { nodeId: string; sequenceNumber?: number; errors: string[] }[] = [];

    nodes.forEach((node) => {
      if (node.type === "taskCard" && node.data.validationErrors && node.data.validationErrors.length > 0) {
        allErrors.push({
          nodeId: node.id,
          sequenceNumber: node.data.sequenceNumber,
          errors: node.data.validationErrors
        });
      }
    });

    return allErrors.sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
  };

  const validationErrors = validateNodes();
  const hasErrors = validationErrors.length > 0;

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
        {hasErrors && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Configuration Errors</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <div className="space-y-3 p-1">
                  {validationErrors.map((nodeError, index) => (
                    <div key={index} className="space-y-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        Step #{nodeError.sequenceNumber || '?'}
                      </div>
                      <ul className="list-disc list-inside">
                        {nodeError.errors.map((error, errorIndex) => (
                          <li key={errorIndex} className="text-xs text-gray-500 ml-2">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Button variant="outline">Cancel</Button>
        <Button disabled={hasErrors}>Publish</Button>
      </div>
    </div>
  );
};
