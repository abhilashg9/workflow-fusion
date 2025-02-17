
import { ChevronDown, Plus, PenLine, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow, Node } from "@xyflow/react";
import { AlertCircle, Clock, GitBranch, User, CheckCircle2, Timer, History } from "lucide-react";
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
import { toast } from "sonner";

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
  changes?: string[];
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
    isMajorChange: false,
    changes: ["Added approval step", "Updated integration configuration"]
  });

  const [selectedWorkflow, setSelectedWorkflow] = useState<'create' | 'amend' | 'short-close' | 'cancel'>('create');

  const workflowVersions: WorkflowVersion[] = [
    {
      id: "current",
      version: "v1.2",
      timestamp: new Date().toISOString(),
      user: "John Doe",
      isPublished: false,
      isMajorChange: false,
      changes: ["Added approval step", "Updated integration configuration"]
    },
    {
      id: "v1.1",
      version: "v1.1",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      user: "Jane Smith",
      isPublished: true,
      isMajorChange: false,
      changes: ["Updated user assignments", "Fixed validation rules"]
    },
    {
      id: "v1.0",
      version: "v1.0",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      user: "John Doe",
      isPublished: true,
      isMajorChange: true,
      changes: ["Initial workflow setup", "Created base approval flow"]
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
  };

  const handleAuxiliaryWorkflow = (type: 'create' | 'amend' | 'short-close' | 'cancel') => {
    setSelectedWorkflow(type);
    toast.info(`Selected ${type} workflow`, {
      duration: 2000
    });
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
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return rtf.format(-minutes, 'minute');
    if (hours < 24) return rtf.format(-hours, 'hour');
    return rtf.format(-days, 'day');
  };

  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2">
            <h1 className="font-medium">
              Invoice Workflow | <span className="text-[#0EA5E9] capitalize">{selectedWorkflow.replace('-', ' ')}</span>
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-sm text-[#0EA5E9] hover:bg-[#D3E4FD] px-2 transition-colors"
              >
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white shadow-lg border-[#D3E4FD]">
              <DropdownMenuItem 
                onClick={() => handleAuxiliaryWorkflow('create')} 
                className="flex items-center gap-2 hover:bg-[#D3E4FD] text-gray-700 focus:bg-[#D3E4FD] focus:text-[#0EA5E9]"
              >
                <Plus className="h-4 w-4 text-[#0EA5E9]" />
                Create
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAuxiliaryWorkflow('amend')} 
                className="flex items-center gap-2 hover:bg-[#D3E4FD] text-gray-700 focus:bg-[#D3E4FD] focus:text-[#0EA5E9]"
              >
                <PenLine className="h-4 w-4 text-[#0EA5E9]" />
                Amend
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAuxiliaryWorkflow('short-close')} 
                className="flex items-center gap-2 hover:bg-[#D3E4FD] text-gray-700 focus:bg-[#D3E4FD] focus:text-[#0EA5E9]"
              >
                <CheckCircle className="h-4 w-4 text-[#0EA5E9]" />
                Short Close
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAuxiliaryWorkflow('cancel')} 
                className="flex items-center gap-2 hover:bg-[#D3E4FD] text-gray-700 focus:bg-[#D3E4FD] focus:text-[#0EA5E9]"
              >
                <X className="h-4 w-4 text-[#0EA5E9]" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="text-sm text-[#0EA5E9] hover:bg-[#D3E4FD] flex items-center gap-2 transition-colors"
            >
              <History className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedVersion.version}</span>
                {!selectedVersion.isPublished && (
                  <Badge variant="secondary" className="bg-[#D3E4FD] text-[#0EA5E9] hover:bg-[#D3E4FD]">
                    Draft
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 bg-white shadow-lg border-[#D3E4FD]" align="start">
            <DropdownMenuLabel className="flex items-center gap-2 text-[#0EA5E9]">
              <History className="h-4 w-4" />
              Version History
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#D3E4FD]" />
            <div className="max-h-[400px] overflow-y-auto">
              {workflowVersions.map((version, index) => (
                <DropdownMenuItem
                  key={version.id}
                  onClick={() => handleVersionSelect(version)}
                  className="flex flex-col items-start py-3 px-4 cursor-pointer hover:bg-[#D3E4FD] focus:bg-[#D3E4FD]"
                >
                  <div className="flex items-start justify-between w-full gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{version.version}</span>
                        {version.isMajorChange && (
                          <Badge variant="secondary" className="bg-[#D3E4FD] text-[#0EA5E9]">
                            Major Update
                          </Badge>
                        )}
                        {!version.isPublished && (
                          <Badge variant="secondary" className="bg-[#D3E4FD] text-[#0EA5E9]">
                            Draft
                          </Badge>
                        )}
                      </div>
                      {version.changes && (
                        <ul className="mt-1 space-y-1">
                          {version.changes.map((change, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-[#0EA5E9]"></div>
                              {change}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {version.isPublished && (
                      <CheckCircle2 className="h-4 w-4 text-[#0EA5E9] mt-1 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{version.user}</span>
                    <span className="text-gray-300">•</span>
                    <Timer className="h-3 w-3" />
                    <span>{getRelativeTime(version.timestamp)}</span>
                    <span className="text-gray-400">({formatDate(version.timestamp)})</span>
                  </div>
                  {index < workflowVersions.length - 1 && (
                    <div className="absolute left-0 bottom-0 w-full border-b border-[#D3E4FD]"></div>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
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
        <Button 
          variant="outline" 
          className="border-[#D3E4FD] hover:bg-[#D3E4FD] text-[#0EA5E9]"
        >
          Cancel
        </Button>
        <Button 
          disabled={hasErrors}
          className="bg-[#0EA5E9] hover:bg-[#1EAEDB] text-white transition-colors"
        >
          Publish
        </Button>
      </div>
    </div>
  );
};
