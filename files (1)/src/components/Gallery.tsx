import React from "react";
import { useWorkspace } from "../state/WorkspaceContext";
import { collaborators, projects, teams } from "../data/mockData";
import { CollaboratorCard } from "./cards/CollaboratorCard";
import { ProjectCard } from "./cards/ProjectCard";
import { TeamCard } from "./cards/TeamCard";

export function Gallery() {
  const { selectedSection } = useWorkspace();

  let items: any[] = [];
  let Card: any = null;

  if (selectedSection === "Colaboradores") {
    items = collaborators;
    Card = CollaboratorCard;
  } else if (selectedSection === "Projetos") {
    items = projects;
    Card = ProjectCard;
  } else if (selectedSection === "Equipes") {
    items = teams;
    Card = TeamCard;
  } else {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{selectedSection}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}