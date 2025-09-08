import React, { useState, useCallback } from "react";
import { Toolbar } from "./Toolbar";
import { Topbar } from "./Topbar";
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, addEdge, Connection, ReactFlowInstance, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from "reactflow";
import EditableNode from "./EditableNode";
import "reactflow/dist/style.css";

export default function Whiteboard() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [projectName, setProjectName] = useState("Meu Whiteboard");
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // ...as funções handleAddElement e onDrop já estão implementadas abaixo com suporte à edição de rótulo...

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback((params: Edge | Connection) => setEdges(eds => addEdge(params, eds)), []);
  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes(nodes => applyNodeChanges(changes, nodes)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges(edges => applyEdgeChanges(changes, edges)), []);

  // Função para atualizar o label do node
  const handleLabelChange = useCallback((id: string, newLabel: string) => {
    setNodes(nodes => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label: newLabel, onLabelChange: (l: string) => handleLabelChange(id, l), onDuplicate: () => handleDuplicateNode(id), onDelete: () => handleDeleteNode(id), onResize: (w: number, h: number) => handleResizeNode(id, w, h), onFormatChange: (field: string, value: any) => handleFormatChange(id, field, value) } } : n));
  }, []);
  // Função para atualizar formatação visual do node
  const handleFormatChange = useCallback((id: string, field: string, value: any) => {
    setNodes(nodes => nodes.map(n => n.id === id ? {
      ...n,
      data: {
        ...n.data,
        [field]: value,
        onLabelChange: (l: string) => handleLabelChange(id, l),
        onDuplicate: () => handleDuplicateNode(id),
        onDelete: () => handleDeleteNode(id),
        onResize: (w: number, h: number) => handleResizeNode(id, w, h),
        onFormatChange: (f: string, v: any) => handleFormatChange(id, f, v)
      }
    } : n));
  }, []);

  // Função para redimensionar node
  const handleResizeNode = useCallback((id: string, width: number, height: number) => {
    setNodes(nodes => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, width, height, onLabelChange: (l: string) => handleLabelChange(id, l), onDuplicate: () => handleDuplicateNode(id), onDelete: () => handleDeleteNode(id), onResize: (w: number, h: number) => handleResizeNode(id, w, h) } } : n));
  }, []);

  // Função para duplicar nó
  const handleDuplicateNode = useCallback((id: string) => {
    setNodes(nodes => {
      const node = nodes.find(n => n.id === id);
      if (!node) return nodes;
      const newId = Date.now().toString();
      const offset = 40;
      return [
        ...nodes,
        {
          ...node,
          id: newId,
          position: { x: node.position.x + offset, y: node.position.y + offset },
          data: {
            ...node.data,
            label: node.data.label + " (Cópia)",
            onLabelChange: (label: string) => handleLabelChange(newId, label),
            onDuplicate: () => handleDuplicateNode(newId),
            onDelete: () => handleDeleteNode(newId)
          }
        }
      ];
    });
  }, [handleLabelChange]);

  // Função para deletar nó
  const handleDeleteNode = useCallback((id: string) => {
    setNodes(nodes => nodes.filter(n => n.id !== id));
    setEdges(edges => edges.filter(e => e.source !== id && e.target !== id));
  }, []);

  // Adiciona onLabelChange, onDuplicate, onDelete, onResize e onFormatChange ao criar node
  function addNodeWithEditableLabel(node: Node) {
    setNodes(nodes => [
      ...nodes,
      {
        ...node,
        data: {
          ...node.data,
          onLabelChange: (label: string) => handleLabelChange(node.id, label),
          onDuplicate: () => handleDuplicateNode(node.id),
          onDelete: () => handleDeleteNode(node.id),
          onResize: (w: number, h: number) => handleResizeNode(node.id, w, h),
          onFormatChange: (field: string, value: any) => handleFormatChange(node.id, field, value)
        }
      }
    ]);
  }

  function handleAddElement(type: string) {
    const id = Date.now().toString();
    addNodeWithEditableLabel({
      id,
      type: "editable",
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
    });
  }

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!reactFlowInstance) return;
    const type = event.dataTransfer.getData('element-type');
    if (!type) return;
    const bounds = (event.target as HTMLDivElement).getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
    const id = Date.now().toString();
    addNodeWithEditableLabel({
      id,
      type: "editable",
      position,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
    });
  }, [reactFlowInstance, handleLabelChange]);

  const nodeTypes = { editable: EditableNode };

  return (
    <div className="app-container flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Topbar projectName={projectName} />
      <div className="flex flex-1 h-full w-full">
        <Toolbar onAddElement={handleAddElement} />
        <main className="whiteboard-area flex-1 flex flex-col pt-14 relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full h-[calc(100vh-4rem)] bg-white/90 rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
                className="rounded-3xl"
                nodeTypes={nodeTypes}
              >
                <Background gap={24} size={1.5} color="#c7d2fe" />
                <MiniMap nodeColor={() => '#2563eb'} maskColor="rgba(59,130,246,0.08)" />
                <Controls style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 12, boxShadow: '0 2px 8px #0001' }} />
              </ReactFlow>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
