
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, AlertCircle } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WorkflowHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onClose: () => void;
  onPublish: () => void;
}

export const WorkflowHeader = ({ title, onTitleChange, onClose, onPublish }: WorkflowHeaderProps) => {
  const { getNodes } = useReactFlow();
  
  const allValidationErrors = getNodes().reduce((errors, node) => {
    if (node.data?.validationErrors?.length > 0) {
      errors.push({
        step: node.data.sequenceNumber || 0,
        label: node.data.label || 'Unnamed Task',
        errors: node.data.validationErrors
      });
    }
    return errors;
  }, [] as { step: number; label: string; errors: string[] }[]);

  const hasErrors = allValidationErrors.length > 0;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-lg font-medium h-auto py-1 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
              placeholder="Enter workflow title"
            />
          </div>
          <div className="flex items-center gap-3">
            {hasErrors && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-md border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Validation Errors</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="w-80">
                    <div className="space-y-3 p-1">
                      {allValidationErrors.map((taskError, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-sm font-medium">
                            Step {taskError.step}: {taskError.label}
                          </p>
                          <ul className="list-disc list-inside">
                            {taskError.errors.map((error, errorIndex) => (
                              <li key={errorIndex} className="text-xs text-gray-100">
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
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button 
              size="sm" 
              onClick={onPublish}
              disabled={hasErrors}
              className={hasErrors ? "cursor-not-allowed" : ""}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
