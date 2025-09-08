import React, { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Copy24Regular, Delete24Regular, PaintBrush24Regular, Star24Regular, Note24Regular, Image24Regular } from "@fluentui/react-icons";

// Tipagem centralizada para os dados do card
export type CardFormat = {
  color: string;
  border: string;
  icon: string;
  font: string;
  width: number;
  height: number;
};

// Paletas e opções centralizadas
const COLORS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Roxo', value: '#a21caf' },
  { name: 'Cinza', value: '#64748b' },
  { name: 'Branco', value: '#fff' },
];
const BORDERS = [
  { name: 'Normal', value: '2px solid #cbd5e1' },
  { name: 'Grossa', value: '4px solid #3b82f6' },
  { name: 'Tracejada', value: '2px dashed #64748b' },
  { name: 'Nenhuma', value: 'none' },
];
const ICONS = [
  { name: 'Estrela', value: 'star', icon: <Star24Regular className="w-5 h-5" /> },
  { name: 'Nota', value: 'note', icon: <Note24Regular className="w-5 h-5" /> },
  { name: 'Imagem', value: 'image', icon: <Image24Regular className="w-5 h-5" /> },
  { name: 'Nenhum', value: '', icon: null },
];
const FONTS = [
  { name: 'Padrão', value: 'font-sans' },
  { name: 'Serif', value: 'font-serif' },
  { name: 'Mono', value: 'font-mono' },
];

export default function EditableNode({ id, data, selected, isConnectable }: NodeProps) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || "");
  const [showFormat, setShowFormat] = useState(false);
  function handleFormatChange(field: keyof CardFormat, value: any) {
    if (data.onFormatChange) data.onFormatChange(field, value);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const resizing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setLabel(data.label || "");
  }, [data.label]);


  function handleLabelClick(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(true);
  }

  function handleInputBlur() {
    setEditing(false);
    if (label !== data.label && data.onLabelChange) {
      data.onLabelChange(label);
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      setEditing(false);
      if (label !== data.label && data.onLabelChange) {
        data.onLabelChange(label);
      }
    }
  }

  // Resize handlers
  function onResizeMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    resizing.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', onResizeMouseMove);
    document.addEventListener('mouseup', onResizeMouseUp);
  }

  function onResizeMouseMove(e: MouseEvent) {
    if (!resizing.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    const newWidth = Math.max(80, (data.width || 160) + dx);
    const newHeight = Math.max(40, (data.height || 56) + dy);
    if (data.onResize) data.onResize(newWidth, newHeight);
    if (data.onFormatChange) data.onFormatChange('width', newWidth);
    if (data.onFormatChange) data.onFormatChange('height', newHeight);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onResizeMouseUp() {
    resizing.current = false;
    document.removeEventListener('mousemove', onResizeMouseMove);
    document.removeEventListener('mouseup', onResizeMouseUp);
  }

  return (
    <div
      className={`rounded-xl shadow flex flex-col items-center justify-center cursor-pointer transition-all ${selected ? 'ring-2 ring-blue-400' : ''} ${data.font || 'font-sans'}`}
      style={{
        userSelect: 'none',
        position: 'relative',
        width: data.width || 160,
        height: data.height || 56,
        minWidth: 80,
        minHeight: 40,
        background: data.color || '#fff',
        border: data.border || '2px solid #cbd5e1',
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center w-full h-full gap-2 px-2 py-1">
        {/* Ícone customizável */}
  {data.icon === 'star' && <Star24Regular className="text-yellow-500 mr-1" />}
  {data.icon === 'note' && <Note24Regular className="text-blue-500 mr-1" />}
  {data.icon === 'image' && <Image24Regular className="text-pink-500 mr-1" />}
        {editing ? (
          <input
            ref={inputRef}
            className="border border-blue-300 rounded px-2 py-1 text-sm w-full outline-none"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span
            className="text-blue-900 font-semibold text-base w-full text-center truncate"
            onClick={handleLabelClick}
            title="Clique para editar"
            style={{ cursor: 'text' }}
          >
            {label || "Rótulo"}
          </span>
        )}
        {/* Botões de ação */}
        <div className="flex gap-1 ml-2">
          <button
            type="button"
            className="p-1 rounded hover:bg-blue-100 text-blue-700"
            title="Formatar"
            tabIndex={-1}
            onClick={e => { e.stopPropagation(); setShowFormat(f => !f); }}
          >
            <PaintBrush24Regular className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-blue-100 text-blue-700"
            title="Duplicar"
            tabIndex={-1}
            onClick={e => {
              e.stopPropagation();
              if (data.onDuplicate) data.onDuplicate();
            }}
          >
            <Copy24Regular className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-red-100 text-red-700"
            title="Excluir"
            tabIndex={-1}
            onClick={e => {
              e.stopPropagation();
              if (data.onDelete) data.onDelete();
            }}
          >
            <Delete24Regular className="w-5 h-5" />
          </button>
        </div>
      {/* Menu de formatação visual */}
      {showFormat && (
        <div className="absolute top-10 right-0 z-50 bg-white border border-blue-200 rounded-xl shadow-lg p-3 flex flex-col gap-2 min-w-[180px]">
          <div>
            <span className="block text-xs font-bold text-blue-700 mb-1">Cor</span>
            <div className="flex gap-1 flex-wrap">
              {COLORS.map(c => (
                <button key={c.value} className="w-6 h-6 rounded-full border-2 border-white shadow" style={{ background: c.value, outline: (data.color || '#fff') === c.value ? '2px solid #2563eb' : 'none' }} onClick={() => handleFormatChange('color', c.value)} />
              ))}
            </div>
          </div>
          <div>
            <span className="block text-xs font-bold text-blue-700 mb-1 mt-2">Borda</span>
            <select className="w-full border rounded p-1 text-xs" value={data.border || '2px solid #cbd5e1'} onChange={e => handleFormatChange('border', e.target.value)}>
              {BORDERS.map(b => <option key={b.value} value={b.value}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <span className="block text-xs font-bold text-blue-700 mb-1 mt-2">Ícone</span>
            <div className="flex gap-1 flex-wrap">
              {ICONS.map(i => (
                <button key={i.value} className={`w-7 h-7 rounded flex items-center justify-center border ${(data.icon || '') === i.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => handleFormatChange('icon', i.value)}>{i.icon || <span className="text-xs">-</span>}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-xs font-bold text-blue-700 mb-1 mt-2">Fonte</span>
            <select className="w-full border rounded p-1 text-xs" value={data.font || 'font-sans'} onChange={e => handleFormatChange('font', e.target.value)}>
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
            </select>
          </div>
        </div>
      )}
      {/* Handle de resize (canto inferior direito) */}
      <div
        className="absolute right-1 bottom-1 w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded cursor-se-resize flex items-center justify-center z-10"
        style={{ userSelect: 'none' }}
        onMouseDown={onResizeMouseDown}
        title="Redimensionar"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}
