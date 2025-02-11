
import { useState } from "react";
import { PlusCircle, ChevronDown, Eye, Pencil, Trash2, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Notification, TaskAction, AssignmentConfig } from "./types";

interface TaskCardNotificationsProps {
  actions: TaskAction[];
  assignment: AssignmentConfig;
  notifications: Notification[];
  onNotificationAdd: (notification: Notification) => void;
  onNotificationDelete: (notificationId: string) => void;
  onNotificationEdit: (notification: Notification) => void;
}

export const TaskCardNotifications = ({
  actions,
  assignment,
  notifications,
  onNotificationAdd,
  onNotificationDelete,
  onNotificationEdit,
}: TaskCardNotificationsProps) => {
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({});
  const [isAdding, setIsAdding] = useState(false);

  const getRecipientOptions = () => {
    const recipients: string[] = [];
    if (assignment.type === "users" && assignment.users) {
      recipients.push(...assignment.users);
    } else if (assignment.type === "dynamic_users" && assignment.dynamicUsers) {
      recipients.push(...assignment.dynamicUsers);
    } else if (assignment.type === "roles" && assignment.roles) {
      recipients.push(...assignment.roles);
    }
    return recipients;
  };

  const handleAddNotification = () => {
    if (newNotification.title && newNotification.recipients && newNotification.actionType) {
      onNotificationAdd({
        id: Math.random().toString(36).substr(2, 9),
        title: newNotification.title,
        recipients: newNotification.recipients,
        actionType: newNotification.actionType,
        status: "success",
      });
      setNewNotification({});
      setIsAdding(false);
    }
  };

  const enabledActions = actions.filter(action => action.enabled);
  const recipientOptions = getRecipientOptions();

  return (
    <div className="space-y-4">
      {enabledActions.map(action => (
        <Collapsible key={action.action} className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Notification on: <span className="font-medium">{action.label}</span></span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-3">
              {notifications
                .filter(n => n.actionType === action.action)
                .map(notification => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="w-3.5 h-3.5" />
                          {notification.recipients.map((recipient, index) => (
                            <span key={recipient} className="text-gray-600">
                              {recipient}
                              {index < notification.recipients.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onNotificationDelete(notification.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              
              {isAdding ? (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
                  <Input
                    placeholder="Notification title"
                    value={newNotification.title || ""}
                    onChange={e => setNewNotification({ ...newNotification, title: e.target.value })}
                    className="border-gray-200"
                  />
                  <Select
                    value={newNotification.actionType}
                    onValueChange={value =>
                      setNewNotification({ ...newNotification, actionType: value })
                    }
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipientOptions.map(recipient => (
                        <SelectItem key={recipient} value={recipient}>
                          {recipient}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAdding(false)}
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddNotification}
                      className="text-sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full border border-dashed border-gray-200 text-primary hover:text-primary/90 hover:bg-primary/5"
                  onClick={() => setIsAdding(true)}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Notification
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};
