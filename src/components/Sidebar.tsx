import React from 'react';
import {
  LayoutGrid,
  Activity,
  Workflow,
  AlertTriangle,
  History,
  Shield,
  FolderLock,
  Bell,
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentView: 'canvas' | 'cartografia' | 'agency' | 'interventions' | 'archive' | 'notifications' | 'settings';
  onChangeView: (view: 'canvas' | 'cartografia' | 'agency' | 'interventions' | 'archive' | 'notifications' | 'settings') => void;
  systemIntegrity: number;
  protectionMode: boolean;
  onToggleProtectionMode: () => void;
}

export default function Sidebar({
  currentView,
  onChangeView,
  systemIntegrity,
  protectionMode,
  onToggleProtectionMode
}: SidebarProps) {
  return (
    <aside className="w-full md:w-72 bg-[#070e1d] border-r border-white/5 flex flex-col justify-between py-6 h-full z-10" id="sidebar-spec">
      <div>
        {/* System Integrity Spec Display */}
        <div className="px-6 mb-8 mt-2">
          <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] block">
            STATUS DO SISTEMA
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse inline-block"></span>
            <span className="text-xs font-bold font-sans text-slate-200">
              Inteligência Operacional
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
            Integridade: {systemIntegrity}%
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <button
            onClick={() => onChangeView('canvas')}
            className={`w-full flex items-center gap-4 py-3.5 px-6 border-l-4 text-left transition-all cursor-pointer ${
              currentView === 'canvas'
                ? 'text-white bg-violet-600/10 border-violet-500 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold font-sans">
              Canvas de Decisão
            </span>
          </button>

          <button
            onClick={() => onChangeView('agency')}
            className={`w-full flex items-center gap-4 py-3.5 px-6 border-l-4 text-left transition-all cursor-pointer ${
              currentView === 'agency'
                ? 'text-white bg-violet-600/10 border-violet-500 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold font-sans">
              Nós de Agência
            </span>
          </button>

          <button
            onClick={() => onChangeView('interventions')}
            className={`w-full flex items-center gap-4 py-3.5 px-6 border-l-4 text-left transition-all cursor-pointer ${
              currentView === 'interventions'
                ? 'text-white bg-violet-600/10 border-violet-500 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold font-sans">
              Intervenções
            </span>
          </button>

          <button
            onClick={() => onChangeView('archive')}
            className={`w-full flex items-center gap-4 py-3.5 px-6 border-l-4 text-left transition-all cursor-pointer ${
              currentView === 'archive'
                ? 'text-white bg-violet-600/10 border-violet-500 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <FolderLock className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold font-sans">
              Arquivo
            </span>
          </button>

          <button
            onClick={() => onChangeView('notifications')}
            className={`w-full flex items-center gap-4 py-3.5 px-6 border-l-4 text-left transition-all cursor-pointer ${
              currentView === 'notifications'
                ? 'text-white bg-violet-600/10 border-violet-500 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold font-sans">
              Notificações
            </span>
          </button>

          <button
            onClick={() => onChangeView('settings')}
            className={`w-full flex items-center gap-4 py-3.5 px-6 border-l-4 text-left transition-all cursor-pointer ${
              currentView === 'settings'
                ? 'text-white bg-[#ec4899]/15 border-[#ec4899] font-semibold'
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold font-sans">
              Configurações
            </span>
          </button>
        </nav>
      </div>

      {/* Persistent Manual Override button in beautiful solid purple */}
      <div className="px-6 pb-2">
        <button
          onClick={onToggleProtectionMode}
          className="w-full py-3 rounded bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] border border-pink-400/20 text-white font-bold font-sans text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:opacity-90 hover:scale-[1.02] active:translate-y-0.5"
          id="btn-manual-override"
        >
          <Shield className="w-3.5 h-3.5" />
          Controle Manual
        </button>
      </div>
    </aside>
  );
}
