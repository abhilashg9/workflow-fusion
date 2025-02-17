
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow, Node } from "@xyflow/react";
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NodeData {
  type: 'create' | 'approval' | 'integration';
  label: string;
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
  const { getNodes } = useReactFlow<NodeData>();

  const validateNodes = () => {
    const nodes = getNodes();
    let allErrors: { nodeId: string; errors: string[] }[] = [];

    nodes.forEach((node: CustomNode) => {
      const nodeData = node.data;
      const errors: string[] = [];
      
      // Common validations
      if (!nodeData.label || nodeData.label.trim() === '') {
        errors.push('Task label is required');
      }

      // Create task validations
      if (nodeData.type === 'create') {
        if (!nodeData.assignment?.type) {
          errors.push('Role/User/Supplier selection is required');
        }
      }

      // Approval task validations
      if (nodeData.type === 'approval') {
        if (!nodeData.assignment?.type) {
          errors.push('Role/User/Supplier/Manager selection is required');
        }
        const hasEmptyActionLabel = nodeData.actions?.some(
          action => !action.label || action.label.trim() === ''
        );
        if (hasEmptyActionLabel) {
          errors.push('Accept/Reject labels cannot be empty');
        }
      }

      // Integration task validations
      if (nodeData.type === 'integration') {
        if (!nodeData.apiConfig?.selectedApi) {
          errors.push('API selection is required');
        }
      }

      if (errors.length > 0) {
        allErrors.push({ nodeId: node.id, errors });
      }
    });

    return allErrors;
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
                      <ul className="list-disc list-inside">
                        {nodeError.errors.map((error, errorIndex) => (
                          <li key={errorIndex} className="text-xs text-gray-500">
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
