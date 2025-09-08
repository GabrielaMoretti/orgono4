import React, { useState } from "react";

interface ProfileOverlayProps {
  entityId: string;
  entityType: "colaborador" | "projeto";
  onClose: () => void;
}

// Mock de dados para exemplo
const mockData = {
  colaborador: {
    "col1": { 
      name: "Joana Souza", 
      role: "Analista", 
      email: "joana@empresa.com",
      phone: "(11) 99999-9999", 
      projects: ["proj1"]
    },
    "col2": { 
      name: "Carlos Silva", 
      role: "Dev", 
      email: "carlos@empresa.com",
      phone: "(11) 88888-8888", 
      projects: ["proj1", "proj2"]
    },
  },
  projeto: {
    "proj1": { 
      name: "Projeto X", 
      description: "Sistema de gestão de RH",
      status: "Ativo", 
      startDate: "2024-01-01",
      collaborators: ["col1", "col2"]
    },
    "proj2": { 
      name: "Projeto Y", 
      description: "Aplicativo mobile",
      status: "Concluído", 
      startDate: "2023-06-01",
      collaborators: ["col2"]
    },
  }
};

export const ProfileOverlay: React.FC<ProfileOverlayProps> = ({ entityId, entityType, onClose }) => {
  const [tab, setTab] = useState("geral");

  const data = (mockData as any)[entityType]?.[entityId];

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Erro</h2>
          <p>Dados não encontrados para este item.</p>
          <button 
            onClick={onClose}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {entityType === "colaborador" ? "Colaborador" : "Projeto"}: {data.name}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b mb-4">
          <nav className="flex space-x-8">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                tab === "geral" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTab("geral")}
            >
              Informações Gerais
            </button>
          </nav>
        </div>

        {/* Conteúdo */}
        <div className="space-y-4">
          {entityType === "colaborador" && (
            <>
              <div><strong>Cargo:</strong> {data.role}</div>
              <div><strong>Email:</strong> {data.email || '-'}</div>
              <div><strong>Telefone:</strong> {data.phone || '-'}</div>
              <div><strong>Projetos:</strong> {data.projects?.join(', ') || 'Nenhum'}</div>
            </>
          )}

          {entityType === "projeto" && (
            <>
              <div><strong>Descrição:</strong> {data.description}</div>
              <div><strong>Status:</strong> {data.status}</div>
              <div><strong>Data de Início:</strong> {data.startDate}</div>
              <div><strong>Colaboradores:</strong> {data.collaborators?.join(', ') || 'Nenhum'}</div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
