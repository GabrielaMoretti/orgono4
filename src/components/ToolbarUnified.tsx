import React from "react";
import { Collaborator, Project, Team } from "../types";

interface ToolbarUnifiedProps {
  onAddElement: (type: string, position?: { x: number; y: number }, data?: any) => void;
  collaborators: Collaborator[];
  projects: Project[];
  teams: Team[];
}

export function ToolbarUnified({ onAddElement, collaborators, projects, teams }: ToolbarUnifiedProps) {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg text-gray-800">Elementos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Clique para adicionar
        </p>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <button
          className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium"
          onClick={() => onAddElement('rectangle')}
        >
          Retângulo
        </button>
        
        <button
          className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium"
          onClick={() => onAddElement('circle')}
        >
          Círculo
        </button>
        
        <button
          className="w-full px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg font-medium"
          onClick={() => onAddElement('note')}
        >
          Nota
        </button>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Colaboradores</h3>
          {collaborators.slice(0, 3).map(collaborator => (
            <button
              key={collaborator.id}
              className="w-full mb-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-sm"
              onClick={() => onAddElement('collaborator', undefined, collaborator)}
            >
              {collaborator.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default ToolbarUnified;
