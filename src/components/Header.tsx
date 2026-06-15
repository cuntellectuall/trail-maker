import React from 'react';
import { Bell, Settings, Plus, FolderOpen, Activity, Sparkles } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  projects: { id: string; name: string }[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onTriggerNewDecision: () => void;
  systemIntegrity: number;
  currentView: 'canvas' | 'cartografia' | 'agency' | 'interventions' | 'archive' | 'notifications' | 'settings';
  onChangeView: (view: 'canvas' | 'cartografia' | 'agency' | 'interventions' | 'archive' | 'notifications' | 'settings') => void;
}

export default function Header({
  projects,
  activeProjectId,
  onSelectProject,
  onTriggerNewDecision,
  systemIntegrity,
  currentView,
  onChangeView
}: HeaderProps) {
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 h-auto md:h-20 py-4 md:py-0 w-full z-50 border-b border-white/10 bg-[#0c1322]/85 backdrop-blur-md sticky top-0" id="header-spec">
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center drop-shadow-[0_0_10px_rgba(236,72,153,0.45)]">
            <Logo className="w-8 h-8" />
          </div>
          <span className="font-sans text-xl font-black bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] bg-clip-text text-transparent tracking-tighter lowercase">
            trail maker
          </span>
        </div>

        {/* Project Selector Mini Screen */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded border border-white/5 ml-4">
          <FolderOpen className="w-3.5 h-3.5 text-violet-400" />
          <select
            value={activeProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-medium border-none outline-none focus:ring-0 pr-6 uppercase tracking-wider cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-950 text-slate-200 uppercase font-mono">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Stats and Actions */}
      <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-0 w-full md:w-auto justify-end">
        {/* PrimarySpeculative Button */}
        <button
          onClick={onTriggerNewDecision}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 border border-violet-400/30 text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(124,58,237,0.35)] active:translate-y-0.5 whitespace-nowrap cursor-pointer"
          id="btn-register-decision"
        >
          <Plus className="w-3.5 h-3.5" />
          Registrar crítica
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <button 
            type="button"
            onClick={() => onChangeView('notifications')}
            className={`p-2.5 rounded-full hover:bg-white/5 transition-all relative cursor-pointer ${
              currentView === 'notifications' ? 'text-[#ec4899] bg-[#ec4899]/10' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Notificações de Integridade"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></span>
          </button>
          <button 
            type="button"
            onClick={() => onChangeView('settings')}
            className={`p-2.5 rounded-full hover:bg-white/5 transition-all cursor-pointer ${
              currentView === 'settings' ? 'text-[#ec4899] bg-[#ec4899]/10' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Configurações do Sistema"
          >
            <Settings className="w-4 h-4" />
          </button>
          <div className="h-9 w-9 rounded-full overflow-hidden border border-violet-500/50 ring-2 ring-violet-950 ml-2 shadow-[0_0_10px_rgba(124,58,237,0.25)]">
            <div className="w-full h-full bg-slate-800 flex items-center justify-center font-bold text-xs text-violet-300">
              DG
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
