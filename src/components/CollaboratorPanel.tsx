
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import {
  Person24Regular,
  PeopleTeam24Regular,
  Add24Regular,
  Save24Regular,
  Edit24Regular,
  Delete24Regular,
  Table24Regular,
  Grid24Regular
} from "@fluentui/react-icons";
import { useWorkspace } from "../state/WorkspaceContext";
import type { Collaborator } from "../state/WorkspaceContext";




const CollaboratorPanel: React.FC = () => {
  const { colaboradores, setColaboradores, projetos, setProjetos } = useWorkspace();
  const [viewMode, setViewMode] = useState<'galeria' | 'lista'>('galeria');
  const [projetosSelecionados, setProjetosSelecionados] = useState<string[]>([]);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [superior, setSuperior] = useState("");
  const [subordinados, setSubordinados] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  function handleAddColaborador(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      // Edição de colaborador existente
      const atualizados = colaboradores.map((c: Collaborator) => {
        if (c.id !== editId) {
          // Atualiza referências caso este colaborador seja superior/subordinado do editado
          let novoSubordinados = c.subordinados.filter((id: string) => id !== editId);
          if (superior === c.id) novoSubordinados = [...novoSubordinados, editId];
          let novoSuperior = c.superior === editId ? undefined : c.superior;
          if (subordinados.includes(c.id)) novoSuperior = editId;
          return {
            ...c,
            subordinados: novoSubordinados,
            superior: novoSuperior,
            projetos: c.projetos || [],
          };
        } else {
          // Atualiza o próprio colaborador
          return {
            ...c,
            nome,
            cargo,
            superior: superior || undefined,
            subordinados,
            projetos: projetosSelecionados,
          };
        }
      });
      setColaboradores(atualizados);
      // Atualiza projetos
      setProjetos(projetos.map((p: any) =>
        projetosSelecionados.includes(p.id)
          ? { ...p, colaboradores: Array.from(new Set([...(p.colaboradores || []).filter((cid: string) => cid !== editId), editId])) }
          : { ...p, colaboradores: (p.colaboradores || []).filter((cid: string) => cid !== editId) }
      ));
      setEditId(null);
    } else {
      // Adição de novo colaborador
      const novoId = Date.now().toString();
      const novo: Collaborator = {
        id: novoId,
        nome,
        cargo,
        superior: superior || undefined,
        subordinados,
        projetos: projetosSelecionados,
      };
      let atualizados = colaboradores.map((c: Collaborator) => {
        if (c.id === superior) {
          return { ...c, subordinados: [...(c.subordinados || []), novoId] };
        }
        if (subordinados.includes(c.id)) {
          return { ...c, superior: novoId };
        }
        return { ...c, subordinados: (c.subordinados || []).filter((id: string) => id !== novoId) };
      });
      atualizados = [...atualizados, { ...novo, projetos: projetosSelecionados }];
      setColaboradores(atualizados);
      const projetosAtualizados = projetos.map((p: any) =>
        projetosSelecionados.includes(p.id)
          ? { ...p, colaboradores: [...(p.colaboradores || []), novoId] }
          : p
      );
      setProjetos(projetosAtualizados);
    }
    setNome("");
    setCargo("");
    setSuperior("");
    setSubordinados([]);
    setProjetosSelecionados([]);
    setEditId(null);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-blue-100">
        {/* Coluna esquerda: Formulário */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-extrabold mb-6 text-blue-700 border-b-2 border-blue-100 pb-3 tracking-tight flex items-center gap-2 justify-center">
              <span>Adicionar Colaborador</span>
              <Person24Regular className="text-blue-400" />
            </h2>
            <form onSubmit={handleAddColaborador} className="space-y-4">
              <input
                className="border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-base transition"
                placeholder="Nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
              <input
                className="border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-base transition"
                placeholder="Cargo"
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                required
              />
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Superior</label>
                <select
                  className="border border-blue-200 rounded-lg p-2 w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={superior}
                  onChange={e => setSuperior(e.target.value)}
                >
                  <option value="">Sem superior</option>
                  {colaboradores.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Subordinados</label>
                <Select
                  isMulti
                  options={colaboradores.map(c => ({ value: c.id, label: c.nome }))}
                  value={colaboradores.filter(c => subordinados.includes(c.id)).map(c => ({ value: c.id, label: c.nome }))}
                  onChange={selected => setSubordinados(selected ? selected.map((s: any) => s.value) : [])}
                  classNamePrefix="react-select"
                  placeholder="Selecione subordinados..."
                  styles={{
                    control: (base) => ({ ...base, minHeight: '44px', borderColor: '#bfdbfe', boxShadow: 'none' }),
                    multiValue: (base) => ({ ...base, backgroundColor: '#dbeafe', color: '#1e40af' }),
                    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#dbeafe' : undefined, color: state.isSelected ? 'white' : '#1e40af' }),
                  }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Projetos</label>
                <Select
                  isMulti
                  name="projetos"
                  classNamePrefix="react-select"
                  placeholder="Selecione projetos..."
                  options={projetos.map(p => ({ value: p.id, label: p.nome }))}
                  value={projetos
                    .filter(p => projetosSelecionados.includes(p.id))
                    .map(p => ({ value: p.id, label: p.nome }))}
                  onChange={opts => setProjetosSelecionados(Array.isArray(opts) ? opts.map(o => o.value) : [])}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#bfdbfe',
                      minHeight: '44px',
                      boxShadow: 'none',
                      '&:hover': { borderColor: '#60a5fa' }
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#1e40af',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#dbeafe' : undefined,
                      color: state.isSelected ? 'white' : '#1e293b',
                    })
                  }}
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg w-full font-bold shadow hover:from-blue-700 hover:to-blue-600 transition flex items-center justify-center gap-2">
                {editId ? (
                  <>
                    <Save24Regular className="w-5 h-5" /> Salvar
                  </>
                ) : (
                  <>
                    <Add24Regular className="w-5 h-5" /> Adicionar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        {/* Coluna direita: Header + Listagem */}
        <div className="flex flex-col w-full">
          {/* Header da seção */}
          <div className="flex items-center justify-between mb-8 w-full border-b border-blue-100 pb-3">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Colaboradores</h3>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition text-sm ${viewMode === 'galeria' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
                onClick={() => setViewMode('galeria')}
                type="button"
              >
                <Grid24Regular className="mr-1 w-5 h-5 inline" /> Galeria
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition text-sm ${viewMode === 'lista' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
                onClick={() => setViewMode('lista')}
                type="button"
              >
                <Table24Regular className="mr-1 w-5 h-5 inline" /> Lista
              </button>
            </div>
          </div>
          {/* Listagem de colaboradores */}
          <div className="flex-1 flex flex-col justify-center">
            {colaboradores.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400 gap-4">
                <PeopleTeam24Regular className="w-16 h-16" />
                <span className="text-lg">Nenhum colaborador cadastrado ainda.</span>
              </div>
            ) : viewMode === 'galeria' ? (
              <CollaboratorCardsGallery 
                colaboradores={colaboradores} 
                projetos={projetos}
                setEditId={setEditId}
                setNome={setNome}
                setCargo={setCargo}
                setSuperior={setSuperior}
                setSubordinados={setSubordinados}
                setProjetosSelecionados={setProjetosSelecionados}
                setColaboradores={setColaboradores}
                setProjetos={setProjetos}
              />
            ) : (
              <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border border-blue-100">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-blue-50 text-blue-800">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Nome</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Cargo</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Superior</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Subordinados</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Projetos</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colaboradores.map((c: Collaborator) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-blue-50 transition">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-blue-700">{c.nome}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">{c.cargo}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">{colaboradores.find((s: Collaborator) => s.id === c.superior)?.nome || "-"}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">{c.subordinados.map((id: string) => colaboradores.find((s: Collaborator) => s.id === id)?.nome).filter(Boolean).join(", ") || "-"}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">{c.projetos?.map((pid: string) => projetos.find((p: { id: string; nome: string }) => p.id === pid)?.nome).filter(Boolean).join(", ") || "-"}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow">
                              <Edit24Regular className="w-4 h-4" /> Editar
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow"
                              onClick={() => {
                                setColaboradores((colaboradores: Collaborator[]) =>
                                  colaboradores
                                    .filter((col: Collaborator) => col.id !== c.id)
                                    .map((col: Collaborator) => ({
                                      ...col,
                                      subordinados: col.subordinados.filter((id: string) => id !== c.id),
                                      superior: col.superior === c.id ? undefined : col.superior,
                                      projetos: col.projetos?.filter((pid: string) => true)
                                    }))
                                );
                                setProjetos((projetos: any[]) => projetos.map((p: any) => ({
                                  ...p,
                                  colaboradores: p.colaboradores.filter((cid: string) => cid !== c.id)
                                })));
                              }}
                            >
                              <Delete24Regular className="w-4 h-4" /> Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default CollaboratorPanel;

// Props para a galeria de cards
type CollaboratorCardsGalleryProps = {
  colaboradores: Collaborator[];
  projetos: { id: string; nome: string }[];
  setEditId: (id: string | null) => void;
  setNome: (nome: string) => void;
  setCargo: (cargo: string) => void;
  setSuperior: (id: string) => void;
  setSubordinados: (ids: string[]) => void;
  setProjetosSelecionados: (ids: string[]) => void;
  setColaboradores: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  setProjetos: React.Dispatch<React.SetStateAction<any[]>>;
};

const CollaboratorCardsGallery: React.FC<CollaboratorCardsGalleryProps> = ({
  colaboradores,
  projetos,
  setEditId,
  setNome,
  setCargo,
  setSuperior,
  setSubordinados,
  setProjetosSelecionados,
  setColaboradores,
  setProjetos,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpandedId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <ul ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {colaboradores.map((c: Collaborator) => {
        const expanded = expandedId === c.id;
        return (
          <li
            key={c.id}
            className={`bg-white rounded-xl shadow p-5 flex flex-col gap-2 border hover:shadow-xl transition relative group cursor-pointer ${expanded ? 'ring-2 ring-blue-400 scale-[1.03] z-10' : ''}`}
            onClick={() => setExpandedId(expanded ? null : c.id)}
            style={{ transition: 'all 0.2s cubic-bezier(.4,2,.6,1)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 border-2 border-blue-300">
                {c.nome?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-blue-800 text-lg leading-tight">{c.nome}</div>
                <div className="text-gray-500 text-sm">{c.cargo}</div>
              </div>
              <span className={`ml-2 transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="flex flex-wrap gap-1 text-xs mb-1 mt-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">Superior: <b>{colaboradores.find((s: Collaborator) => s.id === c.superior)?.nome || '-'}</b></span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">Subordinados: <b>{c.subordinados.map((id: string) => colaboradores.find((s: Collaborator) => s.id === id)?.nome).filter(Boolean).join(", ") || '-'}</b></span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {c.projetos?.length ? c.projetos.map((pid: string) => {
                  const nomeProjeto = projetos.find((p: { id: string; nome: string }) => p.id === pid)?.nome;
                  return nomeProjeto ? (
                    <span key={pid} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">{nomeProjeto}</span>
                  ) : null;
                }) : <span className="text-gray-400 text-xs">Sem projetos</span>}
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs transition"
                  onClick={e => {
                    e.stopPropagation();
                    setEditId(c.id);
                    setNome(c.nome);
                    setCargo(c.cargo);
                    setSuperior(c.superior || "");
                    setSubordinados(c.subordinados || []);
                    setProjetosSelecionados(c.projetos || []);
                  }}
                >Editar</button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition"
                  onClick={e => {
                    e.stopPropagation();
                    setColaboradores((colaboradores: Collaborator[]) =>
                      colaboradores
                        .filter((col: Collaborator) => col.id !== c.id)
                        .map((col: Collaborator) => ({
                          ...col,
                          subordinados: col.subordinados.filter((id: string) => id !== c.id),
                          superior: col.superior === c.id ? undefined : col.superior,
                          projetos: col.projetos?.filter((pid: string) => true)
                        }))
                    );
                    setProjetos((projetos: any[]) => projetos.map((p: any) => ({
                      ...p,
                      colaboradores: p.colaboradores.filter((cid: string) => cid !== c.id)
                    })));
                  }}
                >Deletar</button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};