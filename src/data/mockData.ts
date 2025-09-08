import { Collaborator, Project, Team, Whiteboard } from "../types";

export const collaborators: Collaborator[] = [
  { 
    id: "col1", 
    name: "Joana Souza", 
    role: "Analista",
    superior: undefined,
    subordinados: [],
    projects: ["proj1"]
  },
  { 
    id: "col2", 
    name: "Carlos Silva", 
    role: "Dev",
    superior: "col1",
    subordinados: [],
    projects: ["proj1", "proj2"]
  },
];

export const projects: Project[] = [
  { 
    id: "proj1", 
    name: "Projeto X", 
    status: "Ativo",
    link: "https://projeto-x.com",
    collaborators: ["col1", "col2"]
  },
  { 
    id: "proj2", 
    name: "Projeto Y", 
    status: "Concluído",
    link: "https://projeto-y.com",
    collaborators: ["col2"]
  },
];

export const teams: Team[] = [
  { 
    id: "team1", 
    name: "Equipe Alpha",
    members: ["col1", "col2"]
  },
  { 
    id: "team2", 
    name: "Equipe Beta",
    members: []
  },
];

export const whiteboards: Whiteboard[] = [
  { 
    id: "wb1", 
    name: "Organograma RH",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    nodes: [],
    edges: []
  },
  { 
    id: "wb2", 
    name: "Estrutura Projetos",
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    nodes: [],
    edges: []
  },
];