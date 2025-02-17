
import { FilePlus2, UserCheck, Workflow, GitBranch, ArrowRightLeft } from "lucide-react";
import { TaskType } from "./types";

export const VERTICAL_SPACING = 250;
export const START_Y = 150;
export const CENTER_X = 250;

export const TASK_TYPES = [
  {
    icon: FilePlus2,
    title: "Create Task",
    subtitle: "Add a create task and assign creators",
    type: "create" as TaskType,
  },
  {
    icon: UserCheck,
    title: "Approval Task",
    subtitle: "Add an approval task and configure",
    type: "approval" as TaskType,
  },
  {
    icon: Workflow,
    title: "Integration Task",
    subtitle: "Add an integration task and configure the APIs",
    type: "integration" as TaskType,
  },
  {
    icon: GitBranch,
    title: "Split Branch",
    subtitle: "Split the workflow into branches with conditions",
    type: "split" as TaskType,
  },
];

export const INITIAL_NODES = [
  {
    id: "start",
    type: "input",
    position: { x: CENTER_X - 50, y: START_Y },
    data: { 
      label: "Start",
      type: undefined
    },
    style: {
      background: "#3388eb",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      minWidth: "100px",
      textAlign: "center",
    },
  },
  {
    id: "end",
    type: "output",
    position: { x: CENTER_X - 50, y: START_Y + VERTICAL_SPACING },
    data: { 
      label: "End",
      type: undefined
    },
    style: {
      background: "#0EA5E9",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      minWidth: "100px",
      textAlign: "center",
    },
  },
];

export const INITIAL_EDGES = [
  {
    id: "start-end",
    source: "start",
    target: "end",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#3388eb" },
    markerEnd: {
      type: "arrowclosed",
      color: "#3388eb",
    },
    label: "+",
    labelStyle: { 
      fill: "#ffffff",
      fontWeight: "bold",
      fontSize: "16px",
      opacity: 0,
    },
    labelBgStyle: { 
      fill: "#3388eb",
      opacity: 0,
      borderRadius: "12px",
      width: "24px",
      height: "24px",
    },
    className: "workflow-edge",
  },
];
