
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Code2, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskNodeData } from '../workflow/types';

interface TaskCardProps {
  data: TaskNodeData;
  id: string;
}

const TaskCard = ({ data, id }: TaskCardProps) => {
  const getIcon = () => {
    switch (data.type) {
      case 'create':
        return FileText;
      case 'integration':
        return Code2;
      case 'approval':
        return UserCheck;
      default:
        return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-[250px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-300 !w-3 !h-1.5"
      />
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>
        <span className="text-xs text-gray-500">Step {data.sequenceNumber}</span>
      </div>

      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {data.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {data.onDelete && (
        <div className="mt-4 text-right">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => data.onDelete?.(id)}
          >
            Delete
          </Button>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-300 !w-3 !h-1.5"
      />
    </div>
  );
};

export default TaskCard;
