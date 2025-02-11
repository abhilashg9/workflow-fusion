
import { GlobalHeader } from "@/components/GlobalHeader";
import { WorkflowHeader } from "@/components/WorkflowHeader";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";

const Index = () => {
  return (
    <div className="flex flex-col h-screen animate-fade-in">
      <GlobalHeader />
      <WorkflowHeader />
      <WorkflowCanvas />
    </div>
  );
};

export default Index;
