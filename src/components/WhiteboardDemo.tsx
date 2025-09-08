import React from "react";
import WhiteboardUnified from "./WhiteboardUnified";
import { WorkspaceProvider } from "../state/WorkspaceContext";

export function WhiteboardDemo() {
  return (
    <WorkspaceProvider>
      <div className="h-screen">
        <WhiteboardUnified standalone={true} />
      </div>
    </WorkspaceProvider>
  );
}

export default WhiteboardDemo;
