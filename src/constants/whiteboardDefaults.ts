import { Node, Edge } from 'reactflow';

export const INITIAL_NODES: Node[] = [
  { 
    id: '1', 
    data: { 
      label: 'Diretora RH',
      color: '#3b82f6',
      border: '2px solid #1e40af',
      width: 160,
      height: 56
    }, 
    position: { x: 100, y: 50 }, 
    type: 'editable' 
  },
  { 
    id: '2', 
    data: { 
      label: 'Equipe Alpha',
      color: '#22c55e',
      border: '2px solid #16a34a',
      width: 140,
      height: 50
    }, 
    position: { x: 50, y: 200 }, 
    type: 'editable' 
  },
  { 
    id: '3', 
    data: { 
      label: 'Equipe Beta',
      color: '#eab308',
      border: '2px solid #ca8a04',
      width: 140,
      height: 50
    }, 
    position: { x: 250, y: 200 }, 
    type: 'editable' 
  },
];

export const INITIAL_EDGES: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

export const NODE_CONFIGS: Record<string, any> = {
  collaborator: {
    color: '#22c55e',
    border: '2px solid #16a34a',
    icon: 'person',
    width: 180,
    height: 70
  },
  project: {
    color: '#a21caf',
    border: '2px solid #86198f',
    icon: 'folder',
    width: 170,
    height: 65
  },
  team: {
    color: '#f59e0b',
    border: '2px solid #d97706',
    icon: 'users',
    width: 160,
    height: 60
  },
  rectangle: {
    color: '#6366f1',
    border: '2px solid #4f46e5',
    width: 160,
    height: 56
  },
  circle: {
    color: '#ec4899',
    border: '2px solid #db2777',
    width: 80,
    height: 80,
    borderRadius: '50%'
  },
  note: {
    color: '#fbbf24',
    border: '2px solid #f59e0b',
    width: 200,
    height: 100
  },
  default: {
    color: '#ffffff',
    border: '2px solid #cbd5e1',
    width: 160,
    height: 56
  }
};
