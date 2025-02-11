
import { useState } from "react";
import { PlusCircle, ChevronDown, Eye, Pencil, Trash2 } from "lucide-react";
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
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              <span>Notification on: {action.label}</span>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              {notifications
                .filter(n => n.actionType === action.action)
                .map(notification => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>To:</span>
                        {notification.recipients.map((recipient, index) => (
                          <span key={recipient}>
                            {recipient}
                            {index < notification.recipients.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onNotificationDelete(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              
              {isAdding ? (
                <div className="space-y-4 p-4 border rounded-lg">
                  <Input
                    placeholder="Notification title"
                    value={newNotification.title || ""}
                    onChange={e => setNewNotification({ ...newNotification, title: e.target.value })}
                  />
                  <Select
                    value={newNotification.actionType}
                    onValueChange={value =>
                      setNewNotification({ ...newNotification, actionType: value })
                    }
                  >
                    <SelectTrigger>
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
                    <Button variant="outline" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddNotification}>Add</Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
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
