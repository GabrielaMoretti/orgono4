import React from "react";
import { Users } from "lucide-react";

export function TeamCard({ name }: { name: string }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-3 border hover:bg-blue-50 transition">
      <Users className="text-pink-500" size={28} />
      <div>
        <div className="font-semibold">{name}</div>
      </div>
    </div>
  );
}