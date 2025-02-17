
import { GlobalHeader } from "@/components/GlobalHeader";
import { WorkflowHeader } from "@/components/WorkflowHeader";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";
import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";

const Index = () => {
  const [title, setTitle] = useState("Untitled Workflow");

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      <GlobalHeader />
      <ReactFlowProvider>
        <WorkflowHeader 
          title={title}
          onTitleChange={setTitle}
          onClose={() => console.log("close")}
          onPublish={() => console.log("publish")}
        />
        <WorkflowCanvas />
      </ReactFlowProvider>
    </div>
  );
};

export default Index;
