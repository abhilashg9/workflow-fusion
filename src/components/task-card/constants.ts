
export const ROLES_OPTIONS = ["Finance Manager", "Procurement Manager", "IT Manager", "HR Manager"];
export const USERS_OPTIONS = ["John Doe", "Jane Smith", "Alex Johnson", "Sarah Wilson"];

export const DEFAULT_ACTIONS = [
  { action: "approve", label: "Accept", enabled: true },
  { action: "reject", label: "Reject", enabled: true },
  { action: "cancel", label: "Close", enabled: true },
  { action: "edit", label: "Modify", enabled: false },
  { action: "delegate", label: "Assign to", enabled: false },
  { 
    action: "sendBack", 
    label: "Send Back", 
    enabled: true,
    sendBack: {
      step: ""
    }
  }
];
