import React from "react";
import { useWorkspace } from "../state/WorkspaceContext";
import { Users, FolderKanban, Users2, LayoutDashboard } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Colaboradores: <Users2 size={18} />,
  Projetos: <FolderKanban size={18} />,
  Equipes: <Users size={18} />,
  Whiteboards: <LayoutDashboard size={18} />,
};

export function Sidebar() {
  const { selectedSection, setSelectedSection, sections } = useWorkspace();

  return (
    <aside className="w-48 bg-white border-r shadow-sm flex flex-col py-4">
      <h2 className="px-6 pb-4 text-lg font-bold text-blue-700">Workspace</h2>
      <nav className="flex-1 flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section}
            className={`flex items-center gap-3 px-6 py-2 rounded-l-full text-base transition
              ${section === selectedSection ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-blue-50 text-gray-700"}
            `}
            onClick={() => setSelectedSection(section)}
          >
            {iconMap[section]}
            {section}
          </button>
        ))}
      </nav>
    </aside>
  );
}