
import { LucideIcon } from "lucide-react";

interface TaskOptionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
}

export const TaskOption = ({ icon: Icon, title, subtitle, onClick, disabled }: TaskOptionProps) => (
  <div 
    className={`flex items-start space-x-4 p-4 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'} transition-colors`}
    onClick={() => !disabled && onClick()}
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
