import React from "react";

interface TopbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onShare?: () => void;
  projectName?: string;
}

export function Topbar({ onUndo, onRedo, onShare, projectName }: TopbarProps) {
  return (
    <header className="topbar h-14 bg-gradient-to-r from-teal-400 to-purple-500 flex items-center px-6 shadow text-white fixed w-full z-10">
      <span className="font-bold text-lg flex-1">{projectName || "Whiteboard"}</span>
      <button className="mx-2" onClick={onUndo} title="Desfazer">↩️</button>
      <button className="mx-2" onClick={onRedo} title="Refazer">↪️</button>
      <button className="mx-2" onClick={onShare} title="Compartilhar">🔗</button>
      {/* Adicione mais ações conforme desejar */}
    </header>
  );
}
