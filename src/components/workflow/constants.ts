
import { TaskType } from "./types";
import { FilePlus2, UserCheck, Workflow, GitBranch, ArrowRightLeft } from "lucide-react";

export const VERTICAL_SPACING = 250;
export const CENTER_X = 250;

export const taskTypes = [
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
    type: "split" as const,
  },
  {
    icon: ArrowRightLeft,
    title: "Parallel Branch",
    subtitle: "Add tasks in parallel that will occur simultaneously",
    type: "parallel" as const,
  },
];

export const initialNodes = [
  {
    id: "start",
    type: "input",
    position: { x: CENTER_X, y: 150 },
    data: { label: "Start" },
    style: {
      background: "#8B5CF6",
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
    position: { x: CENTER_X, y: 400 },
    data: { label: "End" },
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

export const defaultEdgeOptions = {
  type: "smoothstep",
  style: { stroke: "#2563EB" },
  markerEnd: {
    type: "arrowclosed" as const,
    color: "#2563EB",
  },
};
