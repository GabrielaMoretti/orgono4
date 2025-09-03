import React from "react";
import { FolderKanban } from "lucide-react";

export function ProjectCard({ name, status }: { name: string; status: string }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-3 border hover:bg-blue-50 transition">
      <FolderKanban className="text-green-500" size={28} />
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-500">{status}</div>
      </div>
    </div>
  );
}