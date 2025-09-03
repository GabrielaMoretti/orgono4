import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import { ArrowLeft } from "lucide-react";

const exampleNodes = [
  { id: '1', data: { label: 'Diretora RH' }, position: { x: 100, y: 50 }, type: 'input' },
  { id: '2', data: { label: 'Equipe Alpha' }, position: { x: 50, y: 200 } },
  { id: '3', data: { label: 'Equipe Beta' }, position: { x: 250, y: 200 } },
];
const exampleEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

export function WhiteboardBoard({ whiteboardId, onBack }: { whiteboardId: string, onBack: () => void }) {
  // Por hora, sempre mostra exemplo. Depois, carregar por id.
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 mb-4 text-blue-600 hover:underline">
        <ArrowLeft size={18} /> Voltar para galeria
      </button>
      <div className="h-[70vh] bg-white rounded shadow border">
        <ReactFlow nodes={exampleNodes} edges={exampleEdges} fitView>
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={18} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}