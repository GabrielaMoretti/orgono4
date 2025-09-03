import React from "react";
import { whiteboards } from "../data/mockData";
import { LayoutDashboard } from "lucide-react";

export function WhiteboardGallery({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Whiteboards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {whiteboards.map(wb => (
          <button
            key={wb.id}
            className="bg-white p-6 rounded shadow flex flex-col items-center border hover:bg-blue-50 transition"
            onClick={() => onSelect(wb.id)}
          >
            <LayoutDashboard className="text-blue-400 mb-2" size={36} />
            <span className="font-semibold">{wb.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}