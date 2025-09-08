import React from "react";

export interface WhiteboardElement {
  id: string;
  type: string;
  x: number;
  y: number;
  text?: string;
  color?: string;
}

interface WhiteboardAreaProps {
  elements: WhiteboardElement[];
  onSelectElement?: (id: string) => void;
  onDropElement?: (type: string, x: number, y: number) => void;
}

export function WhiteboardArea({ elements, onSelectElement, onDropElement }: WhiteboardAreaProps) {
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const type = e.dataTransfer.getData('element-type');
    if (type && onDropElement) {
      // Pega posição relativa ao whiteboard
      const rect = (e.target as HTMLDivElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDropElement(type, x, y);
    }
  }
  return (
    <div
      className="whiteboard-area flex-1 relative bg-white overflow-hidden"
      style={{ minHeight: 600 }}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Grid pontilhado */}
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)", backgroundSize: "20px 20px", zIndex: 0}} />
      {/* Renderização dos elementos */}
      {elements.map(el => (
        <div
          key={el.id}
          className="absolute cursor-pointer select-none"
          style={{ left: el.x, top: el.y, zIndex: 1 }}
          onClick={() => onSelectElement?.(el.id)}
        >
          {el.type === "rectangle" && (
            <div className="w-24 h-16 bg-blue-200 border-2 border-blue-400 rounded" />
          )}
          {el.type === "circle" && (
            <div className="w-16 h-16 bg-yellow-200 border-2 border-yellow-400 rounded-full" />
          )}
          {el.type === "note" && (
            <div className="w-28 h-20 bg-yellow-100 border-2 border-yellow-300 rounded p-2 text-xs flex items-center justify-center">{el.text || "Nota"}</div>
          )}
          {el.type === "sticker" && (
            <div className="w-16 h-16 bg-pink-200 border-2 border-pink-400 rounded-full flex items-center justify-center text-2xl">🌟</div>
          )}
          {/* Outros tipos... */}
        </div>
      ))}
    </div>
  );
}
