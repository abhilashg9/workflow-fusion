
import React from 'react';
import { Split } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { TaskNodeData } from '../workflow/types';

interface ConditionCardProps {
  data: TaskNodeData;
  id: string;
}

const ConditionCard = ({ data, id }: ConditionCardProps) => {
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
            <Split className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>
        {data.conditions?.some(c => c.id === 'default') && (
          <Badge variant="secondary" className="text-xs">
            Default
          </Badge>
        )}
      </div>

      {data.conditions && data.conditions.length > 0 && (
        <div className="mt-3 space-y-2">
          {data.conditions.map((condition) => (
            <div 
              key={condition.id}
              className="text-xs p-2 bg-gray-50 rounded border border-gray-100"
            >
              {condition.name}
            </div>
          ))}
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

export default ConditionCard;
