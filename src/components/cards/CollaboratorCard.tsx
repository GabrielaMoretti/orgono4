import React from "react";
import { User } from "lucide-react";

export function CollaboratorCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-3 border hover:bg-blue-50 transition">
      <User className="text-blue-500" size={28} />
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
  );
}