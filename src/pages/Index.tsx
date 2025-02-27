
import { GlobalHeader } from "@/components/GlobalHeader";
import { WorkflowHeader } from "@/components/WorkflowHeader";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";
import { ReactFlowProvider } from "@xyflow/react";

const Index = () => {
  return (
    <div className="flex flex-col h-screen animate-fade-in">
      <GlobalHeader />
      <ReactFlowProvider>
        <div className="flex-1 flex flex-col">
          <WorkflowHeader />
          <WorkflowCanvas />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default Index;
