
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Code2 } from 'lucide-react';

const JunctionNode = () => {
  return (
    <div className="bg-primary rounded-lg w-12 h-12 flex items-center justify-center">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-300 !w-3 !h-1.5"
      />
      <Code2 className="w-6 h-6 text-white" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-300 !w-3 !h-1.5"
      />
    </div>
  );
};

export default JunctionNode;
