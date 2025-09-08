import { useWorkspace } from "./state/WorkspaceContext";
import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Gallery } from "./components/Gallery";
import CollaboratorPanel from "./components/CollaboratorPanel";
import ProjectPanel from "./components/ProjectPanel";
import WhiteboardBoard from "./components/WhiteboardBoard";
import Whiteboard from "./components/Whiteboard";
import { WhiteboardGallery } from "./components/WhiteboardGallery";

export default function App() {
  const { selectedSection, colaboradores } = useWorkspace();
  const [selectedWhiteboardId, setSelectedWhiteboardId] = useState<string | null>(null);

  let content;
  if (selectedSection === "Whiteboards") {
    // Para testar o novo whiteboard moderno, mostre sempre o novo componente
    content = <Whiteboard />;
  } else if (selectedSection === "Colaboradores") {
    content = <CollaboratorPanel />;
  } else if (selectedSection === "Projetos") {
  content = <ProjectPanel />;
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