import React, { createContext, useContext, useState } from "react";

const sections = [
  "Colaboradores",
  "Projetos",
  "Equipes",
  "Whiteboards",
] as const;
type Section = typeof sections[number];

export interface Collaborator {
  id: string;
  nome: string;
  cargo: string;
  superior?: string;
  subordinados: string[];
  projetos: string[];
}

interface Project {
  id: string;
  nome: string;
  link: string;
  colaboradores: string[];
}

type WorkspaceContextType = {
  selectedSection: Section;
  setSelectedSection: (s: Section) => void;
  sections: Section[];
  colaboradores: Collaborator[];
  setColaboradores: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  projetos: Project[];
  setProjetos: React.Dispatch<React.SetStateAction<Project[]>>;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedSection, setSelectedSection] = useState<Section>("Colaboradores");
  const [colaboradores, setColaboradores] = useState<Collaborator[]>([]);
  const [projetos, setProjetos] = useState<Project[]>([]);

  return (
    <WorkspaceContext.Provider value={{ selectedSection, setSelectedSection, sections: [...sections], colaboradores, setColaboradores, projetos, setProjetos }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}