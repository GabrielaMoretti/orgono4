import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Gallery } from "./components/Gallery";
import { WhiteboardBoard } from "./components/WhiteboardBoard";
import { WhiteboardGallery } from "./components/WhiteboardGallery";
import { useWorkspace } from "./state/WorkspaceContext";

export default function App() {
  const { selectedSection } = useWorkspace();
  const [selectedWhiteboardId, setSelectedWhiteboardId] = useState<string | null>(null);

  let content;
  if (selectedSection === "Whiteboards") {
    if (selectedWhiteboardId) {
      content = (
        <WhiteboardBoard
          whiteboardId={selectedWhiteboardId}
          onBack={() => setSelectedWhiteboardId(null)}
        />
      );
    } else {
      content = (
        <WhiteboardGallery onSelect={setSelectedWhiteboardId} />
      );
    }
  } else {
    content = <Gallery />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">{content}</main>
    </div>
  );
}