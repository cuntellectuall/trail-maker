import React, { useState } from 'react';
import { FolderLock, FolderPlus, Trash2, Calendar, FileText, Check } from 'lucide-react';

interface ArchiveProjectsProps {
  projects: {
    id: string;
    name: string;
    createdAt: string;
    decisions: any[];
  }[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
}

export default function ArchiveProjects({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject
}: ArchiveProjectsProps) {
  const [newProjName, setNewProjName] = useState('');

  const handleCreate = () => {
    if (!newProjName.trim()) return;
    onCreateProject(newProjName.trim());
    setNewProjName('');
  };

  return (
    <div className="flex-1 relative overflow-y-auto bg-[#030712] p-6 md:p-8 space-y-6" id="archive-projects-panel">
      {/* Header */}
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight uppercase">
          Arquivo Geral de Projetos
        </h1>
        <p className="text-violet-400 italic text-sm mt-1">
          Histórico e gerenciamento de arquivos criativos e logs especulativos independentes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Initiate new tracker */}
        <div className="bg-[#0b1220]/60 p-6 rounded border border-white/5 h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <FolderPlus className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-black text-violet-300 uppercase tracking-widest">
              Iniciar Novo Rastro de Projeto
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
            Ative um novo monitor operacional isolado. Ele registrará as árvores de decisões críticas da nova campanha futuras de design.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={newProjName}
              onChange={(e) => setNewProjName(e.target.value)}
              placeholder="Ex: Branding Especulativo — Vazio Zero"
              className="w-full bg-slate-900 border border-white/5 p-3 rounded-none text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 uppercase tracking-tight"
            />

            <button
              onClick={handleCreate}
              disabled={!newProjName.trim()}
              className="w-full bg-violet-600 disabled:bg-slate-800 text-white hover:bg-violet-500 py-2.5 text-xs font-bold uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ativar Registro</span>
            </button>
          </div>
        </div>

        {/* Right Listings: Folders list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
            Arquivos de Processo Concluídos / Ativos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  className={`p-5 bg-slate-900/60 rounded border transition-all flex flex-col justify-between ${
                    isActive ? 'border-violet-500 bg-violet-950/5 shadow-inner' : 'border-white/5 hover:border-violet-500/20'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-slate-950 rounded border border-white/5">
                        <FolderLock className={`w-5 h-5 ${isActive ? 'text-violet-400 animate-pulse' : 'text-slate-500'}`} />
                      </div>

                      {isActive && (
                        <span className="px-2 py-0.5 bg-violet-600/10 border border-violet-500/35 text-violet-400 text-[8px] font-black uppercase tracking-widest rounded">
                          ATIVO NO CANVASS
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider line-clamp-1 mb-1">
                      {proj.name}
                    </h4>

                    <div className="space-y-1.5 text-[9.5px] font-mono text-slate-500 mt-3 border-t border-white/5 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        <span>Início: {new Date(proj.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-600" />
                        <span>Nós de Rastro Catalogados: {proj.decisions.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5 pt-3 border-t border-white/5">
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="flex-1 bg-slate-950 hover:bg-slate-800 text-slate-300 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-white/5 flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Check className="w-3.5 h-3.5 text-violet-400" />
                      <span>Montar</span>
                    </button>
                    
                    <button
                      disabled={projects.length <= 1}
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 disabled:text-slate-700 disabled:bg-transparent rounded hover:border-rose-500/10 border border-transparent cursor-pointer flex items-center justify-center gap-1 transition-all"
                      title="Deletar Projeto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
