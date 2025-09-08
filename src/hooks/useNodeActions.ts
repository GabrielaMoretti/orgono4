import { useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface UseNodeActionsProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export function useNodeActions({ setNodes, setEdges }: UseNodeActionsProps) {
  // Deletar node
  const deleteNode = useCallback((id: string) => {
    setNodes(nodes => nodes.filter(n => n.id !== id));
    setEdges(edges => edges.filter(e => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  // Atualizar label do node
  const updateNodeLabel = useCallback((id: string, newLabel: string) => {
    setNodes(nodes => nodes.map(n => n.id === id ? { 
      ...n, 
      data: { ...n.data, label: newLabel } 
    } : n));
  }, [setNodes]);

  // Atualizar subtítulo do node
  const updateNodeSubtitle = useCallback((id: string, newSubtitle: string) => {
    setNodes(nodes => nodes.map(n => n.id === id ? { 
      ...n, 
      data: { ...n.data, subtitle: newSubtitle } 
    } : n));
  }, [setNodes]);

  // Atualizar formatação do node
  const updateNodeFormat = useCallback((id: string, field: string, value: any) => {
    setNodes(nodes => nodes.map(n => n.id === id ? {
      ...n,
      data: { ...n.data, [field]: value }
    } : n));
  }, [setNodes]);

  // Redimensionar node
  const resizeNode = useCallback((id: string, width: number, height: number) => {
    setNodes(nodes => nodes.map(n => n.id === id ? { 
      ...n, 
      data: { ...n.data, width, height } 
    } : n));
  }, [setNodes]);

  // Duplicar node
  const duplicateNode = useCallback((id: string) => {
    setNodes(nodes => {
      const node = nodes.find(n => n.id === id);
      if (!node) return nodes;
      
      const newId = `${Date.now()}`;
      const offset = 40;
      
      const duplicatedNode: Node = {
        ...node,
        id: newId,
        position: { 
          x: node.position.x + offset, 
          y: node.position.y + offset 
        },
        data: {
          ...node.data,
          label: `${node.data.label} (Cópia)`,
          onLabelChange: (label: string) => updateNodeLabel(newId, label),
          onSubtitleChange: (subtitle: string) => updateNodeSubtitle(newId, subtitle),
          onFormatChange: (field: string, value: any) => updateNodeFormat(newId, field, value),
          onResize: (width: number, height: number) => resizeNode(newId, width, height),
          onDuplicate: () => duplicateNode(newId),
          onDelete: () => deleteNode(newId),
        }
      };
      
      return [...nodes, duplicatedNode];
    });
  }, [setNodes, updateNodeLabel, updateNodeSubtitle, updateNodeFormat, resizeNode, deleteNode]);

  // Criar node com callbacks
  const createNodeWithCallbacks = useCallback((node: Node) => {
    const nodeWithCallbacks: Node = {
      ...node,
      data: {
        ...node.data,
        onLabelChange: (label: string) => updateNodeLabel(node.id, label),
        onSubtitleChange: (subtitle: string) => updateNodeSubtitle(node.id, subtitle),
        onFormatChange: (field: string, value: any) => updateNodeFormat(node.id, field, value),
        onResize: (width: number, height: number) => resizeNode(node.id, width, height),
        onDuplicate: () => duplicateNode(node.id),
        onDelete: () => deleteNode(node.id),
      }
    };
    
    return nodeWithCallbacks;
  }, [updateNodeLabel, updateNodeSubtitle, updateNodeFormat, resizeNode, duplicateNode, deleteNode]);

  // Adicionar node ao whiteboard
  const addNode = useCallback((node: Node) => {
    const nodeWithCallbacks: Node = {
      ...node,
      data: {
        ...node.data,
        onLabelChange: (label: string) => updateNodeLabel(node.id, label),
        onSubtitleChange: (subtitle: string) => updateNodeSubtitle(node.id, subtitle),
        onFormatChange: (field: string, value: any) => updateNodeFormat(node.id, field, value),
        onResize: (width: number, height: number) => resizeNode(node.id, width, height),
        onDuplicate: () => duplicateNode(node.id),
        onDelete: () => deleteNode(node.id),
      }
    };
    setNodes(nodes => [...nodes, nodeWithCallbacks]);
  }, [setNodes, updateNodeLabel, updateNodeSubtitle, updateNodeFormat, resizeNode, duplicateNode, deleteNode]);

  // Inicializar callbacks para nodes existentes
  const initializeNodeCallbacks = useCallback((nodes: Node[]) => {
    return nodes.map(node => createNodeWithCallbacks(node));
  }, [createNodeWithCallbacks]);

  return {
    updateNodeLabel,
    updateNodeSubtitle,
    updateNodeFormat,
    resizeNode,
    duplicateNode,
    deleteNode,
    addNode,
    initializeNodeCallbacks,
    createNodeWithCallbacks
  };
}
