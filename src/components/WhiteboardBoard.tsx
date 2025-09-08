import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  ConnectionMode,
  Panel
} from "reactflow";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Constantes do whiteboard
const ZOOM_STEP = 0.2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

const exampleNodes: Node[] = [
  { id: '1', data: { label: 'Diretora RH' }, position: { x: 100, y: 50 }, type: 'input' },
  { id: '2', data: { label: 'Equipe Alpha' }, position: { x: 50, y: 200 } },
  { id: '3', data: { label: 'Equipe Beta' }, position: { x: 250, y: 200 } },
];

const exampleEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

// Configurações padrão do ReactFlow
const defaultViewport = { x: 0, y: 0, zoom: 1 };

interface WhiteboardBoardProps {
  whiteboardId: string;
  onBack: () => void;
  isLoading?: boolean;
  error?: Error | null;
  nodes?: Node[];
  edges?: Edge[];
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
}

export default function WhiteboardBoard({
  whiteboardId,
  onBack,
  isLoading = false,
  error = null,
  nodes = exampleNodes,
  edges = exampleEdges,
  nodeTypes,
  edgeTypes
}: WhiteboardBoardProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleFitView = useCallback(() => {
    setZoom(1);
  }, []);

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded">
        <h3 className="font-bold mb-2">Erro ao carregar o whiteboard</h3>
        <p>{error.message}</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:underline"
        >
          Voltar para galeria
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-2"
          aria-label="Voltar para galeria"
          title="Voltar para galeria"
          type="button"
        >
          <ArrowLeft size={18} /> Voltar para galeria
        </button>
      </div>

      <div className="relative h-[70vh] bg-white rounded shadow border overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={defaultViewport}
            zoom={zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            connectionMode={ConnectionMode.Loose}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
            <Panel position="top-right" className="bg-white p-2 rounded shadow-md">
              <div className="flex gap-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Aumentar zoom"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Diminuir zoom"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleFitView}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Ajustar à tela"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </Panel>
          </ReactFlow>
        )}
      </div>
    </div>
  );
}