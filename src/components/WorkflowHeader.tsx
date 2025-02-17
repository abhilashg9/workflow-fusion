
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow, Node } from "@xyflow/react";
import { AlertCircle, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

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

interface WorkflowVersion {
  id: string;
  version: string;
  timestamp: string;
  user: string;
  isPublished: boolean;
  isMajorChange: boolean;
}

type CustomNode = Node<NodeData>;

export const WorkflowHeader = () => {
  const { getNodes } = useReactFlow<CustomNode>();
  const [selectedVersion, setSelectedVersion] = useState<WorkflowVersion>({
    id: "current",
    version: "v1.2",
    timestamp: new Date().toISOString(),
    user: "John Doe",
    isPublished: false,
    isMajorChange: false
  });

  // Mock versions data - in real app this would come from backend
  const workflowVersions: WorkflowVersion[] = [
    {
      id: "current",
      version: "v1.2",
      timestamp: new Date().toISOString(),
      user: "John Doe",
      isPublished: false,
      isMajorChange: false
    },
    {
      id: "v1.1",
      version: "v1.1",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      user: "Jane Smith",
      isPublished: true,
      isMajorChange: false
    },
    {
      id: "v1.0",
      version: "v1.0",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      user: "John Doe",
      isPublished: true,
      isMajorChange: true
    }
  ];

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

  const handleVersionSelect = (version: WorkflowVersion) => {
    setSelectedVersion(version);
    // Here you would load the workflow state for the selected version
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="font-medium">Invoice Workflow</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm text-blue-600">
              {selectedVersion.version}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuLabel>Workflow Versions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workflowVersions.map((version) => (
              <DropdownMenuItem
                key={version.id}
                onClick={() => handleVersionSelect(version)}
                className="flex flex-col items-start py-2 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{version.version}</span>
                  <div className="flex items-center gap-2">
                    {!version.isPublished && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Unpublished
                      </span>
                    )}
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDate(version.timestamp)} by {version.user}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
