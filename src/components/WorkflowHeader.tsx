import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow, Node } from "@xyflow/react";
import { AlertCircle, Clock, CheckCircle, History, User } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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

  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="font-medium">Invoice Workflow</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm text-blue-600 flex items-center gap-2">
              <History className="h-4 w-4" />
              {selectedVersion.version}
              {!selectedVersion.isPublished && (
                <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                  Unpublished
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="start">
            <DropdownMenuLabel className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Version History
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workflowVersions.map((version) => (
              <DropdownMenuItem
                key={version.id}
                onClick={() => handleVersionSelect(version)}
                className="flex flex-col items-start py-3 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{version.version}</span>
                    {version.isMajorChange && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Major Change
                      </Badge>
                    )}
                    {!version.isPublished && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Unpublished
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    {version.isPublished && <CheckCircle className="h-4 w-4 text-green-500" />}
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>{version.user}</span>
                  <span>•</span>
                  <span>{getRelativeTime(version.timestamp)}</span>
                  <span className="text-gray-400">({formatDate(version.timestamp)})</span>
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
