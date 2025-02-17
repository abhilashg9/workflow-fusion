
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskOption } from "./TaskOption";
import { TASK_TYPES } from "./constants";
import { Node } from "@xyflow/react";
import { TaskNodeData, TaskType } from "./types";

interface TaskSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskSelect: (type: TaskType) => void;
  nodes: Node<TaskNodeData>[];
  selectedEdgeSourceId: string | null;
}

export const TaskSelectionDialog = ({
  isOpen,
  onOpenChange,
  onTaskSelect,
  nodes,
  selectedEdgeSourceId,
}: TaskSelectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Select task to add</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {TASK_TYPES.map((task, index) => {
            const sourceNode = selectedEdgeSourceId ? nodes.find(n => n.id === selectedEdgeSourceId) : null;
            const isSelectedNodeStart = sourceNode?.id === "start";
            const hasExistingCreateTask = nodes.some(
              node => node.type === "taskCard" && node.data.type === "create"
            );

            const isDisabled = (task.type === "create" && !isSelectedNodeStart) ||
                             (!isSelectedNodeStart && task.type !== "create" && !hasExistingCreateTask);

            return (
              <TaskOption
                key={index}
                icon={task.icon}
                title={task.title}
                subtitle={task.subtitle}
                onClick={() => onTaskSelect(task.type)}
                disabled={isDisabled}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
