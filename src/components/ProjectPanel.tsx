import React, { useState } from "react";
import Select from "react-select";
import { useWorkspace } from "../state/WorkspaceContext";
import type { Collaborator } from "../state/WorkspaceContext";

export default function ProjectPanel() {
  const { projetos, setProjetos, colaboradores, setColaboradores } = useWorkspace();
  const [nome, setNome] = useState("");
  const [link, setLink] = useState("");
  const [colaboradoresSelecionados, setColaboradoresSelecionados] = useState<string[]>([]);

  function handleAddProjeto(e: React.FormEvent) {
    e.preventDefault();
    const novoId = Date.now().toString();
    const novoProjeto = {
      id: novoId,
      nome,
      link,
      colaboradores: colaboradoresSelecionados,
    };
    setProjetos([...projetos, novoProjeto]);
    // Atualiza os colaboradores para incluir o projeto (bidirecional)
    const colaboradoresAtualizados = colaboradores.map(c => {
      if (colaboradoresSelecionados.includes(c.id)) {
        // Adiciona o projeto ao colaborador, evitando duplicidade
        const projetosAtualizados = c.projetos ? Array.from(new Set([...c.projetos, novoId])) : [novoId];
        return { ...c, projetos: projetosAtualizados };
      } else {
        // Remove o projeto se não estiver mais selecionado (opcional, para edição futura)
        return { ...c };
      }
    });
    setColaboradores(colaboradoresAtualizados);
    setNome("");
    setLink("");
    setColaboradoresSelecionados([]);
  }

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:space-x-10 gap-8">
        {/* Formulário moderno */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8 lg:mb-0 border border-blue-100">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-blue-700 border-b-2 border-blue-100 pb-3 tracking-tight flex items-center gap-2">
            <span>Adicionar Projeto</span>
            <span className="text-blue-400 text-lg">📁</span>
          </h2>
          <form onSubmit={handleAddProjeto} className="space-y-4">
            <input
              className="border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-base transition"
              placeholder="Nome do projeto"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
            <input
              className="border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-base transition"
              placeholder="Link da pasta"
              value={link}
              onChange={e => setLink(e.target.value)}
              required
            />
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Colaboradores</label>
              <Select
                isMulti
                options={colaboradores.map(c => ({ value: c.id, label: c.nome }))}
                value={colaboradores.filter(c => colaboradoresSelecionados.includes(c.id)).map(c => ({ value: c.id, label: c.nome }))}
                onChange={selected => setColaboradoresSelecionados(selected ? selected.map((s: any) => s.value) : [])}
                classNamePrefix="react-select"
                placeholder="Selecione colaboradores..."
                styles={{
                  control: (base) => ({ ...base, minHeight: '44px', borderColor: '#bfdbfe', boxShadow: 'none' }),
                  multiValue: (base) => ({ ...base, backgroundColor: '#dbeafe', color: '#1e40af' }),
                  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#dbeafe' : undefined, color: state.isSelected ? 'white' : '#1e40af' }),
                }}
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg w-full font-bold shadow hover:from-blue-700 hover:to-blue-600 transition flex items-center justify-center gap-2">
              <span>➕ Adicionar</span>
            </button>
          </form>
        </div>
        {/* Lista de projetos moderna */}
        <div className="w-full lg:w-2/3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight mb-6 flex items-center gap-2">
            <span>Projetos</span>
            <span className="text-blue-400 text-lg">🗂️</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projetos.map(p => (
              <div key={p.id} className="bg-white border border-blue-100 rounded-2xl shadow p-5 flex flex-col gap-2 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 border-2 border-blue-300">
                    {p.nome?.slice(0,2).toUpperCase() || 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-blue-800 text-lg leading-tight">{p.nome}</div>
                    <div className="text-gray-500 text-xs break-all">
                      <a href={p.link} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">{p.link}</a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 text-xs mb-1 mt-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">Colaboradores: <b>{p.colaboradores.map(id => colaboradores.find(c => c.id === id)?.nome).filter(Boolean).join(", ") || "-"}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
