import { useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface WhiteboardData {
  nodes: Node[];
  edges: Edge[];
}

export function useWhiteboardPersistence() {
  const saveWhiteboard = useCallback(async (id: string, data: WhiteboardData) => {
    try {
      localStorage.setItem(`whiteboard-${id}`, JSON.stringify(data));
      console.log(`Whiteboard ${id} salvo com sucesso`);
    } catch (error) {
      console.error('Erro ao salvar whiteboard:', error);
      throw error;
    }
  }, []);

  const loadWhiteboard = useCallback(async (id: string): Promise<WhiteboardData | null> => {
    try {
      const saved = localStorage.getItem(`whiteboard-${id}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Erro ao carregar whiteboard:', error);
      return null;
    }
  }, []);

  const exportWhiteboard = useCallback(async (id: string, data: WhiteboardData) => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `whiteboard-${id}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Erro ao exportar whiteboard:', error);
      throw error;
    }
  }, []);

  return {
    saveWhiteboard,
    loadWhiteboard,
    exportWhiteboard
  };
}
