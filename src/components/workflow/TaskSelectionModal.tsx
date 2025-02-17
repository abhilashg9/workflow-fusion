
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { taskTypes } from "./constants";
import { TaskType } from "./types";

interface TaskOptionProps {
  icon: any;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const TaskOption = ({ icon: Icon, title, subtitle, onClick }: TaskOptionProps) => (
  <div 
    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
    onClick={onClick}
  >
    <div className="p-2 rounded-lg bg-primary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

interface TaskSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSelect: (type: TaskType) => void;
}

export const TaskSelectionModal = ({ isOpen, onClose, onTaskSelect }: TaskSelectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Select task to add</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {taskTypes.map((task, index) => (
            <TaskOption
              key={index}
              icon={task.icon}
              title={task.title}
              subtitle={task.subtitle}
              onClick={() => {
                if (task.type === "create" || task.type === "approval" || task.type === "integration") {
                  onTaskSelect(task.type);
                }
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
