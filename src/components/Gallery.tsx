import React, { useState } from "react";
import { useWorkspace } from "../state/WorkspaceContext";
import { collaborators, projects, teams } from "../data/mockData";
import { CollaboratorCard } from "./cards/CollaboratorCard";
import { ProjectCard } from "./cards/ProjectCard";
import { TeamCard } from "./cards/TeamCard";
import { ProfileOverlay } from "./ProfileOverlay";

type CardType = "colaborador" | "projeto" | "equipe";

export function Gallery() {
  const { selectedSection } = useWorkspace();
  const [profile, setProfile] = useState<{ id: string; type: CardType | null }>({ id: "", type: null });

  let items: any[] = [];
  let Card: React.ComponentType<any> | null = null;
  let cardType: CardType | null = null;

  if (selectedSection === "Colaboradores") {
    items = collaborators;
    Card = CollaboratorCard;
    cardType = "colaborador";
  } else if (selectedSection === "Projetos") {
    items = projects;
    Card = ProjectCard;
    cardType = "projeto";
  } else if (selectedSection === "Equipes") {
    items = teams;
    Card = TeamCard;
    cardType = "equipe";
  } else {
    return null;
  }

  // Handler para abrir overlay
  const handleCardClick = (item: any) => {
    if (cardType === "colaborador" || cardType === "projeto") {
      setProfile({ id: item.id, type: cardType });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{selectedSection}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition hover:shadow-lg text-left bg-transparent border-0 p-0"
            aria-label={`Ver detalhes de ${item.nome || item.name || "item"}`}
            tabIndex={0}
            type="button"
          >
            <Card {...item} />
          </button>
        ))}
      </div>
      {(profile.type === "colaborador" || profile.type === "projeto") && (
        <ProfileOverlay
          entityId={profile.id}
          entityType={profile.type}
          onClose={() => setProfile({ id: "", type: null })}
        />
      )}
    </div>
  );
}