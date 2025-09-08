export type Section = "Colaboradores" | "Projetos" | "Equipes" | "Whiteboards";
export type ProfileType = "colaborador" | "projeto" | "equipe";

export interface BaseEntity {
  id: string;
  name: string;
}

export interface Collaborator extends BaseEntity {
  role: string;
  superior?: string;
  subordinados: string[];
  projects: string[];
}

export interface Project extends BaseEntity {
  link: string;
  collaborators: string[];
  status?: string;
}

export interface Team extends BaseEntity {
  members?: string[];
}

export interface Whiteboard extends BaseEntity {
  createdAt: Date;
  updatedAt: Date;
  nodes?: any[];
  edges?: any[];
}

export interface ProfileState {
  id: string;
  type: ProfileType | null;
}
