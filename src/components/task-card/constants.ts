
export const ROLES_OPTIONS = ["Finance Manager", "Procurement Manager", "IT Manager", "HR Manager"];
export const FILTERS_OPTIONS = ["Dimension 1", "Dimension 2", "Dimension 3", "Dimension 4"];
export const USERS_OPTIONS = ["John Doe", "Jane Smith", "Alex Johnson", "Sarah Wilson"];
export const DYNAMIC_USERS_OPTIONS = ["PR Owner", "PO Owner", "GRN Owner", "Invoice Owner", "Creator", "Next Assignee(s)", "Approvers"];

export const DEFAULT_ACTIONS = [
  { 
    action: "approve", 
    label: "Accept", 
    enabled: true,
    defaultNotification: {
      title: "Approval Notification",
      recipients: ["Approvers", "Creator"]
    }
  },
  { 
    action: "reject", 
    label: "Reject", 
    enabled: true,
    defaultNotification: {
      title: "Rejection Notification",
      recipients: ["Creator", "Next Assignee(s)"]
    }
  },
  { 
    action: "cancel", 
    label: "Close", 
    enabled: true,
    defaultNotification: {
      title: "Cancellation Notification",
      recipients: ["Creator", "Approvers"]
    }
  },
  { 
    action: "edit", 
    label: "Modify", 
    enabled: false,
    defaultNotification: {
      title: "Modification Notification",
      recipients: ["Approvers"]
    }
  },
  { 
    action: "delegate", 
    label: "Assign to", 
    enabled: false,
    defaultNotification: {
      title: "Delegation Notification",
      recipients: ["Next Assignee(s)"]
    }
  },
  { 
    action: "sendBack", 
    label: "Send Back", 
    enabled: true,
    defaultNotification: {
      title: "Send Back Notification",
      recipients: ["Creator", "Approvers"]
    },
    sendBack: {
      step: ""
    }
  }
];
