import React, { createContext, useContext, useState } from "react";

const sections = [
  "Colaboradores",
  "Projetos",
  "Equipes",
  "Whiteboards",
] as const;
type Section = typeof sections[number];

type WorkspaceContextType = {
  selectedSection: Section;
  setSelectedSection: (s: Section) => void;
  sections: Section[];
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedSection, setSelectedSection] = useState<Section>("Colaboradores");

  return (
    <WorkspaceContext.Provider value={{ selectedSection, setSelectedSection, sections }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}