import React, { useState, useCallback, useEffect, useMemo } from "react";
import ReactFlow, { 
  Node, 
  Edge, 
  addEdge, 
  Connection, 
  ReactFlowInstance, 
  applyNodeChanges, 
  applyEdgeChanges, 
  NodeChange, 
  EdgeChange,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider
} from "reactflow";
import { ArrowLeft, Save, Download, Upload } from "lucide-react";
import EditableNode from "./EditableNode";
import ToolbarUnified from "./ToolbarUnified";
import { useWorkspace } from "../state/WorkspaceContext";
import { LoadingSpinner } from "./LoadingSpinner";
import "reactflow/dist/style.css";

type WhiteboardUnifiedProps = {
  whiteboardId?: string;
  onBack?: () => void;
  standalone?: boolean;
};

export default function WhiteboardUnified({ 
  whiteboardId, 
  onBack, 
  standalone = false 
}: WhiteboardUnifiedProps) {
  // Context data
  const { whiteboards, setWhiteboards, collaborators, projects, teams } = useWorkspace();
  
  // Local state
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Current whiteboard data
  const currentWhiteboard = useMemo(() => {
    if (!whiteboardId) return null;
    return whiteboards.find(wb => wb.id === whiteboardId) || null;
  }, [whiteboards, whiteboardId]);

  // Load whiteboard data
  useEffect(() => {
    if (whiteboardId && currentWhiteboard) {
      // Load existing whiteboard
      setNodes(currentWhiteboard.nodes || []);
      setEdges(currentWhiteboard.edges || []);
    } else if (!whiteboardId || standalone) {
      // Default/demo nodes for standalone mode
      const demoNodes: Node[] = [
        { 
          id: 'demo-1', 
          data: { 
            label: 'Diretora RH',
            color: '#3b82f6',
            border: '2px solid #1e40af',
            width: 160,
            height: 56
          }, 
          position: { x: 200, y: 50 }, 
          type: 'editable' 
        },
        { 
          id: 'demo-2', 
          data: { 
            label: 'Equipe Alpha',
            color: '#22c55e',
            border: '2px solid #16a34a',
            width: 140,
            height: 50
          }, 
          position: { x: 100, y: 200 }, 
          type: 'editable' 
        },
        { 
          id: 'demo-3', 
          data: { 
            label: 'Equipe Beta',
            color: '#eab308',
            border: '2px solid #ca8a04',
            width: 140,
            height: 50
          }, 
          position: { x: 300, y: 200 }, 
          type: 'editable' 
        },
      ];
      
      const demoEdges: Edge[] = [
        { id: 'demo-e1-2', source: 'demo-1', target: 'demo-2', animated: true },
        { id: 'demo-e1-3', source: 'demo-1', target: 'demo-3', animated: true },
      ];
      
      setNodes(demoNodes);
      setEdges(demoEdges);
    }
    
    setIsLoading(false);
  }, [whiteboardId, currentWhiteboard, standalone]);

  // Node action callbacks (memoized to prevent re-renders)
  const nodeCallbacks = useMemo(() => ({
    onLabelChange: (id: string, newLabel: string) => {
      setNodes(nodes => nodes.map(n => 
        n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n
      ));
      setHasChanges(true);
    },
    
    onFormatChange: (id: string, field: string, value: any) => {
      setNodes(nodes => nodes.map(n => 
        n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n
      ));
      setHasChanges(true);
    },
    
    onResize: (id: string, width: number, height: number) => {
      setNodes(nodes => nodes.map(n => 
        n.id === id ? { ...n, data: { ...n.data, width, height } } : n
      ));
      setHasChanges(true);
    },
    
    onDuplicate: (id: string) => {
      setNodes(nodes => {
        const node = nodes.find(n => n.id === id);
        if (!node) return nodes;
        
        const newId = `${Date.now()}`;
        const offset = 40;
        
        return [...nodes, {
          ...node,
          id: newId,
          position: { 
            x: node.position.x + offset, 
            y: node.position.y + offset 
          },
          data: {
            ...node.data,
            label: `${node.data.label} (Cópia)`
          }
        }];
      });
      setHasChanges(true);
    },
    
    onDelete: (id: string) => {
      setNodes(nodes => nodes.filter(n => n.id !== id));
      setEdges(edges => edges.filter(e => e.source !== id && e.target !== id));
      setHasChanges(true);
    }
  }), []);

  // Add callbacks to nodes
  const nodesWithCallbacks = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        ...nodeCallbacks,
        onLabelChange: (label: string) => nodeCallbacks.onLabelChange(node.id, label),
        onFormatChange: (field: string, value: any) => nodeCallbacks.onFormatChange(node.id, field, value),
        onResize: (width: number, height: number) => nodeCallbacks.onResize(node.id, width, height),
        onDuplicate: () => nodeCallbacks.onDuplicate(node.id),
        onDelete: () => nodeCallbacks.onDelete(node.id),
      }
    }));
  }, [nodes, nodeCallbacks]);

  // ReactFlow callbacks
  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges(eds => addEdge(params, eds));
    setHasChanges(true);
  }, []);
  
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nodes => applyNodeChanges(changes, nodes));
    setHasChanges(true);
  }, []);
  
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(edges => applyEdgeChanges(changes, edges));
    setHasChanges(true);
  }, []);

  // Drag and drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!reactFlowInstance) return;
    
    const type = event.dataTransfer.getData('element-type');
    const entityData = event.dataTransfer.getData('entity-data');
    
    if (!type) return;
    
    const bounds = (event.target as HTMLDivElement).getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
    
    addElementToBoard(type, position, entityData ? JSON.parse(entityData) : undefined);
  }, [reactFlowInstance]);

  // Add element to board
  const addElementToBoard = useCallback((type: string, position?: { x: number; y: number }, data?: any) => {
    const id = `${Date.now()}`;
    const nodePosition = position || { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 };
    
    let nodeData: any = {
      width: 160,
      height: 56,
      border: '2px solid #cbd5e1',
      label: 'Novo Elemento'
    };

    // Configure based on type
    switch (type) {
      case 'collaborator':
        nodeData = {
          ...nodeData,
          label: data?.name || 'Novo Colaborador',
          subtitle: data?.role || 'Função',
          color: '#22c55e',
          border: '2px solid #16a34a',
          icon: 'person',
          width: 180,
          height: 70,
          entityType: 'collaborator',
          entityId: data?.id
        };
        break;
      
      case 'project':
        nodeData = {
          ...nodeData,
          label: data?.name || 'Novo Projeto',
          subtitle: data?.status || 'Status',
          color: '#a21caf',
          border: '2px solid #86198f',
          icon: 'folder',
          width: 170,
          height: 65,
          entityType: 'project',
          entityId: data?.id
        };
        break;
      
      case 'team':
        nodeData = {
          ...nodeData,
          label: data?.name || 'Nova Equipe',
          color: '#f59e0b',
          border: '2px solid #d97706',
          icon: 'team',
          width: 150,
          height: 60,
          entityType: 'team',
          entityId: data?.id
        };
        break;
      
      case 'rectangle':
        nodeData = {
          ...nodeData,
          label: 'Retângulo',
          color: '#3b82f6',
          border: '2px solid #1e40af'
        };
        break;
      
      case 'circle':
        nodeData = {
          ...nodeData,
          label: 'Círculo',
          color: '#22c55e',
          border: '2px solid #16a34a'
        };
        break;
      
      case 'note':
        nodeData = {
          ...nodeData,
          label: 'Nota',
          color: '#eab308',
          border: '2px solid #ca8a04',
          icon: 'note'
        };
        break;
    }
    
    const newNode: Node = {
      id,
      type: "editable",
      position: nodePosition,
      data: nodeData,
    };
    
    setNodes(nodes => [...nodes, newNode]);
    setHasChanges(true);
  }, []);

  // Save whiteboard
  const saveWhiteboard = useCallback(() => {
    if (!whiteboardId) return;
    
    setWhiteboards(prev => prev.map(wb => 
      wb.id === whiteboardId 
        ? { ...wb, nodes, edges, updatedAt: new Date() }
        : wb
    ));
    
    setHasChanges(false);
  }, [whiteboardId, nodes, edges, setWhiteboards]);

  // Export whiteboard
  const exportWhiteboard = useCallback(() => {
    const data = {
      id: whiteboardId || 'export',
      name: currentWhiteboard?.name || 'Whiteboard Export',
      nodes,
      edges,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiteboard-${data.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [whiteboardId, currentWhiteboard, nodes, edges]);

  const nodeTypes = { editable: EditableNode };

  if (isLoading) {
    return <LoadingSpinner message="Carregando whiteboard..." />;
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-gray-50">
      {/* Toolbar lateral */}
      <ToolbarUnified 
        onAddElement={addElementToBoard}
        collaborators={collaborators}
        projects={projects}
        teams={teams}
      />
      
      {/* Área principal do whiteboard */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="button"
              >
                <ArrowLeft size={18} /> Voltar
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800">
              {currentWhiteboard?.name || 'Whiteboard Demo'}
            </h1>
            {hasChanges && (
              <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Não salvo
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {nodesWithCallbacks.length} elementos
            </span>
            
            {whiteboardId && (
              <button
                onClick={saveWhiteboard}
                disabled={!hasChanges}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={16} />
                Salvar
              </button>
            )}
            
            <button
              onClick={exportWhiteboard}
              className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>
        
        {/* ReactFlow Area */}
        <div className="flex-1 overflow-hidden">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodesWithCallbacks}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              nodeTypes={nodeTypes}
              className="w-full h-full"
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            >
              <Background 
                gap={20} 
                size={1} 
                color="#e5e7eb"
              />
              <MiniMap 
                nodeColor={() => '#3b82f6'} 
                maskColor="rgba(59,130,246,0.1)" 
                className="bg-white border rounded-lg shadow-sm"
                pannable
                zoomable
              />
              <Controls 
                className="bg-white border rounded-lg shadow-sm"
                showZoom={true}
                showFitView={true}
                showInteractive={true}
              />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
